# PhoneLayer Embedded

## 1. Product Requirements Document (PRD)

### 1.1 Overview & Problem Statement
Similar to MailLayer Embedded, **PhoneLayer Embedded** is a zero-dependency, drop-in JavaScript library designed to upgrade the default desktop browser experience for telephony (`tel:`) and text messaging (`sms:`) links. 

By default, desktop operating systems handle phone links poorly, often prompting users to open default system apps they do not use (e.g., FaceTime on macOS or Windows Phone Link). PhoneLayer intercepts these clicks and presents a styled, brandable modal allowing the user to route the call or SMS to their preferred VoIP provider (e.g., Zoom Phone, WhatsApp, Google Voice), supporting both Native Desktop Apps and Web Apps.

### 1.2 Target Audience
*   **End Users:** Desktop/laptop users navigating B2B and B2C websites who want to seamlessly dial or text businesses using their established VoIP/communication workflows.
*   **Developers:** Frontend developers looking for a fast, customizable, drop-in script to enhance the UX of their phone/support links without writing complex routing logic.

### 1.3 Core Features & Requirements
*   **Automatic Link Interception:** Automatically captures clicks on `<a href="tel:...">` and `<a href="sms:...">`.
*   **Declarative Triggers:** Supports custom UI elements via `.phonelayer-trigger` and `data-phonelayer-to` attributes.
*   **Mobile OS Handling:** Detects mobile user-agents and defers real `tel:`/`sms:` links to the native OS handler, while declarative triggers fall back to `tel:`/`sms:` so they never dead-end.
*   **Provider Matrix (App & Web):** Supports routing to Native OS Apps (via custom URI schemes like `zoomphonecall://`) and Web Apps (via HTTPS endpoints like Google Voice).
*   **Smart Fallbacks & Warnings:** Provides clear UX badging (`[App]` vs `[Web]`) and alerts users that Web Apps may require prior authentication.
*   **User Preferences (Memory):** Includes a "Remember my choice" checkbox utilizing `localStorage` to bypass the modal on future clicks.
*   **Robust Data Sanitization:** Strips improperly formatted phone data natively from the DOM (removes spaces, dashes, parentheses), enforcing numeric execution with leading `+` compatibility.
*   **Theming Parity with MailLayer:** Fully customizable primary colors and light/dark themes via CSS variables defined directly on the script tag or trigger elements.

### 1.4 Out of Scope (Technical Pushbacks Applied)
*   **Iframe Embedding:** Due to strict `X-Frame-Options` on VoIP providers, Web App dialing must use a popup window, not an inline iframe.
*   **Auth-State Detection:** The library will not (and cannot) detect if a user is actively logged into a third-party Web App due to browser CORS/sandboxing.
*   **DOM Scanning for Text:** Will not scan plaintext for 10-digit numbers to prevent false positives and performance degradation (YAGNI).

---

## 2. Implementation Guide

### 2.1 Architecture Overview
PhoneLayer is built as a single, vanilla JavaScript Immediately Invoked Function Expression (IIFE). It pollutes exactly one global variable (`window.PhoneLayer`) for debugging and preference resetting. CSS is injected dynamically into the `<head>` using CSS Variables for theming. 

### 2.2 Integration & Theming
Developers embed the script just before the closing `</body>` tag. Global configurations are applied directly to the `<script>` tag.

```html
<script src="https://cdn.example.com/phonelayer.js" 
        data-phonelayer-color="#e03616" 
        data-phonelayer-theme="dark"></script>
```

### 2.3 HTML Markup Standards
PhoneLayer supports three interaction paradigms:

**1. Standard Auto-Intercept:**
```html
<a href="tel:+15551234567">Call Support</a>
<a href="sms:+15551234567?body=Need%20help">Text Support</a>
```

**2. Declarative Triggers (MailLayer Style):**
```html
<button class="phonelayer-trigger" data-phonelayer-to="+15551234567">
    Call Us Now
</button>
```

**3. Granular Trigger Overrides:**
```html
<button class="phonelayer-trigger" 
        data-phonelayer-to="+15551234567"
        data-phonelayer-color="#28a745"
        data-phonelayer-theme="light">
    Call Sales (Custom Green Theme)
</button>
```

### 2.4 Routing Mechanism
The execution engine splits routing into two distinct browser behaviors to maintain UX and avoid security blocks:
*   **Native App Routing (`isWeb: false`):** Utilizes `window.location.href = url`. This triggers the browser's native "Open this application?" prompt for custom OS-level URIs.
*   **Web App Routing (`isWeb: true`):** Utilizes a precisely centered `window.open` popup window (600x700px). This ensures the user does not lose their place on the host website, avoiding the Safari unprompted pop-up blocker by initiating strictly off a user click event loop.

### 2.5 Number Sanitization Engine
Prior to execution, all phone numbers run through:
`const cleanNum = rawNum.replace(/(?!^\+)[^\d]/g, '');`
This ensures elements like `(555) 123-4567` are compiled to `5551234567`, protecting strict URI handlers (like WhatsApp) from crashing due to malformed string inputs.

---

## 3. Developer Task List (Roadmap)

### Phase 1: Core Engine & Tier 1 Providers (V1.0) - *Completed*
- [x] Build vanilla JS IIFE structure with event delegation.
- [x] Implement Mobile User-Agent bypass logic.
- [x] Create dynamically injected UI modal with CSS variable theming.
- [x] Implement live search/filtering for provider list.
- [x] Add Data Sanitization regex.
- [x] Add "Remember my choice" via `localStorage`.
- [x] Map Tier 1 Providers:
    - [x] OS Default (`tel:` / `sms:`)
    - [x] WhatsApp (App & Web)
    - [x] Google Voice (Web)
    - [x] Zoom Phone (App)
    - [x] RingCentral (App)
    - [x] Dialpad (Web)
    - [x] Skype (App)
    - [x] TextMagic (Web)

### Phase 2: Enterprise Core & Telemetry (V1.5) - *Completed*
- [x] Map Microsoft Teams (`teams.microsoft.com/l/call/0/0?users=4:+NUM` PSTN deep link).
- [x] Map Cisco Webex (`webextel:+NUM`).
- [x] Map OpenPhone (web app route — no public deep-link params).
- [x] Map Aircall, 8x8, and GoToConnect (web app routes).
- [ ] Add strict E.164 padding: If a number is exactly 10 digits without a country code, programmatically evaluate and prepend `+1` (USA) or allow dev-configured default country code on the script tag (`data-phonelayer-default-country="US"`).
- [ ] Write Jest unit tests for the number sanitization regex.

### Phase 3: Niche Giants & Advanced Routing (V2.0) - *Providers mapped (v1.6)*
- [x] Map legacy providers (Vonage, Nextiva, Ooma) — web app routes (`app.vonage.com`, `app.nextiva.com`, `office.ooma.com`).
- [x] Map secure/international messengers (Telegram, Signal, Viber) — app routes (`tg://resolve?phone=`, `sgnl://signal.me/#p/`, `viber://chat?number=`).
- [ ] Build a lightweight hosted config dashboard (Optional): Allow users to generate their script tags visually, mirroring MailLayer's go-to-market strategy.
- [ ] Package as an NPM module (`npm i @phonelayer/embedded`) for React/Next.js native implementations alongside the CDN script.