import {defineConfig, globalIgnores} from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';

export default defineConfig([
  // Next.js recommended + Core Web Vitals rules (React, hooks, a11y, import, @next/next).
  ...nextVitals,
  {
    rules: {
      // New in eslint-plugin-react-hooks 7 (React Compiler rules), not part of the
      // previous config. The language provider reads localStorage after hydration on
      // purpose (static HTML must match the server render), so this is a warning.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
  // Last: turns off stylistic rules that would fight Prettier.
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'reports/**',
    'jest-report/**',
    '.stryker-tmp/**',
    'node_modules/**',
    'next-env.d.ts',
  ]),
]);
