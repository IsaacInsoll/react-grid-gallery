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

## Checks

Run the checks relevant to your change. Before requesting review, the complete
non-browser suite should pass:

```sh
npm run format:check
npm run lint
npm run typecheck
npm run test:types
npm test
npm run test:consumer
npm run package:check
```

Run browser tests in their pinned container:

```sh
npm run test:browser:container
```

Use `npm run test:browser:container:update` only for deliberate, reviewed visual
baseline changes.

## Pull Requests

- Keep changes focused and include regression coverage for behavior changes.
- Use gitmoji-style commit messages and PR titles where practical.
- Do not combine dependency, visual, API, and unrelated cleanup changes.
- Preserve original authorship and credit when porting work from another
  project or contributor.
- Do not commit generated package output or host-generated browser snapshots.

Report suspected vulnerabilities privately through
[GitHub Security Advisories](https://github.com/IsaacInsoll/react-grid-gallery/security/advisories/new),
not a public issue. See [SECURITY.md](SECURITY.md).
