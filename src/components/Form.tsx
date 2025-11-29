import React from 'react';
import { invokeIfFunction } from '@react-hive/honey-utils';
import { css } from '@react-hive/honey-style';
import { HoneyForm } from '@react-hive/honey-form';
import type { HoneyFormBaseForm, HoneyFormProps } from '@react-hive/honey-form';
import type { HoneyEffect } from '@react-hive/honey-layout';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';

const FormEffect: HoneyEffect = () => css`
  > form {
    display: flex;
    flex-direction: column;
  }
`;

interface FormProps<Form extends HoneyFormBaseForm, FormContext = undefined>
  extends HoneyFormProps<Form, FormContext> {
  loading?: boolean;
}

export const Form = <Form extends HoneyFormBaseForm, FormContext = undefined>({
  children,
  ...props
}: FormProps<Form, FormContext>) => {
  return (
    <HoneyBox effects={[FormEffect]}>
      <HoneyForm {...props}>
        {honeyFormApi => (
          <HoneyFlexBox $gap={2} $width="100%" $maxWidth="700px">
            {invokeIfFunction(children, honeyFormApi)}
          </HoneyFlexBox>
        )}
      </HoneyForm>
    </HoneyBox>
  );
};
