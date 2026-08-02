# Browser Tests

Playwright exercises the built ESM package through the Vite fixtures in
`test/fixtures/`.

Run browser tests in the pinned Linux container used by CI:

```sh
npm run test:browser:container
```

The image digest currently fixes Node 24.18.0, npm 11.16.0, and the matching
Playwright browser environment. npm 11 only launches the browser build and test
scripts inside that immutable image. Dependency installation, the canonical
Node 24.18.0/npm 12.0.2 build, and packed-package validation run in the host CI
job using the integrity-pinned `packageManager` version.

Update visual baselines only through that same environment:

```sh
npm run test:browser:container:update
```

The underlying `test:browser` and `test:browser:update` scripts are container
internals. Running them directly requires a matching Playwright browser and can
produce host-specific screenshots.

## Baseline Provenance

The migration originally seeded 17 Playwright screenshots from the inherited
Jest/Puppeteer suite, then compared them at zero tolerance in the pinned
Playwright container. At that stage, sixteen passed byte-for-byte and were
retained, providing direct evidence that the test migration preserved their
rendering.

Only `tags.png` was re-recorded during the browser-tool migration. Its reviewed
diff was confined to antialiased edges around the default tag pills after
moving from Chrome 117 to Chromium 151. The gallery layout, colors, and content
were unchanged at that stage.

The first-release row-justification correction intentionally regenerated 16
layout-sensitive inherited baselines in the same pinned Chromium environment.
Overflowing rows are shorter because their images are proportionally rescaled
instead of horizontally cropped. `transparent.png` remained byte-identical.
The new `row-justification.png` uses deterministic patterned SVGs with visible
edge markers, including a selected tile, to make future cropping regressions
obvious.

Review every intentional baseline update alongside its diff and update the
Playwright package, container image, browser, and affected screenshots together
when a browser upgrade requires it.
