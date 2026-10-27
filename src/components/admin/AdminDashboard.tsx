import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  AdminOverviewData, 
  StudentListItem, 
  fetchAdminOverview, 
  fetchAdminStudents, 
  deleteStudentByAdmin, 
  changeAdminPassword,
  updateStudentCredentialsByAdmin,
  downloadStudentReportCsv,
  resetStudentProgressByAdmin
} from '../../utils/authService.ts';
import { MODULES_DATA } from '../../data/modulesData.ts';
import { QUIZ_QUESTIONS } from '../../data/quizQuestions.ts';
import { CAPSTONE_PROJECTS } from '../../data/projectsData.ts';
import { TaskCompletionRecap } from './TaskCompletionRecap.tsx';
import { TeacherProfileEditor } from './TeacherProfileEditor.tsx';
import { TeacherGuideView } from '../TeacherGuideView.tsx';
import { generateStudentsReportPdf } from '../../utils/reportPdfGenerator.ts';
import { GoogleSheetsIntegrationModal } from './GoogleSheetsIntegrationModal.tsx';
import { 
  Users, 
  School, 
  BookOpen, 
  Award, 
  Activity, 
  FileCheck2, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  AlertTriangle, 
  Lock, 
  Key, 
  CheckCircle2, 
  LogOut, 
  ShieldCheck, 
  ChevronLeft, 
  ChevronRight,
  Settings,
  HelpCircle,
  Clock,
  Sparkles,
  BarChart3,
  Layers,
  FileSpreadsheet,
  FileText,
  Loader2,
  PieChart as PieIcon,
  UserCheck,
  Eye,
  EyeOff,
  Copy,
  Check,
  Pencil,
  GraduationCap,
  RotateCcw
} from 'lucide-react';

import { STORAGE_KEYS, usePersistentState, safeSet, safeGet } from '../../utils/storage.ts';
import { saveUserToFirestore } from '../../utils/firestoreService.ts';

interface AdminDashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  // Local admin profile state so edits update everywhere in real-time and persist
  const [adminUser, setAdminUser] = usePersistentState<UserProfile>('informatika_admin_profile_v1', user);

  const [activeTab, setActiveTab] = usePersistentState<
    | 'dashboard'
    | 'progress'
    | 'students'
    | 'teacher_guide'
    | 'profile'
    | 'classes'
    | 'modules'
    | 'quiz_bank'
    | 'evaluations'
    | 'scores'
    | 'projects'
    | 'settings'
  >('informatika_admin_tab_v1', 'dashboard');

  const [overview, setOverview] = useState<AdminOverviewData | null>(() =>
    safeGet<AdminOverviewData | null>(STORAGE_KEYS.ADMIN_OVERVIEW_CACHE, null)
  );
  const [students, setStudents] = useState<StudentListItem[]>(() =>
    safeGet<StudentListItem[]>(STORAGE_KEYS.ADMIN_STUDENTS_CACHE, [])
  );
  const [allStudents, setAllStudents] = useState<StudentListItem[]>(() =>
    safeGet<StudentListItem[]>(STORAGE_KEYS.ADMIN_STUDENTS_CACHE, [])
  );
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = usePersistentState<string>('informatika_admin_search_v1', '');
  const [selectedClass, setSelectedClass] = usePersistentState<string>('informatika_admin_class_filter_v1', 'all');
  const [loading, setLoading] = useState(false);
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState(false);

  // Change Password Modal
  const [showPasswordModal, setShowPasswordModal] = useState(adminUser.isDefaultPassword || false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordStatusMsg, setPasswordStatusMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Delete Confirmation
  const [studentToDelete, setStudentToDelete] = useState<StudentListItem | null>(null);

  // Reset Student Progress Confirmation
  const [studentToReset, setStudentToReset] = useState<StudentListItem | null>(null);
  const [isResettingStudent, setIsResettingStudent] = useState(false);
  const [adminToast, setAdminToast] = useState<{ title: string; message: string; type: 'success' | 'error' } | null>(null);

  // Student Credentials View Modal (Bantuan Siswa Lupa Login)
  const [studentForCredentials, setStudentForCredentials] = useState<StudentListItem | null>(null);
  const [showPlainPassword, setShowPlainPassword] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Edit Student Account Modal
  const [studentToEdit, setStudentToEdit] = useState<StudentListItem | null>(null);
  const [editFullName, setEditFullName] = useState('');
  const [editClassName, setEditClassName] = useState('X-1');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [editStatusMsg, setEditStatusMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const availableClasses = [
    'all', 'X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6',
    'X-7', 'X-8', 'X-9', 'X-10', 'X-11', 'X-12'
  ];

  const loadOverview = async () => {
    try {
      const data = await fetchAdminOverview();
      if (data) {
        setOverview(data);
        safeSet(STORAGE_KEYS.ADMIN_OVERVIEW_CACHE, data);
      }
    } catch (err) {
      console.warn('Notice loading admin overview:', err);
    }
  };

  const loadStudents = async () => {
    setLoading(true);
    try {
      const result = await fetchAdminStudents({
        search: searchQuery,
        className: selectedClass,
        page: currentPage,
        limit: 8
      });
      if (result && Array.isArray(result.data)) {
        setStudents(result.data);
        setTotalStudents(result.pagination?.total ?? result.data.length);
        setTotalPages(result.pagination?.totalPages ?? 1);
        safeSet(STORAGE_KEYS.ADMIN_STUDENTS_CACHE, result.data);
      }
    } catch (err) {
      console.warn('Notice loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load all students for the realtime charts
  const loadAllStudents = async () => {
    try {
      const result = await fetchAdminStudents({ limit: 200 });
      if (result && Array.isArray(result.data)) {
        setAllStudents(result.data);
        if (result.data.length > 0) {
          safeSet(STORAGE_KEYS.ADMIN_STUDENTS_CACHE, result.data);
        }
      }
    } catch (err) {
      console.warn('Notice loading all students:', err);
    }
  };

  useEffect(() => {
    loadOverview();
    loadAllStudents();
  }, []);

  useEffect(() => {
    loadStudents();
  }, [searchQuery, selectedClass, currentPage]);

  const handleDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudentByAdmin(studentToDelete.id);
      setStudentToDelete(null);
      await loadStudents();
      await loadAllStudents();
      await loadOverview();
    } catch (err: any) {
      alert(err.message || 'Gagal menghapus akun siswa.');
    }
  };

  const handleResetStudentProgress = async () => {
    if (!studentToReset) return;
    setIsResettingStudent(true);
    try {
      const res = await resetStudentProgressByAdmin(studentToReset.id);
      setAdminToast({
        title: 'Reset Pengerjaan Siswa Berhasil',
        message: res.message || `Status pengerjaan ${studentToReset.fullName} (${studentToReset.className}) berhasil di-reset ke kondisi awal (0).`,
        type: 'success'
      });
      setStudentToReset(null);
      await loadStudents();
      await loadAllStudents();
      await loadOverview();
      setTimeout(() => setAdminToast(null), 5000);
    } catch (err: any) {
      setAdminToast({
        title: 'Gagal Me-reset Pengerjaan',
        message: err.message || 'Terjadi kesalahan saat me-reset progress siswa.',
        type: 'error'
      });
      setTimeout(() => setAdminToast(null), 5000);
    } finally {
      setIsResettingStudent(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatusMsg(null);
    try {
      await changeAdminPassword(currentPassword, newPassword);
      setPasswordStatusMsg({ text: 'Password admin berhasil diperbarui!', error: false });
      setAdminUser((prev) => ({ ...prev, isDefaultPassword: false }));
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordStatusMsg(null);
        setCurrentPassword('');
        setNewPassword('');
      }, 1500);
    } catch (err: any) {
      setPasswordStatusMsg({ text: err.message || 'Gagal mengubah password.', error: true });
    }
  };

  const handleExportCsv = async () => {
    try {
      setExportingCsv(true);
      await downloadStudentReportCsv(selectedClass);
    } catch (err: any) {
      console.error('Export CSV error:', err);
      alert(err.message || 'Gagal mengunduh laporan CSV.');
    } finally {
      setExportingCsv(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setExportingPdf(true);
      
      // Ensure we have the full dataset for export
      let studentDataset = allStudents;
      if (!studentDataset || studentDataset.length === 0) {
        const fullResult = await fetchAdminStudents({ limit: 500 });
        studentDataset = fullResult.data;
        setAllStudents(studentDataset);
      }

      // Filter by selectedClass if chosen
      let targetStudents = studentDataset;
      if (selectedClass && selectedClass !== 'all') {
        targetStudents = studentDataset.filter((s) => s.className === selectedClass);
      }

      if (targetStudents.length === 0 && students.length > 0) {
        targetStudents = students;
      }

      generateStudentsReportPdf({
        teacher: {
          fullName: adminUser.fullName,
          nip: adminUser.nip
        },
        students: targetStudents,
        selectedClass,
        overview
      });
    } catch (err: any) {
      console.error('Export PDF error:', err);
      alert('Gagal menghasilkan dokumen PDF: ' + (err.message || 'Terjadi kesalahan sistem'));
    } finally {
      setExportingPdf(false);
    }
  };

  // Keep adminUser synchronized if server/database returns updated fields
  useEffect(() => {
    if (user && (user.fullName !== adminUser.fullName || (user.schoolName && user.schoolName !== adminUser.schoolName) || user.nip !== adminUser.nip)) {
      setAdminUser((prev) => ({
        ...prev,
        ...user
      }));
    }
  }, [user]);

  const handleProfileUpdated = (updatedUser: UserProfile) => {
    setAdminUser(updatedUser);
    safeSet('informatika_admin_profile_v1', updatedUser);
    saveUserToFirestore(updatedUser).catch((e) => console.warn('Firestore user save notice:', e));
  };

  const openCredentialsModal = (std: StudentListItem) => {
    setStudentForCredentials(std);
    setShowPlainPassword(false);
    setCopiedField(null);
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch {
      // Fallback
    }
  };

  const openEditModal = (std: StudentListItem) => {
    setStudentToEdit(std);
    setEditFullName(std.fullName);
    setEditClassName(std.className || 'X-1');
    setEditEmail(std.email);
    setEditPassword('');
    setShowEditPassword(false);
    setEditStatusMsg(null);
  };

  const handleSaveStudentEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentToEdit) return;
    setEditSubmitting(true);
    setEditStatusMsg(null);

    try {
      const payload: { fullName: string; className: string; email: string; password?: string } = {
        fullName: editFullName.trim(),
        className: editClassName,
        email: editEmail.trim()
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await updateStudentCredentialsByAdmin(studentToEdit.id, payload);
      setEditStatusMsg({ text: res.message || 'Akun siswa berhasil diperbarui!', error: false });
      
      // Refresh student list and charts
      await loadStudents();
      await loadAllStudents();
      await loadOverview();

      // If credentials modal is open for this student, update it
      if (studentForCredentials && studentForCredentials.id === studentToEdit.id) {
        setStudentForCredentials({
          ...studentForCredentials,
          fullName: payload.fullName,
          className: payload.className,
          email: payload.email,
          plainPassword: payload.password || studentForCredentials.plainPassword
        });
      }

      setTimeout(() => {
        setStudentToEdit(null);
        setEditStatusMsg(null);
      }, 1200);
    } catch (err: any) {
      setEditStatusMsg({ text: err.message || 'Gagal memperbarui akun siswa.', error: true });
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-600 selection:text-white pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-600/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm sm:text-base text-white">
                  PANEL ADMINISTRATOR GURU
                </span>
                <div className="text-[11px] text-slate-400 font-mono">
                  Informatika Kelas X Fase E &bull; Kurikulum Merdeka
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => setActiveTab('profile')}
                className="hidden md:flex flex-col text-right hover:text-amber-400 transition-colors"
                title="Menu Setting"
              >
                <span className="font-bold text-slate-200">{adminUser.fullName}</span>
                <span className="text-[11px] text-amber-400 font-mono">NIP: {adminUser.nip}</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Menu Setting"
              >
                <Settings className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white"
                title="Ganti Password Admin"
              >
                <Key className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={onLogout}
                className="px-3.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/80 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Admin Sub Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none border-t border-slate-800 text-xs font-medium">
            {[
              { id: 'dashboard', label: 'Dashboard Utama' },
              { id: 'progress', label: 'Rekap Tugas (Diagram Batang & Lingkaran)' },
              { id: 'students', label: 'Data & Manajemen Siswa' },
              { id: 'teacher_guide', label: 'Panduan Guru & Perangkat Ajar' },
              { id: 'profile', label: 'Menu Setting' },
              { id: 'classes', label: 'Data Rombel Kelas' },
              { id: 'modules', label: 'Manajemen 9 Modul' },
              { id: 'quiz_bank', label: 'Bank 50 Soal HOTS' },
              { id: 'projects', label: 'Proyek Capstone' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-amber-600 text-slate-950 font-bold shadow-md shadow-amber-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 flex-1">
        {/* Security Warning if using default password */}
        {adminUser.isDefaultPassword && (
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/70 text-xs text-amber-200 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-300 text-sm">Pemberitahuan Keamanan Penting:</span>
                <p className="leading-relaxed">
                  Akun administrator Anda masih menggunakan kata sandi awal default (<strong>admin</strong>). Demi keamanan data nilai dan akun siswa, silakan ubah kata sandi dengan kombinasi yang kuat.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowPasswordModal(true)}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg shrink-0 whitespace-nowrap"
            >
              Ubah Password Sekarang
            </button>
          </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 font-bold text-white text-base">
                  <Key className="w-4 h-4 text-amber-400" />
                  <span>Ubah Password Administrator</span>
                </div>
                {!adminUser.isDefaultPassword && (
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Batal
                  </button>
                )}
              </div>

              {passwordStatusMsg && (
                <div
                  className={`p-3 rounded-xl border text-xs ${
                    passwordStatusMsg.error
                      ? 'bg-red-950/60 border-red-800/80 text-red-200'
                      : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
                  }`}
                >
                  {passwordStatusMsg.text}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Password Saat Ini</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Masukkan password saat ini"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Password Baru (Minimal 8 Karakter)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Kombinasi huruf, angka, dan simbol"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  {!adminUser.isDefaultPassword && (
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(false)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                    >
                      Tutup
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    Simpan Password Baru
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Reset Student Progress Confirmation Modal */}
        {studentToReset && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-slate-900 border border-orange-800/80 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-orange-400 font-bold text-base">
                <RotateCcw className="w-5 h-5 shrink-0" />
                <span>Konfirmasi Reset Pengerjaan Siswa</span>
              </div>

              <div className="p-3 bg-orange-950/50 border border-orange-800/60 rounded-xl text-xs text-orange-200 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-orange-300">
                  <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                  <span>Fitur Khusus Penalti &amp; Pemulihan Teknis:</span>
                </span>
                <p className="leading-relaxed">
                  Digunakan jika siswa mengalami kendala teknis atau mendapat sanksi pelanggaran (misalnya menyontek/plagiarisme).
                </p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin me-reset seluruh status pengerjaan modul, jawaban latihan koding, nilai evaluasi kuis HOTS, dan proyek capstone milik <strong>{studentToReset.fullName}</strong> ({studentToReset.className}) kembali ke nilai awal (0)?
              </p>

              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                &bull; Akun login dan password siswa <strong>TIDAK akan dihapus</strong>.<br />
                &bull; Siswa dapat langsung masuk kembali dan mengulang pengerjaan dari awal.
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  disabled={isResettingStudent}
                  onClick={() => setStudentToReset(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isResettingStudent}
                  onClick={handleResetStudentProgress}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md shadow-orange-600/30 cursor-pointer"
                >
                  {isResettingStudent ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                  <span>{isResettingStudent ? 'Me-reset Pengerjaan...' : 'Ya, Reset Pengerjaan Sekarang'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {studentToDelete && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-red-900/60 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
              <div className="flex items-center gap-3 text-red-400 font-bold text-base">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span>Konfirmasi Penghapusan Akun Siswa</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus akun siswa <strong>{studentToDelete.fullName}</strong> ({studentToDelete.className} - {studentToDelete.email})? Seluruh riwayat progres belajar dan nilai kuis siswa ini akan dihapus secara permanen.
              </p>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  onClick={() => setStudentToDelete(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteStudent}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Permanen</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal 1: Lihat Kredensial Siswa (Bantuan Siswa Lupa Login) */}
        {studentForCredentials && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shadow-md shadow-amber-500/10">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Akun &amp; Kredensial Siswa</h3>
                    <p className="text-xs text-slate-400">Bantuan login saat siswa lupa username atau password</p>
                  </div>
                </div>
                <button
                  onClick={() => setStudentForCredentials(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <span className="text-xl leading-none">&times;</span>
                </button>
              </div>

              {/* Student Badge Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400 font-medium">Nama Lengkap Siswa</div>
                  <div className="text-base font-bold text-white">{studentForCredentials.fullName}</div>
                  <div className="text-xs text-blue-400 font-mono mt-0.5">Rombel: Kelas {studentForCredentials.className}</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 font-mono text-xs font-semibold">
                  Akun Terdaftar
                </span>
              </div>

              {/* Username / Email Section */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Username / Alamat Email Siswa</span>
                  {copiedField === 'email' && (
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Email disalin!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={studentForCredentials.email}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-mono select-all focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(studentForCredentials.email, 'email')}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0"
                    title="Salin Email Siswa"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </button>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Password / Kata Sandi Siswa</span>
                  {copiedField === 'password' && (
                    <span className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                      <Check className="w-3 h-3" /> Password disalin!
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type={showPlainPassword ? 'text' : 'password'}
                      readOnly
                      value={studentForCredentials.plainPassword || 'Siswa123!'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono select-all focus:outline-none pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPlainPassword(!showPlainPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showPlainPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                    >
                      {showPlainPassword ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(studentForCredentials.plainPassword || 'Siswa123!', 'password')}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700 shrink-0"
                    title="Salin Password Siswa"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Gunakan tombol mata di atas untuk melihat kata sandi siswa secara langsung, lalu sampaikan atau salin informasi tersebut kepada siswa yang bersangkutan.
                </p>
              </div>

              {/* Quick Action to copy all & edit */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const allInfo = `Kredensial Siswa Informatika SMA:\nNama: ${studentForCredentials.fullName}\nKelas: ${studentForCredentials.className}\nUsername/Email: ${studentForCredentials.email}\nPassword: ${studentForCredentials.plainPassword || 'Siswa123!'}`;
                    copyToClipboard(allInfo, 'all');
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedField === 'all' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Seluruh kredensial siswa disalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin Semua (Nama, Kelas, Email &amp; Password)</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const std = studentForCredentials;
                      setStudentForCredentials(null);
                      openEditModal(std);
                    }}
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-600/20"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Edit Akun Ini</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStudentForCredentials(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal 2: Edit Akun & Kredensial Siswa */}
        {studentToEdit && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shadow-md shadow-blue-500/10">
                    <Pencil className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">Edit Akun Siswa</h3>
                    <p className="text-xs text-slate-400">Ubah nama, rombel kelas, email (username), atau kata sandi siswa</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!editSubmitting) setStudentToEdit(null);
                  }}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <span className="text-xl leading-none">&times;</span>
                </button>
              </div>

              {editStatusMsg && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-center gap-2 ${
                    editStatusMsg.error
                      ? 'bg-red-950/60 border-red-800/80 text-red-200'
                      : 'bg-emerald-950/60 border-emerald-800/80 text-emerald-200'
                  }`}
                >
                  {editStatusMsg.error ? <AlertTriangle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  <span>{editStatusMsg.text}</span>
                </div>
              )}

              <form onSubmit={handleSaveStudentEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-300 font-semibold">Nama Siswa *</label>
                    <input
                      type="text"
                      value={editFullName}
                      onChange={(e) => setEditFullName(e.target.value)}
                      placeholder="Nama lengkap siswa"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold">Kelas *</label>
                    <select
                      value={editClassName}
                      onChange={(e) => setEditClassName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                    >
                      {availableClasses.filter((c) => c !== 'all').map((c) => (
                        <option key={c} value={c}>
                          Kelas {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Username / Email Akun *</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    placeholder="contoh: siswa@sekolah.sch.id"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Format email valid. Siswa akan menggunakan email ini sebagai username login.
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-300 font-semibold flex items-center justify-between">
                    <span>Password Baru (Opsional)</span>
                    <span className="text-[11px] text-slate-500 font-normal">Kosongkan jika tidak ingin diubah</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="Minimal 8 karakter jika ingin mereset password"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-blue-500 font-mono pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                      title={showEditPassword ? 'Sembunyikan Kata Sandi' : 'Tampilkan Kata Sandi'}
                    >
                      {showEditPassword ? <EyeOff className="w-4 h-4 text-blue-400" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Password baru akan disimpan secara aman dan otomatis tersinkronisasi di panel guru untuk bantuan lupa login.
                  </span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={editSubmitting}
                    onClick={() => setStudentToEdit(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={editSubmitting}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all"
                  >
                    {editSubmitting ? (
                      <span>Menyimpan Perubahan...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Simpan Perubahan Akun</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ==================== TAB 1: DASHBOARD OVERVIEW ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Quick Greeting & Quick Actions */}
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-blue-950/40 border border-amber-800/30 rounded-2xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Selamat Datang di Konsol Pengajar
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {adminUser.fullName}
                </h2>
                <p className="text-xs text-slate-300">
                  NIP: <span className="font-mono text-amber-400 font-bold">{adminUser.nip}</span> &bull; Pantau penyelesaian tugas, kelola siswa, dan lakukan evaluasi pembelajaran secara realtime.
                </p>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setActiveTab('progress')}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/20 transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Lihat Diagram Rekap Tugas</span>
                </button>
                <button
                  onClick={() => setActiveTab('teacher_guide')}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-700/20 transition-all"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Panduan Guru &amp; Perangkat Ajar</span>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-600/20 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  <span>Menu Setting</span>
                </button>
              </div>
            </div>

            {/* 6 Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Jumlah Siswa Terdaftar</span>
                  </span>
                  <span className="text-2xl font-black font-mono text-white">
                    {overview?.totalStudents || 0}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Tersebar di {Object.keys(overview?.classBreakdown || {}).length} rombel kelas X aktif.
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Rata-Rata Nilai Kuis</span>
                  </span>
                  <span className="text-2xl font-black font-mono text-amber-400">
                    {overview?.avgQuizScore || 0} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {(overview?.avgQuizScore || 0) >= 75 ? 'Tuntas rata-rata KKM (>= 75)' : 'Rata-rata perlu bimbingan'}
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>Total Modul Diselesaikan</span>
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-400">
                    {overview?.totalModulesCompleted || 0}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Akumulasi modul teori yang telah dituntaskan seluruh siswa.
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span>Siswa Aktif Belajar</span>
                  </span>
                  <span className="text-2xl font-black font-mono text-purple-400">
                    {overview?.activeStudentsCount || 0}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Siswa yang mengakses materi dan koding dalam 7 hari terakhir.
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-blue-400" />
                    <span>Penyelesaian Proyek Capstone</span>
                  </span>
                  <span className="text-2xl font-black font-mono text-white">
                    {overview?.projectsFinished || 0}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Siswa yang telah menuntaskan aplikasi mandiri C++.
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <School className="w-4 h-4 text-emerald-400" />
                    <span>Kelas Siswa Terbanyak</span>
                  </span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {Object.entries(overview?.classBreakdown || {}).sort((a, b) => b[1] - a[1])[0]?.[0] || 'X-1'}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Distribusi siswa merata di setiap kelas rombel.
                </div>
              </div>
            </div>

            {/* Embedded Live Task Completion Analytics in Dashboard */}
            <TaskCompletionRecap
              students={allStudents}
              allStudentsCount={overview?.totalStudents || allStudents.length}
              availableClasses={availableClasses}
              onRefresh={() => {
                loadAllStudents();
                loadOverview();
              }}
            />
          </div>
        )}

        {/* ==================== TAB 2: REKAP TUGAS SISWA (DIAGRAM BATANG & LINGKARAN) ==================== */}
        {activeTab === 'progress' && (
          <TaskCompletionRecap
            students={allStudents}
            allStudentsCount={overview?.totalStudents || allStudents.length}
            availableClasses={availableClasses}
            onRefresh={() => {
              loadAllStudents();
              loadOverview();
            }}
          />
        )}

        {/* ==================== TAB 3: DATA SISWA & REKAP NILAI ==================== */}
        {(activeTab === 'students' || activeTab === 'scores' || activeTab === 'evaluations') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Daftar Siswa &amp; Rekapitulasi Pembelajaran</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kelola profil siswa, pantau capaian modul, nilai evaluasi HOTS, dan status proyek capstone.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowGoogleSheetsModal(true)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-teal-600/20 transition-all border border-teal-500/30 cursor-pointer"
                  title="Ekspor & Sinkronisasi data ke Google Sheets (Google Workspace)"
                >
                  <FileSpreadsheet className="w-4 h-4 text-teal-100" />
                  <span>Google Sheets</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCsv}
                  disabled={exportingCsv}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all border border-emerald-500/30"
                  title="Unduh file rekapitulasi pembelajaran seluruh siswa format spreadsheet CSV"
                >
                  {exportingCsv ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                  )}
                  <span>{exportingCsv ? 'Mengunduh CSV...' : 'Ekspor Laporan CSV'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportPdf}
                  disabled={exportingPdf}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-rose-600/20 transition-all border border-rose-500/30"
                  title="Cetak & unduh dokumen resmi rekapitulasi pembelajaran format PDF"
                >
                  {exportingPdf ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4 text-rose-100" />
                  )}
                  <span>{exportingPdf ? 'Menyiapkan PDF...' : 'Ekspor Laporan PDF'}</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Cari siswa berdasarkan nama atau email..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-400" />
                  <select
                    value={selectedClass}
                    onChange={(e) => {
                      setSelectedClass(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="all">Semua Kelas</option>
                    {availableClasses.filter((c) => c !== 'all').map((c) => (
                      <option key={c} value={c}>
                        Kelas {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Total: <span className="text-white font-bold">{totalStudents}</span> siswa
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-3.5">No</th>
                    <th className="p-3.5">Nama Siswa</th>
                    <th className="p-3.5">Kelas</th>
                    <th className="p-3.5">Username (Email)</th>
                    <th className="p-3.5">Modul (Teori)</th>
                    <th className="p-3.5">Lab C++</th>
                    <th className="p-3.5">Skor Kuis</th>
                    <th className="p-3.5">Total XP</th>
                    <th className="p-3.5">Proyek</th>
                    <th className="p-3.5 text-center min-w-[200px]">Aksi &amp; Kredensial Siswa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-sans text-slate-300">
                  {loading ? (
                    <tr>
                      <td colSpan={10} className="p-6 text-center text-slate-500 italic">
                        Memuat data siswa...
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="p-6 text-center text-slate-500 italic">
                        Tidak ada siswa yang sesuai dengan kriteria pencarian.
                      </td>
                    </tr>
                  ) : (
                    students.map((std, idx) => (
                      <tr key={std.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-slate-500">
                          {(currentPage - 1) * 8 + idx + 1}
                        </td>
                        <td className="p-3.5 font-bold text-white whitespace-nowrap">
                          {std.fullName}
                        </td>
                        <td className="p-3.5 font-mono text-blue-400 font-semibold">
                          {std.className}
                        </td>
                        <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                          {std.email}
                        </td>
                        <td className="p-3.5 font-mono">
                          <span className="text-emerald-400 font-bold">{std.completedModulesCount}</span>
                          <span className="text-slate-600"> / 9</span>
                        </td>
                        <td className="p-3.5 font-mono">
                          <span className="text-blue-400 font-bold">{std.completedExercisesCount}</span>
                          <span className="text-slate-600"> / 10</span>
                        </td>
                        <td className="p-3.5 font-mono">
                          <span
                            className={`font-bold ${
                              std.quizBestScore >= 75 ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {std.quizBestScore}
                          </span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-amber-400">
                          {std.totalPoints}
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              std.projectStatus === 'Selesai'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : std.projectStatus === 'Dalam Proses'
                                ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                : 'bg-slate-950 text-slate-500 border border-slate-800'
                            }`}
                          >
                            {std.projectStatus}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center justify-center gap-1.5 flex-nowrap">
                            <button
                              type="button"
                              onClick={() => openCredentialsModal(std)}
                              className="px-2.5 py-1.5 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/80 hover:text-amber-100 transition-colors flex items-center gap-1.5 text-[11px] font-semibold shrink-0 shadow-sm"
                              title="Lihat Username &amp; Password Akun (Jika Siswa Lupa Login)"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-400" />
                              <span>Lihat Akun</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => openEditModal(std)}
                              className="px-2.5 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 border border-blue-800/80 hover:text-blue-100 transition-colors flex items-center gap-1.5 text-[11px] font-semibold shrink-0 shadow-sm"
                              title="Edit Username &amp; Password Akun Siswa"
                            >
                              <Pencil className="w-3.5 h-3.5 text-blue-400" />
                              <span>Edit</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setStudentToReset(std)}
                              className="px-2.5 py-1.5 rounded-lg bg-orange-950/60 hover:bg-orange-900/80 text-orange-300 border border-orange-800/80 hover:text-orange-100 transition-colors flex items-center gap-1.5 text-[11px] font-semibold shrink-0 shadow-sm"
                              title={`Reset Pengerjaan Siswa (${std.fullName}): Hapus status pengerjaan, jawaban LKPD, dan kuis tanpa menghapus akun`}
                            >
                              <RotateCcw className="w-3.5 h-3.5 text-orange-400" />
                              <span>Reset Pengerjaan</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setStudentToDelete(std)}
                              className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/50 transition-colors shrink-0"
                              title="Hapus akun siswa"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-slate-400 font-mono">
                  Halaman {currentPage} dari {totalPages}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-slate-300"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: MENU SETTING (PROFIL GURU & PENGATURAN AKUN) ==================== */}
        {(activeTab === 'profile' || activeTab === 'settings') && (
          <TeacherProfileEditor
            user={adminUser}
            onProfileUpdated={handleProfileUpdated}
            onOpenGoogleSheets={() => setShowGoogleSheetsModal(true)}
          />
        )}

        {/* ==================== TAB 5: DATA KELAS ==================== */}
        {activeTab === 'classes' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-400" />
              <span>Manajemen &amp; Konfigurasi Rombongan Belajar (Kelas X)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableClasses.filter((c) => c !== 'all').map((cls) => {
                const count = overview?.classBreakdown?.[cls] || 0;
                return (
                  <div key={cls} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Kelas {cls}</span>
                      <span className="text-xs font-mono font-bold text-blue-400">{count} Siswa Terdaftar</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Rombel kelas reguler Fase E Informatika semester aktif.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedClass(cls);
                        setActiveTab('students');
                      }}
                      className="text-xs text-amber-400 hover:underline pt-1 block font-semibold"
                    >
                      Lihat Daftar Siswa &rarr;
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==================== TAB 6: BANK SOAL & MANAJEMEN MATERI ==================== */}
        {(activeTab === 'modules' || activeTab === 'quiz_bank') && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Daftar 9 Modul Pembelajaran &amp; Bank 50 Soal HOTS</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-200">9 Modul Silabus Fase E</h4>
                <div className="space-y-2 text-xs">
                  {MODULES_DATA.map((m) => (
                    <div key={m.id} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between items-center">
                      <span className="font-semibold text-white">Modul {m.number}: {m.title}</span>
                      <span className="text-slate-500 font-mono">{m.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-200">Komposisi Bank 50 Soal HOTS</h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span>1. Pemahaman Konsep (Donald Knuth &amp; Teori)</span>
                    <span className="font-mono text-blue-400 font-bold">10 Soal</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span>2. Penerapan Algoritma &amp; Modulus</span>
                    <span className="font-mono text-emerald-400 font-bold">10 Soal</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span>3. Analisis Kode C++ (Looping &amp; Tracing)</span>
                    <span className="font-mono text-purple-400 font-bold">10 Soal</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span>4. Identifikasi &amp; Debugging Kesalahan</span>
                    <span className="font-mono text-amber-400 font-bold">10 Soal</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex justify-between">
                    <span>5. Soal HOTS Berbasis Studi Kasus Nyata</span>
                    <span className="font-mono text-rose-400 font-bold">10 Soal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 7: PROYEK AKHIR ==================== */}
        {activeTab === 'projects' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-blue-400" />
              <span>Daftar Proyek Capstone Informatika Kelas X</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CAPSTONE_PROJECTS.map((proj) => (
                <div key={proj.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-400 text-[10px] font-mono font-bold">
                    CAPSTONE
                  </span>
                  <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                  <p className="text-xs text-slate-400 line-clamp-3">{proj.description}</p>
                  <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    Rubrik Penilaian: {proj.rubric.length} Kriteria Terstruktur
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 8: PANDUAN GURU & PERANGKAT PEMBELAJARAN ==================== */}
        {activeTab === 'teacher_guide' && (
          <TeacherGuideView />
        )}
      </main>

      {/* Floating Admin Toast Notification */}
      {adminToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-4 shadow-2xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              adminToast.type === 'success' 
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-400' 
                : 'bg-red-950 border border-red-700 text-red-400'
            }`}>
              {adminToast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-400" />
              )}
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-white text-sm">{adminToast.title}</div>
              <p className="text-slate-300 leading-relaxed">{adminToast.message}</p>
            </div>
          </div>

          <button
            onClick={() => setAdminToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Google Sheets Integration Modal */}
      <GoogleSheetsIntegrationModal
        isOpen={showGoogleSheetsModal}
        onClose={() => setShowGoogleSheetsModal(false)}
        students={allStudents.length > 0 ? allStudents : students}
        adminUser={adminUser}
        availableClasses={availableClasses}
      />
    </div>
  );
};
