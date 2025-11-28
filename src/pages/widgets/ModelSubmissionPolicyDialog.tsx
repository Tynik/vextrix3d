import React from 'react';
import type { HoneyFormFieldsConfig } from '@react-hive/honey-form';
import { HoneyForm } from '@react-hive/honey-form';
import { HoneyBox } from '@react-hive/honey-layout';

import type { DialogProps } from '~/components';
import { Button, CueShadows, Dialog, TextInput } from '~/components';
import { ModelSubmissionPolicyContent } from './ModelSubmissionPolicyContent';

type PolicyAcceptanceFormData = {
  decision: string;
};

const POLICY_ACCEPTANCE_FORM_FIELDS: HoneyFormFieldsConfig<PolicyAcceptanceFormData> = {
  decision: {
    type: 'string',
    required: true,
    max: 10,
  },
};

interface ModelSubmissionPolicyDialogProps extends Omit<DialogProps, 'children' | 'title'> {
  onContinue: () => void;
}

export const ModelSubmissionPolicyDialog = ({
  onContinue,
  ...props
}: ModelSubmissionPolicyDialogProps) => {
  const { onClose } = props;

  return (
    <>
      <Dialog title="Model Submission Policy" {...props}>
        <HoneyForm fields={POLICY_ACCEPTANCE_FORM_FIELDS}>
          {({ formValues, formFields }) => (
            <>
              <CueShadows $margin={-2} $padding={2}>
                <ModelSubmissionPolicyContent />
              </CueShadows>

              <TextInput
                label="Policy Acceptance"
                placeholder={'If you agree, type "agree" here'}
                {...formFields.decision.props}
              />

              <HoneyBox
                $display="flex"
                $gap={2}
                $justifyContent="flex-end"
                $paddingTop={2}
                $marginTop={3}
              >
                <Button
                  disabled={formValues.decision?.toLowerCase() !== 'agree'}
                  color="accent"
                  onClick={onContinue}
                >
                  Continue
                </Button>

                <Button color="secondary" onClick={onClose}>
                  Close
                </Button>
              </HoneyBox>
            </>
          )}
        </HoneyForm>
      </Dialog>
    </>
  );
};
