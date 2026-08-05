import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export const assertPublishedPackage = (
  packument,
  { distTag, rejectVersionAsLatest = false, version },
) => {
  if (!packument.versions?.[version]) {
    throw new Error(`npm does not expose version ${version}.`);
  }

  if (packument['dist-tags']?.[distTag] !== version) {
    throw new Error(`npm tag ${distTag} does not point to ${version}.`);
  }

  if (rejectVersionAsLatest && packument['dist-tags']?.latest === version) {
    throw new Error(
      `npm unexpectedly points latest to prerelease version ${version}.`,
    );
  }
};

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const isMain =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
  const [version, distTag, ...flags] = process.argv.slice(2);

  if (!version || !distTag) {
    throw new Error('Expected a version and npm distribution tag.');
  }

  const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
  const registryUrl = `https://registry.npmjs.org/${encodeURIComponent(manifest.name)}`;
  const options = {
    distTag,
    rejectVersionAsLatest: flags.includes('--reject-version-as-latest'),
    version,
  };
  let lastError;

  for (let attempt = 1; attempt <= 12; attempt += 1) {
    try {
      const response = await fetch(registryUrl, {
        headers: { accept: 'application/vnd.npm.install-v1+json' },
      });

      if (!response.ok) {
        throw new Error(`npm registry returned HTTP ${response.status}.`);
      }

      assertPublishedPackage(await response.json(), options);
      console.log(
        `Verified ${manifest.name}@${version} with npm tag ${distTag}.`,
      );
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;

      if (attempt < 12) {
        console.log(`npm verification attempt ${attempt} failed; retrying.`);
        await delay(5000);
      }
    }
  }

  if (lastError) {
    throw lastError;
  }
}
