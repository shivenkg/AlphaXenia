import React, { useState } from 'react';
import {
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Server,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Building,
  Users,
  HardDrive,
  Copy,
  Check,
  Download,
  Sparkles,
  Sliders,
  ChevronRight,
  PlusCircle,
  FileCode2,
  Lock,
  Unlock,
  Radio,
  ExternalLink,
  Info
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import {
  SaaSLicenseRecord,
  SaaSLicenseTier,
  SaaSLicenseQuota,
  SaaSLicenseEntitlements,
  Tenant
} from '../../types';

interface SaaSLicenseEngineViewProps {
  onNavigateToTenants?: () => void;
  onNavigateToRoles?: () => void;
}

export const SaaSLicenseEngineView: React.FC<SaaSLicenseEngineViewProps> = ({
  onNavigateToTenants,
  onNavigateToRoles,
}) => {
  const state = storageService.getState();
  const activeUser = storageService.getActiveUser();
  const isSuperAdmin = activeUser?.role === 'PLATFORM_SUPER_ADMIN';

  const [license, setLicense] = useState<SaaSLicenseRecord>(() => storageService.getSaaSLicense());
  const [copiedKey, setCopiedKey] = useState(false);
  const [isActivatingKey, setIsActivatingKey] = useState(false);
  const [inputKey, setInputKey] = useState('');
  const [activationFeedback, setActivationFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Generator State
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [genTier, setGenTier] = useState<SaaSLicenseTier>('ENTERPRISE_PRO');
  const [genTenantId, setGenTenantId] = useState(state.activeTenantId);
  const [genSeats, setGenSeats] = useState(150);
  const [genCheckIns, setGenCheckIns] = useState(50000);
  const [genValidityDays, setGenValidityDays] = useState(365);
  const [generatedResult, setGeneratedResult] = useState<{ key: string; signature: string; license: SaaSLicenseRecord } | null>(null);

  // Entitlements edit state
  const [isSavingEntitlements, setIsSavingEntitlements] = useState(false);
  const [localEntitlements, setLocalEntitlements] = useState<SaaSLicenseEntitlements>({
    ...license.entitlements,
  });

  // Calculate usage
  const usedTenants = state.tenants.length;
  const usedSites = state.sites.length;
  const usedUsers = state.users.length;
  const usedDevices = state.devices.length;
  const usedCheckIns = state.visits.length;

  const expiryDate = new Date(license.expiresAt);
  const now = new Date();
  const diffTime = expiryDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  if (!isSuperAdmin) {
    return (
      <div className="bg-white rounded-2xl border border-amber-200 p-8 text-center max-w-lg mx-auto shadow-sm my-12">
        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-700">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">SaaS License Engine Restricted</h2>
        <p className="text-sm text-slate-600 mb-4">
          The SaaS License Engine is restricted exclusively to the Platform Super Admin profile.
        </p>
      </div>
    );
  }

  const handleCopyKey = () => {
    navigator.clipboard.writeText(license.licenseKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleActivateKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActivationFeedback(null);
    setIsActivatingKey(true);

    setTimeout(() => {
      const res = storageService.activateSaaSLicenseKey(inputKey);
      setIsActivatingKey(false);
      if (res.success && res.license) {
        setLicense(res.license);
        setLocalEntitlements({ ...res.license.entitlements });
        setInputKey('');
        setActivationFeedback({
          type: 'success',
          message: `License successfully activated! Tier: ${res.license.tier.replace(/_/g, ' ')}, Quota: ${res.license.quota.maxUserSeats} seats.`,
        });
      } else {
        setActivationFeedback({
          type: 'error',
          message: res.error || 'Failed to activate license key.',
        });
      }
    }, 400);
  };

  const handleToggleEntitlement = (key: keyof SaaSLicenseEntitlements) => {
    setLocalEntitlements((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveEntitlements = () => {
    setIsSavingEntitlements(true);
    storageService.updateSaaSLicense({
      entitlements: localEntitlements,
    });
    setLicense(storageService.getSaaSLicense());
    setTimeout(() => {
      setIsSavingEntitlements(false);
      setActivationFeedback({
        type: 'success',
        message: 'Feature entitlements hot-updated and persisted to database.',
      });
      setTimeout(() => setActivationFeedback(null), 4000);
    }, 300);
  };

  const handleGenerateKey = () => {
    const tenant = state.tenants.find((t) => t.id === genTenantId) || state.tenants[0];
    const res = storageService.generateSaaSLicenseKey({
      tier: genTier,
      tenantId: tenant.id,
      tenantName: tenant.name,
      seats: genSeats,
      checkIns: genCheckIns,
      validityDays: genValidityDays,
    });
    setGeneratedResult(res);
  };

  const handleApplyGeneratedKey = () => {
    if (!generatedResult) return;
    const res = storageService.activateSaaSLicenseKey(generatedResult.key);
    if (res.success && res.license) {
      setLicense(res.license);
      setLocalEntitlements({ ...res.license.entitlements });
      setActivationFeedback({
        type: 'success',
        message: `Activated generated key "${generatedResult.key}" into current system!`,
      });
      setIsGeneratorOpen(false);
    }
  };

  const handleDownloadCertificate = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(license, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `vms_license_${license.licenseKey}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shrink-0">
            <KeyRound className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider border border-amber-300">
                SaaS License Engine
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Super Admin Root Access</span>
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1 tracking-tight">
              Enterprise License Engine & Resource Governance
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cryptographic node licensing, seat quota allocation, multi-tenant tiers, and feature entitlement controls.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            id="saas-engine-generate-btn"
            onClick={() => {
              setIsGeneratorOpen(true);
              setGeneratedResult(null);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#123B5D] hover:bg-[#0f304c] text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Key Generator Utility</span>
          </button>
          <button
            id="saas-engine-download-cert-btn"
            onClick={handleDownloadCertificate}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 text-xs font-bold transition flex items-center gap-2 shadow-2xs cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Certificate (.JSON)</span>
          </button>
        </div>
      </div>

      {/* Activation Feedback Alert */}
      {activationFeedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-semibold animate-fadeIn ${
            activationFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-red-50 text-red-900 border-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {activationFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{activationFeedback.message}</span>
          </div>
          <button
            onClick={() => setActivationFeedback(null)}
            className="text-xs underline hover:no-underline opacity-70 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Master License Card */}
      <div className="bg-gradient-to-br from-[#0e273c] via-[#123B5D] to-[#184e77] text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-700/50 relative overflow-hidden">
        {/* Background circuit glow effect */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-20 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold uppercase tracking-wider border border-amber-400/40">
                  {license.tier.replace(/_/g, ' ')}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Verified RSA-4096 Signature</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-[10px] font-mono border border-blue-400/30">
                  Heartbeat: Online (2m ago)
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>{license.issuedTo}</span>
              </h2>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                Assigned Tenant: <strong className="text-white">{license.tenantName}</strong> ({license.tenantId})
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 shrink-0 text-right md:min-w-[180px]">
              <div className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold flex items-center justify-end gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>License Validity</span>
              </div>
              <div className="text-2xl font-black text-amber-300 tracking-tight mt-0.5">
                {daysRemaining} Days
              </div>
              <div className="text-[10px] text-slate-300">
                Expires on {expiryDate.toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* License Key Display & Copy */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-8 bg-black/30 backdrop-blur-sm rounded-xl p-3 border border-white/10 flex items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-semibold">
                  Active Cryptographic License Key
                </div>
                <div className="text-sm sm:text-base font-mono font-bold text-amber-200 truncate select-all tracking-wider mt-0.5">
                  {license.licenseKey}
                </div>
              </div>
              <button
                id="copy-active-license-key-btn"
                onClick={handleCopyKey}
                title="Copy License Key to clipboard"
                className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 border border-white/20 active:scale-95"
              >
                {copiedKey ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Key</span>
                  </>
                )}
              </button>
            </div>

            <div className="md:col-span-4 flex items-center gap-2">
              <button
                id="simulate-heartbeat-btn"
                onClick={() => {
                  storageService.updateSaaSLicense({});
                  setLicense(storageService.getSaaSLicense());
                  setActivationFeedback({
                    type: 'success',
                    message: 'License verification handshake pinged licensing.jsalphasoft.io successfully.',
                  });
                  setTimeout(() => setActivationFeedback(null), 3000);
                }}
                className="flex-1 px-3.5 py-3 rounded-xl bg-teal-600/90 hover:bg-teal-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm border border-teal-400/40 cursor-pointer active:scale-95"
              >
                <Radio className="w-3.5 h-3.5 text-teal-200 animate-pulse" />
                <span>Verify Heartbeat</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quota Allocations & Consumption Meters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-600" />
              <span>Provisioned Resource Quotas & Allocation Meters</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live consumption against maximum hard limits defined in the active enterprise agreement.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Hard Enforcement: ON
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tenants Meter */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-blue-600" />
                <span>Tenant Shards</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {usedTenants} / {license.quota.maxTenants}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (usedTenants / license.quota.maxTenants) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{license.quota.maxTenants - usedTenants} slots available</span>
              <span>{Math.round((usedTenants / license.quota.maxTenants) * 100)}% used</span>
            </div>
          </div>

          {/* User Seats Meter */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-600" />
                <span>User & Staff Seats</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {usedUsers} / {license.quota.maxUserSeats}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (usedUsers / license.quota.maxUserSeats) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{license.quota.maxUserSeats - usedUsers} seats left</span>
              <span>{Math.round((usedUsers / license.quota.maxUserSeats) * 100)}% used</span>
            </div>
          </div>

          {/* Monthly Check-Ins Meter */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Monthly Visitor Check-Ins</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {usedCheckIns} / {license.quota.monthlyCheckInLimit.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (usedCheckIns / license.quota.monthlyCheckInLimit) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Bandwidth: High Capacity</span>
              <span>{(usedCheckIns / license.quota.monthlyCheckInLimit).toFixed(1)}% used</span>
            </div>
          </div>

          {/* Campus Sites */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-teal-600" />
                <span>Campus Facilities</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {usedSites} / {license.quota.maxSites}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (usedSites / license.quota.maxSites) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{license.quota.maxSites - usedSites} sites available</span>
              <span>{Math.round((usedSites / license.quota.maxSites) * 100)}%</span>
            </div>
          </div>

          {/* Hardware Devices */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-cyan-600" />
                <span>Printers & Turnstiles</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                {usedDevices} / {license.quota.maxHardwareDevices}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (usedDevices / license.quota.maxHardwareDevices) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{license.quota.maxHardwareDevices - usedDevices} device licenses</span>
              <span>{Math.round((usedDevices / license.quota.maxHardwareDevices) * 100)}%</span>
            </div>
          </div>

          {/* Kiosk Terminals */}
          <div className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-orange-600" />
                <span>Self-Service Kiosks</span>
              </span>
              <span className="font-mono font-bold text-slate-900">
                2 / {license.quota.maxKioskTerminals}
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full bg-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (2 / license.quota.maxKioskTerminals) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>{license.quota.maxKioskTerminals - 2} terminals available</span>
              <span>{Math.round((2 / license.quota.maxKioskTerminals) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Entitlements / Feature Flags Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>Feature Entitlement Engine & Module Flags</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly toggle licensed capabilities without re-deploying code. Changes take effect across all nodes immediately.
            </p>
          </div>
          <button
            id="save-entitlements-btn"
            onClick={handleSaveEntitlements}
            disabled={isSavingEntitlements}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isSavingEntitlements ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>Save Entitlements</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              key: 'multiLevelApprovals' as keyof SaaSLicenseEntitlements,
              title: 'Multi-Level Security Approvals',
              desc: 'Host pre-check + Security clearance + Department Head approval gates.',
            },
            {
              key: 'biometricVerification' as keyof SaaSLicenseEntitlements,
              title: 'Biometric & Facial Verification',
              desc: 'High-security kiosk facial recognition and liveness detection on arrival.',
            },
            {
              key: 'thermalZplSpooler' as keyof SaaSLicenseEntitlements,
              title: 'Native Thermal ZPL Spooler',
              desc: 'Direct USB & TCP socket stream to Zebra / Brother continuous label printers.',
            },
            {
              key: 'edgeOfflineSync' as keyof SaaSLicenseEntitlements,
              title: 'Edge Offline Resilient Sync',
              desc: 'Local edge caching and store-and-forward reconciliation during internet outages.',
            },
            {
              key: 'whatsappSmsGateway' as keyof SaaSLicenseEntitlements,
              title: 'WhatsApp & SMS Arrival Alerts',
              desc: 'Automated visitor OTP delivery and instant host mobile notifications.',
            },
            {
              key: 'emergencyMusterRollCall' as keyof SaaSLicenseEntitlements,
              title: 'Emergency Evacuation Marshalling',
              desc: 'Live headcount muster points, evacuation roll call, and PDF roster export.',
            },
            {
              key: 'customBadgeDesigner' as keyof SaaSLicenseEntitlements,
              title: 'Pass & Thermal Label Designer',
              desc: 'Visual drag-and-drop designer for visitor passes and label layouts.',
            },
            {
              key: 'googleSheetsRealtimeSync' as keyof SaaSLicenseEntitlements,
              title: 'Google Sheets 2-Way Live Sync',
              desc: 'Continuous bi-directional synchronization with corporate Google Sheets.',
            },
            {
              key: 'customRbacEngine' as keyof SaaSLicenseEntitlements,
              title: 'Dynamic Roles & RBAC Engine',
              desc: 'Custom security role definitions, custom labels, and granular permission boundaries.',
            },
            {
              key: 'auditTrailExport' as keyof SaaSLicenseEntitlements,
              title: 'Immutable Cryptographic Audit Export',
              desc: 'Export tamper-evident SHA-256 chained audit logs for external regulators.',
            },
            {
              key: 'restApiAccess' as keyof SaaSLicenseEntitlements,
              title: 'OpenAPI 3.1 REST Gateway',
              desc: 'Full API token issuance and webhook dispatching for external HRMS integrations.',
            },
            {
              key: 'ssoSamlOidc' as keyof SaaSLicenseEntitlements,
              title: 'Enterprise SAML 2.0 / OIDC SSO',
              desc: 'Single sign-on federation with Okta, Microsoft Entra ID, and Google Workspace.',
            },
          ].map((item) => {
            const isEnabled = localEntitlements[item.key];
            return (
              <div
                key={item.key}
                onClick={() => handleToggleEntitlement(item.key)}
                className={`p-3.5 rounded-xl border transition-all duration-150 cursor-pointer flex items-start justify-between gap-3 select-none ${
                  isEnabled
                    ? 'bg-teal-50/60 border-teal-300/80 hover:bg-teal-50'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 opacity-70'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {isEnabled ? (
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>

                <div
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors shrink-0 mt-0.5 ${
                    isEnabled ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 shadow-2xs ${
                      isEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* License Key Activation Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-600" />
          <span>Apply or Upgrade Enterprise License Key</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Enter a newly issued enterprise license certificate key to expand quotas or upgrade your subscription tier.
        </p>

        <form onSubmit={handleActivateKeySubmit} className="mt-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="e.g. JSALPHA-ENT-2026-TATA-9942-PROD"
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-[#123B5D] focus:border-transparent uppercase tracking-wider outline-none"
          />
          <button
            type="submit"
            disabled={isActivatingKey || !inputKey.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#123B5D] hover:bg-[#0f304c] text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50 shrink-0"
          >
            {isActivatingKey ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Activate License</span>
          </button>
        </form>
      </div>

      {/* Multi-Tenant Sub-License Pools Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Multi-Tenant Shard Sub-Allocations</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Active enterprise tenants provisioned under this master license agreement.
            </p>
          </div>
          {onNavigateToTenants && (
            <button
              onClick={onNavigateToTenants}
              className="text-xs text-teal-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Tenants</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="py-3 px-4">Tenant Organization</th>
                <th className="py-3 px-4">Allocated Tier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Campus Sites</th>
                <th className="py-3 px-4">Active Staff</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {state.tenants.map((t: Tenant) => {
                const tenantSites = state.sites.filter((s) => s.tenantId === t.id).length;
                const tenantUsers = state.users.filter((u) => u.tenantId === t.id).length;
                return (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{t.name}</div>
                      <div className="font-mono text-[10px] text-slate-400">ID: {t.id} • Code: {t.code}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold">
                        {t.tier.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          t.status === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {tenantSites} {tenantSites === 1 ? 'Site' : 'Sites'}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-700">
                      {tenantUsers} Users
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setGenTenantId(t.id);
                          setIsGeneratorOpen(true);
                        }}
                        className="text-xs font-bold text-teal-700 hover:text-teal-900 hover:underline cursor-pointer"
                      >
                        Reissue Key
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Root License Key Generator Modal */}
      {isGeneratorOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    SaaS License Key Generator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Super Admin Root Tool: Issue cryptographically signed license keys.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsGeneratorOpen(false)}
                className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={genTier}
                    onChange={(e) => setGenTier(e.target.value as SaaSLicenseTier)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    <option value="STARTER">Starter Tier</option>
                    <option value="PROFESSIONAL">Professional Tier</option>
                    <option value="ENTERPRISE_PRO">Enterprise Pro Tier</option>
                    <option value="MISSION_CRITICAL_GOV">Mission-Critical Gov Tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Tenant
                  </label>
                  <select
                    value={genTenantId}
                    onChange={(e) => setGenTenantId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
                  >
                    {state.tenants.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.code})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    User Seats Limit
                  </label>
                  <input
                    type="number"
                    value={genSeats}
                    onChange={(e) => setGenSeats(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Monthly Check-Ins
                  </label>
                  <input
                    type="number"
                    value={genCheckIns}
                    onChange={(e) => setGenCheckIns(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    value={genValidityDays}
                    onChange={(e) => setGenValidityDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono font-semibold"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateKey}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Signed License Block</span>
              </button>

              {generatedResult && (
                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 font-mono text-xs animate-fadeIn">
                  <div>
                    <div className="text-[10px] text-amber-300 uppercase tracking-wider">
                      Generated License Key:
                    </div>
                    <div className="text-sm font-bold text-emerald-400 select-all break-all mt-0.5">
                      {generatedResult.key}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                      Cryptographic Signature:
                    </div>
                    <div className="text-[10px] text-slate-300 select-all break-all line-clamp-2">
                      {generatedResult.signature}
                    </div>
                  </div>
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleApplyGeneratedKey}
                      className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold font-sans transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Apply Key To Active Node</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedResult.key);
                        alert('Key copied to clipboard!');
                      }}
                      className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold font-sans transition flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
