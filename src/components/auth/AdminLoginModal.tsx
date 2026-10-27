import React, { useState } from 'react';
import { loginAdmin, UserProfile } from '../../utils/authService.ts';
import { ShieldCheck, Lock, Eye, EyeOff, LogIn, ArrowLeft, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  onSuccess: (user: UserProfile) => void;
  onBackToHome: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onBackToHome }) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nip.trim() || !password) {
      setErrorMessage('NIP dan password admin wajib diisi.');
      return;
    }

    setLoading(true);

    try {
      const result = await loginAdmin({
        nip: nip.trim(),
        password
      });

      onSuccess(result.user);
    } catch (err: any) {
      setErrorMessage('Login admin gagal. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 selection:bg-amber-600 selection:text-white">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors font-medium mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Halaman Utama</span>
        </button>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-400 text-xs font-mono font-semibold border border-amber-900/60">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>PORTAL KHUSUS GURU</span>
          </div>
          <h2 className="text-2xl font-black text-white">LOGIN ADMIN GURU</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Masuk untuk mengelola pembelajaran, materi, siswa, dan evaluasi Informatika.
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* NIP Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Username berupa NIP Guru</span>
            </label>
            <input
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="contoh : XXXXXXXXXXXXXXXXX"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Password Administrator</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password admin"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors font-mono"
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
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 active:scale-95 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span>Memverifikasi Hak Akses...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>MASUK</span>
              </>
            )}
          </button>
        </form>

        <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed text-center">
          Akses administrator dibatasi hanya untuk dewan guru pengampu Informatika SMA Fase E.
        </div>
      </div>
    </div>
  );
};
