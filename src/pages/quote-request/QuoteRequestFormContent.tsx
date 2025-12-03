import React, { useState } from 'react';
import { HoneyBox, HoneyFlexBox, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';
import { useHoneyFormContext } from '@react-hive/honey-form';
import { toast } from 'react-toastify';

import type { Nullable } from '~/types';
import type { EstimatedPrintingQuote } from '~/utils';
import { estimatePrintingQuote, ModelLoaderError } from '~/utils';
import { AttachFileIcon, ErrorIcon, SendIcon } from '~/icons';
import { Alert, Button, FilePicker, Text, TextInput } from '~/components';
import { FileCard } from '~/pages';
import { QuoteRequestFilaments } from './widgets';
import type { QuoteRequestFormData } from './quote-request-model';

export const QuoteRequestFormContent = () => {
  const { formFields, formValues, isFormSubmitting } = useHoneyFormContext<QuoteRequestFormData>();

  const [estimatedPrintingQuote, setEstimatedPrintingQuote] =
    useState<Nullable<EstimatedPrintingQuote>>(null);

  const handleSelectFiles = async (files: File[]) => {
    const file = files[0];

    formFields.file.setValue(file);

    // await calculatePrintingQuote(file);
  };

  const handleRemoveFile = () => {
    setEstimatedPrintingQuote(null);

    formFields.file.setValue(undefined);
  };

  const calculatePrintingQuote = async (file: File) => {
    try {
      const estimatedPrintingQuote = await estimatePrintingQuote(
        file,
        {
          infill: 0.15,
          walls: 2,
          topLayers: 3,
          bottomLayers: 3,
          layerHeightMm: 0.2,
          nozzleDiameterMm: 0.4,
        },
        {
          materialDensity: 1.04,
          materialPriceKg: 24.99,
          basePrintTime: 0.15,
          speedMm3PerSec: 12,
          machineCostPerHour: 0.7,
          fixedFee: 0,
          markup: 0,
        },
      );

      console.info(estimatedPrintingQuote);

      setEstimatedPrintingQuote(estimatedPrintingQuote);
    } catch (e) {
      console.error(e);

      toast(e instanceof ModelLoaderError ? e.message : 'Failed to calculate printing quote', {
        type: 'error',
      });
    }
  };

  return (
    <HoneyFlexBox $gap={2}>
      <HoneyGrid columns={2} spacing={3}>
        <HoneyGridColumn $gap={2}>
          <HoneyBox
            $display="grid"
            $gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
            $gap={2}
            $flexWrap="wrap"
          >
            <QuoteRequestFilaments />
          </HoneyBox>
        </HoneyGridColumn>

        <HoneyGridColumn $gap={2} $minWidth="300px">
          <Alert variant="info">We support *.3mf, *.obj and *.stl files</Alert>

          <HoneyFlexBox $gap={0.5}>
            {formValues.file ? (
              <FileCard file={formValues.file} onRemove={handleRemoveFile} />
            ) : (
              <FilePicker
                accept={['*/*']}
                disabled={isFormSubmitting}
                inputProps={{
                  multiple: false,
                }}
                onSelectFiles={handleSelectFiles}
              >
                <Button disabled={isFormSubmitting} as="div" color="accent" size="large">
                  <AttachFileIcon size="small" color="neutral.white" />
                  Select Model
                </Button>
              </FilePicker>
            )}

            {formFields.file.errors.length > 0 && (
              <HoneyBox $display="flex" $gap={0.5} $alignItems="center">
                <ErrorIcon size="small" color="error.signalCoral" />

                <Text variant="caption1" $color="error.crimsonRed" aria-label="File error">
                  {formFields.file.errors[0]?.message}
                </Text>
              </HoneyBox>
            )}
          </HoneyFlexBox>

          <TextInput
            label="* First Name"
            disabled={isFormSubmitting}
            error={formFields.firstName.errors[0]?.message}
            {...formFields.firstName.props}
          />

          <TextInput
            label="* Last Name"
            disabled={isFormSubmitting}
            error={formFields.lastName.errors[0]?.message}
            {...formFields.lastName.props}
          />

          <TextInput
            label="* Email"
            disabled={isFormSubmitting}
            error={formFields.email.errors[0]?.message}
            {...formFields.email.props}
          />

          <TextInput
            label="* Description"
            disabled={isFormSubmitting}
            error={formFields.description.errors[0]?.message}
            multiline={true}
            {...formFields.description.props}
          />

          {/*<Text variant="body1">*/}
          {/*  Estimated Printing Quote: £{estimatedPrintingQuote?.total ?? 0}*/}
          {/*</Text>*/}

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
        </HoneyGridColumn>
      </HoneyGrid>
    </HoneyFlexBox>
  );
};
