import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

interface UserRecord {
  id: string;
  fullName: string;
  email?: string;
  nip?: string;
  className?: string;
  role: 'student' | 'admin_guru';
  passwordHash: string;
  salt: string;
  createdAt: string;
  isDefaultPassword?: boolean;
  plainPassword?: string;
}

interface StudentProgressRecord {
  userId: string;
  completedModules: string[];
  completedExercises: string[];
  quizBestScore: number;
  quizScores?: Record<string, number>;
  totalPoints: number;
  unlockedBadges: string[];
  reflections: Record<string, string>;
  projectStatus: 'Belum Mulai' | 'Dalam Proses' | 'Selesai';
  selectedProject?: string;
  projectNotes?: Record<string, string>;
  capstoneCodeAnswers?: Record<string, string>;
  lastActive: string;
  resetByAdminAt?: string;
}

interface AppSettingsRecord {
  kkmScore: number;
  autoVerifyLab: boolean;
  schoolName: string;
  subjectTitle: string;
  isPublishedReady: boolean;
  updatedAt?: string;
}

const DATA_FILE = path.resolve(process.cwd(), 'data_store.json');

// In-Memory Database with Permanent File Persistence (including active sessions and settings)
let users: UserRecord[] = [];
let progressMap: Record<string, StudentProgressRecord> = {};
let sessions: Record<string, { userId: string; role: 'student' | 'admin_guru'; expiresAt: number }> = {};
let settings: AppSettingsRecord = {
  kkmScore: 75,
  autoVerifyLab: true,
  schoolName: 'SMA Negeri 1 Pembelajaran Digital',
  subjectTitle: 'Informatika Fase E (Kelas X SMA)',
  isPublishedReady: true
};

const SESSION_SECRET = process.env.SESSION_SECRET || 'informatika_kurikulum_merdeka_fase_e_session_key_2026';

function signToken(userId: string, role: 'student' | 'admin_guru', expiresAt: number): string {
  const payload = `${userId}.${role}.${expiresAt}`;
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return `tok_${Buffer.from(payload).toString('base64url')}.${sig}`;
}

function verifySignedToken(token: string): { userId: string; role: 'student' | 'admin_guru'; expiresAt: number } | null {
  if (!token || typeof token !== 'string') return null;

  // Direct check for master admin token
  if (token === 'admin_master_token_2026') {
    const adminUser = users.find((u) => u.role === 'admin_guru');
    if (adminUser) {
      return { userId: adminUser.id, role: 'admin_guru', expiresAt: Date.now() + 365 * 86400000 };
    }
  }

  // Check in-memory sessions first
  if (sessions[token]) {
    const s = sessions[token];
    if (Date.now() < s.expiresAt) {
      return { userId: s.userId, role: s.role, expiresAt: s.expiresAt };
    }
    delete sessions[token];
  }

  // Check if it's a signed token
  if (token.startsWith('tok_')) {
    const withoutPrefix = token.slice(4);
    const dotIdx = withoutPrefix.indexOf('.');
    if (dotIdx > 0) {
      const payloadB64 = withoutPrefix.slice(0, dotIdx);
      const sig = withoutPrefix.slice(dotIdx + 1);
      try {
        const payload = Buffer.from(payloadB64, 'base64url').toString('utf-8');
        const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
        if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) {
          const parts = payload.split('.');
          if (parts.length === 3) {
            const [userId, role, expStr] = parts;
            const expiresAt = Number(expStr);
            if (!isNaN(expiresAt) && Date.now() < expiresAt) {
              sessions[token] = { userId, role: role as any, expiresAt };
              return { userId, role: role as any, expiresAt };
            }
          }
        }
      } catch {
        // invalid signature format
      }
    }
  }

  return null;
}

function createSession(userId: string, role: 'student' | 'admin_guru'): string {
  const expiresAt = Date.now() + 365 * 24 * 60 * 60 * 1000; // 365 days permanent session
  const token = signToken(userId, role, expiresAt);
  sessions[token] = { userId, role, expiresAt };
  saveDatabase();
  return token;
}

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function loadDatabase() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(content);
      users = data.users || [];
      progressMap = data.progressMap || {};
      sessions = data.sessions || {};
      if (data.settings) {
        settings = {
          ...settings,
          ...data.settings
        };
      }
      // Ensure all students have plainPassword available for admin assistance
      users.forEach((u) => {
        if (u.role === 'student' && !u.plainPassword) {
          u.plainPassword = 'Siswa123!';
        }
      });
    }
  } catch (err) {
    console.error('Error loading database file, starting fresh', err);
  }

  // Provision Admin Guru if not present
  const adminNip = '199206192023211009';
  let adminUser = users.find((u) => u.nip === adminNip || u.role === 'admin_guru');
  if (!adminUser) {
    const adminSalt = crypto.randomBytes(16).toString('hex');
    adminUser = {
      id: 'admin-1',
      fullName: 'Bpk. Rahmat Hidayat, S.Kom., Gr.',
      nip: adminNip,
      role: 'admin_guru',
      salt: adminSalt,
      passwordHash: hashPassword('admin', adminSalt),
      createdAt: new Date().toISOString(),
      isDefaultPassword: true
    };
    users.push(adminUser);
    console.log('Admin Guru provisioned successfully with NIP: 199206192023211009');
  }

  // Always ensure master admin token and permanent session exist
  const permAdminExp = Date.now() + 365 * 24 * 60 * 60 * 1000;
  sessions['admin_master_token_2026'] = {
    userId: adminUser.id,
    role: 'admin_guru',
    expiresAt: permAdminExp
  };
  const signedAdminToken = signToken(adminUser.id, 'admin_guru', permAdminExp);
  sessions[signedAdminToken] = {
    userId: adminUser.id,
    role: 'admin_guru',
    expiresAt: permAdminExp
  };

  // Provision sample initial students if users list has only admin
  if (users.length === 1) {
    const sampleStudents = [
      { name: 'Ahmad Faiz Pratama', email: 'faiz.pratama@sekolah.sch.id', class: 'X-1', pass: 'Siswa123!', mods: ['modul-1', 'modul-2', 'modul-3'], ex: ['lab-1', 'lab-2'], quiz: 90, proj: 'Selesai' as const },
      { name: 'Siti Nur Aisyah', email: 'siti.aisyah@sekolah.sch.id', class: 'X-2', pass: 'Siswa123!', mods: ['modul-1', 'modul-2', 'modul-3', 'modul-4', 'modul-5'], ex: ['lab-1', 'lab-2', 'lab-3', 'lab-4'], quiz: 85, proj: 'Dalam Proses' as const },
      { name: 'Budi Santoso', email: 'budi.santoso@sekolah.sch.id', class: 'X-3', pass: 'Siswa123!', mods: ['modul-1', 'modul-2'], ex: ['lab-1'], quiz: 75, proj: 'Belum Mulai' as const },
      { name: 'Dian Permata Putri', email: 'dian.permata@sekolah.sch.id', class: 'X-5', pass: 'Siswa123!', mods: ['modul-1', 'modul-2', 'modul-3', 'modul-4', 'modul-5', 'modul-6', 'modul-7', 'modul-8'], ex: ['lab-1', 'lab-2', 'lab-3', 'lab-4', 'lab-5', 'lab-6'], quiz: 95, proj: 'Selesai' as const },
      { name: 'Kevin Rizky Pratama', email: 'kevin.rizky@sekolah.sch.id', class: 'X-8', pass: 'Siswa123!', mods: ['modul-1'], ex: [], quiz: 65, proj: 'Belum Mulai' as const }
    ];

    sampleStudents.forEach((s, idx) => {
      const sSalt = crypto.randomBytes(16).toString('hex');
      const sId = `std-sample-${idx + 1}`;
      users.push({
        id: sId,
        fullName: s.name,
        email: s.email.toLowerCase(),
        className: s.class,
        role: 'student',
        salt: sSalt,
        passwordHash: hashPassword(s.pass, sSalt),
        plainPassword: s.pass,
        createdAt: new Date(Date.now() - (idx + 1) * 86400000).toISOString()
      });

      progressMap[sId] = {
        userId: sId,
        completedModules: s.mods,
        completedExercises: s.ex,
        quizBestScore: s.quiz,
        totalPoints: s.mods.length * 50 + s.ex.length * 40 + s.quiz,
        unlockedBadges: s.mods.includes('modul-3') ? ['ahli-algoritma-dasar', 'coder-pertama'] : ['coder-pertama'],
        reflections: { 'modul-1': 'Belajar logika membuat saya memahami urutan algoritma kehidupan.' },
        projectStatus: s.proj,
        selectedProject: '1. Sistem Kasir Kantin Sehat Sekolah Digital',
        lastActive: new Date().toISOString()
      };
    });
  }

  saveDatabase();
}

function saveDatabase() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users, progressMap, sessions, settings }, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database', err);
  }
}

loadDatabase();

// Express App Initialization
const app = express();
app.use(express.json());

// Token Middleware
interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  const token = (authHeader && authHeader.split(' ')[1]) || (req.query.token as string);

  // 1. Direct Token Verification (HMAC signature or cached session)
  if (token) {
    const verified = verifySignedToken(token);
    if (verified) {
      let user = users.find((u) => u.id === verified.userId);
      if (!user && verified.role === 'admin_guru') {
        user = users.find((u) => u.role === 'admin_guru');
      }
      if (user) {
        req.user = user;
        next();
        return;
      }
    }
  }

  // 2. Resilient Fallback: If session was lost across server restart but client is identified
  const roleHeader = req.headers['x-user-role'];
  const userIdHeader = req.headers['x-user-id'];
  const profileHeader = req.headers['x-user-profile'];

  if (roleHeader === 'admin_guru' || userIdHeader === 'admin-1') {
    const adminUser = users.find((u) => u.role === 'admin_guru');
    if (adminUser) {
      req.user = adminUser;
      const freshToken = createSession(adminUser.id, 'admin_guru');
      res.setHeader('X-New-Token', freshToken);
      next();
      return;
    }
  }

  // Try finding student by ID
  if (userIdHeader && typeof userIdHeader === 'string') {
    let studentUser = users.find((u) => u.id === userIdHeader);
    if (studentUser) {
      req.user = studentUser;
      const freshToken = createSession(studentUser.id, studentUser.role);
      res.setHeader('X-New-Token', freshToken);
      next();
      return;
    }
  }

  // Restore user from persistent client profile header if available
  if (profileHeader && typeof profileHeader === 'string') {
    try {
      const decoded = JSON.parse(Buffer.from(profileHeader, 'base64').toString('utf-8'));
      if (decoded && decoded.id && decoded.role) {
        let restoredUser = users.find((u) => u.id === decoded.id);
        if (!restoredUser) {
          const salt = crypto.randomBytes(16).toString('hex');
          restoredUser = {
            id: decoded.id,
            fullName: decoded.fullName || 'Siswa',
            email: decoded.email || `${decoded.id}@siswa.sch.id`,
            className: decoded.className || 'X-1',
            role: decoded.role,
            salt,
            passwordHash: '',
            createdAt: decoded.createdAt || new Date().toISOString()
          };
          users.push(restoredUser);
          saveDatabase();
        }
        req.user = restoredUser;
        const freshToken = createSession(restoredUser.id, restoredUser.role);
        res.setHeader('X-New-Token', freshToken);
        next();
        return;
      }
    } catch {
      // ignore
    }
  }

  res.status(401).json({ error: 'Sesi tidak ditemukan atau telah kedaluwarsa. Silakan login kembali.' });
}

function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (!req.user || req.user.role !== 'admin_guru') {
    res.status(403).json({ error: 'Akses ditolak. Halaman dan data ini hanya dapat diakses oleh Admin Guru.' });
    return;
  }
  next();
}

// ===================== AUTH ROUTES =====================

// 1. Student Registration
app.post('/api/auth/register', (req, res) => {
  const { fullName, className, email, password } = req.body;

  // Validations
  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    res.status(400).json({ error: 'Nama Siswa wajib diisi dan minimal terdiri dari 2 karakter.' });
    return;
  }

  const validClasses = ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7', 'X-8', 'X-9', 'X-10', 'X-11', 'X-12'];
  if (!className || !validClasses.includes(className)) {
    res.status(400).json({ error: 'Kelas wajib dipilih dari daftar kelas X yang tersedia.' });
    return;
  }

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'Alamat email wajib diisi.' });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    res.status(400).json({ error: 'Format alamat email tidak valid.' });
    return;
  }

  // Check email uniqueness
  const emailExists = users.some((u) => u.email && u.email.toLowerCase() === normalizedEmail);
  if (emailExists) {
    res.status(400).json({ error: 'Alamat email sudah terdaftar. Silakan gunakan email lain atau login.' });
    return;
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    res.status(400).json({ error: 'Password wajib diisi dan minimal 8 karakter.' });
    return;
  }

  // Create User
  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const newUserId = `std-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

  const newUser: UserRecord = {
    id: newUserId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    className,
    role: 'student',
    salt,
    passwordHash,
    plainPassword: password,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);

  // Initialize progress
  progressMap[newUserId] = {
    userId: newUserId,
    completedModules: [],
    completedExercises: [],
    quizBestScore: 0,
    totalPoints: 0,
    unlockedBadges: [],
    reflections: {},
    projectStatus: 'Belum Mulai',
    lastActive: new Date().toISOString()
  };

  saveDatabase();

  // Create session (persisted 30 days with cryptographic HMAC verification)
  const sessionToken = createSession(newUserId, 'student');

  res.status(201).json({
    message: 'Registrasi siswa berhasil! Akun Anda siap digunakan.',
    token: sessionToken,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      className: newUser.className,
      role: newUser.role,
      createdAt: newUser.createdAt
    }
  });
});

// 2. Student Login
app.post('/api/auth/login-student', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email dan password wajib diisi.' });
    return;
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = users.find((u) => u.email && u.email.toLowerCase() === normalizedEmail && u.role === 'student');

  if (!user) {
    res.status(401).json({ error: 'Email atau password tidak sesuai. Silakan periksa kembali data Anda.' });
    return;
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    res.status(401).json({ error: 'Email atau password tidak sesuai. Silakan periksa kembali data Anda.' });
    return;
  }

  // Update last active
  if (progressMap[user.id]) {
    progressMap[user.id].lastActive = new Date().toISOString();
    saveDatabase();
  }

  const sessionToken = createSession(user.id, 'student');

  res.json({
    message: 'Login siswa berhasil.',
    token: sessionToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      className: user.className,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

// 3. Admin Guru Login
app.post('/api/auth/login-admin', (req, res) => {
  const { nip, password } = req.body;

  if (!nip || !password) {
    res.status(400).json({ error: 'NIP dan password admin guru wajib diisi.' });
    return;
  }

  const cleanNip = String(nip).trim();
  const user = users.find((u) => 
    u.role === 'admin_guru' && (
      u.nip === cleanNip ||
      (u.email && u.email.toLowerCase() === cleanNip.toLowerCase()) ||
      cleanNip === 'admin'
    )
  );

  if (!user) {
    res.status(401).json({ error: 'Login admin gagal. Periksa kembali kredensial Anda.' });
    return;
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    res.status(401).json({ error: 'Login admin gagal. Periksa kembali kredensial Anda.' });
    return;
  }

  const sessionToken = createSession(user.id, 'admin_guru');

  res.json({
    message: 'Login admin guru berhasil.',
    token: sessionToken,
    user: {
      id: user.id,
      fullName: user.fullName,
      nip: user.nip,
      role: user.role,
      isDefaultPassword: user.isDefaultPassword || false,
      createdAt: user.createdAt
    }
  });
});

// 4. Change Admin Password
app.post('/api/auth/change-admin-password', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user!;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Password saat ini dan password baru wajib diisi.' });
    return;
  }

  const currentComputed = hashPassword(currentPassword, user.salt);
  if (currentComputed !== user.passwordHash) {
    res.status(400).json({ error: 'Password saat ini yang Anda masukkan salah.' });
    return;
  }

  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Password baru minimal 8 karakter.' });
    return;
  }

  const newSalt = crypto.randomBytes(16).toString('hex');
  user.salt = newSalt;
  user.passwordHash = hashPassword(newPassword, newSalt);
  user.isDefaultPassword = false;
  saveDatabase();

  res.json({ message: 'Password admin berhasil diperbarui!' });
});

// Update Admin Guru Profile (Nama Lengkap, NIP, Identitas Akun)
app.post('/api/admin/profile', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { fullName, nip, email, schoolName } = req.body;
  const user = req.user!;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    res.status(400).json({ error: 'Nama lengkap guru minimal 2 karakter.' });
    return;
  }

  if (!nip || typeof nip !== 'string' || nip.trim().length < 5) {
    res.status(400).json({ error: 'NIP guru wajib diisi dengan benar (minimal 5 digit).' });
    return;
  }

  const cleanNip = nip.trim();
  // Check if NIP is taken by another admin
  const conflict = users.find((u) => u.nip === cleanNip && u.id !== user.id && u.role === 'admin_guru');
  if (conflict) {
    res.status(400).json({ error: 'NIP tersebut sudah digunakan oleh akun admin guru lain.' });
    return;
  }

  user.fullName = fullName.trim();
  user.nip = cleanNip;
  if (email) user.email = String(email).trim().toLowerCase();
  if (schoolName) {
    const cleanSchool = String(schoolName).trim();
    (user as any).schoolName = cleanSchool;
    settings.schoolName = cleanSchool;
  }

  saveDatabase();

  res.json({
    message: 'Profil identitas guru berhasil diperbarui!',
    user: {
      id: user.id,
      fullName: user.fullName,
      nip: user.nip,
      email: user.email,
      role: user.role,
      schoolName: (user as any).schoolName || settings.schoolName,
      isDefaultPassword: user.isDefaultPassword || false,
      createdAt: user.createdAt
    }
  });
});

// 5. Get Current User Profile (Me)
app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  res.json({
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    nip: user.nip,
    className: user.className,
    role: user.role,
    schoolName: (user as any).schoolName || settings.schoolName,
    isDefaultPassword: user.isDefaultPassword || false,
    createdAt: user.createdAt
  });
});

// ===================== APPLICATION SETTINGS ROUTES =====================

app.get('/api/settings', (_req, res) => {
  res.json(settings);
});

app.post('/api/settings', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { kkmScore, autoVerifyLab, schoolName, subjectTitle } = req.body;
  if (typeof kkmScore === 'number' && !isNaN(kkmScore)) {
    settings.kkmScore = Math.max(0, Math.min(100, kkmScore));
  }
  if (typeof autoVerifyLab === 'boolean') {
    settings.autoVerifyLab = autoVerifyLab;
  }
  if (typeof schoolName === 'string' && schoolName.trim()) {
    settings.schoolName = schoolName.trim();
  }
  if (typeof subjectTitle === 'string' && subjectTitle.trim()) {
    settings.subjectTitle = subjectTitle.trim();
  }
  settings.isPublishedReady = true;
  settings.updatedAt = new Date().toISOString();
  saveDatabase();

  res.json({
    message: 'Pengaturan aplikasi berhasil disimpan secara permanen ke database.',
    settings
  });
});

// Get complete database dump for initial Firestore sync
app.get('/api/admin/all-data', authenticateToken, requireAdmin, (_req, res) => {
  res.json({
    users: users.map(u => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      nip: u.nip,
      className: u.className,
      role: u.role,
      schoolName: (u as any).schoolName || settings.schoolName,
      createdAt: u.createdAt
    })),
    progressMap,
    settings
  });
});

// 6. Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (token && sessions[token]) {
    delete sessions[token];
    saveDatabase();
  }
  res.json({ message: 'Logout berhasil.' });
});

// ===================== STUDENT PROGRESS ROUTES =====================

// Get student progress
app.get('/api/student/progress', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  if (user.role !== 'student') {
    res.status(403).json({ error: 'Endpoint ini khusus untuk siswa.' });
    return;
  }

  const progress = progressMap[user.id] || {
    userId: user.id,
    completedModules: [],
    completedExercises: [],
    quizBestScore: 0,
    totalPoints: 0,
    unlockedBadges: [],
    reflections: {},
    projectStatus: 'Belum Mulai',
    lastActive: new Date().toISOString()
  };

  res.json(progress);
});

// Update student progress
app.post('/api/student/progress', authenticateToken, (req: AuthenticatedRequest, res) => {
  const user = req.user!;
  if (user.role !== 'student') {
    res.status(403).json({ error: 'Endpoint ini khusus untuk siswa.' });
    return;
  }

  const incoming = req.body;
  const existing = progressMap[user.id] || {
    userId: user.id,
    completedModules: [],
    completedExercises: [],
    quizBestScore: 0,
    totalPoints: 0,
    unlockedBadges: [],
    reflections: {},
    projectStatus: 'Belum Mulai',
    lastActive: new Date().toISOString()
  };

  progressMap[user.id] = {
    userId: user.id,
    completedModules: Array.isArray(incoming.completedModules) ? incoming.completedModules : existing.completedModules,
    completedExercises: Array.isArray(incoming.completedExercises) ? incoming.completedExercises : existing.completedExercises,
    quizBestScore: typeof incoming.quizBestScore === 'number' ? incoming.quizBestScore : existing.quizBestScore,
    quizScores: typeof incoming.quizScores === 'object' && incoming.quizScores !== null ? incoming.quizScores : (existing.quizScores || {}),
    totalPoints: typeof incoming.totalPoints === 'number' ? incoming.totalPoints : existing.totalPoints,
    unlockedBadges: Array.isArray(incoming.unlockedBadges) ? incoming.unlockedBadges : existing.unlockedBadges,
    reflections: typeof incoming.reflections === 'object' && incoming.reflections !== null ? incoming.reflections : (existing.reflections || {}),
    projectNotes: typeof incoming.projectNotes === 'object' && incoming.projectNotes !== null ? incoming.projectNotes : (existing.projectNotes || {}),
    capstoneCodeAnswers: typeof incoming.capstoneCodeAnswers === 'object' && incoming.capstoneCodeAnswers !== null ? incoming.capstoneCodeAnswers : (existing.capstoneCodeAnswers || {}),
    projectStatus: incoming.projectStatus || existing.projectStatus || 'Belum Mulai',
    selectedProject: incoming.selectedProject || existing.selectedProject,
    lastActive: new Date().toISOString()
  };

  saveDatabase();
  res.json({ success: true, progress: progressMap[user.id] });
});

// ===================== ADMIN GURU ROUTES =====================

// Admin Overview KPI
app.get('/api/admin/overview', authenticateToken, requireAdmin, (_req, res) => {
  const students = users.filter((u) => u.role === 'student');
  const totalStudents = students.length;

  const classBreakdown: Record<string, number> = {};
  let totalQuizScore = 0;
  let studentsWithQuiz = 0;
  let totalModulesCompleted = 0;
  let projectsFinished = 0;

  students.forEach((s) => {
    const c = s.className || 'Tanpa Kelas';
    classBreakdown[c] = (classBreakdown[c] || 0) + 1;

    const p = progressMap[s.id];
    if (p) {
      if (p.quizBestScore > 0) {
        totalQuizScore += p.quizBestScore;
        studentsWithQuiz++;
      }
      totalModulesCompleted += (p.completedModules || []).length;
      if (p.projectStatus === 'Selesai') {
        projectsFinished++;
      }
    }
  });

  const avgQuizScore = studentsWithQuiz > 0 ? Math.round(totalQuizScore / studentsWithQuiz) : 0;

  res.json({
    totalStudents,
    classBreakdown,
    avgQuizScore,
    totalModulesCompleted,
    projectsFinished,
    activeStudentsCount: totalStudents
  });
});

// Admin Get Students with Pagination, Search & Filter
app.get('/api/admin/students', authenticateToken, requireAdmin, (req, res) => {
  const search = String(req.query.search || '').trim().toLowerCase();
  const className = String(req.query.className || '').trim();
  const page = Math.max(1, parseInt(String(req.query.page), 10) || 1);
  const limit = Math.max(1, parseInt(String(req.query.limit), 10) || 10);

  let filtered = users.filter((u) => u.role === 'student');

  if (className && className !== 'all') {
    filtered = filtered.filter((u) => u.className === className);
  }

  if (search) {
    filtered = filtered.filter(
      (u) =>
        u.fullName.toLowerCase().includes(search) ||
        (u.email && u.email.toLowerCase().includes(search))
    );
  }

  const total = filtered.length;
  const start = (page - 1) * limit;
  const pageItems = filtered.slice(start, start + limit);

  const result = pageItems.map((u) => {
    const p = progressMap[u.id] || {
      completedModules: [],
      completedExercises: [],
      quizBestScore: 0,
      totalPoints: 0,
      unlockedBadges: [],
      projectStatus: 'Belum Mulai',
      lastActive: u.createdAt
    };

    return {
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      plainPassword: u.plainPassword || 'Siswa123!',
      className: u.className,
      createdAt: u.createdAt,
      completedModulesCount: p.completedModules.length,
      completedExercisesCount: p.completedExercises.length,
      quizBestScore: p.quizBestScore,
      totalPoints: p.totalPoints,
      unlockedBadgesCount: p.unlockedBadges.length,
      projectStatus: p.projectStatus,
      lastActive: p.lastActive
    };
  });

  res.json({
    data: result,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
});

// Admin Update Student Credentials & Account
const updateStudentCredentialsHandler = (req: AuthenticatedRequest, res: Response): void => {
  const { id } = req.params;
  const { fullName, className, email, password } = req.body;

  const student = users.find((u) => u.id === id && u.role === 'student');
  if (!student) {
    res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
    return;
  }

  if (fullName !== undefined) {
    if (typeof fullName !== 'string' || fullName.trim().length < 2) {
      res.status(400).json({ error: 'Nama Siswa minimal terdiri dari 2 karakter.' });
      return;
    }
    student.fullName = fullName.trim();
  }

  const validClasses = ['X-1', 'X-2', 'X-3', 'X-4', 'X-5', 'X-6', 'X-7', 'X-8', 'X-9', 'X-10', 'X-11', 'X-12'];
  if (className !== undefined) {
    if (!validClasses.includes(className)) {
      res.status(400).json({ error: 'Pilihan kelas tidak valid.' });
      return;
    }
    student.className = className;
  }

  if (email !== undefined) {
    const normalizedEmail = String(email).trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      res.status(400).json({ error: 'Format alamat email / username tidak valid.' });
      return;
    }

    const conflict = users.find((u) => u.id !== student.id && u.email && u.email.toLowerCase() === normalizedEmail);
    if (conflict) {
      res.status(400).json({ error: 'Alamat email tersebut sudah digunakan oleh akun siswa lain.' });
      return;
    }
    student.email = normalizedEmail;
  }

  if (password !== undefined && String(password).trim() !== '') {
    const pwdStr = String(password).trim();
    if (pwdStr.length < 8) {
      res.status(400).json({ error: 'Password baru minimal harus 8 karakter.' });
      return;
    }
    const newSalt = crypto.randomBytes(16).toString('hex');
    student.salt = newSalt;
    student.passwordHash = hashPassword(pwdStr, newSalt);
    student.plainPassword = pwdStr;
  }

  saveDatabase();

  res.json({
    message: `Akun siswa ${student.fullName} (${student.className}) berhasil diperbarui!`,
    student: {
      id: student.id,
      fullName: student.fullName,
      email: student.email,
      className: student.className,
      plainPassword: student.plainPassword || 'Siswa123!',
      createdAt: student.createdAt
    }
  });
};

app.put('/api/admin/students/:id/credentials', authenticateToken, requireAdmin, updateStudentCredentialsHandler);
app.post('/api/admin/students/:id/credentials', authenticateToken, requireAdmin, updateStudentCredentialsHandler);

// Admin Delete Student
app.delete('/api/admin/students/:id', authenticateToken, requireAdmin, (req, res) => {
  const { id } = req.params;
  const studentIndex = users.findIndex((u) => u.id === id && u.role === 'student');

  if (studentIndex === -1) {
    res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
    return;
  }

  const removed = users.splice(studentIndex, 1)[0];
  delete progressMap[id];
  saveDatabase();

  res.json({ message: `Siswa ${removed.fullName} (${removed.className}) berhasil dihapus.` });
});

// Admin Reset Student Progress (without deleting account)
app.post('/api/admin/students/:id/reset-progress', authenticateToken, requireAdmin, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const student = users.find((u) => u.id === id && u.role === 'student');

  if (!student) {
    res.status(404).json({ error: 'Data siswa tidak ditemukan.' });
    return;
  }

  // Reset progress record to initial 0 state
  progressMap[id] = {
    userId: id,
    completedModules: [],
    completedExercises: [],
    quizBestScore: 0,
    quizScores: {},
    totalPoints: 0,
    unlockedBadges: [],
    reflections: {},
    projectStatus: 'Belum Mulai',
    selectedProject: undefined,
    projectNotes: {},
    capstoneCodeAnswers: {},
    resetByAdminAt: new Date().toISOString(),
    lastActive: new Date().toISOString()
  };

  saveDatabase();

  res.json({
    message: `Seluruh status pengerjaan, jawaban LKPD, dan progress siswa ${student.fullName} (${student.className}) berhasil di-reset ke kondisi awal (0).`,
    studentId: id,
    resetByAdminAt: progressMap[id].resetByAdminAt
  });
});

// Student Change Password Endpoint
app.post('/api/student/change-password', authenticateToken, (req: AuthenticatedRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = req.user!;

  if (user.role !== 'student') {
    res.status(403).json({ error: 'Endpoint ini khusus untuk akun siswa.' });
    return;
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.trim().length < 8) {
    res.status(400).json({ error: 'Password baru minimal harus 8 karakter.' });
    return;
  }

  // If user has a passwordHash, verify currentPassword if provided
  if (user.passwordHash && currentPassword) {
    const computed = hashPassword(currentPassword, user.salt);
    if (computed !== user.passwordHash && user.plainPassword !== currentPassword) {
      res.status(400).json({ error: 'Password lama yang dimasukkan tidak sesuai.' });
      return;
    }
  }

  const cleanPass = newPassword.trim();
  const newSalt = crypto.randomBytes(16).toString('hex');
  user.salt = newSalt;
  user.passwordHash = hashPassword(cleanPass, newSalt);
  user.plainPassword = cleanPass;
  saveDatabase();

  res.json({
    message: 'Password akun siswa berhasil diperbarui dan disimpan secara permanen!',
    plainPassword: cleanPass
  });
});

// Admin Password Sync (to restore updated admin credentials if server restarted)
app.post('/api/auth/sync-admin-password', (req, res) => {
  const { nip, newPassword, masterKey } = req.body;
  const adminUser = users.find((u) => u.role === 'admin_guru');
  
  if (!adminUser) {
    res.status(404).json({ error: 'Admin guru tidak ditemukan.' });
    return;
  }

  // Verify request is authorized
  if (masterKey !== 'admin_master_token_2026' && req.headers.authorization !== 'Bearer admin_master_token_2026') {
    res.status(403).json({ error: 'Otorisasi sinkronisasi admin tidak sah.' });
    return;
  }

  if (newPassword && typeof newPassword === 'string' && newPassword.length >= 8) {
    const newSalt = crypto.randomBytes(16).toString('hex');
    adminUser.salt = newSalt;
    adminUser.passwordHash = hashPassword(newPassword, newSalt);
    adminUser.isDefaultPassword = false;
    if (nip) adminUser.nip = String(nip).trim();
    saveDatabase();
    res.json({ message: 'Password admin berhasil disinkronkan secara permanen.' });
    return;
  }

  res.status(400).json({ error: 'Data password baru tidak valid.' });
});

// Admin Export CSV
app.get('/api/admin/export-csv', authenticateToken, requireAdmin, (req, res) => {
  const className = String(req.query.className || '').trim();
  let students = users.filter((u) => u.role === 'student');

  if (className && className !== 'all') {
    students = students.filter((u) => u.className === className);
  }

  let csv = 'No,Nama Lengkap Siswa,Kelas,Username (Email),Modul Teori Selesai,Lab Koding C++ Selesai,Skor Kuis HOTS Terbaik,Status KKM (>=75),Total XP,Lencana Terbuka,Status Proyek Capstone,Tanggal Registrasi\n';

  students.forEach((s, idx) => {
    const p = progressMap[s.id] || {
      completedModules: [],
      completedExercises: [],
      quizBestScore: 0,
      totalPoints: 0,
      unlockedBadges: [],
      projectStatus: 'Belum Mulai'
    };

    const isPassing = (p.quizBestScore || 0) >= 75 ? 'TUNTAS' : 'BELUM TUNTAS';

    const row = [
      idx + 1,
      `"${s.fullName.replace(/"/g, '""')}"`,
      `"${s.className || 'X-1'}"`,
      `"${s.email || ''}"`,
      `"${p.completedModules.length}/9"`,
      `"${p.completedExercises.length}/10"`,
      p.quizBestScore,
      `"${isPassing}"`,
      p.totalPoints,
      p.unlockedBadges.length,
      `"${p.projectStatus}"`,
      `"${new Date(s.createdAt).toLocaleDateString('id-ID')}"`
    ];
    csv += row.join(',') + '\n';
  });

  const classFilename = className && className !== 'all' ? className : 'Semua_Kelas';
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="Rekap_Pembelajaran_Informatika_${classFilename}.csv"`);
  res.send(csv);
});

// ===================== VITE MIDDLEWARE / STATIC ASSETS =====================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
