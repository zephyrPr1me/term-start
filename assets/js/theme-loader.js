/* Loads and applies the shared theme configuration used by both pages. */
(function () {
  'use strict';

  const COLOR_NAMES = [
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
  ];
  const THEMES_URL = new URL('../data/themes.json', import.meta.url);

  function normalizeTheme(theme) {
    if (!theme || typeof theme !== 'object') throw new Error('Некорректная запись темы');
    if (typeof theme.id !== 'string' || !/^[a-z0-9-]+$/.test(theme.id))
      throw new Error('В id темы допустимы только строчные латинские буквы, цифры и дефисы');

    const colors = {};
    for (const name of COLOR_NAMES) {
      const value = theme.colors && theme.colors[name];
      if (typeof value !== 'string' || !/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value))
        throw new Error(`У темы "${theme.id}" некорректный цвет "${name}"`);
      colors[name] = value;
    }

    return {
      id: theme.id,
      name: typeof theme.name === 'string' && theme.name.trim() ? theme.name.trim() : theme.id,
      colors,
    };
  }

  async function load() {
    let response;
    try {
      response = await fetch(THEMES_URL, { cache: 'no-cache' });
    } catch (error) {
      if (THEMES_URL.protocol === 'file:')
        throw new Error('Нельзя загрузить themes.json через file://. Запустите локальный HTTP-сервер.');
      throw new Error(`Сетевая ошибка при загрузке themes.json: ${error.message}`);
    }
    if (!response.ok) throw new Error(`Не удалось загрузить themes.json (HTTP ${response.status})`);

    const config = await response.json();
    if (!config || !Array.isArray(config.themes) || !config.themes.length)
      throw new Error('В themes.json должен быть непустой массив themes');

    const themes = config.themes.map(normalizeTheme);
    if (new Set(themes.map((theme) => theme.id)).size !== themes.length)
      throw new Error('В themes.json повторяются id тем');
    if (!themes.some((theme) => theme.id === config.default))
      throw new Error('Значение default в themes.json должно совпадать с id одной из тем');

    return { default: config.default, themes };
  }

  function apply(theme) {
    const root = document.documentElement;
    root.dataset.theme = theme.id;
    for (const [name, value] of Object.entries(theme.colors))
      root.style.setProperty(`--${name}`, value);
  }

  window.RyuThemeConfig = { load, apply };
})();
