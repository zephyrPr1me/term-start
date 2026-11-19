UI/UX audit — RYU / term-start
A. Visual bugs (things that look broken)
A1. yasumu.html ignores the theme system entirely — it renders in OS default colors.
yasumu.html:152 loads theme-loader.js, but nothing calls RyuThemeConfig.load()/apply() — only tateru.js:2896 and kowasu.js:396 do. So on Yasumu, :root keeps foundation.css:8-22 fallbacks (Canvas, CanvasText, GrayText, Highlight). Result: the "off-duty" page looks like a plain system page (white in light mode) while Tateru/Kowasu are phosphor-dark. Worst visual inconsistency in the project, and the loader file is dead weight there.
A2. Statusline text fails contrast in more than half the themes.
interface.css:12-14 uses background: var(--accent); color: var(--status-fg). Measured ratios: sunset 3.2, sakura 3.1, sand 2.7, ocean 4.4, lavender 4.4 — all below 4.5 for 12 px text. The statusline is always on screen, so this is the most visible a11y failure. Fix by darkening --accent or forcing --status-fg to the theme's --bg and picking per-theme values in themes.json.
A3. --fg-mute is unreadable everywhere. Ratios of 2.0–3.5 across all 18 themes (fg-mute/bg), used for placeholders (search.css:27), timestamps, .bm-host, .bm-empty, hint text. Placeholders are meant to be faint, but 2.4 on phosphor fails even the 3:1 non-text threshold. Also --border sits at 1.2–1.4 against backgrounds, so panel/input borders are effectively invisible in phosphor, amber, neon, shinobi, sakura-night.
A4. Hardcoded white/dark icon plates. links.css link icon backgrounds use literal #fff/#333 instead of theme vars, so favicons sit on white squares in neon, midnight, sumi and on dark squares in paper. Also ryu-hanko.svg uses a fixed #c1272d seal that clashes with sakura/lavender/ocean.
A5. Toasts paint over modal dialogs. interface.css:258 #toasts { z-index: 99 } vs .overlay { z-index: 50 }. Any toast triggered while settings/help/palette is open (e.g. "settings restored") floats on top of the dialog. Either drop toasts below overlays or render them inside the active dialog layer.
A6. Profile trigger collides with the statusline. profile-panel.css:29-33 is position: fixed; right: 20px; bottom: 20px; 48×48, and the statusline is position: sticky; bottom: 0 (interface.css:5-7). On Tateru/Kowasu it covers the right-hand status text; on Yasumu (yasumu.html:148) it covers публичные каналы · RSSHub. It also covers the last bookmark/link row on short viewports. Needs bottom offset ≥ statusline height, or reserve space in the statusline.
A7. Duplicate chrome. Tateru has both a masthead nav (tateru / kowasu buttons) and a statusline full of buttons; Yasumu repeats tateru / kowasu in the header and explains ctrl+enter страницы in the statusline; Kowasu has a settings button, statusline, help button, and palette all leading to the same dialogs.
B. Interaction problems
B1. Link edit/delete are hover-only and keyboard-unreachable. links.css:57,73 set visibility: hidden and reveal only on .link:hover. Consequences: keyboard users can never edit or delete a link; on touch devices the actions are permanently invisible; and visibility: hidden removes them from the tab order entirely. They are also nested inside the <a> (tateru.js:1745 area), so even when visible the click semantics are muddled. Fix: focus-within + always-visible on coarse pointers, and stop nesting buttons inside the anchor.
B2. The search field is a fake input. search.css:36-44 sets color: transparent; caret-color: transparent and paints text through #mirror. That breaks: native text selection (highlight is drawn over invisible text), IME/autocomplete composition, spellcheck, mobile keyboards, drag-select, and screen-reader value reading. The fake caret doesn't move on click, arrow keys, Home/End or selection — so clicking mid-string leaves the caret visually at the end. Genuine UX bug, not just cosmetic.
B3. Hotkeys fire while typing in other UIs. Already in the functional list but it is also the single most jarring UX issue: typing a, b, t, 1–9 inside the profile panel's shadow DOM notes/inputs triggers page actions. Same for hotkeys firing behind open overlays.
B4. Ctrl+Enter page switching is undiscoverable and conflicting. page-switch.js silently intercepts Ctrl+Enter on all three pages with no affordance anywhere except a statusline label. It also steals the browser's Ctrl+Enter (open in new tab / submit), and can't be disabled.
B5. Dialogs are declared modal but aren't. They have role="dialog" aria-modal="true" (index.html:436-508) with no focus trap, no initial-focus policy beyond "first input", and closeOverlay() always refocuses the search input (tateru.js:2554) regardless of where it was opened from. Tab escapes into the page behind, and screen readers are told content is inert when it isn't. No focus return to the invoking button.
B6. Suggestion list isn't a listbox. .sug items are <div>s with a click handler (tateru.js suggest rendering), no role="listbox"/"option", no aria-activedescendant, no aria-expanded on #q. Mouse-only for practical purposes; arrow keys work only through the input's custom handler.
B7. Bookmark delete uses × text buttons with tiny targets, and folder rename is an inline form that replaces the header (tateru.js:1798+) — no escape-to-cancel, and the confirm flow for delete is a separate pending state that isn't announced.
B8. VoiceOver/mobile: many tap targets are ~18–22 px. Statusline segments (interface.css:12, 2 px padding, 12 px text), engine chips (kowasu.css:198), bookmark tools (tateru.css .bookmark-tool), .bm-cat toggles, × on links. WCAG 2.2 AA wants 24 px minimum; 44 px is the practical touch target.
B9. No reduced-motion coverage for the main motion. prefers-reduced-motion exists only in profile-panel.css:276 and kowasu.css:854 and both target a short selector list. The always-running search caret blink (search.css:66), the screen-wide .overlay fade, panel hover lifts and the drawer slide are not covered.
C. Content, copy and i18n
C1. Three different localization states. Tateru is fully RU/EN with a toggle. Kowasu has RU/EN for the page but the settings dialog labels mix both, and its statusline/help are only partly translated (kowasu.js:66-320 has ~90 RU + ~90 EN entries, but several UI strings stay hardcoded English in kowasu.html). Yasumu and the profile panel are Russian-only with no toggle — and they sit behind the same top-level nav, so the app changes language when you switch pages. document.title is reset to a fixed string in applyLanguage() (kowasu.js:329), and index.html:2 hardcodes lang="ru" while the default UI can be English.
C2. Mixed RU/EN inside single components. kowasu.html ships panel-tag labels like LOCAL / PRIVATE, PERSONAL LINKS, 01 · CORE next to Russian body copy. tateru.js help mixes <kbd>tab</kbd> with Russian descriptions; t('folderRenamePrompt') used as an aria-label for an input, plus data-i18n-aria-label on other inputs — two habits for the same job.
C3. Stale/misleading help. tateru.js:2703+ still documents !kp / !oz style bangs and a ctrl+enter row that may not match current behavior; launchObsidianUri is documented as working but always returns false (functional list). Help is the only place some of these features are described, so wrong help is worse than none.
C4. The weather city is entered twice — in the weather panel (index.html:259) and in settings. Same value, two entry points, no indication they're the same field.
C5. Copy tone wobbles between terminal-plausible (up 0:00, eng:google) and explanatory (Public IP lookup runs only on request via api.ipify.org.). The latter is a privacy note in the middle of a status module; it reads like a legal footnote.
D. Information architecture
D1. Six ways to reach settings. Statusline theme/eng/links/bm buttons, ctrl+,, palette :settings, help overlay, masthead nav, profile panel. Nothing indicates which is canonical.
D2. Two "search" surfaces. The inline prompt and the advanced-search dialog both build queries, and a opens the latter from anywhere — including while already typing in the prompt.
D3. Yasumu is orphaned in the nav. Header links on Yasumu point back to tateru/kowasu, but tateru/kowasu never link forward to yasumu.html via UI — only the hidden ctrl+enter chain. A whole page is effectively secret. Also yasumu.html uses <div id="statusline"> instead of the <footer> used by the other two pages.
D4. Profile panel duplicates page functions. Notes exist both in Kowasu (#field-notes) and in the profile drawer; Obsidian export exists in both; the drawer also holds settings-ish fields (vault path) that don't belong in a "profile".
E. Strange / unnecessary
- E1. theme-loader.js is loaded on Yasumu but never used (see A1); it is also a <script type="module"> IIFE that defines a global, which is odd for a module.
- E2. props: ['on'], ... on: — the profile panel exposes a trigger SVG as role="button" tabindex="0" (profile-panel.js:34) rather than a real <button>; it needs manual Enter/Space handling (which it does, but it's reinventing the wheel and breaks form semantics).
- E3. --kowasu-secondary / --kowasu-muted (kowasu.css:8-9) mix foreground colors into new variables that are used once or twice; they make theme tuning harder than using existing tokens.
- E4. The seigaiha.svg background is a fixed white 3 % stroke (stroke="#fff") — invisible on light themes (paper, sand, arctic) and tinted wrong on sakura.
- E5. .profile-trigger is filter: drop-shadow(...) on a 48 px fixed element — repaints on scroll on low-end devices for zero functional gain.
- E6. Statusline title attributes duplicate data-i18n-title and remain Russian even in English mode unless JS replaces them — data-i18n-title is applied via JS (applyLanguage) but not all of them have that attribute, and title tooltips are invisible on touch.
- E7. layout-density / layout-columns settings (kowasu.js:77-82) exist for Kowasu only; Tateru has no equivalent, and the labels ("Две/Одна", "Комфортная/Компактная") are among the few fully translated ones. Feature asymmetry reads as unfinished.
- E8. Empty #bm-empty and #st-links: 0 states are plain text; there's no first-run hint that bookmarks are importable.
F. Responsive
- F1. At max-width: 640px, only .st-right is hidden (interface.css:316) — the whole left button cluster stays, and on a 360 px phone the statusline overflows horizontally.
- F2. .links drops to minmax(130px, 1fr) at 640 px (interface.css:311) while the hover-only actions still require hover — so on the exact breakpoint where hover is least likely, edit/delete are unreachable.
- F3. Kowasu's module grid (kowasu.css:772) collapses at 840 px, but .module-control rows and .custom-form don't reflow; the settings dialog gets horizontal scroll on narrow phones.
- F4. The profile drawer is width: min(440px, calc(100vw - 32px)) but bottom: 82px and max-height: calc(100vh - 112px) are tuned for desktop; on a 667 px-tall phone with the keyboard open it overlays the trigger and traps the close button.
Priority plan
Phase 1 — visible breakage (1 evening)
1. Apply the theme on Yasumu (call RyuThemeConfig.load/apply in a shared boot script, or drop theme-loader.js and inline the theme vars).
2. Fix statusline contrast: derive --status-fg per theme or bump --accent luminance in themes.json; re-check the 5 failing themes.
3. Raise #toasts below .overlay (or render toasts inside the dialog layer).
4. Offset the profile trigger above the statusline; add the same offset to the drawer.
5. Replace hardcoded #fff/#333 icon plates and the hanko red with theme tokens.
6. Make link edit/delete reachable: :focus-within, @media (hover: none) always-visible, move buttons out of <a>.
Phase 2 — real interaction fixes (2–3 days)
7. Replace the transparent input + mirror with a real input that has a visible caret, and keep only the styling (fake caret removed). This collapses B2, the caret-drift bug and the IME issue in one change.
8. Suppress hotkeys when focus is in an input/textarea/contenteditable or inside the profile shadow root, and when an overlay is open.
9. Add a real focus trap + return-focus to overlays; keep aria-modal honest.
10. Add role="listbox"/option + aria-activedescendant + aria-expanded to suggestions.
11. Add prefers-reduced-motion coverage for caret blink, overlays and drawer transitions.
12. Bump tap targets to ≥ 32 px on coarse pointers (statusline, chips, bookmark controls).
Phase 3 — coherence (1–2 days)
13. Pick one localization model: either translate Yasumu + profile panel, or make the language toggle global and show a "not translated" state instead of silently switching language.
14. Deduplicate navigation: one canonical settings entry; link yasumu.html from the other pages; move the ctrl+enter hint to a help row instead of the statusline.
15. Move the weather city to a single location; remove the duplicate field.
16. Delete theme-loader.js from Yasumu (after Phase 1), the kp/oz help rows, and the unused --kowasu-* tokens.
17. Fix seigaiha.svg to use currentColor, and drop the trigger's drop-shadow.