import React, { useId } from 'react';
import type { ChangeEventHandler, InputHTMLAttributes, ReactNode } from 'react';

import { ErrorIcon } from '~/icons';
import type { TextInputStyledProps } from './TextInputStyled';
import { TextInputStyled } from './TextInputStyled';

type SelectedInputProps = Pick<
  InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
  'value' | 'placeholder' | 'name' | 'type' | 'disabled' | 'onChange' | 'onBlur'
>;

interface TextInputProps
  extends Omit<TextInputStyledProps, 'onChange' | 'onBlur'>,
    SelectedInputProps {
  label: string;
  error?: ReactNode;
  /**
   * @default false
   */
  multiline?: boolean;
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    keyof SelectedInputProps
  >;
}

export const TextInput = ({
  value,
  label,
  name,
  type,
  disabled,
  placeholder = 'Type here...',
  error,
  multiline = false,
  onChange,
  onBlur,
  inputProps,
  ...props
}: TextInputProps) => {
  const id = useId();

  const handleOnChange: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = e => {
    if (onChange) {
      e.target.value = e.target.value.trimStart();

      onChange(e);
    }
  };

  const Component = multiline ? 'textarea' : 'input';

  return (
    <TextInputStyled {...props}>
      <label htmlFor={id}>{label}</label>

      <Component
        id={id}
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        rows={multiline ? 10 : undefined}
        onChange={handleOnChange}
        onBlur={onBlur}
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
