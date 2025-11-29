import React, { useId } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';

import { ErrorIcon } from '~/icons';
import type { TextInputStyledProps } from './TextInputStyled';
import { TextInputStyled } from './TextInputStyled';

interface TextInputProps
  extends Omit<TextInputStyledProps, 'onChange'>,
    Pick<
      InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
      'value' | 'placeholder' | 'onChange'
    > {
  label: string;
  error?: ReactNode;
  /**
   * @default false
   */
  multiline?: boolean;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    'id' | 'value' | 'placeholder' | 'onChange'
  >;
}

export const TextInput = ({
  value,
  label,
  placeholder = 'Type here...',
  error,
  multiline = false,
  onChange,
  inputProps,
  ...props
}: TextInputProps) => {
  const id = useId();

  const Component = multiline ? 'textarea' : 'input';

  return (
    <TextInputStyled {...props}>
      <label htmlFor={id}>{label}</label>

      <Component
        id={id}
        value={value}
        placeholder={placeholder}
        rows={multiline ? 10 : undefined}
        onChange={onChange}
        // ARIA
        aria-invalid={Boolean(error)}
        {...inputProps}
      />

      {error && (
        <p className="text-input__error">
          <ErrorIcon size="small" color="error.signalCoral" />

          {error}
        </p>
      )}
    </TextInputStyled>
  );
};
