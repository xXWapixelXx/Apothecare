import axios, { AxiosError } from 'axios';
import { getEnvVar, ENV_KEYS } from './env';

// Configuration
const TIMEOUT_MS = 10000;
const RETRY_DELAY_MS = 500;
const MAX_RETRIES = 2;

// Supported providers
export enum ChatProvider {
  Mistral = 'mistral',
  LocalLLM = 'local'
}

// Custom error types
export class ChatError extends Error {
  constructor(
    message: string,
    public provider: ChatProvider,
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
  response: string;
  provider: ChatProvider;
}

// Get system prompt from environment variables
const getSystemPrompt = (): string => {
  try {
    return getEnvVar(ENV_KEYS.SYSTEM_PROMPT);
  } catch (error) {
    console.error('System prompt not found in environment variables');
    throw new Error('System prompt configuration is missing');
  }
};

/**
 * Call the local LLM API
 */
const callLocalLLM = async (request: ChatRequest): Promise<string> => {
  try {
    const apiUrl = getEnvVar('VITE_API_URL');
    if (!apiUrl) {
      throw new ChatError('API URL is not configured', ChatProvider.LocalLLM);
    }

    const response = await axios.post<{ response: string }>(`${apiUrl}/chat`, {
      message: request.message,
      context: request.context || getSystemPrompt()
    }, {
      timeout: request.timeout || TIMEOUT_MS
    });

    if (!response.data?.response) {
      throw new ChatError('Invalid response from local LLM', ChatProvider.LocalLLM);
    }

    return response.data.response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ChatError(
        `Local LLM API error: ${error.response?.data?.error || error.message}`,
        ChatProvider.LocalLLM,
        error
      );
    }
    throw new ChatError('Unknown error from local LLM', ChatProvider.LocalLLM, error);
  }
};

/**
 * Get API key from environment variables
 */
const getAPIKey = (): string | null => {
  const mistralApiKey = getEnvVar(ENV_KEYS.MISTRAL_API_KEY);
  return mistralApiKey && !mistralApiKey.includes('YOUR_') && !mistralApiKey.includes('your_') 
    ? mistralApiKey 
    : null;
};

/**
 * Call the Mistral AI API
 */
const callMistralAPI = async (request: ChatRequest): Promise<string> => {
  try {
    const mistralApiKey = getAPIKey();
    
    if (!mistralApiKey) {
      throw new ChatError('Mistral API key is missing', ChatProvider.Mistral);
    }
    
    const response = await axios.post<{
      choices: Array<{ message: { content: string } }>;
    }>('https://api.mistral.ai/v1/chat/completions', {
      model: "mistral-tiny",
      messages: [
        {
          role: "system",
          content: request.context || getSystemPrompt()
        },
        ...(request.history || []),
        {
          role: "user",
          content: request.message
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, {
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: request.timeout || TIMEOUT_MS
    });

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new ChatError('Invalid response from Mistral API', ChatProvider.Mistral);
    }

    return content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ChatError(
        `Mistral API error: ${error.response?.data?.error || error.message}`,
        ChatProvider.Mistral,
        error
      );
    }
    throw new ChatError('Unknown error from Mistral API', ChatProvider.Mistral, error);
  }
};

/**
 * Try to get a response with retry logic
 */
const tryWithRetry = async (
  request: ChatRequest,
  retryCount = 0
): Promise<ChatResponse> => {
  try {
    const response = await callMistralAPI(request);
    return { response, provider: ChatProvider.Mistral };
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
      return tryWithRetry(request, retryCount + 1);
    }
    
    try {
      const localResponse = await callLocalLLM(request);
      return { response: localResponse, provider: ChatProvider.LocalLLM };
    } catch (localError) {
      throw localError;
    }
  }
};

/**
 * Main chat service function
 */
export const chatService = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      return await tryWithRetry(request);
    } catch (error) {
      return { 
        response: "Excuses, er is een probleem met onze AI-diensten. Probeer het later opnieuw of neem contact op met onze klantenservice.", 
        provider: ChatProvider.LocalLLM 
      };
    }
  }
}; 