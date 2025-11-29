import React from 'react';
import { HoneyBox, HoneyFlexBox } from '@react-hive/honey-layout';

import { getReadableFileSize } from '~/helpers';
import { DeleteIcon } from '~/icons';
import { Text, IconButton } from '~/components';

interface FileCardProps {
  file: File;
  onRemove: () => void;
}

export const FileCard = ({ file, onRemove }: FileCardProps) => {
  return (
    <>
      <HoneyBox
        $display="flex"
        $gap={2}
        $alignItems="center"
        $padding={2}
        $borderRadius="4px"
        $border="1px solid"
        $borderColor="neutral.grayLight"
      >
        <HoneyFlexBox $gap={0.5} $overflow="hidden">
          <Text variant="subtitle1" ellipsis>
            {file.name}
          </Text>

          <Text variant="body2" $color="secondary.slateAlloy">
            {getReadableFileSize(file.size)}
          </Text>
        </HoneyFlexBox>

        <IconButton onClick={onRemove} $marginLeft="auto">
          <DeleteIcon color="error.signalCoral" size="medium" />
        </IconButton>
      </HoneyBox>
    </>
  );
};
