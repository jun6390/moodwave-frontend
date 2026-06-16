import { API_ENDPOINTS } from "../api/api.js";
import { renderSongTable, initSongTable } from "../components/songTable.js";
import {
  renderLoading,
  setLoading,
  setContentVisible,
} from "../components/loading.js";

// =========================
// 아티스트별 장르 매핑
// Spotify API 응답에 genre가 없어서 프론트에서 수동 보정
// =========================
const artistGenreMap = {
  "D.O.": "K-pop",
  CORTIS: "K-pop",
  "NCT WISH": "K-pop",
  "The Weeknd": "Pop",
  HANRORO: "Indie",
  "Playboi Carti": "Hip-hop",
  DaBaby: "Hip-hop",
  "Yerin Baek": "R&B",
  "Omega Sapien": "Hip-hop",
  NAYEON: "K-pop",
  Hearts2Hearts: "K-pop",
  ILLIT: "K-pop",
  B小町: "J-pop",
  "Pop Smoke": "Hip-hop",
  "Ariana Grande": "Pop",
  "DJ Khaled": "Hip-hop",
  AKMU: "K-pop",
  BTS: "K-pop",
  OsamaSon: "Hip-hop",
  "Gen Hoshino": "J-pop",
  NOWIMYOUNG: "Hip-hop",
  "K/DA": "K-pop",
  MIKA: "Pop",
  BewhY: "Hip-hop",
  "Kenshi Yonezu": "J-pop",
  "N'John": "Hip-hop",
  NMIXX: "K-pop",
  BLASÉ: "Hip-hop",
  Jin: "K-pop",
  KiiiKiii: "K-pop",
  HAON: "Hip-hop",
  LamazeP: "J-pop",
  STAYC: "K-pop",
  YENA: "K-pop",
  "Epik High": "Hip-hop",
  "Polo G": "Hip-hop",
  "Dragon Pony": "K-rock",
  kinoshita: "J-pop",
};

const demoWeatherList = [
  "Sunny",
  "Sunny",
  "Sunny",
  "Sunny",
  "Sunny",
  "Sunny",
  "Cloudy",
  "Cloudy",
  "Cloudy",
  "Rainy",
  "Rainy",
  "Clear",
  "Snowy",
];

let genreChartInstance = null;
let weatherChartInstance = null;
let chartJsLoadPromise = null;

const CHART_JS_URL = "https://cdn.jsdelivr.net/npm/chart.js";

function loadChartJs() {
  if (window.Chart) {
    return Promise.resolve(window.Chart);
  }

  if (chartJsLoadPromise) {
    return chartJsLoadPromise;
  }

  chartJsLoadPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${CHART_JS_URL}"]`,
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.Chart), {
        once: true,
      });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = CHART_JS_URL;
    script.async = true;
    script.onload = () => resolve(window.Chart);
    script.onerror = () => {
      chartJsLoadPromise = null;
      reject(new Error("Chart.js 로딩 실패"));
    };

    document.head.append(script);
  });

  return chartJsLoadPromise;
}

// =========================
// 차트 페이지 HTML 렌더링
// =========================
export function renderChartPage() {
  return `
    <section class="chart-page">
      <div class="chart-page__header">
        <h2 class="chart-page__title">내 음악 취향 통계</h2>
        <p class="chart-page__desc">
          내가 들은 음악 데이터를 기반으로 장르와 날씨 취향을 확인할 수 있어요.
        </p>
      </div>

      ${renderChartSkeleton()}

      <div id="chartDashboard" class="dashboard" hidden>
        <div class="chart-box">
          <h3>장르별 재생 비율</h3>

          <div class="chart-container">
            <canvas id="genreChart"></canvas>
          </div>
        </div>

        <div class="chart-box">
          <h3>가장 많이 감상한 날씨 🎧</h3>

          <div class="chart-container weather-container">
            <canvas id="weatherChart"></canvas>
          </div>
        </div>
      </div>

      <section class="song-table-page chart-recommend-section">
        <div class="song-table-page__header">
          <h2 class="song-table-page__title">통계 기반 추천곡</h2>
          <p class="song-table-page__desc">
            가장 많이 감상하신 장르의 인기곡을 추천해드려요.
          </p>
        </div>

        ${renderLoading("chartRecommendLoading", "추천곡을 불러오는 중...")}

        <div id="chartSongTable" hidden></div>
      </section>
    </section>
  `;
}

function renderChartSkeleton() {
  return `
    <div id="chartSkeleton" class="dashboard chart-skeleton">
      <div class="chart-box chart-skeleton__box">
        <div class="skeleton skeleton-line skeleton-line--title"></div>

        <div class="chart-container chart-skeleton__container">
          <div class="skeleton skeleton-doughnut"></div>
        </div>
      </div>

      <div class="chart-box chart-skeleton__box">
        <div class="skeleton skeleton-line skeleton-line--title"></div>

        <div class="chart-container weather-container chart-skeleton__container">
          <div class="skeleton skeleton-bar skeleton-bar--1"></div>
          <div class="skeleton skeleton-bar skeleton-bar--2"></div>
          <div class="skeleton skeleton-bar skeleton-bar--3"></div>
          <div class="skeleton skeleton-bar skeleton-bar--4"></div>
          <div class="skeleton skeleton-bar skeleton-bar--5"></div>
        </div>
      </div>
    </div>
  `;
}

// =========================
// 차트 페이지 초기화
// =========================
export async function initChartPage() {
  const songTableContainer = document.querySelector("#chartSongTable");

  setContentVisible("chartSkeleton", true);
  setContentVisible("chartDashboard", false);

  setLoading("chartRecommendLoading", true);
  setContentVisible("chartSongTable", false);

  try {
    const chartJsPromise = loadChartJs();
    const response = await fetch(API_ENDPOINTS.music);

    if (!response.ok) {
      throw new Error("음악 데이터 조회 실패");
    }

    const apiData = await response.json();

    const data = apiData.map((song, index) => normalizeChartData(song, index));

    const topGenres = getTopDataByField(data, "genre");
    const topWeather = getTopDataByField(data, "weather");

    const mostListenedGenre = topGenres[0]?.[0];

    const recommendedSongs = data
      .filter((song) => song.genre === mostListenedGenre)
      .slice(0, 10)
      .map(normalizeSongData);

    setContentVisible("chartSkeleton", false);
    setContentVisible("chartDashboard", true);

    await chartJsPromise;

    renderGenreChart(topGenres);
    renderWeatherChart(topWeather);

    if (songTableContainer) {
      songTableContainer.innerHTML = renderSongTable(recommendedSongs, {
        actionType: "playlist",
        actionHeader: "Add",
        emptyMessage: "추천할 곡이 없습니다.",
      });
    }

    initSongTable();
  } catch (error) {
    console.error("차트 페이지 초기화 실패:", error);

    setContentVisible("chartSkeleton", false);
    setContentVisible("chartDashboard", true);

    renderGenreChart([]);
    renderWeatherChart([]);

    if (songTableContainer) {
      songTableContainer.innerHTML = `
        <div class="empty-message">
          음악 데이터를 불러오지 못했습니다.
        </div>
      `;
    }
  } finally {
    setLoading("chartRecommendLoading", false);
    setContentVisible("chartSongTable", true);
  }
}

// =========================
// 차트용 데이터 정리
// =========================
function normalizeChartData(song, index) {
  const artist = normalizeText(
    song?.artist || song?.artistName || song?.artists?.[0]?.name,
    "Unknown Artist",
  );

  const genre = normalizeText(
    song?.genre || song?.genres?.[0] || artistGenreMap[artist],
    "Etc",
  );

  const weather = normalizeText(
    song?.weather || song?.weatherType || song?.weatherName,
    demoWeatherList[index % demoWeatherList.length],
  );

  const releaseDate = normalizeText(
    song?.releaseDate || song?.release_date || song?.album?.release_date,
    "-",
  );

  return {
    ...song,
    artist,
    genre,
    weather,
    releaseDate,
  };
}

// =========================
// songTable.js에 맞게 데이터 정리
// =========================
function normalizeSongData(song) {
  const artist = normalizeText(
    song?.artist || song?.artistName || song?.artists?.[0]?.name,
    "Unknown Artist",
  );

  const cover =
    song?.cover ||
    song?.imageUrl ||
    song?.albumImage ||
    song?.albumCover ||
    song?.album?.images?.[0]?.url ||
    "";

  const releaseDate = normalizeText(
    song?.releaseDate || song?.release_date || song?.album?.release_date,
    "-",
  );

  const durationMs = song?.durationMs || song?.duration_ms || 0;

  return {
    id: song?.id,
    musicId: song?.id,
    trackId: song?.id,
    spotifyId: song?.id,

    title: normalizeText(song?.title || song?.name, "Unknown Title"),
    artist,
    artistName: artist,
    description: artist,

    cover,
    imageUrl: cover,
    albumCover: cover,
    albumImage: cover,

    releaseDate,
    weather: normalizeText(song?.weather, "-"),
    genre: normalizeText(song?.genre, "Etc"),

    durationMs,
    duration: song?.duration || song?.durationText,
    uri: song?.uri || `spotify:track:${song?.id}`,
  };
}

// =========================
// 공통 유틸 함수
// =========================
function normalizeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function getTopDataByField(dataArray, field) {
  const stats = dataArray.reduce((acc, item) => {
    const label = normalizeText(item?.[field], "Unknown");

    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);
}

// =========================
// 장르 차트 렌더링
// =========================
function renderGenreChart(topGenres) {
  const genreCanvas = document.querySelector("#genreChart");
  const ChartConstructor = window.Chart;

  if (!genreCanvas || !ChartConstructor) {
    return;
  }

  if (genreChartInstance) {
    genreChartInstance.destroy();
  }

  const genreCtx = genreCanvas.getContext("2d");

  const centerTextPlugin = {
    id: "centerText",
    afterDraw: (chart) => {
      const datasetData = chart.data.datasets[0].data;
      const total = datasetData.reduce((a, b) => a + b, 0);

      if (!total) return;

      const { ctx, chartArea } = chart;
      const { top, left, width, height } = chartArea;

      const maxVal = Math.max(...datasetData);
      const maxIdx = datasetData.indexOf(maxVal);
      const label = chart.data.labels[maxIdx] ?? "Unknown";
      const percentage = ((maxVal / total) * 100).toFixed(0);

      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      ctx.font = "bold 20px sans-serif";
      ctx.fillText(label, width / 2 + left, height / 2 + top - 10);

      ctx.font = "16px sans-serif";
      ctx.fillText(`${percentage}%`, width / 2 + left, height / 2 + top + 15);
      ctx.restore();
    },
  };

  genreChartInstance = new ChartConstructor(genreCtx, {
    type: "doughnut",
    data: {
      labels: topGenres.map(([label]) => label),
      datasets: [
        {
          data: topGenres.map(([, value]) => value),
          backgroundColor: [
            "#00d4ff",
            "#0000ff",
            "#ffffff",
            "#ff9100",
            "#00e676",
            "#b388ff",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      cutout: "70%",
    },
    plugins: [centerTextPlugin],
  });
}

// =========================
// 날씨 차트 렌더링
// =========================
function renderWeatherChart(topWeather) {
  const weatherCanvas = document.querySelector("#weatherChart");
  const ChartConstructor = window.Chart;

  if (!weatherCanvas || !ChartConstructor) {
    return;
  }

  if (weatherChartInstance) {
    weatherChartInstance.destroy();
  }

  const weatherCtx = weatherCanvas.getContext("2d");

  weatherChartInstance = new ChartConstructor(weatherCtx, {
    type: "bar",
    data: {
      labels: topWeather.map(([label]) => label),
      datasets: [
        {
          data: topWeather.map(([, value]) => value),
          backgroundColor: [
            "#FFD700",
            "#B0C4DE",
            "#A9A9A9",
            "#4682B4",
            "#2F4F4F",
            "#8f8f8f",
          ],
          borderRadius: 10,
          barThickness: 10,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      scales: {
        x: {
          display: false,
          beginAtZero: true,
        },
        y: {
          grid: { display: false },
          ticks: {
            color: "#ffffff",
          },
        },
      },
    },
  });
}
