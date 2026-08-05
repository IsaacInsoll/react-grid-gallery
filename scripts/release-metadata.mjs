import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { extractReleaseNotes } from './release-notes.mjs';

const releaseVersionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*)?$/;

export const getReleaseMetadata = (manifest, tag) => {
  if (!tag?.startsWith('v')) {
    throw new Error('Release tags must use the v<version> format.');
  }

  const version = tag.slice(1);

  if (!releaseVersionPattern.test(version)) {
    throw new Error(`Invalid semantic release version: ${version}.`);
  }

  if (manifest.version === '0.0.0-development') {
    throw new Error(
      'The development placeholder version must not be released.',
    );
  }

  if (manifest.version !== version) {
    throw new Error(
      `Release tag ${tag} does not match package version ${manifest.version}.`,
    );
  }

  const prerelease = version.includes('-');

  return {
    distTag: prerelease ? 'next' : 'latest',
    prerelease,
    tag,
    version,
  };
};

const runGit = (args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  const tag = process.argv[2];
  const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  const metadata = getReleaseMetadata(manifest, tag);

  extractReleaseNotes(readFileSync('CHANGELOG.md', 'utf8'), metadata.version);

  const tagType = runGit(['cat-file', '-t', `refs/tags/${metadata.tag}`]);

  if (tagType !== 'tag') {
    throw new Error(`${metadata.tag} must be an annotated Git tag.`);
  }

  const releaseCommit = runGit(['rev-list', '-n', '1', metadata.tag]);
  const checkedOutCommit = runGit(['rev-parse', 'HEAD']);

  if (releaseCommit !== checkedOutCommit) {
    throw new Error(
      `${metadata.tag} points to ${releaseCommit}, but ${checkedOutCommit} is checked out.`,
    );
  }

  try {
    execFileSync(
      'git',
      ['merge-base', '--is-ancestor', releaseCommit, 'origin/main'],
      { stdio: 'ignore' },
    );
  } catch {
    throw new Error(`${metadata.tag} is not reachable from origin/main.`);
  }

  const output = process.env.GITHUB_OUTPUT;

  if (output) {
    appendFileSync(
      output,
      [
        `dist_tag=${metadata.distTag}`,
        `prerelease=${metadata.prerelease}`,
        `tag=${metadata.tag}`,
        `version=${metadata.version}`,
      ].join('\n') + '\n',
    );
  }

  console.log(
    `Verified ${metadata.tag} for npm tag ${metadata.distTag} at ${releaseCommit}.`,
  );
}
