import React from 'react';
import { HoneyBox, HoneyFlexBox, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';

import { CONTACT_EMAIL } from '~/configs';
import { MailIcon, PlaceIcon, ReviewsIcon } from '~/icons';
import { Container, Text, Link } from '~/components';

export const Footer = () => (
  <HoneyBox as="footer" $backgroundColor="neutral.grayDark">
    <Container $gap={3} $padding={3}>
      <HoneyGrid columns={3} spacing={3}>
        <HoneyGridColumn $gap={1.5} $minWidth="250px">
          <Link to="/" variant="h4" $color="neutral.white">
            Vextrix3D
          </Link>

          <Text variant="body1" $color="neutral.white">
            Precision. Layer by Layer.
          </Text>

          <HoneyFlexBox $gap={1}>
            <Link
              to="https://uk.trustpilot.com/review/vextrix3d.co.uk"
              variant="body1"
              target="_blank"
              rel="noopener noreferrer"
              icon={<ReviewsIcon size="small" color="neutral.white" />}
              $color="neutral.white"
            >
              Trustpilot Reviews
            </Link>
          </HoneyFlexBox>
        </HoneyGridColumn>

        <HoneyGridColumn $gap={1.5} $minWidth="250px">
          <Text variant="h6" $color="primary.aquaMintPulse">
            Quick Links
          </Text>

          <HoneyFlexBox $gap={1}>
            <Link to="/terms-of-service" variant="body1" $color="neutral.white">
              Terms of Service
            </Link>

            <Link to="/model-submission-policy" variant="body1" $color="neutral.white">
              Model Submission Policy
            </Link>

            <Link to="/shipping-policy" variant="body1" $color="neutral.white">
              Shipping Policy
            </Link>

            <Link to="/refund-policy" variant="body1" $color="neutral.white">
              Refund Policy
            </Link>

            <Link to="/material-safety-disclaimer" variant="body1" $color="neutral.white">
              Material Safety Disclaimer
            </Link>

            <Link to="/intellectual-property-policy" variant="body1" $color="neutral.white">
              Intellectual Property Policy
            </Link>
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
