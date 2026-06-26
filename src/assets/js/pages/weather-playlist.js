import { initSongTablePage } from "../components/songTable.js";
import { playlistMap } from "../../../data.js";
import { API_ENDPOINTS } from "../api/api.js";

let cleanupStickyHeaderScroll = null;

// =========================
// Weather Playlist 페이지 HTML 렌더링
// =========================
export function renderWeatherPlaylistPage() {
  return `
    <!-- 스티키 헤더 -->
    <div class="playlist-sticky-header">
      <span class="sticky-title"></span>
    </div>

    <!-- 플레이리스트 히어로 섹션 -->
    <div class="playlist-hero-container">
      <div class="playlist-cover" id="weatherPlaylistCover"></div>

      <div class="playlist-info">
        <p class="section-label" id="weatherPlaylistLabel">
          PUBLIC PLAYLIST
        </p>

        <h1 class="playlist-title" id="weatherPlaylistTitle">
          Overcast Vibes
        </h1>

        <p class="playlist-desc" id="weatherPlaylistDesc">
          차분하게 하루를 정리하고 싶을 때
        </p>

        <p class="playlist-genre" id="weatherPlaylistGenre">
          Lo-fi • Jazz • Acoustic
        </p>
      </div>
    </div>

    <div class="playlist-content-container">
      <div class="playlist-actions">
        <div class="playlist-actions-btn">
          <button type="button" class="play-btn">
            <img src="/assets/icon/Play_Greem Hover.svg" alt="" />
          </button>

          <button type="button" class="liked-btn">
            <img src="/assets/icon/Heart_XS.svg" alt="" />
          </button>

          <button type="button" class="download-btn">
            <img src="/assets/icon/Download_XS.svg" alt="" />
          </button>
        </div>

        <button type="button" class="playlist-sort">
          Custom order
          <img src="/assets/icon/sort-btn.svg" alt="" class="sort-icon" />
        </button>
      </div>

      <!-- 플레이리스트 목록 -->
      <section class="playlist-section">
        <table class="song-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Release Date</th>
              <th>Duration</th>
              <th>Add</th>
            </tr>
          </thead>

          <tbody id="weatherPlaylistTableBody"></tbody>
        </table>

        <div id="weatherPlaylistLoading" class="loading" hidden>
          <div class="loading__spinner"></div>
          <span>추천곡을 불러오는 중...</span>
        </div>

        <div id="weatherPlaylistObserver" class="song-table-page__observer"></div>
      </section>
    </div>
  `;
}

// =========================
// Weather Playlist 페이지 초기화
// =========================
export function initWeatherPlaylistPage() {
  const playlistType = getPlaylistTypeFromHash();
  const playlist = playlistMap[playlistType];

  if (!playlist) {
    renderEmptyPlaylist();
    return;
  }

  const cleanupStickyHeader = renderPlaylistHero(playlist);
  const cleanupSongTable = initSongTablePage({
    apiUrl: API_ENDPOINTS.weatherRecommend(playlistType),
    tableBodyId: "weatherPlaylistTableBody",
    loadingId: "weatherPlaylistLoading",
    observerId: "weatherPlaylistObserver",
    limit: 10,
  });

  console.log("Weather Playlist page loaded");

  return () => {
    cleanupSongTable?.();
    cleanupStickyHeader?.();
  };
}

// =========================
// hash에서 playlist 값 가져오기
// 예: #/weather-playlist?playlist=Rain
// =========================
function getPlaylistTypeFromHash() {
  const queryString = location.hash.split("?")[1];
  const params = new URLSearchParams(queryString);

  const playlistType = params.get("playlist");

  if (playlistMap[playlistType]) {
    return playlistType;
  }

  return "Rain";
}

// =========================
// 히어로 섹션 렌더링
// =========================
function renderPlaylistHero(playlist) {
  const playlistCover = document.querySelector("#weatherPlaylistCover");
  const playlistLabel = document.querySelector("#weatherPlaylistLabel");
  const playlistTitle = document.querySelector("#weatherPlaylistTitle");
  const playlistDesc = document.querySelector("#weatherPlaylistDesc");
  const playlistGenre = document.querySelector("#weatherPlaylistGenre");

  if (
    !playlistCover ||
    !playlistLabel ||
    !playlistTitle ||
    !playlistDesc ||
    !playlistGenre
  ) {
    return;
  }

  playlistLabel.textContent = playlist.label;
  playlistTitle.textContent = playlist.title;
  playlistDesc.textContent = playlist.desc;
  playlistGenre.textContent = playlist.genre;

  playlistCover.style.backgroundImage = `url(${playlist.image})`;
  playlistCover.style.backgroundSize = "cover";
  playlistCover.style.backgroundPosition = "center";

  return initStickyHeader(playlist.title);
}

// =========================
// 스크롤 시 스티키 헤더 처리
// =========================
function initStickyHeader(title) {
  cleanupStickyHeaderScroll?.();

  const main =
    document.querySelector(".playlist-main") || document.querySelector("#main");
  const hero = document.querySelector(".playlist-hero-container");
  const stickyHeader = document.querySelector(".playlist-sticky-header");
  const stickyTitle = document.querySelector(".sticky-title");

  if (!main || !hero || !stickyHeader || !stickyTitle) {
    return;
  }

  stickyTitle.textContent = title;

  const handleStickyHeader = () => {
    const showPoint = hero.offsetTop + hero.offsetHeight - 100;

    if (main.scrollTop > showPoint) {
      stickyHeader.classList.add("show");
    } else {
      stickyHeader.classList.remove("show");
    }
  };

  main.addEventListener("scroll", handleStickyHeader, { passive: true });
  handleStickyHeader();

  cleanupStickyHeaderScroll = () => {
    main.removeEventListener("scroll", handleStickyHeader);
    cleanupStickyHeaderScroll = null;
  };

  return cleanupStickyHeaderScroll;
}

// =========================
// 비어있는 플레이리스트 처리
// =========================
function renderEmptyPlaylist() {
  const main = document.querySelector("#main");

  if (!main) return;

  main.innerHTML = `
    <section class="playlist-section">
      <p class="empty-state">존재하지 않는 플레이리스트입니다.</p>
    </section>
  `;
}
