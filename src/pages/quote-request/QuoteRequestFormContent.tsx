import React, { useMemo, useState } from 'react';
import { noop } from '@react-hive/honey-utils';
import { HoneyBox, HoneyFlex, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';
import { useHoneyFormContext } from '@react-hive/honey-form';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

import type { Nullable } from '~/types';
import type { EstimatedQuote } from '~/utils';
import { IS_LOCAL_ENV } from '~/configs';
import { estimateQuote, ModelLoaderError } from '~/utils';
import { useOnChange } from '~/models';
import { AttachFileIcon, ErrorIcon, SendIcon } from '~/icons';
import { Alert, Button, FilePicker, Progress, Text, TextInput } from '~/components';
import { FileCard } from '~/pages';
import { QuoteRequestFilaments } from './widgets';
import type { QuoteRequestFormData } from './quote-request-model';

interface QuoteRequestFormContentProps {
  estimatedQuote: Nullable<EstimatedQuote>;
  onEstimatedQuoteChange: (estimatedQuote: Nullable<EstimatedQuote>) => void;
}

export const QuoteRequestFormContent = ({
  estimatedQuote,
  onEstimatedQuoteChange,
}: QuoteRequestFormContentProps) => {
  const { formFields, formValues, isFormSubmitting } = useHoneyFormContext<QuoteRequestFormData>();

  const [isQuoteCalculating, setIsQuoteCalculating] = useState(false);

  const handleRemoveFile = () => {
    onEstimatedQuoteChange(null);

    formFields.file.setValue(undefined);
  };

  const calculateQuote = async (file: File, copies: number) => {
    try {
      setIsQuoteCalculating(true);

      const quote = await estimateQuote(
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
          copies,
          materialDensityGcm3: 1.04,
          materialPriceKg: 24.99,
          basePrintTimeHrs: 0.15,
          speedMm3PerSec: 12,
          machineCostPerHour: 0.7,
          min: 1.5,
          fixedFee: 0,
          markup: 0,
        },
      );

      console.info(quote);

      onEstimatedQuoteChange(quote);
    } catch (e) {
      console.error(e);

      toast(e instanceof ModelLoaderError ? e.message : 'Failed to calculate printing quote', {
        type: 'error',
      });
    } finally {
      setIsQuoteCalculating(false);
    }
  };

  const debouncedCalculateQuote = useMemo(() => debounce(calculateQuote, 350), []);

  useOnChange(
    useMemo(
      () => [formValues.file, formFields.copies.cleanValue] as const,
      [formValues.file, formFields.copies.cleanValue],
    ),
    ([file, copies]) => {
      if (file && copies) {
        debouncedCalculateQuote(file, copies)?.catch(noop);

        return debouncedCalculateQuote.cancel;
      }
    },
  );

  return (
    <HoneyFlex $gap={2}>
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

          <HoneyFlex $gap={0.5}>
            {formValues.file ? (
              <FileCard
                file={formValues.file}
                removeDisabled={isQuoteCalculating || isFormSubmitting}
                onRemove={handleRemoveFile}
              />
            ) : (
              <FilePicker
                ref={formFields.file.passiveProps?.ref}
                disabled={isFormSubmitting}
                onSelectFiles={files => formFields.file.setValue(files[0])}
                inputProps={{
                  multiple: false,
                }}
                accept={['*/*']}
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
          </HoneyFlex>

          <TextInput
            label="* First Name"
            disabled={isQuoteCalculating || isFormSubmitting}
            error={formFields.firstName.errors[0]?.message}
            {...formFields.firstName.props}
          />

          <TextInput
            label="* Last Name"
            disabled={isQuoteCalculating || isFormSubmitting}
            error={formFields.lastName.errors[0]?.message}
            {...formFields.lastName.props}
          />

          <TextInput
            label="* Email"
            disabled={isQuoteCalculating || isFormSubmitting}
            error={formFields.email.errors[0]?.message}
            {...formFields.email.props}
          />

          <TextInput
            label="* Description"
            disabled={isQuoteCalculating || isFormSubmitting}
            error={formFields.description.errors[0]?.message}
            multiline={true}
            {...formFields.description.props}
          />

          <TextInput
            label="* Copies"
            disabled={isQuoteCalculating || isFormSubmitting}
            error={formFields.copies.errors[0]?.message}
            $width={{ xs: '100%', sm: '180px' }}
            {...formFields.copies.props}
          />

          {IS_LOCAL_ENV && (
            <HoneyBox
              $display="flex"
              $gap={1}
              $alignItems="center"
              $flexWrap="wrap"
              $padding={1}
              $borderRadius="4px"
              $border="1px solid"
              $borderColor="neutral.grayLight"
            >
              <Text variant="body1">Estimated Printing Quote:</Text>

              {isQuoteCalculating ? (
                <Progress size="16px" lineWidth="2px" />
              ) : (
                <Text variant="body1">£{estimatedQuote?.total ?? 0} + (Shipping Fee)</Text>
              )}
            </HoneyBox>
          )}

          <Button
            loading={isFormSubmitting}
            disabled={isQuoteCalculating}
            type="submit"
            color="primary"
            icon={<SendIcon color="neutral.white" />}
            $marginLeft="auto"
          >
            Send
          </Button>
        </HoneyGridColumn>
      </HoneyGrid>
    </HoneyFlex>
  );
};
