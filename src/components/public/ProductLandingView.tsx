import React, { useState, useEffect, useRef } from 'react';
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
  Moon,
  ExternalLink,
  Mail,
  Play,
  Pause
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
  const [scrollY, setScrollY] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleVideoPlayback = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

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
  const turnstilesNeeded = Math.ceil(visitorVolume / 1000);
  const paperRollsSavedMonth = Math.round(visitorVolume * 0.08);

  const featureTabs = [
    {
      id: 'kiosk',
      label: 'Check-In',
      navTitle: 'Front Desk & Fast Check-In',
      icon: ScanLine,
      title: 'Front Desk Excellence',
      description:
        'Automate lobby flows with touchless terminals and instant host arrivals dispatches across any secure campus architecture.',
      highlights: [
        'Instant walk-in registration with photo capture & signature',
        'Host arrivals via SMS, WhatsApp, and Slack',
        'Zero-trust screening against restricted lists',
        'Turnstile relay synchronization for gated exit'
      ],
      previewStats: [
        { label: 'Average Check-in', value: '15s' },
        { label: 'Wait Reduction', value: '78%' },
        { label: 'Dispatch Latency', value: '< 200 ms' }
      ]
    },
    {
      id: 'badge',
      label: 'QR Badges',
      navTitle: 'Thermal QR & Badge Engine',
      icon: Printer,
      title: 'High-Velocity Badge Architecture',
      description:
        'Deliver tamper-evident physical and dynamic expiring QR passes with company branding, cleared security zones, and direct Zebra ZPL hardware spooling.',
      highlights: [
        'High-speed thermal network spooler with automatic zero-lag cut',
        'Dynamic auto-expiring QR codes linked with turnstile relays',
        'Multi-tenant visual badges with clearance band coloring',
        'Pass designer studio with drag & drop component customizer'
      ],
      previewStats: [
        { label: 'Thermal Print Speed', value: '< 2.4s' },
        { label: 'Zebra ZPL Ready', value: '100%' },
        { label: 'QR Scan Replay Guard', value: 'Active' }
      ]
    },
    {
      id: 'multitenant',
      label: 'Governance',
      navTitle: 'Multi-Tenant Governance',
      icon: Building2,
      title: 'Zero-Trust Campus Partitioning',
      description:
        'Host thousands of corporate tenants on shared corporate campuses with rigorous RBAC access control, isolated tenant databases, and private branding.',
      highlights: [
        'Complete tenant data segregation with cryptographically isolated logs',
        'Tenant-specific portal branding, accent colors, and custom NDAs',
        'Dedicated department approvals and host directory synchronization',
        'Role-tailored interfaces for Super Admins, Guards, and Approvers'
      ],
      previewStats: [
        { label: 'Tenant Isolation', value: 'Strict RBAC' },
        { label: 'Custom Brand Engines', value: 'Enabled' },
        { label: 'Multi-Site Routing', value: 'Unified' }
      ]
    },
    {
      id: 'emergency',
      label: 'Evacuation',
      navTitle: 'Emergency Evacuation',
      icon: AlertTriangle,
      title: 'Life Safety & Emergency Rosters',
      description:
        'Instantly generate real-time muster lists, trigger SMS/WhatsApp perimeter evacuation broadcasts, and conduct live headcount roll calls during campus emergencies.',
      highlights: [
        'One-click instant building evacuation broadcast trigger',
        'Live on-site occupancy counts segregated by building and muster point',
        'Interactive roll call check-off for floor wardens and security leads',
        'Offline emergency roster caching on edge devices'
      ],
      previewStats: [
        { label: 'Roster Generation', value: '< 1.0s' },
        { label: 'Broadcast Dispatch', value: 'Instant' },
        { label: 'Edge Offline Roster', value: 'Encrypted' }
      ]
    },
    {
      id: 'audit',
      label: 'Audit Logs',
      navTitle: 'Immutable Audit Trail',
      icon: FileText,
      title: 'Forensic Access Ledger',
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
      q: 'How does the system enforce campus security?',
      a: 'It integrates pre-registration, government photo ID verification, and assignments to cleared physical zones monitored across entry and exit gates.'
    },
    {
      q: 'Can our enterprise brand the visitor passes?',
      a: 'Yes, all pass templates and check-in portals are fully skinnable to match corporate branding guidelines, including tenant logos, typography, accent colors, and safety NDAs.'
    },
    {
      q: 'Does it support hardware turnstiles and printers?',
      a: 'We provide full SDK support for various industrial optical turnstiles, Zebra ZPL/Brother thermal printers, optical barcode scanners, and touchscreen kiosks.'
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

  const serifStyle = { fontFamily: "'Cormorant Garamond', Georgia, serif" };
  const monoStyle = { fontFamily: "'JetBrains Mono', 'Geist Mono', monospace" };
  const parallaxOffset = Math.min(scrollY * 0.28, 140);

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 selection:bg-[#0F766E] selection:text-white ${
        isDark ? 'bg-[#0B1523] text-slate-100' : 'bg-[#F8F7F4] text-[#0F2942]'
      }`}
    >
      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-200 ${
          isDark
            ? 'bg-[#0A1628]/95 border-white/10 shadow-md text-white'
            : 'bg-white/95 border-slate-200/80 shadow-xs text-slate-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={onNavigateToLogin}>
              <JSAlphaSoftLogo forceDefaultBrand darkTheme={isDark} size="md" hideSubtitle={true} />
            </div>

            <nav
              className={`hidden lg:flex items-center gap-7 text-xs font-semibold px-5 py-2 rounded-full border transition-colors ${
                isDark
                  ? 'bg-slate-800/80 border-slate-700/80 text-slate-200'
                  : 'bg-slate-100/90 border-slate-200/80 text-slate-700'
              }`}
            >
              <a href="#features" className={`transition-colors ${isDark ? 'hover:text-teal-300' : 'hover:text-[#0F766E]'}`}>
                Kiosks
              </a>
              <a href="#architecture" className={`transition-colors ${isDark ? 'hover:text-teal-300' : 'hover:text-[#0F766E]'}`}>
                Architecture
              </a>
              <a href="#calculator" className={`transition-colors ${isDark ? 'hover:text-teal-300' : 'hover:text-[#0F766E]'}`}>
                Calculator
              </a>
              <a href="#compliance" className={`transition-colors ${isDark ? 'hover:text-teal-300' : 'hover:text-[#0F766E]'}`}>
                Compliance
              </a>
              <a href="#faq" className={`transition-colors ${isDark ? 'hover:text-teal-300' : 'hover:text-[#0F766E]'}`}>
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              id="landing-theme-toggle-btn"
              onClick={handleToggleTheme}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition cursor-pointer select-none ${
                isDark
                  ? 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/30 text-amber-300 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
              }`}
              title={isDark ? 'Switch to Clean Light Mode' : 'Switch to High-Contrast Dark Mode'}
            >
              {isDark ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-amber-300" />
                  <span className="hidden sm:inline text-[11px] font-bold">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline text-[11px] font-bold">Light</span>
                </>
              )}
            </button>

            {/* Visitor Pre-Reg Button */}
            <button
              type="button"
              id="landing-nav-pre-register-btn"
              onClick={onNavigateToPublicPreRegister}
              className={`hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition cursor-pointer ${
                isDark
                  ? 'border-teal-400/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Visitor Pre-Reg</span>
            </button>

            {/* Application Sign In Button */}
            <button
              type="button"
              id="landing-nav-sign-in-btn"
              onClick={onNavigateToLogin}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-xs transition active:scale-98 cursor-pointer shadow-sm bg-[#327988] hover:bg-[#2b6875] text-white shadow-slate-900/15"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Application Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 overflow-y-auto">
        {/* Parallax Hero Section with Animated Realistic Video Clip */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          <section className="relative overflow-hidden rounded-[28px] sm:rounded-[38px] border shadow-2xl transition-colors duration-200">
            {/* Parallax Realistic Animated Video Background */}
            <div
              className="absolute inset-0 pointer-events-none will-change-transform overflow-hidden"
              style={{
                transform: `translate3d(0, ${parallaxOffset}px, 0) scale(1.12)`,
                transformOrigin: 'center center',
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster="/videos/hero_entrance_poster.jpg"
                className="w-full h-full object-cover brightness-90 contrast-105"
              >
                <source src="/videos/hero_entrance.webm" type="video/webm" />
                <source src="/videos/hero_entrance.mp4" type="video/mp4" />
              </video>
            </div>

            {/* Measured Scrim Gradient Over Video guaranteeing WCAG AA readability */}
            <div
              className={`absolute inset-0 transition-colors duration-200 ${
                isDark
                  ? 'bg-gradient-to-b from-[#091322]/90 via-[#0B1523]/85 to-[#0B1523]/95'
                  : 'bg-gradient-to-b from-[#F8F7F4]/92 via-[#F8F7F4]/88 to-[#F8F7F4]/96'
              }`}
            />

            {/* Atmospheric subtle radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-teal-500/10 blur-3xl pointer-events-none rounded-full" />

            {/* Foreground Content */}
            <div
              style={{
                width: '850px',
                height: '670px',
                maxWidth: '100%',
              }}
              className="relative z-10 px-6 sm:px-12 lg:px-16 py-16 sm:py-24 text-center max-w-4xl mx-auto"
            >
              {/* Top Tag */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
                <div
                  style={monoStyle}
                  className={`text-[11px] sm:text-xs uppercase tracking-[0.18em] font-bold inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-2xs ${
                    isDark
                      ? 'bg-teal-500/15 border-teal-400/30 text-teal-300'
                      : 'bg-teal-700/10 border-teal-700/25 text-teal-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-400" />
                  <span>Visitor Access Management v2026.09</span>
                </div>
              </div>

              {/* Grand Display Headline */}
              <h1
                style={{
                  fontFamily: "'Carter One', cursive, sans-serif",
                  fontSize: '44px',
                  fontWeight: 'normal',
                  lineHeight: '58px',
                  width: '693.323px',
                  maxWidth: '100%',
                  marginLeft: '40px',
                  paddingLeft: '0px',
                  borderColor: isDark ? '#334155' : '#CBD5E1',
                  borderRadius: '6px',
                  borderWidth: '3px',
                  borderStyle: 'groove',
                  color: isDark ? '#caefdf' : '#0F2942',
                }}
                className="tracking-tight mb-6"
              >
                Zero-Trust Perimeter Access Intelligence for Modern Campuses
              </h1>

              {/* Subtitle */}
              <p
                className={`text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto mb-10 transition-colors ${
                  isDark ? 'text-slate-200' : 'text-slate-700'
                }`}
              >
                A high-throughput access governance platform designed to accelerate front-desk check-in, orchestrate multi-tenant visitor approvals, and enforce zero-trust optical turnstiles.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  type="button"
                  id="hero-primary-application-sign-in-btn"
                  onClick={onNavigateToLogin}
                  className={`w-full sm:w-auto px-9 py-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 ${
                    isDark
                      ? 'bg-[#0F766E] hover:bg-teal-400 text-white shadow-teal-950/40'
                      : 'bg-[#123B5D] hover:bg-[#0F766E] text-white shadow-slate-900/20'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  id="hero-secondary-pre-register-btn"
                  onClick={onNavigateToPublicPreRegister}
                  className={`w-full sm:w-auto px-9 py-4 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer border shadow-xs ${
                    isDark
                      ? 'border-white/20 bg-white/5 text-white hover:bg-white/15'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Share2 className="w-4 h-4 text-[#0F766E] dark:text-teal-400" />
                  <span>Visitor Registration Portal</span>
                </button>
              </div>
            </div>
          </section>

          {/* Stats Stripe */}
          <div
            className={`py-12 my-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center rounded-2xl border transition-colors ${
              isDark
                ? 'bg-[#0E1A2C]/80 border-white/10 text-white shadow-md'
                : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
            }`}
          >
            <div className="space-y-1">
              <span
                style={{ fontFamily: "'Esteban', serif", fontSize: '40px' }}
                className={`font-bold block leading-none ${isDark ? 'text-white' : 'text-[#0F2942]'}`}
              >
                99.9%
              </span>
              <span
                style={monoStyle}
                className="text-xs uppercase tracking-[0.18em] font-bold text-[#0F766E] dark:text-teal-400 block"
              >
                Hardware Uptime
              </span>
            </div>
            <div className="space-y-1">
              <span
                style={{ fontFamily: "'Esteban', serif", fontSize: '40px' }}
                className={`font-bold block leading-none ${isDark ? 'text-white' : 'text-[#0F2942]'}`}
              >
                &lt;3.0s
              </span>
              <span
                style={monoStyle}
                className="text-xs uppercase tracking-[0.18em] font-bold text-[#0F766E] dark:text-teal-400 block"
              >
                Badge Thermal Print
              </span>
            </div>
            <div className="space-y-1">
              <span
                style={{ fontFamily: "'Esteban', serif", fontSize: '40px' }}
                className={`font-bold block leading-none ${isDark ? 'text-white' : 'text-[#0F2942]'}`}
              >
                ISO
              </span>
              <span
                style={monoStyle}
                className="text-xs uppercase tracking-[0.18em] font-bold text-[#0F766E] dark:text-teal-400 block"
              >
                27001 &amp; SOC-2
              </span>
            </div>
            <div className="space-y-1">
              <span
                style={{ fontFamily: "'Esteban', serif", fontSize: '40px', fontWeight: 'bold' }}
                className={`font-bold block leading-none ${isDark ? 'text-white' : 'text-[#0F2942]'}`}
              >
                EDGE
              </span>
              <span
                style={monoStyle}
                className="text-xs uppercase tracking-[0.18em] font-bold text-[#0F766E] dark:text-teal-400 block"
              >
                Offline Resilient
              </span>
            </div>
          </div>
        </div>

        {/* Feature Section with Distinctive Rounded Top (.features-wrapper) */}
        <div
          id="features"
          className={`mt-10 pt-16 sm:pt-24 pb-20 border-t rounded-t-[40px] sm:rounded-t-[60px] transition-colors ${
            isDark
              ? 'bg-[#0E1A2C] border-white/10'
              : 'bg-white border-[#123B5D]/10'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            {/* Feature Tabs (5 Grid Columns) */}
            <div
              className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[1px] p-[1px] rounded-2xl mb-14 border overflow-hidden ${
                isDark
                  ? 'bg-white/10 border-white/15'
                  : 'bg-[#123B5D]/10 border-[#123B5D]/10'
              }`}
            >
              {featureTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-3 text-center transition-all cursor-pointer ${
                      isActive
                        ? isDark
                          ? 'bg-[#15273F] text-white border-b-2 border-teal-400 shadow-inner'
                          : 'bg-teal-50/90 text-teal-950 border-b-2 border-[#0F766E] shadow-2xs'
                        : isDark
                        ? 'bg-[#0B1626] text-slate-300 hover:bg-[#122238] hover:text-white'
                        : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span
                      style={{ fontFamily: "'Esteban', serif", fontSize: '15px' }}
                      className={`uppercase tracking-[0.18em] font-bold block ${
                        isActive ? (isDark ? 'text-teal-300' : 'text-[#0F766E]') : ''
                      }`}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feature Content (Left Copy + Right Efficiency Card) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              <div className="lg:col-span-7 space-y-6">
                <h2
                  style={{ ...serifStyle, fontSize: '41px' }}
                  className={`font-semibold leading-tight ${
                    isDark ? 'text-white' : 'text-[#0F2942]'
                  }`}
                >
                  {currentTabObj.title}
                </h2>

                <p
                  style={{ fontFamily: "'Clarity City', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontSize: '18px', fontWeight: 'bold' }}
                  className={`leading-relaxed ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}
                >
                  {currentTabObj.description}
                </p>

                <ul className="space-y-3.5 pt-2">
                  {currentTabObj.highlights.map((item, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-3 text-sm sm:text-base font-medium ${
                        isDark ? 'text-slate-100' : 'text-slate-800'
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-[#0F766E] dark:bg-teal-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={onNavigateToLogin}
                    className={`px-6 py-3 rounded-full font-bold text-xs transition cursor-pointer shadow-md flex items-center gap-2 ${
                      isDark
                        ? 'bg-[#0F766E] hover:bg-teal-400 text-white shadow-teal-950/40'
                        : 'bg-[#123B5D] hover:bg-[#0F766E] text-white shadow-slate-900/15'
                    }`}
                  >
                    <span>Launch in Terminal</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={onNavigateToPublicPreRegister}
                    className={`px-6 py-3 rounded-full border text-xs font-bold transition cursor-pointer ${
                      isDark
                        ? 'border-white/20 bg-white/5 text-white hover:bg-white/15'
                        : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span>Test Pre-Registration</span>
                  </button>
                </div>
              </div>

              {/* Right: Efficiency Report Card */}
              <div className="lg:col-span-5">
                <div
                  className={`p-8 sm:p-12 rounded-3xl border text-center transition-colors shadow-lg ${
                    isDark
                      ? 'bg-[#0B1728] border-white/10'
                      : 'bg-white border-slate-200/90 shadow-sm'
                  }`}
                >
                  <div
                    style={{ ...monoStyle, fontSize: '17px' }}
                    className="uppercase tracking-[0.2em] font-semibold text-[#0F766E] mb-8"
                  >
                    Efficiency Report
                  </div>

                  <div className="flex justify-center items-center gap-8 sm:gap-12">
                    <div className="text-center">
                      <div
                        style={serifStyle}
                        className={`text-4xl sm:text-5xl font-semibold ${
                          isDark ? 'text-white' : 'text-[#123B5D]'
                        }`}
                      >
                        {currentTabObj.previewStats[0]?.value || '15s'}
                      </div>
                      <div
                        style={{ ...monoStyle, fontSize: '13px' }}
                        className={`uppercase tracking-wider mt-1 ${
                          isDark ? 'text-slate-400' : 'text-slate-600 font-medium'
                        }`}
                      >
                        {currentTabObj.previewStats[0]?.label || 'Avg. Check-In'}
                      </div>
                    </div>

                    <div className="text-center">
                      <div
                        style={serifStyle}
                        className="text-4xl sm:text-5xl font-semibold text-[#0F766E]"
                      >
                        {currentTabObj.previewStats[1]?.value || '78%'}
                      </div>
                      <div
                        style={{ ...monoStyle, fontSize: '13px' }}
                        className={`uppercase tracking-wider mt-1 ${
                          isDark ? 'text-slate-400' : 'text-slate-600 font-medium'
                        }`}
                      >
                        {currentTabObj.previewStats[1]?.label || 'Wait Reduction'}
                      </div>
                    </div>
                  </div>

                  <p
                    className={`mt-8 text-xs italic ${
                      isDark ? 'text-slate-400' : 'text-[#123B5D]/70'
                    }`}
                  >
                    Operational data indicates zero turnstile lag during rush hour traffic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enterprise Architecture Deployment Ribbon */}
        <section
          id="architecture"
          className={`py-12 border-y transition-colors ${
            isDark
              ? 'bg-[#060D17] border-white/10 text-slate-200'
              : 'bg-slate-100 border-slate-200 text-slate-900'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div
              style={{ ...monoStyle, fontSize: '15px' }}
              className="text-center font-bold tracking-[0.2em] uppercase text-[#0F766E] dark:text-teal-400 mb-6"
            >
              Validated Enterprise Deployments
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-items-center">
              <div className="text-center">
                <div style={serifStyle} className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F2942]'}`}>
                  TATA ADVANCED
                </div>
                <div style={{ ...monoStyle, fontSize: '13px' }} className="text-[#0F766E] dark:text-teal-300 font-medium">
                  Bengaluru Campus
                </div>
              </div>
              <div className="text-center">
                <div style={serifStyle} className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F2942]'}`}>
                  RELIANCE JIO
                </div>
                <div style={{ ...monoStyle, fontSize: '13px' }} className="text-[#0F766E] dark:text-teal-300 font-medium">
                  Cyber Park
                </div>
              </div>
              <div className="text-center">
                <div style={serifStyle} className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F2942]'}`}>
                  INFOSYS DEV
                </div>
                <div style={{ ...monoStyle, fontSize: '13px' }} className="text-[#0F766E] dark:text-teal-300 font-medium">
                  DLF Phase 2
                </div>
              </div>
              <div className="text-center">
                <div style={serifStyle} className={`text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F2942]'}`}>
                  BFSI CORE SOC
                </div>
                <div style={{ ...monoStyle, fontSize: '13px' }} className="text-[#0F766E] dark:text-teal-300 font-medium">
                  BKC Perimeter
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Campus Readiness Calculator (#calculator) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <section
            id="calculator"
            style={{ backgroundColor: '#819fb7' }}
            className={`my-16 sm:my-24 p-8 sm:p-14 lg:p-20 rounded-[32px] sm:rounded-[44px] text-white shadow-2xl relative overflow-hidden border ${
              isDark
                ? 'border-cyan-500/20'
                : 'border-slate-700/30'
            }`}
          >
            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div
                style={{ ...monoStyle, fontSize: '16px', color: '#085149' }}
                className="uppercase tracking-[0.2em] font-semibold"
              >
                CAPACITY SIZING ENGINE
              </div>

              <h2
                style={{
                  fontFamily: "'Esteban', serif",
                  fontWeight: 'bold',
                  color: '#053c24',
                  fontSize: '40px',
                }}
                className="text-3xl sm:text-5xl font-semibold leading-tight"
              >
                Campus Readiness Calculator
              </h2>

              <p
                style={{ color: '#1c0202' }}
                className="text-sm sm:text-base font-light max-w-xl mx-auto"
              >
                Scale visitor volume to see recommended hardware specifications.
              </p>

              {/* Slider Component */}
              <div className="pt-6 max-w-2xl mx-auto">
                <input
                  type="range"
                  min="500"
                  max="25000"
                  step="500"
                  value={visitorVolume}
                  onChange={(e) => setVisitorVolume(Number(e.target.value))}
                  style={{ borderColor: '#147878' }}
                  className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-[#0F766E]"
                />

                <div
                  style={monoStyle}
                  className="flex justify-between items-center text-[10px] sm:text-[11px] mt-4"
                >
                  <span
                    style={{ fontSize: '13px', fontWeight: 'bold', color: '#146464' }}
                  >
                    500 (SINGLE)
                  </span>
                  <span
                    style={{ color: '#0f6464' }}
                    className="text-xl sm:text-2xl font-bold"
                  >
                    {visitorVolume.toLocaleString()} MONTHLY
                  </span>
                  <span
                    style={{ fontSize: '13px', fontWeight: 'bold', color: '#146464' }}
                  >
                    25,000 (MULTI-CAMPUS)
                  </span>
                </div>

                {/* 3 Output Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 mt-8 border-t border-white/10">
                  <div className="space-y-1">
                    <span
                      style={serifStyle}
                      className="text-3xl sm:text-4xl font-semibold text-white block leading-none"
                    >
                      {turnstilesNeeded}
                    </span>
                    <span
                      style={monoStyle}
                      className="text-[10px] uppercase tracking-[0.15em] font-semibold text-teal-300 block"
                    >
                      OPTICAL GATES
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span
                      style={serifStyle}
                      className="text-3xl sm:text-4xl font-semibold text-teal-300 block leading-none"
                    >
                      {estCheckInSeconds}s
                    </span>
                    <span
                      style={monoStyle}
                      className="text-[10px] uppercase tracking-[0.15em] font-semibold text-teal-300 block"
                    >
                      BADGE DISPATCH
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span
                      style={serifStyle}
                      className="text-3xl sm:text-4xl font-semibold text-white block leading-none"
                    >
                      {paperRollsSavedMonth}
                    </span>
                    <span
                      style={monoStyle}
                      className="text-[10px] uppercase tracking-[0.15em] font-semibold text-teal-300 block"
                    >
                      REAMS SAVED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Compliance Grid (#compliance) */}
          <section id="compliance" className="py-12 sm:py-16">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div
                style={monoStyle}
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold text-[#0F766E] mb-2"
              >
                COMPLIANCE & GOVERNANCE
              </div>
              <h2
                style={{
                  ...serifStyle,
                  fontSize: '40px',
                  width: '1200px',
                  maxWidth: '100%',
                  paddingTop: '2px',
                  marginBottom: '4px',
                  height: '100px',
                  marginRight: '8px',
                  marginLeft: '-42px',
                  paddingLeft: '3px',
                  paddingRight: '1px',
                }}
                className={`text-3xl sm:text-4xl font-semibold ${
                  isDark ? 'text-white' : 'text-[#0F2942]'
                }`}
              >
                Zero-Trust Physical Governance
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Card 1 */}
              <div
                className={`p-8 sm:p-10 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                  isDark
                    ? 'bg-[#0B1728] border-white/10'
                    : 'bg-white border-slate-200/80 shadow-sm'
                }`}
              >
                <div
                  style={{ ...monoStyle, fontSize: '14px' }}
                  className="uppercase tracking-[0.18em] font-bold text-[#0F766E] dark:text-teal-400 mb-4"
                >
                  DPDP 2023
                </div>
                <h4
                  className={`text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-[#0F2942]'
                  }`}
                >
                  Regulatory Governance
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Captures consent and automates dynamic data anonymization to maintain statutory compliance with DPDP Act 2023 and ISO 27001.
                </p>
              </div>

              {/* Card 2 */}
              <div
                className={`p-8 sm:p-10 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                  isDark
                    ? 'bg-[#0B1728] border-white/10'
                    : 'bg-white border-slate-200/80 shadow-sm'
                }`}
              >
                <div
                  style={{ ...monoStyle, fontSize: '14px' }}
                  className="uppercase tracking-[0.18em] font-bold text-[#0F766E] dark:text-teal-400 mb-4"
                >
                  PERIMETER
                </div>
                <h4
                  className={`text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-[#0F2942]'
                  }`}
                >
                  Zero-Trust Isolation
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Rigid routing protocols ensure visitors are strictly barred from unauthorized laboratories, server rooms, and vault zones.
                </p>
              </div>

              {/* Card 3 */}
              <div
                className={`p-8 sm:p-10 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
                  isDark
                    ? 'bg-[#0B1728] border-white/10'
                    : 'bg-white border-slate-200/80 shadow-sm'
                }`}
              >
                <div
                  style={{ ...monoStyle, fontSize: '14px' }}
                  className="uppercase tracking-[0.18em] font-bold text-[#0F766E] dark:text-teal-400 mb-4"
                >
                  BIDIRECTIONAL
                </div>
                <h4
                  className={`text-lg font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-[#0F2942]'
                  }`}
                >
                  Sheets Real-Time Sync
                </h4>
                <p
                  className={`text-sm leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  Immediate data replication to cloud-based spreadsheets and relational PostgreSQL database for executive oversight.
                </p>
              </div>
            </div>
          </section>

          {/* Accordion FAQ (#faq) */}
          <section id="faq" className={`py-14 sm:py-20 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="max-w-3xl mx-auto">
              <div
                style={monoStyle}
                className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-bold text-[#0F766E] dark:text-teal-400 mb-3"
              >
                INQUIRIES
              </div>

              <h2
                style={{
                  ...serifStyle,
                  fontSize: '40px',
                  height: '80px',
                  paddingTop: '18px',
                  paddingLeft: '60px',
                }}
                className={`text-3xl sm:text-5xl font-semibold mb-10 ${
                  isDark ? 'text-white' : 'text-[#0F2942]'
                }`}
              >
                Enterprise Common Questions
              </h2>

              <div className="space-y-4">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div
                      key={idx}
                      className={`border-b pb-4 transition-colors ${
                        isDark ? 'border-white/10' : 'border-slate-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className={`w-full py-2 text-left flex items-center justify-between gap-4 font-semibold text-base sm:text-lg transition-colors cursor-pointer ${
                          isDark
                            ? 'text-white hover:text-teal-300'
                            : 'text-[#0F2942] hover:text-[#0F766E]'
                        }`}
                      >
                        <span>{faq.q}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform ${
                            isOpen ? 'rotate-180 text-[#0F766E] dark:text-teal-400' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p
                          className={`pt-2 pb-1 text-sm sm:text-base font-normal leading-relaxed ${
                            isDark ? 'text-slate-300' : 'text-slate-600'
                          }`}
                        >
                          {faq.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Enterprise Direct Contact Card */}
              <div
                style={{
                  height: '201.833px',
                  width: '792px',
                  maxWidth: '100%',
                }}
                className={`mt-10 p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors shadow-lg ${
                  isDark
                    ? 'bg-[#0B1E38] border-teal-500/30 text-white'
                    : 'bg-white border-slate-200/90 text-slate-900 shadow-sm'
                }`}
              >
                <div>
                  <div style={{ ...monoStyle, fontSize: '13px', fontWeight: 'bold' }} className="uppercase tracking-[0.2em] text-[#0F766E] dark:text-teal-400 mb-1">
                    DIRECT ENTERPRISE LIAISON
                  </div>
                  <h3 style={serifStyle} className={`text-2xl sm:text-3xl font-semibold ${isDark ? 'text-white' : 'text-[#0F2942]'}`}>
                    JS Alphasoft Private Limited
                  </h3>
                  <p className={`text-xs sm:text-sm mt-1 max-w-xl ${isDark ? 'text-slate-200' : 'text-slate-600'}`}>
                    Connect with our deployment engineering team for custom hardware integrations, enterprise SLAs, and campus tenant provisioning.
                  </p>
                </div>
                <a
                  href="mailto:info@jsalphasoft.com"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#0F766E] hover:bg-teal-500 text-white font-bold text-xs tracking-wide transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
                >
                  <Mail className="w-4 h-4 text-white" />
                  <span>info@jsalphasoft.com</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`py-12 border-t transition-colors ${
          isDark
            ? 'bg-[#060D17] border-white/10 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <div style={serifStyle} className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#0F2942]'}`}>
              JS Alphasoft Private Limited
            </div>
            <a
              href="mailto:info@jsalphasoft.com"
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-all text-xs font-medium cursor-pointer ${
                isDark
                  ? 'border-teal-500/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20 hover:text-white'
                  : 'border-[#0F766E]/20 bg-[#0F766E]/5 text-[#0F766E] hover:bg-[#0F766E]/10 hover:border-[#0F766E]/40'
              }`}
              title="Send email to JS Alphasoft Private Limited"
            >
              <Mail className="w-3.5 h-3.5 text-[#0F766E] dark:text-teal-300" />
              <span><strong className="font-semibold underline underline-offset-2">info@jsalphasoft.com</strong></span>
            </a>
          </div>

          <div style={monoStyle} className="text-[10px] tracking-wider uppercase font-semibold">
            © 2026. ALL RIGHTS RESERVED.
          </div>

          <div className="flex gap-6 text-[11px] font-semibold" style={monoStyle}>
            <button
              type="button"
              onClick={onNavigateToLogin}
              className={`transition-colors cursor-pointer ${isDark ? 'hover:text-teal-300 text-slate-400' : 'hover:text-[#0F766E] text-slate-600'}`}
            >
              PRIVACY POLICY
            </button>
            <button
              type="button"
              onClick={onNavigateToPublicPreRegister}
              className={`transition-colors cursor-pointer ${isDark ? 'hover:text-teal-300 text-slate-400' : 'hover:text-[#0F766E] text-slate-600'}`}
            >
              SECURITY PROTOCOLS
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
