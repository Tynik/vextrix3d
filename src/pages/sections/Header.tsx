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
      <Container $padding={{ xs: 3, md: 5 }}>
        <Text as={Link} to="/" variant="h4" $color="neutral.white">
          Vextrix3D
        </Text>
      </Container>
    </HoneyBox>
  );
};
