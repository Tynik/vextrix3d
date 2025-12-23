import React, { useCallback, useMemo, useState } from 'react';
import { HoneyBox, HoneyFlex } from '@react-hive/honey-layout';
import type {
  HoneyFormDefaultValues,
  HoneyFormFieldsConfig,
  HoneyFormOnSubmit,
} from '@react-hive/honey-form';
import { createHoneyFormNumberFilter } from '@react-hive/honey-form';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import type { Quote } from '~/netlify/types';
import { QUOTES_QUERY_KEY } from '~/configs';
import { handleApiError, sendQuote } from '~/api';
import { CheckIcon, CloseIcon, PlayArrowIcon } from '~/icons';
import type { ButtonProps } from '~/components';
import { Button, CueShadows, Dialog, Form, TextInput, Checkbox } from '~/components';

type ProcessQuoteFormData = {
  amount: number;
  applyDiscount: boolean;
  discount: number;
  includeVat: boolean;
  vat: number | undefined;
  note: string;
};

export const PROCESS_QUOTE_FORM_FIELDS: HoneyFormFieldsConfig<ProcessQuoteFormData> = {
  amount: {
    type: 'number',
    required: true,
    decimal: true,
    min: 1,
    max: 9999,
    filter: createHoneyFormNumberFilter({
      negative: false,
    }),
  },
  applyDiscount: {
    type: 'checkbox',
    defaultValue: false,
  },
  discount: {
    type: 'number',
    decimal: true,
    min: 0,
    max: 100,
    filter: createHoneyFormNumberFilter({
      negative: false,
    }),
    skip: ({ formValues }) => !formValues.applyDiscount,
  },
  includeVat: {
    type: 'checkbox',
    defaultValue: false,
  },
  vat: {
    type: 'number',
    decimal: true,
    min: 0,
    max: 30,
    defaultValue: 22,
    filter: createHoneyFormNumberFilter({
      negative: false,
    }),
    skip: ({ formValues }) => !formValues.includeVat,
  },
  note: {
    type: 'string',
    max: 100,
  },
};

interface ProcessQuoteButtonProps extends ButtonProps {
  quote: Quote;
}

export const ProcessQuoteButton = ({ quote, ...props }: ProcessQuoteButtonProps) => {
  const queryClient = useQueryClient();

  const [isProcess, setIsProcess] = useState(false);

  const processQuote: HoneyFormOnSubmit<ProcessQuoteFormData> = async data => {
    try {
      await sendQuote({
        quoteId: quote.id,
        pricing: {
          amount: data.amount,
          discountPct: data.discount,
          vatPct: data.vat ?? null,
        },
        note: data.note,
      });

      toast('Quote successfully processed.', {
        type: 'success',
      });

      await queryClient.invalidateQueries({
        queryKey: [QUOTES_QUERY_KEY],
      });
    } catch (e) {
      handleApiError(e);
    }
  };

  const handleClose = useCallback(() => {
    setIsProcess(false);
  }, []);

  const formDefaults = useMemo<HoneyFormDefaultValues<ProcessQuoteFormData>>(
    () => ({
      amount: quote.pricing?.amount,
    }),
    [quote],
  );

  return (
    <>
      <Button
        onClick={() => setIsProcess(true)}
        variant="primary"
        icon={<PlayArrowIcon color="neutral.white" />}
        {...props}
      >
        Process
      </Button>

      <Dialog title={`Process Quote #${quote.quoteNumber}`} open={isProcess} onClose={handleClose}>
        <Form fields={PROCESS_QUOTE_FORM_FIELDS} defaults={formDefaults} onSubmit={processQuote}>
          {({ formFields, formValues, isFormSubmitting }) => (
            <>
              <CueShadows $margin={-2} $padding={2}>
                <HoneyFlex $gap={2} $minWidth="300px">
                  <TextInput
                    label="* Amount"
                    disabled={isFormSubmitting}
                    error={formFields.amount.errors[0]?.message}
                    {...formFields.amount.props}
                  />

                  <Checkbox
                    label="Apply Discount"
                    checked={formValues.applyDiscount}
                    disabled={isFormSubmitting}
                    onChange={formFields.applyDiscount.setValue}
                  />

                  <TextInput
                    label="Discount, %"
                    disabled={!formValues.applyDiscount || isFormSubmitting}
                    error={formFields.discount.errors[0]?.message}
                    {...formFields.discount.props}
                  />

                  <Checkbox
                    label="Include VAT"
                    checked={formValues.includeVat}
                    disabled={isFormSubmitting}
                    onChange={formFields.includeVat.setValue}
                  />

                  <TextInput
                    label="VAT, %"
                    disabled={!formValues.includeVat || isFormSubmitting}
                    error={formFields.vat.errors[0]?.message}
                    {...formFields.vat.props}
                  />

                  <TextInput
                    label="Note"
                    disabled={isFormSubmitting}
                    error={formFields.note.errors[0]?.message}
                    {...formFields.note.props}
                  />
                </HoneyFlex>
              </CueShadows>

              <HoneyBox $display="flex" $gap={2} $paddingTop={2}>
                <Button
                  loading={isFormSubmitting}
                  type="submit"
                  variant="primary"
                  size="full"
                  icon={<CheckIcon color="neutral.white" />}
                >
                  Submit
                </Button>

                <Button
                  disabled={isFormSubmitting}
                  onClick={handleClose}
                  variant="secondary"
                  size="full"
                  icon={<CloseIcon color="neutral.white" />}
                >
                  Close
                </Button>
              </HoneyBox>
            </>
          )}
        </Form>
      </Dialog>
    </>
  );
};
