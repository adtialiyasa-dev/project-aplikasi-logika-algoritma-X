import React from 'react';
import { QuizQuestion, QuestionCategory } from '../types.ts';
import { QUIZ_QUESTIONS } from '../data/quizQuestions.ts';
import { STORAGE_KEYS, usePersistentState } from '../utils/storage.ts';
import { Award, CheckCircle2, XCircle, RotateCcw, Lightbulb, ChevronRight, ChevronLeft, ArrowRight, BookOpen, AlertTriangle } from 'lucide-react';

interface QuizViewProps {
  onQuizCompleted: (score: number) => void;
  bestScore: number;
}

interface QuizPersistentState {
  selectedCategory: QuestionCategory | 'all';
  currentIndex: number;
  userAnswers: Record<number, number>;
  submittedAnswers: Record<number, boolean>;
  isFinished: boolean;
}

const DEFAULT_QUIZ_STATE: QuizPersistentState = {
  selectedCategory: 'all',
  currentIndex: 0,
  userAnswers: {},
  submittedAnswers: {},
  isFinished: false
};

export const QuizView: React.FC<QuizViewProps> = ({ onQuizCompleted, bestScore }) => {
  const [quizState, setQuizState] = usePersistentState<QuizPersistentState>(
    STORAGE_KEYS.QUIZ_STATE,
    DEFAULT_QUIZ_STATE
  );

  const selectedCategory = quizState.selectedCategory || 'all';
  const currentIndex = quizState.currentIndex || 0;
  const userAnswers = quizState.userAnswers || {};
  const submittedAnswers = quizState.submittedAnswers || {};
  const isFinished = quizState.isFinished || false;

  // Filtered questions
  const filteredQuestions = selectedCategory === 'all'
    ? QUIZ_QUESTIONS
    : QUIZ_QUESTIONS.filter((q) => q.category === selectedCategory);

  const safeIndex = Math.min(Math.max(0, currentIndex), Math.max(0, filteredQuestions.length - 1));
  const currentQ: QuizQuestion = filteredQuestions[safeIndex] || filteredQuestions[0];
  const totalCount = filteredQuestions.length;

  const currentAnswer = userAnswers[currentQ.id];
  const isSubmitted = submittedAnswers[currentQ.id];
  const isCorrect = isSubmitted && currentAnswer === currentQ.correctIndex;

  const handleCategoryChange = (category: QuestionCategory | 'all') => {
    setQuizState((prev) => ({
      ...prev,
      selectedCategory: category,
      currentIndex: 0
    }));
  };

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return; // Prevent changing after submit
    setQuizState((prev) => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQ.id]: optionIndex
      }
    }));
  };

  const handleSubmitCurrent = () => {
    if (currentAnswer === undefined) return;
    setQuizState((prev) => ({
      ...prev,
      submittedAnswers: {
        ...prev.submittedAnswers,
        [currentQ.id]: true
      }
    }));
  };

  const handleNext = () => {
    if (safeIndex < totalCount - 1) {
      setQuizState((prev) => ({
        ...prev,
        currentIndex: safeIndex + 1
      }));
    } else {
      // Finish quiz
      calculateAndFinish();
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      setQuizState((prev) => ({
        ...prev,
        currentIndex: safeIndex - 1
      }));
    }
  };

  const calculateAndFinish = () => {
    let correctCount = 0;
    filteredQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / totalCount) * 100);
    onQuizCompleted(finalScore);
    setQuizState((prev) => ({
      ...prev,
      isFinished: true
    }));
  };

  const handleResetQuiz = () => {
    setQuizState(DEFAULT_QUIZ_STATE);
  };

  // Compute metrics if finished
  let totalCorrect = 0;
  let totalWrong = 0;
  filteredQuestions.forEach((q) => {
    if (userAnswers[q.id] !== undefined) {
      if (userAnswers[q.id] === q.correctIndex) {
        totalCorrect++;
      } else {
        totalWrong++;
      }
    }
  });
  const calculatedScore = Math.round((totalCorrect / totalCount) * 100);

  const letterOptions = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 font-mono">
              <span>EVALUASI HOTS &amp; ASESMEN FASE E</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400 font-sans">Bank 50 Soal Terstandarisasi</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Latihan Soal &amp; Evaluasi HOTS
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Uji ketajaman berpikir komputasional, penalaran logika, dan analisis kode C++ dengan umpan balik edukatif instan dan pembahasan mendalam.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-right">
              <div className="text-[11px] text-slate-400">Skor Tertinggi Anda:</div>
              <div className="text-lg font-bold font-mono text-amber-400">{bestScore} / 100</div>
            </div>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-slate-800">
          {[
            { id: 'all', label: 'Semua Soal (50)' },
            { id: 'konsep', label: '1. Pemahaman Konsep (10)' },
            { id: 'penerapan', label: '2. Penerapan Algoritma (10)' },
            { id: 'analisis', label: '3. Analisis Kode C++ (10)' },
            { id: 'debugging', label: '4. Debugging & Error (10)' },
            { id: 'hots', label: '5. HOTS Studi Kasus (10)' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {isFinished ? (
        /* Quiz Summary Screen */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-8">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto border border-blue-500/30">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hasil Evaluasi Pembelajaran
            </h2>
            <p className="text-sm text-slate-300">
              Berikut adalah pencapaian evaluasi Anda pada paket soal terpilih:
            </p>
          </div>

          {/* Score Circle / Badge */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 inline-block px-10">
            <div className="text-xs text-slate-400 font-mono mb-1">NILAI AKHIR (SKALA 100)</div>
            <div className="text-5xl font-black font-mono text-blue-400">{calculatedScore}</div>
            <div className="text-xs mt-2 font-semibold">
              {calculatedScore >= 75 ? (
                <span className="text-emerald-400">TUNTAS KKM (&ge; 75)</span>
              ) : (
                <span className="text-amber-400">BELUM TUNTAS KKM (&lt; 75)</span>
              )}
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-xs">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Jawaban Benar</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {totalCorrect} <span className="text-xs text-slate-500">/ {totalCount}</span>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-400">Jawaban Kurang Tepat</span>
              <div className="text-2xl font-bold font-mono text-red-400">
                {totalWrong} <span className="text-xs text-slate-500">/ {totalCount}</span>
              </div>
            </div>
          </div>

          {/* Recommendations for Remediation */}
          <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 text-left text-xs space-y-2">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Rekomendasi Tindak Lanjut Belajar:</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {calculatedScore >= 85
                ? 'Luar biasa! Pemahaman logika dan pemrograman C++ Anda sangat matang. Silakan lanjutkan ke bagian Proyek Akhir untuk mengimplementasikan solusi perangkat lunak mandiri.'
                : calculatedScore >= 75
                ? 'Bagus! Anda telah mencapai Kriteria Ketuntasan Minimal (KKM). Ulas kembali beberapa nomor soal analisis kode untuk memperkuat ketajaman penelusuran variabel.'
                : 'Jangan berkecil hati. Buka kembali Modul 5 (Pengenalan C++) dan Modul 7 (Percabangan) serta latih kode secara mandiri di Lab Koding untuk memperkuat intuisi logika.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleResetQuiz}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Kuis</span>
            </button>
          </div>
        </div>
      ) : (
        /* Question Card & Answering Flow */
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Progress Bar & Counter */}
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span>
              Soal {currentIndex + 1} dari {totalCount}
            </span>
            <span className="text-blue-400 font-semibold uppercase">
              {currentQ.category} &bull; {currentQ.difficulty}
            </span>
          </div>

          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalCount) * 100}%` }}
            />
          </div>

          {/* Question Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            {/* Topic & Indicator */}
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-mono">
                Indikator: {currentQ.indicator}
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed whitespace-pre-line">
                {currentQ.question}
              </h2>
            </div>

            {/* Code Snippet if exists */}
            {currentQ.codeSnippet && (
              <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed">
                  <code>{currentQ.codeSnippet}</code>
                </pre>
              </div>
            )}

            {/* 5 Options (A to E) */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = currentAnswer === oIdx;
                const isCorrectOption = oIdx === currentQ.correctIndex;

                let optionStyle = 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60';
                if (isSelected && !isSubmitted) {
                  optionStyle = 'bg-blue-950 border-blue-500 text-white shadow-md shadow-blue-500/20';
                } else if (isSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'bg-red-950/80 border-red-500 text-red-200';
                  } else {
                    optionStyle = 'bg-slate-950/50 text-slate-500 border-slate-900 opacity-60';
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    disabled={isSubmitted}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3.5 leading-relaxed ${optionStyle}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 text-xs ${
                        isSubmitted && isCorrectOption
                          ? 'bg-emerald-600 text-white'
                          : isSubmitted && isSelected && !isCorrectOption
                          ? 'bg-red-600 text-white'
                          : isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {letterOptions[oIdx]}
                    </div>
                    <span className="pt-0.5">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Submit Answer Action Bar */}
            {!isSubmitted && (
              <div className="pt-4 flex justify-end">
                <button
                  onClick={handleSubmitCurrent}
                  disabled={currentAnswer === undefined}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold rounded-lg text-xs transition-all shadow-md shadow-blue-600/30"
                >
                  Kirim Jawaban
                </button>
              </div>
            )}

            {/* Instant Educational Feedback Panel (Visible after submit) */}
            {isSubmitted && (
              <div
                className={`p-5 rounded-xl border text-xs space-y-3 ${
                  isCorrect
                    ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200'
                    : 'bg-amber-950/40 border-amber-800/80 text-amber-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isCorrect ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400">Jawaban Benar! Kerja Bagus.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span className="text-amber-400">
                        Jawaban Kurang Tepat. (Kunci: Pilihan {letterOptions[currentQ.correctIndex]})
                      </span>
                    </>
                  )}
                </div>

                <div className="text-slate-200 leading-relaxed space-y-2">
                  <p>
                    <strong className="text-white">Pembahasan Lengkap:</strong> {currentQ.explanation}
                  </p>
                  <p className="text-slate-300">
                    <strong className="text-emerald-400">Mengapa Benar:</strong> {currentQ.whyCorrect}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-30 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <button
              onClick={handleNext}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-blue-600/30"
            >
              <span>{currentIndex === totalCount - 1 ? 'Selesaikan Evaluasi' : 'Selanjutnya'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
