import { renderSidebar, initSidebar } from "./components/sidebar.js";
import { renderHeader, initHeader } from "./components/header.js";
import { renderFooter, initFooter } from "./components/footer.js";
import { renderHome, initHome } from "./pages/home.js";

// =========================
// 초기 실행 함수
// =========================
function init() {
  const sidebar = document.querySelector("#sidebar");
  const header = document.querySelector("#header");
  const main = document.querySelector("#main");
  const footer = document.querySelector("#footer");

  // HTML 먼저 렌더링
  sidebar.innerHTML = renderSidebar();
  header.innerHTML = renderHeader();
  main.innerHTML = renderHome();
  footer.innerHTML = renderFooter();

  // 기능 실행
  initSidebar();
  initHeader();
  initHome();
  initFooter();
}

init();
