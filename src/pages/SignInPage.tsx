import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyFlexBox } from '@react-hive/honey-layout';
import { toast } from 'react-toastify';

import type { SignInRequestError, SignInRequestErrorCode } from '~/api';
import { handleApiError, signInRequest } from '~/api';
import { CheckIcon } from '~/icons';
import { Button, Form, TextInput } from '~/components';
import { Page } from '~/pages';

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

  const signIn: HoneyFormOnSubmit<SignInFormData> = async data => {
    try {
      await signInRequest({
        email: data.email,
        password: data.password,
      });

      navigate('/', {
        replace: true,
      });
    } catch (e) {
      const error = e as SignInRequestError;
      const errorCode = error.data.error.code;

      if (error.data.error.name === 'FirebaseError' && errorCode) {
        const errorsMap: Record<SignInRequestErrorCode, string> = {
          'auth/invalid-credential': 'Invalid email or password',
        };

        toast(errorsMap[errorCode] ?? 'Failed to sign in', {
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
          <HoneyFlexBox $gap={2} $width="100%" $maxWidth="300px" $margin={[0, 'auto']}>
            <TextInput
              label="* Email"
              error={formFields.email.errors[0]?.message}
              {...formFields.email.props}
            />

            <TextInput
              label="* Password"
              error={formFields.password.errors[0]?.message}
              {...formFields.password.props}
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
              Sign In
            </Button>
          </HoneyFlexBox>
        )}
      </Form>
    </Page>
  );
};
