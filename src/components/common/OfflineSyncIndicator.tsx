import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  CloudUpload,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Server,
  Database,
  ArrowRight,
  ShieldCheck,
  X,
  PlusCircle
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { EdgeSyncEvent } from '../../types';

export const OfflineSyncIndicator: React.FC = () => {
  const [state, setState] = useState(() => storageService.getState());
  const [syncInfo, setSyncInfo] = useState(() => storageService.getRealtimeSyncInfo());
  const [isOpen, setIsOpen] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  useEffect(() => {
    return storageService.subscribe(() => {
      setState(storageService.getState());
      setSyncInfo(storageService.getRealtimeSyncInfo());
    });
  }, []);

  const pendingEvents = storageService.getPendingOfflineEvents();
  const pendingCount = pendingEvents.length + syncInfo.pendingCount;
  const isOnline = Boolean(state.isEdgeOnline) && syncInfo.isOnline;

  const handleToggleOnline = () => {
    storageService.setEdgeOnline(!state.isEdgeOnline);
  };

  const handlePushToServer = async () => {
    setIsPushing(true);
    try {
      const res = storageService.pushPendingOfflineEvents();
      await storageService.executeRealtimeDatabaseSync();
      setIsPushing(false);
      setSyncFeedback(res.message || 'All local records successfully synced with central database!');
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch {
      setIsPushing(false);
    }
  };

  const handleSimulateBufferedEvent = () => {
    const event = storageService.simulateTestOfflineEvent();
    setSyncFeedback(`Generated test buffered event: ${event.eventType} (Queue: ${pendingCount + 1})`);
    setTimeout(() => setSyncFeedback(null), 3000);
  };

  return (
    <>
      {/* Primary Header Status Indicator Pill */}
      <div className="relative">
        <button
          id="offline-sync-status-indicator"
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-semibold border transition-all cursor-pointer select-none ${
            !isOnline
              ? 'bg-red-600 text-white border-red-400 shadow-md shadow-red-900/30'
              : 'bg-emerald-600 text-white border-emerald-400 shadow-md shadow-emerald-900/30'
          }`}
          title="Automated Realtime Sync: Click to inspect offline sync buffer and database state"
        >
          {/* Status Icon */}
          <div className="flex items-center gap-1.5">
            {!isOnline ? (
              <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse shrink-0" />
            ) : (
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-white"></span>
              </span>
            )}

            {/* Label - responsive font size */}
            <span className="font-bold tracking-tight text-[11px] sm:text-xs md:text-sm">
              {!isOnline ? 'No Network (Red)' : 'Realtime Sync (Green)'}
            </span>
          </div>

          {/* Pending Badge Counter - responsive font size */}
          {pendingCount > 0 ? (
            <span
              id="pending-sync-counter-badge"
              className={`px-1.5 py-0.2 rounded-full font-mono font-bold tracking-tight text-[9px] sm:text-[10px] md:text-xs ${
                !isOnline
                  ? 'bg-red-950 text-red-100 border border-red-400/50'
                  : 'bg-emerald-950 text-emerald-100 border border-emerald-400/50'
              }`}
            >
              {pendingCount} queued
            </span>
          ) : (
            <span className="text-[9px] sm:text-[10px] md:text-xs text-emerald-100 hidden sm:inline font-mono">
              Synced
            </span>
          )}
        </button>
      </div>

      {/* Sync Management Popover Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div
            id="offline-sync-detail-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div
              className={`text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b ${
                !isOnline
                  ? 'bg-gradient-to-r from-red-700 via-rose-600 to-red-800 border-red-500'
                  : 'bg-gradient-to-r from-emerald-700 via-green-600 to-teal-800 border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${
                    isOnline ? 'bg-emerald-900/90 ring-2 ring-emerald-300/40' : 'bg-red-900/90 ring-2 ring-red-300/40'
                  }`}
                >
                  {isOnline ? <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-white" /> : <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-sm sm:text-base md:text-lg font-bold flex items-center gap-2 flex-wrap">
                    <span>Automated Edge Sync Engine</span>
                    <span
                      className={`text-[9px] sm:text-[10px] md:text-xs px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                        isOnline
                          ? 'bg-emerald-950/80 text-emerald-100 border border-emerald-300/40'
                          : 'bg-red-950/80 text-red-100 border border-red-300/40'
                      }`}
                    >
                      {isOnline ? 'ONLINE (GREEN)' : 'NO NETWORK (RED)'}
                    </span>
                  </h2>
                  <p className="text-[10px] sm:text-xs md:text-sm text-white/80">
                    Automated data replication between local devices and Supabase PostgreSQL database.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* Alert notification if records are waiting */}
              {pendingCount > 0 ? (
                <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-start gap-3 text-amber-900">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-sm">
                      {pendingCount} Pending Record{pendingCount > 1 ? 's' : ''} Waiting for Cloud Push
                    </div>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Check-in, check-out, or registration events were captured locally on edge controllers while offline.
                      Click &ldquo;Push All to Central Server&rdquo; to reconcile transactions into the master ledger.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 flex items-center gap-3 text-emerald-900">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <div className="font-bold text-sm">Central Database Fully Synchronized</div>
                    <p className="text-xs text-emerald-700">
                      All local edge events are reconciled. Zero replication lag detected.
                    </p>
                  </div>
                </div>
              )}

              {syncFeedback && (
                <div className="p-3 bg-teal-50 text-teal-900 border border-teal-300 rounded-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>{syncFeedback}</span>
                </div>
              )}

              {/* Topology / Health Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Server className="w-4 h-4 text-[#0F766E]" />
                    <span className="font-semibold text-[11px]">Edge Controller</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-900">edge-ctrl-01</div>
                  <div className="text-[10px] text-slate-500">Local SQLite / Encrypted WAL</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Database className="w-4 h-4 text-[#123B5D]" />
                    <span className="font-semibold text-[11px]">Central Cloud DB</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-900">
                    {isOnline ? 'Connected' : 'Unreachable'}
                  </div>
                  <div className="text-[10px] text-slate-500">PostgreSQL (Multi-Tenant)</div>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <CloudUpload className="w-4 h-4 text-teal-600" />
                    <span className="font-semibold text-[11px]">Pending Buffer</span>
                  </div>
                  <div className="font-mono text-sm font-bold text-slate-900">
                    {pendingCount} record{pendingCount === 1 ? '' : 's'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {state.edgeSyncEvents.filter((e) => e.status === 'SYNCED').length} historical synced
                  </div>
                </div>
              </div>

              {/* Pending Records Queue Preview */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Edge Upload Queue ({pendingCount} pending)
                  </h3>
                  <button
                    onClick={handleSimulateBufferedEvent}
                    className="text-[11px] text-[#0F766E] hover:text-[#0c5e58] font-semibold flex items-center gap-1 cursor-pointer"
                    title="Simulate a check-in event captured locally on offline edge controller"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    Simulate Buffered Event
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                  {pendingEvents.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 bg-slate-50">
                      <ShieldCheck className="w-8 h-8 mx-auto mb-1 text-slate-300" />
                      <p className="font-medium text-xs">No pending records waiting to be pushed.</p>
                      <p className="text-[11px] text-slate-500">
                        Turn off Edge Network or click &ldquo;Simulate Buffered Event&rdquo; to test offline queuing.
                      </p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-mono border-b border-slate-200">
                        <tr>
                          <th className="p-2">Event Type</th>
                          <th className="p-2">Captured At (UTC)</th>
                          <th className="p-2">Payload Details</th>
                          <th className="p-2">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pendingEvents.map((evt) => (
                          <tr key={evt.id} className="hover:bg-amber-50/50">
                            <td className="p-2 font-mono font-bold text-[#123B5D]">
                              {evt.eventType}
                            </td>
                            <td className="p-2 text-slate-500 font-mono text-[10px]">
                              {new Date(evt.capturedAtUtc).toLocaleTimeString()}
                            </td>
                            <td className="p-2 text-slate-700 max-w-[200px] truncate">
                              {JSON.stringify(evt.payload)}
                            </td>
                            <td className="p-2">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                                PENDING UPLOAD
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
                <button
                  id="toggle-edge-network-modal-btn"
                  onClick={handleToggleOnline}
                  className={`px-3 py-2 rounded-lg font-semibold flex items-center gap-1.5 transition text-xs ${
                    isOnline
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isOnline ? (
                    <>
                      <WifiOff className="w-4 h-4 text-amber-600" />
                      <span>Simulate Network Outage (Go Offline)</span>
                    </>
                  ) : (
                    <>
                      <Wifi className="w-4 h-4" />
                      <span>Restore Cloud Connection (Go Online)</span>
                    </>
                  )}
                </button>

                <button
                  id="push-offline-sync-now-btn"
                  onClick={handlePushToServer}
                  disabled={isPushing || pendingCount === 0}
                  className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition text-xs shadow-sm ${
                    pendingCount === 0
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                      : 'bg-[#123B5D] text-white hover:bg-[#0e2f4a]'
                  }`}
                >
                  {isPushing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-300" />
                      <span>Pushing to Central Cloud...</span>
                    </>
                  ) : (
                    <>
                      <CloudUpload className="w-4 h-4 text-teal-300" />
                      <span>Push All to Central Server ({pendingCount})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
