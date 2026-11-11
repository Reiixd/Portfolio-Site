# Design System

## Direction

Slate and ember: a typographic single page with a dark field at each end (hero and contact) and calm slate sections between. One warm signal color, ember, does all the highlighting. No scroll choreography.

## Color

OKLCH tokens, defined per theme on `:root[data-theme]`.

| Role | Day | Night |
|---|---|---|
| Background | `oklch(0.975 0.004 255)` | `oklch(0.17 0.016 258)` |
| Surface | `oklch(0.945 0.007 255)` | `oklch(0.21 0.018 258)` |
| Ink | `oklch(0.2 0.025 258)` | `oklch(0.95 0.006 255)` |
| Soft ink | `oklch(0.43 0.022 258)` | `oklch(0.74 0.02 255)` |
| Line | `oklch(0.88 0.009 258)` | `oklch(0.31 0.02 258)` |
| Ember accent | `oklch(0.5 0.16 45)` | `oklch(0.79 0.145 58)` |

Hero and contact are full-bleed dark fields: `oklch(0.2 0.03 258)` in day and `oklch(0.115 0.02 258)` in night, with light ink `oklch(0.965 0.006 255)`. Ember (`oklch(0.79 0.145 58)`, the same in both themes) colors the hero statement, the primary button, the status dot, and the contact email underline. Skills sits on the surface tone. In the light sections ember appears only on the wordmark dot, list dashes, project and company lines, link underlines and hover, selection, and focus rings. The theme follows `prefers-color-scheme` until the visitor toggles, then persists in `localStorage` (`portfolio-theme`).

## Typography

- Geist Variable for all text and display. Display weights sit at 560-580 with tracking down to -0.04em.
- Geist Mono Variable only for data: date ranges and technology stacks.
- Display tops out at 6rem. Body measure is 56-62ch.

## Layout

One column inside a 72rem wrap. Sections are a 21rem headline column (large display headings from the content data) plus a 48rem body, separated by hairlines, with one tonal band for Skills, and collapse to a single column under 52rem. No cards. Projects, experience, and skills are rows.

## Motion

Hero name lines rise from a mask on load. Theme changes spread outward from the toggle as a circular reveal (View Transitions, instant fallback). Everything respects `prefers-reduced-motion`. There is no scroll-driven behavior.

## Components

- `Section`: label column plus body, hairline above.
- `text-link`: ink link with an ember underline that draws in, plus an arrow nudge for external links.
- `theme-toggle`: 44px round button, sun or moon icon.
- `quiet-list`: ember dash bullets, soft ink.
