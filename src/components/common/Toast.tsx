import React, { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  durationMs?: number;
}

type Listener = (toast: ToastMessage) => void;
const listeners = new Set<Listener>();

export const toast = {
  success: (title: string, message?: string) => emit({ id: String(Date.now()), title, message, type: 'success' }),
  warning: (title: string, message?: string) => emit({ id: String(Date.now()), title, message, type: 'warning' }),
  error: (title: string, message?: string) => emit({ id: String(Date.now()), title, message, type: 'error' }),
  info: (title: string, message?: string) => emit({ id: String(Date.now()), title, message, type: 'info' }),
};

function emit(t: ToastMessage) {
  listeners.forEach(fn => fn(t));
}

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler: Listener = (newToast) => {
      setToasts(prev => [newToast, ...prev].slice(0, 5));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, newToast.durationMs || 4500);
    };

    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 left-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div 
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border shadow-xl bg-[#0B1F33] text-[#E6F4F1] border-[#244B6A] transition-all animate-in fade-in slide-in-from-bottom-2"
        >
          <div className="mt-0.5">
            {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#34D399]" />}
            {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#F4B942]" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#F05252]" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-[#38BDF8]" />}
          </div>
          <div className="flex-1 text-sm">
            <h4 className="font-semibold text-[#E6F4F1]">{t.title}</h4>
            {t.message && <p className="text-xs text-[#A7C1D4] mt-0.5 leading-relaxed">{t.message}</p>}
          </div>
          <button 
            onClick={() => setToasts(prev => prev.filter(item => item.id !== t.id))}
            className="text-[#6E8AA3] hover:text-[#E6F4F1] p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
