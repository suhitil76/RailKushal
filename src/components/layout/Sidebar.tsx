import React from 'react';
import { 
  LayoutDashboard, Inbox, Map, ListTodo, Cpu, CalendarClock, 
  CalendarRange, CloudSun, PlaySquare, BarChart3, Bell, ScrollText, 
  PlusCircle, Share2, Layers, RotateCcw, ShieldAlert, Database, 
  Users, Settings2, Globe, AlertTriangle
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
  section?: string;
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
          { label: 'Control Dashboard', path: '/', icon: LayoutDashboard, section: 'Overview' },
          { label: 'All India Overview', path: '/overview/all-india', icon: Globe, section: 'Overview' },
          { label: 'Critical Alerts', path: '/alerts', icon: AlertTriangle, badge: criticalTasksCount > 0 ? criticalTasksCount : undefined, section: 'Overview' },
          { label: 'Request Review', path: '/requests', icon: Inbox, badge: pendingRequestsCount, section: 'Operations' },
          { label: 'Pune Division Map', path: '/map', icon: Map, section: 'Operations' },
          { label: 'Asset & Task Register', path: '/tasks', icon: ListTodo, badge: criticalTasksCount > 0 ? `${criticalTasksCount} Crit` : undefined, section: 'Operations' },
          { label: 'AI Priority Workbench', path: '/ai-workbench', icon: Cpu, section: 'Planning' },
          { label: 'Block Planning Workspace', path: '/blocks/planning', icon: CalendarClock, section: 'Planning' },
          { label: 'Weekly Plan', path: '/blocks/weekly', icon: CalendarRange, section: 'Planning' },
          { label: 'Monthly Plan', path: '/blocks/monthly', icon: Layers, section: 'Planning' },
          { label: 'Weather Intelligence', path: '/weather', icon: CloudSun, section: 'Intelligence' },
          { label: 'What-if Simulator', path: '/simulator', icon: PlaySquare, section: 'Intelligence' },
          { label: 'Analytics & Reports', path: '/analytics', icon: BarChart3, section: 'Intelligence' },
          { label: 'Notifications', path: '/notifications', icon: Bell, section: 'System' },
          { label: 'Audit Log', path: '/audit', icon: ScrollText, section: 'System' },
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
          { label: 'All India Overview', path: '/overview/all-india', icon: Globe },
          { label: 'Critical Alerts', path: '/alerts', icon: AlertTriangle, badge: criticalTasksCount },
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
          { label: 'All India Overview', path: '/overview/all-india', icon: Globe },
          { label: 'Critical Alerts', path: '/alerts', icon: AlertTriangle },
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

  // Group items by section header (for CONTROL_OFFICE)
  const sections = ['Overview', 'Operations', 'Planning', 'Intelligence', 'System'];
  const hasSections = navItems.some(i => i.section);

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-rail-border flex flex-col justify-between h-screen sticky top-0 select-none overflow-hidden">
      {/* Brand Header */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 border-b border-rail-border cursor-pointer bg-slate-50" onClick={() => onNavigate('/')}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rail-teal flex items-center justify-center">
              <span className="text-white font-black text-xs">RK</span>
            </div>
            <div>
              <div className="text-white font-extrabold text-sm tracking-tight">RAIL<span className="text-rail-teal">KUSHAL</span></div>
              <div className="text-rail-muted text-[10px]">AI Block Planning · SIH 2026</div>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-4 py-2 bg-slate-50 border-b border-rail-border flex items-center justify-between">
          <span className="text-[10px] text-blue-300 uppercase tracking-wider font-mono">Role</span>
          <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-rail-teal/20 text-rail-teal border border-rail-teal/30">
            {role.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-0.5">
          {hasSections 
            ? sections.map(sec => {
                const sectionItems = navItems.filter(i => i.section === sec);
                if (sectionItems.length === 0) return null;
                return (
                  <div key={sec}>
                    <div className="px-3 pt-3 pb-1 text-[10px] text-rail-muted uppercase tracking-widest font-semibold">{sec}</div>
                    {sectionItems.map(item => <SidebarItem key={item.path + item.label} item={item} currentPath={currentPath} onNavigate={onNavigate} />)}
                  </div>
                );
              })
            : navItems.map(item => <SidebarItem key={item.path + item.label} item={item} currentPath={currentPath} onNavigate={onNavigate} />)
          }
        </nav>
      </div>

      {/* Footer / Demo Reset Control */}
      <div className="p-3 border-t border-rail-border bg-[#0D2744]">
        <button
          onClick={onResetDemoModal}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-blue-300 hover:text-rail-text bg-slate-100 hover:bg-slate-100 border border-rail-border transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo Data</span>
        </button>
        <div className="mt-2 text-center">
          <p className="text-[10px] text-rail-muted font-mono">SIH 2026 · PS ID 26027</p>
        </div>
      </div>
    </aside>
  );
};

// Sub-component for nav items
const SidebarItem: React.FC<{
  item: { label: string; path: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number };
  currentPath: string;
  onNavigate: (path: string) => void;
}> = ({ item, currentPath, onNavigate }) => {
  const Icon = item.icon;
  const isActive = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));

  return (
    <button
      onClick={() => onNavigate(item.path)}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
        isActive
          ? 'bg-rail-teal text-white font-semibold shadow-sm'
          : 'text-rail-secondary hover:bg-blue-800/60 hover:text-white'
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
        <span className="truncate text-left">{item.label}</span>
      </div>

      {item.badge !== undefined && (
        <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ml-1 ${
          isActive 
            ? 'bg-white/20 text-white' 
            : 'bg-red-500/20 text-red-300 border border-red-500/30'
        }`}>
          {item.badge}
        </span>
      )}
    </button>
  );
};
