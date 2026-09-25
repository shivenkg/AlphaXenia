import React, { useState, useEffect } from 'react';
import {
  Compass,
  CheckCircle2,
  Circle,
  Copy,
  Check,
  Download,
  Play,
  Search,
  Filter,
  Layers,
  Shield,
  KeyRound,
  Database,
  Cpu,
  Printer,
  QrCode,
  FileCode,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  AlertTriangle,
  FileText,
  RefreshCw,
  ArrowRight,
  Terminal,
  BookOpen
} from 'lucide-react';
import {
  ARCHITECTURE_PHASES,
  ARCHITECTURE_STEPS,
  ArchitectureGuideStep,
  ArchitectureGuidePhase,
  generateArchitectureRunbookMarkdown
} from '../../data/architectureGuide';
import { NavViewId } from '../../types';

interface ArchitectureStepByStepGuideProps {
  onNavigateTab?: (tab: 'adrs' | 'api' | 'ddl' | 'uat' | 'iam') => void;
  onNavigateView?: (view: NavViewId) => void;
  onRunAllUAT?: () => void;
  passRate?: number;
}

const STORAGE_KEY = 'vms_arch_guide_completed_steps';

export const ArchitectureStepByStepGuide: React.FC<ArchitectureStepByStepGuideProps> = ({
  onNavigateTab,
  onNavigateView,
  onRunAllUAT,
  passRate = 100,
}) => {
  // Initialize completed steps from localStorage or default initial 4 completed
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      'STEP-01': true,
      'STEP-02': true,
      'STEP-03': true,
      'STEP-04': true,
    };
  });

  const [selectedPhase, setSelectedPhase] = useState<string>('ALL');
  const [criticalityFilter, setCriticalityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedStepId, setExpandedStepId] = useState<string | null>('STEP-01');
  const [copiedSnippetKey, setCopiedSnippetKey] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [runningUatNow, setRunningUatNow] = useState<boolean>(false);

  // Sync to local storage
  const toggleStepCompleted = (stepId: string) => {
    setCompletedSteps((prev) => {
      const updated = { ...prev, [stepId]: !prev[stepId] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetChecklist = () => {
    const empty: Record<string, boolean> = {};
    setCompletedSteps(empty);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(empty));
    } catch {
      // ignore
    }
  };

  const handleMarkAllComplete = () => {
    const allDone: Record<string, boolean> = {};
    ARCHITECTURE_STEPS.forEach((s) => {
      allDone[s.id] = true;
    });
    setCompletedSteps(allDone);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allDone));
    } catch {
      // ignore
    }
  };

  const completedCount = ARCHITECTURE_STEPS.filter((s) => completedSteps[s.id]).length;
  const totalCount = ARCHITECTURE_STEPS.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Copy code snippet with fallback
  const handleCopyCode = async (key: string, code: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedSnippetKey(key);
    setTimeout(() => setCopiedSnippetKey(null), 2000);
  };

  // Download official runbook markdown
  const handleDownloadRunbook = () => {
    const md = generateArchitectureRunbookMarkdown();
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vms-enterprise-architecture-runbook.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Trigger UAT run
  const handleTriggerUat = () => {
    setRunningUatNow(true);
    if (onRunAllUAT) {
      onRunAllUAT();
    }
    setTimeout(() => {
      setRunningUatNow(false);
    }, 1200);
  };

  // Filter steps
  const filteredSteps = ARCHITECTURE_STEPS.filter((step) => {
    const matchesPhase = selectedPhase === 'ALL' || step.phaseId === selectedPhase;
    const matchesCriticality = criticalityFilter === 'ALL' || step.criticality === criticalityFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      step.id.toLowerCase().includes(q) ||
      step.title.toLowerCase().includes(q) ||
      step.subtitle.toLowerCase().includes(q) ||
      step.roleResponsible.toLowerCase().includes(q) ||
      step.objective.toLowerCase().includes(q) ||
      step.specReferences.some((r) => r.toLowerCase().includes(q)) ||
      step.adrReferences.some((r) => r.toLowerCase().includes(q));

    return matchesPhase && matchesCriticality && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn text-xs">
      {/* ========================================================================= */}
      {/* 1. HERO & ARCHITECTURE RUNBOOK HEADER */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-[#123B5D] via-[#0e2f4a] to-[#0A192F] text-white rounded-2xl p-6 shadow-md border border-[#1e4e75] relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 font-mono text-[11px] font-bold border border-teal-400/30 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                STEP-BY-STEP ENTERPRISE RUNBOOK
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-teal-200 text-xs font-semibold">
                Version 4.2.0-Production
              </span>
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Zero-Trust Multi-Tenant Architecture
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white">
              Enterprise Architecture & System Specifications: Step-by-Step Deployment Guide
            </h2>

            <p className="text-slate-300 text-xs leading-relaxed">
              An authoritative 10-step, 5-phase engineering runbook covering PostgreSQL RLS partitioning,
              tamper-evident WORM audit chaining, OIDC federated authentication, hardware edge turnstiles,
              and 25-point automated UAT verification.
            </p>
          </div>

          {/* Quick Actions & Status Widget */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              id="guide-download-runbook-btn"
              onClick={handleDownloadRunbook}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-[#0e2f4a] font-black text-xs transition shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              <span>{downloadSuccess ? 'Downloaded Runbook!' : 'Download Runbook (.md)'}</span>
            </button>

            <button
              type="button"
              id="guide-trigger-uat-btn"
              onClick={handleTriggerUat}
              className="px-4 py-2.5 rounded-xl bg-purple-700/80 hover:bg-purple-600 text-white font-bold text-xs transition border border-purple-400/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              {runningUatNow ? (
                <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
              ) : (
                <Play className="w-4 h-4 text-purple-200" />
              )}
              <span>Run Automated 25 UATs</span>
            </button>
          </div>
        </div>

        {/* Live Progress Bar & Readiness Metric */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="md:col-span-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <span>Deployment & Verification Progress:</span>
                <strong className="text-teal-300 font-mono text-sm">
                  {completedCount} of {totalCount} Steps ({progressPercent}%)
                </strong>
              </span>
              <span className="text-[11px] font-mono text-slate-300">
                {progressPercent === 100 ? '✅ 100% PRODUCTION READY' : '⏳ VERIFICATION IN PROGRESS'}
              </span>
            </div>

            <div className="w-full bg-slate-800/80 rounded-full h-2.5 overflow-hidden border border-white/10 p-0.5">
              <div
                className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Estimated Run Time
            </span>
            <span className="text-base font-black text-white font-mono">~235 Minutes</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Compliance Standard
            </span>
            <span className="text-xs font-black text-teal-300 font-mono">SOC2 / ISO 27001 / NFPA</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. VISUAL SYSTEM TOPOLOGY PIPELINE */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#123B5D]" />
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Zero-Trust Architecture Flow & Data Topology
            </h3>
          </div>
          <span className="text-[10px] font-mono text-slate-400">
            End-to-End Visitor Ingress Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Tier 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 relative">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-teal-700">
                <Cpu className="w-3.5 h-3.5" /> 1. Edge & Peripherals
              </span>
              <span className="text-[9px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-mono font-bold">
                IoT / Kiosks
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Self-service kiosks, optical turnstiles, thermal badge printers, and mobile QR scanners.
            </p>
          </div>

          {/* Tier 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 relative">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-indigo-700">
                <KeyRound className="w-3.5 h-3.5" /> 2. Gateway & OIDC
              </span>
              <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.2 rounded font-mono font-bold">
                Auth & REST
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              OIDC PKCE token validation, 11-tier RBAC clearance, mTLS mutual device authentication.
            </p>
          </div>

          {/* Tier 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 relative">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-purple-700">
                <FileCode className="w-3.5 h-3.5" /> 3. Application Services
              </span>
              <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-mono font-bold">
                Core VMS
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Visitor lifecycle state machine, OFAC watchlist screening, Twilio SMS & Slack alert dispatch.
            </p>
          </div>

          {/* Tier 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 relative">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <Database className="w-3.5 h-3.5" /> 4. PostgreSQL & WORM
              </span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                RLS Storage
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Strict multi-tenant Row-Level Security isolation and append-only SHA-256 hash-chained audit trails.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FILTER BAR & PHASE SELECTOR */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Phase Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            type="button"
            onClick={() => setSelectedPhase('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-xs ${
              selectedPhase === 'ALL'
                ? 'bg-[#123B5D] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>All Phases (10 Steps)</span>
          </button>

          {ARCHITECTURE_PHASES.map((phase) => {
            const count = ARCHITECTURE_STEPS.filter((s) => s.phaseId === phase.id).length;
            const completedInPhase = ARCHITECTURE_STEPS.filter(
              (s) => s.phaseId === phase.id && completedSteps[s.id]
            ).length;

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => setSelectedPhase(phase.id)}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer text-xs ${
                  selectedPhase === phase.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{phase.badge}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    selectedPhase === phase.id
                      ? 'bg-teal-900 text-teal-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {completedInPhase}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search, Criticality & Checklist Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 flex-1 w-full sm:w-auto max-w-md">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search steps by title, role, command, or spec..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Criticality:
              </span>
              <select
                value={criticalityFilter}
                onChange={(e) => setCriticalityFilter(e.target.value)}
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="ALL">All Levels</option>
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleMarkAllComplete}
                className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-[11px] font-bold transition cursor-pointer"
                title="Mark all 10 steps as completed"
              >
                Check All
              </button>
              <button
                type="button"
                onClick={handleResetChecklist}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-[11px] font-bold transition cursor-pointer"
                title="Reset completed checkboxes"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. STEP-BY-STEP IMPLEMENTATION CARDS */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        {filteredSteps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 space-y-2">
            <AlertTriangle className="w-6 h-6 mx-auto text-amber-500" />
            <p className="font-bold text-slate-700">No implementation steps match your criteria.</p>
            <p className="text-xs">Try clearing the search query or adjusting the phase filter.</p>
          </div>
        ) : (
          filteredSteps.map((step: ArchitectureGuideStep) => {
            const isCompleted = !!completedSteps[step.id];
            const isExpanded = expandedStepId === step.id;
            const phase = ARCHITECTURE_PHASES.find((p) => p.id === step.phaseId);

            return (
              <div
                key={step.id}
                id={`guide-step-${step.id}`}
                className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs overflow-hidden ${
                  isCompleted
                    ? 'border-emerald-200/90 ring-1 ring-emerald-500/10'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Step Header Accordion Toggle */}
                <div
                  className={`p-4.5 cursor-pointer select-none transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isExpanded ? 'bg-slate-50/80 border-b border-slate-200' : 'hover:bg-slate-50/40'
                  }`}
                  onClick={() => setExpandedStepId(isExpanded ? null : step.id)}
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    {/* Checkbox */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStepCompleted(step.id);
                      }}
                      className="mt-0.5 shrink-0 text-slate-400 hover:text-teal-600 transition cursor-pointer"
                      title={isCompleted ? 'Mark step as incomplete' : 'Mark step as completed'}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-[11px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {step.id}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          Step {step.stepNumber} of 10
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          {phase?.badge || step.phaseId}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-black px-2 py-0.5 rounded ${
                            step.criticality === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : step.criticality === 'HIGH'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {step.criticality}
                        </span>
                      </div>

                      <h3
                        className={`text-sm font-bold mt-1 tracking-tight ${
                          isCompleted ? 'text-slate-800' : 'text-[#172B3A]'
                        }`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 font-bold block">Estimated Time</span>
                      <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.estimatedMinutes}m
                      </span>
                    </div>

                    <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200 transition">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Step Body */}
                {isExpanded && (
                  <div className="p-5 space-y-5 bg-white text-slate-700 animate-fadeIn">
                    {/* Meta Bar */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Role Responsible
                        </span>
                        <span className="font-bold text-slate-900 text-xs">{step.roleResponsible}</span>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Master Specifications
                        </span>
                        <div className="flex items-center gap-1 flex-wrap mt-0.5">
                          {step.specReferences.map((ref, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.2 rounded font-mono font-semibold"
                            >
                              {ref}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          ADR Architectural Governance
                        </span>
                        <div className="flex items-center gap-1 flex-wrap mt-0.5">
                          {step.adrReferences.map((adr, i) => (
                            <span
                              key={i}
                              className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded font-mono font-bold"
                            >
                              {adr}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Objective & Context */}
                    <div className="space-y-2">
                      <div className="bg-teal-50/60 border border-teal-200 rounded-xl p-3.5 space-y-1">
                        <span className="text-[10px] font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-teal-700" /> Architectural Objective
                        </span>
                        <p className="text-teal-950 font-medium text-xs leading-relaxed">
                          {step.objective}
                        </p>
                      </div>

                      <p className="text-slate-600 text-xs leading-relaxed pl-1">
                        <strong className="text-slate-900">Engineering Rationale: </strong>
                        {step.architectureContext}
                      </p>
                    </div>

                    {/* Key Deliverables */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                        Key Architecture Deliverables:
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {step.keyDeliverables.map((d, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-slate-800"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />
                            <span className="text-xs">{d}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Execution Steps & Code Snippets */}
                    <div className="space-y-3.5">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-[#123B5D]" /> Technical Execution Steps &
                        Artifacts:
                      </h4>

                      {step.executionSteps.map((es, idx) => (
                        <div key={idx} className="space-y-2 bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#123B5D] text-white flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                              {idx + 1}
                            </span>
                            <h5 className="font-bold text-slate-900 text-xs">{es.title}</h5>
                          </div>
                          <p className="text-slate-600 text-xs leading-relaxed pl-7">{es.description}</p>

                          {es.codeSnippet && (
                            <div className="ml-7 mt-2 space-y-1">
                              <div className="flex items-center justify-between bg-slate-800 text-slate-200 px-3 py-1.5 rounded-t-xl text-[11px] font-mono border-b border-slate-700">
                                <span className="font-bold text-teal-400">
                                  {es.codeSnippet.title}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCopyCode(
                                      `${step.id}-snippet-${idx}`,
                                      es.codeSnippet?.code || ''
                                    )
                                  }
                                  className="flex items-center gap-1 text-[10px] bg-slate-700 hover:bg-slate-600 text-white px-2 py-0.5 rounded transition cursor-pointer"
                                >
                                  {copiedSnippetKey === `${step.id}-snippet-${idx}` ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-400" />
                                      <span className="text-emerald-400 font-bold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy</span>
                                    </>
                                  )}
                                </button>
                              </div>
                              <pre className="bg-[#0e1c2b] text-teal-300 p-3.5 rounded-b-xl font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800 shadow-inner">
                                {es.codeSnippet.code}
                              </pre>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Verification Checklist */}
                    <div className="space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                        Verification & Acceptance Sign-Off:
                      </h4>
                      <ul className="space-y-1.5 pl-1">
                        {step.verificationChecklist.map((vc, i) => (
                          <li key={i} className="flex items-start gap-2 text-slate-700 text-xs">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                            <span>{vc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Troubleshooting Tips */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Engineering Best
                        Practices & Pitfalls:
                      </span>
                      <ul className="space-y-1 pl-4 list-disc text-[11px] text-amber-950">
                        {step.troubleshootingTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Step Actions & Cross-Tab Navigation */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {step.relatedTab && onNavigateTab && (
                          <button
                            type="button"
                            onClick={() => onNavigateTab(step.relatedTab!)}
                            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{step.relatedTabLabel || `Open ${step.relatedTab.toUpperCase()}`}</span>
                          </button>
                        )}

                        {step.deepLinkView && onNavigateView && (
                          <button
                            type="button"
                            onClick={() => onNavigateView(step.deepLinkView as NavViewId)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Jump to {step.deepLinkView.replace(/_/g, ' ')} Module</span>
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleStepCompleted(step.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                          isCompleted
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-[#123B5D] hover:bg-[#0e2f4a] text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Step Verified & Complete</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Mark Step as Verified</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* 5. FOOTER RUNBOOK SUMMARY */}
      {/* ========================================================================= */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-600 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#123B5D]" />
            <h4 className="font-bold text-slate-900 text-xs">
              Enterprise Architecture Review Board (ARB) Sign-Off
            </h4>
          </div>
          <p className="text-[11px] text-slate-500">
            All 10 steps adhere to RFC 7519 (JWT), RFC 7807 (Problem Details), OpenAPI 3.1, and SOC2 Trust Services Criteria.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadRunbook}
          className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-bold text-xs transition shadow-2xs flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5 text-slate-600" />
          <span>Export Markdown Runbook</span>
        </button>
      </div>
    </div>
  );
};
