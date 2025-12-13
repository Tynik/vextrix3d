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
    validator: decision =>
      decision?.toLowerCase() === 'agree' ||
      'To proceed, please type "agree" to confirm your acceptance',
  },
};

interface ModelSubmissionPolicyDialogProps extends Omit<DialogProps, 'children' | 'title'> {
  onContinue: () => Promise<void>;
}

export const ModelSubmissionPolicyDialog = ({
  onContinue,
  ...props
}: ModelSubmissionPolicyDialogProps) => {
  const { onClose } = props;

  return (
    <>
      <Dialog title="Model Submission Policy" {...props}>
        <HoneyForm fields={POLICY_ACCEPTANCE_FORM_FIELDS} onSubmit={onContinue}>
          {({ formFields, isFormErred, isFormSubmitting }) => (
            <>
              <CueShadows $margin={-2} $padding={2}>
                <ModelSubmissionPolicyContent />
              </CueShadows>

              <TextInput
                label="Policy Acceptance"
                placeholder={'If you agree, type "agree" here'}
                disabled={isFormSubmitting}
                error={formFields.decision.errors[0]?.message}
                {...formFields.decision.props}
              />

              <HoneyBox
                $display="flex"
                $gap={2}
                $justifyContent="flex-end"
                $paddingTop={2}
                $marginTop={3}
              >
                <Button disabled={isFormErred} type="submit" variant="accent">
                  Continue
                </Button>

                <Button variant="secondary" onClick={onClose}>
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
