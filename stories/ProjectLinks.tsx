import type { ReactNode } from 'react';

type ProjectLinkProps = {
  href: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
};

const ProjectLink = ({
  href,
  icon,
  eyebrow,
  title,
  description,
}: ProjectLinkProps) => (
  <a href={href}>
    <span className="docs-project-link__icon" aria-hidden="true">
      {icon}
    </span>
    <span className="docs-project-link__copy">
      <span className="docs-project-link__eyebrow">{eyebrow}</span>
      <strong>
        <span>{title}</span>
        <span aria-hidden="true">→</span>
      </strong>
      <span>{description}</span>
    </span>
  </a>
);

const GitHubMark = () => (
  <svg viewBox="0 0 24 24" role="img">
    <path
      fill="currentColor"
      d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.87c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02A9.57 9.57 0 0 1 12 6.82c.85 0 1.69.11 2.48.34 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
    />
  </svg>
);

const NpmMark = () => (
  <svg viewBox="0 0 24 24" role="img">
    <path
      fill="currentColor"
      d="M2 5h20v14H12v-3H9v3H2V5Zm3 3v8h3V8H5Zm6 0v5h3V8h-3Zm3 0h3v8h-3v-3Z"
    />
  </svg>
);

const PicrMark = () => (
  <svg viewBox="0 0 24 24" role="img">
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      d="M4 8.5h3l1.4-2h7.2l1.4 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z"
    />
    <circle
      cx="12"
      cy="14"
      r="3.4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

export const ProjectLinks = () => (
  <nav className="docs-project-links" aria-label="Project links">
    <ProjectLink
      href="https://github.com/IsaacInsoll/react-grid-gallery"
      icon={<GitHubMark />}
      eyebrow="GitHub"
      title="Source and issues"
      description="Read the code, report a bug, or contribute."
    />
    <ProjectLink
      href="https://www.npmjs.com/package/@picr/react-grid-gallery"
      icon={<NpmMark />}
      eyebrow="npm"
      title="Install the package"
      description="Inspect versions, provenance, and package metadata."
    />
    <ProjectLink
      href="https://github.com/IsaacInsoll/PICR"
      icon={<PicrMark />}
      eyebrow="As used by PICR"
      title="See the real product"
      description="Self-hosted client photo delivery built with this gallery."
    />
  </nav>
);
