import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: 'danger' | 'warning' | 'primary' | 'success';
  requireReason?: boolean;
  reasonPlaceholder?: string;
  onConfirm: (reason?: string) => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  type = 'primary',
  requireReason = false,
  reasonPlaceholder = 'Enter operational rationale (mandatory for audit trail)...',
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(reason.trim());
    setReason('');
    setError(false);
  };

  const getButtonBg = () => {
    switch (type) {
      case 'danger':
        return 'bg-rail-coral hover:bg-rail-coral/90 text-white';
      case 'warning':
        return 'bg-rail-amber hover:bg-rail-amber/90 text-white font-bold';
      case 'success':
        return 'bg-rail-emerald hover:bg-rail-emerald/90 text-white font-bold';
      default:
        return 'bg-rail-teal hover:bg-rail-teal/90 text-white font-bold';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="w-full max-w-md rounded-xl bg-rail-deep border border-rail-border shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-rail-border bg-rail-surface flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'danger' && <AlertTriangle className="w-5 h-5 text-rail-coral" />}
            {type === 'warning' && <AlertTriangle className="w-5 h-5 text-rail-amber" />}
            {type === 'success' && <CheckCircle className="w-5 h-5 text-rail-emerald" />}
            {type === 'primary' && <Info className="w-5 h-5 text-rail-teal" />}
            <h3 className="font-bold text-sm text-rail-text">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-rail-muted hover:text-rail-text">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-rail-secondary leading-relaxed">{description}</p>

          {requireReason && (
            <div>
              <label className="block text-[11px] font-semibold text-rail-text mb-1">
                Operational Rationale / Justification <span className="text-rail-coral">*</span>
              </label>
              <textarea
                value={reason}
                onChange={e => {
                  setReason(e.target.value);
                  if (error) setError(false);
                }}
                rows={3}
                placeholder={reasonPlaceholder}
                className={`w-full bg-rail-bg border rounded-lg p-2.5 text-xs text-rail-text placeholder-[#6E8AA3] focus:outline-none ${
                  error ? 'border-rail-coral ring-1 ring-[#F05252]' : 'border-rail-border focus:border-rail-teal'
                }`}
              />
              {error && (
                <p className="text-[10px] text-rail-coral mt-1">Operational justification is mandatory for compliance audit.</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-rail-border bg-rail-bg flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-rail-border text-xs font-semibold text-rail-secondary hover:bg-rail-surface hover:text-rail-text transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${getButtonBg()}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
