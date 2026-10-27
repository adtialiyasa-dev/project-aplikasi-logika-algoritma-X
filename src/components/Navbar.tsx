import React from 'react';
import { NavigationTab } from '../types.ts';
import { UserProfile } from '../utils/authService.ts';
import { 
  Terminal, 
  Code2, 
  Award, 
  Trophy, 
  Zap, 
  User, 
  LogOut,
  ChevronDown,
  LayoutDashboard,
  BookOpen,
  Cpu,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  progressPercent: number;
  totalPoints: number;
  unlockedBadgesCount: number;
  onOpenBadges: () => void;
  currentUser: UserProfile | null;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  progressPercent,
  totalPoints,
  unlockedBadgesCount,
  onOpenBadges,
  currentUser,
  onOpenProfile,
  onLogout
}) => {
  const studentNavItems: { id: NavigationTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard Siswa', icon: LayoutDashboard },
    { id: 'modules', label: 'Modul Materi', icon: BookOpen, badge: '9 Modul' },
    { id: 'visualizer', label: 'Visualisasi Algoritma', icon: Cpu, badge: 'Interaktif' },
    { id: 'codelab', label: 'Lab Koding C++', icon: Code2, badge: '10 Lab' },
    { id: 'quiz', label: 'Evaluasi HOTS & Kuis', icon: Award, badge: '50 Soal' },
    { id: 'projects', label: 'Proyek Capstone', icon: Sparkles, badge: 'Mandiri' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-white shadow-xl shadow-black/30">
      {/* 1. Primary Header Row (Wordmark & User Profile) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Logo & Application Title */}
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 text-left group transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-mono text-sm shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform shrink-0">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors leading-tight">
                Materi Logika Algoritma terhadap Pemrograman
              </div>
              <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Informatika Kelas X SMA Fase E &bull; Kurikulum Merdeka
              </div>
            </div>
          </button>

          {/* User Status, XP & Gamification Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Gamification Badge Button */}
            <button
              onClick={onOpenBadges}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800/60 text-amber-300 text-xs font-mono font-bold transition-all shadow-sm"
              title="Lihat Poin & Lencana Prestasi Siswa"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{totalPoints} XP</span>
              <span className="text-amber-500/70 hidden sm:inline">&bull;</span>
              <Trophy className="w-3.5 h-3.5 text-amber-400 hidden sm:inline" />
              <span className="hidden sm:inline">{unlockedBadgesCount} Lencana</span>
            </button>

            {/* Student User Profile Button */}
            {currentUser && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs text-white transition-all group"
                  title="Buka Profil Siswa"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40 flex items-center justify-center font-bold text-[11px]">
                    {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="hidden md:flex flex-col text-left">
                    <span className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors max-w-[130px] truncate leading-tight">
                      {currentUser.fullName}
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono">
                      Kelas {currentUser.className || 'X'}
                    </span>
                  </div>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-xl border border-transparent hover:border-red-900/50 transition-colors"
                  title="Keluar (Logout)"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Secondary Navigation Bar (DIBAWAH HEADER) */}
      <div className="border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
            {studentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/25'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isActive
                          ? 'bg-blue-700/80 text-blue-100'
                          : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
