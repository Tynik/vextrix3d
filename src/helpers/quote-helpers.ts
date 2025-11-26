import { Mesh, Object3D, Vector3 } from 'three';
import type { BufferGeometry } from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';

import type { Nullable } from '~/types';

const ensureGeometryAttributes = (geometry: BufferGeometry) => {
  if (!geometry.attributes.position) {
    throw new Error('Geometry has no position attribute');
  }

  if (!geometry.attributes.normal) {
    geometry.computeVertexNormals();
  }

  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();
};

const findLargestMesh = (root: Object3D): Nullable<Mesh> => {
  let best: Nullable<Mesh> = null;
  let bestCount = 0;

  root.traverse(child => {
    if (
      child instanceof Mesh &&
      child.geometry &&
      (child.geometry as BufferGeometry).attributes.position
    ) {
      const pos = (child.geometry as BufferGeometry).attributes.position;
      if (pos && pos.count > bestCount) {
        bestCount = pos.count;
        best = child;
      }
    }
  });

  return best;
};

const loadModel = async (file: File): Promise<BufferGeometry> => {
  const arrayBuffer = await file.arrayBuffer();
  const ext = file.name.split('.').pop()?.toLowerCase();

  if (ext === 'stl') {
    let geo = new STLLoader().parse(arrayBuffer) as BufferGeometry;

    if (geo.index) {
      geo = geo.toNonIndexed();
    }

    ensureGeometryAttributes(geo);
    return geo;
  }

  if (ext === 'obj') {
    const text = new TextDecoder().decode(arrayBuffer);
    const obj = new OBJLoader().parse(text);
    const mesh = findLargestMesh(obj);

    if (!mesh || !mesh.geometry) {
      throw new Error('OBJ: no mesh found');
    }

    let geo = mesh.geometry as BufferGeometry;

    if (geo.index) {
      geo = geo.toNonIndexed();
    }

    ensureGeometryAttributes(geo);
    return geo;
  }

  if (ext === '3mf') {
    const loader = new ThreeMFLoader();
    const scene = loader.parse(arrayBuffer);
    const mesh = findLargestMesh(scene);

    if (!mesh || !mesh.geometry) {
      throw new Error('3MF: no mesh found');
    }

    let geo = mesh.geometry as BufferGeometry;

    if (geo.index) {
      geo = geo.toNonIndexed();
    }

    ensureGeometryAttributes(geo);
    return geo;
  }

  throw new Error('Unsupported format');
};

const calculateSolidVolumeMm3 = (geometry: BufferGeometry): number => {
  const pos = geometry.attributes.position;
  let volume = 0;

  for (let i = 0; i < pos.count; i += 3) {
    const ax = pos.getX(i),
      ay = pos.getY(i),
      az = pos.getZ(i);

    const bx = pos.getX(i + 1),
      by = pos.getY(i + 1),
      bz = pos.getZ(i + 1);

    const cx = pos.getX(i + 2),
      cy = pos.getY(i + 2),
      cz = pos.getZ(i + 2);

    volume += ax * (by * cz - bz * cy) - ay * (bx * cz - bz * cx) + az * (bx * cy - by * cx);
  }

  return Math.abs(volume) / 6;
};

const calculateSurfaceAreaMm2 = (geometry: BufferGeometry): number => {
  const pos = geometry.attributes.position;
  let area = 0;

  for (let i = 0; i < pos.count; i += 3) {
    const ax = new Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    const bx = new Vector3(pos.getX(i + 1), pos.getY(i + 1), pos.getZ(i + 1));
    const cx = new Vector3(pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));

    const ab = bx.clone().sub(ax);
    const ac = cx.clone().sub(ax);

    const cross = new Vector3().crossVectors(ab, ac);

    area += 0.5 * cross.length();
  }

  return area;
};

export type SlicerSettings = {
  infill: number; // 0..1
  walls: number; // line count
  topLayers: number;
  bottomLayers: number;
  layerHeight: number; // mm
  nozzleDiameter: number; // mm
  supportDensity: number; // 0..1 (approx area fraction)
  supportFactor: number; // how dense supports are relative to infill (0.2..0.6)
  flowRate: number; // multiplier for extrusion (0.95..1.1)
  units: 'mm' | 'meter'; // geometry units if you want to override
};

export type PriceSettings = {
  materialDensity: number; // g/cm3
  materialPriceKg: number; // currency/kg
  basePrintTime: number; // hours
  speedMm3PerSec: number; // mm3 per second (volumetric flow)
  machineCostPerHour: number;
  fixedFee: number;
  markup: number; // 0..1
};

export type QuoteResult = {
  solidVolumeMm3: number;
  surfaceAreaMm2: number;
  printedVolumeMm3: number;
  weightGr: number;
  printHours: number;
  materialCost: number;
  machineCost: number;
  total: number;
};

const DEFAULT_SLICER_SETTINGS: SlicerSettings = {
  infill: 0.15,
  walls: 2,
  topLayers: 5,
  bottomLayers: 5,
  layerHeight: 0.2,
  nozzleDiameter: 0.4,
  supportDensity: 0.1,
  supportFactor: 0.35,
  flowRate: 1.0,
  units: 'mm',
};

const DEFAULT_PRICE_SETTINGS: PriceSettings = {
  materialDensity: 1.24,
  materialPriceKg: 25,
  basePrintTime: 0.15,
  speedMm3PerSec: 12,
  machineCostPerHour: 0,
  fixedFee: 1.5,
  markup: 0.3,
};

const calculateQuote = (
  solidVolumeMm3: number,
  surfaceAreaMm2: number,
  slicerSettings: Partial<SlicerSettings> = {},
  priceSettings: Partial<PriceSettings> = {},
): QuoteResult => {
  const finalSlicerSettings = {
    ...DEFAULT_SLICER_SETTINGS,
    ...slicerSettings,
  };

  const finalPriceSettings = {
    ...DEFAULT_PRICE_SETTINGS,
    ...priceSettings,
  };

  // top/bottom thickness mm
  const topBottomThickness =
    (finalSlicerSettings.topLayers + finalSlicerSettings.bottomLayers) *
    finalSlicerSettings.layerHeight;

  // wall thickness mm
  const wallThickness = finalSlicerSettings.walls * finalSlicerSettings.nozzleDiameter;

  // shell volume (walls): surface area * wall thickness
  const shellVolumeMm3 = surfaceAreaMm2 * wallThickness;

  // top/bottom volume: surface area * topBottomThickness
  const topBottomVolumeMm3 = surfaceAreaMm2 * topBottomThickness;

  // compute infill volume as remaining interior volume times infill %
  const interiorSolidVolumeMm3 = Math.max(0, solidVolumeMm3 - shellVolumeMm3 - topBottomVolumeMm3);
  const infillVolumeMm3 = interiorSolidVolumeMm3 * finalSlicerSettings.infill;

  // support volume (approx)
  const supportVolumeMm3 =
    solidVolumeMm3 * finalSlicerSettings.supportDensity * finalSlicerSettings.supportFactor;

  // total printed (before flow)
  const printedNoFlowMm3 = shellVolumeMm3 + topBottomVolumeMm3 + infillVolumeMm3 + supportVolumeMm3;

  // account for flow multiplier (over/under extrusion)
  const printedVolumeMm3 = printedNoFlowMm3 * finalSlicerSettings.flowRate;

  // convert to cm3 and grams
  const printedVolumeCm3 = printedVolumeMm3 / 1000;
  const weightGr = printedVolumeCm3 * finalPriceSettings.materialDensity;

  // time estimation using volumetric flow
  const printSeconds = printedVolumeMm3 / finalPriceSettings.speedMm3PerSec;
  const printHours = finalPriceSettings.basePrintTime + printSeconds / 3600;

  // cost
  const materialCost = (weightGr / 1000) * finalPriceSettings.materialPriceKg;
  const machineCost = printHours * finalPriceSettings.machineCostPerHour;
  const raw = materialCost + machineCost + finalPriceSettings.fixedFee;
  const total = raw * (1 + finalPriceSettings.markup);

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

export const calculateModelQuote = async (
  file: File,
  slicerSettings: Partial<SlicerSettings> = {},
  priceSettings: Partial<PriceSettings> = {},
) => {
  const geometry = await loadModel(file);

  const solidVolumeMm3 = calculateSolidVolumeMm3(geometry);
  const surfaceAreaMm2 = calculateSurfaceAreaMm2(geometry);

  return calculateQuote(solidVolumeMm3, surfaceAreaMm2, slicerSettings, priceSettings);
};
