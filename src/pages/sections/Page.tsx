import React from 'react';
import type { PropsWithChildren } from 'react';
import type { HoneyFlexBoxProps } from '@react-hive/honey-layout';
import { HoneyFlexBox } from '@react-hive/honey-layout';

import { Container, Divider, Text } from '~/components';
import { Header } from '~/pages';

interface PageProps {
  title: string;
  contentProps?: HoneyFlexBoxProps;
}

export const Page = ({ children, title, contentProps }: PropsWithChildren<PageProps>) => {
  return (
    <>
      <Header />

      <Container as="main" $padding={3} $gap={1} $flexGrow={1}>
        <Text variant="h3" aria-label="Page title">
          {title}
        </Text>

        <Divider />

        <HoneyFlexBox $marginTop={2} {...contentProps}>
          {children}
        </HoneyFlexBox>
      </Container>
    </>
  );
};
