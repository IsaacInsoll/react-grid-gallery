import { describe, expect, it } from 'vitest';
import { getReleaseMetadata } from '../../scripts/release-metadata.mjs';
import { assertPublishedPackage } from '../../scripts/verify-published-package.mjs';

describe('release workflow metadata', () => {
  it('marks the first release candidate as the token bootstrap', () => {
    expect(
      getReleaseMetadata({ version: '1.0.0-rc.0' }, 'v1.0.0-rc.0'),
    ).toEqual({
      bootstrap: true,
      distTag: 'next',
      prerelease: true,
      tag: 'v1.0.0-rc.0',
      version: '1.0.0-rc.0',
    });
  });

  it('uses latest for a stable release', () => {
    expect(getReleaseMetadata({ version: '1.0.0' }, 'v1.0.0')).toMatchObject({
      bootstrap: false,
      distTag: 'latest',
      prerelease: false,
    });
  });

  it('rejects a tag that differs from the package version', () => {
    expect(() => getReleaseMetadata({ version: '1.0.0' }, 'v1.0.1')).toThrow(
      'does not match package version',
    );
  });

  it('rejects malformed prerelease versions', () => {
    expect(() =>
      getReleaseMetadata({ version: '1.0.0-01' }, 'v1.0.0-01'),
    ).toThrow('Invalid semantic release version');
  });

  it('rejects the unpublished development placeholder', () => {
    expect(() =>
      getReleaseMetadata(
        { version: '0.0.0-development' },
        'v0.0.0-development',
      ),
    ).toThrow('development placeholder');
  });
});

describe('published package verification', () => {
  const packument = {
    'dist-tags': { next: '1.0.0-rc.0' },
    versions: { '1.0.0-rc.0': {} },
  };

  it('accepts the expected version and distribution tag', () => {
    expect(() => {
      assertPublishedPackage(packument, {
        distTag: 'next',
        requireNoLatest: true,
        version: '1.0.0-rc.0',
      });
    }).not.toThrow();
  });

  it('rejects a missing version or mismatched distribution tag', () => {
    expect(() => {
      assertPublishedPackage(packument, {
        distTag: 'latest',
        version: '1.0.0',
      });
    }).toThrow('does not expose version');

    expect(() => {
      assertPublishedPackage(packument, {
        distTag: 'latest',
        version: '1.0.0-rc.0',
      });
    }).toThrow('latest does not point');
  });

  it('rejects latest during the first prerelease bootstrap', () => {
    expect(() => {
      assertPublishedPackage(
        {
          ...packument,
          'dist-tags': { latest: '1.0.0-rc.0', next: '1.0.0-rc.0' },
        },
        {
          distTag: 'next',
          requireNoLatest: true,
          version: '1.0.0-rc.0',
        },
      );
    }).toThrow('unexpectedly exposes latest');
  });
});
