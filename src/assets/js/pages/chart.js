import { API_ENDPOINTS } from "../api/api.js";
import { initSongTablePage } from "../components/songTable.js";
import {
  renderLoading,
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

let genreChartInstance = null;
let weatherChartInstance = null;
let chartJsLoadPromise = null;
let chartDataCache = null;
let chartDataCachedAt = 0;
let chartDataRequestPromise = null;
let activeChartRunId = 0;

const CHART_JS_URL = "https://cdn.jsdelivr.net/npm/chart.js";
const CHART_DATA_CACHE_TTL_MS = 5 * 60 * 1000;

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

function getCachedChartData() {
  if (!chartDataCache) return null;

  const cacheAge = Date.now() - chartDataCachedAt;

  if (cacheAge > CHART_DATA_CACHE_TTL_MS) {
    chartDataCache = null;
    chartDataCachedAt = 0;
    return null;
  }

  return chartDataCache;
}

async function getChartMusicData() {
  const cachedChartData = getCachedChartData();

  if (cachedChartData) {
    return cachedChartData;
  }

  if (chartDataRequestPromise) {
    return chartDataRequestPromise;
  }

  chartDataRequestPromise = (async () => {
    const url = new URL(API_ENDPOINTS.tasteRecommend, window.location.origin);
    url.searchParams.set("limit", "100");

    const response = await fetch(url.toString(), {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("음악 데이터 조회 실패");
    }

    const apiData = await response.json();

    chartDataCache = apiData;
    chartDataCachedAt = Date.now();

    return apiData;
  })();

  try {
    return await chartDataRequestPromise;
  } finally {
    chartDataRequestPromise = null;
  }
}

function destroyGenreChart() {
  if (!genreChartInstance) return;

  genreChartInstance.destroy();
  genreChartInstance = null;
}

function destroyWeatherChart() {
  if (!weatherChartInstance) return;

  weatherChartInstance.destroy();
  weatherChartInstance = null;
}

function destroyChartInstances() {
  destroyGenreChart();
  destroyWeatherChart();
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

          <tbody id="chartTableBody"></tbody>
        </table>

        ${renderLoading("chartRecommendLoading", "추천곡을 불러오는 중...")}

        <div id="chartRecommendObserver" class="song-table-page__observer"></div>
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
export function initChartPage() {
  const runId = ++activeChartRunId;
  const cleanupSongTable = initSongTablePage({
    apiUrl: API_ENDPOINTS.tasteRecommend,
    tableBodyId: "chartTableBody",
    loadingId: "chartRecommendLoading",
    observerId: "chartRecommendObserver",
    limit: 10,
  });

  setContentVisible("chartSkeleton", true);
  setContentVisible("chartDashboard", false);

  (async () => {
    try {
      const chartJsPromise = loadChartJs();
      const apiData = await getChartMusicData();

      if (runId !== activeChartRunId) return;

      const { topGenres, topWeather } = normalizeTasteRecommendData(apiData);

      setContentVisible("chartSkeleton", false);
      setContentVisible("chartDashboard", true);

      await chartJsPromise;

      if (runId !== activeChartRunId) return;

      renderGenreChart(topGenres);
      renderWeatherChart(topWeather);

    } catch (error) {
      if (runId !== activeChartRunId) return;

      console.error("차트 페이지 초기화 실패:", error);

      setContentVisible("chartSkeleton", false);
      setContentVisible("chartDashboard", true);

      renderGenreChart([]);
      renderWeatherChart([]);
    }
  })();

  return () => {
    if (runId === activeChartRunId) {
      activeChartRunId++;
    }

    destroyChartInstances();
    cleanupSongTable?.();
  };
}

// =========================
// AI 취향 추천 응답 정리
// =========================
function normalizeTasteRecommendData(apiData) {
  if (Array.isArray(apiData)) {
    const data = apiData.map(normalizeChartData);
    const topGenres = getTopDataByField(data, "genre");
    const topWeather = getTopDataByField(data, "weather");

    return { topGenres, topWeather };
  }

  return {
    topGenres: normalizeStatData(apiData?.genreStats),
    topWeather: normalizeStatData(apiData?.weatherStats),
  };
}

function normalizeChartData(song) {
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
    "Unknown",
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

function normalizeStatData(stats) {
  if (!Array.isArray(stats)) return [];

  return stats
    .map((stat) => [
      normalizeText(stat?.label, "Unknown"),
      Number(stat?.count) || 0,
    ])
    .filter(([, count]) => count > 0)
    .slice(0, 6);
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

  destroyGenreChart();

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

  destroyWeatherChart();

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
