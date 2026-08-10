# Release Process

> [`1.0.0`](https://www.npmjs.com/package/@picr/react-grid-gallery/v/1.0.0)
> was staged through OIDC, approved with npm 2FA, and published with provenance
> on 2026-08-07. The earlier `1.0.0-rc.0` bootstrap credential was removed, and
> the permanent workflow remains stage-only.

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
  version. The tag workflow is therefore the authoritative validation of the
  final versioned tarball.
- The release workflow must use the repository's verified Corepack bootstrap
  and integrity-pinned npm version.
- Trusted publishing must use OIDC without `NODE_AUTH_TOKEN`. An explicitly
  approved emergency token path must set `NODE_AUTH_TOKEN` only on its publish
  step; `actions/setup-node` v7 no longer supplies a dummy value.
- Workflow actions must use full commit SHAs and least-privilege permissions.
- Within the release workflow, only the publishing job may receive
  `id-token: write`; release operations may receive `contents: write` only when
  required. The separate Storybook Pages deployment job has its own explicitly
  scoped `pages: write` and `id-token: write` trust domain; its build job remains
  read-only.
- The packed artifact must pass the complete release gates and be reviewed
  before publishing.
- Validation preserves one checked tarball as a short-lived workflow artifact.
  The publishing job verifies its SHA-512 after transfer and gives those exact
  bytes to npm; it does not rebuild or repack with publishing credentials.
- `CHANGELOG.md` and GitHub release notes must be human-curated and preserve
  contributor attribution.
- Stable and prerelease publishes must use explicit `latest` and `next`
  distribution tags respectively. Keep `next` present: it points to the newest
  prerelease while one is ahead of stable, otherwise it follows `latest`.

## First Publish

The package had to exist on npm before trusted publishing could be configured.
The `1.0.0-rc.0` bootstrap therefore used a temporary granular token from the
GitHub Actions workflow and published with provenance and the explicit `next`
tag.

npm also assigned `latest` during the first package registration despite the
explicit prerelease tag. The release workflow correctly stopped before the
GitHub announcement because its stricter assertion expected `latest` to be
absent. The maintainer accepted this one-time bootstrap state because the
package had not been announced; stable `1.0.0` replaced `latest` on 2026-08-07.
This is not the policy for later prereleases. The GitHub prerelease was then
created manually from the same checked changelog notes.

The `npm-publish` GitHub environment is restricted to tags matching `v*` and has
no required reviewers. Its one-use `NPM_BOOTSTRAP_TOKEN` secret was removed
after publication and must not be restored for normal releases.

Stage-only npm trusted publishing is configured for the permanent workflow and
the release-tag-restricted `npm-publish` GitHub environment. Stable `1.0.0`
successfully verified that binding, and npm exposes repository-linked
provenance for both the prerelease and stable versions.

Use these npm trusted-publisher values:

- GitHub organization or user: `IsaacInsoll`
- Repository: `react-grid-gallery`
- Workflow filename: `release.yml`
- Environment: `npm-publish`
- Allowed action: `npm stage publish` only

Set and keep package publishing access configured to require 2FA and disallow
tokens. npm trusted publishing continues to work because it uses short-lived
OIDC credentials rather than traditional automation tokens.

Verify this package-specific control in npm's web interface before a stable
release, following npm's
[trusted-publishing guidance](https://docs.npmjs.com/trusted-publishers/#recommended-restrict-token-access-when-using-trusted-publishers);
the CLI cannot confirm that traditional tokens are disallowed:

1. Sign in to npmjs.com and open `@picr/react-grid-gallery`.
2. Open **Settings**, then find **Publishing access**.
3. Select **Require two-factor authentication and disallow tokens
   (recommended)**.
4. Click **Update Package Settings** if the selection changed, completing the
   requested 2FA challenge.
5. Confirm the same option remains selected after the settings page reloads.

This restriction applies to traditional granular-token authentication, not the
short-lived OIDC credentials issued to the configured trusted publisher. Keep
the trusted publisher limited to `npm stage publish`; the staged package still
requires a maintainer's explicit 2FA approval before publication.

The bootstrap token was read only by the `1.0.0-rc.0` publish step. Both the
GitHub environment secret and the corresponding granular npm token have been
removed, and the one-off token branch has been removed from the permanent
workflow.

## Creating A Release

Never release the historical `0.0.0-development` placeholder. Release from the
current version on synchronized `main`.

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
GitHub OIDC stages the exact checked package at npm and creates a draft GitHub
Release. Review the staged package on npm, approve it with 2FA, then run the
`Release` workflow manually with the existing `v<version>` tag. The finalization
job verifies the version and expected npm distribution tags before making the
draft GitHub Release public. npm approval is the single human publication gate;
the manual workflow run only synchronizes the public announcement.

Prereleases move `next` and leave `latest` on the newest stable release. After
approving a stable version, move `next` to that same version before finalizing:

```sh
release_version=1.2.0
npm dist-tag add "@picr/react-grid-gallery@$release_version" next
```

Substitute the actual stable version being released. This keeps `next`
available at all times: it identifies the newest release candidate when one is
ahead of stable, and otherwise matches `latest`. Stable finalization verifies
both tags; prerelease finalization verifies `next` and rejects a prerelease that
has moved `latest`. The finalization workflow intentionally cannot change npm
distribution tags: its tokenless OIDC publisher is stage-only and its
announcement job has no npm publishing credential, so moving `next` remains an
explicit maintainer step.

## Emergency Recovery

If OIDC staging fails after a release tag has been pushed, first correct the npm
trusted-publisher or GitHub environment configuration and rerun the failed job
against the existing tag. Do not delete and recreate the tag by default. If the
failure is embedded in workflow code at that tag, stop and assess whether npm
has made any version public, then land a focused fix and record the chosen
recovery. Re-tag an unpublished version only as a last-resort documented
decision.

Restore the trusted-publishing path before releasing whenever practical. If an
urgent security release cannot wait for that repair:

1. Create a granular npm token limited to this package, publishing, and the
   shortest practical expiry.
2. Land a focused, reviewed change to `release.yml` that enables token
   authentication only for the exact emergency tag. Keep the normal release
   gates, exact-artifact transfer, provenance generation, and GitHub Release
   ordering unchanged.
3. Store the token only in the protected `npm-publish` GitHub environment and
   set `NODE_AUTH_TOKEN` only on that emergency publish step.
4. Revoke the token, remove the environment secret, and restore the stage-only
   workflow immediately after verifying the published package.
5. Record why trusted publishing was unavailable and the recovery work needed.

Never bypass the workflow with a local publish or retain the recovery token for
the next release.

### `1.0.0` incident record

The initial `v1.0.0` push at 2026-08-06 22:20 UTC landed during a critical
GitHub Actions incident. GitHub reported that webhook triggers were throttled,
some push events did not start workflows, and those lost events could not be
replayed automatically. After the incident resolved, recreating only the tag
reference against the unchanged annotated tag object triggered the successful
release run. No repository workflow, release-it configuration, npm trusted
publisher binding, or package script defect caused the missing run.
