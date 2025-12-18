import React, { useCallback, useState } from 'react';
import type { ReactElement, PropsWithChildren } from 'react';
import { HoneyBox } from '@react-hive/honey-layout';

import { Button, CueShadows, Dialog, Text } from '~/components';
import {
  MaterialSafetyDisclaimerContent,
  ModelSubmissionPolicyContent,
  TermsOfServiceContent,
  PrivacyPolicyContent,
} from '~/pages/widgets';

type LegalDocumentType =
  | 'terms-of-service'
  | 'model-submission'
  | 'material-safety-disclaimer'
  | 'privacy-policy';

interface LegalDocument {
  title: string;
  content: ReactElement;
}

const LEGAL_DOCUMENTS: Record<LegalDocumentType, LegalDocument> = {
  'terms-of-service': {
    title: 'Terms of Service',
    content: <TermsOfServiceContent />,
  },
  'model-submission': {
    title: 'Model Submission Policy',
    content: <ModelSubmissionPolicyContent />,
  },
  'material-safety-disclaimer': {
    title: 'Material Safety & Print Quality Disclaimer',
    content: <MaterialSafetyDisclaimerContent />,
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: <PrivacyPolicyContent />,
  },
};

interface PolicyLinkProps {
  policy: LegalDocumentType;
}

export const LegalDocumentPreview = ({ children, policy }: PropsWithChildren<PolicyLinkProps>) => {
  const [isShowPolicy, setIsShowPolicy] = useState(false);

  const handleClosePolicy = useCallback(() => {
    setIsShowPolicy(false);
  }, []);

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
        {children}
      </Text>

      <Dialog title={LEGAL_DOCUMENTS[policy].title} open={isShowPolicy} onClose={handleClosePolicy}>
        <CueShadows $margin={-2} $padding={2}>
          {LEGAL_DOCUMENTS[policy].content}
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
