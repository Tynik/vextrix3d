export const ROUTES = {
  home: '/',
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
  legal: {
    terms: '/terms-of-service',
    shipping: '/shipping-policy',
    refund: '/refund-policy',
    modelSubmission: '/model-submission-policy',
    safety: '/material-safety-disclaimer',
    ip: '/intellectual-property-policy',
  },
  quote: '/quote-request',
} as const;
