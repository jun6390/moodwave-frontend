import { renderCommonLayout } from '../layout/commonLayout.js';

import { playlistMap, weatherTracks } from '../data.js';

const params = new URLSearchParams(window.location.search);
const playlistType = params.get('playlist');

// 히어로 섹션

function renderPlaylistHero() {
  const playlist = playlistMap[playlistType];
  const playlistCover = document.querySelector('.playlist-cover');
  const playlistTitle = document.querySelector('.playlist-title');
  const playlistDesc = document.querySelector('.playlist-desc');
  const playlistGenre = document.querySelector('.playlist-genre');
  const playlistLabel = document.querySelector('.section-label');

  if (!playlist) return;

  playlistTitle.textContent = playlist.title;
  playlistDesc.textContent = playlist.description;
  playlistGenre.textContent = playlist.genre;
  playlistLabel.textContent = playlist.label;

  playlistCover.style.backgroundImage = `url(${playlist.image})`;

  playlistCover.style.backgroundSize = 'cover';
  playlistCover.style.backgroundPosition = 'center';
}

function renderWeatherTracks() {
  const playlistList = document.querySelector('.playlist-list');
  const tracks = weatherTracks[playlistType];

  if (!playlistList || !tracks) {
    playlistList.innerHTML = `
      <div class="empty-state">
        아직 추천된 곡이 없습니다.  
      </div>   
    
    `;
  }

  playlistList.innerHTML = tracks
    .map(
      (track, index) => `
      <div class="track-row">
         <div class="track-row-num">
           <span class="track-number">${index + 1}</span>
           <img class="track-row-play" src="/assets/icon/Play_XS.svg"/>
         </div>

        <div class="track-info">
          <img
            class="track-cover"
            src=""
            alt="${track.title}"
          />

          <div class="track-text">
            <p>${track.title}</p>
            <span>${track.artist}</span>
          </div>
        </div>

        <button class="liked-btn">
          <img src="/assets/icon/Heart_XS.svg" />
        </button>

        <span>${track.duration}</span>
      </div>
    `,
    )
    .join('');
}

renderPlaylistHero();
renderWeatherTracks();

// =========================
// 플레이리스트 페이지 초기 실행 함수
// =========================
export function initPlaylistPage() {
  const playlistName = getPlaylistNameFromHash();

  renderPlaylistDetail(playlistName);
  bindPlaylistTrackRemoveEvents();
}

// =========================
// 날씨 플레이리스트 초기 실행
// =========================
renderCommonLayout();

function initWeatherPlaylist() {
  console.log('Weather Playlist page loaded');
}

initWeatherPlaylist();
