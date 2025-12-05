import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { HoneyFormOnSubmit } from '@react-hive/honey-form';
import { assert } from '@react-hive/honey-utils';
import { toast } from 'react-toastify';

import type { Nullable } from '~/types';
import type { EstimatedQuote } from '~/utils';
import { handleApiError, quoteRequest } from '~/api';
import { Form } from '~/components';
import { Page } from '~/pages';
import type { QuoteRequestFormData } from './quote-request-model';
import { QUOTE_REQUEST_FORM_FIELDS } from './quote-request-model';
import { QuoteRequestFormContent } from './QuoteRequestFormContent';

export const QuoteRequestPage = () => {
  const navigate = useNavigate();

  const [estimatedQuote, setEstimatedQuote] = useState<Nullable<EstimatedQuote>>(null);

  const submitQuoteRequest: HoneyFormOnSubmit<QuoteRequestFormData> = async data => {
    assert(data.file, 'File is required');

    try {
      const uploadModelUrl = await quoteRequest({
        fileName: data.file.name,
        contentType: data.file.type,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        description: data.description,
        copies: data.copies,
        estimatedQuote: {
          total: estimatedQuote?.total ?? 0,
        },
      });

      await fetch(uploadModelUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': data.file.type,
        },
        body: data.file,
      });

      toast('Quote request successfully submitted', {
        type: 'success',
      });

      navigate('/', {
        replace: true,
      });
    } catch (e) {
      handleApiError(e);
    }
  };

  return (
    <Page title="Quote Request">
      <Form fields={QUOTE_REQUEST_FORM_FIELDS} onSubmit={submitQuoteRequest}>
        <QuoteRequestFormContent
          estimatedQuote={estimatedQuote}
          onEstimatedQuoteChange={setEstimatedQuote}
        />
      </Form>
    </Page>
  );
};
