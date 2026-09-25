import React, { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  Sliders,
  Plus,
  Shield,
  Key,
  Check,
  AlertCircle,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Palette,
  FileText,
  Clock,
  ShieldCheck,
  Globe,
  Database,
  Search,
  Lock,
  FileSpreadsheet,
  CreditCard,
  ShieldAlert,
  Printer,
  KeyRound,
  Type,
  Eye,
  DoorOpen,
  MapPin,
  ListPlus,
  Layers,
  ArrowUpDown,
  CheckSquare
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { AppUser, Tenant, UserRole, Site, Gate } from '../../types';
import { JSAlphaSoftLogo } from '../common/JSAlphaSoftLogo';
import { AdminControlToolbar } from './AdminControlToolbar';
import { GoogleSheetsConfigTab } from './GoogleSheetsConfigTab';
import { VisitorPassDesignerTab } from './VisitorPassDesignerTab';
import { RoleWorkflowManagementTab } from './RoleWorkflowManagementTab';
import { SaaSLicenseEngineView } from './SaaSLicenseEngineView';
import { CompanyLogoWhitelabelView } from './CompanyLogoWhitelabelView';
import { SuperAdminTypographyThemeCustomizer } from './SuperAdminTypographyThemeCustomizer';
import { RealTimeThemePreviewGallery } from './RealTimeThemePreviewGallery';
import { AdminGlobalSearchFilterBar } from './AdminGlobalSearchFilterBar';
import { SUPPORTED_FONTS } from '../../utils/themeApplier';

export type AdminActiveTab = 'users' | 'tenants' | 'customization' | 'sheets' | 'pass_designer' | 'roles_workflow' | 'saas_license' | 'whitelabel';

interface AdminManagementViewProps {
  initialTab?: AdminActiveTab;
  onOpenSharePreRegModal?: () => void;
  onOpenSettingsModal?: () => void;
  onOpenProfileModal?: () => void;
  onOpenEmergencyModal?: () => void;
  onLogout?: () => void;
  onRoleAutoRender?: (role: UserRole) => void;
  isAutoRenderingEnabled?: boolean;
  onToggleAutoRendering?: () => void;
}

export const AdminManagementView: React.FC<AdminManagementViewProps> = ({
  initialTab = 'users',
  onOpenSharePreRegModal,
  onOpenSettingsModal,
  onOpenProfileModal,
  onOpenEmergencyModal,
  onLogout,
  onRoleAutoRender,
  isAutoRenderingEnabled = true,
  onToggleAutoRendering,
}) => {
  const [activeTab, setActiveTab] = useState<AdminActiveTab>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);
  const state = storageService.getState();
  const activeTenant = storageService.getActiveTenant();
  const activeUser = storageService.getActiveUser();
  const role: UserRole = activeUser?.role || 'RECEPTIONIST';
  const isSuperAdmin = role === 'PLATFORM_SUPER_ADMIN';
  const isTenantAdmin = role === 'TENANT_ADMIN';
  const hasAdminAccess =
    isSuperAdmin ||
    isTenantAdmin ||
    storageService.hasFunctionAccess(activeUser?.id || '', 'user_management');

  // Feedback notifications
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  if (!hasAdminAccess) {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center max-w-lg mx-auto shadow-sm my-12">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Admin Control Center Hub Restricted</h2>
        <p className="text-sm text-slate-600 mb-4">
          The Admin Control Center Hub is restricted to authorized administrative profiles. Your current role is{' '}
          <span className="font-semibold text-slate-800">{role.replace(/_/g, ' ')}</span>.
        </p>
      </div>
    );
  }

  // ----------------------------------------------------
  // TAB 1: User Management State & Handlers
  // ----------------------------------------------------
  const [userSearch, setUserSearch] = useState('');
  const [selectedTenantFilter, setSelectedTenantFilter] = useState<string>('ALL');

  // Add User State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserLoginId, setNewUserLoginId] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('welcome123');
  const [newUserRole, setNewUserRole] = useState<UserRole>('RECEPTIONIST');
  const [newUserDepartment, setNewUserDepartment] = useState('Front Desk Operations');
  const [newUserTenantId, setNewUserTenantId] = useState(activeTenant.id);
  const [newUserMfa, setNewUserMfa] = useState(false);

  // Edit User State
  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserLoginId, setEditUserLoginId] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserPassword, setEditUserPassword] = useState('');
  const [editUserRole, setEditUserRole] = useState<UserRole>('RECEPTIONIST');
  const [editUserDepartment, setEditUserDepartment] = useState('Front Desk Operations');
  const [editUserTenantId, setEditUserTenantId] = useState(activeTenant.id);
  const [editUserStatus, setEditUserStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');
  const [editUserMfa, setEditUserMfa] = useState(false);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorToast(null);

    const targetTenantId = isSuperAdmin ? (newUserTenantId || activeTenant.id) : activeTenant.id;

    const res = storageService.addUser({
      name: newUserName,
      loginId: newUserLoginId,
      email: newUserEmail,
      password: newUserPassword,
      role: newUserRole,
      departmentName: newUserDepartment,
      mfaEnabled: newUserMfa,
      tenantId: targetTenantId,
    });

    if (res.success && res.user) {
      setSuccessToast(`New user account created for ${res.user.name} (Login ID: ${res.user.loginId})`);
      setIsAddUserOpen(false);
      // Reset form
      setNewUserName('');
      setNewUserLoginId('');
      setNewUserEmail('');
      setNewUserPassword('welcome123');
      setNewUserTenantId(activeTenant.id);
      setTimeout(() => setSuccessToast(null), 4000);
    } else {
      setErrorToast(res.error || 'Failed to create user account.');
      setTimeout(() => setErrorToast(null), 4000);
    }
  };

  const handleStartEditUser = (user: AppUser) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserLoginId(user.loginId);
    setEditUserEmail(user.email);
    setEditUserPassword('');
    setEditUserRole(user.role);
    setEditUserDepartment(user.departmentName || 'Front Desk Operations');
    setEditUserTenantId(user.tenantId || activeTenant.id);
    setEditUserStatus(user.status);
    setEditUserMfa(user.mfaEnabled);
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setErrorToast(null);

    const trimmedLoginId = editUserLoginId.trim().toLowerCase();
    const trimmedName = editUserName.trim();
    const trimmedEmail = editUserEmail.trim();

    if (!trimmedLoginId || !trimmedName || !trimmedEmail) {
      setErrorToast('Full Name, Login ID, and Email Address are mandatory.');
      return;
    }

    // Check if another user already has this loginId
    const loginIdConflict = state.users.some(
      (u) => u.id !== editingUser.id && u.loginId.toLowerCase() === trimmedLoginId
    );
    if (loginIdConflict) {
      setErrorToast(`Login ID "${trimmedLoginId}" is already taken by another account. Please choose a unique Login ID.`);
      return;
    }

    const updates: Partial<AppUser> = {
      name: trimmedName,
      loginId: trimmedLoginId,
      email: trimmedEmail,
      role: editUserRole,
      departmentName: editUserDepartment.trim() || 'General Operations',
      tenantId: isSuperAdmin ? editUserTenantId : activeTenant.id,
      status: editUserStatus,
      mfaEnabled: editUserMfa,
    };

    if (editUserPassword.trim()) {
      updates.password = editUserPassword.trim();
    }

    const success = storageService.updateUser(editingUser.id, updates);
    if (success) {
      if (editUserRole !== editingUser.role) {
        storageService.updateUserRole(editingUser.id, editUserRole);
      }
      setSuccessToast(`User credentials for "${trimmedName}" (Login ID: ${trimmedLoginId}) updated successfully.`);
      setEditingUser(null);
      setTimeout(() => setSuccessToast(null), 3500);
    } else {
      setErrorToast('Failed to update user credentials.');
      setTimeout(() => setErrorToast(null), 3500);
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (confirm(`Are you sure you want to delete login access for "${userName}"?`)) {
      const res = storageService.deleteUser(userId);
      if (res.success) {
        setSuccessToast(`User "${userName}" deleted successfully.`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        setErrorToast(res.error || 'Failed to delete user.');
        setTimeout(() => setErrorToast(null), 3000);
      }
    }
  };

  const handleToggleUserStatus = (user: AppUser) => {
    const nextStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    storageService.updateUser(user.id, { status: nextStatus });
    setSuccessToast(`User ${user.name} is now ${nextStatus}.`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // ----------------------------------------------------
  // TAB 2: Tenant Management State & Handlers
  // ----------------------------------------------------
  const [isAddTenantOpen, setIsAddTenantOpen] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantCode, setTenantCode] = useState('');
  const [tenantTier, setTenantTier] = useState<Tenant['tier']>('ENTERPRISE_STANDARD');
  const [tenantPrimaryColor, setTenantPrimaryColor] = useState('#123B5D');
  const [tenantInitialSite, setTenantInitialSite] = useState('');
  const [tenantInitialAddress, setTenantInitialAddress] = useState('');

  const handleCreateTenant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantName.trim() || !tenantCode.trim()) {
      setErrorToast('Please specify tenant name and alphanumeric code.');
      return;
    }

    const newTen = storageService.addTenant({
      name: tenantName,
      code: tenantCode,
      tier: tenantTier,
      primaryColor: tenantPrimaryColor,
      initialSiteName: tenantInitialSite || `${tenantName} Tech Center`,
      initialSiteAddress: tenantInitialAddress || 'Bangalore Tech Park, Karnataka',
    });

    setSuccessToast(`Enterprise Tenant "${newTen.name}" (${newTen.code}) provisioned with initial site!`);
    setIsAddTenantOpen(false);
    setTenantName('');
    setTenantCode('');
    setTenantInitialSite('');
    setTenantInitialAddress('');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // ----------------------------------------------------
  // PHYSICAL SITES & ENTRY LOCATIONS (GATES) STATE & HANDLERS
  // ----------------------------------------------------
  const [gateSearch, setGateSearch] = useState('');
  const [gateSiteFilter, setGateSiteFilter] = useState('ALL');
  const [gateTypeFilter, setGateTypeFilter] = useState('ALL');

  // Modal: Add Single Physical Location / Campus
  const [isAddSiteOpen, setIsAddSiteOpen] = useState(false);
  const [newSiteName, setNewSiteName] = useState('');
  const [newSiteCode, setNewSiteCode] = useState('');
  const [newSiteAddress, setNewSiteAddress] = useState('');
  const [newSiteTimezone, setNewSiteTimezone] = useState('Asia/Kolkata');
  const [newSitePolicy, setNewSitePolicy] = useState('Government photo ID (Aadhaar/PAN/Passport) required for visitor entry.');

  // Modal: Add Single Entry Location
  const [isAddSingleGateOpen, setIsAddSingleGateOpen] = useState(false);
  const [singleGateSiteId, setSingleGateSiteId] = useState('');
  const [singleGateName, setSingleGateName] = useState('');
  const [singleGateCode, setSingleGateCode] = useState('');
  const [singleGateType, setSingleGateType] = useState<Gate['type']>('BIDIRECTIONAL');
  const [singleGateStatus, setSingleGateStatus] = useState<Gate['operatingStatus']>('OPEN');

  // Modal: Add Multiple Entry Locations (with physical location name)
  const [isAddMultipleGatesOpen, setIsAddMultipleGatesOpen] = useState(false);
  const [multiGatePhysicalMode, setMultiGatePhysicalMode] = useState<'EXISTING' | 'NEW'>('EXISTING');
  const [multiGateSiteId, setMultiGateSiteId] = useState('');
  const [multiGateNewPhysicalName, setMultiGateNewPhysicalName] = useState('');
  const [multiGateNewPhysicalAddress, setMultiGateNewPhysicalAddress] = useState('');
  const [multiGateRows, setMultiGateRows] = useState<
    Array<{
      name: string;
      code: string;
      type: Gate['type'];
      operatingStatus: Gate['operatingStatus'];
    }>
  >([
    { name: 'Main North Turnstiles (Gate 1)', code: 'GT-01', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
    { name: 'Visitor Center Checkpoint (Gate 2)', code: 'GT-02', type: 'ENTRY_ONLY', operatingStatus: 'OPEN' },
    { name: 'East Employee Turnstiles (Gate 3)', code: 'GT-03', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
    { name: 'South Freight & Contractor Bay (Gate 4)', code: 'GT-04', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
  ]);

  // Modal: Edit Entry Location
  const [editingGate, setEditingGate] = useState<Gate | null>(null);
  const [editGateName, setEditGateName] = useState('');
  const [editGateCode, setEditGateCode] = useState('');
  const [editGateSiteId, setEditGateSiteId] = useState('');
  const [editGateType, setEditGateType] = useState<Gate['type']>('BIDIRECTIONAL');
  const [editGateStatus, setEditGateStatus] = useState<Gate['operatingStatus']>('OPEN');

  const handleCreateSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSiteName.trim()) {
      setErrorToast('Please specify the physical location / campus name.');
      return;
    }
    const cleanCode = (newSiteCode || newSiteName.slice(0, 4)).toUpperCase().replace(/[^A-Z0-9-]/g, '');
    const site = storageService.addSite({
      tenantId: activeTenant.id,
      name: newSiteName.trim(),
      code: cleanCode,
      address: newSiteAddress.trim() || 'Enterprise Campus Facility',
      timezone: newSiteTimezone,
      visitorPolicy: newSitePolicy.trim(),
    });
    setSuccessToast(`Physical facility "${site.name}" (${site.code}) registered successfully!`);
    setIsAddSiteOpen(false);
    setNewSiteName('');
    setNewSiteCode('');
    setNewSiteAddress('');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleCreateSingleGate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetSiteId = singleGateSiteId || state.sites.find((s) => s.tenantId === activeTenant.id)?.id;
    if (!targetSiteId) {
      setErrorToast('Please select or create a physical facility location first.');
      return;
    }
    if (!singleGateName.trim()) {
      setErrorToast('Please enter an entry location name.');
      return;
    }
    const gate = storageService.addGate({
      siteId: targetSiteId,
      name: singleGateName.trim(),
      code: singleGateCode.trim() || undefined,
      type: singleGateType,
      operatingStatus: singleGateStatus,
    });
    setSuccessToast(`Entry location "${gate.name}" (${gate.code}) configured successfully!`);
    setIsAddSingleGateOpen(false);
    setSingleGateName('');
    setSingleGateCode('');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleCreateMultipleGates = (e: React.FormEvent) => {
    e.preventDefault();
    let targetSiteId = multiGateSiteId;
    let targetSiteName = '';

    if (multiGatePhysicalMode === 'NEW') {
      if (!multiGateNewPhysicalName.trim()) {
        setErrorToast('Please enter the physical location / campus name.');
        return;
      }
      const newSite = storageService.addSite({
        tenantId: activeTenant.id,
        name: multiGateNewPhysicalName.trim(),
        address: multiGateNewPhysicalAddress.trim() || 'Enterprise Physical Facility',
      });
      targetSiteId = newSite.id;
      targetSiteName = newSite.name;
    } else {
      const tenantSites = state.sites.filter((s) => s.tenantId === activeTenant.id);
      if (!targetSiteId) {
        if (tenantSites.length > 0) {
          targetSiteId = tenantSites[0].id;
          targetSiteName = tenantSites[0].name;
        } else {
          setErrorToast('No physical location found. Please select "New Physical Location" to create one.');
          return;
        }
      } else {
        const found = tenantSites.find((s) => s.id === targetSiteId);
        targetSiteName = found ? found.name : 'Selected Facility';
      }
    }

    const validRows = multiGateRows.filter((r) => r.name.trim() !== '');
    if (validRows.length === 0) {
      setErrorToast('Please provide at least one valid entry location name.');
      return;
    }

    const created = storageService.addMultipleGates(targetSiteId, validRows);
    setSuccessToast(
      `Successfully added ${created.length} entry locations for physical location "${targetSiteName}"!`
    );
    setIsAddMultipleGatesOpen(false);
    setMultiGateNewPhysicalName('');
    setMultiGateNewPhysicalAddress('');
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleStartEditGate = (gate: Gate) => {
    setEditingGate(gate);
    setEditGateName(gate.name);
    setEditGateCode(gate.code);
    setEditGateSiteId(gate.siteId);
    setEditGateType(gate.type);
    setEditGateStatus(gate.operatingStatus);
  };

  const handleSaveEditGate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGate) return;
    if (!editGateName.trim()) {
      setErrorToast('Entry location name cannot be empty.');
      return;
    }
    storageService.updateGate(editingGate.id, {
      name: editGateName.trim(),
      code: editGateCode.trim(),
      siteId: editGateSiteId,
      type: editGateType,
      operatingStatus: editGateStatus,
    });
    setSuccessToast(`Entry location "${editGateName}" updated successfully.`);
    setEditingGate(null);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleDeleteGate = (gate: Gate) => {
    if (confirm(`Are you sure you want to delete entry location "${gate.name}" (${gate.code})?`)) {
      storageService.deleteGate(gate.id);
      setSuccessToast(`Entry location "${gate.name}" deleted.`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleToggleGateStatus = (gate: Gate) => {
    const nextStatus: Gate['operatingStatus'] =
      gate.operatingStatus === 'OPEN'
        ? 'RESTRICTED'
        : gate.operatingStatus === 'RESTRICTED'
        ? 'OFFLINE'
        : 'OPEN';
    storageService.updateGate(gate.id, { operatingStatus: nextStatus });
    setSuccessToast(`Entry location "${gate.name}" status set to ${nextStatus}.`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  // ----------------------------------------------------
  // TAB 3: Customization State & Handlers
  // ----------------------------------------------------
  const [brandOrgName, setBrandOrgName] = useState(activeTenant.name);
  const [brandColor, setBrandColor] = useState(activeTenant.branding.primaryColor || '#123B5D');
  const [brandLogoText, setBrandLogoText] = useState(activeTenant.branding.logoText || activeTenant.name);
  const [ndaTerms, setNdaTerms] = useState(
    'Visitors agree to maintain strict confidentiality regarding all proprietary materials, technical specifications, and facility operations observed during the visit.'
  );
  const [wifiAccessCode, setWifiAccessCode] = useState('JS-GUEST-SECURE-2026');
  const [adminFontFamily, setAdminFontFamily] = useState<string>(
    () => storageService.getWhitelabelBranding().fontFamily || 'Plus Jakarta Sans'
  );
  const [customizationSubTab, setCustomizationSubTab] = useState<'theme' | 'policies'>('theme');

  const handleSaveCustomization = () => {
    storageService.updateTenantBranding(activeTenant.id, {
      primaryColor: brandColor,
      logoText: brandLogoText,
    });
    storageService.updateTenant(activeTenant.id, {
      name: brandOrgName,
    });
    storageService.updateWhitelabelBranding({
      fontFamily: adminFontFamily,
      primaryColor: brandColor,
      foreColor: brandColor,
    });
    setSuccessToast(`Tenant branding (Font: ${adminFontFamily}, Color: ${brandColor}) and visitor policy saved successfully!`);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Filtered users for table with Multi-Tenant Isolation
  const filteredUsers = state.users.filter((u) => {
    // Multi-tenant isolation:
    // In Tenant Admin, ONLY respective user details are visible who are registered under selected active tenant.
    if (!isSuperAdmin) {
      if (u.tenantId !== activeTenant.id) return false;
    } else {
      // Under Super Admin, user details can be filtered based on tenant.
      if (selectedTenantFilter !== 'ALL' && u.tenantId !== selectedTenantFilter) return false;
    }

    const q = userSearch.toLowerCase();
    const matchesSearch =
      !userSearch ||
      u.name.toLowerCase().includes(q) ||
      u.loginId.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.departmentName && u.departmentName.toLowerCase().includes(q));

    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert Banners */}
      {successToast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2 animate-fadeIn shadow-xs">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-semibold">{errorToast}</span>
        </div>
      )}

      {/* Multi-Tenant Context & Operational Control Toolbar (Above Administration Center) */}
      <AdminControlToolbar
        onOpenSharePreRegModal={onOpenSharePreRegModal}
        onOpenSettingsModal={onOpenSettingsModal}
        onOpenProfileModal={onOpenProfileModal}
        onOpenEmergencyModal={onOpenEmergencyModal}
        onLogout={onLogout}
        onRoleAutoRender={onRoleAutoRender}
        isAutoRenderingEnabled={isAutoRenderingEnabled}
        onToggleAutoRendering={onToggleAutoRendering}
      />

      {/* Active Enterprise Tenant Selector & Isolation Context */}
      <div className="bg-gradient-to-r from-[#123B5D] via-[#10324f] to-[#0F766E] rounded-2xl p-4 sm:p-5 text-white shadow-md border border-[#1b4b75] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-teal-300 shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-teal-400/20 text-teal-200 border border-teal-400/30 font-bold">
                Active Enterprise Tenant
              </span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-xs font-semibold text-teal-100">
                Tier: <strong className="text-white">{activeTenant.tier.replace(/_/g, ' ')}</strong>
              </span>
              <span className="text-xs text-white/50">•</span>
              <span className="text-[11px] font-mono text-emerald-300 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Shard: {activeTenant.databaseRef || 'tenant_db_primary'} (HEALTHY)
              </span>
            </div>
            <h2 className="text-[15px] leading-[27px] font-black tracking-tight text-[#04ffb9] mt-1">
              {activeTenant.name} <span className="font-mono text-sm text-teal-300 font-normal">[{activeTenant.code}]</span>
            </h2>
            <p className="text-xs text-slate-300">
              Facility Scope: {state.sites.filter((s) => s.tenantId === activeTenant.id).length} Campus Sites •{' '}
              {
                state.gates.filter((g) =>
                  state.sites
                    .filter((s) => s.tenantId === activeTenant.id)
                    .map((s) => s.id)
                    .includes(g.siteId)
                ).length
              }{' '}
              Turnstile Gates • Timezone: {activeTenant.timezone || 'Asia/Kolkata'}
            </p>
          </div>
        </div>

        {isSuperAdmin ? (
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 bg-black/25 p-2 rounded-xl border border-white/15">
            <label htmlFor="admin-enterprise-tenant-switcher" className="text-xs font-bold text-teal-200 whitespace-nowrap pl-1">
              Select Active Tenant:
            </label>
            <select
              id="admin-enterprise-tenant-switcher"
              value={activeTenant.id}
              onChange={(e) => {
                const newId = e.target.value;
                const tenant = state.tenants.find((t) => t.id === newId);
                storageService.setActiveContext({ tenantId: newId });
                if (tenant) {
                  setSuccessToast(`Active Enterprise Tenant switched to: ${tenant.name} (${tenant.code})`);
                  setTimeout(() => setSuccessToast(null), 3500);
                }
              }}
              className="bg-[#0b2438] text-white font-semibold text-xs border border-teal-500/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer max-w-full"
            >
              {state.tenants.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#123B5D] text-white">
                  {t.name} ({t.code}) — {t.tier.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/25 border border-white/15 text-xs text-teal-200 font-semibold shrink-0">
            <Building2 className="w-3.5 h-3.5 text-teal-300" />
            <span>Active Tenant: <strong className="text-white">{activeTenant.name} [{activeTenant.code}]</strong></span>
          </div>
        )}
      </div>

      {/* Admin Module Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="w-full">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#123B5D]/10 text-[#123B5D] text-[11px] font-bold uppercase tracking-wider whitespace-nowrap">
              Administration Center Hub
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-600 font-medium whitespace-nowrap flex items-center gap-1">
              Enterprise Tenant Context: <strong className="text-[#172B3A] font-bold">{activeTenant.name}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#172B3A] mt-2 tracking-tight">
            Tenant Management, System Customization & Security Workflow Governance
          </h1>
          <p className="text-xs sm:text-sm text-[#526575] mt-1 max-w-3xl leading-relaxed">
            Configure multi-tenant isolation, role permission matrices, physical pass formats, and corporate credentials.
          </p>
        </div>

        {/* Tab Switcher - Full-width dedicated strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center overflow-x-auto gap-1.5 bg-[#F4F7FA] p-1.5 rounded-xl border border-slate-200">
          <button
            id="admin-tab-users"
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'users'
                ? 'bg-white text-[#123B5D] shadow-xs'
                : 'text-[#526575] hover:text-[#172B3A]'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>
              User Accounts (
              {isSuperAdmin
                ? selectedTenantFilter === 'ALL'
                  ? state.users.length
                  : filteredUsers.length
                : state.users.filter((u) => u.tenantId === activeTenant.id).length}
              )
            </span>
          </button>

          {/* Pass Format & Thermal Label Customiser — Visible ONLY under Super Admin role */}
          {isSuperAdmin && (
            <button
              id="admin-tab-pass-designer"
              onClick={() => setActiveTab('pass_designer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'pass_designer'
                  ? 'bg-white text-purple-900 border border-purple-200 shadow-xs'
                  : 'text-[#526575] hover:text-purple-900'
              }`}
            >
              <Printer className="w-3.5 h-3.5 text-purple-600" />
              <span>Pass & Thermal Customiser</span>
              <span className="px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 text-[9px] font-black uppercase tracking-wider ml-0.5">
                Super Admin
              </span>
            </button>
          )}

          <button
            id="admin-tab-roles-workflow"
            onClick={() => setActiveTab('roles_workflow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'roles_workflow'
                ? 'bg-white text-indigo-800 shadow-xs'
                : 'text-[#526575] hover:text-[#172B3A]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
            <span>Roles & Role Names (RBAC)</span>
          </button>
          {(isSuperAdmin || activeRole === 'TENANT_ADMIN' || storageService.hasFunctionAccess(activeUser?.id || '', 'whitelabel')) && (
            <button
              id="admin-tab-whitelabel"
              onClick={() => setActiveTab('whitelabel')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'whitelabel'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-[#526575] hover:text-[#172B3A]'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-teal-600" />
              <span>{isSuperAdmin ? 'Tenant White-Labeling Engine' : 'Tenant White-Labeling'}</span>
              <span className="px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 text-[9px] font-black uppercase tracking-wider ml-0.5">
                {isSuperAdmin ? 'Super Admin' : activeTenant.code}
              </span>
            </button>
          )}
          {isSuperAdmin && (
            <button
              id="admin-tab-saas-license"
              onClick={() => setActiveTab('saas_license')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                activeTab === 'saas_license'
                  ? 'bg-white text-amber-900 shadow-xs'
                  : 'text-[#526575] hover:text-[#172B3A]'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>SaaS License Engine</span>
              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 text-[9px] font-black uppercase tracking-wider ml-0.5">
                Super Admin
              </span>
            </button>
          )}
          <button
            id="admin-tab-tenants"
            onClick={() => setActiveTab('tenants')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'tenants'
                ? 'bg-white text-[#123B5D] shadow-xs'
                : 'text-[#526575] hover:text-[#172B3A]'
            }`}
          >
            {isSuperAdmin ? (
              <>
                <Building2 className="w-3.5 h-3.5 text-teal-600" />
                <span>Tenants & Physical Facilities ({state.tenants.length})</span>
              </>
            ) : (
              <>
                <DoorOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>
                  Entry Locations & Physical Facilities (
                  {
                    state.gates.filter((g) =>
                      state.sites
                        .filter((s) => s.tenantId === activeTenant.id)
                        .map((s) => s.id)
                        .includes(g.siteId)
                    ).length
                  }
                  )
                </span>
              </>
            )}
          </button>
          <button
            id="admin-tab-customization"
            onClick={() => setActiveTab('customization')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'customization'
                ? 'bg-white text-[#123B5D] shadow-xs'
                : 'text-[#526575] hover:text-[#172B3A]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customization</span>
          </button>
          <button
            id="admin-tab-google-sheets"
            onClick={() => setActiveTab('sheets')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'sheets'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-[#526575] hover:text-[#172B3A]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Google Sheet Sync</span>
          </button>
        </div>
      </div>

      {/* Global Administrative Search & Filter Hub */}
      <AdminGlobalSearchFilterBar
        onNavigateToTab={(tab) => setActiveTab(tab)}
        onFilterUsersTab={(query) => {
          setActiveTab('users');
          setUserSearch(query);
        }}
        onNotifySuccess={(msg) => {
          setSuccessToast(msg);
          setTimeout(() => setSuccessToast(null), 3500);
        }}
      />

      {/* ========================================================================= */}
      {/* TAB 1: User Login ID Creation & User Management */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Controls bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search user, Login ID, role, email..."
                  className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              {/* Super Admin Tenant Filter Dropdown */}
              {isSuperAdmin ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Filter by Tenant:</span>
                  </span>
                  <select
                    id="superadmin-tenant-user-filter-select"
                    value={selectedTenantFilter}
                    onChange={(e) => setSelectedTenantFilter(e.target.value)}
                    className="px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-bold text-[#123B5D] focus:outline-none focus:border-[#123B5D] cursor-pointer shadow-2xs"
                  >
                    <option value="ALL">🏢 All Tenants ({state.users.length} Users)</option>
                    {state.tenants.map((t) => {
                      const count = state.users.filter((u) => u.tenantId === t.id).length;
                      return (
                        <option key={t.id} value={t.id}>
                          🏢 {t.name} ({count} {count === 1 ? 'user' : 'users'})
                        </option>
                      );
                    })}
                  </select>
                  {selectedTenantFilter !== 'ALL' && (
                    <button
                      type="button"
                      onClick={() => setSelectedTenantFilter('ALL')}
                      className="text-[11px] text-teal-700 hover:underline font-bold whitespace-nowrap cursor-pointer"
                    >
                      Reset Filter
                    </button>
                  )}
                </div>
              ) : (
                /* Tenant Admin Scoped Badge */
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                  <span>Tenant Scope: <strong>{activeTenant.name}</strong></span>
                  <span className="text-[10px] text-teal-700 bg-white px-1.5 py-0.2 rounded font-mono border border-teal-200">
                    {filteredUsers.length} Users Registered
                  </span>
                </div>
              )}
            </div>

            <button
              id="open-add-user-modal-btn"
              onClick={() => {
                setNewUserTenantId(activeTenant.id);
                setIsAddUserOpen(true);
              }}
              className="px-4 py-2 bg-[#123B5D] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create New User Login ID</span>
            </button>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8FAFC] text-[#526575] border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">User Details</th>
                    <th className="py-3 px-4">Login ID</th>
                    <th className="py-3 px-4">Tenant Scope</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Login</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[#172B3A]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <div className="text-xs font-semibold text-slate-600">No user credentials found</div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {isSuperAdmin && selectedTenantFilter !== 'ALL'
                            ? 'No users registered under the selected tenant. Try resetting the tenant filter or creating a new login ID.'
                            : 'No user accounts match your search filters.'}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const tenant = state.tenants.find((t) => t.id === user.tenantId);
                      const isUserInActiveTenant = user.tenantId === activeTenant.id;

                      return (
                        <tr key={user.id} className="hover:bg-slate-50/80 transition">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#123B5D]/10 text-[#123B5D] font-bold flex items-center justify-center text-xs shrink-0">
                                {user.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-[#172B3A] flex items-center gap-1.5">
                                  <span>{user.name}</span>
                                  {user.mfaEnabled && (
                                    <span className="text-[9px] px-1 py-0.2 rounded bg-teal-100 text-teal-800 font-semibold">
                                      MFA
                                    </span>
                                  )}
                                </div>
                                <div className="text-[11px] text-[#526575] font-mono">{user.email}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[#123B5D] border border-slate-200">
                              {user.loginId}
                            </span>
                          </td>

                          {/* Tenant Scope Column */}
                          <td className="py-3.5 px-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-xs text-[#123B5D] flex items-center gap-1">
                                <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate max-w-[140px]">{tenant ? tenant.name : 'Platform System'}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                <span>{tenant ? tenant.code : 'ROOT'}</span>
                                {isUserInActiveTenant && (
                                  <span className="text-[9px] text-teal-700 bg-teal-50 px-1 rounded font-bold border border-teal-200">
                                    Active
                                  </span>
                                )}
                              </span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                user.role === 'RECEPTIONIST'
                                  ? 'bg-teal-100 text-teal-800'
                                  : user.role === 'TENANT_ADMIN' || user.role === 'PLATFORM_SUPER_ADMIN'
                                  ? 'bg-purple-100 text-purple-800'
                                  : user.role === 'SECURITY_GUARD'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {storageService.getRoleLabel(user.role)}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-[#526575]">{user.departmentName}</td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleUserStatus(user)}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition cursor-pointer ${
                                user.status === 'ACTIVE'
                                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                              }`}
                            >
                              {user.status}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-[#526575] font-mono text-[11px]">
                            {user.lastLoginAt.includes('T')
                              ? new Date(user.lastLoginAt).toLocaleTimeString('en-IN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : user.lastLoginAt}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Edit User Button */}
                              <button
                                id={`edit-user-btn-${user.id}`}
                                onClick={() => handleStartEditUser(user)}
                                title={`Edit user login ID & credentials for ${user.name}`}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {/* Delete User Button */}
                              <button
                                id={`delete-user-btn-${user.id}`}
                                onClick={() => handleDeleteUser(user.id, user.name)}
                                title={`Delete user credentials for ${user.name}`}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: Multi-Tenant Addition & Governance & Physical Entry Locations */}
      {/* ========================================================================= */}
      {activeTab === 'tenants' && (() => {
        const sitesForActiveTenant = state.sites.filter((s) => s.tenantId === activeTenant.id);
        const siteIdsForActiveTenant = sitesForActiveTenant.map((s) => s.id);
        const allGatesForActiveTenant = state.gates.filter((g) => siteIdsForActiveTenant.includes(g.siteId));

        const filteredGates = allGatesForActiveTenant.filter((g) => {
          if (gateSiteFilter !== 'ALL' && g.siteId !== gateSiteFilter) return false;
          if (gateTypeFilter !== 'ALL' && g.type !== gateTypeFilter) return false;
          if (gateSearch.trim()) {
            const q = gateSearch.toLowerCase().trim();
            const site = state.sites.find((s) => s.id === g.siteId);
            const matchName = g.name.toLowerCase().includes(q);
            const matchCode = g.code.toLowerCase().includes(q);
            const matchSite = site ? site.name.toLowerCase().includes(q) : false;
            return matchName || matchCode || matchSite;
          }
          return true;
        });

        const openGatesCount = allGatesForActiveTenant.filter((g) => g.operatingStatus === 'OPEN').length;
        const restrictedGatesCount = allGatesForActiveTenant.filter((g) => g.operatingStatus === 'RESTRICTED').length;
        const offlineGatesCount = allGatesForActiveTenant.filter((g) => g.operatingStatus === 'OFFLINE' || g.operatingStatus === 'EMERGENCY_LOCKDOWN').length;

        return (
          <div className="space-y-6">
            {/* SUPER ADMIN ONLY: Multi-Tenant Registry Grid (Hidden under Tenant Admin!) */}
            {isSuperAdmin && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-[#172B3A] flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      <span>Enterprise Tenant Registry</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold uppercase">
                        Super Admin
                      </span>
                    </h2>
                    <p className="text-xs text-[#526575]">
                      Isolated multi-tenant partitions with dedicated schema boundaries and compliance policies.
                    </p>
                  </div>
                  <button
                    id="open-add-tenant-modal-btn"
                    onClick={() => setIsAddTenantOpen(true)}
                    className="px-4 py-2 bg-[#123B5D] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Enterprise Tenant</span>
                  </button>
                </div>

                {/* Tenants Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {state.tenants.map((t) => {
                    const sitesForTenant = state.sites.filter((s) => s.tenantId === t.id);
                    const isCurrent = t.id === activeTenant.id;

                    return (
                      <div
                        key={t.id}
                        className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between transition ${
                          isCurrent ? 'border-[#123B5D] ring-2 ring-[#123B5D]/10' : 'border-slate-200'
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                                style={{ backgroundColor: t.branding.primaryColor || '#123B5D' }}
                              >
                                {t.code.slice(0, 2)}
                              </div>
                              <div>
                                <div className="font-bold text-xs text-[#172B3A]">{t.name}</div>
                                <div className="text-[10px] text-[#526575] font-mono">{t.code}</div>
                              </div>
                            </div>
                            {isCurrent ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                Active Context
                              </span>
                            ) : (
                              <button
                                onClick={() => storageService.setActiveContext({ tenantId: t.id })}
                                className="text-[10px] font-bold text-[#123B5D] hover:underline cursor-pointer"
                              >
                                Switch To
                              </button>
                            )}
                          </div>

                          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] space-y-1">
                            <div className="flex items-center justify-between text-slate-500">
                              <span>Tier:</span>
                              <span className="font-bold text-[#172B3A]">{t.tier.replace(/_/g, ' ')}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-500">
                              <span>Managed Sites:</span>
                              <span className="font-bold text-[#172B3A]">{sitesForTenant.length} campuses</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-500">
                              <span>Database Health:</span>
                              <span className="font-bold text-emerald-600">{t.databaseHealth}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Retain: {t.retentionDays} days</span>
                          <span className="font-mono text-[10px]">{t.id}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DEDICATED PHYSICAL LOCATIONS & ENTRY LOCATIONS INTERFACE */}
            {/* Fully accessible by Tenant Admin (other tenants completely hidden) and Super Admin */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
              {/* Header & Action Buttons */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 font-bold text-[11px] flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-teal-600" />
                      <span>Tenant Scope: {activeTenant.name} [{activeTenant.code}]</span>
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 font-medium">Physical Infrastructure & Security Perimeter</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-[#172B3A] mt-1.5 flex items-center gap-2">
                    <DoorOpen className="w-5 h-5 text-teal-600" />
                    <span>Physical Locations & Entry Gates Management</span>
                  </h2>
                  <p className="text-xs text-[#526575] mt-0.5">
                    Register physical campuses and configure turnstile gates, access checkpoints, and entry lanes for {activeTenant.name}.
                  </p>
                </div>

                <div className="flex items-center flex-wrap gap-2.5 shrink-0">
                  {/* Primary CTA: Add Multiple Entry Locations */}
                  <button
                    id="add-multiple-gates-btn"
                    onClick={() => {
                      if (sitesForActiveTenant.length > 0) {
                        setMultiGateSiteId(sitesForActiveTenant[0].id);
                        setMultiGatePhysicalMode('EXISTING');
                      } else {
                        setMultiGatePhysicalMode('NEW');
                      }
                      setIsAddMultipleGatesOpen(true);
                    }}
                    className="px-4 py-2 bg-[#123B5D] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer group"
                    title="Add multiple entry gates at once with physical location name"
                  >
                    <ListPlus className="w-4 h-4 text-teal-300 group-hover:scale-110 transition-transform" />
                    <span>Add Multiple Entry Locations</span>
                  </button>

                  {/* Add Single Gate */}
                  <button
                    id="add-single-gate-btn"
                    onClick={() => {
                      setSingleGateSiteId(sitesForActiveTenant[0]?.id || '');
                      setIsAddSingleGateOpen(true);
                    }}
                    className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500" />
                    <span>Add Entry Gate</span>
                  </button>

                  {/* Add Physical Campus Location */}
                  <button
                    id="add-physical-site-btn"
                    onClick={() => setIsAddSiteOpen(true)}
                    className="px-3.5 py-2 bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <MapPin className="w-3.5 h-3.5 text-teal-700" />
                    <span>Add Physical Campus Location</span>
                  </button>
                </div>
              </div>

              {/* KPI Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Total Entry Locations</span>
                    <DoorOpen className="w-4 h-4 text-teal-600" />
                  </div>
                  <div className="text-xl font-black text-[#172B3A]">{allGatesForActiveTenant.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {openGatesCount} Open • {restrictedGatesCount} Restricted • {offlineGatesCount} Offline
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Physical Locations</span>
                    <MapPin className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="text-xl font-black text-[#172B3A]">{sitesForActiveTenant.length}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Enterprise Campuses & Facilities
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Bidirectional Gates</span>
                    <ArrowUpDown className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-black text-[#172B3A]">
                    {allGatesForActiveTenant.filter((g) => g.type === 'BIDIRECTIONAL').length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">In/Out Turnstiles</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between text-slate-500 mb-1">
                    <span className="text-[11px] font-semibold">Turnstiles Operating</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-xl font-black text-emerald-600">
                    {openGatesCount} / {allGatesForActiveTenant.length}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Ready for Check-in</div>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1">
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={gateSearch}
                      onChange={(e) => setGateSearch(e.target.value)}
                      placeholder="Search entry gate, code, physical location..."
                      className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D]"
                    />
                  </div>

                  {/* Filter by Physical Location */}
                  <select
                    value={gateSiteFilter}
                    onChange={(e) => setGateSiteFilter(e.target.value)}
                    className="px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-semibold text-[#123B5D] focus:outline-none focus:border-[#123B5D] cursor-pointer"
                  >
                    <option value="ALL">🏢 All Physical Locations ({sitesForActiveTenant.length})</option>
                    {sitesForActiveTenant.map((s) => (
                      <option key={s.id} value={s.id}>
                        📍 {s.name} ({s.code})
                      </option>
                    ))}
                  </select>

                  {/* Filter by Gate Direction Type */}
                  <select
                    value={gateTypeFilter}
                    onChange={(e) => setGateTypeFilter(e.target.value)}
                    className="px-3 py-2 bg-[#F8FAFC] border border-slate-200 rounded-xl text-xs font-semibold text-[#123B5D] focus:outline-none focus:border-[#123B5D] cursor-pointer"
                  >
                    <option value="ALL">All Directions</option>
                    <option value="BIDIRECTIONAL">Bidirectional (Entry & Exit)</option>
                    <option value="ENTRY_ONLY">Entry Only</option>
                    <option value="EXIT_ONLY">Exit Only</option>
                  </select>
                </div>
              </div>

              {/* Entry Locations Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F8FAFC] text-[#526575] font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Entry Location Name</th>
                      <th className="py-3 px-4">Physical Location / Campus</th>
                      <th className="py-3 px-4">Gate Code</th>
                      <th className="py-3 px-4">Direction Type</th>
                      <th className="py-3 px-4">Operating Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[#172B3A]">
                    {filteredGates.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-10 text-center text-slate-400">
                          <DoorOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <div className="text-xs font-bold text-slate-600">No Entry Locations Found</div>
                          <div className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
                            {gateSearch
                              ? 'No entry gates match your search query.'
                              : 'This tenant currently has no entry turnstiles configured. Use the button below to add multiple entry locations.'}
                          </div>
                          <button
                            onClick={() => {
                              if (sitesForActiveTenant.length > 0) {
                                setMultiGateSiteId(sitesForActiveTenant[0].id);
                                setMultiGatePhysicalMode('EXISTING');
                              } else {
                                setMultiGatePhysicalMode('NEW');
                              }
                              setIsAddMultipleGatesOpen(true);
                            }}
                            className="mt-3 px-4 py-2 bg-[#123B5D] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <ListPlus className="w-3.5 h-3.5" />
                            <span>Add Multiple Entry Locations</span>
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredGates.map((gate) => {
                        const site = state.sites.find((s) => s.id === gate.siteId);

                        return (
                          <tr key={gate.id} className="hover:bg-slate-50/80 transition">
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center shrink-0">
                                  <DoorOpen className="w-4 h-4" />
                                </div>
                                <div>
                                  <div className="font-bold text-[#172B3A]">{gate.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                    <span>Printer: {gate.assignedPrinterId || 'dev-printer-01'}</span>
                                    <span>•</span>
                                    <span>Terminal: {gate.assignedTerminalId || 'dev-term-01'}</span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#123B5D] flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate max-w-[200px]">{site ? site.name : 'Unknown Campus'}</span>
                                </span>
                                <span className="text-[10px] text-slate-400 truncate max-w-[220px]">
                                  {site ? site.address : 'Physical Location'}
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-[#123B5D] border border-slate-200">
                                {gate.code}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                  gate.type === 'BIDIRECTIONAL'
                                    ? 'bg-blue-100 text-blue-800'
                                    : gate.type === 'ENTRY_ONLY'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {gate.type.replace(/_/g, ' ')}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <button
                                onClick={() => handleToggleGateStatus(gate)}
                                title="Click to cycle status: OPEN -> RESTRICTED -> OFFLINE"
                                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition cursor-pointer flex items-center gap-1 w-fit ${
                                  gate.operatingStatus === 'OPEN'
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : gate.operatingStatus === 'RESTRICTED'
                                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    gate.operatingStatus === 'OPEN'
                                      ? 'bg-emerald-600'
                                      : gate.operatingStatus === 'RESTRICTED'
                                      ? 'bg-amber-600'
                                      : 'bg-red-600'
                                  }`}
                                />
                                <span>{gate.operatingStatus}</span>
                              </button>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleStartEditGate(gate)}
                                  title={`Edit entry location ${gate.name}`}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteGate(gate)}
                                  title={`Delete entry location ${gate.name}`}
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Physical Campus Locations Breakdown */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-[#172B3A] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Physical Campus Locations Registered ({sitesForActiveTenant.length})</span>
                  </h3>
                  <button
                    onClick={() => setIsAddSiteOpen(true)}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add New Physical Campus</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {sitesForActiveTenant.map((site) => {
                    const gatesCount = state.gates.filter((g) => g.siteId === site.id).length;

                    return (
                      <div
                        key={site.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-[#172B3A] flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-teal-600" />
                              <span>{site.name}</span>
                            </span>
                            <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                              {site.code}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                            <span>{site.address}</span>
                          </p>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                          <span className="text-slate-600 font-medium">
                            <strong className="text-[#123B5D]">{gatesCount}</strong> configured entry gates
                          </span>
                          <button
                            onClick={() => {
                              setSingleGateSiteId(site.id);
                              setIsAddSingleGateOpen(true);
                            }}
                            className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Gate</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* TAB 3: System Customization & Branding */}
      {/* ========================================================================= */}
      {activeTab === 'customization' && (
        <div className="space-y-6">
          {/* Sub Navigation Strip */}
          <div className="flex items-center gap-2 bg-[#F4F7FA] p-1.5 rounded-2xl border border-slate-200">
            <button
              type="button"
              id="customization-subtab-theme"
              onClick={() => setCustomizationSubTab('theme')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                customizationSubTab === 'theme'
                  ? 'bg-white text-indigo-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Type className="w-3.5 h-3.5 text-indigo-600" />
              <span>Portal Font, Style, Background & ForeColor Studio</span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase tracking-wider ml-1">
                Super Admin
              </span>
            </button>

            <button
              type="button"
              id="customization-subtab-policies"
              onClick={() => setCustomizationSubTab('policies')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                customizationSubTab === 'policies'
                  ? 'bg-white text-teal-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Tenant Identity & Visitor NDA Policies</span>
            </button>
          </div>

          {customizationSubTab === 'theme' ? (
            <SuperAdminTypographyThemeCustomizer
              tenantId={activeTenant.id}
              onSuccessToast={(msg) => setSuccessToast(msg)}
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-bold text-[#172B3A]">System Customization & Branding</h2>
                <p className="text-xs text-[#526575] mt-0.5">
                  Personalize tenant corporate logos, colors, visitor pass layouts, and compliance policy agreements.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visual Branding Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B5D] flex items-center gap-1.5">
                    <Palette className="w-4 h-4" />
                    <span>Visual Identity & Color Themes</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#172B3A] mb-1">
                      Tenant Organization Display Name
                    </label>
                    <input
                      type="text"
                      value={brandOrgName}
                      onChange={(e) => setBrandOrgName(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B3A] mb-1">
                      Logo Text / Slogan
                    </label>
                    <input
                      type="text"
                      value={brandLogoText}
                      onChange={(e) => setBrandLogoText(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B3A] mb-1.5">
                      Primary Theme Color
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={brandColor}
                        onChange={(e) => setBrandColor(e.target.value)}
                        className="w-10 h-10 rounded-xl cursor-pointer border border-slate-300 p-0.5"
                      />
                      <div className="flex flex-wrap gap-2">
                        {['#123B5D', '#0F766E', '#EA580C', '#1E1B4B', '#14532D', '#B91C1C'].map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => setBrandColor(c)}
                            className="w-6 h-6 rounded-lg border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B3A] mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Type className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Portal Font Family Selection</span>
                      </span>
                      <span className="text-[10px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        Active: {adminFontFamily}
                      </span>
                    </label>
                    <select
                      value={adminFontFamily}
                      onChange={(e) => setAdminFontFamily(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D] cursor-pointer font-bold"
                    >
                      {SUPPORTED_FONTS.map((font) => (
                        <option key={font.name} value={font.name}>
                          {font.name} ({font.category})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Instantly updates typography across all preview components and application views below.
                    </p>
                  </div>

                  {/* Live Preview Box */}
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Live Logo & Header Preview
                    </span>
                    <div
                      className="p-3 rounded-xl flex items-center justify-between text-white transition-all duration-200"
                      style={{ backgroundColor: brandColor }}
                    >
                      <JSAlphaSoftLogo darkTheme size="md" />
                      <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded text-teal-300">
                        {brandOrgName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Policies & Pass Agreement */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#123B5D] flex items-center gap-1.5">
                    <FileText className="w-4 h-4" />
                    <span>Visitor Policies & Pass Rules</span>
                  </h3>

                  <div>
                    <label className="block text-xs font-bold text-[#172B3A] mb-1">
                      Non-Disclosure Agreement (NDA) Statement
                    </label>
                    <textarea
                      rows={4}
                      value={ndaTerms}
                      onChange={(e) => setNdaTerms(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D] leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#172B3A] mb-1">
                      Guest Wi-Fi SSID & Daily Passcode
                    </label>
                    <input
                      type="text"
                      value={wifiAccessCode}
                      onChange={(e) => setWifiAccessCode(e.target.value)}
                      className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D]"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                    <span>
                      All changes made here instantly reflect on the Front Desk check-in kiosk, thermal badge prints, and visitor pre-registration invitations.
                    </span>
                  </div>
                </div>
              </div>

              {/* Full Width Live Customization Preview Component */}
              <div className="pt-6 border-t border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Real-Time Component Preview Gallery
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-lg">
                    Live Font: {adminFontFamily} • Color: {brandColor}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Displays live updates of the selected font family and color scheme across real enterprise UI components including cards, action buttons, form inputs, and access clearance badges.
                </p>

                <RealTimeThemePreviewGallery
                  fontFamily={adminFontFamily}
                  fontStyle="normal"
                  fontWeight="500"
                  letterSpacing="normal"
                  textTransform="none"
                  fontSizeBase="14px"
                  fontColor="#172B3A"
                  headingColor="#0F172A"
                  mutedFontColor="#526575"
                  backgroundColor="#FAF7EE"
                  surfaceColor="#FFFFFF"
                  foreColor={brandColor}
                  foreColorText="#FFFFFF"
                  secondaryForeColor="#0F766E"
                  companyName={brandOrgName}
                  onFontFamilyChange={(newFont) => setAdminFontFamily(newFont)}
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleSaveCustomization}
                  className="px-5 py-2.5 bg-[#123B5D] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Save & Apply Customization</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: Google Sheets Configuration */}
      {/* ========================================================================= */}
      {activeTab === 'sheets' && (
        <GoogleSheetsConfigTab
          onNotifySuccess={(msg) => {
            setSuccessToast(msg);
            setTimeout(() => setSuccessToast(null), 4000);
          }}
          onNotifyError={(msg) => {
            setErrorToast(msg);
            setTimeout(() => setErrorToast(null), 4000);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 5: Visitor Pass & Thermal Label Customiser (Super Admin Clearance) */}
      {/* ========================================================================= */}
      {activeTab === 'pass_designer' && (
        isSuperAdmin ? (
          <VisitorPassDesignerTab
            onSuccessToast={(msg) => {
              setSuccessToast(msg);
              setTimeout(() => setSuccessToast(null), 4000);
            }}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center space-y-4 shadow-xs">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#172B3A]">Restricted: Platform Super Admin Clearance Required</h3>
              <p className="text-xs text-[#526575] max-w-md mx-auto mt-1">
                Visitor Pass Format Designer & Thermal Label Customiser is restricted exclusively to <strong>Platform Super Admin (Tier 0)</strong> clearance. Your active session role is <strong>{activeUser?.role.replace(/_/g, ' ')}</strong>.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => {
                  const superAdmin = state.users.find((u) => u.role === 'PLATFORM_SUPER_ADMIN');
                  if (superAdmin) {
                    storageService.setActiveContext({ userId: superAdmin.id });
                    setSuccessToast('Switched to Platform Super Admin: Ananya Sharma');
                    setTimeout(() => setSuccessToast(null), 3000);
                  }
                }}
                className="px-4 py-2 bg-[#123B5D] hover:bg-[#0F766E] text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Key className="w-3.5 h-3.5" />
                <span>Switch to Super Admin (Ananya Sharma)</span>
              </button>
            </div>
          </div>
        )
      )}

      {/* ========================================================================= */}
      {/* TAB 6: Role-Based Workflow Management & Access Limits */}
      {/* ========================================================================= */}
      {activeTab === 'roles_workflow' && (
        <RoleWorkflowManagementTab
          onSuccessToast={(msg) => {
            setSuccessToast(msg);
            setTimeout(() => setSuccessToast(null), 4000);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 7: SaaS License Engine */}
      {/* ========================================================================= */}
      {activeTab === 'saas_license' && (
        <SaaSLicenseEngineView
          onNavigateToTenants={() => setActiveTab('tenants')}
          onNavigateToRoles={() => setActiveTab('roles_workflow')}
        />
      )}

      {/* ========================================================================= */}
      {/* TAB 8: Company Logo & Client Whitelabeling */}
      {/* ========================================================================= */}
      {activeTab === 'whitelabel' && (
        <CompanyLogoWhitelabelView
          onSuccessToast={(msg) => {
            setSuccessToast(msg);
            setTimeout(() => setSuccessToast(null), 4000);
          }}
        />
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Create New User Login ID */}
      {/* ========================================================================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#123B5D] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-teal-300">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Create New User Login ID</h3>
                  <p className="text-[11px] text-slate-300">Grant role-based access credentials</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-3.5 text-xs text-[#172B3A]">
              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => {
                    setNewUserName(e.target.value);
                    if (!newUserLoginId) {
                      setNewUserLoginId(e.target.value.toLowerCase().replace(/\s+/g, ''));
                    }
                  }}
                  placeholder="e.g. Meera Joshi"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Login ID (Username)</label>
                  <input
                    type="text"
                    required
                    value={newUserLoginId}
                    onChange={(e) => setNewUserLoginId(e.target.value.toLowerCase())}
                    placeholder="e.g. meera or reception2"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-mono font-medium focus:outline-none focus:border-[#123B5D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Access Password</label>
                  <input
                    type="text"
                    required
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. meera.joshi@tata-enterprise.com"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Assigned Role</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    {storageService.getAllRoleDefinitions().map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} ({r.securityTier})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Department</label>
                  <input
                    type="text"
                    value={newUserDepartment}
                    onChange={(e) => setNewUserDepartment(e.target.value)}
                    placeholder="e.g. Security Operations"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  />
                </div>
              </div>

              {/* Super Admin Tenant Assignment */}
              {isSuperAdmin && (
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Assign to Enterprise Tenant</label>
                  <select
                    value={newUserTenantId}
                    onChange={(e) => setNewUserTenantId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    {state.tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mfa-checkbox"
                  checked={newUserMfa}
                  onChange={(e) => setNewUserMfa(e.target.checked)}
                  className="rounded border-[#CBD5E1] text-[#123B5D] focus:ring-0"
                />
                <label htmlFor="mfa-checkbox" className="text-xs font-medium text-[#526575] cursor-pointer">
                  Require Multi-Factor Authentication (MFA via OTP)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-[#526575] hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0F766E] text-white font-bold transition shadow-xs"
                >
                  Save & Issue Login ID
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: Edit User Login ID & Access */}
      {/* ========================================================================= */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#123B5D] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-teal-300">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Edit User Login ID & Access</h3>
                  <p className="text-[11px] text-slate-300">
                    Update credentials, Login ID, role clearance, and organizational scopes
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-3.5 text-xs text-[#172B3A]">
              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  placeholder="e.g. Meera Joshi"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">
                    Login ID (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={editUserLoginId}
                    onChange={(e) => setEditUserLoginId(e.target.value.toLowerCase())}
                    placeholder="e.g. meera or reception2"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold text-[#123B5D] focus:outline-none focus:border-[#123B5D]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Used for login authentication</span>
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">
                    New Password <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={editUserPassword}
                    onChange={(e) => setEditUserPassword(e.target.value)}
                    placeholder="Leave blank to keep unchanged"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Leave empty to keep existing password</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  placeholder="e.g. user@enterprise.com"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Assigned Role</label>
                  <select
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    {storageService.getAllRoleDefinitions().map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} ({r.securityTier})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Department</label>
                  <input
                    type="text"
                    value={editUserDepartment}
                    onChange={(e) => setEditUserDepartment(e.target.value)}
                    placeholder="e.g. Front Desk Operations"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  />
                </div>
              </div>

              {/* Tenant Assignment */}
              {isSuperAdmin ? (
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Assigned Tenant</label>
                  <select
                    value={editUserTenantId}
                    onChange={(e) => setEditUserTenantId(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    {state.tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-semibold">Tenant Scope:</span>
                  <span className="font-bold text-[#123B5D]">{activeTenant.name}</span>
                </div>
              )}

              {/* Status & MFA */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Account Status</label>
                  <select
                    value={editUserStatus}
                    onChange={(e) => setEditUserStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    <option value="ACTIVE">ACTIVE (Can Log In)</option>
                    <option value="INACTIVE">INACTIVE (Access Suspended)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="edit-mfa-checkbox"
                    checked={editUserMfa}
                    onChange={(e) => setEditUserMfa(e.target.checked)}
                    className="rounded border-[#CBD5E1] text-[#123B5D] focus:ring-0"
                  />
                  <label htmlFor="edit-mfa-checkbox" className="text-xs font-medium text-[#526575] cursor-pointer">
                    Require MFA (via OTP)
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-[#526575] hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0F766E] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Save & Update Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Add New Enterprise Tenant */}
      {/* ========================================================================= */}
      {isAddTenantOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#123B5D] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-teal-300">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Add New Enterprise Tenant</h3>
                  <p className="text-[11px] text-slate-300">Provision isolated multi-tenant organization</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTenantOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="p-6 space-y-3.5 text-xs text-[#172B3A]">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-[#172B3A] mb-1">Company / Tenant Name</label>
                  <input
                    type="text"
                    required
                    value={tenantName}
                    onChange={(e) => {
                      setTenantName(e.target.value);
                      if (!tenantCode) {
                        setTenantCode(e.target.value.substring(0, 4).toUpperCase());
                      }
                    }}
                    placeholder="e.g. Reliance Industries"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={tenantCode}
                    onChange={(e) => setTenantCode(e.target.value.toUpperCase())}
                    placeholder="e.g. REL"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#123B5D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Service SLA Tier</label>
                  <select
                    value={tenantTier}
                    onChange={(e) => setTenantTier(e.target.value as Tenant['tier'])}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    <option value="ENTERPRISE_STANDARD">Enterprise Standard</option>
                    <option value="ENTERPRISE_PREMIUM">Enterprise Premium</option>
                    <option value="MISSION_CRITICAL">Mission Critical (Gov / Defence)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Brand Theme Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={tenantPrimaryColor}
                      onChange={(e) => setTenantPrimaryColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={tenantPrimaryColor}
                      onChange={(e) => setTenantPrimaryColor(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#F4F7FA] border border-[#CBD5E1] rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Initial Campus / Site Name</label>
                <input
                  type="text"
                  value={tenantInitialSite}
                  onChange={(e) => setTenantInitialSite(e.target.value)}
                  placeholder="e.g. Jio Tech Center & Corporate Park"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Campus Physical Address</label>
                <input
                  type="text"
                  value={tenantInitialAddress}
                  onChange={(e) => setTenantInitialAddress(e.target.value)}
                  placeholder="e.g. Navi Mumbai, Maharashtra 400701"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTenantOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-[#526575] hover:bg-slate-50 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0F766E] text-white font-bold transition shadow-xs"
                >
                  Provision Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Add Multiple Entry Locations (with physical location name) */}
      {/* ========================================================================= */}
      {isAddMultipleGatesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#123B5D] px-6 py-4 flex items-center justify-between text-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <ListPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Add Multiple Entry Locations</h3>
                  <p className="text-[11px] text-teal-200">
                    Configure multiple turnstile gates & checkpoints for physical location under {activeTenant.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMultipleGatesOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMultipleGates} className="p-6 space-y-4 overflow-y-auto text-xs text-[#172B3A]">
              {/* Step 1: Select or Enter Physical Location */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#172B3A] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Physical Location / Campus Name</span>
                  </label>

                  <div className="flex items-center bg-white rounded-lg p-0.5 border border-slate-200 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setMultiGatePhysicalMode('EXISTING')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        multiGatePhysicalMode === 'EXISTING'
                          ? 'bg-[#123B5D] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Existing Campus ({state.sites.filter((s) => s.tenantId === activeTenant.id).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setMultiGatePhysicalMode('NEW')}
                      className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
                        multiGatePhysicalMode === 'NEW'
                          ? 'bg-[#123B5D] text-white'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      + New Physical Location
                    </button>
                  </div>
                </div>

                {multiGatePhysicalMode === 'EXISTING' ? (
                  <div>
                    {state.sites.filter((s) => s.tenantId === activeTenant.id).length > 0 ? (
                      <select
                        value={multiGateSiteId}
                        onChange={(e) => setMultiGateSiteId(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-[#123B5D] focus:outline-none focus:border-[#123B5D]"
                      >
                        {state.sites
                          .filter((s) => s.tenantId === activeTenant.id)
                          .map((s) => (
                            <option key={s.id} value={s.id}>
                              📍 {s.name} ({s.code}) — {s.address}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <div className="text-amber-800 text-[11px] font-medium p-2 bg-amber-50 rounded-lg border border-amber-200">
                        No physical campus registered yet. Switch to "+ New Physical Location" to name your first campus facility.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Physical Campus / Facility Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={multiGateNewPhysicalName}
                        onChange={(e) => setMultiGateNewPhysicalName(e.target.value)}
                        placeholder="e.g. Pune Tech Park - Tower C"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Physical Address
                      </label>
                      <input
                        type="text"
                        value={multiGateNewPhysicalAddress}
                        onChange={(e) => setMultiGateNewPhysicalAddress(e.target.value)}
                        placeholder="e.g. Hinjewadi Phase 1, Pune, Maharashtra"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-[#172B3A] focus:outline-none focus:border-[#123B5D]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Multiple Entry Location Rows */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#172B3A] flex items-center gap-1.5">
                    <DoorOpen className="w-3.5 h-3.5 text-teal-600" />
                    <span>Entry Locations & Turnstile Gates List ({multiGateRows.length})</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const count = multiGateRows.length + 1;
                      setMultiGateRows((prev) => [
                        ...prev,
                        {
                          name: `Entry Checkpoint ${count} (Turnstiles)`,
                          code: `GT-${String(count).padStart(2, '0')}`,
                          type: 'BIDIRECTIONAL',
                          operatingStatus: 'OPEN',
                        },
                      ]);
                    }}
                    className="text-[11px] font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Another Row</span>
                  </button>
                </div>

                {/* Quick Presets / Templates */}
                <div className="flex items-center gap-1.5 flex-wrap bg-slate-50 p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setMultiGateRows([
                        { name: 'Main Lobby North Turnstiles (Lanes 1-2)', code: 'GT-01', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                        { name: 'Main Lobby South Turnstiles (Lanes 3-4)', code: 'GT-02', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                        { name: 'Visitor Fast Check-In Kiosk Lane', code: 'GT-03', type: 'ENTRY_ONLY', operatingStatus: 'OPEN' },
                        { name: 'VIP Executive & Boardroom Gate', code: 'GT-04', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                      ]);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[#123B5D] border border-slate-200 font-semibold cursor-pointer shadow-2xs"
                  >
                    4 Turnstile Lanes
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMultiGateRows([
                        { name: 'Ground Floor Reception Turnstiles', code: 'GT-REC-01', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                        { name: 'Security Checkpoint & Metal Detector', code: 'GT-SEC-01', type: 'ENTRY_ONLY', operatingStatus: 'OPEN' },
                        { name: 'Basement Parking Elevator Turnstile', code: 'GT-BSMT-01', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                        { name: 'Loading Dock & Vendor Receiving Bay', code: 'GT-DOCK-01', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                      ]);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[#123B5D] border border-slate-200 font-semibold cursor-pointer shadow-2xs"
                  >
                    Lobby + Security + Parking + Dock
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMultiGateRows([
                        { name: 'North Wing Turnstile Gate', code: 'GT-N1', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                        { name: 'South Wing Turnstile Gate', code: 'GT-S1', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                        { name: 'East Wing Turnstile Gate', code: 'GT-E1', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                        { name: 'West Wing Turnstile Gate', code: 'GT-W1', type: 'BIDIRECTIONAL', operatingStatus: 'OPEN' },
                      ]);
                    }}
                    className="text-[10px] px-2 py-0.5 rounded bg-white hover:bg-slate-100 text-[#123B5D] border border-slate-200 font-semibold cursor-pointer shadow-2xs"
                  >
                    4 Campus Wings (N/S/E/W)
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {multiGateRows.map((row, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 group hover:border-slate-300 transition"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                        {idx + 1}
                      </span>

                      {/* Entry Location Name */}
                      <input
                        type="text"
                        required
                        value={row.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setMultiGateRows((prev) => {
                            const copy = [...prev];
                            copy[idx].name = val;
                            return copy;
                          });
                        }}
                        placeholder="Entry Location Name (e.g. Main North Turnstile)"
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-[#172B3A] focus:outline-none focus:border-[#123B5D]"
                      />

                      {/* Code */}
                      <input
                        type="text"
                        value={row.code}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setMultiGateRows((prev) => {
                            const copy = [...prev];
                            copy[idx].code = val;
                            return copy;
                          });
                        }}
                        placeholder="GT-01"
                        className="w-24 px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-700 focus:outline-none focus:border-[#123B5D]"
                      />

                      {/* Direction */}
                      <select
                        value={row.type}
                        onChange={(e) => {
                          const val = e.target.value as Gate['type'];
                          setMultiGateRows((prev) => {
                            const copy = [...prev];
                            copy[idx].type = val;
                            return copy;
                          });
                        }}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-[#123B5D]"
                      >
                        <option value="BIDIRECTIONAL">Bidirectional</option>
                        <option value="ENTRY_ONLY">Entry Only</option>
                        <option value="EXIT_ONLY">Exit Only</option>
                      </select>

                      {/* Operating Status */}
                      <select
                        value={row.operatingStatus}
                        onChange={(e) => {
                          const val = e.target.value as Gate['operatingStatus'];
                          setMultiGateRows((prev) => {
                            const copy = [...prev];
                            copy[idx].operatingStatus = val;
                            return copy;
                          });
                        }}
                        className="px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-[#123B5D]"
                      >
                        <option value="OPEN">OPEN</option>
                        <option value="RESTRICTED">RESTRICTED</option>
                        <option value="OFFLINE">OFFLINE</option>
                      </select>

                      {/* Remove Row */}
                      {multiGateRows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setMultiGateRows((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition cursor-pointer"
                          title="Remove this entry location row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddMultipleGatesOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0F766E] text-white font-bold transition shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <ListPlus className="w-4 h-4 text-teal-300" />
                  <span>Register All Entry Locations</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: Add Single Entry Gate */}
      {/* ========================================================================= */}
      {isAddSingleGateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#123B5D] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <DoorOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Add Entry Location / Gate</h3>
                  <p className="text-[11px] text-teal-200">Register new entrance point for {activeTenant.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSingleGateOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSingleGate} className="p-6 space-y-3.5 text-xs text-[#172B3A]">
              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Physical Location / Campus *</label>
                <select
                  value={singleGateSiteId}
                  onChange={(e) => setSingleGateSiteId(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#123B5D] focus:outline-none focus:border-[#123B5D]"
                >
                  {state.sites
                    .filter((s) => s.tenantId === activeTenant.id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Entry Location Name *</label>
                <input
                  type="text"
                  required
                  value={singleGateName}
                  onChange={(e) => setSingleGateName(e.target.value)}
                  placeholder="e.g. West Wing Reception Turnstiles (Gate 2)"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Gate Code</label>
                  <input
                    type="text"
                    value={singleGateCode}
                    onChange={(e) => setSingleGateCode(e.target.value.toUpperCase())}
                    placeholder="e.g. GT-WEST-02"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#123B5D]"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Auto-generated if empty</span>
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Direction / Type</label>
                  <select
                    value={singleGateType}
                    onChange={(e) => setSingleGateType(e.target.value as Gate['type'])}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    <option value="BIDIRECTIONAL">Bidirectional</option>
                    <option value="ENTRY_ONLY">Entry Only</option>
                    <option value="EXIT_ONLY">Exit Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Operating Status</label>
                <select
                  value={singleGateStatus}
                  onChange={(e) => setSingleGateStatus(e.target.value as Gate['operatingStatus'])}
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                >
                  <option value="OPEN">OPEN (Turnstiles Active & Accepting Passes)</option>
                  <option value="RESTRICTED">RESTRICTED (Security Escort Required)</option>
                  <option value="EMERGENCY_LOCKDOWN">EMERGENCY LOCKDOWN</option>
                  <option value="OFFLINE">OFFLINE (Maintenance Mode)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSingleGateOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0F766E] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Register Entry Gate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: Add Physical Campus Location */}
      {/* ========================================================================= */}
      {isAddSiteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#123B5D] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Add Physical Campus Location</h3>
                  <p className="text-[11px] text-teal-200">Register facility site under {activeTenant.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSiteOpen(false)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSite} className="p-6 space-y-3.5 text-xs text-[#172B3A]">
              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Physical Location / Campus Name *</label>
                <input
                  type="text"
                  required
                  value={newSiteName}
                  onChange={(e) => {
                    setNewSiteName(e.target.value);
                    if (!newSiteCode) {
                      setNewSiteCode(e.target.value.substring(0, 4).toUpperCase());
                    }
                  }}
                  placeholder="e.g. Hyderabad Innovation Campus - Tower Alpha"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Campus Code</label>
                  <input
                    type="text"
                    value={newSiteCode}
                    onChange={(e) => setNewSiteCode(e.target.value.toUpperCase())}
                    placeholder="e.g. HYD-01"
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#123B5D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Timezone</label>
                  <select
                    value={newSiteTimezone}
                    onChange={(e) => setNewSiteTimezone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="America/New_York">America/New York (EST/EDT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Physical Campus Address</label>
                <input
                  type="text"
                  value={newSiteAddress}
                  onChange={(e) => setNewSiteAddress(e.target.value)}
                  placeholder="e.g. Plot 10, HITEC City, Madhapur, Hyderabad"
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Visitor Policy & Entry Rules</label>
                <textarea
                  rows={2}
                  value={newSitePolicy}
                  onChange={(e) => setNewSitePolicy(e.target.value)}
                  placeholder="Policy details..."
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSiteOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0F766E] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Register Physical Campus
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: Edit Entry Gate */}
      {/* ========================================================================= */}
      {editingGate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
            <div className="bg-[#123B5D] px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Edit Entry Location</h3>
                  <p className="text-[11px] text-teal-200">Update turnstile gate specifications</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingGate(null)}
                className="text-slate-300 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditGate} className="p-6 space-y-3.5 text-xs text-[#172B3A]">
              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Physical Location / Campus</label>
                <select
                  value={editGateSiteId}
                  onChange={(e) => setEditGateSiteId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-semibold text-[#123B5D] focus:outline-none focus:border-[#123B5D]"
                >
                  {state.sites
                    .filter((s) => s.tenantId === activeTenant.id)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.code})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Entry Location Name *</label>
                <input
                  type="text"
                  required
                  value={editGateName}
                  onChange={(e) => setEditGateName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Gate Code</label>
                  <input
                    type="text"
                    value={editGateCode}
                    onChange={(e) => setEditGateCode(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#123B5D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#172B3A] mb-1">Direction / Type</label>
                  <select
                    value={editGateType}
                    onChange={(e) => setEditGateType(e.target.value as Gate['type'])}
                    className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                  >
                    <option value="BIDIRECTIONAL">Bidirectional</option>
                    <option value="ENTRY_ONLY">Entry Only</option>
                    <option value="EXIT_ONLY">Exit Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#172B3A] mb-1">Operating Status</label>
                <select
                  value={editGateStatus}
                  onChange={(e) => setEditGateStatus(e.target.value as Gate['operatingStatus'])}
                  className="w-full px-3 py-2 bg-[#F4F7FA] border border-[#CBD5E1] rounded-xl text-xs font-medium focus:outline-none focus:border-[#123B5D]"
                >
                  <option value="OPEN">OPEN (Turnstiles Active & Accepting Passes)</option>
                  <option value="RESTRICTED">RESTRICTED (Security Escort Required)</option>
                  <option value="EMERGENCY_LOCKDOWN">EMERGENCY LOCKDOWN</option>
                  <option value="OFFLINE">OFFLINE (Maintenance Mode)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingGate(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0F766E] text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
