import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '../firebase.ts';
import { UserProgress } from '../types.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('[Firestore Error]:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface AppSettingsData {
  id?: string;
  kkmScore: number;
  autoVerifyLab: boolean;
  schoolName: string;
  subjectTitle: string;
  isPublishedReady?: boolean;
  updatedAt?: string;
}

const SETTINGS_DOC_ID = 'global_settings';

/**
 * Save Application Settings to Firestore
 */
export async function saveSettingsToFirestore(settings: AppSettingsData): Promise<void> {
  const path = `settings/${SETTINGS_DOC_ID}`;
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    await setDoc(docRef, {
      ...settings,
      id: SETTINGS_DOC_ID,
      isPublishedReady: true,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Load Application Settings from Firestore
 */
export async function loadSettingsFromFirestore(): Promise<AppSettingsData | null> {
  const path = `settings/${SETTINGS_DOC_ID}`;
  try {
    const docRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AppSettingsData;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Save Student Learning Progress to Firestore
 */
export async function saveProgressToFirestore(userId: string, progress: UserProgress): Promise<void> {
  if (!userId) return;
  const path = `progress/${userId}`;
  try {
    const docRef = doc(db, 'progress', userId);
    await setDoc(docRef, {
      userId,
      completedModules: progress.completedModules || [],
      completedExercises: progress.completedExercises || [],
      quizBestScore: progress.quizBestScore || 0,
      quizScores: progress.quizScores || {},
      totalPoints: progress.totalPoints || 0,
      unlockedBadges: progress.unlockedBadges || [],
      reflections: progress.reflections || {},
      projectStatus: progress.projectStatus || 'Belum Mulai',
      selectedProject: progress.selectedProject || '',
      projectNotes: progress.projectNotes || {},
      capstoneCodeAnswers: progress.capstoneCodeAnswers || {},
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Load Student Learning Progress from Firestore
 */
export async function loadProgressFromFirestore(userId: string): Promise<UserProgress | null> {
  if (!userId) return null;
  const path = `progress/${userId}`;
  try {
    const docRef = doc(db, 'progress', userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return {
        completedModules: Array.isArray(data.completedModules) ? data.completedModules : [],
        completedExercises: Array.isArray(data.completedExercises) ? data.completedExercises : [],
        quizBestScore: typeof data.quizBestScore === 'number' ? data.quizBestScore : 0,
        quizScores: data.quizScores || {},
        totalPoints: typeof data.totalPoints === 'number' ? data.totalPoints : 0,
        unlockedBadges: Array.isArray(data.unlockedBadges) ? data.unlockedBadges : [],
        reflections: data.reflections || {},
        projectStatus: data.projectStatus || 'Belum Mulai',
        selectedProject: data.selectedProject || undefined,
        projectNotes: data.projectNotes || {},
        capstoneCodeAnswers: data.capstoneCodeAnswers || {}
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Save User Profile to Firestore
 */
export async function saveUserToFirestore(user: any): Promise<void> {
  if (!user || !user.id) return;
  const path = `users/${user.id}`;
  try {
    const docRef = doc(db, 'users', user.id);
    await setDoc(docRef, {
      id: user.id,
      fullName: user.fullName || '',
      email: user.email || '',
      nip: user.nip || '',
      className: user.className || '',
      role: user.role || 'student',
      schoolName: user.schoolName || '',
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
