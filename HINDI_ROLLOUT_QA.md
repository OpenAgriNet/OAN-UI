# Hindi Rollout QA Checklist

Use this checklist to validate Hindi support while ensuring English and Gujarati remain stable.

## 1) Environment Preparation

- Rebuild and restart test UI container:
  - `docker compose --profile test up -d --build vistaar-ui-service-test`
- Open the test app URL (port `8006` if using the provided compose profile).
- Hard refresh the browser (`Ctrl+Shift+R`) before each language pass.
- In DevTools Network, enable "Preserve log" and (optionally) "Disable cache".

## 2) Language Selection and Persistence

- Open language dropdown and verify all options exist:
  - English
  - Gujarati
  - Hindi
- Switch to Hindi and refresh:
  - Selected language remains Hindi.
- Clear local storage and reload:
  - Default language falls back to Gujarati.

## 3) UI Localization Validation (Hindi)

- Verify Hindi copy appears for:
  - Welcome text
  - Input placeholder
  - Mic hint
  - Settings labels
  - Loader messages
- Verify quick actions/pinned questions are Hindi and dairy-focused.
- Verify FAQ section is Hindi (not English fallback).
- Trigger rate limit (or mock 429) and verify Hindi `limitMessage`.

## 4) Backend Request Contract Validation

Check requests in browser DevTools Network while language is Hindi:

- Chat (`GET /api/chat/`)
  - `source_lang=hi`
  - `target_lang=hi`
  - No Hindi-specific extra flag (must mirror Gujarati request shape)
- Suggestions (`GET /api/suggest/`)
  - `target_lang=hi`
- Transcribe (`POST /api/transcribe/`)
  - body contains `source_lang=hi`
- TTS (`POST /api/tts/`)
  - body contains `target_lang=hi`

Repeat the same validations with Gujarati selected:

- Ensure request shape is identical, only language code changes (`gu` instead of `hi`).

## 5) Regression Pass (English and Gujarati)

- Switch to English:
  - Core UI strings display correctly.
  - Quick actions and FAQ still work.
- Switch to Gujarati:
  - Existing Gujarati experience remains unchanged.
  - Chat, suggestions, STT, TTS calls still carry `gu`.

## 6) Negative/Failure Cases

- Force auth expiry / unauthorized flow:
  - Ensure existing auth error behavior remains unchanged.
- Trigger backend 500/error response:
  - Ensure app shows existing error handling/toast behavior.
- Trigger empty suggestion response:
  - Ensure retry behavior still works and does not break UI.

## 7) Release Sign-Off Criteria

Mark rollout ready only when all are true:

- [x] Hindi selectable and persisted.
- [x] Hindi UI content is complete on chat and settings flows.
- [x] Hindi FAQ is localized.
- [x] Hindi backend payloads mirror Gujarati structure.
- [x] English and Gujarati regressions are clear.
- [x] No new TypeScript/lint errors introduced in touched files.

## Notes

- Current build may show non-blocking warnings about Node version for Vite and bundle chunk size.
- These warnings do not block Hindi rollout validation but should be tracked separately.
