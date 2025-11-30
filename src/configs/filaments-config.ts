interface Filament {
  name: 'PLA' | 'PLA Tough+' | 'PETG' | 'PETG-CF' | 'ABS' | 'ASA' | 'ASA-CF' | 'PA' | 'TPU';
  description: string;
}

export const FILAMENTS: Filament[] = [
  {
    name: 'PLA',
    description:
      'Dimensionally stable, and perfect for prototypes, decorative models, and general-purpose parts. Offers good surface finish with minimal warping. Heat resistance up to ~60°C.',
  },
  {
    name: 'PLA Tough+',
    description:
      'Enhanced PLA formulated for higher impact strength and improved durability. Ideal for functional parts, prototypes, and assemblies requiring better toughness than standard PLA. Heat resistance up to ~60°C with excellent dimensional accuracy.',
  },
  {
    name: 'PETG',
    description:
      'Combines strength, flexibility, and high temperature resistance (up to ~80°C). Ideal for functional parts, mechanical prototypes, and enclosures requiring durability and moisture resistance.',
  },
  {
    name: 'PETG-CF',
    description:
      "Reinforced with carbon fiber for increased stiffness, strength, and dimensional accuracy while retaining PETG's durability. Excellent for structural parts, brackets, drone components, and high-load applications. Heat resistance up to ~80°C with reduced warping and superior rigidity.",
  },
  {
    name: 'ABS',
    description:
      'Provides excellent impact resistance and strength for technical components. Heat resistance up to ~100°C. Works best in an enclosed chamber to reduce warping and improve layer adhesion.',
  },
  {
    name: 'ASA',
    description:
      'Offers outstanding UV and weather resistance with heat resistance up to ~105°C. Perfect for outdoor applications, automotive parts, and mechanical components requiring long-term durability.',
  },
  {
    name: 'ASA-CF',
    description:
      'Carbon-fiber-reinforced ASA offering superior stiffness, UV stability, and heat resistance up to ~105°C. Ideal for outdoor mechanical parts, automotive components, and applications requiring high rigidity with excellent weather durability.',
  },
  {
    name: 'PA',
    description:
      'High-performance nylon filament offering exceptional toughness, impact resistance, and wear resistance. Ideal for gears, mechanical parts, hinges, and engineering components that require flexibility and long-term durability. Heat resistance up to ~120°C.',
  },
  {
    name: 'TPU',
    description:
      'Flexible, impact-resistant material ideal for parts requiring elasticity and vibration damping. Perfect for phone cases, gaskets, seals, RC tires, and functional components that must withstand repeated bending. Offers excellent layer adhesion and abrasion resistance with heat resistance up to ~90°C.',
  },
];
