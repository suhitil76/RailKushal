import React from 'react';
import { Bell, CheckCheck, AlertCircle, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { store } from '../../services/store';

interface NotificationsPageProps {
  onNavigate: (path: string) => void;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ onNavigate }) => {
  const state = store.getState();
  const notifications = state.notifications;

  const handleMarkAllRead = () => {
    store.markAllNotificationsAsRead();
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between pb-4 border-b border-[#244B6A]">
        <div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] tracking-tight">Division Notifications Feed</h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">Automated telemetry alerts and decision dispatches.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] text-xs font-semibold text-[#20C6B7] transition-colors"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map(n => (
          <div
            key={n.id}
            onClick={() => {
              store.markNotificationAsRead(n.id);
              if (n.link) onNavigate(n.link);
            }}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              n.isRead ? 'bg-[#0B1F33]/70 border-[#244B6A]/60 text-[#A7C1D4]' : 'bg-[#102A43] border-[#20C6B7] text-[#E6F4F1] shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs text-[#E6F4F1]">{n.title}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#071626] text-[#20C6B7]">
                  {n.targetRole || 'ALL'}
                </span>
              </div>
              <span className="text-[10px] text-[#6E8AA3] font-mono">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-[#A7C1D4] mt-1.5 leading-relaxed">{n.message}</p>
            {n.link && (
              <div className="mt-2 text-xs text-[#20C6B7] font-semibold flex items-center gap-1">
                <span>View associated record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
