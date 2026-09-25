import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Palette,
  Check,
  RotateCcw,
  Sparkles,
  Shield,
  Eye,
  Sliders,
  CheckCircle2,
  Trash2,
  Building,
  Monitor,
  Smartphone,
  Printer,
  FileCheck,
  AlertCircle,
  ExternalLink,
  Layers,
  HelpCircle,
  Type
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { WhitelabelBranding } from '../../types';
import { JSAlphaSoftLogo } from '../common/JSAlphaSoftLogo';
import { SuperAdminTypographyThemeCustomizer } from './SuperAdminTypographyThemeCustomizer';
import { getFontStack } from '../../utils/themeApplier';

// Sample enterprise logos for one-click testing
const PRESET_CLIENT_LOGOS = [
  {
    name: 'Tata Group',
    companyName: 'Tata Consultancy Services',
    portalTitle: 'Tata Physical Security & Visitor Portal',
    tagline: 'Zero-Trust Campus Access & Perimeter Defense',
    primaryColor: '#00539B',
    secondaryColor: '#003366',
    // High-res SVG data uri
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60"><rect width="240" height="60" rx="8" fill="%2300539B"/><text x="24" y="38" fill="%23FFFFFF" font-family="Arial, sans-serif" font-size="26" font-weight="900" letter-spacing="4">TATA</text><text x="110" y="37" fill="%2393C5FD" font-family="Arial, sans-serif" font-size="14" font-weight="700">SERVICES</text></svg>`,
  },
  {
    name: 'Reliance Corp',
    companyName: 'Reliance Industries Limited',
    portalTitle: 'Reliance Global Facility Access Hub',
    tagline: 'Growth is Life • Smart Campus Security',
    primaryColor: '#0F4C81',
    secondaryColor: '#E63946',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60"><rect width="240" height="60" rx="8" fill="%230F4C81"/><circle cx="34" cy="30" r="16" fill="%23E63946"/><text x="60" y="38" fill="%23FFFFFF" font-family="Arial, sans-serif" font-size="20" font-weight="800" letter-spacing="1.5">RELIANCE</text></svg>`,
  },
  {
    name: 'Infosys Tech',
    companyName: 'Infosys Enterprise Solutions',
    portalTitle: 'Infosys Visitor Identity & Smart Gates',
    tagline: 'Navigate your next • Smart Campus Gatekeeper',
    primaryColor: '#007CC3',
    secondaryColor: '#1A365D',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60"><rect width="240" height="60" rx="8" fill="%23007CC3"/><text x="24" y="38" fill="%23FFFFFF" font-family="Arial, sans-serif" font-size="24" font-style="italic" font-weight="900">Infosys</text><text x="120" y="36" fill="%23E0F2FE" font-family="Arial, sans-serif" font-size="13" font-weight="600">ENTERPRISE</text></svg>`,
  },
  {
    name: 'Acme Apex',
    companyName: 'Acme Global Defense Systems',
    portalTitle: 'Secure Operations & Visitor Management',
    tagline: 'Restricted Facility Clearance & Identity Hub',
    primaryColor: '#1E293B',
    secondaryColor: '#0F766E',
    svgData: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60"><rect width="240" height="60" rx="8" fill="%231E293B"/><polygon points="20,40 35,15 50,40" fill="%230F766E"/><text x="62" y="38" fill="%23FFFFFF" font-family="Arial, sans-serif" font-size="22" font-weight="900" letter-spacing="2">ACME</text></svg>`,
  },
];

const COLOR_PALETTES = [
  { name: 'Tata Blue', hex: '#00539B' },
  { name: 'Navy Deep', hex: '#123B5D' },
  { name: 'Teal Guard', hex: '#0F766E' },
  { name: 'Emerald Gov', hex: '#047857' },
  { name: 'Dark Slate', hex: '#0F172A' },
  { name: 'Indigo Shield', hex: '#312E81' },
  { name: 'Ruby Crimson', hex: '#991B1B' },
  { name: 'Carbon Black', hex: '#18181B' },
];

interface CompanyLogoWhitelabelViewProps {
  onSuccessToast?: (msg: string) => void;
}

export const CompanyLogoWhitelabelView: React.FC<CompanyLogoWhitelabelViewProps> = ({
  onSuccessToast,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load current state
  const [branding, setBranding] = useState<WhitelabelBranding>(() =>
    storageService.getWhitelabelBranding()
  );

  // Form Fields
  const [isEnabled, setIsEnabled] = useState(branding.enabled);
  const [logoUrl, setLogoUrl] = useState(branding.logoUrl || '');
  const [logoFileName, setLogoFileName] = useState(branding.logoFileName || '');
  const [logoHeightPx, setLogoHeightPx] = useState(branding.logoHeightPx || 36);
  const [companyName, setCompanyName] = useState(branding.companyName || 'Tata Consultancy Services');
  const [portalTitle, setPortalTitle] = useState(branding.portalTitle || 'Enterprise Physical Security Portal');
  const [tagline, setTagline] = useState(branding.tagline || 'Zero-Trust Visitor Identity & Access Governance');
  const [primaryColor, setPrimaryColor] = useState(branding.primaryColor || '#123B5D');
  const [headerBackground, setHeaderBackground] = useState<WhitelabelBranding['headerBackground']>(
    branding.headerBackground || 'DARK_NAVY'
  );
  const [hidePoweredBy, setHidePoweredBy] = useState(branding.hidePoweredBy || false);

  // UI state
  const [activeSection, setActiveSection] = useState<'LOGO_IDENTITY' | 'TYPOGRAPHY_COLORS'>('LOGO_IDENTITY');
  const [isSaving, setIsSaving] = useState(false);
  const [previewBgDark, setPreviewBgDark] = useState(true);
  const [activePreviewTab, setActivePreviewTab] = useState<'HEADER' | 'LOGIN' | 'BADGE'>('HEADER');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // File drag & drop state
  const [isDragging, setIsDragging] = useState(false);

  // Process image file to base64 Data URL
  const handleFileProcess = (file: File) => {
    setUploadError(null);

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please upload a valid image file (PNG, SVG, JPG, or WebP).');
      return;
    }

    // Validate size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      setUploadError('File size exceeds 4MB limit. Please upload an optimized logo file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setLogoUrl(result);
        setLogoFileName(file.name);
        setIsEnabled(true); // Automatically activate whitelabel when logo is uploaded
        setToastMessage(`Logo "${file.name}" loaded. Click "Save & Apply" to apply globally.`);
        setTimeout(() => setToastMessage(null), 4000);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_CLIENT_LOGOS[0]) => {
    setLogoUrl(preset.svgData);
    setLogoFileName(`${preset.name.toLowerCase()}_logo.svg`);
    setCompanyName(preset.companyName);
    setPortalTitle(preset.portalTitle);
    setTagline(preset.tagline);
    setPrimaryColor(preset.primaryColor);
    setIsEnabled(true);
    setToastMessage(`Applied sample preset for ${preset.name}.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
    setLogoFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setToastMessage('Logo removed. System will use default JS AlphaSoft branding.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveWhitelabel = () => {
    setIsSaving(true);
    const res = storageService.updateWhitelabelBranding({
      enabled: isEnabled,
      logoUrl,
      logoFileName,
      logoHeightPx,
      companyName,
      portalTitle,
      tagline,
      primaryColor,
      headerBackground,
      hidePoweredBy,
    });

    setBranding(res.branding);

    setTimeout(() => {
      setIsSaving(false);
      const msg = isEnabled
        ? `Portal whitelabeled successfully for "${companyName}" with custom logo!`
        : 'Whitelabel preferences updated (Mode: Disabled).';
      setToastMessage(msg);
      if (onSuccessToast) onSuccessToast(msg);
      setTimeout(() => setToastMessage(null), 4000);
    }, 350);
  };

  const handleResetToFactoryBrand = () => {
    if (confirm('Are you sure you want to reset all white-labeling and restore default JS AlphaSoft brand?')) {
      const res = storageService.resetWhitelabelBranding();
      setBranding(res.branding);
      setIsEnabled(res.branding.enabled);
      setLogoUrl(res.branding.logoUrl || '');
      setLogoFileName('');
      setCompanyName(res.branding.companyName);
      setPortalTitle(res.branding.portalTitle);
      setTagline(res.branding.tagline);
      setPrimaryColor(res.branding.primaryColor);
      setHeaderBackground(res.branding.headerBackground);
      setHidePoweredBy(res.branding.hidePoweredBy || false);
      const msg = 'Restored factory default JS AlphaSoft brand.';
      setToastMessage(msg);
      if (onSuccessToast) onSuccessToast(msg);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-700 text-white flex items-center justify-center shadow-md shrink-0">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-extrabold uppercase tracking-wider border border-teal-200">
                White-Labeling Engine
              </span>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1.5 ${
                  isEnabled
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                  }`}
                />
                <span>White-Label Status: {isEnabled ? 'ACTIVE' : 'DISABLED'}</span>
              </span>
            </div>
            <h1 className="text-xl font-black text-slate-900 mt-1 tracking-tight">
              Company Logo Upload & Client Portal White-Labeling
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your client organization's corporate logo, customize brand palette colors, headers, and portal typography.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0">
          <button
            type="button"
            onClick={handleResetToFactoryBrand}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Reset to default JS AlphaSoft branding"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset to Factory Brand</span>
          </button>
          <button
            id="save-whitelabel-branding-btn"
            type="button"
            onClick={handleSaveWhitelabel}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Applying...' : 'Save & Apply White-Label'}</span>
          </button>
        </div>
      </div>

      {/* Super Admin Whitelabel & Styling Studio Sub-Navigation */}
      <div className="flex items-center gap-2 bg-[#F4F7FA] p-1.5 rounded-2xl border border-slate-200">
        <button
          type="button"
          id="whitelabel-subtab-logo"
          onClick={() => setActiveSection('LOGO_IDENTITY')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'LOGO_IDENTITY'
              ? 'bg-white text-teal-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-teal-600" />
          <span>1. Client Company Logo & Whitelabel Identity</span>
        </button>

        <button
          type="button"
          id="whitelabel-subtab-typography"
          onClick={() => setActiveSection('TYPOGRAPHY_COLORS')}
          className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'TYPOGRAPHY_COLORS'
              ? 'bg-white text-indigo-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-indigo-600" />
          <span>2. Font, Font Style, Background & ForeColor Studio</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase tracking-wider ml-1">
            Super Admin
          </span>
        </button>
      </div>

      {activeSection === 'TYPOGRAPHY_COLORS' ? (
        <SuperAdminTypographyThemeCustomizer onSuccessToast={onSuccessToast} />
      ) : (
        <>
          {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-xs underline hover:no-underline opacity-70 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Master Mode Switcher Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-[#123B5D]">
            <Monitor className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block">
              Enable Client Portal White-Labeling
            </span>
            <span className="text-[11px] text-slate-500">
              When enabled, your uploaded company logo and client brand name replace vendor references portal-wide.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEnabled(!isEnabled)}
          className={`w-14 h-8 rounded-full p-1 transition-colors duration-200 cursor-pointer flex items-center ${
            isEnabled ? 'bg-teal-600' : 'bg-slate-300'
          }`}
        >
          <div
            className={`w-6 h-6 rounded-full bg-white transition-transform duration-200 shadow-md ${
              isEnabled ? 'translate-x-6' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Logo Upload & Brand Configuration (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Logo Uploader Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-teal-600" />
                  <span>Upload Client Company Logo</span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  High-resolution PNG (transparent background) or vector SVG recommended. Max 4MB.
                </p>
              </div>
              {logoUrl && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Logo</span>
                </button>
              )}
            </div>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center gap-3 select-none ${
                isDragging
                  ? 'border-teal-600 bg-teal-50/70 scale-[1.01]'
                  : logoUrl
                  ? 'border-teal-300 bg-teal-50/20 hover:bg-teal-50/40'
                  : 'border-slate-300 hover:border-teal-500 hover:bg-slate-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />

              {logoUrl ? (
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-center p-4 rounded-xl bg-slate-900/90 border border-slate-700 min-h-[90px] relative overflow-hidden">
                    <img
                      src={logoUrl}
                      alt="Uploaded Logo"
                      style={{ height: `${logoHeightPx}px` }}
                      className="max-w-full object-contain transition-all duration-200"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                    <span className="font-semibold text-slate-700 truncate max-w-[220px]">
                      {logoFileName || 'custom_company_logo'}
                    </span>
                    <span className="text-teal-700 font-bold hover:underline">
                      Click to replace logo
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs">
                    <ImageIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      Drag and drop your company logo here, or <span className="text-teal-700 underline">browse files</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Supports PNG with transparent alpha, SVG vector, JPG, WebP (Ideal aspect: 4:1 or 3:1)
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Logo Scaling Slider */}
            {logoUrl && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-bold text-slate-700">Navbar Logo Height:</span>
                  <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {logoHeightPx}px
                  </span>
                </div>
                <input
                  type="range"
                  min={24}
                  max={60}
                  step={2}
                  value={logoHeightPx}
                  onChange={(e) => setLogoHeightPx(Number(e.target.value))}
                  className="w-40 accent-teal-600 cursor-pointer"
                />
              </div>
            )}

            {/* Presets Gallery for Testing */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Or Apply One-Click Client Preset Sample:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_CLIENT_LOGOS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(preset)}
                    className="p-2 rounded-xl border border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-left transition cursor-pointer text-xs font-semibold text-slate-700 flex flex-col gap-1"
                  >
                    <span className="font-bold text-slate-900">{preset.name}</span>
                    <span className="text-[9px] text-slate-400 font-mono">1-Click Apply</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Client Identity & Naming Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Building className="w-4 h-4 text-indigo-600" />
              <span>Client Portal Titles & Identity</span>
            </h2>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Client Company / Organization Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Tata Consultancy Services"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Portal Header Title (Shown in Navbar & Login)
                </label>
                <input
                  type="text"
                  value={portalTitle}
                  onChange={(e) => setPortalTitle(e.target.value)}
                  placeholder="e.g. Enterprise Physical Security Portal"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Portal Subtitle / Security Slogan
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Zero-Trust Visitor Identity & Access Governance"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-teal-600 outline-none"
                />
              </div>

              {/* Color Theme Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Primary Brand Theme Color
                </label>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {COLOR_PALETTES.map((c) => (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setPrimaryColor(c.hex)}
                      className={`w-7 h-7 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${
                        primaryColor.toLowerCase() === c.hex.toLowerCase()
                          ? 'border-teal-500 scale-110 shadow-sm'
                          : 'border-white hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {primaryColor.toLowerCase() === c.hex.toLowerCase() && (
                        <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-32 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-teal-600 outline-none"
                  />
                  <span className="text-[11px] text-slate-400">Custom Hex Code</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Cross-Platform Previews (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-16"
            style={{ fontFamily: getFontStack(branding.fontFamily) }}
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Whitelabel Preview
                </span>
              </div>

              {/* Preview mode tabs */}
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('HEADER')}
                  className={`px-2 py-1 rounded transition cursor-pointer ${
                    activePreviewTab === 'HEADER' ? 'bg-white text-[#123B5D] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Navbar
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('LOGIN')}
                  className={`px-2 py-1 rounded transition cursor-pointer ${
                    activePreviewTab === 'LOGIN' ? 'bg-white text-[#123B5D] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setActivePreviewTab('BADGE')}
                  className={`px-2 py-1 rounded transition cursor-pointer ${
                    activePreviewTab === 'BADGE' ? 'bg-white text-[#123B5D] shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Pass
                </button>
              </div>
            </div>

            {/* PREVIEW 1: Header Bar */}
            {activePreviewTab === 'HEADER' && (
              <div className="space-y-3">
                <span className="text-[11px] text-slate-500 block">
                  How your global portal header appears to logged-in employees, security staff, and receptionists:
                </span>

                <div
                  className="rounded-xl p-4 shadow-md text-white border border-slate-700/50 flex items-center justify-between gap-3 overflow-hidden transition-all duration-300"
                  style={{ backgroundColor: primaryColor }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Client Logo"
                        style={{ height: `${Math.min(logoHeightPx, 38)}px` }}
                        className="max-w-[130px] object-contain shrink-0"
                      />
                    ) : (
                      <div className="h-8 px-2.5 rounded bg-white/20 flex items-center font-bold text-xs tracking-wider">
                        LOGO
                      </div>
                    )}

                    <div className="min-w-0">
                      <div className="font-extrabold text-xs text-white truncate tracking-tight">
                        {companyName}
                      </div>
                      <div className="text-[9px] text-teal-200 truncate opacity-90">
                        {portalTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">
                      LIVE
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-[11px] text-slate-600">
                  <div className="font-bold text-slate-800">Navbar Branding Behavior:</div>
                  <div>• Replaces default vendor emblem with your company logo</div>
                  <div>• Displays your client company name: <strong>{companyName}</strong></div>
                  <div>• Sets primary theme accent: <code className="font-mono text-teal-700 font-bold">{primaryColor}</code></div>
                </div>
              </div>
            )}

            {/* PREVIEW 2: Login Portal */}
            {activePreviewTab === 'LOGIN' && (
              <div className="space-y-3">
                <span className="text-[11px] text-slate-500 block">
                  How external guests and enterprise personnel see the portal sign-in gateway:
                </span>

                <div className="rounded-xl border border-slate-200 p-5 bg-gradient-to-b from-slate-50 to-white shadow-inner space-y-3 text-center">
                  <div className="flex items-center justify-center">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Client Logo"
                        style={{ height: `${Math.min(logoHeightPx * 1.1, 48)}px` }}
                        className="max-w-[160px] object-contain"
                      />
                    ) : (
                      <div className="h-10 px-4 rounded-lg bg-slate-200 flex items-center font-bold text-xs">
                        CLIENT LOGO
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {companyName}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {tagline}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs text-left space-y-1.5 text-[10px]">
                    <div className="font-bold text-slate-700">Login ID Credentials</div>
                    <div className="w-full h-5 rounded bg-slate-100 border border-slate-200" />
                    <div className="w-full h-5 rounded bg-slate-100 border border-slate-200" />
                    <div
                      className="w-full h-6 rounded text-white font-bold flex items-center justify-center text-[10px]"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Authenticate to Portal
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW 3: Visitor Badge Header */}
            {activePreviewTab === 'BADGE' && (
              <div className="space-y-3">
                <span className="text-[11px] text-slate-500 block">
                  How your corporate logo appears when printed on Zebra/Brother thermal visitor passes:
                </span>

                <div className="rounded-xl border-2 border-slate-300 p-4 bg-white shadow-sm space-y-2 text-center font-mono">
                  <div className="flex items-center justify-between border-b pb-2">
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt="Badge Logo"
                        style={{ height: '28px' }}
                        className="max-w-[100px] object-contain"
                      />
                    ) : (
                      <span className="text-xs font-bold text-slate-900">{companyName.slice(0, 12)}</span>
                    )}
                    <span className="text-[9px] font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-300">
                      VISITOR PASS
                    </span>
                  </div>

                  <div className="py-2">
                    <div className="text-base font-black text-slate-900 font-sans">
                      Sneha Kulkarni
                    </div>
                    <div className="text-[10px] text-slate-500">
                      TCS Global • Host: Ananya Sharma
                    </div>
                  </div>

                  <div className="p-2 bg-slate-50 border rounded text-[9px] text-slate-600 font-sans">
                    Authorized on-site at {companyName}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleSaveWhitelabel}
                disabled={isSaving}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>Save & Apply Whitelabeling</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
      )}
    </div>
  );
};
