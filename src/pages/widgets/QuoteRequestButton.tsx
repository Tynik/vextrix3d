import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { ButtonProps } from '~/components';
import { Button } from '~/components';

export const QuoteRequestButton = (props: ButtonProps) => {
  const navigate = useNavigate();

  return (
    <>
      <Button
        onClick={() => navigate('/quote-request')}
        variant="accent"
        size="large"
        $height="50px"
        {...props}
      >
        Get a Quote
      </Button>
    </>
  );
};
