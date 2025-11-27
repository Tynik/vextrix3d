import React from 'react';
import type { PropsWithChildren } from 'react';

import { Container, Text } from '~/components';
import { Header } from '~/pages/sections';

interface PageProps {
  title: string;
}

export const Page = ({ children, title }: PropsWithChildren<PageProps>) => {
  return (
    <>
      <Header />

      <Container as="main" $padding={{ xs: 3, md: 5 }} $gap={1} $flexGrow={1}>
        <Text variant="h3">{title}</Text>

        {children}
      </Container>
    </>
  );
};
