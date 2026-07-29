import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';

const compilers = [
  [
    'TypeScript 5.5.4',
    resolve(
      'test',
      'fixtures',
      'react-18-types',
      'node_modules',
      'typescript',
      'bin',
      'tsc',
    ),
  ],
  ['TypeScript 6.0.2', resolve('node_modules', 'typescript', 'bin', 'tsc')],
  [
    'TypeScript 7.0.2',
    resolve(
      'test',
      'fixtures',
      'react-19',
      'node_modules',
      'typescript',
      'bin',
      'tsc',
    ),
  ],
];
const fixtures = ['react-18-types', 'react-19'];
const resolutions = ['bundler', 'nodenext'];
const consumerFixture = resolve('test', 'fixtures', 'types', 'consumer.tsx');
const generatedDeclaration = resolve('dist', 'index.d.ts');
const generatedDirectories = fixtures.map((fixture) =>
  resolve('test', 'fixtures', fixture, '.type-package'),
);

try {
  for (const directory of generatedDirectories) {
    mkdirSync(directory, { recursive: true });
    copyFileSync(consumerFixture, resolve(directory, 'consumer.tsx'));
    copyFileSync(generatedDeclaration, resolve(directory, 'index.d.ts'));
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
