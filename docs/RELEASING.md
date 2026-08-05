# Release Process

> **Pre-release status:** `release-it` is configured, but
> `.github/workflows/release.yml`, the `npm-publish` environment, and npm trusted
> publishing are not configured yet. Do not create a release tag until that
> workflow exists. Progress is tracked in `MODERNIZATION_PLAN.md`.

`@picr/react-grid-gallery` is published only by the maintainer through GitHub
Actions. Do not run `npm publish` from a development machine or add a long-lived
npm publishing token.

The permanent publishing workflow filename is
`.github/workflows/release.yml`. npm trusted-publisher configuration is bound to
that exact path, so any rename must be coordinated with npm and verified before
another release.

## Controls

- Ordinary changes must still reach protected `main` through reviewed pull
  requests. The maintainer's administrator bypass is reserved for the
  release-it-generated version commit and tag described below.
- The complete release checks run locally before release-it changes the version.
  The tag-triggered workflow repeats its release gates before npm receives an
  artifact.
- Local release checks run while `package.json` still contains the current
  version (`0.0.0-development` before the first release). The tag workflow is
  therefore the authoritative validation of the final versioned tarball.
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

## Creating A Release

The unpublished development version is `0.0.0-development`. It exists only so
the first release candidate can advance cleanly to `1.0.0-rc.0`; never publish
the development placeholder.

Update local `main`, then manually add one non-empty `## v<version>` or
`## v<version> / YYYY-MM-DD` section to `CHANGELOG.md`. That file must be the
only unstaged tracked change. Untracked planning files are not added to the
release commit.

```sh
git switch main
git pull --ff-only
# Edit CHANGELOG.md.
npm run release:dry-run -- <version>
npm run release -- <version>
```

The worktree guard fetches `origin/main`, requires local `main` to match it
exactly, and rejects every tracked change except the unstaged changelog update.
The dry-run preflight validates and prints the exact curated release-note
section before previewing release-it's write operations. It does not repeat the
complete release gate. Review that printed text before continuing. The real run
reuses that preflight and runs `npm run release:check`. It then bumps
`package.json` and `package-lock.json`, creates the
`🔖 release v<version>` commit and annotated tag, and atomically pushes both to
`main` using the maintainer's administrator bypass. If branch protection rejects
the commit, the tag is not pushed either.

Release-it never publishes to npm. Pushing the tag starts the independent
trusted-publishing workflow, which validates the final versioned tarball,
publishes or stages it, and owns GitHub Release creation with a scoped,
short-lived workflow token. A public GitHub Release must not precede successful
npm publication; the workflow may use a draft while staged npm approval is
pending. Do not use administrator bypass for ordinary development work.

## Normal Releases

`release-it` creates the version commit and annotated tag directly from
synchronized `main`. Pushing the release tag starts the publishing workflow.
GitHub OIDC stages the package at npm, npm 2FA approval is the single human gate
before it becomes public, and the workflow publishes the curated GitHub Release
only after the package is available.

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
