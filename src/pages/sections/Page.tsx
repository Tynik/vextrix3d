import React, { cloneElement } from 'react';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';

import type { IconProps } from '~/components';
import { Container, Divider, Text } from '~/components';

interface PageProps {
  title: ReactNode;
  icon?: ReactElement<IconProps>;
  contentProps?: HoneyFlexProps;
}

export const Page = ({ children, title, icon, contentProps }: PropsWithChildren<PageProps>) => {
  return (
    <>
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

        <HoneyFlex $marginTop={2} data-testid="page-content" {...contentProps}>
          {children}
        </HoneyFlex>
      </Container>
    </>
  );
};
