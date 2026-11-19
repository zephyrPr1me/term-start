Confirmed bugs
High
1. Typing in the profile panel triggers page-wide shortcuts
- assets/js/profile-panel.js:24 (Shadow DOM), :77 (note textarea), :349-357, :464
- assets/js/tateru.js:2793-2796 uses document.activeElement.tagName
- assets/js/kowasu.js:1078-1081 and assets/js/yasumu.js:218-220 use the retargeted event.target
Outside the shadow root, focus/event target is the host <div id="ryu-profile-host">, so the typing check is false. keydown is composed and bubbles out, so while typing a note:
- Tateru: t changes theme, e opens link form, i opens the file picker, b scrolls, ? opens help, 1-9 navigate to quick links
- Kowasu: t changes theme, e focuses a hidden input, ? opens help
- Yasumu: 1-4 navigate away from the page
This can lose the user’s place/context and is the most disruptive bug.
Fix: add one helper in each page that checks event.composedPath() for INPUT, TEXTAREA, SELECT, or [contenteditable]; use it in all three handlers. Also stop keydown propagation from inside the drawer while it is open (after handling Escape/Tab in the capture handler).
2. Bookmark suggestions can execute a javascript: URL
- assets/js/tateru.js:915-926 (line 922 passes it.url straight to openUrl)
- assets/js/tateru.js:1636-1654 (import stores a.href verbatim)
- assets/js/tateru.js:794-797 (safeHref exists), :1684 (used only when rendering), :234-242 (no scheme validation)
Imported bookmarks with javascript: or data: URLs are neutralised in the bookmark list via safeHref, but the suggestion path calls openUrl(it.url). openUrl does location.href = url when “open in new tab” is off, which executes the script in the page origin; with new tabs it can still open a hostile data: page. The comment above safeHref shows this class of issue was already considered, but the suggestion path was missed.
Fix: add a shared URL-scheme allowlist (https/http/mailto/ftp, plus obsidian:// where intended), enforce it in sanitizeBookmarkItem and at import time, and guard both openUrl and the suggestion action with safeHref.
Medium
3. localStorage write failures are uncaught
- assets/js/tateru.js:736-738
- assets/js/profile-store.js:64-67
- assets/js/obsidian-bridge.js:48-58
save() throws if storage is blocked/quota-exceeded. Because it sits before renderAll() in most handlers, one failed write aborts theme changes, bookmark operations, panel opening, tab switches, and note saves.
Fix: safe write helper with try/catch and a one-time warning toast; use it in all three modules.
4. Shortcuts fire while overlays/dialogs are open
- assets/js/tateru.js:2793-2851: no check for a visible .overlay
- assets/js/kowasu.js:1078-1109: no check for settings.open or open help
Examples: Tateru settings open, focus on a button → i opens the file picker behind the dialog, t cycles theme, ? opens help over settings. Kowasu help open → t/e still act.
Fix: after handling Escape, return early when any overlay/dialog/help is open (keep Ctrl+K/Ctrl+, if desired).
5. Bookmark import reverses folder order, marks everything “recent”, and collapses all folders
- assets/js/tateru.js:1639-1662: child folders are pushed by recursion before the parent is pushed
- :1653: every imported item gets addedAt: Date.now()
- :2008-2010: import replaces all bookmarks and collapses every folder
Result: folder order differs from the browser export, the “recent” view shows the entire imported library for 30 days, and immediately after import every folder is collapsed so the import looks empty.
Fix: push the folder object before walking its children, use the file’s ADD_DATE (seconds → ms) or omit addedAt for imports, and don’t collapse all folders automatically.
6. Backup restore changes page settings before optional profile restore can fail
- assets/js/tateru.js:2359-2360 and :2376-2377
- assets/js/tateru.js:2256-2262, :2284-2321
applyImportedSettings() saves and renders first; if applyOptionalBackupSettings() then throws, the user sees an error but the page settings have already been replaced. This contradicts the README claim that import validates before changing settings.
Fix: validate/commit the profile portion first, or snapshot settings and roll back if the optional restore fails.
7. Profile theme accepts any slug
- assets/js/profile-store.js:44-48
- assets/js/profile-panel.js:209-236
An imported/edited profile such as "theme":"hacker" passes normalization but matches no option, leaving the select blank and applying no theme colors.
Fix: validate against themeConfig.themes IDs and coerce to inherit, then persist the correction.
8. Yasumu feed link selection can drop posts
- assets/js/yasumu.js:97-98, filtered out at :116
item.querySelector('link') takes the first link. In Atom entries that can be rel="self", so the validated t.me link is never found and the post is discarded. RSSHub currently serves RSS 2.0, so this is latent, but it is a real parsing bug.
Fix: prefer link[rel="alternate"] or the first link whose href/text is a t.me URL, with a text-content fallback.
Low / cleanup
9. Empty-folder UX — tateru.js:1864-1869: delete is disabled for non-empty folders, making the folderNotEmpty toast unreachable; :1887-1893 plus :1983-1994 show both “empty folder” and global “no bookmarks”. Keep the button enabled with the toast, or remove the toast and show only one empty state.
10. Displayed hotkey can be dead — tateru.js:1443-1446: custom keys are registered only if not already taken, but the card still displays the custom key. Example: link 5 custom key 1 displays 1, while pressing 1 opens link 1. Assign custom keys first, then auto-numbers skipping taken keys, and display the effective key.
11. looksLikeUrl — tateru.js:824-828: example.com:8080 is searched instead of opened, while localhostfoo is treated as a URL because the regex is unanchored. Use a proper host/optional-port regex or new URL.
12. Invalid nested interactive content — tateru.js:1448-1454: <button> elements are placed inside <a>. Clicks are stopped manually, so it works, but it is invalid HTML and confusing to keyboard/screen-reader users. Use a card container with a separate link, or move actions outside the anchor.
13. normalizeUrl breaks non-HTTP quick links — tateru.js:786-791: mailto:me@example.com becomes https://mailto:me@example.com. Preserve any allowed scheme, not only obsidian://.
14. Search mirror caret drift — tateru.js:857-869, :1317-1321: Tateru has no scroll listener (Kowasu does at kowasu.js:626), only measures the first 200 characters, and hardcodes font:16px; moving the caret with arrows/Home/End can desync the cursor. Add a scroll listener and measure with the input’s actual style/value.
15. launchObsidianUri always returns false — obsidian-bridge.js:26-30: window.open(...,'noopener,...') returns null by spec. The value is currently unused, so this is an API bug, not a user-visible one. Return a meaningful result or drop the return value.
16. Note draft writes on every keystroke — profile-panel.js:420: localStorage.setItem per character. Debounce or save on blur/close.
17. Profile tabs are incomplete ARIA tabs — profile-panel.js:46-52, :241-253: aria-selected is set, but panels have no aria-labelledby, tabs have no aria-controls, and arrow-key navigation is missing.
18. Stale help table — tateru.js:2744 advertises !kp and !oz, but neither exists in ENGINES (:15-129). Typing them performs a normal search for the literal text. Update the row or add the engines.
19. Dead Ctrl+Enter branch — tateru.js:1358-1360 vs page-switch.js:7-21. Global page switching is intended (README:22 and the in-page hint at tateru.js:342), so the forceNewTab branch in the search field is unreachable. Remove it or scope page switching away from the search field.
20. Unused script on Yasumu — yasumu.html:152 loads theme-loader.js, but yasumu.js never calls it. Remove it or apply the theme there.
Proposed fix plan
Phase 1 — P0, security and input handling
1. Fix shadow-DOM typing detection across Tateru/Kowasu/Yasumu; stop keydown propagation inside the open profile drawer.
2. Add URL scheme validation at bookmark import, in sanitizeBookmarkItem, in buildSuggest, and in openUrl.
Phase 2 — P1, state correctness
3. Safe localStorage wrappers in tateru.js, profile-store.js, obsidian-bridge.js.
4. Overlay/dialog guard for global hotkeys.
5. Correct bookmark folder ordering, timestamps, and post-import collapse.
6. Make backup restore atomic (or profile-first).
7. Validate profile theme IDs.
8. Harden Yasumu feed link selection.
Phase 3 — P2, UX
9. Folder delete/empty states.
10. Effective hotkey assignment/display.
11. looksLikeUrl port/end-anchor fix.
12. Link card markup; normalizeUrl scheme preservation.
13. Mirror caret measurement/scroll.
14. Folder import UX details if not already covered in Phase 2.
Phase 4 — P3, cleanup/docs
15. launchObsidianUri return value, debounced note save, tab ARIA, help bang table, dead Ctrl+Enter branch, unused Yasumu loader.
Verification plan
- Node.js/npm are not installed here, so I could not run Vite or the pages. Vite 8 needs a recent Node 20/22; after installing it, run npm run dev and test in a browser.
- Regression matrix:
- Open profile → Notes → type tei?b1-4; confirm no page action. Close panel and confirm shortcuts work again.
- Import a crafted bookmarks.html with nested folders, ADD_DATE, a javascript: URL, and duplicate folder names; inspect order/Recent and confirm nothing executes.
- Tateru/Kowasu: open settings/help, focus a button, press t, e, i, ?; confirm no background action.
- Simulate unavailable storage (private mode/quota) and confirm the app remains usable with one warning.
- Restore a backup whose profile portion fails; confirm page settings are unchanged or restored.
- Yasumu: test an RSS sample and an Atom sample containing rel="self".
- Cross-page Ctrl+Enter and profile Ctrl+Shift+P.
Two decisions for you:
1. Should I write this plan to /home/eliot/.opencode/plan (I won’t create anything unless you confirm)?
2. Should the plan include the low-priority a11y/cosmetic items, or focus only on functional/security fixes? Implementation itself requires switching agents