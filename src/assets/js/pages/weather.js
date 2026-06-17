import { playlistMap } from "../../../data.js";
import {
  renderLoading,
  setLoading,
  setContentVisible,
} from "../components/loading.js";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;
const DEFAULT_WEATHER_LOCATION = {
  lat: 37.5665,
  lon: 126.978,
};

const weatherDataCacheMap = new Map();
const weatherRequestPromiseMap = new Map();
let activeWeatherRunId = 0;

function getWeatherCacheKey(lat, lon) {
  return `${lat.toFixed(2)},${lon.toFixed(2)}`;
}

function getCachedWeatherData(cacheKey) {
  const cachedWeatherData = weatherDataCacheMap.get(cacheKey);

  if (!cachedWeatherData) return null;

  const cacheAge = Date.now() - cachedWeatherData.cachedAt;

  if (cacheAge > WEATHER_CACHE_TTL_MS) {
    weatherDataCacheMap.delete(cacheKey);
    return null;
  }

  return cachedWeatherData.data;
}

// =========================
// 날씨 이름 정규화
// =========================
function normalizeWeather(weather) {
  if (
    weather === "Mist" ||
    weather === "Fog" ||
    weather === "Haze" ||
    weather === "Smoke" ||
    weather === "Dust" ||
    weather === "Sand" ||
    weather === "Ash" ||
    weather === "Squall" ||
    weather === "Tornado"
  ) {
    return "Foggy";
  }

  return weather;
}

async function fetchWeatherData(lat, lon) {
  if (!WEATHER_API_KEY) {
    throw new Error("VITE_WEATHER_API_KEY가 설정되지 않았습니다.");
  }

  const cacheKey = getWeatherCacheKey(lat, lon);
  const cachedWeatherData = getCachedWeatherData(cacheKey);

  if (cachedWeatherData) {
    return cachedWeatherData;
  }

  if (weatherRequestPromiseMap.has(cacheKey)) {
    return weatherRequestPromiseMap.get(cacheKey);
  }

  const requestPromise = (async () => {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("날씨 정보를 불러오지 못했습니다.");
    }

    const data = await response.json();
    const weatherData = {
      weather: normalizeWeather(data.weather?.[0]?.main),
      temp: Math.round(data.main.temp),
      city: data.name,
    };

    weatherDataCacheMap.set(cacheKey, {
      data: weatherData,
      cachedAt: Date.now(),
    });

    return weatherData;
  })();

  weatherRequestPromiseMap.set(cacheKey, requestPromise);

  try {
    return await requestPromise;
  } finally {
    if (weatherRequestPromiseMap.get(cacheKey) === requestPromise) {
      weatherRequestPromiseMap.delete(cacheKey);
    }
  }
}

// =========================
// Weather 페이지 HTML 렌더링
// =========================
export function renderWeatherPage() {
  return `
    <!-- 현재 날씨 인포 -->
    <section class="weather-hero">
      <p class="section-label">CURRENT WEATHER</p>

      ${renderLoading("weatherLoading", "현재 날씨 확인 중...")}

      <div id="weatherContent" class="weather-hero-content" hidden>
        <div class="weather-info-box">
          <div class="weather-heading">
            <img
              src="/assets/icon/rainy.svg"
              alt=""
              class="weather-icon"
              id="weatherIcon"
              width="60"
              height="60"
            />
            <h1 class="weather-title" id="weatherTitle">Rainy</h1>
          </div>

          <p class="weather-info" id="weatherInfo">18°C · Seoul</p>

          <span class="weather-desc" id="weatherDesc">
            조용히 하루를 마무리하기 좋은 날씨
          </span>
        </div>
      </div>
    </section>

    <!-- 대표 플레이리스트 -->
    <section class="featured-playlist">
      <p class="section-label">TODAY'S PLAYLIST</p>

      <div id="featuredSkeleton" class="featured-card">
        <div class="playlist-album skeleton"></div>
        <div class="featured-playlist-info">
          <div class="playlist-tag-skeleton skeleton"></div>
          <div class="playlist-title-skeleton skeleton"></div>
          <div class="playlist-genre-skeleton skeleton"></div>
          <div class="playlist-desc-skeleton skeleton"></div>
        </div>
      </div>

      <a class="featured-card" id="featuredCard" hidden>
        <div class="playlist-album" id="playlistAlbum">
          <div class="playlist-album-bg" id="playlistAlbumImg"></div>

          <img
            class="btn-today"
            src="/assets/icon/weather-play.svg"
            width="60"
            height="60"
            alt=""
          />
        </div>

        <div class="featured-playlist-info">
          <span class="playlist-weather" id="playlistTag">
            FOR RAINY DAYS
          </span>

          <h2 class="playlist-title" id="playlistTitle">
            Overcast Vibes
          </h2>

          <p class="playlist-genre" id="playlistGenre">
            Lo-fi • Indie • Soft Jazz
          </p>

          <span class="playlist-desc" id="playlistDesc">
            차분하게 하루를 정리하고 싶을 때
          </span>
        </div>
      </a>
    </section>

    <!-- 다른 날씨 플레이리스트 -->
    <section class="weather-list-section">
      <p class="section-label">OTHER VIBES</p>

      <div id="weatherCardsSkeleton" class="weather-card-grid">
        <div class="weather-card weather-card--skeleton">
          <div class="other-weather-img skeleton"></div>

          <div class="weather-card-content">
            <div class="weather-card-title-skeleton skeleton"></div>
            <div class="weather-card-desc-skeleton skeleton"></div>
          </div>
        </div>

        <div class="weather-card weather-card--skeleton">
          <div class="other-weather-img skeleton"></div>

          <div class="weather-card-content">
            <div class="weather-card-title-skeleton skeleton"></div>
            <div class="weather-card-desc-skeleton skeleton"></div>
          </div>
        </div>

        <div class="weather-card weather-card--skeleton">
          <div class="other-weather-img skeleton"></div>

          <div class="weather-card-content">
            <div class="weather-card-title-skeleton skeleton"></div>
            <div class="weather-card-desc-skeleton skeleton"></div>
          </div>
        </div>

        <div class="weather-card weather-card--skeleton">
          <div class="other-weather-img skeleton"></div>

          <div class="weather-card-content">
            <div class="weather-card-title-skeleton skeleton"></div>
            <div class="weather-card-desc-skeleton skeleton"></div>
          </div>
        </div>
      </div>

      <div id="weatherCardGrid" class="weather-card-grid" hidden></div>
    </section>
  `;
}

// =========================
// Weather 페이지 초기화
// =========================
export function initWeatherPage() {
  const runId = ++activeWeatherRunId;
  const weatherCardGrid = document.querySelector("#weatherCardGrid");

  const weatherIcon = document.querySelector("#weatherIcon");
  const weatherTitle = document.querySelector("#weatherTitle");
  const weatherInfo = document.querySelector("#weatherInfo");
  const weatherDesc = document.querySelector("#weatherDesc");

  const featuredCard = document.querySelector("#featuredCard");
  const playlistTag = document.querySelector("#playlistTag");
  const playlistTitle = document.querySelector("#playlistTitle");
  const playlistGenre = document.querySelector("#playlistGenre");
  const playlistDesc = document.querySelector("#playlistDesc");
  const playlistAlbumImg = document.querySelector("#playlistAlbumImg");

  if (
    !weatherCardGrid ||
    !weatherIcon ||
    !weatherTitle ||
    !weatherInfo ||
    !weatherDesc ||
    !featuredCard ||
    !playlistTag ||
    !playlistTitle ||
    !playlistGenre ||
    !playlistDesc ||
    !playlistAlbumImg
  ) {
    return;
  }

  setWeatherPageLoaded(false);

  getCurrentLocation();
  initWeatherCardDrag(weatherCardGrid);

  // =========================
  // 현재 위치 가져오기
  // =========================
  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        getWeather(lat, lon);
      },
      () => {
        console.log("위치 정보를 가져올 수 없어 서울 날씨로 대체합니다.");

        getWeather(DEFAULT_WEATHER_LOCATION.lat, DEFAULT_WEATHER_LOCATION.lon);
      },
      {
        maximumAge: WEATHER_CACHE_TTL_MS,
        timeout: 5000,
      },
    );
  }

  // =========================
  // 날씨 API 호출
  // =========================
  async function getWeather(lat, lon) {
    try {
      const data = await fetchWeatherData(lat, lon);

      if (runId !== activeWeatherRunId) return;

      weatherInfo.textContent = `${data.temp}°C · ${data.city}`;

      updateWeather(data.weather);
      updatePlaylist(data.weather);
      renderWeatherCards(data.weather);

      setWeatherPageLoaded(true);
    } catch (error) {
      if (runId !== activeWeatherRunId) return;

      console.error(error);
      setLoading("weatherLoading", false);
    }
  }

  // =========================
  // 로딩 / 콘텐츠 표시 전환
  // =========================
  function setWeatherPageLoaded(isLoaded) {
    setLoading("weatherLoading", !isLoaded);

    setContentVisible("weatherContent", isLoaded);
    setContentVisible("featuredSkeleton", !isLoaded);
    setContentVisible("featuredCard", isLoaded);
    setContentVisible("weatherCardsSkeleton", !isLoaded);
    setContentVisible("weatherCardGrid", isLoaded);
  }

  // =========================
  // playlistMap에 있는 날씨 키 가져오기
  // =========================
  function getWeatherKey(weather) {
    if (playlistMap[weather]) {
      return weather;
    }

    if (playlistMap.Foggy) {
      return "Foggy";
    }

    return Object.keys(playlistMap)[0];
  }

  // =========================
  // 현재 날씨 인포 변경
  // =========================
  function updateWeather(weather) {
    const weatherKey = getWeatherKey(weather);
    const playlist = playlistMap[weatherKey];

    if (!playlist) return;

    weatherTitle.textContent = playlist.weather;
    weatherDesc.textContent = playlist.desc;
    weatherIcon.src = playlist.icon;
  }

  // =========================
  // 대표 플레이리스트 변경
  // =========================
  function updatePlaylist(weather) {
    const weatherKey = getWeatherKey(weather);
    const playlist = playlistMap[weatherKey];

    if (!playlist) return;

    playlistTag.textContent = playlist.tag;
    playlistTitle.textContent = playlist.title;
    playlistGenre.textContent = playlist.genre;
    playlistDesc.textContent = playlist.desc;
    playlistAlbumImg.style.backgroundImage = `url(${playlist.image})`;

    featuredCard.href = `#/weather-playlist?playlist=${weatherKey}`;
    featuredCard.style.setProperty("--playlist-color", playlist.color);
  }

  // =========================
  // 다른 날씨 플레이리스트 렌더링
  // =========================
  function renderWeatherCards(currentWeather) {
    const currentWeatherKey = getWeatherKey(currentWeather);

    weatherCardGrid.innerHTML = "";

    Object.entries(playlistMap).forEach(([weather, playlist]) => {
      if (weather === currentWeatherKey) return;

      const card = document.createElement("a");
      card.className = "weather-card";
      card.href = `#/weather-playlist?playlist=${weather}`;

      card.innerHTML = `
        <img
          class="other-weather-img"
          src="${playlist.image}"
          width="265"
          height="265"
          loading="lazy"
          decoding="async"
          alt="${playlist.title}"
        />

        <div class="weather-card-content">
          <img
            class="weather-card-icon"
            src="${playlist.icon}"
            width="50"
            height="50"
            alt=""
          />

          <h3>${playlist.weather}</h3>
          <span>${playlist.genre}</span>
          <p>${playlist.title}</p>
        </div>

        <img
          class="btn-other-weather"
          src="/assets/icon/weather-play.svg"
          width="40"
          height="40"
          alt=""
        />
      `;

      weatherCardGrid.append(card);
    });
  }

  return () => {
    if (runId === activeWeatherRunId) {
      activeWeatherRunId++;
    }
  };
}

// =========================
// 날씨 카드 마우스 드래그
// =========================
function initWeatherCardDrag(weatherCardGrid) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  weatherCardGrid.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - weatherCardGrid.offsetLeft;
    scrollLeft = weatherCardGrid.scrollLeft;
  });

  weatherCardGrid.addEventListener("mouseleave", () => {
    isDown = false;
  });

  weatherCardGrid.addEventListener("mouseup", () => {
    isDown = false;
  });

  weatherCardGrid.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - weatherCardGrid.offsetLeft;
    const walk = (x - startX) * 2;

    weatherCardGrid.scrollLeft = scrollLeft - walk;
  });
}
