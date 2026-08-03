# Release Process

`@picr/react-grid-gallery` is published only by the maintainer through GitHub
Actions. Do not run `npm publish` from a development machine or add a long-lived
npm publishing token.

The permanent publishing workflow filename is
`.github/workflows/release.yml`. npm trusted-publisher configuration is bound to
that exact path, so any rename must be coordinated with npm and verified before
another release.

## Controls

- Release commits and tags must come from protected `main` after required CI
  passes.
- The release workflow must use the repository's verified Corepack bootstrap
  and integrity-pinned npm version.
- Workflow actions must use full commit SHAs and least-privilege permissions.
- Only the publishing job may receive `id-token: write`; release operations may
  receive `contents: write` only when required.
- The packed artifact must pass the complete release gates and be reviewed
  before publishing.
- `CHANGELOG.md` and GitHub release notes must be human-curated and preserve
  contributor attribution.
- Stable and prerelease publishes must use explicit `latest` and `next`
  distribution tags respectively.

## First Publish

The package must exist on npm before trusted publishing can be configured. The
`1.0.0-rc.0` bootstrap therefore uses a temporary granular token from the
GitHub Actions workflow, publishes with provenance and the `next` tag, verifies
that npm has not created `latest`, then revokes the token immediately.

After bootstrap, configure stage-only npm trusted publishing for the permanent
workflow and a release-tag-restricted `npm-publish` GitHub environment. Verify
the prerelease's repository-linked provenance before staging `1.0.0`.

## Normal Releases

`release-it` prepares the version commit, tag, curated GitHub Release, and
changelog guard. Pushing the release tag starts the publishing workflow. GitHub
OIDC stages the package at npm, and npm 2FA approval is the single human gate
before it becomes public.

Emergency recovery must be documented. Prefer restoring trusted publishing over
creating a long-lived token.
