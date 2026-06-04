---
status: complete
phase: 01-app-shell-authentication
source:
  - 01-01-SUMMARY.md
  - 01-02-SUMMARY.md
  - 01-03-SUMMARY.md
started: 2026-06-04T12:00:00Z
updated: 2026-06-04T12:45:00Z
mvp_mode: true
---

## Current Test

[testing complete]

## Tests

### 1. Register and land in app shell
expected: Register succeeds; you are logged in and see /deeds with full nav shell and @tag in header.
result: pass

### 2. Log in and stay logged in after refresh
expected: Sign in at /login with existing credentials → /deeds. Browser refresh keeps you on /deeds (still authenticated).
result: pass

### 3. Log out loses protected access
expected: Click "Log out" → sent to /login. Visiting /deeds redirects back to /login.
result: pass

### 4. Unauthenticated /deeds redirects to login
expected: While logged out, open /deeds directly → redirected to /login (no stub content without auth).
result: pass

### 5. Navigate between stub sections
expected: While logged in, click Deeds, Friends, and Settings in nav. Each shows its stub heading and body copy; nav stays visible.
result: pass

### 6. Mobile hamburger navigation
expected: Below md breakpoint, hamburger opens a menu with section links; tapping a link navigates and closes the menu.
result: pass
note: Failed initially (overlap/duplicate); fixed in AppNav.tsx; retest passed

### 7. Invalid login shows error (not session redirect)
expected: Wrong password on /login shows an inline/banner "Invalid credentials" message; you stay on /login (no session-expired redirect).
result: pass

### 8. Duplicate register shows inline field error
expected: Register again with same email or tag → inline error under the relevant field (not only a generic banner).
result: pass

### 9. Guest redirect from auth pages
expected: While logged in, visiting /login or /register redirects to /deeds.
result: pass

## Summary

total: 9
passed: 9
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[resolved — test 6 fixed and passed on retest]
