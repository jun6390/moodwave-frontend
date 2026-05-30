import { renderCommonLayout } from '../layout/commonLayout.js';
import { weatherTracks } from '../data.js';

const params = new URLSearchParams(window.location.search);
const playlistType = params.get('playlist');

// =========================
// 초기 실행
// =========================
renderCommonLayout();

function initWeatherPlaylist() {
  console.log('Weather Playlist page loaded');
}

initWeatherPlaylist();

const playlistList = document.querySelector('.playlist-list');
const tracks = (weatherTracks[playlistType] || []).slice(0, 10);

renderTracks(tracks);

function renderTracks(trackList) {
  playlistList.innerHTML = '';

  trackList.forEach((track) => {
    const trackRow = document.createElement('article');

    trackRow.className = 'track-row';

    trackRow.dataset.playTrack = '';
    trackRow.dataset.title = track.title;
    trackRow.dataset.artist = track.artist;
    trackRow.dataset.cover = track.cover;

    trackRow.innerHTML = `
        <div class="track-number">${track.id}</div>
      <div class="track-info">
        <img src="${track.cover}" alt="" class="track-cover" />
        <div class="track-text">
          <p class="track-title">${track.title}</p>
          <span class="track-artist">${track.artist}</span>
        </div>
      </div>

      <button class="track-like">
        <img src="/assets/icon/Heart_XS.svg" alt="" class="btn-liked" />
      </button>

      <div class="track-time">${track.duration}</div>
    `;

    playlistList.append(trackRow);
  });
}
