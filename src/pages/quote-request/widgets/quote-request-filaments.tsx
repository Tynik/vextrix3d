import React, { cloneElement } from 'react';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';
import sortBy from 'lodash.sortby';

import { FILAMENT_ICONS_CONFIG, FILAMENT_ICONS_TOOLTIP_CONTENT, FILAMENTS } from '~/configs';
import { CurrencyPoundIcon, ThermostatIcon } from '~/icons';
import { useFilaments } from '~/hooks';
import { Scale, Text, Tooltip } from '~/components';

export const QuoteRequestFilaments = () => {
  const { filamentPriceRange, filamentTemperatureRange } = useFilaments();

  return FILAMENTS.map(filament => (
    <HoneyFlexBox
      key={filament.name}
      $gap={1}
      $minHeight="150px"
      $padding={2}
      $borderRadius="4px"
      $border="1px solid"
      $borderColor="neutral.grayLight"
    >
      <HoneyBox $display="flex" $gap={1} $alignItems="center">
        <Text variant="subtitle1">{filament.name}</Text>

        {Boolean(filament.icons?.length) && (
          <HoneyBox $display="flex" $gap={0.5} $alignItems="center" $marginLeft="auto">
            {sortBy(filament.icons).map(iconName => (
              <Tooltip
                key={iconName}
                content={
                  <Text key={iconName} variant="caption1" $overflow="hidden" $color="inherit">
                    {FILAMENT_ICONS_TOOLTIP_CONTENT[iconName]}
                  </Text>
                }
                contentProps={{
                  $maxWidth: '350px',
                }}
              >
                {cloneElement(FILAMENT_ICONS_CONFIG[iconName], {
                  size: 'small',
                  color: 'secondary.slateAlloy',
                })}
              </Tooltip>
            ))}
          </HoneyBox>
        )}
      </HoneyBox>

      <Text variant="body1">{filament.shortDescription}</Text>

      <HoneyFlexBox $gap={1.5} $marginTop={1}>
        {filament.priceKg && (
          <Scale
            label="Price"
            icon={<CurrencyPoundIcon />}
            min={filamentPriceRange.min}
            max={filamentPriceRange.max}
            value={filament.priceKg * (filament.difficulty ?? 1)}
          />
        )}

        {filament.maxTemperature && (
          <Scale
            label="Temp. Resistance"
            icon={<ThermostatIcon />}
            min={filamentTemperatureRange.min}
            max={filamentTemperatureRange.max}
            value={filament.maxTemperature}
          />
        )}
      </HoneyFlexBox>
    </HoneyFlexBox>
  ));
};
