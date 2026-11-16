'use client';

import * as React from 'react';
import {
  Bot,
  Send,
  Sparkles,
  User,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  DollarSign,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function CareerCoachPage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your CareerPulse AI Career Coach. I can help you with mock behavioral interviews (STAR method), salary negotiation strategies in India and globally, resume bullet optimization, and system design roadmaps. What would you like to prepare for today?',
    },
  ]);
  const [input, setInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: query.trim() };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await api.careerChat(
        query.trim(),
        nextMessages.map((m) => ({ role: m.role, content: m.content }))
      );

      if (res.success && res.reply) {
        setMessages([...nextMessages, { role: 'assistant', content: res.reply }]);
      }
    } catch (err: any) {
      toast.error('AI coach is currently busy. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'How do I negotiate an offer from ₹20 LPA to ₹28 LPA in Bengaluru?',
    'Give me a mock system design question for a Staff Engineer role.',
    'Explain how to answer leadership questions using the STAR framework.',
    'What are the highest demand tech skills for AI Engineering right now?',
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B0F19] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 flex flex-col h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
          <div>
            <Badge variant="ai" className="mb-1 text-[10px]">24/7 INTERACTIVE COACH</Badge>
            <h1 className="text-xl sm:text-2xl font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Bot className="w-6 h-6 text-indigo-500" /> CareerPulse AI Coach
            </h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live & Ready
          </div>
        </div>

        {/* Chat Thread */}
        <Card className="glass-panel border-slate-200 dark:border-slate-800 flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-400 animate-pulse">
                Thinking and preparing career advice...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </Card>

        {/* Quick Prompts Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 border border-slate-200 dark:border-slate-700 text-[11px] whitespace-nowrap transition-colors shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about salary negotiations, system design, or interview preparation..."
            className="flex-1 h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <Button
            type="submit"
            disabled={loading || !input.trim()}
            variant="gradient"
            className="h-12 px-5 rounded-xl gap-2 font-semibold shadow-indigo-500/25"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
