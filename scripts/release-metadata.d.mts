interface ReleaseManifest {
  version: string;
}

interface ReleaseMetadata {
  bootstrap: boolean;
  distTag: 'latest' | 'next';
  prerelease: boolean;
  tag: string;
  version: string;
}

export function getReleaseMetadata(
  manifest: ReleaseManifest,
  tag: string,
): ReleaseMetadata;
