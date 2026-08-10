import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const openSelectionGallery = async (page: Page, scenario = 'selection') => {
  await page.goto(`/?scenario=${scenario}`);
  await page.locator('body[data-gallery-ready="true"]').waitFor();
};

const getFirstSelectionButton = (page: Page) =>
  page
    .locator('.ReactGridGallery')
    .getByRole('button', { name: 'Select image' })
    .first();

test.describe('Selectable gallery tiles', () => {
  test('keeps hidden selection buttons keyboard-focusable and activatable', async ({
    page,
  }) => {
    await openSelectionGallery(page);

    const button = getFirstSelectionButton(page);
    await page.keyboard.press('Tab');

    await expect(button).toBeFocused();
    await expect(button).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toHaveAttribute(
      'data-gallery-select',
      '0',
    );
  });

  test('keeps masonry selection buttons keyboard-focusable and activatable', async ({
    page,
  }) => {
    await openSelectionGallery(page, 'masonry-selection');

    const button = getFirstSelectionButton(page);
    await page.keyboard.press('Tab');

    await expect(button).toBeFocused();
    await expect(button).toBeVisible();

    await page.keyboard.press('Enter');
    await expect(page.locator('body')).toHaveAttribute(
      'data-gallery-select',
      '0',
    );
  });
});
