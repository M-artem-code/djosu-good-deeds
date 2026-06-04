---
phase: 1
slug: app-shell-authentication
status: approved
shadcn_initialized: false
preset: none
created: 2026-06-04
reviewed_at: 2026-06-04
---

# Phase 1 — UI Design Contract

> Visual and interaction contract for App Shell & Authentication. Aligns with `01-CONTEXT.md` locked decisions and existing Tailwind v4 + Geist scaffold.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none (Tailwind utility-first; no shadcn) |
| Preset | not applicable |
| Component library | none — build with Tailwind + small local components |
| Icon library | inline SVG (Heroicons-style outline, 20px) — no npm icon package in Phase 1 |
| Font | Geist Sans (`next/font/google`, already in `layout.tsx`); Geist Mono for `@tag` display only |

**Rationale:** Brownfield scaffold uses Tailwind v4 + Geist. CONTEXT.md discretion: follow existing aesthetic; shadcn not initialized (`components.json` absent). Avoid new design-system deps in Phase 1.

---

## Spacing Scale

Declared values (multiples of 4):

| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Icon–label gap, inline error text margin-top |
| sm | 8px | Form field gap, nav item padding-y |
| md | 16px | Card padding, form section gap, nav link gap |
| lg | 24px | Auth card padding (desktop), page content padding |
| xl | 32px | Auth page vertical rhythm, stub page section gap |
| 2xl | 48px | Auth page top/bottom margin |
| 3xl | 64px | — reserved; not used in Phase 1 |

Exceptions:
- **44px** min touch target height for primary buttons and hamburger toggle (accessibility; not on spacing scale grid but justified)
- Nav bar height: **56px** (14 × 4) — fixed app header

---

## Typography

| Role | Size | Weight | Line Height | Tailwind |
|------|------|--------|-------------|----------|
| Body | 16px | 400 (regular) | 1.5 | `text-base font-normal leading-normal` |
| Label | 14px | 400 (regular) | 1.4 | `text-sm font-normal leading-snug` |
| Heading | 20px | 600 (semibold) | 1.2 | `text-xl font-semibold leading-tight` |
| Display | 28px | 600 (semibold) | 1.2 | `text-[28px] font-semibold leading-tight` |

**Weight rule:** Only **400** and **600** — labels use 400; headings, display titles, and active nav use 600.

**Rules:**
- `@tag` in header: `text-sm font-mono font-normal text-zinc-600 dark:text-zinc-400` (Label size, mono face)
- Inline field errors: Label size, `text-red-600 dark:text-red-400`
- Active nav link: Body size, weight 600

---

## Color

| Role | Light | Dark | Usage |
|------|-------|------|-------|
| Dominant (60%) | `#fafafa` (zinc-50) | `#0a0a0a` (zinc-950) | Page backgrounds, auth page backdrop |
| Secondary (30%) | `#ffffff` | `#171717` (zinc-900) | Cards, nav bar surface, form inputs |
| Accent (10%) | `#18181b` (zinc-900) | `#fafafa` (zinc-50) | Primary buttons, active nav indicator, focus rings |
| Muted text | `#71717a` (zinc-500) | `#a1a1aa` (zinc-400) | Helper text, cross-links, stub copy |
| Border | `#e4e4e7` (zinc-200) | `#3f3f46` (zinc-700) | Cards, inputs, nav bottom border |
| Destructive | `#dc2626` (red-600) | `#f87171` (red-400) | Field errors, error banner background tint |
| Error banner bg | `#fef2f2` (red-50) | `#450a0a/40` (red-950/40) | Global API error banner |

**60/30/10 split:** zinc-50 page (60%) → white/zinc-900 surfaces for card + nav (30%) → zinc-900/zinc-50 accent on primary actions only (10%).

**Accent reserved for:**
- Primary submit buttons ("Sign in", "Create account")
- Active navigation link text + 2px bottom border on current route
- Focus ring on inputs and buttons (`ring-2 ring-zinc-900 dark:ring-zinc-50 ring-offset-2`)

**NOT accent:** Logout (text button, zinc muted), hamburger icon, stub page headings, cross-links.

---

## Visual Hierarchy

| Screen | Focal point (1st) | Secondary (2nd) | Tertiary (3rd) |
|--------|-------------------|-----------------|----------------|
| `/login` | Email + password form card | "Create account" cross-link | App name "Djosu" display title |
| `/register` | Registration form card (tag field emphasized) | "Sign in" cross-link | Tag format helper text |
| App shell (all protected routes) | Main content area | Active nav link in top bar | `@tag` + Log out (header right) |
| Global error banner | Banner message text | Dismiss control (×) | — |
| Stub pages (`/deeds`, `/friends`, `/settings`) | Section heading (e.g. "My Deeds") | Stub body copy + phase hint | Nav remains visible |

**Auth layout:** Centered card, max-width `420px`, vertically centered on `min-h-screen` with `2xl` (48px) padding. Card: white/zinc-900 surface, `rounded-xl`, `border border-zinc-200 dark:border-zinc-700`, shadow `shadow-sm`.

**App shell layout:**
```
┌─────────────────────────────────────────────────────────┐
│ [Djosu]   Deeds  Friends  Settings          @tag  Log out │  ← 56px nav
├─────────────────────────────────────────────────────────┤
│ [Error banner — full width, when present]               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│              Main content (max-w-3xl mx-auto, lg pad)   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

Mobile (`< md`): nav links collapse into hamburger (top-right, before `@tag`). Menu drops as full-width panel below header with `md` vertical padding per link.

---

## Component Inventory (Phase 1)

| Component | Location (suggested) | Purpose |
|-----------|------------------------|---------|
| `AppNav` | `frontend/src/components/layout/AppNav.tsx` | Top bar, links, hamburger, `@tag`, logout |
| `ErrorBanner` | `frontend/src/components/feedback/ErrorBanner.tsx` | Global dismissible API error strip |
| `AuthCard` | `frontend/src/components/auth/AuthCard.tsx` | Centered card wrapper for login/register |
| `TextField` | `frontend/src/components/ui/TextField.tsx` | Label + input + inline error slot |
| `PrimaryButton` | `frontend/src/components/ui/PrimaryButton.tsx` | Accent CTA, 44px min-height, full-width in forms |
| `TextButton` | `frontend/src/components/ui/TextButton.tsx` | Logout, cross-links — muted, no accent fill |

**Form inputs:** `h-11` (44px), `rounded-lg`, `border border-zinc-200 dark:border-zinc-700`, `px-3`, focus ring per accent rules. Disabled state: `opacity-50 cursor-not-allowed`.

**Primary button:** `rounded-lg` (auth forms; not pill — distinguish from scaffold marketing page), `bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900`, hover `opacity-90`.

**Loading:** Primary button shows "Signing in…" / "Creating account…" + `disabled` during submit; no spinner library — optional CSS `animate-pulse` on button text.

---

## Screen Specifications

### `/login`

| Element | Spec |
|---------|------|
| Title | Display: "Sign in to Djosu" |
| Fields | Email (type email), Password (type password) |
| Primary CTA | "Sign in" |
| Cross-link | "Don't have an account? **Create account**" → `/register` |
| Field errors | Inline under field (400 validation) |
| Non-field errors | Error banner above card |
| Success | Redirect to `/deeds` (no toast) |

### `/register`

| Element | Spec |
|---------|------|
| Title | Display: "Create your Djosu account" |
| Fields | Email, Password, Display name, Tag |
| Tag helper | Label size muted: "3–32 characters: lowercase letters, numbers, underscore" |
| Tag input | `font-mono`; show `@` prefix visually (decorative span, not part of submitted value) |
| Primary CTA | "Create account" |
| Cross-link | "Already have an account? **Sign in**" → `/login` |
| 409 errors | Inline under email ("Email already registered") or tag ("Tag already taken") — map from API message |
| Success | Redirect to `/deeds` |

### Protected stub pages

| Route | Heading | Body copy |
|-------|---------|-----------|
| `/deeds` | "My Deeds" | "Your good deeds list will appear here. Full deed management arrives in the next update." |
| `/friends` | "Friends" | "Add friends by tag and see their deeds here soon." |
| `/settings` | "Settings" | "Profile and account settings will be available here soon." |

Stub layout: Heading + muted body, left-aligned within content area (`max-w-3xl`), `xl` gap between heading and body.

### Session expired (`/login?reason=session_expired`)

Show Error banner above login card: **"Session expired — please log in again."** (matches CONTEXT D-13). Banner persists until dismissed or successful login.

---

## Copywriting Contract

| Element | Copy |
|---------|------|
| App name | Djosu |
| Login primary CTA | Sign in |
| Register primary CTA | Create account |
| Logout control | Log out |
| Login cross-link | Don't have an account? → Create account |
| Register cross-link | Already have an account? → Sign in |
| Session expired banner | Session expired — please log in again. |
| Generic API error banner | {API message} or fallback: "Something went wrong. Try again or sign in again." |
| Auth loading (login) | Signing in… |
| Auth loading (register) | Creating account… |
| Stub — Deeds heading | My Deeds |
| Stub — Deeds body | Your good deeds list will appear here. Full deed management arrives in the next update. |
| Stub — Friends heading | Friends |
| Stub — Friends body | Add friends by tag and see their deeds here soon. |
| Stub — Settings heading | Settings |
| Stub — Settings body | Profile and account settings will be available here soon. |
| Nav — Deeds | Deeds |
| Nav — Friends | Friends |
| Nav — Settings | Settings |
| Tag field label | Username (tag) |
| Destructive confirmation | N/A in Phase 1 — no destructive actions |

**Forbidden labels:** Submit, OK, Click Here, Save, Cancel (use specific copy above).

---

## Interaction States

| State | Behavior |
|-------|----------|
| Auth submitting | Disable form + primary button; button label → loading copy |
| Auth field error | Red border on input + inline message below field |
| Auth guard loading | Full-page centered `text-zinc-500` "Loading…" while checking token / fetching `/users/me` |
| Active nav | Semibold text + 2px bottom border accent on current route |
| Hamburger open | Icon → close (×); links stacked vertically; tap link closes menu |
| Error banner | Dismiss via ×; re-show on next API error |
| Logout | Text button; no confirmation modal in Phase 1; redirect to `/login` |

---

## Accessibility

- All form fields: associated `<label>` with `htmlFor`
- Primary buttons: min 44×44px touch target
- Hamburger: `aria-label="Open menu"` / `"Close menu"`; nav links in `<nav aria-label="Main">`
- Error banner: `role="alert"` for session expired and global errors
- Focus visible: accent focus ring on all interactive elements
- Color contrast: zinc-900 on white and white on zinc-900 for primary buttons (WCAG AA)

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| — | — | not applicable (no shadcn, no third-party registries) |

---

## CONTEXT.md Compliance

| Decision | UI-SPEC mapping |
|----------|-----------------|
| D-04 Top nav | App shell layout + AppNav component |
| D-05 All nav links + stubs | Nav items + stub copy table |
| D-06 Hamburger mobile | Visual hierarchy + interaction states |
| D-07 @tag + Logout | Header spec, mono tag styling |
| D-08 Separate auth pages | Login/register screen specs |
| D-12 Global error banner | ErrorBanner component + colors |
| D-13 Session expired message | Copywriting + login query param state |
| D-14/D-15 Inline field errors | TextField + form specs |

---

## Checker Sign-Off

- [x] Dimension 1 Copywriting: PASS
- [x] Dimension 2 Visuals: PASS
- [x] Dimension 3 Color: PASS
- [x] Dimension 4 Typography: PASS
- [x] Dimension 5 Spacing: PASS
- [x] Dimension 6 Registry Safety: PASS

**Approval:** approved 2026-06-04
