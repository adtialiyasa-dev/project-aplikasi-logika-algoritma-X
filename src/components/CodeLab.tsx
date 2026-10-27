import React, { useState, useEffect } from 'react';
import { LabExercise } from '../types.ts';
import { LAB_EXERCISES } from '../data/labExercises.ts';
import { runCppSimulation, SimulationResult } from '../utils/cppSimulator.ts';
import { STORAGE_KEYS, usePersistentState } from '../utils/storage.ts';
import { Play, RotateCcw, Lightbulb, CheckCircle2, XCircle, Terminal, HelpCircle, FileCode, Check, AlertCircle, Sparkles } from 'lucide-react';

interface CodeLabProps {
  completedExercises: string[];
  markExerciseComplete: (id: string) => void;
}

interface CodeLabPersistentState {
  selectedExerciseId: string;
  isFreeMode: boolean;
  codeMap: Record<string, string>;
  stdinMap: Record<string, string>;
}

const DEFAULT_FREE_MODE_CODE = '#include <iostream>\n\nint main() {\n    // Mode Eksplorasi Bebas: Ketik kode C++ kreasimu di sini!\n    int a = 10;\n    int b = 25;\n    std::cout << "Jumlah: " << (a + b) << std::endl;\n    return 0;\n}';

const DEFAULT_CODELAB_STATE: CodeLabPersistentState = {
  selectedExerciseId: LAB_EXERCISES[0].id,
  isFreeMode: false,
  codeMap: {},
  stdinMap: {}
};

export const CodeLab: React.FC<CodeLabProps> = ({ completedExercises, markExerciseComplete }) => {
  const [labState, setLabState] = usePersistentState<CodeLabPersistentState>(
    STORAGE_KEYS.CODELAB_STATE,
    DEFAULT_CODELAB_STATE
  );

  const selectedExerciseId = labState.selectedExerciseId || LAB_EXERCISES[0].id;
  const isFreeMode = labState.isFreeMode || false;

  const currentExercise = LAB_EXERCISES.find((e) => e.id === selectedExerciseId) || LAB_EXERCISES[0];
  const activeKey = isFreeMode ? 'free_mode' : currentExercise.id;

  // Active code & stdin loaded from persistent map or initial defaults
  const currentCode = labState.codeMap[activeKey] !== undefined
    ? labState.codeMap[activeKey]
    : (isFreeMode ? DEFAULT_FREE_MODE_CODE : currentExercise.initialCode);

  const currentStdin = labState.stdinMap[activeKey] !== undefined
    ? labState.stdinMap[activeKey]
    : (isFreeMode ? '' : currentExercise.sampleInput);

  const [code, setCodeLocal] = useState<string>(currentCode);
  const [stdinInput, setStdinLocal] = useState<string>(currentStdin);
  const [executionResult, setExecutionResult] = useState<SimulationResult | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; desc: string }[] | null>(null);

  // Sync local editor when activeKey changes
  useEffect(() => {
    setCodeLocal(currentCode);
    setStdinLocal(currentStdin);
    setShowSolution(false);
    setExecutionResult(null);
    setTestResults(null);
  }, [activeKey]);

  // Handler to update code and auto-save to persistent state
  const handleCodeChange = (newCode: string) => {
    setCodeLocal(newCode);
    setLabState((prev) => ({
      ...prev,
      codeMap: {
        ...prev.codeMap,
        [activeKey]: newCode
      }
    }));
  };

  // Handler to update stdin and auto-save
  const handleStdinChange = (newStdin: string) => {
    setStdinLocal(newStdin);
    setLabState((prev) => ({
      ...prev,
      stdinMap: {
        ...prev.stdinMap,
        [activeKey]: newStdin
      }
    }));
  };

  const handleSelectExercise = (exercise: LabExercise) => {
    const nextKey = exercise.id;
    const targetCode = labState.codeMap[nextKey] !== undefined
      ? labState.codeMap[nextKey]
      : exercise.initialCode;
    const targetStdin = labState.stdinMap[nextKey] !== undefined
      ? labState.stdinMap[nextKey]
      : exercise.sampleInput;

    setLabState((prev) => ({
      ...prev,
      selectedExerciseId: exercise.id,
      isFreeMode: false
    }));

    setCodeLocal(targetCode);
    setStdinLocal(targetStdin);
    setShowSolution(false);
    setExecutionResult(null);
    setTestResults(null);
  };

  const handleSwitchToFreeMode = () => {
    const nextKey = 'free_mode';
    const targetCode = labState.codeMap[nextKey] !== undefined
      ? labState.codeMap[nextKey]
      : DEFAULT_FREE_MODE_CODE;
    const targetStdin = labState.stdinMap[nextKey] !== undefined
      ? labState.stdinMap[nextKey]
      : '';

    setLabState((prev) => ({
      ...prev,
      isFreeMode: true
    }));

    setCodeLocal(targetCode);
    setStdinLocal(targetStdin);
    setShowSolution(false);
    setExecutionResult(null);
    setTestResults(null);
  };

  const handleRunProgram = () => {
    setIsRunning(true);
    setTimeout(() => {
      const result = runCppSimulation(code, stdinInput);
      setExecutionResult(result);
      setIsRunning(false);

      // Verify test cases if on an exercise
      if (!isFreeMode && currentExercise.testCases) {
        const tests = currentExercise.testCases.map((tc) => {
          const tcRes = runCppSimulation(code, tc.input);
          const cleanActual = tcRes.output.trim().replace(/\r\n/g, '\n');
          const cleanExpected = tc.expectedOutput.trim().replace(/\r\n/g, '\n');
          const passed = tcRes.success && cleanActual.includes(cleanExpected);
          return {
            passed,
            desc: tc.description
          };
        });
        setTestResults(tests);

        const allPassed = tests.every((t) => t.passed);
        if (allPassed) {
          markExerciseComplete(currentExercise.id);
        }
      }
    }, 150);
  };

  const handleReset = () => {
    const defaultCode = isFreeMode ? DEFAULT_FREE_MODE_CODE : currentExercise.initialCode;
    const defaultStdin = isFreeMode ? '' : currentExercise.sampleInput;

    handleCodeChange(defaultCode);
    handleStdinChange(defaultStdin);
    setExecutionResult(null);
    setTestResults(null);
    setShowSolution(false);
  };

  const handleToggleSolution = () => {
    if (!showSolution) {
      handleCodeChange(currentExercise.solutionCode);
      setShowSolution(true);
    } else {
      handleCodeChange(currentExercise.initialCode);
      setShowSolution(false);
    }
  };

  const lineCount = code.split('\n').length;
  const isCompleted = completedExercises.includes(currentExercise.id);

  return (
    <div className="space-y-8 pb-16">
      {/* Header with clear transparent simulation label */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono">
              <span>LAB KODING C++</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900/40">
                Mode: Simulasi Output C++ Fase E
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Laboratorium Praktik &amp; Uji Kode C++
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Tulis, jalankan, dan uji kode C++ Anda secara langsung di lingkungan sandbox web. Engine simulasi menganalisis sintaksis variabel, operasi aritmetika, input <code className="text-blue-300">std::cin</code>, output <code className="text-blue-300">std::cout</code>, percabangan <code className="text-blue-300">if-else</code>, serta perulangan <code className="text-blue-300">for/while</code>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwitchToFreeMode}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                isFreeMode
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                  : 'bg-slate-950 text-slate-300 hover:text-white border-slate-800'
              }`}
            >
              Mode Eksplorasi Bebas
            </button>
          </div>
        </div>

        {/* Exercise Quick Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-800">
          {LAB_EXERCISES.map((ex) => {
            const active = !isFreeMode && ex.id === selectedExerciseId;
            const done = completedExercises.includes(ex.id);
            return (
              <button
                key={ex.id}
                onClick={() => handleSelectExercise(ex)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all flex items-center gap-1.5 ${
                  active
                    ? 'bg-blue-600 text-white font-semibold shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>{ex.title.split('.')[0]}. {ex.title.split('.')[1]?.trim().slice(0, 18)}...</span>
                {done && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Lab Workspace Split: Left (Editor + Terminal) / Right (Instructions + Test Cases) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Code Editor and Console Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Editor Header & Actions */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-300">
                <FileCode className="w-4 h-4 text-blue-400" />
                <span>main.cpp</span>
                <span className="text-slate-500">({lineCount} baris)</span>
              </div>

              <div className="flex items-center gap-2">
                {!isFreeMode && (
                  <button
                    onClick={handleToggleSolution}
                    className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-800 flex items-center gap-1 transition-colors"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>{showSolution ? 'Tutup Solusi' : 'Tampilkan Contoh Jawaban'}</span>
                  </button>
                )}

                <button
                  onClick={handleReset}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs border border-slate-800 flex items-center gap-1 transition-colors"
                  title="Kembalikan kode ke awal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Code Textarea with Line Numbers */}
            <div className="relative flex bg-slate-950 text-slate-200 font-mono text-xs sm:text-sm">
              <div className="select-none py-4 px-3 text-right bg-slate-950/80 text-slate-600 border-r border-slate-800/80 font-mono text-xs leading-6">
                {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>

              <textarea
                value={code}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck={false}
                rows={Math.max(lineCount + 2, 14)}
                className="w-full bg-transparent p-4 text-slate-100 font-mono text-xs sm:text-sm leading-6 focus:outline-none resize-none selection:bg-blue-900 selection:text-white"
              />
            </div>

            {/* Execution Control Footer */}
            <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>Eksekutor:</span>
                <span className="text-slate-200 font-mono">C++ AST Engine (Client-side)</span>
              </div>

              <button
                onClick={handleRunProgram}
                disabled={isRunning}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{isRunning ? 'Mengeksekusi...' : 'Jalankan Program'}</span>
              </button>
            </div>
          </div>

          {/* Stdin Input Buffer Console */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                <span>Input Konsol Terminal (std::cin)</span>
              </label>
              <span className="text-slate-500">Pisahkan input angka/teks dengan spasi</span>
            </div>
            <input
              type="text"
              value={stdinInput}
              onChange={(e) => handleStdinChange(e.target.value)}
              placeholder="Contoh: 10 20 (masukan keyboard jika program membutuhkan input)"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Program Output Terminal */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-mono text-slate-300">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span>Keluaran Konsol (std::cout)</span>
              </div>
              {executionResult && (
                <span className="text-slate-500 font-mono text-[11px]">
                  {executionResult.executionSteps} langkah diproses
                </span>
              )}
            </div>

            <div className="p-4 bg-slate-950 font-mono text-xs text-slate-200 min-h-[120px] max-h-[220px] overflow-y-auto whitespace-pre-wrap leading-relaxed">
              {executionResult ? (
                executionResult.output
              ) : (
                <span className="text-slate-600 italic">
                  Klik tombol "Jalankan Program" untuk melihat hasil luaran terminal di sini...
                </span>
              )}
            </div>
          </div>

          {/* Error Message Panel if execution failed */}
          {executionResult && !executionResult.success && executionResult.error && (
            <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/80 text-xs text-red-200 space-y-1.5">
              <div className="font-bold text-red-400 flex items-center gap-1.5 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Pesan Kesalahan Diagnostik:</span>
              </div>
              <p className="leading-relaxed font-mono">{executionResult.error}</p>
            </div>
          )}
        </div>

        {/* Right: Instructions, Hints, and Test Cases (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Instructions Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-0.5">
                <div className="text-xs font-mono text-blue-400 font-semibold">
                  {isFreeMode ? 'EKSPLORASI MANDIRI' : `LATIHAN ${currentExercise.id.toUpperCase()}`}
                </div>
                <h2 className="text-base font-bold text-white">
                  {isFreeMode ? 'Koding Bebas Kreatif C++' : currentExercise.title}
                </h2>
              </div>
              {!isFreeMode && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold ${
                    currentExercise.difficulty === 'Dasar'
                      ? 'bg-blue-950 text-blue-400 border border-blue-900'
                      : currentExercise.difficulty === 'Menengah'
                      ? 'bg-amber-950 text-amber-400 border border-amber-900'
                      : 'bg-purple-950 text-purple-400 border border-purple-900'
                  }`}
                >
                  {currentExercise.difficulty}
                </span>
              )}
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              <p>
                {isFreeMode
                  ? 'Gunakan area ini untuk mencoba baris kode C++ apa pun yang sedang Anda pelajari di modul materi. Latihlah pembuatan fungsi main, deklarasi variabel, dan perulangan secara leluasa.'
                  : currentExercise.description}
              </p>

              {!isFreeMode && (
                <>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <strong className="text-slate-200">Format Masukan (Input):</strong>
                    <div className="text-slate-400">{currentExercise.inputSpecification}</div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                    <strong className="text-slate-200">Format Keluaran (Output):</strong>
                    <div className="text-slate-400 whitespace-pre-line">{currentExercise.outputSpecification}</div>
                  </div>

                  {currentExercise.hint && (
                    <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 space-y-1 text-slate-300">
                      <strong className="text-blue-400 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" /> Petunjuk Logika (Hint):
                      </strong>
                      <p className="text-slate-300">{currentExercise.hint}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Test Cases Verification Panel */}
          {!isFreeMode && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Status Pengujian Soal (Test Cases)</span>
                </div>
                {isCompleted && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Tuntas
                  </span>
                )}
              </div>

              <div className="space-y-2 text-xs">
                {testResults ? (
                  testResults.map((tr, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg border flex items-center justify-between ${
                        tr.passed
                          ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                          : 'bg-red-950/30 border-red-800/60 text-red-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {tr.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                        <span>{tr.desc}</span>
                      </div>
                      <span className="font-mono font-bold">
                        {tr.passed ? 'LOLOS' : 'GAGAL'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-slate-500 text-center italic">
                    Jalankan program untuk memvalidasi kode dengan seluruh skenario pengujian otomatis.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Live Variable Inspector (State Memory Table) */}
          {executionResult && executionResult.variables.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="text-xs font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
                <span>Inspeksi Variabel Memori (Live Watch)</span>
                <span className="text-slate-500 font-mono text-[11px]">RAM Simulator</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="pb-1.5">Variabel</th>
                      <th className="pb-1.5">Tipe</th>
                      <th className="pb-1.5">Nilai Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {executionResult.variables.map((v, i) => (
                      <tr key={i}>
                        <td className="py-1.5 text-blue-400">{v.name}</td>
                        <td className="py-1.5 text-slate-500">{v.type}</td>
                        <td className="py-1.5 text-emerald-300 font-semibold">{String(v.value)}</td>
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
  );
};
