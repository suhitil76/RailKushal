import React, { useState } from 'react';
import { Sparkles, X, Send, Bot, User as UserIcon, ExternalLink, HelpCircle } from 'lucide-react';
import { queryRailSaarthi, RailSaarthiMessage } from '../../services/railSaarthi';

interface RailSaarthiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
  currentPath: string;
}

const PRESET_PROMPTS = [
  "Which critical tasks are pending?",
  "Why is ENG-104 high priority?",
  "Which tasks can be bundled on Chinchwad–Talegaon?",
  "Which blocks are affected by rain tomorrow?",
  "What requests are waiting for Control Office review?",
  "Which section has the highest risk?",
  "What is the recommended weekly plan?",
  "Which department has the highest backlog?",
  "How does weather affect TRD tasks?",
  "What does an integrated block mean?"
];

export const RailSaarthiDrawer: React.FC<RailSaarthiDrawerProps> = ({ 
  isOpen, 
  onClose,
  onNavigate,
  currentPath 
}) => {
  const [messages, setMessages] = useState<RailSaarthiMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Namaste! I am **RailSaarthi**, your Pune Division AI Planning Assistant for **Problem Statement 26027**.\n\nI can assist you with multi-department task bundling, train timetable conflict analysis, weather gating, and priority explanations. How may I support your shift today?`
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (textToSend?: string) => {
    const q = textToSend || inputVal;
    if (!q.trim()) return;

    const userMsg: RailSaarthiMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');

    // Query local AI engine
    setTimeout(() => {
      const resp = queryRailSaarthi(q, currentPath);
      setMessages(prev => [...prev, resp]);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-lg h-full bg-rail-bg border-l border-rail-border flex flex-col shadow-2xl animate-in slide-in-from-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-rail-border bg-rail-deep flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#20C6B7] to-[#38BDF8] p-0.5 flex items-center justify-center shadow-lg shadow-slate-200/60">
              <div className="w-full h-full bg-rail-bg rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-rail-teal" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-rail-text">RailSaarthi</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rail-elevated text-rail-cyan border border-rail-border">
                  AI Copilot
                </span>
              </div>
              <p className="text-[11px] text-rail-secondary">RailKushal Planning Assistant · Pune Division</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-rail-muted hover:text-rail-text hover:bg-rail-elevated"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts Carousel / Pills */}
        <div className="p-3 border-b border-rail-border/70 bg-rail-deep/60 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs">
            <HelpCircle className="w-3.5 h-3.5 text-rail-teal shrink-0" />
            <span className="text-[10px] text-rail-muted uppercase tracking-wider font-semibold shrink-0">Quick Queries:</span>
            {PRESET_PROMPTS.slice(0, 5).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-rail-surface hover:bg-rail-elevated border border-rail-border text-rail-secondary hover:text-rail-teal text-[11px] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-rail-surface border border-rail-border flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-rail-teal" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-slate-50 border border-rail-teal/40 text-rail-text'
                  : 'bg-rail-deep border border-rail-border text-rail-text'
              }`}>
                <div className="whitespace-pre-line prose prose-invert max-w-none text-xs">
                  {m.text}
                </div>

                {/* Deep links attached to answer */}
                {m.deepLinks && m.deepLinks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-rail-border/70 flex flex-wrap gap-2">
                    {m.deepLinks.map((dl, lIdx) => (
                      <button
                        key={lIdx}
                        onClick={() => {
                          onNavigate(dl.url);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-rail-surface hover:bg-rail-elevated border border-rail-teal/40 text-rail-teal text-[11px] font-medium transition-colors"
                      >
                        <span>{dl.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-1.5 text-right text-[9px] text-rail-muted font-mono">
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-rail-elevated border border-rail-border flex items-center justify-center shrink-0 mt-1">
                  <UserIcon className="w-4 h-4 text-rail-cyan" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-rail-border bg-rail-deep">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input 
              type="text"
              placeholder="Ask RailSaarthi about tasks, bundling, weather, corridors..."
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              className="flex-1 bg-rail-bg border border-rail-border rounded-lg px-3.5 py-2 text-xs text-rail-text placeholder-[#6E8AA3] focus:outline-none focus:border-rail-teal"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mandatory Assistant Disclaimer */}
          <p className="mt-2 text-[10px] text-center text-rail-muted">
            RailSaarthi provides decision-support guidance. Final operational and safety decisions remain with authorized railway officials.
          </p>
        </div>
      </div>
    </div>
  );
};
