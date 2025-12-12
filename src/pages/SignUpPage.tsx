import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyFlex } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import { ROUTES } from '~/configs';
import type { SignUpRequestError, SignUpRequestErrorCode } from '~/api';
import { handleApiError, signUpRequest } from '~/api';
import { CheckIcon } from '~/icons';
import { Button, Form, TextInput } from '~/components';
import { Page } from '~/pages';

const ERRORS_CONFIG: Record<SignUpRequestErrorCode, string> = {
  'auth/email-already-in-use': 'Email is already in use',
  'auth/invalid-email': 'Invalid email',
  'auth/weak-password': 'Password must be at least 6 characters',
};

type SignUpFormData = {
  email: string;
  password: string;
  repeatPassword: string;
};

const SIGN_UP_FORM_FIELDS: HoneyFormFieldsConfig<SignUpFormData> = {
  email: {
    type: 'email',
    required: true,
    mode: 'blur',
    max: 255,
  },
  password: {
    type: 'string',
    required: true,
    mode: 'blur',
    min: 6,
    max: 255,
  },
  repeatPassword: {
    type: 'string',
    required: true,
    mode: 'blur',
    validator: (value, { formValues }) =>
      value === formValues.password || 'Passwords must be equal',
  },
};

export const SignUpPage = () => {
  const navigate = useNavigate();

  const signUp: HoneyFormOnSubmit<SignUpFormData> = async data => {
    try {
      await signUpRequest({
        email: data.email,
        password: data.password,
      });

      navigate(ROUTES.auth.signIn, {
        replace: true,
      });
    } catch (e) {
      const error = e as SignUpRequestError;
      const errorCode = error.data.error.code;

      if (error.data.error.name === 'FirebaseError' && errorCode) {
        toast(ERRORS_CONFIG[errorCode] ?? 'Failed to sign up', {
          type: 'error',
        });
      } else {
        handleApiError(e);
      }
    }
  };

  return (
    <Page
      title="Sign Up"
      contentProps={{
        $flexGrow: 1,
        $justifyContent: 'center',
      }}
    >
      <Form fields={SIGN_UP_FORM_FIELDS} onSubmit={signUp}>
        {({ formFields, isFormSubmitting }) => (
          <HoneyFlex $gap={2} $width="100%" $maxWidth="300px" $margin={[0, 'auto']}>
            <TextInput
              label="* Email"
              disabled={isFormSubmitting}
              error={formFields.email.errors[0]?.message}
              {...formFields.email.props}
            />

            <TextInput
              label="* Password"
              disabled={isFormSubmitting}
              error={formFields.password.errors[0]?.message}
              {...formFields.password.props}
              inputProps={{
                type: 'password',
              }}
            />

            <TextInput
              label="* Repeat Password"
              disabled={isFormSubmitting}
              error={formFields.repeatPassword.errors[0]?.message}
              {...formFields.repeatPassword.props}
              inputProps={{
                type: 'password',
              }}
            />

            <Button
              loading={isFormSubmitting}
              disabled={isFormSubmitting}
              type="submit"
              color="primary"
              icon={<CheckIcon color="neutral.white" />}
              $marginLeft="auto"
            >
              Sign Up
            </Button>
          </HoneyFlex>
        )}
      </Form>
    </Page>
  );
};
