import { user } from "../../../data.js";
import { API_ENDPOINTS } from "../api/api.js";
import { escapeHTML } from "../utils/escapeHTML.js";

const SPOTIFY_LOGO_URL =
  "https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_RGB_Black.png";

// =========================
// 헤더 뒤로 / 앞으로 아이콘 경로
// =========================
const NAV_ICON_PATHS = {
  back: "/assets/icon/Back.svg",
  backDisabled: "/assets/icon/Back-disabled.svg",
  forward: "/assets/icon/Forward.svg",
  forwardDisabled: "/assets/icon/Forward-disabled.svg",
};

const NAV_HISTORY_STORAGE_KEY = "moodwave-nav-history";
const MAX_NAV_HISTORY_ITEMS = 80;

// =========================
// 헤더 HTML 렌더링 함수
// =========================
export function renderHeader() {
  return `
    <!-- 모바일 / 태블릿 햄버거 버튼 -->
    <button
      data-open-sidebar
      id="mobileMenuBtn"
      class="header__hamburger-btn"
      type="button"
      aria-label="사이드바 열기"
      aria-expanded="false"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>

    <!-- 메뉴 버튼 -->
    <button
      id="backBtn"
      class="header__nav-btn"
      type="button"
      aria-label="뒤로"
      aria-disabled="true"
      disabled
    >
      <img
        id="backBtnIcon"
        src="${NAV_ICON_PATHS.backDisabled}"
        width="40"
        height="40"
        alt=""
      />
    </button>

    <button
      id="forwardBtn"
      class="header__nav-btn"
      type="button"
      aria-label="앞으로"
      aria-disabled="true"
      disabled
    >
      <img
        id="forwardBtnIcon"
        src="${NAV_ICON_PATHS.forwardDisabled}"
        width="40"
        height="40"
        alt=""
      />
    </button>

    <!-- 검색창 -->
    <form class="header__search" role="search">
      <img
        class="header__search-icon"
        src="/assets/icon/Search_S.svg"
        width="32"
        height="32"
        alt=""
      />

      <input
        class="header__search-input"
        type="search"
        placeholder="Artists, songs, or podcasts"
      />
    </form>

    <span class="header__spacer" aria-hidden="true"></span>

    <!-- 로그인 / 프로필 영역 -->
    <div id="headerAuth" class="header__auth"></div>
  `;
}

// =========================
// Spotify 로그인 URL 생성 함수
// =========================
function getSpotifyLoginUrl() {
  const redirectUrl = window.location.href;

  return `${API_ENDPOINTS.spotifyLogin}?redirect=${encodeURIComponent(redirectUrl)}`;
}

// =========================
// 로그아웃 URL 생성 함수
// =========================
function getLogoutUrl() {
  const redirectUrl = window.location.href;

  return `${API_ENDPOINTS.logout}?redirect=${encodeURIComponent(redirectUrl)}`;
}

// =========================
// Spotify 연동 버튼 렌더링 함수
// =========================
function renderSpotifyConnectButton() {
  const headerAuth = document.querySelector("#headerAuth");
  if (!headerAuth) return;

  headerAuth.innerHTML = `
    <button id="spotifyConnectBtn" class="spotify-connect-btn" type="button">
      <img
        class="spotify-connect-btn__logo"
        src="${SPOTIFY_LOGO_URL}"
        alt="Spotify"
      />
      <strong>연동</strong>
    </button>
  `;

  const spotifyConnectBtn = document.querySelector("#spotifyConnectBtn");
  if (!spotifyConnectBtn) return;

  spotifyConnectBtn.addEventListener("click", () => {
    spotifyConnectBtn.disabled = true;

    spotifyConnectBtn.innerHTML = `
      <img
        class="spotify-connect-btn__logo"
        src="${SPOTIFY_LOGO_URL}"
        alt="Spotify"
      />
      <strong>연동 중...</strong>
    `;

    window.location.href = getSpotifyLoginUrl();
  });
}

// =========================
// Spotify 프로필 렌더링 함수
// =========================
function renderSpotifyProfile(data) {
  const headerAuth = document.querySelector("#headerAuth");
  if (!headerAuth) return;

  const avatar = data.avatar || user.avatar;
  const name = data.name || user.name;

  headerAuth.innerHTML = `
    <div class="header__profile">
      <img
        id="userAvatar"
        class="header__user-avatar"
        src="${escapeHTML(avatar)}"
        width="34"
        height="34"
        alt=""
      />

      <span id="userName" class="header__user-name">
        ${escapeHTML(name)}
      </span>

      <button
        class="header__profile-arrow-btn"
        type="button"
        aria-label="프로필 메뉴 열기"
      >
        <span class="header__profile-arrow" aria-hidden="true"></span>
      </button>

      <div class="header__dropdown">
        <button class="header__logout-btn" type="button">Logout</button>
      </div>
    </div>
  `;

  initProfileDropdown();
  initLogoutButton();
}

// =========================
// 유저 정보 요청 함수
// =========================
async function fetchUser() {
  const response = await fetch(API_ENDPOINTS.user, {
    method: "GET",
    credentials: "include",
  });

  if (response.ok) {
    return response.json();
  }

  if (response.status === 401) {
    throw new Error("UNAUTHORIZED");
  }

  throw new Error("NETWORK_ERROR");
}

// =========================
// 유저 렌더링 함수
// =========================
async function renderUser() {
  try {
    const data = await fetchUser();

    if (data && data.isLoggedIn) {
      renderSpotifyProfile(data);
    } else {
      renderSpotifyConnectButton();
    }
  } catch (error) {
    console.error("인증 정보를 가져오는 데 실패했습니다:", error);
    renderSpotifyConnectButton();
  }
}

// =========================
// 로그아웃 함수
// =========================
function logout(event) {
  event.preventDefault();
  event.stopPropagation();

  alert("로그아웃 되었습니다.");

  window.location.href = getLogoutUrl();
}

// =========================
// 로그아웃 버튼 초기화 함수
// =========================
function initLogoutButton() {
  const logoutBtn = document.querySelector(".header__logout-btn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", logout);
}

// =========================
// 프로필 드롭다운 함수
// =========================
function initProfileDropdown() {
  const profile = document.querySelector(".header__profile");
  const profileArrowButton = document.querySelector(
    ".header__profile-arrow-btn",
  );

  if (!profile || !profileArrowButton) return;

  profileArrowButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    profile.classList.toggle("is-open");
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof Element)) return;

    const isClickInsideProfile = profile.contains(target);

    if (!isClickInsideProfile) {
      profile.classList.remove("is-open");
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    profile.classList.remove("is-open");
  });
}

// =========================
// 검색창 기능 함수
// =========================
function initSearchForm() {
  const searchForm = document.querySelector(".header__search");
  const searchInput = document.querySelector(".header__search-input");

  if (!searchForm || !searchInput) return;

  let searchTimer = null;

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = searchInput.value.trim();

    if (!keyword) return;

    clearTimeout(searchTimer);
    location.hash = `#/search?q=${encodeURIComponent(keyword)}`;
  });

  searchInput.addEventListener("input", (event) => {
    const keyword = event.target.value.trim();

    clearTimeout(searchTimer);

    searchTimer = setTimeout(() => {
      if (!keyword) return;

      location.hash = `#/search?q=${encodeURIComponent(keyword)}`;
    }, 700);
  });
}

// =========================
// 현재 페이지 주소 키 생성 함수
// =========================
function getCurrentHistoryKey() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

// =========================
// 저장된 이동 기록 읽기 함수
// =========================
function readNavHistory() {
  const currentKey = getCurrentHistoryKey();

  try {
    const savedHistory = JSON.parse(
      sessionStorage.getItem(NAV_HISTORY_STORAGE_KEY),
    );

    if (
      !savedHistory ||
      !Array.isArray(savedHistory.entries) ||
      typeof savedHistory.index !== "number"
    ) {
      throw new Error("INVALID_HISTORY");
    }

    const safeEntries = savedHistory.entries.filter(Boolean);
    const safeIndex = Math.min(
      Math.max(savedHistory.index, 0),
      safeEntries.length - 1,
    );

    if (!safeEntries.length) {
      throw new Error("EMPTY_HISTORY");
    }

    return {
      entries: safeEntries,
      index: safeIndex,
    };
  } catch {
    return {
      entries: [currentKey],
      index: 0,
    };
  }
}

// =========================
// 이동 기록 저장 함수
// =========================
function saveNavHistory(historyState) {
  sessionStorage.setItem(NAV_HISTORY_STORAGE_KEY, JSON.stringify(historyState));
}

// =========================
// 이동 기록 동기화 함수
// =========================
function syncNavHistory() {
  const currentKey = getCurrentHistoryKey();
  const historyState = readNavHistory();

  const currentEntry = historyState.entries[historyState.index];

  if (currentEntry === currentKey) {
    saveNavHistory(historyState);
    return historyState;
  }

  const prevEntry = historyState.entries[historyState.index - 1];
  const nextEntry = historyState.entries[historyState.index + 1];

  if (prevEntry === currentKey) {
    historyState.index -= 1;
  } else if (nextEntry === currentKey) {
    historyState.index += 1;
  } else {
    historyState.entries = historyState.entries.slice(
      0,
      historyState.index + 1,
    );

    historyState.entries.push(currentKey);
    historyState.index = historyState.entries.length - 1;

    if (historyState.entries.length > MAX_NAV_HISTORY_ITEMS) {
      const overflowCount = historyState.entries.length - MAX_NAV_HISTORY_ITEMS;

      historyState.entries = historyState.entries.slice(overflowCount);
      historyState.index = historyState.entries.length - 1;
    }
  }

  saveNavHistory(historyState);
  return historyState;
}

// =========================
// 뒤로 / 앞으로 버튼 상태 변경 함수
// =========================
function setNavButtonState(button, icon, isEnabled, activeSrc, disabledSrc) {
  button.disabled = !isEnabled;
  button.setAttribute("aria-disabled", String(!isEnabled));

  icon.src = isEnabled ? activeSrc : disabledSrc;
}

// =========================
// 뒤로 / 앞으로 버튼 아이콘 업데이트 함수
// =========================
function updateHistoryButtons() {
  const backBtn = document.querySelector("#backBtn");
  const forwardBtn = document.querySelector("#forwardBtn");
  const backBtnIcon = document.querySelector("#backBtnIcon");
  const forwardBtnIcon = document.querySelector("#forwardBtnIcon");

  if (!backBtn || !forwardBtn || !backBtnIcon || !forwardBtnIcon) return;

  const historyState = syncNavHistory();

  const canGoBack = historyState.index > 0;
  const canGoForward = historyState.index < historyState.entries.length - 1;

  setNavButtonState(
    backBtn,
    backBtnIcon,
    canGoBack,
    NAV_ICON_PATHS.back,
    NAV_ICON_PATHS.backDisabled,
  );

  setNavButtonState(
    forwardBtn,
    forwardBtnIcon,
    canGoForward,
    NAV_ICON_PATHS.forward,
    NAV_ICON_PATHS.forwardDisabled,
  );
}

// =========================
// 뒤로가기 / 앞으로가기 버튼 기능 함수
// =========================
function initHistoryButtons() {
  const backBtn = document.querySelector("#backBtn");
  const forwardBtn = document.querySelector("#forwardBtn");

  if (!backBtn || !forwardBtn) return;

  updateHistoryButtons();

  if (backBtn.dataset.bound === "true") return;

  backBtn.dataset.bound = "true";
  forwardBtn.dataset.bound = "true";

  backBtn.addEventListener("click", () => {
    const historyState = syncNavHistory();

    if (historyState.index <= 0) {
      updateHistoryButtons();
      return;
    }

    window.history.back();
  });

  forwardBtn.addEventListener("click", () => {
    const historyState = syncNavHistory();

    if (historyState.index >= historyState.entries.length - 1) {
      updateHistoryButtons();
      return;
    }

    window.history.forward();
  });

  window.addEventListener("hashchange", updateHistoryButtons);
  window.addEventListener("popstate", updateHistoryButtons);
}

// =========================
// 모바일 / 태블릿 사이드바 토글 함수
// =========================
function initMobileSidebar() {
  const mobileMenuBtn = document.querySelector("#mobileMenuBtn");
  const sidebar = document.querySelector(".sidebar");

  if (!mobileMenuBtn || !sidebar) return;

  let sidebarOverlay = document.querySelector(".sidebar-overlay");

  if (!sidebarOverlay) {
    sidebarOverlay = document.createElement("div");
    sidebarOverlay.className = "sidebar-overlay";
    document.body.appendChild(sidebarOverlay);
  }

  const openSidebar = () => {
    sidebar.classList.add("is-open");
    sidebarOverlay.classList.add("is-open");
    document.body.classList.add("is-sidebar-open");
    mobileMenuBtn.setAttribute("aria-expanded", "true");
  };

  const closeSidebar = () => {
    sidebar.classList.remove("is-open");
    sidebarOverlay.classList.remove("is-open");
    document.body.classList.remove("is-sidebar-open");
    mobileMenuBtn.setAttribute("aria-expanded", "false");
  };

  const toggleSidebar = () => {
    if (sidebar.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  mobileMenuBtn.addEventListener("click", toggleSidebar);

  if (sidebarOverlay.dataset.bound !== "true") {
    sidebarOverlay.dataset.bound = "true";

    sidebarOverlay.addEventListener("click", closeSidebar);

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024) {
        closeSidebar();
      }
    });
  }
}

// =========================
// 헤더 초기 실행 함수
// =========================
export function initHeader() {
  const headerContainer = document.querySelector("#header");

  if (headerContainer && !headerContainer.innerHTML.trim()) {
    headerContainer.innerHTML = renderHeader();
  }

  renderSpotifyConnectButton();
  renderUser();

  initSearchForm();
  initHistoryButtons();
  initMobileSidebar();
}
