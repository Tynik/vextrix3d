import React from 'react';
import type { ReactElement } from 'react';

import {
  MaterialSafetyDisclaimerContent,
  ModelSubmissionPolicyContent,
  PrivacyPolicyContent,
  TermsOfServiceContent,
} from '~/pages/widgets/legal';

export const IS_LOCAL_ENV = process.env.LOCAL_ENV === 'true';

export const SITE_URL = 'https://vextrix3d.co.uk';

export const CONTACT_EMAIL = 'vextrix3d@gmail.com';

export const CONTACT_PHONE = '+447918993712';

export const HEADER_HEIGHT_PX = 50;

export type LegalDocumentType =
  | 'termsOfService'
  | 'privacyPolicy'
  | 'modelSubmission'
  | 'materialSafetyDisclaimer';

interface LegalDocumentConfig {
  id: string;
  title: string;
  version: `${string}/${string}/${string}`;
  content: ReactElement;
}

export const LEGAL_DOCUMENTS: Record<LegalDocumentType, LegalDocumentConfig> = {
  termsOfService: {
    id: 'terms-of-service',
    title: 'Terms of Service',
    version: '17/12/2025',
    content: <TermsOfServiceContent />,
  },
  privacyPolicy: {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    version: '17/12/2025',
    content: <PrivacyPolicyContent />,
  },
  modelSubmission: {
    id: 'model-submission',
    title: 'Model Submission Policy',
    version: '17/12/2025',
    content: <ModelSubmissionPolicyContent />,
  },
  materialSafetyDisclaimer: {
    id: 'material-safety-disclaimer',
    title: 'Material Safety & Print Quality Disclaimer',
    version: '17/12/2025',
    content: <MaterialSafetyDisclaimerContent />,
  },
} as const;
