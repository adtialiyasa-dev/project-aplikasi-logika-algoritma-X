import React, { useState } from 'react';
import { loginStudent, UserProfile } from '../../utils/authService.ts';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle, Sparkles, HelpCircle } from 'lucide-react';

interface StudentLoginModalProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchToRegister: () => void;
  onBackToHome: () => void;
}

export const StudentLoginModal: React.FC<StudentLoginModalProps> = ({
  onSuccess,
  onSwitchToRegister,
  onBackToHome
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setShowForgotNotice(false);

    if (!email.trim() || !password) {
      setErrorMessage('Silakan lengkapi kolom email dan password.');
      return;
    }

    setLoading(true);

    try {
      const result = await loginStudent({
        email: email.trim().toLowerCase(),
        password
      });

      onSuccess(result.user);
    } catch (err: any) {
      setErrorMessage('Email atau password tidak sesuai. Silakan periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-blue-600 selection:text-white">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Utama</span>
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-400 text-xs font-mono font-semibold border border-blue-900/50">
            <Sparkles className="w-3 h-3" />
            <span>PORTAL SISWA</span>
          </div>
          <h2 className="text-2xl font-black text-white">Login Siswa</h2>
          <p className="text-xs text-slate-400">
            Masuk dengan akun terdaftar untuk melanjutkan progres belajar, simulator koding, dan kuis.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        {showForgotNotice && (
          <div className="p-3.5 rounded-xl bg-blue-950/60 border border-blue-800/80 text-xs text-blue-200 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              Untuk pemulihan kata sandi siswa, silakan hubungi Guru Pengampu Informatika atau Admin Sekolah untuk melakukan reset password akun Anda.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Username atau Email</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Contoh: nama@sekolah.sch.id"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Password</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotNotice(true)}
                className="text-[11px] text-blue-400 hover:text-blue-300"
              >
                Lupa Password?
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Memverifikasi Akun...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>MASUK SEBAGAI SISWA</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Belum memiliki akun siswa?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-4 ml-1"
          >
            Registrasi Siswa Baru
          </button>
        </div>
      </div>
    </div>
  );
};
