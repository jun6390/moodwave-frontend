// =========================
// 공통 데이터
// =========================
export const ICON_PATH = '/assets/icon/';

// =========================
// 메뉴 목록
// =========================
export const navItems = [
  {
    label: 'Home',
    icon: 'Home_Fill_S.svg',
    href: '#/home',
  },
  {
    label: 'Weather Vibes',
    icon: 'weather.svg',
    href: '/pages/weather.html',
  },
  {
    label: 'Your Status',
    icon: 'status.svg',
    href: '/pages/chart.html',
  },
];

// =========================
// 플레이리스트 메뉴 목록
// =========================
export const playlistMenuItems = [
  {
    label: 'Create Playlist',
    icon: '+Library_S.svg',
  },
  {
    label: 'Liked Songs',
    icon: 'Liked Songs_S.svg',
  },
];

// =========================
// 기본 이미지
// =========================
export const placeholder = {
  avatar:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='34' height='34' viewBox='0 0 34 34'%3E%3Ccircle cx='17' cy='17' r='17' fill='%23999999'/%3E%3Ccircle cx='17' cy='13' r='5' fill='%23ffffff'/%3E%3Cpath d='M8 28c1.5-5 5-8 9-8s7.5 3 9 8' fill='%23ffffff'/%3E%3C/svg%3E",

  cover82:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='82' height='82' viewBox='0 0 82 82'%3E%3Crect width='82' height='82' fill='%23999999'/%3E%3C/svg%3E",

  cover182:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='182' height='182' viewBox='0 0 182 182'%3E%3Crect width='182' height='182' fill='%23999999'/%3E%3C/svg%3E",
};

// =========================
// 프로필
// =========================
export const user = {
  name: 'HAEJUNPARK',
  avatar: placeholder.avatar,
};

// 날씨별 플레이리스트 히어로
export const playlistMap = {
  Rain: {
    weather: 'Rainy',
    title: 'Overcast Vibes',
    description: '비 오는 창가와 잘 어울리는 잔잔한 감성 플레이리스트',
    image: '/assets/img/rainy-2.jpg',
    genre: 'Lo-fi • Jazz • Acoustic',
    label: 'RAINY PLAYLIST',
  },

  Clouds: {
    weather: 'Cloudy',
    title: 'Cloudy Skies',
    description: '흐린 오후를 천천히 채워주는 부드러운 사운드',
    image: '/assets/img/cloudy.jpg',
    genre: 'Dream Pop • Indie • Shoegaze',
    label: 'CLOUDY PLAYLIST',
  },

  Clear: {
    weather: 'Sunny',
    title: 'Golden Hour',
    description: '햇살 가득한 하루를 더 밝게 만드는 플레이리스트',
    image: '/assets/img/sunny-4.jpg',
    genre: 'Pop • Funk • Disco',
    label: 'SUNNY PLAYLIST',
  },

  Snow: {
    weather: 'Snowy',
    title: 'Winter Hush',
    description: '포근한 겨울 풍경과 어울리는 따뜻한 선율',
    image: '/assets/img/snowy-3.jpg',
    genre: 'Piano • Ambient • Jazz',
    label: 'SNOWY PLAYLIST',
  },

  Thunderstorm: {
    weather: 'Stormy',
    title: 'Thunder Echoes',
    description: '천둥소리와 함께 몰입하기 좋은 강렬한 사운드',
    image: '/assets/img/stormy.jpg',
    genre: 'Electronic • Alt Rock • Synthwave',
    label: 'STORMY PLAYLIST',
  },

  Foggy: {
    weather: 'Foggy',
    title: 'Midnight Mist',
    description: '안개 낀 새벽의 몽환적인 분위기를 담은 플레이리스트',
    image: '/assets/img/foggy.jpg',
    genre: 'Ambient • Downtempo • Dream Pop',
    label: 'FOGGY PLAYLIST',
  },
};

// 날씨 플레이리스트 더미 데이터
export const weatherTracks = {
  Rain: [
    { id: 1, title: '밤편지', artist: '아이유', album: 'Palette', duration: '4:12' },
    { id: 2, title: 'Square (2017)', artist: '백예린', album: 'Every letter I sent you.', duration: '4:31' },
    { id: 3, title: 'Everything', artist: '검정치마', album: 'TEAM BABY', duration: '3:43' },
    { id: 4, title: 'Love Me More', artist: 'dosii', album: 'Fantasy', duration: '3:18' },
    { id: 5, title: 'Coffee', artist: 'beabadoobee', album: 'Coffee', duration: '4:18' },

    { id: 6, title: 'Promise', artist: 'Laufey', album: 'Bewitched', duration: '3:54' },
    { id: 7, title: 'Like A Star', artist: 'Corinne Bailey Rae', album: 'Corinne Bailey Rae', duration: '4:03' },
    { id: 8, title: 'Movie', artist: 'Tom Misch', album: 'Geography', duration: '3:47' },
    { id: 9, title: 'Best Part', artist: 'Daniel Caesar', album: 'Freudian', duration: '3:29' },
    { id: 10, title: 'Cherry Wine', artist: 'Hozier', album: 'Hozier', duration: '4:01' },
  ],

  Clouds: [
    { id: 1, title: '난춘', artist: '새소년', album: '여름깃', duration: '5:21' },
    { id: 2, title: 'Antifreeze', artist: '검정치마', album: 'THIRSTY', duration: '4:26' },
    { id: 3, title: 'Dreams Tonite', artist: 'Alvvays', album: 'Antisocialites', duration: '3:15' },
    { id: 4, title: 'Apocalypse', artist: 'Cigarettes After Sex', album: 'Cigarettes After Sex', duration: '4:50' },
    { id: 5, title: 'Space Song', artist: 'Beach House', album: 'Depression Cherry', duration: '5:20' },

    { id: 6, title: 'Myth', artist: 'Beach House', album: 'Bloom', duration: '4:18' },
    { id: 7, title: 'Heavenly', artist: 'Cigarettes After Sex', album: 'Cry', duration: '4:47' },
    { id: 8, title: 'Show Me How', artist: 'Men I Trust', album: 'Oncle Jazz', duration: '3:35' },
    { id: 9, title: 'Bags', artist: 'Clairo', album: 'Immunity', duration: '4:20' },
    { id: 10, title: 'Fade Into You', artist: 'Mazzy Star', album: 'So Tonight That I Might See', duration: '4:55' },
  ],

  Clear: [
    { id: 1, title: '에잇', artist: '아이유', album: '에잇', duration: '2:47' },
    { id: 2, title: 'Levitating', artist: 'Dua Lipa', album: 'Future Nostalgia', duration: '3:23' },
    { id: 3, title: 'Treasure', artist: 'Bruno Mars', album: 'Unorthodox Jukebox', duration: '2:58' },
    { id: 4, title: 'Get Lucky', artist: 'Daft Punk', album: 'Random Access Memories', duration: '6:09' },
    { id: 5, title: 'Espresso', artist: 'Sabrina Carpenter', album: 'Short n Sweet', duration: '2:55' },

    { id: 6, title: 'Attention', artist: 'Charlie Puth', album: 'Voicenotes', duration: '3:31' },
    { id: 7, title: 'Watermelon Sugar', artist: 'Harry Styles', album: 'Fine Line', duration: '2:54' },
    { id: 8, title: 'Good Luck, Babe!', artist: 'Chappell Roan', album: 'Good Luck, Babe!', duration: '3:38' },
    { id: 9, title: 'Electric Love', artist: 'BØRNS', album: 'Dopamine', duration: '3:38' },
    { id: 10, title: 'Sunroof', artist: 'Nicky Youre', album: 'Sunroof', duration: '2:43' },
  ],

  Snow: [
    { id: 1, title: 'River Flows In You', artist: 'Yiruma', album: 'First Love', duration: '3:08' },
    { id: 2, title: 'Kiss The Rain', artist: 'Yiruma', album: 'From The Yellow Room', duration: '4:18' },
    { id: 3, title: 'Winter Bear', artist: 'V', album: 'Winter Bear', duration: '2:54' },
    { id: 4, title: 'Snowman', artist: 'Sia', album: 'Everyday Is Christmas', duration: '2:45' },
    { id: 5, title: 'Bloom', artist: 'The Paper Kites', album: 'Woodland', duration: '3:30' },

    { id: 6, title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', album: 'Una Mattina', duration: '5:57' },
    { id: 7, title: 'Experience', artist: 'Ludovico Einaudi', album: 'In A Time Lapse', duration: '5:15' },
    { id: 8, title: 'Near Light', artist: 'Ólafur Arnalds', album: 'Living Room Songs', duration: '3:29' },
    { id: 9, title: 'Holocene', artist: 'Bon Iver', album: 'Bon Iver', duration: '5:36' },
    { id: 10, title: 'To Build A Home', artist: 'The Cinematic Orchestra', album: 'Ma Fleur', duration: '6:11' },
  ],
  Thunderstorm: [
    { id: 1, title: 'Nightcall', artist: 'Kavinsky', album: 'OutRun', duration: '4:18' },
    { id: 2, title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We’re Dreaming', duration: '4:04' },
    { id: 3, title: 'After Dark', artist: 'Mr.Kitty', album: 'Time', duration: '4:17' },
    { id: 4, title: 'Starboy', artist: 'The Weeknd', album: 'Starboy', duration: '3:50' },
    { id: 5, title: 'Genesis', artist: 'Grimes', album: 'Visions', duration: '4:15' },

    { id: 6, title: '505', artist: 'Arctic Monkeys', album: 'Favourite Worst Nightmare', duration: '4:13' },
    { id: 7, title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM', duration: '4:32' },
    { id: 8, title: 'Take Me Out', artist: 'Franz Ferdinand', album: 'Franz Ferdinand', duration: '3:57' },
    { id: 9, title: 'Electric Feel', artist: 'MGMT', album: 'Oracular Spectacular', duration: '3:49' },
    { id: 10, title: 'Kids', artist: 'MGMT', album: 'Oracular Spectacular', duration: '5:03' },
  ],

  Foggy: [
    { id: 1, title: 'Fairy Of Shampoo', artist: 'dosii', album: 'dosii', duration: '3:52' },
    { id: 2, title: 'Nothing’s Gonna Hurt You Baby', artist: 'Cigarettes After Sex', album: 'I.', duration: '4:46' },
    { id: 3, title: 'Fade Into You', artist: 'Mazzy Star', album: 'So Tonight That I Might See', duration: '4:55' },
    { id: 4, title: 'Wait', artist: 'M83', album: 'Hurry Up, We’re Dreaming', duration: '5:43' },
    { id: 5, title: 'My Love Mine All Mine', artist: 'Mitski', album: 'The Land Is Inhospitable', duration: '2:17' },

    { id: 6, title: 'Youth', artist: 'Daughter', album: 'If You Leave', duration: '4:13' },
    { id: 7, title: 'Anchor', artist: 'Novo Amor', album: 'Birthplace', duration: '4:18' },
    { id: 8, title: 'A Walk', artist: 'Tycho', album: 'Dive', duration: '5:18' },
    { id: 9, title: 'Sunset Lover', artist: 'Petit Biscuit', album: 'Presence', duration: '3:58' },
    { id: 10, title: 'Roslyn', artist: 'Bon Iver', album: 'The Twilight Saga', duration: '4:49' },
  ],
};
