import type { HoneyFormFieldsConfig } from '@react-hive/honey-form';

import type { Nullable } from '~/types';
import type { User } from '~/api';

export type QuoteRequestFormData = {
  file: File | undefined;
  firstName: string;
  lastName: string;
  email: string | undefined;
  isCreateAccount: boolean | undefined;
  phone: string | undefined;
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
    skip: ({ formContext }) => Boolean(formContext.user?.firstName),
  },
  lastName: {
    type: 'string',
    required: true,
    max: 50,
    skip: ({ formContext }) => Boolean(formContext.user?.lastName),
  },
  email: {
    type: 'email',
    required: true,
    mode: 'blur',
    max: 255,
    skip: ({ formContext }) => Boolean(formContext.user?.email),
  },
  isCreateAccount: {
    type: 'checkbox',
    defaultValue: true,
    skip: ({ formContext }) => Boolean(formContext.user),
  },
  phone: {
    type: 'string',
    required: true,
    filter: value => value?.replace(/\D/g, '').slice(0, 11),
    formatter: value => {
      if (!value) {
        return value;
      }

      // Expect 11 digits starting with 07
      if (!/^07\d{9}$/.test(value)) {
        return value;
      }

      return `${value.slice(0, 5)} ${value.slice(5)}`;
    },
    skip: ({ formValues }) => !formValues.isCreateAccount,
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
