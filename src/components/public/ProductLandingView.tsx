import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  Lock,
  ArrowRight,
  ScanLine,
  Sliders,
  Users,
  CheckCircle2,
  Share2,
  Printer,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Sparkles,
  Server,
  Zap,
  Globe2,
  ShieldAlert,
  ChevronDown,
  Check,
  Cpu,
  BadgeCheck,
  Database,
  QrCode,
  Sun,
  Moon
} from 'lucide-react';
import { JSAlphaSoftLogo } from '../common/JSAlphaSoftLogo';
import { getGlobalThemeMode, toggleGlobalThemeMode } from '../../utils/themeApplier';

interface ProductLandingViewProps {
  onNavigateToLogin: () => void;
  onNavigateToPublicPreRegister: () => void;
  onLaunchDemoReception?: () => void;
}

export const ProductLandingView: React.FC<ProductLandingViewProps> = ({
  onNavigateToLogin,
  onNavigateToPublicPreRegister,
  onLaunchDemoReception,
}) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => getGlobalThemeMode());
  const [activeTab, setActiveTab] = useState<'kiosk' | 'badge' | 'multitenant' | 'emergency' | 'audit'>('kiosk');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [visitorVolume, setVisitorVolume] = useState<number>(2500);

  const isDark = themeMode === 'dark';

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e.detail?.mode) {
        setThemeMode(e.detail.mode === 'dark' ? 'dark' : 'light');
      }
    };
    window.addEventListener('vms-theme-changed', handleThemeChange);
    return () => window.removeEventListener('vms-theme-changed', handleThemeChange);
  }, []);

  const handleToggleTheme = () => {
    const next = toggleGlobalThemeMode();
    setThemeMode(next);
  };

  // Capacity calculations for interactive ROI / Campus Readiness calculator
  const estCheckInSeconds = 2.4;
  const turnstilesNeeded = Math.ceil(visitorVolume / 800);
  const paperRollsSavedMonth = Math.round(visitorVolume * 0.08);

  const featureTabs = [
    {
      id: 'kiosk',
      label: 'Front Desk & Fast Check-In',
      icon: ScanLine,
      title: 'Touchless Visitor Reception & Walk-In Terminal',
      description:
        'Eliminate lobby bottlenecks with sub-3-second self-registration, government photo ID scanning, host arrival notifications, and instant pass issuance.',
      highlights: [
        'Instant walk-in registration with photo capture & signature',
        'Automatic host arrival dispatches via SMS, WhatsApp, and Slack',
        'Zero-trust pre-screening against custom restricted lists',
        'Multi-gate check-in with synchronized campus turnstile relays'
      ],
      previewStats: [
        { label: 'Avg. Check-In Time', value: '< 15 seconds' },
        { label: 'Lobby Wait Reduction', value: '78%' },
        { label: 'Host Notification Latency', value: '< 200 ms' }
      ]
    },
    {
      id: 'badge',
      label: 'Thermal QR & Badge Engine',
      icon: Printer,
      title: 'Dynamic QR Badges with High-Speed Thermal Printing',
      description:
        'Deliver tamper-evident physical and digital badges with dynamic expiring QR codes, company branding, cleared security zones, and direct Zebra ZPL hardware spooling.',
      highlights: [
        'Zebra ZPL & thermal network spooler with automatic zero-lag cut',
        'Time-expiring cryptographic QR codes that invalidate upon checkout',
        'Visual zone clearance badges (Low, High, Restricted, Vault)',
        'Digital mobile pass delivery via Apple Wallet & web links'
      ],
      previewStats: [
        { label: 'Print Spooling Speed', value: '2.1 seconds' },
        { label: 'Barcode Read Accuracy', value: '99.98%' },
        { label: 'Supported Printers', value: 'Zebra, Brother, Dymo' }
      ]
    },
    {
      id: 'multitenant',
      label: 'Multi-Tenant Campus Governance',
      icon: Building2,
      title: 'Enterprise Multi-Tenant Perimeter & Zone Isolation',
      description:
        'Govern multi-tenant corporate tech parks and multi-facility enterprises with strict logical tenant partitioning, site-specific policies, and role-based workflows.',
      highlights: [
        'Strict tenant-level data segregation with independent branding',
        'Campus, building zone, and turnstile gate mapping hierarchy',
        'Granular role-based workflows for hosts, security, and admins',
        'Cross-facility visitor tracking with perimeter boundary defense'
      ],
      previewStats: [
        { label: 'Active Enterprise Sites', value: '25+ Facilities' },
        { label: 'Data Isolation Tier', value: 'Schema-per-Tenant' },
        { label: 'Perimeter Gates', value: 'Unlimited' }
      ]
    },
    {
      id: 'emergency',
      label: 'Emergency Evacuation & Muster',
      icon: AlertTriangle,
      title: 'Real-Time Evacuation Muster Station Accountability',
      description:
        'In the event of a facility incident or drill, trigger campus-wide evacuation alarms and generate live headcount roll-calls for first responders across designated assembly muster stations.',
      highlights: [
        '1-Click building-wide emergency evacuation alarm trigger',
        'Real-time muster point tally with verified safe headcount',
        'Instant un-accounted visitor roster export for fire marshals',
        'Offline emergency roll-call survivability on mobile tablets'
      ],
      previewStats: [
        { label: 'Evacuation Roll-Call Roster', value: 'Real-Time Live' },
        { label: 'Muster Assembly Stations', value: 'Multi-Zone' },
        { label: 'Audit Log Integrity', value: 'Immutable' }
      ]
    },
    {
      id: 'audit',
      label: 'Immutable Audit Trail',
      icon: FileText,
      title: 'Tamper-Evident Forensic Access Logs & Compliance',
      description:
        'Maintain an airtight forensic record of every gate entry, badge print, security override, and administrative update with cryptographic SHA-256 hash chains.',
      highlights: [
        'Cryptographic hash verification guaranteeing log tamper-evidence',
        'DPDP Act 2023, ISO 27001, and SOC 2 Type II compliance controls',
        'Automated real-time bidirectional sync with Google Sheets',
        'Full export to CSV, JSON, and certified executive PDF dossiers'
      ],
      previewStats: [
        { label: 'Audit Retention', value: '365+ Days' },
        { label: 'Compliance Level', value: 'ISO 27001 / DPDP' },
        { label: 'Log Hash Standard', value: 'SHA-256 Chain' }
      ]
    }
  ];

  const currentTabObj = featureTabs.find((t) => t.id === activeTab) || featureTabs[0];

  const faqs = [
    {
      q: 'How does the Visitor Management System enforce campus security?',
      a: 'The platform integrates pre-registration, government photo ID verification, automated host arrival clearances, and dynamic QR badge issuance. Every visitor is assigned cleared physical zones and monitored across entry and exit gates.'
    },
    {
      q: 'Can our enterprise brand the visitor passes and registration portal?',
      a: 'Yes. Each enterprise tenant can customize portal logos, typography, accent colors, custom badge templates, safety NDAs, and automated arrival email/SMS templates.'
    },
    {
      q: 'Does it support hardware turnstiles and thermal badge printers?',
      a: 'Yes. Built-in device registries connect to network thermal printers (Zebra ZPL, Brother), optical barcode scanners, turnstile access relays, and self-service touchscreen kiosks.'
    },
    {
      q: 'What happens during a network outage or internet disconnection?',
      a: 'The edge offline engine buffers all check-ins, gate swipes, and badge prints in local encrypted storage. Once internet connectivity is restored, events cryptographically reconcile with zero data loss.'
    },
    {
      q: 'How do hosts receive arrival alerts?',
      a: 'When a visitor scans in or completes front-desk registration, instantaneous notifications are dispatched to the host via SMS, WhatsApp, email, and corporate Slack channels with visitor details.'
    }
  ];

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-teal-500 selection:text-white ${
        isDark ? 'bg-[#0A111E] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top Navigation Bar */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all ${
          isDark
            ? 'bg-[#0C2B4E]/95 border-sky-500/40 shadow-md shadow-sky-950/40'
            : 'bg-white/95 border-slate-200/90 shadow-2xs'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <JSAlphaSoftLogo forceDefaultBrand darkTheme={isDark} size="lg" />
            <nav
              className={`hidden lg:flex items-center gap-6 text-xs font-semibold ${
                isDark ? 'text-sky-200' : 'text-slate-600'
              }`}
            >
              <a
                href="#features"
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-teal-700'
                }`}
              >
                Features & Kiosks
              </a>
              <a
                href="#architecture"
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-teal-700'
                }`}
              >
                Campus Architecture
              </a>
              <a
                href="#calculator"
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-teal-700'
                }`}
              >
                Readiness Calculator
              </a>
              <a
                href="#compliance"
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-teal-700'
                }`}
              >
                Zero-Trust Compliance
              </a>
              <a
                href="#faq"
                className={`transition-colors ${
                  isDark ? 'hover:text-white' : 'hover:text-teal-700'
                }`}
              >
                Enterprise FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Prominent Theme Toggle Button */}
            <button
              type="button"
              id="landing-theme-toggle-btn"
              onClick={handleToggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                isDark
                  ? 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/30 text-amber-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800'
              }`}
              title={isDark ? 'Switch to Clean Light Mode' : 'Switch to High-Contrast Dark Mode'}
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-600" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="landing-nav-pre-register-btn"
              onClick={onNavigateToPublicPreRegister}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                isDark
                  ? 'bg-white/5 hover:bg-white/10 border border-white/15 text-teal-300'
                  : 'bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 shadow-2xs'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Visitor Self Pre-Registration</span>
            </button>

            {/* PRIMARY REQUIRED ACTION: Application Sign In Button */}
            <button
              type="button"
              id="landing-nav-sign-in-btn"
              onClick={onNavigateToLogin}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs transition active:scale-98 cursor-pointer ${
                isDark
                  ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-lg shadow-teal-400/25'
                  : 'bg-[#123B5D] hover:bg-[#0E2F4A] text-white shadow-md shadow-blue-900/15'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Application Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className={`relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b ${
          isDark
            ? 'border-white/10'
            : 'border-slate-200 bg-gradient-to-b from-white via-slate-50/50 to-slate-100/70'
        }`}
      >
        {/* Subtle ambient lighting */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] blur-3xl pointer-events-none ${
            isDark
              ? 'bg-gradient-to-b from-teal-500/10 via-[#123B5D]/20 to-transparent'
              : 'bg-gradient-to-b from-teal-200/20 via-blue-100/30 to-transparent'
          }`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Kicker */}
            <div
              className={`inline-flex items-center justify-center gap-2 text-xs font-bold tracking-wide uppercase px-3.5 py-1 rounded-full border ${
                isDark
                  ? 'text-teal-300 bg-teal-500/10 border-teal-400/25'
                  : 'text-teal-800 bg-teal-50 border-teal-200 shadow-2xs'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Enterprise Physical Security & Access Intelligence</span>
              <span aria-hidden="true">·</span>
              <span className={isDark ? 'text-slate-400 font-normal' : 'text-slate-500 font-normal'}>
                v2026.09 Platform
              </span>
            </div>

            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}
            >
              Zero-Trust Campus Visitor Management & Perimeter Access Governance
            </h1>

            <p
              className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Accelerate physical check-ins, automate high-speed thermal QR badge printing, isolate multi-tenant facilities, and guarantee safety with real-time emergency evacuation rosters.
            </p>

            {/* Primary Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                id="hero-primary-application-sign-in-btn"
                onClick={onNavigateToLogin}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-sm transition flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                  isDark
                    ? 'bg-teal-400 hover:bg-teal-300 text-slate-950 shadow-xl shadow-teal-400/25'
                    : 'bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-700/20'
                }`}
              >
                <Lock className="w-4 h-4" />
                <span>Application Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                id="hero-secondary-pre-register-btn"
                onClick={onNavigateToPublicPreRegister}
                className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/15 border border-white/20 text-white'
                    : 'bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 shadow-2xs'
                }`}
              >
                <Share2 className={`w-4 h-4 ${isDark ? 'text-teal-300' : 'text-teal-700'}`} />
                <span>Visitor Self Pre-Registration</span>
              </button>
            </div>

            {/* Key Metrics Display */}
            <div
              className={`pt-8 border-t flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs ${
                isDark ? 'border-white/10 text-slate-300' : 'border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  99.99%
                </span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Hardware Uptime</span>
              </div>
              <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-300'}>·</span>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-base ${isDark ? 'text-teal-300' : 'text-teal-700'}`}>
                  &lt; 3.0s
                </span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Thermal Badge Print</span>
              </div>
              <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-300'}>·</span>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  DPDP 2023
                </span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>& ISO 27001 Certified</span>
              </div>
              <span aria-hidden="true" className={isDark ? 'text-slate-600' : 'text-slate-300'}>·</span>
              <div className="flex items-center gap-2">
                <span className={`font-extrabold text-base ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  Zero-Trust
                </span>
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Edge Offline Sync</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Production Deployments */}
      <section
        className={`py-10 border-b ${
          isDark
            ? 'bg-[#0D1828]/80 border-white/10'
            : 'bg-slate-100/80 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center text-[11px] font-bold tracking-wider uppercase mb-6 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Deployed Across Mission-Critical Campuses & Multi-Tenant Facilities
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center opacity-90">
            <div className="text-center">
              <div
                className={`font-black text-sm tracking-widest ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                TATA ADVANCED
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Mumbai & Bengaluru Campuses
              </div>
            </div>
            <div className="text-center">
              <div
                className={`font-black text-sm tracking-widest ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                RELIANCE JIO
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Navi Mumbai Cyber Park
              </div>
            </div>
            <div className="text-center">
              <div
                className={`font-black text-sm tracking-widest ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                INFOSYS DEV
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Cyber City DLF Phase 2
              </div>
            </div>
            <div className="text-center">
              <div
                className={`font-black text-sm tracking-widest ${
                  isDark ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                BFSI CORE SOC
              </div>
              <div className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                BKC Financial Perimeter
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Feature Explorer Section */}
      <section
        id="features"
        className={`py-16 lg:py-24 border-b ${
          isDark ? 'border-white/10' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Purpose-Built Capabilities for Physical Access Control
            </h2>
            <p className={`text-sm mt-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Explore how our five specialized engine modules automate security, front desk throughput, and campus safety.
            </p>
          </div>

          {/* Tab Navigation Controls */}
          <div
            className={`flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl max-w-4xl mx-auto mb-10 border ${
              isDark
                ? 'bg-[#0C2B4E] border-sky-500/40 shadow-md shadow-sky-950/40'
                : 'bg-slate-100 border-slate-200 shadow-2xs'
            }`}
          >
            {featureTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? isDark
                        ? 'bg-sky-400 text-slate-950 shadow-md font-extrabold shadow-sky-400/25'
                        : 'bg-white text-teal-900 shadow-xs border border-slate-200 font-extrabold'
                      : isDark
                      ? 'text-sky-200 hover:text-white hover:bg-sky-500/20'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Detailed Showcase */}
          <div
            className={`rounded-3xl border p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              isDark
                ? 'bg-[#101D30]/90 border-white/10 shadow-lg'
                : 'bg-slate-50 border-slate-200 shadow-sm'
            }`}
          >
            <div className="lg:col-span-7 space-y-5">
              <div
                className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-teal-300' : 'text-teal-700'
                }`}
              >
                Module Showcase
              </div>
              <h3
                className={`text-2xl font-bold tracking-tight ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                {currentTabObj.title}
              </h3>
              <p
                className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {currentTabObj.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {currentTabObj.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 text-xs ${
                      isDark ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDark ? 'text-teal-400' : 'text-teal-700'
                      }`}
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Action trigger in feature preview */}
              <div className="pt-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                      : 'bg-teal-700 hover:bg-teal-800 text-white shadow-2xs'
                  }`}
                >
                  <span>Launch in Terminal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onNavigateToPublicPreRegister}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200'
                      : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-800'
                  }`}
                >
                  <span>Test Pre-Registration</span>
                </button>
              </div>
            </div>

            {/* Right Card: Dynamic Metric & Visual Preview */}
            <div
              className={`lg:col-span-5 rounded-2xl border p-6 space-y-5 ${
                isDark
                  ? 'bg-[#0A1322] border-white/10'
                  : 'bg-white border-slate-200 shadow-xs'
              }`}
            >
              <div
                className={`flex items-center justify-between border-b pb-3 ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                <div
                  className={`text-xs font-bold flex items-center gap-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <Cpu className={`w-4 h-4 ${isDark ? 'text-teal-400' : 'text-teal-700'}`} />
                  <span>Performance Benchmark</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  OPERATIONAL
                </span>
              </div>

              <div className="space-y-4">
                {currentTabObj.previewStats.map((stat, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isDark
                        ? 'bg-white/5 border-white/5'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {stat.label}
                    </span>
                    <span
                      className={`font-mono font-bold text-sm ${
                        isDark ? 'text-teal-300' : 'text-teal-800'
                      }`}
                    >
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                  isDark
                    ? 'bg-teal-500/10 border-teal-500/20 text-teal-200'
                    : 'bg-teal-50 border-teal-200 text-teal-900'
                }`}
              >
                Hardware-accelerated edge sync engine ensures zero turnstile lag even under peak campus rush hour traffic.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Campus Readiness & Capacity Calculator */}
      <section
        id="calculator"
        className={`py-16 border-b ${
          isDark
            ? 'bg-[#0D1828]/80 border-white/10'
            : 'bg-slate-100/70 border-slate-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-10">
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Interactive Campus Throughput & Hardware Sizing
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Estimate turnstiles, badge printing throughput, and check-in time for your campus traffic.
            </p>
          </div>

          <div
            className={`max-w-4xl mx-auto rounded-3xl border p-6 sm:p-8 ${
              isDark
                ? 'bg-[#101D30] border-white/10 shadow-lg'
                : 'bg-white border-slate-200 shadow-sm'
            }`}
          >
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    className={`text-xs font-bold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    Estimated Monthly Visitor Volume:
                  </label>
                  <span
                    className={`font-mono text-base font-extrabold ${
                      isDark ? 'text-teal-300' : 'text-teal-800'
                    }`}
                  >
                    {visitorVolume.toLocaleString()} visitors / month
                  </span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={visitorVolume}
                  onChange={(e) => setVisitorVolume(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
                <div
                  className={`flex justify-between text-[10px] font-mono mt-1 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  <span>500 (Single Building)</span>
                  <span>10,000 (Tech Park)</span>
                  <span>25,000+ (Multi-Campus)</span>
                </div>
              </div>

              <div
                className={`grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t ${
                  isDark ? 'border-white/10' : 'border-slate-200'
                }`}
              >
                <div
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? 'bg-[#0A1322] border-white/10'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Recommended Turnstiles
                  </div>
                  <div
                    className={`text-xl font-mono font-black mt-1 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {turnstilesNeeded} Optical Gates
                  </div>
                  <div className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Peak arrival buffer included
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? 'bg-[#0A1322] border-white/10'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Thermal Print Dispatch
                  </div>
                  <div
                    className={`text-xl font-mono font-black mt-1 ${
                      isDark ? 'text-teal-300' : 'text-teal-700'
                    }`}
                  >
                    {estCheckInSeconds}s / Badge
                  </div>
                  <div className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Sub-second QR rendering
                  </div>
                </div>

                <div
                  className={`p-4 rounded-xl border ${
                    isDark
                      ? 'bg-[#0A1322] border-white/10'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Paper Waste Reduction
                  </div>
                  <div
                    className={`text-xl font-mono font-black mt-1 ${
                      isDark ? 'text-emerald-400' : 'text-emerald-700'
                    }`}
                  >
                    ~{paperRollsSavedMonth} Reams / Mo
                  </div>
                  <div className={`text-[10px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Digital QR check-out pass
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span
                  className={`text-xs ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Ready to deploy with your existing hardware?
                </span>
                <button
                  type="button"
                  onClick={onNavigateToLogin}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-1.5 cursor-pointer ${
                    isDark
                      ? 'bg-teal-400 hover:bg-teal-300 text-slate-950'
                      : 'bg-teal-700 hover:bg-teal-800 text-white shadow-xs'
                  }`}
                >
                  <span>Application Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Architecture & Security Compliance */}
      <section
        id="compliance"
        className={`py-16 border-b ${
          isDark ? 'border-white/10 bg-[#0A111E]' : 'border-slate-200 bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Enterprise Compliance & Data Governance Built-In
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Designed from the ground up for zero-trust physical security standards, statutory privacy compliance, and multi-cloud resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                isDark
                  ? 'bg-[#101D30]/80 border-white/10'
                  : 'bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isDark
                    ? 'bg-teal-500/20 border-teal-400/30 text-teal-300'
                    : 'bg-teal-100 border-teal-300 text-teal-800'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3
                className={`text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                DPDP Act 2023 Compliant
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Automated consent capture, dynamic data anonymization upon visitor checkout, and configurable retention periods to guarantee complete regulatory adherence.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                isDark
                  ? 'bg-[#101D30]/80 border-white/10'
                  : 'bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isDark
                    ? 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300'
                    : 'bg-indigo-100 border-indigo-300 text-indigo-800'
                }`}
              >
                <Server className="w-5 h-5" />
              </div>
              <h3
                className={`text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Zero-Trust Isolation
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Strict perimeter controls enforce least-privilege visitor routing. Visitors are strictly barred from unauthorized laboratory and server vault zones.
              </p>
            </div>

            <div
              className={`p-6 rounded-2xl border space-y-3 ${
                isDark
                  ? 'bg-[#101D30]/80 border-white/10'
                  : 'bg-slate-50 border-slate-200 shadow-2xs'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl border flex items-center justify-center ${
                  isDark
                    ? 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300'
                    : 'bg-emerald-100 border-emerald-300 text-emerald-800'
                }`}
              >
                <Database className="w-5 h-5" />
              </div>
              <h3
                className={`text-base font-bold ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}
              >
                Google Sheets Real-Time Sync
              </h3>
              <p
                className={`text-xs leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                Live bidirectional audit streaming seamlessly links front desk logs into executive Google Sheets spreadsheets with zero latency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section
        id="faq"
        className={`py-16 border-b ${
          isDark
            ? 'bg-[#0D1828]/80 border-white/10'
            : 'bg-slate-100/70 border-slate-200'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-3 mb-10">
            <h2
              className={`text-2xl font-extrabold tracking-tight ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}
            >
              Frequently Asked Questions
            </h2>
            <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Clear answers regarding deployment, hardware compatibility, and day-to-day operations.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border overflow-hidden transition-all ${
                    isDark
                      ? 'border-white/10 bg-[#101D30]/90'
                      : 'border-slate-200 bg-white shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className={`w-full p-4 text-left flex items-center justify-between gap-4 text-xs font-bold transition-colors cursor-pointer ${
                      isDark
                        ? 'text-white hover:text-teal-300'
                        : 'text-slate-900 hover:text-teal-700'
                    }`}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isOpen
                          ? isDark
                            ? 'rotate-180 text-teal-300'
                            : 'rotate-180 text-teal-700'
                          : isDark
                          ? 'text-slate-400'
                          : 'text-slate-500'
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div
                      className={`px-4 pb-4 text-xs leading-relaxed border-t pt-2 ${
                        isDark
                          ? 'border-white/5 text-slate-300'
                          : 'border-slate-100 text-slate-600'
                      }`}
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom Call to Action Banner */}
      <section
        className={`py-16 lg:py-20 border-b ${
          isDark
            ? 'bg-gradient-to-br from-[#0F2942] via-[#123B5D] to-[#0A1927] border-white/10'
            : 'bg-gradient-to-br from-[#123B5D] via-[#0E2F4A] to-[#0A1927] text-white border-slate-300'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Operational Facility Management Hub</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
            Ready to Secure Your Campus Perimeter?
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Sign in with your designated credentials to access live front desk queues, badge printers, approval rosters, and facility administration.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              id="landing-bottom-cta-sign-in-btn"
              onClick={onNavigateToLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-black text-sm shadow-xl shadow-teal-400/25 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Lock className="w-4 h-4" />
              <span>Application Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="landing-bottom-cta-pre-register-btn"
              onClick={onNavigateToPublicPreRegister}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-teal-300" />
              <span>Visitor Pre-Registration Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 text-[11px] ${
          isDark ? 'bg-[#070D18] text-slate-400' : 'bg-slate-900 text-slate-400'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <JSAlphaSoftLogo forceDefaultBrand darkTheme size="sm" />
            <span>© 2026 JS AlphaSoft Enterprises. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="hover:text-teal-300 transition-colors cursor-pointer"
            >
              Application Sign In
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={onNavigateToPublicPreRegister}
              className="hover:text-teal-300 transition-colors cursor-pointer"
            >
              Visitor Self Pre-Registration
            </button>
            <span>•</span>
            <span>Zero-Trust Facility Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
