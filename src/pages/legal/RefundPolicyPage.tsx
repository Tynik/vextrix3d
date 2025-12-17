import React from 'react';
import { HoneyFlex } from '@react-hive/honey-layout';

import { CONTACT_EMAIL } from '~/configs';
import { Text } from '~/components';
import { Page } from '~/pages';

export const RefundPolicyPage = () => {
  return (
    <Page title="Refund & Reprint Policy">
      <HoneyFlex $gap={1}>
        <Text variant="body1">
          Vextrix3D produces custom, made-to-order 3D printed items based on customer-submitted
          files and selected specifications. As a result, refunds and reprints are limited and
          assessed on a case-by-case basis.
        </Text>

        <Text variant="body1">
          Once printing or post-processing has begun, orders cannot be cancelled or refunded except
          where a manufacturing defect or delivery issue is confirmed.
        </Text>

        <Text variant="subtitle1" $marginTop={2}>
          When we offer a reprint or refund
        </Text>

        <Text variant="body1">
          At our discretion, we will offer a free reprint or refund if one of the following applies:
        </Text>

        <ul>
          <li>
            <Text variant="body1">
              The part contains a verified manufacturing defect, such as severe layer separation,
              structural failure, or major extrusion issues that materially affect functionality.
            </Text>
          </li>
          <li>
            <Text variant="body1">
              The delivered item is materially different from the approved order specifications
              (e.g. wrong material, colour, or scale).
            </Text>
          </li>
          <li>
            <Text variant="body1">
              The item was damaged during transit, provided the issue is reported within 48 hours of
              delivery and supported by clear photographic evidence.
            </Text>
          </li>
        </ul>

        <Text variant="subtitle1" $marginTop={2}>
          When refunds or reprints are not provided
        </Text>

        <Text variant="body1">
          Refunds or reprints are generally not provided for the following reasons:
        </Text>

        <ul>
          <li>
            <Text variant="body1">
              Errors or weaknesses in the original design, including incorrect dimensions,
              insufficient wall thickness, or unsuitable geometry, unless explicitly approved or
              modified by Vextrix3D in writing.
            </Text>
          </li>
          <li>
            <Text variant="body1">
              Expected cosmetic characteristics of 3D printing, such as visible layer lines, minor
              surface imperfections, or slight colour variations.
            </Text>
          </li>
          <li>
            <Text variant="body1">
              Damage caused after delivery, improper use, or use outside the intended application.
            </Text>
          </li>
        </ul>

        <Text variant="subtitle1" $marginTop={2}>
          How to request a refund or reprint
        </Text>

        <Text variant="body1">
          To request a refund or reprint, please email{' '}
          <Text as="a" variant="body1" $fontWeight={700} href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </Text>{' '}
          within a reasonable time after delivery, including your order number, a clear description
          of the issue, and supporting photographs. We aim to review all requests and respond within
          three business days.
        </Text>
      </HoneyFlex>

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
