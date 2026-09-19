import React from 'react';
import { 
  LayoutDashboard, Inbox, Map, ListTodo, Cpu, CalendarClock, 
  CalendarRange, CloudSun, PlaySquare, BarChart3, Bell, ScrollText, 
  PlusCircle, Share2, Layers, RotateCcw, ShieldAlert, Database, 
  Users, Settings2 
} from 'lucide-react';
import { store } from '../../services/store';
import { UserRole } from '../../types/railway';
import { RailLogo } from '../common/RailLogo';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onResetDemoModal: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  isAction?: boolean;
  actionKey?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentPath, 
  onNavigate,
  onResetDemoModal
}) => {
  const state = store.getState();
  const role = state.currentUser?.role || 'CONTROL_OFFICE';
  const pendingRequestsCount = state.requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length;
  const criticalTasksCount = state.tasks.filter(t => t.severity === 'CRITICAL' && t.status !== 'COMPLETED').length;

  const getNavItems = (userRole: UserRole): NavItem[] => {
    switch (userRole) {
      case 'CONTROL_OFFICE':
        return [
          { label: 'Control Dashboard', path: '/', icon: LayoutDashboard },
          { label: 'Request Review', path: '/requests', icon: Inbox, badge: pendingRequestsCount },
          { label: 'Pune Division Map', path: '/map', icon: Map },
          { label: 'Asset & Task Register', path: '/tasks', icon: ListTodo, badge: criticalTasksCount > 0 ? `${criticalTasksCount} Crit` : undefined },
          { label: 'AI Priority Workbench', path: '/ai-workbench', icon: Cpu },
          { label: 'Block Planning Workspace', path: '/blocks/planning', icon: CalendarClock },
          { label: 'Weekly Plan', path: '/blocks/weekly', icon: CalendarRange },
          { label: 'Monthly Plan', path: '/blocks/monthly', icon: Layers },
          { label: 'Weather Intelligence', path: '/weather', icon: CloudSun },
          { label: 'What-if Simulator', path: '/simulator', icon: PlaySquare },
          { label: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
          { label: 'Notifications', path: '/notifications', icon: Bell },
          { label: 'Audit Log', path: '/audit', icon: ScrollText },
        ];

      case 'ENGINEERING':
        return [
          { label: 'Engineering Dashboard', path: '/', icon: LayoutDashboard },
          { label: 'My Requests', path: '/requests', icon: Inbox },
          { label: 'New Maintenance Request', path: '/requests/new', icon: PlusCircle },
          { label: 'Shared Corridor View', path: '/blocks/weekly', icon: Share2 },
          { label: 'My Tasks', path: '/tasks', icon: ListTodo },
          { label: 'Published Plans', path: '/blocks/weekly', icon: CalendarRange },
          { label: 'Weather Risk', path: '/weather', icon: CloudSun },
          { label: 'Notifications', path: '/notifications', icon: Bell },
        ];

      case 'TRD':
        return [
          { label: 'TRD Dashboard', path: '/', icon: LayoutDashboard },
          { label: 'My Requests', path: '/requests', icon: Inbox },
          { label: 'New Maintenance Request', path: '/requests/new', icon: PlusCircle },
          { label: 'Shared Corridor View', path: '/blocks/weekly', icon: Share2 },
          { label: 'My Tasks', path: '/tasks', icon: ListTodo },
          { label: 'Published Plans', path: '/blocks/weekly', icon: CalendarRange },
          { label: 'Weather Risk', path: '/weather', icon: CloudSun },
          { label: 'Notifications', path: '/notifications', icon: Bell },
        ];

      case 'S_AND_T':
        return [
          { label: 'S&T Dashboard', path: '/', icon: LayoutDashboard },
          { label: 'My Requests', path: '/requests', icon: Inbox },
          { label: 'New Maintenance Request', path: '/requests/new', icon: PlusCircle },
          { label: 'Shared Corridor View', path: '/blocks/weekly', icon: Share2 },
          { label: 'My Tasks', path: '/tasks', icon: ListTodo },
          { label: 'Published Plans', path: '/blocks/weekly', icon: CalendarRange },
          { label: 'Weather Risk', path: '/weather', icon: CloudSun },
          { label: 'Notifications', path: '/notifications', icon: Bell },
        ];

      case 'SENIOR_REVIEWER':
        return [
          { label: 'Executive Dashboard', path: '/', icon: LayoutDashboard },
          { label: 'Pune Division Map', path: '/map', icon: Map },
          { label: 'Weekly Plan', path: '/blocks/weekly', icon: CalendarRange },
          { label: 'Monthly Plan', path: '/blocks/monthly', icon: Layers },
          { label: 'What-if Simulator', path: '/simulator', icon: PlaySquare },
          { label: 'Analytics & Reports', path: '/analytics', icon: BarChart3 },
          { label: 'Critical Exceptions', path: '/tasks', icon: ShieldAlert, badge: criticalTasksCount },
        ];

      case 'ADMIN':
        return [
          { label: 'Admin Dashboard', path: '/', icon: LayoutDashboard },
          { label: 'Users & Roles', path: '/admin/users', icon: Users },
          { label: 'Master Data', path: '/admin/master', icon: Database },
          { label: 'Data Integration', path: '/data-integration', icon: Database },
          { label: 'AI Configuration', path: '/ai-workbench', icon: Settings2 },
          { label: 'Weather Configuration', path: '/weather', icon: CloudSun },
          { label: 'Audit Log', path: '/audit', icon: ScrollText },
        ];
    }
  };

  const navItems = getNavItems(role);

  return (
    <aside className="w-64 flex-shrink-0 bg-[#071626] border-r border-[#244B6A] flex flex-col justify-between h-screen sticky top-0 select-none">
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#244B6A]/80 cursor-pointer" onClick={() => onNavigate('/')}>
          <RailLogo size="md" showText={true} />
        </div>

        {/* Role Badge Indicator */}
        <div className="px-4 py-2.5 bg-[#0B1F33] border-b border-[#244B6A]/60 flex items-center justify-between">
          <span className="text-[10px] text-[#6E8AA3] uppercase tracking-wider font-mono">Workspace Role</span>
          <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-[#163B5C] text-[#20C6B7] border border-[#244B6A]">
            {role.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

            return (
              <button
                key={item.path + item.label}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#102A43] to-[#163B5C] text-[#20C6B7] border border-[#244B6A] shadow-sm font-semibold'
                    : 'text-[#A7C1D4] hover:bg-[#0B1F33] hover:text-[#E6F4F1]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#20C6B7]' : 'text-[#6E8AA3]'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    typeof item.badge === 'number' && item.badge > 0
                      ? 'bg-[#F97316]/20 text-[#F97316] border border-[#F97316]/30'
                      : 'bg-[#F05252]/20 text-[#F05252] border border-[#F05252]/30'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Demo Reset Control */}
      <div className="p-3 border-t border-[#244B6A]/80 bg-[#0B1F33]">
        <button
          onClick={onResetDemoModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#A7C1D4] hover:text-[#E6F4F1] bg-[#102A43] hover:bg-[#163B5C] border border-[#244B6A] transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span>Reset Demo Data</span>
        </button>

        <div className="mt-2 text-center">
          <p className="text-[10px] text-[#6E8AA3] font-mono">
            SIH 2026 · PS ID 26027
          </p>
        </div>
      </div>
    </aside>
  );
};
