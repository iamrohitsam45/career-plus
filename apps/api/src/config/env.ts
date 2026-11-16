import dotenv from 'dotenv';
import path from 'path';

// Load .env from project root or current app
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });
dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/careerpulse',
  
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || 'sk_test_placeholder',
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET || '',
  
  OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free',
  
  RAPIDAPI_KEY: process.env.RAPIDAPI_KEY || '',
  RAPIDAPI_JSEARCH_HOST: process.env.RAPIDAPI_JSEARCH_HOST || 'jsearch.p.rapidapi.com',
  ADZUNA_APP_ID: process.env.ADZUNA_APP_ID || '',
  ADZUNA_APP_KEY: process.env.ADZUNA_APP_KEY || '',
  
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder',
  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || '',
};
