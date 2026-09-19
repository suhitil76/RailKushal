import React, { useState } from 'react';
import { 
  Bell, Search, Shield, ChevronDown, LogOut, Radio, UserCheck, 
  ExternalLink, Sparkles, RefreshCw 
} from 'lucide-react';
import { store } from '../../services/store';
import { UserRole } from '../../types/railway';
import { toast } from '../common/Toast';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenNotifications: () => void;
  onOpenRailSaarthi: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentPath, 
  onNavigate, 
  onOpenNotifications,
  onOpenRailSaarthi 
}) => {
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const state = store.getState();
  const currentUser = state.currentUser;
  const unreadCount = state.notifications.filter(n => !n.isRead).length;

  const handlePersonaSwitch = (role: UserRole) => {
    store.switchPersona(role);
    setShowRoleDropdown(false);
    toast.info('Role Switched', `Logged in as ${role.replace(/_/g, ' ')}`);
    onNavigate('/');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.trim().toUpperCase();
    if (q.startsWith('REQ-') || q.startsWith('REQ')) {
      onNavigate('/requests');
    } else if (q.startsWith('ENG-') || q.startsWith('TRD-') || q.startsWith('SNT-') || q.startsWith('TASK')) {
      onNavigate('/tasks');
    } else if (q === 'PUNE' || q === 'LNL' || q === 'CCH' || q.includes('MAP')) {
      onNavigate('/map');
    } else {
      onNavigate('/tasks');
    }
  };

  // Convert current path into readable breadcrumb
  const pathParts = currentPath.split('/').filter(Boolean);
  const breadcrumb = pathParts.length === 0 
    ? 'Dashboard' 
    : pathParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ');

  return (
    <header className="sticky top-0 z-30 flex flex-col w-full bg-[#0B1F33]/95 backdrop-blur border-b border-[#244B6A]">
      {/* Persistent Disclaimer Banner */}
      <div className="w-full bg-[#102A43] border-b border-[#244B6A]/60 px-4 py-1 flex items-center justify-between text-[11px] text-[#A7C1D4]">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#20C6B7] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#20C6B7]"></span>
          </span>
          <span className="font-semibold text-[#20C6B7] uppercase tracking-wider">Prototype Mode</span>
          <span className="text-[#6E8AA3]">·</span>
          <span>Synthetic / Demo Operational Data · Decision-support only. Final operational and safety decisions remain with authorized railway officials.</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-[#34D399]">
            <Radio className="w-3 h-3 animate-pulse" /> Live Central Railway Sync (COA/TMS Sim)
          </span>
          <span className="text-[#6E8AA3]">|</span>
          <span className="font-mono text-[#A7C1D4]">Div: PUNE / CR</span>
        </div>
      </div>

      {/* Main Topbar */}
      <div className="flex items-center justify-between h-14 px-5">
        {/* Left: Breadcrumbs & Path */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[#A7C1D4]">
            <span className="text-[#6E8AA3]">RailKushal</span>
            <span className="text-[#6E8AA3]">/</span>
            <span className="font-medium text-[#E6F4F1]">{breadcrumb}</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E8AA3]" />
            <input 
              type="text" 
              placeholder="Search station (PUNE), section, task (ENG-104), block ID..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#071626] border border-[#244B6A] rounded-lg pl-9 pr-4 py-1.5 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:outline-none focus:border-[#20C6B7] focus:ring-1 focus:ring-[#20C6B7]"
            />
          </form>
        </div>

        {/* Right: Actions & User Persona */}
        <div className="flex items-center gap-3">
          {/* RailSaarthi AI Trigger */}
          <button 
            onClick={onOpenRailSaarthi}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#102A43] to-[#163B5C] border border-[#244B6A] hover:border-[#20C6B7] text-xs font-medium text-[#38BDF8] transition-colors shadow-sm"
            title="Ask RailSaarthi AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#20C6B7]" />
            <span className="hidden sm:inline">RailSaarthi AI</span>
          </button>

          {/* Notifications Bell */}
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-[#071626] border border-[#244B6A] hover:border-[#20C6B7] text-[#A7C1D4] hover:text-[#E6F4F1] transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#F05252] text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile / Quick Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-lg bg-[#071626] border border-[#244B6A] hover:border-[#20C6B7] text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-[#163B5C] border border-[#20C6B7]/50 flex items-center justify-center text-xs font-bold text-[#20C6B7]">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden md:flex flex-col text-xs leading-none">
                <span className="font-semibold text-[#E6F4F1]">{currentUser?.name}</span>
                <span className="text-[10px] text-[#20C6B7] uppercase font-mono mt-0.5">
                  {currentUser?.role.replace(/_/g, ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#6E8AA3]" />
            </button>

            {/* Persona Switcher Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0B1F33] border border-[#244B6A] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-[#244B6A]/80">
                  <p className="text-[11px] text-[#6E8AA3] uppercase tracking-wider font-semibold">Active Session</p>
                  <p className="text-xs font-bold text-[#E6F4F1] mt-0.5">{currentUser?.name}</p>
                  <p className="text-[11px] text-[#A7C1D4]">{currentUser?.designation}</p>
                </div>

                <div className="py-2">
                  <p className="px-3 pb-1 text-[10px] text-[#6E8AA3] uppercase tracking-wider font-semibold">
                    Switch Demo Persona
                  </p>
                  {state.users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handlePersonaSwitch(u.role)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        currentUser?.id === u.id 
                          ? 'bg-[#163B5C] text-[#20C6B7] font-semibold' 
                          : 'text-[#A7C1D4] hover:bg-[#102A43] hover:text-[#E6F4F1]'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span>{u.name}</span>
                        <span className="text-[10px] text-[#6E8AA3]">{u.role.replace(/_/g, ' ')}</span>
                      </div>
                      {currentUser?.id === u.id && <UserCheck className="w-3.5 h-3.5 text-[#20C6B7]" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-[#244B6A]/80 pt-1">
                  <button 
                    onClick={() => {
                      store.logout();
                      setShowRoleDropdown(false);
                      onNavigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-[#F05252] hover:bg-[#102A43] rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
