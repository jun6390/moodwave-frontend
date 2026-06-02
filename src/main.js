import { renderSidebar, initSidebar } from "./assets/js/components/sidebar.js";
import { renderHeader, initHeader } from "./assets/js/components/header.js";
import { renderFooter, initFooter } from "./assets/js/components/footer.js";

import { renderHome, initHome } from "./assets/js/pages/home.js";
import { renderSearch, initSearch } from "./assets/js/pages/search.js";
import { renderLatestPage, initLatestPage } from "./assets/js/pages/latest.js";
import {
  renderPlaylistPage,
  initPlaylistPage,
} from "./assets/js/pages/playlist.js";
import {
  renderPopularPage,
  initPopularPage,
} from "./assets/js/pages/popular.js";
import { renderEmotion, initEmotion } from "./assets/js/pages/emotion.js";
import { renderLikedPage, initLikedPage } from "./assets/js/pages/liked.js";
import {
  renderWeatherPage,
  initWeatherPage,
} from "./assets/js/pages/weather.js";
import { renderChartPage, initChartPage } from "./assets/js/pages/chart.js";
import {
  renderWeatherPlaylistPage,
  initWeatherPlaylistPage,
} from "./assets/js/pages/weather-playlist.js";

import { isLoggedIn } from "./assets/js/utils/auth.js";
import { initToast } from "./assets/js/utils/toast.js";

// =========================
// 페이지 라우트 목록
// =========================
const routes = [
  {
    path: "#/search",
    protected: true,
    render: renderSearch,
    init: initSearch,
  },
  {
    path: "#/latest",
    protected: true,
    render: renderLatestPage,
    init: initLatestPage,
  },
  {
    path: "#/popular",
    protected: true,
    render: renderPopularPage,
    init: initPopularPage,
  },
  {
    path: "#/playlist",
    protected: true,
    render: renderPlaylistPage,
    init: initPlaylistPage,
  },
  {
    path: "#/emotion",
    protected: true,
    render: renderEmotion,
    init: initEmotion,
  },
  {
    path: "#/liked",
    protected: true,
    render: renderLikedPage,
    init: initLikedPage,
  },
  {
    path: "#/chart",
    protected: true,
    render: renderChartPage,
    init: initChartPage,
    pageClass: "chart-main",
  },
  {
    path: "#/weather-playlist",
    protected: true,
    render: renderWeatherPlaylistPage,
    init: initWeatherPlaylistPage,
    pageClass: "playlist-main",
  },
  {
    path: "#/weather",
    protected: true,
    render: renderWeatherPage,
    init: initWeatherPage,
    pageClass: "weather-main",
  },
];

// =========================
// 현재 hash에 맞는 라우트 찾기
// =========================
function findRoute(hash) {
  return routes.find((route) => hash.startsWith(route.path));
}

// =========================
// 페이지 렌더링 함수
// =========================
async function renderPage(main, route) {
  main.className = "main";

  if (route.pageClass) {
    main.classList.add(route.pageClass);
  }

  main.innerHTML = route.render();

  if (route.init) {
    await route.init();
  }
}

// =========================
// 페이지 라우터 함수
// =========================
async function router() {
  const main = document.querySelector("#main");
  const hash = location.hash || "#/home";

  if (!main) return;

  const route = findRoute(hash);

  if (route?.protected) {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
      alert("로그인 후 이용할 수 있습니다.");
      location.hash = "#/home";
      return;
    }
  }

  if (route) {
    await renderPage(main, route);
    return;
  }

  await renderPage(main, {
    render: renderHome,
    init: initHome,
  });
}

// =========================
// 초기 실행 함수
// =========================
function init() {
  const sidebar = document.querySelector("#sidebar");
  const header = document.querySelector("#header");
  const footer = document.querySelector("#footer");

  if (!sidebar || !header || !footer) return;

  sidebar.innerHTML = renderSidebar();
  header.innerHTML = renderHeader();
  footer.innerHTML = renderFooter();

  initSidebar();
  initHeader();
  initFooter();

  router();

  window.addEventListener("hashchange", router);
}

initToast();
init();
