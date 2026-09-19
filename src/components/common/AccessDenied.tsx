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
      <div className="w-16 h-16 rounded-2xl bg-[#F05252]/15 border border-[#F05252]/40 flex items-center justify-center mb-5 text-[#F05252] shadow-xl shadow-red-950/30">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-bold text-[#E6F4F1] tracking-tight">Access Restricted</h2>
      <p className="text-sm text-[#A7C1D4] max-w-md mt-2 leading-relaxed">
        Your current role (<span className="text-[#20C6B7] font-semibold">{currentUser?.role.replace(/_/g, ' ')}</span>) does not hold authorization to access this Control Office operational view.
      </p>

      {requiredRole && (
        <div className="mt-4 px-3 py-1.5 rounded-lg bg-[#102A43] border border-[#244B6A] text-xs font-mono text-[#F4B942] flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" />
          <span>Requires: {requiredRole}</span>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Dashboard</span>
        </button>
      </div>

      <div className="mt-8 p-3 rounded-lg bg-[#0B1F33] border border-[#244B6A]/50 text-[11px] text-[#6E8AA3] max-w-sm">
        Role-based access is enforced under Indian Railways Operating & Maintenance Safety Manual. To test this view, switch to an authorized persona from the top-right profile switcher.
      </div>
    </div>
  );
};
