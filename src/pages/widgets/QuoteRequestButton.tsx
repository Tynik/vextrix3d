import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { ButtonProps } from '~/components';
import { Button } from '~/components';
import { ModelSubmissionPolicyDialog } from './ModelSubmissionPolicyDialog';

export const QuoteRequestButton = (props: ButtonProps) => {
  const navigate = useNavigate();

  const [isShowModelSubmissionPolicy, setIsShowModelSubmissionPolicy] = useState(false);

  const handleCloseSubmissionPolicyAcceptance = useCallback(() => {
    setIsShowModelSubmissionPolicy(false);
  }, []);

  return (
    <>
      <Button
        color="accent"
        size="large"
        onClick={() => setIsShowModelSubmissionPolicy(true)}
        $height="50px"
        {...props}
      >
        Get a Quote
      </Button>

      <ModelSubmissionPolicyDialog
        open={isShowModelSubmissionPolicy}
        onContinue={() => navigate('/quote-request')}
        onClose={handleCloseSubmissionPolicyAcceptance}
      />
    </>
  );
};
