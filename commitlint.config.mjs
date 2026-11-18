/** Conventional Commits, as used across this repo's history. */
const config = {
  extends: ['@commitlint/config-conventional'],
  // Dependabot and GitHub merge commits are not ours to reword.
  ignores: [
    message => message.startsWith('Merge '),
    message => /^Bump .+ from .+ to /m.test(message),
  ],
};

export default config;
