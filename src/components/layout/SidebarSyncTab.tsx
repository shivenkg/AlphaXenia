import React, { useState, useEffect, useMemo } from 'react';
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
  Sliders,
  ExternalLink,
  Zap,
  Activity,
  Monitor
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { RealtimeSyncInfo, NavViewId } from '../../types';

interface SidebarSyncTabProps {
  isDark?: boolean;
  onSelectView?: (view: NavViewId) => void;
  variant?: 'sidebar' | 'breadcrumb';
}

export const SidebarSyncTab: React.FC<SidebarSyncTabProps> = ({
  isDark = false,
  onSelectView,
  variant = 'breadcrumb',
}) => {
  const [syncInfo, setSyncInfo] = useState<RealtimeSyncInfo>(() =>
    storageService.getRealtimeSyncInfo()
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManualSyncing, setIsManualSyncing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    text: string;
    type: 'success' | 'warning' | 'error';
  } | null>(null);

  // Dynamic screen size tracking to render font size according to the size of the screen
  const [screenSize, setScreenSize] = useState<{ width: number; height: number }>(() => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1280, height: 800 };
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute exact responsive font sizes based on current screen size
  const fontSizes = useMemo(() => {
    const w = screenSize.width;
    // Scale font sizes smoothly according to screen width (from compact 320px to ultrawide 2560px+)
    const titlePx = Math.max(10.5, Math.min(15.5, 10 + (w / 1920) * 5.5));
    const badgePx = Math.max(7.5, Math.min(11, 7.5 + (w / 1920) * 3.5));
    const subtitlePx = Math.max(9, Math.min(13, 8.5 + (w / 1920) * 4.5));
    const buttonPx = Math.max(8.5, Math.min(12, 8 + (w / 1920) * 4));
    const footerPx = Math.max(8, Math.min(11, 7.5 + (w / 1920) * 3.5));
    const metricPx = Math.max(11, Math.min(16, 10.5 + (w / 1920) * 5.5));

    const screenTier =
      w < 640 ? 'Mobile' : w < 768 ? 'Phablet' : w < 1024 ? 'Tablet' : w < 1440 ? 'Laptop' : 'Desktop 4K';

    return {
      title: `${titlePx.toFixed(1)}px`,
      badge: `${badgePx.toFixed(1)}px`,
      subtitle: `${subtitlePx.toFixed(1)}px`,
      button: `${buttonPx.toFixed(1)}px`,
      footer: `${footerPx.toFixed(1)}px`,
      metric: `${metricPx.toFixed(1)}px`,
      tier: screenTier,
      width: w,
      height: screenSize.height,
    };
  }, [screenSize.width, screenSize.height]);

  useEffect(() => {
    return storageService.subscribe(() => {
      setSyncInfo(storageService.getRealtimeSyncInfo());
    });
  }, []);

  const hasNoNetwork = !syncInfo.isOnline || syncInfo.status === 'NO_NETWORK';
  const isSyncing = syncInfo.status === 'SYNCING' || isManualSyncing;

  const handleManualSync = async () => {
    setIsManualSyncing(true);
    setFeedbackMsg(null);
    try {
      const res = await storageService.executeRealtimeDatabaseSync();
      if (res.success) {
        setFeedbackMsg({
          text: `Automated sync completed: ${res.totalRecordsSynced || 'all'} records verified and replicated to Supabase PostgreSQL!`,
          type: 'success',
        });
      } else {
        setFeedbackMsg({
          text: res.error || 'Automated sync buffered locally (no network connection).',
          type: hasNoNetwork ? 'warning' : 'error',
        });
      }
    } catch (e: any) {
      setFeedbackMsg({
        text: e?.message || 'Sync operation failed',
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
        ? 'No Network Sign mode engaged. Realtime sync buffered locally.'
        : 'Network reconnected. Automated realtime sync resumed.',
      type: isNowOffline ? 'warning' : 'success',
    });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* SYNC TAB (Breadcrumb Bar or Sidebar Menu)                                 */}
      {/* - RED when NO NETWORK                                                    */}
      {/* - GREEN when on REALTIME SYNC                                            */}
      {/* ========================================================================= */}
      {variant === 'breadcrumb' ? (
        <div id="sidemenu-top-sync-tab-container" className="shrink-0">
          <div
            id="sidebar-realtime-sync-tab"
            role="button"
            tabIndex={0}
            onClick={() => setIsModalOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
            className={`group relative overflow-hidden rounded-xl border px-2.5 sm:px-3 py-1.5 shadow-xs transition-all duration-200 cursor-pointer select-none flex items-center gap-2 sm:gap-2.5 ${
              hasNoNetwork
                ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border-red-300 text-white shadow-md shadow-red-950/20 hover:from-red-500 hover:to-red-600 ring-1 ring-red-400/50'
                : 'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 border-emerald-300 text-white shadow-md shadow-emerald-950/20 hover:from-emerald-500 hover:to-teal-600 ring-1 ring-emerald-400/50'
            }`}
            title={
              hasNoNetwork
                ? 'NO NETWORK SIGN DETECTED: Click to inspect buffered sync queue'
                : 'AUTOMATED REALTIME SYNC ACTIVE: Click to view database sync status'
            }
          >
            {/* Subtle Ambient Pulse Flare */}
            <div
              className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-xl pointer-events-none -mr-6 -mt-6 ${
                hasNoNetwork ? 'bg-red-400/40 animate-pulse' : 'bg-emerald-300/35 animate-pulse'
              }`}
            />

            <div className="relative z-10 flex items-center gap-2 min-w-0">
              {/* Dynamic Status Icon with Pulsing Ping */}
              <div
                className={`relative flex items-center justify-center w-6 h-6 rounded-lg shrink-0 border ${
                  hasNoNetwork
                    ? 'bg-red-900/90 border-red-200/80 text-white ring-1 ring-red-300/60'
                    : 'bg-emerald-900/90 border-emerald-200/80 text-white ring-1 ring-emerald-300/60'
                }`}
              >
                {hasNoNetwork ? (
                  <WifiOff className="w-3 h-3 text-white animate-pulse" />
                ) : isSyncing ? (
                  <RefreshCw className="w-3 h-3 text-white animate-spin" />
                ) : (
                  <Database className="w-3 h-3 text-white" />
                )}
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      hasNoNetwork ? 'bg-red-300' : 'bg-emerald-300'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 border border-white/80 ${
                      hasNoNetwork ? 'bg-white' : 'bg-emerald-100'
                    }`}
                  />
                </span>
              </div>

              {/* Status Labels */}
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono font-black uppercase tracking-wider text-white text-[10.5px] sm:text-[11px] leading-tight drop-shadow-xs">
                    {hasNoNetwork ? 'NO NETWORK' : 'REALTIME SYNC'}
                  </span>
                  <span
                    className={`font-mono font-bold uppercase rounded-full px-1.5 py-0.2 text-[8.5px] border leading-tight ${
                      hasNoNetwork
                        ? 'bg-red-950/70 border-red-200/80 text-red-100'
                        : 'bg-emerald-950/70 border-emerald-200/80 text-emerald-100'
                    }`}
                  >
                    {hasNoNetwork ? 'SYNC TAB' : 'AUTOMATED'}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-white/95 leading-tight truncate drop-shadow-2xs">
                  {hasNoNetwork
                    ? syncInfo.pendingCount > 0
                      ? `${syncInfo.pendingCount} queued locally`
                      : 'Local buffer active'
                    : isSyncing
                    ? 'Syncing to database...'
                    : 'Auto-sync active (15s loop)'}
                </p>
              </div>
            </div>

            {/* Action Trigger Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(true);
              }}
              className={`relative z-10 shrink-0 rounded-md font-bold border transition flex items-center gap-1 cursor-pointer px-1.5 py-0.5 text-[10px] shadow-xs ${
                hasNoNetwork
                  ? 'bg-red-950/70 hover:bg-red-900 text-white border-red-200/70'
                  : 'bg-emerald-950/70 hover:bg-emerald-900 text-white border-emerald-200/70'
              }`}
              title="Open Realtime Database Sync Details"
            >
              <span>OPEN</span>
              <ArrowRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      ) : (
        <div id="sidemenu-top-sync-tab-container" className="p-2 sm:p-2.5 pb-0 shrink-0">
          <div
            id="sidebar-realtime-sync-tab"
            role="button"
            tabIndex={0}
            onClick={() => setIsModalOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
            className={`group relative overflow-hidden rounded-xl border-2 p-2.5 sm:p-3 shadow-md transition-all duration-200 cursor-pointer select-none ${
              hasNoNetwork
                ? /* VIBRANT RED TAB WHEN NO NETWORK */
                  'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 border-red-300 text-white shadow-lg shadow-red-950/40 hover:from-red-500 hover:to-red-600 ring-2 ring-red-400/50'
                : /* VIBRANT GREEN TAB WHEN ON REALTIME SYNC */
                  'bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 border-emerald-300 text-white shadow-lg shadow-emerald-950/40 hover:from-emerald-500 hover:to-teal-600 ring-2 ring-emerald-400/50'
            }`}
            title={
              hasNoNetwork
                ? 'NO NETWORK SIGN DETECTED: Click to inspect buffered sync queue'
                : 'AUTOMATED REALTIME SYNC ACTIVE: Click to view database sync status'
            }
          >
            {/* Subtle Ambient Pulse Flare */}
            <div
              className={`absolute top-0 right-0 w-28 h-28 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 ${
                hasNoNetwork ? 'bg-red-400/40 animate-pulse' : 'bg-emerald-300/35 animate-pulse'
              }`}
            />

            <div className="relative z-10 flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                {/* Dynamic Status Icon with Pulsing Ping Ring */}
                <div
                  className={`relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg shrink-0 shadow-sm border ${
                    hasNoNetwork
                      ? 'bg-red-900/90 border-red-200/80 text-white ring-2 ring-red-300/60'
                      : 'bg-emerald-900/90 border-emerald-200/80 text-white ring-2 ring-emerald-300/60'
                  }`}
                >
                  {hasNoNetwork ? (
                    <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
                  ) : isSyncing ? (
                    <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-spin" />
                  ) : (
                    <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                  )}

                  {/* Pulsing Live Dot */}
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        hasNoNetwork ? 'bg-red-300' : 'bg-emerald-300'
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2.5 w-2.5 border border-white/80 ${
                        hasNoNetwork ? 'bg-white' : 'bg-emerald-100'
                      }`}
                    />
                  </span>
                </div>

                {/* Responsive Text & Labels - dynamically rendered font size according to screen size */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Title font scaling dynamically with screen size */}
                    <span
                      style={{ fontSize: fontSizes.title }}
                      className="font-mono font-black uppercase tracking-wider text-white leading-tight drop-shadow-xs"
                    >
                      {hasNoNetwork ? 'NO NETWORK' : 'REALTIME SYNC'}
                    </span>

                    {/* Badge font scaling dynamically with screen size */}
                    <span
                      style={{ fontSize: fontSizes.badge }}
                      className={`font-mono font-bold uppercase rounded-full px-1.5 py-0.2 border leading-tight ${
                        hasNoNetwork
                          ? 'bg-red-950/70 border-red-200/80 text-red-100'
                          : 'bg-emerald-950/70 border-emerald-200/80 text-emerald-100'
                      }`}
                    >
                      {hasNoNetwork ? 'SYNC TAB' : 'AUTOMATED'}
                    </span>
                  </div>

                  {/* Subtitle font scaling dynamically with screen size */}
                  <p
                    style={{ fontSize: fontSizes.subtitle }}
                    className="font-medium text-white/95 leading-tight mt-0.5 truncate drop-shadow-2xs"
                  >
                    {hasNoNetwork
                      ? syncInfo.pendingCount > 0
                        ? `${syncInfo.pendingCount} change${syncInfo.pendingCount === 1 ? '' : 's'} queued locally`
                        : 'Local buffer active'
                      : isSyncing
                      ? 'Syncing to database...'
                      : 'Auto-sync active (15s loop)'}
                  </p>
                </div>
              </div>

              {/* Action Trigger Button */}
              <button
                type="button"
                style={{ fontSize: fontSizes.button }}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalOpen(true);
                }}
                className={`shrink-0 rounded-lg font-bold border transition flex items-center gap-1 cursor-pointer px-1.5 sm:px-2 py-1 shadow-xs ${
                  hasNoNetwork
                    ? 'bg-red-950/70 hover:bg-red-900 text-white border-red-200/70'
                    : 'bg-emerald-950/70 hover:bg-emerald-900 text-white border-emerald-200/70'
                }`}
                title="Open Realtime Database Sync Details"
              >
                <span>OPEN</span>
                <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Quick Informational Bottom Strip */}
            <div
              style={{ fontSize: fontSizes.footer }}
              className={`mt-2 pt-1.5 border-t flex items-center justify-between text-white/90 ${
                hasNoNetwork ? 'border-red-400/50' : 'border-emerald-400/50'
              }`}
            >
              <span className="flex items-center gap-1 truncate">
                {hasNoNetwork ? (
                  <>
                    <AlertTriangle className="w-2.5 h-2.5 text-white shrink-0" />
                    <span className="truncate">Auto-syncs on reconnect</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-100 shrink-0" />
                    <span className="truncate">PostgreSQL db.eonmoodozhicjlgnmzkx</span>
                  </>
                )}
              </span>
              <span className="font-mono font-bold text-white shrink-0 ml-1">
                {hasNoNetwork ? 'OFFLINE (RED)' : 'ONLINE (GREEN)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* REALTIME DATABASE SYNC MODAL / DIAGNOSTIC CONSOLE                        */}
      {/* - Color coded header: RED (No Network) vs GREEN (Realtime Sync)          */}
      {/* - Typography scales fluidly according to screen size                     */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-150">
          <div
            id="realtime-database-sync-modal"
            className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden text-slate-900 flex flex-col max-h-[92vh]"
          >
            {/* Modal Header: RED when No Network, GREEN when Realtime Sync */}
            <div
              className={`text-white px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between border-b ${
                hasNoNetwork
                  ? 'bg-gradient-to-r from-red-700 via-rose-600 to-red-800 border-red-500'
                  : 'bg-gradient-to-r from-emerald-700 via-green-600 to-teal-800 border-emerald-500'
              }`}
            >
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0 ${
                    hasNoNetwork ? 'bg-red-900/90 ring-2 ring-red-300/40' : 'bg-emerald-900/90 ring-2 ring-emerald-300/40'
                  }`}
                >
                  {hasNoNetwork ? (
                    <WifiOff className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  ) : (
                    <Database className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold flex items-center gap-2 flex-wrap text-sm sm:text-base md:text-lg">
                    <span className="truncate">Automated Realtime Sync Engine</span>
                    <span
                      className={`font-mono font-bold uppercase rounded-full px-2 py-0.5 border text-[9px] sm:text-[10px] md:text-xs ${
                        hasNoNetwork
                          ? 'bg-red-950/80 text-red-100 border-red-300/50'
                          : 'bg-emerald-950/80 text-emerald-100 border-emerald-300/50'
                      }`}
                    >
                      {hasNoNetwork ? 'NO NETWORK (RED)' : 'ONLINE SYNC (GREEN)'}
                    </span>
                  </h3>
                  <p className="text-white/80 text-[10px] sm:text-xs md:text-sm truncate">
                    {hasNoNetwork
                      ? 'Network unavailable: All data is safely buffered locally'
                      : 'Automated continuous data synchronization to PostgreSQL database'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0 ml-2"
                title="Close Modal"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 sm:space-y-4">
              {/* Toast Feedback */}
              {feedbackMsg && (
                <div
                  className={`p-3 rounded-xl border flex items-center gap-2 text-xs sm:text-sm ${
                    feedbackMsg.type === 'success'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : feedbackMsg.type === 'warning'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}
                >
                  {feedbackMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  )}
                  <span className="font-medium">{feedbackMsg.text}</span>
                </div>
              )}

              {/* Condition Banner */}
              {hasNoNetwork ? (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3.5 sm:p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                    <WifiOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-950 text-xs sm:text-sm md:text-base">
                      No Network Detected (Status: RED)
                    </h4>
                    <p className="text-red-900/90 mt-0.5 leading-relaxed text-[11px] sm:text-xs md:text-sm">
                      The application is running in zero-latency offline mode. Every visitor check-in, registration, badge pass design, and configuration change is safely preserved in local storage. Automated synchronization will immediately run the moment connection is restored.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3.5 sm:p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-xs sm:text-sm md:text-base">
                      Automated Realtime Sync Active (Status: GREEN)
                    </h4>
                    <p className="text-emerald-900/90 mt-0.5 leading-relaxed text-[11px] sm:text-xs md:text-sm">
                      Automatic background data synchronization is active. Changes are debounced and pushed instantly, plus refreshed on an automated 15-second loop without requiring any manual clicks.
                    </p>
                  </div>
                </div>
              )}

              {/* Status Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3">
                  <div className="text-slate-500 font-medium text-[9px] sm:text-[10px] md:text-xs">
                    Network Sign
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 font-bold text-xs sm:text-sm md:text-base">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        hasNoNetwork ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'
                      }`}
                    />
                    <span className={hasNoNetwork ? 'text-red-700' : 'text-emerald-700'}>
                      {hasNoNetwork ? 'No Network (Red)' : 'Online (Green)'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3">
                  <div className="text-slate-500 font-medium text-[9px] sm:text-[10px] md:text-xs">
                    Automated Mode
                  </div>
                  <div className="mt-1 font-bold font-mono text-slate-900 text-xs sm:text-sm md:text-base">
                    {hasNoNetwork ? 'BUFFERED' : 'AUTOMATED'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3">
                  <div className="text-slate-500 font-medium text-[9px] sm:text-[10px] md:text-xs">
                    Queued Records
                  </div>
                  <div className="mt-1 font-bold font-mono text-xs sm:text-sm md:text-base">
                    <span className={syncInfo.pendingCount > 0 ? 'text-amber-600' : 'text-slate-900'}>
                      {syncInfo.pendingCount}
                    </span>{' '}
                    <span className="text-[10px] sm:text-xs font-normal text-slate-500">pending</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 sm:p-3">
                  <div className="text-slate-500 font-medium text-[9px] sm:text-[10px] md:text-xs">
                    Last Replicated
                  </div>
                  <div
                    className="mt-1 font-bold font-mono text-slate-900 truncate text-xs sm:text-sm md:text-base"
                    title={syncInfo.lastSyncedAt || 'Just now'}
                  >
                    {syncInfo.lastSyncedAt
                      ? new Date(syncInfo.lastSyncedAt).toLocaleTimeString()
                      : 'Just now'}
                  </div>
                </div>
              </div>

              {/* Screen Size Responsive Typography Diagnostics */}
              <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Monitor className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800">
                      Screen-Size Responsive Typography:
                    </span>{' '}
                    <span className="text-slate-600">
                      {fontSizes.tier} tier ({fontSizes.width}×{fontSizes.height}px)
                    </span>
                  </div>
                </div>
                <div className="font-mono text-[10px] sm:text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                  Font Scale: {fontSizes.title} / {fontSizes.subtitle}
                </div>
              </div>

              {/* Target Database Details */}
              <div className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs sm:text-sm md:text-base">
                    <Database className="w-4 h-4 text-teal-600" />
                    Target PostgreSQL Cluster
                  </span>
                  <span className="font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 text-[9px] sm:text-[10px] md:text-xs">
                    PORT 5432
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 font-mono text-slate-700 flex items-center justify-between border border-slate-200/80 text-[10px] sm:text-xs md:text-sm">
                  <span className="truncate">{syncInfo.targetHost}</span>
                  <span className="text-teal-700 font-bold shrink-0 ml-2">Supabase PG</span>
                </div>
                <p className="text-slate-500 leading-normal text-[10px] sm:text-xs md:text-sm">
                  Continuous automated synchronization replicates 19 tables including tenants, building zones, entry gates, visitors, visits, badges, devices, and audit events.
                </p>
              </div>

              {/* Entities Synchronized Summary */}
              {syncInfo.recordsSyncedSummary && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-3.5 space-y-2">
                  <div className="font-bold text-slate-800 flex items-center justify-between text-xs sm:text-sm md:text-base">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-slate-600" />
                      Database Relational Entities
                    </span>
                    <span className="font-mono text-slate-500 text-[10px] sm:text-xs md:text-sm">
                      {syncInfo.totalRecordsSynced || 82} records synchronized
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 font-mono text-[9px] sm:text-[10px] md:text-xs">
                    <div className="bg-white p-1.5 sm:p-2 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Visits:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.visits || 8}</strong>
                    </div>
                    <div className="bg-white p-1.5 sm:p-2 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Visitors:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.visitors || 6}</strong>
                    </div>
                    <div className="bg-white p-1.5 sm:p-2 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Tenants:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.tenants || 2}</strong>
                    </div>
                    <div className="bg-white p-1.5 sm:p-2 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Gates:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.gates || 4}</strong>
                    </div>
                    <div className="bg-white p-1.5 sm:p-2 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Badges:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.badge_templates || 3}</strong>
                    </div>
                    <div className="bg-white p-1.5 sm:p-2 rounded border border-slate-200 flex justify-between">
                      <span className="text-slate-500">Audit Logs:</span>
                      <strong className="text-slate-900">{syncInfo.recordsSyncedSummary.audit_events || 25}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-3 sm:p-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                {/* Toggle Simulated No Network Button */}
                <button
                  type="button"
                  id="simulate-no-network-toggle-button"
                  onClick={handleToggleSimulateNoNetwork}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border font-bold transition flex items-center gap-1.5 cursor-pointer text-[10px] sm:text-xs md:text-sm ${
                    syncInfo.isSimulatedOffline
                      ? 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Toggle Simulated No Network to test Red / Green sync state"
                >
                  <WifiOff className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                  <span>
                    {syncInfo.isSimulatedOffline ? 'Resume Network (Green)' : 'Test No Network (Red)'}
                  </span>
                </button>

                {onSelectView && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      onSelectView('database_config');
                    }}
                    className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-bold transition flex items-center gap-1 cursor-pointer text-[10px] sm:text-xs md:text-sm"
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
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 font-semibold transition cursor-pointer text-[10px] sm:text-xs md:text-sm"
                >
                  Close
                </button>

                <button
                  type="button"
                  id="modal-force-sync-now-button"
                  onClick={handleManualSync}
                  disabled={isManualSyncing}
                  className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#123B5D] hover:bg-[#0E2E49] text-white font-bold transition flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer text-[10px] sm:text-xs md:text-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isManualSyncing ? 'animate-spin' : ''}`} />
                  <span>{isManualSyncing ? 'Syncing...' : 'Sync to Database'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
