import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ScanLine,
  UserPlus,
  Users,
  CheckSquare,
  QrCode,
  Printer,
  AlertOctagon,
  HardDrive,
  Wifi,
  BarChart3,
  FileText,
  KeyRound,
  Building,
  DoorOpen,
  Layers,
  TestTube2,
  FileCode2,
  BookOpen,
  Share2,
  Sliders,
  ShieldCheck,
  UserCheck,
  Bell,
  LogOut,
  Palette,
  Compass,
  ChevronDown,
  Database
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { NavViewId, UserRole } from '../../types';
import { getGlobalThemeMode } from '../../utils/themeApplier';
import { SidebarSyncTab } from './SidebarSyncTab';

interface SidebarProps {
  currentView: NavViewId;
  onSelectView: (view: NavViewId) => void;
  onOpenSharePreRegModal: () => void;
  onOpenProfileModal?: () => void;
  onLogout?: () => void;
  isOpen?: boolean;
  isPinned?: boolean;
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenSharePreRegModal,
  onOpenProfileModal,
  onLogout,
  isOpen = true,
  isPinned = false,
  onClose,
  onMouseEnter,
  onMouseLeave,
}) => {
  const state = storageService.getState();
  const activeUser = storageService.getActiveUser();
  const role: UserRole = activeUser?.role || 'RECEPTIONIST';

  const isSuperAdmin = role === 'PLATFORM_SUPER_ADMIN';
  const isReceptionist = role === 'RECEPTIONIST';

  // Hover & Manual toggle state for collapsible Function menus
  const [hoveredSectionIdx, setHoveredSectionIdx] = useState<number | null>(null);
  const [toggledSections, setToggledSections] = useState<Record<number, boolean>>({});

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => getGlobalThemeMode());

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

  const isDark = themeMode === 'dark';

  const canAccessItem = (itemId: string): boolean => {
    if (isSuperAdmin) return true;
    return storageService.hasFunctionAccess(activeUser?.id || '', itemId);
  };

  // Dynamic Navigation Sections based on Login ID & Role
  const sections: {
    functionNumber: number;
    title: string;
    icon: any;
    items: {
      id: NavViewId | 'share_modal_action' | 'alerts_config' | 'logout_action';
      label: string;
      icon: any;
      isAction?: boolean;
      onClickAction?: () => void;
      variant?: 'default' | 'danger';
    }[];
  }[] = [];

  // ==========================================
  // Section 1: Administration & Tenants (Super Admin) or Administration & Physical Sites (Tenant Admin)
  // ==========================================
  const rawAdminItems = [
    {
      id: 'user_management' as NavViewId,
      label: 'User Login IDs & Access',
      icon: Users,
    },
    {
      id: 'roles_workflow' as NavViewId,
      label: 'Roles & Role Names (RBAC)',
      icon: ShieldCheck,
    },
    {
      id: 'whitelabel' as NavViewId,
      label: isSuperAdmin ? 'Tenant White-Labeling Engine' : 'Tenant White-Labeling',
      icon: Palette,
    },
    {
      id: 'saas_license' as NavViewId,
      label: 'SaaS License Engine',
      icon: KeyRound,
    },
    {
      id: 'tenants' as NavViewId,
      label: isSuperAdmin ? 'Tenant Addition & Hierarchy' : 'Physical Locations & Entry Gates',
      icon: isSuperAdmin ? Building : DoorOpen,
    },
    {
      id: 'customization' as NavViewId,
      label: 'System & Theme Customization',
      icon: Sliders,
    },
    ...(isSuperAdmin ? [
      {
        id: 'database_config' as NavViewId,
        label: 'Database Connection Engine',
        icon: Database,
      },
    ] : []),
  ].filter((item) => (isSuperAdmin ? true : canAccessItem(item.id)));

  // Administration Menu Items: includes navigation items plus Alert Configuration and Logout Button
  const adminItems: {
    id: NavViewId | 'share_modal_action' | 'alerts_config' | 'logout_action';
    label: string;
    icon: any;
    isAction?: boolean;
    onClickAction?: () => void;
    variant?: 'default' | 'danger';
  }[] = [...rawAdminItems];

  // Alert configuration placed under Administration menu in sidebar
  if (onOpenProfileModal) {
    adminItems.push({
      id: 'alerts_config',
      label: 'Alert Configuration',
      icon: Bell,
      isAction: true,
      onClickAction: onOpenProfileModal,
    });
  }

  if (adminItems.length > 0) {
    sections.push({
      functionNumber: 1,
      title: isSuperAdmin ? 'ADMINISTRATION & TENANTS' : 'ADMINISTRATION & PHYSICAL SITES',
      icon: isSuperAdmin ? Building : DoorOpen,
      items: adminItems,
    });
  }

  // ==========================================
  // Section 2: Operations & Reception / Operations & Workflow
  // ==========================================
  const allOpsItems = [
    {
      id: 'dashboard' as NavViewId,
      label: 'Operations Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'reception' as NavViewId,
      label: 'Reception & Fast Check-In',
      icon: ScanLine,
    },
    {
      id: 'walkin' as NavViewId,
      label: 'Walk-In Registration',
      icon: UserPlus,
    },
    {
      id: 'visitors' as NavViewId,
      label: 'Visitor Directory',
      icon: Users,
    },
    {
      id: 'approvals' as NavViewId,
      label: 'Approval Queue',
      icon: CheckSquare,
    },
    {
      id: 'share_modal_action' as const,
      label: 'Share Pre-Reg Link',
      icon: Share2,
      isAction: true,
    },
  ];

  const opsItems = allOpsItems.filter((item) => canAccessItem(item.id));

  if (opsItems.length > 0) {
    sections.push({
      functionNumber: 2,
      title: isReceptionist ? 'FRONT DESK RECEPTION' : 'OPERATIONS & WORKFLOW',
      icon: ScanLine,
      items: opsItems,
    });
  }

  // ==========================================
  // Section 3: Passes & Physical Security
  // ==========================================
  const allPassItems = [
    {
      id: 'invitations' as NavViewId,
      label: 'Invitations & QR Passes',
      icon: QrCode,
    },
    ...(isSuperAdmin
      ? [
          {
            id: 'badges' as NavViewId,
            label: 'Badge Designer & Pass Studio',
            icon: Printer,
          },
        ]
      : []),
    {
      id: 'emergency' as NavViewId,
      label: 'Emergency Evacuation',
      icon: AlertOctagon,
    },
  ];

  const passItems = allPassItems.filter((item) => canAccessItem(item.id));

  if (passItems.length > 0) {
    sections.push({
      functionNumber: 3,
      title: 'PASSES & FACILITY SAFETY',
      icon: QrCode,
      items: passItems,
    });
  }

  // ==========================================
  // Section 4: Infrastructure & Observability
  // ==========================================
  const allInfraItems = [
    {
      id: 'devices' as NavViewId,
      label: 'Device & Hardware Registry',
      icon: HardDrive,
    },
    {
      id: 'edge' as NavViewId,
      label: 'Edge Sync & Offline Buffer',
      icon: Wifi,
    },
    {
      id: 'reports' as NavViewId,
      label: 'Operational Reports',
      icon: BarChart3,
    },
    {
      id: 'audit' as NavViewId,
      label: 'Immutable Audit Trail',
      icon: FileText,
    },
  ];

  const infraItems = allInfraItems.filter((item) => canAccessItem(item.id));

  if (infraItems.length > 0) {
    sections.push({
      functionNumber: 4,
      title: 'INFRASTRUCTURE & OBSERVABILITY',
      icon: HardDrive,
      items: infraItems,
    });
  }

  // ==========================================
  // Section 5: Enterprise Architecture & Specs
  // ==========================================
  const allArchItems = [
    {
      id: 'arch_guide' as NavViewId,
      label: 'Step-by-Step Specs Guide',
      icon: Compass,
    },
    {
      id: 'blueprint' as NavViewId,
      label: 'Architecture, ADRs & DDL',
      icon: BookOpen,
    },
    {
      id: 'api_explorer' as NavViewId,
      label: 'OpenAPI 3.1 Live Catalog',
      icon: FileCode2,
    },
    {
      id: 'uat_tests' as NavViewId,
      label: 'Automated 25 UAT Tests',
      icon: TestTube2,
    },
    {
      id: 'iam' as NavViewId,
      label: 'OIDC Identity & RBAC Matrix',
      icon: KeyRound,
    },
  ];

  const archItems = allArchItems.filter((item) => canAccessItem(item.id));

  if (archItems.length > 0) {
    sections.push({
      functionNumber: 5,
      title: 'ENTERPRISE ARCHITECTURE & SPECS',
      icon: Compass,
      items: archItems,
    });
  }

  // Determine section index of active item
  const activeSectionIdx = sections.findIndex((sec) =>
    sec.items.some((it) => it.id === currentView)
  );

  const handleToggleSection = (idx: number) => {
    setToggledSections((prev) => {
      const isCurrentlyExpanded = isSectionExpanded(idx);
      return {
        ...prev,
        [idx]: !isCurrentlyExpanded,
      };
    });
  };

  const isSectionExpanded = (idx: number): boolean => {
    if (hoveredSectionIdx !== null) {
      return hoveredSectionIdx === idx;
    }
    if (toggledSections[idx] !== undefined) {
      return toggledSections[idx];
    }
    return activeSectionIdx !== -1 ? idx === activeSectionIdx : idx === 0;
  };

  return (
    <aside
      id="main-navigation-sidebar"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed top-14 left-0 bottom-0 z-40 w-72 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
        isDark
          ? 'bg-[#0B2544] border-r border-sky-500/50 text-sky-100 shadow-sky-950/50'
          : 'bg-white border-r border-[#D8E1E8]'
      } ${
        isPinned
          ? 'translate-x-0 opacity-100 pointer-events-auto shadow-md'
          : isOpen
          ? 'shadow-2xl translate-x-0 opacity-100 pointer-events-auto'
          : '-translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Top of Sidemenu Bar: Realtime Database Sync Tab */}
      <SidebarSyncTab isDark={isDark} onSelectView={onSelectView} />

      {/* Active Persona Identity Header */}
      <div className={`p-3.5 border-b shrink-0 ${
        isDark
          ? 'border-sky-500/40 bg-gradient-to-b from-[#0F335C] to-[#0B2544]'
          : 'border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-white'
      }`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ring-2 ${
              isDark
                ? 'bg-gradient-to-br from-sky-400 to-sky-600 text-slate-950 ring-sky-400/40'
                : 'bg-gradient-to-br from-[#123B5D] to-[#0F766E] text-white ring-teal-500/20'
            }`}>
              {activeUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className={`font-bold leading-snug truncate text-xs sm:text-[13px] md:text-sm ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {activeUser.name}
              </div>
              <div className={`inline-flex items-center font-semibold px-2 py-0.5 rounded-full mt-0.5 border text-[9px] sm:text-[10px] ${
                isDark
                  ? 'text-sky-200 bg-sky-900/60 border-sky-400/40'
                  : 'text-teal-800 bg-teal-50 border-teal-200/80'
              }`}>
                <span>{storageService.getRoleLabel(role)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] sm:text-[11px] ${
          isDark ? 'border-sky-800/60 text-sky-300' : 'border-slate-100 text-slate-500'
        }`}>
          <span className="truncate">
            ID: <strong className={`font-mono font-semibold ${isDark ? 'text-sky-200' : 'text-[#123B5D]'}`}>{activeUser.loginId}</strong>
          </span>
          <span className={`font-mono text-[9px] sm:text-[10px] ${isDark ? 'text-sky-400' : 'text-slate-400'}`}>
            {activeUser.departmentName || 'Enterprise'}
          </span>
        </div>
      </div>

      {/* Navigation Sections (Collapsible on Hover & Click) */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5 scrollbar-thin">
        {sections.map((sec, idx) => {
          const isExpanded = isSectionExpanded(idx);
          const SecIcon = sec.icon;
          const hasActiveItem = sec.items.some((it) => it.id === currentView);

          return (
            <div
              key={idx}
              onMouseEnter={() => setHoveredSectionIdx(idx)}
              onMouseLeave={() => setHoveredSectionIdx(null)}
              className={`rounded-2xl transition-all duration-200 border ${
                isDark
                  ? isExpanded
                    ? 'bg-[#123C6A] border-sky-400 shadow-md shadow-sky-950/40'
                    : hasActiveItem
                    ? 'bg-sky-900/30 border-sky-500/50'
                    : 'bg-[#0E2F54] border-sky-500/30 hover:border-sky-400'
                  : isExpanded
                  ? 'bg-slate-50/80 border-slate-200 shadow-2xs'
                  : hasActiveItem
                  ? 'bg-teal-50/30 border-teal-100'
                  : 'bg-white border-transparent hover:border-slate-200'
              }`}
            >
              {/* Function Menu Header (Collapsible toggle button) */}
              <button
                type="button"
                id={`sidebar-function-menu-${sec.functionNumber}`}
                onClick={() => handleToggleSection(idx)}
                className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between transition-all duration-150 cursor-pointer select-none group ${
                  isDark
                    ? isExpanded
                      ? 'text-white font-bold'
                      : 'text-sky-200 hover:text-white font-semibold'
                    : isExpanded
                    ? 'text-slate-950 font-bold'
                    : 'text-slate-600 hover:text-slate-900 font-semibold'
                }`}
                title={`Function ${sec.functionNumber}: ${sec.title} — Hover or click to expand sub menus`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-150 ${
                      isDark
                        ? isExpanded
                          ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-xs'
                          : 'bg-[#0A223E] text-sky-300 border-sky-500/40 group-hover:bg-sky-500/20 group-hover:text-sky-100'
                        : isExpanded
                        ? 'bg-[#123B5D] text-white border-[#123B5D] shadow-2xs'
                        : 'bg-slate-100 text-slate-600 border-slate-200 group-hover:bg-teal-50 group-hover:text-teal-700'
                    }`}
                  >
                    <SecIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[11px] font-bold tracking-wider uppercase font-mono block truncate ${
                      isDark ? 'text-sky-100' : ''
                    }`}>
                      {sec.title}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isDark
                        ? isExpanded
                          ? 'rotate-180 text-sky-300'
                          : 'text-sky-400 group-hover:text-sky-200'
                        : isExpanded
                        ? 'rotate-180 text-teal-700'
                        : 'text-slate-400 group-hover:text-slate-700'
                    }`}
                  />
                </div>
              </button>

              {/* Sub-menus List (Collapsible / Expandable on mouse hover) */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isExpanded ? 'max-h-[900px] opacity-100 pb-2 px-2' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                <nav className={`space-y-1 pt-1 border-t ${isDark ? 'border-sky-500/30' : 'border-slate-100'}`}>
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isAction = item.isAction;
                    const isActive = currentView === item.id;

                    if (isAction) {
                      return (
                        <button
                          key={item.id}
                          id={`sidebar-action-${item.id}`}
                          onClick={() => {
                            if (item.onClickAction) {
                              item.onClickAction();
                            } else if (item.id === 'share_modal_action') {
                              onOpenSharePreRegModal();
                            }
                            if (!isPinned && onClose) onClose();
                          }}
                          className={`group w-full flex items-center justify-between px-2.5 py-2 text-[12px] font-semibold rounded-xl transition-all duration-150 text-left shadow-2xs cursor-pointer ${
                            item.variant === 'danger'
                              ? isDark
                                ? 'bg-red-950/50 hover:bg-red-900/70 text-red-200 border border-red-500/50'
                                : 'bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border border-red-200 active:scale-98'
                              : isDark
                              ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-100 border border-sky-400/50 shadow-xs'
                              : 'bg-gradient-to-r from-teal-50 to-emerald-50/80 text-teal-900 border border-teal-200 hover:bg-teal-100 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon
                              className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                                item.variant === 'danger'
                                  ? isDark ? 'text-red-400' : 'text-red-600'
                                  : isDark ? 'text-sky-300' : 'text-teal-700'
                              }`}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                        </button>
                      );
                    }

                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        onClick={() => {
                          onSelectView(item.id as NavViewId);
                          if (!isPinned && onClose) onClose();
                        }}
                        className={`group w-full flex items-center justify-between px-2.5 py-2 text-[12px] rounded-xl transition-all duration-150 text-left cursor-pointer ${
                          isActive
                            ? isDark
                              ? 'bg-gradient-to-r from-sky-500 to-sky-600 text-slate-950 font-bold shadow-md shadow-sky-500/30 border border-sky-300'
                              : 'bg-gradient-to-r from-[#123B5D] to-[#164871] text-white shadow-xs font-semibold'
                            : isDark
                            ? 'text-sky-200 hover:bg-[#16497F] hover:text-white font-medium'
                            : 'text-slate-700 hover:bg-slate-100/90 hover:text-slate-950 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive
                                ? isDark ? 'text-slate-950' : 'text-teal-300'
                                : isDark ? 'text-sky-400 group-hover:text-sky-200' : 'text-slate-400 group-hover:text-slate-700'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {isActive && (
                          <div className="flex items-center shrink-0">
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 shadow-2xs ${
                              isDark ? 'bg-slate-950' : 'bg-teal-400'
                            }`} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Status Dock: Logout Button in place of RBAC Protected */}
      <div className={`p-3 border-t shrink-0 flex items-center justify-between ${
        isDark ? 'border-sky-500/40 bg-[#0A223E]' : 'border-slate-200 bg-slate-50/90'
      }`}>
        {onLogout ? (
          <button
            type="button"
            id="sidebar-bottom-logout-btn"
            onClick={onLogout}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-150 cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 group ${
              isDark
                ? 'bg-red-950/50 hover:bg-red-900/70 text-red-200 border-red-500/40'
                : 'bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-900 border-red-200'
            }`}
            title="Log out of session"
          >
            <LogOut className={`w-3.5 h-3.5 group-hover:scale-110 transition-transform ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            <span>Logout Session</span>
          </button>
        ) : (
          <div className={`flex items-center gap-1.5 text-[11px] font-semibold ${isDark ? 'text-sky-300' : 'text-slate-500'}`}>
            <LogOut className={`w-3.5 h-3.5 ${isDark ? 'text-sky-400' : 'text-slate-400'}`} />
            <span>Logout</span>
          </div>
        )}
        <div className={`flex items-center gap-1.5 text-[10px] font-mono ${isDark ? 'text-sky-300' : 'text-slate-400'}`}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        </div>
      </div>
    </aside>
  );
};
