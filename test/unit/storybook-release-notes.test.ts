import { describe, expect, it } from 'vitest';
import { parseChangelog } from '../../stories/release-notes';

const changelog = `# CHANGELOG

## v1.1.0 / 2026-08-10

### Features

- Add masonry.

## v1.0.0 / 2026-08-05

- First stable release.

## v1.0.0-rc.0 / 2026-08-04

- Release candidate.

## Inherited \`react-grid-gallery\` History

### v0.5.6 / 2022-08-23

- Historical fix.
`;

describe('Storybook release notes', () => {
  it('classifies entries around the documentation build', () => {
    const result = parseChangelog(changelog, '1.0.0');

    expect(
      result.releases.map(({ version, status }) => [version, status]),
    ).toEqual([
      ['1.1.0', 'upcoming'],
      ['1.0.0', 'current'],
      ['1.0.0-rc.0', 'previous'],
    ]);
    expect(result.inheritedMarkdown).toContain(
      '## Inherited `react-grid-gallery` History',
    );
    expect(result.inheritedMarkdown).toContain('Historical fix.');
  });

  it('rejects a documentation version without curated notes', () => {
    expect(() => parseChangelog(changelog, '2.0.0')).toThrow(
      'CHANGELOG.md has no release section for documentation version 2.0.0',
    );
  });
});
