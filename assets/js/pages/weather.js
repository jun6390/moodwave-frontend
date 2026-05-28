import { renderCommonLayout } from '../layout/commonLayout.js';

// =========================
// 초기 실행
// =========================
renderCommonLayout();

function initWeather() {
  console.log('Weather page loaded');
}

initLayout();
initWeather();

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const playlistMap = {
  Rain: {
    weather: 'Rainy',
    tag: 'FOR RAINY DAYS',
    title: 'Overcast Vibes',
    genre: 'Lo-fi • Indie • Soft Jazz',
    desc: '차분하게 하루를 정리하고 싶을 때',
    image: './images/rainy-2.jpg',
    icon: './images/cloudy.svg',
    page: './playlist-rainy.html',
  },

  Clouds: {
    weather: 'Cloudy',
    tag: 'FOR CLOUDY DAYS',
    title: 'Cloudy Skies',
    genre: 'Dream Pop • Indie • Chill',
    desc: '흐린 하늘 아래 생각에 잠기고 싶은 순간',
    image: './images/cloudy-1.png',
    icon: './images/cloudy.svg',
    page: './playlist-cloudy.html',
  },

  Clear: {
    weather: 'Sunny',
    tag: 'FOR SUNNY DAYS',
    title: 'Golden Hour',
    genre: 'Pop • Funk • Chill Pop',
    desc: '햇살 가득한 오후를 더 밝게 만들 음악',
    image: './images/sunny-2.jpg',
    icon: './images/cloudy.svg',
    page: './playlist-sunny.html',
  },

  Snow: {
    weather: 'Snowy',
    tag: 'FOR SNOWY DAYS',
    title: 'Winter Hush',
    genre: 'Piano • Ambient • Jazz',
    desc: '포근한 겨울 감성에 어울리는 플레이리스트',
    image: './images/snowy.jpg',
    icon: './images/cloudy.svg',
    page: './playlist-sunny.html',
  },

  Thunderstorm: {
    weather: 'Stormy',
    tag: 'FOR STORMY DAYS',
    title: 'Thunder Echoes',
    genre: 'Electronic • Alt Rock • Synthwave',
    desc: '거센 빗소리 속 몰입하고 싶은 밤',
    image: './images/stormy.jpg',
    icon: './images/cloudy.svg',
    page: './playlist-stormy.html',
  },

  Mist: {
    tag: 'FOR FOGGY DAYS',
    title: 'Midnight Mist',
    genre: 'Ambient • Lo-fi • Dream Pop',
    desc: '몽환적인 새벽 공기와 어울리는 사운드',
    image: './images/foggy.jpg',
    icon: './images/cloudy.svg',
    page: './playlist-foggy.html',
  },

  Fog: {
    tag: 'FOR FOGGY DAYS',
    title: 'Midnight Mist',
    genre: 'Ambient • Lo-fi • Dream Pop',
    desc: '몽환적인 새벽 공기와 어울리는 사운드',
    image: './images/foggy.jpg',
    icon: './images/cloudy.svg',
    page: './playlist-foggy.html',
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

function getWeather(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const weather = data.weather[0].main;
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
  if (weather === 'Rain') {
    weatherTitle.textContent = 'Rainy';
    weatherDesc.textContent = '조용히 하루를 마무리하기 좋은 날씨';
    weatherIcon.src = '../images/rainy.svg';
  } else if (weather === 'Clouds') {
    weatherTitle.textContent = 'Cloudy';
    weatherDesc.textContent = '흐린 하늘 아래 차분한 분위기';
    weatherIcon.src = '../images/cloudy.svg';
  } else if (weather === 'Clear') {
    weatherTitle.textContent = 'Sunny';
    weatherDesc.textContent = '햇살 가득한 오후의 에너지';
    weatherIcon.src = '../images/sunny.svg';
  } else if (weather === 'Snow') {
    weatherTitle.textContent = 'Snowy';
    weatherDesc.textContent = '차가운 공기 속 포근한 분위기';
    weatherIcon.src = '../images/snowy.svg';
  } else if (weather === 'Mist' || weather === 'Fog') {
    weatherTitle.textContent = 'Foggy';
    weatherDesc.textContent = '안개 낀 새벽 같은 몽환적인 분위기';
    weatherIcon.src = '../images/foggy.svg';
  } else if (weather === 'Thunderstorm') {
    weatherTitle.textContent = 'Stormy';
    weatherDesc.textContent = '거센 빗소리 속 몰입하고 싶은 밤';
    weatherIcon.src = '../images/stormy.svg';
  }
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

function renderWeatherCards() {
  weatherCardGrid.innerHTML = '';

  Object.entries(playlistMap).forEach(([weather, playlist]) => {
    const card = document.createElement('a');
    card.className = 'weather-card';
    card.innerHTML = `
  
    <img class="other-weather-img" src="${playlist.image}" alt="${playlist.title}"/>
    
  <div class="weather-card-content">
    <img class="weather-card-icon" src="${playlist.icon}" alt=""/>
    <h3>${playlist.weather}</h3>
    <span>${playlist.genre}</span>
    <p>${playlist.title}</p>
  </div>
  <img class="btn-other-weather" src="../images/weather-play.svg" alt="" />
`;

    weatherCardGrid.append(card);
  });
}
