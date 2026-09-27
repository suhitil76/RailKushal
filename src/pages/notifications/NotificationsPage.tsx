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
      <div className="flex items-center justify-between pb-4 border-b border-rail-border">
        <div>
          <h1 className="text-xl font-extrabold text-rail-text tracking-tight">Division Notifications Feed</h1>
          <p className="text-xs text-rail-secondary mt-0.5">Automated telemetry alerts and decision dispatches.</p>
        </div>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rail-surface hover:bg-rail-elevated border border-rail-border text-xs font-semibold text-rail-teal transition-colors"
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
              n.isRead ? 'bg-rail-deep/70 border-rail-border/60 text-rail-secondary' : 'bg-rail-surface border-rail-teal text-rail-text shadow-md'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-xs text-rail-text">{n.title}</h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rail-bg text-rail-teal">
                  {n.targetRole || 'ALL'}
                </span>
              </div>
              <span className="text-[10px] text-rail-muted font-mono">
                {new Date(n.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-rail-secondary mt-1.5 leading-relaxed">{n.message}</p>
            {n.link && (
              <div className="mt-2 text-xs text-rail-teal font-semibold flex items-center gap-1">
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
