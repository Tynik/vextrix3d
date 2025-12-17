import React from 'react';

import { Text } from '~/components';
import { Page } from './sections';

export const MaterialSafetyDisclaimerPage = () => {
  return (
    <Page title="Material Safety & Print Quality Disclaimer">
      <Text variant="subtitle1">Intended use</Text>

      <Text variant="body1">
        Unless explicitly agreed in writing, all printed parts are produced for prototyping,
        demonstration, decorative, or non-critical applications only. Printed parts are not
        certified, tested, or approved for load-bearing, medical, life-safety, or food-contact use.
      </Text>

      <Text variant="body1">
        Vextrix3D makes no representation or warranty that printed parts are suitable for any
        specific purpose beyond general evaluation and testing.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Material characteristics & selection
      </Text>

      <Text variant="body1">
        Materials such as PLA, PETG, ABS, ASA, and other polymers have differing mechanical,
        thermal, and chemical properties. While Vextrix3D may provide general guidance regarding
        material characteristics, the final responsibility for selecting an appropriate material for
        the intended application rests solely with the customer.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Safety, handling & post-processing
      </Text>

      <Text variant="body1">
        Printed parts may contain sharp edges, small detachable features, residual supports, or may
        undergo post-processing involving chemicals or solvents. Customers are responsible for safe
        handling, inspection, and use of printed parts and should wear appropriate protective
        equipment when necessary.
      </Text>

      <Text variant="body1">
        Printed parts must not be used in high-temperature, high-stress, or safety-critical
        environments unless independently tested and approved by a qualified professional.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Temperature & chemical resistance
      </Text>

      <Text variant="body1">
        Temperature resistance varies by material and print conditions (for example: PLA ~60°C, PETG
        ~80°C, ABS ~100°C, ASA ~105°C). Chemical resistance depends on the material, environment,
        and exposure duration. No guarantee of thermal or chemical performance is provided.
      </Text>

      <Text variant="body1">
        Customers are encouraged to review manufacturer datasheets or consult qualified engineers
        before using printed parts in demanding or regulated applications.
      </Text>

      <Text
        variant="body2"
        $color="secondary.slateAlloy"
        $fontStyle="italic"
        $textAlign="right"
        $marginTop={2}
      >
        Last updated: 17/12/2025
      </Text>
    </Page>
  );
};
