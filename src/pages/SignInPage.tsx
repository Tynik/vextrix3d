import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { HoneyFormFieldsConfig, HoneyFormOnSubmit } from '@react-hive/honey-form';
import { HoneyFlex } from '@react-hive/honey-layout';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';

import { ROUTES } from '~/configs';
import { handleApiError, signInRequest } from '~/api';
import { useAppContext, useQueryParams } from '~/models';
import { CheckIcon } from '~/icons';
import { Button, Form, TextInput } from '~/components';
import { Page } from '~/pages';

const FIREBASE_AUTH_ERRORS: Record<string, string> = {
  'auth/invalid-credential': 'Invalid email or password',
  'auth/user-not-found': 'Invalid email or password',
  'auth/wrong-password': 'Invalid email or password',
  'auth/too-many-requests': 'Too many attempts. Try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
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

  const { firebaseAuth } = useAppContext();

  const signIn: HoneyFormOnSubmit<SignInFormData> = async data => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password,
      );

      const idToken = await userCredential.user.getIdToken(true);

      await signInRequest({
        idToken,
      });

      const redirectPath = queryParams.get('redirect') || ROUTES.home;

      navigate(decodeURIComponent(redirectPath), {
        replace: true,
      });
    } catch (e) {
      if (e instanceof FirebaseError) {
        toast(FIREBASE_AUTH_ERRORS[e.code] ?? 'Failed to sign in', {
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
