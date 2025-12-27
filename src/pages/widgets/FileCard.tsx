import React from 'react';
import { HoneyBox, HoneyFlex } from '@react-hive/honey-layout';

import { getReadableFileSize } from '~/utils';
import { DeleteIcon } from '~/icons';
import { Text, IconButton } from '~/components';

interface FileCardProps {
  file: File;
  removeDisabled?: boolean;
  onRemove: () => void;
}

export const FileCard = ({ file, removeDisabled = false, onRemove }: FileCardProps) => {
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
        <HoneyFlex $gap={0.5} $overflow="hidden">
          <Text variant="subtitle1" ellipsis>
            {file.name}
          </Text>

          <Text variant="body2" $color="secondary.slateAlloy">
            {getReadableFileSize(file.size)}
          </Text>
        </HoneyFlex>

        <IconButton
          disabled={removeDisabled}
          onClick={onRemove}
          icon={<DeleteIcon />}
          iconProps={{
            color: removeDisabled ? 'neutral.grayMedium' : 'error.signalCoral',
          }}
          $marginLeft="auto"
        />
      </HoneyBox>
    </>
  );
};
