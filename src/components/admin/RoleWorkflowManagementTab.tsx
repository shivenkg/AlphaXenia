import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Save,
  Search,
  Sliders,
  Filter,
  Eye,
  Key,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  Settings2,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  UserCheck,
  Sparkles,
  Tag
} from 'lucide-react';
import {
  storageService,
  VMS_FUNCTION_DEFINITIONS,
  DEFAULT_ROLE_PERMISSIONS,
  DEFAULT_ROLE_DEFINITIONS
} from '../../services/storageService';
import { UserRole, VMSFunctionId, AppUser, RoleDefinition } from '../../types';

interface RoleWorkflowManagementTabProps {
  onSuccessToast?: (msg: string) => void;
}

const BADGE_COLOR_PRESETS = [
  { label: 'Purple (Admin)', value: 'bg-purple-100 text-purple-900 border-purple-300' },
  { label: 'Indigo (Corporate)', value: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { label: 'Blue (Campus)', value: 'bg-blue-100 text-blue-900 border-blue-300' },
  { label: 'Teal (Security Ops)', value: 'bg-teal-100 text-teal-900 border-teal-300' },
  { label: 'Sky (Perimeter)', value: 'bg-sky-100 text-sky-900 border-sky-300' },
  { label: 'Emerald (Front Desk)', value: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { label: 'Amber (Staff Host)', value: 'bg-amber-100 text-amber-900 border-amber-300' },
  { label: 'Orange (Approvals)', value: 'bg-orange-100 text-orange-900 border-orange-300' },
  { label: 'Rose (Auditor)', value: 'bg-rose-100 text-rose-900 border-rose-300' },
  { label: 'Cyan (IoT Edge)', value: 'bg-cyan-100 text-cyan-900 border-cyan-300' },
  { label: 'Slate (Field Guard)', value: 'bg-slate-100 text-slate-800 border-slate-300' },
];

const SECURITY_TIERS = [
  'Tier 0 (Root Clearance)',
  'Tier 1 (Enterprise Full)',
  'Tier 2 (Security Operations)',
  'Tier 2 (Campus Level)',
  'Tier 2 (Auditing)',
  'Tier 2 (Hardware IoT)',
  'Tier 3 (Perimeter Control)',
  'Tier 3 (Approvals Desk)',
  'Tier 4 (Front Desk)',
  'Tier 4 (Stationed Field)',
  'Tier 5 (Standard Staff)',
];

const CATEGORY_NAMES: Record<string, { label: string; icon: any; color: string }> = {
  OPERATIONS: { label: 'Operations & Desk Execution', icon: Layers, color: 'text-teal-700 bg-teal-50 border-teal-200' },
  SECURITY_GOVERNANCE: { label: 'Security, Approvals & Governance', icon: Shield, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
  SAFETY_EMERGENCY: { label: 'Life Safety & Emergency Response', icon: AlertTriangle, color: 'text-amber-700 bg-amber-50 border-amber-200' },
  INFRASTRUCTURE: { label: 'Hardware & Edge Infrastructure', icon: Settings2, color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
  ADMINISTRATION: { label: 'System Administration & Integration', icon: Key, color: 'text-purple-700 bg-purple-50 border-purple-200' },
};

export const RoleWorkflowManagementTab: React.FC<RoleWorkflowManagementTabProps> = ({ onSuccessToast }) => {
  const users: AppUser[] = storageService.getState().users;

  // Active sub-tab: 'ROLE_WORKFLOW' (configure what functions a role has) vs 'USER_ACCESS_LIMITS' (restrict individual users)
  const [activeSubTab, setActiveSubTab] = useState<'ROLE_WORKFLOW' | 'USER_ACCESS_LIMITS'>('ROLE_WORKFLOW');

  // Role Definitions
  const [roleDefinitions, setRoleDefinitions] = useState<RoleDefinition[]>(() =>
    storageService.getAllRoleDefinitions()
  );

  // Role Workflow State
  const [selectedRoleId, setSelectedRoleId] = useState<string>('RECEPTIONIST');
  const [activeFunctions, setActiveFunctions] = useState<VMSFunctionId[]>(() =>
    storageService.getRolePermissions('RECEPTIONIST')
  );
  const [isSavingRole, setIsSavingRole] = useState(false);
  const [roleSearchTerm, setRoleSearchTerm] = useState('');

  // Add Custom Role Modal State
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleId, setNewRoleId] = useState('');
  const [newRoleLabel, setNewRoleLabel] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');
  const [newRoleTier, setNewRoleTier] = useState(SECURITY_TIERS[4]);
  const [newRoleBadgeColor, setNewRoleBadgeColor] = useState(BADGE_COLOR_PRESETS[3].value);
  const [newRoleInitialFunctions, setNewRoleInitialFunctions] = useState<VMSFunctionId[]>([
    'RECEPTION_DESK',
    'VISITOR_DIRECTORY',
  ]);
  const [addRoleError, setAddRoleError] = useState<string | null>(null);

  // Edit Role Label & Metadata Modal State
  const [isEditRoleModalOpen, setIsEditRoleModalOpen] = useState(false);
  const [editRoleLabel, setEditRoleLabel] = useState('');
  const [editRoleDescription, setEditRoleDescription] = useState('');
  const [editRoleTier, setEditRoleTier] = useState('');
  const [editRoleBadgeColor, setEditRoleBadgeColor] = useState('');
  const [editRoleError, setEditRoleError] = useState<string | null>(null);

  // User Limits State
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUserForLimiting, setSelectedUserForLimiting] = useState<AppUser | null>(null);
  const [userRestrictions, setUserRestrictions] = useState<VMSFunctionId[]>([]);
  const [isSavingUserLimit, setIsSavingUserLimit] = useState(false);

  // Quick User Role Reassignment
  const [assignUserTargetId, setAssignUserTargetId] = useState('');

  // Current active role definition
  const currentRoleDef = useMemo(() => {
    return (
      roleDefinitions.find((r) => r.id === selectedRoleId) ||
      storageService.getRoleDefinition(selectedRoleId) || {
        id: selectedRoleId,
        label: selectedRoleId.replace(/_/g, ' '),
        description: 'System security role.',
        badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
        securityTier: 'Tier 3 (Operational)',
        permissions: activeFunctions,
        isSystemRole: true,
      }
    );
  }, [roleDefinitions, selectedRoleId, activeFunctions]);

  // When changing selected role
  const handleSelectRole = (roleId: string) => {
    setSelectedRoleId(roleId);
    const fns = storageService.getRolePermissions(roleId);
    setActiveFunctions(fns);
  };

  // Toggle function for selected role
  const handleToggleFunctionInRole = (fnId: VMSFunctionId) => {
    if (activeFunctions.includes(fnId)) {
      setActiveFunctions(activeFunctions.filter((id) => id !== fnId));
    } else {
      setActiveFunctions([...activeFunctions, fnId]);
    }
  };

  const handleSaveRolePermissions = () => {
    setIsSavingRole(true);
    storageService.updateRolePermissions(selectedRoleId, activeFunctions);
    setRoleDefinitions(storageService.getAllRoleDefinitions());
    setTimeout(() => {
      setIsSavingRole(false);
      if (onSuccessToast) {
        onSuccessToast(
          `Workflow policy updated for role "${currentRoleDef.label}". ${activeFunctions.length} functions active.`
        );
      }
    }, 300);
  };

  const handleResetRoleToDefault = () => {
    const defaultFns = DEFAULT_ROLE_PERMISSIONS[selectedRoleId as UserRole] || [];
    setActiveFunctions(defaultFns);
    storageService.updateRolePermissions(selectedRoleId, defaultFns);
    if (onSuccessToast) {
      onSuccessToast(`Role "${currentRoleDef.label}" permissions reset to factory default policy.`);
    }
  };

  // Open Edit Role Label Modal
  const handleOpenEditRoleModal = () => {
    setEditRoleLabel(currentRoleDef.label);
    setEditRoleDescription(currentRoleDef.description);
    setEditRoleTier(currentRoleDef.securityTier);
    setEditRoleBadgeColor(currentRoleDef.badgeColor);
    setEditRoleError(null);
    setIsEditRoleModalOpen(true);
  };

  // Save Role Label & Metadata
  const handleSaveRoleLabelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoleLabel.trim()) {
      setEditRoleError('Role display label cannot be empty.');
      return;
    }

    const res = storageService.updateRoleLabel(selectedRoleId, {
      label: editRoleLabel.trim(),
      description: editRoleDescription.trim(),
      securityTier: editRoleTier,
      badgeColor: editRoleBadgeColor,
    });

    if (res.success) {
      const refreshed = storageService.getAllRoleDefinitions();
      setRoleDefinitions(refreshed);
      setIsEditRoleModalOpen(false);
      if (onSuccessToast) {
        onSuccessToast(`Role label updated to "${editRoleLabel.trim()}".`);
      }
    } else {
      setEditRoleError(res.error || 'Failed to update role label.');
    }
  };

  // Reset Role Label to Factory Default
  const handleResetRoleLabelToDefault = () => {
    const res = storageService.resetRoleToDefault(selectedRoleId);
    if (res.success) {
      const refreshed = storageService.getAllRoleDefinitions();
      setRoleDefinitions(refreshed);
      const def = storageService.getRoleDefinition(selectedRoleId);
      if (def) {
        setActiveFunctions(def.permissions);
      }
      setIsEditRoleModalOpen(false);
      if (onSuccessToast) {
        onSuccessToast(`Role "${selectedRoleId}" label & metadata reset to factory default.`);
      }
    }
  };

  // Delete Custom Role
  const handleDeleteRole = () => {
    const res = storageService.deleteRole(selectedRoleId);
    if (res.success) {
      const refreshed = storageService.getAllRoleDefinitions();
      setRoleDefinitions(refreshed);
      setIsEditRoleModalOpen(false);
      const fallbackId = refreshed[0]?.id || 'RECEPTIONIST';
      handleSelectRole(fallbackId);
      if (onSuccessToast) {
        onSuccessToast(`Role "${currentRoleDef.label}" deleted successfully.`);
      }
    } else {
      setEditRoleError(res.error || 'Failed to delete role.');
    }
  };

  // Create New Custom Role
  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddRoleError(null);

    const formattedId = newRoleId.trim().toUpperCase().replace(/\s+/g, '_');
    if (!formattedId) {
      setAddRoleError('Role code identifier is required.');
      return;
    }
    if (!newRoleLabel.trim()) {
      setAddRoleError('Role display label is required.');
      return;
    }

    const res = storageService.addRole({
      id: formattedId,
      label: newRoleLabel.trim(),
      description: newRoleDescription.trim() || 'Custom enterprise security role.',
      securityTier: newRoleTier,
      badgeColor: newRoleBadgeColor,
      permissions: newRoleInitialFunctions,
    });

    if (res.success) {
      const refreshed = storageService.getAllRoleDefinitions();
      setRoleDefinitions(refreshed);
      setIsAddRoleModalOpen(false);
      handleSelectRole(formattedId);
      if (onSuccessToast) {
        onSuccessToast(`New custom role "${newRoleLabel.trim()}" created successfully!`);
      }
      // Reset form
      setNewRoleId('');
      setNewRoleLabel('');
      setNewRoleDescription('');
      setNewRoleInitialFunctions(['RECEPTION_DESK', 'VISITOR_DIRECTORY']);
    } else {
      setAddRoleError(res.error || 'Failed to create role.');
    }
  };

  // Assign user to active role
  const handleAssignUserToRole = () => {
    if (!assignUserTargetId) return;
    const res = storageService.updateUserRole(assignUserTargetId, selectedRoleId as UserRole);
    if (res.success && res.user) {
      if (onSuccessToast) {
        onSuccessToast(`${res.user.name} was assigned to role "${currentRoleDef.label}".`);
      }
      setAssignUserTargetId('');
    }
  };

  // Open user restriction modal/panel
  const handleOpenUserLimiting = (u: AppUser) => {
    setSelectedUserForLimiting(u);
    const restricted = storageService.getUserRestrictedFunctions(u.id);
    setUserRestrictions(restricted);
  };

  // Toggle user restriction on a function
  const handleToggleUserRestriction = (fnId: VMSFunctionId) => {
    if (userRestrictions.includes(fnId)) {
      setUserRestrictions(userRestrictions.filter((id) => id !== fnId));
    } else {
      setUserRestrictions([...userRestrictions, fnId]);
    }
  };

  const handleSaveUserLimits = () => {
    if (!selectedUserForLimiting) return;
    setIsSavingUserLimit(true);
    storageService.updateUserAccessLimit(selectedUserForLimiting.id, userRestrictions);
    setTimeout(() => {
      setIsSavingUserLimit(false);
      if (onSuccessToast) {
        onSuccessToast(
          `Access limitation enforced for ${selectedUserForLimiting.name}. ${userRestrictions.length} functions restricted.`
        );
      }
      setSelectedUserForLimiting(null);
    }, 300);
  };

  // Users currently assigned to this selected role
  const assignedUsersToSelectedRole = useMemo(() => {
    return users.filter((u) => u.role === selectedRoleId);
  }, [users, selectedRoleId]);

  // Filtered roles
  const filteredRoles = useMemo(() => {
    return roleDefinitions.filter((r) => {
      const match =
        r.label.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
        r.id.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(roleSearchTerm.toLowerCase());
      return match;
    });
  }, [roleDefinitions, roleSearchTerm]);

  // Filtered users for User Limits tab
  const filteredUsers = useMemo(() => {
    return users.filter((u: AppUser) => {
      const matchText =
        u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.loginId.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        u.role.toLowerCase().includes(userSearchTerm.toLowerCase());
      return matchText;
    });
  }, [users, userSearchTerm]);

  // Group functions by category
  const categorizedFunctions = useMemo(() => {
    const groups: Record<string, typeof VMS_FUNCTION_DEFINITIONS> = {
      OPERATIONS: [],
      SECURITY_GOVERNANCE: [],
      SAFETY_EMERGENCY: [],
      INFRASTRUCTURE: [],
      ADMINISTRATION: [],
    };
    VMS_FUNCTION_DEFINITIONS.forEach((fn) => {
      if (groups[fn.category]) {
        groups[fn.category].push(fn);
      }
    });
    return groups;
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-[11px] font-bold uppercase tracking-wider border border-indigo-200">
              Role-Based Access Control (RBAC) Engine
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">
              Dynamic Roles, Custom Labels & Module Permissions
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#172B3A] mt-1">
            Role Definitions, Custom Labels & Roles-Based Access
          </h2>
          <p className="text-xs text-[#526575] mt-0.5">
            Add custom security roles, edit display labels and descriptions, configure functional access policies, and limit individual accounts.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
          <button
            id="subtab-role-workflows-btn"
            onClick={() => setActiveSubTab('ROLE_WORKFLOW')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'ROLE_WORKFLOW'
                ? 'bg-white text-[#123B5D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Role Workflow Policies ({roleDefinitions.length})</span>
          </button>
          <button
            id="subtab-user-limits-btn"
            onClick={() => setActiveSubTab('USER_ACCESS_LIMITS')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'USER_ACCESS_LIMITS'
                ? 'bg-white text-[#123B5D] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>Limit User Access ({users.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: ROLE WORKFLOW POLICIES (Add / Edit Roles & Roles-Based Access) */}
      {/* ========================================================================= */}
      {activeSubTab === 'ROLE_WORKFLOW' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Role Navigation Column (4 cols) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Security Roles
                </span>
                <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
                  {roleDefinitions.length} Configured
                </span>
              </div>

              {/* Add Custom Role Button */}
              <button
                id="add-custom-role-btn"
                onClick={() => {
                  setAddRoleError(null);
                  setIsAddRoleModalOpen(true);
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-teal-600 to-[#123B5D] hover:from-teal-700 hover:to-[#0f304c] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 text-teal-200" />
                <span>Add New Custom Role</span>
              </button>

              {/* Search Roles Input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={roleSearchTerm}
                  onChange={(e) => setRoleSearchTerm(e.target.value)}
                  placeholder="Filter roles by label..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-teal-600 outline-none"
                />
              </div>

              {/* Roles List */}
              <div className="space-y-1.5 max-h-[520px] overflow-y-auto scrollbar-thin pr-1">
                {filteredRoles.map((roleDef) => {
                  const isSelected = selectedRoleId === roleDef.id;
                  const fnsCount = (storageService.getRolePermissions(roleDef.id) || []).length;
                  const usersWithRole = users.filter((u) => u.role === roleDef.id).length;

                  return (
                    <button
                      key={roleDef.id}
                      onClick={() => handleSelectRole(roleDef.id)}
                      className={`w-full text-left p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-teal-950' : 'text-slate-900'
                            }`}
                          >
                            {roleDef.label}
                          </span>
                          {!roleDef.isSystemRole && (
                            <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-tight">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                          <span className="font-mono text-slate-400">{roleDef.id}</span>
                          <span>•</span>
                          <span>{usersWithRole} user{usersWithRole === 1 ? '' : 's'}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isSelected
                              ? 'bg-teal-700 text-white'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {fnsCount} fns
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Role Header, Edit Button & Roles-Based Access Matrix (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Active Role Header Details */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider border ${currentRoleDef.badgeColor}`}
                  >
                    {currentRoleDef.securityTier}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {activeFunctions.length} / {VMS_FUNCTION_DEFINITIONS.length} Modules Active
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-mono text-slate-500 font-bold">
                    ID: {currentRoleDef.id}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    {currentRoleDef.label}
                  </h3>
                  <button
                    id="edit-role-label-btn"
                    onClick={handleOpenEditRoleModal}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 hover:text-indigo-900 border border-indigo-200 text-xs font-bold transition cursor-pointer"
                    title="Change display label, description, security tier, or badge styling"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Role Label & Info</span>
                  </button>
                </div>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {currentRoleDef.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap shrink-0">
                {currentRoleDef.isSystemRole && (
                  <button
                    type="button"
                    onClick={handleResetRoleToDefault}
                    className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                    title="Reset functional permissions to factory standard"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reset Default</span>
                  </button>
                )}
                <button
                  id="save-role-permissions-btn"
                  type="button"
                  onClick={handleSaveRolePermissions}
                  disabled={isSavingRole}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingRole ? 'Saving...' : 'Save Role Policy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Personnel Assignment Section for this Role */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Assigned Personnel ({assignedUsersToSelectedRole.length}):</span>
                </span>
                {assignedUsersToSelectedRole.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {assignedUsersToSelectedRole.map((u) => (
                      <span
                        key={u.id}
                        className="px-2 py-0.5 rounded-full bg-white text-slate-800 border border-slate-200 font-medium text-[11px]"
                      >
                        {u.name} ({u.loginId})
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-slate-400 italic">No users currently assigned this role</span>
                )}
              </div>

              {/* Assign user selector */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <select
                  value={assignUserTargetId}
                  onChange={(e) => setAssignUserTargetId(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                >
                  <option value="">Assign user to this role...</option>
                  {users
                    .filter((u) => u.role !== selectedRoleId)
                    .map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} (Current: {storageService.getRoleLabel(u.role)})
                      </option>
                    ))}
                </select>
                <button
                  type="button"
                  onClick={handleAssignUserToRole}
                  disabled={!assignUserTargetId}
                  className="px-3 py-1.5 rounded-lg bg-[#123B5D] text-white text-xs font-bold hover:bg-[#0f304c] disabled:opacity-40 transition cursor-pointer"
                >
                  Assign
                </button>
              </div>
            </div>

            {/* Categorized Function Blocks (Roles Based Access Checklist) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Roles Based Access: Functional Capabilities Matrix
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveFunctions(VMS_FUNCTION_DEFINITIONS.map((f) => f.id))}
                    className="text-teal-700 hover:underline font-bold cursor-pointer"
                  >
                    Select All ({VMS_FUNCTION_DEFINITIONS.length})
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => setActiveFunctions([])}
                    className="text-rose-600 hover:underline font-bold cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>

              {Object.entries(categorizedFunctions).map(([catKey, fns]) => {
                const catMeta = CATEGORY_NAMES[catKey] || {
                  label: catKey,
                  icon: Layers,
                  color: 'text-slate-700 bg-slate-50 border-slate-200',
                };
                const CatIcon = catMeta.icon;

                return (
                  <div key={catKey} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md border ${catMeta.color}`}>
                          <CatIcon className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs font-bold text-[#172B3A]">{catMeta.label}</span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px]">
                        <button
                          type="button"
                          onClick={() => {
                            const newActive = Array.from(new Set([...activeFunctions, ...fns.map((f) => f.id)]));
                            setActiveFunctions(newActive);
                          }}
                          className="text-teal-700 hover:underline font-semibold cursor-pointer"
                        >
                          Enable All
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          type="button"
                          onClick={() => {
                            const idsToRemove = new Set(fns.map((f) => f.id));
                            setActiveFunctions(activeFunctions.filter((id) => !idsToRemove.has(id)));
                          }}
                          className="text-rose-600 hover:underline font-semibold cursor-pointer"
                        >
                          Disable All
                        </button>
                      </div>
                    </div>

                    <div className="divide-y divide-slate-100 p-2">
                      {fns.map((fn) => {
                        const isEnabled = activeFunctions.includes(fn.id);

                        return (
                          <div
                            key={fn.id}
                            onClick={() => handleToggleFunctionInRole(fn.id)}
                            className={`p-3 rounded-lg transition cursor-pointer flex items-start justify-between gap-3 ${
                              isEnabled ? 'bg-teal-50/40 hover:bg-teal-50/70' : 'hover:bg-slate-50 opacity-75'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="pt-0.5">
                                <div
                                  className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                                    isEnabled
                                      ? 'bg-teal-700 border-teal-700 text-white'
                                      : 'border-slate-300 bg-white'
                                  }`}
                                >
                                  {isEnabled && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                              </div>

                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-bold text-[#172B3A]">{fn.name}</span>
                                  <span className="text-[10px] font-mono text-slate-400 uppercase">[{fn.id}]</span>
                                </div>
                                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                                  {fn.description}
                                </p>
                              </div>
                            </div>

                            <div className="shrink-0 pt-0.5">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isEnabled
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-500'
                                }`}
                              >
                                {isEnabled ? 'GRANTED' : 'DENIED'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: USER ACCESS LIMITS (Restrict specific users regardless of role) */}
      {/* ========================================================================= */}
      {activeSubTab === 'USER_ACCESS_LIMITS' && (
        <div className="space-y-4">
          {/* Header and Search Controls */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#172B3A]">
                User Account Access Overrides & Limitation Rules
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Apply bespoke restriction policies to specific personnel without altering the organization-wide role baseline.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                placeholder="Search staff by name or login ID..."
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-300 text-xs focus:ring-1 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Baseline Functions</th>
                    <th className="py-3 px-4">Active Overrides / Restrictions</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const roleFns = storageService.getRolePermissions(u.role);
                    const userRestrictionsList = storageService.getUserRestrictedFunctions(u.id);
                    const isRestricted = userRestrictionsList.length > 0;
                    const roleLabel = storageService.getRoleLabel(u.role);

                    return (
                      <tr key={u.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900">{u.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">
                            ID: {u.loginId} • {u.departmentName}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-slate-50 text-slate-700 border-slate-200">
                            {roleLabel}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-600">
                          {roleFns.length} functions
                        </td>
                        <td className="py-3 px-4">
                          {isRestricted ? (
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300 text-[10px] font-bold">
                              {userRestrictionsList.length} blocked modules
                            </span>
                          ) : (
                            <span className="text-emerald-700 text-[11px] font-semibold flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" />
                              <span>Full Role Access</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenUserLimiting(u)}
                            className="px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition cursor-pointer"
                          >
                            Configure Limits
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW CUSTOM ROLE */}
      {/* ========================================================================= */}
      {isAddRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Security Role</h3>
                  <p className="text-xs text-slate-500">Define a custom operational role & initial clearance.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddRoleModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {addRoleError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-900 border border-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{addRoleError}</span>
              </div>
            )}

            <form onSubmit={handleCreateRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Code / Identifier (Unique System Key)
                </label>
                <input
                  type="text"
                  value={newRoleId}
                  onChange={(e) => setNewRoleId(e.target.value)}
                  placeholder="e.g. VIP_ESCORT_OFFICER"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-xs uppercase tracking-wider focus:ring-2 focus:ring-teal-600 outline-none"
                  required
                />
                <span className="text-[10px] text-slate-400">Uppercase letters and underscores only</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Display Label
                </label>
                <input
                  type="text"
                  value={newRoleLabel}
                  onChange={(e) => setNewRoleLabel(e.target.value)}
                  placeholder="e.g. VIP Host Escort"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Description & Scope
                </label>
                <textarea
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                  placeholder="Describe operational responsibilities and physical access boundaries..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-600 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Security Clearance Tier
                  </label>
                  <select
                    value={newRoleTier}
                    onChange={(e) => setNewRoleTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {SECURITY_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Color Theme
                  </label>
                  <select
                    value={newRoleBadgeColor}
                    onChange={(e) => setNewRoleBadgeColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {BADGE_COLOR_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Initial Functions Selectors */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Initial Functional Modules ({newRoleInitialFunctions.length} selected)
                </label>
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-xl p-2 divide-y divide-slate-100 text-xs">
                  {VMS_FUNCTION_DEFINITIONS.map((fn) => {
                    const isChecked = newRoleInitialFunctions.includes(fn.id);
                    return (
                      <label
                        key={fn.id}
                        className="flex items-center gap-2 py-1.5 px-2 hover:bg-slate-50 rounded cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setNewRoleInitialFunctions(newRoleInitialFunctions.filter((f) => f !== fn.id));
                            } else {
                              setNewRoleInitialFunctions([...newRoleInitialFunctions, fn.id]);
                            }
                          }}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="font-semibold text-slate-800">{fn.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">[{fn.category}]</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddRoleModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Role</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT / CHANGE ROLE LABEL & METADATA */}
      {/* ========================================================================= */}
      {isEditRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Edit Role Label & Information
                  </h3>
                  <p className="text-xs text-slate-500">
                    ID: <strong className="font-mono text-indigo-700">{currentRoleDef.id}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditRoleModalOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            {editRoleError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-900 border border-red-200 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{editRoleError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRoleLabelSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Role Display Label (Title)
                </label>
                <input
                  type="text"
                  value={editRoleLabel}
                  onChange={(e) => setEditRoleLabel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Governance Purpose
                </label>
                <textarea
                  value={editRoleDescription}
                  onChange={(e) => setEditRoleDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Security Clearance Tier
                  </label>
                  <select
                    value={editRoleTier}
                    onChange={(e) => setEditRoleTier(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {SECURITY_TIERS.map((tier) => (
                      <option key={tier} value={tier}>
                        {tier}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge Color Theme
                  </label>
                  <select
                    value={editRoleBadgeColor}
                    onChange={(e) => setEditRoleBadgeColor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {BADGE_COLOR_PRESETS.map((preset) => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Live Preview of Badge */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Live UI Badge Preview:
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-bold uppercase border ${editRoleBadgeColor}`}>
                    {editRoleTier}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{editRoleLabel}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div>
                  {currentRoleDef.isSystemRole ? (
                    <button
                      type="button"
                      onClick={handleResetRoleLabelToDefault}
                      className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
                    >
                      Reset to Default Label
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleDeleteRole}
                      className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Role</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditRoleModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Role Label</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONFIGURE INDIVIDUAL USER LIMITS */}
      {/* ========================================================================= */}
      {selectedUserForLimiting && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Limit Access for {selectedUserForLimiting.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Role: <strong className="text-slate-800">{storageService.getRoleLabel(selectedUserForLimiting.role)}</strong> • ID: {selectedUserForLimiting.loginId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserForLimiting(null)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Check the functional modules below that you wish to <strong>RESTRICT / BLOCK</strong> for this specific user, even if their assigned role normally permits it.
            </p>

            <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 p-2">
              {VMS_FUNCTION_DEFINITIONS.map((fn) => {
                const isRestricted = userRestrictions.includes(fn.id);
                const isRolePermitted = storageService
                  .getRolePermissions(selectedUserForLimiting.role)
                  .includes(fn.id);

                return (
                  <div
                    key={fn.id}
                    onClick={() => handleToggleUserRestriction(fn.id)}
                    className={`p-2.5 rounded-lg transition cursor-pointer flex items-center justify-between gap-3 ${
                      isRestricted ? 'bg-amber-50/70 border border-amber-200' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{fn.name}</span>
                        {!isRolePermitted && (
                          <span className="text-[10px] text-slate-400 italic">
                            (Role lacks default access)
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{fn.description}</span>
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          isRestricted
                            ? 'bg-amber-500 text-white'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isRestricted ? 'BLOCKED' : 'ALLOWED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setUserRestrictions([])}
                className="text-xs text-slate-500 hover:text-slate-800 font-semibold underline cursor-pointer"
              >
                Clear All Restrictions
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForLimiting(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUserLimits}
                  disabled={isSavingUserLimit}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingUserLimit ? 'Enforcing...' : 'Save User Access Limits'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
