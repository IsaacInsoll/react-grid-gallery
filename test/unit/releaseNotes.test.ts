import { describe, expect, it } from 'vitest';
import { extractReleaseNotes } from '../../scripts/release-notes.mjs';

describe('release notes script', () => {
  it('returns the curated section for the requested version', () => {
    const changelog = `# Changelog

## v1.0.0-rc.0 / 2026-08-03

- First release candidate.
- Preserves attribution.

## Inherited history

- Older entry.
`;

    expect(extractReleaseNotes(changelog, '1.0.0-rc.0')).toBe(
      '- First release candidate.\n- Preserves attribution.',
    );
  });

  it('rejects a missing release section', () => {
    expect(() => extractReleaseNotes('# Changelog\n', '1.0.0')).toThrow(
      'Expected one "## v1.0.0" release section',
    );
  });

  it('rejects duplicate release sections', () => {
    const changelog = `# Changelog

## v1.0.0

- First copy.

## v1.0.0 / 2026-08-03

- Second copy.
`;

    expect(() => extractReleaseNotes(changelog, '1.0.0')).toThrow(
      'Expected one "## v1.0.0" release section, found 2',
    );
  });

  it('rejects an empty release section', () => {
    const changelog = `# Changelog

## v1.0.0

## Inherited history
`;

    expect(() => extractReleaseNotes(changelog, '1.0.0')).toThrow(
      'changelog section has no release notes',
    );
  });
});
