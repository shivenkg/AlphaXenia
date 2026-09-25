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

/**
 * Dynamically applies branding theme (font, font style, font color, background, forecolor)
 * to root element and injects high-priority CSS overrides.
 */
export function applyPortalTheme(branding: WhitelabelBranding): void {
  if (typeof document === 'undefined') return;

  ensureGoogleFontsLoaded();

  // Find font stack
  const selectedFontObj = SUPPORTED_FONTS.find(
    (f) => f.name.toLowerCase() === (branding.fontFamily || 'Plus Jakarta Sans').toLowerCase()
  );
  const fontStack = selectedFontObj
    ? selectedFontObj.stack
    : `'${branding.fontFamily || 'Plus Jakarta Sans'}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;

  const fontStyle = branding.fontStyle || 'normal';
  const fontWeight = branding.fontWeight || '500';
  const fontSizeBase = branding.fontSizeBase || '14px';
  const letterSpacing =
    branding.letterSpacing === 'tight'
      ? '-0.025em'
      : branding.letterSpacing === 'wide'
      ? '0.025em'
      : branding.letterSpacing === 'wider'
      ? '0.05em'
      : 'normal';
  const textTransform = branding.textTransform || 'none';

  // Colors
  const fontColor = branding.fontColor || '#172B3A';
  const headingColor = branding.headingColor || '#0F172A';
  const mutedFontColor = branding.mutedFontColor || '#526575';
  const backgroundColor = branding.backgroundColor || '#FAF7EE';
  const surfaceColor = branding.surfaceColor || '#FFFFF0';
  const foreColor = branding.foreColor || branding.primaryColor || '#123B5D';
  const foreColorText = branding.foreColorText || getContrastTextColor(foreColor);
  const secondaryForeColor = branding.secondaryForeColor || branding.secondaryColor || '#0F766E';

  let headerBg = '#123B5D';
  if (branding.headerBackground === 'DARK_NAVY') headerBg = '#123B5D';
  else if (branding.headerBackground === 'SLATE') headerBg = '#0F172A';
  else if (branding.headerBackground === 'BRAND_COLOR') headerBg = foreColor;
  else if (branding.headerBackground === 'CLEAN_WHITE') headerBg = '#FFFFFF';
  else if (branding.headerBackground === 'CUSTOM_HEX' && branding.headerBackgroundColor) {
    headerBg = branding.headerBackgroundColor;
  }

  // Set CSS Custom Properties on documentElement
  const root = document.documentElement;
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

  // Sync with Tailwind CSS variables in index.css
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
    /* Enterprise Super Admin Theme Overrides */
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

    /* Global dynamic card, panel, and modal backgrounds */
    .bg-white {
      background-color: var(--vms-surface-color) !important;
    }

    .bg-\\[\\#F4F7FA\\],
    .bg-slate-50,
    .bg-gray-50 {
      background-color: var(--vms-bg-color) !important;
    }

    /* Header navbar background dynamically adapts to theme */
    header.sticky {
      background-color: var(--vms-header-bg) !important;
    }

    /* Forecolor dynamic accents on primary buttons and badges */
    .bg-\\[\\#123B5D\\] {
      background-color: var(--vms-forecolor) !important;
      color: var(--vms-forecolor-text) !important;
    }

    .text-\\[\\#123B5D\\] {
      color: var(--vms-forecolor) !important;
    }

    .border-\\[\\#123B5D\\] {
      border-color: var(--vms-forecolor) !important;
    }

    .text-\\[\\#172B3A\\] {
      color: var(--vms-font-color) !important;
    }

    .text-\\[\\#526575\\] {
      color: var(--vms-muted-color) !important;
    }
  `;
}
