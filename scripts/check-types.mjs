import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const compilerPackages = [
  resolve('test', 'fixtures', 'react-18-types', 'node_modules', 'typescript'),
  resolve('node_modules', 'typescript'),
  resolve('test', 'fixtures', 'react-19', 'node_modules', 'typescript'),
];
const compilers = compilerPackages.map((packageDirectory) => {
  const manifest = JSON.parse(
    readFileSync(resolve(packageDirectory, 'package.json'), 'utf8'),
  );

  return [
    `TypeScript ${manifest.version}`,
    resolve(packageDirectory, 'bin', 'tsc'),
  ];
});
const fixtures = ['react-18-types', 'react-19'];
const resolutions = ['bundler', 'nodenext'];
const consumerFixture = resolve('test', 'fixtures', 'types', 'consumer.tsx');
const generatedDeclaration = resolve('dist', 'index.d.ts');
const generatedRuntime = resolve('dist', 'index.js');
const packageManifest = resolve('package.json');
const generatedDirectories = fixtures.map((fixture) =>
  resolve('test', 'fixtures', fixture, '.type-package'),
);

try {
  for (const directory of generatedDirectories) {
    const packageDirectory = resolve(
      directory,
      'node_modules',
      '@picr',
      'react-grid-gallery',
    );
    const packageDist = resolve(packageDirectory, 'dist');

    rmSync(directory, { recursive: true, force: true });
    mkdirSync(packageDist, { recursive: true });
    copyFileSync(consumerFixture, resolve(directory, 'consumer.tsx'));
    copyFileSync(packageManifest, resolve(packageDirectory, 'package.json'));
    copyFileSync(generatedDeclaration, resolve(packageDist, 'index.d.ts'));
    copyFileSync(generatedRuntime, resolve(packageDist, 'index.js'));
  }

  for (const [compilerName, compiler] of compilers) {
    for (const fixture of fixtures) {
      for (const resolution of resolutions) {
        const project = resolve(
          'test',
          'fixtures',
          fixture,
          `tsconfig.${resolution}.json`,
        );
        const label = `${compilerName}, ${fixture}, ${resolution}`;

        console.log(`Typechecking ${label}`);
        const result = spawnSync(
          process.execPath,
          [compiler, '--project', project, '--pretty', 'false'],
          { stdio: 'inherit' },
        );

        if (result.error) {
          throw result.error;
        }
        if (result.status !== 0) {
          throw new Error(`Typechecking failed: ${label}`);
        }
      }
    }
  }
} finally {
  for (const directory of generatedDirectories) {
    rmSync(directory, { recursive: true, force: true });
  }
}
