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
    ]) {
      await page.setViewportSize({ width, height });
      await settleLayout(page);

      await expect(page).toHaveScreenshot(
        `resize-${String(width)}x${String(height)}.png`,
      );
    }
  });

  for (const [name, scenario, snapshot] of [
    ['uses rowHeight', 'row-height', 'row-height-100.png'],
    ['uses margin', 'margin', 'margin-10.png'],
    ['limits maxRows', 'max-rows', 'max-rows-2.png'],
    ['shows selected images', 'selected', 'selected.png'],
    ['shows transparent images', 'transparent', 'transparent.png'],
    ['uses nano placeholders', 'nano', 'nano.png'],
    ['shows tags', 'tags', 'tags.png'],
    ['applies tagStyle', 'tag-style', 'tag-style.png'],
    ['handles decimal container width', 'decimal-width', 'decimal-width.png'],
  ] as const) {
    test(name, async ({ page }) => {
      await openScenario(page, scenario);

      await expect(page).toHaveScreenshot(snapshot);
    });
  }
});
