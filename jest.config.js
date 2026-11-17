/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jest-environment-jsdom",

  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  // Spies and mocks never leak between tests.
  restoreMocks: true,

  testMatch: [
    "**/__tests__/**/*.ts",
    "**/__tests__/**/*.tsx",
    "**/*.test.ts",
    "**/*.test.tsx",
  ],

  testPathIgnorePatterns: [
    "/node_modules/",
    ...(process.env.STRYKER_MUTATOR_WORKER ? [] : ["/.stryker-tmp/"]),
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(png|jpg|jpeg|gif|svg|webp)$": "<rootDir>/__mocks__/fileMock.js",
  },

  transform: {
    "^.+\\.(ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },

  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],

  // Coverage measures our own code: shadcn/ui primitives, icon SVGs, the
  // next-themes wrapper and test helpers are excluded, and so are the files
  // that only run inside Next.js (root layout, OG image), which the build checks.
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/__tests__/**",
    "!src/**/*.d.ts",
    "!src/test/**",
    "!src/components/ui/{badge,button,card,dropdown-menu}.tsx",
    "!src/components/icons/**",
    "!src/components/theme-provider.tsx",
    "!src/app/layout.tsx",
    "!src/app/opengraph-image.tsx",
  ],

  // A few points under the measured figures (100 / 97.8 / 98 / 100), so a
  // real drop fails CI without making every refactor fight the gate.
  coverageThreshold: {
    global: { statements: 97, branches: 95, functions: 95, lines: 97 },
  },
};