import React, { useMemo, useState } from 'react';
import { noop } from '@react-hive/honey-utils';
import { HoneyBox, HoneyFlex, HoneyGrid, HoneyGridColumn } from '@react-hive/honey-layout';
import { useHoneyFormContext } from '@react-hive/honey-form';
import { toast } from 'react-toastify';
import debounce from 'lodash.debounce';

import type { Nullable } from '~/types';
import type { PrintCostEstimate } from '~/utils';
import { IS_LOCAL_ENV } from '~/configs';
import { formatCurrency } from '~/shared';
import { estimatePrintCost, ModelLoaderError } from '~/utils';
import { useOnChange } from '~/models';
import { AttachFileIcon, ErrorIcon, SendIcon } from '~/icons';
import { Alert, Button, Checkbox, FilePicker, Progress, Text, TextInput } from '~/components';
import { FileCard, LegalDocumentPreview } from '~/pages';
import type { QuoteRequestFormContext, QuoteRequestFormData } from './quote-request-model';
import { QuoteRequestFilaments } from './widgets';

interface QuoteRequestFormContentProps {
  printCostEstimate: Nullable<PrintCostEstimate>;
  onEstimate: (printCostEstimate: Nullable<PrintCostEstimate>) => void;
}

export const QuoteRequestFormContent = ({
  printCostEstimate,
  onEstimate,
}: QuoteRequestFormContentProps) => {
  const { formFields, formValues, isFormSubmitting, formContext } = useHoneyFormContext<
    QuoteRequestFormData,
    QuoteRequestFormContext
  >();

  const [isPrintCostEstimating, setIsPrintCostEstimating] = useState(false);

  const handleRemoveFile = () => {
    onEstimate(null);

    formFields.file.setValue(undefined);
  };

  const calculateQuote = async (file: File, quantity: number) => {
    try {
      setIsPrintCostEstimating(true);

      const estimate = await estimatePrintCost(
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
          quantity,
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

      console.info(estimate);

      onEstimate(estimate);
    } catch (e) {
      console.error(e);

      toast(e instanceof ModelLoaderError ? e.message : 'Failed to calculate printing quote', {
        type: 'error',
      });
    } finally {
      setIsPrintCostEstimating(false);
    }
  };

  const debouncedCalculateQuote = useMemo(() => debounce(calculateQuote, 350), []);

  useOnChange(
    useMemo(
      () => [formValues.file, formFields.quantity.cleanValue] as const,
      [formValues.file, formFields.quantity.cleanValue],
    ),
    ([file, quantity]) => {
      if (file && quantity) {
        debouncedCalculateQuote(file, quantity)?.catch(noop);

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
          <Alert severity="info">
            <span>
              Supported file formats: <strong>*.3mf</strong>, <strong>*.obj</strong>, and{' '}
              <strong>*.stl</strong>. If your model is in another format, please convert it to one
              of these before uploading.
            </span>
          </Alert>

          <HoneyFlex $gap={0.5}>
            {formValues.file ? (
              <FileCard
                file={formValues.file}
                removeDisabled={isPrintCostEstimating || isFormSubmitting}
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
                <Button disabled={isFormSubmitting} as="div" variant="accent" size="large">
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
            disabled={
              Boolean(formContext.user?.firstName) || isPrintCostEstimating || isFormSubmitting
            }
            error={formFields.firstName.errors[0]?.message}
            {...formFields.firstName.props}
          />

          <TextInput
            label="* Last Name"
            disabled={
              Boolean(formContext.user?.lastName) || isPrintCostEstimating || isFormSubmitting
            }
            error={formFields.lastName.errors[0]?.message}
            {...formFields.lastName.props}
          />

          <TextInput
            label="* Email"
            disabled={Boolean(formContext.user?.email) || isPrintCostEstimating || isFormSubmitting}
            error={formFields.email.errors[0]?.message}
            {...formFields.email.props}
            inputProps={{
              autoComplete: 'new-email',
            }}
          />

          <TextInput
            label="* Phone"
            placeholder="07XXX XXXXXX"
            disabled={Boolean(formContext.user?.phone) || isPrintCostEstimating || isFormSubmitting}
            error={formFields.phone.errors[0]?.message}
            {...formFields.phone.props}
          />

          {!formContext.user && (
            <>
              <Checkbox
                label="Create an account to manage my quotes"
                checked={formValues.isCreateAccount}
                disabled={isPrintCostEstimating || isFormSubmitting}
                onChange={formFields.isCreateAccount.setValue}
              />

              {formValues.isCreateAccount && (
                <>
                  <TextInput
                    label="* Password"
                    disabled={isPrintCostEstimating || isFormSubmitting}
                    error={formFields.password.errors[0]?.message}
                    {...formFields.password.props}
                    inputProps={{
                      type: 'password',
                      autoComplete: 'new-password',
                    }}
                  />

                  <TextInput
                    label="* Repeat Password"
                    disabled={isPrintCostEstimating || isFormSubmitting}
                    error={formFields.repeatPassword.errors[0]?.message}
                    {...formFields.repeatPassword.props}
                    inputProps={{
                      type: 'password',
                      autoComplete: 'new-password',
                    }}
                  />
                </>
              )}
            </>
          )}

          <TextInput
            label="* Description"
            disabled={isPrintCostEstimating || isFormSubmitting}
            error={formFields.description.errors[0]?.message}
            multiline={true}
            {...formFields.description.props}
          />

          <TextInput
            label="* Quantity"
            disabled={isPrintCostEstimating || isFormSubmitting}
            error={formFields.quantity.errors[0]?.message}
            $width={{ xs: '100%', sm: '180px' }}
            {...formFields.quantity.props}
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
              <Text variant="body1">Estimated Printing Cost:</Text>

              {isPrintCostEstimating ? (
                <Progress size="16px" lineWidth="2px" />
              ) : (
                <Text variant="body1">
                  {formatCurrency(printCostEstimate?.total)} + (Shipping Fee)
                </Text>
              )}
            </HoneyBox>
          )}

          {!formContext.user && (
            <Checkbox
              label={
                <>
                  I agree to the <LegalDocumentPreview documentType="termsOfService" />,{' '}
                  <LegalDocumentPreview documentType="modelSubmission" />,{' '}
                  <LegalDocumentPreview documentType="materialSafetyDisclaimer" />
                  , and <LegalDocumentPreview documentType="privacyPolicy" />
                </>
              }
              checked={formValues.hasAcceptedLegalDocuments}
              disabled={isPrintCostEstimating || isFormSubmitting}
              error={formFields.hasAcceptedLegalDocuments.errors[0]?.message}
              onChange={formFields.hasAcceptedLegalDocuments.setValue}
            />
          )}

          <Button
            loading={isFormSubmitting}
            disabled={isPrintCostEstimating}
            type="submit"
            variant="primary"
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
