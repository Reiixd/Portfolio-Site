# Design System

## Direction

An intense, premium-minimal cyber-nocturne. The site behaves as one continuous digital workspace that expands into a city of connected systems. Graphic-novel illustration grounds the human story while code-native route lines preserve precision and interactivity.

## Color

- Canvas: `oklch(0.10 0 0)`
- Surface: `oklch(0.16 0.012 210)`
- Ink: `oklch(0.94 0.01 210)`
- Muted ink: `oklch(0.72 0.03 210)`
- Primary blue steel: `oklch(0.58 0.09 210)`
- Signal yellow: `oklch(0.89 0.19 108)`
- Signal ink: `oklch(0.10 0 0)`

The strategy is committed. Blue steel carries the architecture, signal yellow is reserved for the active waypoint, focus, and primary contact action.

## Typography

- Display: Saira Condensed, 600 and 700.
- Text: Spline Sans, 400, 500, and 600.
- Display tracking never exceeds `-0.035em`.
- Body measure stays between 45 and 68 characters.

## Layout

One fixed world stage and one document-flow spacer. Copy appears at waypoints over an asymmetric twelve-column composition. A fixed route map is right-aligned on desktop and becomes a bottom navigation rail on narrow or coarse-pointer layouts.

## Motion

Scroll is the timeline. A canvas city advances continuously, the illustrated engineer recedes as systems expand, and discovered nodes remain in the experience constellation. Motion uses transforms, opacity, and canvas drawing. Reduced motion removes spatial travel while preserving every content waypoint.

## Components

- `WorldCanvas`: code-native city, route, and constellation renderer.
- `RouteMap`: accessible waypoint navigation and progress state.
- `WorldCopy`: semantic, windowed content anchored over the fixed stage.
- `ContactAction`: persistent “Contact me” naming and a mail action at the resolved ending.
