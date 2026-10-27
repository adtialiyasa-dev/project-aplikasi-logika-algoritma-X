import { Badge, UserProgress } from '../types.ts';
import { ALL_BADGES } from '../data/badgesData.ts';

export interface UserLevelInfo {
  level: number;
  title: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
}

const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Pemula Logika', min: 0, max: 200 },
  { level: 2, title: 'Perancang Alur', min: 200, max: 500 },
  { level: 3, title: 'Programmer C++ Muda', min: 500, max: 900 },
  { level: 4, title: 'Pemecah Masalah Andal', min: 900, max: 1400 },
  { level: 5, title: 'Master Komputasi Fase E', min: 1400, max: 2000 }
];

export function getUserLevel(totalPoints: number): UserLevelInfo {
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const t = LEVEL_THRESHOLDS[i];
    if (totalPoints >= t.min && totalPoints < t.max) {
      const range = t.max - t.min;
      const progress = totalPoints - t.min;
      const progressPercent = Math.min(100, Math.round((progress / range) * 100));
      return {
        level: t.level,
        title: t.title,
        currentLevelXp: progress,
        nextLevelXp: range,
        progressPercent
      };
    }
  }

  // Max level reached
  return {
    level: 5,
    title: 'Master Komputasi Fase E',
    currentLevelXp: totalPoints - 1400,
    nextLevelXp: 1000,
    progressPercent: 100
  };
}

export function checkAndAwardBadges(progress: UserProgress): {
  newlyUnlockedBadges: string[];
  awardedBadge?: Badge;
  bonusPoints: number;
} {
  const currentUnlocked = new Set(progress.unlockedBadges || []);
  const newlyUnlocked: string[] = [];
  let bonusPoints = 0;
  let firstAwardedBadge: Badge | undefined;

  ALL_BADGES.forEach((badge) => {
    if (currentUnlocked.has(badge.id)) return;

    let eligible = false;

    switch (badge.id) {
      case 'ahli-algoritma-dasar':
        // Specifically requested: Unlocked after completing Modul 3
        eligible = progress.completedModules.includes('modul-3');
        break;

      case 'master-cpp-pemula':
        // Specifically requested: Unlocked after completing Modul 8
        eligible = progress.completedModules.includes('modul-8');
        break;

      case 'pemikir-komputasional':
        eligible = progress.completedModules.includes('modul-2');
        break;

      case 'arsitek-diagram-alir':
        eligible = progress.completedModules.includes('modul-4');
        break;

      case 'coder-pertama':
        eligible = progress.completedExercises.length >= 1;
        break;

      case 'debugger-tanggap':
        eligible = progress.completedExercises.length >= 5;
        break;

      case 'juara-evaluasi-hots':
        eligible = progress.quizBestScore >= 85;
        break;

      case 'penjelajah-lengkap':
        eligible = progress.completedModules.length >= 9;
        break;

      case 'reflektor-mindful':
        eligible = Object.keys(progress.reflections || {}).filter(k => (progress.reflections[k] || '').trim().length > 10).length >= 3;
        break;

      case 'arsitek-solusi-mandiri':
        eligible = progress.completedModules.includes('modul-9') || (progress.completedExercises.length >= 8);
        break;

      default:
        break;
    }

    if (eligible) {
      newlyUnlocked.push(badge.id);
      bonusPoints += badge.pointsReward;
      if (!firstAwardedBadge) {
        firstAwardedBadge = {
          ...badge,
          unlockedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
      }
    }
  });

  return {
    newlyUnlockedBadges: newlyUnlocked,
    awardedBadge: firstAwardedBadge,
    bonusPoints
  };
}
