import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  QrCode,
  Calendar,
  Building2,
  ChevronRight,
  Sliders,
  Send,
  Eye,
  Key,
  Printer,
  Sparkles,
  ArrowRight,
  Layers,
  Search,
  Filter,
  Type,
  Maximize2
} from 'lucide-react';
import {
  getFontStack,
  ensureGoogleFontsLoaded,
  SUPPORTED_FONTS,
} from '../../utils/themeApplier';

export interface RealTimeThemePreviewGalleryProps {
  fontFamily: string;
  fontStyle: 'normal' | 'italic';
  fontWeight: '400' | '500' | '600' | '700' | '800';
  letterSpacing: 'normal' | 'tight' | 'wide' | 'wider';
  textTransform: 'none' | 'uppercase' | 'capitalize';
  fontSizeBase: '13px' | '14px' | '15px' | '16px';
  fontColor: string;
  headingColor: string;
  mutedFontColor: string;
  backgroundColor: string;
  surfaceColor: string;
  foreColor: string;
  foreColorText: string;
  secondaryForeColor: string;
  companyName?: string;
  onFontFamilyChange?: (newFont: string) => void;
}

export const RealTimeThemePreviewGallery: React.FC<RealTimeThemePreviewGalleryProps> = ({
  fontFamily,
  fontStyle,
  fontWeight,
  letterSpacing,
  textTransform,
  fontSizeBase,
  fontColor,
  headingColor,
  mutedFontColor,
  backgroundColor,
  surfaceColor,
  foreColor,
  foreColorText,
  secondaryForeColor,
  companyName = 'Tata Consultancy Services',
  onFontFamilyChange,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'cards' | 'buttons' | 'forms' | 'badges'>('all');
  const [sampleToggle, setSampleToggle] = useState(true);
  const [sampleCheckbox, setSampleCheckbox] = useState(true);
  const [sampleInputValue, setSampleInputValue] = useState('Dr. Vikram Sethi');
  const [buttonClickFeedback, setButtonClickFeedback] = useState<string | null>(null);

  // Ensure Google Fonts for the selected family are loaded immediately
  useEffect(() => {
    ensureGoogleFontsLoaded();
  }, [fontFamily]);

  const fontStack = getFontStack(fontFamily);

  const trackingCss =
    letterSpacing === 'tight'
      ? '-0.025em'
      : letterSpacing === 'wide'
      ? '0.025em'
      : letterSpacing === 'wider'
      ? '0.05em'
      : 'normal';

  const headingTransformCss = textTransform === 'uppercase' ? 'uppercase' : 'inherit';

  const containerStyle: React.CSSProperties = {
    fontFamily: fontStack,
    fontStyle: fontStyle,
    fontSize: fontSizeBase,
    letterSpacing: trackingCss,
    color: fontColor,
    backgroundColor: backgroundColor,
  };

  const handleButtonClick = (actionName: string) => {
    setButtonClickFeedback(`Clicked: ${actionName}`);
    setTimeout(() => setButtonClickFeedback(null), 1800);
  };

  return (
    <div className="space-y-4">
      {/* Scoped CSS Rule Injection ensuring buttons, inputs, headings & body strictly use the selected font */}
      <style>{`
        .realtime-preview-scope,
        .realtime-preview-scope * {
          font-family: ${fontStack} !important;
        }
        .realtime-preview-scope button,
        .realtime-preview-scope input,
        .realtime-preview-scope select,
        .realtime-preview-scope textarea {
          font-family: ${fontStack} !important;
        }
        .realtime-preview-scope .preserve-mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
        }
      `}</style>

      {/* Category Filter & Font Selector Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Filter UI:
          </span>
          {[
            { id: 'all', label: 'All UI Components' },
            { id: 'cards', label: 'Cards & Panels' },
            { id: 'buttons', label: 'Buttons & Triggers' },
            { id: 'forms', label: 'Inputs & Controls' },
            { id: 'badges', label: 'Badges & Titles' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Live Font-Family Telemetry & Quick Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs">
            <Type className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span className="text-[10px] font-bold uppercase text-indigo-700">Live Font:</span>
            {onFontFamilyChange ? (
              <select
                value={fontFamily}
                onChange={(e) => onFontFamilyChange(e.target.value)}
                className="bg-transparent font-bold text-indigo-950 text-xs focus:outline-none cursor-pointer border-none p-0"
                title="Change font family directly in preview"
              >
                {SUPPORTED_FONTS.map((f) => (
                  <option key={f.name} value={f.name}>
                    {f.name} ({f.category})
                  </option>
                ))}
              </select>
            ) : (
              <span className="font-bold text-indigo-950">{fontFamily}</span>
            )}
            <span className="text-[10px] text-indigo-600 font-semibold">({fontWeight})</span>
          </div>

          {buttonClickFeedback && (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-fadeIn">
              ✓ {buttonClickFeedback}
            </span>
          )}
        </div>
      </div>

      {/* Live Interactive Specimen Canvas */}
      <div
        className="realtime-preview-scope p-5 sm:p-6 rounded-2xl border border-slate-300/80 shadow-inner space-y-6 transition-all duration-200"
        style={containerStyle}
      >
        {/* SECTION 1: BUTTONS & ACTION CONTROLS */}
        {(filterCategory === 'all' || filterCategory === 'buttons') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-300/60">
              <span
                className="text-[11px] font-bold tracking-wider uppercase font-mono"
                style={{ color: secondaryForeColor }}
              >
                Button Styles & Interactive States
              </span>
              <span className="text-[10px] font-mono" style={{ color: mutedFontColor }}>
                ForeColor: {foreColor} • Contrast: {foreColorText}
              </span>
            </div>

            <div
              className="p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3"
              style={{ backgroundColor: surfaceColor }}
            >
              <div className="flex flex-wrap items-center gap-3">
                {/* 1. Primary Solid Button */}
                <button
                  type="button"
                  onClick={() => handleButtonClick('Primary Check-In')}
                  style={{
                    backgroundColor: foreColor,
                    color: foreColorText,
                    fontWeight: fontWeight,
                  }}
                  className="px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-95 flex items-center gap-2 hover:opacity-90"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Primary Solid Button</span>
                </button>

                {/* 2. Secondary Outlined Button */}
                <button
                  type="button"
                  onClick={() => handleButtonClick('Secondary Outlined')}
                  style={{
                    borderColor: foreColor,
                    color: foreColor,
                    backgroundColor: 'transparent',
                    fontWeight: fontWeight,
                  }}
                  className="px-4 py-2 rounded-xl text-xs border-2 transition cursor-pointer active:scale-95 flex items-center gap-2 hover:bg-slate-50/20"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Outlined Accent Button</span>
                </button>

                {/* 3. Secondary Forecolor Action */}
                <button
                  type="button"
                  onClick={() => handleButtonClick('Secondary Accent Action')}
                  style={{
                    backgroundColor: secondaryForeColor,
                    color: '#FFFFFF',
                    fontWeight: fontWeight,
                  }}
                  className="px-4 py-2 rounded-xl text-xs transition cursor-pointer shadow-xs active:scale-95 flex items-center gap-2 hover:opacity-90"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secondary ForeColor</span>
                </button>

                {/* 4. Ghost / Subtle Action */}
                <button
                  type="button"
                  onClick={() => handleButtonClick('Ghost Details')}
                  style={{
                    color: fontColor,
                    fontWeight: fontWeight,
                  }}
                  className="px-3.5 py-2 rounded-xl text-xs transition cursor-pointer hover:bg-black/5 active:scale-95 flex items-center gap-1.5"
                >
                  <span>Ghost Action</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>

                {/* 5. Disabled State */}
                <button
                  type="button"
                  disabled
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-200 text-slate-400 cursor-not-allowed flex items-center gap-1.5 opacity-60"
                >
                  <span>Disabled Action</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: CARDS & CONTAINER PANELS */}
        {(filterCategory === 'all' || filterCategory === 'cards') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-300/60">
              <span
                className="text-[11px] font-bold tracking-wider uppercase font-mono"
                style={{ color: secondaryForeColor }}
              >
                Card Surfaces & Layout Containers
              </span>
              <span className="text-[10px] font-mono" style={{ color: mutedFontColor }}>
                Surface: {surfaceColor}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Active Visitor Clearance Card */}
              <div
                className="p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3.5 relative overflow-hidden transition-all"
                style={{ backgroundColor: surfaceColor }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: foreColor }}
                />

                <div className="flex items-start justify-between gap-2 pt-1">
                  <div>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider block"
                      style={{ color: secondaryForeColor }}
                    >
                      Security Clearance Approved
                    </span>
                    <h3
                      className="text-base font-extrabold mt-0.5 tracking-tight"
                      style={{
                        color: headingColor,
                        textTransform: headingTransformCss,
                        fontWeight: fontWeight,
                      }}
                    >
                      {sampleInputValue || 'Dr. Vikram Sethi'}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: mutedFontColor }}>
                      Defense Systems Directorate • Host: Ananya Sharma
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs font-bold text-xs"
                    style={{
                      backgroundColor: foreColor,
                      color: foreColorText,
                    }}
                  >
                    VS
                  </div>
                </div>

                <div
                  className="p-3 rounded-xl border border-slate-200/70 text-xs space-y-1.5"
                  style={{ backgroundColor: backgroundColor }}
                >
                  <div className="flex items-center justify-between">
                    <span style={{ color: mutedFontColor }}>Pass ID:</span>
                    <span className="font-mono font-bold" style={{ color: fontColor }}>
                      PAS-2026-8841
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: mutedFontColor }}>Permitted Zone:</span>
                    <span className="font-semibold" style={{ color: fontColor }}>
                      Zone C (Executive & Labs)
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ color: mutedFontColor }}>Valid Until:</span>
                    <span className="font-semibold" style={{ color: fontColor }}>
                      18:00 IST Today
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${secondaryForeColor}20`,
                      color: secondaryForeColor,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: secondaryForeColor }}
                    />
                    On-Premises (Gate 01)
                  </span>

                  <button
                    type="button"
                    onClick={() => handleButtonClick('Print Badge')}
                    style={{
                      backgroundColor: foreColor,
                      color: foreColorText,
                      fontWeight: fontWeight,
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs transition cursor-pointer shadow-2xs hover:opacity-90 active:scale-95 flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Operations Metric KPI Card */}
              <div
                className="p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 flex flex-col justify-between"
                style={{ backgroundColor: surfaceColor }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${foreColor}15`,
                        color: foreColor,
                      }}
                    >
                      <User className="w-4 h-4" />
                    </div>
                    <span
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: mutedFontColor }}
                    >
                      Live Facility Occupancy
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: `${secondaryForeColor}10`,
                      color: secondaryForeColor,
                      borderColor: `${secondaryForeColor}30`,
                    }}
                  >
                    +18% Peak
                  </span>
                </div>

                <div>
                  <div
                    className="text-3xl font-black tracking-tight"
                    style={{
                      color: headingColor,
                      fontWeight: fontWeight,
                    }}
                  >
                    148
                  </div>
                  <p className="text-xs mt-1" style={{ color: mutedFontColor }}>
                    Active checked-in personnel and pre-registered guests inside corporate perimeter.
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span style={{ color: fontColor }}>Campus: Whitefield SEZ</span>
                  <button
                    type="button"
                    onClick={() => handleButtonClick('View Occupancy Ledger')}
                    style={{ color: foreColor, fontWeight: fontWeight }}
                    className="hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Ledger</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Card 3: System Alert Notification Card */}
              <div
                className="p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3 flex flex-col justify-between"
                style={{ backgroundColor: surfaceColor }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${secondaryForeColor}20`,
                      color: secondaryForeColor,
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4
                      className="text-sm font-bold"
                      style={{
                        color: headingColor,
                        textTransform: headingTransformCss,
                        fontWeight: fontWeight,
                      }}
                    >
                      Offline Edge Buffer Synchronized
                    </h4>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: fontColor }}>
                      All turnstile access tokens and local thermal print jobs synced with cloud ledger.
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span style={{ color: mutedFontColor }}>Zero-Trust Audit Log #9942</span>
                  <span
                    className="font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: `${foreColor}15`,
                      color: foreColor,
                    }}
                  >
                    2s ago
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: FORM INPUTS & INTERACTIVE CONTROLS */}
        {(filterCategory === 'all' || filterCategory === 'forms') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-300/60">
              <span
                className="text-[11px] font-bold tracking-wider uppercase font-mono"
                style={{ color: secondaryForeColor }}
              >
                Form Inputs & Form Controls
              </span>
              <span className="text-[10px] font-mono" style={{ color: mutedFontColor }}>
                Font: {fontFamily}
              </span>
            </div>

            <div
              className="p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4"
              style={{ backgroundColor: surfaceColor }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Text Field Input */}
                <div>
                  <label
                    className="block text-xs font-bold mb-1.5"
                    style={{ color: headingColor }}
                  >
                    Visitor Full Name (Editable)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={sampleInputValue}
                      onChange={(e) => setSampleInputValue(e.target.value)}
                      placeholder="Type name here to test font rendering..."
                      style={{
                        color: fontColor,
                        backgroundColor: backgroundColor,
                        borderColor: `${foreColor}40`,
                      }}
                      className="w-full px-3 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2"
                    />
                  </div>
                  <span className="text-[10px] mt-1 block" style={{ color: mutedFontColor }}>
                    Type above to preview character glyphs & kerning
                  </span>
                </div>

                {/* Dropdown Select */}
                <div>
                  <label
                    className="block text-xs font-bold mb-1.5"
                    style={{ color: headingColor }}
                  >
                    Security Clearance Tier
                  </label>
                  <select
                    style={{
                      color: fontColor,
                      backgroundColor: backgroundColor,
                      borderColor: `${foreColor}40`,
                    }}
                    className="w-full px-3 py-2 rounded-xl text-xs font-medium border focus:outline-none focus:ring-2 cursor-pointer"
                  >
                    <option>Tier 1 — General Escorted Visitor</option>
                    <option>Tier 2 — Restricted Perimeter Clearance</option>
                    <option>Tier 3 — High-Security Data Center</option>
                  </select>
                </div>

                {/* Interactive Toggles & Checkbox */}
                <div>
                  <label
                    className="block text-xs font-bold mb-1.5"
                    style={{ color: headingColor }}
                  >
                    Access Checkbox & Switch
                  </label>
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={sampleCheckbox}
                        onChange={(e) => setSampleCheckbox(e.target.checked)}
                        className="rounded cursor-pointer"
                        style={{ accentColor: foreColor }}
                      />
                      <span style={{ color: fontColor }}>Require NDA Digital Signature</span>
                    </label>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs" style={{ color: fontColor }}>
                        SMS Host Arrival Alert
                      </span>
                      <button
                        type="button"
                        onClick={() => setSampleToggle(!sampleToggle)}
                        className="w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer flex items-center"
                        style={{
                          backgroundColor: sampleToggle ? foreColor : '#CBD5E1',
                        }}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform duration-150 shadow-xs ${
                            sampleToggle ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: BADGES, TYPOGRAPHY SPECIMEN & METADATA CHIPS */}
        {(filterCategory === 'all' || filterCategory === 'badges') && (
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2 border-slate-300/60">
              <span
                className="text-[11px] font-bold tracking-wider uppercase font-mono"
                style={{ color: secondaryForeColor }}
              >
                Typography Scale & Metadata Badges
              </span>
              <span className="text-[10px] font-mono" style={{ color: mutedFontColor }}>
                Scale Base: {fontSizeBase}
              </span>
            </div>

            <div
              className="p-5 rounded-xl border border-slate-200/80 shadow-xs space-y-4"
              style={{ backgroundColor: surfaceColor }}
            >
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold shadow-2xs"
                  style={{
                    backgroundColor: foreColor,
                    color: foreColorText,
                  }}
                >
                  ForeColor Solid Badge
                </span>

                <span
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold border"
                  style={{
                    borderColor: foreColor,
                    color: foreColor,
                    backgroundColor: `${foreColor}10`,
                  }}
                >
                  ForeColor Tint Badge
                </span>

                <span
                  className="px-2.5 py-1 rounded-md text-[11px] font-bold"
                  style={{
                    backgroundColor: secondaryForeColor,
                    color: '#FFFFFF',
                  }}
                >
                  Secondary ForeColor
                </span>

                <span
                  className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold"
                  style={{
                    backgroundColor: `${secondaryForeColor}15`,
                    color: secondaryForeColor,
                  }}
                >
                  QR-CODE-AUTHENTICATED
                </span>

                <span
                  className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300"
                >
                  Status: Approved
                </span>
              </div>

              {/* Typography scale specimen */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <h1
                  className="text-xl sm:text-2xl font-black tracking-tight"
                  style={{
                    color: headingColor,
                    textTransform: headingTransformCss,
                    fontWeight: fontWeight,
                  }}
                >
                  Heading 1: Zero-Trust Physical Identity Architecture ({companyName})
                </h1>

                <h2
                  className="text-lg font-bold"
                  style={{
                    color: headingColor,
                    textTransform: headingTransformCss,
                    fontWeight: fontWeight,
                  }}
                >
                  Heading 2: Multi-Campus Facility Governance & Turnstile Edge Telemetry
                </h2>

                <h3
                  className="text-sm font-semibold"
                  style={{
                    color: headingColor,
                    textTransform: headingTransformCss,
                    fontWeight: fontWeight,
                  }}
                >
                  Heading 3: Automated Fast-Lane QR Code Scanning & Facial Check-In
                </h3>

                <p className="text-xs leading-relaxed" style={{ color: fontColor }}>
                  Body Text: The enterprise visitor management system enforces role-based access control, cryptographic badge printing, NDA compliance verification, and instant host notification channels.
                </p>

                <p className="text-[11px] italic" style={{ color: mutedFontColor }}>
                  Secondary Italic Caption: All access logs are recorded immutably with SHA-256 integrity hashing and synchronized to offline edge cache buffer.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
