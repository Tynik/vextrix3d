import React from 'react';
import { HoneyBox, HoneyFlex } from '@react-hive/honey-layout';
import { styled } from '@react-hive/honey-style';

import { HEADER_HEIGHT_PX, ROUTE_PATHS, ROUTES } from '~/configs';
import { PersonIcon } from '~/icons';
import { Container, IconButton, Link } from '~/components';

const HeaderStyled = styled('header')`
  position: sticky;
  top: 0;
  z-index: 1;

  display: flex;
  align-items: center;
  height: ${HEADER_HEIGHT_PX}px;

  background-color: rgba(24, 24, 27, 0.95);

  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);

  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.04),
    0 2px 6px rgba(0, 0, 0, 0.18);

  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -10px;
    height: 10px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.18), transparent);
    filter: blur(8px);
    pointer-events: none;
  }
`;

export const Header = () => {
  return (
    <HeaderStyled>
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
            <IconButton
              variant="dark"
              icon={<PersonIcon />}
              iconProps={{
                color: 'neutral.white',
              }}
            />
          </Link>
        </HoneyFlex>
      </Container>
    </HeaderStyled>
  );
};
