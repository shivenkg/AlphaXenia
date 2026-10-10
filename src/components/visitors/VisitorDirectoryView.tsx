import React, { useState } from 'react';
import {
  Users,
  Search,
  ShieldCheck,
  FileCheck,
  Clock,
  Eye,
  Calendar,
  AlertTriangle,
  Lock,
  Plus,
  FileDown,
  Loader2,
  Layers
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { VisitorProfile } from '../../types';
import { generateVisitorLogsPdf } from '../../utils/reportPdfGenerator';
import { VisitorHistoryTimelineTab } from './VisitorHistoryTimelineTab';

interface VisitorDirectoryViewProps {
  onInviteVisitor: (visitor: VisitorProfile) => void;
}

export const VisitorDirectoryView: React.FC<VisitorDirectoryViewProps> = ({ onInviteVisitor }) => {
  const state = storageService.getState();
  const activeTenant = storageService.getActiveTenant();
  const activeSite = storageService.getActiveSite();
  const [activeTab, setActiveTab] = useState<'directory' | 'history'>('directory');
  const [search, setSearch] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorProfile | null>(null);
  const [selectedVisitorForHistory, setSelectedVisitorForHistory] = useState<VisitorProfile | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleOpenVisitorHistory = (visitor: VisitorProfile) => {
    setSelectedVisitorForHistory(visitor);
    setActiveTab('history');
  };

  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      const q = search.trim().toLowerCase();
      const visitsToExport = q
        ? state.visits.filter(
            (v) =>
              v.visitorName.toLowerCase().includes(q) ||
              (v.visitorCompany && v.visitorCompany.toLowerCase().includes(q)) ||
              (v.hostName && v.hostName.toLowerCase().includes(q))
          )
        : state.visits;
      generateVisitorLogsPdf(
        visitsToExport.length > 0 ? visitsToExport : state.visits,
        activeTenant,
        activeSite,
        q ? `OFFICIAL VISITOR LOG REPORT • FILTER: "${search.trim().toUpperCase()}"` : 'OFFICIAL VISITOR MASTER DIRECTORY & LOG REPORT'
      );
    } catch (err) {
      console.error('Failed to generate visitor logs PDF:', err);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const filteredVisitors = state.visitors.filter((v) => {
    return (
      v.fullName.toLowerCase().includes(search.toLowerCase()) ||
      v.company.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase()) ||
      v.category.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs: Directory vs Visitor History */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-2xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'directory'
                ? 'bg-gradient-to-r from-[#123B5D] to-teal-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-sky-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#143B66]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Visitor Directory & Master Profiles</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'directory' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-sky-950 text-slate-700 dark:text-sky-300'
              }`}
            >
              {state.visitors.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
              activeTab === 'history'
                ? 'bg-gradient-to-r from-[#123B5D] to-teal-800 text-white shadow-xs'
                : 'text-slate-600 dark:text-sky-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#143B66]'
            }`}
          >
            <Clock className="w-4 h-4 text-teal-400" />
            <span>Visitor History</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'history' ? 'bg-white/20 text-white' : 'bg-teal-50 dark:bg-sky-950 text-teal-800 dark:text-sky-300 border border-teal-200 dark:border-sky-800'
              }`}
            >
              Chronological Timeline
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'history' ? (
        <VisitorHistoryTimelineTab
          initialVisitorId={selectedVisitorForHistory?.id || selectedVisitor?.id}
          onInviteVisitor={onInviteVisitor}
          onBackToDirectory={() => setActiveTab('directory')}
        />
      ) : (
        <>
          {/* Header Banner */}
          <div className="bg-white p-5 rounded-xl border border-[#D8E1E8] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0F766E]" />
                <h1 className="text-lg font-bold text-[#172B3A]">Visitor Master Profiles</h1>
              </div>
              <p className="text-xs text-[#526575] mt-1">
                Zero-Trust visitor directory with automatic PII masking, NDA consent verification, and visit history.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 text-[#526575] absolute left-3 top-2.5" />
                <input
                  type="text"
                  id="visitor-search-input"
                  aria-label="Filter visitors by name or email"
                  placeholder="Filter by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#F4F7FA] border border-[#D8E1E8] rounded-lg focus:outline-none focus:border-[#0F766E] transition-colors"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-2 text-[#526575] hover:text-[#172B3A] text-xs font-semibold cursor-pointer"
                    title="Clear filter"
                    aria-label="Clear filter"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                id="download-visitor-directory-pdf-btn"
                onClick={handleDownloadPdf}
                disabled={isExportingPdf}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-semibold transition cursor-pointer shadow-2xs shrink-0"
                title="Download formatted official visitor logs report as PDF document"
              >
                {isExportingPdf ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-700" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <FileDown className="w-3.5 h-3.5 text-teal-700" />
                    <span>Download as PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Directory Table */}
          <div className="bg-white rounded-xl border border-[#D8E1E8] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F4F7FA] border-b border-[#D8E1E8]">
                  <tr className="text-[#526575] uppercase text-[10px] tracking-wider font-semibold">
                    <th className="py-3 px-4">Visitor</th>
                    <th className="py-3 px-4">Organization</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Masked ID Document</th>
                    <th className="py-3 px-4">Consents</th>
                    <th className="py-3 px-4">Watchlist</th>
                    <th className="py-3 px-4">Total Visits</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D8E1E8]">
                  {filteredVisitors.map((v) => (
                    <tr
                      key={v.id}
                      className="group transition-all duration-200 ease-out hover:bg-teal-50/60 dark:hover:bg-[#12365C]/80 hover:shadow-md hover:-translate-y-0.5 hover:z-10 relative cursor-default"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
                            {v.photoUrl ? (
                              <img src={v.photoUrl} alt={v.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <span className="font-bold text-slate-600">{v.fullName.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-[#172B3A]">{v.fullName}</div>
                            <div className="text-[11px] text-[#526575]">{v.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#172B3A]">{v.company}</td>
                      <td className="py-3 px-4">
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                          {v.category.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-700">
                          <Lock className="w-3 h-3 text-[#526575]" />
                          <span>{v.maskedDocumentNumber}</span>
                        </div>
                        <span className="text-[10px] text-[#526575]">{v.documentType}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          <span
                            title="Safety Consent"
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                              v.consentSigned
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            Privacy
                          </span>
                          <span
                            title="NDA Agreement"
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${
                              v.ndaSigned
                                ? 'bg-teal-50 text-teal-700 border-teal-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {v.ndaSigned ? 'NDA Signed' : 'NDA Pending'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            v.watchlistStatus === 'CLEAN'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {v.watchlistStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#172B3A]">{v.totalVisits}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenVisitorHistory(v)}
                            title="View Chronological Visit History Timeline"
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-teal-50 dark:bg-sky-900/40 text-teal-800 dark:text-sky-200 hover:bg-teal-100 dark:hover:bg-sky-800/60 border border-teal-200 dark:border-sky-700 text-xs font-semibold cursor-pointer transition shadow-2xs"
                          >
                            <Clock className="w-3.5 h-3.5 text-teal-700 dark:text-teal-400" />
                            <span>History</span>
                          </button>
                          <button
                            onClick={() => setSelectedVisitor(v)}
                            title="View Full Profile"
                            className="p-1.5 rounded bg-slate-100 dark:bg-sky-900/40 text-slate-700 dark:text-sky-200 hover:bg-slate-200 dark:hover:bg-sky-800/60 border border-transparent dark:border-sky-700 cursor-pointer transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onInviteVisitor(v)}
                            className="bg-[#123B5D] text-white px-2.5 py-1 rounded text-xs font-semibold hover:bg-[#0e2f4a] flex items-center gap-1 cursor-pointer transition shadow-2xs"
                          >
                            <Plus className="w-3 h-3" />
                            Invite
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visitor Profile Modal */}
          {selectedVisitor && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
              <div className="bg-white rounded-xl border border-[#D8E1E8] shadow-xl max-w-lg w-full p-6 space-y-4 text-xs animate-fadeIn">
                <div className="flex items-start justify-between border-b pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-teal-100 border border-teal-300 overflow-hidden flex items-center justify-center">
                      {selectedVisitor.photoUrl ? (
                        <img src={selectedVisitor.photoUrl} alt={selectedVisitor.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-lg text-teal-800">{selectedVisitor.fullName.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#172B3A]">{selectedVisitor.fullName}</h2>
                      <p className="text-xs text-[#526575]">{selectedVisitor.company} • {selectedVisitor.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedVisitor(null)}
                    className="text-slate-400 hover:text-slate-700 text-base font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 bg-[#F4F7FA] p-3 rounded-lg border border-[#D8E1E8]">
                  <div>
                    <span className="text-[#526575] block">Email:</span>
                    <span className="font-semibold text-[#172B3A]">{selectedVisitor.email}</span>
                  </div>
                  <div>
                    <span className="text-[#526575] block">Phone:</span>
                    <span className="font-semibold text-[#172B3A]">{selectedVisitor.phoneNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#526575] block">Document Type:</span>
                    <span className="font-semibold text-[#172B3A]">{selectedVisitor.documentType}</span>
                  </div>
                  <div>
                    <span className="text-[#526575] block">Masked ID Number:</span>
                    <span className="font-mono font-semibold text-[#123B5D]">{selectedVisitor.maskedDocumentNumber}</span>
                  </div>
                  <div>
                    <span className="text-[#526575] block">Total Recorded Visits:</span>
                    <span className="font-bold text-teal-800">{selectedVisitor.totalVisits}</span>
                  </div>
                  <div>
                    <span className="text-[#526575] block">Watchlist Screening:</span>
                    <span className="font-bold text-emerald-700">{selectedVisitor.watchlistStatus}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-[#172B3A] text-xs">Past Visit History in Tenant</h3>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenVisitorHistory(selectedVisitor);
                        setSelectedVisitor(null);
                      }}
                      className="text-teal-700 hover:text-teal-900 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Clock className="w-3 h-3" />
                      View Timeline Chart ➔
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {state.visits
                      .filter((v) => v.visitorId === selectedVisitor.id)
                      .map((v) => (
                        <div key={v.id} className="p-2 rounded bg-white border border-[#D8E1E8] flex items-center justify-between text-[11px]">
                          <div>
                            <div className="font-medium text-[#172B3A]">{v.purpose}</div>
                            <div className="text-[10px] text-[#526575]">{new Date(v.scheduledStart).toLocaleDateString()} • Host: {v.hostName}</div>
                          </div>
                          <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {v.state}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      handleOpenVisitorHistory(selectedVisitor);
                      setSelectedVisitor(null);
                    }}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-teal-700" />
                    <span>Open Visitor History Tab</span>
                  </button>

                  <button
                    onClick={() => {
                      onInviteVisitor(selectedVisitor);
                      setSelectedVisitor(null);
                    }}
                    className="bg-[#123B5D] text-white px-3.5 py-1.5 rounded text-xs font-semibold hover:bg-[#0e2f4a] cursor-pointer"
                  >
                    Create New Invitation
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
