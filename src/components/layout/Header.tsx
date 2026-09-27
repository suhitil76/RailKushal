import React, { useState } from 'react';
import { 
  Bell, Search, Shield, ChevronDown, LogOut, Radio, UserCheck, 
  ExternalLink, Sparkles, RefreshCw, AlertTriangle
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
    <header className="sticky top-0 z-30 flex flex-col w-full shadow-sm">
      {/* Persistent Disclaimer Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-200 px-4 py-1 flex items-center justify-between text-[11px] text-amber-800">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-bold uppercase tracking-wider">Prototype Mode</span>
          <span className="text-amber-500">·</span>
          <span>Synthetic / Demo Operational Data · Decision-support only. Final operational decisions remain with authorized railway officials.</span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1 text-green-700 font-semibold">
            <Radio className="w-3 h-3 animate-pulse" /> Live COA/TMS Sim
          </span>
          <span className="text-amber-500">|</span>
          <span className="font-mono text-amber-700">Network: ALL INDIA</span>
        </div>
      </div>

      {/* Main Navy Topbar */}
      <div className="flex items-center justify-between h-14 px-5 bg-white border-b border-rail-border">
        {/* Left: Breadcrumbs & Path */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-rail-muted text-xs">RailKushal</span>
            <span className="text-slate-400">/</span>
            <span className="font-semibold text-rail-text">{breadcrumb}</span>
          </div>
        </div>

        {/* Center: Global Search Bar */}
        <div className="flex-1 max-w-md mx-6">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
            <input 
              type="text" 
              placeholder="Search station, section, task (ENG-104), block ID..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-rail-border rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder:text-rail-muted focus:outline-none focus:border-rail-teal focus:bg-white"
            />
          </form>
        </div>

        {/* Right: Actions & User Persona */}
        <div className="flex items-center gap-3">
          {/* RailSaarthi AI Trigger */}
          <button 
            onClick={onOpenRailSaarthi}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-rail-border hover:border-rail-teal hover:bg-slate-100 text-xs font-medium text-rail-teal transition-colors"
            title="Ask RailSaarthi AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RailSaarthi AI</span>
          </button>

          {/* Notifications Bell */}
          <button 
            onClick={onOpenNotifications}
            className="relative p-2 rounded-lg bg-slate-50 border border-blue-600/50 hover:border-rail-teal text-rail-secondary hover:text-rail-text transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rail-coral text-[10px] font-bold text-white animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile / Quick Switcher */}
          <div className="relative">
            <button 
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2.5 pl-2.5 pr-2 py-1.5 rounded-lg bg-blue-800/60 border border-blue-600/50 hover:border-blue-400 text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-rail-teal flex items-center justify-center text-xs font-bold text-white">
                {currentUser?.name.charAt(0) || 'U'}
              </div>
              <div className="hidden md:flex flex-col text-xs leading-none">
                <span className="font-semibold text-white">{currentUser?.name}</span>
                <span className="text-[10px] text-rail-teal uppercase font-mono mt-0.5">
                  {currentUser?.role.replace(/_/g, ' ')}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-300" />
            </button>

            {/* Persona Switcher Dropdown */}
            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-rail-border shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-rail-border">
                  <p className="text-[11px] text-rail-muted uppercase tracking-wider font-semibold">Active Session</p>
                  <p className="text-xs font-bold text-rail-text mt-0.5">{currentUser?.name}</p>
                  <p className="text-[11px] text-rail-secondary">{currentUser?.designation}</p>
                </div>

                <div className="py-2">
                  <p className="px-3 pb-1 text-[10px] text-rail-muted uppercase tracking-wider font-semibold">
                    Switch Demo Persona
                  </p>
                  {state.users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => handlePersonaSwitch(u.role)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg transition-colors ${
                        currentUser?.id === u.id 
                          ? 'bg-rail-teal/10 text-rail-teal font-semibold' 
                          : 'text-rail-secondary hover:bg-rail-deep hover:text-rail-text'
                      }`}
                    >
                      <div className="flex flex-col text-left">
                        <span>{u.name}</span>
                        <span className="text-[10px] text-rail-muted">{u.role.replace(/_/g, ' ')}</span>
                      </div>
                      {currentUser?.id === u.id && <UserCheck className="w-3.5 h-3.5 text-rail-teal" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-rail-border pt-1">
                  <button 
                    onClick={() => {
                      store.logout();
                      setShowRoleDropdown(false);
                      onNavigate('/login');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rail-coral hover:bg-red-50 rounded-lg transition-colors"
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
