# Roberto Castillo Terrazas · rcastillo.dev

Bilingual (EN/ES) CV site for a QA Engineer, built with Next.js and treated like a product under test: behaviour tests, accessibility checks, mutation testing and CI quality gates on every change.

[![CI](https://github.com/Defused15/roberto-castillo-terrazas-cv/actions/workflows/GithubActions.yml/badge.svg)](https://github.com/Defused15/roberto-castillo-terrazas-cv/actions/workflows/GithubActions.yml)
![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React 19](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6?logo=typescript&logoColor=white)
![Node 22+](https://img.shields.io/badge/Node-%3E%3D22-5fa04e?logo=nodedotjs&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Live links

| What                    | Where                                                                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CV site                 | [www.rcastillo.dev](https://www.rcastillo.dev)                                                                                                             |
| Jest test dashboard     | [defused15.github.io/roberto-castillo-terrazas-cv](https://defused15.github.io/roberto-castillo-terrazas-cv/)                                              |
| Stryker mutation report | [defused15.github.io/roberto-castillo-terrazas-cv/mutation/mutation.html](https://defused15.github.io/roberto-castillo-terrazas-cv/mutation/mutation.html) |
| QA Test Hub             | [qa.rcastillo.dev](https://qa.rcastillo.dev)                                                                                                               |

## Highlights

Built on top of [Bartosz Jarocki's minimalist CV template](https://github.com/BartoszJarocki/cv):

- **EN/ES i18n.** Two typed data files with the same shape and a language toggle whose choice is remembered in `localStorage`. On a first visit, a browser set to Spanish gets the Spanish CV. The `<html lang>` attribute follows the selected language.
- **SEO.** Site metadata, `robots.txt`, `sitemap.xml`, a web manifest, a generated Open Graph / Twitter card, and a schema.org `ProfilePage` + `Person` JSON-LD block.
- **Accessibility.** `jest-axe` checks on the CV (both languages, light and dark, phones revealed, after a copy), the theme toggle button, the privacy page and the 404 page. WCAG fixes include a skip link, named landmarks, accessible names on contact links, contrast and visible focus rings.
- **Behaviour and data-contract tests.** 430+ Jest tests. Expected text comes from the resume data, so content edits don't need test edits, while a contract suite validates both data files.
- **Mutation testing** with Stryker on the logic-bearing modules, with a break threshold in CI.
- **CI quality gates.** Lint, type check, tests with coverage thresholds, production build, commit lint and mutation score, all on GitHub Actions.
- **Cookieless EU analytics** with PostHog, plus a GDPR privacy notice at [`/privacy`](https://www.rcastillo.dev/privacy) in both languages.
- **Security headers.** Content Security Policy, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` on every route; no `X-Powered-By`.
- **Phone numbers kept out of the HTML.** They are stored encoded and only decoded in the browser after a click on "Show phone numbers" (or when printing). A test asserts the server HTML and JSON-LD contain no phone number.
- **Copy to clipboard** for the email and phone numbers, with an in-place, screen-reader-announced confirmation.
- **Custom 404 and error pages**, bilingual, including a self-contained global error page.
- **Dates computed at build time.** Jobs show their month range and duration ("Jan 2023 – Mar 2025 · 2 yrs 3 mos"), and the "4+ years" claim in the summary, meta description and share card is derived from the oldest job's start. A weekly scheduled redeploy keeps them current.
- **Save contact.** A "Save contact" link downloads a vCard from the static [`/contact.vcf`](https://www.rcastillo.dev/contact.vcf) route.
- **Print-ready.** A print button in the header, a print layout with the email and phone numbers as text, and a QR code to the live site next to the photo (encoded on the server by a small built-in QR encoder, so it adds no client JS).
- **Dark mode** with a toggle button that cycles light, dark and system.

## Quality gates

| Gate            | Tool                              | Threshold                                                       | Where it runs                                        |
| --------------- | --------------------------------- | --------------------------------------------------------------- | ---------------------------------------------------- |
| Lint            | ESLint (`eslint-config-next`)     | Zero errors                                                     | Pre-commit (staged files), CI `Unit Tests`           |
| Formatting      | Prettier                          | Staged files are formatted                                      | Pre-commit                                           |
| Types           | TypeScript `tsc --noEmit`         | Zero errors                                                     | CI `Unit Tests`, and again in `next build`           |
| Unit tests      | Jest + React Testing Library      | All tests pass; any `console.error`/`console.warn` fails a test | CI `Unit Tests` (required check on `main`)           |
| Coverage        | Jest coverage                     | Statements 97%, lines 97%, branches 90%, functions 90%          | CI `Unit Tests`                                      |
| Accessibility   | `jest-axe` (axe-core)             | Zero violations                                                 | CI `Unit Tests`                                      |
| Mutation score  | Stryker Mutator                   | Break below 90% (high 95%)                                      | CI `Mutation Testing`                                |
| Build           | `next build`                      | Every route compiles and prerenders                             | CI `Build`                                           |
| Commit messages | commitlint (Conventional Commits) | Every commit message passes                                     | `commit-msg` hook, CI `Commit Lint` on pull requests |
| Dependencies    | Dependabot                        | Weekly update PRs, which go through the gates above             | npm and GitHub Actions, every Monday                 |

Thresholds live in [`jest.config.js`](./jest.config.js) and [`stryker.config.json`](./stryker.config.json).

## Architecture

The CV content is data, the UI is a set of client components that read it through a language context, and every route is prerendered to static HTML at build time.

```
src/
├── app/                 # Routes: /, /privacy, /contact.vcf, 404, error, global
│                        # error, OG/Twitter image, robots, sitemap, manifest, JSON-LD
├── components/          # CV sections, language and theme toggles, contact
│   │                    # copy/reveal, print button and QR, privacy, 404/error
│   └── ui/              # shadcn/ui primitives and the Section landmark
├── data/
│   ├── resume-data.en.tsx
│   ├── resume-data.es.tsx
│   └── resume-data.types.ts   # Shared ResumeData type
├── lib/
│   ├── analytics/       # PostHog config, typed events, lazy init
│   ├── dates.ts         # Month ranges, durations, years of experience
│   ├── initial-lang.ts  # First-visit language from the browser
│   ├── qr.ts            # Minimal QR encoder for the printed CV
│   ├── vcard.ts         # vCard for /contact.vcf
│   ├── decode-phone.ts
│   └── format-phone.ts
├── test/                # renderWithProviders, preconfigured axe, helpers
└── __tests__/           # Test suites, mirroring src/
```

- **Data.** `resume-data.en.tsx` and `resume-data.es.tsx` share the `ResumeData` type, so the compiler and the contract tests keep the two languages in sync.
- **Language provider.** `LanguageProvider` holds the current language and exposes the matching data. The server and first client render are English; after hydration it applies the stored choice or, on a first visit, Spanish for a Spanish browser.
- **Build date.** The page passes the build month to the CV as a prop, so durations and the years claim are fixed at build time and the hydrated page matches the server HTML.
- **Theme.** `next-themes` with light, dark and system, switched by one toggle button.
- **Analytics.** `src/lib/analytics` wraps PostHog with a typed event map. It loads lazily and only on the production hostnames.
- **Output.** Statically prerendered pages, deployed on Vercel.

## Privacy by design

- **No cookies.** The site sets none. The browser only keeps the chosen language and theme in `localStorage`.
- **PostHog in the EU.** Hosted in PostHog's EU cloud, in cookieless mode, with no person profiles, no autocapture, no session recording and Do Not Track respected. It only runs on the production domain.
- **Explicit events only.** Pageviews, page leaves and a typed list of interaction events. Phone events carry the country, never the number.
- **Vercel Web Analytics** for aggregate, cookieless visit counts.
- **No Google Analytics.** A test checks the root layout for it.
- **Self-hosted assets.** The Inter font is served by `next/font` from the site's own origin, and the avatar is a local file. The CSP only allows fonts and images from `'self'`.
- **Privacy notice** in English and Spanish at [rcastillo.dev/privacy](https://www.rcastillo.dev/privacy).

## Getting started

Requires Node.js 22 or newer.

```bash
git clone https://github.com/Defused15/roberto-castillo-terrazas-cv.git
cd roberto-castillo-terrazas-cv
npm ci                # also installs the Git hooks (lint-staged, commitlint)
npm run dev           # http://localhost:3000
```

| Command             | What it does                                                               |
| ------------------- | -------------------------------------------------------------------------- |
| `npm test`          | Run the Jest suite                                                         |
| `npm run coverage`  | Run Jest with coverage and the thresholds                                  |
| `npx stryker run`   | Mutation testing; HTML report in `reports/mutation/mutation.html`          |
| `npm run lint`      | ESLint                                                                     |
| `npm run format`    | Prettier, write mode (`npm run format:check` to check only)                |
| `npm run build`     | Production build                                                           |
| `npm run dashboard` | Run Jest, build the HTML dashboard and serve it at `http://localhost:4000` |

To use it as your own CV, edit the data files in [`src/data/`](./src/data/).

## CI/CD

The workflow is [`.github/workflows/GithubActions.yml`](.github/workflows/GithubActions.yml). It runs on pull requests to `main`, on pushes to `main`, weekly on Monday and on manual dispatch. Third-party actions are pinned by commit SHA.

| Job                                | When                                                      | What it does                                                                                                              |
| ---------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `Unit Tests`                       | Every run                                                 | Lint, type check, Jest with coverage and a JSON report; uploads coverage and report artifacts. Required check for `main`. |
| `Commit Lint`                      | Pull requests                                             | commitlint over every commit in the PR                                                                                    |
| `Build`                            | Pull requests, pushes, manual runs                        | `next build` with a cached `.next/cache`                                                                                  |
| `Mutation Testing`                 | Every run                                                 | Stryker in incremental mode; a full run on the weekly schedule or on request. Uploads the HTML report.                    |
| `Publish to QA Hub`                | Pushes to `main` and the weekly run                       | Sends the Jest JSON report to the QA Test Hub, passing or failing                                                         |
| `Weekly Vercel Redeploy`           | Weekly run, once tests pass                               | POSTs to the Vercel deploy hook in the `VERCEL_DEPLOY_HOOK` secret so build-time dates stay current; skipped if unset     |
| `Deploy Dashboard to GitHub Pages` | Pushes to `main`, weekly and manual runs, once tests pass | Publishes the Jest dashboard and the latest mutation report to GitHub Pages                                               |

Two composite actions live in [`.github/actions/`](.github/actions/):

- **`setup-deps`** installs Node and restores `node_modules` from a cache keyed on the OS, Node version and lockfile.
- **`jest-report-hub`** pushes the report to `projects/<project>/latest.json` in the [Test Hub](https://qa.rcastillo.dev) data repo through the GitHub Contents API, retrying on conflicts, then dispatches a hub rebuild. The hub renders pass rate, failures and coverage per project.

GitHub Pages serves the Jest dashboard at the site root and the Stryker report under `/mutation/`.

## Credits and license

Based on the open-source [cv](https://github.com/BartoszJarocki/cv) template by [Bartosz Jarocki](https://github.com/BartoszJarocki).

Released under the [MIT License](./LICENSE). Copyright (c) 2023 Bartosz Jarocki, Copyright (c) 2026 Roberto Castillo.
