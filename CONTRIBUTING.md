# Contributing

Bug reports, focused fixes, and well-scoped improvements are welcome. Open an
issue before starting a large feature or component rewrite so the direction can
be agreed first.

## Setup

Use Node 24.18.0 from `.nvmrc` and the integrity-pinned npm version declared in
`package.json`.

```sh
nvm use
node scripts/install-corepack.mjs
corepack enable npm
corepack install
npm ci
```

The bootstrap script verifies Corepack against the repository's pinned SHA-512
before installing it. Using the same bootstrap on every Node version avoids
depending on whichever Corepack release a runtime happens to bundle. CI also
verifies the packed package on Node 22 and 26.

The integrity-pinned npm 12.0.2 enforces the project `.npmrc`, which ignores
dependency versions published less than seven days ago during routine
resolution and updates. An `Unknown project config "min-release-age"` warning
means the pinned npm setup above was not completed and the gate is not active.
An integrity-locked `npm ci` remains reproducible and accepts versions already
recorded in the lockfile.

Dependabot bypasses the age gate for security updates. For a manual urgent fix,
add only the affected package to a temporary
`min-release-age-exclude[]=package-name` entry, explain the exception in the
pull request, and remove it once the fixed version is seven days old.

React, React DOM, their type packages, and TypeScript define coordinated
compatibility axes across the root and test fixtures, so routine Dependabot
updates are disabled for them. Update those versions deliberately without
replacing the React 18 or TypeScript 5.5 minimum-version fixtures, and regenerate
both lockfiles together. Keep root `@types/node` on the Node 22 support floor;
routine updates within that major remain automated.

Testing Library patch and minor updates remain automated. Coordinate its major
updates across `@testing-library/react`, `@testing-library/dom`, and
`@testing-library/jest-dom` so their React support and test behavior move
together.

Vite builds the maintained browser fixture that feeds zero-tolerance visual
baselines, and Vitest may resolve its own Vite dependency. Review and update
those packages together, then synchronize the packed consumer's Vite version so
it remains representative of the supported toolchain. Storybook's React-Vite
framework is the fourth participant in this coordinated Vite axis. Update its
exact-pinned packages as one group and verify their Vite peer range before
changing Vite. Playwright Test must match the digest-pinned container and its
browser binaries. Update either set manually and review any affected browser
snapshots.

Storybook dependencies and the example-only YARL integration are grouped
separately by Dependabot because they ship frequently and belong to the same
documentation surface. They remain subject to the seven-day intake gate and the
same moderate-or-higher pull-request dependency review as other development
dependencies. Investigate and update the coordinated group—or wait for an
upstream fix—rather than suppressing that gate.

## Storybook

Run the developer site from the repository root:

```sh
npm run storybook
```

The development server resolves `@picr/react-grid-gallery` to `src/index.ts` for
fast HMR. The static build resolves the same package-root import to
`dist/index.js`, matching the published runtime boundary:

```sh
npm run build-storybook
```

For final local review, build and serve that production output on
`http://127.0.0.1:6007`:

```sh
npm run storybook:preview
```

Use the development server for fast authoring and the static preview for final
review. The latter is the same built-package boundary used by Pages and the
Storybook browser tests.

Keep stories deterministic and self-contained: no remote runtime images, fonts,
scripts, or analytics. Use the accessibility panel as an authoring aid, while
tracking behavior or markup changes in the dedicated accessibility work. The
static build is checked by required CI and the Storybook Playwright project.

`release-it` is part of the publishing authority rather than an ordinary
development dependency. Update it manually after the release-flow dry run and
isolated synchronized-main release smoke test pass; routine Dependabot updates
are disabled without suppressing security updates.

GitHub's repository-level dependency security features are expected to cover
the tracked packed-consumer lockfile. `npm run security:audit` also checks that
independent lockfile explicitly; its routine updates remain part of the manual
coordination process.

## Checks

Use
[Testing And Checks](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/docs/TESTING.md)
to choose fast feedback while editing and understand which boundary each
command protects. Before requesting review, the complete non-browser suite
should pass:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test:types
npm test
npm run test:consumer
npm run package:check
npm run build-storybook
```

Run browser tests in their pinned container:

```sh
npm run test:browser:container
```

Use `npm run test:browser:container:update` only for deliberate, reviewed visual
baseline changes.

The scheduled security workflow runs `npm run security:audit` and fails on high
or critical advisories. Pull requests are checked separately for newly
introduced moderate-or-higher vulnerabilities in runtime and development
dependencies.

## Pull Requests

- Keep changes focused and include regression coverage for behavior changes.
- Use gitmoji-style commit messages and PR titles where practical.
- Do not combine dependency, visual, API, and unrelated cleanup changes.
- Preserve original authorship and credit when porting work from another
  project or contributor.
- Do not commit generated package output or host-generated browser snapshots.

Report suspected vulnerabilities privately through
[GitHub Security Advisories](https://github.com/IsaacInsoll/react-grid-gallery/security/advisories/new),
not a public issue. See
[SECURITY.md](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/SECURITY.md).

Only the maintainer releases this package. See
[docs/RELEASING.md](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/docs/RELEASING.md)
for the publishing controls and process.
