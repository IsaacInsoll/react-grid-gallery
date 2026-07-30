import * as gallery from '@picr/react-grid-gallery';

const expectedExports = [
  'CheckButton',
  'Gallery',
  'buildLayout',
  'buildLayoutFlat',
].sort();
const actualExports = Object.keys(gallery).sort();
const missingExports = expectedExports.filter(
  (name) => !actualExports.includes(name),
);
const unexpectedExports = actualExports.filter(
  (name) => !expectedExports.includes(name),
);

if (missingExports.length > 0 || unexpectedExports.length > 0) {
  throw new Error(
    [
      'Runtime exports do not match the expected public API.',
      `Missing: ${missingExports.join(', ') || 'none'}`,
      `Unexpected: ${unexpectedExports.join(', ') || 'none'}`,
    ].join('\n'),
  );
}

for (const [name, value] of Object.entries(gallery)) {
  if (typeof value !== 'function') {
    throw new TypeError(`Expected ${name} to be a function.`);
  }
}
