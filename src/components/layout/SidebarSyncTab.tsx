import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  X,
  Server,
  Layers,
  Clock,
  Radio,
  HardDrive,
  ShieldAlert,
  Sliders,
  ExternalLink
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { RealtimeSyncInfo, NavViewId } from '../../types';

interface SidebarSyncTabProps {
  isDark?: boolean;
  onSelectView?: (view: NavViewId) => void;
}

export const SidebarSyncTab: React.FC<SidebarSyncTabProps> = ({
  isDark = false,
  onSelectView,
}) => {
  const [syncInfo, setSyncInfo] = useState<RealtimeSyncInfo>(() =>
    storageService.getRealtimeSyncInfo()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(
    null
  );

  useEffect(() => {
    return storageService.subscribe(() => {
      setSyncInfo(storageService.getRealtimeSyncInfo());
    });
  }, []);

  const hasNoNetwork = !syncInfo.isOnline || syncInfo.status === 'NO_NETWORK';

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    setFeedbackMsg(null);
    try {
      const res = await storageService.executeRealtimeDatabaseSync();
      if (res.success) {
        setFeedbackMsg({
          text: `Successfully synced ${res.totalRecordsSynced || 'all'} records to Supabase PostgreSQL database!`,
          type: 'success',
        });
      } else {
        setFeedbackMsg({
          text: res.error || 'Sync queued locally (no network connection).',
          type: hasNoNetwork ? 'warning' : 'error',
        });
      }
    } catch (e: any) {
      setFeedbackMsg({
        text: e?.message || 'Sync failed',
        type: 'error',
      });
    } finally {
      setIsManualSyncing(false);
      setTimeout(() => setFeedbackMsg(null), 5000);
    }
  };

  const handleToggleSimulateNoNetwork = () => {
    const isNowOffline = storageService.toggleSimulatedOffline();
    setFeedbackMsg({
      text: isNowOffline
        ? 'Simulated "No Network Sign" mode enabled. Realtime sync buffered to local queue.'
        : 'Network connection restored. Realtime sync flushed to database.',
      type: isNowOffline ? 'warning' : 'success',
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* TOP OF SIDEMENU BAR: SYNC TAB (PROMINENT ON NO NETWORK)  */}
      {/* ======================================================== */}
      <div id="sidemenu-top-sync-tab-container" className="p-2 pb-0 shrink-0">
        {hasNoNetwork ? (
          /* NO NETWORK SIGN: HIGH VISIBILITY EXPANDED SYNC TAB */
          <div
            id="sidebar-no-network-sync-tab"
            role="button"
            tabIndex={0}
            onClick={() => setIsModalOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
            className="group relative overflow-hidden rounded-xl border-2 border-rose-500/90 bg-gradient-to-r from-rose-950 via-amber-950 to-rose-900 text-white p-2.5 shadow-lg shadow-rose-950/40 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] select-none"
            title="NO NETWORK DETECTED: Click to open Database Sync Tab and inspect buffered records"
          >
            {/* Ambient Pulse Light */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/20 rounded-full blur-xl pointer-events-none -mr-8 -mt-8 animate-pulse" />

            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {/* Offline Glowing Badge Icon */}
                <div className="relative flex items-center justify-center w-7 h-7 rounded-lg bg-rose-600/90 text-white shrink-0 shadow-xs ring-2 ring-rose-400/40">
                  <WifiOff className="w-4 h-4 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-400"></span>
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black uppercase tracking-wider text-rose-200 font-mono">
                      SYNC TAB
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/30 text-rose-300 border border-rose-400/40">
                      NO NETWORK
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-200/90 font-medium leading-tight mt-0.5">
                    {syncInfo.pendingCount > 0
                      ? `${syncInfo.pendingCount} change${syncInfo.pendingCount === 1 ? '' : 's'} buffered for DB`
                      : 'Local storage buffer active'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className="shrink-0 p-1.5 rounded-lg bg-rose-500/30 hover:bg-rose-500/50 text-rose-100 border border-rose-400/40 transition flex items-center gap-1 text-[10px] font-bold cursor-pointer"
                title="Open Sync Drawer"
              >
                <span>OPEN</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Quick Helper Subline */}
            <div className="mt-2 pt-1.5 border-t border-rose-500/30 flex items-center justify-between text-[9px] text-rose-200/80">
              <span className="flex items-center gap-1 truncate">
                <Database className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                <span className="truncate">Target: Supabase PostgreSQL</span>
              </span>
              <span className="font-mono text-amber-300 font-bold shrink-0 ml-1">
                Tap to sync
              </span>
            </div>
          </div>
        ) : (
          /* ONLINE: REFINED REALTIME SYNC TAB PILL */
          <div
            id="sidebar-online-sync-tab"
            role="button"
            tabIndex={0}
            onClick={() => setIsModalOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
            className={`group rounded-xl border p-2 flex items-center justify-between transition-all cursor-pointer select-none ${
              isDark
                ? 'bg-[#0E335C]/80 border-sky-500/40 hover:border-sky-400 text-sky-100'
                : 'bg-emerald-50/70 border-emerald-200/80 hover:border-emerald-300 text-slate-800'
            }`}
            title="Realtime Database Sync Active: Click to view sync status and buffer"
          >
            <div className="flex items-center gap-2 min-w-0">
              {/* Online Green Indicator */}
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                  syncInfo.status === 'SYNCING' || isManualSyncing
                    ? 'bg-amber-500/20 text-amber-400 border-amber-400/50'
                    : isDark
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                    : 'bg-emerald-100 text-emerald-700 border-emerald-200'
                }`}
              >
                {syncInfo.status === 'SYNCING' || isManualSyncing ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider font-mono">
                    SYNC TAB
                  </span>
                  <span
                    className={`inline-block w-1.5 h-1.5 rounded-full ${
                      syncInfo.status === 'SYNCING' || isManualSyncing
                        ? 'bg-amber-400 animate-ping'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <div className="text-[9px] text-slate-500 dark:text-sky-300/80 truncate">
                  {syncInfo.status === 'SYNCING' || isManualSyncing
                    ? 'Syncing to DB...'
                    : 'Realtime Sync: Online'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-1">
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-bold">
                82+ DB
              </span>
              <ArrowRight className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* REALTIME DATABASE SYNC MODAL / MANAGEMENT CONSOLE        */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div
            id="realtime-database-sync-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden text-slate-900 flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-[#123B5D] text-white px-5 py-4 flex items-center justify-between border-b border-[#0f304c]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-xs ${
                    hasNoNetwork ? 'bg-rose-600' : 'bg-emerald-600'
                  }`}
                >
                  {hasNoNetwork ? <WifiOff className="w-5 h-5" /> : <Database className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <span>Database Realtime Sync Console</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                        hasNoNetwork
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
                      }`}
                    >
                      {hasNoNetwork ? 'NO NETWORK SIGN' : 'REALTIME SYNCED'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300">
                    Live bidirectional replication with PostgreSQL database
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Feedback Alert */}
              {feedbackMsg && (
                <div
                  className={`p-3 rounded-xl border flex items-center gap-2 ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : feedbackMsg.type === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {feedbackMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span className="font-medium text-xs">{feedbackMsg.text}</span>
                </div>
              )}

              {/* No Network Alert Banner */}
              {hasNoNetwork && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0 text-rose-700">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-rose-950 text-xs">
                      No Network Detected — Offline-First Mode Engaged
                    </h4>
                    <p className="text-[11px] text-rose-800/90 mt-0.5 leading-relaxed">
                      All visitor check-ins, pre-registrations, badge designs, and security logs are safely buffered in local persistence. The moment network connectivity is re-established, the sync manager will instantly flush all mutations to the database.
                    </p>
                  </div>
                </div>
              )}

              {/* Realtime Sync Status Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-500 font-medium">Network Signal</div>
                  <div className="mt-1 flex items-center gap-1.5 font-bold">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${
                        hasNoNetwork ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                    />
                    <span className={hasNoNetwork ? 'text-rose-700' : 'text-emerald-700'}>
                      {hasNoNetwork ? 'Disconnected' : 'Active (Online)'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-500 font-medium">Sync State</div>
                  <div className="mt-1 font-bold text-slate-900 font-mono">
                    {syncInfo.status === 'SYNCING' || isManualSyncing
                      ? 'SYNCING...'
                      : syncInfo.status}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-500 font-medium">Queued Mutations</div>
                  <div className="mt-1 font-bold text-slate-900 font-mono">
                    <span className={syncInfo.pendingCount > 0 ? 'text-amber-600' : 'text-slate-900'}>
                      {syncInfo.pendingCount}
                    </span>{' '}
                    pending
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                  <div className="text-[10px] text-slate-500 font-medium">Last Synced</div>
                  <div className="mt-1 font-bold text-slate-900 font-mono truncate" title={syncInfo.lastSyncedAt || 'None'}>
                    {syncInfo.lastSyncedAt
                      ? new Date(syncInfo.lastSyncedAt).toLocaleTimeString()
                      : 'Just now'}
                  </div>
                </div>
              </div>

              {/* Target Database Details Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <Database className="w-3.5 h-3.5 text-teal-600" />
                    Target PostgreSQL Cluster
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                    PORT 5432
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 font-mono text-[11px] text-slate-700 flex items-center justify-between border border-slate-200/80">
                  <span className="truncate">{syncInfo.targetHost}</span>
                  <span className="text-teal-700 font-bold shrink-0 ml-2">Supabase PG</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Realtime sync replicates 19 schemas including tenants, building zones, entry gates, visitors, visits, badges, devices, and audit events.
                </p>
              </div>

              {/* Entities Synchronized Summary */}
              {syncInfo.recordsSyncedSummary && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-slate-600" />
                      Database Entities Breakdown
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {syncInfo.totalRecordsSynced || 82} total records
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                    <div className="bg-white p-1.5 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Visits:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.visits || 8}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Visitors:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.visitors || 6}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Tenants:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.tenants || 2}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Gates:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.gates || 4}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Badges:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.badge_templates || 3}</strong>
                    </div>
                    <div className="bg-white p-1.5 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Audit Logs:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.audit_events || 25}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                {/* Simulate No Network Toggle Button */}
                <button
                  type="button"
                  id="simulate-no-network-toggle-button"
                  onClick={handleToggleSimulateNoNetwork}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    syncInfo.isSimulatedOffline
                      ? 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Toggle Simulated No Network to test offline sync behavior"
                >
                  <WifiOff className="w-3.5 h-3.5 text-rose-600" />
                  <span>
                    {syncInfo.isSimulatedOffline ? 'Resume Network' : 'Test "No Network"'}
                  </span>
                </button>

                {/* Direct link to Database Configuration for Super Admin */}
                {onSelectView && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onSelectView('database_config');
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-teal-600" />
                    <span>DB Settings</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold transition cursor-pointer"
                >
                  Close
                </button>

                <button
                  type="button"
                  id="modal-force-sync-now-button"
                  onClick={handleManualSync}
                  disabled={isManualSyncing}
                  className="px-4 py-1.5 rounded-xl bg-[#123B5D] hover:bg-[#0E2E49] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isManualSyncing ? 'animate-spin' : ''}`} />
                  <span>{isManualSyncing ? 'Syncing...' : 'Sync to Database Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
