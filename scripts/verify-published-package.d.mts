interface PackageVersion {
  [key: string]: unknown;
}

interface PackageRegistryDocument {
  'dist-tags'?: Record<string, string>;
  versions?: Record<string, PackageVersion>;
}

interface PublishedPackageExpectation {
  allowVersionAsLatest?: boolean;
  distTag: string;
  version: string;
}

export function assertPublishedPackage(
  packument: PackageRegistryDocument,
  expectation: PublishedPackageExpectation,
): void;
