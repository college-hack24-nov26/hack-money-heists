import React, { useEffect, useState, useRef } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Receipt,
  AlertOctagon,
  CornerDownLeft,
  Cpu
} from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { api } from '../services/api';

export const AssistantChat: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    api.getAssistantHistory()
      .then((res) => setMessages(res.history || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (queryText?: string) => {
    const text = queryText || input;
    if (!text.trim() || loading) return;

    setInput('');
    // Optimistic user message
    const tempUserMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setLoading(true);

    try {
      const res = await api.sendAssistantMessage(text);
      if (res.reply) {
        setMessages((prev) => [...prev, res.reply]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "Where is my business losing unnecessary money?",
    "Find suspicious invoices in my uploaded records",
    "How much cash will my business need over the next 30 days?",
    "Why did my expenses increase this month?",
    "Calculate my net profit margin"
  ];

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col space-y-4">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl glass-panel flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent-blue via-accent-cyan to-emerald-400 p-[1.5px]">
            <div className="w-full h-full bg-midnight rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-accent-cyan" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <span>ARTHIQ AI Financial Intelligence Assistant</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Connected to Apex General Ledger
              </span>
            </h1>
            <p className="text-[11px] text-neutral-muted">
              Autonomous financial analysis, tool execution, fraud forensics, and verifiable math.
            </p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${
                  isUser
                    ? 'bg-accent-blue text-white'
                    : 'bg-gradient-to-br from-accent-cyan to-accent-blue text-midnight'
                }`}
              >
                {isUser ? <span className="text-xs font-bold">VS</span> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`p-4 rounded-2xl text-xs space-y-2 border ${
                  isUser
                    ? 'bg-accent-blue text-white border-accent-blue/30 rounded-tr-none'
                    : 'glass-panel text-neutral-offwhite border-white/[0.08] rounded-tl-none'
                }`}
              >
                {/* Tool Calling Badges */}
                {msg.toolsUsed && msg.toolsUsed.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pb-2 mb-2 border-b border-white/[0.08]">
                    <span className="text-[10px] text-accent-cyan flex items-center gap-1">
                      <Cpu className="w-3 h-3" />
                      Tools Executed:
                    </span>
                    {msg.toolsUsed.map((tool: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded font-mono text-[10px] bg-white/5 border border-white/10 text-neutral-muted"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}

                {/* Content */}
                <div className="whitespace-pre-wrap leading-relaxed space-y-2 text-xs">
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-md">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue text-midnight flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl glass-panel text-xs text-neutral-muted border border-white/[0.08] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
              <span>Querying general ledger & running financial tools...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="flex-shrink-0 px-3 py-1.5 rounded-xl text-xs bg-navy/60 hover:bg-navy border border-white/[0.06] hover:border-accent-blue/40 text-neutral-muted hover:text-white transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="relative flex-shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-2 rounded-2xl glass-panel border border-white/[0.08]"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ARTHIQ about profit leakages, cash flow, vendor price creep, or ratios..."
            className="flex-1 px-4 py-2 bg-transparent text-xs text-white placeholder-neutral-muted focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-accent-blue to-accent-cyan text-midnight hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1.5 shadow-glow"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

