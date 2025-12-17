import React from 'react';
import { HoneyFlex } from '@react-hive/honey-layout';

import { Text } from '~/components';

export const ModelSubmissionPolicyContent = () => {
  return (
    <HoneyFlex $gap={1}>
      <Text variant="subtitle1">Accepted file formats</Text>

      <Text variant="body1">
        We accept common 3D file formats including <strong>.stl</strong>, <strong>.obj</strong>, and{' '}
        <strong>.3mf</strong>. Files should be watertight, manifold, and suitable for additive
        manufacturing. If a file is not print-ready, you may request file preparation services,
        which may incur additional fees.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Ownership & licensing
      </Text>

      <Text variant="body1">
        By submitting a file, you represent and warrant that you own the intellectual property
        rights to the design or have obtained all necessary licenses and permissions to manufacture
        it. You retain ownership of your model at all times.
      </Text>

      <Text variant="body1">
        You agree not to submit designs that infringe third-party intellectual property rights,
        violate applicable laws, or breach any third-party agreements.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Safety, legality & compliance
      </Text>

      <Text variant="body1">
        Designs intended to create weapons, weapon components, regulated items, or objects that pose
        a significant risk of injury or harm are strictly prohibited. Vextrix3D reserves the right,
        at its sole discretion, to refuse, suspend, or cancel any order that is deemed unsafe,
        unlawful, or non-compliant, without obligation to provide detailed justification.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        File inspection & modification
      </Text>

      <Text variant="body1">
        Submitted files may be reviewed for printability. Minor technical adjustments (such as mesh
        repairs, wall-thickness corrections, or orientation changes) may be applied at our
        discretion to improve print success.
      </Text>

      <Text variant="body1">
        Any substantial modifications affecting geometry, function, or appearance will be
        communicated to you for approval prior to printing.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        File storage & retention
      </Text>

      <Text variant="body1">
        Uploaded files are stored securely and retained for a limited period, typically up to 30
        days after order completion, unless you request earlier deletion or extended retention.
        Files may be permanently deleted after this period for privacy and storage management
        purposes.
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
    </HoneyFlex>
  );
};
