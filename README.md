![cv](https://github.com/BartoszJarocki/cv/assets/1017620/79bdb9fc-0b20-4d2c-aafe-0526ad4a71d2)

# Minimalist CV [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBartoszJarocki%2Fcv) ![CI](https://github.com/Defused15/roberto-castillo-terrazas-cv/actions/workflows/ci.yml/badge.svg)

Simple web app that renders minimalist CV with print-friendly layout.

Built with Next.js and shadcn/ui, deployed on Vercel.

> **Note:** This project is based on the open-source template [cv](https://github.com/BartoszJarocki/cv) by [Bartosz Jarocki](https://github.com/BartoszJarocki). I forked it and extended it with dark mode support and a full testing suite as a portfolio piece to showcase my QA skills.

---

## ✨ My Contributions

- 🌙 **Dark mode** — implemented using `next-themes` with a custom toggle component
- 🧪 **Unit tests** — written with Jest and React Testing Library
- 🧬 **Mutation testing** — configured Stryker Mutator to validate test effectiveness

---

## Features

- Setup only takes a few minutes [single config file](./src/data/resume-data.tsx)
- Built using Next.js 14, React, TypeScript, shadcn/ui, TailwindCSS
- Auto generated layout
- Responsive for different devices
- Optimized for Next.js and Vercel
- Dark mode support
- Docker support

---

## Getting Started Locally

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Defused15/roberto-castillo-terrazas-cv.git
   ```

2. Move to the cloned directory:

   ```bash
   cd roberto-castillo-terrazas-cv
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the local server:

   ```bash
   npm run dev
   ```

5. Open the [config file](./src/data/resume-data.tsx) and make changes.

---

## Run with Docker

Build the container:

```bash
docker compose build
```

Run the container:

```bash
docker compose up -d
```

Stop the container:

```bash
docker compose down
```

---

## 🧪 Testing

### Unit Tests — Jest + React Testing Library

Tests cover the main UI components and resume data logic.

| Test Suite | Description |
|---|---|
| `Section.test.tsx` | Verifies section rendering and children |
| `ProjectCard.test.tsx` | Validates project card props and rendering |
| `CommandMenu.test.tsx` | Tests command menu behavior and navigation |
| `Darkmode.test.tsx` | Checks theme toggle functionality |
| `resume-data.test.tsx` | Validates resume data structure and integrity |

Run tests:

```bash
npm test
```

Run with coverage:

```bash
npm run coverage
```

Latest results:

```
Test Suites: 5 passed, 5 total
Tests:       77 passed, 77 total
Time:        ~2.9s
Line Coverage: 73.86%
```

---

### 🧬 Mutation Testing — Stryker Mutator

Mutation testing goes beyond code coverage — it verifies that your tests actually **catch bugs**, not just execute lines. Stryker introduces small changes (mutations) to the source code and checks whether the tests fail as expected.

Run mutation tests:

```bash
npx stryker run
```

An HTML report is generated at:

```
reports/mutation/mutation.html
```

Latest results:

```
Mutants tested:  53
Killed:          39
Survived:        13
Timed out:        1
Mutation Score:  75.47%
```

| File | Mutation Score |
|---|---|
| `command-menu.tsx` | 73.33% |
| `darkmode.tsx` | 100.00% |
| `project-card.tsx` | 66.67% |
| `utils.ts` | 100.00% |

---

## License

[MIT](https://choosealicense.com/licenses/mit/)