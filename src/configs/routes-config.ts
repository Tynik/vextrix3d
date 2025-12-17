export const ROUTES = {
  home: '/',
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
  },
  account: {
    base: '/account',
    profile: 'profile',
  },
  legal: {
    terms: '/terms-of-service',
    shipping: '/shipping-policy',
    refund: '/refund-policy',
    modelSubmission: '/model-submission-policy',
    safety: '/material-safety-disclaimer',
    intellectualProperty: '/intellectual-property-policy',
    privacy: '/privacy-policy',
  },
  quote: '/quote-request',
} as const;

export const ROUTE_PATHS = {
  accountProfile: `${ROUTES.account.base}/${ROUTES.account.profile}`,
} as const;
