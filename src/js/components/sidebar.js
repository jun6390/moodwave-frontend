import { ICON_PATH, navItems, playlistMenuItems } from '../data.js';
import { isLoggedIn, requireLogin } from '../utils/auth.js';
import { deletePlaylistTracks, renamePlaylistTracks } from '../utils/playlistStorage.js';

const PLAYLIST_STORAGE_KEY = 'moodwave_playlists';
const PLAYLIST_MENU_WIDTH = 270;

// 사용자가 생성한 플레이리스트 관리
let playlistState = loadPlaylists();
let deleteTargetIndex = null;
let renameTargetIndex = null;
let openedMenuIndex = null;

let menuPosition = {
  top: 0,
  left: 0,
};

// 로그인 상태 저장
let isLoginUser = false;

// =========================
// 사이드바 HTML 렌더링 함수
// =========================
export function renderSidebar() {
  return `
    <div class="sidebar__header">
      <!-- 로고 -->
      <div class="sidebar__brand">
        <a href="#/home" class="sidebar__brand-link">
          <svg width="30" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.591 20.9294C15.2047 20.1074 12.7501 19.9809 10.5001 20.55C8.93192 20.9294 7.43192 21.6882 6.06828 22.6367L5.11371 23.3954L4.84099 23.6484L5.45462 24.1542C5.5228 24.1542 5.52281 24.2174 5.59099 24.2807C5.72736 24.4071 5.86373 24.4704 6.06828 24.5968L6.47735 24.8497L6.88645 24.5336C6.95463 24.4704 7.091 24.3439 7.22736 24.2807C8.45464 23.3322 9.81827 22.6999 11.2501 22.3837C13.091 21.9411 15.0683 22.0043 17.0456 22.6999C18.6819 23.269 22.0229 23.9645 26.0456 22.3837L26.182 22.3205L26.3865 22.1308C26.3865 22.0676 26.4547 22.0676 26.5229 22.0043C26.8638 21.625 27.2047 21.2456 27.4774 20.8029L28.8411 18.8428L26.6592 19.9809C23.4547 21.6249 20.5229 21.9411 17.591 20.9294Z" fill="currentColor"/>
            <path d="M8.25003 14.1005C10.0909 13.6579 12.0682 13.7211 14.0455 14.4166C16.2273 15.1754 21.8183 16.2503 28.091 11.0021L29.1137 10.0537L29.1819 9.99044L29.4547 9.73752L29.3183 9.42137C29.2501 9.16844 29.1137 8.85229 28.9774 8.53613L28.6365 7.65088L27.9546 8.28319C27.8865 8.40965 27.7501 8.47289 27.6137 8.59935C24.6137 11.4448 19.9773 14.3534 14.6591 12.5829C12.2728 11.7609 9.81822 11.6345 7.56821 12.2035C5.38639 12.7726 3.47729 13.8476 1.70455 15.3651V15.3019L0.681822 16.3136C0.681822 16.3768 0.613653 16.3768 0.545471 16.44L0.340912 16.6297L0.409098 16.8827C0.47728 17.1988 0.61364 17.515 0.681822 17.8311L1.09092 18.8428L1.77274 18.0208C1.84092 17.8944 1.97728 17.8311 2.04546 17.7047C3.47729 16.5033 5.45457 14.796 8.25003 14.1005Z" fill="currentColor"/>
            <path d="M1.63639 12.9623C3.20457 11.4447 4.97729 10.4962 6.88639 9.99039C8.72731 9.54777 10.7046 9.611 12.6819 10.3065C18.8183 12.3932 24.1365 8.97869 26.4546 7.14498L27.341 6.32298L27.6819 6.07004L27.4092 5.69067C27.2046 5.50097 27.0683 5.24805 26.8637 4.99512L26.4546 4.48926L25.9774 4.93188C25.9092 4.99512 25.7728 5.12157 25.7046 5.18481C22.841 7.71406 18.4092 10.3066 13.3637 8.53608C10.9773 7.71407 8.52276 7.5876 6.27276 8.15669C4.84093 8.53607 3.47729 9.16838 2.11365 9.99039L0.681821 11.0653C0.545456 11.1918 0.477274 11.255 0.34091 11.3815L0.204559 11.5079V11.6976C0.136377 12.1403 0.136368 12.5829 0.0681862 12.9623L0 14.5431L1.1591 13.4049C1.29547 13.2784 1.43184 13.0887 1.63639 12.9623Z" fill="currentColor"/>
            <path d="M19.5682 25.2293L19.4318 25.6087L19.5682 25.2293C19.3636 25.1661 19.2273 25.1029 19.0227 25.0396C16.6364 24.2176 14.1818 24.0912 11.9318 24.6603C11.4545 24.7867 10.9772 24.9132 10.5 25.1029L8.86359 25.7984L8.45451 25.9881L9.81815 26.4307C10.2272 26.5572 10.6363 26.6836 11.0454 26.8101L11.25 26.8733L11.4545 26.8101C11.6591 26.7469 11.8636 26.6204 12.0682 26.6204C12.2045 26.6204 12.3409 26.5572 12.4773 26.494C14.1136 26.1146 15.8863 26.1146 17.7954 26.6836C18 26.7469 18.1364 26.8101 18.3409 26.8733L18.6818 26.9998L18.8864 26.9366C19.3636 26.8101 19.9091 26.6836 20.3182 26.494L22.2273 25.8616L20.25 25.419C20.0455 25.3558 19.7727 25.2926 19.5682 25.2293Z" fill="currentColor"/>
            <path d="M30 12.1406L28.9772 13.0891C28.8409 13.2156 28.7045 13.342 28.5682 13.4685C25.7727 15.9345 21.2727 18.5902 16.2272 16.8197C13.8408 15.9977 11.3863 15.8713 9.13627 16.4404C7.02263 17.0094 5.11351 18.0211 3.40896 19.5387L2.5226 20.4239L2.24988 20.7401L2.5226 21.1195C2.72715 21.3724 2.86352 21.5621 2.99988 21.815L3.40896 22.3841L3.88624 21.815C3.95443 21.7518 4.09079 21.6253 4.15897 21.5621C5.79534 19.9181 7.56807 18.9064 9.61353 18.4005C11.4544 17.9579 13.4317 18.0211 15.409 18.7167C17.1136 19.2858 18.8863 19.4755 20.659 19.2858C23.7954 18.9696 26.9318 17.3256 29.25 15.4919C29.3863 15.3654 29.5227 15.3022 29.6591 15.1757L29.8636 14.986V14.7963C29.8636 14.417 29.9318 13.9743 29.9318 13.595L30 12.1406Z" fill="currentColor"/>
            <path d="M4.09106 6.32341L3.88652 5.94402L4.09106 6.32341C4.50015 6.13372 4.97744 6.00725 5.38654 5.88078C7.22745 5.43816 9.20473 5.5014 11.182 6.19694C12.4775 6.63956 13.7729 6.82925 15.2047 6.82925C18.0684 6.82925 20.932 5.88079 23.5911 4.04708L24.6139 3.2883L24.9548 3.03538L24.3411 2.59275C24.1366 2.40305 23.8639 2.21337 23.5911 2.08691L23.182 1.83398L22.8411 2.08691C22.7048 2.15014 22.6366 2.2766 22.5002 2.33983C18.8866 4.86908 15.2729 5.56463 11.8638 4.36324C9.40928 3.54123 6.95471 3.35154 4.50016 4.04708C4.29561 4.11031 4.09106 4.17353 3.81834 4.23677L3.68198 4.3L3.47743 4.48969C3.47743 4.55292 3.40926 4.55293 3.34107 4.61616C3.06835 4.99555 2.72742 5.31171 2.4547 5.6911L1.15924 7.5248L3.27289 6.5131C3.6138 6.5131 3.88651 6.38664 4.09106 6.32341Z" fill="currentColor"/>
            <path d="M9.68186 2.02339L9.8864 2.08663C10.7728 2.40278 12.1364 2.71894 13.841 2.71894C15.6137 2.71894 17.3183 2.33955 19.0228 1.70723L21.1364 0.758764L19.7046 0.316157C19.2955 0.189694 18.8864 0.0632313 18.4092 0H18.2046L18.0001 0.0632159C17.7955 0.126447 17.591 0.252925 17.3864 0.316157C15.341 1.0117 13.2955 1.13816 11.3182 0.632313C11.1137 0.569082 10.9091 0.505839 10.7046 0.442608L10.5001 0.379372L10.2955 0.442608C9.88641 0.56907 9.47732 0.69554 9.06823 0.885234L7.50003 1.51755L9.13642 1.96015C9.27278 1.89692 9.47732 1.96016 9.68186 2.02339Z" fill="currentColor"/>
          </svg>

          <span>MOOD WAVE</span>
        </a>
      </div>

      <!-- 주요 메뉴 -->
      <nav
        id="primaryNav"
        class="sidebar__nav-primary"
        aria-label="주요 메뉴"
      ></nav>

      <!-- 플레이리스트 메뉴 -->
      <nav
        id="secondaryNav"
        class="sidebar__nav-secondary"
        aria-label="플레이리스트 메뉴"
      ></nav>
    </div>

    <div class="sidebar__divider" aria-hidden="true"></div>

    <!-- 플레이리스트 목록 -->
    <div
      id="playlistList"
      class="sidebar__playlist-list custom-scrollbar custom-scrollbar--hover"
      hidden
    ></div>

    <!-- 플레이리스트 생성 모달 -->
    <div id="playlistModal" class="playlist-modal" aria-hidden="true">
      <div class="playlist-modal__overlay" data-close-playlist-modal></div>

      <div class="playlist-modal__content" role="dialog" aria-modal="true">
        <h2 class="playlist-modal__title">Create Playlist</h2>

        <form id="playlistForm" class="playlist-modal__form">
          <input
            id="playlistInput"
            class="playlist-modal__input"
            type="text"
            placeholder="플레이리스트 제목을 입력하세요"
            autocomplete="off"
          />

          <div class="playlist-modal__buttons">
            <button
              type="button"
              class="playlist-modal__button playlist-modal__button--cancel"
              data-close-playlist-modal
            >
              취소
            </button>

            <button
              type="submit"
              class="playlist-modal__button playlist-modal__button--create"
            >
              생성
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 플레이리스트 이름 변경 모달 -->
    <div id="renamePlaylistModal" class="playlist-modal" aria-hidden="true">
      <div class="playlist-modal__overlay" data-close-rename-modal></div>

      <div class="playlist-modal__content" role="dialog" aria-modal="true">
        <h2 class="playlist-modal__title">Rename Playlist</h2>

        <form id="renamePlaylistForm" class="playlist-modal__form">
          <input
            id="renamePlaylistInput"
            class="playlist-modal__input"
            type="text"
            placeholder="변경할 이름을 입력하세요"
            autocomplete="off"
          />

          <div class="playlist-modal__buttons">
            <button
              type="button"
              class="playlist-modal__button playlist-modal__button--cancel"
              data-close-rename-modal
            >
              취소
            </button>

            <button
              type="submit"
              class="playlist-modal__button playlist-modal__button--create"
            >
              변경
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 플레이리스트 삭제 확인 모달 -->
    <div id="deletePlaylistModal" class="playlist-modal" aria-hidden="true">
      <div class="playlist-modal__overlay" data-close-delete-modal></div>

      <div class="playlist-modal__content" role="dialog" aria-modal="true">
        <h2 class="playlist-modal__title">Delete Playlist</h2>

        <p class="playlist-modal__description">
          이 플레이리스트를 삭제하시겠습니까?
        </p>

        <div class="playlist-modal__buttons">
          <button
            type="button"
            class="playlist-modal__button playlist-modal__button--cancel"
            data-close-delete-modal
          >
            취소
          </button>

          <button
            type="button"
            id="confirmDeletePlaylistButton"
            class="playlist-modal__button playlist-modal__button--delete"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  `;
}

// =========================
// 메뉴 아이템 작성 함수
// =========================
function createNavItem(item) {
  const isCreatePlaylist = item.label === 'Create Playlist';

  return `
    <a
      href="${item.href || '#'}"
      class="sidebar__nav-item"
      ${isCreatePlaylist ? 'data-create-playlist="true"' : ''}
    >
      <img
        class="sidebar__icon"
        src="${ICON_PATH}${item.icon}"
        width="32"
        height="32"
        alt=""
      />
      <span class="sidebar__label">${item.label}</span>
    </a>
  `;
}

// =========================
// 메뉴 렌더링 함수
// =========================
function renderNav() {
  const primaryNav = document.querySelector('#primaryNav');
  const secondaryNav = document.querySelector('#secondaryNav');

  if (!primaryNav || !secondaryNav) return;

  primaryNav.innerHTML = navItems.map(createNavItem).join('');
  secondaryNav.innerHTML = playlistMenuItems.map(createNavItem).join('');
}

// =========================
// 플레이리스트 목록 표시 상태 설정 함수
// =========================
function setPlaylistListVisible(isVisible) {
  const playlistList = document.querySelector('#playlistList');

  if (!playlistList) return;

  playlistList.hidden = !isVisible;
}

// =========================
// 플레이리스트 목록 렌더링 함수
// =========================
function renderPlaylists() {
  const playlistList = document.querySelector('#playlistList');

  if (!playlistList) return;

  // 비로그인 상태에서는 플레이리스트를 렌더링하지 않음
  if (!isLoginUser) {
    playlistList.innerHTML = '';
    playlistList.hidden = true;
    return;
  }

  playlistList.hidden = false;

  playlistList.innerHTML = playlistState
    .map((playlist, index) => {
      const isMenuOpen = openedMenuIndex === index;

      return `
        <div class="sidebar__playlist-row">
          <a
            href="#/playlist?name=${encodeURIComponent(playlist)}"
            class="sidebar__playlist-item"
          >
            ${escapeHTML(playlist)}
          </a>

          <div class="sidebar__playlist-more-wrap">
            <button
              type="button"
              class="sidebar__playlist-more-button"
              data-playlist-menu-button="${index}"
              aria-label="${escapeHTML(playlist)} 메뉴 열기"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div
              class="playlist-more-menu ${isMenuOpen ? 'is-open' : ''}"
              data-playlist-menu="${index}"
              style="${isMenuOpen ? `top: ${menuPosition.top}px; left: ${menuPosition.left}px;` : ''}"
            >
              <button
                type="button"
                class="playlist-more-menu__item"
                data-share-playlist-index="${index}"
              >
                <span class="playlist-more-menu__icon">
                  ${shareIcon()}
                </span>
                <span>플레이리스트 공유</span>
              </button>

              <button
                type="button"
                class="playlist-more-menu__item"
                data-rename-playlist-index="${index}"
              >
                <span class="playlist-more-menu__icon">
                  ${editIcon()}
                </span>
                <span>플레이리스트 이름 바꾸기</span>
              </button>

              <button
                type="button"
                class="playlist-more-menu__item playlist-more-menu__item--delete"
                data-delete-playlist-index="${index}"
              >
                <span class="playlist-more-menu__icon">
                  ${trashIcon()}
                </span>
                <span>플레이리스트 삭제</span>
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

// =========================
// 플레이리스트 불러오기 함수
// =========================
function loadPlaylists() {
  try {
    const savedPlaylists = JSON.parse(localStorage.getItem(PLAYLIST_STORAGE_KEY) || '[]');

    return Array.isArray(savedPlaylists) ? savedPlaylists : [];
  } catch {
    return [];
  }
}

// =========================
// 플레이리스트 저장 함수
// =========================
function savePlaylists() {
  localStorage.setItem(PLAYLIST_STORAGE_KEY, JSON.stringify(playlistState));
}

// =========================
// 플레이리스트 생성 모달 열기 함수
// =========================
function openPlaylistModal() {
  const modal = document.querySelector('#playlistModal');
  const input = document.querySelector('#playlistInput');

  if (!modal || !input) return;

  closePlaylistMoreMenu();

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');

  input.value = '';
  input.focus();
}

// =========================
// 플레이리스트 생성 모달 닫기 함수
// =========================
function closePlaylistModal() {
  const modal = document.querySelector('#playlistModal');

  if (!modal) return;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

// =========================
// 플레이리스트 생성 함수
// =========================
function createPlaylist(title) {
  const newPlaylist = title.trim();

  if (!newPlaylist) {
    alert('플레이리스트 제목을 입력해주세요.');
    return;
  }

  playlistState.push(newPlaylist);
  savePlaylists();
  renderPlaylists();
  closePlaylistModal();
}

// =========================
// 플레이리스트 더보기 메뉴 열기/닫기 함수
// =========================
function togglePlaylistMoreMenu(index, button) {
  if (openedMenuIndex === index) {
    openedMenuIndex = null;
    renderPlaylists();
    return;
  }

  const rect = button.getBoundingClientRect();

  const nextLeft = rect.right + 8;
  const maxLeft = window.innerWidth - PLAYLIST_MENU_WIDTH - 12;

  menuPosition = {
    top: Math.max(12, rect.top - 10),
    left: Math.min(nextLeft, maxLeft),
  };

  openedMenuIndex = index;
  renderPlaylists();
}

function closePlaylistMoreMenu() {
  if (openedMenuIndex === null) return;

  openedMenuIndex = null;
  renderPlaylists();
}

// =========================
// 플레이리스트 공유 함수
// =========================
async function sharePlaylist(index) {
  const playlistName = playlistState[index];

  if (!playlistName) return;

  const shareText = `MOOD WAVE 플레이리스트: ${playlistName}`;
  const shareUrl = `${window.location.origin}${window.location.pathname}#playlist=${encodeURIComponent(playlistName)}`;

  closePlaylistMoreMenu();

  try {
    if (navigator.share) {
      await navigator.share({
        title: playlistName,
        text: shareText,
        url: shareUrl,
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    alert('플레이리스트 공유 링크가 복사되었습니다.');
  } catch {
    alert('공유를 취소했거나 실패했습니다.');
  }
}

// =========================
// 이름 변경 모달 열기 함수
// =========================
function openRenamePlaylistModal(index) {
  const modal = document.querySelector('#renamePlaylistModal');
  const input = document.querySelector('#renamePlaylistInput');

  if (!modal || !input) return;

  renameTargetIndex = index;
  closePlaylistMoreMenu();

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');

  input.value = playlistState[index];
  input.focus();
  input.select();
}

// =========================
// 이름 변경 모달 닫기 함수
// =========================
function closeRenamePlaylistModal() {
  const modal = document.querySelector('#renamePlaylistModal');

  if (!modal) return;

  renameTargetIndex = null;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

// =========================
// 플레이리스트 이름 변경 함수
// =========================
function renamePlaylist(title) {
  if (renameTargetIndex === null) return;

  const newTitle = title.trim();

  if (!newTitle) {
    alert('변경할 이름을 입력해주세요.');
    return;
  }

  const prevTitle = playlistState[renameTargetIndex];

  playlistState[renameTargetIndex] = newTitle;
  renamePlaylistTracks(prevTitle, newTitle);

  savePlaylists();
  renderPlaylists();
  closeRenamePlaylistModal();
}

// =========================
// 삭제 확인 모달 열기 함수
// =========================
function openDeletePlaylistModal(index) {
  const modal = document.querySelector('#deletePlaylistModal');
  const confirmDeleteButton = document.querySelector('#confirmDeletePlaylistButton');

  if (!modal || !confirmDeleteButton) return;

  deleteTargetIndex = index;
  closePlaylistMoreMenu();

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');

  requestAnimationFrame(() => {
    confirmDeleteButton.focus();
  });
}

// =========================
// 삭제 확인 모달 닫기 함수
// =========================
function closeDeletePlaylistModal() {
  const modal = document.querySelector('#deletePlaylistModal');

  if (!modal) return;

  deleteTargetIndex = null;

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
}

// =========================
// 플레이리스트 삭제 함수
// =========================
function deletePlaylist() {
  if (deleteTargetIndex === null) return;

  const deletedPlaylist = playlistState[deleteTargetIndex];

  playlistState.splice(deleteTargetIndex, 1);
  deletePlaylistTracks(deletedPlaylist);

  savePlaylists();
  renderPlaylists();
  closeDeletePlaylistModal();
}

// =========================
// 플레이리스트 생성 모달 이벤트 등록 함수
// =========================
function bindPlaylistModalEvents() {
  const createPlaylistButton = document.querySelector('[data-create-playlist]');
  const closeButtons = document.querySelectorAll('[data-close-playlist-modal]');
  const playlistForm = document.querySelector('#playlistForm');
  const playlistInput = document.querySelector('#playlistInput');

  if (createPlaylistButton) {
    createPlaylistButton.addEventListener('click', async (event) => {
      event.preventDefault();

      const canUse = await requireLogin('플레이리스트 생성은 로그인 후 이용할 수 있습니다.');

      if (!canUse) return;

      openPlaylistModal();
    });
  }

  closeButtons.forEach((button) => {
    button.addEventListener('click', closePlaylistModal);
  });

  if (playlistForm && playlistInput) {
    playlistForm.addEventListener('submit', (event) => {
      event.preventDefault();
      createPlaylist(playlistInput.value);
    });
  }
}

// =========================
// 플레이리스트 더보기 메뉴 이벤트 등록 함수
// =========================
function bindPlaylistMoreMenuEvents() {
  const playlistList = document.querySelector('#playlistList');

  if (!playlistList) return;

  playlistList.addEventListener('click', async (event) => {
    const playlistLink = event.target.closest('.sidebar__playlist-item');
    const menuButton = event.target.closest('[data-playlist-menu-button]');
    const shareButton = event.target.closest('[data-share-playlist-index]');
    const renameButton = event.target.closest('[data-rename-playlist-index]');
    const deleteButton = event.target.closest('[data-delete-playlist-index]');

    if (playlistLink) {
      const canUse = await requireLogin('플레이리스트는 로그인 후 이용할 수 있습니다.');

      if (!canUse) {
        event.preventDefault();
        return;
      }
    }

    if (menuButton) {
      event.preventDefault();
      event.stopPropagation();

      const index = Number(menuButton.dataset.playlistMenuButton);
      togglePlaylistMoreMenu(index, menuButton);
      return;
    }

    if (shareButton) {
      event.preventDefault();

      const index = Number(shareButton.dataset.sharePlaylistIndex);
      sharePlaylist(index);
      return;
    }

    if (renameButton) {
      event.preventDefault();

      const index = Number(renameButton.dataset.renamePlaylistIndex);
      openRenamePlaylistModal(index);
      return;
    }

    if (deleteButton) {
      event.preventDefault();

      const index = Number(deleteButton.dataset.deletePlaylistIndex);
      openDeletePlaylistModal(index);
    }
  });

  document.addEventListener('click', (event) => {
    const isInsideMenu = event.target.closest('.sidebar__playlist-more-wrap');

    if (isInsideMenu) return;

    closePlaylistMoreMenu();
  });
}

// =========================
// 플레이리스트 이름 변경 이벤트 등록 함수
// =========================
function bindPlaylistRenameEvents() {
  const closeButtons = document.querySelectorAll('[data-close-rename-modal]');
  const renameForm = document.querySelector('#renamePlaylistForm');
  const renameInput = document.querySelector('#renamePlaylistInput');

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeRenamePlaylistModal);
  });

  if (renameForm && renameInput) {
    renameForm.addEventListener('submit', (event) => {
      event.preventDefault();
      renamePlaylist(renameInput.value);
    });
  }
}

// =========================
// 플레이리스트 삭제 이벤트 등록 함수
// =========================
function bindPlaylistDeleteEvents() {
  const closeButtons = document.querySelectorAll('[data-close-delete-modal]');
  const confirmDeleteButton = document.querySelector('#confirmDeletePlaylistButton');

  closeButtons.forEach((button) => {
    button.addEventListener('click', closeDeletePlaylistModal);
  });

  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener('click', deletePlaylist);
  }
}

// =========================
// 공통 키보드 이벤트 등록 함수
// =========================
function bindKeyboardEvents() {
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;

    closePlaylistMoreMenu();
    closePlaylistModal();
    closeRenamePlaylistModal();
    closeDeletePlaylistModal();
  });
}

// =========================
// 아이콘 SVG 함수
// =========================
function shareIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 16V4M12 4L7 9M12 4L17 9"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 14V19H19V14"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  `;
}

function editIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 20H8L19 9L15 5L4 16V20Z"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M14 6L18 10"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  `;
}

function trashIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7H20"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M10 11V17M14 11V17"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
      />
      <path
        d="M6 7L7 20H17L18 7"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
      <path
        d="M9 7V4H15V7"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  `;
}

// =========================
// HTML 특수문자 변환 함수
// =========================
function escapeHTML(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// =========================
// 사이드바 초기 실행 함수
// =========================
export async function initSidebar() {
  renderNav();

  isLoginUser = await isLoggedIn();

  if (isLoginUser) {
    setPlaylistListVisible(true);
    renderPlaylists();
  } else {
    setPlaylistListVisible(false);
  }

  bindPlaylistModalEvents();
  bindPlaylistMoreMenuEvents();
  bindPlaylistRenameEvents();
  bindPlaylistDeleteEvents();
  bindKeyboardEvents();
}
