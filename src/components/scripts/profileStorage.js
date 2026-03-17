export const PROFILE_KEY = "apnidisha_student_profile";

export function saveProfileToStorage(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function loadProfileFromStorage() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearProfileStorage() {
  localStorage.removeItem(PROFILE_KEY);
}
