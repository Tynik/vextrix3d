import React from 'react';
import { Page } from '~/pages/sections';
import { Text } from '~/components';

export const MaterialSafetyDisclaimerPage = () => {
  return (
    <Page>
      <Text variant="h3">Material Safety & Print Quality</Text>

      <Text variant="body2">Last updated: Last updated: 12/11/2025</Text>

      <Text variant="subtitle1" $marginTop={2}>
        Intended use
      </Text>

      <Text variant="body1">
        Unless explicitly stated in a written agreement, printed parts are intended for prototyping,
        demonstration, and non-critical use. They are not certified for load-bearing, medical, or
        food-contact applications.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Material characteristics
      </Text>

      <Text variant="body1">
        Materials such as PLA, PETG, ABS, and ASA have different mechanical, thermal, and chemical
        properties. Vextrix3D will specify material suitability, but it is the customer's
        responsibility to choose the appropriate material for the intended use.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Safety & handling
      </Text>

      <Text variant="body1">
        Printed parts can have sharp edges, small removable supports, or solvents used during
        post-processing. Handle parts carefully and wear protective equipment when necessary. Do not
        use printed parts in high-temperature or safety-critical environments unless verified by a
        qualified engineer.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Chemical resistance & temperature
      </Text>

      <Text variant="body1">
        Material temperature resistance varies (e.g., PLA ~60°C, PETG ~80°C, ABS ~100°C, ASA
        ~105°C). Chemical resistance depends on material and exposure conditions. Consult material
        datasheets or contact us for specific use cases.
      </Text>
    </Page>
  );
};
