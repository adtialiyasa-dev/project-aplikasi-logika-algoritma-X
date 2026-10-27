import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { StudentListItem, UserProfile } from './authService.ts';

// Defined OAuth Workspace Scopes for Google Drive & Google Sheets
export const WORKSPACE_SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly'
];

// Initialize Firebase App instance singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Provider with configured Workspace scopes
const provider = new GoogleAuthProvider();
WORKSPACE_SCOPES.forEach((scope) => {
  provider.addScope(scope);
});
provider.setCustomParameters({
  prompt: 'select_account'
});

// In-memory token cache (never stored in localStorage or sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener
export const initWorkspaceAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Sign in with Google Workspace
export const signInWithGoogleWorkspace = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token otorisasi dari Google Workspace.');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Workspace sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve in-memory access token
export const getWorkspaceAccessToken = (): string | null => {
  return cachedAccessToken;
};

// Set token explicitly (e.g. from sign in flow)
export const setWorkspaceAccessToken = (token: string | null) => {
  cachedAccessToken = token;
};

// Sign out from Google Workspace
export const signOutGoogleWorkspace = async () => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
  }
};

export interface ExportSheetResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  rowsCount: number;
}

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  webViewLink?: string;
  modifiedTime?: string;
}

/**
 * List recent spreadsheets from Google Drive API
 */
export const listRecentSpreadsheets = async (
  accessToken: string,
  pageSize: number = 8
): Promise<DriveSpreadsheetFile[]> => {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed = false");
  const fields = encodeURIComponent('files(id, name, webViewLink, modifiedTime)');
  const url = `https://www.googleapis.com/drive/v3/files?q=${query}&fields=${fields}&orderBy=modifiedTime desc&pageSize=${pageSize}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal mengambil daftar spreadsheet (${response.status})`);
  }

  const data = await response.json();
  return (data.files || []) as DriveSpreadsheetFile[];
};

/**
 * Create a new Google Spreadsheet and populate it with student learning recap
 */
export const exportStudentsToNewSpreadsheet = async (
  accessToken: string,
  students: StudentListItem[],
  teacherInfo?: { fullName: string; nip?: string; schoolName?: string },
  customTitle?: string
): Promise<ExportSheetResult> => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
  const defaultTitle = `Rekapitulasi Nilai & Pembelajaran Informatika Fase E - ${dateStr}`;
  const spreadsheetTitle = customTitle && customTitle.trim() ? customTitle.trim() : defaultTitle;

  // Step 1: Create Spreadsheet via Google Sheets API v4
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: spreadsheetTitle
      },
      sheets: [
        {
          properties: {
            title: 'Rekap Pembelajaran',
            gridProperties: {
              frozenRowCount: 6
            }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal membuat Google Spreadsheet baru (${createRes.status})`);
  }

  const sheetData = await createRes.json();
  const spreadsheetId = sheetData.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}`;

  // Step 2: Prepare Header and Rows Data
  const values: (string | number)[][] = [
    ['REKAPITULASI CAPAIAN PEMBELAJARAN INFORMATIKA FASE E (KELAS X SMA)'],
    [`Mata Pelajaran: Algoritma & Pemrograman C++ (9 Modul)`],
    [`Guru Pengampu: ${teacherInfo?.fullName || 'Bpk. Guru Informatika'} | NIP: ${teacherInfo?.nip || '-'} | Sekolah: ${teacherInfo?.schoolName || 'SMA Negeri 1 Pembelajaran Digital'}`],
    [`Tanggal Ekspor: ${dateStr} ${now.toLocaleTimeString('id-ID')} WIB | Total Siswa: ${students.length}`],
    [''],
    [
      'No',
      'NISN / ID',
      'Nama Lengkap Siswa',
      'Kelas',
      'Modul Selesai (/9)',
      'Persentase Modul',
      'Nilai Kuis HOTS',
      'Status Proyek Capstone',
      'Status Kelulusan KKM (>= 75)',
      'Total XP Prestasi'
    ]
  ];

  students.forEach((s, idx) => {
    const modulesCount = s.completedModulesCount || 0;
    const modPercentage = `${Math.round((modulesCount / 9) * 100)}%`;
    const score = s.quizBestScore || 0;
    const projectStatus = s.projectStatus === 'Selesai' ? 'Selesai (Lengkap)' : (s.projectStatus || 'Belum Mulai');
    const isPassing = score >= 75 ? 'Tuntas' : 'Perlu Remedial';
    const xp = s.totalPoints || 0;

    values.push([
      idx + 1,
      s.id,
      s.fullName,
      s.className,
      modulesCount,
      modPercentage,
      score,
      projectStatus,
      isPassing,
      xp
    ]);
  });

  // Summary Row at the end
  values.push(['']);
  const avgClassScore = students.length > 0
    ? Math.round((students.reduce((acc, curr) => acc + (curr.quizBestScore || 0), 0) / students.length) * 10) / 10
    : 0;
  const passedCount = students.filter((s) => (s.quizBestScore || 0) >= 75).length;
  values.push([
    'RINGKASAN KELAS',
    '',
    `Total Terdaftar: ${students.length} Siswa`,
    '',
    '',
    '',
    `Rata-Rata Nilai: ${avgClassScore}`,
    '',
    `Tuntas KKM: ${passedCount} / ${students.length} (${students.length > 0 ? Math.round((passedCount / students.length) * 100) : 0}%)`,
    ''
  ]);

  // Step 3: Populate values using Google Sheets API
  const appendRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Rekap Pembelajaran'!A1:J${values.length}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values
      })
    }
  );

  if (!appendRes.ok) {
    const errorData = await appendRes.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal mengisi data ke Google Spreadsheet (${appendRes.status})`);
  }

  return {
    spreadsheetId,
    spreadsheetUrl,
    title: spreadsheetTitle,
    rowsCount: students.length
  };
};

/**
 * Read spreadsheet metadata to get sheet tab names
 */
export const getSpreadsheetMetadata = async (
  accessToken: string,
  spreadsheetId: string
): Promise<{ title: string; sheets: string[] }> => {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=properties.title,sheets.properties.title`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal mengakses spreadsheet ID: ${spreadsheetId}`);
  }

  const data = await res.json();
  const sheets = (data.sheets || []).map((s: any) => s?.properties?.title || 'Sheet1');
  return {
    title: data.properties?.title || 'Spreadsheet',
    sheets
  };
};

/**
 * Read values from a spreadsheet range
 */
export const readSpreadsheetValues = async (
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<any[][]> => {
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal membaca range spreadsheet (${res.status})`);
  }

  const data = await res.json();
  return (data.values || []) as any[][];
};

/**
 * Append or update data in an existing sheet (mutating operation)
 */
export const updateSpreadsheetRange = async (
  accessToken: string,
  spreadsheetId: string,
  range: string,
  values: any[][]
): Promise<void> => {
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ values })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gagal memperbarui data sheet (${res.status})`);
  }
};
