import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const corepackVersion = '0.35.0';
const expectedSha512 =
  'f41b881870c513b6627a8af509e46cbeded7ec024512e27a3a76d26ec569aeaf370a10c5a01875c0ff7c35e512f454f767097316594f1255dccff3a20dfd181b';
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const temporaryDirectory = mkdtempSync(path.join(tmpdir(), 'corepack-'));

try {
  execFileSync(
    npm,
    [
      'pack',
      `corepack@${corepackVersion}`,
      '--ignore-scripts',
      '--pack-destination',
      temporaryDirectory,
    ],
    { stdio: 'inherit' },
  );

  const tarballs = readdirSync(temporaryDirectory).filter((file) =>
    file.endsWith('.tgz'),
  );

  if (tarballs.length !== 1) {
    throw new Error(`Expected one Corepack tarball, found ${tarballs.length}.`);
  }

  const tarball = path.join(temporaryDirectory, tarballs[0]);
  const actualSha512 = createHash('sha512')
    .update(readFileSync(tarball))
    .digest('hex');

  if (actualSha512 !== expectedSha512) {
    throw new Error(
      `Corepack SHA-512 mismatch: expected ${expectedSha512}, found ${actualSha512}.`,
    );
  }

  execFileSync(npm, ['install', '--global', '--ignore-scripts', tarball], {
    stdio: 'inherit',
  });
  console.log(`Installed verified corepack@${corepackVersion}.`);
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
