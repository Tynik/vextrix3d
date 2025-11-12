interface Filament {
  name: string;
  description: string;
}

export const FILAMENTS: Filament[] = [
  {
    name: 'PLA',
    description:
      'Dimensionally stable, and perfect for prototypes, decorative models, and general-purpose parts. Offers good surface finish with minimal warping. Heat resistance up to ~60°C.',
  },
  {
    name: 'PETG',
    description:
      'Combines strength, flexibility, and high temperature resistance (up to ~80°C). Ideal for functional parts, mechanical prototypes, and enclosures requiring durability and moisture resistance.',
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
];
