import { ICON_PATH } from "../../../data.js";
import { API_ENDPOINTS } from "../api/api.js";

const URECA_PICK_LIMIT = 6;
const HOME_SECTION_LIMIT = 5;
const HOME_DATA_CACHE_TTL_MS = 5 * 60 * 1000;

let homeDataCache = null;
let homeDataCachedAt = 0;
let homeDataRequestPromise = null;
let activeHomeRunId = 0;

function getOptimizedCoverUrl(cover = "") {
  return cover.replace("/image/ab67616d0000b273", "/image/ab67616d00001e02");
}

function getCachedHomeData() {
  if (!homeDataCache) return null;

  const cacheAge = Date.now() - homeDataCachedAt;

  if (cacheAge > HOME_DATA_CACHE_TTL_MS) {
    return null;
  }

  return homeDataCache;
}

// =========================
// 홈 데이터 요청 함수
// =========================
async function getHomeData() {
  const cachedHomeData = getCachedHomeData();

  if (cachedHomeData) {
    return cachedHomeData;
  }

  if (homeDataRequestPromise) {
    return homeDataRequestPromise;
  }

  homeDataRequestPromise = (async () => {
    const response = await fetch(API_ENDPOINTS.home);

    if (!response.ok) {
      throw new Error("홈 데이터 요청 실패");
    }

    const homeData = await response.json();

    homeDataCache = homeData;
    homeDataCachedAt = Date.now();

    return homeData;
  })();

  try {
    return await homeDataRequestPromise;
  } finally {
    homeDataRequestPromise = null;
  }
}

// =========================
// 홈 HTML 렌더링 함수
// =========================
export function renderHome() {
  return `
    <h1 id="greeting" class="main__greeting"></h1>

    <div id="midMixes" class="mid-mixes"></div>

    <section class="section">
      <div class="section__header">
        <h2 class="section__title">Popular</h2>
        <button type="button" id="popularSeeAllBtn" class="section__see-all">
          SEE ALL
        </button>
      </div>

      <div id="popularGrid" class="section__grid"></div>
    </section>

    <section class="section">
      <div class="section__header">
        <h2 class="section__title">Latest</h2>
        <button type="button" id="latestSeeAllBtn" class="section__see-all">
          SEE ALL
        </button>
      </div>

      <div id="latestGrid" class="section__grid"></div>
    </section>
  `;
}

// =========================
// 중간 믹스 카드 생성 함수
// =========================
function createMidMixCard(item, index) {
  const cover = getOptimizedCoverUrl(item.cover || item.imageUrl || "");
  const artist = item.artist || item.description || "";
  const fetchPriority = index < 3 ? 'fetchpriority="high"' : "";

  return `
    <article
      class="mid-mix"
      data-play-track
      data-id="${item.id || ""}"
      data-uri="${item.uri || ""}"
      data-title="${item.title || ""}"
      data-artist="${artist}"
      data-cover="${cover}"
    >
      <img
        class="mid-mix__cover"
        src="${cover}"
        width="82"
        height="82"
        loading="eager"
        decoding="async"
        ${fetchPriority}
        alt=""
      />

      <span class="mid-mix__title">${item.title || ""}</span>

      <button class="mid-mix__play" type="button" aria-label="재생">
        <img
          src="${ICON_PATH}Play_Greem Hover.svg"
          width="62"
          height="62"
          alt=""
        />
      </button>
    </article>
  `;
}

// =========================
// 중간 믹스 렌더링 함수
// =========================
function renderMidMixes(data) {
  const midMixesElement = document.querySelector("#midMixes");

  if (!midMixesElement) return;

  midMixesElement.innerHTML = data
    .slice(0, URECA_PICK_LIMIT)
    .map(createMidMixCard)
    .join("");
}

// =========================
// 그리드 카드 생성 함수
// =========================
function createGridCard(item, isPriorityImage = false) {
  const cover = getOptimizedCoverUrl(item.cover || item.imageUrl || "");
  const artist = item.artist || item.description || "";
  const loading = isPriorityImage ? "eager" : "lazy";
  const fetchPriority = isPriorityImage ? 'fetchpriority="high"' : "";

  return `
    <article
      class="grid-card"
      data-play-track
      data-id="${item.id || ""}"
      data-uri="${item.uri || ""}"
      data-title="${item.title || ""}"
      data-artist="${artist}"
      data-cover="${cover}"
    >
      <div class="grid-card__art-wrap">
        <img
          class="grid-card__art"
          src="${cover}"
          width="182"
          height="182"
          loading="${loading}"
          decoding="async"
          ${fetchPriority}
          alt=""
        />

        <button class="grid-card__play" type="button" aria-label="재생">
          <img
            src="${ICON_PATH}Play_Greem Hover.svg"
            width="62"
            height="62"
            alt=""
          />
        </button>
      </div>

      <div class="grid-card__info">
        <span class="grid-card__name">${item.title || ""}</span>
        <span class="grid-card__desc">${artist}</span>
      </div>
    </article>
  `;
}

// =========================
// 그리드 렌더링 함수
// =========================
function renderGrid(selector, data) {
  const grid = document.querySelector(selector);

  if (!grid) return;

  const isPriorityGrid = selector === "#popularGrid";

  grid.innerHTML = data
    .map((item, index) => createGridCard(item, isPriorityGrid && index < HOME_SECTION_LIMIT))
    .join("");
}

// =========================
// 인사말 렌더링 함수
// =========================
function renderGreeting() {
  const greeting = document.querySelector("#greeting");

  if (!greeting) return;

  greeting.textContent = "Ureca's Pick";
}

// =========================
// Mid Mix 스켈레톤 생성 함수
// =========================
function createMidMixSkeleton() {
  return `
    <article class="mid-mix mid-mix--skeleton">
      <span class="mid-mix__cover skeleton"></span>
      <span class="mid-mix__title-skeleton skeleton"></span>
    </article>
  `;
}

// =========================
// Mid Mix 스켈레톤 렌더링 함수
// =========================
function renderMidMixSkeleton(count = URECA_PICK_LIMIT) {
  return Array.from({ length: count }).map(createMidMixSkeleton).join("");
}

// =========================
// Grid Card 스켈레톤 생성 함수
// =========================
function createGridSkeleton() {
  return `
    <article class="grid-card grid-card--skeleton">
      <div class="grid-card__art-wrap">
        <span class="grid-card__art skeleton"></span>
      </div>

      <div class="grid-card__info">
        <span class="grid-card__name-skeleton skeleton"></span>
        <span class="grid-card__desc-skeleton skeleton"></span>
        <span class="grid-card__desc-skeleton grid-card__desc-skeleton--short skeleton"></span>
      </div>
    </article>
  `;
}

// =========================
// Grid Card 스켈레톤 렌더링 함수
// =========================
function renderGridSkeleton(count = HOME_SECTION_LIMIT) {
  return Array.from({ length: count }).map(createGridSkeleton).join("");
}

// =========================
// 홈 스켈레톤 렌더링 함수
// =========================
function renderHomeSkeleton() {
  const midMixesElement = document.querySelector("#midMixes");
  const popularGrid = document.querySelector("#popularGrid");
  const latestGrid = document.querySelector("#latestGrid");

  if (midMixesElement) {
    midMixesElement.innerHTML = renderMidMixSkeleton(URECA_PICK_LIMIT);
  }

  if (popularGrid) {
    popularGrid.innerHTML = renderGridSkeleton(HOME_SECTION_LIMIT);
  }

  if (latestGrid) {
    latestGrid.innerHTML = renderGridSkeleton(HOME_SECTION_LIMIT);
  }
}

function renderHomeData(homeData) {
  renderMidMixes(homeData.midMixes || []);

  renderGrid(
    "#popularGrid",
    (homeData.popular || []).slice(0, HOME_SECTION_LIMIT),
  );

  renderGrid(
    "#latestGrid",
    (homeData.latest || []).slice(0, HOME_SECTION_LIMIT),
  );
}

// =========================
// SEE ALL 버튼 이벤트 등록 함수
// =========================
function bindSeeAllEvents() {
  const popularSeeAllBtn = document.querySelector("#popularSeeAllBtn");
  const latestSeeAllBtn = document.querySelector("#latestSeeAllBtn");

  const goToPopular = () => {
    location.hash = "#/popular";
  };

  const goToLatest = () => {
    location.hash = "#/latest";
  };

  popularSeeAllBtn?.addEventListener("click", goToPopular);
  latestSeeAllBtn?.addEventListener("click", goToLatest);

  return () => {
    popularSeeAllBtn?.removeEventListener("click", goToPopular);
    latestSeeAllBtn?.removeEventListener("click", goToLatest);
  };
}

// =========================
// 홈 초기 실행 함수
// =========================
export function initHome() {
  const runId = ++activeHomeRunId;
  const cachedHomeData = getCachedHomeData();
  const cleanupSeeAllEvents = bindSeeAllEvents();

  renderGreeting();

  if (cachedHomeData) {
    renderHomeData(cachedHomeData);
  } else {
    renderHomeSkeleton();
  }

  (async () => {
    try {
      const homeData = await getHomeData();

      if (runId !== activeHomeRunId) return;

      console.log("백엔드 홈 데이터:", homeData);

      renderHomeData(homeData);
    } catch (error) {
      if (runId !== activeHomeRunId) return;

      console.error("홈 데이터 로딩 실패:", error);
    }
  })();

  return () => {
    if (runId === activeHomeRunId) {
      activeHomeRunId++;
    }

    cleanupSeeAllEvents();
  };
}
