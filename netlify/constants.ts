export const IS_LOCAL_ENV = process.env.NETLIFY_LOCAL === 'true';

export const SITE_DOMAIN = IS_LOCAL_ENV ? 'http://localhost:8097' : process.env.SITE_DOMAIN;

export const FIREBASE_QUOTE_REQUEST_MODELS_DIRECTORY = 'quote-request-models';

export const ONE_MINUTE_MS = 1000;

export const ONE_HOUR_MINUTES = 60;

export const ONE_DAY_HOURS = 24;

export const ONE_DAY_MINUTES = ONE_DAY_HOURS * ONE_HOUR_MINUTES;

export const ONE_WEEK_DAYS = 7;

export const ONE_WEEK_MINUTES = ONE_WEEK_DAYS * ONE_DAY_MINUTES;

export const ONE_WEEK_MS = ONE_WEEK_MINUTES * ONE_MINUTE_MS;

export const {
  SITE_ID,
  URL,
  NETLIFY_TOKEN,
  COMPANY_EMAIL,
  STRIPE_API_KEY,
  NETLIFY_EMAILS_SECRET,
  FIREBASE_STORAGE_BUCKET,
} = process.env;
