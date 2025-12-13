import React from 'react';
import { HoneyBox, HoneyFlex } from '@react-hive/honey-layout';

import { HEADER_HEIGHT_PX, ROUTE_PATHS, ROUTES } from '~/configs';
import { PersonIcon } from '~/icons';
import { Container, IconButton, Link } from '~/components';

export const Header = () => {
  return (
    <HoneyBox
      as="header"
      $position="sticky"
      $top={0}
      $display="flex"
      $alignItems="center"
      $flexShrink={0}
      $height={`${HEADER_HEIGHT_PX}px`}
      $backgroundColor="neutral.grayDark"
      $zIndex={1}
    >
      <Container $padding={3}>
        <HoneyFlex row center>
          <Link
            to={ROUTES.home}
            variant="h4"
            $display="flex"
            $gap={1}
            $alignItems="center"
            $color="neutral.white"
          >
            <HoneyBox
              $width="36px"
              $height="36px"
              $background="url('/assets/images/logo.png')"
              $backgroundSize="cover"
            />
            Vextrix3D
          </Link>

          <Link to={ROUTE_PATHS.accountProfile} variant="body1" $marginLeft="auto">
            <IconButton variant="dark">
              <PersonIcon size="medium" color="neutral.white" />
            </IconButton>
          </Link>
        </HoneyFlex>
      </Container>
    </HoneyBox>
  );
};
