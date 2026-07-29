import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

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

test.describe('Gallery visual regression', () => {
  test('renders with React 18', async ({ page }) => {
    await openScenario(page);

    await expect(page).toHaveScreenshot('default.png');
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
