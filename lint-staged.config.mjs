/** Pre-commit: format staged files, then lint-fix the JS/TS ones. */
const config = {
  '*.{js,jsx,mjs,cjs,ts,tsx}': ['prettier --write', 'eslint --fix'],
  '*.{json,md,yml,yaml,css,html}': ['prettier --write --ignore-unknown'],
};

export default config;
