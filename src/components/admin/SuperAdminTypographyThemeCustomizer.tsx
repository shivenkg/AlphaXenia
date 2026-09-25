import React, { useState, useEffect } from 'react';
import {
  Type,
  Palette,
  Sparkles,
  Check,
  RotateCcw,
  Sliders,
  Eye,
  CheckCircle2,
  Layers,
  Sun,
  Moon,
  Contrast,
  Layout,
  MousePointer,
  Maximize2,
  RefreshCw,
  Info
} from 'lucide-react';
import { storageService } from '../../services/storageService';
import { WhitelabelBranding } from '../../types';
import {
  SUPPORTED_FONTS,
  THEME_PRESETS,
  getContrastTextColor,
  getFontStack,
  ThemePresetOption
} from '../../utils/themeApplier';
import { RealTimeThemePreviewGallery } from './RealTimeThemePreviewGallery';

interface SuperAdminTypographyThemeCustomizerProps {
  onSuccessToast?: (msg: string) => void;
  compact?: boolean;
}

const COMMON_COLOR_SWATCHES = [
  { name: 'Navy Deep', hex: '#123B5D' },
  { name: 'Teal Guard', hex: '#0F766E' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Emerald Gov', hex: '#059669' },
  { name: 'Violet Enterprise', hex: '#6D28D9' },
  { name: 'Crimson Shield', hex: '#DC2626' },
  { name: 'Amber Warm', hex: '#D97706' },
  { name: 'Dark Slate', hex: '#0F172A' },
  { name: 'Carbon Black', hex: '#18181B' },
];

const BACKGROUND_SWATCHES = [
  { name: 'Ivory Warm (Default)', hex: '#FAF7EE' },
  { name: 'Cool Slate', hex: '#F1F5F9' },
  { name: 'Clean White', hex: '#FFFFFF' },
  { name: 'Soft Gray', hex: '#F8FAFC' },
  { name: 'Lavender Mist', hex: '#F5F3FF' },
  { name: 'Sandstone Warm', hex: '#FBF9F5' },
  { name: 'Dark Slate (Dark Mode)', hex: '#0F172A' },
  { name: 'Obsidian Night', hex: '#090D16' },
];

const FONT_COLOR_SWATCHES = [
  { name: 'Charcoal Dark (Default)', hex: '#172B3A' },
  { name: 'Deep Slate', hex: '#0F172A' },
  { name: 'True Black', hex: '#000000' },
  { name: 'Muted Slate', hex: '#334155' },
  { name: 'Dark Indigo', hex: '#1E1B4B' },
  { name: 'Pure White (Dark Mode)', hex: '#FFFFFF' },
  { name: 'Light Silver (Dark Mode)', hex: '#E2E8F0' },
];

export const SuperAdminTypographyThemeCustomizer: React.FC<SuperAdminTypographyThemeCustomizerProps> = ({
  onSuccessToast,
  compact = false,
}) => {
  const [branding, setBranding] = useState<WhitelabelBranding>(() =>
    storageService.getWhitelabelBranding()
  );

  // Typography state
  const [fontFamily, setFontFamily] = useState<string>(branding.fontFamily || 'Plus Jakarta Sans');
  const [fontStyle, setFontStyle] = useState<'normal' | 'italic'>(branding.fontStyle || 'normal');
  const [fontWeight, setFontWeight] = useState<'400' | '500' | '600' | '700' | '800'>(
    branding.fontWeight || '500'
  );
  const [letterSpacing, setLetterSpacing] = useState<'normal' | 'tight' | 'wide' | 'wider'>(
    branding.letterSpacing || 'normal'
  );
  const [textTransform, setTextTransform] = useState<'none' | 'uppercase' | 'capitalize'>(
    branding.textTransform || 'none'
  );
  const [fontSizeBase, setFontSizeBase] = useState<'13px' | '14px' | '15px' | '16px'>(
    branding.fontSizeBase || '14px'
  );

  // Font colors state
  const [fontColor, setFontColor] = useState<string>(branding.fontColor || '#172B3A');
  const [headingColor, setHeadingColor] = useState<string>(branding.headingColor || '#0F172A');
  const [mutedFontColor, setMutedFontColor] = useState<string>(branding.mutedFontColor || '#526575');

  // Background colors state
  const [backgroundColor, setBackgroundColor] = useState<string>(branding.backgroundColor || '#FAF7EE');
  const [surfaceColor, setSurfaceColor] = useState<string>(branding.surfaceColor || '#FFFFF0');
  const [headerBackground, setHeaderBackground] = useState<'DARK_NAVY' | 'SLATE' | 'BRAND_COLOR' | 'CLEAN_WHITE' | 'CUSTOM_HEX'>(
    branding.headerBackground || 'DARK_NAVY'
  );
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState<string>(
    branding.headerBackgroundColor || '#123B5D'
  );

  // ForeColor & Accent state
  const [foreColor, setForeColor] = useState<string>(branding.foreColor || branding.primaryColor || '#123B5D');
  const [foreColorText, setForeColorText] = useState<string>(
    branding.foreColorText || getContrastTextColor(foreColor)
  );
  const [secondaryForeColor, setSecondaryForeColor] = useState<string>(
    branding.secondaryForeColor || branding.secondaryColor || '#0F766E'
  );

  // UI state
  const [activeTab, setActiveTab] = useState<'TYPOGRAPHY' | 'COLORS' | 'PRESETS' | 'GALLERY'>('TYPOGRAPHY');
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  // Automatically update foreColorText when foreColor changes
  const handleForeColorChange = (color: string) => {
    setForeColor(color);
    setForeColorText(getContrastTextColor(color));
  };

  const handleApplyPreset = (preset: ThemePresetOption) => {
    setSelectedPresetId(preset.id);
    setFontFamily(preset.fontFamily);
    setFontStyle(preset.fontStyle);
    setFontWeight(preset.fontWeight);
    setLetterSpacing(preset.letterSpacing);
    setTextTransform(preset.textTransform);
    setFontSizeBase(preset.fontSizeBase);
    setFontColor(preset.fontColor);
    setHeadingColor(preset.headingColor);
    setMutedFontColor(preset.mutedFontColor);
    setBackgroundColor(preset.backgroundColor);
    setSurfaceColor(preset.surfaceColor);
    setHeaderBackground(preset.headerBackground);
    setHeaderBackgroundColor(preset.headerBackgroundColor);
    setForeColor(preset.foreColor);
    setForeColorText(preset.foreColorText);
    setSecondaryForeColor(preset.secondaryForeColor);

    setToastMessage(`Theme preset "${preset.name}" loaded! Click "Save & Apply Theme" to persist.`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveTheme = () => {
    setIsSaving(true);
    const updates: Partial<WhitelabelBranding> = {
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
      headerBackground,
      headerBackgroundColor,
      foreColor,
      primaryColor: foreColor, // sync primary color
      foreColorText,
      secondaryForeColor,
      secondaryColor: secondaryForeColor,
    };

    const res = storageService.updateWhitelabelBranding(updates);
    setBranding(res.branding);

    setTimeout(() => {
      setIsSaving(false);
      const msg = `Portal typography, background, and forecolor updated successfully! (Font: ${fontFamily}, ForeColor: ${foreColor})`;
      setToastMessage(msg);
      if (onSuccessToast) onSuccessToast(msg);
      setTimeout(() => setToastMessage(null), 4000);
    }, 300);
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset typography, font colors, background, and forecolor to default Enterprise settings?')) {
      const defaultPreset = THEME_PRESETS[0];
      handleApplyPreset(defaultPreset);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
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

      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-teal-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-800 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-200">
                Super Admin Styling Studio
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-700">
                Active Font: <strong className="text-indigo-900">{fontFamily}</strong> ({fontWeight}, {fontStyle})
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-0.5 tracking-tight">
              Portal Typography, Font Colors, Background & ForeColor Studio
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize font families, weights, styles, canvas background, and interactive forecolor accents across the entire enterprise portal.
            </p>
          </div>
        </div>

        {/* Global Save Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={handleResetToDefaults}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Reset to default Enterprise Ivory & Navy theme"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            id="superadmin-save-theme-btn"
            onClick={handleSaveTheme}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Applying Changes...' : 'Save & Apply Theme'}</span>
          </button>
        </div>
      </div>

      {/* Studio Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('TYPOGRAPHY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'TYPOGRAPHY'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>1. Font & Font Style</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('COLORS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'COLORS'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>2. Font Color, Background & ForeColor</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('PRESETS')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'PRESETS'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>3. 1-Click Curated Presets ({THEME_PRESETS.length})</span>
        </button>

        <button
          type="button"
          id="customization-tab-realtime-gallery"
          onClick={() => setActiveTab('GALLERY')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'GALLERY'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>4. Real-Time UI Preview (Cards, Buttons & Forms)</span>
          <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 text-[9px] font-black uppercase tracking-wider ml-1">
            Live Preview
          </span>
        </button>
      </div>

      {/* Main Grid: Controls on Left, Live Interactive Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* TAB 1: Typography & Font Styles */}
          {activeTab === 'TYPOGRAPHY' && (
            <div className="space-y-5">
              {/* Font Family Selection Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Type className="w-4 h-4 text-indigo-600" />
                      <span>Select Portal Font Family</span>
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Choose from globally recognized typography standards optimized for clarity and enterprise screens.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                    {SUPPORTED_FONTS.length} Fonts Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {SUPPORTED_FONTS.map((font) => (
                    <button
                      key={font.name}
                      type="button"
                      onClick={() => setFontFamily(font.name)}
                      className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                        fontFamily.toLowerCase() === font.name.toLowerCase()
                          ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{font.name}</span>
                        <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {font.category}
                        </span>
                      </div>
                      <p
                        className="text-xs text-slate-700 truncate"
                        style={{ fontFamily: font.stack }}
                      >
                        Enterprise Visitor Pass #8492
                      </p>
                      <span className="text-[10px] text-slate-400 leading-tight">
                        {font.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Style, Weight & Letter Spacing Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <span>Font Style, Weight & Text Transform</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Fine-tune typography rendering weights, italics, tracking, and base sizing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Font Style Variant (Normal vs Italic) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Font Style Variant
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFontStyle('normal')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 ${
                          fontStyle === 'normal'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>Normal (Upright)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontStyle('italic')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer flex items-center justify-center gap-1.5 italic ${
                          fontStyle === 'italic'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span>Italic (Oblique)</span>
                      </button>
                    </div>
                  </div>

                  {/* Font Weight */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                      <span>Font Weight</span>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                        Weight: {fontWeight}
                      </span>
                    </label>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                      {[
                        { val: '400', label: 'Regular' },
                        { val: '500', label: 'Medium' },
                        { val: '600', label: 'Semi-Bold' },
                        { val: '700', label: 'Bold' },
                      ].map((w) => (
                        <button
                          key={w.val}
                          type="button"
                          onClick={() => setFontWeight(w.val as any)}
                          className={`flex-1 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer text-center ${
                            fontWeight === w.val
                              ? 'bg-white text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Letter Spacing (Tracking) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Letter Spacing (Tracking)
                    </label>
                    <select
                      value={letterSpacing}
                      onChange={(e) => setLetterSpacing(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                    >
                      <option value="tight">Tight (-0.025em) - Compact High-Density</option>
                      <option value="normal">Normal (0em) - Standard Balanced</option>
                      <option value="wide">Wide (+0.025em) - Modern Spacious</option>
                      <option value="wider">Wider (+0.05em) - Executive Uppercase</option>
                    </select>
                  </div>

                  {/* Headings Text Transform */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Headings Text Transform
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setTextTransform('none')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                          textTransform === 'none'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        Default Case
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextTransform('uppercase')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center uppercase tracking-wider ${
                          textTransform === 'uppercase'
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        UPPERCASE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Font Colors, Background & ForeColor */}
          {activeTab === 'COLORS' && (
            <div className="space-y-5">
              {/* Font Color Controls Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Type className="w-4 h-4 text-indigo-600" />
                    <span>Font Colors (Text Typography Colors)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Define the exact color palette for headings, body text, and secondary subtitles.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Primary Body Text Font Color */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Body / Main Text Font Color
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-500">{fontColor}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {FONT_COLOR_SWATCHES.map((sw) => (
                        <button
                          key={sw.name}
                          type="button"
                          onClick={() => setFontColor(sw.hex)}
                          className={`w-6 h-6 rounded-lg border transition cursor-pointer ${
                            fontColor.toLowerCase() === sw.hex.toLowerCase()
                              ? 'border-indigo-600 scale-110 shadow-xs'
                              : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: sw.hex }}
                          title={sw.name}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Primary copy color</span>
                    </div>
                  </div>

                  {/* Heading Font Color */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Heading / Title Font Color (H1, H2, H3)
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-500">{headingColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={headingColor}
                        onChange={(e) => setHeadingColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={headingColor}
                        onChange={(e) => setHeadingColor(e.target.value)}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Section titles and hero labels</span>
                    </div>
                  </div>

                  {/* Muted Font Color */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Muted / Secondary Font Color (Captions & Subtitles)
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-500">{mutedFontColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={mutedFontColor}
                        onChange={(e) => setMutedFontColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={mutedFontColor}
                        onChange={(e) => setMutedFontColor(e.target.value)}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Timestamps, metadata, hints</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background Colors Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-teal-600" />
                    <span>Portal Background Colors (Canvas & Card Surfaces)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Control the main page canvas background and card/panel surface backgrounds.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Canvas Background Color */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Main Portal Canvas Background Color
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-500">{backgroundColor}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {BACKGROUND_SWATCHES.map((sw) => (
                        <button
                          key={sw.name}
                          type="button"
                          onClick={() => setBackgroundColor(sw.hex)}
                          className={`w-6 h-6 rounded-lg border transition cursor-pointer ${
                            backgroundColor.toLowerCase() === sw.hex.toLowerCase()
                              ? 'border-indigo-600 scale-110 shadow-xs'
                              : 'border-slate-300'
                          }`}
                          style={{ backgroundColor: sw.hex }}
                          title={sw.name}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Viewport canvas behind cards</span>
                    </div>
                  </div>

                  {/* Surface / Card Background Color */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Card, Modal & Panel Surface Background Color
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-500">{surfaceColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={surfaceColor}
                        onChange={(e) => setSurfaceColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={surfaceColor}
                        onChange={(e) => setSurfaceColor(e.target.value)}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Inner container background</span>
                    </div>
                  </div>

                  {/* Header Navbar Background */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Top Navigation Bar Background
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-500">{headerBackgroundColor}</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                      {[
                        { id: 'DARK_NAVY', label: 'Dark Navy (#123B5D)', hex: '#123B5D' },
                        { id: 'SLATE', label: 'Slate Night (#0F172A)', hex: '#0F172A' },
                        { id: 'BRAND_COLOR', label: 'Match ForeColor', hex: foreColor },
                        { id: 'CLEAN_WHITE', label: 'Clean White', hex: '#FFFFFF' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setHeaderBackground(item.id as any);
                            setHeaderBackgroundColor(item.hex);
                          }}
                          className={`p-2 rounded-xl border text-[11px] font-bold text-center transition cursor-pointer ${
                            headerBackground === item.id
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-2xs'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={headerBackgroundColor}
                        onChange={(e) => {
                          setHeaderBackground('CUSTOM_HEX');
                          setHeaderBackgroundColor(e.target.value);
                        }}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={headerBackgroundColor}
                        onChange={(e) => {
                          setHeaderBackground('CUSTOM_HEX');
                          setHeaderBackgroundColor(e.target.value);
                        }}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Custom Navbar Hex</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ForeColor (Primary Accent & Interactive Color) Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <MousePointer className="w-4 h-4 text-indigo-600" />
                    <span>ForeColor (Primary Accent & Interactive Brand Colors)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Defines button fills, active tabs, brand icons, and interactive elements.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Primary Forecolor */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Primary ForeColor (Button Fill & Active Highlights)
                      </label>
                      <span className="font-mono text-xs font-bold text-indigo-600">{foreColor}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {COMMON_COLOR_SWATCHES.map((sw) => (
                        <button
                          key={sw.name}
                          type="button"
                          onClick={() => handleForeColorChange(sw.hex)}
                          className={`w-7 h-7 rounded-full border-2 transition cursor-pointer flex items-center justify-center ${
                            foreColor.toLowerCase() === sw.hex.toLowerCase()
                              ? 'border-indigo-600 scale-110 shadow-sm'
                              : 'border-white hover:scale-105'
                          }`}
                          style={{ backgroundColor: sw.hex }}
                          title={sw.name}
                        >
                          {foreColor.toLowerCase() === sw.hex.toLowerCase() && (
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={foreColor}
                        onChange={(e) => handleForeColorChange(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={foreColor}
                        onChange={(e) => handleForeColorChange(e.target.value)}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Custom Accent Hex</span>
                    </div>
                  </div>

                  {/* Secondary Forecolor */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700">
                        Secondary ForeColor (Badge & Complementary Accent)
                      </label>
                      <span className="font-mono text-xs font-bold text-slate-500">{secondaryForeColor}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryForeColor}
                        onChange={(e) => setSecondaryForeColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={secondaryForeColor}
                        onChange={(e) => setSecondaryForeColor(e.target.value)}
                        className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs font-bold uppercase focus:ring-1 focus:ring-indigo-500 outline-none"
                      />
                      <span className="text-[11px] text-slate-400">Secondary badges & outlines</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Curated Presets */}
          {activeTab === 'PRESETS' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>1-Click Curated Theme Presets</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Select a tested, high-contrast, production-grade enterprise theme designed for executive physical security portals.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEME_PRESETS.map((preset) => {
                  const isCurrent =
                    fontFamily.toLowerCase() === preset.fontFamily.toLowerCase() &&
                    foreColor.toLowerCase() === preset.foreColor.toLowerCase() &&
                    backgroundColor.toLowerCase() === preset.backgroundColor.toLowerCase();

                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-3 relative ${
                        isCurrent
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-500/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {isCurrent && (
                        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 stroke-[3]" /> Active
                        </span>
                      )}

                      <div>
                        <span className="font-bold text-slate-900 text-sm block">{preset.name}</span>
                        <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>
                      </div>

                      {/* Swatch chips */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100/80">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: preset.backgroundColor }}
                            title="Background"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: preset.surfaceColor }}
                            title="Surface"
                          />
                          <span
                            className="w-4 h-4 rounded-full border border-slate-300"
                            style={{ backgroundColor: preset.foreColor }}
                            title="ForeColor"
                          />
                        </div>
                        <span className="text-[11px] font-mono text-slate-600 ml-auto">
                          {preset.fontFamily}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Real-Time UI Preview Gallery */}
          {activeTab === 'GALLERY' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layout className="w-4 h-4 text-indigo-600" />
                    <span>Real-Time UI Preview Component</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Live interactive cards, solid and outlined buttons, form inputs, toggles, and clearance badges reflecting current typography & color palette.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-bold self-start sm:self-auto">
                  {fontFamily} ({fontWeight})
                </span>
              </div>

              <RealTimeThemePreviewGallery
                fontFamily={fontFamily}
                fontStyle={fontStyle}
                fontWeight={fontWeight}
                letterSpacing={letterSpacing}
                textTransform={textTransform}
                fontSizeBase={fontSizeBase}
                fontColor={fontColor}
                headingColor={headingColor}
                mutedFontColor={mutedFontColor}
                backgroundColor={backgroundColor}
                surfaceColor={surfaceColor}
                foreColor={foreColor}
                foreColorText={foreColorText}
                secondaryForeColor={secondaryForeColor}
                companyName={storageService.getWhitelabelBranding().companyName}
                onFontFamilyChange={(newFont) => setFontFamily(newFont)}
              />
            </div>
          )}
        </div>

        {/* Right Column: Live Interactive Specimen Sandbox (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 sticky top-16">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Live Interactive Specimen Sandbox
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Updates Instantly</span>
            </div>

            {/* Scoped CSS Rule Injection for Specimen Box */}
            <style>{`
              .specimen-sandbox-scope,
              .specimen-sandbox-scope * {
                font-family: ${getFontStack(fontFamily)} !important;
              }
              .specimen-sandbox-scope button,
              .specimen-sandbox-scope input {
                font-family: ${getFontStack(fontFamily)} !important;
              }
            `}</style>

            {/* Specimen Box */}
            <div
              className="specimen-sandbox-scope p-4 rounded-xl border border-slate-300 space-y-4 transition-all duration-200 shadow-sm"
              style={{
                backgroundColor: backgroundColor,
                color: fontColor,
                fontFamily: getFontStack(fontFamily),
                fontStyle: fontStyle,
                letterSpacing:
                  letterSpacing === 'tight'
                    ? '-0.025em'
                    : letterSpacing === 'wide'
                    ? '0.025em'
                    : letterSpacing === 'wider'
                    ? '0.05em'
                    : 'normal',
              }}
            >
              {/* Mini Header Specimen */}
              <div
                className="p-3 rounded-lg flex items-center justify-between text-white shadow-xs"
                style={{ backgroundColor: headerBackgroundColor }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs"
                    style={{ backgroundColor: foreColor, color: foreColorText }}
                  >
                    JS
                  </div>
                  <span className="text-xs font-bold truncate">Enterprise Portal</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/20 font-mono">
                  LIVE
                </span>
              </div>

              {/* Card Specimen */}
              <div
                className="p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3"
                style={{ backgroundColor: surfaceColor }}
              >
                {/* Heading Specimen */}
                <div>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider block"
                    style={{ color: secondaryForeColor }}
                  >
                    Visitor Security Clearance Pass
                  </span>
                  <h4
                    className="text-base font-extrabold mt-0.5"
                    style={{
                      color: headingColor,
                      textTransform: textTransform === 'uppercase' ? 'uppercase' : 'inherit',
                      fontWeight: fontWeight,
                    }}
                  >
                    Dr. Vikram Sethi
                  </h4>
                  <p className="text-xs leading-relaxed mt-1" style={{ color: mutedFontColor }}>
                    Senior Defense Consultant • Clearance Tier 2 (Restricted Lab Perimeter)
                  </p>
                </div>

                {/* Body Text Sample */}
                <p className="text-xs leading-relaxed" style={{ color: fontColor }}>
                  The quick brown fox jumps over the lazy dog. Enterprise visitor identity access control with biometric turnstile synchronization.
                </p>

                {/* Interactive Button Specimen */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    style={{
                      backgroundColor: foreColor,
                      color: foreColorText,
                    }}
                  >
                    <span>Primary Action</span>
                    <Check className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    className="px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer"
                    style={{
                      borderColor: secondaryForeColor,
                      color: secondaryForeColor,
                      backgroundColor: 'transparent',
                    }}
                  >
                    <span>Secondary Badge</span>
                  </button>
                </div>
              </div>

              {/* Active Attributes Telemetry */}
              <div
                className="p-2.5 rounded-lg text-[10px] font-mono space-y-1 border border-slate-200"
                style={{ backgroundColor: surfaceColor, color: mutedFontColor }}
              >
                <div className="flex justify-between">
                  <span>Font:</span>
                  <strong style={{ color: fontColor }}>{fontFamily} ({fontWeight})</strong>
                </div>
                <div className="flex justify-between">
                  <span>Font Style:</span>
                  <strong style={{ color: fontColor }}>{fontStyle}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Font Color:</span>
                  <strong style={{ color: fontColor }}>{fontColor}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Background:</span>
                  <strong style={{ color: fontColor }}>{backgroundColor}</strong>
                </div>
                <div className="flex justify-between">
                  <span>ForeColor:</span>
                  <strong style={{ color: foreColor }}>{foreColor}</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setActiveTab('GALLERY')}
                className="w-full py-2 rounded-xl border border-indigo-200 text-indigo-700 bg-indigo-50/60 hover:bg-indigo-100 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
              >
                <Layout className="w-3.5 h-3.5" />
                <span>Inspect Full UI Gallery (Cards & Buttons)</span>
              </button>

              <button
                type="button"
                onClick={handleSaveTheme}
                disabled={isSaving}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-98 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{isSaving ? 'Applying Theme Changes...' : 'Save & Apply Theme Portal-Wide'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time UI Preview Component Showcase */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider">
                Real-Time Component Preview
              </span>
              <h3 className="text-base font-black text-slate-900">
                Interactive Component Sandbox: Cards, Buttons, Inputs & Badges
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Interact with real buttons, click check-in triggers, toggle switches, and test font legibility in real-time.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
            Font: {fontFamily} • ForeColor: {foreColor}
          </span>
        </div>

        <RealTimeThemePreviewGallery
          fontFamily={fontFamily}
          fontStyle={fontStyle}
          fontWeight={fontWeight}
          letterSpacing={letterSpacing}
          textTransform={textTransform}
          fontSizeBase={fontSizeBase}
          fontColor={fontColor}
          headingColor={headingColor}
          mutedFontColor={mutedFontColor}
          backgroundColor={backgroundColor}
          surfaceColor={surfaceColor}
          foreColor={foreColor}
          foreColorText={foreColorText}
          secondaryForeColor={secondaryForeColor}
          companyName={storageService.getWhitelabelBranding().companyName}
          onFontFamilyChange={(newFont) => setFontFamily(newFont)}
        />
      </div>
    </div>
  );
};
