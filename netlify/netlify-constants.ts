export const IS_LOCAL_ENV = process.env.NETLIFY_LOCAL === 'true';

export const SITE_DOMAIN = IS_LOCAL_ENV ? 'http://localhost:8097' : process.env.SITE_DOMAIN;

export const { URL, STRIPE_API_KEY, NETLIFY_EMAILS_SECRET } = process.env;
