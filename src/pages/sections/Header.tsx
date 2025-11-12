import React from 'react';
import { HoneyFlexBox } from '@react-hive/honey-layout';

export const Header = () => {
  return (
    <HoneyFlexBox
      as="header"
      $height="50px"
      $flexShrink={0}
      $backgroundColor="neutral.grayDark"
    ></HoneyFlexBox>
  );
};
