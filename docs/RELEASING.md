# Release Process

> **Pre-release status:** `release-it`, `.github/workflows/release.yml`, the
> `npm-publish` environment, and npm trusted publishing are not configured yet.
> This document defines the controls that must land before `1.0.0-rc.0`; progress
> is tracked in `MODERNIZATION_PLAN.md`.

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
- Trusted publishing must use OIDC without `NODE_AUTH_TOKEN`. Bootstrap or
  emergency token publishing must set `NODE_AUTH_TOKEN` explicitly only on the
  publish step; `actions/setup-node` v7 no longer supplies a dummy value.
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

## Emergency Recovery

Restore the trusted-publishing path before releasing whenever practical. If an
urgent security release cannot wait for that repair:

1. Create a granular npm token limited to this package, publishing, and the
   shortest practical expiry.
2. Store it only in the protected `npm-publish` GitHub environment and run the
   same SHA-pinned workflow, release gates, provenance generation, and npm 2FA
   approval used by a normal release.
3. Revoke the token and remove the environment secret immediately after
   verifying the published package.
4. Record why trusted publishing was unavailable and the recovery work needed.

Never bypass the workflow with a local publish or retain the recovery token for
the next release.
