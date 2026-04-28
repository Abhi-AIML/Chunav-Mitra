import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import type { ChatMessage } from '../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "🗳️ How does voting work?",
  "📅 Show election timeline",
  "🖥️ How does EVM work?",
  "🔍 Find my polling booth",
  "❌ Can EVMs be hacked?",
];

export function ChatPanel({ messages, onSend, isLoading }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
  };

  const handleSuggestion = (s: string) => {
    if (isLoading) return;
    onSend(s);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 space-y-4 scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot'}>
                {msg.role === 'bot' && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Sparkles size={12} className="text-saffron-400" />
                    <span className="text-[10px] uppercase tracking-wider text-saffron-400/70 font-semibold">
                      Chunav Mitra
                    </span>
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">
                  {msg.text.split(/(\*\*.*?\*\*)/).map((part, j) =>
                    part.startsWith('**') && part.endsWith('**') ? (
                      <strong key={j} className="font-semibold text-white">
                        {part.slice(2, -2)}
                      </strong>
                    ) : (
                      <span key={j}>{part}</span>
                    )
                  )}
                </div>
                {msg.tool_calls && msg.tool_calls.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-saffron-400/60 uppercase tracking-wider">
                      📊 Visual updated on canvas →
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="chat-bubble-bot">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-saffron-400" />
                <span className="text-[10px] uppercase tracking-wider text-saffron-400/70 font-semibold">
                  Chunav Mitra
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-2 h-2 rounded-full bg-saffron-400/60 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span className="text-xs text-white/40">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Quick Suggestions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => handleSuggestion(s)}
                disabled={isLoading}
                aria-label={`Suggestion: ${s}`}
                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 
                         text-white/60 hover:bg-white/10 hover:text-white/90 hover:border-white/20
                         transition-all duration-200 disabled:opacity-40"
              >
                {s}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="p-4 border-t border-white/[0.06]"
      >
        <div className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2
                      focus-within:border-saffron-500/40 focus-within:bg-white/[0.06] transition-all duration-200">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Indian elections..."
            disabled={isLoading}
            aria-label="Election question input"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none
                     disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className="w-9 h-9 flex items-center justify-center rounded-lg
                     bg-gradient-to-r from-saffron-500 to-saffron-600
                     text-white shadow-lg shadow-saffron-500/20
                     hover:shadow-xl hover:shadow-saffron-500/30
                     disabled:opacity-30 disabled:shadow-none
                     transition-all duration-200
                     hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
