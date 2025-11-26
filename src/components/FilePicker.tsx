import React, { useRef } from 'react';
import type { ChangeEventHandler, InputHTMLAttributes, PropsWithChildren } from 'react';
import type { HoneyBoxProps } from '@react-hive/honey-layout';
import { fileListToFiles } from '@react-hive/honey-utils';
import { styled } from '@react-hive/honey-style';
import { HoneyBox } from '@react-hive/honey-layout';

import type { Nullable } from '~/types';

type AcceptFilesPattern = `.${string}`;

type FilePickerStyledProps = HoneyBoxProps<'label'>;

const FilePickerStyled = styled(HoneyBox, {
  as: 'label',
})<FilePickerStyledProps>`
  cursor: pointer;

  input {
    display: none;
  }
`;

export interface FilePickerProps extends FilePickerStyledProps {
  accept?: AcceptFilesPattern | AcceptFilesPattern[];
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'accept'>;
  onSelectFiles: (files: File[]) => void;
}

export const FilePicker = ({
  children,
  accept,
  inputProps,
  onSelectFiles,
  ...props
}: PropsWithChildren<FilePickerProps>) => {
  const inputRef = useRef<Nullable<HTMLInputElement>>(null);

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = e => {
    onSelectFiles(fileListToFiles(e.target.files));

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <FilePickerStyled
      htmlFor="file-picker-input"
      tabIndex={0}
      // ARIA
      aria-label="Select files"
      {...props}
    >
      <input
        ref={inputRef}
        id="file-picker-input"
        accept={Array.isArray(accept) ? accept.join(',') : accept}
        type="file"
        title=""
        tabIndex={-1}
        multiple
        onChange={handleInputChange}
        {...inputProps}
      />

      {children}
    </FilePickerStyled>
  );
};
