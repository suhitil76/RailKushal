import React, { useState } from 'react';
import { ScrollText, Search, Filter, ShieldCheck, Download } from 'lucide-react';
import { store } from '../../services/store';

export const AuditLogPage: React.FC = () => {
  const state = store.getState();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = state.auditLogs.filter(log => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!log.action.toLowerCase().includes(q) &&
          !log.entityId.toLowerCase().includes(q) &&
          !(log.reason && log.reason.toLowerCase().includes(q))) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-[1700px] mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0B1F33] border border-[#244B6A] p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider font-mono">
              Compliance &amp; Governance
            </span>
            <span className="text-xs text-[#A7C1D4]">Immutable Operational Audit Log</span>
          </div>
          <h1 className="text-xl font-extrabold text-[#E6F4F1] mt-1 tracking-tight">
            Central Railway System Audit &amp; Decision Trail
          </h1>
          <p className="text-xs text-[#A7C1D4] mt-0.5">
            Every block approval, priority override, clarification notice, and data synchronization is permanently recorded.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#34D399] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Integrity Verified (SHA-256 Hash Chain)
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0B1F33] border border-[#244B6A]">
        <div className="flex items-center gap-3">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6E8AA3]" />
            <input
              type="text"
              placeholder="Search action, entity ID, or reason..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#071626] border border-[#244B6A] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E6F4F1] placeholder-[#6E8AA3] focus:outline-none focus:border-[#20C6B7]"
            />
          </div>

          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="bg-[#071626] border border-[#244B6A] rounded-lg px-3 py-1.5 text-xs text-[#E6F4F1] focus:border-[#20C6B7]"
          >
            <option value="ALL">All Actions</option>
            <option value="REQUEST_ACCEPTED">Request Accepted</option>
            <option value="CLARIFICATION_REQUESTED">Clarification Requested</option>
            <option value="AI_PRIORITY_OVERRIDE">AI Priority Override</option>
            <option value="PLAN_APPROVED_AND_PUBLISHED">Plan Published</option>
            <option value="USER_LOGIN">User Login</option>
          </select>
        </div>

        <span className="text-xs text-[#A7C1D4] font-mono">
          Showing <strong className="text-[#20C6B7]">{filteredLogs.length}</strong> immutable events
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0B1F33] border border-[#244B6A] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[650px]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#102A43] text-[#A7C1D4] border-b border-[#244B6A] sticky top-0 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Action</th>
                <th className="p-3.5">Entity Type</th>
                <th className="p-3.5">Entity ID</th>
                <th className="p-3.5">User / Role</th>
                <th className="p-3.5">Operational Reason / Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#244B6A]/50 font-mono text-[11px]">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#102A43]/50 text-[#A7C1D4] transition-colors">
                  <td className="p-3.5 whitespace-nowrap text-[#6E8AA3]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3.5 font-bold text-[#E6F4F1]">
                    <span className="px-2 py-0.5 rounded bg-[#102A43] border border-[#244B6A] text-[#20C6B7]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#38BDF8]">{log.entityType}</td>
                  <td className="p-3.5 font-bold text-[#E6F4F1]">{log.entityId}</td>
                  <td className="p-3.5 whitespace-nowrap text-[#A7C1D4]">
                    {log.userRole || 'SYSTEM'}
                  </td>
                  <td className="p-3.5 font-sans text-xs text-[#E6F4F1] max-w-md truncate">
                    {log.reason || 'Operational action performed.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
