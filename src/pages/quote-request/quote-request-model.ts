import type { HoneyFormFieldsConfig } from '@react-hive/honey-form';

import type { Nullable } from '~/types';
import type { User } from '~/api';

export type QuoteRequestFormData = {
  file: File | undefined;
  firstName: string;
  lastName: string;
  email: string | undefined;
  isCreateAccount: boolean | undefined;
  password: string | undefined;
  repeatPassword: string;
  description: string;
  quantity: number;
};

export type QuoteRequestFormContext = {
  user: Nullable<User>;
};

export const QUOTE_REQUEST_FORM_FIELDS: HoneyFormFieldsConfig<
  QuoteRequestFormData,
  QuoteRequestFormContext
> = {
  file: {
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
    skip: ({ formContext }) => Boolean(formContext.user),
  },
  isCreateAccount: {
    type: 'checkbox',
    defaultValue: true,
    skip: ({ formContext }) => Boolean(formContext.user),
  },
  password: {
    type: 'string',
    required: true,
    mode: 'blur',
    min: 6,
    max: 255,
    skip: ({ formValues }) => !formValues.isCreateAccount,
  },
  repeatPassword: {
    type: 'string',
    required: true,
    mode: 'blur',
    validator: (value, { formValues }) =>
      value === formValues.password || 'Passwords must be equal',
    skip: ({ formValues }) => !formValues.isCreateAccount,
  },
  description: {
    type: 'string',
    required: true,
    max: 5000,
  },
  quantity: {
    type: 'number',
    required: true,
    min: 1,
    max: 250,
    defaultValue: 1,
  },
};
