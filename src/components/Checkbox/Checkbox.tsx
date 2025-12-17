import type { ReactNode } from 'react';
import React, { useId } from 'react';

import { CheckboxStyled } from './CheckboxStyled';
import { ErrorIcon } from '~/icons';

export interface CheckboxProps {
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  error?: ReactNode;
}

export const Checkbox = ({ checked, onChange, label, disabled = false, error }: CheckboxProps) => {
  const id = useId();

  return (
    <CheckboxStyled htmlFor={id} aria-disabled={disabled}>
      <div className="checkbox__control">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={e => onChange(e.target.checked)}
        />

        <span className="checkbox" />

        {label && <span className="label">{label}</span>}
      </div>

      {error && (
        <p className="checkbox__error">
          <ErrorIcon size="small" color="error.signalCoral" />

          {error}
        </p>
      )}
    </CheckboxStyled>
  );
};
