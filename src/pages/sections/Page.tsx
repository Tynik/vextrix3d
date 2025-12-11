import React, { cloneElement } from 'react';
import type { PropsWithChildren, ReactElement } from 'react';
import type { HoneyFlexBoxProps } from '@react-hive/honey-layout';
import { HoneyFlexBox } from '@react-hive/honey-layout';

import type { IconProps } from '~/components';
import { Container, Divider, Text } from '~/components';
import { Header } from '~/pages';

interface PageProps {
  title: string;
  icon?: ReactElement<IconProps>;
  contentProps?: HoneyFlexBoxProps;
}

export const Page = ({ children, title, icon, contentProps }: PropsWithChildren<PageProps>) => {
  return (
    <>
      <Header />

      <Container as="main" $padding={3} $gap={1} $flexGrow={1}>
        <Text variant="h3" $display="flex" $gap={1} $alignItems="center" aria-label="Page title">
          {icon &&
            cloneElement(icon, {
              size: 'large',
              color: 'secondary.carbonInk',
            })}

          {title}
        </Text>

        <Divider />

        <HoneyFlexBox $marginTop={2} data-testid="page-content" {...contentProps}>
          {children}
        </HoneyFlexBox>
      </Container>
    </>
  );
};
