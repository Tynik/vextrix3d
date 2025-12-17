import React, { cloneElement } from 'react';
import type { PropsWithChildren, ReactElement, ReactNode } from 'react';
import { isString } from '@react-hive/honey-utils';
import type { HoneyFlexProps } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';

import type { IconProps } from '~/components';
import { Container, Divider, Text, Progress } from '~/components';

interface PageProps {
  title: ReactNode;
  loading?: boolean;
  icon?: ReactElement<IconProps>;
  contentProps?: HoneyFlexProps;
}

export const Page = ({
  children,
  title,
  loading = false,
  icon,
  contentProps,
}: PropsWithChildren<PageProps>) => {
  return (
    <>
      <Container as="main" $padding={3} $gap={1} $flexGrow={1}>
        <Text
          as={isString(title) ? 'h1' : undefined}
          variant="h3"
          $display="flex"
          $gap={1}
          $alignItems="center"
          aria-label="Page title"
        >
          {icon &&
            cloneElement(icon, {
              size: 'large',
              color: 'secondary.carbonInk',
            })}

          {title}
        </Text>

        <Divider />

        <HoneyFlex $marginTop={2} $flexGrow={1} data-testid="page-content" {...contentProps}>
          {loading ? <Progress $margin="auto" /> : children}
        </HoneyFlex>
      </Container>
    </>
  );
};
