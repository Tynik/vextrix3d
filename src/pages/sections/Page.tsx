import React from 'react';
import type { PropsWithChildren } from 'react';
import { Container } from '~/components';
import { Header } from '~/pages/sections';

export const Page = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />

      <Container as="main" $padding={{ xs: 3, md: 5 }} $gap={1} $flexGrow={1}>
        {children}
      </Container>
    </>
  );
};
