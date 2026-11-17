

# Minimalist CV ![CI](https://github.com/Defused15/roberto-castillo-terrazas-cv/actions/workflows/GithubActions.yml/badge.svg)

> **Live site:** [rcastillo.dev](https://www.rcastillo.dev/)

A simple web app that renders a minimalist CV with a print-friendly layout.

Built with Next.js and shadcn/ui, deployed on Vercel.

> **Note:** This project is based on the open-source template [cv](https://github.com/BartoszJarocki/cv) by [Bartosz Jarocki](https://github.com/BartoszJarocki). I forked it and extended it with dark mode support and a full testing suite as a portfolio piece to showcase my QA skills.

---

## 📊 Test Reports

| Report | Link |
|--------|------|
| 🧪 Jest Dashboard | [defused15.github.io/roberto-castillo-terrazas-cv/jest-dashboard.html](https://defused15.github.io/roberto-castillo-terrazas-cv/jest-dashboard.html) |

Reports are automatically deployed to GitHub Pages on every push to `main`.

---

## ✨ My Contributions

- 🌙 **Dark mode** — implemented using `next-themes` with a custom toggle component
- 🧪 **Unit tests** — written with Jest and React Testing Library
- 🧬 **Mutation testing** — configured Stryker Mutator to validate test effectiveness
- 📊 **Custom test dashboard** — self-contained HTML report generated from Jest's JSON output and deployed to GitHub Pages
- 🔗 **Project card enhancements** — project titles link to live websites; a separate GitHub icon + label links to each repository
- 🗂️ **QA Test Hub integration** — CV lists the QA Test Hub project (`qa.rcastillo.dev`), an aggregated dashboard that collects test results from multiple repos

---

## Features

- Setup takes only a few minutes with a [single config file](./src/data/resume-data.tsx)
- Built using Next.js 14, React, TypeScript, shadcn/ui, Tailwind CSS
- Auto-generated layout
- Responsive across devices
- Optimized for Next.js and Vercel
- Dark mode support

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

## 🧪 Testing

### Unit Tests — Jest + React Testing Library

Tests cover the main UI components and resume data logic.

| Test Suite | Description |
|---|---|
| `Section.test.tsx` | Verifies section rendering and children |
| `Projectcard.test.tsx` | Validates project card props and rendering |
| `Darkmode.test.tsx` | Checks theme toggle functionality |
| `LanguageProvider.test.tsx` | Tests the language provider and stored language preference |
| `LanguageToggle.test.tsx` | Checks the EN/ES language toggle |
| `ResumeContent.test.tsx` | Verifies the CV renders in the selected language |
| `resume-data.test.tsx` | Validates resume data structure and integrity |
| `resume-data-i18n.test.tsx` | Checks parity between the English and Spanish resume data |

Run tests:

```bash
npm test
```

Run with coverage:

```bash
npm run coverage
```

Generate and open the custom dashboard locally:

```bash
npm run dashboard
```

This runs Jest, generates a self-contained HTML report, and opens it at `http://localhost:4000`.

The suite contains 100+ unit tests. Run `npm run coverage` to see the current coverage figures.

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

The report shows the current mutation score and a per-file breakdown.

---

## CI/CD — GitHub Actions & Jest Report Hub

The project uses two YAML files to automate testing and publish results on every push to `dev` or pull request to `main`.

Live test results are visible on the QA dashboard: **[qa.rcastillo.dev](https://qa.rcastillo.dev)**

The dashboard is powered by a separate **Test Hub** repo (`Defused15/test-hub`) that acts as a data store. After each CI run, the `jest-report-hub` action pushes a `latest.json` file with the Jest results to that repo using the GitHub Contents API. The QA dashboard reads those JSON files and renders the metrics — pass rate, failed tests, and coverage — per project, without requiring any external database or backend.

### Workflow: `GithubActions.yml`

Located at [`.github/workflows/GithubActions.yml`](.github/workflows/GithubActions.yml), this workflow runs three jobs:

| Job | Trigger | Description |
|---|---|---|
| `test` | push to `dev` / `main` / PR to `main` | Runs Jest, pushes the report to the QA Hub, and on `main` also generates the dashboard |
| `deploy-dashboard` | push to `main` only | Publishes the Jest dashboard to GitHub Pages |
| `mutation` | after `test` passes | Runs Stryker and uploads the HTML mutation report as an artifact (retained for 7 days) |

### Reusable Action: `jest-report-hub`

Located at [`.github/actions/jest-report-hub/action.yml`](.github/actions/jest-report-hub/action.yml), this composite action encapsulates all Jest report logic so it can be reused across projects.

**Inputs:**

| Input | Required | Description |
|---|---|---|
| `hub_token` | yes | GitHub token with write access to the hub repo |
| `hub_repo` | yes | Target repo in `owner/repo` format |
| `project_name` | yes | Folder key used to store the report in the hub |

**Steps it runs:**

1. **Export Jest JSON report** — runs `npx jest --json` and writes `jest-report/report.json`
2. **Upload coverage artifact** — uploads the `coverage/` folder as `coverage-report` (retained for 7 days)
3. **Push report to QA Hub** — uses the GitHub Contents API to create or update `projects/<project_name>/latest.json` in the hub repo
4. **Trigger hub build** — sends a `repository_dispatch` event of type `test-hub-trigger` to the hub repo to force a dashboard rebuild
5. **Check test results** — reads the JSON report and fails the job if any tests failed

**Usage example in a workflow:**

```yaml
- name: Jest Report & Push to QA Hub
  uses: ./.github/actions/jest-report-hub
  with:
    hub_token: ${{ secrets.HUB_TOKEN }}
    hub_repo: Defused15/test-hub
    project_name: roberto-castillo-terrazas-cv
```

---

## License

[MIT](https://choosealicense.com/licenses/mit/)
