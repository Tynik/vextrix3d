import React from 'react';
import { Link } from 'react-router-dom';
import { HoneyBox } from '@react-hive/honey-layout';

import { Container, Text } from '~/components';

export const Header = () => {
  return (
    <HoneyBox
      as="header"
      $position="sticky"
      $top={0}
      $display="flex"
      $alignItems="center"
      $flexShrink={0}
      $height="50px"
      $backgroundColor="neutral.grayDark"
      $zIndex={1}
    >
      <Container $padding={3}>
        <Text
          as={Link}
          to="/"
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
        </Text>
      </Container>
    </HoneyBox>
  );
};
