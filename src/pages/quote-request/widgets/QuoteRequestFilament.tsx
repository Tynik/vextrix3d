import React, { cloneElement } from 'react';
import { HoneyBox, HoneyFlex } from '@react-hive/honey-layout';
import sortBy from 'lodash.sortby';

import type { Material } from '~/configs';
import { FILAMENT_ICONS_CONFIG, FILAMENT_ICONS_TOOLTIP_CONTENT } from '~/configs';
import { CurrencyPoundIcon, ThermostatIcon } from '~/icons';
import type { FilamentsRange } from '~/hooks';
import { Scale, Text, Tooltip } from '~/components';
import { ColorInfo } from '~/pages';

interface QuoteRequestFilamentProps {
  filament: Material;
  priceRange: FilamentsRange;
  temperatureRange: FilamentsRange;
}

export const QuoteRequestFilament = ({
  filament,
  priceRange,
  temperatureRange,
}: QuoteRequestFilamentProps) => {
  return (
    <HoneyFlex
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

      <HoneyBox $display="flex" $gap={0.5} $flexWrap="wrap">
        {filament.availableColors?.map(color => (
          <Tooltip
            key={color.name}
            content={`${color.name}${color.inStock === false ? ' (out of stock)' : ''}`}
          >
            <ColorInfo hex={color.hex} aria-disabled={color.inStock === false} />
          </Tooltip>
        ))}
      </HoneyBox>

      <Text variant="body1">{filament.shortDescription}</Text>

      <HoneyFlex $gap={1.5} $marginTop="auto" $paddingTop={1}>
        {filament.priceKg && (
          <Scale
            label="Price"
            icon={<CurrencyPoundIcon />}
            min={priceRange.min}
            max={priceRange.max}
            value={filament.priceKg * (filament.difficulty ?? 1)}
          />
        )}

        {filament.maxTemperature && (
          <Scale
            label="Temp. Resistance"
            icon={<ThermostatIcon />}
            min={temperatureRange.min}
            max={temperatureRange.max}
            value={filament.maxTemperature}
          />
        )}
      </HoneyFlex>
    </HoneyFlex>
  );
};
