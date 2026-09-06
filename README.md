# PhoneLayer Embedded

> 🌐 **Live demo:** [PhoneLayer Embedded on GitHub Pages](https://spuds0588.github.io/PhoneLayer-Embedded/)

A zero-dependency, drop-in JavaScript library that upgrades the desktop browser experience for telephony (`tel:`) and text messaging (`sms:`) links. Instead of prompting users to open system apps they don't use (FaceTime, Windows Phone Link), PhoneLayer intercepts the click and shows a styled, brandable modal that routes the call or SMS to the user's preferred VoIP provider — native desktop app or web app.

**Mobile-safe.** On phones, PhoneLayer defers real `tel:`/`sms:` links to the native OS handler — and declarative triggers fall back to `tel:`/`sms:` so they keep working everywhere.

## Install

One script tag before `</body>`, served from jsDelivr:

```html
<script src="https://cdn.jsdelivr.net/gh/Spuds0588/PhoneLayer-Embedded@main/phonelayer.js"
        data-phonelayer-color="#7c5cff"
        data-phonelayer-theme="dark"></script>
```

The same file is also served directly from GitHub Pages:

```html
<script src="https://spuds0588.github.io/PhoneLayer-Embedded/phonelayer.js"
        data-phonelayer-color="#7c5cff"
        data-phonelayer-theme="dark"></script>
```

Pinned versions are available on jsDelivr too — swap `@main` for a release tag (e.g. `@v1.9.0`) to lock your install to that release.

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
        data-phonelayer-color="#4fd1c5"
        data-phonelayer-theme="light">Call Sales</button>
```

## Supported providers (v1.9)

**40 providers.** "Desktop" launches the provider's native app via an OS URI scheme; "Web" opens a centered popup to the provider's web app (may require sign-in).

| Provider | Calls | SMS | Routing |
| --- | :-: | :-: | --- |
| OS Default | ✓ | ✓ | System handler (`tel:` / `sms:`) |
| WhatsApp | ✓ | ✓ | Desktop app + Web |
| Google Voice | ✓ | ✓ | Web |
| Zoom Phone | ✓ | ✓ | Desktop app |
| RingCentral | ✓ | ✓ | Desktop app |
| Dialpad | ✓ | — | Web |
| Skype | ✓ | ✓ | Desktop app |
| TextMagic | — | ✓ | Web |
| Microsoft Teams | ✓ | — | Web |
| Cisco Webex | ✓ | — | Desktop app |
| OpenPhone | ✓ | ✓ | Web |
| Aircall | ✓ | ✓ | Web |
| 8x8 | ✓ | ✓ | Web |
| GoTo Connect | ✓ | ✓ | Web |
| Vonage | ✓ | ✓ | Web |
| Nextiva | ✓ | ✓ | Web |
| Ooma | ✓ | ✓ | Web |
| Telegram | — | ✓ | Desktop app |
| Signal | — | ✓ | Desktop app |
| Viber | — | ✓ | Desktop app |
| Five9 | ✓ | ✓ | Web |
| Genesys Cloud | ✓ | ✓ | Web |
| Zoho Voice | ✓ | ✓ | Web |
| JustCall | ✓ | ✓ | Web |
| Telnyx | — | ✓ | Web |
| Sinch | — | ✓ | Web |
| Google Messages | — | ✓ | Web |
| Twilio | — | ✓ | Web |
| TextNow | ✓ | ✓ | Web |
| CallRail | — | ✓ | Web |
| SimpleTexting | — | ✓ | Web |
| Heymarket | — | ✓ | Web |
| Kixie | ✓ | ✓ | Web |
| Toky | ✓ | ✓ | Web |
| Sonetel | ✓ | ✓ | Web |
| OnSIP | ✓ | — | Web |
| Plivo | — | ✓ | Web |
| Infobip | — | ✓ | Web |
| ClickSend | — | ✓ | Web |
| Podium | — | ✓ | Web |

## Features

- **Auto-interception** of `tel:` / `sms:` links via event delegation.
- **Declarative triggers** (`.phonelayer-trigger` + `data-phonelayer-to`).
- **Mobile fallback** — real `tel:`/`sms:` links keep native OS dialing; declarative triggers fall back to `tel:`/`sms:`.
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

Live demo hosted on GitHub Pages: **https://spuds0588.github.io/PhoneLayer-Embedded/**

Local preview needs no dependencies — serve the repo with any static file server:

```sh
python3 -m http.server 4173   # http://localhost:4173
```

## No build step

This repository intentionally ships zero build tooling and zero runtime dependencies. The whole site is static — `index.html` plus `phonelayer.js` — so what you clone is exactly what GitHub Pages serves. (The Playwright/Chromium suite used during development lives outside the repo.)
