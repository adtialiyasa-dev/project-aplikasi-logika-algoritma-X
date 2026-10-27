import React, { useState, useEffect, useRef } from 'react';
import { NavigationTab, UserProgress } from './types.ts';
import { 
  UserProfile, 
  fetchCurrentUser, 
  logoutUser, 
  fetchStudentProgress, 
  syncStudentProgress,
  getCachedUser,
  getStoredToken,
  setStoredToken
} from './utils/authService.ts';
import { STORAGE_KEYS, usePersistentState, safeGet, safeSet } from './utils/storage.ts';
import { 
  initDatabaseConnection, 
  seedAllDataToFirestore, 
  syncProgressToAllDatabases 
} from './utils/databaseSync.ts';
import { 
  saveProgressToFirestore, 
  loadProgressFromFirestore,
  saveUserToFirestore
} from './utils/firestoreService.ts';
import { AuthLanding } from './components/auth/AuthLanding.tsx';
import { StudentLoginModal } from './components/auth/StudentLoginModal.tsx';
import { StudentRegisterModal } from './components/auth/StudentRegisterModal.tsx';
import { AdminLoginModal } from './components/auth/AdminLoginModal.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { StudentProfileModal } from './components/StudentProfileModal.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { ModuleView } from './components/ModuleView.tsx';
import { AlgorithmVisualizer } from './components/AlgorithmVisualizer.tsx';
import { CodeLab } from './components/CodeLab.tsx';
import { QuizView } from './components/QuizView.tsx';
import { ProjectsView } from './components/ProjectsView.tsx';
import { BadgeShowcase } from './components/BadgeShowcase.tsx';
import { checkAndAwardBadges } from './utils/gamification.ts';
import { Trophy, Zap, X, Sparkles, Loader2 } from 'lucide-react';

const DEFAULT_PROGRESS: UserProgress = {
  totalPoints: 0,
  completedModules: [],
  completedExercises: [],
  quizBestScore: 0,
  quizScores: {},
  reflections: {},
  projectNotes: {},
  unlockedBadges: []
};

export default function App() {
  // Authentication State with instant LocalStorage hydration
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const cached = getCachedUser();
    if (cached?.role === 'admin_guru' && !getStoredToken()) {
      setStoredToken('admin_master_token_2026');
    }
    return cached;
  });
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(() => !getCachedUser());
  const [authView, setAuthView] = usePersistentState<'landing' | 'login_student' | 'register_student' | 'login_admin'>(
    STORAGE_KEYS.AUTH_VIEW,
    'landing'
  );
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Application Navigation with LocalStorage persistence
  const [activeTab, setActiveTab] = usePersistentState<NavigationTab>(STORAGE_KEYS.ACTIVE_TAB, 'dashboard');
  const [selectedModuleId, setSelectedModuleId] = usePersistentState<string>(STORAGE_KEYS.SELECTED_MODULE_ID, 'modul-1');
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<{
    title: string;
    description: string;
    points?: number;
    isBadge?: boolean;
  } | null>(null);

  // Student Learning Progress with LocalStorage auto-save and fallback
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const isInitialSyncDone = useRef(false);

  // Scoped student progress loader: distinguishes between new registrations vs existing logins
  const loadStudentProgressForUser = async (user: UserProfile, isNewRegistration: boolean = false) => {
    isInitialSyncDone.current = false;
    const userStorageKey = `informatika_progress_${user.id}`;
    
    if (isNewRegistration) {
      // BRAND NEW Student Registration: Initialize fresh progress (0/awal)
      safeSet<UserProgress>(userStorageKey, DEFAULT_PROGRESS);
      setProgress(DEFAULT_PROGRESS);
      try {
        await syncStudentProgress(DEFAULT_PROGRESS);
        await saveProgressToFirestore(user.id, DEFAULT_PROGRESS);
        await saveUserToFirestore(user);
      } catch (err) {
        console.error('Failed to sync new student progress', err);
      }
      isInitialSyncDone.current = true;
      return;
    }

    // EXISTING Student:
    // 1. Read from scoped local storage first (instant hydration)
    const localSaved = safeGet<UserProgress>(userStorageKey, DEFAULT_PROGRESS);

    // 2. Fetch from backend database, fallback to Cloud Firestore
    try {
      let remoteProgress: any = null;
      try {
        remoteProgress = await fetchStudentProgress();
      } catch (apiErr) {
        console.warn('Backend fetch failed, attempting Firestore direct fetch:', apiErr);
      }

      if (!remoteProgress) {
        try {
          const firestoreProgress = await loadProgressFromFirestore(user.id);
          if (firestoreProgress) {
            remoteProgress = firestoreProgress;
          }
        } catch (fsErr) {
          console.warn('Firestore direct fetch notice:', fsErr);
        }
      }

      if (remoteProgress && typeof remoteProgress === 'object') {
        // Check if admin explicitly reset this student's progress
        const lastLocalReset = safeGet<string | null>(`${STORAGE_KEYS.LAST_PROGRESS_RESET}_${user.id}`, null);
        const isAdminResetNewer = remoteProgress.resetByAdminAt && 
          (!lastLocalReset || new Date(remoteProgress.resetByAdminAt).getTime() > new Date(lastLocalReset).getTime());

        if (isAdminResetNewer) {
          // Explicit Admin Reset confirmed by teacher
          safeSet<string>(`${STORAGE_KEYS.LAST_PROGRESS_RESET}_${user.id}`, remoteProgress.resetByAdminAt);
          safeSet<UserProgress>(userStorageKey, DEFAULT_PROGRESS);
          setProgress(DEFAULT_PROGRESS);
          setToastNotification({
            title: 'Pemberitahuan Pengerjaan',
            description: 'Pengerjaan Anda telah di-reset oleh Admin Guru ke kondisi awal.',
            isBadge: false
          });
          isInitialSyncDone.current = true;
          return;
        }

        // NON-ADMIN RESET: NEVER WIPE! Preserve student's hard work with Union/Max merge!
        const merged: UserProgress = {
          totalPoints: Math.max(
            typeof remoteProgress.totalPoints === 'number' ? remoteProgress.totalPoints : 0,
            typeof localSaved.totalPoints === 'number' ? localSaved.totalPoints : 0
          ),
          completedModules: Array.from(new Set([
            ...(Array.isArray(localSaved.completedModules) ? localSaved.completedModules : []),
            ...(Array.isArray(remoteProgress.completedModules) ? remoteProgress.completedModules : [])
          ])),
          completedExercises: Array.from(new Set([
            ...(Array.isArray(localSaved.completedExercises) ? localSaved.completedExercises : []),
            ...(Array.isArray(remoteProgress.completedExercises) ? remoteProgress.completedExercises : [])
          ])),
          quizBestScore: Math.max(
            typeof remoteProgress.quizBestScore === 'number' ? remoteProgress.quizBestScore : 0,
            typeof localSaved.quizBestScore === 'number' ? localSaved.quizBestScore : 0
          ),
          quizScores: {
            ...(localSaved.quizScores || {}),
            ...(remoteProgress.quizScores || {})
          },
          reflections: {
            ...(localSaved.reflections || {}),
            ...(remoteProgress.reflections || {})
          },
          projectNotes: {
            ...(localSaved.projectNotes || {}),
            ...(remoteProgress.projectNotes || {})
          },
          capstoneCodeAnswers: {
            ...(localSaved.capstoneCodeAnswers || {}),
            ...(remoteProgress.capstoneCodeAnswers || {})
          },
          projectStatus: (remoteProgress.projectStatus && remoteProgress.projectStatus !== 'Belum Mulai')
            ? remoteProgress.projectStatus
            : (localSaved.projectStatus || 'Belum Mulai'),
          selectedProject: remoteProgress.selectedProject || localSaved.selectedProject,
          unlockedBadges: Array.from(new Set([
            ...(Array.isArray(localSaved.unlockedBadges) ? localSaved.unlockedBadges : []),
            ...(Array.isArray(remoteProgress.unlockedBadges) ? remoteProgress.unlockedBadges : [])
          ]))
        };
        safeSet<UserProgress>(userStorageKey, merged);
        setProgress(merged);
        // Ensure Backend and Firestore have the latest merged progress
        syncStudentProgress(merged).catch(() => {});
        saveProgressToFirestore(user.id, merged).catch(() => {});
      } else {
        setProgress(localSaved);
        if (localSaved.totalPoints > 0) {
          syncStudentProgress(localSaved).catch(() => {});
          saveProgressToFirestore(user.id, localSaved).catch(() => {});
        }
      }
    } catch {
      // Offline / network failure: fallback to scoped LocalStorage
      setProgress(localSaved);
    } finally {
      isInitialSyncDone.current = true;
    }
  };

  // Check active session and initialize database synchronization on startup
  useEffect(() => {
    async function initAuth() {
      try {
        // Initialize multi-tier database sync (Firestore + Backend + LocalStorage)
        await initDatabaseConnection().catch((e) => console.warn('Database initialization notice:', e));

        const user = await fetchCurrentUser();
        if (user) {
          setCurrentUser(user);
          if (user.role === 'student') {
            await loadStudentProgressForUser(user, false);
          } else if (user.role === 'admin_guru') {
            // Seed any un-synced data to Firestore in background
            seedAllDataToFirestore().catch(() => {});
          }
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    }

    initAuth();
  }, []);

  // Sync progress changes to Backend, Cloud Firestore & LocalStorage for students
  useEffect(() => {
    if (currentUser?.role === 'student' && isInitialSyncDone.current) {
      const userStorageKey = `informatika_progress_${currentUser.id}`;
      safeSet<UserProgress>(userStorageKey, progress);
      const timer = setTimeout(() => {
        syncStudentProgress(progress);
        saveProgressToFirestore(currentUser.id, progress).catch(() => {});
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [progress, currentUser]);

  // Handle Logout
  const handleLogout = async () => {
    isInitialSyncDone.current = false;
    await logoutUser();
    setCurrentUser(null);
    setShowProfileModal(false);
    setShowBadgesModal(false);
    setAuthView('landing');
    setProgress(DEFAULT_PROGRESS);
    setToastNotification({
      title: 'Berhasil Keluar',
      description: 'Sesi Anda telah diakhiri dengan aman.',
      isBadge: false
    });
  };

  // Helper to trigger badge check, XP reward, and celebration toast
  const updateProgressAndCheckBadges = (
    updater: (prev: UserProgress) => UserProgress,
    actionPoints: number = 0,
    actionReason: string = ''
  ) => {
    setProgress((prev) => {
      const updated = updater(prev);
      const pointsWithAction = updated.totalPoints + actionPoints;

      const badgeEvaluation = checkAndAwardBadges({
        ...updated,
        totalPoints: pointsWithAction
      });

      const totalNewPoints = pointsWithAction + badgeEvaluation.bonusPoints;
      const combinedBadges = [
        ...new Set([...updated.unlockedBadges, ...badgeEvaluation.newlyUnlockedBadges])
      ];

      // Show toast if new badge or points awarded
      if (badgeEvaluation.awardedBadge) {
        setToastNotification({
          title: `Lencana Terbuka: ${badgeEvaluation.awardedBadge.name}!`,
          description: badgeEvaluation.awardedBadge.description,
          points: badgeEvaluation.awardedBadge.pointsReward + actionPoints,
          isBadge: true
        });
      } else if (actionPoints > 0) {
        setToastNotification({
          title: `+${actionPoints} XP Diperoleh!`,
          description: actionReason,
          points: actionPoints,
          isBadge: false
        });
      }

      return {
        ...updated,
        totalPoints: totalNewPoints,
        unlockedBadges: combinedBadges
      };
    });
  };

  const toggleModuleComplete = (moduleId: string) => {
    const isAlreadyComplete = progress.completedModules.includes(moduleId);
    const xpReward = !isAlreadyComplete ? 50 : 0;

    updateProgressAndCheckBadges(
      (prev) => {
        const exists = prev.completedModules.includes(moduleId);
        const newModules = exists
          ? prev.completedModules.filter((id) => id !== moduleId)
          : [...prev.completedModules, moduleId];
        return {
          ...prev,
          completedModules: newModules
        };
      },
      xpReward,
      `Menyelesaikan Modul ${moduleId.replace('modul-', '')}`
    );
  };

  const markExerciseComplete = (exerciseId: string) => {
    if (progress.completedExercises.includes(exerciseId)) return;

    updateProgressAndCheckBadges(
      (prev) => ({
        ...prev,
        completedExercises: [...prev.completedExercises, exerciseId]
      }),
      40,
      'Menuntaskan Latihan Lab Koding C++'
    );
  };

  const saveReflection = (moduleId: string, text: string) => {
    const isNew = !(progress.reflections[moduleId] || '').trim();
    const xpReward = isNew ? 25 : 0;

    updateProgressAndCheckBadges(
      (prev) => ({
        ...prev,
        reflections: {
          ...prev.reflections,
          [moduleId]: text
        }
      }),
      xpReward,
      'Menyimpan Jurnal Refleksi Berkesadaran'
    );
  };

  const handleQuizCompleted = (score: number) => {
    const xpReward = Math.round(score * 1.5) + (score >= 75 ? 50 : 0);

    updateProgressAndCheckBadges(
      (prev) => ({
        ...prev,
        quizBestScore: Math.max(prev.quizBestScore, score)
      }),
      xpReward,
      `Menuntaskan Evaluasi HOTS dengan skor ${score}`
    );
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toastNotification) {
      const timer = setTimeout(() => {
        setToastNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastNotification]);

  const overallProgressPercent = Math.round(
    ((progress.completedModules.length / 9) * 0.5 +
      (progress.completedExercises.length / 10) * 0.5) *
      100
  );

  // 1. Initial Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-4 animate-pulse">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
        <div className="text-sm font-semibold tracking-wide text-slate-300">
          Memuat Sistem Laboratorium Informatika...
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Menyiapkan modul logika, algoritma &amp; compiler C++
        </p>
      </div>
    );
  }

  // 2. Unauthenticated State: Show Welcome Landing Screen with 3 Auth Flow Pages
  if (!currentUser) {
    if (authView === 'login_student') {
      return (
        <StudentLoginModal
          onSuccess={async (user) => {
            setCurrentUser(user);
            await loadStudentProgressForUser(user, false);
            setAuthView('landing');
            setToastNotification({
              title: `Selamat Datang Kembali, ${user.fullName}!`,
              description: `Berhasil masuk ke kelas ${user.className || 'Fase E'}. Seluruh progress dan pengerjaan Anda telah dimuat.`,
              isBadge: false
            });
          }}
          onSwitchToRegister={() => setAuthView('register_student')}
          onBackToHome={() => setAuthView('landing')}
        />
      );
    }

    if (authView === 'register_student') {
      return (
        <StudentRegisterModal
          onSuccess={async (user) => {
            setCurrentUser(user);
            await loadStudentProgressForUser(user, true);
            setAuthView('landing');
            setToastNotification({
              title: 'Registrasi Berhasil!',
              description: `Akun atas nama ${user.fullName} telah aktif di kelas ${user.className}. Selamat belajar logika dan koding C++!`,
              isBadge: false
            });
          }}
          onSwitchToLogin={() => setAuthView('login_student')}
          onBackToHome={() => setAuthView('landing')}
        />
      );
    }

    if (authView === 'login_admin') {
      return (
        <AdminLoginModal
          onSuccess={(user) => {
            setCurrentUser(user);
            setAuthView('landing');
            setToastNotification({
              title: 'Selamat Datang, Bapak/Ibu Guru Admin!',
              description: 'Dashboard Administrasi & Monitoring Guru Informatika telah aktif.',
              isBadge: false
            });
          }}
          onBackToHome={() => setAuthView('landing')}
        />
      );
    }

    // Default Landing Welcome View
    return (
      <AuthLanding
        onSelectView={(view) => setAuthView(view)}
      />
    );
  }

  // 3. Admin Guru View
  if (currentUser.role === 'admin_guru') {
    return (
      <AdminDashboard
        user={currentUser}
        onLogout={handleLogout}
      />
    );
  }

  // 4. Authenticated Student View (Full Learning Application)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white relative">
      {/* Strict Header with Title & Student Account chip */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progressPercent={overallProgressPercent}
        totalPoints={progress.totalPoints || 0}
        unlockedBadgesCount={(progress.unlockedBadges || []).length}
        onOpenBadges={() => setShowBadgesModal(true)}
        currentUser={currentUser}
        onOpenProfile={() => setShowProfileModal(true)}
        onLogout={handleLogout}
      />

      {/* Student Profile Modal */}
      <StudentProfileModal
        user={currentUser}
        progress={progress}
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onLogout={handleLogout}
        onOpenBadges={() => {
          setShowProfileModal(false);
          setShowBadgesModal(true);
        }}
      />

      {/* Celebration Notification Toast */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-slate-900 border border-amber-600/80 rounded-2xl p-4 shadow-2xl shadow-amber-950/40 flex items-start justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-600/60 flex items-center justify-center shrink-0 text-amber-400">
              {toastNotification.isBadge ? (
                <Trophy className="w-5 h-5 text-amber-400" />
              ) : (
                <Zap className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-white text-sm flex items-center gap-1.5">
                <span>{toastNotification.title}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <p className="text-slate-300">{toastNotification.description}</p>
              {toastNotification.points && (
                <div className="text-amber-400 font-mono font-bold pt-0.5">
                  +{toastNotification.points} XP Ditambahkan ke Akun
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setToastNotification(null)}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Badges Modal Showcase */}
      {showBadgesModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Pusat Prestasi: Poin &amp; Lencana Siswa</span>
              </div>
              <button
                onClick={() => setShowBadgesModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <BadgeShowcase progress={progress} />

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowBadgesModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            progress={progress}
            setActiveTab={setActiveTab}
            setSelectedModuleId={setSelectedModuleId}
            onOpenBadges={() => setShowBadgesModal(true)}
            currentUser={currentUser}
            onOpenProfile={() => setShowProfileModal(true)}
          />
        )}

        {activeTab === 'modules' && (
          <ModuleView
            currentModuleId={selectedModuleId}
            setCurrentModuleId={setSelectedModuleId}
            completedModules={progress.completedModules}
            toggleModuleComplete={toggleModuleComplete}
            reflections={progress.reflections}
            saveReflection={saveReflection}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'visualizer' && <AlgorithmVisualizer />}

        {activeTab === 'codelab' && (
          <CodeLab
            completedExercises={progress.completedExercises}
            markExerciseComplete={markExerciseComplete}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            onQuizCompleted={handleQuizCompleted}
            bestScore={progress.quizBestScore}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            progress={progress}
            onUpdateProgress={updateProgressAndCheckBadges}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Quiet, Clean Human Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 text-xs text-slate-500 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>Informatika SMA Kelas X &bull; Fase E &bull; Kurikulum Merdeka</span>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <button
              onClick={() => setShowBadgesModal(true)}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Lencana ({progress.unlockedBadges.length}/10)</span>
            </button>
            <button
              onClick={() => setActiveTab('modules')}
              className="hover:text-white transition-colors"
            >
              Modul
            </button>
            <button
              onClick={() => setActiveTab('codelab')}
              className="hover:text-white transition-colors"
            >
              Lab Koding
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className="hover:text-white transition-colors"
            >
              Evaluasi HOTS
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className="hover:text-white transition-colors"
            >
              Proyek Akhir
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
