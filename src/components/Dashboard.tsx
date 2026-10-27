import React from 'react';
import { NavigationTab, UserProgress } from '../types.ts';
import { UserProfile } from '../utils/authService.ts';
import { MODULES_DATA } from '../data/modulesData.ts';
import { 
  BookOpen, 
  Code2, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Brain, 
  Compass, 
  Target, 
  Clock, 
  ShieldCheck, 
  Trophy, 
  Zap, 
  Star, 
  Lock,
  User,
  GraduationCap
} from 'lucide-react';
import { getUserLevel } from '../utils/gamification.ts';

interface DashboardProps {
  progress: UserProgress;
  setActiveTab: (tab: NavigationTab) => void;
  setSelectedModuleId: (id: string) => void;
  onOpenBadges: () => void;
  currentUser?: UserProfile | null;
  onOpenProfile?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  setActiveTab,
  setSelectedModuleId,
  onOpenBadges,
  currentUser,
  onOpenProfile
}) => {
  const levelInfo = getUserLevel(progress.totalPoints || 0);
  const unlockedBadgesSet = new Set(progress.unlockedBadges || []);
  const completedModuleCount = progress.completedModules.length;
  const completedExerciseCount = progress.completedExercises.length;
  const progressPercent = Math.round(
    ((completedModuleCount / 9) * 0.5 + (completedExerciseCount / 10) * 0.5) * 100
  );

  return (
    <div className="space-y-10 pb-16">
      {/* Student Welcome & Profile Banner */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/60 border border-blue-900/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0 font-bold text-lg font-mono">
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'S'}
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider font-mono">
                  Dashboard Siswa Aktif
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-900/40 border border-blue-700/60 text-blue-300 text-[11px] font-medium">
                  Kelas {currentUser.className || 'X-1'}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Terautentikasi
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Halo, {currentUser.fullName}!
              </h2>
              <p className="text-xs text-slate-300">
                Terus tingkatkan pemahaman logika, flowchart, dan keahlian koding C++ Anda hari ini.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0">
            {onOpenProfile && (
              <button
                onClick={onOpenProfile}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 transition-all flex items-center gap-2"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Lihat Profil Saya</span>
              </button>
            )}

            <button
              onClick={onOpenBadges}
              className="px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 rounded-xl text-xs font-semibold border border-amber-600/40 transition-all flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>{progress.totalPoints || 0} XP &bull; {(progress.unlockedBadges || []).length} Lencana</span>
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 p-8 sm:p-10 lg:p-12">
        <div className="absolute inset-0 bg-radial from-blue-900/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
              <span>Informatika SMA Kelas X</span>
              <span aria-hidden="true">&bull;</span>
              <span>Fase E</span>
              <span aria-hidden="true">&bull;</span>
              <span>Kurikulum Merdeka</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                LOGIKA DAN ALGORITMA
              </h1>
              <p className="text-lg sm:text-xl font-medium text-blue-400">
                Dari Pola Pikir Logis Menuju Pemrograman C++
              </p>
            </div>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Platform pembelajaran digital interaktif dengan pendekatan <strong>Pembelajaran Mendalam (Deep Learning)</strong>: <em>Berkesadaran (Mindful)</em>, <em>Bermakna (Meaningful)</em>, dan <em>Menggembirakan (Joyful)</em>. Bangun fondasi berpikir komputasional, kuasai diagram alir, dan terjemahkan logika menjadi baris kode C++ nyata.
            </p>

            {/* 3 Tombol Utama */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setSelectedModuleId('modul-1');
                  setActiveTab('modules');
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Mulai Belajar</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveTab('codelab')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <Code2 className="w-4 h-4 text-blue-400" />
                <span>Praktik C++</span>
              </button>

              <button
                onClick={() => setActiveTab('quiz')}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>Latihan Soal</span>
              </button>
            </div>
          </div>

          {/* Hero Visual Media */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl bg-slate-950 aspect-video relative group">
              <img
                src="/src/assets/images/hero_algorithm_cpp_1792718487463.jpg"
                alt="Proses Berpikir Komputasional dan Pemrograman C++"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-slate-300 font-mono">
                Logika &rarr; Pseudocode &rarr; Flowchart &rarr; C++
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kartu Progres Belajar Siswa */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>Modul Materi Selesai</span>
            </div>
            <span className="text-xl font-bold font-mono text-white">
              {completedModuleCount} <span className="text-xs text-slate-500">/ 9</span>
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedModuleCount / 9) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            {completedModuleCount === 9
              ? 'Selamat! Seluruh materi teori dan studi kasus telah tuntas.'
              : `${9 - completedModuleCount} modul lagi untuk menyelesaikan seluruh silabus Fase E.`}
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span>Tantangan Lab C++</span>
            </div>
            <span className="text-xl font-bold font-mono text-white">
              {completedExerciseCount} <span className="text-xs text-slate-500">/ 10</span>
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedExerciseCount / 10) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            Uji program langsung di Simulator C++ untuk memverifikasi ketepatan logika.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Skor Evaluasi HOTS</span>
            </div>
            <span className="text-xl font-bold font-mono text-white">
              {progress.quizBestScore} <span className="text-xs text-slate-500">/ 100</span>
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.quizBestScore}%` }}
            />
          </div>
          <p className="text-xs text-slate-400">
            {progress.quizBestScore >= 75
              ? 'Tuntas KKM (>= 75). Pemahaman penalaran dan analisis kode sangat baik!'
              : 'Standar KKM 75. Uji pemahamanmu pada bank 50 soal pilihan ganda.'}
          </p>
        </div>
      </section>

      {/* Gamification Points & Badges Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400">
              <Trophy className="w-4 h-4" />
              <span>PRESTASI BELAJAR &amp; LENCANA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
              <span>Level {levelInfo.level}:</span>
              <span className="text-blue-400">{levelInfo.title}</span>
            </h2>
            <p className="text-xs text-slate-300">
              Dapatkan poin pengalaman (XP) setiap kali menyelesaikan modul teori, latihan lab C++, dan evaluasi HOTS.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 px-5 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <div className="text-[11px] font-mono text-slate-400">TOTAL POIN</div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {progress.totalPoints || 0} <span className="text-xs text-slate-500 font-normal">XP</span>
              </div>
            </div>

            <button
              onClick={onOpenBadges}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/20 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>Lihat Semua Lencana</span>
            </button>
          </div>
        </div>

        {/* Featured Key Badges Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Badge 1: Ahli Algoritma Dasar */}
          {(() => {
            const isUnlocked = unlockedBadgesSet.has('ahli-algoritma-dasar');
            return (
              <div
                onClick={onOpenBadges}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/90 border-amber-800/80 shadow-md shadow-amber-950/20'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Lencana Khusus</span>
                  </span>
                  {isUnlocked ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Modul 3
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">Ahli Algoritma Dasar</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Dituntaskan setelah menyelesaikan Modul 3 (Notasi Algoritma dan Pseudocode).
                </div>
              </div>
            );
          })()}

          {/* Badge 2: Master C++ Pemula */}
          {(() => {
            const isUnlocked = unlockedBadgesSet.has('master-cpp-pemula');
            return (
              <div
                onClick={onOpenBadges}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/90 border-amber-800/80 shadow-md shadow-amber-950/20'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-amber-400 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>Lencana Khusus</span>
                  </span>
                  {isUnlocked ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Modul 8
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">Master C++ Pemula</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Dituntaskan setelah menyelesaikan Modul 8 (Struktur Perulangan C++).
                </div>
              </div>
            );
          })()}

          {/* Badge 3: Coder Pertama */}
          {(() => {
            const isUnlocked = unlockedBadgesSet.has('coder-pertama');
            return (
              <div
                onClick={onOpenBadges}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/90 border-blue-800/80 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-blue-400">Lab C++</span>
                  {isUnlocked ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> 1 Tantangan
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">Coder Pertama</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Loloskan setidaknya 1 pengujian kode program di Lab Koding C++.
                </div>
              </div>
            );
          })()}

          {/* Badge 4: Juara Evaluasi HOTS */}
          {(() => {
            const isUnlocked = unlockedBadgesSet.has('juara-evaluasi-hots');
            return (
              <div
                onClick={onOpenBadges}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  isUnlocked
                    ? 'bg-slate-950/90 border-purple-800/80 shadow-md'
                    : 'bg-slate-950/40 border-slate-800/80 opacity-75'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold text-purple-400">Evaluasi</span>
                  {isUnlocked ? (
                    <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                    </span>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Nilai &ge; 85
                    </span>
                  )}
                </div>
                <div className="text-sm font-bold text-white">Juara Evaluasi HOTS</div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                  Raih nilai kuis analitis dan studi kasus di atas 85 poin.
                </div>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Prinsip Deep Learning Info */}
      <section className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6">
        <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Tiga Prinsip Pembelajaran Mendalam (Deep Learning)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-blue-400 flex items-center gap-1.5">
              <Brain className="w-4 h-4" />
              <span>1. Berkesadaran (Mindful)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Siswa menyadari tujuan setiap baris kode, menelusuri logika tanpa terburu-buru, dan melakukan refleksi berkala atas strategi penyelesaian masalahnya.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              <span>2. Bermakna (Meaningful)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Materi tidak berhenti pada teori abstrak, melainkan terhubung langsung dengan persoalan nyata di sekolah: kasir kantin, nilai rapor, dan antrean.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="font-semibold text-amber-400 flex items-center gap-1.5">
              <Target className="w-4 h-4" />
              <span>3. Menggembirakan (Joyful)</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Belajar dengan simulator interaktif, tantangan bertingkat yang bebas dari rasa takut salah, serta perayaan atas setiap pencapaian koding.
            </p>
          </div>
        </div>
      </section>

      {/* Daftar 9 Modul Pembelajaran */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Daftar Modul Pembelajaran
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Disusun secara sistematis dari pola pikir komputasional menuju praktik pemrograman C++ prosedural.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES_DATA.map((mod) => {
            const isCompleted = progress.completedModules.includes(mod.id);
            return (
              <div
                key={mod.id}
                onClick={() => {
                  setSelectedModuleId(mod.id);
                  setActiveTab('modules');
                }}
                className={`group cursor-pointer rounded-xl border p-6 transition-all duration-200 flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-slate-900/90 border-blue-900/60 hover:border-blue-700'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono font-semibold text-blue-400">
                      MODUL {mod.number}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {mod.duration}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-white">
                  <span>{mod.sections.length} Sub-Materi Pelajaran</span>
                  <div className="flex items-center gap-1 text-blue-400 font-semibold">
                    <span>Pelajari</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Capaian Pembelajaran Fase E Deskripsi */}
      <section className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-6 text-xs text-slate-400 space-y-2">
        <div className="font-semibold text-slate-200 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span>Kesesuaian Capaian Pembelajaran (CP) Informatika Fase E</span>
        </div>
        <p className="leading-relaxed">
          Materi pada platform ini dirancang selaras dengan Elemen <strong>Berpikir Komputasional (BK)</strong> dan <strong>Algoritma dan Pemrograman (AP)</strong> Kurikulum Merdeka Fase E. Peserta didik dilatih untuk mendekomposisi masalah nyata, mengenali pola, melakukan abstraksi data, menyusun algoritma terstruktur (pseudocode &amp; flowchart), serta mengimplementasikannya dalam bahasa pemrograman prosedural tingkat tinggi C++ dengan memperhatikan efisiensi dan etika digital.
        </p>
      </section>
    </div>
  );
};
