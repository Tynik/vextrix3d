import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyFlex } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import { FIREBASE_AUTH_ERRORS, ROUTES } from '~/configs';
import type { SignUpRequestError } from '~/api';
import { handleApiError, signUpRequest } from '~/api';
import { CheckIcon } from '~/icons';
import { Button, Form, Link, TextInput } from '~/components';
import { Page } from '~/pages';

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

      toast('Welcome! Your account has been created. Please sign in to continue.');

      navigate(ROUTES.auth.signIn, {
        replace: true,
      });
    } catch (e) {
      const error = e as SignUpRequestError;
      const errorCode = error.data.error.code;

      if (error.data.error.name === 'FirebaseError' && errorCode) {
        toast(FIREBASE_AUTH_ERRORS[errorCode] ?? 'Failed to sign up', {
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
        centerY: true,
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

            <HoneyFlex row centerY $gap={2} $justifyContent="space-between">
              <Link
                to={ROUTES.auth.signIn}
                variant="body2"
                $display="flex"
                $width="100%"
                $color="secondary.slateAlloy"
              >
                <Button variant="secondary" size="full" icon={<CheckIcon color="neutral.white" />}>
                  Sign In
                </Button>
              </Link>

              <Button
                loading={isFormSubmitting}
                type="submit"
                variant="primary"
                size="full"
                icon={<CheckIcon color="neutral.white" />}
                $marginLeft="auto"
              >
                Sign Up
              </Button>
            </HoneyFlex>
          </HoneyFlex>
        )}
      </Form>
    </Page>
  );
};
