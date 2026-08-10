# Testing And Checks

This guide is for contributors changing the repository. If you are installing
the package in an application, use the
[Storybook consumer guides](https://isaacinsoll.github.io/react-grid-gallery/)
instead.

The checks intentionally overlap at their boundaries. A source test can prove a
layout calculation, but only the packed-consumer checks can prove that the
published exports and declarations work after installation.

## Fast Feedback While Editing

| Command                   | What it catches                                                   | Run it when                                       |
| ------------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| `npm run test:unit:watch` | Component behavior and layout-helper regressions                  | Iterating on source behavior                      |
| `npm run format:check`    | Files that do not match the repository's Prettier format          | Editing any tracked text or code                  |
| `npm run lint`            | Typed correctness, React rules, Storybook rules, and unsafe code  | Editing TypeScript, React, configuration, stories |
| `npm run typecheck`       | Source, tests, fixtures, configuration, and Storybook type errors | Changing TypeScript or public component usage     |
| `npm test`                | The complete deterministic Vitest unit/component suite            | Before review after source or test changes        |

Use these commands independently while working; a fast failing check is easier
to diagnose than waiting for the complete release chain.

## Published-Package Boundaries

| Command                   | Boundary it verifies                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run test:types`      | Generated declarations across TypeScript 5.5, 6, and 7; React 18 and 19; Bundler and NodeNext resolution |
| `npm run test:consumer`   | One packed tarball installed and executed by a real Vite consumer                                        |
| `npm run package:check`   | Exact tarball contents, package exports, ESM shape, publint, and ATTW                                    |
| `npm run build-storybook` | The static documentation site using the built `dist` package boundary                                    |

These checks build the package deliberately. Do not replace them with a source
alias or a repository-only typecheck: that would stop exercising what npm users
actually install.

Use `npm run storybook:preview` when you want to inspect that production build
locally on `http://127.0.0.1:6007`. The ordinary `npm run storybook` development
server instead resolves the package to source for HMR. The command and port make
the boundary explicit without adding maintainer-only status to consumer-facing
pages.

## Browser And Visual Coverage

Run the browser projects in their digest-pinned Playwright container:

```sh
npm run test:browser:container
```

This covers the built React 18 and React 19 fixtures, hydration, native link and
selection behavior, responsive layout, the static Storybook site, and
zero-tolerance Linux Chromium screenshots.

Use the update command only when a visual change is deliberate and ready for
human review:

```sh
npm run test:browser:container:update
```

Never commit host-generated screenshots in place of the container baselines.

## Before Requesting Review

Run the complete non-browser sequence documented in `CONTRIBUTING.md`, then run
the browser container whenever behavior, layout, styles, stories, or screenshots
can change. Documentation-only edits still need formatting, linting, typechecking,
and a static Storybook build.

## Security And Releases

`npm run security:audit` checks both the root lockfile and the independently
installed packed consumer for high or critical advisories. CI also performs
dependency review for newly introduced moderate-or-higher vulnerabilities.

`npm run release:check` is the maintainer's complete release gate. It chains
formatting, linting, source and declaration checks, unit tests, packed-consumer
and package checks, Storybook, browser screenshots, and security auditing. It is
not a shortcut for choosing relevant checks during development, and it does not
publish anything.
