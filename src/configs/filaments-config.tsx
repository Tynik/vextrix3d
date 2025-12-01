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
  | 'ecoFriendly'
  | 'surfaceQuality'
  | 'durability'
  | 'strength'
  | 'temperatureResistance'
  | 'rigidity'
  | 'uvResistance'
  | 'wearResistance'
  | 'flexibility';

interface Filament {
  name: 'PLA' | 'PLA Tough+' | 'PETG' | 'PETG-CF' | 'ABS' | 'ASA' | 'ASA-CF' | 'PA' | 'TPU';
  image: string;
  price?: number;
  difficulty?: number;
  maxTemperature?: number;
  icons?: FilamentIcon[];
  description: string;
  shortDescription: string;
}

export const FILAMENTS: Filament[] = [
  {
    name: 'PLA',
    image: 'filament-1.webp',
    price: 18,
    maxTemperature: 60,
    icons: ['ecoFriendly', 'surfaceQuality'],
    description:
      'Dimensionally stable, and perfect for prototypes, decorative models, and general-purpose parts. Offers good surface finish with minimal warping. Heat resistance up to ~60°C.',
    shortDescription: 'Stable, great for prototypes and decorative parts.',
  },
  {
    name: 'PLA Tough+',
    image: 'filament-1.webp',
    price: 19,
    maxTemperature: 60,
    icons: ['ecoFriendly', 'surfaceQuality'],
    description:
      'Enhanced PLA formulated for higher impact strength and improved durability. Ideal for functional parts, prototypes, and assemblies requiring better toughness than standard PLA. Heat resistance up to ~60°C with excellent dimensional accuracy.',
    shortDescription: 'Stronger, less brittle PLA suitable for light functional prints.',
  },
  {
    name: 'PETG',
    image: 'filament-1.webp',
    price: 18,
    difficulty: 1.2,
    maxTemperature: 80,
    icons: ['durability', 'strength', 'temperatureResistance'],
    description:
      'Combines strength, flexibility, and high temperature resistance (up to ~80°C). Ideal for functional parts, mechanical prototypes, and enclosures requiring durability and moisture resistance.',
    shortDescription: 'Durable and versatile filament for functional parts.',
  },
  {
    name: 'PETG-CF',
    image: 'filament-1.webp',
    price: 21,
    difficulty: 1.2,
    maxTemperature: 80,
    icons: ['rigidity', 'strength', 'temperatureResistance', 'durability'],
    description:
      "Reinforced with carbon fiber for increased stiffness, strength, and dimensional accuracy while retaining PETG's durability. Excellent for structural parts, brackets, drone components, and high-load applications. Heat resistance up to ~80°C with reduced warping and superior rigidity.",
    shortDescription: 'Ultra-stiff carbon-fiber PETG ideal for structural parts.',
  },
  {
    name: 'ABS',
    image: 'filament-1.webp',
    price: 18,
    difficulty: 1.1,
    maxTemperature: 100,
    icons: ['durability', 'temperatureResistance', 'strength'],
    description:
      'Provides excellent impact resistance and strength for technical components. Heat resistance up to ~100°C. Works best in an enclosed chamber to reduce warping and improve layer adhesion.',
    shortDescription: 'Strong, impact-resistant material for technical parts.',
  },
  {
    name: 'ASA',
    image: 'filament-1.webp',
    price: 21,
    difficulty: 1.1,
    maxTemperature: 105,
    icons: ['uvResistance', 'temperatureResistance', 'strength', 'durability'],
    description:
      'Offers outstanding UV and weather resistance with heat resistance up to ~105°C. Perfect for outdoor applications, automotive parts, and mechanical components requiring long-term durability.',
    shortDescription: 'UV-resistant filament ideal for outdoor use.',
  },
  {
    name: 'ASA-CF',
    image: 'filament-1.webp',
    price: 22,
    difficulty: 1.3,
    maxTemperature: 105,
    icons: ['rigidity', 'uvResistance', 'temperatureResistance', 'strength'],
    description:
      'Carbon-fiber-reinforced ASA offering superior stiffness, UV stability, and heat resistance up to ~105°C. Ideal for outdoor mechanical parts, automotive components, and applications requiring high rigidity with excellent weather durability.',
    shortDescription: 'Rigid, UV-resistant carbon-fiber ASA for outdoor mechanics.',
  },
  {
    name: 'PA',
    image: 'filament-1.webp',
    price: 20,
    difficulty: 1.5,
    maxTemperature: 120,
    icons: ['wearResistance', 'durability', 'strength', 'flexibility', 'temperatureResistance'],
    description:
      'High-performance nylon filament offering exceptional toughness, impact resistance, and wear resistance. Ideal for gears, mechanical parts, hinges, and engineering components that require flexibility and long-term durability. Heat resistance up to ~120°C.',
    shortDescription: 'Extremely tough nylon for gears and engineering parts.',
  },
  {
    name: 'TPU',
    image: 'filament-1.webp',
    price: 18,
    difficulty: 1.2,
    maxTemperature: 90,
    icons: ['flexibility', 'durability', 'wearResistance'],
    description:
      'Flexible, impact-resistant material ideal for parts requiring elasticity and vibration damping. Perfect for phone cases, gaskets, seals, RC tires, and functional components that must withstand repeated bending. Offers excellent layer adhesion and abrasion resistance with heat resistance up to ~90°C.',
    shortDescription: 'Flexible and durable filament for elastic functional parts.',
  },
];

export const FILAMENT_ICONS_CONFIG: Record<FilamentIcon, ReactElement<IconProps>> = {
  ecoFriendly: <RecyclingIcon />,
  surfaceQuality: <TextureIcon />,
  durability: <ShieldIcon />,
  strength: <FitnessCenterIcon />,
  temperatureResistance: <ThermostatIcon />,
  rigidity: <StraightenIcon />,
  uvResistance: <WbSunnyIcon />,
  wearResistance: <GavelIcon />,
  flexibility: <WavesIcon />,
};
