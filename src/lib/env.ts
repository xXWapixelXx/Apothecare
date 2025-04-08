/**
 * Environment variables utility for browser and server usage
 * 
 * This file provides consistent access to environment variables
 * regardless of whether the code runs in browser or server context.
 */

// Environment variable keys
export const ENV_KEYS = {
  OPENAI_API_KEY: 'VITE_OPENAI_API_KEY',
  MISTRAL_API_KEY: 'VITE_MISTRAL_API_KEY',
  NODE_ENV: 'NODE_ENV',
  API_URL: 'VITE_API_URL'
} as const;

// Environment variable types
export type EnvKey = typeof ENV_KEYS[keyof typeof ENV_KEYS];

// Environment variable values
export interface EnvVars {
  [ENV_KEYS.OPENAI_API_KEY]: string;
  [ENV_KEYS.MISTRAL_API_KEY]: string;
  [ENV_KEYS.NODE_ENV]: 'development' | 'production';
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
export function validateEnvVars(env: Partial<EnvVars>): asserts env is EnvVars {
  const missingVars = Object.values(ENV_KEYS).filter(key => !env[key]);
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

/**
 * Get environment variables from various sources
 */
export function getEnv(): EnvVars {
  if (typeof window !== 'undefined') {
    // Browser environment
    const env = {
      [ENV_KEYS.OPENAI_API_KEY]: window.__env__?.[ENV_KEYS.OPENAI_API_KEY] || import.meta.env[ENV_KEYS.OPENAI_API_KEY],
      [ENV_KEYS.MISTRAL_API_KEY]: window.__env__?.[ENV_KEYS.MISTRAL_API_KEY] || import.meta.env[ENV_KEYS.MISTRAL_API_KEY],
      [ENV_KEYS.NODE_ENV]: (window.__env__?.[ENV_KEYS.NODE_ENV] || import.meta.env[ENV_KEYS.NODE_ENV]) as 'development' | 'production',
      [ENV_KEYS.API_URL]: window.__env__?.[ENV_KEYS.API_URL] || import.meta.env[ENV_KEYS.API_URL]
    };
    validateEnvVars(env);
    return env;
  } else {
    // Node.js environment
    const env = {
      [ENV_KEYS.OPENAI_API_KEY]: process.env[ENV_KEYS.OPENAI_API_KEY],
      [ENV_KEYS.MISTRAL_API_KEY]: process.env[ENV_KEYS.MISTRAL_API_KEY],
      [ENV_KEYS.NODE_ENV]: process.env[ENV_KEYS.NODE_ENV] as 'development' | 'production',
      [ENV_KEYS.API_URL]: process.env[ENV_KEYS.API_URL]
    };
    validateEnvVars(env);
    return env;
  }
}

/**
 * Get a specific environment variable
 */
export function getEnvVar(key: EnvKey): string {
  return getEnv()[key];
}

/**
 * Check if we're in development mode
 */
export function isDevelopment(): boolean {
  return getEnvVar(ENV_KEYS.NODE_ENV) === 'development';
}

/**
 * Check if we're in production mode
 */
export function isProduction(): boolean {
  return getEnvVar(ENV_KEYS.NODE_ENV) === 'production';
} 