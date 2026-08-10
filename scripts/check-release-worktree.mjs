import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

export const assertPermittedReleaseStatus = (status) => {
  if (
    status.length === 0 ||
    (status.length === 1 && status[0] === ' M CHANGELOG.md')
  ) {
    return;
  }

  throw new Error(
    [
      'A release permits a clean tracked worktree or exactly one unstaged tracked change: CHANGELOG.md.',
      'Current tracked status:',
      ...status,
    ].join('\n'),
  );
};

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  const branch = git('branch', '--show-current').trim();

  if (branch !== 'main') {
    throw new Error('Releases must run directly from main.');
  }

  git('fetch', '--quiet', 'origin', 'main');

  const [ahead, behind] = git(
    'rev-list',
    '--left-right',
    '--count',
    'HEAD...origin/main',
  )
    .trim()
    .split(/\s+/)
    .map(Number);

  if (ahead !== 0 || behind !== 0) {
    throw new Error(
      `Local main must match origin/main exactly (ahead ${ahead}, behind ${behind}).`,
    );
  }

  const status = git('status', '--porcelain=v1', '--untracked-files=no')
    .trimEnd()
    .split('\n')
    .filter(Boolean);

  assertPermittedReleaseStatus(status);

  console.log(
    'Verified synchronized main with a clean tracked worktree or one uncommitted changelog update.',
  );
}
