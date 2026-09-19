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
        return <AlertCircle className="w-4 h-4 text-[#F05252]" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-[#F4B942]" />;
      case 'SUCCESS':
        return <CheckCircle2 className="w-4 h-4 text-[#34D399]" />;
      default:
        return <Info className="w-4 h-4 text-[#38BDF8]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md h-full bg-[#0B1F33] border-l border-[#244B6A] flex flex-col shadow-2xl animate-in slide-in-from-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#244B6A] flex items-center justify-between bg-[#102A43]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#20C6B7]" />
            <h3 className="font-bold text-sm text-[#E6F4F1]">Division Operational Feed</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F05252]/20 text-[#F05252] border border-[#F05252]/40">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-[#20C6B7] hover:underline flex items-center gap-1 font-medium"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark read
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-1 rounded text-[#6E8AA3] hover:text-[#E6F4F1] hover:bg-[#163B5C]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-[#6E8AA3]">
              No operational notices at this time.
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  n.isRead 
                    ? 'bg-[#071626]/70 border-[#244B6A]/50 text-[#A7C1D4]' 
                    : 'bg-[#102A43] border-[#20C6B7]/40 text-[#E6F4F1] shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">{getIcon(n.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold truncate">{n.title}</span>
                      <span className="text-[10px] text-[#6E8AA3] ml-2 shrink-0 font-mono">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs mt-1 leading-relaxed text-[#A7C1D4]">{n.message}</p>
                    {n.link && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-[#20C6B7] font-medium">
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
        <div className="p-3 border-t border-[#244B6A] bg-[#071626] text-center text-[10px] text-[#6E8AA3]">
          Automated event dispatch from TMS, TDMS, SMMS, COA & Met Radar
        </div>
      </div>
    </div>
  );
};
