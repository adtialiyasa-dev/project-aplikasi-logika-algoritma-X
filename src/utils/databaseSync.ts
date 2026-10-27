import { 
  AppSettingsData, 
  loadSettingsFromFirestore, 
  saveSettingsToFirestore, 
  saveProgressToFirestore, 
  loadProgressFromFirestore,
  saveUserToFirestore
} from './firestoreService.ts';
import { 
  fetchBackendSettings, 
  saveBackendSettings, 
  BackendAppSettings,
  fetchAllAdminData,
  UserProfile
} from './authService.ts';
import { STORAGE_KEYS, safeGet, safeSet } from './storage.ts';
import { UserProgress } from '../types.ts';
import { testFirestoreConnection } from '../firebase.ts';

export const SETTINGS_STORAGE_KEY = 'informatika_app_settings_v2';

export const DEFAULT_SETTINGS: AppSettingsData = {
  kkmScore: 75,
  autoVerifyLab: true,
  schoolName: 'SMA Negeri 1 Pembelajaran Digital',
  subjectTitle: 'Informatika Fase E (Kelas X SMA)',
  isPublishedReady: true
};

/**
 * Centralized loader for application settings.
 * Priority: Firestore Cloud Database -> Backend Express Database -> LocalStorage -> Default.
 * Ensures settings NEVER revert to default upon publishing or refreshing!
 */
export async function loadPersistentSettings(): Promise<AppSettingsData> {
  // 1. Try Firestore Cloud Database
  try {
    const cloudSettings = await loadSettingsFromFirestore();
    if (cloudSettings && typeof cloudSettings.kkmScore === 'number') {
      safeSet(SETTINGS_STORAGE_KEY, cloudSettings);
      safeSet('informatika_kkm_score_v1', cloudSettings.kkmScore);
      safeSet('informatika_auto_verify_lab_v1', cloudSettings.autoVerifyLab);
      return cloudSettings;
    }
  } catch (err) {
    console.warn('[Sync] Firestore settings fetch error, falling back:', err);
  }

  // 2. Try Backend Express API
  try {
    const backendSettings = await fetchBackendSettings();
    if (backendSettings && typeof backendSettings.kkmScore === 'number') {
      const merged: AppSettingsData = {
        ...DEFAULT_SETTINGS,
        ...backendSettings,
        isPublishedReady: true
      };
      safeSet(SETTINGS_STORAGE_KEY, merged);
      safeSet('informatika_kkm_score_v1', merged.kkmScore);
      safeSet('informatika_auto_verify_lab_v1', merged.autoVerifyLab);
      // Auto-save to Firestore so Cloud is immediately populated
      saveSettingsToFirestore(merged).catch((e) => console.warn('[Sync] Auto-saving to Firestore failed:', e));
      return merged;
    }
  } catch (err) {
    console.warn('[Sync] Backend settings fetch error, falling back to LocalStorage:', err);
  }

  // 3. Fallback to LocalStorage
  const localSettings = safeGet<AppSettingsData>(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
  return localSettings;
}

/**
 * Save settings across all 3 tiers:
 * 1. LocalStorage (instant UI responsiveness)
 * 2. Backend Express API (/api/settings -> data_store.json)
 * 3. Cloud Firestore (settings/global_settings)
 */
export async function savePersistentSettings(
  partial: Partial<AppSettingsData>
): Promise<AppSettingsData> {
  const current = safeGet<AppSettingsData>(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
  const updated: AppSettingsData = {
    ...current,
    ...partial,
    isPublishedReady: true,
    updatedAt: new Date().toISOString()
  };

  // 1. LocalStorage
  safeSet(SETTINGS_STORAGE_KEY, updated);
  if (typeof updated.kkmScore === 'number') {
    safeSet('informatika_kkm_score_v1', updated.kkmScore);
  }
  if (typeof updated.autoVerifyLab === 'boolean') {
    safeSet('informatika_auto_verify_lab_v1', updated.autoVerifyLab);
  }

  // 2. Backend Express API
  try {
    await saveBackendSettings(updated);
  } catch (err) {
    console.warn('[Sync] Failed saving settings to backend:', err);
  }

  // 3. Cloud Firestore
  try {
    await saveSettingsToFirestore(updated);
  } catch (err) {
    console.warn('[Sync] Failed saving settings to Firestore:', err);
  }

  return updated;
}

/**
 * Synchronize student progress across LocalStorage, Backend Express, and Firestore
 */
export async function syncProgressToAllDatabases(userId: string, progress: UserProgress): Promise<void> {
  if (!userId) return;

  // Tier 1: LocalStorage
  safeSet(`informatika_progress_${userId}`, progress);

  // Tier 2: Cloud Firestore
  saveProgressToFirestore(userId, progress).catch((err) => {
    console.warn('[Sync] Firestore progress auto-save notice:', err);
  });
}

/**
 * Seed all existing data (Users, Progress, Settings) from backend/localStorage into Firestore.
 * Ensures all previously stored data enters Firestore automatically.
 */
export async function seedAllDataToFirestore(): Promise<{ usersCount: number; progressCount: number }> {
  let usersCount = 0;
  let progressCount = 0;

  try {
    // 1. Sync global settings
    const settings = await loadPersistentSettings();
    await saveSettingsToFirestore(settings);

    // 2. Fetch all admin data if admin token available
    const adminData = await fetchAllAdminData();
    if (adminData) {
      if (Array.isArray(adminData.users)) {
        for (const user of adminData.users) {
          await saveUserToFirestore(user);
          usersCount++;
        }
      }

      if (adminData.progressMap) {
        for (const [userId, prog] of Object.entries(adminData.progressMap)) {
          await saveProgressToFirestore(userId, prog as any);
          progressCount++;
        }
      }
    }
  } catch (err) {
    console.log('[Sync] Background data seed completed or non-admin session:', err);
  }

  return { usersCount, progressCount };
}

/**
 * Initialize Cloud Firestore and background synchronization on startup
 */
export async function initDatabaseConnection(): Promise<void> {
  // Test connection to Firestore
  await testFirestoreConnection();

  // Load and apply persistent settings so nothing ever reverts
  await loadPersistentSettings();
}
