/* RYU · kowasu — authorized CTF and learning workspace behavior.
   Shared layout and themes live in assets/css/ and theme-loader.js. */

(function () {
  'use strict';

  /* ============ helpers ============ */

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function readStore(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  function writeStore(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      /* storage may be unavailable, keep the session usable */
    }
  }

  /* не даём ссылке подсунуть javascript:/data: */
  function safeHref(url) {
    const value = typeof url === 'string' ? url.trim() : '';
    return /^(?:https?|ftp|file|mailto):/i.test(value) ? value : '#';
  }

  function normalizeUrl(value) {
    let url = typeof value === 'string' ? value.trim() : '';
    if (!url) return '';
    if (!/^[a-z][a-z0-9+.-]*:/i.test(url)) url = 'https://' + url;
    return /^(?:https?|ftp|file|mailto):/i.test(url) ? url : '';
  }

  let toastTimer = 0;
  function toast(message, isError) {
    const box = $('#toasts');
    if (!box) return;
    const item = document.createElement('div');
    item.className = 'toast' + (isError ? ' err' : '');
    item.textContent = message;
    box.appendChild(item);
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      while (box.firstChild) box.removeChild(box.firstChild);
    }, 2600);
  }

  const LANGUAGE_KEY = 'hpLanguage';
  const TRANSLATIONS = {
    ru: {
      settings: 'Настройки',
      settingsKicker: 'ЛАБОРАТОРИЯ / НАСТРОЙКИ',
      theme: 'Тема',
      engine: 'Движок',
      language: 'Язык интерфейса',
      russian: 'Русский',
      english: 'English',
      appearance: 'Внешний вид и поиск',
      layoutDensity: 'Плотность',
      densityComfortable: 'Комфортная',
      densityCompact: 'Компактная',
      layoutColumns: 'Колонки',
      columnsTwo: 'Две',
      columnsOne: 'Одна',
      moduleControls: 'Модули рабочего стола',
      moduleControlsHelp: 'Выберите видимые учебные модули и задайте их порядок.',
      showQuickLinks: '演習 · Practice',
      showThreatContext: '資料 · Study',
      showSessionStatus: '接続 · Session',
      showDetection: '防御 · Defense',
      showNotes: '手記 · Notes',
      showLabs: '道場 · Dojo',
      showPinnedResources: '書庫 · Library',
      moveUp: 'Переместить вверх',
      moveDown: 'Переместить вниз',
      resetWorkspace: 'Вернуть расположение по умолчанию',
      workspaceReset: 'Расположение рабочего стола сброшено',
      uiPrefsInvalid: 'Настройки интерфейса повреждены; восстановлены значения по умолчанию',
      help: 'Помощь',
      search: 'Поиск',
      searchPlaceholder: 'CTF, CVE или учебная тема…',
      searchHint: 'tab — движок · enter — поиск · / — фокус · t — тема · ? — помощь',
      workspaceLabel: 'CTF / АВТОРИЗОВАННОЕ ОБУЧЕНИЕ',
      workspaceIntro: 'Практика только на CTF-платформах, в своих лабораториях или с явным разрешением.',
      authorizedDisclaimer: 'Не атакуйте цели без разрешения. Практикуйтесь только на CTF-платформах, в своих лабораториях или с явным разрешением.',
      authorizedStatus: 'только разрешённые лаборатории',
      authorizedToast: 'Только разрешённые CTF, собственные лаборатории или тесты с явным разрешением.',
      userAgent: 'Браузер',
      catalog: 'Каталог',
      categoryTraining: 'авторизованное обучение / ctf',
      categoryDocs: 'документация',
      categoryNews: 'новости',
      quickAccess: '演習 · Practice',
      quickAccessTag: 'AUTHORIZED TRAINING',
      quickCisaDesc: 'Каталог активно используемых уязвимостей',
      quickNvdDesc: 'Поиск CVE и оценка уязвимостей',
      quickAttackDesc: 'Тактики, техники и меры защиты',
      quickPortswiggerDesc: 'Учебные лаборатории веб-безопасности',
      quickHtbDesc: 'Практика в учебных лабораториях',
      quickTryHackMeDesc: 'Задания в изолированных комнатах',
      quickPicoDesc: 'Образовательные CTF-задачи',
      quickCtfTimeDesc: 'Календарь образовательных CTF',
      quickSigmaDesc: 'Открытые правила обнаружения',
      quickOwaspDesc: 'Практики безопасной разработки',
      quickLabDesc: 'Безопасные практические лаборатории',
      customLinks: '書庫 · Library',
      linkName: 'имя',
      linkAddress: 'Адрес ссылки',
      addLink: '[ добавить ]',
      node: 'Узел',
      connection: 'Соединение',
      publicIp: 'Публичный ip',
      refreshIp: 'Обновить ip',
      catalogNote: 'каталог открывается в новой вкладке',
      online: '● онлайн',
      offline: '● не в сети',
      links: 'личные',
      statusHelp: '/ поиск · t тема · ? помощь',
      changeTheme: 'Сменить тему (t)',
      defaultEngine: 'Движок по умолчанию',
      helpDdg: 'обычный веб-поиск DuckDuckGo',
      helpGoogle: 'обычный веб-поиск Google',
      helpNvd: 'поиск записей в базе уязвимостей NVD',
      helpCve: 'поиск идентификаторов CVE',
      helpGithub: 'код, инструменты и конфиги',
      helpCtfTime: 'поиск учебных соревнований и задач',
      hotkeys: 'Горячие клавиши',
      focusSearch: 'фокус в строку поиска',
      switchTheme: 'переключить тему из themes.json',
      focusCustomLink: 'фокус в поле своей ссылки',
      switchPage: 'перейти на следующую страницу',
      openHelp: 'открыть эту справку',
      closeDialog: 'закрыть окно',
      customLinksHelp: 'Добавляйте ссылки в этот блок — они сохраняются в localStorage. Удаление — кнопкой × на плитке.',
      customLinksEmpty: '// пока пусто — добавьте ссылку ниже',
      delete: 'удалить',
      themeUnavailable: 'Темы недоступны: проверьте themes.json',
      toastTheme: 'тема',
      toastEngine: 'движок',
      moduleIntel: '資料 · Study',
      moduleIntelTag: 'ИСТОЧНИКИ / КОНТЕКСТ',
      sourceCisa: 'Официальный каталог уязвимостей, используемых в атаках',
      sourceNvd: 'Национальная база данных об уязвимостях',
      sourceCve: 'Записи об уязвимостях и их идентификаторы',
      sourceAttack: 'База знаний о поведении угроз и защитных мерах',
      moduleStatus: '接続 · Session',
      ipNotChecked: 'не запрашивался',
      uptime: 'Время работы',
      moduleDetection: '防御 · Defense',
      moduleDetectionTag: 'ПРАВИЛА / НАБЛЮДАЕМОСТЬ',
      sourceSigma: 'Правила обнаружения от сообщества',
      sourceYara: 'Документация по поиску шаблонов',
      sourceSuricata: 'Документация по обнаружению сетевых угроз',
      sourceZeek: 'Анализ сети и обработка событий',
      sourceOwasp: 'Практические рекомендации по безопасности приложений',
      moduleLabs: '道場 · Dojo',
      moduleLabsTag: 'CTF / ИЗОЛИРОВАННЫЕ ЛАБОРАТОРИИ',
      sourcePortswigger: 'Пошаговые веб-лаборатории',
      sourceJuiceShop: 'Учебное приложение с намеренными уязвимостями',
      sourcePico: 'CTF-задачи для начинающих',
      sourceTryHackMe: 'Практические задания в учебных комнатах',
      sourceCtfTime: 'Календарь публичных CTF-соревнований',
      sourceOverTheWire: 'Учебные игры по Linux и безопасности',
      moduleNotes: '手記 · Notes',
      notesPlaceholder: 'Заметка для текущей сессии…',
      notesLocal: 'Сохраняется только в этом браузере',
      customLinksTag: 'ЛИЧНЫЕ ССЫЛКИ',
      ipNote: 'Публичный IP запрашивается только по нажатию через api.ipify.org.',
      toastDeleted: 'удалено',
      requiredFields: 'нужны имя и адрес',
      duplicateName: 'такое имя уже есть',
      toastAdded: 'добавлено',
    },
    en: {
      settings: 'Settings',
      settingsKicker: 'LAB / CONTROLS',
      theme: 'Theme',
      engine: 'Engine',
      language: 'Interface language',
      russian: 'Russian',
      english: 'English',
      appearance: 'Appearance and search',
      layoutDensity: 'Density',
      densityComfortable: 'Comfortable',
      densityCompact: 'Compact',
      layoutColumns: 'Columns',
      columnsTwo: 'Two',
      columnsOne: 'One',
      moduleControls: 'Workspace modules',
      moduleControlsHelp: 'Choose visible learning modules and arrange their order.',
      showQuickLinks: '演習 · Practice',
      showThreatContext: '資料 · Study',
      showSessionStatus: '接続 · Session',
      showDetection: '防御 · Defense',
      showNotes: '手記 · Notes',
      showLabs: '道場 · Dojo',
      showPinnedResources: '書庫 · Library',
      moveUp: 'Move up',
      moveDown: 'Move down',
      resetWorkspace: 'Reset layout to default',
      workspaceReset: 'Workspace layout reset',
      uiPrefsInvalid: 'Interface settings are invalid; defaults were restored',
      help: 'Help',
      search: 'Search',
      searchPlaceholder: 'CTF, CVE, or learning topic…',
      searchHint: 'tab — engine · enter — search · / — focus · t — theme · ? — help',
      workspaceLabel: 'CTF / AUTHORIZED LEARNING',
      workspaceIntro: 'Practice only in CTFs, your own labs, or with explicit permission.',
      authorizedDisclaimer: 'Do not attack targets without permission. Practice only in CTF platforms, your own labs, or with explicit authorization.',
      authorizedStatus: 'authorized labs only',
      authorizedToast: 'Use only authorized CTFs, your own labs, or explicitly permitted tests.',
      userAgent: 'Browser',
      catalog: 'Catalog',
      categoryTraining: 'authorized learning / ctf',
      categoryDocs: 'documentation',
      categoryNews: 'news',
      quickAccess: '演習 · Practice',
      quickAccessTag: 'AUTHORIZED TRAINING',
      quickCisaDesc: 'Catalog of vulnerabilities exploited in the wild',
      quickNvdDesc: 'CVE search and vulnerability scoring',
      quickAttackDesc: 'Tactics, techniques, and mitigations',
      quickPortswiggerDesc: 'Guided web security labs',
      quickHtbDesc: 'Hands-on practice in training labs',
      quickTryHackMeDesc: 'Challenges in isolated rooms',
      quickPicoDesc: 'Educational CTF challenges',
      quickCtfTimeDesc: 'Calendar of educational CTF events',
      quickSigmaDesc: 'Open detection rules',
      quickOwaspDesc: 'Secure development practices',
      quickLabDesc: 'Safe hands-on security labs',
      customLinks: '書庫 · Library',
      linkName: 'name',
      linkAddress: 'Link address',
      addLink: '[ add ]',
      node: 'Node',
      connection: 'Connection',
      publicIp: 'Public IP',
      refreshIp: 'Refresh IP',
      catalogNote: 'catalog links open in a new tab',
      online: '● online',
      offline: '● offline',
      links: 'pinned',
      statusHelp: '/ search · t theme · ? help',
      changeTheme: 'Change theme (t)',
      defaultEngine: 'Default search engine',
      helpDdg: 'general web search with DuckDuckGo',
      helpGoogle: 'general web search with Google',
      helpNvd: 'search the National Vulnerability Database',
      helpCve: 'search CVE records',
      helpGithub: 'code, tools and configs',
      helpCtfTime: 'search educational competitions and challenges',
      hotkeys: 'Keyboard shortcuts',
      focusSearch: 'focus the search box',
      switchTheme: 'switch theme from themes.json',
      focusCustomLink: 'focus the custom-link field',
      switchPage: 'go to the next page',
      openHelp: 'open this help',
      closeDialog: 'close the dialog',
      customLinksHelp: 'Add links here; they are saved in localStorage. Remove one with × on its tile.',
      customLinksEmpty: '// empty — add a link below',
      delete: 'delete',
      themeUnavailable: 'Themes unavailable: check themes.json',
      toastTheme: 'theme',
      toastEngine: 'engine',
      moduleIntel: '資料 · Study',
      moduleIntelTag: 'REFERENCES / CONTEXT',
      sourceCisa: 'Official catalog of vulnerabilities exploited in the wild',
      sourceNvd: 'National Vulnerability Database',
      sourceCve: 'Vulnerability records and identifiers',
      sourceAttack: 'Knowledge base of adversary behavior and defenses',
      moduleStatus: '接続 · Session',
      ipNotChecked: 'not requested',
      uptime: 'Uptime',
      moduleDetection: '防御 · Defense',
      moduleDetectionTag: 'RULES / VISIBILITY',
      sourceSigma: 'Community-maintained detection rules',
      sourceYara: 'Pattern-matching documentation',
      sourceSuricata: 'Network threat detection documentation',
      sourceZeek: 'Network analysis and event framework',
      sourceOwasp: 'Practical application security guidance',
      moduleLabs: '道場 · Dojo',
      moduleLabsTag: 'CTF / ISOLATED LABS',
      sourcePortswigger: 'Guided web security labs',
      sourceJuiceShop: 'Intentionally vulnerable training application',
      sourcePico: 'Beginner-friendly CTF challenges',
      sourceTryHackMe: 'Guided practice in learning rooms',
      sourceCtfTime: 'Calendar of public CTF competitions',
      sourceOverTheWire: 'Linux and security learning games',
      moduleNotes: '手記 · Notes',
      notesPlaceholder: 'A note for this session…',
      notesLocal: 'Saved only in this browser',
      customLinksTag: 'PERSONAL LINKS',
      ipNote: 'Public IP lookup runs only on request via api.ipify.org.',
      toastDeleted: 'deleted',
      requiredFields: 'Name and address are required',
      duplicateName: 'That name is already in use',
      toastAdded: 'added',
    },
  };
  let language = readStore(LANGUAGE_KEY) === 'en' ? 'en' : 'ru';

  function t(key) {
    return TRANSLATIONS[language][key] || TRANSLATIONS.ru[key] || key;
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    document.title = 'RYU · kowasu';
    document.querySelectorAll('[data-i18n]').forEach(function (element) {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (element) {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (element) {
      element.title = t(element.dataset.i18nTitle);
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (element) {
      element.setAttribute('aria-label', t(element.dataset.i18nAriaLabel));
    });
    const languageSelect = $('#setting-language');
    if (languageSelect) languageSelect.value = language;
  }

  /* ============ theme ============ */

  const THEME_KEY = 'hpTheme';
  const KOWASU_DEFAULT_THEME = 'sumi';
  let themes = [];
  let defaultTheme = '';

  function currentTheme() {
    const stored = readStore(THEME_KEY);
    return themes.some(function (item) {
      return item.id === stored;
    })
      ? stored
      : defaultTheme;
  }

  let theme = currentTheme();

  function setTheme(next, announce) {
    const selected = themes.find(function (item) {
      return item.id === next;
    });
    if (!selected) {
      if (announce) toast(t('themeUnavailable'), true);
      return;
    }
    theme = selected.id;
    window.RyuThemeConfig.apply(selected);
    const themeSelect = $('#setting-theme');
    if (themeSelect) themeSelect.value = theme;
    const status = $('#st-theme');
    if (status) status.textContent = 'theme:' + selected.name;
    writeStore(THEME_KEY, theme);
    if (announce) toast(t('toastTheme') + ': ' + selected.name);
  }

  function cycleTheme() {
    if (!themes.length) {
      toast(t('themeUnavailable'), true);
      return;
    }
    const index = themes.findIndex(function (item) {
      return item.id === theme;
    });
    const next = themes[(index + 1) % themes.length];
    if (next) setTheme(next.id, true);
  }

  const themeButton = $('#st-theme');
  if (themeButton) themeButton.addEventListener('click', cycleTheme);
  window.RyuThemeConfig.load()
    .then(function (config) {
      themes = config.themes;
      defaultTheme = themes.some(function (item) {
        return item.id === KOWASU_DEFAULT_THEME;
      })
        ? KOWASU_DEFAULT_THEME
        : config.default;
      setTheme(currentTheme(), false);
      renderSettings();
    })
    .catch(function (error) {
      console.error('Unable to load themes.json:', error);
      toast(error.message, true);
    });

  /* ============ clock / date / uptime ============ */

  const clockEl = $('#clock');
  const dateEl = $('#date');
  const userAgentEl = $('#userAgentVal');
  const uptimeEl = $('#uptimeVal');
  const statusUptime = $('#st-up');
  const bootTime = Date.now();
  if (userAgentEl) {
    userAgentEl.textContent = navigator.userAgent;
    userAgentEl.title = navigator.userAgent;
  }

  function tick() {
    const now = new Date();
    if (clockEl) {
      clockEl.textContent = now.toLocaleTimeString(language === 'en' ? 'en-US' : 'ru-RU', {
        hour12: language === 'en',
      });
    }
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString(language === 'en' ? 'en-US' : 'ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    const seconds = Math.floor((Date.now() - bootTime) / 1000);
    const uptime = Math.floor(seconds / 60) + ':' + pad2(seconds % 60);
    if (uptimeEl) uptimeEl.textContent = uptime;
    if (statusUptime) statusUptime.textContent = 'up ' + uptime;
  }

  tick();
  window.setInterval(tick, 1000);

  /* ============ connection state ============ */

  const onlineEl = $('#onlineVal');

  function renderOnline() {
    if (!onlineEl) return;
    const online = navigator.onLine;
    onlineEl.textContent = online ? t('online') : t('offline');
    onlineEl.classList.toggle('is-on', online);
    onlineEl.classList.toggle('is-off', !online);
  }

  window.addEventListener('online', renderOnline);
  window.addEventListener('offline', renderOnline);
  renderOnline();

  /* ============ public ip ============ */

  const ipEl = $('#ipVal');
  const ipRefresh = $('#ipRefresh');

  function fetchIp() {
    if (!ipEl) return;
    ipEl.textContent = '…';
    fetch('https://api.ipify.org?format=json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('bad response');
        return response.json();
      })
      .then(function (data) {
        ipEl.textContent = typeof data.ip === 'string' ? data.ip : '—';
      })
      .catch(function () {
        ipEl.textContent = '—';
      });
  }

  if (ipRefresh) ipRefresh.addEventListener('click', fetchIp);

  /* ============ engines ============ */

  const ENGINES = [
    {
      id: 'ddg',
      name: 'DuckDuckGo',
      build: function (q) {
        return 'https://duckduckgo.com/?q=' + encodeURIComponent(q);
      },
    },
    {
      id: 'google',
      name: 'Google',
      build: function (q) {
        return 'https://www.google.com/search?q=' + encodeURIComponent(q);
      },
    },
    {
      id: 'nvd',
      name: 'NVD',
      build: function (q) {
        return 'https://nvd.nist.gov/vuln/search/results?query=' + encodeURIComponent(q);
      },
    },
    {
      id: 'cve',
      name: 'CVE.org',
      build: function (q) {
        return 'https://www.cve.org/CVERecord/SearchResults?query=' + encodeURIComponent(q);
      },
    },
    {
      id: 'github',
      name: 'GitHub',
      build: function (q) {
        return 'https://github.com/search?q=' + encodeURIComponent(q);
      },
    },
    {
      id: 'ctftime',
      name: 'CTFtime',
      build: function (q) {
        return 'https://www.google.com/search?q=' + encodeURIComponent('site:ctftime.org ' + q);
      },
    },
  ];

  const ENGINE_KEY = 'hpEngine';
  const chips = $$('#chips [data-engine]');
  const engineTag = $('#engine-tag');
  const nodeEngine = $('#node-engine');
  const statusEngine = $('#st-engine');
  const q = $('#q');
  const mirror = $('#mirror');
  const cursor = $('#cursor');

  function engineById(id) {
    return (
      ENGINES.find(function (item) {
        return item.id === id;
      }) || ENGINES[0]
    );
  }

  let engineId = readStore(ENGINE_KEY);
  if (
    !ENGINES.some(function (item) {
      return item.id === engineId;
    })
  ) {
    engineId = 'ddg';
  }

  function renderEngine() {
    const engine = engineById(engineId);
    chips.forEach(function (button) {
      button.classList.toggle('active', button.dataset.engine === engine.id);
    });
    if (engineTag) engineTag.textContent = engine.name.toLowerCase();
    if (nodeEngine) nodeEngine.textContent = engine.name;
    if (statusEngine) statusEngine.textContent = 'eng:' + engine.id;
    const engineSelect = $('#setting-engine');
    if (engineSelect) engineSelect.value = engine.id;
  }

  function setEngine(id, announce) {
    engineId = engineById(id).id;
    writeStore(ENGINE_KEY, engineId);
    renderEngine();
    if (announce) toast(t('toastEngine') + ': ' + engineById(engineId).name);
  }

  chips.forEach(function (button) {
    button.addEventListener('click', function () {
      setEngine(button.dataset.engine, true);
      if (q) q.focus();
    });
  });

  if (statusEngine) {
    statusEngine.addEventListener('click', function () {
      const index = ENGINES.findIndex(function (item) {
        return item.id === engineId;
      });
      setEngine(ENGINES[(index + 1) % ENGINES.length].id, true);
    });
  }

  renderEngine();

  /* ============ search input ============ */

  function renderMirror() {
    if (!q || !mirror || !cursor) return;
    mirror.textContent = q.value;
    cursor.classList.toggle('off', !q.value);
    const meas = document.createElement('span');
    meas.style.cssText =
      'position:absolute;visibility:hidden;white-space:pre;font:16px var(--mono)';
    meas.textContent = q.value.slice(0, 200);
    document.body.appendChild(meas);
    const scroll = Math.max(0, q.scrollLeft);
    mirror.style.left = -scroll + 'px';
    cursor.style.left = meas.offsetWidth - scroll + 'px';
    meas.remove();
  }

  function doSearch() {
    const query = q ? q.value.trim() : '';
    if (!query) {
      if (q) q.focus();
      return;
    }
    window.open(engineById(engineId).build(query), '_blank', 'noopener');
  }

  if (q) {
    q.addEventListener('input', renderMirror);
    q.addEventListener('scroll', renderMirror);
    q.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        doSearch();
      }
      if (event.key === 'Tab' && !event.shiftKey) {
        event.preventDefault();
        const index = ENGINES.findIndex(function (item) {
          return item.id === engineId;
        });
        setEngine(ENGINES[(index + 1) % ENGINES.length].id, true);
      }
    });
  }

  /* ============ custom links ============ */

  const CUSTOM_KEY = 'hpCustomLinks';
  const customRoot = $('#custom-links');
  const customForm = $('#custom-form');
  const customLabel = $('#custom-label');
  const customUrl = $('#custom-url');
  const statusLinks = $('#st-links');

  function loadCustom() {
    let raw;
    try {
      raw = JSON.parse(readStore(CUSTOM_KEY) || '[]');
    } catch (e) {
      raw = [];
    }
    if (!Array.isArray(raw)) return [];
    return raw
      .filter(function (item) {
        return (
          item &&
          typeof item === 'object' &&
          typeof item.label === 'string' &&
          item.label.trim() &&
          typeof item.url === 'string' &&
          item.url.trim()
        );
      })
      .map(function (item) {
        return { label: item.label.trim(), url: item.url.trim() };
      });
  }

  function saveCustom(items) {
    writeStore(CUSTOM_KEY, JSON.stringify(items));
  }

  function renderCustom() {
    if (!customRoot) return;
    const items = loadCustom();
    customRoot.textContent = '';
    if (!items.length) {
      const hint = document.createElement('span');
      hint.className = 'empty-hint';
      hint.textContent = t('customLinksEmpty');
      customRoot.appendChild(hint);
    } else {
      items.forEach(function (item) {
        const link = document.createElement('a');
        link.className = 'link';
        link.href = safeHref(item.url);
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const name = document.createElement('span');
        name.className = 'lk-name';
        name.textContent = item.label;

        const remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'lk-del';
        remove.title = t('delete');
        remove.textContent = '×';
        remove.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          const next = loadCustom().filter(function (entry) {
            return !(entry.label === item.label && entry.url === item.url);
          });
          saveCustom(next);
          renderCustom();
          toast(t('toastDeleted') + ': ' + item.label);
        });

        link.appendChild(name);
        link.appendChild(remove);
        customRoot.appendChild(link);
      });
    }
    if (statusLinks) statusLinks.textContent = t('links') + ':' + items.length;
  }

  if (customForm) {
    customForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const label = customLabel ? customLabel.value.trim() : '';
      const url = normalizeUrl(customUrl ? customUrl.value : '');
      if (!label || !url) {
        toast(t('requiredFields'), true);
        return;
      }
      const items = loadCustom();
      if (
        items.some(function (item) {
          return item.label.toLowerCase() === label.toLowerCase();
        })
      ) {
        toast(t('duplicateName'), true);
        return;
      }
      items.push({ label: label, url: url });
      saveCustom(items);
      renderCustom();
      if (customLabel) customLabel.value = '';
      if (customUrl) customUrl.value = '';
      toast(t('toastAdded') + ': ' + label);
    });
  }

  renderCustom();

  const fieldNotes = $('#field-notes');
  const notesCount = $('#notes-count');

  function renderNotes() {
    if (!fieldNotes) return;
    fieldNotes.value = readStore('hpFieldNotes') || '';
    if (notesCount) notesCount.textContent = fieldNotes.value.length + ' / 5000';
  }

  if (fieldNotes) {
    fieldNotes.addEventListener('input', function () {
      writeStore('hpFieldNotes', fieldNotes.value);
      if (notesCount) notesCount.textContent = fieldNotes.value.length + ' / 5000';
    });
  }

  /* ============ settings ============ */

  const settings = $('#settings');
  const themeSelect = $('#setting-theme');
  const engineSelect = $('#setting-engine');
  const languageSelect = $('#setting-language');
  const densitySelect = $('#setting-density');
  const columnsSelect = $('#setting-columns');
  const moduleControls = $('#module-controls');
  const settingsReset = $('#settings-reset');
  const UI_KEY = 'hpKowasuUI';
  const UI_MODULES = [
    { id: 'quick-links', label: 'showQuickLinks' },
    { id: 'intel-module', label: 'showThreatContext' },
    { id: 'node-panel', label: 'showSessionStatus' },
    { id: 'detection-module', label: 'showDetection' },
    { id: 'notes-module', label: 'showNotes' },
    { id: 'labs-module', label: 'showLabs' },
    { id: 'links-panel', label: 'showPinnedResources' },
  ];

  function defaultUiPreferences() {
    const visible = {};
    UI_MODULES.forEach(function (item) {
      visible[item.id] = true;
    });
    return {
      density: 'comfortable',
      columns: 'two',
      visible,
      order: UI_MODULES.map(function (item) {
        return item.id;
      }),
    };
  }

  function normalizeUiPreferences(value) {
    if (!value || typeof value !== 'object' || Array.isArray(value))
      throw new Error('Expected a settings object');

    const defaults = defaultUiPreferences();
    const visible = {};
    UI_MODULES.forEach(function (item) {
      visible[item.id] =
        value.visible && typeof value.visible[item.id] === 'boolean'
          ? value.visible[item.id]
          : true;
    });

    const order = [];
    if (Array.isArray(value.order)) {
      value.order.forEach(function (id) {
        if (
          UI_MODULES.some(function (item) {
            return item.id === id;
          }) &&
          !order.includes(id)
        ) {
          order.push(id);
        }
      });
    }
    defaults.order.forEach(function (id) {
      if (!order.includes(id)) order.push(id);
    });

    return {
      density: value.density === 'compact' ? 'compact' : 'comfortable',
      columns: value.columns === 'one' ? 'one' : 'two',
      visible,
      order,
    };
  }

  function loadUiPreferences() {
    const raw = readStore(UI_KEY);
    if (!raw) return defaultUiPreferences();
    try {
      return normalizeUiPreferences(JSON.parse(raw));
    } catch (error) {
      console.error('Unable to load Kowasu interface settings:', error);
      toast(t('uiPrefsInvalid'), true);
      return defaultUiPreferences();
    }
  }

  let uiPreferences = loadUiPreferences();

  function saveUiPreferences() {
    writeStore(UI_KEY, JSON.stringify(uiPreferences));
  }

  function renderWorkspaceControls() {
    $$('[data-module-toggle]').forEach(function (input) {
      input.checked = uiPreferences.visible[input.dataset.moduleToggle];
    });

    const lastIndex = uiPreferences.order.length - 1;
    $$('.module-control').forEach(function (row) {
      const index = uiPreferences.order.indexOf(row.dataset.moduleControl);
      row.querySelectorAll('[data-module-move]').forEach(function (button) {
        const direction = Number(button.dataset.moduleMove);
        button.disabled = direction < 0 ? index <= 0 : index >= lastIndex;
      });
    });
  }

  function applyUiPreferences() {
    document.body.dataset.density = uiPreferences.density;
    document.body.dataset.columns = uiPreferences.columns;

    const grid = $('.kowasu-grid');
    if (grid) {
      uiPreferences.order.forEach(function (id) {
        const module = document.getElementById(id);
        if (module) grid.appendChild(module);
      });
    }

    UI_MODULES.forEach(function (item) {
      const module = document.getElementById(item.id);
      if (module) module.hidden = !uiPreferences.visible[item.id];
    });
    renderWorkspaceControls();
  }

  function renderSettings() {
    if (themeSelect) {
      themeSelect.textContent = '';
      themes.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        themeSelect.appendChild(option);
      });
      if (!themes.length) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = t('themeUnavailable');
        themeSelect.appendChild(option);
      }
      themeSelect.value = theme;
      themeSelect.disabled = !themes.length;
    }

    if (engineSelect) {
      engineSelect.textContent = '';
      ENGINES.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        engineSelect.appendChild(option);
      });
      engineSelect.value = engineId;
    }

    if (densitySelect) densitySelect.value = uiPreferences.density;
    if (columnsSelect) columnsSelect.value = uiPreferences.columns;
    renderWorkspaceControls();
  }

  function setLanguage(next) {
    if (!['ru', 'en'].includes(next) || language === next) return;
    language = next;
    writeStore(LANGUAGE_KEY, language);
    applyLanguage();
    tick();
    renderOnline();
    renderCustom();
    renderSettings();
  }

  function openSettings() {
    if (!settings || settings.open) return;
    renderSettings();
    settings.showModal();
    if (settingsButton) settingsButton.setAttribute('aria-expanded', 'true');
    if (languageSelect) languageSelect.focus();
  }

  function closeSettings() {
    if (settings && settings.open) settings.close();
    if (settingsButton) {
      settingsButton.setAttribute('aria-expanded', 'false');
      settingsButton.focus();
    }
  }

  const settingsButton = $('#ha-settings');
  if (settingsButton) settingsButton.addEventListener('click', openSettings);
  if (themeSelect) {
    themeSelect.addEventListener('change', function () {
      setTheme(themeSelect.value, true);
    });
  }
  if (engineSelect) {
    engineSelect.addEventListener('change', function () {
      setEngine(engineSelect.value, true);
    });
  }
  if (languageSelect) {
    languageSelect.addEventListener('change', function () {
      setLanguage(languageSelect.value);
    });
  }
  if (densitySelect) {
    densitySelect.addEventListener('change', function () {
      uiPreferences.density = densitySelect.value === 'compact' ? 'compact' : 'comfortable';
      saveUiPreferences();
      applyUiPreferences();
    });
  }
  if (columnsSelect) {
    columnsSelect.addEventListener('change', function () {
      uiPreferences.columns = columnsSelect.value === 'one' ? 'one' : 'two';
      saveUiPreferences();
      applyUiPreferences();
    });
  }
  if (moduleControls) {
    moduleControls.addEventListener('change', function (event) {
      const input = event.target.closest('[data-module-toggle]');
      if (!input || !(input.dataset.moduleToggle in uiPreferences.visible)) return;
      uiPreferences.visible[input.dataset.moduleToggle] = input.checked;
      saveUiPreferences();
      applyUiPreferences();
    });
    moduleControls.addEventListener('click', function (event) {
      const button = event.target.closest('[data-module-move]');
      if (!button) return;
      const row = button.closest('[data-module-control]');
      const index = uiPreferences.order.indexOf(row.dataset.moduleControl);
      const target = index + Number(button.dataset.moduleMove);
      if (index < 0 || target < 0 || target >= uiPreferences.order.length) return;
      [uiPreferences.order[index], uiPreferences.order[target]] = [
        uiPreferences.order[target],
        uiPreferences.order[index],
      ];
      saveUiPreferences();
      applyUiPreferences();
    });
  }
  if (settingsReset) {
    settingsReset.addEventListener('click', function () {
      uiPreferences = defaultUiPreferences();
      saveUiPreferences();
      applyUiPreferences();
      renderSettings();
      toast(t('workspaceReset'));
    });
  }
  if (settings) {
    const closeButton = $('#setting-close', settings);
    if (closeButton) closeButton.addEventListener('click', closeSettings);
    settings.addEventListener('click', function (event) {
      if (event.target === settings) closeSettings();
    });
    settings.addEventListener('cancel', function (event) {
      event.preventDefault();
      closeSettings();
    });
  }

  /* ============ help overlay ============ */

  const help = $('#help');

  function openHelp() {
    if (!help) return;
    help.hidden = false;
    const close = $('.overlay-close', help);
    if (close) close.focus();
  }

  function closeHelp() {
    if (help) help.hidden = true;
    if (q) q.focus();
  }

  const helpButton = $('#ha-help');
  if (helpButton) helpButton.addEventListener('click', openHelp);
  if (help) {
    const closeButton = $('.overlay-close', help);
    if (closeButton) closeButton.addEventListener('click', closeHelp);
    help.addEventListener('mousedown', function (event) {
      if (event.target === help) closeHelp();
    });
  }

  /* ============ hotkeys ============ */

  document.addEventListener('keydown', function (event) {
    const target = event.target;
    const tag = target && target.tagName ? target.tagName : '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    const plain = !event.ctrlKey && !event.metaKey && !event.altKey;

    if (event.key === 'Escape') {
      if (help && !help.hidden) {
        event.preventDefault();
        closeHelp();
      } else if (settings && settings.open) {
        event.preventDefault();
        closeSettings();
      }
      return;
    }
    if (typing || !plain) return;

    if (event.key === '/') {
      event.preventDefault();
      if (q) q.focus();
    } else if (event.key === 't') {
      event.preventDefault();
      cycleTheme();
    } else if (event.key === 'e') {
      event.preventDefault();
      if (customLabel) customLabel.focus();
    } else if (event.key === '?') {
      event.preventDefault();
      openHelp();
    }
  });

  applyLanguage();
  applyUiPreferences();
  renderSettings();
  renderNotes();
  renderOnline();
  tick();
  if (q) q.focus();
  renderMirror();

  if (readStore('hpAck') !== '1') {
    toast(t('authorizedToast'));
    try {
      localStorage.setItem('hpAck', '1');
    } catch (error) {
      console.error('Unable to save the authorization reminder state:', error);
    }
  }
})();
