import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Mic, MicOff, MessageSquare, Volume2, Package, MapPin, Ship, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAIModeStore } from '@/store/aimode.store';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  action?: {
    type: 'track' | 'place';
    label: string;
    data?: Record<string, string>;
  };
}

const QUICK_ACTIONS = [
  { icon: MapPin, label: 'Track Shipment', prompt: 'Track my latest shipment status' },
  { icon: Package, label: 'Place Shipment', prompt: 'I want to place a new shipment' },
  { icon: Ship, label: 'Active Shipments', prompt: 'Show me all active shipments' },
];

export function AIModeOverlay() {
  const { isOpen, mode, close, setMode } = useAIModeStore();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Welcome to AI Mode! I can help you **track shipments**, **place new bookings**, and manage your freight operations. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen && mode === 'chat') {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, mode]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg = generateResponse(msg);
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1000);
  };

  const toggleVoice = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      // Simulate voice input
      setTimeout(() => {
        setIsListening(false);
        handleSend('Track shipment SHP-2024-006');
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-xl"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">FreightFlow AI</h1>
              <p className="text-xs text-muted-foreground">Intelligent Shipment Assistant</p>
            </div>
            <span className="ml-2 h-2 w-2 rounded-full bg-success animate-pulse" />
          </div>

          <div className="flex items-center gap-2">
            {/* Mode Toggle */}
            <div className="flex rounded-lg border border-border bg-muted p-1">
              <button
                onClick={() => setMode('chat')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  mode === 'chat'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Chat
              </button>
              <button
                onClick={() => setMode('voice')}
                className={cn(
                  'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                  mode === 'voice'
                    ? 'bg-card text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Volume2 className="h-3.5 w-3.5" />
                Voice
              </button>
            </div>

            <Button variant="ghost" size="icon" onClick={close}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Main Chat / Voice Area */}
          <div className="flex flex-1 flex-col">
            {mode === 'voice' ? (
              /* Voice Mode */
              <div className="flex flex-1 flex-col items-center justify-center gap-8">
                <motion.div
                  animate={isListening ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                  transition={{ repeat: isListening ? Infinity : 0, duration: 1.5 }}
                  className="relative"
                >
                  <div className={cn(
                    'flex h-32 w-32 items-center justify-center rounded-full transition-colors duration-300',
                    isListening
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {isListening ? (
                      <Mic className="h-12 w-12" />
                    ) : (
                      <MicOff className="h-12 w-12" />
                    )}
                  </div>
                  {isListening && (
                    <>
                      <motion.div
                        animate={{ scale: [1, 1.8], opacity: [0.4, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-full border-2 border-accent"
                      />
                      <motion.div
                        animate={{ scale: [1, 2.2], opacity: [0.2, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                        className="absolute inset-0 rounded-full border-2 border-accent"
                      />
                    </>
                  )}
                </motion.div>

                <div className="text-center">
                  <p className="text-lg font-medium text-foreground">
                    {isListening ? 'Listening...' : 'Tap to speak'}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isListening
                      ? 'Say something like "Track shipment SHP-2024-006"'
                      : 'Ask about shipments, place orders, or get updates'}
                  </p>
                </div>

                <Button
                  onClick={toggleVoice}
                  size="lg"
                  className={cn(
                    'rounded-full px-8',
                    isListening
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : 'bg-accent text-accent-foreground hover:bg-accent/90'
                  )}
                >
                  {isListening ? 'Stop' : 'Start Speaking'}
                </Button>

                {/* Recent voice results show as messages below */}
                {messages.length > 1 && (
                  <div className="w-full max-w-lg space-y-2 px-4">
                    {messages.slice(-3).map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          'rounded-xl px-4 py-2 text-sm',
                          msg.role === 'user'
                            ? 'ml-auto w-fit bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        )}
                      >
                        {msg.content}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* Chat Mode */
              <>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="mx-auto max-w-2xl space-y-4">
                    {/* Quick Actions - only show at start */}
                    {messages.length <= 1 && (
                      <div className="grid grid-cols-3 gap-3 pb-4">
                        {QUICK_ACTIONS.map((action) => (
                          <button
                            key={action.label}
                            onClick={() => handleSend(action.prompt)}
                            className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center hover:border-accent hover:bg-accent/5 transition-colors"
                          >
                            <action.icon className="h-6 w-6 text-accent" />
                            <span className="text-xs font-medium text-foreground">{action.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                      >
                        <div className={cn('flex gap-3 max-w-[80%]', msg.role === 'user' && 'flex-row-reverse')}>
                          {msg.role === 'assistant' && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                              <Bot className="h-4 w-4" />
                            </div>
                          )}
                          <div>
                            <div
                              className={cn(
                                'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                                msg.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted text-foreground'
                              )}
                            >
                              {msg.content}
                            </div>
                            {msg.action && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="mt-2 gap-1.5 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
                                onClick={() => {
                                  close();
                                  // Navigate based on action
                                }}
                              >
                                {msg.action.label}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                          <span className="inline-flex gap-1">
                            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Input Bar */}
                <div className="border-t border-border bg-card p-4">
                  <div className="mx-auto flex max-w-2xl items-center gap-3">
                    <button
                      onClick={() => setMode('voice')}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Mic className="h-4 w-4" />
                    </button>
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about shipments, track orders, place bookings..."
                      className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
                    />
                    <Button
                      onClick={() => handleSend()}
                      disabled={!input.trim()}
                      size="icon"
                      className="h-10 w-10 shrink-0 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function generateResponse(input: string): Message {
  const lower = input.toLowerCase();
  const base = { id: (Date.now() + 1).toString(), role: 'assistant' as const, timestamp: new Date() };

  if (lower.includes('track') || lower.includes('status') || lower.includes('where')) {
    const shipId = input.match(/SHP-\d{4}-\d{3}/i)?.[0] || 'SHP-2024-006';
    return {
      ...base,
      content: `📦 **Shipment ${shipId}**\n\n• **Status:** In Transit\n• **Route:** Shanghai (CNSHA) → New York (USNYC)\n• **Vessel:** MSC AURORA\n• **ETD:** Mar 10, 2024\n• **ETA:** Mar 28, 2024\n• **Container:** MSCU-4521876 (40' HC)\n\nThe shipment cleared customs at origin and is currently on water. Last port call was Busan on Mar 14.`,
      action: { type: 'track', label: 'View Full Details' },
    };
  }

  if (lower.includes('place') || lower.includes('new') || lower.includes('book') || lower.includes('create')) {
    return {
      ...base,
      content: `I can help you place a new shipment! Here's what I need:\n\n1. **Shipment Type** — FCL or LCL?\n2. **Origin & Destination** — Port codes or city names\n3. **Cargo** — What are you shipping?\n4. **Incoterm** — FOB, CIF, EXW, etc.\n\nOr I can start the booking wizard for you right away.`,
      action: { type: 'place', label: 'Open Booking Wizard' },
    };
  }

  if (lower.includes('active') || lower.includes('all') || lower.includes('list')) {
    return {
      ...base,
      content: `📊 **Active Shipments Summary**\n\n• **Total Active:** 142 shipments\n• **In Transit:** 89\n• **At Origin:** 28\n• **At Destination:** 18\n• **Customs Hold:** 7\n\n**Attention Required:**\n⚠️ SHP-2024-003 — Customs delay at Rotterdam\n⚠️ SHP-2024-015 — Documentation pending\n\nWould you like details on any specific shipment?`,
    };
  }

  if (lower.includes('invoice') || lower.includes('billing') || lower.includes('payment')) {
    return {
      ...base,
      content: `💰 **Billing Overview**\n\n• **Outstanding:** $24,000 (3 invoices)\n• **Overdue:** INV-0892 — $15,800 (15 days overdue)\n• **This Month:** $67,500 billed\n\nWould you like to send a payment reminder or view invoice details?`,
    };
  }

  return {
    ...base,
    content: "I can help you with:\n\n• **Track Shipment** — Get real-time status updates\n• **Place Shipment** — Create new bookings\n• **View Active Shipments** — See all in-progress orders\n• **Billing** — Check invoices and payments\n\nWhat would you like to do?",
  };
}
