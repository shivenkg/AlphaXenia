import React, { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Menu,
  X,
  Users,
  CheckCircle2,
  Zap,
  ChevronDown,
  Search,
  Sun,
  Moon,
  Database,
  Palette,
  KeyRound,
  ShieldCheck,
  Sliders,
  Building2,
  ScanLine,
  Printer,
  BarChart3,
  FileText,
  UserPlus,
  CornerDownLeft
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { JSAlphaSoftLogo } from '../common/JSAlphaSoftLogo';
import {
  getGlobalThemeMode,
  toggleGlobalThemeMode,
  GlobalThemeMode
} from '../../utils/themeApplier';
import { NavViewId, Visit, Tenant } from '../../types';

interface HeaderProps {
  onOpenEmergencyModal?: () => void;
  onNavigateToDashboard?: () => void;
  onNavigateToView?: (view: NavViewId) => void;
  onSelectVisitForBadge?: (visit: Visit) => void;
  onNavigateToLanding?: () => void;
  isSidebarOpen?: boolean;
  isSidebarPinned?: boolean;
  onToggleSidebar?: () => void;
  onOpenSidebar?: () => void;
  onScheduleCloseSidebar?: () => void;
}

interface SearchResultItem {
  id: string;
  category: 'TENANT' | 'VISITOR' | 'SETTING';
  title: string;
  subtitle: string;
  badge?: string;
  badgeColor?: string;
  targetView?: NavViewId;
  action?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEmergencyModal,
  onNavigateToDashboard,
  onNavigateToView,
  onSelectVisitForBadge,
  onNavigateToLanding,
  isSidebarOpen = false,
  isSidebarPinned = false,
  onToggleSidebar,
  onOpenSidebar,
  onScheduleCloseSidebar,
}) => {
  const [, setTick] = useState(0);
  const [isConfirmingAllClear, setIsConfirmingAllClear] = useState(false);
  const [isPersonaOpen, setIsPersonaOpen] = useState(false);
  const [isSuperAdminPromptOpen, setIsSuperAdminPromptOpen] = useState(false);
  const [superAdminPassInput, setSuperAdminPassInput] = useState('');
  const [superAdminPassError, setSuperAdminPassError] = useState<string | null>(null);
  const personaRef = useRef<HTMLDivElement>(null);

  // Global Theme Mode (Default Ivory vs High-Contrast Dark mode)
  const [themeMode, setThemeMode] = useState<GlobalThemeMode>(() => getGlobalThemeMode());

  // Global Search State & Predictive Dropdown
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return storageService.subscribe(() => setTick((t) => t + 1));
  }, []);

  // Listen to custom theme events or storage changes
  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e?.detail?.mode) {
        setThemeMode(e.detail.mode);
      } else {
        setThemeMode(getGlobalThemeMode());
      }
    };
    window.addEventListener('vms-theme-changed', handleThemeChange);
    return () => window.removeEventListener('vms-theme-changed', handleThemeChange);
  }, []);

  // Keyboard shortcut listener for Global Search (Cmd+K / Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle outside click for Search & Persona dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personaRef.current && !personaRef.current.contains(e.target as Node)) {
        setIsPersonaOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const state = storageService.getState();
  const activeUser = storageService.getActiveUser();
  const activeSite = storageService.getActiveSite();
  const branding = storageService.getWhitelabelBranding();
  const isSuperAdmin = activeUser?.role === 'PLATFORM_SUPER_ADMIN';

  // Toggle theme mode handler
  const handleToggleTheme = () => {
    const next = toggleGlobalThemeMode(branding);
    setThemeMode(next);
  };

  let headerBgStyle = branding.headerBackgroundColor;
  if (!headerBgStyle) {
    if (themeMode === 'dark') {
      headerBgStyle = '#0C2B4E';
    } else {
      if (branding.headerBackground === 'DARK_NAVY') headerBgStyle = '#123B5D';
      else if (branding.headerBackground === 'SLATE') headerBgStyle = '#0F172A';
      else if (branding.headerBackground === 'BRAND_COLOR')
        headerBgStyle = branding.foreColor || branding.primaryColor;
      else if (branding.headerBackground === 'CLEAN_WHITE') headerBgStyle = '#FFFFFF';
    }
  }

  const handleExecuteAllClear = () => {
    storageService.toggleEmergency(false);
    setIsConfirmingAllClear(false);
  };

  // Compile Predictive Search Results across 3 Domains
  const searchResults: SearchResultItem[] = [];
  const q = searchQuery.trim().toLowerCase();

  if (q.length > 0) {
    // 1. Search Active Tenants
    state.tenants
      .filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.code.toLowerCase().includes(q) ||
          t.tier.toLowerCase().includes(q)
      )
      .slice(0, 4)
      .forEach((tenant) => {
        searchResults.push({
          id: `tenant-${tenant.id}`,
          category: 'TENANT',
          title: tenant.name,
          subtitle: `Code: ${tenant.code} • DB: ${tenant.databaseRef}`,
          badge: tenant.tier.replace(/_/g, ' '),
          badgeColor: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
          action: () => {
            storageService.setActiveContext({ tenantId: tenant.id });
            if (onNavigateToView) onNavigateToView('tenants');
            setIsSearchOpen(false);
            setSearchQuery('');
          },
        });
      });

    // 2. Search Visitor Logs & Passes
    state.visits
      .filter(
        (v) =>
          v.visitorName.toLowerCase().includes(q) ||
          v.visitorCompany.toLowerCase().includes(q) ||
          v.hostName.toLowerCase().includes(q) ||
          v.passToken.toLowerCase().includes(q) ||
          (v.purpose && v.purpose.toLowerCase().includes(q))
      )
      .slice(0, 5)
      .forEach((visit) => {
        const stateColorMap: Record<string, string> = {
          CHECKED_IN: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30',
          EXPECTED: 'bg-blue-500/20 text-blue-200 border-blue-400/30',
          PENDING_APPROVAL: 'bg-amber-500/20 text-amber-200 border-amber-400/30',
          CHECKED_OUT: 'bg-slate-500/20 text-slate-200 border-slate-400/30',
        };
        searchResults.push({
          id: `visit-${visit.id}`,
          category: 'VISITOR',
          title: visit.visitorName,
          subtitle: `${visit.visitorCompany} • Host: ${visit.hostName} • Pass: ${visit.passToken}`,
          badge: visit.state.replace(/_/g, ' '),
          badgeColor: stateColorMap[visit.state] || 'bg-slate-500/20 text-slate-200 border-slate-400/30',
          action: () => {
            if (onSelectVisitForBadge) {
              onSelectVisitForBadge(visit);
            } else if (onNavigateToView) {
              onNavigateToView('reception');
            }
            setIsSearchOpen(false);
            setSearchQuery('');
          },
        });
      });

    // 3. Search Configuration Settings & Admin Views
    const allSettings: {
      name: string;
      subtitle: string;
      targetView: NavViewId;
      superAdminOnly?: boolean;
    }[] = [
      {
        name: 'Database Connection Configuration',
        subtitle: 'Primary cluster endpoints, HikariCP pooling, SSL/TLS, and multi-tenant sharding',
        targetView: 'database_config',
        superAdminOnly: true,
      },
      {
        name: 'Tenant White-Labeling Engine',
        subtitle: 'Enterprise logo uploads, typography styles, font colors, and portal branding',
        targetView: 'whitelabel',
      },
      {
        name: 'SaaS License Engine & Quotas',
        subtitle: 'Multi-tenant subscription tier allocation, visitor quotas, and edge sync limits',
        targetView: 'saas_license',
        superAdminOnly: true,
      },
      {
        name: 'User Login IDs & Access Control',
        subtitle: 'Provision employee login accounts, passwords, and security facility permissions',
        targetView: 'user_management',
      },
      {
        name: 'Roles & Role Names (RBAC)',
        subtitle: 'Role definitions, permission hierarchies, and multi-level approval matrices',
        targetView: 'roles_workflow',
      },
      {
        name: 'System & Theme Customization',
        subtitle: 'Real-time typography customizer, font presets, and preview gallery',
        targetView: 'customization',
      },
      {
        name: 'Hardware Devices & Edge Turnstiles',
        subtitle: 'Biometric scanners, thermal pass printers, and physical gate controllers',
        targetView: 'devices',
      },
      {
        name: 'Emergency Roll Call & Muster Points',
        subtitle: 'Critical facility evacuation, muster point verification, and all-clear controls',
        targetView: 'emergency',
      },
      {
        name: 'Security Audit Trail Logs',
        subtitle: 'Tamper-evident system activity log and compliance event records',
        targetView: 'audit',
      },
      {
        name: 'Visitor Analytics & Peak Hours',
        subtitle: 'Operations intelligence, dwell times, and site occupancy analytics',
        targetView: 'reports',
      },
      {
        name: 'Reception & Fast Check-In',
        subtitle: 'Front desk visitor lookup, pass print, and emergency roll call',
        targetView: 'reception',
      },
      {
        name: 'Walk-In Registration Kiosk',
        subtitle: 'Self-service walk-in registration and NDA compliance execution',
        targetView: 'walkin',
      },
    ];

    allSettings
      .filter((s) => {
        if (s.superAdminOnly && !isSuperAdmin) return false;
        return (
          s.name.toLowerCase().includes(q) ||
          s.subtitle.toLowerCase().includes(q) ||
          s.targetView.toLowerCase().includes(q)
        );
      })
      .slice(0, 4)
      .forEach((item) => {
        searchResults.push({
          id: `setting-${item.targetView}`,
          category: 'SETTING',
          title: item.name,
          subtitle: item.subtitle,
          badge: item.superAdminOnly ? 'Super Admin' : 'Admin Hub',
          badgeColor: item.superAdminOnly
            ? 'bg-purple-500/20 text-purple-200 border-purple-400/30 font-bold'
            : 'bg-teal-500/20 text-teal-200 border-teal-400/30',
          action: () => {
            if (onNavigateToView) onNavigateToView(item.targetView);
            setIsSearchOpen(false);
            setSearchQuery('');
          },
        });
      });
  }

  // Handle Search Keyboard Navigation
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[highlightedIndex]) {
        searchResults[highlightedIndex].action?.();
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      searchInputRef.current?.blur();
    }
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
              CRITICAL FACILITY ALERT: Emergency evacuation active at{' '}
              <strong className="font-bold text-white underline">{activeSite.name}</strong>. Proceed
              to designated Muster Points immediately!
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

      {/* Main Corporate Header Bar */}
      <div className="w-full px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-2 sm:gap-4">
          {/* Left section: Burger + Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
            {onToggleSidebar && (
              <button
                type="button"
                id="header-sidebar-burger-btn"
                onClick={onToggleSidebar}
                onMouseEnter={onOpenSidebar}
                onMouseLeave={onScheduleCloseSidebar}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer select-none group ${
                  isSidebarPinned
                    ? themeMode === 'dark'
                      ? 'bg-[#164E87] text-white font-bold border-sky-400 shadow-md shadow-sky-950/40'
                      : 'bg-teal-700 text-white font-bold border-teal-600 shadow-xs'
                    : isSidebarOpen
                    ? themeMode === 'dark'
                      ? 'bg-sky-500/25 text-sky-100 border-sky-400/50'
                      : 'bg-white/20 text-teal-200 border-white/30'
                    : themeMode === 'dark'
                    ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 hover:text-white border-sky-400/40 hover:border-sky-300'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/15 hover:border-white/30'
                }`}
                title={isSidebarPinned ? 'Click to unpin and close sidebar' : 'Click to pin sidebar open'}
                aria-label={isSidebarPinned ? 'Close navigation sidebar' : 'Pin navigation sidebar'}
              >
                {isSidebarPinned ? (
                  <X className="w-4 h-4 text-sky-300 transition-transform duration-200" />
                ) : (
                  <Menu className={`w-4 h-4 transition-transform duration-200 ${themeMode === 'dark' ? 'text-sky-300 group-hover:text-white' : 'text-slate-200 group-hover:text-white'}`} />
                )}
                <span className="text-xs font-bold tracking-tight hidden sm:inline text-white">
                  {isSidebarPinned ? 'Close' : 'Menu'}
                </span>
                {isSidebarPinned && (
                  <span className={`w-1.5 h-1.5 rounded-full ${themeMode === 'dark' ? 'bg-sky-300' : 'bg-teal-300'} animate-pulse`} title="Pinned Open" />
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

          {/* Center Section: Global Search Bar with Predictive Dropdown */}
          <div className="flex-1 max-w-md mx-1 sm:mx-3 relative" ref={searchContainerRef}>
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-300 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                id="header-global-search-input"
                value={searchQuery}
                onFocus={() => setIsSearchOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                  setHighlightedIndex(0);
                }}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search visitors, tenants, configuration (Press / or ⌘K)..."
                className="w-full pl-9 pr-14 py-1.5 text-xs rounded-xl bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-white/40 text-white placeholder-slate-300/70 focus:outline-none transition-all shadow-inner"
              />
              <div className="absolute right-2.5 top-2 flex items-center gap-1 pointer-events-none">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="pointer-events-auto text-slate-300 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[9px] font-mono font-bold text-slate-300 bg-white/10 border border-white/20 rounded">
                    ⌘K
                  </kbd>
                )}
              </div>
            </div>

            {/* Predictive Dropdown Menu */}
            {isSearchOpen && (
              <div
                id="header-predictive-search-dropdown"
                className={`absolute left-0 right-0 mt-2 rounded-2xl shadow-2xl p-2 z-50 max-h-96 overflow-y-auto animate-fadeIn ${
                  themeMode === 'dark'
                    ? 'bg-[#0B2544]/98 backdrop-blur-md border border-sky-500/70 text-sky-100 shadow-sky-950/60'
                    : 'bg-slate-900/95 backdrop-blur-md border border-slate-700/80 text-white'
                }`}
              >
                {searchResults.length === 0 ? (
                  <div className={`py-4 text-center text-xs ${themeMode === 'dark' ? 'text-sky-300' : 'text-slate-400'}`}>
                    {searchQuery.trim() ? (
                      <p>
                        No matches found for "<strong className={themeMode === 'dark' ? 'text-white' : 'text-white'}>{searchQuery}</strong>".
                      </p>
                    ) : (
                      <div className="space-y-1">
                        <p className={`font-semibold ${themeMode === 'dark' ? 'text-sky-200' : 'text-slate-300'}`}>Predictive Quick Jump</p>
                        <p className={`text-[11px] ${themeMode === 'dark' ? 'text-sky-300/80' : 'text-slate-400'}`}>
                          Type a visitor name, company, tenant code, or configuration view name.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-1">
                    {searchResults.map((item, idx) => {
                      const isHighlighted = idx === highlightedIndex;
                      const getCategoryIcon = () => {
                        if (item.category === 'TENANT')
                          return <Building2 className={`w-3.5 h-3.5 shrink-0 ${themeMode === 'dark' ? 'text-sky-400' : 'text-blue-400'}`} />;
                        if (item.category === 'VISITOR')
                          return <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
                        return <Sliders className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
                      };

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => item.action?.()}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`w-full p-2.5 rounded-xl text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                            isHighlighted
                              ? themeMode === 'dark'
                                ? 'bg-[#164E87] border border-sky-400 text-white shadow-xs'
                                : 'bg-[#123B5D] border border-teal-400 text-white shadow-xs'
                              : themeMode === 'dark'
                              ? 'hover:bg-sky-900/40 border border-transparent text-sky-200 hover:text-white'
                              : 'hover:bg-slate-800 border border-transparent text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {getCategoryIcon()}
                            <div className="min-w-0">
                              <div className="font-bold text-xs truncate flex items-center gap-2">
                                <span className={themeMode === 'dark' ? 'text-sky-100' : ''}>{item.title}</span>
                                <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded font-mono ${
                                  themeMode === 'dark'
                                    ? 'bg-sky-950 border border-sky-400/40 text-sky-200'
                                    : 'bg-white/10 text-slate-300'
                                }`}>
                                  {item.category}
                                </span>
                              </div>
                              <div className={`text-[10px] truncate font-mono ${themeMode === 'dark' ? 'text-sky-300/80' : 'text-slate-400'}`}>
                                {item.subtitle}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.badge && (
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-mono border ${
                                  themeMode === 'dark'
                                    ? 'bg-sky-950/70 text-sky-200 border-sky-400/40'
                                    : item.badgeColor || 'bg-white/10 text-white border-white/20'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            {isHighlighted && (
                              <CornerDownLeft className={`w-3 h-3 hidden sm:inline ${themeMode === 'dark' ? 'text-sky-300' : 'text-cyan-300'}`} />
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className={`mt-2 pt-2 border-t flex items-center justify-between text-[10px] px-2 font-mono ${
                  themeMode === 'dark' ? 'border-sky-800/60 text-sky-300' : 'border-slate-800 text-slate-400'
                }`}>
                  <span>Press ↑↓ to navigate • Enter to select</span>
                  <span>Esc to dismiss</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Section: Theme Toggle + Persona Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Global Theme Toggle Button (Ivory vs High-Contrast Dark Mode) */}
            <button
              type="button"
              id="header-theme-toggle-btn"
              onClick={handleToggleTheme}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer select-none ${
                themeMode === 'dark'
                  ? 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/40 text-amber-200 shadow-xs'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
              title={
                themeMode === 'dark'
                  ? 'Active: High-Contrast Dark Mode. Click to switch to Clean Light Mode.'
                  : 'Active: Clean Light Mode. Click to switch to High-Contrast Dark Mode.'
              }
              aria-label={`Toggle theme mode (currently ${themeMode})`}
            >
              {themeMode === 'dark' ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline font-bold">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline font-bold">Light</span>
                </>
              )}
            </button>

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
                  <span className={`text-[9px] px-1 py-0.2 rounded font-mono ${
                    themeMode === 'dark' ? 'bg-sky-950 text-sky-200 border border-sky-400/40' : 'bg-black/30 text-teal-300'
                  }`}>
                    {activeUser.role === 'PLATFORM_SUPER_ADMIN'
                      ? 'Superadmin'
                      : storageService.getRoleLabel(activeUser.role).split(' ')[0]}
                  </span>
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      themeMode === 'dark' ? 'text-sky-300' : 'text-slate-300'
                    } ${isPersonaOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isPersonaOpen && (
                  <div
                    id="header-instant-persona-dropdown"
                    className={`absolute right-0 mt-2 w-72 rounded-xl shadow-2xl p-2 z-50 animate-fadeIn ${
                      themeMode === 'dark'
                        ? 'bg-[#0B2544] border border-sky-500/70 text-sky-100 shadow-sky-950/60'
                        : 'bg-white border border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className={`px-2.5 py-1.5 border-b flex items-center justify-between ${
                      themeMode === 'dark' ? 'border-sky-800/60' : 'border-slate-100'
                    }`}>
                      <div className={`flex items-center gap-1.5 text-xs font-bold ${
                        themeMode === 'dark' ? 'text-sky-200' : 'text-[#123B5D]'
                      }`}>
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        <span>Instant Persona Switch</span>
                      </div>
                      <span className={`text-[10px] font-mono ${themeMode === 'dark' ? 'text-sky-300/80' : 'text-slate-400'}`}>Switch Role</span>
                    </div>

                    <div className="py-1 space-y-1 max-h-72 overflow-y-auto">
                      {(activeUser.role === 'PLATFORM_SUPER_ADMIN'
                        ? state.users.slice(0, 8)
                        : state.users.filter(
                            (u) =>
                              u.tenantId === state.activeTenantId &&
                              u.role !== 'PLATFORM_SUPER_ADMIN'
                          )
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
                                ? themeMode === 'dark'
                                  ? 'bg-[#164E87] border border-sky-400 text-white font-bold shadow-xs'
                                  : 'bg-teal-100 border border-teal-400 text-teal-950 font-bold shadow-xs'
                                : themeMode === 'dark'
                                ? 'hover:bg-sky-900/40 border border-transparent text-sky-200 hover:text-white'
                                : 'hover:bg-slate-100 border border-transparent'
                            }`}
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`font-bold text-xs truncate ${
                                    isCurrent
                                      ? themeMode === 'dark' ? 'text-white font-extrabold' : 'text-teal-950 font-extrabold'
                                      : themeMode === 'dark' ? 'text-sky-100' : 'text-slate-900'
                                  }`}
                                >
                                  {u.name}
                                </span>
                                {isSuper && (
                                  <span className={`text-[9px] px-1 py-0.2 rounded font-bold font-mono ${
                                    themeMode === 'dark'
                                      ? 'bg-purple-900/80 text-purple-200 border border-purple-500/50'
                                      : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    Superadmin
                                  </span>
                                )}
                              </div>
                              <div className={`text-[10px] truncate ${themeMode === 'dark' ? 'text-sky-300/80' : 'text-slate-500'}`}>
                                {storageService.getRoleLabel(u.role)} • <span className="font-mono">{u.loginId}</span>
                              </div>
                            </div>
                            {isCurrent && (
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${themeMode === 'dark' ? 'text-sky-300' : 'text-teal-700'}`} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Product Overview Link if onNavigateToLanding is provided */}
            {onNavigateToLanding && (
              <button
                type="button"
                id="header-landing-page-nav-btn"
                onClick={onNavigateToLanding}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition cursor-pointer select-none"
                title="View Product Landing Page"
              >
                <span>Product Overview</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
