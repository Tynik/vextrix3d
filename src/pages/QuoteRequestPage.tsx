import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyBox, HoneyFlexBox, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';
import { assert } from '@react-hive/honey-utils';
import { toast } from 'react-toastify';

import { handleApiError, quoteRequest } from '~/api';
import { AttachFileIcon, ErrorIcon, SendIcon } from '~/icons';
import { Alert, Button, FilePicker, Form, Scale, Text, TextInput } from '~/components';
import { Page } from './sections';
import { FileCard } from './widgets';
import { FILAMENTS } from '~/configs';
import { useFilaments } from '~/hooks';

type QuoteRequestFormData = {
  model: File | undefined;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
};

const QUOTE_REQUEST_FORM_FIELDS: HoneyFormFieldsConfig<QuoteRequestFormData> = {
  model: {
    type: 'file',
    required: true,
    validator: model =>
      (model?.size ?? 0) < 250 * 1024 * 1024 || 'Model size must be less than 250MB',
    errorMessages: {
      required: 'Model is required',
    },
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

  const { filamentPriceRange } = useFilaments();

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
    assert(data.model, 'Model is required');

    try {
      const uploadModelUrl = await quoteRequest({
        fileName: data.model.name,
        contentType: data.model.type,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        description: data.description,
      });

      await fetch(uploadModelUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': data.model.type,
        },
        body: data.model,
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
        {({ formValues, formFields, isFormSubmitting }) => (
          <HoneyFlexBox $gap={2}>
            <HoneyGrid columns={2} spacing={2}>
              <HoneyGridColumn $gap={2} $minWidth="350px">
                <Alert variant="info">We support *.3mf, *.obj and *.stl files</Alert>

                <HoneyFlexBox $gap={0.5}>
                  {formValues.model ? (
                    <FileCard
                      file={formValues.model}
                      onRemove={() => formFields.model.setValue(undefined)}
                    />
                  ) : (
                    <FilePicker
                      accept={['*/*']}
                      inputProps={{
                        multiple: false,
                      }}
                      onSelectFiles={files => formFields.model.setValue(files[0])}
                    >
                      <Button as="div" color="accent" size="large">
                        <AttachFileIcon size="small" color="neutral.white" />
                        Select Model
                      </Button>
                    </FilePicker>
                  )}

                  {formFields.model.errors.length > 0 && (
                    <HoneyBox $display="flex" $gap={0.5} $alignItems="center">
                      <ErrorIcon size="small" color="error.signalCoral" />

                      <Text variant="caption1" $color="error.crimsonRed" aria-label="File error">
                        {formFields.model.errors[0]?.message}
                      </Text>
                    </HoneyBox>
                  )}
                </HoneyFlexBox>

                <TextInput
                  label="* First Name"
                  error={formFields.firstName.errors[0]?.message}
                  {...formFields.firstName.props}
                />

                <TextInput
                  label="* Last Name"
                  error={formFields.lastName.errors[0]?.message}
                  {...formFields.lastName.props}
                />

                <TextInput
                  label="* Email"
                  error={formFields.email.errors[0]?.message}
                  {...formFields.email.props}
                />

                <TextInput
                  label="* Description"
                  error={formFields.description.errors[0]?.message}
                  multiline={true}
                  {...formFields.description.props}
                />
              </HoneyGridColumn>

              <HoneyGridColumn $gap={2}>
                <HoneyBox
                  $display="grid"
                  $gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  $gap={2}
                  $flexWrap="wrap"
                >
                  {FILAMENTS.map(filament => (
                    <HoneyFlexBox
                      key={filament.name}
                      $gap={1}
                      $minHeight="150px"
                      $padding={2}
                      $borderRadius="4px"
                      $border="1px solid"
                      $borderColor="neutral.grayLight"
                    >
                      <Text variant="subtitle1">{filament.name}</Text>
                      <Text variant="body1">{filament.shortDescription}</Text>

                      {filament.price && (
                        <Scale
                          label="Price"
                          min={filamentPriceRange.min}
                          max={filamentPriceRange.max}
                          value={filament.price * (filament.difficulty ?? 1)}
                        />
                      )}
                    </HoneyFlexBox>
                  ))}
                </HoneyBox>
              </HoneyGridColumn>
            </HoneyGrid>

            <Button
              loading={isFormSubmitting}
              disabled={isFormSubmitting}
              type="submit"
              color="primary"
              icon={<SendIcon color="neutral.white" />}
              $marginLeft="auto"
            >
              Send
            </Button>
          </HoneyFlexBox>
        )}
      </Form>
    </Page>
  );
};
