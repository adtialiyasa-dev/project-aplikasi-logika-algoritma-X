import React, { useState } from 'react';
import { UserProfile, changeStudentPassword } from '../utils/authService.ts';
import { UserProgress } from '../types.ts';
import { getUserLevel } from '../utils/gamification.ts';
import { 
  User, 
  GraduationCap, 
  Mail, 
  Calendar, 
  Award, 
  Trophy, 
  Zap, 
  BookOpen, 
  Code2, 
  CheckCircle2, 
  LogOut, 
  X,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  Check,
  AlertCircle
} from 'lucide-react';

interface StudentProfileModalProps {
  user: UserProfile;
  progress: UserProgress;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onOpenBadges: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  user,
  progress,
  isOpen,
  onClose,
  onLogout,
  onOpenBadges
}) => {
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  if (!isOpen) return null;

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 8) {
      setPassError('Password baru minimal harus 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi password baru tidak cocok.');
      return;
    }

    setPassLoading(true);
    try {
      await changeStudentPassword(oldPassword, newPassword);
      setPassSuccess('Password akun Anda berhasil diperbarui permanen! Gunakan password ini untuk login berikutnya.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setPassSuccess('');
        setShowPasswordSection(false);
      }, 3500);
    } catch (err: any) {
      setPassError(err.message || 'Gagal mengubah password akun.');
    } finally {
      setPassLoading(false);
    }
  };
  if (!isOpen) return null;

  const levelInfo = getUserLevel(progress.totalPoints || 0);
  const formattedDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : 'Semester Ganjil 2026/2027';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Profil Pembelajar Siswa</h2>
              <p className="text-xs text-slate-400">Informatika Kelas X SMA &bull; Fase E</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xl font-bold text-white">{user.fullName}</div>
              <div className="flex items-center gap-2 mt-1 text-xs text-blue-400 font-medium">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-900/40 border border-blue-700/50">
                  Kelas {user.className || 'X-1'}
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sesi Aktif
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-mono uppercase text-slate-400">Peringkat Level</span>
              <div className="text-sm font-bold text-amber-400 flex items-center gap-1 sm:justify-end">
                <Trophy className="w-4 h-4" />
                <span>Level {levelInfo.level}: {levelInfo.title}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-500" />
              <span className="font-mono text-slate-200">{user.email || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Terdaftar: {formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Progress Grid */}
        <div className="space-y-3">
          <div className="text-xs font-mono font-semibold uppercase text-slate-400 tracking-wider">
            Statistik Pembelajaran Anda
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
              <Zap className="w-4 h-4 text-amber-400 mx-auto" />
              <div className="text-xs text-slate-400">Total XP</div>
              <div className="text-lg font-bold font-mono text-amber-400">{progress.totalPoints || 0}</div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
              <Trophy className="w-4 h-4 text-amber-400 mx-auto" />
              <div className="text-xs text-slate-400">Lencana</div>
              <div className="text-lg font-bold font-mono text-white">
                {(progress.unlockedBadges || []).length} <span className="text-xs text-slate-500">/ 10</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
              <BookOpen className="w-4 h-4 text-blue-400 mx-auto" />
              <div className="text-xs text-slate-400">Modul</div>
              <div className="text-lg font-bold font-mono text-blue-400">
                {progress.completedModules.length} <span className="text-xs text-slate-500">/ 9</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center space-y-1">
              <Code2 className="w-4 h-4 text-emerald-400 mx-auto" />
              <div className="text-xs text-slate-400">Lab C++</div>
              <div className="text-lg font-bold font-mono text-emerald-400">
                {progress.completedExercises.length} <span className="text-xs text-slate-500">/ 10</span>
              </div>
            </div>
          </div>
        </div>

        {/* Keamanan & Ubah Password Siswa */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <KeyRound className="w-4 h-4 text-blue-400" />
              <span>Pengaturan Kata Sandi Siswa</span>
            </div>
            <button
              type="button"
              onClick={() => setShowPasswordSection(!showPasswordSection)}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium underline underline-offset-2 transition-colors"
            >
              {showPasswordSection ? 'Sembunyikan Form' : 'Ubah Kata Sandi'}
            </button>
          </div>

          {showPasswordSection && (
            <form onSubmit={handleUpdatePassword} className="space-y-3 pt-2 border-t border-slate-800/80 animate-in fade-in duration-200">
              {passError && (
                <div className="p-2.5 rounded-lg bg-red-950/50 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{passError}</span>
                </div>
              )}
              {passSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{passSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Kata Sandi Saat Ini</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Masukkan password lama"
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Kata Sandi Baru</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 karakter"
                      required
                      minLength={8}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors pr-8"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-2 top-2 text-slate-500 hover:text-slate-300"
                    >
                      {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi password baru"
                    required
                    minLength={8}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  {passLoading ? 'Menyimpan...' : 'Simpan Password Baru'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Keluar Akun (Logout)</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                onOpenBadges();
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Award className="w-4 h-4" />
              <span>Lihat Lencana Prestasi</span>
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
