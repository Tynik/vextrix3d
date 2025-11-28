export const IS_LOCAL_ENV = process.env.NETLIFY_LOCAL === 'true';

export const SITE_DOMAIN = IS_LOCAL_ENV ? 'http://localhost:8097' : process.env.SITE_DOMAIN;

export const {
  SITE_ID,
  URL,
  NETLIFY_TOKEN,
  COMPANY_EMAIL,
  STRIPE_API_KEY,
  NETLIFY_EMAILS_SECRET,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_SERVICE_ACCOUNT,
} = process.env;
