---
status: partial
phase: 03-friends-shared-deeds
source: [03-VERIFICATION.md]
started: 2026-06-04T18:05:00Z
updated: 2026-06-04T18:05:00Z
---

## Current Test

[awaiting human testing]

## Tests

### 1. Add friend and duplicate 409 inline
expected: First add succeeds and list refreshes; second attempt shows inline 409 message under the tag field (not a global banner)
result: [pending]

### 2. Remove outgoing friend via modal
expected: Modal copy matches spec (Remove friend? / Keep friend); row disappears after 204; card Link does not navigate when clicking Remove
result: [pending]

### 3. Block incoming with no friendship
expected: Inline message reads exactly "No one with that tag has added you" — not API Friendship not found or User not found
result: [pending]

### 4. Unified 403 on non-friend or unknown tag
expected: Centered panel shows "You can't view this user's deeds" and Back to friends — same copy for unknown tag and valid tag you do not follow; no email; no raw API 403 text
result: [pending]

### 5. Read-only friend deeds from card click
expected: Header shows @{tag}'s deeds and displayName when available; deeds have no edit/delete/status controls; empty friend shows No deeds yet
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps
