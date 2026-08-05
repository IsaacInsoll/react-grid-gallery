interface PackageVersion {
  [key: string]: unknown;
}

interface PackageRegistryDocument {
  'dist-tags'?: Record<string, string>;
  versions?: Record<string, PackageVersion>;
}

interface PublishedPackageExpectation {
  distTag: string;
  requireNoLatest?: boolean;
  version: string;
}

export function assertPublishedPackage(
  packument: PackageRegistryDocument,
  expectation: PublishedPackageExpectation,
): void;
