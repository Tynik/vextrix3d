import React, { useState } from 'react';
import { HoneyBox } from '@react-hive/honey-layout';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';

import { netlifyRequest, handleApiError } from '~/api';
import { Button, CueShadows, Dialog } from '~/components';
import { ModelSubmissionPolicyContent } from './ModelSubmissionPolicyContent';

type CalculateQuoteFormData = {
  fullName: string;
  email: string;
  description: string;
};

const CALCULATE_QUOTE_FORM_FIELDS: HoneyFormFieldsConfig<CalculateQuoteFormData> = {
  fullName: {
    type: 'string',
    required: true,
    max: 50,
  },
  email: {
    type: 'email',
    required: true,
    mode: 'blur',
    max: 255,
  },
  description: {
    type: 'string',
    required: true,
    max: 1000,
  },
};

export const GetQuoteButton = () => {
  const [isShowModelSubmissionPolicy, setIsShowModelSubmissionPolicy] = useState(false);

  const calculateQuote = async () => {
    try {
      await netlifyRequest('calculate-quote', {
        method: 'POST',
        payload: {
          fullName: 'Mike', //data.fullName,
          email: 'm.aliynik@gmail.com', //data.email,
          description: 'Test', //data.description,
        },
      });
    } catch (e) {
      handleApiError(e);
    }
  };

  return (
    <>
      <Button
        color="accent"
        size="large"
        onClick={() => setIsShowModelSubmissionPolicy(true)}
        $height="50px"
      >
        Get a Quote
      </Button>

      <Dialog
        title="Model Submission Policy"
        open={isShowModelSubmissionPolicy}
        onClose={() => setIsShowModelSubmissionPolicy(false)}
      >
        <CueShadows $margin={-2} $padding={2}>
          <ModelSubmissionPolicyContent />
        </CueShadows>

        <HoneyBox
          $display="flex"
          $gap={2}
          $justifyContent="flex-end"
          $paddingTop={2}
          $marginTop={3}
        >
          <Button color="accent" onClick={() => calculateQuote()}>
            Agree
          </Button>

          <Button color="secondary" onClick={() => setIsShowModelSubmissionPolicy(false)}>
            Close
          </Button>
        </HoneyBox>
      </Dialog>
    </>
  );
};
