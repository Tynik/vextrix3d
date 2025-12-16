import React, { useId } from 'react';

import { CheckboxStyled } from './CheckboxStyled';

export interface CheckboxProps {
  checked: boolean | undefined;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
}

export const Checkbox = ({ checked, onChange, label, disabled = false }: CheckboxProps) => {
  const id = useId();

  return (
    <CheckboxStyled htmlFor={id} aria-disabled={disabled}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
      />

      <span className="checkbox" />

      {label && <span className="label">{label}</span>}
    </CheckboxStyled>
  );
};
