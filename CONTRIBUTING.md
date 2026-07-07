# Contributing to Clara

Thanks for your interest! Clara is an early-stage, work-in-progress project that
started as a hackathon build, so there's plenty to improve and no shortage of rough
edges. Contributions of all sizes are welcome — bug reports, docs, and code.

## Ground rules

- **It's a work in progress.** Expect incomplete features and things that may change.
  If something is unclear or broken, opening an issue is a genuinely useful contribution.
- **Never commit secrets.** Keys go in `.env.local` (gitignored). Use `.env.example`
  as the template. Double-check your diffs before pushing.
- **Keep changes focused.** Small, single-purpose pull requests are easier to review.

## Getting started

1. Fork and clone the repo.
2. Follow the [Quickstart in the README](README.md#quickstart) to get it running locally.
3. Create a branch: `git checkout -b my-change`.

## Before you open a pull request

- Run the linter: `npm run lint`
- Run the tests: `npx playwright test`
- Describe **what** you changed and **why** in the PR.

## Good first areas

- Support for more letter categories and languages
- Accessibility improvements (this app is for older adults — clarity and readability matter)
- Making the database layer pluggable (see the "Connect a database" section of the README)

Questions or ideas? Open an issue. Thank you for helping make everyday mail less scary.
