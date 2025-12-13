import React from 'react';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { HoneyBox, HoneyFlex, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';

import { CONTACT_EMAIL, ROUTES } from '~/configs';
import { MailIcon, PlaceIcon, ReviewsIcon } from '~/icons';
import { Container, Text, Link } from '~/components';

export const Footer = (props: HoneyBoxProps) => (
  <HoneyBox as="footer" $backgroundColor="neutral.grayDark" {...props}>
    <Container $gap={3} $padding={3}>
      <HoneyGrid columns={3} spacing={3}>
        <HoneyGridColumn $gap={1.5} $minWidth="250px">
          <Link to={ROUTES.home} variant="h4" $color="neutral.white">
            Vextrix3D
          </Link>

          <Text variant="body1" $color="neutral.white">
            Precision. Layer by Layer.
          </Text>

          <HoneyFlex $gap={1}>
            <Link
              to="https://uk.trustpilot.com/review/vextrix3d.co.uk"
              variant="body1"
              target="_blank"
              rel="noopener noreferrer"
              icon={<ReviewsIcon color="neutral.grayMedium" />}
              $color="neutral.white"
            >
              Trustpilot Reviews
            </Link>
          </HoneyFlex>
        </HoneyGridColumn>

        <HoneyGridColumn $gap={1.5} $minWidth="250px">
          <Text variant="h6" $color="primary.aquaMintPulse">
            Quick Links
          </Text>

          <HoneyFlex $gap={1}>
            <Link to={ROUTES.legal.terms} variant="body1" $color="neutral.white">
              Terms of Service
            </Link>

            <Link to={ROUTES.legal.modelSubmission} variant="body1" $color="neutral.white">
              Model Submission Policy
            </Link>

            <Link to={ROUTES.legal.shipping} variant="body1" $color="neutral.white">
              Shipping Policy
            </Link>

            <Link to={ROUTES.legal.refund} variant="body1" $color="neutral.white">
              Refund Policy
            </Link>

            <Link to={ROUTES.legal.safety} variant="body1" $color="neutral.white">
              Material Safety Disclaimer
            </Link>

            <Link to={ROUTES.legal.ip} variant="body1" $color="neutral.white">
              Intellectual Property Policy
            </Link>
          </HoneyFlex>
        </HoneyGridColumn>

        <HoneyGridColumn $gap={1.5} $minWidth="250px">
          <Text variant="h6" $color="primary.aquaMintPulse">
            Contact
          </Text>

          <HoneyFlex $gap={1}>
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
          </HoneyFlex>
        </HoneyGridColumn>
      </HoneyGrid>

      <Text variant="body2" $textAlign="center" $color="neutral.grayMedium">
        © {new Date().getFullYear()} Vextrix3D - All rights reserved.
      </Text>
    </Container>
  </HoneyBox>
);
