import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });

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

if (status.length !== 1 || status[0] !== ' M CHANGELOG.md') {
  throw new Error(
    [
      'A release permits exactly one unstaged tracked change: CHANGELOG.md.',
      'Current tracked status:',
      ...status,
    ].join('\n'),
  );
}

console.log(
  'Verified synchronized main with one uncommitted changelog update.',
);
