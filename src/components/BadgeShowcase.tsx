import React from 'react';
import { Badge, UserProgress } from '../types.ts';
import { ALL_BADGES } from '../data/badgesData.ts';
import { getUserLevel } from '../utils/gamification.ts';
import { 
  Award, 
  Lock, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  ScrollText, 
  Code2, 
  Brain, 
  GitBranch, 
  Terminal, 
  Layers, 
  Star,
  Zap
} from 'lucide-react';

interface BadgeShowcaseProps {
  progress: UserProgress;
  onClose?: () => void;
}

export const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ progress }) => {
  const levelInfo = getUserLevel(progress.totalPoints || 0);
  const unlockedSet = new Set(progress.unlockedBadges || []);
  const unlockedCount = unlockedSet.size;

  const renderBadgeIcon = (iconName: string, isUnlocked: boolean) => {
    const className = `w-6 h-6 ${isUnlocked ? 'text-amber-400' : 'text-slate-600'}`;
    switch (iconName) {
      case 'ScrollText': return <ScrollText className={className} />;
      case 'Code2': return <Code2 className={className} />;
      case 'Brain': return <Brain className={className} />;
      case 'GitBranch': return <GitBranch className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      case 'Trophy': return <Trophy className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Layers': return <Layers className={className} />;
      default: return <Award className={className} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Level & Points Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono">
              <Sparkles className="w-4 h-4" />
              <span>SISTEM POIN &amp; LENCANA PRESTASI</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
              <span>Level {levelInfo.level}:</span>
              <span className="text-blue-400">{levelInfo.title}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Kumpulkan poin pengalaman (XP) dengan belajar tekun, mencoba koding mandiri, dan menyelesaikan tantangan logika.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[130px]">
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>TOTAL XP</span>
              </div>
              <div className="text-3xl font-black font-mono text-amber-400 mt-0.5">
                {progress.totalPoints || 0}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[130px]">
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-1">
                <Award className="w-3.5 h-3.5 text-blue-400" />
                <span>LENCANA DIRAIH</span>
              </div>
              <div className="text-3xl font-black font-mono text-blue-400 mt-0.5">
                {unlockedCount} <span className="text-xs text-slate-500 font-normal">/ {ALL_BADGES.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>Progres Menuju Level {Math.min(5, levelInfo.level + 1)}</span>
            <span className="text-amber-400 font-bold">{levelInfo.progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${levelInfo.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Daftar Lencana Prestasi (Badges)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Raih pencapaian khusus untuk membuka lencana dan mendapatkan bonus poin ekstra.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const isUnlocked = unlockedSet.has(badge.id);
            const isHighlighted = badge.id === 'ahli-algoritma-dasar' || badge.id === 'master-cpp-pemula';

            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-5 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-slate-900/90 border-amber-900/60 shadow-lg shadow-amber-950/20'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-70'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
                        isUnlocked
                          ? 'bg-amber-950/60 border-amber-800/80 shadow-md shadow-amber-500/20'
                          : 'bg-slate-950 border-slate-800'
                      }`}
                    >
                      {renderBadgeIcon(badge.iconName, isUnlocked)}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold">
                      {isUnlocked ? (
                        <span className="text-emerald-400 flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-900/40">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Terbuka
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          <Lock className="w-3 h-3" /> Terkunci
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{badge.name}</span>
                      {isHighlighted && (
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1 text-xs">
                  <div className="text-slate-400 flex items-center justify-between">
                    <span>Syarat Perolehan:</span>
                    <span className="font-mono text-amber-400 font-bold">+{badge.pointsReward} XP</span>
                  </div>
                  <div className="text-slate-300 font-medium italic">
                    {badge.requirement}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules of Earning XP */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 text-xs space-y-3">
        <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Cara Mengumpulkan Poin Pengalaman (XP):</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-300">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-blue-400">Modul Teori</div>
            <div className="text-slate-400">+50 XP untuk setiap modul yang dituntaskan.</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-emerald-400">Lab Koding C++</div>
            <div className="text-slate-400">+40 XP per tantangan koding yang lolos test cases.</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-amber-400">Evaluasi Kuis</div>
            <div className="text-slate-400">+10 XP per jawaban benar + 50 XP bonus tuntas KKM.</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-purple-400">Jurnal Refleksi</div>
            <div className="text-slate-400">+25 XP setiap menyimpan proses berpikir mindful.</div>
          </div>
        </div>
      </div>
    </div>
  );
};
