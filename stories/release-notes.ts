export type ReleaseStatus = 'upcoming' | 'current' | 'previous';

export type ReleaseNote = {
  version: string;
  date?: string;
  body: string;
  status: ReleaseStatus;
};

export type ParsedChangelog = {
  releases: ReleaseNote[];
  inheritedMarkdown: string;
};

export const parseChangelog = (
  changelog: string,
  documentationVersion: string,
): ParsedChangelog => {
  const sections = changelog.split(/^## /m).slice(1);
  const inheritedIndex = sections.findIndex((section) =>
    section.startsWith('Inherited `react-grid-gallery` History'),
  );
  const maintainedSections =
    inheritedIndex >= 0 ? sections.slice(0, inheritedIndex) : sections;
  const parsedReleases = maintainedSections.flatMap((section) => {
    const [heading = '', ...bodyLines] = section.split('\n');
    const match = /^v([^\s/]+)(?: \/ (.+))?$/.exec(heading.trim());
    if (!match?.[1]) return [];

    return [
      {
        version: match[1],
        date: match[2],
        body: bodyLines.join('\n').trim(),
      },
    ];
  });
  const currentIndex = parsedReleases.findIndex(
    ({ version }) => version === documentationVersion,
  );
  const inheritedSection =
    inheritedIndex >= 0 ? sections[inheritedIndex] : undefined;

  if (currentIndex < 0) {
    throw new Error(
      `CHANGELOG.md has no release section for documentation version ${documentationVersion}`,
    );
  }

  return {
    releases: parsedReleases.map((release, index) => ({
      ...release,
      status:
        index < currentIndex
          ? 'upcoming'
          : index === currentIndex
            ? 'current'
            : 'previous',
    })),
    inheritedMarkdown: inheritedSection ? `## ${inheritedSection.trim()}` : '',
  };
};
