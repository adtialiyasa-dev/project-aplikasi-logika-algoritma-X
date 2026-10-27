import React, { useState } from 'react';
import { registerStudent, UserProfile } from '../../utils/authService.ts';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, AlertCircle, School, Sparkles } from 'lucide-react';

interface StudentRegisterModalProps {
  onSuccess: (user: UserProfile) => void;
  onSwitchToLogin: () => void;
  onBackToHome: () => void;
}

export const StudentRegisterModal: React.FC<StudentRegisterModalProps> = ({
  onSuccess,
  onSwitchToLogin,
  onBackToHome
}) => {
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('X-1');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const availableClasses = [
    'X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6',
    'X-7', 'X-8', 'X-9', 'X-10', 'X-11', 'X-12'
  ];

  // Real-time password validations
  const isMinLength = password.length >= 8;
  const isMatch = password.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validasi Nama
    if (!fullName || fullName.trim().length < 2) {
      setErrorMessage('Nama Siswa wajib diisi dan minimal terdiri dari 2 karakter.');
      return;
    }

    // 2. Validasi Kelas
    if (!className) {
      setErrorMessage('Silakan pilih kelas Anda.');
      return;
    }

    // 3. Validasi Email
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Format alamat email tidak valid. Gunakan format seperti nama@contoh.com.');
      return;
    }

    // 4. Validasi Password
    if (!isMinLength) {
      setErrorMessage('Password minimal harus 8 karakter.');
      return;
    }

    // 5. Validasi Konfirmasi Password
    if (!isMatch) {
      setErrorMessage('Konfirmasi password tidak cocok dengan password yang dimasukkan.');
      return;
    }

    setLoading(true);

    try {
      const result = await registerStudent({
        fullName: fullName.trim(),
        className,
        email: cleanEmail,
        password
      });

      onSuccess(result.user);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal melakukan registrasi akun. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 py-12 selection:bg-blue-600 selection:text-white">
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
            <span>AKUN SISWA BARU</span>
          </div>
          <h2 className="text-2xl font-black text-white">Registrasi Siswa</h2>
          <p className="text-xs text-slate-400">
            Daftarkan diri Anda untuk mengakses materi pembelajaran, simulator koding, dan kuis Informatika Fase E.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Nama Siswa */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-blue-400" />
              <span>Nama Lengkap Siswa</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Muhammad Budi Santoso"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Pilihan Kelas */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kelas (Fase E)</span>
            </label>
            <select
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono transition-colors"
            >
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  Kelas {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Username / Email */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Alamat Email (Username Akun)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama.siswa@sekolah.sch.id"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Password (Minimal 8 Karakter)</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
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

            {/* Password Requirement Indicator */}
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <span className={isMinLength ? 'text-emerald-400 font-semibold' : 'text-slate-500'}>
                {isMinLength ? '✓' : '•'} Minimal 8 karakter
              </span>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Konfirmasi Password</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && (
              <div className="text-[11px] pt-0.5">
                {isMatch ? (
                  <span className="text-emerald-400 font-medium">✓ Konfirmasi password sesuai</span>
                ) : (
                  <span className="text-red-400">✗ Konfirmasi password tidak cocok</span>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Memproses Registrasi...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>DAFTAR SEKARANG</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          Sudah memiliki akun siswa?{' '}
          <button
            onClick={onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4 ml-1"
          >
            Login Siswa
          </button>
        </div>
      </div>
    </div>
  );
};
