import React from 'react';
import { Terminal, User, UserPlus, ShieldAlert, BookOpen, Code2, Award, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

interface AuthLandingProps {
  onSelectView: (view: 'login_student' | 'register_student' | 'login_admin') => void;
}

export const AuthLanding: React.FC<AuthLandingProps> = ({ onSelectView }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header Brand */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-mono text-sm shadow-md shadow-blue-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight text-white">
              Materi Logika Algoritma terhadap Pemrograman
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView('login_admin')}
              className="px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 active:scale-95 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-sm shadow-amber-500/10"
              title="Akses Portal Administrator & Guru Informatika"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Portal Admin Guru</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Auth Selection */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-xs font-semibold text-blue-300 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>INFORMATIKA KELAS X SMA · FASE E</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Selamat Datang untuk Belajar Informatika
            </h1>
            <p className="text-lg sm:text-xl font-medium text-blue-400">
              "Pelajari Logika, Algoritma, dan Pemrograman C++ secara Interaktif."
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Akses materi Kurikulum Merdeka dengan pendekatan <strong>Deep Learning</strong> (Berkesadaran, Bermakna, Menggembirakan), simulator koding C++, penelusuran flowchart animasi, dan evaluasi HOTS mandiri.
          </p>

          {/* Student Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onSelectView('login_student')}
              className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-sm transition-all shadow-xl shadow-blue-600/30 flex items-center gap-2.5 min-w-[210px] justify-center"
            >
              <User className="w-4 h-4" />
              <span>Login Siswa</span>
            </button>

            <button
              onClick={() => onSelectView('register_student')}
              className="px-7 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-xl text-sm border border-slate-700 transition-all flex items-center gap-2.5 min-w-[210px] justify-center hover:border-slate-600 shadow-lg shadow-black/40"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>Registrasi Siswa Baru</span>
            </button>
          </div>
        </div>

        {/* 3 Pedagogical Features Highlight */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">9 Modul Materi Terstruktur</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Disusun berjenjang dari logika verbal, berpikir komputasional, pseudocode, flowchart hingga koding C++ sekuensial, percabangan, dan perulangan.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Lab Koding &amp; Trace Table</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Jalankan kode program langsung dengan simulator C++ berkecepatan tinggi, inspeksi nilai memori secara langsung, dan uji kasus otomatis.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Evaluasi HOTS &amp; Gamifikasi</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Kumpulkan poin pengalaman (XP), raih lencana pencapaian seperti 'Ahli Algoritma Dasar', dan selesaikan proyek akhir capstone sekolah.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        Informatika SMA Kelas X &bull; Fase E &bull; Kurikulum Merdeka
      </footer>
    </div>
  );
};
