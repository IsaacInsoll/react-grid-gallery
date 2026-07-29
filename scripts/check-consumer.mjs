import { execFileSync } from 'node:child_process';
import { cpSync, mkdtempSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const repositoryRoot = path.resolve(import.meta.dirname, '..');
const fixtureDirectory = path.join(
  repositoryRoot,
  'test',
  'fixtures',
  'packed-consumer',
);
const temporaryDirectory = mkdtempSync(
  path.join(tmpdir(), 'react-grid-gallery-consumer-'),
);
const packDirectory = path.join(temporaryDirectory, 'package');
const consumerDirectory = path.join(temporaryDirectory, 'consumer');

const runNpm = (args, cwd) =>
  execFileSync(npm, args, { cwd, stdio: 'inherit' });

try {
  mkdirSync(packDirectory);
  cpSync(fixtureDirectory, consumerDirectory, { recursive: true });

  runNpm(
    ['pack', '--ignore-scripts', '--pack-destination', packDirectory],
    repositoryRoot,
  );

  const tarballs = readdirSync(packDirectory).filter((file) =>
    file.endsWith('.tgz'),
  );

  if (tarballs.length !== 1) {
    throw new Error(`Expected one packed tarball, found ${tarballs.length}.`);
  }

  const tarball = path.join(packDirectory, tarballs[0]);

  runNpm(
    ['ci', '--ignore-scripts', '--offline', '--no-audit', '--no-fund'],
    consumerDirectory,
  );
  runNpm(
    [
      'install',
      '--ignore-scripts',
      '--prefer-offline',
      '--no-audit',
      '--no-fund',
      '--no-save',
      '--package-lock=false',
      tarball,
    ],
    consumerDirectory,
  );
  runNpm(['run', 'typecheck'], consumerDirectory);
  runNpm(['run', 'build'], consumerDirectory);
  runNpm(['run', 'smoke'], consumerDirectory);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
