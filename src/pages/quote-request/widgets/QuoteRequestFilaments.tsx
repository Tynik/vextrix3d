import React from 'react';

import { MATERIALS } from '~/configs';
import { useFilaments } from '~/models';
import { QuoteRequestFilament } from './QuoteRequestFilament';

export const QuoteRequestFilaments = () => {
  const { filamentPriceRange, filamentTemperatureRange } = useFilaments();

  return MATERIALS.map(filament => (
    <QuoteRequestFilament
      key={filament.name}
      filament={filament}
      priceRange={filamentPriceRange}
      temperatureRange={filamentTemperatureRange}
    />
  ));
};
