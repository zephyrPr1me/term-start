/**
 * Obsidian URI scheme helpers. These only construct URIs and never make requests.
 * Documentation: https://help.obsidian.md/Extending+Obsidian/Obsidian+URI
 */

const KEY = 'ryu.obsidian.v1';

export function buildOpenUri(vault, file) {
  if (!vault) throw new Error('vault is required');
  const params = new URLSearchParams({ vault, file });
  return `obsidian://open?${params}`;
}

export function buildNewUri(vault, name, content = '') {
  if (!vault) throw new Error('vault is required');
  const params = new URLSearchParams({ vault, name, content });
  return `obsidian://new?${params}`;
}

export function buildSearchUri(vault, query) {
  if (!vault) throw new Error('vault is required');
  const params = new URLSearchParams({ vault, query });
  return `obsidian://search?${params}`;
}

export function launchObsidianUri(uri) {
  if (!uri) return false;
  const opened = window.open(uri, '_blank', 'noopener,noreferrer');
  return opened !== null;
}

export function loadObsidianConfig() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      return { vault: '', enabled: false };
    return {
      ...parsed,
      vault: typeof parsed.vault === 'string' ? parsed.vault : '',
      enabled: parsed.enabled === true,
    };
  } catch {
    return { vault: '', enabled: false };
  }
}

export function saveObsidianConfig(config) {
  const source = config && typeof config === 'object' && !Array.isArray(config) ? config : {};
  localStorage.setItem(
    KEY,
    JSON.stringify({
      ...source,
      vault: typeof source.vault === 'string' ? source.vault : '',
      enabled: source.enabled === true,
    }),
  );
}

export const OBSIDIAN_ACTIONS = {
  open: { label: 'Открыть', build: buildOpenUri },
  create: { label: 'Новая заметка', build: buildNewUri },
  search: { label: 'Поиск', build: buildSearchUri },
};
