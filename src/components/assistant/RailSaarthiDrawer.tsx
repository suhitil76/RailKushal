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
        className="w-full max-w-lg h-full bg-[#071626] border-l border-[#244B6A] flex flex-col shadow-2xl animate-in slide-in-from-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#244B6A] bg-[#0B1F33] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#20C6B7] to-[#38BDF8] p-0.5 flex items-center justify-center shadow-lg shadow-cyan-900/30">
              <div className="w-full h-full bg-[#071626] rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#20C6B7]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#E6F4F1]">RailSaarthi</h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#163B5C] text-[#38BDF8] border border-[#244B6A]">
                  AI Copilot
                </span>
              </div>
              <p className="text-[11px] text-[#A7C1D4]">RailKushal Planning Assistant · Pune Division</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6E8AA3] hover:text-[#E6F4F1] hover:bg-[#163B5C]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Prompts Carousel / Pills */}
        <div className="p-3 border-b border-[#244B6A]/70 bg-[#0B1F33]/60 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#20C6B7] shrink-0" />
            <span className="text-[10px] text-[#6E8AA3] uppercase tracking-wider font-semibold shrink-0">Quick Queries:</span>
            {PRESET_PROMPTS.slice(0, 5).map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-[#A7C1D4] hover:text-[#20C6B7] text-[11px] transition-colors"
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
                <div className="w-7 h-7 rounded-lg bg-[#102A43] border border-[#244B6A] flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-[#20C6B7]" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-[#163B5C] to-[#102A43] border border-[#20C6B7]/40 text-[#E6F4F1]'
                  : 'bg-[#0B1F33] border border-[#244B6A] text-[#E6F4F1]'
              }`}>
                <div className="whitespace-pre-line prose prose-invert max-w-none text-xs">
                  {m.text}
                </div>

                {/* Deep links attached to answer */}
                {m.deepLinks && m.deepLinks.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-[#244B6A]/70 flex flex-wrap gap-2">
                    {m.deepLinks.map((dl, lIdx) => (
                      <button
                        key={lIdx}
                        onClick={() => {
                          onNavigate(dl.url);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#102A43] hover:bg-[#163B5C] border border-[#20C6B7]/40 text-[#20C6B7] text-[11px] font-medium transition-colors"
                      >
                        <span>{dl.label}</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-1.5 text-right text-[9px] text-[#6E8AA3] font-mono">
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-[#163B5C] border border-[#244B6A] flex items-center justify-center shrink-0 mt-1">
                  <UserIcon className="w-4 h-4 text-[#38BDF8]" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#244B6A] bg-[#0B1F33]">
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
              className="flex-1 bg-[#071626] border border-[#244B6A] rounded-lg px-3.5 py-2 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:outline-none focus:border-[#20C6B7]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mandatory Assistant Disclaimer */}
          <p className="mt-2 text-[10px] text-center text-[#6E8AA3]">
            RailSaarthi provides decision-support guidance. Final operational and safety decisions remain with authorized railway officials.
          </p>
        </div>
      </div>
    </div>
  );
};
