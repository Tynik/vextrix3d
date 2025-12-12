import React from 'react';
import { invokeIfFunction } from '@react-hive/honey-utils';
import { css } from '@react-hive/honey-style';
import { HoneyForm } from '@react-hive/honey-form';
import type { HoneyFormBaseForm, HoneyFormProps } from '@react-hive/honey-form';
import type { HoneyFlexProps, HoneyEffect } from '@react-hive/honey-layout';
import { HoneyFlex } from '@react-hive/honey-layout';

const FormEffect: HoneyEffect = () => css`
  > form {
    display: flex;
    flex-direction: column;
  }
`;

interface FormProps<Form extends HoneyFormBaseForm, FormContext = undefined> extends HoneyFormProps<
  Form,
  FormContext
> {
  loading?: boolean;
  containerProps?: HoneyFlexProps;
}

export const Form = <Form extends HoneyFormBaseForm, FormContext = undefined>({
  children,
  containerProps,
  ...props
}: FormProps<Form, FormContext>) => {
  return (
    <HoneyFlex effects={[FormEffect]} {...containerProps}>
      <HoneyForm {...props}>{honeyFormApi => invokeIfFunction(children, honeyFormApi)}</HoneyForm>
    </HoneyFlex>
  );
};
