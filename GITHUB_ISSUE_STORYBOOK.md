# Add a maintained Storybook demo and documentation site

## Context

The inherited Nextra/Next site, separate Create React App projects, Parcel-based
playground, and the obsolete GitHub Pages workflow were all removed during
first-release repository cleanup. Their useful scenarios were preserved in the
maintained repository documentation and their credits in `ACKNOWLEDGEMENTS.md`.
There is currently no maintained interactive demo site.

Stable `1.0.0` was published on 2026-08-07. This is independent post-release
work and was not part of the first-release gate.

## Goal

Create one maintained Storybook using its React-Vite framework. It should serve
as the consumer-facing gallery demo, polished and genuinely helpful developer
documentation site, local development playground, and source of additional
deterministic Playwright scenarios. Give it strong onboarding, curated examples,
useful controls, responsive and edge-case guidance, and a deliberate visual
presentation. Introduce it alongside the current browser fixtures before
deciding whether any existing scenarios should migrate.

## Constraints And Decisions

Storybook touches several established repository policies. These decisions were
resolved on 2026-08-07 before implementation.

- **GitHub Pages deployment requires `id-token: write`.** Allow this explicit
  exception only on the environment-protected Pages deployment job, alongside
  `pages: write`; keep the build job read-only. Deploy through the official
  Pages artifact flow only. Never push a `gh-pages` branch: `main` is protected
  and direct pushes are reserved for the release process.
- **Vite becomes a four-way coordinated axis.** Root Vite, the visual-baseline
  browser fixture, and the packed-consumer fixture are already coupled and
  excluded from routine Dependabot updates for that reason.
  `@storybook/react-vite` peers on Vite and adds a fourth participant. The
  contributor guide's Vite paragraph must be updated when Storybook lands.
- **Storybook needs its own Dependabot group.** The root npm entry currently
  groups every dependency under one wildcard pattern. Storybook ships 15+
  packages that must move together and releases frequently, so a separate group
  keeps a Storybook major from blocking every other routine update. New
  dependencies are also subject to the seven-day `min-release-age` intake gate.
- **Dependency-review exposure increases.** Pull requests fail on
  moderate-or-higher advisories in runtime _and_ development scopes. Storybook
  adds a substantial transitive development surface, which materially raises
  the chance of an advisory blocking otherwise unrelated pull requests. Keep
  the policy unchanged: investigate, update the coordinated Storybook group, or
  wait for an upstream fix rather than suppressing the review gate.
- **`build-storybook` is required.** Run it in the existing required `Format and
build` job so a broken documentation site cannot merge through auto-merge.
- **Storybook renders React 18.** Root React 18.3.1 remains the supported floor;
  dual-React coverage stays the browser fixture's responsibility.
- **Storybook version.** Pin the coordinated `10.5.5` package line, the newest
  stable line satisfying the seven-day intake gate on 2026-08-07.
- **Accessibility feedback is included.** Add the official accessibility addon
  as a helpful authoring and review surface without treating it as a substitute
  for the separately scoped accessibility work.
- **YARL is an intentional example dependency.** Exact-pin
  `yet-another-react-lightbox@3.32.2` as a development dependency for one working
  integration because PICR uses the same maintained 3.32 line. It is MIT,
  supports React 18/19, and passed the seven-day intake gate on 2026-08-07. It
  belongs to the Storybook Dependabot group and must remain outside the
  published package contract and tarball.
- **A narrow security-age exception is temporarily required.** The 2026-08-07
  clean install exposed high-severity `GHSA-2v37-7h3g-55p8` in Vite's transitive
  `nanoid@3.3.16`. Update the root and independently managed packed-consumer
  lockfiles to patched `3.3.17` under the existing PostCSS range and temporarily
  add `min-release-age-exclude[]=nanoid`, because that security fix is four days
  old. Keep `nanoid` transitive so no override enters published package metadata.
  Remove the exception on or after 2026-08-10; do not add a direct dependency or
  broaden the exclusion. Completed 2026-08-10: the patched release reached the
  seven-day intake age and the exception was removed.
- **Application examples are the primary experience.** Review feedback on
  2026-08-10 found that the first implementation was visually polished but too
  often presented one prop inside a prose-heavy frame. Put narrative guidance
  in Storybook's docs layer, keep canvases semantic and source-focused, add a
  flagship photo-manager experience, and consolidate redundant canvases.
- **Lead with one finished workshop.** Merge the overlapping Album preview and
  Layout workshop into one first-position Gallery workshop. Open optimized
  thumbnails as original-resolution YARL slides and expose only the useful
  primary choices: three thumbnail sizes, justified/masonry layout, optional
  controlled selection, and 1–50 repeated items. Keep margin fixed and retain
  arbitrary prop tuning in Playground.
- **Keep onboarding and canvases purposeful.** Fold the short mental model into
  Getting started instead of maintaining a redundant page, and let isolated
  canvas surfaces size to their content rather than filling the viewport. Keep
  documentation stories inline, use a simple overflow-clipped docs wrapper
  instead of nesting the full isolated-story presentation inside Storybook's
  own Canvas, and keep a stable vertical scrollbar rail in docs mode so a
  gallery crossing the viewport-height threshold cannot feed scrollbar width
  back into responsive gallery height in headed Linux Chromium. Clip the
  nested `.docs-story` scroller as well; Storybook's auto-height measurement
  otherwise lets that internal scrollbar create the same loop independently.
- **Make project destinations obvious.** Link GitHub, npm, and PICR prominently
  from Welcome, describing PICR as the real self-hosted client-photo-delivery
  consumer.
- **Real photographs remain local and attributable.** Use Isaac Insoll's dog
  photographs from PICR's test media with his explicit permission as their
  owner. Keep the original JPEGs for full-resolution viewer slides, produce
  local WebP thumbnails/placeholders for the grid, and record their provenance.
  Do not embed a remote YouTube player or add third-party runtime requests.
- **The maintained site documents both layouts.** Rebase this work onto the
  post-`1.0.0` `main` line containing masonry before review. Use a focused
  layout workshop with in-canvas buttons, range sliders, and a live recipe as
  the halfway-interactive editor. Do not add an embedded CodeSandbox, Sandpack,
  or browser compiler initially; the extra dependency and execution boundary
  are not justified while Storybook controls and the workshop cover the useful
  configuration space deterministically.
- **Historical issue patterns inform documentation.** Audit all upstream open
  and closed issue titles and representative discussions, then document
  recurring misunderstandings without conflating that work with reproducing or
  adopting every historical behavior request.
- **Keep the final information architecture lean.** Put the Gallery workshop
  immediately below a compact Welcome hero, remove decorative value cards, and
  move project destinations below the live example. Keep one isolated
  Playground story; relocate narrow-container and multiple-gallery coverage to
  Layout edge cases and Recipes. Use a left-to-right environment comparison in
  Migration, identify unused inherited demo-image credits as historical, and
  place the hosted documentation link near the top of the README.
- **Finish the documentation as a project surface.** Show the package-manifest
  version as a documentation-build label rather than npm `latest`, render
  maintained changelog entries as linked release cards with unreleased entries
  clearly marked, and add a separate Contributors section backed by the root
  contribution policy and an authoritative testing guide.
- **Respect native appearance.** Follow the operating system's light/dark
  preference for Storybook and documentation chrome while preserving examples
  with their own deliberate light or dark product styling.

## Proposed Work

- [x] Add the newest eligible stable Storybook and `@storybook/react-vite`, with
      direct dependencies pinned deliberately
- [x] Use only official Storybook packages for Storybook infrastructure; keep
      YARL as the single deliberate example-only integration dependency
- [x] Add stories for the basic gallery, selection, tags/captions, custom
      overlay, and custom thumbnail scenarios
- [x] Audit the full inherited upstream documentation and examples, not only the
      surviving README summary
- [x] Preserve the useful historical interaction patterns with current package
      imports: bulk and locked selection, a working YARL lightbox with
      provider-neutral Gallery state,
      progressive `nano` placeholders, real lazy thumbnail rendering, and
      intrinsic-dimension guidance
- [x] Replace prose-heavy per-story frames with a semantic shared canvas
      decorator and Storybook story descriptions; keep displayed source focused
      on consumer code
- [x] Add a realistic photo-manager example combining filtering, controlled
      selection, shift-range selection, bulk actions, and full-resolution YARL
      viewing
- [x] Add focused live coverage for EXIF orientation, `buildLayout`,
      `buildLayoutFlat`, `CheckButton`, multiple tags, mixed linked/unlinked
      destinations, string caption titles, object style props, multiple gallery
      IDs, and extreme aspect ratios; add a focused `maxRows` album-preview
      interaction once it has a clear product purpose beyond the control
- [x] Make placeholder loading and linked-tile stories visibly interactive;
      consolidate redundant responsive, read-only, and empty-state stories
- [x] Correct style examples to explain replacement semantics and preserve
      layout-critical thumbnail and viewport dimensions
- [x] Fold the first-time-user mental model into Getting started and review
      every Storybook page for plain-language explanations, clear next steps,
      and accurate links
- [x] Make the combined Gallery workshop the first, complete example with
      full-resolution YARL viewing, three size presets, both layouts, optional
      selection, and a 1–50 item slider
- [x] Keep canvases content-sized and add prominent GitHub, npm, and PICR links
- [x] Rebase onto the post-`1.0.0` main line and reconcile the new masonry API
      with the Storybook stories, docs, controls, and source examples
- [x] Consolidate the earlier focused layout workshop into the complete Gallery
      workshop rather than keeping two visually similar Examples
- [x] Simplify Welcome around the above-the-fold interactive gallery, reduce
      Playground to one isolated story, and relocate its distinct narrow and
      multiple-gallery scenarios without losing live coverage
- [x] Present migration environments as an upstream/fork comparison, retain
      unused demo-image attribution as explicitly historical, and promote the
      hosted docs/examples link near the top of the README
- [x] Add a compact, pixel-faithful Gallery workshop screenshot near the top of
      the README and link it to the live interactive documentation
- [x] Make long guides navigable with a globally configured `h2`/`h3` table of
      contents that works for unattached MDX pages, keep the rail off Welcome,
      add internal links, and organize Gallery controls into documented
      categories with visible defaults
- [x] Replace the workshop selects with a segmented binary layout control and a
      compact 100–300px thumbnail-size slider, stabilize its YARL inputs,
      simplify its copyable source, and resize only grid thumbnails while
      retaining original viewer JPEGs
- [x] Use the documentation-build version internally for a changelog-backed
      Releases page with exact GitHub/npm links and non-linked Upcoming entries;
      omit maintainer-only build status from consumer-facing pages
- [x] Add separate Contributing and Testing & checks pages backed by repository
      Markdown, not duplicated Storybook-only policy
- [x] Follow the operating system's light/dark preference in Storybook chrome
      without overriding deliberately themed example surfaces
- [x] Fill short isolated-story previews with their themed surface in both
      colour schemes while keeping inline documentation canvases content-sized
- [x] Add a one-command local production preview, and document that it renders
      the built package while the development server renders source with HMR
- [x] Replace generic Welcome destination boxes with responsive GitHub, npm,
      and PICR cards using local inline marks and no remote assets
- [x] Compact the Welcome hero so its design remains distinctive without
      pushing the interactive workshop down the first viewport
- [x] Audit all upstream issue titles plus representative discussions and turn
      recurring documentation misunderstandings into a symptom-led
      troubleshooting guide and focused live examples
- [x] Add deterministic visual scenarios for supported container widths and
      relevant layout edge cases
- [x] Give Playwright stable story IDs and selectors without making stories feel
      like test-only fixtures
- [x] Use package-root import specifiers in story source without adding
      deep-import contracts, and resolve them differently per mode in Storybook's
      Vite configuration: the local dev server aliases to `src/index.ts` for
      HMR, while `build-storybook` and any Playwright-tested static build alias
      to `dist/index.js` so browser checks continue to exercise the built
      artifact. This mirrors the existing browser fixture, which aliases
      `@gallery` to `dist/index.js`
- [x] Resolve the package root to source for repository story typechecking and
      typed linting so clean CI runs do not depend on a stale local `dist` build
- [x] Add Storybook-backed Playwright scenarios without immediately replacing
      the current dist-backed browser fixture
- [x] Keep `docs/API.md`, `docs/MIGRATION.md`, and `ACKNOWLEDGEMENTS.md` as the
      authoritative documents; render or link them from Storybook rather than
      maintaining duplicate API or migration text
- [x] Use deterministic repository-owned images, fonts, and scripts; stories and
      browser checks must not depend on remote assets or runtime network access
- [x] Add simple `storybook` and `build-storybook` commands from the repository
      root
- [x] Extend the existing lint, type, and format scopes to cover the new files:
      `.storybook/**` and `**/*.stories.tsx` match none of the current ESLint
      file globs, so they would otherwise receive untyped linting only, and the
      test `tsconfig` needs them in its `include`
- [x] Add `eslint-plugin-storybook`, which is an official package and so fits the
      constraint above
- [x] Ignore `storybook-static` in Git and Prettier
- [x] Consider `@storybook/addon-a11y`; accessibility is deferred to dedicated
      post-`1.0.0` work, and Storybook is the natural place to surface it
- [x] Deploy the static Storybook build to GitHub Pages from `main`
- [x] Pin every GitHub Action to a full commit SHA with a readable version comment
- [x] Use the repository's supported Node/npm tooling in the Pages workflow
- [x] Link the maintained Storybook from the README
- [x] Keep useful original demo links clearly labelled as upstream references
- [x] Preserve relevant acknowledgements and image credits from the old examples
- [x] Verify Storybook, stories, and assets stay out of the npm tarball. This is
      already structural rather than something to build: the package `files`
      field is an explicit allowlist and the package check fails on any
      unexpected tarball entry, so confirming it is enough

## Testing Boundaries

- [x] Keep standalone Playwright screenshot tests as the visual regression system
- [x] Preserve the current fixture's built-ESM, React 18/19, linked-tile,
      row-layout, hydration, and visual coverage while Storybook is introduced
- [x] Run Storybook-backed Playwright scenarios against its static build in the
      same pinned Linux environment used locally and in CI. Concretely, the
      Playwright config currently defines two projects and two `webServer`
      entries on ports 4173 and 4174; Storybook adds a third of each, serving
      its static build, and runs inside the same digest-pinned container. Its
      screenshots use the shared zero-tolerance comparison settings and the same
      `__screenshots__` path template
- [x] Migrate an existing browser scenario only after explicit behavior and
      screenshot parity is demonstrated; retain direct browser coverage of the
      built package artifact even if most visual scenarios later use Storybook
- [x] Do not add Chromatic or another hosted visual-testing service initially
- [x] Do not add Storybook's Vitest browser addon initially; the existing Vitest
      and Playwright layers cover this package's first requirements
- [x] Keep packed-package consumer fixtures separate from Storybook
- [x] Harden the pre-existing modified/middle-click browser synchronization
      exposed by repeated full runs: assert the package-owned anchor, modifier,
      callback, and originating-page guarantees without treating headless
      Chromium's nondeterministic background-tab creation as package behavior;
      keep actual navigation coverage for ordinary click and Enter

## Acceptance Criteria

- [x] `npm run storybook` starts the site locally
- [ ] `npm run build-storybook` succeeds in hosted CI (pending local review and
      pull request)
- [x] Storybook-backed Playwright scenarios use the same static build locally and
      in CI
- [x] Existing dist-backed Playwright coverage remains green until an explicitly
      reviewed parity migration preserves equivalent built-artifact coverage
- [ ] The deployed Pages site works from the repository's configured base path
      (Pages is configured for Actions; deployment awaits merge)
- [x] Component controls and curated docs accurately describe the public API
- [x] Storybook does not duplicate authoritative Markdown documentation or load
      remote runtime assets
- [x] The README links to Storybook and distinguishes upstream examples
- [x] The complete existing check suite still passes with the new files in scope,
      including type-aware linting and formatting of stories and Storybook
      configuration
- [x] Every decision listed under Constraints has been made and recorded, not
      left implicit in the implementation

## Out of Scope

- A custom documentation application or theme
- Chromatic or another hosted visual-testing service
- Recreating every historical integration example
- Package export or packed-package consumer testing, which remain covered by the
  first-release modernization work
