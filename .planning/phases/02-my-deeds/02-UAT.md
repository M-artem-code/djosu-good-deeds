---
status: complete
phase: 02-my-deeds
source: 02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-03-SUMMARY.md, 02-VERIFICATION.md
started: 2026-06-04T14:00:00Z
updated: 2026-06-04T14:40:00Z
---

## Current Test

[testing complete]

## Tests

### 1. View deeds list on /deeds
expected: Sign in → /deeds shows Planned and Done sections with badges; newest-first within each section
result: pass

### 2. Empty state and add form
expected: With zero deeds, "No deeds yet" copy appears and the add form is expanded by default (not collapsed)
result: pass

### 3. Create deed with title and description
expected: Add deed with title only, then with optional description; new cards appear in Planned without page reload or success toast
result: pass

### 4. Whitespace-only title rejected
expected: Submit add form with spaces-only title; inline title error appears and no new card is created
result: pass

### 5. Edit deed fields
expected: Edit a card, change title/description, Save changes; card updates in place
result: pass

### 6. Change status without confirmation
expected: Mark done moves card to Done after refetch; Mark planned moves back; buttons show Marking done… / Marking planned… while pending
result: pass

### 7. Delete deed with modal
expected: Delete opens modal (Delete deed? / can't be undone); confirm removes card; no success toast
result: pass

### 8. Delete modal dismiss rules
expected: Clicking dimmed overlay does nothing; Escape or Keep deed closes without deleting
result: pass

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none]
