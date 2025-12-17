import React from 'react';

import { Page } from '~/pages';
import { Text } from '~/components';
import { CONTACT_EMAIL } from '~/configs';

export const IntellectualPropertyPolicyPage = () => {
  return (
    <Page title="Intellectual Property & Copyright Policy">
      <Text variant="subtitle1">Customer-owned content</Text>

      <Text variant="body1">
        You retain full ownership of any 3D models, files, or designs that you submit to Vextrix3D.
        By uploading a file, you grant Vextrix3D a limited, non-exclusive, royalty-free right to
        store, process, and manufacture the file solely for the purpose of fulfilling your order and
        providing related customer support.
      </Text>

      <Text variant="body1">
        We do not claim ownership of your designs and will not use, reproduce, or distribute them
        for any other purpose without your explicit consent, unless required by law.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Third-party rights and responsibility
      </Text>

      <Text variant="body1">
        You represent and warrant that you own the intellectual property rights to the submitted
        content or have obtained all necessary permissions, licenses, or authorizations to use and
        manufacture the design.
      </Text>

      <Text variant="body1">
        You agree to fully indemnify and hold harmless Vextrix3D from any claims, damages, losses,
        or legal expenses arising from alleged or actual infringement of intellectual property,
        copyright, trademark, or other proprietary rights related to your uploaded content.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Use of Vextrix3D content
      </Text>

      <Text variant="body1">
        All website content, branding, images, product descriptions, documentation, and other
        materials provided by Vextrix3D are the intellectual property of Vextrix3D or its licensors.
        You may not copy, reproduce, modify, distribute, or reuse such materials without prior
        written permission.
      </Text>

      <Text variant="subtitle1" $marginTop={2}>
        Reporting copyright infringement
      </Text>

      <Text variant="body1">
        If you believe that your copyrighted work has been used on our platform in a way that
        constitutes infringement, please contact us at{' '}
        <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT_EMAIL}
        </Text>{' '}
        and provide sufficient information to allow us to identify and investigate the issue. We
        will respond in accordance with applicable intellectual property laws.
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
