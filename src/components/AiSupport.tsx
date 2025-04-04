import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
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
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: "Je bent de AI-assistent van ApotheCare. Je helpt klanten met vragen over medicijnen, gezondheidsadvies en onze online apotheekdiensten. Wees altijd behulpzaam maar herinner gebruikers eraan om voor medisch advies een zorgprofessional te raadplegen.",
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: "Excuses, maar ik kan momenteel geen verbinding maken. Probeer het later opnieuw of neem contact op met ons klantenserviceteam.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
                  <p className="text-xs text-emerald-100">Beschikbaar 24/7</p>
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
                          : "bg-white border border-emerald-100 shadow-sm text-gray-900"
                      )}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
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
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="bg-white border border-emerald-100 rounded-2xl p-3 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-emerald-100 bg-white">
              <div className="flex gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Typ uw vraag..."
                  className="flex-1 resize-none rounded-xl border border-emerald-200 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[44px] max-h-[150px] overflow-y-auto text-sm"
                  style={{ height: '44px' }}
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  className="p-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
              <p className="mt-2 text-xs text-gray-500 text-center">
                Voor medisch advies raden wij aan een zorgprofessional te raadplegen.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 