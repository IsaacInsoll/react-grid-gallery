import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const escapeRegExp = (value) => value.replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const extractReleaseNotes = (changelog, version) => {
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error('Expected a semantic release version.');
  }

  const headingPattern = new RegExp(
    `^## v${escapeRegExp(version)}(?: / \\d{4}-\\d{2}-\\d{2})?$`,
  );
  const lines = changelog.split(/\r?\n/);
  const matchingHeadings = lines
    .map((line, index) => (headingPattern.test(line) ? index : -1))
    .filter((index) => index >= 0);

  if (matchingHeadings.length !== 1) {
    throw new Error(
      `Expected one "## v${version}" release section, found ${matchingHeadings.length}.`,
    );
  }

  const sectionStart = matchingHeadings[0] + 1;
  const nextSectionOffset = lines
    .slice(sectionStart)
    .findIndex((line) => line.startsWith('## '));
  const sectionEnd =
    nextSectionOffset === -1 ? lines.length : sectionStart + nextSectionOffset;
  const releaseNotes = lines.slice(sectionStart, sectionEnd).join('\n').trim();

  if (!releaseNotes) {
    throw new Error(`The v${version} changelog section has no release notes.`);
  }

  return releaseNotes;
};

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  const args = process.argv.slice(2);
  const checkOnly = args[0] === '--check';
  const version = checkOnly ? args[1] : args[0];
  const fileArgument = args.find((arg) => arg.startsWith('--file='));
  const changelogPath = fileArgument?.slice('--file='.length) ?? 'CHANGELOG.md';

  if (!version) {
    throw new Error('Expected a semantic release version.');
  }

  const releaseNotes = extractReleaseNotes(
    readFileSync(changelogPath, 'utf8'),
    version,
  );

  if (checkOnly && changelogPath === 'CHANGELOG.md') {
    const releaseTags = spawnSync(
      'git',
      ['tag', '--merged', 'HEAD', '--list', 'v*'],
      { encoding: 'utf8' },
    );

    if (releaseTags.error) {
      throw releaseTags.error;
    }

    if (releaseTags.status !== 0) {
      throw new Error(
        releaseTags.stderr || 'Could not inspect existing release tags.',
      );
    }

    if (releaseTags.stdout.trim()) {
      const latestTag = spawnSync(
        'git',
        ['describe', '--tags', '--abbrev=0', '--match', 'v*'],
        { encoding: 'utf8' },
      );

      if (latestTag.error) {
        throw latestTag.error;
      }

      if (latestTag.status !== 0) {
        throw new Error(
          latestTag.stderr || 'Could not find the latest release tag.',
        );
      }

      const tag = latestTag.stdout.trim();
      const changelogDiff = spawnSync(
        'git',
        ['diff', '--quiet', tag, '--', changelogPath],
        { encoding: 'utf8' },
      );

      if (changelogDiff.status === 0) {
        throw new Error(`${changelogPath} has not changed since ${tag}.`);
      }

      if (changelogDiff.status !== 1) {
        throw new Error(
          changelogDiff.stderr || 'Could not inspect changelog changes.',
        );
      }
    }

    console.log(`Verified curated release notes for v${version}.`);
  } else if (!checkOnly) {
    process.stdout.write(`${releaseNotes}\n`);
  }
}
