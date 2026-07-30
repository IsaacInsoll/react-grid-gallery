import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const packDirectory = mkdtempSync(path.join(tmpdir(), 'react-grid-gallery-'));
const expectedFiles = [
  'ACKNOWLEDGEMENTS.md',
  'CHANGELOG.md',
  'LICENSE',
  'README.md',
  'dist/index.d.ts',
  'dist/index.js',
  'package.json',
];

const runNpm = (args, options = {}) =>
  execFileSync(npm, args, { stdio: 'inherit', ...options });

try {
  runNpm(['pack', '--ignore-scripts', '--pack-destination', packDirectory]);

  const tarballs = readdirSync(packDirectory).filter((file) =>
    file.endsWith('.tgz'),
  );

  if (tarballs.length !== 1) {
    throw new Error(`Expected one packed tarball, found ${tarballs.length}.`);
  }

  const tarball = path.join(packDirectory, tarballs[0]);
  const actualFiles = execFileSync('tar', ['-tzf', tarball], {
    encoding: 'utf8',
  })
    .trim()
    .split(/\r?\n/)
    .map((file) => file.replace(/^package\//, ''))
    .sort();
  const missingFiles = expectedFiles.filter(
    (file) => !actualFiles.includes(file),
  );
  const unexpectedFiles = actualFiles.filter(
    (file) => !expectedFiles.includes(file),
  );

  if (missingFiles.length > 0 || unexpectedFiles.length > 0) {
    throw new Error(
      [
        'Packed file list does not match the expected public package.',
        `Missing: ${missingFiles.join(', ') || 'none'}`,
        `Unexpected: ${unexpectedFiles.join(', ') || 'none'}`,
      ].join('\n'),
    );
  }

  console.log(
    `Packed files:\n${actualFiles.map((file) => `- ${file}`).join('\n')}`,
  );

  runNpm(['exec', '--offline', '--', 'publint', tarball, '--strict']);
  runNpm(['exec', '--offline', '--', 'attw', tarball, '--profile', 'esm-only']);
} finally {
  rmSync(packDirectory, { recursive: true, force: true });
}
