import { useState, useEffect } from 'react';

/**
 * Storage keys catalog for centralized, collision-free LocalStorage management
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'informatika_auth_token_v1',
  CACHED_USER: 'informatika_cached_user_v1',
  AUTH_VIEW: 'informatika_auth_view_v1',
  ACTIVE_TAB: 'informatika_active_tab_v1',
  SELECTED_MODULE_ID: 'informatika_selected_module_id_v1',
  STUDENT_PROGRESS: 'informatika_fase_e_progress_v2',
  CODELAB_STATE: 'informatika_codelab_state_v1',
  QUIZ_STATE: 'informatika_quiz_state_v1',
  PROJECTS_STATE: 'informatika_projects_state_v1',
  VISUALIZER_STATE: 'informatika_visualizer_state_v1',
  ADMIN_DASHBOARD_STATE: 'informatika_admin_dashboard_state_v1',
  TASK_RECAP_STATE: 'informatika_task_recap_state_v1',
  TEACHER_GUIDE_STATE: 'informatika_teacher_guide_state_v1',
  MODULE_DRAFTS: 'informatika_module_drafts_v1',
  ADMIN_CREDENTIALS: 'informatika_admin_credentials_v2',
  ADMIN_STUDENTS_CACHE: 'informatika_admin_students_cache_v2',
  ADMIN_OVERVIEW_CACHE: 'informatika_admin_overview_cache_v2',
  STUDENT_CREDENTIALS_BACKUP: 'informatika_student_credentials_backup_v1',
  LAST_PROGRESS_RESET: 'informatika_last_progress_reset_v1'
} as const;

/**
 * Safely read and parse data from LocalStorage with a guaranteed fallback value.
 * Never throws exceptions, even on corrupted JSON or storage restrictions.
 */
export function safeGet<T>(key: string, fallbackValue: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallbackValue;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null || raw === undefined || raw === '') {
      return fallbackValue;
    }
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? (parsed as T) : fallbackValue;
  } catch (err) {
    console.warn(`[Storage] Failed to parse key "${key}", using fallback:`, err);
    return fallbackValue;
  }
}

/**
 * Safely stringify and write data to LocalStorage with error catching.
 */
export function safeSet<T>(key: string, value: T): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
  } catch (err) {
    console.warn(`[Storage] Failed to save key "${key}":`, err);
  }
}

/**
 * Safely remove an item from LocalStorage.
 */
export function safeRemove(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to remove key "${key}":`, err);
  }
}

/**
 * React hook that connects any state to browser LocalStorage with automatic load on mount
 * and automatic save on state changes.
 */
export function usePersistentState<T>(
  key: string,
  fallbackValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Initialize state once from LocalStorage or fallback
  const [state, setState] = useState<T>(() => safeGet<T>(key, fallbackValue));

  // Auto-save whenever state changes
  useEffect(() => {
    safeSet<T>(key, state);
  }, [key, state]);

  return [state, setState];
}
