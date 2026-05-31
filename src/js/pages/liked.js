import { renderSidebar, initSidebar } from "../components/sidebar.js";
import { renderHeader, initHeader } from "../components/header.js";
import {
  renderFooter,
  initFooter,
  getSpotifyAccessToken,
} from "../components/footer.js";

import { renderHome, initHome } from "./home.js";
import { renderSearch, initSearch } from "./search.js";
import { renderLatestPage, initLatestPage } from "./latest.js";
import { renderPlaylistPage, initPlaylistPage } from "./playlist.js";
import { renderPopularPage, initPopularPage } from "./popular.js";

import { isLoggedIn } from "../utils/auth.js";
import { initToast } from "../utils/toast.js";

const API_BASE_URL = "http://127.0.0.1:8080";

// =========================
// 로그인이 필요한 페이지 목록
// =========================
const protectedRoutes = ["#/search", "#/latest", "#/popular", "#/playlist"];

// =========================
// 보호 페이지 여부 확인 함수
// =========================
function isProtectedRoute(hash) {
  return protectedRoutes.some((route) => hash.startsWith(route));
}

// =========================
// 페이지 라우터 함수
// =========================
async function router() {
  const main = document.querySelector("#main");
  const hash = location.hash || "#/home";

  if (!main) return;

  // 로그인 필요한 페이지 접근 제한
  if (isProtectedRoute(hash)) {
    const loggedIn = await isLoggedIn();

    if (!loggedIn) {
      alert("로그인 후 이용할 수 있습니다.");
      location.hash = "#/home";
      return;
    }
  }
}
function formatDuration(ms) {
  if (!ms) return "-";

  const min = Math.floor(ms / 60000);
  const sec = Math.floor((ms % 60000) / 1000);

  return `${min}:${sec.toString().padStart(2, "0")}`;
}
function createLikedTrackRow(track, index) {
  const rowNumber = index + 1;

  return `
    <tr
      class="song-row"
      data-play-track
      data-id="${track.id}"
      data-uri="${track.uri || ""}"
      data-title="${track.name}"
      data-artist="${track.artists?.[0]?.name || ""}"
      data-cover="${track.album?.images?.[0]?.url || ""}"
    >
      <td>${rowNumber}</td>

      <td>
        <div class="song-info">
          <img
            class="song-info__cover"
            src="${track.album?.images?.[0]?.url || ""}"
            alt=""
          />

          <div class="song-info__text">
            <span class="song-info__title">
              ${track.name}
            </span>
            <span class="song-info__artist">
              ${track.artists?.map((a) => a.name).join(", ")}
            </span>
          </div>
        </div>
      </td>

      <td>
        ${track.album?.release_date || "-"}
      </td>

      <td>
        ${formatDuration(track.duration_ms)}
      </td>

      <td>
        <button
          type="button"
          class="playlist-track-remove-button"
          data-no-play
          data-track-id="${track.id}"
          aria-label="좋아요 삭제"
          title="삭제"
        >
         <img src="../../public/assets/icon/Heart_Fill_XS.svg" alt="like icon" />
        </button>
      </td>
    </tr>
  `;
}
async function renderLikedPage() {
  const container = document.querySelector("#list-container");
  if (!container) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/like`, {
      credentials: "include",
    });

    const likedItems = await response.json();

    if (!likedItems.length) {
      container.innerHTML = "<p>좋아요한 곡이 없습니다.</p>";
      return;
    }

    const token = await getSpotifyAccessToken();

    let html = "";

    for (let i = 0; i < likedItems.length; i++) {
      const item = likedItems[i];
      const id = item.musicId?.trim();

      if (!id) continue;

      const res = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(await res.text());
        continue;
      }

      const track = await res.json();

      html += createLikedTrackRow(track, i);
    }

    container.innerHTML = `
  <table class="song-table">
    <thead>
      <tr>
        <th>#</th>
        <th>곡 정보</th>
        <th>발매일</th>
        <th>재생시간</th>
        <th><img src="../../public/assets/icon/Heart_Fill_XS.svg" alt="like icon" /></th>
      </tr>
    </thead>
    <tbody>
      ${html}
    </tbody>
  </table>
`;
  } catch (err) {
    console.error("좋아요 목록 로딩 실패:", err);
  }
}

// 좋아요 취소 함수
async function removeLike(musicId) {
  // 백엔드 toggleLike 로직을 호출하여 삭제 처리
  await fetch(`${API_BASE_URL}/api/like`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ musicId: musicId }),
    credentials: "include",
  });
}

window.removeLike = removeLike;

// =========================
// 초기 실행 함수
// =========================
function init() {
  const sidebar = document.querySelector("#sidebar");
  const header = document.querySelector("#header");
  const footer = document.querySelector("#footer");

  if (!sidebar || !header || !footer) return;

  // 공통 레이아웃 HTML 렌더링
  sidebar.innerHTML = renderSidebar();
  header.innerHTML = renderHeader();
  footer.innerHTML = renderFooter();

  // 공통 기능 실행
  initSidebar();
  initHeader();
  initFooter();

  // 현재 페이지 렌더링
  router();
  renderLikedPage();
  const container = document.querySelector("#list-container");
  if (container) {
    container.addEventListener("click", async (e) => {
      // 클릭된 요소가 삭제 버튼이거나 삭제 버튼의 자식(이미지 등)인지 확인
      const removeBtn = e.target.closest(".playlist-track-remove-button");
      if (removeBtn) {
        e.stopPropagation(); // 다른 플레이어 이벤트 방해 금지
        const musicId = removeBtn.dataset.trackId;
        if (musicId) {
          await removeLike(musicId);
        }
        renderLikedPage();
      }
    });
  }

  // hash 변경 시 메인 영역만 변경
  window.addEventListener("hashchange", router);
}

initToast();
init();
