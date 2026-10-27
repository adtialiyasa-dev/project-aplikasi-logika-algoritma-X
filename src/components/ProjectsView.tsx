import React, { useState, useEffect } from 'react';
import { UserProgress, NavigationTab } from '../types.ts';
import { CAPSTONE_PROJECTS } from '../data/projectsData.ts';
import { STORAGE_KEYS, usePersistentState } from '../utils/storage.ts';
import { runCppSimulation, SimulationResult } from '../utils/cppSimulator.ts';
import { 
  Award, 
  CheckCircle2, 
  FileText, 
  Code2, 
  Play, 
  GitBranch, 
  Sparkles, 
  Calculator, 
  Save, 
  Terminal, 
  RotateCcw, 
  Check, 
  AlertCircle,
  HelpCircle,
  Clock,
  Layers
} from 'lucide-react';

interface ProjectsViewProps {
  progress?: UserProgress;
  onUpdateProgress?: (
    updater: (prev: UserProgress) => UserProgress,
    actionPoints?: number,
    actionReason?: string
  ) => void;
  setActiveTab?: (tab: NavigationTab) => void;
}

interface ProjectsPersistentState {
  selectedProjectId: string;
  activeTabSub: 'overview' | 'code' | 'testing' | 'rubric';
  rubricScores: Record<string, number>;
}

const DEFAULT_PROJECTS_STATE: ProjectsPersistentState = {
  selectedProjectId: CAPSTONE_PROJECTS[0].id,
  activeTabSub: 'overview',
  rubricScores: {
    '1. Analisis Masalah': 20,
    '2. Ketepatan Algoritma & Flowchart': 25,
    '3. Kebenaran Program C++': 25,
    '4. Pengujian & Penanganan Kesalahan': 15,
    '5. Dokumentasi & Refleksi Pembelajaran': 15
  }
};

export const ProjectsView: React.FC<ProjectsViewProps> = ({ progress, onUpdateProgress }) => {
  const [projectState, setProjectState] = usePersistentState<ProjectsPersistentState>(
    STORAGE_KEYS.PROJECTS_STATE,
    DEFAULT_PROJECTS_STATE
  );

  const selectedProjectId = projectState.selectedProjectId || CAPSTONE_PROJECTS[0].id;
  const activeTabSub = projectState.activeTabSub || 'overview';
  const rubricScores = projectState.rubricScores || DEFAULT_PROJECTS_STATE.rubricScores;

  const currentProject = CAPSTONE_PROJECTS.find((p) => p.id === selectedProjectId) || CAPSTONE_PROJECTS[0];

  const totalCalculatedScore = Object.values(rubricScores).reduce((a, b) => a + b, 0);

  // Standalone Capstone Code Testing & Editor State
  const [studentCode, setStudentCode] = useState<string>('');
  const [testInput, setTestInput] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [selectedScenarioIdx, setSelectedScenarioIdx] = useState<number | null>(null);

  // Sync student code when currentProject or progress updates
  useEffect(() => {
    const saved = progress?.capstoneCodeAnswers?.[currentProject.id];
    if (saved && saved.trim()) {
      setStudentCode(saved);
    } else {
      setStudentCode(currentProject.referenceCppCode);
    }
    // Set default input from first test scenario
    if (currentProject.testScenarios.length > 0) {
      setTestInput(currentProject.testScenarios[0].input);
      setSelectedScenarioIdx(0);
    } else {
      setTestInput('');
      setSelectedScenarioIdx(null);
    }
    setSimulationResult(null);
    setSaveSuccessMsg('');
  }, [currentProject.id, progress?.capstoneCodeAnswers]);

  const setSelectedProjectId = (id: string) => {
    setProjectState((prev) => ({
      ...prev,
      selectedProjectId: id
    }));
  };

  const setActiveTabSub = (sub: 'overview' | 'code' | 'testing' | 'rubric') => {
    setProjectState((prev) => ({
      ...prev,
      activeTabSub: sub
    }));
  };

  const setRubricScore = (criteria: string, score: number) => {
    setProjectState((prev) => ({
      ...prev,
      rubricScores: {
        ...prev.rubricScores,
        [criteria]: score
      }
    }));
  };

  // Run standalone C++ simulation
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSaveSuccessMsg('');
    setTimeout(() => {
      try {
        const result = runCppSimulation(studentCode, testInput);
        setSimulationResult(result);
      } catch (err: any) {
        setSimulationResult({
          success: false,
          output: '',
          error: err.message || 'Kesalahan dalam simulasi eksekusi program C++.',
          executionSteps: 0,
          variables: [],
          trace: [],
          isSimulation: true
        });
      } finally {
        setIsSimulating(false);
      }
    }, 150);
  };

  // Save standalone solution into database
  const handleSaveSolution = () => {
    if (!studentCode.trim()) return;

    if (onUpdateProgress) {
      onUpdateProgress(
        (prev) => ({
          ...prev,
          capstoneCodeAnswers: {
            ...(prev.capstoneCodeAnswers || {}),
            [currentProject.id]: studentCode
          },
          projectStatus: 'Selesai',
          selectedProject: currentProject.title
        }),
        50,
        `Menyimpan Solusi Koding Capstone: ${currentProject.title}`
      );
    }

    setSaveSuccessMsg('Solusi koding Proyek Capstone berhasil disimpan ke database Anda!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Reset to starter template
  const handleResetToTemplate = () => {
    if (window.confirm('Muat ulang kode kembali ke template referensi proyek ini?')) {
      setStudentCode(currentProject.referenceCppCode);
      setSimulationResult(null);
      setSaveSuccessMsg('');
    }
  };

  const isSavedInDatabase = Boolean(progress?.capstoneCodeAnswers?.[currentProject.id]);

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono">
              <span>PROYEK AKHIR PEMBELAJARAN (CAPSTONE PROJECT)</span>
              <span aria-hidden="true">&bull;</span>
              <span className="text-slate-400 font-sans">Rubrik Penilaian 100 Poin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Membangun Aplikasi Sederhana Berbasis Algoritma Menggunakan C++
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Tuntaskan salah satu dari 5 proyek komputasional nyata. Terapkan metodologi rekayasa solusi mulai dari perumusan masalah, pseudocode, diagram alir, koding C++, pengujian batas (*boundary testing*), hingga pengujian mandiri di form LKPD Capstone ini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTabSub('testing')}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Code2 className="w-4 h-4" />
              <span>Form Uji Koding Capstone</span>
            </button>
          </div>
        </div>

        {/* 5 Project Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-slate-800">
          {CAPSTONE_PROJECTS.map((proj) => {
            const active = proj.id === selectedProjectId;
            const hasSaved = Boolean(progress?.capstoneCodeAnswers?.[proj.id]);
            return (
              <button
                key={proj.id}
                onClick={() => {
                  setSelectedProjectId(proj.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {hasSaved && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                <span>{proj.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sub-navigation inside selected project */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTabSub('overview')}
          className={`pb-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            activeTabSub === 'overview'
              ? 'text-blue-400 border-b-2 border-blue-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          1. Spesifikasi &amp; Alur Algoritma
        </button>

        <button
          onClick={() => setActiveTabSub('code')}
          className={`pb-1.5 transition-colors cursor-pointer whitespace-nowrap ${
            activeTabSub === 'code'
              ? 'text-blue-400 border-b-2 border-blue-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          2. Kode C++ Referensi &amp; Skenario
        </button>

        <button
          onClick={() => setActiveTabSub('testing')}
          className={`pb-1.5 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'testing'
              ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>3. Form Pengujian &amp; Lembar Koding Capstone</span>
          {isSavedInDatabase && (
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-400 font-mono">
              Tersimpan
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTabSub('rubric')}
          className={`pb-1.5 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTabSub === 'rubric'
              ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>4. Rubrik Penilaian (100 Poin)</span>
        </button>
      </div>

      {/* Tab 1: Overview & Flow */}
      {activeTabSub === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white">{currentProject.title}</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentProject.description}
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                <span className="font-semibold text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Tujuan Pembelajaran Proyek:
                </span>
                <p className="text-slate-300 leading-relaxed">{currentProject.objective}</p>
              </div>

              {/* I/O Requirements */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-200">Ketentuan Masukan &amp; Keluaran:</span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-300">
                  {currentProject.inputOutputRequirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Algorithm Steps */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Rancangan Langkah Algoritma Logis</span>
              </h3>
              <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-300 leading-relaxed">
                {currentProject.algorithmSteps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>

          {/* Right: Pseudocode & Flowchart Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>Notasi Pseudocode Standar</span>
                </span>
                <span className="text-slate-500 font-mono">Struktural</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-emerald-300 border border-slate-800 overflow-x-auto leading-relaxed max-h-[380px]">
                <code>{currentProject.pseudocode}</code>
              </pre>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-purple-400" />
                <span>Ringkasan Alur Flowchart</span>
              </span>
              <p className="text-slate-300 leading-relaxed font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                {currentProject.flowchartSummary}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Reference Code & Test Scenarios */}
      {activeTabSub === 'code' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">
                  Implementasi Kode C++ Referensi (Valid &amp; Teruji)
                </h3>
                <p className="text-xs text-slate-400">
                  Kode ini mematuhi standar ANSI C++ dengan penanganan boundary conditions.
                </p>
              </div>

              <button
                onClick={() => setActiveTabSub('testing')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all cursor-pointer"
              >
                <Code2 className="w-4 h-4" />
                <span>Uji di Form Capstone</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-slate-200 border border-slate-800 overflow-x-auto leading-relaxed max-h-[500px]">
              <code>{currentProject.referenceCppCode}</code>
            </pre>
          </div>

          {/* Test Scenarios Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Skenario Pengujian Perangkat Lunak (Software Testing)</span>
            </h3>

            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-3">Skenario Pengujian</th>
                    <th className="p-3">Contoh Masukan (Input)</th>
                    <th className="p-3">Keluaran yang Diharapkan (Expected)</th>
                    <th className="p-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  {currentProject.testScenarios.map((ts, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-sans text-white">{ts.scenario}</td>
                      <td className="p-3 text-blue-400">{ts.input}</td>
                      <td className="p-3 text-emerald-300">{ts.expectedOutput}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            setTestInput(ts.input);
                            setSelectedScenarioIdx(idx);
                            setActiveTabSub('testing');
                          }}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-sans font-semibold cursor-pointer"
                        >
                          Uji Skenario
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: STANDALONE CAPSTONE CODING & TESTING FORM ==================== */}
      {activeTabSub === 'testing' && (
        <div className="space-y-6">
          {/* Information Notice */}
          <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-800/40 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                  Lembar Kerja Mandiri Capstone
                </span>
                <span className="text-xs text-slate-300 font-bold">{currentProject.title}</span>
              </div>
              <p className="text-xs text-slate-400">
                Form pengujian ini berdiri sendiri khusus Proyek Capstone. Kode yang Anda kembangkan dan simpan di sini terintegrasi langsung dengan database proyek Anda tanpa menimpa lembar kerja Lab Koding biasa.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetToTemplate}
                className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Muat ulang kode referensi awal proyek ini"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Reset Template</span>
              </button>
            </div>
          </div>

          {/* Notification Feedback Toast */}
          {saveSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs text-emerald-200 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-semibold">{saveSuccessMsg}</span>
            </div>
          )}

          {/* Quick Scenario Picker */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Pilih Skenario Pengujian Cepat:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {currentProject.testScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTestInput(sc.input);
                    setSelectedScenarioIdx(idx);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedScenarioIdx === idx
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/30'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>Skenario {idx + 1}: {sc.scenario.slice(0, 24)}...</span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setTestInput('');
                  setSelectedScenarioIdx(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedScenarioIdx === null
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                Masukan Kustom (Input Bebas)
              </button>
            </div>
          </div>

          {/* Two-Column Editor & Execution Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Code Editor (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Editor Kode Solusi C++ (Capstone)</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {studentCode.split('\n').length} baris
                </span>
              </div>

              {/* Code Textarea */}
              <div className="relative">
                <textarea
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="// Tulis atau modifikasi program C++ Proyek Capstone Anda di sini..."
                  rows={18}
                  className="w-full bg-slate-950 text-emerald-300 font-mono text-xs p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 leading-relaxed resize-y selection:bg-emerald-900 selection:text-white"
                  spellCheck={false}
                />
              </div>

              {/* Custom Input Field */}
              <div className="space-y-1.5 text-xs">
                <label className="font-semibold text-slate-300 flex items-center justify-between">
                  <span>Parameter Masukan Simulasi (std::cin):</span>
                  <span className="text-[11px] font-normal text-slate-500 font-mono">Pisahkan dengan spasi / baris baru</span>
                </label>
                <input
                  type="text"
                  value={testInput}
                  onChange={(e) => {
                    setTestInput(e.target.value);
                    setSelectedScenarioIdx(null);
                  }}
                  placeholder="Contoh: 1 50000 0 (sesuai input cin program)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRunSimulation}
                  disabled={isSimulating}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>{isSimulating ? 'Mengeksekusi...' : 'Uji & Jalankan Simulasi C++'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveSolution}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Solusi Capstone (+50 XP)</span>
                </button>
              </div>
            </div>

            {/* Right: Output & Diagnostics (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Terminal Output */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-white">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span>Hasil Eksekusi Terminal (Console Output)</span>
                  </div>
                  {simulationResult && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        simulationResult.success
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-red-950 text-red-400 border border-red-800'
                      }`}
                    >
                      {simulationResult.success ? 'Eksekusi Sukses' : 'Gagal / Error'}
                    </span>
                  )}
                </div>

                {!simulationResult ? (
                  <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-500 space-y-2">
                    <Terminal className="w-6 h-6 mx-auto text-slate-600" />
                    <p>Klik tombol <strong>"Uji &amp; Jalankan Simulasi C++"</strong> untuk melihat keluaran terminal di sini.</p>
                  </div>
                ) : simulationResult.error ? (
                  <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200 font-mono space-y-1">
                    <div className="flex items-center gap-2 font-bold text-red-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Terjadi Kesalahan Sintaksis / Logika:</span>
                    </div>
                    <pre className="whitespace-pre-wrap leading-relaxed">{simulationResult.error}</pre>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                      {simulationResult.output || '(Program selesai tanpa luaran teks cout)'}
                    </pre>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                      <span>Langkah Eksekusi: {simulationResult.executionSteps} langkah</span>
                      <span className="text-emerald-400 font-bold">Return Code: 0 (OK)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Variable Inspector Table */}
              {simulationResult && simulationResult.variables && simulationResult.variables.length > 0 && (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl text-xs">
                  <div className="font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <span>Inspeksi Variabel Memori (Runtime State)</span>
                  </div>

                  <div className="overflow-x-auto rounded-lg border border-slate-800">
                    <table className="w-full text-left text-[11px] font-mono">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                        <tr>
                          <th className="p-2">Variabel</th>
                          <th className="p-2">Tipe</th>
                          <th className="p-2">Nilai Akhir</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 text-slate-300">
                        {simulationResult.variables.map((v, i) => (
                          <tr key={i} className="hover:bg-slate-800/40">
                            <td className="p-2 font-bold text-blue-300">{v.name}</td>
                            <td className="p-2 text-slate-400">{v.type}</td>
                            <td className="p-2 text-emerald-400 font-bold">{String(v.value)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 100-Point Rubric & Interactive Calculator */}
      {activeTabSub === 'rubric' && (
        <div className="space-y-6">
          {/* Score Summary Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <span>Simulasi Penilaian Mandiri Siswa (Self-Assessment)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Gunakan kriteria di bawah ini untuk mengukur kualitas proyek akhir sebelum dikumpulkan ke guru.
              </p>
            </div>

            <div className="p-3 px-6 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-mono">TOTAL NILAI PROYEK</div>
              <div className="text-3xl font-extrabold font-mono text-emerald-400">
                {totalCalculatedScore} <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
          </div>

          {/* Rubric Matrix */}
          <div className="space-y-4">
            {currentProject.rubric.map((r, idx) => {
              const currentScore = rubricScores[r.criteria] || r.weight;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 shadow-lg"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{r.criteria}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-400">Bobot Maksimal: {r.weight} Poin</span>
                      <select
                        value={currentScore}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setRubricScore(r.criteria, val);
                        }}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-mono font-bold text-blue-400 focus:outline-none focus:border-blue-500"
                      >
                        <option value={r.weight}>Sangat Baik ({r.weight} Poin)</option>
                        <option value={Math.round(r.weight * 0.75)}>Cukup ({Math.round(r.weight * 0.75)} Poin)</option>
                        <option value={Math.round(r.weight * 0.5)}>Perlu Bimbingan ({Math.round(r.weight * 0.5)} Poin)</option>
                      </select>
                    </div>
                  </div>

                  {/* Level Descriptors */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-950 border border-emerald-900/40 space-y-1">
                      <div className="font-bold text-emerald-400">Tingkat Sangat Baik:</div>
                      <p className="text-slate-300 leading-relaxed">{r.levelExcellent}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-blue-900/40 space-y-1">
                      <div className="font-bold text-blue-400">Tingkat Baik:</div>
                      <p className="text-slate-300 leading-relaxed">{r.levelGood}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-950 border border-amber-900/40 space-y-1">
                      <div className="font-bold text-amber-400">Tingkat Berkembang:</div>
                      <p className="text-slate-300 leading-relaxed">{r.levelDeveloping}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
