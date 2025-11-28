import React from 'react';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyFlexBox } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import { handleApiError, netlifyRequest } from '~/api';
import { Button, FilePicker, TextInput } from '~/components';
import { Page } from './sections';
import { useNavigate } from 'react-router-dom';

type QuoteRequestFormData = {
  model: File;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
};

const QUOTE_REQUEST_FORM_FIELDS: HoneyFormFieldsConfig<QuoteRequestFormData> = {
  model: {
    type: 'file',
    required: true,
  },
  firstName: {
    type: 'string',
    required: true,
    max: 50,
  },
  lastName: {
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
    max: 5000,
  },
};

export const QuoteRequestPage = () => {
  const navigate = useNavigate();

  const handleSelectModel = async (files: File[]) => {
    // const quote = await calculateModelQuote(
    //   files[0],
    //   {
    //     infill: 0.15,
    //     walls: 2,
    //     topLayers: 5,
    //     bottomLayers: 5,
    //     layerHeight: 0.2,
    //     nozzleDiameter: 0.4,
    //   },
    //   {
    //     materialDensity: 1.04,
    //     materialPriceKg: 25,
    //     basePrintTime: 0.15,
    //     speedMm3PerSec: 12,
    //     machineCostPerHour: 0,
    //     fixedFee: 0,
    //     markup: 0,
    //   },
    // );
    //
    // console.log(quote);
  };

  const submitQuoteRequest: HoneyFormOnSubmit<QuoteRequestFormData> = async data => {
    const formData = new FormData();

    formData.append('model', data.model);
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('description', data.description);

    try {
      await netlifyRequest('quote-request', {
        method: 'POST',
        payload: formData,
      });

      toast('Quote request successfully submitted', {
        type: 'success',
      });

      navigate('/');
    } catch (e) {
      handleApiError(e);
    }
  };

  return (
    <Page title="Quote Request">
      <HoneyForm fields={QUOTE_REQUEST_FORM_FIELDS} onSubmit={submitQuoteRequest}>
        {({ formFields }) => (
          <HoneyFlexBox $gap={2}>
            <FilePicker
              accept={['.stl', '.obj', '.3mf']}
              inputProps={{
                multiple: false,
              }}
              onSelectFiles={files => formFields.model.setValue(files[0])}
            >
              <Button as="div" color="accent">
                Select Model
              </Button>
            </FilePicker>

            <TextInput
              label="First Name"
              error={formFields.firstName.errors[0]?.message}
              {...formFields.firstName.props}
            />

            <TextInput
              label="Last Name"
              error={formFields.lastName.errors[0]?.message}
              {...formFields.lastName.props}
            />

            <TextInput
              label="Email"
              error={formFields.email.errors[0]?.message}
              {...formFields.email.props}
            />

            <TextInput
              label="Description"
              error={formFields.description.errors[0]?.message}
              multiline={true}
              {...formFields.description.props}
            />

            <Button type="submit" color="success" $marginLeft="auto">
              Submit
            </Button>
          </HoneyFlexBox>
        )}
      </HoneyForm>
    </Page>
  );
};
