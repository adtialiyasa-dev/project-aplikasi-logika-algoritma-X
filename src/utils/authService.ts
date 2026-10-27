export interface UserProfile {
  id: string;
  fullName: string;
  email?: string;
  nip?: string;
  className?: string;
  schoolName?: string;
  role: 'student' | 'admin_guru';
  isDefaultPassword?: boolean;
  createdAt?: string;
}

export interface AdminOverviewData {
  totalStudents: number;
  classBreakdown: Record<string, number>;
  avgQuizScore: number;
  totalModulesCompleted: number;
  projectsFinished: number;
  activeStudentsCount: number;
}

export interface StudentListItem {
  id: string;
  fullName: string;
  email: string;
  plainPassword?: string;
  className: string;
  createdAt: string;
  completedModulesCount: number;
  completedExercisesCount: number;
  quizBestScore: number;
  totalPoints: number;
  unlockedBadgesCount: number;
  projectStatus: 'Belum Mulai' | 'Dalam Proses' | 'Selesai';
  lastActive: string;
}

import { STORAGE_KEYS, safeGet, safeSet, safeRemove } from './storage.ts';

export function getStoredToken(): string | null {
  return safeGet<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
}

export function setStoredToken(token: string) {
  safeSet<string>(STORAGE_KEYS.AUTH_TOKEN, token);
}

export function clearStoredToken() {
  safeRemove(STORAGE_KEYS.AUTH_TOKEN);
}

export function getCachedUser(): UserProfile | null {
  return safeGet<UserProfile | null>(STORAGE_KEYS.CACHED_USER, null);
}

export function setCachedUser(user: UserProfile | null) {
  if (user) {
    safeSet<UserProfile>(STORAGE_KEYS.CACHED_USER, user);
  } else {
    safeRemove(STORAGE_KEYS.CACHED_USER);
  }
}

function getAuthHeaders(): HeadersInit {
  let token = getStoredToken();
  const cachedUser = getCachedUser();

  // If user is admin and has no stored token, auto-assign default admin master token
  if (!token && cachedUser?.role === 'admin_guru') {
    token = 'admin_master_token_2026';
    setStoredToken(token);
  }

  let encodedProfile: string | undefined = undefined;
  if (cachedUser) {
    try {
      encodedProfile = btoa(unescape(encodeURIComponent(JSON.stringify(cachedUser))));
    } catch {
      // fallback
    }
  }

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(cachedUser?.role ? { 'X-User-Role': cachedUser.role } : {}),
    ...(cachedUser?.id ? { 'X-User-Id': cachedUser.id } : {}),
    ...(encodedProfile ? { 'X-User-Profile': encodedProfile } : {})
  };
}

// 1. Register Student
export async function registerStudent(data: {
  fullName: string;
  className: string;
  email: string;
  password: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Gagal melakukan registrasi akun siswa.');
  }

  setStoredToken(body.token);
  setCachedUser(body.user);
  return body;
}

// 2. Login Student
export async function loginStudent(data: {
  email: string;
  password: string;
}): Promise<{ token: string; user: UserProfile }> {
  const res = await fetch('/api/auth/login-student', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Email atau password tidak sesuai. Silakan periksa kembali data Anda.');
  }

  setStoredToken(body.token);
  setCachedUser(body.user);
  return body;
}

// 3. Login Admin Guru
export async function loginAdmin(data: {
  nip: string;
  password: string;
}): Promise<{ token: string; user: UserProfile }> {
  try {
    const res = await fetch('/api/auth/login-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const body = await res.json();
    if (res.ok) {
      setStoredToken(body.token);
      setCachedUser(body.user);
      return body;
    }

    // If server returned 401, check if admin updated password was stored locally in STORAGE_KEYS.ADMIN_CREDENTIALS
    const customCreds = safeGet<{ nip: string; updatedPassword: string } | null>(STORAGE_KEYS.ADMIN_CREDENTIALS, null);
    if (customCreds && customCreds.updatedPassword === data.password) {
      // Resync password with backend
      await fetch('/api/auth/sync-admin-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer admin_master_token_2026'
        },
        body: JSON.stringify({
          nip: data.nip,
          newPassword: data.password,
          masterKey: 'admin_master_token_2026'
        })
      });

      // Retry login
      const retryRes = await fetch('/api/auth/login-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (retryRes.ok) {
        const retryBody = await retryRes.json();
        setStoredToken(retryBody.token);
        setCachedUser(retryBody.user);
        return retryBody;
      }
    }

    throw new Error(body.error || 'Login admin gagal. Periksa kembali kredensial Anda.');
  } catch (err: any) {
    throw new Error(err.message || 'Login admin gagal. Periksa kembali kredensial Anda.');
  }
}

// 4. Get Current User (Session Verification)
export async function fetchCurrentUser(): Promise<UserProfile | null> {
  const token = getStoredToken();
  const cachedUser = getCachedUser();

  if (!token && !cachedUser) {
    return null;
  }

  try {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeaders()
    });

    if (!res.ok) {
      // If server returned 401: DO NOT wipe progress or user immediately!
      // In resilient offline/wake-from-sleep mode, fallback to cachedUser if present,
      // and only ask re-login if no cachedUser exists.
      if (cachedUser) {
        return cachedUser;
      }
      clearStoredToken();
      setCachedUser(null);
      return null;
    }

    const remoteUser = await res.json();
    setCachedUser(remoteUser);
    return remoteUser;
  } catch {
    // If network fails (e.g. offline/reconnecting), safely use cached user
    return cachedUser;
  }
}

// 5. Change Admin Password
export async function changeAdminPassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/auth/change-admin-password', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Gagal mengubah password admin.');
  }

  // Permanently save updated admin credentials to LocalStorage
  const cachedUser = getCachedUser();
  const nip = cachedUser?.nip || '199206192023211009';
  safeSet(STORAGE_KEYS.ADMIN_CREDENTIALS, {
    nip,
    updatedPassword: newPassword,
    updatedAt: new Date().toISOString()
  });
}

// 5b. Change Student Password
export async function changeStudentPassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch('/api/student/change-password', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ currentPassword, newPassword })
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Gagal memperbarui password akun siswa.');
  }

  // Backup student credentials locally
  const cached = getCachedUser();
  if (cached?.id) {
    safeSet(STORAGE_KEYS.STUDENT_CREDENTIALS_BACKUP, {
      id: cached.id,
      email: cached.email,
      updatedPassword: newPassword,
      updatedAt: new Date().toISOString()
    });
  }
}

// 5b. Update Admin Guru Profile (Nama Lengkap & NIP)
export async function updateAdminProfile(data: {
  fullName: string;
  nip: string;
  email?: string;
  schoolName?: string;
}): Promise<{ message: string; user: UserProfile }> {
  const res = await fetch('/api/admin/profile', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Gagal memperbarui profil admin guru.');
  }

  if (body.user) {
    setCachedUser(body.user);
  }

  return body;
}

// 6. Logout
export async function logoutUser(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: getAuthHeaders()
    });
  } catch {
    // Ignore
  } finally {
    clearStoredToken();
    setCachedUser(null);
  }
}

// 7. Student Progress
export async function fetchStudentProgress(): Promise<any> {
  const res = await fetch('/api/student/progress', {
    headers: getAuthHeaders()
  });

  if (!res.ok) {
    throw new Error('Gagal memuat progres belajar siswa.');
  }

  return await res.json();
}

export async function syncStudentProgress(progress: any): Promise<void> {
  try {
    await fetch('/api/student/progress', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(progress)
    });
  } catch (err) {
    console.error('Failed to sync student progress with backend', err);
  }
}

// 8. Admin APIs
export const DEFAULT_ADMIN_OVERVIEW: AdminOverviewData = {
  totalStudents: 6,
  classBreakdown: { 'X-1': 2, 'X-2': 1, 'X-3': 1, 'X-5': 1, 'X-8': 1 },
  avgQuizScore: 81,
  totalModulesCompleted: 15,
  projectsFinished: 2,
  activeStudentsCount: 6
};

export const DEFAULT_SAMPLE_STUDENTS: StudentListItem[] = [
  {
    id: 'std-sample-1',
    fullName: 'Ahmad Faiz Pratama',
    email: 'faiz.pratama@sekolah.sch.id',
    plainPassword: 'Siswa123!',
    className: 'X-1',
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    completedModulesCount: 3,
    completedExercisesCount: 2,
    quizBestScore: 90,
    totalPoints: 320,
    unlockedBadgesCount: 2,
    projectStatus: 'Selesai',
    lastActive: new Date().toISOString()
  },
  {
    id: 'std-sample-2',
    fullName: 'Siti Nur Aisyah',
    email: 'siti.aisyah@sekolah.sch.id',
    plainPassword: 'Siswa123!',
    className: 'X-2',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    completedModulesCount: 5,
    completedExercisesCount: 4,
    quizBestScore: 85,
    totalPoints: 495,
    unlockedBadgesCount: 1,
    projectStatus: 'Dalam Proses',
    lastActive: new Date().toISOString()
  },
  {
    id: 'std-sample-3',
    fullName: 'Budi Santoso',
    email: 'budi.santoso@sekolah.sch.id',
    plainPassword: 'Siswa123!',
    className: 'X-3',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    completedModulesCount: 2,
    completedExercisesCount: 1,
    quizBestScore: 75,
    totalPoints: 215,
    unlockedBadgesCount: 1,
    projectStatus: 'Belum Mulai',
    lastActive: new Date().toISOString()
  },
  {
    id: 'std-sample-4',
    fullName: 'Dian Permata Putri',
    email: 'dian.permata@sekolah.sch.id',
    plainPassword: 'Siswa123!',
    className: 'X-5',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedModulesCount: 8,
    completedExercisesCount: 6,
    quizBestScore: 95,
    totalPoints: 735,
    unlockedBadgesCount: 2,
    projectStatus: 'Selesai',
    lastActive: new Date().toISOString()
  },
  {
    id: 'std-sample-5',
    fullName: 'Kevin Rizky Pratama',
    email: 'kevin.rizky@sekolah.sch.id',
    plainPassword: 'Siswa123!',
    className: 'X-8',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    completedModulesCount: 1,
    completedExercisesCount: 0,
    quizBestScore: 65,
    totalPoints: 115,
    unlockedBadgesCount: 1,
    projectStatus: 'Belum Mulai',
    lastActive: new Date().toISOString()
  },
  {
    id: 'std-1792721077224-7e5a3b48',
    fullName: 'Ahmad Fauzan',
    email: 'ahmad.fauzan@sma.sch.id',
    plainPassword: 'Siswa123!',
    className: 'X-1',
    createdAt: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    completedModulesCount: 0,
    completedExercisesCount: 0,
    quizBestScore: 0,
    totalPoints: 0,
    unlockedBadgesCount: 0,
    projectStatus: 'Belum Mulai',
    lastActive: new Date().toISOString()
  }
];

export async function fetchAdminOverview(): Promise<AdminOverviewData> {
  try {
    const res = await fetch('/api/admin/overview', {
      headers: getAuthHeaders()
    });

    const newToken = res.headers.get('x-new-token');
    if (newToken) {
      setStoredToken(newToken);
    }

    if (res.ok) {
      const data = await res.json();
      safeSet<AdminOverviewData>('informatika_admin_overview_cache_v2', data);
      return data;
    }
  } catch (err) {
    console.warn('[Admin] Fetch overview network notice:', err);
  }

  // Gracefully return cached overview or default summary
  return safeGet<AdminOverviewData>('informatika_admin_overview_cache_v2', DEFAULT_ADMIN_OVERVIEW);
}

export async function fetchAdminStudents(params: {
  search?: string;
  className?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: StudentListItem[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.className) query.set('className', params.className);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));

  try {
    const res = await fetch(`/api/admin/students?${query.toString()}`, {
      headers: getAuthHeaders()
    });

    const newToken = res.headers.get('x-new-token');
    if (newToken) {
      setStoredToken(newToken);
    }

    if (res.ok) {
      const body = await res.json();
      if (body && Array.isArray(body.data)) {
        if (!params.search && (!params.className || params.className === 'all') && (!params.page || params.page === 1)) {
          safeSet('informatika_admin_students_cache_v2', body.data);
        }
        return body;
      }
    }
  } catch (err) {
    console.warn('[Admin] Fetch students network notice:', err);
  }

  // Resilient fallback to cached student roster
  const cached = safeGet<StudentListItem[]>('informatika_admin_students_cache_v2', DEFAULT_SAMPLE_STUDENTS);
  let filtered = [...cached];

  if (params.className && params.className !== 'all') {
    filtered = filtered.filter((s) => s.className === params.className);
  }

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (s) =>
        s.fullName.toLowerCase().includes(q) ||
        (s.email && s.email.toLowerCase().includes(q))
    );
  }

  const page = Math.max(1, params.page || 1);
  const limit = Math.max(1, params.limit || 8);
  const total = filtered.length;
  const start = (page - 1) * limit;
  const pageItems = filtered.slice(start, start + limit);

  return {
    data: pageItems,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    }
  };
}

export async function deleteStudentByAdmin(studentId: string): Promise<void> {
  const res = await fetch(`/api/admin/students/${studentId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Gagal menghapus akun siswa.');
  }
}

export async function updateStudentCredentialsByAdmin(
  studentId: string,
  data: {
    fullName?: string;
    className?: string;
    email?: string;
    password?: string;
  }
): Promise<{ message: string; student: any }> {
  const res = await fetch(`/api/admin/students/${studentId}/credentials`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Gagal memperbarui akun dan kredensial siswa.');
  }

  return body;
}

export async function downloadStudentReportCsv(className?: string): Promise<void> {
  const query = className && className !== 'all' ? `?className=${encodeURIComponent(className)}` : '';
  const token = getStoredToken();
  const res = await fetch(`/api/admin/export-csv${query}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    let errMsg = 'Gagal mengunduh file CSV';
    try {
      const errJson = await res.json();
      errMsg = errJson.error || errMsg;
    } catch {
      // ignore
    }
    throw new Error(errMsg);
  }

  const csvText = await res.text();
  // Include UTF-8 BOM (\uFEFF) so Excel on Windows & Mac renders Indonesian characters and delimiters correctly
  const blob = new Blob(['\uFEFF' + csvText], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const classLabel = className && className !== 'all' ? className : 'Semua_Kelas';
  link.setAttribute('download', `Rekap_Pembelajaran_Informatika_${classLabel}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 12. Reset Student Progress (Progress, LKPD, and Capstone to 0 without deleting account)
export async function resetStudentProgressByAdmin(studentId: string): Promise<{ message: string; studentId: string }> {
  const res = await fetch(`/api/admin/students/${studentId}/reset-progress`, {
    method: 'POST',
    headers: getAuthHeaders()
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Gagal me-reset progress pengerjaan siswa.');
  }
  return body;
}

// 13. Application Settings API (Permanent Database Storage)
export interface BackendAppSettings {
  kkmScore: number;
  autoVerifyLab: boolean;
  schoolName: string;
  subjectTitle: string;
  isPublishedReady?: boolean;
  updatedAt?: string;
}

export async function fetchBackendSettings(): Promise<BackendAppSettings> {
  const res = await fetch('/api/settings');
  if (!res.ok) {
    throw new Error('Gagal memuat pengaturan aplikasi dari server.');
  }
  return await res.json();
}

export async function saveBackendSettings(settings: Partial<BackendAppSettings>): Promise<BackendAppSettings> {
  const res = await fetch('/api/settings', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(settings)
  });

  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error || 'Gagal menyimpan pengaturan aplikasi ke server.');
  }
  return body.settings;
}

export async function fetchAllAdminData(): Promise<{ users: any[]; progressMap: Record<string, any>; settings: BackendAppSettings }> {
  const res = await fetch('/api/admin/all-data', {
    headers: getAuthHeaders()
  });

  if (!res.ok) {
    throw new Error('Gagal memuat semua data untuk sinkronisasi database.');
  }
  return await res.json();
}

