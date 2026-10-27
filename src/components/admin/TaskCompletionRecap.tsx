import React, { useState, useMemo } from 'react';
import { StudentListItem } from '../../utils/authService.ts';
import { STORAGE_KEYS, usePersistentState } from '../../utils/storage.ts';
import { 
  BarChart3, 
  PieChart as PieIcon, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  Code2, 
  Award, 
  Layers, 
  TrendingUp, 
  HelpCircle,
  RefreshCw
} from 'lucide-react';

interface TaskCompletionRecapProps {
  students: StudentListItem[];
  allStudentsCount: number;
  availableClasses: string[];
  onRefresh?: () => void;
}

export const TaskCompletionRecap: React.FC<TaskCompletionRecapProps> = ({
  students,
  allStudentsCount,
  availableClasses,
  onRefresh
}) => {
  const [selectedClass, setSelectedClass] = usePersistentState<string>(
    'informatika_recap_class_v1',
    'all'
  );
  const [taskMetric, setTaskMetric] = usePersistentState<'composite' | 'modules' | 'lab' | 'quiz'>(
    'informatika_recap_metric_v1',
    'composite'
  );
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);

  // Filter students based on selectedClass
  const filteredStudents = useMemo(() => {
    if (selectedClass === 'all') return students;
    return students.filter((s) => s.className === selectedClass);
  }, [students, selectedClass]);

  // Calculate individual student completion percentages
  const studentsWithProgress = useMemo(() => {
    return filteredStudents.map((std) => {
      // 9 modules = 40% weight, 10 labs = 40% weight, quiz (max 100) = 20% weight
      const modPercent = (Math.min(9, std.completedModulesCount) / 9) * 100;
      const labPercent = (Math.min(10, std.completedExercisesCount) / 10) * 100;
      const quizPercent = Math.min(100, std.quizBestScore);

      let overallPercent = 0;
      if (taskMetric === 'composite') {
        overallPercent = Math.round(modPercent * 0.4 + labPercent * 0.4 + (quizPercent / 100) * 20);
      } else if (taskMetric === 'modules') {
        overallPercent = Math.round(modPercent);
      } else if (taskMetric === 'lab') {
        overallPercent = Math.round(labPercent);
      } else if (taskMetric === 'quiz') {
        overallPercent = Math.round(quizPercent);
      }

      let category: 'completed' | 'in_progress' | 'needs_guidance' = 'in_progress';
      if (overallPercent >= 75) {
        category = 'completed';
      } else if (overallPercent >= 35) {
        category = 'in_progress';
      } else {
        category = 'needs_guidance';
      }

      return {
        ...std,
        modPercent: Math.round(modPercent),
        labPercent: Math.round(labPercent),
        quizPercent: Math.round(quizPercent),
        overallPercent,
        category
      };
    });
  }, [filteredStudents, taskMetric]);

  // Aggregate stats for Donut Chart (Persentase Pengerjaan)
  const pieStats = useMemo(() => {
    const total = studentsWithProgress.length;
    if (total === 0) {
      return {
        completed: 0,
        completedPct: 0,
        inProgress: 0,
        inProgressPct: 0,
        needsGuidance: 0,
        needsGuidancePct: 0,
        total: 0
      };
    }

    const completed = studentsWithProgress.filter((s) => s.category === 'completed').length;
    const inProgress = studentsWithProgress.filter((s) => s.category === 'in_progress').length;
    const needsGuidance = studentsWithProgress.filter((s) => s.category === 'needs_guidance').length;

    return {
      completed,
      completedPct: Math.round((completed / total) * 100),
      inProgress,
      inProgressPct: Math.round((inProgress / total) * 100),
      needsGuidance,
      needsGuidancePct: Math.round((needsGuidance / total) * 100),
      total
    };
  }, [studentsWithProgress]);

  // Aggregate stats per Class for Bar Chart (Diagram Batang)
  const barChartData = useMemo(() => {
    // Group students by class
    const classMap: Record<
      string,
      {
        className: string;
        studentCount: number;
        totalPercent: number;
        totalMod: number;
        totalLab: number;
        totalQuiz: number;
      }
    > = {};

    const activeClasses = availableClasses.filter((c) => c !== 'all');
    activeClasses.forEach((cls) => {
      classMap[cls] = {
        className: cls,
        studentCount: 0,
        totalPercent: 0,
        totalMod: 0,
        totalLab: 0,
        totalQuiz: 0
      };
    });

    students.forEach((std) => {
      const cls = std.className;
      if (!classMap[cls]) {
        classMap[cls] = {
          className: cls,
          studentCount: 0,
          totalPercent: 0,
          totalMod: 0,
          totalLab: 0,
          totalQuiz: 0
        };
      }

      const modPercent = (Math.min(9, std.completedModulesCount) / 9) * 100;
      const labPercent = (Math.min(10, std.completedExercisesCount) / 10) * 100;
      const quizPercent = Math.min(100, std.quizBestScore);

      let p = 0;
      if (taskMetric === 'composite') {
        p = modPercent * 0.4 + labPercent * 0.4 + (quizPercent / 100) * 20;
      } else if (taskMetric === 'modules') {
        p = modPercent;
      } else if (taskMetric === 'lab') {
        p = labPercent;
      } else if (taskMetric === 'quiz') {
        p = quizPercent;
      }

      classMap[cls].studentCount += 1;
      classMap[cls].totalPercent += p;
      classMap[cls].totalMod += std.completedModulesCount;
      classMap[cls].totalLab += std.completedExercisesCount;
      classMap[cls].totalQuiz += std.quizBestScore;
    });

    // If specific class selected, highlight or focus on that class and neighbor classes
    const list = Object.values(classMap)
      .filter((c) => c.studentCount > 0 || (selectedClass !== 'all' && c.className === selectedClass))
      .map((c) => {
        const avg = c.studentCount > 0 ? Math.round(c.totalPercent / c.studentCount) : 0;
        const avgMod = c.studentCount > 0 ? (c.totalMod / c.studentCount).toFixed(1) : '0';
        const avgLab = c.studentCount > 0 ? (c.totalLab / c.studentCount).toFixed(1) : '0';
        const avgQuiz = c.studentCount > 0 ? Math.round(c.totalQuiz / c.studentCount) : 0;
        return {
          ...c,
          avgPercent: avg,
          avgMod,
          avgLab,
          avgQuiz
        };
      });

    return list.sort((a, b) => {
      // Numerical sort by class number
      const numA = parseInt(a.className.replace('X-', ''), 10) || 0;
      const numB = parseInt(b.className.replace('X-', ''), 10) || 0;
      return numA - numB;
    });
  }, [students, availableClasses, taskMetric, selectedClass]);

  // Overall class average
  const overallAvgPercent = useMemo(() => {
    if (studentsWithProgress.length === 0) return 0;
    const sum = studentsWithProgress.reduce((acc, s) => acc + s.overallPercent, 0);
    return Math.round(sum / studentsWithProgress.length);
  }, [studentsWithProgress]);

  // SVG Donut calculations
  // Circumference of radius 58 = 2 * PI * 58 ≈ 364.42
  const RADIUS = 58;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const completedStroke = (pieStats.completedPct / 100) * CIRCUMFERENCE;
  const inProgressStroke = (pieStats.inProgressPct / 100) * CIRCUMFERENCE;
  const needsGuidanceStroke = (pieStats.needsGuidancePct / 100) * CIRCUMFERENCE;

  // Offsets for 3 segments
  const offsetCompleted = 0;
  const offsetInProgress = -completedStroke;
  const offsetNeedsGuidance = -(completedStroke + inProgressStroke);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header & Controls Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
                Pembaruan Realtime Aktif
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <span>Rekapitulasi Penyelesaian Tugas Siswa</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-2xl">
              Pantau progres ketuntasan pembelajaran logika, algoritma, lab koding C++, dan evaluasi HOTS secara visual melalui diagram batang dan diagram lingkaran.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-3.5 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 flex items-center gap-1.5 transition-colors"
                title="Sinkronkan Data Realtime"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Segarkan</span>
              </button>
            )}

            {/* Filter Kelas */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-transparent text-white font-mono focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Kelas ({allStudentsCount} Siswa)</option>
                {availableClasses.filter((c) => c !== 'all').map((c) => (
                  <option key={c} value={c} className="bg-slate-900 text-white">
                    Kelas {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Jenis Tugas */}
            <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <select
                value={taskMetric}
                onChange={(e) => setTaskMetric(e.target.value as any)}
                className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
              >
                <option value="composite" className="bg-slate-900 text-white">
                  Komposit (Modul + Lab + Kuis)
                </option>
                <option value="modules" className="bg-slate-900 text-white">
                  Modul Teori Saja (9 Modul)
                </option>
                <option value="lab" className="bg-slate-900 text-white">
                  Lab Koding C++ (10 Lab)
                </option>
                <option value="quiz" className="bg-slate-900 text-white">
                  Evaluasi Kuis HOTS (Nilai)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* 4 Mini KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Siswa Terpilih</span>
            <div className="text-2xl font-black font-mono text-white">
              {studentsWithProgress.length}{' '}
              <span className="text-xs font-normal text-slate-500 font-sans">
                / {allStudentsCount} Siswa
              </span>
            </div>
            <div className="text-[11px] text-blue-400">
              {selectedClass === 'all' ? 'Seluruh Rombel Fase E' : `Fokus Kelas ${selectedClass}`}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Rata-Rata Ketuntasan</span>
            <div className="text-2xl font-black font-mono text-amber-400">
              {overallAvgPercent}%
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>Target KKM: 75% Ketuntasan</span>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Siswa Tuntas Penuh</span>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {pieStats.completed}{' '}
              <span className="text-xs font-normal text-emerald-600 font-sans">
                ({pieStats.completedPct}%)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Telah mencapai &ge; 75% tugas</div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-1">
            <span className="text-[11px] font-mono text-slate-400 uppercase">Perlu Pendampingan</span>
            <div className="text-2xl font-black font-mono text-rose-400">
              {pieStats.needsGuidance}{' '}
              <span className="text-xs font-normal text-rose-600 font-sans">
                ({pieStats.needsGuidancePct}%)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Capaian tugas di bawah 35%</div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Utama -> Diagram Batang (Bar Chart) & Diagram Lingkaran (Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ==================== 1. DIAGRAM BATANG (BAR CHART) ==================== */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-blue-400">
                <BarChart3 className="w-4 h-4" />
                <span>DIAGRAM BATANG REALTIME</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Rata-Rata Persentase Penyelesaian per Rombel Kelas
              </h3>
              <p className="text-xs text-slate-400">
                Tinggi batang menunjukkan tingkat penyelesaian tugas rata-rata siswa di masing-masing kelas.
              </p>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-400 hidden sm:block">
              <div>Garis Putus: Target 75%</div>
            </div>
          </div>

          {/* Bar Chart Canvas / SVG Container */}
          <div className="pt-4">
            <div className="relative h-64 w-full flex items-end justify-between gap-3 sm:gap-4 px-2 sm:px-4 border-b border-l border-slate-800 pb-2">
              {/* Reference Grid lines */}
              <div className="absolute inset-x-0 top-0 border-b border-slate-800/60 pointer-events-none" />
              <div className="absolute inset-x-0 top-1/4 border-b border-slate-800/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-2/4 border-b border-slate-800/40 pointer-events-none" />
              <div className="absolute inset-x-0 top-3/4 border-b border-slate-800/40 pointer-events-none" />

              {/* Target Line: KKM 75% (top: 25%) */}
              <div className="absolute inset-x-0 top-[25%] border-b-2 border-dashed border-emerald-500/60 pointer-events-none z-10 flex items-center justify-end pr-2">
                <span className="bg-emerald-950/80 text-emerald-400 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-800/60 font-bold">
                  Standar KKM 75%
                </span>
              </div>

              {/* Y Axis Labels */}
              <div className="absolute -left-7 inset-y-0 flex flex-col justify-between text-[10px] font-mono text-slate-500 py-1">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Dynamic Bars per Class */}
              {barChartData.length === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500 italic">
                  Belum ada data siswa pada filter ini.
                </div>
              ) : (
                barChartData.map((item, idx) => {
                  const isHovered = hoveredBarIndex === idx;
                  const isTargetMet = item.avgPercent >= 75;
                  const isSelected = selectedClass === item.className;

                  return (
                    <div
                      key={item.className}
                      onMouseEnter={() => setHoveredBarIndex(idx)}
                      onMouseLeave={() => setHoveredBarIndex(null)}
                      onClick={() => setSelectedClass(selectedClass === item.className ? 'all' : item.className)}
                      className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
                    >
                      {/* Tooltip on Hover */}
                      {isHovered && (
                        <div className="absolute -top-20 z-30 bg-slate-950 border border-slate-700 p-2.5 rounded-xl shadow-2xl text-[11px] whitespace-nowrap animate-in fade-in zoom-in-95 pointer-events-none">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>Kelas {item.className}</span>
                            <span className="text-slate-400">({item.studentCount} Siswa)</span>
                          </div>
                          <div className="text-amber-400 font-mono font-bold">
                            Ketuntasan: {item.avgPercent}%
                          </div>
                          <div className="text-slate-400 text-[10px] mt-0.5">
                            Modul: {item.avgMod}/9 &bull; Lab: {item.avgLab}/10 &bull; Kuis: {item.avgQuiz}
                          </div>
                        </div>
                      )}

                      {/* Percentage Top Badge */}
                      <span
                        className={`text-[10px] font-mono font-bold mb-1 transition-all ${
                          isTargetMet ? 'text-emerald-400' : 'text-amber-400'
                        } ${isHovered ? 'scale-110' : ''}`}
                      >
                        {item.avgPercent}%
                      </span>

                      {/* The Bar */}
                      <div className="w-full max-w-[48px] bg-slate-950/80 rounded-t-lg h-full flex items-end overflow-hidden p-0.5">
                        <div
                          style={{ height: `${Math.max(6, item.avgPercent)}%` }}
                          className={`w-full rounded-t-md transition-all duration-500 relative ${
                            isSelected
                              ? 'bg-gradient-to-t from-blue-600 via-blue-500 to-amber-400 shadow-lg shadow-blue-500/30'
                              : isTargetMet
                              ? 'bg-gradient-to-t from-emerald-700 via-emerald-600 to-teal-400 group-hover:brightness-110'
                              : 'bg-gradient-to-t from-amber-700 via-amber-600 to-yellow-400 group-hover:brightness-110'
                          }`}
                        >
                          <div className="absolute inset-x-0 top-0 h-1 bg-white/40 rounded-t-md" />
                        </div>
                      </div>

                      {/* Class Label underneath */}
                      <div className="pt-2 text-center">
                        <span
                          className={`text-xs font-mono font-bold block ${
                            isSelected ? 'text-blue-400 underline' : 'text-slate-300'
                          }`}
                        >
                          {item.className}
                        </span>
                        <span className="text-[10px] text-slate-500 block">
                          {item.studentCount} Siswa
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bar Chart Legend */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs text-slate-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500" />
                <span>Tuntas KKM (&ge; 75%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500" />
                <span>Perlu Peningkatan (&lt; 75%)</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 italic">
              Klik pada batang kelas untuk memfilter siswa.
            </div>
          </div>
        </div>

        {/* ==================== 2. DIAGRAM LINGKARAN (DONUT / PIE CHART) ==================== */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <PieIcon className="w-4 h-4" />
              <span>DIAGRAM LINGKARAN REALTIME</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Persentase Kategori Ketuntasan Siswa
            </h3>
            <p className="text-xs text-slate-400">
              Proporsi realtime dari seluruh siswa yang telah menuntaskan tugas, sedang aktif, atau memerlukan bimbingan.
            </p>
          </div>

          {/* SVG Donut Container */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
            <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={RADIUS}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="20"
                />

                {/* Segment 1: Completed (Emerald) */}
                {pieStats.completedPct > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={RADIUS}
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray={`${completedStroke} ${CIRCUMFERENCE}`}
                    strokeDashoffset={offsetCompleted}
                    className="transition-all duration-700 ease-out"
                  />
                )}

                {/* Segment 2: In Progress (Blue) */}
                {pieStats.inProgressPct > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={RADIUS}
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="20"
                    strokeDasharray={`${inProgressStroke} ${CIRCUMFERENCE}`}
                    strokeDashoffset={offsetInProgress}
                    className="transition-all duration-700 ease-out"
                  />
                )}

                {/* Segment 3: Needs Guidance (Amber) */}
                {pieStats.needsGuidancePct > 0 && (
                  <circle
                    cx="80"
                    cy="80"
                    r={RADIUS}
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray={`${needsGuidanceStroke} ${CIRCUMFERENCE}`}
                    strokeDashoffset={offsetNeedsGuidance}
                    className="transition-all duration-700 ease-out"
                  />
                )}
              </svg>

              {/* Center Donut Hole Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black font-mono text-white leading-tight">
                  {pieStats.completedPct}%
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                  Tuntas
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                  {pieStats.completed} dari {pieStats.total} Siswa
                </span>
              </div>
            </div>

            {/* Interactive Legend Cards */}
            <div className="space-y-3 w-full text-xs">
              {/* Category 1: Completed */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-900/50 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="font-bold text-white">Selesai / Tuntas</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400">
                    {pieStats.completed} Siswa ({pieStats.completedPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pieStats.completedPct}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">Capaian tugas &ge; 75% KKM</div>
              </div>

              {/* Category 2: In Progress */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-blue-900/50 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    <span className="font-bold text-white">Sedang Berjalan</span>
                  </div>
                  <span className="font-mono font-bold text-blue-400">
                    {pieStats.inProgress} Siswa ({pieStats.inProgressPct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pieStats.inProgressPct}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">Capaian tugas 35% - 74%</div>
              </div>

              {/* Category 3: Needs Guidance */}
              <div className="p-3 rounded-xl bg-slate-950/80 border border-amber-900/50 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="font-bold text-white">Perlu Pendampingan</span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    {pieStats.needsGuidance} Siswa ({pieStats.needsGuidancePct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${pieStats.needsGuidancePct}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400">Capaian tugas &lt; 35%</div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 text-center font-mono">
            Status diperbarui otomatis berdasarkan aktivitas pengerjaan siswa terkini.
          </div>
        </div>
      </div>

      {/* ==================== 3. TABEL RINCIAN PROGRESS TUGAS SISWA ==================== */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Daftar Siswa &amp; Rekapitulasi Ketuntasan Tugas Terkini</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Menampilkan rincian ketuntasan 9 modul teori, 10 latihan lab C++, dan evaluasi kuis untuk{' '}
              {studentsWithProgress.length} siswa.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Filter Aktif: <span className="text-white font-bold">{selectedClass === 'all' ? 'Semua Kelas' : `Kelas ${selectedClass}`}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
              <tr>
                <th className="p-3">No</th>
                <th className="p-3">Nama Siswa</th>
                <th className="p-3">Kelas</th>
                <th className="p-3">Persentase Ketuntasan</th>
                <th className="p-3">Modul Teori</th>
                <th className="p-3">Lab C++</th>
                <th className="p-3">Skor Kuis</th>
                <th className="p-3">Status Proyek</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {studentsWithProgress.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-slate-500 italic">
                    Tidak ada siswa pada filter kelas ini.
                  </td>
                </tr>
              ) : (
                studentsWithProgress.map((std, idx) => (
                  <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono text-slate-500">{idx + 1}</td>
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      {std.fullName}
                    </td>
                    <td className="p-3 font-mono font-semibold text-blue-400">{std.className}</td>
                    <td className="p-3 min-w-[150px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              std.overallPercent >= 75
                                ? 'bg-emerald-400'
                                : std.overallPercent >= 35
                                ? 'bg-blue-400'
                                : 'bg-amber-400'
                            }`}
                            style={{ width: `${std.overallPercent}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-white text-[11px]">
                          {std.overallPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="text-emerald-400 font-bold">{std.completedModulesCount}</span>
                      <span className="text-slate-600"> / 9</span>
                    </td>
                    <td className="p-3 font-mono">
                      <span className="text-blue-400 font-bold">{std.completedExercisesCount}</span>
                      <span className="text-slate-600"> / 10</span>
                    </td>
                    <td className="p-3 font-mono font-bold">
                      <span className={std.quizBestScore >= 75 ? 'text-emerald-400' : 'text-amber-400'}>
                        {std.quizBestScore}
                      </span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          std.projectStatus === 'Selesai'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : std.projectStatus === 'Dalam Proses'
                            ? 'bg-blue-950 text-blue-400 border border-blue-800'
                            : 'bg-slate-950 text-slate-500 border border-slate-800'
                        }`}
                      >
                        {std.projectStatus}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          std.category === 'completed'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                            : std.category === 'in_progress'
                            ? 'bg-blue-950/80 text-blue-400 border-blue-800'
                            : 'bg-amber-950/80 text-amber-400 border-amber-800'
                        }`}
                      >
                        {std.category === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        {std.category === 'in_progress' && <Clock className="w-3 h-3" />}
                        {std.category === 'needs_guidance' && <AlertCircle className="w-3 h-3" />}
                        <span>
                          {std.category === 'completed'
                            ? 'Tuntas'
                            : std.category === 'in_progress'
                            ? 'Berjalan'
                            : 'Bimbingan'}
                        </span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
