# Who Am I

Retro desktop-style portfolio built with Angular standalone components.

## Features

- Draggable desktop windows (`About Me`, `Projects`)
- Taskbar with Start button and clock
- Minimize/restore window behavior
- Open/close window animations
- Responsive mobile layout
- i18n with English and Portuguese
- CV download button

## Tech Stack

- Angular 21 (standalone APIs)
- SCSS
- `@ngx-translate/core` for translations

## Project Structure

- `src/app/app.*`: desktop shell, taskbar, start menu, window lifecycle
- `src/app/services/window-manager.ts`: centralized window state
- `src/app/components/about-me/*`: profile window
- `src/app/components/projects/*`: projects window
- `src/app/directives/draggable.ts`: drag behavior
- `src/app/i18n/en.ts` / `src/app/i18n/pt.ts`: translations

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install

```bash
npm install
```

### Run locally

```bash
npm start
```

App runs at `http://localhost:4200`.

## Scripts

- `npm start`: start dev server
- `npm run build`: production build in `dist/`
- `npm run watch`: build in watch mode
- `npm test`: run unit tests

## Build

```bash
npm run build
```

Output is generated in `dist/who-am-i/`.

## Localization

- Default language: English (`en`)
- Portuguese available: `pt`
- Language switch is inside the Start menu.

## Assets

Static assets are served from `public/` (icons, project images, CV).
