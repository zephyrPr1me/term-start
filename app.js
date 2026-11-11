/* term·start — terminal-style start page
   storage: localStorage key "termstart.v1"
   bangs:   !g google · !d ddg · !yt youtube · !w wikipedia · … (см. ENGINES) */

'use strict';

/* ============ engines ============ */

const ENGINES = [
  {
    id: 'google',
    name: 'Google',
    bang: 'g',
    url: 'https://www.google.com/search?q=%s',
  },
  { id: 'ddg', name: 'DuckDuckGo', bang: 'd', url: 'https://duckduckgo.com/?q=%s' },
  { id: 'bing', name: 'Bing', bang: 'b', url: 'https://www.bing.com/search?q=%s' },
  {
    id: 'brave',
    name: 'Brave Search',
    bang: 'br',
    url: 'https://search.brave.com/search?q=%s',
  },
  {
    id: 'startpage',
    name: 'Startpage',
    bang: 'sp',
    url: 'https://www.startpage.com/sp/search?query=%s',
  },
  {
    id: 'mojeek',
    name: 'Mojeek',
    bang: 'mj',
    url: 'https://www.mojeek.com/search?q=%s',
  },
  {
    id: 'marginalia',
    name: 'Marginalia',
    bang: 'mg',
    url: 'https://search.marginalia.nu/search?query=%s',
  },
  { id: 'wiby', name: 'Wiby', bang: 'wb', url: 'https://wiby.me/?q=%s' },
  { id: 'searx', name: 'SearXNG', bang: 'sx', url: 'https://searx.be/search?q=%s' },
  {
    id: 'yandex',
    name: 'Яндекс',
    bang: 'ya',
    url: 'https://yandex.ru/search/?text=%s',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    bang: 'w',
    url: 'https://ru.wikipedia.org/w/index.php?search=%s',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    bang: 'yt',
    url: 'https://www.youtube.com/results?search_query=%s',
  },
  { id: 'github', name: 'GitHub', bang: 'gh', url: 'https://github.com/search?q=%s' },
  { id: 'gitlab', name: 'GitLab', bang: 'gl', url: 'https://gitlab.com/search?q=%s' },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    bang: 'so',
    url: 'https://stackoverflow.com/search?q=%s',
  },
  { id: 'npm', name: 'npm', bang: 'npm', url: 'https://www.npmjs.com/search?q=%s' },
  {
    id: 'mdn',
    name: 'MDN',
    bang: 'mdn',
    url: 'https://developer.mozilla.org/ru/search?q=%s',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    bang: 'r',
    url: 'https://www.reddit.com/search/?q=%s',
  },
  { id: 'habr', name: 'Хабр', bang: 'h', url: 'https://habr.com/ru/search/?q=%s' },
  {
    id: 'cinemate',
    name: 'Кинопоиск',
    bang: 'kp',
    url: 'https://www.kinopoisk.ru/index.php?what_film=1&kp_query=%s',
  },
  {
    id: 'wiki-en',
    name: 'Wikipedia EN',
    bang: 'wen',
    url: 'https://en.wikipedia.org/w/index.php?search=%s',
  },
  {
    id: 'scholar',
    name: 'Google Scholar',
    bang: 'sc',
    url: 'https://scholar.google.com/scholar?q=%s',
  },
  {
    id: 'archive',
    name: 'Wayback',
    bang: 'wbm',
    url: 'https://web.archive.org/web/*/%s',
  },
  {
    id: 'images',
    name: 'Google Images',
    bang: 'img',
    url: 'https://www.google.com/search?tbm=isch&q=%s',
  },
  {
    id: 'maps',
    name: 'OpenStreetMap',
    bang: 'osm',
    url: 'https://www.openstreetmap.org/search?query=%s',
  },
  {
    id: 'translate',
    name: 'Переводчик',
    bang: 'tr',
    url: 'https://translate.google.com/?sl=auto&tl=ru&text=%s&op=translate',
  },
  { id: 'grep-app', name: 'grep.app', bang: 'gp', url: 'https://grep.app/search?q=%s' },
  { id: 'hn', name: 'Hacker News', bang: 'hn', url: 'https://hn.algolia.com/?q=%s' },
  { id: 'amazon', name: 'Amazon', bang: 'am', url: 'https://www.amazon.com/s?k=%s' },
  { id: 'ozon', name: 'Ozon', bang: 'oz', url: 'https://www.ozon.ru/search/?text=%s' },
];

/* ============ helpers ============ */

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

const DEFAULT_LINKS = [
  { name: 'github', url: 'https://github.com', group: 'dev' },
  { name: 'gitlab', url: 'https://gitlab.com', group: 'dev' },
  { name: 'stack overflow', url: 'https://stackoverflow.com', group: 'dev' },
  { name: 'mdn', url: 'https://developer.mozilla.org', group: 'dev' },
  { name: 'npm', url: 'https://www.npmjs.com', group: 'dev' },
  { name: 'codepen', url: 'https://codepen.io', group: 'dev' },
  { name: 'caniuse', url: 'https://caniuse.com', group: 'dev' },
  { name: 'wikipedia', url: 'https://ru.wikipedia.org', group: 'learn' },
  { name: 'google scholar', url: 'https://scholar.google.com', group: 'learn' },
  { name: 'hacker news', url: 'https://news.ycombinator.com', group: 'learn' },
  { name: 'reddit', url: 'https://reddit.com', group: 'learn' },
  { name: 'habr', url: 'https://habr.com', group: 'learn' },
  { name: 'wayback', url: 'https://web.archive.org', group: 'learn' },
  { name: 'gmail', url: 'https://mail.google.com', group: 'work' },
  { name: 'drive', url: 'https://drive.google.com', group: 'work' },
  { name: 'calendar', url: 'https://calendar.google.com', group: 'work' },
  { name: 'notion', url: 'https://www.notion.so', group: 'work' },
  { name: 'youtube', url: 'https://youtube.com', group: 'media' },
  { name: 'spotify', url: 'https://open.spotify.com', group: 'media' },
  { name: 'kinopoisk', url: 'https://www.kinopoisk.ru', group: 'media' },
  { name: 'xkcd', url: 'https://xkcd.com', group: 'media' },
  { name: 'ozon', url: 'https://www.ozon.ru', group: 'shop' },
  { name: 'wildberries', url: 'https://www.wildberries.ru', group: 'shop' },
];

const DEFAULT_SETTINGS = {
  theme: 'phosphor',
  borders: 'solid',
  engine: 'google',
  language: 'ru',
  suggestBookmarks: true,
  suggestLinks: true,
  suggestEngines: true,
  clock24: true,
  openNewTab: true,
  showBookmarks: true,
  showLinks: true,
  font: 'iosevka',
  fontCustom: '',
  bgColor: '',
  bgImage: '',
  bgDim: 0.45,
  weatherLocation: '',
  bookmarks: null, // { folders: [ {name, items:[{name,url}]} ] }
  bookmarkCollapsed: null,
  bookmarkView: 'all',
  links: null, // [{name,url}]
};

/* стеки шрифтов; сами шрифты подтягиваются с cdn.jsdelivr.net (fontsource),
   при отсутствии сети работает локальный фолбэк */
const FONT_STACKS = {
  system: `ui-monospace, "SF Mono", Consolas, monospace`,
  iosevka: `"Iosevka", "Iosevka Term", ui-monospace, monospace`,
  victor: `"Victor Mono", ui-monospace, monospace`,
  jetbrains: `"JetBrains Mono", ui-monospace, monospace`,
  fira: `"Fira Code", ui-monospace, monospace`,
  cascadia: `"Cascadia Code", ui-monospace, monospace`,
};
const FONT_LABELS = {
  system: 'системный',
  iosevka: 'Iosevka',
  victor: 'Victor Mono',
  jetbrains: 'JetBrains Mono',
  fira: 'Fira Code',
  cascadia: 'Cascadia Code',
  custom: 'свой…',
};

let settings = { ...DEFAULT_SETTINGS };
const APP_VERSION = $('meta[name="application-version"]').content;
const PAGE_VERSION = $('meta[name="page-version"]').content;

const TRANSLATIONS = {
  ru: {
    appTitle: 'term·start',
    asciiSubtitle: '│ поиск · ссылки · закладки · погода',
    language: 'Язык интерфейса',
    command: ':cmd',
    quickActionsTitle: 'Быстрые действия (ctrl+k)',
    advanced: 'Расширенный поиск (a)',
    advancedButton: 'adv',
    addLink: 'Добавить быструю ссылку (e)',
    addLinkButton: '+link',
    importButton: '⇪bm',
    configButton: 'cfg',
    importBookmarksTitle: 'Импорт закладок (i)',
    settings: 'Настройки (ctrl+,)',
    help: 'Помощь (?)',
    hackButton: '↯hack',
    hackTitle: 'Открыть hack.html в этой же вкладке',
    search: 'поиск',
    searchPlaceholder: 'поиск, url, !bang или :команда…',
    searchAria: 'Строка поиска',
    searchHint:
      'tab — движок · !bang — разовый поиск · enter — искать · ctrl+enter — новая вкладка · : — команды',
    quickLinks: 'быстрые ссылки',
    keyRange: 'клавиши 1–9',
    edit: 'править',
    linkName: 'имя',
    linkUrl: 'url (example.com)',
    linkGroup: 'группа',
    linkKey: 'клавиша',
    save: 'сохранить',
    cancel: 'отмена',
    bookmarks: 'закладки',
    bookmarkFilter: 'поиск по названию или адресу…',
    bookmarkView: 'Фильтр закладок',
    bookmarkAll: 'Все',
    bookmarkFavorites: 'Избранное',
    bookmarkRecent: 'Недавно добавленные',
    collapseAll: 'Свернуть все',
    expandAll: 'Развернуть все',
    addFolder: '+ папка',
    folderName: 'Название папки',
    createFolder: 'Создать',
    favoritesGroup: 'Избранное',
    favoriteAdd: 'Добавить в избранное',
    favoriteRemove: 'Убрать из избранного',
    moveBookmark: 'Переместить в папку',
    deleteBookmark: 'Удалить закладку',
    renameFolder: 'Переименовать папку',
    deleteFolder: 'Удалить пустую папку',
    folderDuplicate: 'Такая папка уже существует.',
    folderNotEmpty: 'Сначала переместите или удалите закладки из этой папки.',
    folderRenamePrompt: 'Новое название папки',
    confirmDeleteBookmark: 'Удалить закладку?',
    deleteConfirm: 'Удалить',
    noFavorites: '// избранных закладок пока нет',
    noRecent: '// недавно добавленных закладок нет',
    emptyFolder: '// папка пуста',
    noBookmarksMatch: '// ничего не найдено по',
    import: 'импорт',
    theme: 'тема',
    engine: 'движок',
    links: 'ссылки',
    bookmarkShort: 'закл.',
    statusHelp: '/ поиск · ctrl+k действия · ? помощь',
    categoryDev: 'разработка',
    categoryLearn: 'чтение и знания',
    categoryWork: 'работа',
    categoryMedia: 'медиа',
    categoryShop: 'покупки',
    noBookmarks: '// закладок нет — нажмите [ импорт ] и выберите bookmarks.html',
    noBookmarksMatch: '// ничего не найдено по',
    items: 'шт.',
    none: 'нет',
    uptime: 'в работе',
    uptimeTitle: 'время с открытия страницы',
    autoShortcut: 'автоклавиша',
    customShortcut: 'своя клавиша',
    editLinkTitle: 'изменить ссылку',
    deleteLinkTitle: 'удалить ссылку',
    noCommand: '// нет такой команды',
    weather: 'погода',
    weatherCity: 'Город',
    weatherSearch: 'найти',
    useLocation: 'Моё местоположение',
    weatherStart: 'Введите город или определите местоположение.',
    weatherSearching: 'Ищу город…',
    weatherLoading: 'Загружаю прогноз…',
    weatherNoCity: 'Город не найден.',
    weatherError: 'Не удалось загрузить погоду.',
    weatherLocationError: 'Не удалось определить местоположение.',
    weatherPermission: 'Разрешите доступ к местоположению в браузере.',
    myLocation: 'Моё местоположение',
    feelsLike: 'ощущается',
    humidity: 'влажность',
    wind: 'ветер',
    forecast: 'на 5 дней',
    weatherClear: 'Ясно',
    weatherMostlyClear: 'Преимущественно ясно',
    weatherPartlyCloudy: 'Переменная облачность',
    weatherOvercast: 'Пасмурно',
    weatherFog: 'Туман',
    weatherDrizzle: 'Морось',
    weatherRain: 'Дождь',
    weatherSnow: 'Снег',
    weatherShowers: 'Ливень',
    weatherStorm: 'Гроза',
    advancedTitle: 'Расширенный поиск',
    advancedEngine: 'Поисковый движок',
    advancedPeriod: 'За какой период',
    allTime: 'За всё время',
    lastHour: 'Последний час',
    lastDay: 'Последние 24 часа',
    lastWeek: 'Последняя неделя',
    lastMonth: 'Последний месяц',
    lastYear: 'Последний год',
    primaryQuery: 'Основной запрос',
    exactPhrase: 'Точная фраза',
    excludeWords: 'Исключить слова',
    alternatives: 'Одно из слов (OR)',
    siteDomain: 'Сайт или домен',
    fileType: 'Тип файла',
    anyFile: 'Любой тип',
    titleWord: 'Слово в заголовке (intitle:)',
    urlWord: 'Слово в адресе (inurl:)',
    languageRegion: 'Язык / регион выдачи',
    any: 'Любой',
    finalQuery: 'Итоговый запрос',
    queryPreview: 'Поисковый запрос появится здесь...',
    searchIn: 'Искать в',
    ddgNote: 'DDG: период от суток; язык задаёт регион выдачи.',
    languageRussian: 'Русский',
    languageEnglish: 'Английский',
    languageGerman: 'Немецкий',
    languageFrench: 'Французский',
    commandsDialog: 'Быстрые действия',
    settingsDialog: 'Настройки',
    helpDialog: 'Помощь',
    settingTheme: 'тема',
    settingBorders: 'рамки панелей',
    settingEngine: 'движок по умолчанию',
    settingLanguage: 'язык интерфейса',
    settingFont: 'шрифт',
    settingFontCustom: 'имя своего шрифта (если выше «свой»)',
    settingBgColor: 'цвет фона (hex, пусто = цвет темы)',
    settingBgImage: 'фон-изображение (url)',
    settingBgDim: 'затемнение фон-изображения',
    settingWeatherCity: 'Город для погоды',
    settingOpenNewTab: 'открывать в новой вкладке',
    settingSuggestBookmarks: 'подсказки из закладок',
    settingSuggestLinks: 'подсказки из быстрых ссылок',
    settingSuggestEngines: 'подсказки !bang движков',
    settingShowLinks: 'показывать блок быстрых ссылок',
    settingShowBookmarks: 'показывать блок закладок',
    settingsFoot:
      'изменения применяются сразу · конфигурация включает все настройки и снимок этой панели',
    exportConfig: 'Экспорт конфигурации',
    importConfig: 'Импорт конфигурации',
    configExported: 'Конфигурация экспортирована со снимком настроек.',
    configImported: 'Конфигурация и город погоды восстановлены.',
    configIncompatible: 'Несовместимая версия приложения или страницы.',
    configInvalid: 'Файл конфигурации повреждён или имеет неверный формат.',
    screenshotFailed: 'Не удалось создать снимок настроек.',
  },
  en: {
    appTitle: 'term·start',
    asciiSubtitle: '│ search · links · bookmarks · weather',
    language: 'Interface language',
    command: ':cmd',
    quickActionsTitle: 'Quick actions (ctrl+k)',
    advanced: 'Advanced search (a)',
    advancedButton: 'adv',
    addLink: 'Add quick link (e)',
    addLinkButton: '+link',
    importButton: '⇪bm',
    configButton: 'cfg',
    importBookmarksTitle: 'Import bookmarks (i)',
    settings: 'Settings (ctrl+,)',
    help: 'Help (?)',
    hackButton: '↯hack',
    hackTitle: 'Open hack.html in this tab',
    search: 'search',
    searchPlaceholder: 'search, url, !bang or :command…',
    searchAria: 'Search field',
    searchHint:
      'tab — engine · !bang — one-off search · enter — search · ctrl+enter — new tab · : — commands',
    quickLinks: 'quick links',
    keyRange: 'keys 1–9',
    edit: 'edit',
    linkName: 'name',
    linkUrl: 'url (example.com)',
    linkGroup: 'group',
    linkKey: 'key',
    save: 'save',
    cancel: 'cancel',
    bookmarks: 'bookmarks',
    bookmarkFilter: 'Search names or URLs…',
    bookmarkView: 'Bookmark filter',
    bookmarkAll: 'All',
    bookmarkFavorites: 'Favorites',
    bookmarkRecent: 'Recently added',
    collapseAll: 'Collapse all',
    expandAll: 'Expand all',
    addFolder: '+ folder',
    folderName: 'Folder name',
    createFolder: 'Create',
    favoritesGroup: 'Favorites',
    favoriteAdd: 'Add to favorites',
    favoriteRemove: 'Remove from favorites',
    moveBookmark: 'Move to folder',
    deleteBookmark: 'Delete bookmark',
    renameFolder: 'Rename folder',
    deleteFolder: 'Delete empty folder',
    folderDuplicate: 'A folder with that name already exists.',
    folderNotEmpty: 'Move or delete this folder’s bookmarks first.',
    folderRenamePrompt: 'New folder name',
    confirmDeleteBookmark: 'Delete this bookmark?',
    deleteConfirm: 'Delete',
    noFavorites: '// no favorite bookmarks yet',
    noRecent: '// no recently added bookmarks',
    emptyFolder: '// folder is empty',
    noBookmarksMatch: '// no matches for',
    import: 'import',
    theme: 'theme',
    engine: 'engine',
    links: 'links',
    bookmarkShort: 'bm',
    statusHelp: '/ search · ctrl+k actions · ? help',
    categoryDev: 'development',
    categoryLearn: 'read & discover',
    categoryWork: 'work',
    categoryMedia: 'media',
    categoryShop: 'shopping',
    noBookmarks: '// no bookmarks — choose an exported bookmarks.html file',
    noBookmarksMatch: '// no matches for',
    items: 'items',
    none: 'none',
    uptime: 'up',
    uptimeTitle: 'time since page load',
    autoShortcut: 'auto shortcut',
    customShortcut: 'custom shortcut',
    editLinkTitle: 'edit link',
    deleteLinkTitle: 'delete link',
    noCommand: '// command not found',
    weather: 'weather',
    weatherCity: 'City',
    weatherSearch: 'go',
    useLocation: 'Use my location',
    weatherStart: 'Enter a city or use your location.',
    weatherSearching: 'Finding city…',
    weatherLoading: 'Loading forecast…',
    weatherNoCity: 'City not found.',
    weatherError: 'Could not load weather.',
    weatherLocationError: 'Could not determine your location.',
    weatherPermission: 'Allow location access in your browser.',
    myLocation: 'My location',
    feelsLike: 'feels like',
    humidity: 'humidity',
    wind: 'wind',
    forecast: '5-day forecast',
    weatherClear: 'Clear',
    weatherMostlyClear: 'Mostly clear',
    weatherPartlyCloudy: 'Partly cloudy',
    weatherOvercast: 'Overcast',
    weatherFog: 'Fog',
    weatherDrizzle: 'Drizzle',
    weatherRain: 'Rain',
    weatherSnow: 'Snow',
    weatherShowers: 'Showers',
    weatherStorm: 'Thunderstorm',
    advancedTitle: 'Advanced search',
    advancedEngine: 'Search engine',
    advancedPeriod: 'Date range',
    allTime: 'Any time',
    lastHour: 'Past hour',
    lastDay: 'Past 24 hours',
    lastWeek: 'Past week',
    lastMonth: 'Past month',
    lastYear: 'Past year',
    primaryQuery: 'Search terms',
    exactPhrase: 'Exact phrase',
    excludeWords: 'Exclude words',
    alternatives: 'Any of these words (OR)',
    siteDomain: 'Website or domain',
    fileType: 'File type',
    anyFile: 'Any type',
    titleWord: 'Word in title (intitle:)',
    urlWord: 'Word in URL (inurl:)',
    languageRegion: 'Language / region',
    any: 'Any',
    finalQuery: 'Final query',
    queryPreview: 'Your query will appear here...',
    searchIn: 'Search',
    ddgNote: 'DDG: date range starts at one day; language selects a region.',
    languageRussian: 'Russian',
    languageEnglish: 'English',
    languageGerman: 'German',
    languageFrench: 'French',
    commandsDialog: 'Quick actions',
    settingsDialog: 'Settings',
    helpDialog: 'Help',
    settingTheme: 'theme',
    settingBorders: 'panel borders',
    settingEngine: 'default engine',
    settingLanguage: 'interface language',
    settingFont: 'font',
    settingFontCustom: 'custom font name',
    settingBgColor: 'background color (hex)',
    settingBgImage: 'background image (url)',
    settingBgDim: 'background image dimming',
    settingWeatherCity: 'Weather city',
    settingOpenNewTab: 'open links in a new tab',
    settingSuggestBookmarks: 'bookmark suggestions',
    settingSuggestLinks: 'quick link suggestions',
    settingSuggestEngines: '!bang engine suggestions',
    settingShowLinks: 'show quick links',
    settingShowBookmarks: 'show bookmarks',
    settingsFoot:
      'Changes apply immediately · the configuration includes all settings and a snapshot of this panel',
    exportConfig: 'Export configuration',
    importConfig: 'Import configuration',
    configExported: 'Configuration exported with settings screenshot.',
    configImported: 'Configuration and weather city restored.',
    configIncompatible: 'Incompatible application or page version.',
    configInvalid: 'Configuration file is damaged or has an invalid format.',
    screenshotFailed: 'Could not capture settings screenshot.',
  },
};

function t(key) {
  return TRANSLATIONS[settings.language]?.[key] || TRANSLATIONS.ru[key] || key;
}

function applyLanguage() {
  const language = settings.language === 'en' ? 'en' : 'ru';
  document.documentElement.lang = language;
  document.title = t('appTitle');
  $$('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  $$('[data-i18n-placeholder]').forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  $$('[data-i18n-title]').forEach((el) => {
    el.title = t(el.dataset.i18nTitle);
  });
  $$('[data-i18n-aria-label]').forEach((el) => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });
  $$('.language-option').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
}

function setLanguage(language) {
  if (!['ru', 'en'].includes(language)) return;
  settings.language = language;
  save();
  renderAll();
  renderHelp();
  renderWeatherSnapshot();
  tick();
}

function load() {
  try {
    const raw = localStorage.getItem('termstart.v1');
    if (raw) {
      const stored = JSON.parse(raw);
      settings = { ...DEFAULT_SETTINGS, ...stored };
      if (!Array.isArray(stored.bookmarkCollapsed)) {
        settings.bookmarkCollapsed = (settings.bookmarks?.folders || []).map(
          (folder) => folder.name,
        );
      }
    }
    if (!['ru', 'en'].includes(settings.language)) settings.language = 'ru';
    if (!['all', 'favorites', 'recent'].includes(settings.bookmarkView))
      settings.bookmarkView = 'all';
  } catch (e) {
    /* first run or corrupted — use defaults */
  }
}
function save() {
  localStorage.setItem('termstart.v1', JSON.stringify(settings));
}

function engineById(id) {
  return ENGINES.find((e) => e.id === id) || ENGINES[0];
}

/* применить шрифт и фон из настроек к странице */
function applyCustomization() {
  const root = document.documentElement;
  const stack =
    settings.font === 'custom' && settings.fontCustom.trim()
      ? `"${settings.fontCustom.trim().replace(/"/g, '')}", ` + FONT_STACKS.system
      : FONT_STACKS[settings.font] || FONT_STACKS.system;
  root.style.setProperty('--mono', stack);

  if (settings.bgColor && /^#?[0-9a-f]{3,8}$/i.test(settings.bgColor.trim())) {
    root.style.setProperty('--bg', settings.bgColor.trim().replace(/^([^#])/, '#$1'));
  } else {
    root.style.removeProperty('--bg');
  }

  if (settings.bgImage.trim()) {
    const dim = Math.min(Math.max(settings.bgDim ?? 0.45, 0), 0.95);
    const img = settings.bgImage.trim().replace(/"/g, '');
    document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,${dim}),rgba(0,0,0,${dim})), url("${img}")`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundAttachment = 'fixed';
  } else {
    document.body.style.backgroundImage = '';
  }
}

/* все переходы в документе: целевая вкладка по настройке */
function applyLinkTarget(a) {
  if (settings.openNewTab) {
    a.target = '_blank';
    a.rel = 'noopener';
  }
}

function normalizeUrl(s) {
  s = s.trim();
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  return s;
}

function hostOf(url) {
  try {
    return new URL(normalizeUrl(url)).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function toast(msg, isErr) {
  const t = document.createElement('div');
  t.className = 'toast' + (isErr ? ' err' : '');
  t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => t.remove(), 3500);
}

/* open url, по умолчанию в этой же вкладке (настраивается) */
function openUrl(url, forceNewTab) {
  const nt = forceNewTab || settings.openNewTab;
  if (nt) window.open(url, '_blank', 'noopener');
  else location.href = url;
}

/* ============ parsing input ============ */

function looksLikeUrl(s) {
  if (/^https?:\/\//i.test(s)) return true;
  if (/\s/.test(s)) return false;
  return /^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(s) || /^localhost(:\d+)?/.test(s);
}

function parseInput(raw) {
  const s = raw.trim();
  if (!s) return null;
  if (s.startsWith(':')) return { type: 'command', cmd: s.slice(1).trim() };
  const bang = s.match(/^!(\S+)\s+(.*)$/s);
  if (bang) {
    const eng = ENGINES.find((e) => e.bang === bang[1]);
    if (eng) return { type: 'search', engine: eng, query: bang[2] };
  }
  const bangOnly = s.match(/^!(\S+)$/);
  if (bangOnly) {
    const eng = ENGINES.find((e) => e.bang === bangOnly[1]);
    if (eng) return { type: 'engine-switch', engine: eng };
  }
  if (looksLikeUrl(s)) return { type: 'url', url: normalizeUrl(s) };
  return { type: 'search', engine: engineById(settings.engine), query: s };
}

/* ============ search box ============ */

const q = $('#q');
const mirror = $('#mirror');
const cursorEl = $('#cursor');
const suggestBox = $('#suggest');
let sugItems = [];
let sugSel = -1;

function renderMirror() {
  mirror.textContent = q.value;
  cursorEl.classList.toggle('off', !q.value);
  const meas = document.createElement('span');
  meas.style.cssText =
    'position:absolute;visibility:hidden;white-space:pre;font:16px var(--mono)';
  meas.textContent = q.value.slice(0, 200);
  document.body.appendChild(meas);
  cursorEl.style.left = meas.offsetWidth + mirror.offsetLeft + 'px';
  meas.remove();
}

function refreshCursor() {
  requestAnimationFrame(renderMirror);
}

function buildSuggest() {
  const s = q.value.trim().toLowerCase();
  sugItems = [];
  if (!s) return closeSuggest();

  if (settings.suggestEngines && !s.startsWith(':')) {
    for (const e of ENGINES) {
      if (
        ('!' + e.bang).startsWith(s) ||
        e.name.toLowerCase().includes(s.replace(/^!/, ''))
      ) {
        if (s.startsWith('!') && !('!' + e.bang).startsWith(s)) continue;
        sugItems.push({
          text: ('!' + e.bang + ' ').padEnd(8) + e.name,
          tag: 'engine',
          apply: () => {
            q.value = '!';
          },
          action: () => {
            settings.engine = e.id;
            save();
            renderAll();
            toast('движок: ' + e.name);
            closeSuggest();
          },
        });
      }
      if (sugItems.length >= 6) break;
    }
  }

  if (settings.suggestLinks) {
    for (const l of getLinks()) {
      if (l.name.toLowerCase().includes(s)) {
        sugItems.push({
          text: l.name,
          tag: 'link:' + hostOf(l.url),
          apply: () => {
            q.value = l.name;
          },
          action: () => openUrl(normalizeUrl(l.url)),
        });
      }
    }
  }

  if (settings.suggestBookmarks && settings.bookmarks) {
    for (const f of settings.bookmarks.folders) {
      for (const it of f.items) {
        if (it.name.toLowerCase().includes(s) && sugItems.length < 14) {
          sugItems.push({
            text: it.name,
            tag: hostOf(it.url),
            apply: () => {
              q.value = it.name;
            },
            action: () => openUrl(it.url),
          });
        }
      }
    }
  }

  if (!sugItems.length) return closeSuggest();
  sugSel = -1;
  suggestBox.innerHTML = '';
  sugItems.forEach((it, i) => {
    const d = document.createElement('div');
    d.className = 'sug';
    d.innerHTML = `<span class="s-text"></span><span class="s-tag"></span>`;
    d.children[0].textContent = it.text;
    d.children[1].textContent = it.tag;
    d.onclick = () => it.action();
    suggestBox.appendChild(d);
  });
  suggestBox.hidden = false;
}

function closeSuggest() {
  suggestBox.hidden = true;
  sugSel = -1;
}

function moveSuggest(dir) {
  if (suggestBox.hidden) return;
  sugSel += dir;
  if (sugSel < 0) sugSel = sugItems.length - 1;
  if (sugSel >= sugItems.length) sugSel = 0;
  [...suggestBox.children].forEach((el, i) => el.classList.toggle('sel', i === sugSel));
}

/* chips — движки */
function renderChips() {
  const box = $('#chips');
  box.innerHTML = '';
  const list = settings.engineChips || [
    'google',
    'ddg',
    'wikipedia',
    'youtube',
    'github',
    'habr',
  ];
  for (const id of list) {
    const e = engineById(id);
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (settings.engine === e.id ? ' active' : '');
    b.textContent = e.bang + ' · ' + e.name;
    b.onclick = () => {
      settings.engine = e.id;
      save();
      renderAll();
      q.focus();
    };
    box.appendChild(b);
  }
}

function doSearch() {
  const parsed = parseInput(q.value);
  if (!parsed) return;
  switch (parsed.type) {
    case 'search':
      openUrl(parsed.engine.url.replace('%s', encodeURIComponent(parsed.query)));
      break;
    case 'url':
      openUrl(parsed.url);
      break;
    case 'engine-switch':
      settings.engine = parsed.engine.id;
      save();
      renderAll();
      q.value = '';
      renderMirror();
      toast('движок: ' + parsed.engine.name);
      break;
    case 'command':
      runCommand(parsed.cmd);
      break;
  }
}

/* ============ advanced search ============ */

const advancedForm = $('#advanced-form');
const advancedLanguage = {
  ru: { google: 'lang_ru', ddg: 'ru-ru' },
  en: { google: 'lang_en', ddg: 'us-en' },
  de: { google: 'lang_de', ddg: 'de-de' },
  fr: { google: 'lang_fr', ddg: 'fr-fr' },
};

function buildAdvancedQuery(engine = $('#adv-engine').value) {
  const value = (id) => $(id).value.trim();
  const parts = [];
  const query = value('#adv-query');
  const exact = value('#adv-exact');
  const excluded = value('#adv-exclude');
  const alternatives = value('#adv-or').split(/\s+/).filter(Boolean);

  if (query) parts.push(query);
  if (exact) parts.push(`"${exact}"`);
  excluded
    .split(/\s+/)
    .filter(Boolean)
    .forEach((word) => parts.push(`-${word}`));
  if (alternatives.length > 1) {
    parts.push(
      engine === 'ddg' ? alternatives.join(' ') : `(${alternatives.join(' OR ')})`,
    );
  } else if (alternatives.length === 1) parts.push(alternatives[0]);
  if (value('#adv-site')) parts.push(`site:${value('#adv-site')}`);
  if (value('#adv-filetype')) parts.push(`filetype:${value('#adv-filetype')}`);
  if (value('#adv-intitle')) parts.push(`intitle:${value('#adv-intitle')}`);
  if (value('#adv-inurl')) parts.push(`inurl:${value('#adv-inurl')}`);
  return parts.join(' ');
}

function buildAdvancedUrl() {
  const engine = $('#adv-engine').value;
  const params = new URLSearchParams({ q: buildAdvancedQuery() });
  const time = $('#adv-time').value;
  const language = $('#adv-lang').value;
  if (engine === 'google') {
    if (time) params.set('tbs', `qdr:${time}`);
    if (language) params.set('lr', advancedLanguage[language].google);
    return `https://www.google.com/search?${params}`;
  }
  if (time && time !== 'h') params.set('df', time);
  if (language) params.set('kl', advancedLanguage[language].ddg);
  return `https://duckduckgo.com/?${params}`;
}

function updateAdvancedPreview() {
  const query = buildAdvancedQuery();
  $('#advanced-preview').textContent = query || t('queryPreview');
  const engine = $('#adv-engine').value;
  const engineName = engine === 'google' ? 'Google' : 'DuckDuckGo';
  const hourlyOption = $('#adv-time').querySelector('option[value="h"]');
  hourlyOption.disabled = engine === 'ddg';
  if (hourlyOption.disabled && $('#adv-time').value === 'h') $('#adv-time').value = 'd';
  $('#advanced-submit').textContent = t('searchIn') + ' ' + engineName;
  $('#advanced-note').textContent = engine === 'ddg' ? t('ddgNote') : '';
}

function openAdvancedSearch() {
  $('#adv-engine').value = ['google', 'ddg'].includes(settings.engine)
    ? settings.engine
    : 'google';
  updateAdvancedPreview();
  openOverlay('#advanced-search');
}

advancedForm.addEventListener('input', updateAdvancedPreview);
advancedForm.addEventListener('change', updateAdvancedPreview);
advancedForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  if (!buildAdvancedQuery()) {
    toast('введите поисковый запрос', true);
    $('#adv-query').focus();
    return;
  }
  openUrl(buildAdvancedUrl(), true);
});

/* ============ weather ============ */

const WEATHER_CODES = {
  0: 'weatherClear',
  1: 'weatherMostlyClear',
  2: 'weatherPartlyCloudy',
  3: 'weatherOvercast',
  45: 'weatherFog',
  48: 'weatherFog',
  51: 'weatherDrizzle',
  53: 'weatherDrizzle',
  55: 'weatherDrizzle',
  56: 'weatherDrizzle',
  57: 'weatherDrizzle',
  61: 'weatherRain',
  63: 'weatherRain',
  65: 'weatherRain',
  66: 'weatherRain',
  67: 'weatherRain',
  71: 'weatherSnow',
  73: 'weatherSnow',
  75: 'weatherSnow',
  77: 'weatherSnow',
  80: 'weatherShowers',
  81: 'weatherShowers',
  82: 'weatherShowers',
  85: 'weatherSnow',
  86: 'weatherSnow',
  95: 'weatherStorm',
  96: 'weatherStorm',
  99: 'weatherStorm',
};
let weatherSnapshot = null;

function weatherDescription(code) {
  return t(WEATHER_CODES[code] || 'weatherOvercast');
}

function weatherSymbol(code) {
  if (code === 0 || code === 1) return '☀';
  if (code === 2) return '◐';
  if (code === 45 || code === 48) return '≋';
  if (code >= 71 && code <= 86) return '❄';
  if (code >= 95) return '⚡';
  if (code >= 51 && code <= 57) return '⋰';
  if (code >= 80) return '☂';
  if (code >= 61) return '☂';
  return '☁';
}

function setWeatherStatus(message, isError = false) {
  const status = $('#weather-status');
  status.hidden = false;
  status.className = 'weather-status' + (isError ? ' err' : '');
  status.textContent = message;
}

function renderWeatherSnapshot() {
  if (!weatherSnapshot) return;
  const { data, location } = weatherSnapshot;
  const current = $('#weather-current');
  const forecast = $('#weather-forecast');
  const locale = settings.language === 'en' ? 'en-US' : 'ru-RU';
  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const main = create('div', 'weather-main');
  main.appendChild(
    create('div', 'weather-symbol', weatherSymbol(data.current.weather_code)),
  );
  const summary = create('div', 'weather-summary');
  summary.appendChild(create('div', 'weather-place', location));
  summary.appendChild(
    create('div', 'weather-temperature', `${Math.round(data.current.temperature_2m)}°`),
  );
  summary.appendChild(
    create('div', 'weather-description', weatherDescription(data.current.weather_code)),
  );
  main.appendChild(summary);

  const details = create('div', 'weather-details');
  const detail = (label, value) => {
    const item = create('div', 'weather-detail');
    item.append(
      create('span', 'weather-detail-label', label),
      create('strong', '', value),
    );
    details.appendChild(item);
  };
  detail(t('feelsLike'), `${Math.round(data.current.apparent_temperature)}°`);
  detail(t('humidity'), `${data.current.relative_humidity_2m}%`);
  detail(t('wind'), `${Math.round(data.current.wind_speed_10m)} km/h`);
  current.replaceChildren(main, details);
  current.hidden = false;

  forecast.replaceChildren();
  forecast.appendChild(create('div', 'weather-forecast-title', t('forecast')));
  const days = create('div', 'weather-days');
  data.daily.time.forEach((date, index) => {
    const day = create('div', 'weather-day');
    day.appendChild(
      create(
        'span',
        'weather-day-name',
        new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
          new Date(`${date}T12:00:00`),
        ),
      ),
    );
    day.appendChild(
      create(
        'span',
        'weather-day-symbol',
        weatherSymbol(data.daily.weather_code[index]),
      ),
    );
    day.appendChild(
      create(
        'span',
        'weather-day-range',
        `${Math.round(data.daily.temperature_2m_max[index])}° / ${Math.round(data.daily.temperature_2m_min[index])}°`,
      ),
    );
    days.appendChild(day);
  });
  forecast.appendChild(days);
  forecast.hidden = false;
  $('#weather-status').hidden = true;
}

async function fetchWeather(
  latitude,
  longitude,
  location,
  rememberCity = false,
  defaultCity = location,
) {
  setWeatherStatus(t('weatherLoading'));
  $('#weather-current').hidden = true;
  $('#weather-forecast').hidden = true;
  const params = new URLSearchParams({
    latitude,
    longitude,
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min',
    timezone: 'auto',
    forecast_days: '5',
  });
  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
    if (!response.ok) throw new Error('weather response');
    const data = await response.json();
    if (!data.current || !data.daily) throw new Error('weather data');
    weatherSnapshot = { data, location };
    if (rememberCity) {
      settings.weatherLocation = defaultCity;
      $('#weather-location').value = defaultCity;
      const citySetting = $('#set-body [data-setting="weatherLocation"]');
      if (citySetting) citySetting.value = defaultCity;
      save();
    }
    renderWeatherSnapshot();
  } catch {
    setWeatherStatus(t('weatherError'), true);
  }
}

async function searchWeatherCity(city) {
  const query = city.trim();
  if (!query) return;
  setWeatherStatus(t('weatherSearching'));
  const params = new URLSearchParams({
    name: query,
    count: '1',
    language: settings.language,
    format: 'json',
  });
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`,
    );
    if (!response.ok) throw new Error('geocoding response');
    const result = await response.json();
    const place = result.results?.[0];
    if (!place) {
      setWeatherStatus(t('weatherNoCity'), true);
      return;
    }
    const location = [place.name, place.country].filter(Boolean).join(', ');
    $('#weather-location').value = place.name;
    await fetchWeather(place.latitude, place.longitude, location, true, place.name);
  } catch {
    setWeatherStatus(t('weatherError'), true);
  }
}

$('#weather-form').addEventListener('submit', (ev) => {
  ev.preventDefault();
  searchWeatherCity($('#weather-location').value);
});

$('#weather-locate').addEventListener('click', () => {
  if (!navigator.geolocation) {
    setWeatherStatus(t('weatherPermission'), true);
    return;
  }
  setWeatherStatus(t('weatherLoading'));
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => fetchWeather(coords.latitude, coords.longitude, t('myLocation')),
    (error) =>
      setWeatherStatus(
        error.code === 1 ? t('weatherPermission') : t('weatherLocationError'),
        true,
      ),
    { enableHighAccuracy: false, maximumAge: 300000, timeout: 10000 },
  );
});

function initializeWeather() {
  $('#weather-location').value = settings.weatherLocation;
  if (settings.weatherLocation) searchWeatherCity(settings.weatherLocation);
}

q.addEventListener('input', () => {
  refreshCursor();
  buildSuggest();
});
q.addEventListener('focus', refreshCursor);

q.addEventListener('keydown', (ev) => {
  if (ev.key === 'Tab') {
    ev.preventDefault();
    const list = settings.engineChips || [
      'google',
      'ddg',
      'wikipedia',
      'youtube',
      'github',
      'habr',
    ];
    const idx = list.indexOf(settings.engine);
    settings.engine = list[(idx + 1 + list.length) % list.length] || ENGINES[0].id;
    save();
    renderAll();
    return;
  }
  if (!suggestBox.hidden) {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      moveSuggest(1);
      return;
    }
    if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      moveSuggest(-1);
      return;
    }
    if (ev.key === 'Enter' && sugSel >= 0) {
      ev.preventDefault();
      sugItems[sugSel].action();
      q.value = '';
      closeSuggest();
      renderMirror();
      return;
    }
    if (ev.key === 'Escape') {
      closeSuggest();
      return;
    }
  }
  if (ev.key === 'Enter') {
    ev.preventDefault();
    doSearch();
    q.value = '';
    closeSuggest();
    renderMirror();
  }
  if (ev.key === 'Escape') {
    q.value = '';
    closeSuggest();
    renderMirror();
  }
});

/* ============ quick links ============ */

function getLinks() {
  return settings.links || DEFAULT_LINKS;
}

function linkGroupLabel(group) {
  const keys = {
    dev: 'categoryDev',
    learn: 'categoryLearn',
    work: 'categoryWork',
    media: 'categoryMedia',
    shop: 'categoryShop',
  };
  return keys[group] ? t(keys[group]) : group;
}

/* эффективные клавиши ссылок: своя клавиша (l.key) или автономер 1–9 по порядку */
let linkKeys = {};
let dragIdx = -1; // индекс перетаскиваемой ссылки, -1 = нет перетаскивания

function renderLinks() {
  const box = $('#links');
  box.innerHTML = '';
  box.className = 'links-root';
  const links = getLinks();
  linkKeys = {};

  // группы в порядке первого появления; без группы — первым блоком
  const groups = [];
  for (const l of links) {
    const g = (l.group || '').trim();
    let gr = groups.find((x) => x.name === g);
    if (!gr) {
      gr = { name: g, items: [] };
      groups.push(gr);
    }
    gr.items.push(l);
  }

  for (const gr of groups) {
    if (gr.name) {
      const cat = document.createElement('div');
      cat.className = 'bm-cat lk-cat';
      cat.textContent = '» ' + linkGroupLabel(gr.name);
      cat.dataset.group = gr.name;
      attachGroupDrop(cat);
      box.appendChild(cat);
    }
    const grid = document.createElement('div');
    grid.className = 'links';
    gr.items.forEach((l) => {
      const i = links.indexOf(l);
      const effKey =
        (l.key && l.key.length === 1 ? l.key.toLowerCase() : null) ||
        (i < 9 ? String(i + 1) : null);
      if (effKey && !(effKey in linkKeys)) linkKeys[effKey] = l;

      const a = document.createElement('a');
      a.className = 'link';
      a.href = normalizeUrl(l.url);
      a.draggable = true;
      a.dataset.i = i;
      applyLinkTarget(a);
      a.innerHTML = `<span class="lk-key"></span><span class="lk-name"></span><button type="button" class="lk-edit" title="изменить">✎</button><button type="button" class="lk-del" title="удалить">×</button>`;
      a.querySelector('.lk-edit').title = t('editLinkTitle');
      a.querySelector('.lk-del').title = t('deleteLinkTitle');
      const keyEl = a.querySelector('.lk-key');
      keyEl.textContent = effKey || '·';
      if (l.key) keyEl.classList.add('custom');
      keyEl.title = l.key
        ? `${t('customShortcut')}: ${l.key}`
        : `${t('autoShortcut')} №${i + 1}`;
      a.querySelector('.lk-name').textContent = l.name;
      a.querySelector('.lk-edit').onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        showLinkForm(+a.dataset.i);
      };
      a.querySelector('.lk-del').onclick = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        settings.links = getLinks().filter((x) => x !== l);
        save();
        renderAll();
        toast('удалено: ' + l.name);
      };
      attachLinkDrag(a, l);
      grid.appendChild(a);
    });
    box.appendChild(grid);
  }
  $('#st-links').textContent = t('links') + ':' + links.length;
}

/* drag&drop сортировка: бросок на ссылку — вставить перед ней,
   бросок на заголовок группы — перенести в эту группу */
function attachLinkDrag(a, l) {
  a.addEventListener('dragstart', (ev) => {
    dragIdx = getLinks().indexOf(l);
    a.classList.add('dragging');
    ev.dataTransfer.effectAllowed = 'move';
    ev.dataTransfer.setData('text/plain', 'link:' + dragIdx);
  });
  a.addEventListener('dragend', () => {
    dragIdx = -1;
    a.classList.remove('dragging');
  });
  a.addEventListener('dragover', (ev) => {
    if (dragIdx < 0) return;
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
    a.classList.add('dragover');
  });
  a.addEventListener('dragleave', () => a.classList.remove('dragover'));
  a.addEventListener('drop', (ev) => {
    if (dragIdx < 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    a.classList.remove('dragover');
    const links = [...getLinks()];
    const target = links[+a.dataset.i];
    if (!target || target === links[dragIdx]) {
      dragIdx = -1;
      return;
    }
    const [moved] = links.splice(dragIdx, 1);
    links.splice(links.indexOf(target), 0, moved);
    dragIdx = -1;
    settings.links = links;
    save();
    renderAll();
  });
}

function attachGroupDrop(cat) {
  cat.addEventListener('dragover', (ev) => {
    if (dragIdx < 0) return;
    ev.preventDefault();
    cat.classList.add('dragover');
  });
  cat.addEventListener('dragleave', () => cat.classList.remove('dragover'));
  cat.addEventListener('drop', (ev) => {
    if (dragIdx < 0) return;
    ev.preventDefault();
    ev.stopPropagation();
    cat.classList.remove('dragover');
    const links = getLinks();
    const moved = links[dragIdx];
    dragIdx = -1;
    if (!moved || moved.group === cat.dataset.group) return;
    moved.group = cat.dataset.group;
    save();
    renderAll();
    toast(`«${moved.name}» → группа «${moved.group}»`);
  });
}

const linkForm = $('#link-form');
function showLinkForm(editIdx) {
  linkForm.hidden = false;
  $('#lf-idx').value = editIdx;
  if (editIdx >= 0) {
    const l = getLinks()[editIdx];
    $('#lf-name').value = l.name;
    $('#lf-url').value = l.url;
    $('#lf-group').value = l.group || '';
    $('#lf-key').value = l.key || '';
  } else {
    $('#lf-name').value = '';
    $('#lf-url').value = '';
    $('#lf-group').value = '';
    $('#lf-key').value = '';
  }
  $('#lf-name').focus();
}

linkForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const name = $('#lf-name').value.trim();
  let url = $('#lf-url').value.trim();
  const group = $('#lf-group').value.trim();
  const key = $('#lf-key').value.trim().slice(0, 1).toLowerCase();
  if (!name || !url) return;
  url = normalizeUrl(url);
  const idx = +$('#lf-idx').value;
  const links = [...getLinks()];
  const entry = { name, url };
  if (group) entry.group = group;
  if (key) entry.key = key;
  if (idx >= 0 && idx < links.length) links[idx] = entry;
  else links.push(entry);
  settings.links = links;
  save();
  linkForm.hidden = true;
  renderAll();
});

$('#lf-cancel').onclick = () => {
  linkForm.hidden = true;
};
$('#links-edit').onclick = () => showLinkForm(-1);
$('#ha-add').onclick = () => showLinkForm(-1);

/* ============ bookmarks import ============ */

function parseBookmarksHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const folders = [];
  const walk = (dlEl, name) => {
    const items = [];
    const folder = { name: name || 'imported', items };
    for (const dt of dlEl.children) {
      if (dt.tagName !== 'DT') continue;
      const h3 = dt.querySelector(':scope > h3');
      const a = dt.querySelector(':scope > a');
      if (h3) {
        const sub = dt.querySelector(':scope > dl');
        if (sub) walk(sub, h3.textContent.trim());
      } else if (a) {
        items.push({
          name: a.textContent.trim() || a.href,
          url: a.href,
          addedAt: Date.now(),
        });
      }
    }
    if (items.length || folders.length === 0) folders.push(folder);
    // суб-папки добавили себя сами через рекурсию
  };
  const root = doc.querySelector('dl');
  if (root) walk(root, 'bookmarks');
  return { folders: folders.filter((f) => f.items.length) };
}

function renderBookmarkItem(item, folderIndex) {
  const li = document.createElement('li');
  li.className = 'bm-item';

  const favorite = document.createElement('button');
  favorite.type = 'button';
  favorite.className = 'bm-favorite' + (item.favorite ? ' active' : '');
  favorite.textContent = item.favorite ? '★' : '☆';
  favorite.title = t(item.favorite ? 'favoriteRemove' : 'favoriteAdd');
  favorite.setAttribute('aria-label', favorite.title);
  favorite.setAttribute('aria-pressed', String(!!item.favorite));
  favorite.onclick = () => {
    item.favorite = !item.favorite;
    save();
    renderBookmarks($('#bm-filter').value);
  };
  li.appendChild(favorite);

  const a = document.createElement('a');
  a.href = item.url;
  a.textContent = item.name;
  applyLinkTarget(a);
  li.appendChild(a);

  const host = document.createElement('span');
  host.className = 'bm-host';
  host.textContent = hostOf(item.url);
  li.appendChild(host);

  const folders = settings.bookmarks.folders;
  if (folders.length > 1) {
    const move = document.createElement('select');
    move.className = 'bm-move';
    move.title = t('moveBookmark');
    move.setAttribute('aria-label', `${t('moveBookmark')}: ${item.name}`);
    folders.forEach((folder, index) => {
      const option = document.createElement('option');
      option.value = index;
      option.textContent = folder.name;
      option.selected = index === folderIndex;
      move.appendChild(option);
    });
    move.onchange = () => {
      const targetIndex = Number(move.value);
      if (targetIndex === folderIndex) return;
      const [moved] = folders[folderIndex].items.splice(
        folders[folderIndex].items.indexOf(item),
        1,
      );
      folders[targetIndex].items.push(moved);
      save();
      renderBookmarks($('#bm-filter').value);
    };
    li.appendChild(move);
  }

  if (pendingDeleteBookmark === item) {
    const confirmRemove = document.createElement('button');
    confirmRemove.type = 'button';
    confirmRemove.className = 'bm-delete-confirm';
    confirmRemove.textContent = t('deleteConfirm');
    confirmRemove.onclick = () => {
      folders[folderIndex].items = folders[folderIndex].items.filter(
        (entry) => entry !== item,
      );
      pendingDeleteBookmark = null;
      save();
      renderBookmarks($('#bm-filter').value);
    };
    const cancelRemove = document.createElement('button');
    cancelRemove.type = 'button';
    cancelRemove.className = 'bm-folder-action';
    cancelRemove.textContent = '↶';
    cancelRemove.title = t('cancel');
    cancelRemove.onclick = () => {
      pendingDeleteBookmark = null;
      renderBookmarks($('#bm-filter').value);
    };
    li.append(confirmRemove, cancelRemove);
  } else {
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'bm-remove';
    remove.textContent = '×';
    remove.title = t('deleteBookmark');
    remove.setAttribute('aria-label', `${t('deleteBookmark')}: ${item.name}`);
    remove.onclick = () => {
      pendingDeleteBookmark = item;
      renderBookmarks($('#bm-filter').value);
    };
    li.appendChild(remove);
  }
  return li;
}

let pendingDeleteBookmark = null;
let editingBookmarkFolder = null;

function renderBookmarkGroup({
  name,
  key,
  entries,
  folderIndex,
  collapsed,
  collapsible = true,
}) {
  const section = document.createElement('section');
  section.className = 'bm-group';
  const header = document.createElement('div');
  header.className = 'bm-group-head';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'bm-cat';
  toggle.textContent = `${collapsed ? '▸' : '▾'} ${name}`;
  toggle.setAttribute('aria-expanded', String(!collapsed));
  toggle.disabled = !collapsible;
  toggle.onclick = () => {
    const closed = new Set(settings.bookmarkCollapsed || []);
    if (closed.has(key)) closed.delete(key);
    else closed.add(key);
    settings.bookmarkCollapsed = [...closed];
    save();
    renderBookmarks($('#bm-filter').value);
  };
  header.appendChild(toggle);

  if (folderIndex !== null) {
    const count = document.createElement('span');
    count.className = 'bm-folder-count';
    count.textContent = String(entries.length);
    header.appendChild(count);

    if (editingBookmarkFolder === folderIndex) {
      const renameForm = document.createElement('form');
      renameForm.className = 'bm-rename-form';
      const renameInput = document.createElement('input');
      renameInput.type = 'text';
      renameInput.value = name;
      renameInput.setAttribute('aria-label', t('folderRenamePrompt'));
      const renameSave = document.createElement('button');
      renameSave.type = 'submit';
      renameSave.className = 'bm-folder-action';
      renameSave.textContent = '✓';
      renameSave.title = t('save');
      const renameCancel = document.createElement('button');
      renameCancel.type = 'button';
      renameCancel.className = 'bm-folder-action';
      renameCancel.textContent = '↶';
      renameCancel.title = t('cancel');
      renameCancel.onclick = () => {
        editingBookmarkFolder = null;
        renderBookmarks($('#bm-filter').value);
      };
      renameForm.append(renameInput, renameSave, renameCancel);
      renameForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const nextName = renameInput.value.trim();
        if (!nextName) return;
        if (
          settings.bookmarks.folders.some(
            (folder, index) =>
              index !== folderIndex &&
              folder.name.toLowerCase() === nextName.toLowerCase(),
          )
        ) {
          toast(t('folderDuplicate'), true);
          return;
        }
        settings.bookmarks.folders[folderIndex].name = nextName;
        settings.bookmarkCollapsed = (settings.bookmarkCollapsed || []).map((entry) =>
          entry === name ? nextName : entry,
        );
        editingBookmarkFolder = null;
        save();
        renderBookmarks($('#bm-filter').value);
      });
      header.appendChild(renameForm);
      requestAnimationFrame(() => renameInput.focus());
    } else {
      const rename = document.createElement('button');
      rename.type = 'button';
      rename.className = 'bm-folder-action';
      rename.textContent = '✎';
      rename.title = t('renameFolder');
      rename.setAttribute('aria-label', `${t('renameFolder')}: ${name}`);
      rename.onclick = () => {
        editingBookmarkFolder = folderIndex;
        renderBookmarks($('#bm-filter').value);
      };
      header.appendChild(rename);
    }

    const removeFolder = document.createElement('button');
    removeFolder.type = 'button';
    removeFolder.className = 'bm-folder-action';
    removeFolder.textContent = '×';
    removeFolder.title = t('deleteFolder');
    removeFolder.setAttribute('aria-label', `${t('deleteFolder')}: ${name}`);
    removeFolder.disabled = settings.bookmarks.folders[folderIndex].items.length > 0;
    removeFolder.onclick = () => {
      if (settings.bookmarks.folders[folderIndex].items.length) {
        toast(t('folderNotEmpty'), true);
        return;
      }
      settings.bookmarks.folders.splice(folderIndex, 1);
      settings.bookmarkCollapsed = (settings.bookmarkCollapsed || []).filter(
        (entry) => entry !== name,
      );
      save();
      renderBookmarks($('#bm-filter').value);
    };
    header.appendChild(removeFolder);
  }

  section.appendChild(header);
  if (!collapsed) {
    const list = document.createElement('ul');
    list.className = 'bm-list';
    entries.forEach(({ item, sourceIndex }) =>
      list.appendChild(renderBookmarkItem(item, sourceIndex)),
    );
    if (!entries.length) {
      const empty = document.createElement('div');
      empty.className = 'bm-empty bm-folder-empty';
      empty.textContent = t('emptyFolder');
      section.appendChild(empty);
    } else section.appendChild(list);
  }
  return section;
}

function renderBookmarks(filter) {
  const box = $('#bookmarks');
  box.innerHTML = '';
  const bm = settings.bookmarks;
  const view = settings.bookmarkView || 'all';
  $$('.bookmark-view').forEach((button) => {
    button.classList.toggle('active', button.dataset.view === view);
    button.setAttribute('aria-pressed', String(button.dataset.view === view));
  });
  $('#bm-collapse').disabled = !bm || !bm.folders.length;
  $('#bm-expand').disabled = !bm || !bm.folders.length;
  $('#bm-count').textContent = bm
    ? bm.folders.reduce((n, f) => n + f.items.length, 0) + ' ' + t('items')
    : t('none');
  $('#st-bm').textContent =
    t('bookmarkShort') +
    ':' +
    (bm ? bm.folders.reduce((n, f) => n + f.items.length, 0) : 0);

  if (!bm) {
    const empty = document.createElement('div');
    empty.className = 'bm-empty';
    empty.textContent = t('noBookmarks');
    box.appendChild(empty);
    return;
  }

  const fl = (filter || '').toLowerCase();
  let shown = 0;
  const recentAfter = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const matches = (item) => {
    if (
      fl &&
      !item.name.toLowerCase().includes(fl) &&
      !item.url.toLowerCase().includes(fl)
    )
      return false;
    if (view === 'favorites' && !item.favorite) return false;
    if (view === 'recent' && (!item.addedAt || item.addedAt < recentAfter))
      return false;
    return true;
  };
  const allEntries = [];
  bm.folders.forEach((folder, sourceIndex) => {
    folder.items.forEach((item) => {
      if (matches(item)) allEntries.push({ item, sourceIndex });
    });
  });

  if (view === 'all') {
    const favorites = allEntries.filter(({ item }) => item.favorite);
    if (favorites.length) {
      box.appendChild(
        renderBookmarkGroup({
          name: t('favoritesGroup'),
          key: '__favorites__',
          entries: favorites,
          folderIndex: null,
          collapsed: (settings.bookmarkCollapsed || []).includes('__favorites__'),
        }),
      );
      shown += favorites.length;
    }
  }

  bm.folders.forEach((folder, sourceIndex) => {
    const entries = allEntries.filter(
      ({ item, sourceIndex: index }) =>
        index === sourceIndex && !(view === 'all' && item.favorite),
    );
    if (!entries.length && folder.items.length) return;
    const key = folder.name;
    const collapsed =
      !fl && view === 'all' && (settings.bookmarkCollapsed || []).includes(key);
    box.appendChild(
      renderBookmarkGroup({
        name: folder.name,
        key,
        entries,
        folderIndex: sourceIndex,
        collapsed,
      }),
    );
    shown += entries.length;
  });

  if (!shown) {
    const empty = document.createElement('div');
    empty.className = 'bm-empty';
    empty.textContent =
      view === 'favorites'
        ? t('noFavorites')
        : view === 'recent'
          ? t('noRecent')
          : fl
            ? `${t('noBookmarksMatch')} «${fl}»`
            : t('noBookmarks');
    box.appendChild(empty);
  }
}

function importFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = parseBookmarksHtml(reader.result);
      const n = data.folders.reduce((s, f) => s + f.items.length, 0);
      if (!n) {
        toast('закладок в файле не найдено', true);
        return;
      }
      settings.bookmarks = data;
      settings.bookmarkCollapsed = data.folders.map((folder) => folder.name);
      save();
      renderAll();
      toast(`импортировано: ${n} закладок, ${data.folders.length} папок`);
    } catch (e) {
      toast('не удалось разобрать файл', true);
    }
  };
  reader.readAsText(file);
}

$('#bm-import').onclick = () => $('#bm-file').click();
$('#bm-file').addEventListener('change', (ev) => {
  if (ev.target.files[0]) importFile(ev.target.files[0]);
  ev.target.value = '';
});

$('#bm-filter').addEventListener('input', (ev) => renderBookmarks(ev.target.value));

$$('.bookmark-view').forEach((button) => {
  button.addEventListener('click', () => {
    settings.bookmarkView = button.dataset.view;
    save();
    renderBookmarks($('#bm-filter').value);
  });
});

$('#bm-collapse').addEventListener('click', () => {
  settings.bookmarkCollapsed = [
    ...settings.bookmarks.folders.map((folder) => folder.name),
    '__favorites__',
  ];
  save();
  renderBookmarks($('#bm-filter').value);
});

$('#bm-expand').addEventListener('click', () => {
  settings.bookmarkCollapsed = [];
  save();
  renderBookmarks($('#bm-filter').value);
});

$('#bm-add-folder').addEventListener('click', () => {
  if (!settings.bookmarks) settings.bookmarks = { folders: [] };
  $('#bm-folder-form').hidden = false;
  $('#bm-folder-name').focus();
});

$('#bm-folder-form').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const name = $('#bm-folder-name').value.trim();
  if (!name) return;
  if (
    settings.bookmarks.folders.some(
      (folder) => folder.name.toLowerCase() === name.toLowerCase(),
    )
  ) {
    toast(t('folderDuplicate'), true);
    return;
  }
  settings.bookmarks.folders.push({ name, items: [] });
  settings.bookmarkCollapsed = (settings.bookmarkCollapsed || []).filter(
    (entry) => entry !== name,
  );
  $('#bm-folder-name').value = '';
  $('#bm-folder-form').hidden = true;
  save();
  renderBookmarks($('#bm-filter').value);
});

$('#bm-folder-cancel').addEventListener('click', () => {
  $('#bm-folder-form').hidden = true;
  $('#bm-folder-name').value = '';
});

/* drag&drop */
let dragDepth = 0;
document.addEventListener('dragenter', (ev) => {
  ev.preventDefault();
  dragDepth++;
  $('#dropzone').hidden = false;
});
document.addEventListener('dragleave', () => {
  if (--dragDepth <= 0) {
    dragDepth = 0;
    $('#dropzone').hidden = true;
  }
});
document.addEventListener('dragover', (ev) => ev.preventDefault());
document.addEventListener('drop', (ev) => {
  ev.preventDefault();
  dragDepth = 0;
  $('#dropzone').hidden = true;
  const f = ev.dataTransfer.files[0];
  if (!f) return;
  if (/\.json$/i.test(f.name)) restoreBackup(f);
  else importFile(f);
});

/* ============ backup: export / import json ============ */

function copyComputedStyles(source, target) {
  const computed = getComputedStyle(source);
  for (const property of computed) {
    target.style.setProperty(
      property,
      computed.getPropertyValue(property),
      computed.getPropertyPriority(property),
    );
  }
}

async function captureSettingsScreenshot() {
  const overlay = $('#settings');
  const dialog = overlay.querySelector('.dialog');
  const wasHidden = overlay.hidden;
  const previousOpacity = overlay.style.opacity;
  const previousPointerEvents = overlay.style.pointerEvents;
  if (wasHidden) {
    renderSettings();
    overlay.hidden = false;
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  }

  let host;
  try {
    await document.fonts.ready;
    await new Promise((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(resolve)),
    );

    const clone = dialog.cloneNode(true);
    const sourceNodes = [dialog, ...dialog.querySelectorAll('*')];
    const cloneNodes = [clone, ...clone.querySelectorAll('*')];
    sourceNodes.forEach((source, index) => {
      const target = cloneNodes[index];
      copyComputedStyles(source, target);
      if (source instanceof HTMLInputElement) {
        target.value = source.value;
        if (source.type === 'checkbox' || source.type === 'radio')
          target.checked = source.checked;
      } else if (source instanceof HTMLTextAreaElement) target.value = source.value;
      else if (source instanceof HTMLSelectElement) target.value = source.value;
    });

    clone.style.width = `${dialog.getBoundingClientRect().width}px`;
    clone.style.maxWidth = 'none';
    clone.style.maxHeight = 'none';
    clone.style.height = 'auto';
    clone.style.flex = 'none';
    clone.style.overflow = 'visible';
    const scrollBody = clone.querySelector('.dialog-body');
    scrollBody.style.maxHeight = 'none';
    scrollBody.style.height = 'auto';
    scrollBody.style.flex = 'none';
    scrollBody.style.overflow = 'visible';
    const settingsBody = clone.querySelector('#set-body');
    settingsBody.style.maxHeight = 'none';
    settingsBody.style.height = 'auto';
    settingsBody.style.overflow = 'visible';

    host = document.createElement('div');
    host.style.cssText =
      'position:fixed;left:-100000px;top:0;z-index:-1;overflow:visible;';
    host.appendChild(clone);
    document.body.appendChild(host);
    const width = Math.ceil(clone.getBoundingClientRect().width);
    const height = Math.ceil(clone.getBoundingClientRect().height);
    const markup = new XMLSerializer().serializeToString(clone);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><foreignObject width="100%" height="100%">${markup}</foreignObject></svg>`;
    const screenshotBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(screenshotBlob);
    });
  } finally {
    host?.remove();
    if (wasHidden) {
      overlay.hidden = true;
      overlay.style.opacity = previousOpacity;
      overlay.style.pointerEvents = previousPointerEvents;
    }
  }
}

function downloadJson(data, filenamePrefix) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  a.href = url;
  a.download = `${filenamePrefix}-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

async function exportBackup() {
  let settingsScreenshot;
  try {
    settingsScreenshot = await captureSettingsScreenshot();
  } catch (error) {
    toast(t('screenshotFailed'), true);
    return;
  }
  const data = {
    format: 'term-start/config',
    configVersion: 1,
    app: 'term-start',
    appVersion: APP_VERSION,
    pageVersion: PAGE_VERSION,
    exportedAt: new Date().toISOString(),
    settings: JSON.parse(JSON.stringify(settings)),
    settingsScreenshot: {
      mimeType: 'image/svg+xml',
      dataUrl: settingsScreenshot,
    },
  };
  downloadJson(data, 'term-start-config');
  toast(t('configExported'));
}

function isMajorVersionCompatible(imported, current) {
  const importedMatch = String(imported || '').match(/^(\d+)\.\d+\.\d+(?:[-+].*)?$/);
  const currentMatch = String(current || '').match(/^(\d+)\.\d+\.\d+(?:[-+].*)?$/);
  return !!importedMatch && !!currentMatch && importedMatch[1] === currentMatch[1];
}

function applyImportedSettings(importedSettings) {
  settings = { ...DEFAULT_SETTINGS, ...importedSettings };
  if (!Array.isArray(settings.links)) settings.links = null;
  if (!['ru', 'en'].includes(settings.language)) settings.language = 'ru';
  if (!Array.isArray(settings.bookmarkCollapsed)) {
    settings.bookmarkCollapsed = (settings.bookmarks?.folders || []).map(
      (folder) => folder.name,
    );
  }
  if (!['all', 'favorites', 'recent'].includes(settings.bookmarkView))
    settings.bookmarkView = 'all';
  if (typeof settings.weatherLocation !== 'string') settings.weatherLocation = '';
  settings.weatherLocation = settings.weatherLocation.trim();
  save();
  renderAll();
  renderHelp();
  initializeWeather();
}

function restoreBackup(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (
        !data ||
        data.app !== 'term-start' ||
        !data.settings ||
        typeof data.settings !== 'object'
      ) {
        toast(t('configInvalid'), true);
        return;
      }
      if (data.format === 'term-start/config') {
        if (
          data.configVersion !== 1 ||
          !isMajorVersionCompatible(data.appVersion, APP_VERSION) ||
          !isMajorVersionCompatible(data.pageVersion, PAGE_VERSION)
        ) {
          toast(t('configIncompatible'), true);
          return;
        }
        if (
          typeof data.settingsScreenshot?.dataUrl !== 'string' ||
          !/^data:image\/svg\+xml(?:;charset=utf-8)?;base64,/.test(
            data.settingsScreenshot.dataUrl,
          )
        ) {
          toast(t('configInvalid'), true);
          return;
        }
        applyImportedSettings(data.settings);
        toast(t('configImported'));
        return;
      }
      if (data.format) {
        toast(t('configInvalid'), true);
        return;
      }
      if (data.version !== 1) {
        toast(t('configIncompatible'), true);
        return;
      }
      applyImportedSettings(data.settings);
      toast(t('configImported'));
    } catch (e) {
      toast(t('configInvalid'), true);
    }
  };
  reader.readAsText(file);
}

$('#set-import-file').addEventListener('change', (ev) => {
  if (ev.target.files[0]) restoreBackup(ev.target.files[0]);
  ev.target.value = '';
});

/* перетащенный .json — восстановление бэкапа, .html — закладки */

/* ============ command palette ============ */

const palette = $('#palette');
const palInput = $('#pal-input');
const palList = $('#pal-list');
let palItems = [];
let palSel = 0;

const COMMANDS = [
  { cmd: ':theme', desc: 'сменить тему', run: () => cycleTheme() },
  { cmd: ':engine', desc: 'сменить движок', run: () => cycleEngine() },
  {
    cmd: ':advanced',
    desc: 'расширенный поиск Google / DuckDuckGo',
    run: () => openAdvancedSearch(),
  },
  { cmd: ':add', desc: 'добавить быструю ссылку', run: () => showLinkForm(-1) },
  { cmd: ':export', desc: 'бэкап всех настроек в json', run: () => exportBackup() },
  {
    cmd: ':restore',
    desc: 'восстановить настройки из json',
    run: () => $('#set-import-file').click(),
  },
  { cmd: ':import', desc: 'импортировать закладки', run: () => $('#bm-file').click() },
  {
    cmd: ':clear-bm',
    desc: 'удалить все импортированные закладки',
    run: () => {
      if (settings.bookmarks) {
        settings.bookmarks = null;
        save();
        renderAll();
        toast('закладки удалены');
      } else toast('закладок и так нет');
    },
  },
  {
    cmd: ':reset',
    desc: 'сбросить все настройки (danger)',
    run: () => {
      localStorage.removeItem('termstart.v1');
      settings = { ...DEFAULT_SETTINGS };
      renderAll();
      toast('настройки сброшены');
    },
  },
  {
    cmd: ':newtab',
    desc: 'открывать в новой вкладке (переключить)',
    run: () => {
      settings.openNewTab = !settings.openNewTab;
      save();
      toast('новая вкладка: ' + (settings.openNewTab ? 'вкл' : 'выкл'));
    },
  },
  { cmd: ':help', desc: 'помощь', run: () => openOverlay('#help') },
  { cmd: ':settings', desc: 'настройки', run: () => openOverlay('#settings') },
];

const COMMAND_DESCRIPTIONS_EN = {
  ':theme': 'Switch theme',
  ':engine': 'Switch search engine',
  ':advanced': 'Advanced Google / DuckDuckGo search',
  ':add': 'Add a quick link',
  ':export': 'Export settings to JSON',
  ':restore': 'Restore settings from JSON',
  ':import': 'Import bookmarks',
  ':clear-bm': 'Remove imported bookmarks',
  ':reset': 'Reset all settings',
  ':newtab': 'Toggle opening links in new tabs',
  ':help': 'Open help',
  ':settings': 'Open settings',
};

function renderPal() {
  const s = palInput.value.trim().toLowerCase();
  palItems = COMMANDS.filter(
    (c) => !s || c.cmd.includes(s) || c.desc.toLowerCase().includes(s),
  );
  palSel = 0;
  palList.innerHTML = '';
  if (!palItems.length) {
    palList.textContent = t('noCommand');
    palList.className = 'pal-list pal-empty';
    return;
  }
  palItems.forEach((c, i) => {
    const d = document.createElement('div');
    d.className = 'pal-item' + (i === palSel ? ' sel' : '');
    d.innerHTML = `<span class="pi-cmd"></span><span class="pi-desc"></span>`;
    d.children[0].textContent = c.cmd;
    d.children[1].textContent =
      settings.language === 'en' ? COMMAND_DESCRIPTIONS_EN[c.cmd] || c.desc : c.desc;
    d.onclick = () => {
      closeOverlay();
      c.run();
    };
    palList.appendChild(d);
  });
}

function openPalette() {
  openOverlay('#palette');
  palInput.value = '';
  renderPal();
  palInput.focus();
}

function runCommand(cmdStr) {
  const c = COMMANDS.find((x) => x.cmd.slice(1) === cmdStr);
  if (c) {
    closeSuggest();
    c.run();
  } else toast('неизвестная команда: :' + cmdStr, true);
}

palInput.addEventListener('input', renderPal);
palInput.addEventListener('keydown', (ev) => {
  if (ev.key === 'ArrowDown') {
    ev.preventDefault();
    palSel = Math.min(palSel + 1, palItems.length - 1);
    updatePalSel();
  } else if (ev.key === 'ArrowUp') {
    ev.preventDefault();
    palSel = Math.max(palSel - 1, 0);
    updatePalSel();
  } else if (ev.key === 'Enter') {
    ev.preventDefault();
    if (palItems[palSel]) {
      closeOverlay();
      palItems[palSel].run();
    }
  }
});
function updatePalSel() {
  [...palList.children].forEach((el, i) => el.classList.toggle('sel', i === palSel));
}

/* ============ overlays ============ */

function openOverlay(sel) {
  $(sel).hidden = false;
  const input = $(sel).querySelector('input');
  if (input) input.focus();
}
function closeOverlay() {
  $$('.overlay').forEach((o) => (o.hidden = true));
  q.focus();
}
$$('.overlay').forEach((o) => {
  o.addEventListener('mousedown', (ev) => {
    if (ev.target === o) closeOverlay();
  });
  o.querySelector('.overlay-close').onclick = closeOverlay;
});

/* ============ settings dialog ============ */

const THEMES = ['phosphor', 'amber', 'paper'];

function cycleTheme() {
  const next = THEMES[(THEMES.indexOf(settings.theme) + 1) % THEMES.length];
  settings.theme = next;
  save();
  renderAll();
  toast('тема: ' + next);
}

function cycleEngine() {
  const idx = ENGINES.findIndex((e) => e.id === settings.engine);
  settings.engine = ENGINES[(idx + 1) % ENGINES.length].id;
  save();
  renderAll();
  toast('движок: ' + engineById(settings.engine).name);
}

function renderSettings() {
  const body = $('#set-body');
  body.innerHTML = '';
  const engineLabels = Object.fromEntries(ENGINES.map((e) => [e.id, e.name]));
  const rows = [
    ['theme', t('settingTheme'), 'select', ['phosphor', 'amber', 'paper']],
    ['borders', t('settingBorders'), 'select', ['solid', 'dashed', 'double']],
    ['engine', t('settingEngine'), 'select', ENGINES.map((e) => e.id), engineLabels],
    [
      'language',
      t('settingLanguage'),
      'select',
      ['ru', 'en'],
      { ru: t('languageRussian'), en: t('languageEnglish') },
    ],
    [
      'font',
      t('settingFont'),
      'select',
      Object.keys(FONT_STACKS).concat(['custom']),
      FONT_LABELS,
    ],
    ['fontCustom', t('settingFontCustom'), 'text', null, null, 'Iosevka Term'],
    ['bgColor', t('settingBgColor'), 'text', null, null, '#0b0e0b'],
    ['bgImage', t('settingBgImage'), 'text', null, null, 'https://…/wallpaper.jpg'],
    ['weatherLocation', t('settingWeatherCity'), 'text', null, null, t('weatherCity')],
    ['bgDim', t('settingBgDim'), 'range'],
    ['openNewTab', t('settingOpenNewTab'), 'check'],
    ['suggestBookmarks', t('settingSuggestBookmarks'), 'check'],
    ['suggestLinks', t('settingSuggestLinks'), 'check'],
    ['suggestEngines', t('settingSuggestEngines'), 'check'],
    ['showLinks', t('settingShowLinks'), 'check'],
    ['showBookmarks', t('settingShowBookmarks'), 'check'],
  ];
  for (const [key, label, type, opts, labels, placeholder] of rows) {
    const row = document.createElement('div');
    row.className = 'set-row';
    const lab = document.createElement('label');
    lab.textContent = label;
    row.appendChild(lab);
    let input;
    if (type === 'select') {
      input = document.createElement('select');
      for (const o of opts) {
        const op = document.createElement('option');
        op.value = o;
        op.textContent = (labels && labels[o]) || o;
        input.appendChild(op);
      }
      input.value = settings[key];
      input.onchange = () => {
        settings[key] = input.value;
        save();
        renderAll();
        if (key === 'language') renderHelp();
      };
    } else if (type === 'check') {
      input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = !!settings[key];
      input.onchange = () => {
        settings[key] = input.checked;
        save();
        renderAll();
      };
    } else if (type === 'range') {
      input = document.createElement('input');
      input.type = 'range';
      input.min = '0';
      input.max = '90';
      input.step = '5';
      input.value = Math.round((settings[key] ?? 0.45) * 100);
      input.onchange = () => {
        settings[key] = input.value / 100;
        save();
        renderAll();
      };
    } else {
      input = document.createElement('input');
      input.type = 'text';
      input.placeholder = placeholder || '';
      input.value = settings[key] ?? '';
      input.className = 'set-text';
      input.dataset.setting = key;
      input.onchange = () => {
        settings[key] = input.value.trim();
        if (key === 'weatherLocation') {
          $('#weather-location').value = settings.weatherLocation;
          searchWeatherCity(settings.weatherLocation);
        }
        save();
        renderAll();
      };
    }
    row.appendChild(input);
    body.appendChild(row);
  }
  const backupRow = document.createElement('div');
  backupRow.className = 'set-row backup-row';
  const bExp = document.createElement('button');
  bExp.type = 'button';
  bExp.className = 'btn';
  bExp.textContent = t('exportConfig');
  bExp.onclick = exportBackup;
  const bImp = document.createElement('button');
  bImp.type = 'button';
  bImp.className = 'btn';
  bImp.textContent = t('importConfig');
  bImp.onclick = () => $('#set-import-file').click();
  backupRow.append(bExp, bImp);
  body.appendChild(backupRow);
}

/* ============ help ============ */

function renderHelp() {
  if (settings.language === 'en') {
    $('#help-body').innerHTML = `
<h3>Search</h3>
<table>
  <tr><td><code>text</code></td><td>Search with the default engine</td></tr>
  <tr><td><code>adv</code> / <code>:advanced</code></td><td>Advanced Google or DuckDuckGo search</td></tr>
  <tr><td><code>!g text</code></td><td>Search once with an engine, e.g. <code>!yt music</code></td></tr>
  <tr><td><code>!d</code></td><td>Set the default engine</td></tr>
  <tr><td><code>example.com</code></td><td>Open a URL directly</td></tr>
</table>
<h3>Shortcuts</h3>
<table>
  <tr><td><kbd>1</kbd>…<kbd>9</kbd></td><td>Open a quick link</td></tr>
  <tr><td><kbd>tab</kbd></td><td>Cycle search engines</td></tr>
  <tr><td><kbd>/</kbd></td><td>Focus search</td></tr>
  <tr><td><kbd>a</kbd></td><td>Open advanced search</td></tr>
  <tr><td><kbd>ctrl</kbd>+<kbd>k</kbd></td><td>Open command palette</td></tr>
  <tr><td><kbd>ctrl</kbd>+<kbd>,</kbd></td><td>Open settings</td></tr>
  <tr><td><kbd>e</kbd> / <kbd>i</kbd> / <kbd>t</kbd> / <kbd>b</kbd> / <kbd>?</kbd></td><td>Links / import / theme / bookmarks / help</td></tr>
</table>
<h3>Quick links</h3>
<p>Drag links to reorder them or drop onto a category heading to move them. Edit a link to assign a key or category.</p>
<h3>Weather</h3>
<p>Search a city or request your location. Weather is provided by Open-Meteo.</p>
<h3>Backups and bookmarks</h3>
<p><code>:export</code> downloads settings as JSON; <code>:restore</code> restores them. Import an exported browser bookmarks HTML file with [ import ].</p>`;
    return;
  }
  $('#help-body').innerHTML = `
<h3>поиск</h3>
<table>
  <tr><td><code>текст</code></td><td>поиск через движок по умолчанию</td></tr>
  <tr><td><code>adv</code> / <code>:advanced</code></td><td>расширенный поиск Google или DuckDuckGo с операторами, периодом и языком/регионом</td></tr>
  <tr><td><code>!g текст</code></td><td>разовый поиск через движок (bang), напр. <code>!yt котики</code></td></tr>
  <tr><td><code>!d</code></td><td>переключить движок по умолчанию</td></tr>
  <tr><td><code>example.com</code></td><td>перейти по адресу напрямую</td></tr>
</table>
<h3>bang-движки (часть)</h3>
<table>
  <tr><td>!g · !d · !b · !br · !sp · !mj</td><td>google, ddg, bing, brave, startpage, mojeek</td></tr>
  <tr><td>!ya · !h · !kp · !oz</td><td>яндекс, хабр, кинопоиск, озон</td></tr>
  <tr><td>!w · !wen · !yt · !gh · !so · !mdn</td><td>вики ru/en, youtube, github, so, mdn</td></tr>
  <tr><td>… и другие</td><td>всего ${ENGINES.length} — начинаете вводить <code>!</code> и видите список</td></tr>
</table>
<h3>клавиши</h3>
<table>
  <tr><td><kbd>1</kbd>…<kbd>9</kbd></td><td>открыть быструю ссылку № (или свою клавишу ссылки — задаётся в ✎)</td></tr>
  <tr><td><kbd>tab</kbd></td><td>следующий движок в чипсах</td></tr>
  <tr><td><kbd>ctrl</kbd>+<kbd>k</kbd></td><td>палитра быстрых действий</td></tr>
  <tr><td><kbd>ctrl</kbd>+<kbd>,</kbd></td><td>настройки</td></tr>
  <tr><td><kbd>e</kbd> / <kbd>i</kbd> / <kbd>t</kbd> / <kbd>b</kbd> / <kbd>?</kbd></td><td>ссылки / импорт / тема / к закладкам / помощь</td></tr>
  <tr><td><kbd>a</kbd></td><td>расширенный поиск</td></tr>
  <tr><td><kbd>ctrl</kbd>+<kbd>enter</kbd></td><td>открыть результат в новой вкладке</td></tr>
</table>
<h3>быстрые ссылки</h3>
<p>Перетаскивайте ссылки мышью, чтобы менять порядок; бросьте ссылку на заголовок группы («» название») — она переедет в эту группу. Свою клавишу и группу задаёт кнопка <code>✎</code>.</p>
<h3>бэкап</h3>
<p><code>:export</code> выгружает все настройки (ссылки, закладки, тему, фон) в json-файл; <code>:restore</code> восстанавливает из него. Файл также можно просто перетащить на страницу.</p>
<h3>закладки</h3>
<p>Экспортируйте закладки из браузера (Chrome/Firefox: bookmark manager → export to HTML) и перетащите файл на страницу или нажмите [ import ]. Поиск по закладкам работает в строке поиска и через фильтр.</p>
<h3>хотите сделать эту страницу домашней?</h3>
<p>Откройте её как локальный файл или поднимите <code>python3 -m http.server</code> в папке и укажите адрес в настройках браузера как «домашняя страница» / «startup page».</p>`;
}

/* ============ clock ============ */

function tick() {
  const d = new Date();
  const locale = settings.language === 'en' ? 'en-US' : 'ru-RU';
  const time = d.toLocaleTimeString(locale, { hour12: !settings.clock24 });
  $('#clock').textContent = time;
  $('#date').textContent = d.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/* uptime */
const bootTime = Date.now();
setInterval(() => {
  const s = Math.floor((Date.now() - bootTime) / 1000);
  $('#st-up').textContent =
    `${t('uptime')} ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}, 1000);

/* ============ hotkeys ============ */

document.addEventListener('keydown', (ev) => {
  const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(
    document.activeElement.tagName,
  );
  if (ev.key === 'Escape') {
    if ($$('.overlay').some((o) => !o.hidden)) {
      closeOverlay();
    } else if (document.activeElement === q) {
      q.value = '';
      closeSuggest();
      renderMirror();
    }
    return;
  }
  if (ev.ctrlKey && ev.key === 'k') {
    ev.preventDefault();
    openPalette();
    return;
  }
  if (ev.ctrlKey && ev.key === ',') {
    ev.preventDefault();
    openSettings();
    return;
  }
  if (ev.ctrlKey) return;
  if (typing) return;

  if (ev.key === '/') {
    ev.preventDefault();
    q.focus();
    return;
  }
  // свои клавиши ссылок (включая автономера 1–9) приоритетнее одноклавишных действий
  const k = ev.key.length === 1 ? ev.key.toLowerCase() : '';
  if (k && linkKeys[k]) {
    ev.preventDefault();
    openUrl(normalizeUrl(linkKeys[k].url));
    return;
  }
  switch (ev.key) {
    case 't':
      cycleTheme();
      break;
    case 'a':
      openAdvancedSearch();
      break;
    case 'e':
      showLinkForm(-1);
      break;
    case 'i':
      $('#bm-file').click();
      break;
    case 'b':
      $('#bookmarks-panel').scrollIntoView({ behavior: 'smooth' });
      break;
    case '?':
      openOverlay('#help');
      break;
  }
});

function openSettings() {
  renderSettings();
  openOverlay('#settings');
}

/* ============ statusline buttons ============ */

$('#st-theme').onclick = cycleTheme;
$('#st-engine').onclick = cycleEngine;
$('#st-links').onclick = () => showLinkForm(-1);
$('#st-bm').onclick = () =>
  $('#bookmarks-panel').scrollIntoView({ behavior: 'smooth' });
$('#ha-cmds').onclick = openPalette;
$('#ha-adv').onclick = openAdvancedSearch;
$('#lang-ru').onclick = () => setLanguage('ru');
$('#lang-en').onclick = () => setLanguage('en');
$('#ha-cfg').onclick = openSettings;
$('#ha-help').onclick = () => openOverlay('#help');
$('#ha-bm').onclick = () => $('#bm-file').click();

/* ============ init ============ */

function renderAll() {
  document.documentElement.dataset.theme = settings.theme;
  document.documentElement.dataset.borders = settings.borders;
  applyLanguage();
  applyCustomization();
  $('#st-theme').textContent = t('theme') + ':' + settings.theme;
  $('#st-engine').textContent = t('engine') + ':' + engineById(settings.engine).id;
  $('#engine-tag').textContent = engineById(settings.engine).name;
  $('#links-panel').hidden = !settings.showLinks;
  $('#bookmarks-panel').hidden = !settings.showBookmarks;
  renderChips();
  renderLinks();
  renderBookmarks($('#bm-filter').value);
  renderSettings();
  renderWeatherSnapshot();
}

load();
renderAll();
renderHelp();
initializeWeather();
tick();
setInterval(tick, 1000);
refreshCursor();
q.focus();
