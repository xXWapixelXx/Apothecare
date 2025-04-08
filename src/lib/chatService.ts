import axios, { AxiosError } from 'axios';
import { getEnvVar } from './env';

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

// System prompt template
const SYSTEM_PROMPT = "Je bent de professionele AI-assistent van ApotheCare. Je communiceert in een zakelijke en vriendelijke toon in het Nederlands. Je helpt klanten met vragen over medicijnen, gezondheidsadvies en onze online apotheekdiensten. Je gebruikt formele 'u' in plaats van informele 'je'. Je geeft duidelijke en accurate informatie, maar herinnert gebruikers er altijd aan om voor medisch advies een zorgprofessional te raadplegen. Je houdt je antwoorden beknopt en professioneel.";

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
      context: request.context || SYSTEM_PROMPT
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
  const openaiApiKey = getEnvVar('VITE_OPENAI_API_KEY');
  return openaiApiKey && !openaiApiKey.includes('YOUR_') && !openaiApiKey.includes('your_') 
    ? openaiApiKey 
    : null;
};

/**
 * Call the OpenAI API
 */
const callOpenAIAPI = async (request: ChatRequest): Promise<string> => {
  try {
    const openaiApiKey = getAPIKey();
    
    if (!openaiApiKey) {
      throw new ChatError('OpenAI API key is missing', ChatProvider.ChatGPT);
    }
    
    const response = await axios.post<{
      choices: Array<{ message: { content: string } }>;
    }>('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: request.context || SYSTEM_PROMPT
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
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      timeout: request.timeout || TIMEOUT_MS
    });

    const content = response.data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new ChatError('Invalid response from OpenAI API', ChatProvider.ChatGPT);
    }

    return content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new ChatError(
        `OpenAI API error: ${error.response?.data?.error || error.message}`,
        ChatProvider.ChatGPT,
        error
      );
    }
    throw new ChatError('Unknown error from OpenAI API', ChatProvider.ChatGPT, error);
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
    const response = await callOpenAIAPI(request);
    return { response, provider: ChatProvider.ChatGPT };
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