import React from 'react';
import type { ReactElement } from 'react';

import type { IconProps } from '~/components';
import {
  FitnessCenterIcon,
  GavelIcon,
  TextureIcon,
  RecyclingIcon,
  ShieldIcon,
  StraightenIcon,
  ThermostatIcon,
  WavesIcon,
  WbSunnyIcon,
} from '~/icons';

type FilamentIcon =
  | 'eco'
  | 'surfaceQuality'
  | 'durability'
  | 'strength'
  | 'temperatureResistance'
  | 'rigidity'
  | 'uvResistance'
  | 'wearResistance'
  | 'flexibility';

type MaterialType = 'filament' | 'resin';

type MaterialName<Type extends MaterialType> = Type extends 'filament'
  ? 'PLA' | 'PLA Tough+' | 'PETG' | 'PETG-CF' | 'ABS' | 'ABS-GF' | 'ASA' | 'ASA-CF' | 'PA' | 'TPU'
  : Type extends 'resin'
    ? 'ABS-Like Pro 2'
    : never;

export interface Material<Type extends MaterialType = MaterialType> {
  type: Type;
  name: MaterialName<Type>;
  image: string;
  priceKg?: number;
  difficulty?: number;
  maxTemperature?: number;
  icons?: FilamentIcon[];
  description: string;
  shortDescription: string;
}

export const MATERIALS: Material[] = [
  {
    type: 'filament',
    name: 'PLA',
    image: 'filament-1.webp',
    priceKg: 18,
    maxTemperature: 60,
    icons: ['eco', 'surfaceQuality'],
    description:
      'Dimensionally stable, and perfect for prototypes, decorative models, and general-purpose parts. Offers good surface finish with minimal warping. Heat resistance up to ~60°C.',
    shortDescription: 'Stable, great for prototypes and decorative parts.',
  },
  {
    type: 'filament',
    name: 'PLA Tough+',
    image: 'filament-1.webp',
    priceKg: 19,
    maxTemperature: 60,
    icons: ['eco', 'durability', 'surfaceQuality'],
    description:
      'Enhanced PLA formulated for higher impact strength and improved durability. Ideal for functional parts, prototypes, and assemblies requiring better toughness than standard PLA. Heat resistance up to ~60°C with excellent dimensional accuracy.',
    shortDescription: 'Stronger, less brittle PLA suitable for light functional prints.',
  },
  {
    type: 'filament',
    name: 'PETG',
    image: 'filament-1.webp',
    priceKg: 20,
    difficulty: 1.2,
    maxTemperature: 80,
    icons: ['durability', 'strength', 'temperatureResistance'],
    description:
      'Combines strength, flexibility, and high temperature resistance (up to ~80°C). Ideal for functional parts, mechanical prototypes, and enclosures requiring durability and moisture resistance.',
    shortDescription: 'Durable and versatile filament for functional parts.',
  },
  {
    type: 'filament',
    name: 'PETG-CF',
    image: 'filament-1.webp',
    priceKg: 22,
    difficulty: 1.2,
    maxTemperature: 80,
    icons: ['rigidity', 'strength', 'temperatureResistance', 'durability'],
    description:
      "Reinforced with carbon fiber for increased stiffness, strength, and dimensional accuracy while retaining PETG's durability. Excellent for structural parts, brackets, drone components, and high-load applications. Heat resistance up to ~80°C with reduced warping and superior rigidity.",
    shortDescription: 'Ultra-stiff carbon-fiber PETG ideal for structural parts.',
  },
  {
    type: 'filament',
    name: 'ABS',
    image: 'filament-1.webp',
    priceKg: 18,
    difficulty: 1.1,
    maxTemperature: 100,
    icons: ['durability', 'temperatureResistance', 'strength'],
    description:
      'Provides excellent impact resistance and strength for technical components. Heat resistance up to ~100°C. Works best in an enclosed chamber to reduce warping and improve layer adhesion.',
    shortDescription: 'Strong, impact-resistant material for technical parts.',
  },
  {
    type: 'filament',
    name: 'ABS-GF',
    image: 'filament-1.webp',
    priceKg: 22.5,
    difficulty: 1.3,
    maxTemperature: 105,
    icons: ['rigidity', 'strength', 'temperatureResistance', 'durability'],
    description:
      "Glass-fiber-reinforced ABS offering enhanced rigidity, dimensional stability, and reduced warping compared to standard ABS. Provides increased strength and stiffness while maintaining ABS's impact resistance and heat tolerance up to ~105°C. Ideal for mechanical parts, brackets, enclosures, and components that must hold shape under load.",
    shortDescription: 'Rigid, reinforced ABS with improved stability and strength.',
  },
  {
    type: 'filament',
    name: 'ASA',
    image: 'filament-1.webp',
    priceKg: 22,
    difficulty: 1.1,
    maxTemperature: 105,
    icons: ['uvResistance', 'temperatureResistance', 'strength', 'durability'],
    description:
      'Offers outstanding UV and weather resistance with heat resistance up to ~105°C. Perfect for outdoor applications, automotive parts, and mechanical components requiring long-term durability.',
    shortDescription: 'UV-resistant filament ideal for outdoor use.',
  },
  {
    type: 'filament',
    name: 'ASA-CF',
    image: 'filament-1.webp',
    priceKg: 26,
    difficulty: 1.3,
    maxTemperature: 105,
    icons: ['rigidity', 'uvResistance', 'temperatureResistance', 'strength'],
    description:
      'Carbon-fiber-reinforced ASA offering superior stiffness, UV stability, and heat resistance up to ~105°C. Ideal for outdoor mechanical parts, automotive components, and applications requiring high rigidity with excellent weather durability.',
    shortDescription: 'Rigid, UV-resistant carbon-fiber ASA for outdoor mechanics.',
  },
  {
    type: 'filament',
    name: 'PA',
    image: 'filament-1.webp',
    priceKg: 22,
    difficulty: 1.5,
    maxTemperature: 120,
    icons: ['wearResistance', 'durability', 'strength', 'temperatureResistance'],
    description:
      'High-performance nylon filament offering exceptional toughness, impact resistance, and wear resistance. Ideal for gears, mechanical parts, hinges, and engineering components that require flexibility and long-term durability. Heat resistance up to ~120°C.',
    shortDescription: 'Extremely tough nylon for gears and engineering parts.',
  },
  {
    type: 'filament',
    name: 'TPU',
    image: 'filament-1.webp',
    priceKg: 25,
    difficulty: 1.2,
    maxTemperature: 90,
    icons: ['flexibility', 'durability', 'wearResistance'],
    description:
      'Flexible, impact-resistant material ideal for parts requiring elasticity and vibration damping. Perfect for phone cases, gaskets, seals, RC tires, and functional components that must withstand repeated bending. Offers excellent layer adhesion and abrasion resistance with heat resistance up to ~90°C.',
    shortDescription: 'Flexible and durable filament for elastic functional parts.',
  },
];

export const FILAMENTS: Material[] = MATERIALS.filter(material => material.type === 'filament');

export const RESINS: Material[] = MATERIALS.filter(material => material.type === 'resin');

export const FILAMENT_ICONS_CONFIG: Record<FilamentIcon, ReactElement<IconProps>> = {
  eco: <RecyclingIcon />,
  surfaceQuality: <TextureIcon />,
  durability: <ShieldIcon />,
  strength: <FitnessCenterIcon />,
  temperatureResistance: <ThermostatIcon />,
  rigidity: <StraightenIcon />,
  uvResistance: <WbSunnyIcon />,
  wearResistance: <GavelIcon />,
  flexibility: <WavesIcon />,
};

export const FILAMENT_ICONS_TOOLTIP_CONTENT: Record<FilamentIcon, string> = {
  eco: 'Environmentally friendly material with low emissions',
  surfaceQuality: 'Produces smooth, high-detail surfaces with minimal layer visibility',
  durability: 'Resistant to impacts, stress, and long-term wear',
  strength: 'High mechanical strength for functional or load-bearing parts',
  temperatureResistance: 'Withstands higher temperatures without deforming',
  rigidity: 'Very stiff material ideal for structural or precision parts',
  uvResistance: 'Resistant to sunlight and outdoor weather exposure',
  wearResistance: 'Ideal for moving parts thanks to low friction and abrasion resistance',
  flexibility: 'Can bend without breaking-perfect for elastic or soft components',
};
