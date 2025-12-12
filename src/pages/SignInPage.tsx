import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyFlex } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import { ROUTES } from '~/configs';
import type { SignInRequestError, SignInRequestErrorCode } from '~/api';
import { handleApiError, signInRequest } from '~/api';
import { useQueryParams } from '~/models';
import { CheckIcon } from '~/icons';
import { Button, Form, TextInput } from '~/components';
import { Page } from '~/pages';

const ERRORS_CONFIG: Record<SignInRequestErrorCode, string> = {
  'auth/invalid-credential': 'Invalid email or password',
};

type SignInFormData = {
  email: string;
  password: string;
};

const SIGN_IN_FORM_FIELDS: HoneyFormFieldsConfig<SignInFormData> = {
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
};

export const SignInPage = () => {
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const signIn: HoneyFormOnSubmit<SignInFormData> = async data => {
    try {
      await signInRequest({
        email: data.email,
        password: data.password,
      });

      const redirectPath = queryParams.get('redirect') || ROUTES.home;

      navigate(decodeURIComponent(redirectPath), {
        replace: true,
      });
    } catch (e) {
      const error = e as SignInRequestError;
      const errorCode = error.data.error.code;

      if (error.data.error.name === 'FirebaseError' && errorCode) {
        toast(ERRORS_CONFIG[errorCode] ?? 'Failed to sign in', {
          type: 'error',
        });
      } else {
        handleApiError(e);
      }
    }
  };

  return (
    <Page
      title="Sign In"
      contentProps={{
        $flexGrow: 1,
        $justifyContent: 'center',
      }}
    >
      <Form fields={SIGN_IN_FORM_FIELDS} onSubmit={signIn}>
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

            <Button
              loading={isFormSubmitting}
              type="submit"
              color="primary"
              icon={<CheckIcon color="neutral.white" />}
              $marginLeft="auto"
            >
              Sign In
            </Button>
          </HoneyFlex>
        )}
      </Form>
    </Page>
  );
};
