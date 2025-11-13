import React from 'react';
import { Page } from '~/pages/sections';
import { Text } from '~/components';

export const ModelSubmissionPolicyPage = () => {
  return (
    <Page>
      <Text variant="h3">Model Submission Policy</Text>

      <Text variant="body2">Last updated: 12/11/2025</Text>

      <Text variant="subtitle1" $marginTop={2}>
        Accepted file types
      </Text>

      <Text variant="body1">
        We accept standard 3D file formats such as <strong>.stl</strong>, <strong>.obj</strong>, and{' '}
        <strong>.3mf</strong>. Please ensure files are manifold/sliced or indicate if you want us to
        prepare them for printing.
      </Text>

      <Text variant="subtitle1">Ownership & Licensing</Text>

      <Text variant="body1">
        By submitting a file you confirm that you own or are licensed to print the design. You
        retain intellectual property rights to your model. You agree not to submit designs that
        infringe third-party IP or violate laws.
      </Text>

      <Text variant="subtitle1">Safety & Compliance</Text>

      <Text variant="body1">
        Do not submit designs intended to create weapons, regulated devices, or items that present a
        high risk of harm. Vextrix3D reserves the right to refuse or cancel any order which we deem
        unsafe or non-compliant.
      </Text>

      <Text variant="subtitle1">File retention</Text>

      <Text variant="body1">
        Uploaded files are retained for a limited period (typically 30 days) unless you request
        otherwise. After the retention period, files may be deleted from our servers for privacy and
        storage management.
      </Text>

      <Text variant="subtitle1">Post-submission checks</Text>

      <Text variant="body1">
        We may inspect and repair files where necessary to improve printability. Any major changes
        will be reported for approval before printing; minor fixes may be applied at our discretion.
      </Text>

      <Text variant="h6" $marginTop={3}>
        Contact
      </Text>

      <Text variant="body1">
        Questions? Email:{' '}
        <Text as="a" variant="body1" $fontWeight={700} href="mailto:vextrix3d@gmail.com">
          vextrix3d@gmail.com
        </Text>
      </Text>
    </Page>
  );
};
