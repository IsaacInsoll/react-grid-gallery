import { expect, test } from '@playwright/test';
import type { Page, TestInfo } from '@playwright/test';

const openScenario = async (page: Page, scenario = 'default') => {
  await page.goto(`/?scenario=${scenario}`);
  await page.locator('body[data-gallery-ready="true"]').waitFor();
};

const settleLayout = async (page: Page) => {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            resolve();
          }),
        ),
      ),
  );
};

const attachParityFailure = async (
  testInfo: TestInfo,
  unlinkedScreenshot: Buffer,
  linkedScreenshot: Buffer,
) => {
  if (linkedScreenshot.equals(unlinkedScreenshot)) return;

  await Promise.all([
    testInfo.attach('unlinked-gallery.png', {
      body: unlinkedScreenshot,
      contentType: 'image/png',
    }),
    testInfo.attach('linked-gallery.png', {
      body: linkedScreenshot,
      contentType: 'image/png',
    }),
  ]);
};

test.describe('Gallery visual regression', () => {
  test('renders with React 18', async ({ page }) => {
    await openScenario(page);

    await expect(page).toHaveScreenshot('default.png');
  });

  test('renders linked viewports identically to unlinked viewports', async ({
    page,
  }, testInfo) => {
    await openScenario(page);
    const unlinkedScreenshot = await page.screenshot({
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    });

    await openScenario(page, 'linked');
    const linkedScreenshot = await page.screenshot({
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
    });

    // markReady gates image loading and two animation frames; neither capture
    // focuses a tile, so exact PNG parity is deterministic in pinned Chromium.
    await attachParityFailure(testInfo, unlinkedScreenshot, linkedScreenshot);

    // Keep default.png single-writer while still enforcing unfocused parity.
    expect(linkedScreenshot).toEqual(unlinkedScreenshot);
  });

  test('responds to viewport resizing', async ({ page }) => {
    await openScenario(page);

    for (const [width, height] of [
      [320, 570],
      [360, 640],
      [480, 854],
      [960, 540],
      [1024, 640],
      [1366, 768],
      [1920, 1080],
    ] as const) {
      await page.setViewportSize({ width, height });
      await settleLayout(page);

      await expect(page).toHaveScreenshot(
        `resize-${String(width)}x${String(height)}.png`,
      );
    }
  });

  test('responds to masonry viewport resizing', async ({ page }) => {
    await openScenario(page, 'masonry');

    for (const [width, height] of [
      [320, 570],
      [360, 640],
      [480, 854],
      [960, 540],
      [1024, 640],
      [1366, 768],
      [1920, 1080],
    ] as const) {
      await page.setViewportSize({ width, height });
      await settleLayout(page);

      await expect(page).toHaveScreenshot(
        `masonry-resize-${String(width)}x${String(height)}.png`,
      );
    }
  });

  test('rescales justified rows without cropping image edges', async ({
    page,
  }) => {
    await openScenario(page, 'row-justification');

    const geometry = await page
      .locator('.ReactGridGallery_tile-viewport')
      .evaluateAll((viewports) =>
        viewports.map((viewport) => {
          const image = viewport.querySelector('img');
          if (!image) throw new Error('Expected a thumbnail image.');

          const viewportBounds = viewport.getBoundingClientRect();
          const imageBounds = image.getBoundingClientRect();
          return {
            imageLeft: imageBounds.left,
            imageRight: imageBounds.right,
            marginLeft: getComputedStyle(image).marginLeft,
            viewportHeight: viewportBounds.height,
            viewportLeft: viewportBounds.left,
            viewportRight: viewportBounds.right,
          };
        }),
      );

    for (const item of geometry) {
      expect(item.imageLeft).toBeGreaterThanOrEqual(item.viewportLeft);
      expect(item.imageRight).toBeLessThanOrEqual(item.viewportRight);
      expect(item.marginLeft).toBe('0px');
    }
    expect(geometry[1]?.viewportHeight).toBe(163);
    await expect(page).toHaveScreenshot('row-justification.png');
  });

  test('renders masonry columns with stable geometry', async ({ page }) => {
    await openScenario(page, 'masonry');

    const geometry = await page
      .locator('.ReactGridGallery_masonry-column')
      .evaluateAll((columns) =>
        columns.map((column) => {
          const columnBounds = column.getBoundingClientRect();
          const viewports = Array.from(
            column.querySelectorAll('.ReactGridGallery_tile-viewport'),
          );

          return {
            columnWidth: columnBounds.width,
            viewportWidths: viewports.map(
              (viewport) => viewport.getBoundingClientRect().width,
            ),
            verticalGaps: viewports.slice(1).map((viewport, index) => {
              const previous = viewports[index];
              if (!previous) throw new Error('Expected previous viewport.');

              return (
                viewport.getBoundingClientRect().top -
                previous.getBoundingClientRect().bottom
              );
            }),
          };
        }),
      );

    expect(geometry).toHaveLength(4);
    for (const column of geometry) {
      expect(column.viewportWidths.every((width) => width === 192)).toBe(true);
      expect(column.columnWidth).toBeGreaterThanOrEqual(196);
      expect(column.verticalGaps.every((gap) => gap === 4)).toBe(true);
    }
    await expect(page).toHaveScreenshot('masonry.png');
  });

  for (const [name, scenario, snapshot] of [
    ['uses rowHeight', 'row-height', 'row-height-100.png'],
    ['uses margin', 'margin', 'margin-10.png'],
    ['limits maxRows', 'max-rows', 'max-rows-2.png'],
    ['shows selected images', 'selected', 'selected.png'],
    [
      'shows selected masonry images',
      'masonry-selected',
      'masonry-selected.png',
    ],
    [
      'shows masonry images with thumbnail captions',
      'masonry-caption',
      'masonry-caption.png',
    ],
    ['shows transparent images', 'transparent', 'transparent.png'],
    ['uses nano placeholders', 'nano', 'nano.png'],
    ['shows tags', 'tags', 'tags.png'],
    ['applies tagStyle', 'tag-style', 'tag-style.png'],
    ['handles decimal container width', 'decimal-width', 'decimal-width.png'],
    [
      'handles decimal masonry container width',
      'masonry-decimal-width',
      'masonry-decimal-width.png',
    ],
    ['uses masonry margin', 'masonry-margin', 'masonry-margin-10.png'],
  ] as const) {
    test(name, async ({ page }) => {
      await openScenario(page, scenario);

      await expect(page).toHaveScreenshot(snapshot);
    });
  }
});
