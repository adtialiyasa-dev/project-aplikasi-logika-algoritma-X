import React, { useState, useEffect } from 'react';
import { STORAGE_KEYS, usePersistentState } from '../utils/storage.ts';
import { Play, Pause, RotateCcw, SkipForward, ArrowRight, CheckCircle2, AlertTriangle, Cpu, Layers, GitBranch, Table } from 'lucide-react';

interface TraceRow {
  iteration: number;
  i: number;
  term: string;
  previousSum: number;
  newSum: number;
  condition: string;
  explanation: string;
}

interface VisualizerPersistentState {
  selectedAlgorithm: 'sum' | 'max' | 'even' | 'factorial';
  nValue: number;
  speed: number;
  viewMode: 'visual' | 'bug_hunter';
}

const DEFAULT_VISUALIZER_STATE: VisualizerPersistentState = {
  selectedAlgorithm: 'sum',
  nValue: 5,
  speed: 1000,
  viewMode: 'visual'
};

export const AlgorithmVisualizer: React.FC = () => {
  const [visState, setVisState] = usePersistentState<VisualizerPersistentState>(
    STORAGE_KEYS.VISUALIZER_STATE,
    DEFAULT_VISUALIZER_STATE
  );

  const selectedAlgorithm = visState.selectedAlgorithm || 'sum';
  const nValue = visState.nValue || 5;
  const speed = visState.speed || 1000;
  const viewMode = visState.viewMode || 'visual';

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const setSelectedAlgorithm = (algo: 'sum' | 'max' | 'even' | 'factorial') => {
    setVisState((prev) => ({ ...prev, selectedAlgorithm: algo }));
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const setNValue = (val: number) => {
    setVisState((prev) => ({ ...prev, nValue: val }));
    setCurrentStep(0);
  };

  const setSpeed = (spd: number) => {
    setVisState((prev) => ({ ...prev, speed: spd }));
  };

  const setViewMode = (mode: 'visual' | 'bug_hunter') => {
    setVisState((prev) => ({ ...prev, viewMode: mode }));
  };

  // Generate trace data for Sum 1 to N
  const sumTrace: TraceRow[] = [];
  let accum = 0;
  for (let step = 1; step <= nValue; step++) {
    const prev = accum;
    accum += step;
    sumTrace.push({
      iteration: step,
      i: step,
      term: `+ ${step}`,
      previousSum: prev,
      newSum: accum,
      condition: `${step} <= ${nValue} (BENAR)`,
      explanation: `Iterasi ${step}: total bernilai ${prev} + ${step} = ${accum}.`
    });
  }

  // Playback timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < sumTrace.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, sumTrace.length, speed]);

  const activeRow = sumTrace[currentStep] || sumTrace[0];

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleStepForward = () => {
    if (currentStep < sumTrace.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Visualizer Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono">
              <span>SIMULATOR VISUAL FASE E</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-sans">Trace Table &amp; Flow Control</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Visualisasi Alur &amp; Penelusuran Algoritma
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Pelajari bagaimana nilai variabel berubah secara bertahap pada memori komputer di setiap langkah perulangan dan percabangan.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setViewMode('visual')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                viewMode === 'visual'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Simulasi Dinamis
            </button>
            <button
              onClick={() => setViewMode('bug_hunter')}
              className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                viewMode === 'bug_hunter'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Analisis Bug vs Kode Benar</span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Canvas: Step-by-Step Visualizer & Memory Trace (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Interactive Control Deck */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all active:scale-95"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Jeda' : 'Jalankan'}</span>
                  </button>

                  <button
                    onClick={handleStepForward}
                    disabled={currentStep >= sumTrace.length - 1}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Langkah Maju</span>
                  </button>

                  <button
                    onClick={handleReset}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>
                </div>

                {/* N Parameter Slider */}
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-300 font-medium">Batas N:</span>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    value={nValue}
                    onChange={(e) => {
                      setNValue(Number(e.target.value));
                      setCurrentStep(0);
                      setIsPlaying(false);
                    }}
                    className="w-24 accent-blue-500"
                  />
                  <span className="font-mono font-bold text-blue-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {nValue}
                  </span>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Langkah {currentStep + 1} dari {sumTrace.length}</span>
                  <span className="text-emerald-400 font-mono">
                    {currentStep === sumTrace.length - 1 ? 'SELESAI DITELUSURI' : 'DALAM EKSEKUSI'}
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / sumTrace.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Visual Step Stage Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-400" />
                  <span>Status Eksekusi di Memori Komputer</span>
                </div>
                <span className="text-xs font-mono text-blue-400 font-semibold bg-blue-950/60 px-2.5 py-1 rounded border border-blue-900/50">
                  Iterasi ke-{activeRow.iteration}
                </span>
              </div>

              {/* Memory Variables Live Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-mono">Variabel Counter (i)</div>
                  <div className="text-3xl font-extrabold font-mono text-blue-400">
                    {activeRow.i}
                  </div>
                  <div className="text-xs text-slate-500">
                    Kondisi: {activeRow.i} &le; {nValue} &rarr; <span className="text-emerald-400 font-semibold">True</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-xs text-slate-400 font-mono">Variabel Akumulator (total)</div>
                  <div className="text-3xl font-extrabold font-mono text-emerald-400">
                    {activeRow.newSum}
                  </div>
                  <div className="text-xs text-slate-500">
                    Formula: {activeRow.previousSum} + {activeRow.i} = {activeRow.newSum}
                  </div>
                </div>
              </div>

              {/* Explanatory callout for Deep Learning */}
              <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-slate-200 space-y-1.5">
                <div className="font-semibold text-blue-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Penjelasan Logika Langkah:</span>
                </div>
                <p className="leading-relaxed">
                  {activeRow.explanation}
                </p>
                {currentStep === sumTrace.length - 1 && (
                  <p className="text-emerald-300 pt-1 font-medium">
                    Hasil akhir total penjumlahan 1 sampai {nValue} adalah <strong>{activeRow.newSum}</strong> karena seluruh bilangan bulat dari 1 sampai {nValue} telah dijumlahkan secara beruntun.
                  </p>
                )}
              </div>
            </div>

            {/* Trace Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <Table className="w-4 h-4 text-emerald-400" />
                  <span>Tabel Penelusuran Algoritma (Trace Table)</span>
                </div>
                <span className="text-xs text-slate-400">Nilai setiap siklus iterasi</span>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                    <tr>
                      <th className="p-3">Iterasi</th>
                      <th className="p-3">Kondisi (i &le; {nValue})</th>
                      <th className="p-3">Nilai 'total' Lama</th>
                      <th className="p-3">Nilai 'i'</th>
                      <th className="p-3">Nilai 'total' Baru</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 font-mono text-slate-300">
                    {sumTrace.map((row, idx) => {
                      const isCurrent = idx === currentStep;
                      return (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            isCurrent
                              ? 'bg-blue-950/70 text-white font-bold border-l-2 border-blue-400'
                              : 'hover:bg-slate-800/40'
                          }`}
                        >
                          <td className="p-3 text-slate-400">#{row.iteration}</td>
                          <td className="p-3 text-emerald-400">Benar</td>
                          <td className="p-3">{row.previousSum}</td>
                          <td className="p-3 text-blue-400">{row.i}</td>
                          <td className="p-3 text-emerald-300 font-semibold">{row.newSum}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Deck: Algorithm Flowchart & C++ Synchronized View (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  <span>Diagram Alur (Flowchart Visual)</span>
                </div>
                <span className="text-xs font-mono text-slate-400">ANSI Standard</span>
              </div>

              {/* Interactive Flowchart SVG */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col items-center space-y-3 text-xs font-mono">
                {/* Node 1: Terminator START */}
                <div className="px-5 py-2 rounded-full border border-slate-600 bg-slate-900 text-slate-300 text-center font-semibold">
                  MULAI
                </div>
                <div className="text-slate-600 font-bold">&darr;</div>

                {/* Node 2: Process Init */}
                <div className="px-4 py-2 rounded-md border border-slate-700 bg-slate-900 text-slate-300 text-center w-48">
                  total = 0; i = 1;
                </div>
                <div className="text-slate-600 font-bold">&darr;</div>

                {/* Node 3: Decision Loop */}
                <div
                  className={`p-3 rounded-lg border text-center w-52 transition-all ${
                    activeRow.i <= nValue
                      ? 'border-blue-500 bg-blue-950/80 text-white shadow-lg shadow-blue-500/20'
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="font-bold">Apakah i &le; {nValue} ?</div>
                  <div className="text-xs text-blue-300 mt-1">
                    Saat ini: {activeRow.i} &le; {nValue} ({activeRow.i <= nValue ? 'YA' : 'TIDAK'})
                  </div>
                </div>
                <div className="text-emerald-400 font-bold text-xs">&darr; [YA]</div>

                {/* Node 4: Accumulate Process */}
                <div
                  className={`px-4 py-2.5 rounded-md border text-center w-52 transition-all ${
                    'border-emerald-500 bg-emerald-950/80 text-white shadow-lg shadow-emerald-500/20'
                  }`}
                >
                  total = total + i<br />
                  <span className="text-xs text-emerald-300">
                    ({activeRow.previousSum} + {activeRow.i} = {activeRow.newSum})
                  </span>
                </div>
                <div className="text-slate-600 font-bold">&darr;</div>

                {/* Node 5: Increment i */}
                <div className="px-4 py-2 rounded-md border border-slate-700 bg-slate-900 text-slate-300 text-center w-48">
                  i = i + 1 (i++)
                </div>
                <div className="text-xs text-purple-400 italic">
                  &uarr; Berputar kembali ke Decision
                </div>

                {/* Node 6: Terminator END */}
                <div className="text-slate-600 font-bold">&darr; [TIDAK]</div>
                <div className="px-5 py-2 rounded-full border border-slate-600 bg-slate-900 text-slate-400 text-center">
                  Cetak total &rarr; SELESAI
                </div>
              </div>
            </div>

            {/* Synchronized C++ Code Box */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
              <div className="text-sm font-bold text-white flex items-center justify-between">
                <span>Padanan Kode Program C++</span>
                <span className="text-xs font-mono text-blue-400">for loop</span>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-slate-300 border border-slate-800 leading-relaxed overflow-x-auto">
                <code>{`#include <iostream>

int main() {
    int n = ${nValue};
    int total = 0;

    // Loop penambahan nilai
    for (int i = 1; i <= n; i++) {
        total += i; // total bernilai ${activeRow.newSum}
    }

    std::cout << "Total = " << total << std::endl;
    return 0;
}`}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* Bug Hunter Mode (Perbandingan Kode Benar vs Kode Error) */
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 text-xs text-slate-300 space-y-1">
            <div className="font-bold text-amber-400 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Modul Analisis Bug Logika (Bug Hunter)</span>
            </div>
            <p className="leading-relaxed">
              Bandingkan dua versi algoritma di bawah ini untuk memahami mengapa kesalahan pengetikan kecil dapat merusak seluruh hasil komputasi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Wrong Code Card */}
            <div className="bg-slate-900 border border-red-900/60 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-red-900/50 pb-3">
                <div className="text-sm font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>KODE SALAH (Mengandung Bug Logika)</span>
                </div>
                <span className="text-xs font-mono text-red-400 bg-red-950/80 px-2 py-0.5 rounded border border-red-900">
                  Infinite Loop / Salah Rumus
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-red-300 border border-red-900/40 leading-relaxed overflow-x-auto">
                <code>{`int total; // BUG 1: Belum diinisialisasi (= garbage)
int i = 1;

while (i <= 5) {
    total = total + i;
    // BUG 2: Lupa menulis i++;
    // Menyebabkan i selalu 1 (Loop tak berujung!)
}

std::cout << total;`}</code>
              </pre>

              <div className="p-3 bg-red-950/30 rounded-lg border border-red-900/30 text-xs text-slate-300 space-y-1.5">
                <div className="font-bold text-red-400">Dampak pada Komputer:</div>
                <p>
                  1. Program akan hang (membeku) karena kondisi <code className="text-red-300">1 &le; 5</code> selalu bernilai true selamanya.<br />
                  2. Nilai total akan memuat angka sampah memori karena tidak dimulai dari 0.
                </p>
              </div>
            </div>

            {/* Correct Code Card */}
            <div className="bg-slate-900 border border-emerald-900/60 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>KODE BENAR &amp; AMAN (Best Practice)</span>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                  Terdokumentasi &amp; Tuntas
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-xs font-mono text-emerald-300 border border-emerald-900/40 leading-relaxed overflow-x-auto">
                <code>{`int total = 0; // Tepat: Inisialisasi awal 0
int i = 1;

while (i <= 5) {
    total = total + i;
    i++; // Tepat: Nilai i selalu naik mendekati kondisi henti
}

std::cout << total; // Menghasilkan tepat 15`}</code>
              </pre>

              <div className="p-3 bg-emerald-950/30 rounded-lg border border-emerald-900/30 text-xs text-slate-300 space-y-1.5">
                <div className="font-bold text-emerald-400">Keunggulan Perbaikan:</div>
                <p>
                  1. Program selesai tepat setelah 5 langkah perulangan (finiteness terpenuhi).<br />
                  2. Akumulasi penjumlahan dimulai dari basis nol yang terpercaya.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
