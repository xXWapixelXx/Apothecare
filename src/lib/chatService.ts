import axios, { AxiosError } from 'axios';
import { getEnvVar, isDevelopment } from './env';

// Configuration
const TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 500;
const MAX_RETRIES = 2;

// Supported providers
export enum ChatProvider {
  ChatGPT = 'chatgpt',
  LocalLLM = 'local'
}

// Custom error types
export class ChatError extends Error {
  constructor(
    message: string,
    public provider: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'ChatError';
  }
}

// Interface for chat requests
export interface ChatRequest {
  message: string;
  context?: string;
  history?: { role: 'user' | 'assistant', content: string }[];
  timeout?: number;
}

// Interface for chat responses
export interface ChatResponse {
  content: string;
  role: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// System prompt template
const SYSTEM_PROMPT = `You are a helpful AI assistant for a pharmacy webshop. 
You can help customers with:
- Product information and recommendations
- Order status and tracking
- General health and wellness advice
- Prescription medication information
- Shipping and delivery questions

Please be professional, accurate, and always prioritize customer safety.`;

/**
 * Call the local LLM API
 */
async function callLocalLLM(message: string): Promise<ChatResponse> {
  try {
    const response = await axios.post('/api/chat', {
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message }
      ]
    });

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new ChatError('Invalid response from local LLM', 'local');
    }

    return {
      content: response.data.choices[0].message.content,
      role: 'assistant',
      usage: response.data.usage
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new ChatError(
        `Local LLM API error: ${error.response?.data?.error || error.message}`,
        'local',
        error
      );
    }
    throw error;
  }
}

/**
 * Call the OpenAI API
 */
async function callOpenAIAPI(message: string): Promise<ChatResponse> {
  const apiKey = getEnvVar('OPENAI_API_KEY');
  if (!apiKey) {
    throw new ChatError('OpenAI API key not found', 'openai');
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new ChatError('Invalid response from OpenAI API', 'openai');
    }

    return {
      content: response.data.choices[0].message.content,
      role: 'assistant',
      usage: response.data.usage
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new ChatError(
        `OpenAI API error: ${error.response?.data?.error?.message || error.message}`,
        'openai',
        error
      );
    }
    throw error;
  }
}

/**
 * Try a function with retries
 */
async function tryWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return tryWithRetry(fn, retries - 1, delay);
  }
}

/**
 * Send a message to the chat service
 */
export async function sendMessage(message: string): Promise<ChatResponse> {
  if (isDevelopment()) {
    console.log('Sending message:', message);
  }

  try {
    // Try local LLM first
    return await tryWithRetry(() => callLocalLLM(message));
  } catch (error) {
    if (isDevelopment()) {
      console.warn('Local LLM failed, falling back to OpenAI:', error);
    }

    // Fall back to OpenAI
    return await tryWithRetry(() => callOpenAIAPI(message));
  }
} 