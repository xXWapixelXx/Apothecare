/**
 * Environment variables utility for browser and server usage
 * 
 * This file provides consistent access to environment variables
 * regardless of whether the code runs in browser or server context.
 */

// Environment variable keys
export const ENV_KEYS = {
  OPENAI_API_KEY: 'VITE_OPENAI_API_KEY',
  NODE_ENV: 'VITE_NODE_ENV',
  API_URL: 'VITE_API_URL'
} as const;

// Environment variable types
export type EnvKey = keyof typeof ENV_KEYS;

// Environment variable values
export interface EnvVars {
  [ENV_KEYS.OPENAI_API_KEY]: string;
  [ENV_KEYS.NODE_ENV]: string;
  [ENV_KEYS.API_URL]: string;
}

// Extend the Window interface
declare global {
  interface Window {
    __env__: Partial<EnvVars>;
  }
}

/**
 * Validate environment variables
 */
function validateEnvVars(vars: Partial<EnvVars>): EnvVars {
  const missingVars: string[] = [];

  // Check for required variables
  Object.entries(ENV_KEYS).forEach(([key, envKey]) => {
    if (!vars[envKey]) {
      missingVars.push(key);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  return vars as EnvVars;
}

/**
 * Get environment variables from various sources
 */
export function getEnv(): EnvVars {
  let vars: Partial<EnvVars> = {};

  // In browser context
  if (typeof window !== 'undefined') {
    vars = {
      [ENV_KEYS.OPENAI_API_KEY]: window.__env__?.[ENV_KEYS.OPENAI_API_KEY] || import.meta.env[ENV_KEYS.OPENAI_API_KEY] || '',
      [ENV_KEYS.NODE_ENV]: window.__env__?.[ENV_KEYS.NODE_ENV] || import.meta.env[ENV_KEYS.NODE_ENV] || '',
      [ENV_KEYS.API_URL]: window.__env__?.[ENV_KEYS.API_URL] || import.meta.env[ENV_KEYS.API_URL] || '',
    };
  } else {
    // In Node.js context
    vars = {
      [ENV_KEYS.OPENAI_API_KEY]: process.env[ENV_KEYS.OPENAI_API_KEY] || '',
      [ENV_KEYS.NODE_ENV]: process.env[ENV_KEYS.NODE_ENV] || '',
      [ENV_KEYS.API_URL]: process.env[ENV_KEYS.API_URL] || '',
    };
  }

  return validateEnvVars(vars);
}

/**
 * Get a specific environment variable
 */
export function getEnvVar(key: EnvKey): string {
  const env = getEnv();
  return env[ENV_KEYS[key]] || '';
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return getEnvVar('NODE_ENV') === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return getEnvVar('NODE_ENV') === 'production';
} 