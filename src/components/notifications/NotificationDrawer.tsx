import React from 'react';
import { X, CheckCheck, Bell, AlertTriangle, AlertCircle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { store } from '../../services/store';
import { Notification } from '../../types/railway';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (path: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ 
  isOpen, 
  onClose,
  onNavigate 
}) => {
  if (!isOpen) return null;

  const state = store.getState();
  const notifications = state.notifications;
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    store.markAllNotificationsAsRead();
  };

  const handleNotificationClick = (n: Notification) => {
    store.markNotificationAsRead(n.id);
    if (n.link) {
      onNavigate(n.link);
      onClose();
    }
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'CRITICAL':
        return <AlertCircle className="w-4 h-4 text-rail-coral" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-rail-amber" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-rail-emerald" />;
      default:
        return <Info className="w-4 h-4 text-rail-cyan" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md h-full bg-rail-deep border-l border-rail-border flex flex-col shadow-2xl animate-in slide-in-from-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-rail-border flex items-center justify-between bg-rail-surface">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-rail-teal" />
            <h3 className="font-bold text-sm text-rail-text">Division Operational Feed</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rail-coral/20 text-rail-coral border border-rail-coral/40">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-rail-teal hover:underline flex items-center gap-1 font-medium"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark read
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1 rounded text-rail-muted hover:text-rail-text hover:bg-rail-elevated"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-rail-muted">
              No operational notices at this time.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  n.isRead 
                    ? 'bg-rail-bg/70 border-rail-border/50 text-rail-secondary' 
                    : 'bg-rail-surface border-rail-teal/40 text-rail-text shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate">{n.title}</span>
                      <span className="text-[10px] text-rail-muted ml-2 shrink-0 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed text-rail-secondary">{n.message}</p>
                    {n.link && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-rail-teal font-medium">
                        <span>Inspect record</span>
                        <ArrowRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-rail-border bg-rail-bg text-center text-[10px] text-rail-muted">
          Automated event dispatch from TMS, TDMS, SMMS, COA & Met Radar
        </div>
      </div>
    </div>
  );
};
