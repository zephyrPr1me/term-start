const KEY = 'ryu.profile.v1';
const TABS = ['obsidian', 'notes', 'settings', 'status'];
const FONTS = ['inherit', 'system', 'monospace'];
const BEHAVIORS = ['stay-open', 'close-after-action'];

function defaults() {
  return {
    vault: '',
    obsidianEnabled: false,
    activeTab: 'obsidian',
    lastNote: '',
    notes: [],
    open: false,
    theme: 'inherit',
    font: 'inherit',
    behavior: 'stay-open',
  };
}

function normalizeProfile(value) {
  const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return {
    ...defaults(),
    vault: typeof source.vault === 'string' ? source.vault : '',
    obsidianEnabled: source.obsidianEnabled === true,
    activeTab: TABS.includes(source.activeTab) ? source.activeTab : 'obsidian',
    lastNote: typeof source.lastNote === 'string' ? source.lastNote : '',
    notes: Array.isArray(source.notes)
      ? source.notes
          .filter(
            (note) =>
              note &&
              typeof note === 'object' &&
              typeof note.id === 'string' &&
              typeof note.text === 'string',
          )
          .map((note) => ({
            id: note.id,
            text: note.text,
            createdAt: typeof note.createdAt === 'string' ? note.createdAt : '',
          }))
      : [],
    open: source.open === true,
    theme:
      source.theme === 'inherit' ||
      (typeof source.theme === 'string' && /^[a-z0-9-]+$/.test(source.theme))
        ? source.theme
        : 'inherit',
    font: FONTS.includes(source.font) ? source.font : 'inherit',
    behavior: BEHAVIORS.includes(source.behavior) ? source.behavior : 'stay-open',
  };
}

export const ProfileStore = {
  load() {
    try {
      const raw = localStorage.getItem(KEY);
      return normalizeProfile(raw ? JSON.parse(raw) : null);
    } catch (error) {
      console.error('Unable to load profile settings:', error);
      return defaults();
    }
  },
  save(state) {
    const next = normalizeProfile(state);
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  },
  patch(patch) {
    return ProfileStore.save({ ...ProfileStore.load(), ...patch });
  },
};
