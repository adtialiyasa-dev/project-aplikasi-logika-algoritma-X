import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, updateAdminProfile, changeAdminPassword } from '../../utils/authService.ts';
import { usePersistentState, safeSet, STORAGE_KEYS } from '../../utils/storage.ts';
import { 
  loadPersistentSettings, 
  savePersistentSettings 
} from '../../utils/databaseSync.ts';
import { saveUserToFirestore } from '../../utils/firestoreService.ts';
import { 
  User, 
  ShieldCheck, 
  Key, 
  Mail, 
  Building2, 
  BookOpen, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Lock, 
  Sparkles,
  Calendar,
  Sliders,
  Settings,
  Download,
  Upload,
  FileJson,
  FileSpreadsheet,
  X
} from 'lucide-react';

interface TeacherProfileEditorProps {
  user: UserProfile;
  onProfileUpdated: (updatedUser: UserProfile) => void;
  onOpenGoogleSheets?: () => void;
}

export const TeacherProfileEditor: React.FC<TeacherProfileEditorProps> = ({
  user,
  onProfileUpdated,
  onOpenGoogleSheets
}) => {
  // Identity Form State
  const [fullName, setFullName] = useState(user.fullName || '');
  const [nip, setNip] = useState(user.nip || '');
  const [email, setEmail] = useState(user.email || 'guru.informatika@sma.sch.id');
  const [schoolName, setSchoolName] = useState(user.schoolName || 'SMA Negeri 1 Pembelajaran Digital');
  const [subjectTitle] = useState('Informatika Fase E (Kelas X SMA)');

  // Identity Status Feedback
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // Evaluation Policies / Admin Preferences
  const [kkmScore, setKkmScore] = usePersistentState<number>('informatika_kkm_score_v1', 75);
  const [autoVerifyLab, setAutoVerifyLab] = usePersistentState<boolean>('informatika_auto_verify_lab_v1', true);
  const [policySavedMsg, setPolicySavedMsg] = useState('');

  // Hydrate persistent settings from database on mount so settings never revert
  useEffect(() => {
    async function initSettings() {
      try {
        const persisted = await loadPersistentSettings();
        if (persisted) {
          if (typeof persisted.kkmScore === 'number') setKkmScore(persisted.kkmScore);
          if (typeof persisted.autoVerifyLab === 'boolean') setAutoVerifyLab(persisted.autoVerifyLab);
          if (persisted.schoolName && (!user.schoolName || user.schoolName === 'SMA Negeri 1 Pembelajaran Digital')) {
            setSchoolName(persisted.schoolName);
          }
        }
      } catch (e) {
        console.warn('Failed to load initial persistent settings:', e);
      }
    }
    initSettings();
  }, []);

  // Backup & Restore JSON States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [feedbackToast, setFeedbackToast] = useState<{
    type: 'success' | 'error' | 'info';
    message: string;
  } | null>(null);

  // 1. Handle Submit Profile Identity
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (!fullName.trim() || fullName.trim().length < 2) {
      setProfileErrorMsg('Nama lengkap guru minimal 2 karakter.');
      return;
    }

    if (!nip.trim() || nip.trim().length < 5) {
      setProfileErrorMsg('NIP guru wajib diisi dengan format yang valid (minimal 5 karakter).');
      return;
    }

    setIsSavingProfile(true);
    try {
      const res = await updateAdminProfile({
        fullName: fullName.trim(),
        nip: nip.trim(),
        email: email.trim(),
        schoolName: schoolName.trim()
      });

      // Synchronize to Firestore & multi-tier persistent settings
      await savePersistentSettings({
        schoolName: schoolName.trim()
      });
      await saveUserToFirestore(res.user);

      setProfileSuccessMsg('Profil identitas guru & sekolah berhasil disimpan permanen ke database!');
      onProfileUpdated(res.user);
      setTimeout(() => setProfileSuccessMsg(''), 4000);
    } catch (err: any) {
      setProfileErrorMsg(err.message || 'Gagal memperbarui profil guru.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // 2. Handle Change Admin Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');

    if (!currentPassword) {
      setPasswordErrorMsg('Kata sandi saat ini wajib diisi.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordErrorMsg('Kata sandi baru minimal harus 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setPasswordSuccessMsg('Kata sandi administrator berhasil diperbarui dengan aman!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(''), 4000);
    } catch (err: any) {
      setPasswordErrorMsg(err.message || 'Gagal memperbarui kata sandi admin.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  // 3. Handle Save Evaluation Policies
  const handleSavePolicies = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await savePersistentSettings({
        kkmScore,
        autoVerifyLab,
        schoolName: schoolName.trim()
      });
      setPolicySavedMsg('Kebijakan KKM dan preferensi berhasil disimpan otomatis ke database Firestore & Server!');
      setTimeout(() => setPolicySavedMsg(''), 3000);
    } catch {
      setPolicySavedMsg('Pengaturan tersimpan lokal (sinkronisasi cloud dalam antrean).');
      setTimeout(() => setPolicySavedMsg(''), 3000);
    }
  };

  // 4. Handle Export Data (JSON)
  const handleExportJson = () => {
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const backupPayload = {
        app: 'Laboratorium Pembelajaran Informatika SMA Fase E',
        version: '1.0',
        exportDate: new Date().toISOString(),
        profile: {
          id: user.id,
          fullName: fullName.trim() || user.fullName,
          nip: nip.trim() || user.nip,
          email: email.trim() || user.email,
          schoolName: schoolName.trim() || user.schoolName,
          role: user.role
        },
        settings: {
          kkmScore,
          autoVerifyLab,
          subjectTitle: 'Informatika Fase E (Kelas X SMA)'
        }
      };

      const jsonStr = JSON.stringify(backupPayload, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const filename = `backup_profil_guru_${dateStr}.json`;

      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setFeedbackToast({
        type: 'success',
        message: `Berkas cadangan "${filename}" berhasil diekspor dan diunduh!`
      });
      setTimeout(() => setFeedbackToast(null), 4500);
    } catch (err: any) {
      setFeedbackToast({
        type: 'error',
        message: 'Gagal mengekspor data: ' + (err.message || 'Terjadi kesalahan')
      });
      setTimeout(() => setFeedbackToast(null), 4500);
    }
  };

  // 5. Handle Import Data (JSON)
  const handleImportButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      setFeedbackToast({
        type: 'error',
        message: 'Format berkas tidak valid. Harap pilih berkas berekstensi .json'
      });
      setTimeout(() => setFeedbackToast(null), 4500);
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || !text.trim()) {
          throw new Error('Berkas JSON kosong.');
        }

        let parsed: any;
        try {
          parsed = JSON.parse(text);
        } catch {
          throw new Error('Format berkas tidak valid. Pastikan memilih berkas JSON yang benar.');
        }

        // Validate structure (support nested "profile" or flat fields)
        const importedProfile = parsed.profile || parsed;
        const importedSettings = parsed.settings || {};

        const newFullName = importedProfile.fullName || importedProfile.name;
        const newNip = importedProfile.nip;

        if (!newFullName || typeof newFullName !== 'string' || newFullName.trim().length < 2) {
          throw new Error('Validasi gagal: Berkas JSON harus memiliki Nama Lengkap Guru (minimal 2 karakter).');
        }

        if (!newNip || typeof newNip !== 'string' || newNip.trim().length < 5) {
          throw new Error('Validasi gagal: Berkas JSON harus memiliki NIP Guru yang valid (minimal 5 karakter).');
        }

        const newEmail = importedProfile.email || email;
        const newSchoolName = importedProfile.schoolName || schoolName;
        const newKkm = typeof importedSettings.kkmScore === 'number' ? importedSettings.kkmScore : kkmScore;
        const newAutoVerify = typeof importedSettings.autoVerifyLab === 'boolean' ? importedSettings.autoVerifyLab : autoVerifyLab;

        // 1. Update form states
        setFullName(newFullName.trim());
        setNip(newNip.trim());
        setEmail(newEmail.trim());
        setSchoolName(newSchoolName.trim());
        setKkmScore(newKkm);
        setAutoVerifyLab(newAutoVerify);

        // 2. Persist to multi-tier database (LocalStorage, Express, Firestore)
        await savePersistentSettings({
          kkmScore: newKkm,
          autoVerifyLab: newAutoVerify,
          schoolName: newSchoolName.trim()
        });

        // 3. Update backend database & Firestore
        try {
          const res = await updateAdminProfile({
            fullName: newFullName.trim(),
            nip: newNip.trim(),
            email: newEmail.trim(),
            schoolName: newSchoolName.trim()
          });

          await saveUserToFirestore(res.user);
          onProfileUpdated(res.user);
        } catch (serverErr: any) {
          console.warn('Backend sync warning, applying local fallback:', serverErr);
          const fallbackUser: UserProfile = {
            ...user,
            fullName: newFullName.trim(),
            nip: newNip.trim(),
            email: newEmail.trim(),
            schoolName: newSchoolName.trim()
          };
          onProfileUpdated(fallbackUser);
          safeSet('informatika_admin_profile_v1', fallbackUser);
          safeSet(STORAGE_KEYS.CACHED_USER, fallbackUser);
          saveUserToFirestore(fallbackUser).catch(() => {});
        }

        setFeedbackToast({
          type: 'success',
          message: `Data profil guru (${newFullName.trim()} - NIP: ${newNip.trim()}) berhasil dipulihkan dari berkas JSON!`
        });
        setTimeout(() => setFeedbackToast(null), 5000);
      } catch (err: any) {
        setFeedbackToast({
          type: 'error',
          message: err.message || 'Gagal memproses dan memvalidasi berkas JSON.'
        });
        setTimeout(() => setFeedbackToast(null), 5000);
      }
    };

    reader.onerror = () => {
      setFeedbackToast({
        type: 'error',
        message: 'Gagal membaca berkas dari sistem komputer.'
      });
      setTimeout(() => setFeedbackToast(null), 4500);
    };

    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-indigo-950/50 border border-amber-800/40 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-xl font-mono shrink-0 shadow-lg shadow-amber-600/10">
            <User className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/60 text-amber-300 text-[10px] font-mono font-bold uppercase tracking-wider">
                Administrator Utama
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sesi Terverifikasi
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {user.fullName}
            </h2>
            <div className="text-xs text-slate-300 font-mono">
              NIP: <span className="text-amber-400 font-bold">{user.nip}</span> &bull; {schoolName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Hidden File Input for JSON import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFileChange}
            accept=".json,application/json"
            className="hidden"
          />

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-600 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all border border-emerald-500/30"
            title="Unduh berkas JSON cadangan profil guru dan pengaturan"
          >
            <Download className="w-4 h-4 text-emerald-100" />
            <span>Export Data (JSON)</span>
          </button>

          <button
            type="button"
            onClick={handleImportButtonClick}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 active:scale-95 text-slate-200 hover:text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all border border-slate-700 hover:border-slate-600"
            title="Unggah berkas JSON untuk memulihkan profil guru dan pengaturan"
          >
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Import Data (JSON)</span>
          </button>

          {onOpenGoogleSheets && (
            <button
              type="button"
              onClick={onOpenGoogleSheets}
              className="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-teal-600/20 transition-all border border-teal-500/30 cursor-pointer"
              title="Integrasi & Sinkronisasi Google Sheets"
            >
              <FileSpreadsheet className="w-4 h-4 text-teal-100" />
              <span>Google Sheets</span>
            </button>
          )}

          <div className="p-2.5 px-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs hidden sm:block">
            <div className="text-slate-400 font-mono text-[10px]">ROLE SISTEM</div>
            <div className="text-emerald-400 font-mono font-bold">admin_guru (Fase E)</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ==================== CARD 1: EDIT IDENTITAS GURU ==================== */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2.5">
              <User className="w-5 h-5 text-amber-400" />
              <span>Edit Profil Identitas Guru Pengampu</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Perbarui identitas resmi pendidik yang ditampilkan pada rapor, laporan rekap tugas, dan header laboratorium.
            </p>
          </div>

          {profileSuccessMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2.5 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          {profileErrorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 text-xs text-red-300 flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{profileErrorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>Nama Lengkap Guru (Beserta Gelar Akademik)</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Bpk. Rahmat Hidayat, S.Kom., Gr."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium transition-colors"
              />
              <span className="text-[11px] text-slate-500">
                Nama ini akan dicantumkan pada seluruh dokumen panduan guru dan evaluasi capaian siswa.
              </span>
            </div>

            {/* NIP */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Nomor Induk Pegawai (NIP Guru)</span>
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={nip}
                onChange={(e) => setNip(e.target.value)}
                placeholder="Contoh: 199206192023211009"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
              <span className="text-[11px] text-slate-500">
                NIP juga berfungsi sebagai username resmi untuk login ke Portal Administrator Guru.
              </span>
            </div>

            {/* Email Kontak */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>Email Kedinasan / Kontak Guru</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Contoh: guru.informatika@sma.sch.id"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
            </div>

            {/* Nama Sekolah & Mata Pelajaran */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Satuan Pendidikan (Sekolah)</span>
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Nama SMA / Sekolah"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Mata Pelajaran &amp; Jenjang</span>
                </label>
                <input
                  type="text"
                  value={subjectTitle}
                  disabled
                  className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-400 cursor-not-allowed font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 active:scale-95 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-600/20 flex items-center gap-2"
              >
                {isSavingProfile ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Perubahan Identitas Guru</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ==================== CARD 2: FITUR AKUN ADMIN & KEAMANAN ==================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* Ubah Password Admin */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>Ubah Kata Sandi Admin Guru</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Perbarui kata sandi untuk melindungi akses penilaian dan data peserta didik.
              </p>
            </div>

            {passwordSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{passwordSuccessMsg}</span>
              </div>
            )}

            {passwordErrorMsg && (
              <div className="p-3 rounded-xl bg-red-950/70 border border-red-800/80 text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{passwordErrorMsg}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3.5 text-xs">
              {/* Password Saat Ini */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan kata sandi lama"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Password Baru */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Kata Sandi Baru (Min. 8 Karakter)</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 8 karakter kuat"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password Baru */}
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang kata sandi baru"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 pr-10 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold rounded-xl text-xs transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{isChangingPassword ? 'Memperbarui...' : 'Perbarui Kata Sandi Admin'}</span>
              </button>
            </form>
          </div>

          {/* Kebijakan KKM & Pengaturan Pembelajaran */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" />
                <span>Kebijakan KKM &amp; Evaluasi Tugas</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi batas ketuntasan minimal untuk diagram analitis dan status kelulusan.
              </p>
            </div>

            {policySavedMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-xs text-emerald-300">
                {policySavedMsg}
              </div>
            )}

            <form onSubmit={handleSavePolicies} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-300 font-semibold flex justify-between">
                  <span>Standar KKM Nilai Kuis HOTS:</span>
                  <span className="font-mono text-amber-400 font-bold">{kkmScore} / 100</span>
                </label>
                <input
                  type="range"
                  min="60"
                  max="90"
                  step="5"
                  value={kkmScore}
                  onChange={(e) => setKkmScore(parseInt(e.target.value, 10))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>60 (Minimal)</span>
                  <span>75 (Standar SMA)</span>
                  <span>90 (Tinggi)</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Verifikasi Otomatis Lab C++</div>
                  <div className="text-[11px] text-slate-500">Lolos uji kasus langsung menambah poin XP</div>
                </div>
                <input
                  type="checkbox"
                  checked={autoVerifyLab}
                  onChange={(e) => setAutoVerifyLab(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors mt-2"
              >
                Simpan Preferensi Kebijakan
              </button>
            </form>
          </div>

          {/* ==================== CARD 4: CADANGAN & PEMULIHAN DATA MANUAL (JSON) ==================== */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-amber-400" />
                  <span>Cadangan Data Manual (JSON Backup)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simpan cadangan mandiri seluruh identitas guru, kontak, dan kebijakan penilaian.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Format Berkas:</span>
                <span className="text-amber-400 font-bold">Standardized JSON (.json)</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Data yang disertakan: Nama lengkap, NIP resmi, email kedinasan, asal sekolah, standar KKM kuis, dan opsi verifikasi lab C++.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={handleExportJson}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all border border-emerald-500/30"
              >
                <Download className="w-4 h-4" />
                <span>Export Data (JSON)</span>
              </button>

              <button
                type="button"
                onClick={handleImportButtonClick}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all border border-blue-500/30"
              >
                <Upload className="w-4 h-4" />
                <span>Import Data (JSON)</span>
              </button>
            </div>
          </div>

          {/* ==================== CARD 5: INTEGRASI GOOGLE SHEETS & DRIVE ==================== */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Integrasi Google Sheets &amp; Drive (Workspace)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sinkronkan rekapitulasi nilai dan capaian pembelajaran seluruh siswa langsung ke Google Spreadsheet di cloud.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs text-slate-300 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Layanan Cloud:</span>
                <span className="text-emerald-400 font-bold">Google Sheets &amp; Google Drive API</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                Memungkinkan ekspor live nilai siswa, pembuatan spreadsheet otomatis di Google Drive, serta sinkronisasi nilai berkala antar rombel kelas.
              </p>
            </div>

            {onOpenGoogleSheets && (
              <button
                type="button"
                onClick={onOpenGoogleSheets}
                className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 transition-all border border-teal-500/30 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-teal-100" />
                <span>Buka Panel Google Sheets &amp; Drive</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Floating Toast Feedback Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              feedbackToast.type === 'success' 
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-400' 
                : 'bg-red-950 border border-red-700 text-red-400'
            }`}>
              {feedbackToast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-white text-sm">
                {feedbackToast.type === 'success' ? 'Operasi Cadangan Berhasil' : 'Peringatan / Terjadi Kesalahan'}
              </div>
              <p className="text-slate-300 leading-relaxed">{feedbackToast.message}</p>
            </div>
          </div>

          <button
            onClick={() => setFeedbackToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
