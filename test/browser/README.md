# Browser Tests

Playwright exercises the built ESM package through the Vite fixtures in
`test/fixtures/`.

Run browser tests in the pinned Linux container used by CI:

```sh
npm run test:browser:container
```

Update visual baselines only through that same environment:

```sh
npm run test:browser:container:update
```

The underlying `test:browser` and `test:browser:update` scripts are container
internals. Running them directly requires a matching Playwright browser and can
produce host-specific screenshots.

## Baseline Provenance

The migration seeded 17 Playwright screenshots from the inherited
Jest/Puppeteer suite, then compared them at zero tolerance in the pinned
Playwright container. Sixteen passed byte-for-byte and remain the inherited PNG
files, providing direct evidence that the migration preserved their rendering.

Only `tags.png` was re-recorded. Its reviewed diff was confined to antialiased
edges around the default tag pills after moving from Chrome 117 to Chromium 151. The gallery layout, colors, and content were unchanged. Do not regenerate
the other baselines merely to normalize PNG encoding or metadata.

Review every intentional baseline update alongside its diff and update the
Playwright package, container image, browser, and affected screenshots together
when a browser upgrade requires it.
