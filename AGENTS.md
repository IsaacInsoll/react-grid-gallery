# Agent Instructions

This repository is the detached, maintained successor to
`benhowell/react-grid-gallery`, published as `@picr/react-grid-gallery`. It
retains the complete inherited Git history.

## Start Here

- Read `MODERNIZATION_PLAN.md` before making project, compatibility, packaging,
  testing, security, or release decisions. It is the authoritative decision
  record.
- Treat GitHub issue drafts as public execution checklists derived from that
  plan, and keep them synchronized when an agreed decision changes.
- Treat the README as consumer documentation, not as the implementation plan.
- Inspect the current repository before proposing or making changes. Prefer its
  established TypeScript and React patterns unless the plan deliberately
  replaces them.

## Durable Project Memory

- Record every agreed project decision in a repository file during the same
  task. Never rely on chat history, local agent memory, or one machine's state.
- The maintainer works across multiple machines, and future agents may have no
  access to earlier conversations.
- Update `MODERNIZATION_PLAN.md` for technical or release decisions and update
  affected issue drafts at the same time.
- If documents disagree, stop and reconcile them using
  `MODERNIZATION_PLAN.md` as the authority rather than silently choosing one.

## Working Style

- Keep changes focused on the current checklist item. Do not mix unrelated API,
  visual, dependency, example, or accessibility changes into modernization
  work.
- Prefer small, reviewable commits and pull requests. Follow the agreed work
  order unless a dependency or newly recorded decision requires a change.
- Use gitmoji-style commit messages and PR titles where practical.
- Merge pull requests with rebase-and-merge, preserving their individual commit
  boundaries without adding merge commits or squashing. The GitHub repository
  is configured to allow only rebase merging. When asked to merge a PR, use
  `gh pr merge <number> --rebase`; add `--auto` when required checks are still
  running. Do not select merge-commit or squash modes.
- Do not push ordinary development work directly to `main`. The sole
  administrator-bypass exception is the release-it-generated version commit and
  annotated tag created by the process in `docs/RELEASING.md` after its complete
  local checks pass. Never use that bypass as a shortcut for other changes.
- Preserve an understandable history for attribution, migrations, and one-time
  mechanical changes. Do not squash commits that the plan says must remain
  identifiable.
- Remove obsolete files and dependencies only when their replacement has been
  accepted or their purpose has been deliberately retired.
- Do not commit temporary review or agent-to-agent communication files unless
  the maintainer explicitly promotes them into project documentation.

## Attribution And Licensing

- Preserve the MIT license, Ben Howell's original copyright and authorship, and
  the existing upstream acknowledgements and history.
- Never rebase, squash, filter, or otherwise rewrite commits predating the fork.
  Only an explicitly documented legal or credential-exposure emergency can
  justify changing inherited history.
- Describe this project as a maintained fork. Do not imply endorsement,
  permission, or transfer of the original package unless it is explicitly
  granted and recorded.
- Credit PICR and individual contributors for work derived from PICR or other
  third-party sources. Preserve git authorship where practical.
- Confirm license compatibility or obtain explicit relicensing permission
  before copying or cherry-picking third-party code. The plan records any
  contribution-specific requirements.
- Do not erase attribution while rewriting docs, package metadata, changelogs,
  examples, or tests.

## Security

- Intentionally favor strong repository and npm supply-chain security, even
  when it adds reasonable setup or review overhead.
- Do not weaken provenance, trusted publishing, release approval, workflow
  pinning, least-privilege permissions, dependency review, or account security
  without recording the reason in the plan.
- Never commit credentials or introduce long-lived publishing secrets when the
  planned short-lived or identity-based mechanism can be used.
- Local release-it must not receive a GitHub token or create a GitHub Release.
  The tag workflow owns GitHub Release creation with scoped, short-lived
  permissions after npm publishing or staging succeeds.
- Route vulnerability reports through the documented private security process,
  not a public issue.
- Treat `.github/workflows/release.yml` as the permanent npm trusted-publishing
  workflow path. Coordinate and verify the npm binding before any rename.

## Quality Bar

- Run the checks applicable to the current migration stage and report exactly
  which checks were run. Do not claim success for checks that were skipped.
- Before committing any repository change, run `npm run release:check` unless
  the maintainer explicitly asks for a narrower check; if it is skipped, record
  the reason in the final handoff.
- Test package behavior through the packed artifact where exports, declarations,
  peer dependencies, or published contents are involved. Source-only tests are
  not sufficient for packaging changes.
- Preserve the supported public component API unless a breaking change is
  explicitly decided and documented.
- Keep package-root runtime and type exports intentional. Do not introduce
  undocumented deep-import contracts.
- Add focused regression coverage for behavior fixes and review visual changes
  as intentional diffs in the reproducible environment defined by the plan.
- `npm run test:types` is the authoritative generated-declaration compatibility
  check. It compiles one canonical consumer across exact TypeScript 5.5.4,
  6.0.2, and 7.0.2; React 18 and 19 types; and bundler and NodeNext resolution.
  Keep `skipLibCheck` disabled in these fixtures.
- The type runner temporarily creates a package-shaped `node_modules` tree
  beside each React fixture using the real package manifest and built outputs.
  This makes Bundler and NodeNext exercise the real export map while React
  imports resolve as installed consumers would. The runner cleans before and
  after execution, and `.type-package/` must remain ignored by Git, Prettier,
  and ESLint. Do not point this check at source or replace it with the normal
  repository typecheck.
- Keep alternate TypeScript compilers isolated in fixture workspaces. Root
  source/test typechecking must invoke the selected root TypeScript 6 compiler
  explicitly so workspace binary-name collisions cannot change the compiler.
- Keep ESLint and Prettier responsibilities separate. Run `npm run lint` for
  typed correctness/framework checks and `npm run format:check` for formatting;
  both reject CI changes independently.
- When tests import local ESM utility scripts from `scripts/*.mjs`, add or
  update the matching `scripts/*.d.mts` declaration file in the same change.
  Verify those imports with `npm run typecheck` and `npm run lint`; a focused
  Vitest run alone is not enough because it does not check declaration
  resolution or typed ESLint rules.
- The inherited Nextra/Create React App examples and Parcel playground were
  deliberately removed during first-release cleanup. Keep maintained browser
  fixtures under `test/fixtures/`; a future Storybook site is tracked
  separately and must not restore the obsolete toolchains.
- Before release work is considered complete, satisfy every current release
  gate and acceptance criterion in `MODERNIZATION_PLAN.md`.

## Package Build

- The package is ESM-only. Its only runtime entry is `dist/index.js`, its only
  declaration entry is `dist/index.d.ts`, and package-root imports are the
  supported API. Do not restore CommonJS, UMD, browser-script, or deep-import
  entrypoints.
- Build with exact-pinned `tsdown@0.22.14`, an explicit ES2020 browser target,
  React runtime entrypoints externalized, and the stable TypeScript declaration
  generator. Keep package exports manually owned in `package.json`.
- JavaScript and declaration source maps are intentionally disabled for the
  first release. This tsdown version couples JavaScript source maps to a
  declaration-map footer but does not emit the referenced declaration map when
  source is excluded from the package. Do not patch generated output; reassess
  maps when the tool can emit both artifacts cleanly.
- `npm run package:check` builds once, creates one temporary tarball without
  rerunning lifecycle scripts, then runs strict `publint` and ATTW's ESM-only
  profile against that same tarball. Keep this check in CI.
- `skipLibCheck` remains enabled because tsdown's own declarations reference
  uninstalled optional peers such as Volar, tsdown CSS/executable plugins, and
  Vite devtools. Project source, tests, fixtures, and configuration are still
  strictly typechecked. Do not install unused optional toolchains merely to
  remove this setting.
