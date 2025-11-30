import React from 'react';
import { Link } from 'react-router-dom';
import { HoneyBox, HoneyFlexBox, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';

import { CONTACT_EMAIL } from '~/configs';
import { Container, Text } from '~/components';
import { MailIcon, PlaceIcon } from '~/icons';

export const Footer = () => (
  <HoneyBox as="footer" $backgroundColor="neutral.grayDark">
    <Container $gap={3} $padding={3}>
      <HoneyGrid columns={3} spacing={3}>
        <HoneyGridColumn $gap={1.5} $minWidth="250px">
          <Text as={Link} to="/" variant="h4" $color="neutral.white">
            Vextrix3D
          </Text>

          <Text variant="body1" $color="neutral.white">
            Precision. Layer by Layer.
          </Text>
        </HoneyGridColumn>

        <HoneyGridColumn $gap={1.5} $minWidth="250px">
          <Text variant="h6" $color="primary.aquaMintPulse">
            Quick Links
          </Text>

          <HoneyFlexBox $gap={1}>
            <Text as={Link} to="/terms-of-service" variant="body1" $color="neutral.white">
              Terms of Service
            </Text>

            <Text as={Link} to="/model-submission-policy" variant="body1" $color="neutral.white">
              Model Submission Policy
            </Text>

            <Text as={Link} to="/shipping-policy" variant="body1" $color="neutral.white">
              Shipping Policy
            </Text>

            <Text as={Link} to="/refund-policy" variant="body1" $color="neutral.white">
              Refund Policy
            </Text>

            <Text as={Link} to="/material-safety-disclaimer" variant="body1" $color="neutral.white">
              Material Safety Disclaimer
            </Text>

            <Text
              as={Link}
              to="/intellectual-property-policy"
              variant="body1"
              $color="neutral.white"
            >
              Intellectual Property Policy
            </Text>
          </HoneyFlexBox>
        </HoneyGridColumn>

        <HoneyGridColumn $gap={1.5} $minWidth="250px">
          <Text variant="h6" $color="primary.aquaMintPulse">
            Contact
          </Text>

          <HoneyFlexBox $gap={1}>
            <HoneyBox $display="flex" $gap={1} $alignItems="center">
              <PlaceIcon color="neutral.grayMedium" />

              <Text variant="body1" $color="neutral.white">
                Chelmsford, Essex
              </Text>
            </HoneyBox>

            <HoneyBox $display="flex" $gap={1} $alignItems="center">
              <MailIcon color="neutral.grayMedium" />

              <Text as="a" variant="body1" href={`mailto:${CONTACT_EMAIL}`} $color="neutral.white">
                {CONTACT_EMAIL}
              </Text>
            </HoneyBox>
          </HoneyFlexBox>
        </HoneyGridColumn>
      </HoneyGrid>

      <Text variant="body2" $textAlign="center" $color="neutral.grayMedium">
        © {new Date().getFullYear()} Vextrix3D - All rights reserved.
      </Text>
    </Container>
  </HoneyBox>
);
