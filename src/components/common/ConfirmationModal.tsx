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
        return 'bg-[#F05252] hover:bg-[#F05252]/90 text-white';
      case 'warning':
        return 'bg-[#F4B942] hover:bg-[#F4B942]/90 text-[#071626] font-bold';
      case 'success':
        return 'bg-[#34D399] hover:bg-[#34D399]/90 text-[#071626] font-bold';
      default:
        return 'bg-[#20C6B7] hover:bg-[#20C6B7]/90 text-[#071626] font-bold';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
      <div 
        className="w-full max-w-md rounded-xl bg-[#0B1F33] border border-[#244B6A] shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#244B6A] bg-[#102A43] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'danger' && <AlertTriangle className="w-5 h-5 text-[#F05252]" />}
            {type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#F4B942]" />}
            {type === 'success' && <CheckCircle className="w-5 h-5 text-[#34D399]" />}
            {type === 'primary' && <Info className="w-5 h-5 text-[#20C6B7]" />}
            <h3 className="font-bold text-sm text-[#E6F4F1]">{title}</h3>
          </div>
          <button onClick={onCancel} className="text-[#6E8AA3] hover:text-[#E6F4F1]">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <p className="text-xs text-[#A7C1D4] leading-relaxed">{description}</p>

          {requireReason && (
            <div>
              <label className="block text-[11px] font-semibold text-[#E6F4F1] mb-1">
                Operational Rationale / Justification <span className="text-[#F05252]">*</span>
              </label>
              <textarea
                value={reason}
                onChange={e => {
                  setReason(e.target.value);
                  if (error) setError(false);
                }}
                rows={3}
                placeholder={reasonPlaceholder}
                className={`w-full bg-[#071626] border rounded-lg p-2.5 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:outline-none ${
                  error ? 'border-[#F05252] ring-1 ring-[#F05252]' : 'border-[#244B6A] focus:border-[#20C6B7]'
                }`}
              />
              {error && (
                <p className="text-[10px] text-[#F05252] mt-1">Operational justification is mandatory for compliance audit.</p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 border-t border-[#244B6A] bg-[#071626] flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg border border-[#244B6A] text-xs font-semibold text-[#A7C1D4] hover:bg-[#102A43] hover:text-[#E6F4F1] transition-colors"
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
