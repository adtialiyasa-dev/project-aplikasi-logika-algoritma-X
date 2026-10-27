import React, { useState } from 'react';
import { LearningModule, NavigationTab } from '../types.ts';
import { MODULES_DATA } from '../data/modulesData.ts';
import { STORAGE_KEYS, usePersistentState } from '../utils/storage.ts';
import { BookOpen, CheckCircle2, ChevronRight, ChevronLeft, Code2, Sparkles, Send, HelpCircle, FileText, ArrowRight, ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

interface ModuleViewProps {
  currentModuleId: string;
  setCurrentModuleId: (id: string) => void;
  completedModules: string[];
  toggleModuleComplete: (id: string) => void;
  reflections: Record<string, string>;
  saveReflection: (moduleId: string, text: string) => void;
  setActiveTab: (tab: NavigationTab) => void;
}

export const ModuleView: React.FC<ModuleViewProps> = ({
  currentModuleId,
  setCurrentModuleId,
  completedModules,
  toggleModuleComplete,
  reflections,
  saveReflection,
  setActiveTab
}) => {
  const currentModule = MODULES_DATA.find((m) => m.id === currentModuleId) || MODULES_DATA[0];

  // Persistent drafts across module switching and page refreshes
  const [reflectionDrafts, setReflectionDrafts] = usePersistentState<Record<string, string>>(
    STORAGE_KEYS.MODULE_DRAFTS,
    {}
  );

  const reflectionInput = reflectionDrafts[currentModule.id] !== undefined
    ? reflectionDrafts[currentModule.id]
    : (reflections[currentModule.id] || '');

  const [savedStatus, setSavedStatus] = useState(false);
  const [pasteAttempted, setPasteAttempted] = useState<boolean>(false);

  // Anti-cheat & quality validation
  const minCharacters = 40;
  const trimmed = reflectionInput.trim();
  const charCount = trimmed.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;

  // Anti-spam repetition check (e.g. holding 'aaaaaaaa' or '111111')
  const uniqueChars = new Set(trimmed.toLowerCase().replace(/\s+/g, '')).size;
  const isRepetitive = charCount >= 20 && uniqueChars < 6;
  const isEligibleToSave = charCount >= minCharacters && wordCount >= 6 && !isRepetitive;

  // Pillar CT interactive widget state for Modul 2
  const [selectedPillar, setSelectedPillar] = usePersistentState<'dekomposisi' | 'pola' | 'abstraksi' | 'algoritma'>(
    'informatika_ct_pillar_v1',
    'dekomposisi'
  );

  const isCompleted = completedModules.includes(currentModule.id);

  const handleReflectionChange = (val: string) => {
    setReflectionDrafts((prev) => ({
      ...prev,
      [currentModule.id]: val
    }));
  };

  const handleSaveReflection = () => {
    if (!isEligibleToSave) return;
    saveReflection(currentModule.id, reflectionInput);
    setReflectionDrafts((prev) => {
      const copy = { ...prev };
      delete copy[currentModule.id];
      return copy;
    });
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 2500);
  };

  const currentIndex = MODULES_DATA.findIndex((m) => m.id === currentModule.id);
  const prevModule = currentIndex > 0 ? MODULES_DATA[currentIndex - 1] : null;
  const nextModule = currentIndex < MODULES_DATA.length - 1 ? MODULES_DATA[currentIndex + 1] : null;

  return (
    <div className="space-y-8 pb-16">
      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {MODULES_DATA.map((m) => {
          const active = m.id === currentModule.id;
          const done = completedModules.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => setCurrentModuleId(m.id)}
              className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors flex items-center gap-1.5 ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
              }`}
            >
              <span>M{m.number}</span>
              <span className="hidden md:inline">· {m.title.split(':')[0]}</span>
              {done && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />}
            </button>
          );
        })}
      </div>

      {/* Module Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono">
              <span>MODUL {currentModule.number} DARI 9</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-sans">{currentModule.duration}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {currentModule.title}
            </h1>
            <p className="text-sm font-medium text-slate-300">
              {currentModule.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => toggleModuleComplete(currentModule.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                isCompleted
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800 hover:bg-emerald-900/60'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isCompleted ? 'Selesai Dipelajari' : 'Tandai Selesai'}</span>
            </button>

            <button
              onClick={() => setActiveTab('codelab')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <Code2 className="w-4 h-4" />
              <span>Praktik Lab</span>
            </button>
          </div>
        </div>

        {/* Tujuan Pembelajaran */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2 text-xs">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span>Tujuan Pembelajaran Modul Ini:</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-slate-300">
            {currentModule.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-blue-400 font-bold">&bull;</span>
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Educational Sections */}
      <div className="space-y-8">
        {currentModule.sections.map((sec, idx) => (
          <div
            key={idx}
            className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4"
          >
            <h2 className="text-lg sm:text-xl font-bold text-white border-b border-slate-800 pb-3">
              {sec.title}
            </h2>

            <div className="prose prose-invert max-w-none text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              {sec.content}
            </div>

            {/* Code Snippet with Syntax Styling if available */}
            {sec.codeExample && (
              <div className="mt-4 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <div className="bg-slate-900 px-4 py-2 text-xs font-mono text-slate-400 flex items-center justify-between border-b border-slate-800">
                  <span>Contoh Kode / Notasi</span>
                  <span className="text-blue-400 font-semibold">C++ / Pseudocode</span>
                </div>
                <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  <code>{sec.codeExample}</code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Widget for Modul 2 (4 Pilar Computational Thinking) */}
      {currentModule.number === 2 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 text-base font-bold text-white">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>Aktivitas Interaktif: Eksplorasi 4 Pilar Berpikir Komputasional</span>
          </div>
          <p className="text-xs text-slate-300">
            Klik masing-masing pilar di bawah ini untuk melihat penerapannya dalam memecahkan masalah antrean kantin sekolah:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(
              [
                { id: 'dekomposisi', label: '1. Dekomposisi' },
                { id: 'pola', label: '2. Pengenalan Pola' },
                { id: 'abstraksi', label: '3. Abstraksi' },
                { id: 'algoritma', label: '4. Perancangan Algoritma' }
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(p.id)}
                className={`p-3 rounded-lg text-xs font-semibold transition-all ${
                  selectedPillar === p.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            {selectedPillar === 'dekomposisi' && (
              <>
                <div className="font-bold text-blue-400 text-sm">Pilar Dekomposisi pada Antrean Kantin:</div>
                <p className="text-slate-300 leading-relaxed">
                  Memecah proses transaksi kantin yang rumit menjadi bagian mandiri: (1) Area pemesanan &amp; pembayaran kasir, (2) Dapur pembuatan makanan, dan (3) Meja penyerahan makanan. Hal ini menghilangkan kerumunan siswa di satu meja.
                </p>
              </>
            )}
            {selectedPillar === 'pola' && (
              <>
                <div className="font-bold text-emerald-400 text-sm">Pilar Pengenalan Pola:</div>
                <p className="text-slate-300 leading-relaxed">
                  Melihat pola bahwa 70% siswa membeli Nasi Goreng dan Es Teh pada 10 menit pertama istirahat. Mengetahui pola ini memungkinkan kantin menyiapkan stok cepat saji sebelum bel istirahat berbunyi.
                </p>
              </>
            )}
            {selectedPillar === 'abstraksi' && (
              <>
                <div className="font-bold text-amber-400 text-sm">Pilar Abstraksi:</div>
                <p className="text-slate-300 leading-relaxed">
                  Mengabaikan hal-hal yang tidak relevan dengan kecepatan transaksi (seperti apakah siswa memakai sepatu hitam atau biru, atau hobi musik siswa). Petugas kasir hanya fokus pada 3 data: Menu yang dipesan, Jumlah porsi, dan Uang pembayaran.
                </p>
              </>
            )}
            {selectedPillar === 'algoritma' && (
              <>
                <div className="font-bold text-purple-400 text-sm">Pilar Perancangan Algoritma:</div>
                <p className="text-slate-300 leading-relaxed">
                  Menyusun urutan instruksi kerja pasti: 1. Siswa memesan di mesin kasir &rarr; 2. Mendapatkan struk bernomor antrean &rarr; 3. Dapur memasak sesuai urutan nomor &rarr; 4. Monitor memanggil nomor siap ambil.
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Real-World Cases Section */}
      {currentModule.realWorldCases.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <span>Contoh Kasus Kontekstual Dunia Nyata</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentModule.realWorldCases.map((c, i) => (
              <div
                key={i}
                className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="text-sm font-bold text-blue-400">
                    {c.title}
                  </div>
                  <div className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-200">Masalah:</strong> {c.problem}
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-slate-200">
                      Langkah Penyelesaian Logis:
                    </div>
                    <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                      {c.algorithmSteps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="text-slate-300">
                    <strong className="text-emerald-400">Hasil Solusi:</strong> {c.expectedResult}
                  </div>
                  <div className="text-slate-400 italic">
                    <strong className="text-slate-300">Alasan Logis:</strong> {c.logicalExplanation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mindful Learning Reflection Card with Anti-Copy Paste & Anti-Cheating Protection */}
      <div className="bg-slate-900 border border-purple-900/40 rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 pointer-events-none">
          <div className="w-24 h-24 bg-purple-600/5 rounded-full blur-2xl" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 text-base font-bold text-purple-400">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span>Refleksi Berkesadaran Siswa (Mindful Learning Journal)</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Proteksi Anti Copy-Paste Aktif</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs sm:text-sm text-slate-200 font-semibold">
            {currentModule.mindfulReflection.question}
          </p>
          <p className="text-xs text-slate-400 italic">
            "{currentModule.mindfulReflection.promptText}"
          </p>
        </div>

        {/* Anti-Copy Warning Alert (if attempted) */}
        {pasteAttempted && (
          <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-600/80 text-xs text-amber-200 flex items-start gap-3 animate-in fade-in duration-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="text-amber-300 font-bold">Peringatan Integritas Akademik:</strong>
              <p className="leading-relaxed">
                Fitur penempelan teks (paste) dinonaktifkan. Jurnal Pembelajaran Berkesadaran menuntut kemurnian proses berpikir Anda. Silakan ketik refleksi secara langsung dengan kata-kata Anda sendiri.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={reflectionInput}
              onChange={(e) => {
                handleReflectionChange(e.target.value);
                setPasteAttempted(false);
              }}
              onPaste={(e) => {
                e.preventDefault();
                setPasteAttempted(true);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setPasteAttempted(true);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
              onKeyDown={(e) => {
                // Intercept Ctrl+V, Cmd+V, and Shift+Insert
                if (
                  (e.ctrlKey && (e.key === 'v' || e.key === 'V')) ||
                  (e.metaKey && (e.key === 'v' || e.key === 'V')) ||
                  (e.shiftKey && e.key === 'Insert')
                ) {
                  e.preventDefault();
                  setPasteAttempted(true);
                }
              }}
              placeholder="Ketikkan langsung proses berpikir dan refleksimu di sini... (Fitur paste dinonaktifkan untuk menjaga keaslian refleksi)"
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors resize-y leading-relaxed"
            />
          </div>

          {/* Real-time Quality & Character Verification Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span
                className={`font-mono font-semibold ${
                  charCount >= minCharacters ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {charCount} / {minCharacters} karakter minimum
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">
                {wordCount} kata
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              {isRepetitive ? (
                <span className="text-amber-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Ketik refleksi bermakna</span>
                </span>
              ) : isEligibleToSave ? (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Refleksi memenuhi syarat</span>
                </span>
              ) : (
                <span className="text-slate-500">
                  Minimal {minCharacters} karakter
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {savedStatus && (
                <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Jurnal tersimpan! (+25 XP)
                </span>
              )}

              <button
                onClick={handleSaveReflection}
                disabled={!isEligibleToSave}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-purple-600/30"
                title={
                  !isEligibleToSave
                    ? `Ketik minimal ${minCharacters} karakter refleksi yang bermakna untuk mengaktifkan tombol simpan.`
                    : 'Simpan refleksi mandiri'
                }
              >
                <Send className="w-3.5 h-3.5" />
                <span>Simpan Refleksi</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Next/Previous Module Navigation Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        {prevModule ? (
          <button
            onClick={() => setCurrentModuleId(prevModule.id)}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>M{prevModule.number}: {prevModule.title.split(':')[0]}</span>
          </button>
        ) : (
          <div />
        )}

        {nextModule ? (
          <button
            onClick={() => setCurrentModuleId(nextModule.id)}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md shadow-blue-600/30"
          >
            <span>M{nextModule.number}: {nextModule.title.split(':')[0]}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('codelab')}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Lanjut ke Lab Koding C++</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
