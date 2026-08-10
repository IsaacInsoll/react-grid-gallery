import { Markdown } from '@storybook/addon-docs/blocks';
import changelog from '../CHANGELOG.md?raw';
import { parseChangelog } from './release-notes';

const releaseStatusLabel = {
  upcoming: 'Upcoming',
  current: 'Current documentation build',
  previous: 'Previous release',
} as const;

export const ReleaseNotes = () => {
  const { releases, inheritedMarkdown } = parseChangelog(
    changelog,
    __STORYBOOK_PACKAGE_VERSION__,
  );

  return (
    <>
      <div className="release-list">
        {releases.map((release) => (
          <article
            key={release.version}
            className="release-card"
            data-release-status={release.status}
          >
            <header>
              <div>
                <span className="release-card__status">
                  {releaseStatusLabel[release.status]}
                </span>
                <h2>v{release.version}</h2>
              </div>
              {release.date ? <time>{release.date}</time> : null}
            </header>
            <div className="release-card__notes">
              <Markdown>{release.body}</Markdown>
            </div>
            {release.status !== 'upcoming' ? (
              <footer>
                <a
                  href={`https://github.com/IsaacInsoll/react-grid-gallery/releases/tag/v${release.version}`}
                >
                  GitHub Release <span aria-hidden="true">↗</span>
                </a>
                <a
                  href={`https://www.npmjs.com/package/@picr/react-grid-gallery/v/${release.version}`}
                >
                  npm package <span aria-hidden="true">↗</span>
                </a>
              </footer>
            ) : (
              <footer className="release-card__pending">
                Release links appear when this version becomes the documentation
                build.
              </footer>
            )}
          </article>
        ))}
      </div>

      {inheritedMarkdown ? (
        <details className="inherited-release-history">
          <summary>Inherited react-grid-gallery release history</summary>
          <Markdown>{inheritedMarkdown}</Markdown>
        </details>
      ) : null}
    </>
  );
};
