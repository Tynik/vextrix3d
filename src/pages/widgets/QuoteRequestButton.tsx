import React from 'react';

import { ROUTES } from '~/configs';
import type { LinkProps } from '~/components';
import { Link, Button } from '~/components';

export const QuoteRequestButton = (props: Omit<LinkProps, 'to' | 'variant'>) => {
  return (
    <Link to={ROUTES.quoteRequest} variant="body2" {...props}>
      <Button variant="accent" size="large" $height="50px">
        Get a Quote
      </Button>
    </Link>
  );
};
