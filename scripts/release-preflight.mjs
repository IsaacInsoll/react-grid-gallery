import { execFileSync } from 'node:child_process';

const args = process.argv.slice(2);
const checkOnly = args[0] === '--check-only';
const version = checkOnly ? args[1] : args[0];
const releaseItArgs = checkOnly ? [] : args.slice(1);

if (!version) {
  throw new Error('Expected a semantic release version.');
}

const runNode = (script, scriptArgs = []) =>
  execFileSync(process.execPath, [script, ...scriptArgs], { stdio: 'inherit' });

runNode('scripts/check-release-worktree.mjs');
runNode('scripts/release-notes.mjs', ['--check', version]);

console.log('\nRelease notes preview:\n');
runNode('scripts/release-notes.mjs', [version]);

if (!checkOnly) {
  runNode('node_modules/release-it/bin/release-it.js', [
    '--dry-run',
    version,
    ...releaseItArgs,
  ]);
}
