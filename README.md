# PhoneLayer Embedded

> 🌐 **Live demo:** [PhoneLayer Embedded on GitHub Pages](https://spuds0588.github.io/PhoneLayer-Embedded/)

A zero-dependency, drop-in JavaScript library that upgrades the desktop browser experience for telephony (`tel:`) and text messaging (`sms:`) links. Instead of prompting users to open system apps they don't use (FaceTime, Windows Phone Link), PhoneLayer intercepts the click and shows a styled, brandable modal that routes the call or SMS to the user's preferred VoIP provider — native desktop app or web app.

**Mobile-safe.** On phones, PhoneLayer defers real `tel:`/`sms:` links to the native OS handler — and declarative triggers fall back to `tel:`/`sms:` so they keep working everywhere.

## Install

One script tag before `</body>`:

```html
<script src="phonelayer.js"
        data-phonelayer-color="#7c5cff"
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
        data-phonelayer-color="#4fd1c5"
        data-phonelayer-theme="light">Call Sales</button>
```

## Features (v1.6)

- **Auto-interception** of `tel:` / `sms:` links via event delegation.
- **Declarative triggers** (`.phonelayer-trigger` + `data-phonelayer-to`).
- **Mobile fallback** — real `tel:`/`sms:` links keep native OS dialing; declarative triggers fall back to `tel:`/`sms:`.
- **Provider matrix (Tier 1)**: OS Default, WhatsApp (App + Web), Google Voice (Web), Zoom Phone (App), RingCentral (App), Dialpad (Web), Skype (App), TextMagic (Web).
- **Provider matrix (Tier 2)**: Microsoft Teams (Web — PSTN deep link), Cisco Webex (App — `webextel://`), OpenPhone (Web), Aircall (Web), 8x8 (Web), GoTo Connect (Web).
- **Provider matrix (Tier 3)**: Vonage (Web), Nextiva (Web), Ooma (Web), Telegram (App — `tg://resolve?phone=`), Signal (App — `sgnl://`), Viber (App — `viber://chat`).
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

## Out of scope (v1.5)

- Iframe embedding (VoIP providers set strict `X-Frame-Options` — web dialing uses a popup).
- Auth-state detection (impossible under browser CORS/sandboxing).
- Plaintext phone-number scanning (false positives / performance).

See `PRD-PhoneLayer_Embedded.md` for the full roadmap (Remaining: E.164 country-code padding, config dashboard, NPM package).