import { execFileSync } from 'node:child_process';
import {
  cpSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
} from 'node:fs';
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
const readManifest = (directory) =>
  JSON.parse(readFileSync(path.join(directory, 'package.json'), 'utf8'));
const rootManifest = readManifest(repositoryRoot);
const react19Manifest = readManifest(
  path.join(repositoryRoot, 'test', 'fixtures', 'react-19'),
);
const consumerManifest = readManifest(fixtureDirectory);
const sharedConfiguration = [
  [
    'packageManager',
    consumerManifest.packageManager,
    rootManifest.packageManager,
  ],
  [
    'react',
    consumerManifest.dependencies.react,
    react19Manifest.dependencies.react,
  ],
  [
    'react-dom',
    consumerManifest.dependencies['react-dom'],
    react19Manifest.dependencies['react-dom'],
  ],
  [
    '@types/react',
    consumerManifest.devDependencies['@types/react'],
    react19Manifest.devDependencies['@types/react'],
  ],
  [
    '@types/react-dom',
    consumerManifest.devDependencies['@types/react-dom'],
    react19Manifest.devDependencies['@types/react-dom'],
  ],
  [
    'typescript',
    consumerManifest.devDependencies.typescript,
    rootManifest.devDependencies.typescript,
  ],
  [
    'vite',
    consumerManifest.devDependencies.vite,
    rootManifest.devDependencies.vite,
  ],
];
const configurationMismatches = sharedConfiguration.filter(
  ([, actual, expected]) => actual !== expected,
);

if (configurationMismatches.length > 0) {
  throw new Error(
    [
      'Packed consumer configuration is out of sync.',
      ...configurationMismatches.map(
        ([name, actual, expected]) =>
          `${name}: expected ${expected}, found ${actual}`,
      ),
    ].join('\n'),
  );
}

const temporaryDirectory = mkdtempSync(
  path.join(tmpdir(), 'react-grid-gallery-consumer-'),
);
const packDirectory = path.join(temporaryDirectory, 'package');
const consumerDirectory = path.join(temporaryDirectory, 'consumer');

const runNpm = (args, cwd) =>
  execFileSync(npm, args, { cwd, stdio: 'inherit' });

try {
  mkdirSync(packDirectory);
  cpSync(fixtureDirectory, consumerDirectory, {
    recursive: true,
    filter: (source) =>
      !['dist', 'node_modules'].includes(path.basename(source)),
  });

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

  // Prefer the shared cache, but let this integrity-locked fixture install independently.
  runNpm(
    ['ci', '--ignore-scripts', '--prefer-offline', '--no-audit', '--no-fund'],
    consumerDirectory,
  );
  // npm 12 needs registry metadata to validate peers for a new tarball on a cold runner.
  runNpm(
    [
      'install',
      '--ignore-scripts',
      '--prefer-offline',
      '--no-audit',
      '--no-fund',
      '--no-save',
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
