# PhoneLayer Embedded

A zero-dependency, drop-in JavaScript library that upgrades the desktop browser experience for telephony (`tel:`) and text messaging (`sms:`) links. Instead of prompting users to open system apps they don't use (FaceTime, Windows Phone Link), PhoneLayer intercepts the click and shows a styled, brandable modal that routes the call or SMS to the user's preferred VoIP provider — native desktop app or web app.

**Desktop only.** PhoneLayer strictly detects mobile user-agents and disables itself, deferring to native OS handling.

## Install

One script tag before `</body>`:

```html
<script src="phonelayer.js"
        data-phonelayer-color="#e03616"
        data-phonelayer-theme="dark"></script>
```

## Usage

PhoneLayer supports three interaction paradigms:

```html
<!-- 1. Auto-intercepted links -->
<a href="tel:+15551234567">Call Support</a>
<a href="sms:+15551234567?body=Need%20help">Text Support</a>

<!-- 2. Declarative triggers -->
<button class="phonelayer-trigger" data-phonelayer-to="+15551234567">Call Us Now</button>

<!-- 3. Granular trigger overrides -->
<button class="phonelayer-trigger"
        data-phonelayer-to="(555) 123-4567"
        data-phonelayer-color="#28a745"
        data-phonelayer-theme="light">Call Sales</button>
```

## Features (v1.0)

- **Auto-interception** of `tel:` / `sms:` links via event delegation.
- **Declarative triggers** (`.phonelayer-trigger` + `data-phonelayer-to`).
- **Mobile bypass** — the library no-ops on mobile user agents.
- **Provider matrix**: OS Default, WhatsApp (App + Web), Google Voice (Web), Zoom Phone (App), RingCentral (App), Dialpad (Web), Skype (App), TextMagic (Web).
- **App vs Web routing** — apps launch via OS URI schemes (`window.location.href`); web apps open a centered 600×700 popup (`window.open`).
- **Web-app warnings** — Web providers are badged `[Web]` and hint that sign-in may be required.
- **"Remember my choice"** — persists the selected provider per type (`call`/`sms`) in `localStorage`; subsequent clicks route directly.
- **Number sanitization** — `raw.replace(/(?!^\+)[^\d]/g, "")` strips spaces, dashes, and parens before execution.
- **Theming** — light/dark themes and brand colors via `data-phonelayer-color` / `data-phonelayer-theme` on the script tag or individual triggers.

## Public API

```js
window.PhoneLayer.reset(); // clear the remembered provider preference
```

`window.PhoneLayer.version` reports the library version.

## Demo

Serve the repo and open `index.html`:

```sh
bun install
bun run serve   # http://localhost:4173
```

## Testing

Playwright drives Chromium in headless (default) and headed modes:

```sh
bun run test          # headless chromium
bun run test:headed   # headed chromium (needs a display or xvfb-run)
```

Install the browser and OS deps once:

```sh
bunx playwright install chromium
bunx playwright install-deps chromium   # system libraries (Linux)
```

## Out of scope (v1)

- Iframe embedding (VoIP providers set strict `X-Frame-Options` — web dialing uses a popup).
- Auth-state detection (impossible under browser CORS/sandboxing).
- Plaintext phone-number scanning (false positives / performance).

See `PRD-PhoneLayer_Embedded.md` for the full roadmap (V1.5: Teams, Webex, OpenPhone, E.164 padding; V2.0: niche messengers, NPM package).