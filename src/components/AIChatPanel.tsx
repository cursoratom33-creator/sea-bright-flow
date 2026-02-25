import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your FreightFlow AI assistant. I can help you with shipment tracking, document queries, and operational insights. How can I help?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getAIResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg hover:shadow-xl transition-shadow"
          >
            <Bot className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-success animate-pulse-subtle" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={cn(
              'fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl border border-border bg-card shadow-2xl overflow-hidden',
              isMinimized ? 'w-80 h-14' : 'w-96 h-[520px]'
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground">AI Assistant</span>
                <span className="h-2 w-2 rounded-full bg-success" />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="rounded p-1 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded p-1 text-primary-foreground/70 hover:text-primary-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[80%] rounded-xl px-3 py-2 text-sm',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-xl px-3 py-2 text-sm text-muted-foreground">
                        <span className="animate-pulse-subtle">Thinking...</span>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="border-t border-border p-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about shipments, docs..."
                      className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('shipment') || lower.includes('track'))
    return 'I found 142 active shipments. The most recent is SHP-2024-006 (FCL, CNSHA→USNYC), currently in transit with ETA March 20. Would you like more details?';
  if (lower.includes('document') || lower.includes('bl') || lower.includes('b/l'))
    return 'There are 38 pending documents requiring attention. 3 Bills of Lading are awaiting upload for shipments departing this week. Shall I list them?';
  if (lower.includes('invoice') || lower.includes('billing') || lower.includes('payment'))
    return 'Current outstanding: $24,000 across 3 invoices. INV-0892 ($15,800) is overdue by 15 days. Would you like to send a payment reminder?';
  if (lower.includes('consol'))
    return 'You have 3 active consolidations. CON-2024-001 (CNSHA→USLAX) is still open with 5 shipments. Space for 3 more. Want to add shipments?';
  return "I can help you with shipment tracking, document management, billing queries, and operational insights. What would you like to know?";
}
