const PROFILE_KEY_PREFIX = "vellum:user-name:";
const ACTIVE_USER_NAME_KEY = "vellum:active-user-name";
const ACTIVE_SESSION_KEY = "vellum:active-session";

function getProfileKey(email) {
  return `${PROFILE_KEY_PREFIX}${email.trim().toLowerCase()}`;
}

export function rememberUserName(name, email) {
  const normalizedName = name.trim();
  const profileKey = getProfileKey(email);

  localStorage.setItem(profileKey, normalizedName);
  localStorage.setItem(ACTIVE_USER_NAME_KEY, normalizedName);
  sessionStorage.setItem(ACTIVE_SESSION_KEY, "true");
}

export function rememberLoggedInUser(email) {
  const name = localStorage.getItem(getProfileKey(email));

  if (!name) return false;

  localStorage.setItem(ACTIVE_USER_NAME_KEY, name);
  sessionStorage.setItem(ACTIVE_SESSION_KEY, "true");
  return true;
}

export function getActiveUserName() {
  return localStorage.getItem(ACTIVE_USER_NAME_KEY) || "";
}

export function hasActiveUserSession() {
  return sessionStorage.getItem(ACTIVE_SESSION_KEY) === "true";
}

export function endUserSession() {
  sessionStorage.removeItem(ACTIVE_SESSION_KEY);
  localStorage.removeItem(ACTIVE_USER_NAME_KEY);
}
