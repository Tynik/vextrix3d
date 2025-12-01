import type { HoneyFormFieldsConfig } from '@react-hive/honey-form';

export type QuoteRequestFormData = {
  model: File | undefined;
  firstName: string;
  lastName: string;
  email: string;
  description: string;
};

export const QUOTE_REQUEST_FORM_FIELDS: HoneyFormFieldsConfig<QuoteRequestFormData> = {
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
