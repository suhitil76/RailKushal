import React from 'react';
import { ShieldAlert, ArrowLeft, Lock } from 'lucide-react';
import { store } from '../../services/store';

interface AccessDeniedProps {
  onGoHome: () => void;
  requiredRole?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({ onGoHome, requiredRole }) => {
  const currentUser = store.getState().currentUser;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rail-coral/15 border border-rail-coral/40 flex items-center justify-center mb-5 text-rail-coral shadow-xl shadow-red-950/30">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-rail-text tracking-tight">Access Restricted</h2>
      <p className="text-sm text-rail-secondary max-w-md mt-2 leading-relaxed">
        Your current role (<span className="text-rail-teal font-semibold">{currentUser?.role.replace(/_/g, ' ')}</span>) does not hold authorization to access this Control Office operational view.
      </p>

      {requiredRole && (
        <div className="mt-4 px-3 py-1.5 rounded-lg bg-rail-surface border border-rail-border text-xs font-mono text-rail-amber flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Requires: {requiredRole}</span>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rail-teal hover:bg-rail-teal/90 text-white font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>

      <div className="mt-8 p-3 rounded-lg bg-rail-deep border border-rail-border/50 text-[11px] text-rail-muted max-w-sm">
        Role-based access is enforced under Indian Railways Operating & Maintenance Safety Manual. To test this view, switch to an authorized persona from the top-right profile switcher.
      </div>
    </div>
  );
};
