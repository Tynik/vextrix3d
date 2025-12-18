import { calculateSolidVolumeMm3, calculateSurfaceAreaMm2, load3dModel } from '~/utils';

export interface SlicerSettings {
  infill: number; // 0..1
  walls: number; // line count
  topLayers: number;
  bottomLayers: number;
  layerHeightMm: number;
  nozzleDiameterMm: number;
  supportDensity: number; // 0..1 (approx area fraction)
  supportFactor: number; // how dense supports are relative to infill (0.2..0.6)
  flowRate: number; // multiplier for extrusion (0.95..1.1)
  units: 'mm' | 'meter'; // geometry units if you want to override
}

export interface PriceSettings {
  materialDensityGcm3: number;
  materialPriceKg: number;
  basePrintTimeHrs: number;
  speedMm3PerSec: number;
  machineCostPerHour: number;
  min: number;
  fixedFee: number;
  markup: number; // 0..1
  quantity: number;
}

export interface PrintCostEstimate {
  solidVolumeMm3: number;
  surfaceAreaMm2: number;
  printedVolumeMm3: number;
  weightGr: number;
  printHours: number;
  materialCost: number;
  machineCost: number;
  total: number;
}

const DEFAULT_SLICER_SETTINGS: SlicerSettings = {
  infill: 0.15,
  walls: 2,
  topLayers: 5,
  bottomLayers: 5,
  layerHeightMm: 0.2,
  nozzleDiameterMm: 0.4,
  supportDensity: 0.1,
  supportFactor: 0.35,
  flowRate: 1.0,
  units: 'mm',
};

const DEFAULT_PRICE_SETTINGS: PriceSettings = {
  materialDensityGcm3: 1.24,
  materialPriceKg: 0,
  basePrintTimeHrs: 0.15,
  speedMm3PerSec: 12,
  machineCostPerHour: 0,
  min: 0,
  fixedFee: 0,
  markup: 0,
  quantity: 1,
};

const estimatePrintCostInternal = (
  solidVolumeMm3: number,
  surfaceAreaMm2: number,
  slicerSettings: Partial<SlicerSettings> = {},
  priceSettings: Partial<PriceSettings> = {},
): PrintCostEstimate => {
  const finalSlicerSettings: SlicerSettings = {
    ...DEFAULT_SLICER_SETTINGS,
    ...slicerSettings,
  };

  const finalPriceSettings: PriceSettings = {
    ...DEFAULT_PRICE_SETTINGS,
    ...priceSettings,
  };

  const topBottomThicknessMm =
    (finalSlicerSettings.topLayers + finalSlicerSettings.bottomLayers) *
    finalSlicerSettings.layerHeightMm;

  const wallThicknessMm = finalSlicerSettings.walls * finalSlicerSettings.nozzleDiameterMm;

  const shellVolumeMm3 = surfaceAreaMm2 * wallThicknessMm;

  const topBottomVolumeMm3 = surfaceAreaMm2 * topBottomThicknessMm;

  const interiorSolidVolumeMm3 = Math.max(0, solidVolumeMm3 - shellVolumeMm3 - topBottomVolumeMm3);
  const infillVolumeMm3 = interiorSolidVolumeMm3 * finalSlicerSettings.infill;

  const supportVolumeMm3 =
    solidVolumeMm3 * finalSlicerSettings.supportDensity * finalSlicerSettings.supportFactor;

  const printedNoFlowMm3 = shellVolumeMm3 + topBottomVolumeMm3 + infillVolumeMm3 + supportVolumeMm3;

  const printedVolumeMm3 = printedNoFlowMm3 * finalSlicerSettings.flowRate;

  const printedVolumeCm3 = printedVolumeMm3 / 1000;
  const weightGr = printedVolumeCm3 * finalPriceSettings.materialDensityGcm3;

  const printSeconds = printedVolumeMm3 / finalPriceSettings.speedMm3PerSec;
  const printHours = finalPriceSettings.basePrintTimeHrs + printSeconds / 3600;

  const materialCost = (weightGr / 1000) * finalPriceSettings.materialPriceKg;
  const machineCost = printHours * finalPriceSettings.machineCostPerHour;
  const raw = materialCost + machineCost + finalPriceSettings.fixedFee;
  const total =
    Math.max(finalPriceSettings.min, raw * (1 + finalPriceSettings.markup)) *
    finalPriceSettings.quantity;

  return {
    solidVolumeMm3: Math.round(solidVolumeMm3),
    surfaceAreaMm2: Math.round(surfaceAreaMm2),
    printedVolumeMm3: Math.round(printedVolumeMm3),
    weightGr: +weightGr.toFixed(2),
    printHours: +printHours.toFixed(2),
    materialCost: +materialCost.toFixed(2),
    machineCost: +machineCost.toFixed(2),
    total: +total.toFixed(2),
  };
};

export const estimatePrintCost = async (
  file: File,
  slicerSettings: Partial<SlicerSettings> = {},
  priceSettings: Partial<PriceSettings> = {},
): Promise<PrintCostEstimate> => {
  const geometry = await load3dModel(file);

  const solidVolumeMm3 = calculateSolidVolumeMm3(geometry);
  const surfaceAreaMm2 = calculateSurfaceAreaMm2(geometry);

  return estimatePrintCostInternal(solidVolumeMm3, surfaceAreaMm2, slicerSettings, priceSettings);
};
