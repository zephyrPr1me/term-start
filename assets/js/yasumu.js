const clock = document.querySelector('#clock');
const date = document.querySelector('#date');
const telegramForm = document.querySelector('#telegram-form');
const telegramInput = document.querySelector('#telegram-username');
const telegramLabel = document.querySelector('#telegram-channel-label');
const telegramOpen = document.querySelector('#telegram-open');
const telegramStatus = document.querySelector('#telegram-status');
const telegramPosts = document.querySelector('#telegram-posts');
const telegramRefresh = document.querySelector('#telegram-refresh');
const quickLinks = new Map(
  Array.from(document.querySelectorAll('[data-hotkey]'), (link) => [link.dataset.hotkey, link]),
);

const CHANNEL_STORAGE_KEY = 'ryu.leisure.telegramChannel';
const DEFAULT_CHANNEL = 'pythonl';
const MAX_POSTS = 10;

let activeRequest = null;

function updateClock() {
  const now = new Date();
  clock.textContent = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(now);
  date.textContent = new Intl.DateTimeFormat('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now);
}

function normalizeChannel(value) {
  let candidate = value.trim();
  if (candidate.startsWith('@')) candidate = candidate.slice(1);
  if (/^(?:www\.)?t\.me\//i.test(candidate)) candidate = `https://${candidate}`;

  if (/^https?:\/\//i.test(candidate)) {
    try {
      const url = new URL(candidate);
      if (!['t.me', 'www.t.me'].includes(url.hostname.toLowerCase())) return null;
      candidate = url.pathname.split('/').filter(Boolean)[0] || '';
    } catch {
      return null;
    }
  }

  return /^[A-Za-z][A-Za-z0-9_]{4,31}$/.test(candidate) ? candidate : null;
}

function readSavedChannel() {
  try {
    return normalizeChannel(localStorage.getItem(CHANNEL_STORAGE_KEY) || '') || DEFAULT_CHANNEL;
  } catch (error) {
    console.error('Unable to read Telegram channel setting:', error);
    return DEFAULT_CHANNEL;
  }
}

function updateChannelLinks(channel) {
  telegramInput.value = channel;
  telegramLabel.textContent = channel;
  telegramOpen.href = `https://t.me/${channel}`;
}

function setTelegramStatus(message, isError = false) {
  telegramStatus.textContent = message;
  telegramStatus.classList.toggle('is-error', isError);
}

function textFromFeedNode(node) {
  if (!node) return '';
  const html = (node.textContent || '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/(?:p|div|li|blockquote|pre|h[1-6])\s*>/gi, ' ');
  return new DOMParser()
    .parseFromString(html, 'text/html')
    .body.textContent.replace(/\s+/g, ' ')
    .trim();
}

function parseFeed(xml) {
  const document = new DOMParser().parseFromString(xml, 'application/xml');
  if (document.querySelector('parsererror')) {
    throw new Error('Прокси вернул некорректную ленту.');
  }

  const items = Array.from(document.querySelectorAll('item, entry')).slice(0, MAX_POSTS);
  return items
    .map((item) => {
      const title = textFromFeedNode(item.querySelector('title'));
      const description = Array.from(item.children).find((node) =>
        ['description', 'summary', 'content', 'encoded'].includes(node.localName.toLowerCase()),
      );
      const summary = textFromFeedNode(description).slice(0, 500);
      const linkNode = item.querySelector('link');
      const rawLink = linkNode?.getAttribute('href') || linkNode?.textContent.trim();
      const dateText =
        item.querySelector('pubDate, published, updated')?.textContent.trim() || '';
      let link = null;

      if (rawLink) {
        try {
          const url = new URL(rawLink, 'https://t.me');
          if (url.protocol === 'https:' && ['t.me', 'www.t.me'].includes(url.hostname)) {
            link = url.href;
          }
        } catch {
          link = null;
        }
      }

      return { title, summary, link, date: new Date(dateText) };
    })
    .filter((post) => post.link && (post.title || post.summary));
}

function renderPosts(posts) {
  telegramPosts.replaceChildren();

  for (const post of posts) {
    const article = document.createElement('article');
    article.className = 'telegram-post';

    if (!Number.isNaN(post.date.getTime())) {
      const meta = document.createElement('div');
      meta.className = 'telegram-post-meta';
      meta.textContent = new Intl.DateTimeFormat('ru-RU', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(post.date);
      article.append(meta);
    }

    const title = document.createElement('a');
    title.className = 'telegram-post-title';
    title.href = post.link;
    title.target = '_blank';
    title.rel = 'noopener noreferrer';
    title.textContent = post.title || 'Открыть публикацию';
    article.append(title);

    if (post.summary) {
      const summary = document.createElement('p');
      summary.className = 'telegram-post-summary';
      summary.textContent = post.summary;
      article.append(summary);
    }

    telegramPosts.append(article);
  }
}

async function loadTelegramFeed(channel) {
  if (activeRequest) activeRequest.abort();
  const controller = new AbortController();
  activeRequest = controller;
  telegramRefresh.disabled = true;
  setTelegramStatus(`Загружаю @${channel}…`);

  try {
    const response = await fetch(
      `/api/telegram-feed?username=${encodeURIComponent(channel)}`,
      { signal: controller.signal, cache: 'no-store' },
    );
    const payload = await response.text();
    if (!response.ok) {
      let message = `Сервер прокси ответил HTTP ${response.status}.`;
      try {
        message = JSON.parse(payload).error || message;
      } catch {
        // Keep the HTTP status when the proxy did not return JSON.
      }
      throw new Error(message);
    }

    const posts = parseFeed(payload);
    renderPosts(posts);
    setTelegramStatus(posts.length ? `Публикаций: ${posts.length}` : 'Публикаций пока нет.');
  } catch (error) {
    if (controller.signal.aborted) return;
    telegramPosts.replaceChildren();
    setTelegramStatus(error.message || 'Не удалось загрузить ленту.', true);
  } finally {
    if (activeRequest === controller) {
      telegramRefresh.disabled = false;
      activeRequest = null;
    }
  }
}

telegramForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const channel = normalizeChannel(telegramInput.value);
  if (!channel) {
    setTelegramStatus('Введи публичный @username или ссылку t.me/username.', true);
    return;
  }

  try {
    localStorage.setItem(CHANNEL_STORAGE_KEY, channel);
  } catch (error) {
    console.error('Unable to save Telegram channel setting:', error);
    setTelegramStatus('Не удалось сохранить настройку в этом браузере.', true);
    return;
  }

  updateChannelLinks(channel);
  loadTelegramFeed(channel);
});

telegramRefresh.addEventListener('click', () => {
  const channel = normalizeChannel(telegramInput.value);
  if (channel) loadTelegramFeed(channel);
});

document.addEventListener('keydown', (event) => {
  const tag = event.target && event.target.tagName;
  if (event.ctrlKey || event.metaKey || event.altKey || ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag))
    return;

  const link = quickLinks.get(event.key);
  if (!link) return;
  event.preventDefault();
  link.click();
});

updateClock();
window.setInterval(updateClock, 1000);
const savedChannel = readSavedChannel();
updateChannelLinks(savedChannel);
loadTelegramFeed(savedChannel);
