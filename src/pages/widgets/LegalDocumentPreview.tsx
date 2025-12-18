import React, { useCallback, useState } from 'react';
import { HoneyBox } from '@react-hive/honey-layout';

import type { LegalDocumentType } from '~/configs';
import { LEGAL_DOCUMENTS } from '~/configs';
import { Button, CueShadows, Dialog, Text } from '~/components';

interface LegalDocumentPreviewProps {
  documentType: LegalDocumentType;
}

export const LegalDocumentPreview = ({ documentType }: LegalDocumentPreviewProps) => {
  const [isShowPolicy, setIsShowPolicy] = useState(false);

  const handleClosePolicy = useCallback(() => {
    setIsShowPolicy(false);
  }, []);

  const legalDocumentConfig = LEGAL_DOCUMENTS[documentType];

  return (
    <>
      <Text
        as="span"
        variant="inherit"
        onClick={e => {
          e.preventDefault();
          setIsShowPolicy(true);
        }}
        $color="success.emeraldGreen"
      >
        {legalDocumentConfig.title}
      </Text>

      <Dialog title={legalDocumentConfig.title} open={isShowPolicy} onClose={handleClosePolicy}>
        <CueShadows $margin={-2} $padding={2}>
          {legalDocumentConfig.content}
        </CueShadows>

        <HoneyBox
          $display="flex"
          $gap={2}
          $justifyContent="flex-end"
          $paddingTop={2}
          $marginTop={2}
        >
          <Button variant="secondary" onClick={handleClosePolicy}>
            Close
          </Button>
        </HoneyBox>
      </Dialog>
    </>
  );
};
