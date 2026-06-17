import { API_BASE_URL } from "../api/api.js";

const AUTH_CACHE_TTL_MS = 30 * 1000;

let authUserCache = null;
let authUserCachedAt = 0;
let authUserRequestPromise = null;

// =========================
// 유효한 로그인 사용자 여부 확인 함수
// =========================
function isValidUser(user) {
  if (!user) return false;

  if (user === "anonymousUser") return false;

  if (typeof user !== "object") return false;

  return Boolean(
    user.id || user.email || user.spotifyId || user.displayName || user.name,
  );
}

function getCachedUser() {
  if (!authUserCache) return null;

  const cacheAge = Date.now() - authUserCachedAt;

  if (cacheAge > AUTH_CACHE_TTL_MS) {
    authUserCache = null;
    authUserCachedAt = 0;
    return null;
  }

  return authUserCache;
}

export function clearAuthCache() {
  authUserCache = null;
  authUserCachedAt = 0;
  authUserRequestPromise = null;
}

// =========================
// 현재 로그인 사용자 조회 함수
// =========================
export async function getCurrentUser({ force = false } = {}) {
  if (!force) {
    const cachedUser = getCachedUser();

    if (cachedUser) {
      return cachedUser;
    }

    if (authUserRequestPromise) {
      return authUserRequestPromise;
    }
  }

  authUserRequestPromise = (async () => {
    const response = await fetch(`${API_BASE_URL}/api/user`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      clearAuthCache();
      return null;
    }

    const user = await response.json();

    if (!isValidUser(user)) {
      clearAuthCache();
      return null;
    }

    authUserCache = user;
    authUserCachedAt = Date.now();

    return user;
  })();

  try {
    return await authUserRequestPromise;
  } catch (error) {
    clearAuthCache();
    throw error;
  } finally {
    authUserRequestPromise = null;
  }
}

// =========================
// 로그인 여부 확인 함수
// =========================
export async function isLoggedIn() {
  try {
    const user = await getCurrentUser();

    return Boolean(user);
  } catch (error) {
    console.error("로그인 확인 실패:", error);
    return false;
  }
}

// =========================
// 로그인 페이지 이동 함수
// =========================
export function moveToLogin() {
  window.location.href = `${API_BASE_URL}/oauth2/authorization/spotify`;
}

// =========================
// 로그인 필요 처리 함수
// =========================
export async function requireLogin(message = "로그인 후 이용할 수 있습니다.") {
  const loggedIn = await isLoggedIn();

  if (loggedIn) {
    return true;
  }

  alert(message);
  moveToLogin();

  return false;
}
