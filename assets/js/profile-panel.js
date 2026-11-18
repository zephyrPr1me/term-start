import themeConfig from '../data/themes.json';
import profilePanelCssUrl from '../css/profile-panel.css?url';
import {
  buildNewUri,
  buildOpenUri,
  buildSearchUri,
  launchObsidianUri,
  loadObsidianConfig,
  saveObsidianConfig,
} from './obsidian-bridge.js';
import { ProfileStore } from './profile-store.js';

const host = document.getElementById('ryu-profile-host');

if (!host) {
  console.warn('[profile] host element not found');
} else {
  mountPanel(host);
}

function mountPanel(panelHost) {
  if (panelHost.shadowRoot) return;

  const shadow = panelHost.attachShadow({ mode: 'open' });
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = profilePanelCssUrl;

  const root = document.createElement('div');
  root.className = 'profile-root';
  root.innerHTML = `
    <div class="profile-surface">
      <div class="profile-backdrop" id="profile-backdrop" hidden></div>
      <svg class="profile-trigger" viewBox="0 0 32 32" role="button" tabindex="0"
           aria-label="Профиль" aria-expanded="false" aria-controls="profile-drawer">
        <rect width="32" height="32" rx="2" fill="#c1272d"></rect>
        <text x="16" y="23" text-anchor="middle" font-family="Noto Serif JP, serif"
              font-size="20" fill="#fff">龍</text>
      </svg>
      <aside class="profile-drawer" id="profile-drawer" role="dialog" aria-modal="true"
             aria-labelledby="profile-title" tabindex="-1" hidden>
        <header class="profile-header">
          <strong id="profile-title">RYU / Profile</strong>
          <button type="button" id="profile-close" aria-label="Закрыть панель">×</button>
        </header>
        <nav class="profile-tabs" role="tablist" aria-label="Профиль">
          <button class="profile-tab" type="button" role="tab" data-tab="obsidian">Obsidian</button>
          <button class="profile-tab" type="button" role="tab" data-tab="notes">Заметки</button>
          <button class="profile-tab" type="button" role="tab" data-tab="settings">Настройки</button>
          <button class="profile-tab" type="button" role="tab" data-tab="status">Статус</button>
        </nav>
        <section class="profile-content" role="tabpanel" data-panel="obsidian">
          <label class="profile-field" for="profile-vault">
            Хранилище Obsidian
            <input id="profile-vault" type="text" autocomplete="off" placeholder="Имя vault">
          </label>
          <button class="profile-button" id="profile-save-vault" type="button">Сохранить vault</button>
          <p class="profile-hint">Используется только URI-схема obsidian://. Local REST API не используется.</p>
          <label class="profile-field" for="profile-new-name">
            Название новой заметки
            <input id="profile-new-name" type="text" autocomplete="off" placeholder="Untitled">
          </label>
          <div class="profile-row">
            <button class="profile-button" id="profile-open-vault" type="button">Открыть</button>
            <button class="profile-button" id="profile-create-note" type="button">Новая заметка</button>
          </div>
          <label class="profile-field" for="profile-search-query">
            Поиск в Obsidian
            <input id="profile-search-query" type="search" autocomplete="off" placeholder="Запрос">
          </label>
          <button class="profile-button" id="profile-search" type="button">Поиск</button>
          <p class="profile-message" id="profile-obsidian-message" role="status" aria-live="polite"></p>
        </section>
        <section class="profile-content" role="tabpanel" data-panel="notes" hidden>
          <label class="profile-field" for="profile-last-note">
            Быстрая заметка
            <textarea id="profile-last-note" placeholder="Только для этого браузера"></textarea>
          </label>
          <button class="profile-button" id="profile-add-note" type="button">Добавить заметку</button>
          <p class="profile-message" id="profile-notes-message" role="status" aria-live="polite"></p>
          <div class="profile-notes" id="profile-notes"></div>
        </section>
        <section class="profile-content" role="tabpanel" data-panel="settings" hidden>
          <label class="profile-field" for="profile-theme">
            Тема профиля
            <select id="profile-theme">
              <option value="inherit">Как на текущей странице</option>
            </select>
          </label>
          <label class="profile-field" for="profile-font">
            Шрифт панели
            <select id="profile-font">
              <option value="inherit">Как на странице</option>
              <option value="system">Системный</option>
              <option value="monospace">Моноширинный</option>
            </select>
          </label>
          <label class="profile-field" for="profile-behavior">
            Поведение после действия
            <select id="profile-behavior">
              <option value="stay-open">Оставлять панель открытой</option>
              <option value="close-after-action">Закрывать панель</option>
            </select>
          </label>
          <p class="profile-hint">Настройки профиля хранятся отдельно от настроек страниц.</p>
        </section>
        <section class="profile-content" role="tabpanel" data-panel="status" hidden>
          <dl class="profile-status">
            <dt>Страница</dt><dd id="profile-page"></dd>
            <dt>Локальное время</dt><dd id="profile-time"></dd>
            <dt>Vault</dt><dd id="profile-status-vault"></dd>
          </dl>
        </section>
      </aside>
    </div>
  `;
  shadow.append(stylesheet, root);

  const surface = shadow.querySelector('.profile-surface');
  const trigger = shadow.querySelector('.profile-trigger');
  const drawer = shadow.querySelector('#profile-drawer');
  const backdrop = shadow.querySelector('#profile-backdrop');
  const vaultInput = shadow.querySelector('#profile-vault');
  const newNameInput = shadow.querySelector('#profile-new-name');
  const searchInput = shadow.querySelector('#profile-search-query');
  const noteDraft = shadow.querySelector('#profile-last-note');
  const notesList = shadow.querySelector('#profile-notes');
  const obsidianMessage = shadow.querySelector('#profile-obsidian-message');
  const notesMessage = shadow.querySelector('#profile-notes-message');
  const themeSelect = shadow.querySelector('#profile-theme');
  const fontSelect = shadow.querySelector('#profile-font');
  const behaviorSelect = shadow.querySelector('#profile-behavior');

  for (const theme of themeConfig.themes || []) {
    const option = document.createElement('option');
    option.value = theme.id;
    option.textContent = theme.name || theme.id;
    themeSelect.append(option);
  }

  function getProfile() {
    return ProfileStore.load();
  }

  function announce(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle('error', isError);
  }

  function syncVaultStores(vault, enabled) {
    const profile = ProfileStore.patch({
      vault,
      obsidianEnabled: enabled,
    });
    const currentConfig = loadObsidianConfig();
    saveObsidianConfig({ ...currentConfig, vault, enabled });
    shadow.querySelector('#profile-status-vault').textContent = vault || 'не задан';
    return profile;
  }

  function migrateVault() {
    const profile = getProfile();
    const obsidian = loadObsidianConfig();
    if (!profile.vault && obsidian.vault) {
      ProfileStore.patch({
        vault: obsidian.vault,
        obsidianEnabled: obsidian.enabled,
      });
    } else if (
      profile.vault &&
      (profile.vault !== obsidian.vault || profile.obsidianEnabled !== obsidian.enabled)
    ) {
      saveObsidianConfig({
        ...obsidian,
        vault: profile.vault,
        enabled: profile.obsidianEnabled,
      });
    }
  }

  function saveVault() {
    const vault = vaultInput.value.trim();
    const profile = syncVaultStores(vault, Boolean(vault));
    announce(
      obsidianMessage,
      vault ? 'Vault сохранён в профиле.' : 'Vault очищен.',
    );
    renderStatus(profile);
    return vault;
  }

  function getVaultForAction() {
    const vault = saveVault();
    if (!vault) {
      announce(obsidianMessage, 'Укажите хранилище Obsidian в панели профиля.', true);
      return '';
    }
    return vault;
  }

  function runObsidianAction(buildUri) {
    const vault = getVaultForAction();
    if (!vault) return;
    launchObsidianUri(buildUri(vault));
    announce(obsidianMessage, 'URI передан браузеру. Если Obsidian установлен, он откроется.');
    maybeCloseAfterAction();
  }

  function applyAppearance(profile) {
    const theme = (themeConfig.themes || []).find((item) => item.id === profile.theme);
    for (const name of [
      'bg',
      'bg-panel',
      'bg-inset',
      'fg',
      'fg-dim',
      'fg-mute',
      'accent',
      'accent2',
      'danger',
      'border',
      'sel',
      'status-fg',
      'overlay',
    ]) {
      if (theme?.colors?.[name]) surface.style.setProperty(`--${name}`, theme.colors[name]);
      else surface.style.removeProperty(`--${name}`);
    }

    const fonts = {
      inherit: 'var(--mono, var(--font-mono, ui-monospace, monospace))',
      system: 'system-ui, sans-serif',
      monospace: 'ui-monospace, SFMono-Regular, Consolas, monospace',
    };
    surface.style.setProperty('--profile-font', fonts[profile.font] || fonts.inherit);
    themeSelect.value = theme ? profile.theme : 'inherit';
    fontSelect.value = profile.font;
    behaviorSelect.value = profile.behavior;
  }

  function setActiveTab(tab) {
    const activeTab = ['obsidian', 'notes', 'settings', 'status'].includes(tab)
      ? tab
      : 'obsidian';
    for (const button of shadow.querySelectorAll('[data-tab]')) {
      const selected = button.dataset.tab === activeTab;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    }
    for (const panel of shadow.querySelectorAll('[data-panel]'))
      panel.hidden = panel.dataset.panel !== activeTab;
    ProfileStore.patch({ activeTab });
  }

  function renderStatus(profile = getProfile()) {
    const page = location.pathname.split('/').pop() || 'index.html';
    const labels = {
      'index.html': 'Tateru',
      'kowasu.html': 'Kowasu',
      'yasumu.html': 'Yasumu',
    };
    shadow.querySelector('#profile-page').textContent = labels[page] || 'Tateru';
    shadow.querySelector('#profile-time').textContent = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date());
    shadow.querySelector('#profile-status-vault').textContent = profile.vault || 'не задан';
  }

  function renderNotes() {
    const profile = getProfile();
    notesList.replaceChildren();
    if (!profile.notes.length) {
      const empty = document.createElement('p');
      empty.className = 'profile-empty';
      empty.textContent = 'Пока нет заметок.';
      notesList.append(empty);
      return;
    }

    for (const note of profile.notes) {
      const card = document.createElement('article');
      card.className = 'profile-note';
      const date = document.createElement('div');
      date.className = 'profile-note-date';
      date.textContent = note.createdAt
        ? new Date(note.createdAt).toLocaleString()
        : 'Без даты';
      const text = document.createElement('div');
      text.className = 'profile-note-text';
      text.textContent = note.text;
      const actions = document.createElement('div');
      actions.className = 'profile-note-actions';
      const exportButton = document.createElement('button');
      exportButton.type = 'button';
      exportButton.textContent = 'Экспорт в Obsidian';
      exportButton.addEventListener('click', () => {
        const vault = loadObsidianConfig().vault || getProfile().vault;
        if (!vault) {
          announce(notesMessage, 'Укажите хранилище Obsidian в панели профиля.', true);
          return;
        }
        const title = `Profile ${note.createdAt.slice(0, 10) || 'note'}`;
        launchObsidianUri(buildNewUri(vault, title, note.text));
        announce(notesMessage, 'URI передан браузеру. Если Obsidian установлен, он откроется.');
        maybeCloseAfterAction();
      });
      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = 'Удалить';
      deleteButton.addEventListener('click', () => {
        ProfileStore.patch({
          notes: getProfile().notes.filter((item) => item.id !== note.id),
        });
        renderNotes();
      });
      actions.append(exportButton, deleteButton);
      card.append(date, text, actions);
      notesList.append(card);
    }
  }

  function maybeCloseAfterAction() {
    if (getProfile().behavior === 'close-after-action') setOpen(false);
  }

  function focusables() {
    return [...drawer.querySelectorAll(
      'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )].filter(
      (element) => !element.closest('[hidden]') && element.getClientRects().length > 0,
    );
  }

  function setOpen(open, restoreFocus = true) {
    ProfileStore.patch({ open });
    drawer.hidden = !open;
    backdrop.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (open) {
      setActiveTab(getProfile().activeTab);
      requestAnimationFrame(() => focusables()[0]?.focus());
    } else if (restoreFocus) {
      trigger.focus();
    }
  }

  function handleGlobalKeydown(event) {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'p') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(!getProfile().open);
      return;
    }

    if (event.key !== 'Escape' && event.key !== 'Tab') return;
    if (!getProfile().open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;

    const elements = focusables();
    if (!elements.length) {
      event.preventDefault();
      drawer.focus();
      return;
    }
    const first = elements[0];
    const last = elements[elements.length - 1];
    const active = shadow.activeElement;
    if (event.shiftKey && (active === first || !elements.includes(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !elements.includes(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  for (const button of shadow.querySelectorAll('[data-tab]')) {
    button.addEventListener('click', () => {
      setActiveTab(button.dataset.tab);
    });
  }

  shadow.querySelector('#profile-close').addEventListener('click', () => setOpen(false));
  trigger.addEventListener('click', () => setOpen(!getProfile().open));
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(!getProfile().open);
    }
  });
  backdrop.addEventListener('click', () => setOpen(false));

  shadow.querySelector('#profile-save-vault').addEventListener('click', saveVault);
  shadow.querySelector('#profile-open-vault').addEventListener('click', () =>
    runObsidianAction((vault) => buildOpenUri(vault, '')),
  );
  shadow.querySelector('#profile-create-note').addEventListener('click', () =>
    runObsidianAction((vault) => {
      const name = newNameInput.value.trim() || `Untitled ${new Date().toISOString().slice(0, 10)}`;
      return buildNewUri(vault, name, '');
    }),
  );
  shadow.querySelector('#profile-search').addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (!query) {
      announce(obsidianMessage, 'Введите поисковый запрос.', true);
      return;
    }
    runObsidianAction((vault) => buildSearchUri(vault, query));
  });

  noteDraft.addEventListener('input', () => ProfileStore.patch({ lastNote: noteDraft.value }));
  shadow.querySelector('#profile-add-note').addEventListener('click', () => {
    const text = noteDraft.value.trim();
    if (!text) {
      announce(notesMessage, 'Введите текст заметки.', true);
      return;
    }
    const profile = getProfile();
    const note = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text,
      createdAt: new Date().toISOString(),
    };
    ProfileStore.patch({ notes: [note, ...profile.notes], lastNote: '' });
    noteDraft.value = '';
    announce(notesMessage, '');
    renderNotes();
    maybeCloseAfterAction();
  });

  themeSelect.addEventListener('change', () => {
    const profile = ProfileStore.patch({ theme: themeSelect.value });
    applyAppearance(profile);
  });
  fontSelect.addEventListener('change', () => {
    const profile = ProfileStore.patch({ font: fontSelect.value });
    applyAppearance(profile);
  });
  behaviorSelect.addEventListener('change', () =>
    ProfileStore.patch({ behavior: behaviorSelect.value }),
  );

  migrateVault();
  const profile = getProfile();
  vaultInput.value = profile.vault;
  noteDraft.value = profile.lastNote;
  applyAppearance(profile);
  setActiveTab(profile.activeTab);
  renderNotes();
  renderStatus(profile);
  drawer.hidden = !profile.open;
  backdrop.hidden = !profile.open;
  trigger.setAttribute('aria-expanded', String(profile.open));
  if (profile.open) requestAnimationFrame(() => focusables()[0]?.focus());
  document.addEventListener('keydown', handleGlobalKeydown, true);
  window.setInterval(() => renderStatus(), 1000);
}
