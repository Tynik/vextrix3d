import { useMemo } from 'react';
import { FILAMENTS } from '~/configs';

export const useFilaments = () => {
  const filamentPriceRange = useMemo(() => {
    const basePrices = FILAMENTS.map(
      filament => (filament.price ?? 0) * (filament.difficulty ?? 1),
    );

    return {
      min: Math.min(...basePrices) * 0.9,
      max: Math.max(...basePrices) * 1.1,
    };
  }, []);

  return {
    filamentPriceRange,
  };
};
