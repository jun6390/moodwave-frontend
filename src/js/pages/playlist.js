import { renderCommonLayout } from '../layout/commonLayout.js';

// =========================
// 초기 실행
// =========================
renderCommonLayout();

function initWeatherPlaylist() {
  console.log('Weather Playlist page loaded');
}

initWeatherPlaylist();

// 더미데이터
const tracks = [
  {
    id: 1,
    title: 'Square (2017)',
    artist: '백예린',
    album: 'Every letter I sent you.',
    duration: '04:31',
  },
  {
    id: 2,
    title: '밤편지',
    artist: '아이유',
    album: 'Palette',
    duration: '04:12',
  },
  {
    id: 3,
    title: 'Everything',
    artist: '검정치마',
    album: 'TEAM BABY',
    duration: '03:43',
  },
  {
    id: 4,
    title: 'From The Start',
    artist: 'Laufey',
    album: 'Bewitched',
    duration: '02:49',
  },
  {
    id: 5,
    title: 'Slow Dancing in the Dark',
    artist: 'Joji',
    album: 'BALLADS 1',
    duration: '03:29',
  },
  {
    id: 6,
    title: 'Cherry Wine',
    artist: 'Hozier',
    album: 'Hozier',
    duration: '04:00',
  },
  {
    id: 7,
    title: 'Falling',
    artist: 'Harry Styles',
    album: 'Fine Line',
    duration: '04:00',
  },
  {
    id: 8,
    title: 'Moon Song',
    artist: 'Phoebe Bridgers',
    album: 'Punisher',
    duration: '04:37',
  },
  {
    id: 9,
    title: 'Softly',
    artist: 'Clairo',
    album: 'Charm',
    duration: '03:12',
  },
  {
    id: 10,
    title: 'Ocean Eyes',
    artist: 'Billie Eilish',
    album: 'Dont Smile at Me',
    duration: '03:20',
  },
];

const playlistList = document.querySelector('.playlist-list');

renderTracks(tracks);

function renderTracks() {
  playlistList.innerHTML = '';

  tracks.forEach((tracks) => {
    const trackRow = document.createElement('article');

    trackRow.className = 'track-row';

    trackRow.innerHTML = `
        <div class="track-number">${tracks.id}</div>
      <div class="track-info">
        <img src="${tracks.cover}" alt="" class="track-cover" />
        <div class="track-text">
          <p class="track-title">${tracks.title}</p>
          <span class="track-artist">${tracks.artist}</span>
        </div>
      </div>

      <button class="track-like">
        <img src="/assets/icon/Heart_XS.svg" alt="" class="btn-liked" />
      </button>

      <div class="track-time">${tracks.duration}</div>
    `;

    playlistList.append(trackRow);
  });
}
