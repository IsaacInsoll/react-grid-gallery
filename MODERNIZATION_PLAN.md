# Modernization Plan

This plan records the first `@picr/react-grid-gallery` release, published on
2026-08-07. The maintained, ESM-only successor preserves the original component
API for modern React projects. Migration requires a new package name and the
documented ESM, React, Node, TypeScript, and browser baselines.

## Scope for First Release

- Publish under `@picr/react-grid-gallery`.
- Preserve original project credit and MIT license.
- Fix package exports for modern bundlers.
- Move to ESM-only package output.
- Upgrade the development compiler to TypeScript 6.0.2, enable strict mode,
  and generate and expose complete TypeScript declarations.
- Define and compile-test the preserved component API contract.
- Validate the packed package with `publint` and Are the Types Wrong.
- Define browser support and verify SSR hydration.
- Completed 2026-07-29: migrate tests to Vitest and Playwright before `1.0.0`.
- Preserve PICR's linked gallery tile behavior in a focused PR.
- Port PICR's merged row justification fix from PR #73.
- Defer PICR PR #82 masonry layout work until after the first stable fork
  release.

## Tracking

The repository left GitHub's fork network on 2026-07-29 and is now standalone.
The operation preserved the complete inherited Git history. Do not add fork
detachment as an execution step.

Create a GitHub issue from this plan and use the issue as the public working
tracker. Keep this file as the durable repo-local source of the agreed release
direction.

Recommended issue title:

```text
Prepare @picr/react-grid-gallery first npm release
```

The default branch was renamed from `master` to `main` on 2026-07-29. Local and
remote tracking now use `main`.

Recommended PR split:

0. Completed 2026-07-29: rename `master` to `main`.
1. Completed 2026-07-29: `💄 add prettier and format repository`
2. Completed 2026-07-29: `✅ add baseline ci checks`
3. Completed 2026-08-01: `📝 document maintained fork and project policies`
   (PR #9, merge `e9268fd`)
4. Completed 2026-07-29: `⬆️ upgrade typescript and enable strict typechecking`
   (implementation `55eecab`, merge `6de880e`)
5. Completed 2026-07-29: `✅ replace jest with vitest` (implementation
   `fd65765`, cleanup `31b69af`, merge `0157487`)
6. Completed 2026-07-29: `🎭 replace puppeteer with playwright`
   (implementation `36600f1`, merge `0e64f1e` through PR #4)
7. Completed 2026-07-29: `📦 replace legacy build and publish esm-only exports`
   (implementation `704bebd` with follow-up commits through `0dd1ace`, merged
   through PR #5)
8. Completed 2026-07-29: `✨ add eslint and enforce linting`
   (implementation `73d042f`, review corrections `74f14f1`, merged through PR
   #6 with hosted baseline and browser CI passing)
9. Completed 2026-07-29: `🏷️ verify public type surface`
   (implementation `0fc844b`, review hardening `3bd48dd`, merged through PR #7
   with hosted baseline and browser CI passing)
10. Completed 2026-07-30: `✅ add packed-package consumer smoke tests`
    (implementation `d5854f6`, deterministic install fixes `607265a` and
    `b03d4b7`, review hardening `0e6bad3`, exact fixture npm pin `004efe8`, and
    shared-configuration enforcement `5fb172a`; merged through PR #8 with
    hosted baseline and browser CI passing)
11. Completed 2026-08-01: `🧹 remove stale repository artifacts`
    (implementation `708ce88`, replayed as `e9268fd` through PR #9 with hosted
    baseline and browser CI passing)
12. Completed 2026-08-01: `⬆️ update remaining dependencies`
    (implementation `5ebb3a7` and Corepack/runtime-matrix hardening `b6b4dd3`;
    PR #10 was accidentally merged into its already-merged stacked base, so the
    byte-identical reviewed tree was replayed as `611c6f6` and `18f9dd0`
    through PR #11; hosted Node 22/24/26 baseline and browser CI passed)
13. Completed 2026-08-01: `🔍 audit current PICR vendored source differences`
    (compared all eight TypeScript modules against PICR `origin/master` commit
    `9a08a06e`; findings are recorded in Phase 4)
14. Completed 2026-08-01: `🏷️ correct style callback item types`
    (implementation `1e0348d`, rebase-merged through PR #12 as `612d121`; hosted
    baseline and browser CI passed)
15. Completed 2026-08-02: `✨ preserve PICR linked gallery tiles`
    (implementation `493702b`, rebase-merged through PR #13 as `bd20007`, with
    hosted baseline, browser, Node 22, and Node 26 CI passing)
16. Completed 2026-08-03: `🐛 port PICR row justification fix`
    (rebase-merged through PR #14 as Olli-authored implementation `e5d3917`,
    verification and hardening `8a9b72e`, popup test correction `15680e5`, and
    migration clarification `061f844`; hosted baseline, browser, Node 22, and
    Node 26 CI passed)
17. Completed 2026-08-03: `🔒 harden repository and supply-chain security`
    (rebase-merged through PR #16 as security controls and release-process
    documentation `929ec29`, browser-policy clarification `94ca72f`, and review
    corrections `ec2204a`; all hosted checks passed and dependency review is
    required on `main`)
18. Completed 2026-08-05: `🚀 configure release-it`
    (rebase-merged through PR #22 as `0cf3189`; all hosted checks passed)
19. Completed 2026-08-05: `🚀 add trusted npm publishing workflow`
    (release workflow `887a597`, environment guide `3987b5d`, and public
    provenance-bearing bootstrap prerelease `f7ae94b`; the permanent workflow
    is stage-only and completed its first OIDC execution for stable `1.0.0`)
20. Completed 2026-08-07: `🚀 prepare first npm release` (release commit
    `0c90ca4`, annotated tag `v1.0.0`, successful release workflow
    [#31140176256](https://github.com/IsaacInsoll/react-grid-gallery/actions/runs/31140176256),
    and provenance-bearing npm publication)

This numbered PR list is the execution order. The phase sections below group
related decisions and acceptance criteria; their headings do not override the
PR sequence.

On 2026-07-30, repository cleanup and remaining dependency updates were moved
ahead of the PICR PR #73 behavior change. This keeps mechanical repository and
tooling noise out of the layout-fix review. PR #73 remains required before the
first stable release; it is reordered, not deferred past `1.0.0`.

The first release should stay conservative. Its value is: the maintained
library API, modern packaging, accurate TypeScript, and the reviewed PICR
linked-tile and PR #73 layout behavior.

Use gitmoji-style commit messages and PR titles for this work where practical.
Direct commits are acceptable during bootstrap. Once CI/release automation
exists, use pull requests for ordinary package output and security-sensitive
changes. The only planned administrator-bypass exception is the generated
release-it version commit and annotated tag after the complete local release
gates pass.

Prettier 3.9.6 was added and the initial repository-wide format was committed as
`2cb5fcaba2380278b2d23f7df591353d9061f1f6`. Its stable SHA was added to
`.git-blame-ignore-revs` in the following commit,
`c693951957509cdfda04c482e0dbdcae448df68d`. Do not squash away or rewrite the
recorded formatting commit. This clone is configured with
`blame.ignoreRevsFile=.git-blame-ignore-revs`; document that one-time local Git
configuration for other clones and require `npm run format:check` in CI once CI
is available.

Never rebase, squash, filter, or otherwise rewrite inherited commits predating
the fork. All modernization work must be appended to the preserved upstream
history. Only an explicitly documented legal or credential-exposure emergency
can justify changing inherited history.

Merge fork pull requests with GitHub's rebase-and-merge method so their
individual commits are replayed onto `main` without a merge commit or squash.
The repository was configured on 2026-07-29 to allow only rebase merging; use
`gh pr merge <number> --rebase` when an agent performs the merge. This policy
applies to new fork work and does not permit rewriting commits inherited from
upstream or force-pushing shared branches.

Baseline CI was added in
[`4598145affe51a17ba7236fc04a70d868e4b584d`](https://github.com/IsaacInsoll/react-grid-gallery/commit/4598145affe51a17ba7236fc04a70d868e4b584d)
through PR #1 and merged as
`af31b0863a1eac32e903927f6cee1539067c40e4`. It initially used exact Node
24.13.0 from `.nvmrc` and ran a clean install, formatting check, and the
inherited build. The development and baseline CI runtime was later updated to
Node 24.18.0, the latest Node 24 LTS patch available when npm 12 was adopted.
Vitest and Playwright replacements have since added typechecking, unit tests,
browser tests, and packed-artifact validation to CI. Add the Node 22/24/26
compatibility matrix in the PR that makes that check valid. Every workflow
must use full-SHA-pinned actions and least-privilege permissions from its first
commit.

Remove obsolete dependencies in the PR that replaces their tooling: legacy
Rollup/Babel/build dependencies with the ESM build, Jest unit/jsdom dependencies
with Vitest, and the remaining Jest/Puppeteer dependencies with Playwright.
Update the dependencies that remain only after those migrations and cleanup are
complete.

## Phase 1: Project Positioning

1. Update `package.json` identity:
   - `name`: `@picr/react-grid-gallery`
   - `version`: `1.0.0` for the first scoped package release.
   - Before any public tag exists, use unpublished `0.0.0-development` as the
     repository placeholder so release tooling can advance monotonically to
     `1.0.0-rc.0`. Never publish the placeholder version.
   - `description`: `Justified image gallery component for modern React
applications.`
   - repository, bugs, and homepage point at the fork.
   - Use repository URL
     `git+https://github.com/IsaacInsoll/react-grid-gallery.git` and bugs URL
     `https://github.com/IsaacInsoll/react-grid-gallery/issues` so npm metadata
     matches the provenance source. Point the homepage at the repository README
     until a maintained demo/docs site exists.
   - Preserve original author credit and add current maintainership/contributor
     metadata where appropriate.
   - Keep Ben Howell as the original author and list fork maintainers and
     contributors separately.
   - Keep Ben Howell's copyright notice unchanged and append
     `Copyright (c) 2026 Isaac Insoll` for the personally owned fork work.
   - Treat PICR as the open-source project/brand where the vendored fixes
     evolved, not as the fork's legal copyright owner.
   - Add `publishConfig.access = "public"` so scoped publishes default to public
     intent.
   - Add `publishConfig.provenance = true` so provenance is a package-level
     publishing default rather than a release-command convention.
   - Accept that this setting makes unsupported local `npm publish` attempts
     fail. Do not remove it as a temporary convenience: the GitHub Actions OIDC
     publishing workflow with `id-token: write` is a hard prerequisite for any
     public release.
   - Review keywords and package description for the maintained fork.
   - Preserve useful upstream keywords and add `react-grid-gallery`,
     `justified-gallery`, `react-gallery`, `image-grid`, `photo-grid`,
     `typescript`, and `esm` for accurate fork discoverability.

2. Update docs:
   - Explain that this is a maintained fork of `benhowell/react-grid-gallery`.
   - Note that Isaac Insoll asked the original maintainer for permission and
     their blessing in the upstream
     [issue #375 comment](https://github.com/benhowell/react-grid-gallery/issues/375#issuecomment-5111298046).
   - Completed 2026-07-29: Ben Howell confirmed the MIT-licensed freedom to
     fork, wished the project well in
     [his response](https://github.com/benhowell/react-grid-gallery/issues/375#issuecomment-5113695157),
     and later
     [invited a link to the fork](https://github.com/benhowell/react-grid-gallery/issues/375#issuecomment-5113879264).
     Record this welcome accurately without implying a package transfer or
     ongoing endorsement.
   - Do not block release while the courtesy request is unanswered. Continue
     with the scoped `@picr` package rather than seeking the original npm name
     unless Ben Howell independently offers a transfer.
   - Before publishing, check for another actively maintained fork with
     substantial adoption and record the result. Reconsider consolidation only
     if a project genuinely overlaps this fork's goals and user base.
     Completed 2026-08-05: search GitHub's current repository index, the
     original repository's fork network sorted by adoption, and npm's package
     index. No compatible maintained fork has substantial adoption. The direct
     fork network has no fork above one star;
     [`alokd/react-grid-gallery`](https://github.com/alokd/react-grid-gallery)
     has two recent experimental multi-grid commits on a non-default branch,
     zero stars, and no published continuation. The actively developed
     [`@slithy/react-grid-gallery`](https://www.npmjs.com/package/@slithy/react-grid-gallery)
     package is a separate fixed-column, virtualized `GridGallery` API rather
     than a compatible justified-gallery fork; at the time of review it had
     zero GitHub stars, 78 npm downloads in the month ending 2026-08-03, and
     1,112 in the year ending 2026-08-03. It is useful adjacent work but does
     not overlap this fork's preserved API or intended migration path, so
     consolidation is not warranted.
   - When the repository and npm package are ready, add a concise follow-up to
     the upstream issue with links so existing users have a discoverable path.
   - Keep the original acknowledgements, moving the full list to
     `ACKNOWLEDGEMENTS.md` so README brevity never erases contributor credit.
   - State that the complete inherited Git history is preserved.
   - Add installation and migration examples for `@picr/react-grid-gallery`.
   - Treat the current upstream package-name installation/import examples and
     IE 11 statement as explicit release blockers. Replace them in the
     dedicated documentation PR; do not fold the full README rewrite into the
     ESM build PR merely because `package.json` now points its homepage at the
     README.
   - Add a short note that ESM-only output is intentional.
   - Add a concise compatibility note for modern React/Vite/TypeScript users.
   - Add a comparison table near the top of the README showing the original
     package and this fork side by side. Include at least package/import name,
     maintenance status, supported React versions, ESM/CommonJS support, Node
     baseline, TypeScript support, and browser baseline so users can quickly
     determine whether their project meets the fork's requirements.
   - Describe the package as preserving the original component API while
     clearly listing the package-name change and modern environment baselines.
   - Replace the old IE 11 statement with the agreed modern browser policy.
   - Keep the README concise: project identity and attribution, the compatibility
     table, installation, quick start, key migration differences, and links to
     detailed documentation.
   - Add `docs/API.md` for the complete public component, utility, and type API.
   - Add `docs/MIGRATION.md` for migration from the original package.
   - Add a short, friendly root `CONTRIBUTING.md` for development setup and
     commands, and link to it from a concise README contribution note.
   - Keep the guide easy to follow while covering Node/npm prerequisites,
     `npm ci`, development and required-check commands, gitmoji, focused PR
     expectations, scope discipline, attribution for ported work, and routing
     security reports through `SECURITY.md`.
   - Add a concise `SECURITY.md` covering supported release lines, GitHub private
     vulnerability reporting, actionable report details, and responsible
     disclosure. Do not publish a personal email address or promise a response
     time the maintainers may be unable to meet.
   - Add a short README security note linking to `SECURITY.md`; direct ordinary
     bugs and feature requests to GitHub issues.
   - Keep useful original demo/example links for now, but label them as upstream
     examples until the separately tracked Storybook site is available.
   - Treat the maintained Storybook demo/docs site as independent work that may
     land before or after `1.0.0`; it is not a first-release blocker.

3. Update changelog:
   - Add an unreleased section for the fork.
   - Do not write the final `1.0.0` entry during the ESM build migration while
     other release work remains. Prepare the complete human-curated entry in
     release preparation after the shipped behavior and migration notes are
     final.
   - The `1.0.0` entry must explicitly record the new scoped package/version,
     ESM-only output, removed CommonJS/UMD entrypoints, removal of published
     `src`, React 18 minimum, and removal of `key` from
     `ThumbnailImageComponentImageProps`.
   - Credit Ben Howell/upstream history.
   - Credit PICR-derived fixes separately.
   - Keep old upstream history below the new scoped-package release notes.
   - Keep `CHANGELOG.md`; do not replace it with GitHub Releases only.
   - Configure release tooling to fail releases if `CHANGELOG.md` has not
     changed.

4. Decide support policy:
   - Minimum Node version: `>=22`.
   - Keep the Node 22 engine even though the browser artifact's ES2020 syntax
     can execute on older runtimes. This is an intentional maintained-runtime
     support policy covering installs, development tooling, and SSR rather than
     a claim that Node 22 syntax is present. Node 18 and 20 are EOL, the tested
     matrix is 22/24/26, and `engine-strict` rejecting older Node versions is
     accepted behavior.
   - Use exact Node 24.18.0 from `.nvmrc` for local development and the initial
     single-version CI job. This is the latest Node 24 LTS patch available when
     npm 12 was adopted and satisfies npm 12.0.2's Node runtime requirement.
     Prefer the maintained LTS line over Node 26 Current for the canonical
     toolchain. This does not change the Node 22 consumer floor or the eventual
     Node 22/24/26 compatibility matrix.
   - Pin `@types/node` 22.20.1 to the minimum supported Node major. Build and test
     configuration must not typecheck against APIs unavailable on Node 22 even
     though the normal development runtime is Node 24.18.0.
   - React peer range: `>=18.0.0 <20.0.0`.
   - Test React 18 and React 19 before claiming compatibility.
   - Keep npm and `package-lock.json`; do not migrate package managers in the
     first release.
   - Pin npm 12.0.2 as the selected package-manager baseline in `packageManager`
     and release automation. Include the SHA-512 integrity hash emitted by
     Corepack 0.35.0 so Corepack verifies the selected package-manager artifact,
     not only its version string.
   - Upgrade the development compiler from TypeScript 4.8 to TypeScript 6.0.2,
     the deliberately selected stable compiler baseline for this release.
   - Support consumer projects using TypeScript `>=5.5`.
   - Use TypeScript 6.0.2 consistently for development, strict typechecking,
     lint integration, and declaration emit. Configure `tsdown` to use its
     stable `tsc` declaration generator rather than experimental `tsgo` emit.
   - Compile-test generated declarations with TypeScript 5.5, 6.0.2, and the
     current TypeScript 7 release so downstream TS7 compatibility remains
     covered without making TS7 part of the build toolchain.
   - TypeScript 6.0.2, `strict: true`, and the initial `typecheck` script landed
     in commit `55eecab`.
   - The initial strict baseline also enables `noImplicitReturns`,
     `noFallthroughCasesInSwitch`, `allowUnreachableCode: false`, and
     `allowUnusedLabels: false`.
   - Leave `noUnusedLocals` and `noUnusedParameters` to the planned ESLint
     configuration so unused-code policy is configurable in one place rather
     than duplicated between tools.
   - Reassess `noUncheckedSideEffectImports` during the ESM migration, when the
     final side-effect imports and consumer fixtures are known.
   - Require `npm run typecheck` in CI and release checks.
   - Treat unresolved strict-mode errors as a first-release blocker.
   - Do not enable `exactOptionalPropertyTypes` or `noUncheckedIndexedAccess`
     during the initial strict-mode migration. Assess those opt-in flags
     separately because they can materially change existing public API types.
   - Prettier 3.9.6 is installed with `format` and `format:check` scripts plus a
     `.prettierignore`.
   - Root ESLint was implemented on `lint/eslint` after the ESM package and
     test migrations stabilized. It uses flat configuration, typed rules,
     React Hooks rules, and framework-specific test rules without duplicating
     Prettier's formatting responsibilities. `npm run lint` rejects warnings
     and is required in CI and release checks.
   - The default branch was renamed from `master` to `main` before branch
     protection and release workflows were finalized.
   - Use ES2020 as the JavaScript output target. Document the corresponding
     modern-browser policy in the README before release.
   - The package does not bundle a `ResizeObserver` polyfill. Without one, the
     gallery measures its container on mount but does not respond to later
     resizes. Consumers need a global polyfill only when resize responsiveness
     is required in an environment without a native implementation; jsdom unit
     tests generally do not need one. This is documented in `docs/API.md`.

## Phase 2: ESM-Only Packaging

The pre-packaging compiler migration was implemented in commit `55eecab`:
TypeScript 6.0.2, `strict: true`, a required no-emit `typecheck` script, and CI
typechecking. Keep the remaining detailed public API/type corrections in Phase
3 so compiler migration and compatibility changes remain independently
reviewable.

The committed TypeScript strictness baseline uses `skipLibCheck` only for
inherited third-party declarations. Package source, Vitest tests, Playwright
tests, and browser fixtures are under strict checking. Strict mode required pulling forward the
`StyleFunction<T>` context propagation, custom thumbnail generic fixes, and
optional internal style props from Phase 3; retain their dedicated consumer
compile tests and migration documentation in that later phase. The historical
`ThumbnailImageComponentImageProps.title` contract remains `string | null`,
with `null` converted to `undefined` only for the native `<img>` path.
Remove `key` from `ThumbnailImageComponentImageProps`: custom thumbnail
callbacks already receive `index`, and their `imageProps` must be safe to spread
into JSX without React 19's special-prop warning.

Keep the root `tsconfig.json` limited to publishable source. Test files, test
runner configuration, fixture aliases, and nested fixture dependency exclusions
belong in `tsconfig.test.json`; `npm run typecheck` must validate both projects.

Implementation record, 2026-07-29: branch `build/esm-only` replaces the entire
Rollup chain with exact-pinned `tsdown@0.22.14`. It emits one unminified ES2020
browser ESM entry at `dist/index.js` and one bundled declaration entry at
`dist/index.d.ts`, using the stable TypeScript generator. React and its runtime
subpaths remain external. The old CJS, UMD, and named ESM artifacts and all
Rollup-specific dependencies/configuration are removed.

The inherited runtime export inventory was `Gallery`, `CheckButton`,
`buildLayout`, and `buildLayoutFlat`. The inherited declaration inventory was
`BuildLayoutOptions`, `CheckButtonProps`, `EventHandler`, `GalleryProps`,
`Image`, `ImageExtended`, `ImageExtendedRow`, `ImageProps`, `ImageTag`,
`StyleFunction`, `StyleFunctionContext`, `StyleProp`,
`ThumbnailImageComponentImageProps`, and `ThumbnailImageProps`, plus the four
runtime exports. The replacement build preserves that package-root inventory.

1. Simplify package entrypoints:
   - Add `"type": "module"`.
   - Remove CommonJS and UMD entrypoints.
   - Use one JavaScript ESM entry and one declaration entry.
   - Keep package-root imports as the primary supported API.
   - Avoid deep import support unless a specific path is intentionally supported
     and documented.
   - Include `./package.json` in package `exports`.
   - Keep `buildLayout`, `buildLayoutFlat`, and `CheckButton` as package-root
     exports for `1.0.0` compatibility.
   - Source maps were evaluated and intentionally omitted for `1.0.0`.
     `tsdown@0.22.14` couples JavaScript map output to a declaration-map footer
     without emitting its referenced map in this configuration. Prefer two
     correct publishable files over a dangling map reference or generated-file
     patching.

2. Target package shape:

   ```json
   {
     "type": "module",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.js",
         "default": "./dist/index.js"
       },
       "./package.json": "./package.json"
     },
     "sideEffects": false
   }
   ```

3. Update build tooling:
   - First try an exact-pinned stable `tsdown` release (currently `0.22.14`).
   - Accept `tsdown` only if one small configuration produces one unminified ESM
     entry, correct bundled declarations, and the agreed browser syntax target
     without custom output patching or extra build plugins. Source maps may be
     omitted when they cannot be emitted cleanly alongside declarations.
   - Configure `tsdown` explicitly to use its stable `tsc` declaration generator;
     do not use the experimental `tsgo` declaration path for `1.0.0`.
   - Accept the build tool after strict project checks, SSR/hydration browser
     coverage, and packed `publint`/Are the Types Wrong validation pass. Keep
     TypeScript 5.5/6.0.2/7, NodeNext/bundler, and packed Vite consumer fixtures
     as release gates in Phases 3 and 5 rather than conflating build-tool
     selection with their implementation.
   - If those gates do not pass cleanly, use Vite library mode for JavaScript and
     `tsc --emitDeclarationOnly` for declarations. Unbundled declaration files
     are acceptable if all package/type checks pass.
   - Externalize `react`, `react/jsx-runtime`, `react/jsx-dev-runtime`, and any
     other actual peer-dependency entrypoints imported by source.
   - Maintain `package.json` exports manually; build tooling must not rewrite the
     public export map.
   - Do not add custom post-build rewrites merely to keep either build-tool
     choice. Prefer the documented fallback when the primary path stops being
     simple.
   - Reassess JavaScript and declaration maps together after tsdown can emit
     both without a dangling reference to unpublished source.
   - Avoid adding CommonJS compatibility shims.
   - Add `default` after `import` in the root export conditions, pointing to the
     same ESM file. This gives unknown modern runtimes and Node's native
     `require(ESM)` interoperability a useful fallback without adding a
     CommonJS artifact or an explicit `require` condition; older CommonJS
     runtimes remain unsupported.
   - Enable `verbatimModuleSyntax`, `isolatedModules`, and
     `moduleDetection: "force"` as part of the ESM migration, and convert
     type-only imports to `import type` where required.
   - Ensure `files` includes only `dist` and required docs/metadata.
   - Do not publish `src`, tests, examples, or screenshots unless deliberately
     changed later.
   - Ensure `npm pack --dry-run` output is reviewed before publishing.
   - Replace `prepublishOnly` with an appropriate `prepack` or equivalent guard
     so both `npm pack` and `npm publish` build current output.
   - Add pinned `publint` and `@arethetypeswrong/cli` dev dependencies.
   - Add `npm run package:check` to run both validators with the ESM-only profile
     against the packed package.
   - In `check-package.mjs`, create exactly one tarball with `npm pack`, inspect
     the archive with the platform `tar` parser, and fail unless it contains
     exactly `CHANGELOG.md`, `LICENSE`, `README.md`, `package.json`,
     `dist/index.js`, and `dist/index.d.ts`. npm 12 buffers `npm pack --json`
     output differently when invoked as a child process, so do not make this
     gate depend on terminal output. Update the allowlist deliberately when
     `ACKNOWLEDGEMENTS.md` is created and added; unexpected source, test,
     screenshot, example, or configuration files must fail CI.
   - Remove dependencies that only exist for CommonJS or UMD output once the
     ESM-only build no longer needs them.
   - Remove Rollup, Babel, CommonJS, browser/UMD, declaration-bundling, and
     sourcemap plugins made obsolete by the accepted replacement build.
   - Update dependencies as part of the modernization work, but keep dependency
     churn focused on build, type, test, release, and security needs.
   - Keep `skipLibCheck` while tsdown's declarations reference uninstalled
     optional peers (`@volar/typescript`, tsdown CSS/executable plugins, Vite
     devtools, and `unplugin-unused`). Do not install unused toolchains solely
     to typecheck a dependency's optional surface; reassess on tsdown upgrades.

Initial implementation verification on 2026-07-29 used Node 24.13.0 and completed a
clean `npm ci`, formatting, source/test typechecking, all 50 Vitest tests, the
ESM build, one real package tarball, strict `publint`, ATTW's ESM-only profile,
and all 13 containerized Playwright tests. The tarball contains only
`package.json`, `LICENSE`, `README.md`, `CHANGELOG.md`, `dist/index.js`, and
`dist/index.d.ts`. `npm audit --omit=dev` is clean; five development-only audit
findings remain through inherited Testing Library versions for the dedicated
dependency-update phase. CI now runs `package:check` in place of a build-only
step. The Node 22/24/26 and TypeScript consumer matrices remain later release
gates.

Follow-up verification on 2026-07-29 used Node 24.18.0 with Corepack-managed
npm 12.0.2. The inherited lockfile was regenerated as lockfile version 3, a
clean `npm ci` succeeded, and formatting, source/test typechecking, all 50
Vitest tests, exact tarball-content validation, strict `publint`, ATTW's
ESM-only profile, and all 13 containerized Playwright tests passed. Production
dependencies remain audit-clean; the regenerated development graph has two
known findings (`@babel/runtime` moderate and `lodash` high) assigned to the
dependency-update phase. CI now installs the exact `packageManager` version
through Corepack before `npm ci`.

The digest-pinned Playwright image separately contains Node 24.18.0, npm
11.16.0, and Corepack 0.35.0. Its npm only launches the exact-pinned tsdown
build and Playwright tests; it does not resolve or install dependencies. Keep
this reproducible container toolchain distinct from the canonical npm 12
install/package-validation baseline rather than adding a network npm bootstrap
inside browser tests.

PR #5 then completed a focused Testing Library refresh in three reviewable
commits. `32164bd` upgraded React Testing Library to 16.3.2 and added its DOM
10.4.1 peer while deliberately retaining the two known audit findings for the
next commit. `e067e88` upgraded jest-dom to 7.0.0 and refreshed the compatible
`@babel/runtime` resolution; both the production and complete npm audits then
reported zero vulnerabilities. `fcb2157` exact-pinned those direct testing
dependencies and updated/exact-pinned the React 18 type baseline at 18.3.31.
Formatting, source/test typechecking, all 50 Vitest tests, the package build,
exact tarball validation, strict `publint`, and ATTW passed after every commit;
each intermediate push also passed both hosted CI jobs. Continue using exact
versions for direct development dependencies and review updates through the
planned grouped Dependabot workflow.

A final targeted lockfile refresh moved transitive `@babel/code-frame` from
7.24.2 to 7.29.7 within Testing Library DOM's existing `^7.10.4` range. The
new release uses `picocolors` directly, removing `@babel/highlight` and seven
other obsolete transitive packages without changing any direct dependency or
introducing an override. The full audit and all package/test gates remain clean.

`npm run package:check` proves the package's structural metadata, exports,
declarations, and current tarball contents. It does not declare the package
release-ready. The current upstream-oriented README and changelog remain in the
tarball until the dedicated documentation and release-preparation work updates
them; publishing is blocked until those documents, `docs/MIGRATION.md`, and
`ACKNOWLEDGEMENTS.md` are complete.

4. Add linting after the final module and test shapes are known:
   - Use exact-pinned ESLint 10.8.0 and `@eslint/js` 10.0.1 with flat
     configuration. ESLint 9 and legacy `eslint-plugin-react` were evaluated
     first, but their old minimatch/brace-expansion dependency path produced
     active high-severity audit findings and did not support a compatible
     patched override. Do not restore that combination merely to use the
     older React plugin.
   - Use `typescript-eslint` 8.65.0's strict type-checked preset, consistent
     type imports/exports, unused-code checks, exhaustive switches, explicit
     source-module boundaries, and source `no-console`. Keep the current
     explicit `tsconfig.json`/`tsconfig.test.json` project list because the
     nonstandard test config name is not discovered by project service.
   - Use `@eslint-react/eslint-plugin` 5.18.0's TypeScript recommendation plus
     its missing-button-type rule. Disable its React Hooks overlap and use
     `eslint-plugin-react-hooks` 7.1.1 `recommended-latest` as the canonical
     Hooks/React Compiler diagnostic set.
   - Keep `@eslint-react/no-array-index-key` disabled while image and tag keys
     remain optional public API fields; indices are the deliberate fallback
     when consumers do not supply stable keys.
   - Apply `@vitest/eslint-plugin` only to unit tests and
     `eslint-plugin-playwright` only to browser specs. Disable the dangerous
     HTML rule in the test-only SSR helper, where generated React markup is the
     fixture under test.
   - Cover package source, tests, build/configuration files, and maintained
     browser fixtures. Exclude inherited `examples/` and `playground/` until
     their separately planned cleanup/Storybook decision establishes which
     code is maintained.
   - Keep formatting owned by Prettier rather than adding overlapping ESLint
     style rules; keep `eslint-config-prettier` last in the flat config.
   - Add `lint` and `lint:fix`; reject warnings with `--max-warnings 0` and
     require `lint` in pull-request CI and release verification.
   - Defer `eslint-plugin-jsx-a11y` to the post-`1.0.0` accessibility issue and
     add Storybook linting only if Storybook is adopted. Do not add import,
     refresh, Unicorn, generic security, Testing Library, or jest-dom plugins
     without a concrete rule gap that justifies their dependency surface.

## Phase 3: TypeScript Surface

1. Modernize compiler settings:
   - TypeScript 6.0.2, `strict: true`, and `npm run typecheck` were implemented
     in commit `55eecab`; CI now requires the no-emit compiler check.
   - The committed baseline enables `noImplicitReturns`,
     `noFallthroughCasesInSwitch`, `allowUnreachableCode: false`, and
     `allowUnusedLabels: false`.
   - Enforce unused imports, locals, and parameters through the planned ESLint
     configuration rather than TypeScript's `noUnusedLocals` and
     `noUnusedParameters` flags.
   - `noUncheckedSideEffectImports` was reassessed and enabled during the ESM
     migration.
   - Treat any remaining strict-mode errors as a `1.0.0` blocker.
   - `verbatimModuleSyntax`, `isolatedModules`, and
     `moduleDetection: "force"` were enabled with the ESM build, with project
     imports converted to `import type` where required.
   - Keep `exactOptionalPropertyTypes` and `noUncheckedIndexedAccess` disabled
     until each has a separate compatibility audit.
   - Keep `skipLibCheck` while tsdown's public declarations reference its
     uninstalled optional peers. This does not weaken checking of this
     repository's source, tests, fixtures, or configuration.
   - The linting PR replaced global `JSX.Element` return annotations with
     `ReactElement`, completing that React 19 compatibility correction before
     the declaration fixtures are added.
   - The same PR made `CheckButtonProps.isSelected` and
     `CheckButtonProps.isVisible` optional so the exported component props
     match defaults already applied at runtime. Keep `ImageProps.isSelectable`
     required: `Gallery` always supplies a boolean and custom thumbnail
     callbacks must not be forced to handle an impossible `undefined` value.
   - Do not enable `isolatedDeclarations` while stable `tsc` declaration emit
     remains the selected path; reconsider it only if the declaration emitter
     changes and its constraints provide a concrete benefit.

2. Audit `src/index.ts` exports:
   - Export `Gallery`.
   - Export all public image/gallery prop types.
   - Export intended public layout helpers.
   - Do not expose internal-only implementation details unless they are already
     part of the practical public API.
   - Record the expected runtime and type exports before changing the build.

3. Validate generated declarations:
   - `dist/index.d.ts` exists after build.
   - Type-only imports work from `@picr/react-grid-gallery`.
   - No declarations require deep imports into `dist` or `src`.
   - No public declaration references the removed global `JSX.Element`
     namespace. Use React's exported `ReactElement` type for component return
     annotations that need to support both React 18 and React 19 types.

4. Add compile-only public API tests:
   - Prove that changing the import source from `react-grid-gallery` to
     `@picr/react-grid-gallery` preserves supported component props, callbacks,
     helpers, generics, and root-exported types.
   - Cover custom image fields through style callbacks and
     `thumbnailImageComponent`; generic relationships must not collapse to the
     base `Image` type.
   - Fix `StyleFunction<T>` to pass `T` into `StyleFunctionContext<T>` and carry
     that generic through the internal `getStyle` helper. Compile-test all three
     style callback props with a custom image type.
   - Preserve `ThumbnailImageComponentImageProps.title` as `string | null` for
     compatibility with custom thumbnail components. Convert `null` to
     `undefined` only at the native `<img>` boundary required by React's DOM
     types, and compile-test both paths.
   - Remove `key` from `ThumbnailImageComponentImageProps`. Custom thumbnail
     callbacks already receive `index`; cover a component that spreads
     `imageProps` into JSX in the React 19 hydration test and assert that React
     emits no console errors.
   - Document the now-optional `ImageProps` style properties in
     `docs/MIGRATION.md` as a public type-accuracy correction; runtime behavior
     remains unchanged.
   - Check `CheckButton` defaults against the optionality of its exported props.
   - Test matching React 18 and React 19 runtime/type packages. Add an exact-
     pinned React 19 type fixture containing a real TypeScript consumer source
     file and run `tsc --noEmit` against the built package declarations; the
     runtime-only Vite/Playwright fixture and ATTW do not prove React type
     compatibility. Compile-test that custom thumbnail callbacks receive
     `isSelectable` as `boolean`, not `boolean | undefined`.
   - Implemented on `types/public-surface` as one canonical consumer contract
     compiled against the generated `dist/index.d.ts`. The runner copies that
     consumer beside a temporary package-shaped `node_modules` tree for each
     React fixture. The runner copies the real package manifest and built
     JavaScript/declaration outputs into that tree, so both Bundler and NodeNext
     resolve the real export map and declaration imports use the fixture's
     matching React types exactly as they would after installation. It removes
     stale output before each run and cleans up in a `finally` block; all tools
     also ignore `.type-package/` so an interrupted run cannot pollute Git,
     Prettier, or ESLint results.
   - The consumer covers every intended package-root value and type export,
     custom image fields through callbacks/styles/thumbnails/layout helpers,
     optional style props, optional `CheckButton` defaults, required
     `isSelectable`, nullable thumbnail titles, and the intentionally absent
     spreadable `key` property. No additional source API correction was needed.

5. Validate compatibility with modern TypeScript settings:
   - Treat TypeScript 5.5 as the minimum supported consumer compiler.
   - Test declarations with TypeScript 5.5, the TypeScript 6.0.2 development
     compiler, and the current TypeScript 7 release.
   - `moduleResolution: "bundler"`
   - `moduleResolution: "node16"` or `"nodenext"` where practical.
   - Type-only imports and value imports from the package root.
   - Strict mode and declaration generation do not replace compile-only public
     API tests.
   - `npm run test:types` builds once and runs all 12 combinations of exact-
     pinned TypeScript 5.5.4, 6.0.2, and 7.0.2; React 18.3 and 19.2 runtime/type
     fixtures; and `bundler` and `NodeNext` resolution. Fixtures enable
     `strict`, `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`, and
     `skipLibCheck: false`.
   - Each declaration fixture explicitly loads only its matching React global
     types. This prevents unrelated root development-tool types, such as
     Storybook's MDX declarations, from leaking into the minimal consumer
     matrix while leaving every package declaration fully checked.
   - Keep TypeScript 5.5 and 7 installed inside their fixture workspaces so
     their identical `tsc` binary names cannot replace the selected root
     TypeScript 6 binary. Root source/test scripts invoke
     `node_modules/typescript/bin/tsc` explicitly.
   - Read compiler labels from each installed TypeScript package manifest so
     matrix output cannot silently disagree with exact workspace versions.
   - The canonical consumer is excluded from the normal root TypeScript program
     because its generated declaration dependency exists only during
     `test:types`. ESLint still applies syntax and framework rules using its
     non-type-checked override; the dedicated 12-way compiler matrix owns its
     semantic checking.
   - Require `npm run test:types` in pull-request CI and future release
     verification. Packed installation and package metadata remain assigned to
     the following consumer-smoke-test PR.

## Phase 4: Port PICR PR #73

PICR PR #73 was merged on July 16, 2026 and changes row fitting so overflowing
justified rows are rescaled instead of horizontally cropped.

Status: completed on 2026-08-03 through PR #14. The rebased direct port is
commit `e5d3917`, authored by Olli-Pekka Niskanen and committed by Isaac Insoll;
regression coverage, sizing hardening, adaptive selection styling, reviewed
snapshots, documentation, and acknowledgement are in Isaac-authored commit
`8a9b72e`. The separately discovered popup test race is isolated in test-only
commit `15680e5`; migration clarification is commit `061f844`. The PR records
the attribution and relicensing permission. Local gates and hosted baseline,
browser, Node 22, and Node 26 CI passed before rebase-merge.

Current-source audit completed on 2026-08-01:

- Compared this package's eight `src` TypeScript modules with PICR
  `frontend/src/components/FileListView/react-grid-gallery` at current
  `origin/master` commit `9a08a06ec6c8e129e2789c27427134112719f3a8`.
- PICR has three substantive differences: PR #73 row rescaling; optional
  `Image.href` support that renders linked tiles as anchors; and more accurate
  `GalleryProps` style callback types using `ImageExtended<T>`.
- The `Image.href` behavior was added later for PICR navigation and is not part
  of PR #73. Preserve it before `1.0.0` in its own focused PR; do not silently
  bundle it into the row-layout fix.
- Correct the `ImageExtended<T>` style callback types before `1.0.0`. This is a
  type-only description of the layout fields already supplied at runtime and
  requires consumer fixture coverage.
- Remaining differences are equivalent formatting, stricter React/TypeScript
  corrections already made in this package, or PICR code that should not be
  restored here, including spreadable React `key` props and older public prop
  optionality.

### Preserve PICR linked gallery tiles

Status: completed and rebase-merged through PR #13 on 2026-08-02 as
`bd20007`. The hosted baseline, browser, Node 22, and Node 26 jobs passed.

Port PICR commit `9646fb329e18f5ffad72de1630bc3d48f4f46aa7` as a focused
pre-`1.0.0` feature after the style callback type correction and before the row
rescaling fix:

- Add optional `href?: string` to the public `Image` contract.
- Render a tile viewport as a real anchor when a non-empty `href` is present so
  native link behavior such as opening in a new tab remains available.
- Preserve the existing `div` markup and click behavior byte-for-byte for
  images without `href`.
- Keep `onClick` behavior available for linked tiles. Plain and Enter-activated
  clicks follow the link unless the consumer calls `preventDefault()`;
  modified primary clicks call `onClick` with modifier flags and retain native
  browser behavior when not prevented. The gallery listens for `click`;
  browsers dispatch `auxclick` for middle buttons, so those activations bypass
  `Gallery.onClick` and retain native behavior. Do not add an `onAuxClick` API
  for `1.0.0`.
- Keep the selection button, tags, overlays, and caption outside the anchor.
  A custom thumbnail may be used inside a linked viewport but must not render
  anchors, buttons, or other interactive descendants.
- Document plainly that adding `href` changes a viewport click into navigation.
  Built-in check-button selection is unaffected, but consumers using `onClick`
  for selection, a lightbox, or client-side routing must call
  `preventDefault()` when they intend to remain on the page.
- Add tests that begin red for the public `href` type, anchor rendering, and
  keyboard/native link behavior. Preserve green-before-and-after guards for
  unlinked `div` markup, thumbnail prop filtering, and existing screenshots.
- Cover the public type through the full compiler/React/resolution fixture,
  default and custom thumbnails, SSR and React 19 hydration, both native and
  prevented paths for plain/Enter activation, modified/middle clicks,
  structural DOM boundaries, and linked/unlinked visual parity. Scope browser
  link selectors to the gallery so unrelated fixture links cannot satisfy or
  redirect these checks.
- Keep the unlinked default scenario as the sole writer of `default.png`.
  Compare linked and unlinked screenshots byte-for-byte inside one test so
  snapshot updates cannot race or silently accept a divergence; do not add a
  duplicate PNG for identical output. Compare only the unfocused state, rely on
  the fixture's image-load and two-animation-frame readiness gate, and attach
  both live PNGs when parity fails.
- Document the additive API and avoid unrelated navigation options such as
  `target` or `rel` until a concrete consumer contract requires them.
- Keep `1.0.0` router-neutral: do not add `linkComponent`, `renderLink`, or
  router-specific props. Native anchors are the primary API, while consumers
  may intercept unmodified clicks for client-side routing. Reassess a typed
  render-prop or adapter contract after `1.0.0` only if concrete consumer needs
  justify the additional public API and router-specific typing tradeoffs.

Red-before evidence captured 2026-08-02: the focused unit file had three
anchor/SSR failures with 29 existing and invariant tests passing; the public
type matrix rejected `Image.href`; and Playwright had six link/hydration
failures while all 14 inherited and visual-parity checks passed. After the
implementation, all 56 unit tests, 12 public-type combinations, 22 pinned
Playwright tests, packed-consumer checks, and package-surface checks pass.

Execute this implementation after the Vitest and Playwright migrations, even
though the phase is documented here next to the type work. First preserve the
unchanged layout baseline in Playwright; then review PR #73's snapshot changes
as an intentional behavior diff. Olli-Pekka Niskanen granted permission to use
his commits directly in this maintained package in
[PICR issue #81](https://github.com/IsaacInsoll/PICR/issues/81#issuecomment-5113052332).
This satisfies the permission requirement for the MIT port.

1. Confirm permission to port the contribution:
   - PICR is distributed under Business Source License 1.1, while this package
     remains MIT licensed.
   - Permission was recorded on 2026-07-29 after the maintained MIT package and
     the two PICR commits were explicitly discussed. No additional request to
     Olli is required before porting PR #73 commit
     `5d8d5f0e72a22d93ac8674efa8cb81a1881fafdb`.
   - Preserve the permission link in the implementation commit and release
     records.

2. Diff PICR's vendored gallery against this package:
   - `buildLayout.ts`
   - Any related tests or type changes.

3. Port the row fitting behavior:
   - Rows should preserve image pixels instead of cropping.
   - Non-last rows should fill the container without overflow.
   - Rescale every overflowing row, including a single-image or final row.
     Preserve the target height and natural dimensions only for an underfilled
     final row.
   - Treat `rowHeight` as the target row height: overflowing rows may render
     shorter so their complete images fit without cropping.
   - Keep row membership, image ordering, and `maxRows` results unchanged; the
     fix changes sizing, not packing.
   - Retain public `ImageExtended.marginLeft` for compatibility, but return `0`
     for every rescaled image now that horizontal cropping is removed.

4. Add or update tests:
   - Capture red-before evidence for oversized, mixed-aspect-ratio, margin, and
     rounding cases without committing a red revision.
   - Prove scaled widths plus horizontal margins exactly equal an integer
     container or stay less than one pixel below a fractional container without
     overflowing. Also prove `viewportWidth === scaledWidth` and
     `marginLeft === 0` for rescaled rows.
   - Add green-before-and-after guards for exact row membership/order, input
     immutability, and unchanged underfilled-final-row behavior.
   - Pass a selected rescaled item through `styles.thumbnail` to cover the
     interaction between `scaledWidth`, `scaledHeight`, `viewportWidth`, and
     `marginLeft`. Scale the selection inset down for tiles whose short
     dimension is below `64px` so panoramic selected images retain at least half
     that dimension and never produce negative CSS dimensions; preserve the
     existing `16px` inset for normal tiles.
   - Document the adaptive selection inset in `docs/MIGRATION.md`. It is scoped
     by tile size rather than by row overflow, so it also changes selection
     chrome on small tiles that were never rescaled, such as galleries using a
     `rowHeight` below `64px`. Consumers cannot infer that from the
     row-rescaling behavior alone.
   - Clamp a non-positive image budget to zero when horizontal margins exceed
     the container during a resize, rather than emitting negative scaled and
     viewport dimensions.
   - If every natural row width rounds to zero, use a zero scale rather than
     dividing `0 / 0`; assert all resulting dimensions remain finite and
     non-negative.
   - Add a deterministic patterned SVG browser fixture with visible edge
     markers, including a selected image, so cropping cannot hide behind the
     inherited solid-color swatches. Assert browser geometry, including the
     expected `163px` rescaled height, so the scenario cannot become vacuous;
     review the dedicated screenshot plus any changed inherited baselines as
     intentional layout diffs.

5. Credit:
   - Changelog entry should mention PICR PR #73 and `opniskanen` /
     Olli-Pekka Niskanen.
   - Put the direct `buildLayout.ts` port in its own commit with Olli-Pekka
     Niskanen as Git author, using his GitHub ID-based no-reply address
     `211355597+opniskanen@users.noreply.github.com` and preserving the original
     author date `2026-07-16T13:45:38Z`. This intentionally normalizes the
     original unlinked `.local` email so GitHub can associate the author with
     `opniskanen`. Keep Isaac as the Git committer; do not impersonate Olli as
     committer or claim the adapted commit is signed by him.
   - State in the implementation commit body that the patch was ported from
     BSL-1.1 PICR with the author's explicit permission to use the commits
     directly in `@picr/react-grid-gallery`, and that this port is distributed
     under this repository's MIT license. Link the original PICR commit and
     permission comment.
   - Add regression tests and documentation in a separate Isaac-authored
     commit, and rebase-merge rather than squash so both commits remain visible.
   - Add Olli by name to `ACKNOWLEDGEMENTS.md`, linking his GitHub profile, PICR
     PR #73, the original commit, and the permission record. Credit him again in
     the changelog, release notes, and PR description.

Red-before evidence captured 2026-08-03: four layout assertions and one
selected-image style assertion failed against the cropping algorithm while 22
related tests remained green. A separate fractional-container assertion proved
the direct port could round a `201.5px` container up to `202px`; the follow-up
floors the integer sizing budget and leaves less than one pixel unused instead
of overflowing. Review then added two focused failures proving margins could
produce negative dimensions in a transient `3px` container and a selected
panorama could receive negative fixed-inset CSS; clamping the sizing budget and
adapting selection margins made both pass. The pre-update browser run produced the expected nine
individual inherited baseline differences, one resize-loop difference, and one
missing patterned baseline. A repeated parallel run also exposed and corrected a pre-existing
popup test race by waiting for the destination URL rather than the initial
`about:blank` load state.

A 2026-08-07 repeated full-gate run showed that headless Chromium
intermittently does not create a background tab for Playwright's synthetic
Ctrl/middle-click gesture, both concurrently and in isolation. Do not test
Chromium's background-tab creation as package behavior. Instead, verify the
boundary Gallery owns: the viewport remains a real anchor with the destination
`href`; modified primary clicks reach `Gallery.onClick` with modifier state and
are not prevented; middle-button `auxclick` does not reach `Gallery.onClick`;
and neither activation navigates the originating page. The ordinary-click and
Enter tests continue to verify actual destination navigation. This changes only
test synchronization and scope; native link behavior and production code remain
unchanged.

Final local verification passes 63 Vitest tests, all 12 public-type compiler /
React / resolution combinations, 23 pinned Playwright tests, the packed Vite
consumer, strict publint, and ATTW's ESM-only profile. Contact-sheet review
confirmed all 16 changed inherited baselines preserve row membership while
shortening overflowing rows; `transparent.png` remained byte-identical. The new
`row-justification.png` visibly retains both edge markers for normal and
selected images.

## Phase 5: Consumer Verification

Status: completed and merged into `main` through PR #8 on 2026-07-30 as
`d5854f6` through `5fb172a`. The hosted baseline and browser jobs passed. The
required fixture uses the actual npm tarball in a temporary React 19 +
TypeScript 6 + Vite 8 app; it does not resolve the library from source, `dist`,
a workspace, or a test alias.

1. Run local checks:
   - `npm run typecheck`
   - `npm run lint`
   - `npm run build`
   - `npm test`
   - `npm run format:check`
   - `npm run package:check`
   - `npm pack --dry-run`

2. Test the packed tarball in fresh consumers:
   - Vite + React + TypeScript. `npm run test:consumer` must build the package,
     create one tarball without rerunning lifecycle scripts, copy the consumer
     template to a temporary directory, and install that tarball there with
     lifecycle scripts disabled.
   - Use React 19.2.8, matching React type packages, TypeScript 6.0.2, Vite
     8.1.5, and strict bundler module resolution for the first packed consumer.
     React 18/19 declaration compatibility and NodeNext resolution remain the
     responsibility of the separate public-type matrix.
   - Commit a dedicated npm 12 lockfile for the consumer template. Run its
     dependency `npm ci` with `--prefer-offline`, so it reuses the root install's
     cache without depending on both lockfiles resolving the same transitive
     versions. Missing dependency artifacts may come from the registry but
     remain version- and integrity-locked by the fixture lockfile.
   - Install the locally generated tarball separately with `--prefer-offline`,
     `--no-save`, and lifecycle scripts disabled. Hosted CI proved that npm 12
     reports the already installed React package as `undefined` during strict
     offline peer resolution, even when allowed to read the fixture lockfile.
     Permit npm to fetch missing registry metadata rather than use `--force`,
     `--legacy-peer-deps`, or `--package-lock=false` to bypass the peer contract;
     the library bytes still come only from the locally generated tarball.
   - Give the fixture the same integrity-hashed npm 12.0.2 `packageManager` pin
     as the root package. Corepack otherwise searches from the temporary
     directory, finds no package-manager declaration, and may download and run
     a newer npm release inside the smoke test.
   - Keep shared direct tool and React versions aligned between the consumer
     manifest and the applicable root/workspace manifests during dependency
     updates, and regenerate each changed lockfile with pinned npm 12.0.2.
     `check-consumer.mjs` must fail when the fixture's package-manager pin,
     React/React DOM packages and types, TypeScript, or Vite drift from their
     authoritative root/workspace values. Transitive lockfile resolutions may
     differ; `--prefer-offline` makes cache overlap an optimization rather than
     a correctness dependency.
   - Keep the consumer template outside the root npm workspaces and install it
     only in a temporary directory. This preserves the fresh-install boundary.
     Exclude any locally generated fixture `node_modules` or `dist` directory
     when copying it.
   - Expect repository-level Dependabot security features to cover the tracked
     packed-consumer lockfile, and confirm that behavior when a real alert
     occurs. Include the lockfile explicitly in the weekly high-severity audit.
     The existing consumer preflight remains responsible for rejecting drift in
     shared React, React types, TypeScript, Vite, npm, and package-manager values.
   - Optional: Next.js App Router smoke test.
   - React server rendering followed by hydration under supported React
     versions is already covered by the Playwright browser fixture; it does not
     need to be duplicated in this packaging-only fixture.

3. Verify:
   - A direct Node ESM runtime import loads exactly the four intended
     package-root value exports, rejects missing or accidental extras, and logs
     the verified sorted list in CI.
   - Strict `tsc --noEmit` resolves package-root types without `skipLibCheck`.
   - A Vite production build consumes the package-root runtime and type imports.
   - No CommonJS-only assumptions remain.
   - Package tarball contains only expected files.
   - React peer dependency range matches the consumer versions tested.
   - The documented browser target loads the ESM output and responds to
     container resizes under the stated `ResizeObserver` policy.

4. Add automation where reasonable:
   - A package smoke-test script or fixture is preferred, because packaging
     regressions are easy to miss with normal unit tests.
   - GitHub Actions should run formatting, type checking, linting, build, tests,
     and package checks on pull requests once each check has been introduced.
   - `publint` and Are the Types Wrong must validate the packed package rather
     than direct source files.
   - CI should test Node 22, 24, and 26.
   - Run the packed-package consumer smoke under every supported CI Node major
     so each lane executes a real package-root ESM import; static manifest and
     declaration analysis alone is not sufficient runtime compatibility proof.
     PR #10 and the final landing PR #11 passed the Node 22 and 26 compatibility
     lanes after this smoke was added; Node 24 remains covered by the full
     baseline.
   - Vitest and Playwright migration was implemented in PR #4; merging that PR
     remains a first-release blocker.
   - Run `npm run test:consumer` as its own baseline CI step so a normal source
     test or declaration-only fixture cannot mask a broken npm installation.

## Phase 6: Test Migration

There is no release race because PICR currently works with vendored files. Use
the clean break to modernize the test stack before publishing `1.0.0`.

Status: completed and merged into `main` through PR #4 on 2026-07-29. The hosted
`Format and build` and `Browser tests` jobs passed.

1. Validate parity while replacing the old test systems:
   - Run Jest and Vitest side by side during local development, but replace Jest
     cleanly in one migration PR once coverage is equivalent or better.
   - CI does not need to run Jest and Vitest together; verify the existing Jest
     baseline before migration and require the final Vitest suite afterward.
   - Run the existing Puppeteer suite immediately before migration. Map every
     retained Puppeteer scenario to a named Playwright scenario in the migration
     PR description, explicitly recording React 16/17 removal and React 19
     addition.
   - Generate Playwright baselines in the pinned Linux environment and review
     every new image beside its corresponding old snapshot. Two suites passing
     independent baselines is not accepted as evidence of parity, so a temporary
     dual-CI run is not required.
   - Do not leave duplicate test systems running on `main`.
   - Complete the Playwright migration before removing the UMD build that the
     inherited Puppeteer suite loads. If Storybook has not landed yet, use a
     minimal internal Vite fixture that Storybook may replace later.

2. Vitest decisions:
   - Use Vitest for unit and React component tests.
   - Use `jsdom` as the Vitest DOM environment.
   - Keep `@testing-library/react`.
   - Use `@testing-library/jest-dom/vitest` for DOM matchers.
   - Use explicit imports from `vitest` rather than injecting test globals.
   - Run Testing Library cleanup from the Vitest setup file after every test.
   - Limit Vitest discovery to `test/unit/` so browser specs and fixtures remain
     independently owned.
   - Unit/component behavior tests may import from `src` for fast local
     feedback.
   - Dedicated package/export smoke tests must import from the built package
     shape.

   Migration record for PR 5:

   - The corrected inherited Jest unit baseline passed 3 suites and 50 tests.
     The inherited `test:unit` pattern incorrectly matched the TypeScript e2e
     file, so parity used an explicit `.e2e.test.ts` exclusion with Watchman
     disabled.
   - Exact-pin Vitest 4.1.10 and jsdom 29.1.1. jsdom 30 requires newer Node
     patch releases than the then-selected Node 24.13.0 development baseline;
     jsdom 29.1.1 supports that baseline and the maintained Node 22 line.
   - The migrated Vitest suite passes the same 3 suites and 50 tests. One CSS
     data-URL assertion reads the applied DOM style directly to avoid an older
     jest-dom shorthand-parser normalization artifact; covered behavior is
     unchanged.
   - `npm test` and `npm run test:unit` run Vitest once; `test:unit:watch`
     provides watch mode.
   - Jest was retained only for the existing Puppeteer e2e file until the
     Playwright parity run, then Jest, image-snapshot, Puppeteer, and Babel were
     removed with that suite.
   - Add the Vitest suite to required pull-request CI without running duplicate
     Jest unit tests.

3. Playwright decisions:
   - Use Playwright Test for browser, visual, and ESM fixture coverage.
   - Use Chromium only for the first release, including visual and browser smoke
     tests.
   - Browser tests should exercise the built ESM package through a small fixture
     app/page, not direct `src` imports.
   - Seed Playwright with the existing Jest PNGs and attempt exact comparison
     first. Retain any baseline that passes unchanged; regenerate only snapshots
     with reviewed, explainable browser/runtime differences in the pinned Linux
     environment.
   - Use the migration as an opportunity to organize tests by responsibility;
     preserving the inherited flat test layout is not a goal. Prefer
     `test/unit/` for Vitest suites, `test/browser/` for Playwright specs and
     their colocated snapshots, and `test/fixtures/` for the maintained Vite
     gallery app and deterministic visual assets. Adjust names if Playwright or
     Vite conventions make a nearby structure clearer, but keep generated
     output distinct from authored fixtures and baselines.
   - Rename and move retained snapshots/assets where that makes scenario
     ownership obvious. Preserve Git rename detection where practical, but
     organization and maintainability take priority over a minimum-diff
     migration.
   - After old/new parity is established, replace remote color-image requests
     with deterministic local fixtures. Review any resulting baseline changes
     separately so network cleanup is not mistaken for framework parity.
   - Generate and compare visual snapshots in one pinned Linux Playwright
     environment matching CI so host operating systems do not create baseline
     churn. Use the official `mcr.microsoft.com/playwright` container pinned by
     immutable digest, with its readable version matching `@playwright/test`
     exactly.
   - Provide one containerized visual-test command used both locally and in CI.
     Do not accept baselines generated directly on macOS, Windows, Manjaro, or
     another host environment.
   - Update the Playwright package, container image, browser binaries, and any
     intentionally changed snapshots together in one reviewed dependency PR.
     Ignore routine Dependabot updates for `@playwright/test` so a grouped npm
     PR cannot update the package without its matching image digest and
     snapshots.
   - Keep old Jest image snapshots while browser parity is being checked.
   - Remove old Jest image snapshots before the completed Playwright migration
     lands on `main`.

4. Cleanup:
   - Remove Jest, `jest-puppeteer`, Puppeteer, and `jest-image-snapshot` after
     new coverage is accepted.
   - Remove old UMD-build e2e assumptions when Playwright ESM fixture coverage
     replaces them.

   Migration record for commit `36600f1` in PR #4 on 2026-07-29:

   - The final inherited Puppeteer run passed 13 scenarios and 19 snapshots on
     Chrome 117. The replacement maps each retained behavior to a named
     Playwright scenario; React 16/17 were removed because the fork supports
     React 18+, and a React 19 server-render/hydration smoke test was added.
   - Exact-pin `@playwright/test` 1.62.0 and Vite 8.1.5. Use Chromium only and
     run it in `mcr.microsoft.com/playwright:v1.62.0-noble` pinned to immutable
     multi-architecture digest
     `sha256:baed2032d533817f3dbe6425de795788430ba345e819a1201337009ba17c9d07`.
   - `npm run test:browser:container` is the canonical local and CI command;
     `npm run test:browser:container:update` is the only accepted baseline
     update path. The container explicitly forwards the host `CI` value so
     Playwright enforces `forbidOnly`, single-worker execution, CI retries, and
     GitHub reporting in Actions while retaining local settings elsewhere.
   - The fixture executes the built ESM entry (renamed from
     `dist/react-grid-gallery.esm.js` to `dist/index.js` in the ESM packaging
     work), uses React 18.3.1
     for 17 visual snapshots, and uses a private npm workspace with React
     19.2.8 for hydration coverage. Remote color endpoints were replaced with
     deterministic data-SVG fixtures after old/new parity was established.
   - Sixteen of 17 inherited visual baselines passed byte-for-byte on Chromium 151. Only the tags baseline changed: 210 antialiased rounded-corner pixels
     differed between Chromium 117 and 151, and that focused diff was visually
     reviewed before accepting the new PNG. The committed
     `test/browser/README.md` records this provenance and the container-only
     baseline workflow.
   - The React 19 smoke test exposed a warning caused by spreading `key` into a
     native `<img>`. `key` is now omitted from both native and custom-thumbnail
     image props; custom thumbnail callbacks retain the separately supplied
     `index`. React 19 hydration covers both rendering paths and requires zero
     console errors.
   - The completed Playwright suite passes 13 tests: 11 React 18 visual
     scenarios containing 17 screenshots and two React 19 hydration smoke tests.
     The final side-by-side run had both legacy Puppeteer and Playwright green
     before the old harness and snapshots were removed. PR #4's hosted `Format
and build` and digest-pinned `Browser tests` jobs both passed.
   - Removing Babel, Jest, Puppeteer, image-snapshot, and the Rollup stack
     reduced the audit from 28 findings (1 low, 5 moderate, 20 high, 2 critical)
     to 5 development-only findings (2 moderate, 3 high). Production dependency
     audit remains clean. The remaining findings come through inherited Testing
     Library versions and stay assigned to the dedicated dependency update.
   - Keep npm's cross-platform optional dependency entries in `package-lock.json`.
     A local `npm prune` removed metadata including `@emnapi/wasi-threads` and
     produced a lock that local npm accepted but Node 24's bundled npm rejected
     in CI. Do not treat hoisted optional entries as stale solely because this
     host's `npm ls --depth=0` labels them extraneous or a static reachability
     check calls them orphaned. Do not prune or regenerate the lockfile in the
     Playwright PR. Revisit lockfile cleanup only after npm 12.0.2 is pinned,
     then require clean `npm ci` runs on Node 22, 24, and 26 before committing
     the result.

## Phase 7: Repo Cleanup

Status: completed on 2026-08-01. The cleanup was implemented as `708ce88` and
replayed through PR #9 as `e9268fd`. It removed the inherited demo toolchains
and stale policy files while preserving their consumer guidance, contributor
credit, and image attribution in maintained root/docs files.

Audit the repository for files that were useful upstream but no longer fit the
scoped modern package. Remove or update them deliberately rather than carrying
stale project state into `1.0.0`.

Cleanup candidates:

- Completed in the Playwright migration: remove `jest.config.js`,
  `setup-jest.js`, Jest-only helpers, `.babelrc`, Babel/Jest/Puppeteer
  dependencies, and `test/__image_snapshots__` after the parity run was
  accepted.
- Rollup/CommonJS/UMD/browser-build config and dependencies made obsolete by the
  replacement ESM-only build.
- Existing `.github/workflows` that publish old docs or assume the upstream
  package/release process. The obsolete write-enabled Pages workflow was
  removed with baseline CI in
  `4598145affe51a17ba7236fc04a70d868e4b584d`.
- Existing `.github/dependabot.yml` once the new monthly grouped update policy
  is configured.
- Remove the stale `.github/contributing.md` after the root `CONTRIBUTING.md`
  replaces it; update issue templates if they point at upstream processes.
- Delete the current one-line `CODE_OF_CONDUCT.md` stub rather than presenting
  it as a meaningful policy. Do not add a replacement conduct policy as part of
  the first release.
- Old package-name references in README, examples, docs, tests, and package
  metadata.
- The inherited Nextra/Next site, Create React App examples, nested example
  lockfiles/`.env` files, and Parcel playground. Remove these during
  first-release cleanup if the separate Storybook issue has not already
  replaced them.

Preserve useful upstream documentation links, scenario knowledge,
acknowledgements, and image credits when removing the obsolete example
toolchains. Label upstream examples clearly until the maintained Storybook site
is available.

## Phase 8: First Publish

The former first-release GitHub issue draft was retired on 2026-08-05 because
its completed history duplicated this plan. Its remaining release-critical work
is consolidated here:

- [x] Complete PICR's consumer migration and Playwright comparison against
      `1.0.0-rc.0`; resolve any package regression before freezing `1.0.0`.
      Completed 2026-08-05: the PICR team confirmed the migration and browser
      comparisons passed without a package regression.
- [x] Add the final human-curated `1.0.0` changelog section after the release
      contents are fixed. Include the maintained-fork context, migration and
      packaging changes, PICR PR #73, Olli-Pekka Niskanen's credit and relicensing
      permission, and why scoped `1.0.0` is not a downgrade from upstream
      `1.0.1`.
- [x] Run the release preflight and complete release gate, then let release-it
      create and atomically push the version commit and annotated `v1.0.0` tag.
- [x] Verify the tag workflow stages the checked tarball through OIDC with
      provenance and the explicit `latest` tag, then review and approve it with
      npm 2FA.
- [x] Verify the public package and repository-linked provenance, and move
      `next` to `1.0.0`.
- [ ] Confirm in npm's package settings that publishing access requires 2FA
      while disallowing traditional publish tokens. The CLI cannot read this
      setting; do not infer it from the successful trusted publication.
- [x] Dispatch the existing release workflow for `v1.0.0`; require it to verify
      both `latest` and `next` before publishing the draft GitHub Release.
- [x] Follow up on the upstream courtesy issue with the maintained repository,
      npm package, migration guidance, and stable release links.

Stable release execution began on 2026-08-07 after the complete local gate
passed and release-it atomically pushed release commit `0c90ca4` plus annotated
tag `v1.0.0` at 2026-08-06 22:20 UTC. That push occurred during GitHub's
critical Actions incident of 2026-08-06 15:22 UTC through 2026-08-07 02:04 UTC.
GitHub's 22:18 UTC status update—two minutes before the push—said webhook
triggers remained throttled and many push and pull-request events were not
starting workflows. The resolution later confirmed that some events were not
processed and could not be replayed automatically. This is the recorded cause
of the missing release workflow; the repository configuration and scripts were
not broken.

After the incident resolved and no run existed to rerun, the documented
last-resort recovery recreated only `refs/tags/v1.0.0` against the same
annotated tag object. Workflow
[#31140176256](https://github.com/IsaacInsoll/react-grid-gallery/actions/runs/31140176256)
then passed the complete release gate, staged the exact checked tarball through
OIDC, and created the draft GitHub Release. npm 2FA approval published `1.0.0`
with repository-linked provenance and moved `latest` to it. The post-release
audit found the expected manual follow-through still pending: `next` remained
on `1.0.0-rc.0` and the GitHub Release remained draft. `next` was moved to
`1.0.0`, then finalization workflow
[#31149064849](https://github.com/IsaacInsoll/react-grid-gallery/actions/runs/31149064849)
verified both distribution tags and published the GitHub Release at 2026-08-07
04:58 UTC. The upstream courtesy follow-up was also posted. GitHub's incident
record is [githubstatus.com/incidents/qcvjkzcs7j74](https://www.githubstatus.com/incidents/qcvjkzcs7j74).

1. Choose initial version.
   - First scoped package release version: `1.0.0`.

2. Prepare release notes:
   - State this is a maintained fork.
   - List packaging changes.
   - List PR #73 behavior fix.
   - Include attribution.
   - Maintain both `CHANGELOG.md` and GitHub Releases.
   - Use curated changelog/release notes, not purely generated commit summaries.
   - Confirm README installation/import examples use
     `@picr/react-grid-gallery`, the obsolete IE 11 statement is gone, and the
     compatibility table describes the actual ESM/React/browser requirements.
   - Confirm `docs/MIGRATION.md` records the package rename, ESM-only output,
     removed CommonJS/UMD entrypoints, unpublished `src`, React 18 minimum, and
     removed custom-thumbnail `imageProps.key` contract.
   - Add the final `1.0.0` changelog entry only after the release contents are
     final; explain that `1.0.0` starts a new scoped release line and is not a
     downgrade from upstream `1.0.1`.

3. Publish:
   - Treat the absence of the provenance-capable publish workflow as a release
     blocker. Local publishing is intentionally unsupported.
   - Confirm npm scope access for `@picr`.
   - Completed 2026-08-05: bootstrap the package with a `1.0.0-rc.0`
     prerelease from GitHub Actions using a temporary granular token,
     provenance, and the explicit `next` distribution tag. npm also assigned
     `latest` during the first package registration despite the explicit tag.
     Accept this one-time bootstrap exception because the package had not been
     announced and stable `1.0.0` will replace `latest`; later prereleases must
     not move a stable `latest` tag.
   - Use OIDC trusted publishing without `NODE_AUTH_TOKEN`. Because
     `actions/setup-node` v7 no longer supplies a dummy token value, set
     `NODE_AUTH_TOKEN` explicitly and only on an approved emergency publish
     step that genuinely uses token authentication.
   - Completed 2026-08-05: remove the `NPM_BOOTSTRAP_TOKEN` GitHub environment
     secret and revoke the corresponding granular token in npm account settings
     immediately after the prerelease exists.
   - Configure the package's trusted publisher for stage-only permission and
     bind it to a GitHub `npm-publish` environment. Restrict that environment to
     release tags, but do not add a redundant GitHub manual-review gate.
     Use GitHub owner `IsaacInsoll`, repository `react-grid-gallery`, workflow
     filename `release.yml` (npm accepts only the filename), environment
     `npm-publish`, and allow `npm stage publish` only. After verifying OIDC,
     require 2FA and disallow traditional tokens in package publishing access.
   - Choose and stabilize the release workflow filename before trusted-publisher
     setup. Treat any rename as a coordinated security change: update npm's
     binding first and verify it before another release.
   - Stage `1.0.0` through GitHub Actions/OIDC with the explicit `latest` tag,
     review the staged tarball, and approve it manually with npm 2FA. npm's
     staged approval is the single human release gate.
   - Keep `next` present permanently. It points to a prerelease while that
     prerelease is ahead of stable; after approving a stable release, move
     `next` to the same version as `latest` before announcing the release.
   - Preserve provenance on both the bootstrap prerelease and stable release.
   - Verify npm displays the expected repository-linked provenance for
     `1.0.0-rc.0` before staging `1.0.0`.
   - Avoid long-lived npm publish tokens where trusted publishing can replace
     them.

4. Release workflow gates:
   - Publish only after CI passes.
   - Release workflow should run at least `npm ci`, `npm run format:check`,
     `npm run typecheck`, `npm run build`, `npm test`, and
     `npm run package:check`, followed by `npm pack --dry-run`.
   - Use npm 12.0.2 on a supported release-job Node version; do not rely on the
     npm version bundled by the runner image.
   - Prefer publishing from a tag/GitHub release rather than local manual
     publish, except for emergency recovery.
   - Configure `release-it` before the first release.
   - `release-it` should handle the version bump, release commit, annotated tag,
     and atomic push. The tag-triggered workflow owns npm publishing and GitHub
     Release creation.
   - Exact-pin `release-it` 21.0.0. It is the newest eligible release under the
     seven-day intake gate on 2026-08-03; 21.0.1 remains too new.
   - Treat release-it as sensitive publishing tooling. Ignore routine
     Dependabot updates for it without suppressing security updates, and require
     the isolated synchronized-main release smoke test for deliberate upgrades.
   - Use one release-it run from synchronized `main`. Permit the maintainer to
     bypass the required-pull-request rule only for release-it's generated
     version commit and annotated tag; retain required pull requests for all
     ordinary development work.
   - Keep npm and GitHub Release publishing disabled in release-it. The
     tag-triggered GitHub Actions workflow owns npm publishing, provenance, and
     GitHub Release creation with scoped workflow permissions.
   - Fetch `origin/main` before release, require local `main` to match it exactly,
     and permit only one unstaged tracked file: `CHANGELOG.md`. Never add
     untracked planning files to a release commit.
   - Do not give local release-it a GitHub token. The publish workflow uses its
     scoped, short-lived `GITHUB_TOKEN` only when creating the GitHub Release.
   - Use one preflight script for dry runs and real releases. It must run the
     worktree guard, validate the exact changelog section, and print the public
     release notes. The dry-run wrapper then invokes release-it because
     release-it intentionally simulates rather than executes write-classified
     lifecycle hooks in dry-run mode.
   - Do not restore a release-note pull request for the single-maintainer release
     path. Require the maintainer to inspect the exact notes printed by preflight
     before continuing; the full local gate still checks their formatting.
   - Before changing the version, run formatting, linting, source and declaration
     type checks, unit and browser tests, packed-consumer and package checks, and
     both dependency audits. Do not run this complete gate twice merely to make
     the dry-run preview green.
   - Record that local release checks run against the current package version.
     The tag workflow's repeated package gates are the authoritative validation
     of the final versioned tarball.
   - In the same run, release-it bumps `package.json` and `package-lock.json`,
     creates the release commit and annotated tag, and pushes both to `main`.
   - Push the release commit and annotated tag atomically so a branch-protection
     rejection cannot leave a remote tag pointing at an unpushed commit.
   - Require exactly one non-empty `## v<version>` changelog section, optionally
     suffixed with `/ YYYY-MM-DD`, and use that curated section as GitHub Release
     notes.
   - After successful npm publishing or staging, have the tag workflow create
     the GitHub Release from that same section. Do not expose a public GitHub
     Release before the npm version is available; a draft may bridge staged npm
     approval when needed.
   - Split release authority across jobs. An unprivileged validation job runs
     the complete gate, preserves one checked tarball, and records its SHA-512;
     the `id-token: write` job verifies and publishes or stages only those exact
     bytes; a separate `contents: write` job owns GitHub Release creation.
   - Completed after the bootstrap prerelease: remove the one-off direct token
     branch and its `NPM_BOOTSTRAP_TOKEN` reference from the permanent workflow.
     Every later tag uses OIDC and `npm stage publish` without
     `NODE_AUTH_TOKEN`.
   - Do not retain a generic emergency-token switch in the permanent workflow.
     An emergency recovery must use a focused reviewed workflow change limited
     to the exact release tag, followed immediately by token revocation, secret
     removal, and restoration of the stage-only workflow.
   - Create a draft GitHub Release after staging. Once npm 2FA approval makes
     the version public, manually dispatch the same `Release` workflow with the
     existing tag. Prerelease finalization verifies `next` and rejects movement
     of `latest`; stable finalization verifies both `latest` and `next` point to
     the stable version before publishing the draft. This dispatch is
     announcement synchronization, not a second package-publication approval.
   - If OIDC staging fails after the tag is pushed, first correct the npm trusted
     publisher or GitHub environment and rerun the failed job against the
     existing tag. Do not delete and recreate tags by default. If workflow code
     at the tag is defective, stop, inspect npm state, and record a focused
     recovery decision; re-tag an unpublished version only as a last resort.
   - An actual checked `npm pack` supersedes a separate `npm pack --dry-run` in
     the release workflow because it validates and preserves the artifact that
     is subsequently sent to npm.
   - GitHub Actions should perform npm publishing via trusted
     publishing/provenance.
   - `release-it` should fail if `CHANGELOG.md` has not changed for the release.

## Clean-Break Items to Consider

These are worth deciding before the first publish because they are harder to
change later without breaking users.

- Package name and npm scope: `@picr/react-grid-gallery`.
- First scoped package version: `1.0.0`.
- Package description: `Justified image gallery component for modern React
applications.`
- Package format: ESM-only.
- Repository metadata: use
  `git+https://github.com/IsaacInsoll/react-grid-gallery.git`, the fork's issue
  URL, and the repository README as the initial homepage.
- Publish defaults: set `publishConfig.access = "public"` and
  `publishConfig.provenance = true`.
- Build tooling: try exact-pinned `tsdown` first and accept it only if a small
  plugin-free config passes every package/type/consumer gate without output
  patching. Fall back to Vite library mode plus `tsc --emitDeclarationOnly` if
  it does not. Keep package exports manual in either case.
- Node engine: `>=22`.
- Node engine rationale: this intentionally limits supported installs/tooling
  and SSR to maintained Node lines even though the browser bundle is ES2020;
  older EOL Node versions are not supported and may fail under `engine-strict`.
- React peer dependency range: `>=18.0.0 <20.0.0`, backed by React 18 and 19
  tests.
- TypeScript tooling: use TypeScript 6.0.2 consistently for development,
  typechecking, lint integration, and stable `tsc` declaration emit,
  enable `strict: true`, and require `npm run typecheck` in CI and releases.
- TypeScript consumers: support TypeScript `>=5.5` and test generated
  declarations with TypeScript 5.5, 6.0.2, and the current TypeScript 7 release.
- Additional type strictness: the initial baseline enables
  `noImplicitReturns`, `noFallthroughCasesInSwitch`,
  `allowUnreachableCode: false`, and `allowUnusedLabels: false`. ESLint will own
  unused-code policy. The ESM migration enables
  `noUncheckedSideEffectImports`, `verbatimModuleSyntax`, `isolatedModules`, and
  `moduleDetection: "force"`. Assess `exactOptionalPropertyTypes` and
  `noUncheckedIndexedAccess` separately. Keep `skipLibCheck` only because
  tsdown's declarations expose uninstalled optional peers, and reassess it when
  upgrading tsdown.
- Public API: package root exports only unless deep imports are deliberately
  supported.
- Public root exports for `1.0.0`: keep `Gallery`, `CheckButton`,
  `buildLayout`, `buildLayoutFlat`, and intended public types.
- Package exports: include `"."` and `"./package.json"`.
- Root export conditions: use `types`, `import`, then `default`, with both
  runtime conditions pointing at the same ESM file. Do not add a CommonJS file
  or explicit `require` condition.
- Tarball contents: publish `dist`, license, readme, changelog,
  acknowledgements, and package metadata; do not publish tests, screenshots,
  Storybook, examples, detailed docs, or source unless intentionally changed
  later.
- Source maps: intentionally omit both map types for `1.0.0` because
  `tsdown@0.22.14` cannot emit the JavaScript map in this build without leaving
  a dangling declaration-map reference. Reassess on a future tsdown upgrade.
  Track the related open tsdown coupling bug
  [rolldown/tsdown#360](https://github.com/rolldown/tsdown/issues/360). After
  launch, reproduce with the latest pinned candidate; restore maps only if both
  artifacts are valid, or file a narrower upstream issue for the missing
  `index.d.ts.map` behavior if it still reproduces and no exact report exists.
- Release workflow: use GitHub Actions trusted publishing/provenance from the
  first release.
- Release tooling: configure `release-it` for the version commit and atomic tag
  push; keep human-curated changelog notes; fail release if `CHANGELOG.md` has
  not changed; create the GitHub Release from the tag workflow.
- Development version: use unpublished `0.0.0-development` before the first
  scoped prerelease so `1.0.0-rc.0` is a forward SemVer transition.
- Branch name: rename default branch to `main`.
- Package manager: keep npm and `package-lock.json`.
- Package manager version: pin npm 12.0.2 plus its Corepack-generated SHA-512
  integrity hash in `packageManager`; pin the same version in release
  automation.
- Package manager enforcement: CI enables Corepack and installs the exact
  `packageManager` version before `npm ci`, so the field is operational rather
  than informational. Document the same setup in `CONTRIBUTING.md`.
- Corepack lifecycle: Node stops bundling Corepack from Node 25. Install
  exact-pinned userland `corepack@0.35.0` before invoking Corepack in every CI
  job; `scripts/install-corepack.mjs` fetches the exact tarball without running
  package scripts and verifies it against the repository's committed SHA-512
  before global installation. This release supports the current Node 22, 24,
  and 26 lines. Use the same verified bootstrap in every job so CI does not
  depend on runtime-bundled Corepack versions. Keep the integrity-pinned npm
  12.0.2 `packageManager` descriptor as the authority for npm selection.
  Reassess and deliberately update both pins and hashes when a future Node
  baseline requires it; do not assume Node supplies the `corepack` executable.
- Lockfile format: the inherited v2 lock was regenerated with npm 12.0.2 as
  lockfile version 3. The remaining-dependency pass refreshes eligible
  transitive resolutions with npm 12.0.2 while preserving cross-platform
  optional entries. Keep the full Node 24 baseline and add Node 22/26
  compatibility jobs so clean npm 12 installs and package checks cover all
  three supported CI lines. PR #10 and the final landing PR #11 passed the Node
  22, Node 24, Node 26, and browser jobs with the refreshed locks. Rolldown
  1.2.1's optional WASI binding explicitly requires prerelease `@emnapi` 2.0
  packages while Vite's nested Rolldown 1.1.5 binding requires stable 1.11
  packages. Preserve both exact version trees; do not hand-edit or force-update
  this platform-specific lock metadata merely because a single-host `npm ls`
  reports an optional dedupe.
- Package lifecycle: use `prepack` or an equivalent guard so packed and
  published artifacts are built from current source.
- Formatting: add Prettier now with check/write scripts and ignore generated or
  heavy files. `npm run format:check` should run in CI.
- Linting: use exact-pinned ESLint 10.8.0, `typescript-eslint` strict
  type-checked rules, `@eslint-react`'s TypeScript preset, the official React
  Hooks latest recommendation, and scoped Vitest/Playwright presets. Keep
  formatting in Prettier, reject lint warnings, and require `npm run lint` in
  CI and release checks. Accessibility and Storybook plugins remain tied to
  their later dedicated work.
- Dependencies: update modernization-relevant dependencies and remove packages
  made obsolete by the ESM-only build. Keep direct development dependencies
  exact-pinned; use reviewed grouped Dependabot updates rather than semver
  ranges for intentional version movement. On 2026-07-30, all direct root and
  fixture dependencies were current except the deliberately older React 18 and
  TypeScript 5.5 compatibility fixtures. The focused dependency pass therefore
  updates only eligible transitive resolutions. The npm audit remains clean.
- Testing: migrate to Vitest and Playwright before `1.0.0`; compare Jest and
  Vitest locally, map old browser scenarios to Playwright, human-review old and
  new snapshots side by side, and leave only the new systems on `main`.
- Vitest: exact-pin Vitest 4.1.10 and Node-baseline-compatible jsdom 29.1.1;
  use explicit Vitest imports, Testing Library with automatic cleanup, and
  `@testing-library/jest-dom/vitest`.
- Playwright: use Chromium-only browser/visual tests for the first release,
  exercising a built ESM fixture page in the official Playwright Linux
  container pinned by immutable digest and used identically locally and in CI.
  `@playwright/test` 1.62.0 was still current during the 2026-07-30 dependency
  pass, so its matching digest-pinned image and reviewed snapshots remain
  unchanged.
- Package validation: require `publint` and Are the Types Wrong against the
  packed ESM artifact.
- Tarball validation: create one real npm tarball and enforce an exact file
  allowlist by inspecting that archive with `tar`; adding acknowledgements or
  any other published file requires an intentional check update.
- API compatibility: preserve and compile-test the original component props,
  callbacks, helpers, generics, and intended package-root types. This component
  API compatibility does not include package names or module systems.
- Browser/SSR compatibility: define the output target and `ResizeObserver`
  policy, remove the IE 11 claim, and test server rendering plus hydration.
- Cleanup: perform a stale-file audit before publish and remove obsolete configs,
  workflows, snapshots, editor metadata, old package references, and the legacy
  examples/playground toolchains if the separate Storybook issue has not already
  replaced them.
- Demo/docs: separately track Storybook with its React-Vite framework as the live
  demo, lightweight consumer documentation site, local playground, and source
  of additional Playwright scenarios. Introduce it alongside the current
  dist-backed browser fixture; migrate existing scenarios only after explicit
  behavior and screenshot parity, while retaining direct browser coverage of
  the built package artifact. Story source should demonstrate package-root
  imports without creating deep-import contracts, with Storybook's Vite config
  resolving that root per mode: `src/index.ts` for local dev-server HMR, and
  `dist/index.js` for `build-storybook` and any Playwright-tested static build,
  so browser checks keep exercising the built artifact as the quality bar
  requires. Keep `docs/API.md`, `docs/MIGRATION.md`, and `ACKNOWLEDGEMENTS.md`
  authoritative rather than duplicating their content. Use only deterministic
  repository-owned runtime assets, keep standalone Playwright screenshots, and
  avoid Chromatic and Storybook's Vitest browser addon initially. This work may
  land before or after `1.0.0` and is not a release blocker.
- Storybook should be a polished developer-facing product rather than a minimum
  test harness. Give it strong onboarding, curated examples, useful controls,
  responsive and edge-case guidance, and a deliberate visual presentation.
  Keep the repository Markdown authoritative and render or link it instead of
  creating a second API or migration narrative that can drift.
- The historical upstream documentation and every inherited demo were audited
  again during the Storybook implementation on 2026-08-07. Preserve their most
  useful teaching patterns: controlled bulk selection, locked selected state,
  lightbox/viewer integration through `onClick`, progressive `nano`
  placeholders, genuine lazy thumbnail rendering, and clear intrinsic-dimension
  guidance. Replace the two historical provider examples with one current,
  working Yet Another React Lightbox integration because PICR uses YARL and the
  example therefore reflects a real maintained consumer. Keep the Gallery API
  and surrounding guidance provider-neutral. Exact-pin YARL as a Storybook-only
  development dependency, group its updates with Storybook, and keep it out of
  the published package contract and tarball. Do not restore remote demo images,
  retired CRA/Nextra projects, or stale CodeSandbox links; the deterministic
  Storybook stories and controls replace them.
- Storybook implementation decisions, initially identified on 2026-08-05 and
  resolved on 2026-08-07 before implementation:
  - GitHub Pages deployment needs `id-token: write`, which the release controls
    otherwise reserve for the npm publishing job. Publishing a demo site is a
    separate trust domain from publishing the package. Allow the exception only
    on the environment-protected Pages deployment job, alongside `pages: write`;
    keep the build job read-only. Use the official Pages artifact flow only and
    never push a `gh-pages` branch, because `main` is protected and direct
    pushes are reserved for the release process.
  - `@storybook/react-vite` peers on Vite, making Storybook a fourth
    participant in the coordinated Vite axis alongside root Vite, the
    visual-baseline fixture, and the packed consumer. Update the contributor
    guide's Vite paragraph when Storybook lands.
  - Give Storybook its own Dependabot group rather than leaving its 15+
    frequently released packages inside the single wildcard group, so a
    Storybook major cannot block every other routine update. Its dependencies
    remain subject to the seven-day intake gate.
  - Accept that the additional transitive development dependencies increase the
    chance of dependency review blocking unrelated pull requests, since that
    check fails on moderate-or-higher advisories in the development scope. Keep
    the policy unchanged: investigate, upgrade the coordinated Storybook group,
    or wait for an upstream fix rather than suppressing the review gate.
  - Make `build-storybook` required by running it in the existing required
    `Format and build` job. Storybook renders against root React 18, while
    dual-React coverage remains the browser fixture's responsibility.
  - Use the coordinated Storybook `10.5.5` package line, the newest stable line
    that satisfies the seven-day intake gate on 2026-08-07, and pin each direct
    Storybook dependency exactly. Include the official accessibility addon as a
    developer feedback surface, without treating it as a substitute for the
    separately scoped accessibility work.
  - Use exact-pinned `yet-another-react-lightbox@3.32.2` for the working viewer
    story. It is MIT-licensed, supports React 18 and 19, satisfied the seven-day
    intake gate on 2026-08-07, and matches PICR's maintained 3.32 line. This is
    an example-only development dependency: it ships in the documentation site,
    not the npm package, and its updates belong to the Storybook Dependabot
    group.
  - A clean install on 2026-08-07 surfaced newly published high-severity
    advisory `GHSA-2v37-7h3g-55p8` in Vite's transitive `nanoid@3.3.16` path.
    Move both the root and independently managed packed-consumer lockfiles to
    patched `3.3.17`, which is already allowed by PostCSS's declared range.
    Because the fix was only four days old, use the documented narrow
    `min-release-age-exclude[]=nanoid` urgent-security exception while resolving
    those locks. Keep `nanoid` transitive so no override leaks into published
    package metadata. Remove the temporary `.npmrc` exception on or after
    2026-08-10, once `3.3.17` has aged seven days; never broaden the exception or
    add `nanoid` as a direct dependency.
    Completed 2026-08-10: remove the narrow exception after the patched release
    passed the seven-day intake gate; both lockfiles remain on `3.3.17`.
  - Extend the ESLint, TypeScript, Prettier, and Git ignore scopes to the new
    Storybook files; the current ESLint globs would otherwise leave stories and
    Storybook configuration without type-aware linting. Map the package-root
    specifier to `src/index.ts` in the repository test TypeScript configuration
    so clean-clone source typechecking and typed linting do not accidentally
    depend on a pre-existing `dist` build; production Storybook builds must
    continue resolving that same specifier to `dist/index.js`.
  - The maintainer's local review on 2026-08-10 found that the initial polished
    component catalogue still put too much narrative chrome inside every canvas
    and did not sufficiently demonstrate Gallery inside realistic applications.
    Keep headings and explanations in the Storybook docs layer, use semantic
    canvas wrappers without repeated document landmarks, and make displayed
    source consumer-focused. Add a flagship photo-management example and
    focused live coverage for the inherited orientation API, layout helpers,
    `CheckButton`, range selection, multiple tags, and links. Keep `maxRows`
    discoverable in the Playground initially, then add a focused two-row album
    preview only when the application-owned Show all interaction makes its
    purpose clearer than a bare prop demo. Consolidate redundant responsive,
    read-only, and empty canvases rather than optimizing for story count.
    The visual review also exposed that the preserved style props replace their
    internal element style rather than shallow-merging it. Examples and API
    guidance must retain layout-critical thumbnail/viewport dimensions or merge
    `imageProps.style` in a custom thumbnail instead of suggesting partial style
    objects that distort the gallery.
    Keep `defaultContainerWidth` as an especially clear SSR recipe backed by the
    existing server-render/hydration browser fixture; a normal client-rendered
    Storybook canvas cannot honestly demonstrate the server's first paint and
    should not simulate one.
  - Use Isaac Insoll's dog photographs from PICR's test-media directory for the
    realistic application examples, with his explicit permission as their
    owner. Preserve the original JPEG files for full-resolution lightbox slides
    and use repository-generated WebP derivatives for gallery thumbnails plus
    tiny local placeholders. Record the provenance in acknowledgements. Keep
    abstract repository-generated SVGs for isolated API and layout scenarios.
    Do not embed a remote YouTube player: a mixed-destination tile may link to a
    deliberately playful video, but Storybook must make no runtime request to
    YouTube or another third-party host before the user follows that link.
    Lead the Examples section and Welcome page with a complete album that opens
    its original JPEGs in YARL and offers a small, useful thumbnail-size
    control. Keep optimized WebP derivatives in the grid: viewers should see
    representative full-quality photographs without making every thumbnail
    download an original. Fold the concise component mental model into Getting
    Started rather than maintaining a redundant onboarding page. Keep canvas
    surfaces content-sized instead of filling the viewport, explicitly keep
    documentation stories inline, and use a simple overflow-clipped docs
    wrapper rather than nesting the full isolated-story presentation inside
    Storybook's own Canvas. Reserve a stable scrollbar gutter and keep the
    vertical rail present in docs mode and clip Storybook's nested `.docs-story`
    scroller. This prevents a gallery growing across either preview threshold
    from creating a scrollbar-width/layout-height feedback loop in headed Linux
    Chromium. Give the Welcome page prominent links to the GitHub repository,
    npm package, and PICR as the real self-hosted client-photo-delivery
    consumer.
    Completed 2026-08-10: the revised site uses optimized WebP thumbnails,
    inlined tiny WebP placeholders, and byte-for-byte original JPEG lightbox
    slides. Its product examples, focused API stories, all handwritten and
    generated docs pages, no-remote-request policy, and docs-canvas resize
    regression pass the pinned 70-test browser suite after the masonry and
    troubleshooting coverage was added and the overlapping example page was
    consolidated. The resize fix was also
    reproduced and verified for 180 consecutive frames in headed Chromium 151
    on Linux at the maintainer's 4K viewport and after narrowing the viewport.
    The complete local `npm run release:check` passes after the maintainer's
    final local-review refinements.
  - Rebase the Storybook work onto the post-`1.0.0` `main` line before local
    review so the documentation demonstrates the newly shipped masonry API as
    well as justified rows. Lead the focused examples with a layout workshop
    that provides in-canvas layout buttons, range sliders for target size and
    margin, an item-count slider that repeats the deterministic local collection
    from 1–50 items, and a live copyable recipe. Prefer this constrained configurator to
    an embedded CodeSandbox or browser compiler initially: it is faster,
    deterministic, dependency-light, and preserves the documentation site's
    no-runtime-network boundary while still covering the useful middle ground
    between static examples and editing an application.
  - Audit all 158 upstream issues at a high level, including 13 still open and
    145 closed, rather than looking only for current bugs. The recurring
    documentation misunderstandings are hidden or zero-width containers,
    intrinsic dimensions being mistaken for CSS thumbnail sizes, controlled
    selection being expected to mutate itself, replacement style props being
    expected to merge, and Gallery being expected to own loading, local asset
    resolution, fixed-column grids, navigation, or viewer behavior. Add a
    symptom-led troubleshooting guide and focused hidden-container and
    incremental-loading examples. Keep this documentation audit distinct from
    reproducing or adopting individual upstream behavior requests.
  - Keep the Welcome hero readable at wide and narrow sizes without overlapping
    its destination cards. Give the GitHub, npm, and PICR destinations local
    inline marks and richer descriptions without adding remote icon assets or
    runtime requests.
  - The maintainer's final information-architecture review on 2026-08-10
    deliberately consolidates the complete Album preview and the overlapping
    Layout workshop into one first-position Gallery workshop. Keep it simple
    enough to embed immediately below a compact Welcome hero: three meaningful
    size presets, justified/masonry selection, an optional controlled-selection
    toggle, the 1–50 repeated-item slider, and the original-resolution YARL
    viewer. Keep margin fixed there; arbitrary prop tuning remains in Gallery /
    Playground. Remove the decorative Welcome value cards, place project links
    after the interactive gallery, and reduce Playground to one isolated story.
    Relocate the genuinely distinct narrow-container and multiple-gallery
    scenarios to Layout edge cases and Recipes rather than deleting their
    coverage. Present migration environment differences as an upstream/fork
    comparison table, describe late-2024 modern ESM React projects as usually
    needing only the package-name change when they meet the explicit minimums,
    and make the hosted documentation link prominent near the top of the
    README. Retain unused inherited image attribution under a clearly historical
    heading rather than implying those assets ship in the maintained site or
    erasing upstream credit.
  - Lead the repository README with a focused screenshot of the same Gallery
    workshop so visitors can understand the package before reading the API
    narrative. Keep the image linked to the live workshop, repository-owned,
    free of remote runtime dependencies, and reasonably sized for GitHub: use a
    pixel-faithful 1200px-wide WebP derived from the maintainer-provided local
    Storybook capture rather than a generatively recreated interface.
  - The maintainer's second local review on 2026-08-10 keeps the workshop
    deliberately approachable while replacing stock selects with a segmented
    binary layout control. A later local review replaces the three size presets
    with a physically compact 100–300px slider in 10px steps so developers can
    explore density without turning the Welcome example into a full prop panel.
    Keep margin tuning in Playground. Fix every copyable zero-argument `useRef`
    for React 19, keep YARL slide arrays stable across unrelated renders, and
    collapse duplicated layout branches in the flagship source. Resize only the
    grid WebPs to an 800px long edge while retaining the original JPEG viewer
    assets byte-for-byte.
  - Make long guides navigable with tables of contents and real internal links,
    and group Gallery controls by purpose with visible defaults. Enable the TOC
    globally because Storybook does not apply page parameters from unattached
    MDX entries; include `h2` and `h3` headings and hide the otherwise-global
    rail on the focused Welcome page. Add a focused masonry aspect-ratio case,
    an application-owned empty-state answer, and the purposeful `maxRows`
    preview above. Storybook 10.5.5 does not expose the proposed story-view
    `docs.codePanel` API, so do not add a dead parameter or a third-party
    code-panel addon; keep its built-in documentation Canvas source controls.
  - Treat `package.json` as the documentation-build version, not as a live claim
    about npm's `latest` tag. Inject it at build time with no visitor network
    request. Render maintained `CHANGELOG.md` entries as release cards: entries
    ordered above the documentation version are Upcoming without dead links,
    while current and previous entries link to their exact GitHub Release and
    npm version. Keep inherited release history available and attributed.
  - Add a distinct Contributors navigation group. Keep `CONTRIBUTING.md`
    authoritative for repository policy and add `docs/TESTING.md` as the
    authoritative high-level map of fast checks, packed-package boundaries,
    browser coverage, security, and release validation. Render both in
    Storybook instead of maintaining a second narrative there.
  - Follow the operating system's light/dark preference for Storybook manager
    and documentation chrome, including live manager updates. Preserve
    intentionally art-directed example surfaces such as album paper and the
    dark photo manager rather than recoloring product examples generically.
  - Keep local production review explicit: `npm run storybook` uses source with
    HMR, while `npm run storybook:preview` builds Storybook against `dist` and
    serves it on port 6007. Document that command boundary in contributor and
    testing guidance, but do not display maintainer-only build status on
    consumer-facing pages. Keep the Welcome hero distinctive but compact enough
    that the interactive gallery remains the visual focus of the first
    viewport. Fill the entire isolated-story iframe with its themed surface so
    the manager never exposes an unpainted light strip below short stories in
    dark mode; keep inline documentation canvases content-sized to avoid
    restoring their resize feedback loop.
  - Completed 2026-08-10 through
    [PR #27](https://github.com/IsaacInsoll/react-grid-gallery/pull/27): all
    required hosted checks passed in
    [CI run #31359292755](https://github.com/IsaacInsoll/react-grid-gallery/actions/runs/31359292755),
    including the clean-clone package-root type-resolution correction found by
    the first hosted attempt. The protected
    [Pages run #31359400123](https://github.com/IsaacInsoll/react-grid-gallery/actions/runs/31359400123)
    then deployed the maintained documentation successfully at the configured
    repository base path.
- Consumer fixtures: keep at least one Vite + React + TypeScript smoke test for
  packed package installs.

## Security Goals

The separate supply-chain issue draft was retired on 2026-08-05 after the
repository-controlled hardening was completed. Its remaining unchecked items
were the stable release's OIDC staging, npm 2FA approval, and `latest`/`next`
tag verification; those execution steps remain tracked in Phase 8 and
`docs/RELEASING.md` rather than in a duplicate issue draft.

Status: completed on 2026-08-03 through PR #16. Repository-controlled hardening
is `929ec29`, with browser-policy clarification in `94ca72f` and review
corrections in `ec2204a`. GitHub API verification found Dependabot
alerts, private vulnerability reporting, secret scanning, and push protection
enabled; Dependabot security updates were then enabled. Auto-merge remains
disabled. The branch adds routine npm and GitHub Actions update groups, npm
cooldowns, the seven-day npm release-age gate, required dependency review,
scheduled high-severity auditing, and `docs/RELEASING.md`. Hosted checks and the
dependency-review workflow passed in PR #16. Its GitHub Actions-bound context is
required on protected `main`. The default-branch graph refresh closed all stale
alerts for previously deleted example lockfiles, leaving zero open alerts.
Dependabot then opened separate grouped GitHub Actions PR #17 and npm PR #18;
neither was auto-merged solely because CI passed. PR #17 was manually reviewed
and rebase-merged as `48917dc`. PR #18 was closed because Dependabot tried to
normalize deliberately different workspace compatibility axes: it replaced the
React 18 fixture with React 19, replaced the TypeScript 5.5 consumer floor with
TypeScript 6, moved Node types away from the Node 22 support floor, and
downgraded the existing React 19 fixture. Its strict type and packed-consumer
failures correctly blocked the invalid update.

React, React DOM, their type packages, and TypeScript are therefore manually
coordinated compatibility dependencies. Dependabot ignores routine patch,
minor, and major updates for those package names, while `update-types` leaves
security updates eligible. Routine `@types/node` major updates are ignored so
the root stays aligned to the Node 22 support floor; updates within Node 22 and
security updates remain eligible. Review these baselines deliberately and
regenerate both lockfiles together whenever they change. This policy landed in
PR #19 as `ded2411` after all hosted checks passed. Trusted publishing remains
deliberately assigned to the later release workflow.

Testing Library patch and minor updates remain automated, but its major updates
must be coordinated across `@testing-library/react`, `@testing-library/dom`, and
`@testing-library/jest-dom`. Dependabot ignores routine majors for those three
packages without suppressing security updates.

Vite builds the maintained browser fixture that feeds zero-tolerance visual
baselines, and Vitest may resolve its own Vite dependency. Vite and Vitest are
therefore manually coordinated, with the packed consumer's Vite version kept
aligned as a realism policy. Playwright Test is coordinated separately with the
digest-pinned container, browser binaries, and snapshots. Routine Dependabot
updates are ignored for all three packages. The packed consumer remains
independent from the root workspaces and is included explicitly in the
scheduled high-severity audit; repository-level Dependabot security features
are expected to cover its tracked lockfile without a directory entry, pending
confirmation from a real alert. The existing packed-consumer preflight
mechanically rejects shared-version drift, including Vite. GitHub Actions major
updates use the same 30-day cooldown as npm majors; patch, minor, and
unclassified updates retain the 7-day default. The initial follow-up landed
through green PR #20 as `2efc633`; both locked dependency audits reported zero
vulnerabilities before merge.

Release-it is part of publishing authority and its behavior is not exercised by
ordinary package CI. Routine Dependabot updates are therefore ignored without
suppressing security updates. Deliberate upgrades must repeat the isolated
synchronized-main release smoke test, including version commit, tag, and
release-note generation with remote publication disabled.

Security goals:

- Completed 2026-07-29: protect `main`, including administrators, against direct
  and force pushes and deletion.
- Completed 2026-08-05 after release-it merged: allow the maintainer to bypass
  the required-pull-request rule for release-it-generated version commits and
  annotated tags only. API verification records `enforce_admins: false`, while
  force pushes and deletion remain disabled, pull requests remain required,
  required status checks remain strict, and `Format and build`, `Browser tests`,
  `Dependency review`, `Node.js 22 compatibility`, and `Node.js 26
compatibility` remain required. This reduces single-maintainer release
  ceremony without treating branch protection as protection against complete
  owner-account compromise.
- Completed 2026-08-05: require strict `Format and build`, `Browser tests`,
  `Dependency review`, `Node.js 22 compatibility`, and `Node.js 26
compatibility` status checks before merge.
- Completed 2026-07-29: require pull requests with zero mandatory approvals for
  the single-maintainer repository and require conversation resolution.
- Completed 2026-08-04: enable repository auto-merge while retaining rebase-only
  merging and strict required-status checks. Auto-merge remains an explicit
  maintainer choice after review; dependency updates are not opted in solely
  because CI passes.
- Completed 2026-08-03: verify Dependabot alerts and enable security updates.
- Completed 2026-08-03: configure grouped monthly Dependabot routine updates
  for npm and GitHub Actions.
- Completed 2026-08-03: manually review and rebase-merge grouped GitHub Actions
  PR #17. Close grouped npm PR #18 because it erased deliberate React 18,
  TypeScript 5.5, Node 22 type, and React 19 compatibility axes. Exclude routine
  React, React DOM, React type, and TypeScript updates from Dependabot; exclude
  only major `@types/node` updates. These `update-types` rules do not suppress
  security updates. The corrective configuration and contributor guidance
  landed through green PR #19 as `ded2411`.
- Completed 2026-08-03: exclude routine Vite, Vitest, and Playwright Test
  updates from Dependabot because each participates in coordinated test or
  visual artifacts. Include the independent packed-consumer lockfile in the
  scheduled audit while retaining its existing shared-version drift checks.
  Expect repository-level Dependabot security coverage for that tracked
  lockfile and confirm it when a real alert occurs; do not claim a redundant
  directory entry created that coverage. The initial work landed through green
  PR #20 as `2efc633`; the corrected policy landed through green PR #21 as
  `a36e05b`.
- Completed 2026-08-05: leave Testing Library patch and minor updates automated,
  but exclude routine majors for React Testing Library, DOM Testing Library, and
  jest-dom so their React support and test behavior are reviewed together.
  Security updates remain eligible.
- Completed 2026-08-03: apply a 30-day cooldown to GitHub Actions major updates,
  matching npm majors. Retain the 7-day default for other routine action
  updates.
- Completed 2026-08-03: classify exact-pinned release-it as sensitive release
  tooling. Ignore its routine Dependabot updates while retaining security-update
  eligibility, and require an isolated synchronized-main release smoke test for
  upgrades.
- Completed 2026-08-03: configure npm routine-update cooldowns of 30 days for
  major updates and 7 days for minor updates. Patch and unclassified routine
  updates inherit the 7-day default, matching `.npmrc`; security updates remain
  immediate, and dependency PRs do not auto-merge solely because CI passes.
- Completed 2026-08-03: configure pinned npm 12.0.2 with
  `min-release-age=7`. npm rejected `release-it@21.0.1`, published three days
  earlier, accepted the exact `min-release-age-exclude[]=release-it` exception,
  and then completed locked `npm ci` without that exception. Dependabot Core
  v0.379.0 reads this npm setting for routine updates and explicitly overrides
  it to zero for security updates. Use the repeatable exclusion only for a
  reviewed temporary urgent-security exception; never leave broad permanent
  exclusions.
- Pin every action and reusable workflow reference to a full 40-character
  commit SHA, including GitHub-maintained actions, and retain the readable
  release tag in a trailing comment.
- Set explicit default `permissions: {}` in every workflow and grant only the
  minimum permissions required per job. Restrict `id-token: write` to trusted
  publishing and `contents: write` to release operations that require it.
- Completed 2026-08-03: add GitHub dependency review as a required pull-request
  check. The workflow
  uses exact-pinned `actions/dependency-review-action` v5.0.0 and rejects newly
  introduced moderate-or-higher runtime or development vulnerabilities. The
  first run exposed that the dependency graph required an explicit refresh via
  GitHub's vulnerability-alerts endpoint; the rerun passed and the GitHub
  Actions-bound context is now required on protected `main`.
- Completed 2026-08-03: do not hard-fail every pull request on `npm audit`.
- Completed 2026-08-03: run `npm audit --audit-level=high` in a weekly scheduled
  or manually dispatched workflow. Reuse the same command as a future release
  gate. GitHub automatically disables scheduled workflows after 60 days without
  repository activity; Dependabot alerts remain the continuous fallback, and
  the workflow must be re-enabled when work resumes after such inactivity.
- Avoid long-lived npm automation tokens.
- Completed 2026-08-05: use a temporary granular token only to bootstrap the new
  package with a provenance-bearing prerelease, then revoke it and remove the
  token branch from the permanent workflow.
- Use OIDC trusted publishing without `NODE_AUTH_TOKEN`. If an approved
  emergency publish uses a token, set `NODE_AUTH_TOKEN` explicitly only on that
  publish step; `actions/setup-node` v7 no longer creates a dummy value.
- After bootstrap, bind a stage-only trusted publisher to a release-tag-restricted
  GitHub environment without a redundant GitHub reviewer, then require npm 2FA
  approval as the single human gate for staged releases.
- Treat `.github/workflows/release.yml` as the permanent release workflow path
  and part of npm's trusted-publisher binding; configure it before use and
  coordinate npm settings before any rename.
- Completed 2026-08-05: add the permanent tag-triggered release workflow through
  green PR #23 as `887a597`. It uses exact-artifact transfer, isolated npm and
  GitHub permissions, and a manual finalization dispatch after staged npm
  approval. Hosted format/build, Node 22/26, browser, and dependency-review
  checks passed. Create and API-verify the `npm-publish` GitHub environment with
  no reviewer or wait gate and a single custom `v*` tag policy. The tracked
  maintainer guide was synchronized with the live environment through green PR
  #24 as `3987b5d`.
- Completed 2026-08-05: publish
  [`@picr/react-grid-gallery@1.0.0-rc.0`](https://www.npmjs.com/package/@picr/react-grid-gallery/v/1.0.0-rc.0)
  from release commit `f7ae94b` and workflow run
  [#30971442298](https://github.com/IsaacInsoll/react-grid-gallery/actions/runs/30971442298).
  All release gates and exact-artifact publication passed, npm exposes `next`
  and repository-linked SLSA provenance, and the public GitHub prerelease is
  [v1.0.0-rc.0](https://github.com/IsaacInsoll/react-grid-gallery/releases/tag/v1.0.0-rc.0).
  npm unexpectedly also assigned `latest` on initial package registration; the
  maintainer accepted that temporary bootstrap state until stable `1.0.0`.
  The final announcement job failed only on the stricter no-`latest` assertion,
  so the same checked release notes were used to create the prerelease manually.
  The one-use GitHub environment secret was removed, its npm token was revoked,
  and the environment is secret-free again. The npm trusted publisher is
  configured for owner `IsaacInsoll`, repository `react-grid-gallery`, workflow
  `release.yml`, environment `npm-publish`, and the `npm stage publish` action
  only. Stable `1.0.0` verified that OIDC binding before npm 2FA approval on
  2026-08-07.
  The permanent workflow is now stage-only. Keep `next` as a permanent channel:
  prereleases move it ahead of `latest`, while each stable release moves both
  tags to the same stable version before its GitHub announcement.
- Keep npm account and organization 2FA enabled.
- Do not require a second npm organization owner for `1.0.0`; reconsider this if
  project governance or the maintainer model changes.
- Completed before 2026-08-03: use GitHub private vulnerability reporting for
  security reports.
- Completed before 2026-08-03: add a concise `SECURITY.md` and link to it from
  the README.
- Completed 2026-08-03: document release authority and publishing controls in
  `docs/RELEASING.md`.

Avoid these in the first release unless they become necessary:

- React component rewrites.
- Styling changes.
- Masonry layout from PICR PR #82.
- Broad dependency upgrades unrelated to packaging.
- The separately tracked Storybook demo/docs site, which may land before or
  after `1.0.0`.
- New runtime features.
- Accessibility markup and keyboard interaction changes; track these for a
  post-`1.0.0` release.

## Deferred: Accessibility

The current gallery uses clickable non-button elements for image activation and
selection without complete keyboard semantics. Track accessibility as dedicated
post-`1.0.0` work so semantic markup, keyboard behavior, focus styling, and
accessibility tests can be reviewed together rather than mixed into packaging
changes.

## Post-1.0: Review Upstream Issues

After `1.0.0`, complete the separately tracked review of the original
`benhowell/react-grid-gallery` repository's open non-dependency issues for bugs
or fixes that remain relevant to this fork. Triage each item against the
modernized code, link the source issue when work is adopted, and preserve
reporter/contributor credit.

Do not review the original repository's current Dependabot-only pull requests.
This fork is already performing its own dependency updates and security review.
Revisit future upstream pull requests only if they contain human-authored
behavior or bug-fix work.

## Post-1.0: Masonry Layout

Completed on 2026-08-10 after the stable `1.0.0` release. Commits `7614a59` and
`8ada07d` added the library-level `layout?: "justified" | "masonry"` API,
`columnWidth`, `buildMasonryLayout`, and exported masonry layout types for the
separate `1.1.0` feature release. Commit `b981eaa` then added a focused
hidden-container regression fix and supporting documentation.

The reusable frontend masonry direction developed by `opniskanen` /
Olli-Pekka Niskanen in [PICR PR #82](https://github.com/IsaacInsoll/PICR/pull/82)
informed this package API and is credited in the changelog and
acknowledgements. Only the reusable library capability was adopted; PICR
backend, GraphQL, branding, and administration work remain outside this
package.

## Post-1.0: Release 1.1.0

The maintainer decided on 2026-08-10 to release `1.1.0` from the current
post-Storybook `main` state after manually confirming npm's package-level
**Require two-factor authentication and disallow tokens** publishing-access
setting. Do not add upstream-triage fixes or unrelated features to this release
without a new explicit scope decision.

Immediately before running the documented release process, complete the
existing `v1.1.0` changelog section with the maintained Storybook documentation
launch and confirm its release date. Keep that changelog edit as the only
unstaged tracked change required by `docs/RELEASING.md`; do not commit it through
an ordinary documentation pull request first. Run the full stable-release flow,
approve the staged package with npm 2FA, move `next` to `1.1.0` after npm
publication, and require finalization to verify both `latest` and `next` before
publishing the GitHub Release.
