import { renderCommonLayout } from '../layout/commonLayout.js';
// import axios from 'axois';

const BASE_URL = '';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

// =========================
// 초기 실행
// =========================
renderCommonLayout();

function initWeather() {
  console.log('Weather page loaded');
}

initWeather();

const playlistMap = {
  Rain: {
    weather: 'Rainy',
    tag: 'FOR RAINY DAYS',
    title: 'Overcast Vibes',
    genre: 'Lo-fi • Indie • Soft Jazz',
    desc: '차분하게 하루를 정리하고 싶을 때',
    image: '/assets/img/rainy-2.jpg',
    icon: '/assets/icon/rainy.svg',
    page: '/pages/playlist.html?playlist=rainy',
  },

  Clouds: {
    weather: 'Cloudy',
    tag: 'FOR CLOUDY DAYS',
    title: 'Cloudy Skies',
    genre: 'Dream Pop • Indie • Chill',
    desc: '흐린 하늘 아래 생각에 잠기고 싶은 순간',
    image: '/assets/img/cloudy.jpg',
    icon: '/assets/icon/cloudy.svg',
    page: '/pages/playlist.html?playlist=cloudy',
  },

  Clear: {
    weather: 'Sunny',
    tag: 'FOR SUNNY DAYS',
    title: 'Golden Hour',
    genre: 'Pop • Funk • Chill Pop',
    desc: '햇살 가득한 오후를 더 밝게 만들 음악',
    image: '/assets/img/sunny-4.jpg',
    icon: '/assets/icon/sunny.svg',
    page: '/pages/playlist.html?playlist=sunny',
  },

  Snow: {
    weather: 'Snowy',
    tag: 'FOR SNOWY DAYS',
    title: 'Winter Hush',
    genre: 'Piano • Ambient • Jazz',
    desc: '포근한 겨울 감성에 어울리는 플레이리스트',
    image: '/assets/img/snowy-3.jpg',
    icon: '/assets/icon/snowy.svg',
    page: '/pages/playlist.html?playlist=snowy',
  },

  Thunderstorm: {
    weather: 'Stormy',
    tag: 'FOR STORMY DAYS',
    title: 'Thunder Echoes',
    genre: 'Electronic • Alt Rock • Synthwave',
    desc: '거센 빗소리 속 몰입하고 싶은 밤',
    image: '/assets/img/stormy.jpg',
    icon: '/assets/icon/stormy.svg',
    page: '/pages/playlist.html?playlist=stormy',
  },

  Foggy: {
    weather: 'Foggy',
    tag: 'FOR FOGGY DAYS',
    title: 'Midnight Mist',
    genre: 'Ambient • Lo-fi • Dream Pop',
    desc: '몽환적인 새벽 공기와 어울리는 사운드',
    image: '/assets/img/foggy.jpg',
    icon: '/assets/icon/foggy.svg',
    page: '/pages/playlist.html?playlist=foggy',
  },
};

const weatherCardGrid = document.querySelector('.weather-card-grid');
const weatherIcon = document.querySelector('.weather-icon');
const weatherTitle = document.querySelector('.weather-title');
const weatherInfo = document.querySelector('.weather-info');
const weatherDesc = document.querySelector('.weather-desc');

// 위치 정보
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getWeather(lat, lon);
  },

  () => {
    console.log('위치 정보를 가져올 수 없어 서울 날씨로 대체');

    // 서울 좌표(기본값)
    getWeather(37.5665, 126.978);
  },
);

// 날씨 정규화
function normalizeWeather(weather) {
  if (weather === 'Mist' || weather === 'Fog') {
    return 'Foggy';
  }

  return weather;
}

function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const weather = normalizeWeather(data.weather[0].main);
      const currentWeather = weather;
      const temp = Math.round(data.main.temp);
      const city = data.name;

      // 화면 출력
      weatherInfo.textContent = `${temp}°C · ${city}`;

      updateWeather(weather);
      updatePlaylist(weather);
      renderWeatherCards(weather);
    })

    .catch((err) => {
      console.error(err);
    });
}

function updateWeather(weather) {
  const playlist = playlistMap[weather];

  if (!playlist) return;

  weatherTitle.textContent = playlist.weather;
  weatherDesc.textContent = playlist.desc;
  weatherIcon.src = playlist.icon;
}

function updatePlaylist(weather) {
  const playlist = playlistMap[weather];

  if (!playlist) return;

  playlistTag.textContent = playlist.tag;
  playlistTitle.textContent = playlist.title;
  playlistGenre.textContent = playlist.genre;
  playlistDesc.textContent = playlist.desc;
  playlistAlbum.style.backgroundImage = `url(${playlist.image})`;
  featuredCard.href = playlist.page;
}

function renderWeatherCards(currentWeather) {
  weatherCardGrid.innerHTML = '';

  Object.entries(playlistMap).forEach(([weather, playlist]) => {
    if (weather === currentWeather) return;

    const card = document.createElement('a');
    card.className = 'weather-card';
    card.href = playlist.page;
    card.innerHTML = `
  <img class="other-weather-img" src="${playlist.image}" alt="${playlist.title}"/>
  <div class="weather-card-content">
    <img class="weather-card-icon" src="${playlist.icon}" alt=""/>
    <h3>${playlist.weather}</h3>
    <span>${playlist.genre}</span>
    <p>${playlist.title}</p>
  </div>
  <img class="btn-other-weather" src="/assets/icon/weather-play.svg" alt="" />
`;

    weatherCardGrid.append(card);
  });
}
