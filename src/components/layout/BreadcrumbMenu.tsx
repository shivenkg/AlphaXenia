import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  ChevronRight,
  ChevronDown,
  LayoutDashboard,
  CheckSquare,
  DoorOpen,
  Users,
  UserPlus,
  UserCheck,
  Printer,
  HardDrive,
  AlertOctagon,
  BarChart3,
  FileText,
  ShieldCheck,
  Palette,
  KeyRound,
  Building,
  Sliders,
  Database,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { NavViewId, UserRole } from '../../types';
import { getGlobalThemeMode } from '../../utils/themeApplier';
import { SidebarSyncTab } from './SidebarSyncTab';

interface BreadcrumbMenuProps {
  currentView: NavViewId;
  onNavigate: (view: NavViewId) => void;
  isDark?: boolean;
}

interface ViewMetadata {
  category: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const BreadcrumbMenu: React.FC<BreadcrumbMenuProps> = ({
  currentView,
  onNavigate,
  isDark: propIsDark,
}) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => getGlobalThemeMode());
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e?.detail?.mode) {
        setThemeMode(e.detail.mode);
      } else {
        setThemeMode(getGlobalThemeMode());
      }
    };
    window.addEventListener('vms-theme-changed', handleThemeChange);
    return () => {
      window.removeEventListener('vms-theme-changed', handleThemeChange);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    // Graceful 220ms delay before tucking away so slight mouse movements don't cause sudden flicker
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 220);
  };

  const isDark = propIsDark !== undefined ? propIsDark : themeMode === 'dark';

  const activeUser = storageService.getActiveUser() || {
    name: 'Administrator',
    loginId: 'SEC-01',
    role: 'PLATFORM_SUPER_ADMIN' as UserRole,
    departmentName: 'Security Operations',
  };
  const role: UserRole = activeUser.role || 'RECEPTIONIST';

  const getViewMetadata = (view: NavViewId): ViewMetadata => {
    switch (view) {
      case 'dashboard':
        return { category: 'Operations & Access', title: 'Executive Dashboard', icon: LayoutDashboard };
      case 'reception':
        return { category: 'Operations & Access', title: 'Reception Desk & Fast Check-In', icon: CheckSquare };
      case 'walkin':
        return { category: 'Operations & Access', title: 'Walk-In Registration Kiosk', icon: DoorOpen };
      case 'visitors':
        return { category: 'Directory & Visitors', title: 'Registered Visitors Directory', icon: Users };
      case 'invitations':
        return { category: 'Directory & Visitors', title: 'Pre-Registrations & Invites', icon: UserPlus };
      case 'approvals':
        return { category: 'Directory & Visitors', title: 'Authorizations & Approvals', icon: UserCheck };
      case 'badges':
        return { category: 'Badging & Physical Access', title: 'Badge Pass Designer & Dispatch', icon: Printer };
      case 'devices':
        return { category: 'Hardware & Facility', title: 'Hardware Devices & Edge Turnstiles', icon: HardDrive };
      case 'emergency':
        return { category: 'Hardware & Facility', title: 'Emergency Roll Call & Muster Points', icon: AlertOctagon };
      case 'reports':
        return { category: 'Intelligence & Analytics', title: 'Visitor Analytics & Peak Hours', icon: BarChart3 };
      case 'audit':
        return { category: 'Intelligence & Analytics', title: 'Security Audit Trail Logs', icon: FileText };
      case 'user_management':
        return { category: 'Administration & RBAC', title: 'User Login IDs & Access', icon: Users };
      case 'roles_workflow':
        return { category: 'Administration & RBAC', title: 'Roles & Role Names (RBAC)', icon: ShieldCheck };
      case 'whitelabel':
        return { category: 'Administration & RBAC', title: 'Tenant White-Labeling Engine', icon: Palette };
      case 'saas_license':
        return { category: 'Administration & RBAC', title: 'SaaS License Engine & Quotas', icon: KeyRound };
      case 'tenants':
        return { category: 'Administration & RBAC', title: 'Tenant Addition & Hierarchy', icon: Building };
      case 'customization':
        return { category: 'Administration & RBAC', title: 'System & Theme Customization', icon: Sliders };
      case 'database_config':
        return { category: 'Administration & RBAC', title: 'Database Connection Engine', icon: Database };
      case 'landing':
        return { category: 'Public Showcase', title: 'Product Overview', icon: Compass };
      default:
        return { category: 'Operations', title: String(view).replace(/_/g, ' '), icon: Layers };
    }
  };

  const currentMeta = getViewMetadata(currentView);
  const CurrentIcon = currentMeta.icon;

  return (
    <div
      id="breadcrumb-hover-trigger-zone"
      className="relative w-full mb-3 -mt-1 group/breadcrumb transition-all duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {/* 
        Default Hidden / Collapsed Hit Zone Indicator:
        Visible when not hovering near the breadcrumb area.
        Provides a subtle visual clue that breadcrumbs are available on hover.
      */}
      <div
        className={`w-full transition-all duration-300 flex items-center justify-between px-3.5 py-1.5 rounded-xl border border-dashed cursor-pointer ${
          isHovered
            ? 'opacity-0 max-h-0 pointer-events-none -translate-y-1 mb-0 py-0 border-transparent overflow-hidden'
            : isDark
            ? 'opacity-85 hover:opacity-100 bg-[#0B2544]/50 hover:bg-[#0B2544]/80 border-sky-500/30 text-sky-200 shadow-2xs'
            : 'opacity-85 hover:opacity-100 bg-white/70 hover:bg-white border-slate-300/80 text-slate-700 shadow-2xs'
        } backdrop-blur-xs`}
        onClick={() => setIsHovered(true)}
        title="Hover near to reveal login and database status"
      >
        <div className="flex items-center gap-2 text-xs">
          <span className={`w-2 h-2 rounded-full animate-pulse ${isDark ? 'bg-sky-400' : 'bg-teal-600'}`} />
          <div className="flex items-center gap-1.5 font-semibold text-xs">
            <CurrentIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
            <span className="truncate max-w-[220px] sm:max-w-md">{currentMeta.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-medium opacity-70 group-hover/breadcrumb:opacity-100 transition-opacity">
          <span className="hidden sm:inline text-[10px]">Hover near to reveal login & sync status</span>
          <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover/breadcrumb:translate-y-0.5" />
        </div>
      </div>

      {/* 
        Expanded Full Breadcrumb Menu:
        Hidden by default, reveals dynamically on hovering near to this area.
      */}
      <div
        className={`transition-all duration-300 ease-out origin-top transform ${
          isHovered
            ? 'opacity-100 max-h-[500px] translate-y-0 pointer-events-auto visible shadow-md'
            : 'opacity-0 max-h-0 -translate-y-2 pointer-events-none invisible overflow-hidden'
        }`}
      >
        <nav
          id="app-breadcrumb-menu"
          aria-label="Breadcrumb Navigation"
          className={`w-full px-3.5 sm:px-4 py-2.5 rounded-2xl border transition-all duration-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
            isDark
              ? 'bg-[#0B2544]/95 border-sky-500/40 text-sky-100 shadow-sky-950/30'
              : 'bg-white/95 border-[#D8E1E8] text-slate-800 shadow-slate-200/50'
          } backdrop-blur-md`}
        >
          {/* Left Segment: Breadcrumb Navigation Trail */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg transition-colors cursor-pointer ${
                isDark
                  ? 'text-sky-300 hover:text-white hover:bg-sky-900/50'
                  : 'text-slate-600 hover:text-[#0F766E] hover:bg-slate-100'
              }`}
              title="Return to Home Dashboard"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-sky-500' : 'text-slate-400'}`} />

            {/* Section / Domain Category */}
            <span
              className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                isDark ? 'text-sky-300/80 bg-sky-950/50' : 'text-slate-500 bg-slate-50'
              }`}
            >
              {currentMeta.category}
            </span>

            <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-sky-500' : 'text-slate-400'}`} />

            {/* Active Page / View Leaf */}
            <div
              className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-lg border ${
                isDark
                  ? 'bg-sky-950/80 border-sky-400/40 text-white shadow-xs'
                  : 'bg-teal-50 border-teal-200/80 text-[#0F766E] shadow-xs'
              }`}
            >
              <CurrentIcon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-[200px] sm:max-w-none">{currentMeta.title}</span>
            </div>
          </div>

          {/* Right Segment: Moved Components from Sidebar (Sync Tab & Active Persona) */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-end shrink-0">
            {/* Realtime Database Sync Tab Component */}
            <SidebarSyncTab
              isDark={isDark}
              onSelectView={onNavigate}
              variant="breadcrumb"
            />

            {/* Active Persona Identity Card Component */}
            <div
              id="breadcrumb-persona-identity-badge"
              className={`flex items-center gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-xl border shadow-xs transition-colors shrink-0 ${
                isDark
                  ? 'bg-[#0F335C]/90 border-sky-400/40 text-white'
                  : 'bg-gradient-to-r from-slate-50 to-white border-[#E2E8F0] text-slate-900'
              }`}
              title={`Active User: ${activeUser.name} (${activeUser.loginId})`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0 ring-2 shadow-xs ${
                  isDark
                    ? 'bg-gradient-to-br from-sky-400 to-sky-600 text-slate-950 ring-sky-400/40'
                    : 'bg-gradient-to-br from-[#123B5D] to-[#0F766E] text-white ring-teal-500/20'
                }`}
              >
                {activeUser.name.charAt(0)}
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xs leading-none truncate max-w-[110px] sm:max-w-[150px]">
                    {activeUser.name}
                  </span>
                  <span
                    className={`font-semibold px-1.5 py-0.2 rounded-full border text-[9px] leading-tight ${
                      isDark
                        ? 'text-sky-200 bg-sky-900/60 border-sky-400/40'
                        : 'text-teal-800 bg-teal-50 border-teal-200/80'
                    }`}
                  >
                    {storageService.getRoleLabel(role)}
                  </span>
                </div>
                <div className={`flex items-center gap-2 text-[10px] mt-0.5 leading-none ${
                  isDark ? 'text-sky-300' : 'text-slate-500'
                }`}>
                  <span className="truncate">
                    ID: <strong className={`font-mono font-semibold ${isDark ? 'text-sky-200' : 'text-[#123B5D]'}`}>{activeUser.loginId}</strong>
                  </span>
                  <span className="text-slate-300 dark:text-sky-700">•</span>
                  <span className={`font-mono truncate ${isDark ? 'text-sky-400' : 'text-slate-400'}`}>
                    {activeUser.departmentName || 'Enterprise'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

