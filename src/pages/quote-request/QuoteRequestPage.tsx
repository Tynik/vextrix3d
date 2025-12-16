import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {
  HoneyFormDefaultValues,
  HoneyFormOnAfterValidate,
  HoneyFormOnSubmit,
} from '@react-hive/honey-form';
import { assert } from '@react-hive/honey-utils';
import { toast } from 'react-toastify';

import type { Nullable } from '~/types';
import type { EstimatedQuote } from '~/utils';
import { scrollIntoView } from '~/utils';
import { HEADER_HEIGHT_PX } from '~/configs';
import { handleApiError, quoteRequest } from '~/api';
import { Form } from '~/components';
import { useAppContext } from '~/models';
import { Page } from '~/pages';
import type { QuoteRequestFormContext, QuoteRequestFormData } from './quote-request-model';
import { QUOTE_REQUEST_FORM_FIELDS } from './quote-request-model';
import { QuoteRequestFormContent } from './QuoteRequestFormContent';

export const QuoteRequestPage = () => {
  const navigate = useNavigate();
  const { user, isUserLoading } = useAppContext();

  const [estimatedQuote, setEstimatedQuote] = useState<Nullable<EstimatedQuote>>(null);

  const handleOnAfterValidateForm: HoneyFormOnAfterValidate<
    QuoteRequestFormData,
    QuoteRequestFormContext
  > = async ({ formFields, formErrors }) => {
    Object.keys(formErrors).some(fieldName => {
      const field = formFields[fieldName as keyof QuoteRequestFormData];
      const fieldRef = field.props?.ref ?? field.passiveProps?.ref;

      if (fieldRef?.current) {
        scrollIntoView(fieldRef.current, HEADER_HEIGHT_PX + 10);
        return true;
      }

      return false;
    });
  };

  const submitQuoteRequest: HoneyFormOnSubmit<
    QuoteRequestFormData,
    QuoteRequestFormContext
  > = async data => {
    assert(data.file, 'File is required');

    try {
      const uploadModelUrl = await quoteRequest({
        fileName: data.file.name,
        contentType: data.file.type,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? null,
        phone: null,
        password: data.password ?? null,
        description: data.description,
        quantity: data.quantity,
        pricing: {
          estimated: estimatedQuote?.total ?? 0,
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

  const formContext = useMemo<QuoteRequestFormContext>(() => ({ user }), [user]);

  const formDefaults = useMemo<HoneyFormDefaultValues<QuoteRequestFormData>>(
    () => ({ email: user?.email }),
    [user],
  );

  return (
    <Page title="Quote Request" loading={isUserLoading}>
      <Form
        fields={QUOTE_REQUEST_FORM_FIELDS}
        defaults={formDefaults}
        context={formContext}
        onAfterValidate={handleOnAfterValidateForm}
        onSubmit={submitQuoteRequest}
      >
        <QuoteRequestFormContent
          estimatedQuote={estimatedQuote}
          onEstimatedQuoteChange={setEstimatedQuote}
        />
      </Form>
    </Page>
  );
};
