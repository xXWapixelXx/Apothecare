import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronRight, Zap, Wifi, Server, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { chatService, ChatProvider, ChatRequest } from '@/lib/chatService';
import { toast } from 'react-hot-toast';
import { Toggle } from './ui/Toggle';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  provider?: ChatProvider;
}

interface QuickQuestion {
  text: string;
  question: string;
}

const quickQuestions: QuickQuestion[] = [
  {
    text: "Medicijnen op voorraad",
    question: "Welke medicijnen hebben jullie op voorraad?"
  },
  {
    text: "Bezorging van medicijnen",
    question: "Hoe werkt de bezorging van medicijnen?"
  },
  {
    text: "Herhaalrecepten aanvragen",
    question: "Hoe kan ik een herhaalrecept aanvragen?"
  },
];

export function AiSupport() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const [activeProvider, setActiveProvider] = useState<ChatProvider | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Add event listener for opening the chat
  useEffect(() => {
    const handleOpenAiSupport = () => {
      setIsOpen(true);
    };

    window.addEventListener('openAiSupport', handleOpenAiSupport);
    return () => {
      window.removeEventListener('openAiSupport', handleOpenAiSupport);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Adjust textarea height
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + 'px';
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setShowQuickQuestions(false);
    handleSend(question);
  };

  const handleSend = async (customInput?: string) => {
    const messageToSend = customInput || input;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: messageToSend.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
    setIsLoading(true);
    setShowQuickQuestions(false);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const chatRequest: ChatRequest = {
        message: userMessage.content,
        context: "Je bent de ApotheCare assistent. je zegt je bent de AI Assistent van ApotheCare. Geef korte antwoorden. Verwijs bij medische vragen naar een zorgprofessional. je hebt klanten die je vragen over medicijnen, gezondheidsadvies en onze online apotheekdiensten.",
        history: history
      };

      setActiveProvider(ChatProvider.Mistral);
      const result = await chatService.sendMessage(chatRequest);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: result.response,
        timestamp: new Date(),
        provider: result.provider
      };

      setActiveProvider(result.provider);
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: "Excuses, maar ik kan momenteel geen verbinding maken. Probeer het later opnieuw of neem contact op met ons klantenserviceteam.",
        timestamp: new Date(),
        provider: ChatProvider.LocalLLM
      };
      setMessages(prev => [...prev, errorMessage]);
      setActiveProvider(ChatProvider.LocalLLM);
      
      toast.error("Kan geen verbinding maken met AI-diensten. Controleer uw internetverbinding.", {
        duration: 4000,
        position: 'bottom-center',
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setActiveProvider(null), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get icon for current provider
  const getProviderIcon = (provider?: ChatProvider) => {
    switch(provider) {
      case ChatProvider.Mistral:
        return <Zap className="w-4 h-4 text-indigo-500" />;
      case ChatProvider.LocalLLM:
        return <Server className="w-4 h-4 text-emerald-500" />;
      default:
        return null;
    }
  };

  // Get tooltip text for provider
  const getProviderTooltip = (provider?: ChatProvider) => {
    switch(provider) {
      case ChatProvider.Mistral:
        return "Aangedreven door Mistral AI";
      case ChatProvider.LocalLLM:
        return "Aangedreven door lokale AI";
      default:
        return "";
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-4 right-4 p-4 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-all duration-200",
          "flex items-center gap-2 group",
          "z-[100]",
          isOpen && "scale-0 opacity-0"
        )}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="text-sm font-medium group-hover:translate-x-0.5 transition-transform">
          Vraag Advies
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-4 right-4 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[100] border border-emerald-100"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium">ApotheCare Assistent</h3>
                  <div className="text-xs text-emerald-100 flex items-center gap-1">
                    <span>Beschikbaar 24/7</span>
                    {activeProvider && (
                      <div 
                        className="ml-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/10 text-[10px]"
                        title={getProviderTooltip(activeProvider)}
                      >
                        {getProviderIcon(activeProvider)}
                        {activeProvider === ChatProvider.Mistral && <span>Mistral</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-emerald-50/50">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-emerald-600" />
                  </div>
                  <p className="text-sm">
                    Hallo! Ik ben uw AI-assistent. Hoe kan ik u vandaag helpen?
                  </p>
                  <p className="text-xs mt-2 text-emerald-600">
                    Stel gerust vragen over medicijnen, gezondheid of onze diensten
                  </p>

                  {showQuickQuestions && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 max-w-sm mx-auto text-left"
                    >
                      <h4 className="text-sm font-medium text-gray-700 mb-3 text-center">
                        Veelgestelde vragen
                      </h4>
                      <div className="space-y-2">
                        {quickQuestions.map((item, index) => (
                          <motion.button
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            onClick={() => handleQuickQuestion(item.question)}
                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-emerald-50 group transition-all duration-200 flex items-center gap-2"
                          >
                            <div className="w-1 h-1 rounded-full bg-emerald-500 group-hover:scale-150 transition-transform" />
                            <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">
                              {item.text}
                            </span>
                            <ChevronRight className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all ml-auto" />
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl p-3",
                        message.role === 'user'
                          ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white"
                          : "bg-white border border-gray-100 text-gray-700 shadow-sm"
                      )}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                      <div className="flex items-center justify-between mt-1 text-xs opacity-70">
                        <span>
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {message.role === 'assistant' && message.provider && (
                          <div 
                            className="flex items-center gap-1"
                            title={getProviderTooltip(message.provider)}
                          >
                            {getProviderIcon(message.provider)}
                          </div>
                        )}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span className="text-sm text-gray-500">
                        {activeProvider === ChatProvider.Mistral && "Verbinden met Mistral AI..."}
                        {!activeProvider && "Antwoord genereren..."}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Typ uw vraag hier..."
                  className="flex-1 max-h-32 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  style={{ height: '48px' }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className={cn(
                    "p-3 rounded-xl flex items-center justify-center",
                    input.trim() && !isLoading
                      ? "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md hover:shadow-lg transition-shadow"
                      : "bg-gray-100 text-gray-400"
                  )}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-gray-400">
                  Voor persoonlijk medisch advies, raadpleeg altijd een zorgprofessional
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 