import { useMemo } from 'react';

import type { NumericRange } from '~/types';
import { FILAMENTS } from '~/configs';

export const useFilaments = () => {
  const filamentPriceRange = useMemo<NumericRange>(() => {
    const basePrices = FILAMENTS.map(
      filament => (filament.priceKg ?? 0) * (filament.difficulty ?? 1),
    );

    return {
      min: Math.min(...basePrices) * 0.9,
      max: Math.max(...basePrices) * 1.1,
    };
  }, []);

  const filamentTemperatureRange = useMemo<NumericRange>(() => {
    const temperature = FILAMENTS.map(filament => filament.maxTemperature ?? 0);

    return {
      min: Math.min(...temperature) * 0.9,
      max: Math.max(...temperature) * 1.1,
    };
  }, []);

  return {
    filamentPriceRange,
    filamentTemperatureRange,
  };
};
