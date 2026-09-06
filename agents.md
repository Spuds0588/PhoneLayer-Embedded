# PhoneLayer Embedded — Agent Guide

PhoneLayer Embedded is a zero-dependency vanilla-JS drop-in library that upgrades
desktop `tel:`/`sms:` links with a branded provider picker, then routes calls/SMS to
the user's chosen VoIP/SMS provider (native app or web app). The repo is a static demo
site: `index.html` + `phonelayer.js` + `assets/` logos. There is **no build step, no
runtime dependencies, no React/Convex/bundler**.

## Files

- `phonelayer.js` — the product. Vanilla JS IIFE; one global `window.PhoneLayer = { version, reset() }`.
- `index.html` — landing page + live demo. The only visual surface.
- `assets/*.svg|.png|.jpg` — provider logos used by the carousel.
- `README.md` — public docs.
- `PRD-PhoneLayer_Embedded.md` — local product spec. **Gitignored; keep it local, do
  not push or treat it as a deliverable.**

## Guiding principles (from the PRD, treated as rules)

- **YAGNI, prefer one-line solutions.** Smallest edit that satisfies the request. No new
  abstractions, packages, build tooling, or backend unless explicitly asked.
- **Zero dependencies / zero build.** No bundler, package manager, test runner, or
  framework unless it is explicitly required and we discussed it.
- **Mobile first-class.** Real `tel:`/`sms:` links must not be intercepted on mobile;
  declarative triggers must fall back to `tel:`/`sms:` instead of doing nothing. Android
  headed testing is a common failure point.
- **No iframe web dialing.** VoIP providers set strict `X-Frame-Options`; web routing
  stays popup-based.
- **No auth-state detection.** Cannot and will not detect login state on web providers.
- **No plaintext phone scanning.** Do not scan text nodes for 10-digit numbers.
- **Brandability preserved.** `data-phonelayer-color` / `data-phonelayer-theme` on script
  tag or per-trigger must keep working.

## Library surface (`phonelayer.js`)

- **Config:** read from the `<script>` tag (`data-phonelayer-color`, `data-phonelayer-theme`).
- **Provider matrix:** `PROVIDERS` is the single source of truth. Each entry:
  `id, name, kind ("app"|"web"), types (["call"|"sms"]), build(n, type, body)`.
  - `app` → `window.location.href = url` (OS URI scheme).
  - `web` → centered 600×700 popup via `window.open`.
- **Demo number:** `+15551234567` is used by many tiles/demo links.
- **Sanitization:** `raw.replace(/(?!^\+)[^\d]/g, '')`.
- **Preference:** `localStorage` key `phonelayer:choice` shaped `{t, p}`.
- **UI:** modal built lazily; CSS injected under `#phonelayer-css`; theming via CSS
  variables + `data-pl-theme`.

When providers change, **edit `PROVIDERS` in `phonelayer.js`**, not just the demo page.
The demo gallery must stay in sync with the matrix.

## Demo page (`index.html`)

- Hero install snippet should show **both** URLs:
  - jsDelivr: `https://cdn.jsdelivr.net/gh/Spuds0588/PhoneLayer-Embedded@main/phonelayer.js`
  - GitHub Pages: `https://spuds0588.github.io/PhoneLayer-Embedded/phonelayer.js`
  Pinned releases use `@vX.Y.Z` on jsDelivr.
- Provider gallery is an **icon-only carousel**: `#pl-carousel` / `#pl-track`, tiles are
  `<a class="pl-tile">` with `data-phonelayer-to="+15551234567"`. A small script
  duplicates the track once for a seamless -50% loop and hides the second-half copies
  (`aria-hidden`, `tabindex=-1`); don’t rewrite that logic casually.
- Tile legibility: for dark/light/text-heavy logos, prefer subtle `filter: contrast()
  brightness()` on the tile `<img>` over labels or bigger assets. Avoid hard tile outlines
  if they hurt logo legibility.
- Changes to `index.html` often need a matching `phonelayer.js` change when provider chips
  change — treat them as a pair.

## Adding a provider

1. Pick routing: app (OS URI scheme) or web (HTTPS popup).
2. App → verify OS scheme/deep link; web → verify sign-in landing URL.
3. Add the entry to `PROVIDERS` in `phonelayer.js`, including `types`.
4. If it should appear in the demo, add a tile in `#pl-track` and the matching asset in
   `assets/`.
5. If we lack an official logo, source an official SVG/PNG into `assets/`; never leave
   broken logo URLs.
6. Update `README.md` only if the provider table changes.

## Release workflow

- Bump version consistently: `phonelayer.js` header comment **and** `window.PhoneLayer.version`.
- Commit, push `main`, tag `vX.Y.Z`, push the tag.
- Create the GitHub release with the library attached:
  `gh release create vX.Y.Z phonelayer.js --title "vX.Y.Z ..." --notes "..."`
- After tagging, verify:
  - `https://cdn.jsdelivr.net/gh/Spuds0588/PhoneLayer-Embedded@vX.Y.Z/phonelayer.js`
  - `https://spuds0588.github.io/PhoneLayer-Embedded/phonelayer.js`
  - the release asset is present.

## Git / delivery

- Repo is Freebuff Cloud connected; run git normally.
- No force-push, no history rewrite, no reset/clean unless explicitly asked.
- Stage only the files that belong to the current request.
- Commit messages should be concise and outcome-focused.

## Testing

- Verify on a **headed** browser, especially carousel tile clicks and the modal.
- Verify **mobile** (Android): declarative fallback and sensible default behavior are the
  usual failure points.
- If logos break, check `assets/` presence and `index.html` paths before changing JS.

## Out of scope unless asked

Bundlers, npm packaging, React wrappers, backend APIs, iframe web dialing, auth
detection for web providers, plaintext phone scanning, and anything not justified by the
request.

## Optional local commands

```sh
python3 -m http.server 4173

git push origin main && git tag vX.Y.Z && git push origin vX.Y.Z
gh release create vX.Y.Z phonelayer.js --title "vX.Y.Z ..." --notes "..."
```
