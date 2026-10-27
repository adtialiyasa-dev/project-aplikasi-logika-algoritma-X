import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Download, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldCheck, 
  LogOut, 
  ArrowRight,
  Database,
  Calendar,
  FileText
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  signInWithGoogleWorkspace, 
  signOutGoogleWorkspace, 
  getWorkspaceAccessToken, 
  exportStudentsToNewSpreadsheet,
  listRecentSpreadsheets,
  readSpreadsheetValues,
  getSpreadsheetMetadata,
  updateSpreadsheetRange,
  DriveSpreadsheetFile,
  ExportSheetResult
} from '../../utils/googleSheetsService.ts';
import { StudentListItem, UserProfile } from '../../utils/authService.ts';

interface GoogleSheetsIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: StudentListItem[];
  adminUser: UserProfile;
  availableClasses: string[];
}

export const GoogleSheetsIntegrationModal: React.FC<GoogleSheetsIntegrationModalProps> = ({
  isOpen,
  onClose,
  students,
  adminUser,
  availableClasses
}) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getWorkspaceAccessToken());
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'export' | 'recent' | 'sync'>('export');

  // Export state
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [customTitle, setCustomTitle] = useState<string>(
    `Rekapitulasi Pembelajaran Informatika X - ${new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}`
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState<ExportSheetResult | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Recent files state
  const [recentFiles, setRecentFiles] = useState<DriveSpreadsheetFile[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  // Sync / Read state
  const [spreadsheetInput, setSpreadsheetInput] = useState<string>('');
  const [isReadingSheet, setIsReadingSheet] = useState(false);
  const [readMetadata, setReadMetadata] = useState<{ title: string; sheets: string[] } | null>(null);
  const [sheetPreviewRows, setSheetPreviewRows] = useState<any[][]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Destructive confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionLabel: string;
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);

  // Check initial token
  useEffect(() => {
    const currentToken = getWorkspaceAccessToken();
    setAccessToken(currentToken);
  }, [isOpen]);

  // Load recent spreadsheets when token is available and tab is recent
  useEffect(() => {
    if (accessToken && activeTab === 'recent') {
      loadRecentFiles();
    }
  }, [accessToken, activeTab]);

  const loadRecentFiles = async () => {
    if (!accessToken) return;
    setIsLoadingRecent(true);
    try {
      const files = await listRecentSpreadsheets(accessToken, 10);
      setRecentFiles(files);
    } catch (err: any) {
      console.error('Error loading recent spreadsheets:', err);
    } finally {
      setIsLoadingRecent(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setStatusMessage(null);
    try {
      const result = await signInWithGoogleWorkspace();
      setGoogleUser(result.user);
      setAccessToken(result.accessToken);
      setStatusMessage({
        type: 'success',
        text: `Terhubung dengan akun Google: ${result.user.email}`
      });
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Gagal masuk dengan akun Google Workspace.'
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await signOutGoogleWorkspace();
    setGoogleUser(null);
    setAccessToken(null);
    setExportResult(null);
    setRecentFiles([]);
    setStatusMessage({
      type: 'success',
      text: 'Berhasil memutuskan koneksi Google Workspace.'
    });
  };

  // Filter students based on selected class
  const filteredStudents = selectedClass === 'all'
    ? students
    : students.filter((s) => s.className === selectedClass);

  const handleExport = async () => {
    if (!accessToken) {
      handleSignIn();
      return;
    }

    setIsExporting(true);
    setStatusMessage(null);
    setExportResult(null);

    try {
      const result = await exportStudentsToNewSpreadsheet(
        accessToken,
        filteredStudents,
        {
          fullName: adminUser.fullName,
          nip: adminUser.nip,
          schoolName: adminUser.schoolName
        },
        customTitle
      );
      setExportResult(result);
      setStatusMessage({
        type: 'success',
        text: `Spreadsheet berhasil dibuat! ${result.rowsCount} data siswa telah disinkronkan ke Google Drive.`
      });
    } catch (err: any) {
      console.error('Export to Google Sheets error:', err);
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Gagal membuat Google Spreadsheet. Periksa izin akun Anda.'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Extract Spreadsheet ID from URL or raw ID
  const extractSpreadsheetId = (input: string): string => {
    const trimmed = input.trim();
    const match = trimmed.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      return match[1];
    }
    return trimmed;
  };

  // Inspect existing sheet
  const handleInspectSheet = async () => {
    if (!accessToken) {
      handleSignIn();
      return;
    }

    const cleanId = extractSpreadsheetId(spreadsheetInput);
    if (!cleanId) {
      setStatusMessage({
        type: 'error',
        text: 'Masukkan link spreadsheet atau Spreadsheet ID yang valid.'
      });
      return;
    }

    setIsReadingSheet(true);
    setStatusMessage(null);
    setSheetPreviewRows([]);
    setReadMetadata(null);

    try {
      const meta = await getSpreadsheetMetadata(accessToken, cleanId);
      setReadMetadata(meta);

      const firstSheet = meta.sheets[0] || 'Sheet1';
      const rows = await readSpreadsheetValues(accessToken, cleanId, `'${firstSheet}'!A1:J10`);
      setSheetPreviewRows(rows);
      setStatusMessage({
        type: 'success',
        text: `Berhasil mengakses spreadsheet: "${meta.title}" (${rows.length} baris terbaca).`
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Gagal membaca spreadsheet. Pastikan link benar dan akun memiliki hak akses.'
      });
    } finally {
      setIsReadingSheet(false);
    }
  };

  // Trigger mutating sync with explicit user confirmation
  const handleSyncToExistingPrompt = () => {
    if (!accessToken) return;
    const cleanId = extractSpreadsheetId(spreadsheetInput);
    if (!cleanId || !readMetadata) {
      setStatusMessage({
        type: 'error',
        text: 'Harap periksa spreadsheet terlebih dahulu sebelum memperbarui data.'
      });
      return;
    }

    const targetSheet = readMetadata.sheets[0] || 'Sheet1';

    // Show explicit user confirmation dialog
    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Perbaruan Data Google Sheets',
      description: `Tindakan ini akan MENIMPA dan memperbarui sel pada sheet "${targetSheet}" di spreadsheet "${readMetadata.title}" dengan data terbaru dari ${filteredStudents.length} siswa kelas ${selectedClass === 'all' ? 'seluruh rombel' : selectedClass}. Pastikan Anda benar-benar ingin memperbarui spreadsheet ini.`,
      actionLabel: 'Ya, Perbarui Spreadsheet',
      onConfirm: async () => {
        setIsConfirmingAction(true);
        try {
          const updateValues: (string | number)[][] = [
            ['NISN', 'Nama Siswa', 'Kelas', 'Modul Selesai (/9)', 'Nilai Rata-rata Kuis', 'Status Proyek', 'Status KKM', 'XP']
          ];

          filteredStudents.forEach((s) => {
            updateValues.push([
              s.id,
              s.fullName,
              s.className,
              s.completedModulesCount || 0,
              s.quizBestScore || 0,
              s.projectStatus === 'Selesai' ? 'Selesai' : (s.projectStatus || 'Proses'),
              (s.quizBestScore || 0) >= 75 ? 'Tuntas' : 'Remedial',
              s.totalPoints || 0
            ]);
          });

          await updateSpreadsheetRange(
            accessToken,
            cleanId,
            `'${targetSheet}'!A1:H${updateValues.length}`,
            updateValues
          );

          setStatusMessage({
            type: 'success',
            text: `Data ${filteredStudents.length} siswa berhasil diperbarui pada spreadsheet "${readMetadata.title}".`
          });
          setConfirmDialog(null);
          // Reload preview
          const rows = await readSpreadsheetValues(accessToken, cleanId, `'${targetSheet}'!A1:J10`);
          setSheetPreviewRows(rows);
        } catch (err: any) {
          setStatusMessage({
            type: 'error',
            text: err?.message || 'Gagal memperbarui spreadsheet.'
          });
        } finally {
          setIsConfirmingAction(false);
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span>Integrasi Google Sheets &amp; Drive</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-400 text-[10px] font-mono">
                  Google Workspace
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ekspor rekapitulasi nilai, kelola data siswa, dan sinkronkan spreadsheet di cloud secara langsung.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div
            className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
                : 'bg-red-950/80 border border-red-800 text-red-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span className="flex-1">{statusMessage.text}</span>
          </div>
        )}

        {/* Authentication Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {accessToken ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400 font-bold text-sm">
                <Check className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Google Workspace Terhubung</span>
                </div>
                <div className="text-slate-400 text-[11px] font-mono">
                  {googleUser?.email || 'Akun Google aktif dengan izin Google Sheets & Drive'}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-300">
              <span className="font-semibold text-white block">Belum Terhubung dengan Akun Google</span>
              <span className="text-slate-400 text-[11px]">
                Masuk untuk menyimpan berkas langsung ke Google Drive dan Google Sheets Anda.
              </span>
            </div>
          )}

          <div>
            {accessToken ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center gap-1.5 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-400" />
                <span>Ganti Akun</span>
              </button>
            ) : (
              /* Official Google Sign-In button standard */
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoggingIn}
                className="inline-flex items-center justify-center gap-2.5 px-4 py-2 bg-white hover:bg-slate-100 active:scale-95 disabled:opacity-60 text-slate-800 text-xs font-semibold rounded-lg shadow-md transition-all border border-slate-300 cursor-pointer"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span>{isLoggingIn ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('export')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'export'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor ke Spreadsheet Baru</span>
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'recent'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Spreadsheet di Google Drive</span>
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'sync'
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sinkron / Baca Sheet Ada</span>
          </button>
        </div>

        {/* TAB 1: EXPORT TO NEW GOOGLE SPREADSHEET */}
        {activeTab === 'export' && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Judul Berkas Google Spreadsheet</label>
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Contoh: Rekapitulasi Pembelajaran Informatika X"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Pilih Rombel / Kelas</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="all">Seluruh Rombel Kelas X ({students.length} Siswa)</option>
                  {availableClasses.filter((c) => c !== 'all').map((cls) => (
                    <option key={cls} value={cls}>
                      Kelas {cls} ({students.filter((s) => s.className === cls).length} Siswa)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Format Kolom Rekap</label>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-400 text-[11px] leading-relaxed">
                  NISN, Nama, Kelas, 9 Modul, Rata-rata HOTS, Capstone, KKM 75, XP
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-white font-semibold block">
                  Jumlah Siswa yang Diekspor: {filteredStudents.length}
                </span>
                <span className="text-slate-400 text-[11px]">
                  Berkas akan otomatis disimpan di Google Drive akun yang terhubung.
                </span>
              </div>
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>{isExporting ? 'Membuat Spreadsheet...' : 'Buat di Google Sheets'}</span>
              </button>
            </div>

            {/* Export Success Result Card */}
            {exportResult && (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700/80 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Spreadsheet Berhasil Dibuat!</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {exportResult.rowsCount} Baris Siswa
                  </span>
                </div>
                <div className="text-xs text-slate-200 font-medium">
                  {exportResult.title}
                </div>

                <div className="flex items-center gap-2 flex-wrap pt-1">
                  <a
                    href={exportResult.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Buka di Google Sheets ↗</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyUrl(exportResult.spreadsheetUrl)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-lg text-xs flex items-center gap-1.5 transition-all"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Tersalin!' : 'Salin Tautan'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RECENT SPREADSHEETS IN GOOGLE DRIVE */}
        {activeTab === 'recent' && (
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">
                Spreadsheet Google Sheets terbaru di Google Drive Anda:
              </span>
              <button
                type="button"
                onClick={loadRecentFiles}
                disabled={isLoadingRecent || !accessToken}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300"
                title="Muat Ulang"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecent ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {!accessToken ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
                Silakan hubungkan akun Google Anda di atas untuk melihat berkas spreadsheet.
              </div>
            ) : isLoadingRecent ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-400" />
                <span>Mengambil data dari Google Drive...</span>
              </div>
            ) : recentFiles.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400">
                Belum ada spreadsheet ditemukan di Google Drive akun ini.
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {recentFiles.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div className="truncate">
                        <div className="text-white font-semibold truncate">{f.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          ID: {f.id.slice(0, 16)}...
                        </div>
                      </div>
                    </div>

                    <a
                      href={f.webViewLink || `https://docs.google.com/spreadsheets/d/${f.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-emerald-400 text-xs font-semibold flex items-center gap-1 shrink-0"
                    >
                      <span>Buka</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SYNC / READ EXISTING SPREADSHEET */}
        {activeTab === 'sync' && (
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">
                Tautan Google Sheets atau Spreadsheet ID
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={spreadsheetInput}
                  onChange={(e) => setSpreadsheetInput(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <button
                  type="button"
                  onClick={handleInspectSheet}
                  disabled={isReadingSheet}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
                >
                  {isReadingSheet ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                  <span>Baca Sheet</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Tempel link lengkap spreadsheet yang ada di Google Drive Anda untuk membaca atau menyinkronkan data siswa.
              </p>
            </div>

            {readMetadata && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{readMetadata.title}</span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Tab: {readMetadata.sheets.join(', ')}
                  </span>
                </div>

                {sheetPreviewRows.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-slate-400 font-semibold">Preview Data (Baris Teratas):</span>
                    <div className="overflow-x-auto max-h-40 border border-slate-800 rounded-lg">
                      <table className="w-full text-left text-[11px]">
                        <tbody>
                          {sheetPreviewRows.slice(0, 5).map((row, rIdx) => (
                            <tr key={rIdx} className={rIdx === 0 ? 'bg-slate-900 font-bold text-slate-200' : 'border-t border-slate-800 text-slate-400'}>
                              {row.slice(0, 6).map((cell, cIdx) => (
                                <td key={cIdx} className="p-1.5 px-2.5 whitespace-nowrap">
                                  {String(cell)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400">
                    Perbarui spreadsheet ini dengan data terbaru {filteredStudents.length} siswa?
                  </span>
                  <button
                    type="button"
                    onClick={handleSyncToExistingPrompt}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sinkronkan &amp; Timpa Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Explicit Destructive / Mutating Confirmation Dialog */}
        {confirmDialog && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
            <div className="bg-slate-900 border border-amber-600/50 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <h4 className="font-bold text-base text-white">{confirmDialog.title}</h4>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {confirmDialog.description}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  disabled={isConfirmingAction}
                  onClick={() => setConfirmDialog(null)}
                  className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isConfirmingAction}
                  onClick={confirmDialog.onConfirm}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  {isConfirmingAction && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{confirmDialog.actionLabel}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Koneksi aman melalui Google Workspace API (OAuth 2.0)</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
