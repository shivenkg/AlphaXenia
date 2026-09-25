import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Menu,
  X,
  Users,
  CheckCircle2,
  Zap,
  ChevronDown
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { JSAlphaSoftLogo } from '../common/JSAlphaSoftLogo';

interface HeaderProps {
  onOpenEmergencyModal?: () => void;
  onNavigateToDashboard?: () => void;
  isSidebarOpen?: boolean;
  isSidebarPinned?: boolean;
  onToggleSidebar?: () => void;
  onOpenSidebar?: () => void;
  onScheduleCloseSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmergencyModal,
  onNavigateToDashboard,
  isSidebarOpen = false,
  isSidebarPinned = false,
  onToggleSidebar,
  onOpenSidebar,
  onScheduleCloseSidebar,
}) => {
  const [, setTick] = useState(0);
  const [isConfirmingAllClear, setIsConfirmingAllClear] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const personaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return storageService.subscribe(() => setTick((t) => t + 1));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setIsPersonaOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const state = storageService.getState();
  const activeUser = storageService.getActiveUser();
  const activeSite = storageService.getActiveSite();
  const branding = storageService.getWhitelabelBranding();

  let headerBgStyle = branding.headerBackgroundColor;
  if (!headerBgStyle) {
    if (branding.headerBackground === 'DARK_NAVY') headerBgStyle = '#123B5D';
    else if (branding.headerBackground === 'SLATE') headerBgStyle = '#0F172A';
    else if (branding.headerBackground === 'BRAND_COLOR') headerBgStyle = branding.foreColor || branding.primaryColor;
    else if (branding.headerBackground === 'CLEAN_WHITE') headerBgStyle = '#FFFFFF';
  }

  const handleExecuteAllClear = () => {
    storageService.toggleEmergency(false);
    setIsConfirmingAllClear(false);
  };

  return (
    <header
      className="sticky top-0 z-40 bg-[#123B5D] text-white border-b border-[#0f304c] shadow-xs"
      style={{ backgroundColor: headerBgStyle || undefined }}
    >
      {/* Top emergency lockdown bar if active */}
      {state.isEmergencyActive && (
        <div
          id="header-emergency-lockdown-bar"
          className="bg-red-600 text-white px-3 sm:px-6 py-2.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
            <span className="p-1 rounded bg-red-700 text-white animate-pulse shrink-0">
              <AlertTriangle className="w-4 h-4 text-yellow-300" />
            </span>
            <span>
              CRITICAL FACILITY ALERT: Emergency evacuation active at <strong className="font-bold text-white underline">{activeSite.name}</strong>. Proceed to designated Muster Points immediately!
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {onOpenEmergencyModal && (
              <button
                id="header-manage-evacuation-roll-call-btn"
                type="button"
                onClick={onOpenEmergencyModal}
                className="bg-white text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-red-700" />
                <span>Manage Evacuation Roll Call</span>
              </button>
            )}

            {isConfirmingAllClear ? (
              <div className="flex items-center gap-1.5 bg-red-900/90 px-2 py-1 rounded-lg border border-red-400">
                <span className="text-[11px] font-semibold text-white px-1">Confirm All Clear?</span>
                <button
                  id="header-confirm-declare-all-clear-btn"
                  type="button"
                  onClick={handleExecuteAllClear}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Yes, Declare & Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingAllClear(false)}
                  className="bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded text-xs font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                id="header-declare-all-clear-reset-btn"
                type="button"
                onClick={() => setIsConfirmingAllClear(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer shadow-xs flex items-center gap-1.5"
                title="Declare all clear, restore gates, and reset muster point roll call"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Declare All Clear & Reset</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Clean, corporate bar with burger button positioned before brand logo on top-left corner */}
      <div className="w-full px-3 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Burger Button directly before Company Logo */}
            {onToggleSidebar && (
              <button
                type="button"
                id="header-sidebar-burger-btn"
                onClick={onToggleSidebar}
                onMouseEnter={onOpenSidebar}
                onMouseLeave={onScheduleCloseSidebar}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer select-none group ${
                  isSidebarPinned
                    ? 'bg-teal-600 text-white border-teal-500 shadow-xs'
                    : isSidebarOpen
                    ? 'bg-white/20 text-teal-200 border-white/30'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/15 hover:border-white/30'
                }`}
                title={isSidebarPinned ? 'Click to unpin and close sidebar' : 'Click to pin sidebar open'}
                aria-label={isSidebarPinned ? 'Close navigation sidebar' : 'Pin navigation sidebar'}
              >
                {isSidebarPinned ? (
                  <X className="w-4 h-4 text-white transition-transform duration-200" />
                ) : (
                  <Menu
                    className="w-4 h-4 transition-transform duration-200 text-slate-200 group-hover:text-white"
                  />
                )}
                <span className="text-xs font-bold tracking-tight hidden sm:inline">
                  {isSidebarPinned ? 'Close' : 'Menu'}
                </span>
                {isSidebarPinned && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-300 animate-pulse" title="Pinned Open" />
                )}
              </button>
            )}

            <button
              type="button"
              id="global-header-brand-logo-btn"
              onClick={onNavigateToDashboard}
              className="flex items-center gap-3 shrink-0 text-left hover:opacity-90 transition cursor-pointer"
              title="JS AlphaSoftXenia - Return to Operations Portal"
            >
              <JSAlphaSoftLogo darkTheme size="md" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-white/10 text-teal-200 border border-white/10">
              Enterprise Visitor Management Portal
            </span>

            {/* Instant Persona Switcher Dropdown */}
            {activeUser && (
              <div className="relative" ref={personaRef}>
                <button
                  type="button"
                  id="header-instant-persona-switch-btn"
                  onClick={() => setIsPersonaOpen(!isPersonaOpen)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer select-none ${
                    activeUser.role === 'PLATFORM_SUPER_ADMIN'
                      ? 'bg-purple-900/80 hover:bg-purple-800 border-purple-400/40 text-purple-200'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                  }`}
                  title="Instant Persona Switch: Quickly switch between Superadmin and other operational personas"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span className="text-[11px] font-mono hidden sm:inline text-teal-200">Persona:</span>
                  <span className="font-bold text-white max-w-[110px] truncate">{activeUser.name.split(' ')[0]}</span>
                  <span className="text-[9px] px-1 py-0.2 rounded bg-black/30 text-teal-300 font-mono">
                    {activeUser.role === 'PLATFORM_SUPER_ADMIN' ? 'Superadmin' : storageService.getRoleLabel(activeUser.role).split(' ')[0]}
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-300 transition-transform ${isPersonaOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPersonaOpen && (
                  <div
                    id="header-instant-persona-dropdown"
                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 text-slate-800 animate-fadeIn"
                  >
                    <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#123B5D]">
                        <Zap className="w-3.5 h-3.5 text-amber-500" />
                        <span>Instant Persona Switch</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">Switch Role</span>
                    </div>

                    <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
                      {(activeUser.role === 'PLATFORM_SUPER_ADMIN'
                        ? state.users.slice(0, 8)
                        : state.users.filter((u) => u.tenantId === state.activeTenantId)
                      ).map((u) => {
                        const isCurrent = u.id === activeUser.id;
                        const isSuper = u.role === 'PLATFORM_SUPER_ADMIN';
                        return (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => {
                              storageService.setActiveContext({ userId: u.id });
                              setIsPersonaOpen(false);
                            }}
                            className={`w-full p-2 rounded-lg text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                              isCurrent
                                ? 'bg-teal-50 border border-teal-200'
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold text-xs truncate ${isCurrent ? 'text-teal-950' : 'text-slate-900'}`}>
                                  {u.name}
                                </span>
                                {isSuper && (
                                  <span className="text-[9px] px-1 py-0.2 rounded bg-purple-100 text-purple-800 font-bold font-mono">
                                    Superadmin
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">
                                {storageService.getRoleLabel(u.role)} • <span className="font-mono">{u.loginId}</span>
                              </div>
                            </div>
                            {isCurrent && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
