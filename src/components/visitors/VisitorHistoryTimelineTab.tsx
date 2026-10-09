import React, { useState, useMemo, useEffect } from 'react';
import {
  Clock,
  Calendar,
  User,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
  Search,
  ArrowUpDown,
  Filter,
  Plus,
  ArrowLeft,
  Briefcase,
  MapPin,
  Lock,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ReferenceLine
} from 'recharts';
import { storageService } from '../../services/storageService';
import { VisitorProfile, Visit } from '../../types';
import { getGlobalThemeMode } from '../../utils/themeApplier';

interface VisitorHistoryTimelineTabProps {
  initialVisitorId?: string | null;
  onInviteVisitor: (visitor: VisitorProfile) => void;
  onBackToDirectory?: () => void;
}

export const VisitorHistoryTimelineTab: React.FC<VisitorHistoryTimelineTabProps> = ({
  initialVisitorId,
  onInviteVisitor,
  onBackToDirectory,
}) => {
  const state = storageService.getState();
  const visitors = state.visitors;

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => getGlobalThemeMode());

  useEffect(() => {
    const handleThemeChange = (e: any) => {
      if (e?.detail?.mode) {
        setThemeMode(e.detail.mode);
      } else {
        setThemeMode(getGlobalThemeMode());
      }
    };
    window.addEventListener('vms-theme-changed', handleThemeChange);
    return () => window.removeEventListener('vms-theme-changed', handleThemeChange);
  }, []);

  const isDark = themeMode === 'dark';

  // Selected visitor state: fallback to initialVisitorId or first visitor
  const [selectedVisitorId, setSelectedVisitorId] = useState<string>(() => {
    if (initialVisitorId && visitors.some((v) => v.id === initialVisitorId)) {
      return initialVisitorId;
    }
    return visitors[0]?.id || '';
  });

  const [visitorSearchQuery, setVisitorSearchQuery] = useState('');
  const [timelineSearchQuery, setTimelineSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'ACTIVE' | 'APPROVED'>('ALL');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // asc = chronological oldest to newest

  const selectedVisitor = useMemo(() => {
    return visitors.find((v) => v.id === selectedVisitorId) || visitors[0] || null;
  }, [visitors, selectedVisitorId]);

  // Filtered list of visitors for selector
  const filteredVisitors = useMemo(() => {
    if (!visitorSearchQuery.trim()) return visitors;
    const q = visitorSearchQuery.toLowerCase();
    return visitors.filter(
      (v) =>
        v.fullName.toLowerCase().includes(q) ||
        v.company.toLowerCase().includes(q) ||
        v.email.toLowerCase().includes(q)
    );
  }, [visitors, visitorSearchQuery]);

  // All visits for selected visitor
  const allVisitorVisits = useMemo(() => {
    if (!selectedVisitor) return [];
    return state.visits.filter((v) => v.visitorId === selectedVisitor.id);
  }, [state.visits, selectedVisitor]);

  // Calculate visit duration in hours and formatted string
  const calculateDuration = (visit: Visit) => {
    const startTimeStr = visit.actualCheckIn || visit.scheduledStart;
    const endTimeStr = visit.actualCheckOut || visit.scheduledEnd;
    if (!startTimeStr || !endTimeStr) return { hours: 0, formatted: 'N/A', minutes: 0 };

    const start = new Date(startTimeStr).getTime();
    const end = new Date(endTimeStr).getTime();
    const diffMs = Math.max(0, end - start);
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffMinutes = Math.round(diffMs / (1000 * 60));

    const hrs = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;
    const formatted = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

    return {
      hours: Number(diffHours.toFixed(2)),
      minutes: diffMinutes,
      formatted,
    };
  };

  // Chronologically sorted visits
  const chronologicalVisits = useMemo(() => {
    const list = [...allVisitorVisits];
    list.sort((a, b) => {
      const dateA = new Date(a.actualCheckIn || a.scheduledStart).getTime();
      const dateB = new Date(b.actualCheckIn || b.scheduledStart).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    if (statusFilter === 'COMPLETED') {
      return list.filter((v) => v.state === 'CHECKED_OUT' || v.state === 'CLOSED');
    }
    if (statusFilter === 'ACTIVE') {
      return list.filter((v) => v.state === 'CHECKED_IN' || v.state === 'ARRIVED');
    }
    if (statusFilter === 'APPROVED') {
      return list.filter((v) => v.state === 'APPROVED' || v.state === 'PENDING_APPROVAL');
    }
    return list;
  }, [allVisitorVisits, sortOrder, statusFilter]);

  // Filtered timeline visits by search
  const displayedTimelineVisits = useMemo(() => {
    if (!timelineSearchQuery.trim()) return chronologicalVisits;
    const q = timelineSearchQuery.toLowerCase();
    return chronologicalVisits.filter(
      (v) =>
        v.purpose.toLowerCase().includes(q) ||
        v.hostName.toLowerCase().includes(q) ||
        v.departmentName.toLowerCase().includes(q) ||
        (v.badgeNumber && v.badgeNumber.toLowerCase().includes(q)) ||
        (v.assignedZone && v.assignedZone.toLowerCase().includes(q))
    );
  }, [chronologicalVisits, timelineSearchQuery]);

  // Chart data: always chronologically ordered (oldest to newest)
  const chartData = useMemo(() => {
    const sorted = [...allVisitorVisits].sort((a, b) => {
      return (
        new Date(a.actualCheckIn || a.scheduledStart).getTime() -
        new Date(b.actualCheckIn || b.scheduledStart).getTime()
      );
    });

    return sorted.map((visit, index) => {
      const dateObj = new Date(visit.actualCheckIn || visit.scheduledStart);
      const dateFormatted = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit',
      });
      const durationInfo = calculateDuration(visit);

      let stateColor = '#0F766E'; // teal for completed
      if (visit.state === 'CHECKED_IN') stateColor = '#2563EB'; // blue
      else if (visit.state === 'APPROVED' || visit.state === 'PENDING_APPROVAL') stateColor = '#D97706'; // amber
      else if (visit.state === 'CANCELLED' || visit.state === 'REJECTED') stateColor = '#DC2626'; // red

      return {
        id: visit.id,
        index: index + 1,
        visitLabel: `Visit #${index + 1}`,
        dateFormatted,
        fullDate: dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        durationHours: durationInfo.hours,
        durationFormatted: durationInfo.formatted,
        purpose: visit.purpose,
        hostName: visit.hostName,
        departmentName: visit.departmentName,
        state: visit.state,
        stateColor,
        badgeNumber: visit.badgeNumber || 'N/A',
        zone: visit.assignedZone || 'Main Campus',
      };
    });
  }, [allVisitorVisits]);

  // Aggregate metrics
  const totalVisitsCount = allVisitorVisits.length;
  const completedVisits = allVisitorVisits.filter(
    (v) => v.state === 'CHECKED_OUT' || v.state === 'CLOSED'
  );
  const totalDwellMinutes = completedVisits.reduce((acc, v) => {
    return acc + calculateDuration(v).minutes;
  }, 0);
  const totalDwellHours = (totalDwellMinutes / 60).toFixed(1);
  const avgDwellHours = completedVisits.length
    ? (totalDwellMinutes / (completedVisits.length * 60)).toFixed(1)
    : '0';

  // Average line for chart
  const avgHoursNum = Number(avgDwellHours) || 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner and Navigation Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#D8E1E8] shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToDirectory && (
              <button
                type="button"
                onClick={onBackToDirectory}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition cursor-pointer"
                title="Back to Visitor Master Directory"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#0F766E]" />
                <h1 className="text-lg font-bold text-[#172B3A]">Visitor History Timeline</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  Chronological Recharts View
                </span>
              </div>
              <p className="text-xs text-[#526575] mt-0.5">
                Full chronological audit trail and duration timeline of all previous visits for the selected visitor.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            {selectedVisitor && (
              <button
                type="button"
                onClick={() => onInviteVisitor(selectedVisitor)}
                className="bg-[#123B5D] hover:bg-[#0e2f4a] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Schedule New Visit</span>
              </button>
            )}
          </div>
        </div>

        {/* Visitor Selector Ribbon */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
            <span className="text-[11px] font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-500" />
              Select Visitor Profile ({visitors.length} Registered):
            </span>
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter visitors by name/company..."
                value={visitorSearchQuery}
                onChange={(e) => setVisitorSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-teal-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Horizontal Visitor Avatar Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {filteredVisitors.map((v) => {
              const isSelected = selectedVisitor?.id === v.id;
              const visitCount = state.visits.filter((visit) => visit.visitorId === v.id).length;
              return (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => setSelectedVisitorId(v.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-left transition shrink-0 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-[#164E87] border-sky-400 text-white font-bold shadow-md shadow-sky-950/40 ring-1 ring-sky-400/50'
                        : 'bg-teal-700 border-teal-600 text-white font-semibold shadow-xs ring-1 ring-teal-500/20'
                      : isDark
                      ? 'bg-[#0E294A] border-sky-800/80 hover:bg-[#153D6B] hover:text-white text-sky-200'
                      : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center border border-slate-300">
                    {v.photoUrl ? (
                      <img src={v.photoUrl} alt={v.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-slate-700">{v.fullName.charAt(0)}</span>
                    )}
                  </div>
                  <div className="leading-tight">
                    <div className="text-xs font-semibold truncate max-w-[120px]">{v.fullName}</div>
                    <div className="text-[10px] text-slate-500 truncate max-w-[120px]">{v.company}</div>
                  </div>
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                      isSelected
                        ? isDark ? 'bg-sky-950 text-sky-200 border border-sky-400/40' : 'bg-teal-800 text-teal-100'
                        : isDark ? 'bg-[#0A223E] text-sky-300 border border-sky-800/60' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {visitCount} {visitCount === 1 ? 'visit' : 'visits'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedVisitor ? (
        <>
          {/* Visitor Master Overview Card */}
          <div className="bg-gradient-to-r from-slate-900 via-[#123B5D] to-teal-950 text-white p-5 rounded-xl shadow-xs border border-slate-800">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-teal-400/80 p-0.5 bg-slate-800 shadow-md shrink-0 overflow-hidden">
                  {selectedVisitor.photoUrl ? (
                    <img
                      src={selectedVisitor.photoUrl}
                      alt={selectedVisitor.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-teal-800 flex items-center justify-center text-xl font-bold text-white">
                      {selectedVisitor.fullName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold tracking-tight">{selectedVisitor.fullName}</h2>
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                      {selectedVisitor.category.replace(/_/g, ' ')}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${
                        selectedVisitor.watchlistStatus === 'CLEAN'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      }`}
                    >
                      Watchlist: {selectedVisitor.watchlistStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-teal-400" />
                      {selectedVisitor.company}
                    </span>
                    <span>•</span>
                    <span>{selectedVisitor.email}</span>
                    <span>•</span>
                    <span>{selectedVisitor.phoneNumber}</span>
                    <span>•</span>
                    <span className="font-mono text-teal-200 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      {selectedVisitor.maskedDocumentNumber} ({selectedVisitor.documentType})
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges / Consent status */}
              <div className="flex items-center gap-2 self-start md:self-auto shrink-0 bg-white/5 p-2 rounded-lg border border-white/10 text-xs">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">NDA Consent:</div>
                  <div className="font-bold text-teal-300">
                    {selectedVisitor.ndaSigned ? 'Verified Signed' : 'Pending'}
                  </div>
                </div>
                <div className="w-px h-7 bg-white/10 mx-1" />
                <div className="text-right">
                  <div className="text-[10px] text-slate-400">Zero-Trust:</div>
                  <div className="font-bold text-emerald-300">Enforced</div>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/10 text-xs">
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                <span className="text-[11px] text-slate-300 block">Total Recorded Visits</span>
                <span className="text-lg font-bold text-white mt-0.5 block">{totalVisitsCount}</span>
                <span className="text-[10px] text-teal-300">All tenant events</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                <span className="text-[11px] text-slate-300 block">Completed Check-Outs</span>
                <span className="text-lg font-bold text-teal-300 mt-0.5 block">{completedVisits.length}</span>
                <span className="text-[10px] text-slate-300">With accurate dwell times</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                <span className="text-[11px] text-slate-300 block">Cumulative Dwell Time</span>
                <span className="text-lg font-bold text-emerald-300 mt-0.5 block">{totalDwellHours} hrs</span>
                <span className="text-[10px] text-slate-300">Total on-premise duration</span>
              </div>
              <div className="bg-white/5 rounded-lg p-2.5 border border-white/10">
                <span className="text-[11px] text-slate-300 block">Avg. Visit Duration</span>
                <span className="text-lg font-bold text-amber-300 mt-0.5 block">{avgDwellHours} hrs</span>
                <span className="text-[10px] text-slate-300">Per completed session</span>
              </div>
            </div>
          </div>

          {/* Recharts Chronological Timeline Visualization Card */}
          <div className="bg-white p-5 rounded-xl border border-[#D8E1E8] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-teal-700" />
                  <h3 className="text-sm font-bold text-[#172B3A]">
                    Chronological Visit Dwell Time & Frequency Timeline
                  </h3>
                </div>
                <p className="text-[11px] text-[#526575]">
                  Visual timeline charting visit duration (hours) across time in chronological sequence.
                </p>
              </div>

              {/* Legend pills */}
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />
                  Completed ({completedVisits.length})
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
                  Active / In-Progress
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  Approved / Scheduled
                </span>
              </div>
            </div>

            {chartData.length > 0 ? (
              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                      dataKey="dateFormatted"
                      tick={{ fontSize: 11, fill: '#475569' }}
                      tickLine={{ stroke: '#CBD5E1' }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      dy={8}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: '#475569' }}
                      tickLine={{ stroke: '#CBD5E1' }}
                      axisLine={{ stroke: '#CBD5E1' }}
                      unit="h"
                      domain={[0, 'auto']}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-700 text-xs max-w-xs space-y-1.5 z-50">
                              <div className="flex items-center justify-between border-b border-slate-700 pb-1">
                                <span className="font-bold text-teal-300">{data.visitLabel}</span>
                                <span className="text-[10px] text-slate-400">{data.dateFormatted}</span>
                              </div>
                              <div className="text-slate-200 font-semibold">{data.purpose}</div>
                              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[11px] text-slate-300 pt-1">
                                <div>
                                  <span className="text-slate-400">Duration:</span>{' '}
                                  <span className="font-bold text-amber-300">{data.durationFormatted}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">Status:</span>{' '}
                                  <span className="font-semibold text-emerald-300">{data.state}</span>
                                </div>
                                <div>
                                  <span className="text-slate-400">Host:</span> {data.hostName}
                                </div>
                                <div>
                                  <span className="text-slate-400">Badge:</span> {data.badgeNumber}
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    {avgHoursNum > 0 && (
                      <ReferenceLine
                        y={avgHoursNum}
                        stroke="#B45309"
                        strokeDasharray="4 4"
                        label={{
                          value: `Avg: ${avgDwellHours}h`,
                          position: 'right',
                          fill: '#B45309',
                          fontSize: 10,
                          fontWeight: 600,
                        }}
                      />
                    )}
                    <Bar
                      dataKey="durationHours"
                      name="Visit Duration"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={48}
                    >
                      {chartData.map((entry) => (
                        <Cell key={`cell-${entry.id}`} fill={entry.stateColor} />
                      ))}
                    </Bar>
                    <Line
                      type="monotone"
                      dataKey="durationHours"
                      stroke="#0F766E"
                      strokeWidth={2}
                      dot={{ r: 4, fill: '#0F766E' }}
                      activeDot={{ r: 6 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center p-4">
                <Clock className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-xs font-semibold text-slate-600">No previous visits recorded yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Timeline chart will populate once {selectedVisitor.fullName} attends a visit.
                </p>
              </div>
            )}
          </div>

          {/* Chronological Visits Stream Rail */}
          <div className="bg-white p-5 rounded-xl border border-[#D8E1E8] shadow-xs space-y-4">
            {/* Header and Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-[#172B3A] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-700" />
                  Chronological Visit History Rail ({displayedTimelineVisits.length} Records)
                </h3>
                <p className="text-[11px] text-[#526575]">
                  Detailed chronological events timeline from earliest to latest check-ins.
                </p>
              </div>

              {/* Filter and Sorting Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Search within visits */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search purpose, host, badge..."
                    value={timelineSearchQuery}
                    onChange={(e) => setTimelineSearchQuery(e.target.value)}
                    className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-teal-600 w-44 sm:w-52"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-teal-600 text-slate-700 cursor-pointer"
                >
                  <option value="ALL">All States</option>
                  <option value="COMPLETED">Completed Only</option>
                  <option value="ACTIVE">Active / On-Premises</option>
                  <option value="APPROVED">Approved / Scheduled</option>
                </select>

                {/* Sort Order Toggle */}
                <button
                  type="button"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition cursor-pointer"
                  title="Toggle chronological sorting direction"
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                  <span>{sortOrder === 'asc' ? 'Oldest First (Asc)' : 'Newest First (Desc)'}</span>
                </button>
              </div>
            </div>

            {/* Chronological Timeline Nodes List */}
            {displayedTimelineVisits.length > 0 ? (
              <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-teal-600 before:via-blue-500 before:to-slate-300">
                {displayedTimelineVisits.map((visit, index) => {
                  const checkInDate = new Date(visit.actualCheckIn || visit.scheduledStart);
                  const checkOutDate = visit.actualCheckOut ? new Date(visit.actualCheckOut) : null;
                  const durationInfo = calculateDuration(visit);

                  // Colors by state
                  const isCompleted = visit.state === 'CHECKED_OUT' || visit.state === 'CLOSED';
                  const isActive = visit.state === 'CHECKED_IN' || visit.state === 'ARRIVED';
                  const isApproved = visit.state === 'APPROVED';

                  return (
                    <div key={visit.id} className="relative group">
                      {/* Timeline Node Marker */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 shadow-xs ${
                          isCompleted
                            ? 'bg-teal-600 border-white text-white'
                            : isActive
                            ? 'bg-blue-600 border-white text-white ring-2 ring-blue-300'
                            : isApproved
                            ? 'bg-amber-500 border-white text-white'
                            : 'bg-slate-400 border-white text-white'
                        }`}
                      >
                        <span className="text-[10px] font-bold">
                          {sortOrder === 'asc' ? index + 1 : displayedTimelineVisits.length - index}
                        </span>
                      </div>

                      {/* Timeline Node Content Card */}
                      <div className="bg-[#F8FAFC] dark:bg-[#101D30] hover:bg-white dark:hover:bg-[#14243C] rounded-xl p-4 border border-[#E2E8F0] dark:border-[#243248] shadow-2xs transition hover:shadow-xs hover:border-teal-400 dark:hover:border-teal-500 space-y-3">
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 dark:border-slate-700/60 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#172B3A] dark:text-slate-100">
                              {checkInDate.toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span className="text-[11px] font-mono text-slate-600 dark:text-slate-300">
                              {checkInDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              {checkOutDate ? (
                                <>
                                  {' '}
                                  ➔{' '}
                                  {checkOutDate.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </>
                              ) : (
                                ' (In Session)'
                              )}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                              {durationInfo.formatted}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 self-start sm:self-auto">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                                isCompleted
                                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60'
                                  : isActive
                                  ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/60 animate-pulse'
                                  : isApproved
                                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {visit.state}
                            </span>
                            {visit.badgeNumber && (
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {visit.badgeNumber}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Visit Purpose */}
                        <div>
                          <div className="text-xs font-semibold text-[#172B3A] dark:text-slate-100">{visit.purpose}</div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] bg-white dark:bg-[#0B1322] p-3 rounded-lg border border-slate-200/80 dark:border-slate-800">
                          <div>
                            <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                              Host & Department
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{visit.hostName}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] truncate block">
                              {visit.departmentName}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                              Location & Gate
                            </span>
                            <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">{visit.siteName}</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] block truncate">
                              {visit.gateName || 'Main Reception'} • Zone: {visit.assignedZone || 'Public'}
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 dark:text-slate-400 block text-[10px] uppercase font-semibold">
                              Security & Clearance
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60">
                                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                Host & Sec Cleared
                              </span>
                              {visit.musterPoint && (
                                <span
                                  className="text-[9px] text-slate-500 dark:text-slate-400 truncate"
                                  title={`Muster Point: ${visit.musterPoint}`}
                                >
                                  Muster: {visit.musterPoint.split('(')[0]}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-700">No visits match filter criteria</h4>
                <p className="text-[11px] text-slate-500 mt-1">
                  Try adjusting the search query or status filter above.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-[#D8E1E8] text-center space-y-3">
          <User className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Visitor Selected</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Please choose a visitor from the directory ribbon above to view their comprehensive chronological visit timeline and analytics.
          </p>
        </div>
      )}
    </div>
  );
};
