# Triage relevant issues from the original project

## Context

The original `benhowell/react-grid-gallery` repository accumulated open issues
after maintenance slowed down. Some reports may still describe useful fixes for
this maintained successor, and the original reporters and contributors should
receive credit when their work is adopted.

Stable `1.0.0` was published on 2026-08-07, so this post-release review can now
begin independently of the completed first-release work.

## Proposed Work

- [x] Review the original repository's open non-dependency issues at a high
      level, alongside closed issue patterns that expose documentation gaps
- [ ] Reproduce each potentially relevant report against the modern package
- [ ] Close or skip reports that are obsolete, unsupported, or no longer
      reproducible
- [ ] Create focused issues in this repository for fixes worth pursuing
- [ ] Link every adopted issue back to its original report
- [ ] Credit the original reporter and any contributor whose work informs a fix
- [ ] Check related closed or reverted human-authored pull requests when they are
      relevant to an issue being evaluated

## Scope Notes

- Skip the original repository's current Dependabot-only pull requests; this
  project manages its own dependency updates.
- Do not assume historical patches apply cleanly to the modernized codebase.
- Confirm licensing and attribution before copying or porting third-party code.
- This issue does not promise that every historical report will be fixed.

## 2026-08-10 High-Level Audit

The upstream repository contains 158 issues: 13 open and 145 closed. Repeated
reports cluster around container measurement, intrinsic dimensions, controlled
selection, replacement-style semantics, and responsibilities deliberately left
to the consuming application. Those patterns now feed Storybook's
Troubleshooting guide and focused examples; they do not by themselves change
the package API.

| Open issue                                                                               | High-level disposition                                                                        |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| [#370 React 18 issue](https://github.com/benhowell/react-grid-gallery/issues/370)        | Obsolete for this fork: React 18 and 19 are supported and tested.                             |
| [#366 hidden container](https://github.com/benhowell/react-grid-gallery/issues/366)      | Addressed by the maintained ResizeObserver regression fix and live hidden-container guidance. |
| [#339 resize behavior](https://github.com/benhowell/react-grid-gallery/issues/339)       | Reassess against the current ResizeObserver implementation if a focused reproduction remains. |
| [#337 `defaultProps`](https://github.com/benhowell/react-grid-gallery/issues/337)        | Obsolete in the maintained implementation.                                                    |
| [#336 crop coordinates](https://github.com/benhowell/react-grid-gallery/issues/336)      | Unsupported feature; custom thumbnails or headless layout are the current escape hatches.     |
| [#335 local images](https://github.com/benhowell/react-grid-gallery/issues/335)          | Documentation gap addressed with bundler URL guidance.                                        |
| [#295 gallery-item styling](https://github.com/benhowell/react-grid-gallery/issues/295)  | Potential API/escape-hatch request; not claimed as fixed by current style props.              |
| [#258 inline styles](https://github.com/benhowell/react-grid-gallery/issues/258)         | Supported style props require clear replacement-semantics documentation.                      |
| [#129 viewer and pagination](https://github.com/benhowell/react-grid-gallery/issues/129) | Consumer-owned behavior, demonstrated through maintained integration and loading examples.    |
| [#127 square grid](https://github.com/benhowell/react-grid-gallery/issues/127)           | Not a justified-gallery guarantee; use custom thumbnails/headless layout for exact grids.     |
| [#122 images per row](https://github.com/benhowell/react-grid-gallery/issues/122)        | Exact column counts are not promised; masonry and headless helpers provide alternatives.      |
| [#117 mobile behavior](https://github.com/benhowell/react-grid-gallery/issues/117)       | Retain for focused responsive/accessibility review rather than resolving through prose alone. |
| [#108 drag ordering](https://github.com/benhowell/react-grid-gallery/issues/108)         | Unsupported feature request; application-owned ordering remains possible.                     |

Closed-issue sampling included the recurring hidden-container reports (#37,
#96, #226, #277, #284), intrinsic-dimension confusion (#62, #143, #144),
controlled selection (#16, #338), loading (#82), multiple galleries (#103),
orientation (#66), and layout requests (#122, #127). No third-party patch was
copied as part of this documentation audit.

## Acceptance Criteria

- [x] Every open upstream non-dependency issue has been reviewed at a high level
- [ ] Relevant work has a focused local issue with upstream links and credit
- [ ] Skipped items have a brief recorded reason
