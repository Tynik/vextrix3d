import React from 'react';
import type { PropsWithChildren } from 'react';
import { HoneyFlexBox } from '@react-hive/honey-layout';

import { Container, Text } from '~/components';
import { Header } from '~/pages';

interface PageProps {
  title: string;
}

export const Page = ({ children, title }: PropsWithChildren<PageProps>) => {
  return (
    <>
      <Header />

      <Container as="main" $padding={{ xs: 3, md: 5 }} $flexGrow={1}>
        <Text variant="h3" aria-label="Page title">
          {title}
        </Text>

        <HoneyFlexBox $marginTop={3}>{children}</HoneyFlexBox>
      </Container>
    </>
  );
};
