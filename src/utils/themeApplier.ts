import { WhitelabelBranding } from '../types';

export interface ThemePresetOption {
  id: string;
  name: string;
  description: string;
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
  headerBackground: 'DARK_NAVY' | 'SLATE' | 'BRAND_COLOR' | 'CLEAN_WHITE' | 'CUSTOM_HEX';
  headerBackgroundColor: string;
  foreColor: string;
  foreColorText: string;
  secondaryForeColor: string;
}

export const SUPPORTED_FONTS = [
  {
    name: 'Plus Jakarta Sans',
    category: 'Modern Sans',
    stack: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: 'Crisp, contemporary geometric sans designed for modern enterprise dashboards.',
  },
  {
    name: 'Inter',
    category: 'Clean UI Sans',
    stack: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: 'The world gold-standard for enterprise interfaces with high x-height readability.',
  },
  {
    name: 'Outfit',
    category: 'Tech Geometric',
    stack: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    description: 'Sleek, forward-looking geometric typeface with premium visual presence.',
  },
  {
    name: 'Roboto',
    category: 'Corporate Sans',
    stack: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif",
    description: 'Google precision typographic standard; friendly, neutral, and readable.',
  },
  {
    name: 'Poppins',
    category: 'Modern Soft Sans',
    stack: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    description: 'Approachable geometric sans-serif with smooth curves and warm aesthetics.',
  },
  {
    name: 'Montserrat',
    category: 'Bold Architectural',
    stack: "'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    description: 'Inspired by traditional Buenos Aires urban signage; bold and distinctive.',
  },
  {
    name: 'Open Sans',
    category: 'Neutral Sans',
    stack: "'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    description: 'Optimized for legibility across print, web, and mobile screen turnstiles.',
  },
  {
    name: 'Merriweather',
    category: 'Executive Serif',
    stack: "'Merriweather', Georgia, Cambria, 'Times New Roman', serif",
    description: 'Distinguished, authoritative serif font suited for legal, defense, and high-trust gov portals.',
  },
  {
    name: 'JetBrains Mono',
    category: 'High-Tech Monospace',
    stack: "'JetBrains Mono', SFMono-Regular, Menlo, Monaco, Consolas, monospace",
    description: 'Engineering-grade monospace with coding ligatures and zero ambiguity.',
  },
  {
    name: 'System Sans',
    category: 'Native OS',
    stack: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    description: 'Instant zero-latency native OS font rendering (SF Pro / Segoe / Roboto).',
  },
];

export const THEME_PRESETS: ThemePresetOption[] = [
  {
    id: 'enterprise_ivory_navy',
    name: 'Enterprise Ivory & Navy (Default)',
    description: 'Classic warm ivory background with deep navy forecolor and Plus Jakarta Sans.',
    fontFamily: 'Plus Jakarta Sans',
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 'normal',
    textTransform: 'none',
    fontSizeBase: '14px',
    fontColor: '#172B3A',
    headingColor: '#0F172A',
    mutedFontColor: '#526575',
    backgroundColor: '#FAF7EE',
    surfaceColor: '#FFFFF0',
    headerBackground: 'DARK_NAVY',
    headerBackgroundColor: '#123B5D',
    foreColor: '#123B5D',
    foreColorText: '#FFFFFF',
    secondaryForeColor: '#0F766E',
  },
  {
    id: 'modern_slate_blue',
    name: 'Modern Tech Slate & Royal Blue',
    description: 'Cool slate canvas, crisp Inter typography, and vibrant Royal Blue accent.',
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 'normal',
    textTransform: 'none',
    fontSizeBase: '14px',
    fontColor: '#0F172A',
    headingColor: '#020617',
    mutedFontColor: '#475569',
    backgroundColor: '#F1F5F9',
    surfaceColor: '#FFFFFF',
    headerBackground: 'CUSTOM_HEX',
    headerBackgroundColor: '#0F172A',
    foreColor: '#2563EB',
    foreColorText: '#FFFFFF',
    secondaryForeColor: '#0284C7',
  },
  {
    id: 'clean_emerald_minimalist',
    name: 'Clean Emerald & Pure White',
    description: 'Ultra-clean white surfaces with deep emerald green forecolor and Outfit typography.',
    fontFamily: 'Outfit',
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 'normal',
    textTransform: 'none',
    fontSizeBase: '14px',
    fontColor: '#111827',
    headingColor: '#064E3B',
    mutedFontColor: '#4B5563',
    backgroundColor: '#F9FAFB',
    surfaceColor: '#FFFFFF',
    headerBackground: 'CUSTOM_HEX',
    headerBackgroundColor: '#064E3B',
    foreColor: '#059669',
    foreColorText: '#FFFFFF',
    secondaryForeColor: '#0D9488',
  },
  {
    id: 'executive_violet_platinum',
    name: 'Executive Violet & Platinum',
    description: 'Sophisticated royal violet forecolor with soft lavender-platinum background.',
    fontFamily: 'Montserrat',
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 'normal',
    textTransform: 'none',
    fontSizeBase: '14px',
    fontColor: '#1E1B4B',
    headingColor: '#0F0E2A',
    mutedFontColor: '#6B7280',
    backgroundColor: '#F5F3FF',
    surfaceColor: '#FFFFFF',
    headerBackground: 'CUSTOM_HEX',
    headerBackgroundColor: '#312E81',
    foreColor: '#6D28D9',
    foreColorText: '#FFFFFF',
    secondaryForeColor: '#4F46E5',
  },
  {
    id: 'gov_defense_dark',
    name: 'Gov & Defense Dark Operations',
    description: 'High-contrast dark operations theme with tactical cyan accent and JetBrains Mono.',
    fontFamily: 'JetBrains Mono',
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 'normal',
    textTransform: 'none',
    fontSizeBase: '13px',
    fontColor: '#E2E8F0',
    headingColor: '#38BDF8',
    mutedFontColor: '#94A3B8',
    backgroundColor: '#090D16',
    surfaceColor: '#111827',
    headerBackground: 'CUSTOM_HEX',
    headerBackgroundColor: '#0B0F19',
    foreColor: '#0284C7',
    foreColorText: '#FFFFFF',
    secondaryForeColor: '#10B981',
  },
  {
    id: 'warm_amber_sandstone',
    name: 'Warm Amber & Sandstone',
    description: 'Earthy warm tones, soft amber forecolor, and Poppins font style.',
    fontFamily: 'Poppins',
    fontStyle: 'normal',
    fontWeight: '500',
    letterSpacing: 'normal',
    textTransform: 'none',
    fontSizeBase: '14px',
    fontColor: '#292524',
    headingColor: '#78350F',
    mutedFontColor: '#78716C',
    backgroundColor: '#FBF9F5',
    surfaceColor: '#FFFFFF',
    headerBackground: 'CUSTOM_HEX',
    headerBackgroundColor: '#451A03',
    foreColor: '#D97706',
    foreColorText: '#FFFFFF',
    secondaryForeColor: '#B45309',
  },
];

// Helper to calculate high-contrast text color (black or white) based on background hex
export function getContrastTextColor(hexColor?: string): string {
  if (!hexColor || !hexColor.startsWith('#')) return '#FFFFFF';
  const c = hexColor.replace('#', '');
  if (c.length !== 6) return '#FFFFFF';
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  // Luminance formula
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 148 ? '#0F172A' : '#FFFFFF';
}

/**
 * Returns complete CSS font stack for a font family name
 */
export function getFontStack(fontFamilyName?: string): string {
  if (!fontFamilyName) {
    return "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  }
  const cleanName = fontFamilyName.replace(/['",]/g, '').trim();
  const found = SUPPORTED_FONTS.find(
    (f) => f.name.toLowerCase() === cleanName.toLowerCase()
  );
  if (found) return found.stack;
  return `'${cleanName}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
}

/**
 * Ensures Google Fonts stylesheet is loaded into document head
 */
export function ensureGoogleFontsLoaded(): void {
  const FONT_LINK_ID = 'vms-google-fonts-link';
  if (typeof document === 'undefined') return;

  if (!document.getElementById(FONT_LINK_ID)) {
    const link = document.createElement('link');
    link.id = FONT_LINK_ID;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:ital,wght@0,300..800;1,300..800&family=Merriweather:ital,wght@0,300..700;1,300..700&family=Montserrat:ital,wght@0,300..800;1,300..800&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Outfit:wght@300..800&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=Poppins:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,300..800;1,300..800&display=swap';
    document.head.appendChild(link);
  }
}

export type GlobalThemeMode = 'light' | 'dark' | 'ivory';

export const THEME_MODE_STORAGE_KEY = 'vms_theme_mode';

export const getGlobalThemeMode = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  try {
    const saved = localStorage.getItem(THEME_MODE_STORAGE_KEY);
    if (saved === 'dark') {
      return 'dark';
    }
    if (saved === 'light' || saved === 'ivory') {
      return 'light';
    }
  } catch {
    // fallback
  }
  return 'light';
};

export const setGlobalThemeMode = (mode: 'light' | 'dark' | 'ivory', branding?: WhitelabelBranding): void => {
  const normalizedMode: 'light' | 'dark' = mode === 'dark' ? 'dark' : 'light';
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(THEME_MODE_STORAGE_KEY, normalizedMode);
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent('vms-theme-changed', { detail: { mode: normalizedMode } }));
  }
  applyPortalTheme(branding, normalizedMode);
};

export const toggleGlobalThemeMode = (branding?: WhitelabelBranding): 'light' | 'dark' => {
  const current = getGlobalThemeMode();
  const next: 'light' | 'dark' = current === 'dark' ? 'light' : 'dark';
  setGlobalThemeMode(next, branding);
  return next;
};

/**
 * Dynamically applies branding theme (font, font style, font color, background, forecolor)
 * to root element and injects high-priority CSS overrides.
 */
export function applyPortalTheme(branding?: WhitelabelBranding, modeOverride?: GlobalThemeMode): void {
  if (typeof document === 'undefined') return;

  ensureGoogleFontsLoaded();

  const currentMode = modeOverride || getGlobalThemeMode();
  const isDark = currentMode === 'dark';

  const safeBranding = branding || ({
    enabled: false,
    companyName: 'JS AlphaSoftXenia',
    portalTitle: 'JS AlphaSoftXenia Enterprise VMS',
    tagline: 'Multi-Tenant Security Portal',
    primaryColor: '#123B5D',
    headerBackground: 'DARK_NAVY',
  } as WhitelabelBranding);

  // Find font stack
  const selectedFontObj = SUPPORTED_FONTS.find(
    (f) => f.name.toLowerCase() === (safeBranding.fontFamily || 'Plus Jakarta Sans').toLowerCase()
  );
  const fontStack = selectedFontObj
    ? selectedFontObj.stack
    : `'${safeBranding.fontFamily || 'Plus Jakarta Sans'}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

  const fontStyle = safeBranding.fontStyle || 'normal';
  const fontWeight = safeBranding.fontWeight || '500';
  const fontSizeBase = safeBranding.fontSizeBase || '14px';
  const letterSpacing =
    safeBranding.letterSpacing === 'tight'
      ? '-0.025em'
      : safeBranding.letterSpacing === 'wide'
      ? '0.025em'
      : safeBranding.letterSpacing === 'wider'
      ? '0.05em'
      : 'normal';
  const textTransform = safeBranding.textTransform || 'none';

  // Colors based on Clean Light vs High-Contrast Dark mode
  let fontColor: string;
  let headingColor: string;
  let mutedFontColor: string;
  let backgroundColor: string;
  let surfaceColor: string;
  let foreColor: string;
  let foreColorText: string;
  let secondaryForeColor: string;
  let headerBg: string;

  if (isDark) {
    // High-Contrast Dark Mode: Clear, Precise, and Prominent
    fontColor = '#F8FAFC';
    headingColor = '#FFFFFF';
    mutedFontColor = '#94A3B8';
    backgroundColor = '#0A111E';
    surfaceColor = '#131E31';
    foreColor = '#38BDF8';
    foreColorText = '#0A111E';
    secondaryForeColor = '#2DD4BF';
    headerBg = '#0C2B4E';
  } else {
    // Clean, High-Contrast Light Mode: Clear, Precise, and Prominent
    fontColor = safeBranding.fontColor || '#0F172A';
    headingColor = safeBranding.headingColor || '#0F172A';
    mutedFontColor = safeBranding.mutedFontColor || '#475569';
    backgroundColor = safeBranding.backgroundColor || '#F8FAFC';
    surfaceColor = safeBranding.surfaceColor || '#FFFFFF';
    foreColor = safeBranding.foreColor || safeBranding.primaryColor || '#123B5D';
    foreColorText = safeBranding.foreColorText || '#FFFFFF';
    secondaryForeColor = safeBranding.secondaryForeColor || safeBranding.secondaryColor || '#0F766E';

    headerBg = '#123B5D';
    if (safeBranding.headerBackground === 'DARK_NAVY') headerBg = '#123B5D';
    else if (safeBranding.headerBackground === 'SLATE') headerBg = '#0F172A';
    else if (safeBranding.headerBackground === 'BRAND_COLOR') headerBg = foreColor;
    else if (safeBranding.headerBackground === 'CLEAN_WHITE') headerBg = '#FFFFFF';
    else if (safeBranding.headerBackground === 'CUSTOM_HEX' && safeBranding.headerBackgroundColor) {
      headerBg = safeBranding.headerBackgroundColor;
    }
  }

  // Set CSS Custom Properties on documentElement
  const root = document.documentElement;
  if (isDark) {
    root.classList.add('dark');
    root.classList.add('theme-dark');
    root.classList.remove('theme-light', 'theme-ivory');
    document.body.classList.add('dark');
    document.body.classList.add('theme-dark');
    document.body.classList.remove('theme-light', 'theme-ivory');
  } else {
    root.classList.remove('dark');
    root.classList.remove('theme-dark');
    root.classList.add('theme-light');
    root.classList.remove('theme-ivory');
    document.body.classList.remove('dark');
    document.body.classList.remove('theme-dark');
    document.body.classList.add('theme-light');
    document.body.classList.remove('theme-ivory');
  }

  root.style.setProperty('--vms-font-family', fontStack);
  root.style.setProperty('--vms-font-style', fontStyle);
  root.style.setProperty('--vms-font-weight', fontWeight);
  root.style.setProperty('--vms-letter-spacing', letterSpacing);
  root.style.setProperty('--vms-font-size-base', fontSizeBase);
  root.style.setProperty('--vms-text-transform', textTransform);

  root.style.setProperty('--vms-font-color', fontColor);
  root.style.setProperty('--vms-heading-color', headingColor);
  root.style.setProperty('--vms-muted-color', mutedFontColor);

  root.style.setProperty('--vms-bg-color', backgroundColor);
  root.style.setProperty('--vms-surface-color', surfaceColor);
  root.style.setProperty('--vms-header-bg', headerBg);

  root.style.setProperty('--vms-forecolor', foreColor);
  root.style.setProperty('--vms-forecolor-text', foreColorText);
  root.style.setProperty('--vms-secondary-forecolor', secondaryForeColor);

  // Sync with Tailwind CSS variables
  root.style.setProperty('--color-primary', foreColor);
  root.style.setProperty('--color-secondary', secondaryForeColor);
  root.style.setProperty('--color-surface', surfaceColor);
  root.style.setProperty('--color-background', backgroundColor);
  root.style.setProperty('--color-text-primary', fontColor);
  root.style.setProperty('--color-text-secondary', mutedFontColor);

  // Inject or update stylesheet for global DOM propagation
  const STYLE_ID = 'vms-dynamic-theme-overrides';
  let styleEl = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    document.head.appendChild(styleEl);
  }

  styleEl.innerHTML = `
    /* Enterprise Theme Overrides (${isDark ? 'HIGH CONTRAST DARK MODE' : 'CLEAN ENTERPRISE LIGHT MODE'}) */
    body {
      font-family: var(--vms-font-family) !important;
      font-style: var(--vms-font-style) !important;
      font-weight: var(--vms-font-weight) !important;
      font-size: var(--vms-font-size-base) !important;
      letter-spacing: var(--vms-letter-spacing) !important;
      color: var(--vms-font-color) !important;
      background-color: var(--vms-bg-color) !important;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--vms-font-family) !important;
      color: var(--vms-heading-color) !important;
      font-style: var(--vms-font-style) !important;
      text-transform: ${textTransform === 'uppercase' ? 'uppercase' : 'inherit'};
    }

    header.sticky {
      background-color: var(--vms-header-bg) !important;
    }

    ${isDark ? `
      /* High Contrast Dark Mode Refinements: Clear, Precise, Prominent with Light Blue Menus */
      .bg-white {
        background-color: #0E294A !important;
        color: #F8FAFC !important;
        border-color: #0284C7 !important;
      }
      .bg-\\[\\#F4F7FA\\],
      .bg-slate-50,
      .bg-gray-50,
      .bg-\\[\\#F8FAFC\\] {
        background-color: #0A213D !important;
      }
      .bg-slate-100, .bg-gray-100 {
        background-color: #123C6A !important;
      }
      .text-[#172B3A], .text-slate-950, .text-black, .text-slate-900, .text-slate-800, .text-gray-900, .text-gray-800 {
        color: #F8FAFC !important;
      }
      .text-[#526575], .text-slate-700, .text-slate-600, .text-gray-700, .text-gray-600 {
        color: #BAE6FD !important;
      }
      .text-slate-500, .text-slate-400, .text-gray-500 {
        color: #7DD3FC !important;
      }
      .border-[#D8E1E8], .border-slate-200, .border-slate-100, .border-gray-200, .border-gray-100 {
        border-color: #0284C7 !important;
      }
      .divide-[#D8E1E8], .divide-slate-200 {
        border-color: #0284C7 !important;
      }
      /* ALL MENUS IN DARK THEME -> LIGHT BLUE PALETTE */
      aside, #main-navigation-sidebar {
        background-color: #0B2544 !important;
        border-color: #0284C7 !important;
        color: #BAE6FD !important;
      }
      aside button, [id*="dropdown"] button, [role="menu"] button {
        color: #BAE6FD !important;
      }
      aside button:hover, [id*="dropdown"] button:hover, [role="menu"] button:hover {
        background-color: #174E8A !important;
        color: #FFFFFF !important;
      }
      header.sticky {
        background-color: #0C2B4E !important;
        border-bottom: 1px solid #0284C7 !important;
      }
      [id*="dropdown"], .dropdown-menu, [role="menu"] {
        background-color: #0B2544 !important;
        border-color: #38BDF8 !important;
        color: #BAE6FD !important;
        box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.4) !important;
      }
      input[type="text"], input[type="search"], input[type="email"], input[type="password"], select, textarea {
        background-color: #0E294A !important;
        color: #FFFFFF !important;
        border-color: #0284C7 !important;
      }
      input[type="text"]:focus, input[type="search"]:focus, input[type="email"]:focus, input[type="password"]:focus, select:focus, textarea:focus {
        border-color: #38BDF8 !important;
        outline: none !important;
      }
      .bg-slate-200 {
        background-color: #123C6A !important;
      }
      /* Prevent white blowout on hover/selection in dark mode */
      .hover\:bg-white:hover,
      .hover\:bg-slate-50:hover,
      .hover\:bg-slate-100:hover,
      .hover\:bg-slate-200:hover,
      .hover\:bg-gray-50:hover,
      .hover\:bg-gray-100:hover,
      .hover\:bg-\[\#F4F7FA\]:hover,
      .hover\:bg-\[\#F8FAFC\]:hover {
        background-color: #174E8A !important;
        color: #FFFFFF !important;
      }
      tbody tr:hover, tr.hover\:bg-\[\#F4F7FA\]:hover, tr.hover\:bg-slate-50:hover, tr.hover\:bg-slate-100:hover {
        background-color: #123863 !important;
        color: #F8FAFC !important;
      }
      select option:hover, select option:focus, select option:checked {
        background-color: #0284C7 !important;
        color: #FFFFFF !important;
      }
      ::selection {
        background-color: #38BDF8 !important;
        color: #081B33 !important;
      }
      [aria-selected="true"], [data-selected="true"], .selected {
        background-color: #164E87 !important;
        color: #FFFFFF !important;
      }
      [aria-selected="true"]:hover, [data-selected="true"]:hover, .selected:hover {
        background-color: #1D5C9E !important;
        color: #FFFFFF !important;
      }
    ` : `
      /* Clean Light Mode Refinements: Clear, Precise, Prominent */
      .bg-white {
        background-color: #FFFFFF !important;
        color: #0F172A !important;
      }
      .bg-\\[\\#F4F7FA\\],
      .bg-slate-50,
      .bg-gray-50,
      .bg-\\[\\#F8FAFC\\] {
        background-color: #F8FAFC !important;
      }
      .text-[#172B3A] {
        color: #0F172A !important;
      }
      .text-[#526575] {
        color: #475569 !important;
      }
      .border-[#D8E1E8] {
        border-color: #E2E8F0 !important;
      }
    `}
  `;
}
