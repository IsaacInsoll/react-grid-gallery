import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const openLinkedGallery = async (page: Page, scenario = 'linked') => {
  await page.goto(`/?scenario=${scenario}`);
  await page.locator('body[data-gallery-ready="true"]').waitFor();
};

const getFirstTileLink = (page: Page) =>
  page.locator('.ReactGridGallery').getByRole('link').first();

const expectLinkedDestination = async (newPage: Page) => {
  await newPage.waitForURL(/(?:\?|&)scenario=linked-destination(?:&|$)/);
  const url = new URL(newPage.url());
  expect(url.searchParams.get('scenario')).toBe('linked-destination');
  expect(url.searchParams.get('image')).toBe('0');
};

test.describe('Linked gallery tiles', () => {
  test('lets consumers prevent an ordinary click', async ({ page }) => {
    await openLinkedGallery(page);

    const link = getFirstTileLink(page);
    await link.click();

    await expect(page.locator('body')).toHaveAttribute(
      'data-gallery-click',
      'plain',
    );
    expect(new URL(page.url()).searchParams.get('scenario')).toBe('linked');
  });

  test('is keyboard focusable and lets consumers prevent Enter navigation', async ({
    page,
  }) => {
    await openLinkedGallery(page);

    const link = getFirstTileLink(page);
    await link.focus();
    await expect(link).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(page.locator('body')).toHaveAttribute(
      'data-gallery-click',
      'keyboard',
    );
    expect(new URL(page.url()).searchParams.get('scenario')).toBe('linked');
  });

  test('leaves modified-click navigation to the browser', async ({ page }) => {
    await openLinkedGallery(page);

    const link = getFirstTileLink(page);
    await expect(link).toHaveAttribute(
      'href',
      /(?:\?|&)scenario=linked-destination(?:&|$)/,
    );
    await link.click({ modifiers: ['Control'] });

    await expect(page.locator('body')).toHaveAttribute(
      'data-gallery-click',
      'modified',
    );
    expect(new URL(page.url()).searchParams.get('scenario')).toBe('linked');
  });

  test('leaves middle-click navigation to the browser', async ({ page }) => {
    await openLinkedGallery(page);

    const link = getFirstTileLink(page);
    await expect(link).toHaveAttribute(
      'href',
      /(?:\?|&)scenario=linked-destination(?:&|$)/,
    );
    await link.click({ button: 'middle' });

    await expect(page.locator('body')).not.toHaveAttribute(
      'data-gallery-click',
    );
    expect(new URL(page.url()).searchParams.get('scenario')).toBe('linked');
  });

  test('follows an unprevented ordinary click in the current tab', async ({
    page,
  }) => {
    await openLinkedGallery(page, 'linked-native');

    await getFirstTileLink(page).click();

    await expectLinkedDestination(page);
    await expect(page).toHaveURL(/(?:\?|&)scenario=linked-destination(?:&|$)/);
  });

  test('follows an unprevented Enter activation in the current tab', async ({
    page,
  }) => {
    await openLinkedGallery(page, 'linked-native');

    const link = getFirstTileLink(page);
    await link.focus();
    await expect(link).toBeFocused();
    await Promise.all([
      page.waitForURL(/(?:\?|&)scenario=linked-destination(?:&|$)/),
      page.keyboard.press('Enter'),
    ]);

    await expectLinkedDestination(page);
  });

  test('focuses masonry selection button before the linked viewport', async ({
    page,
  }) => {
    await openLinkedGallery(page, 'masonry-linked');

    const button = page
      .locator('.ReactGridGallery_masonry')
      .getByRole('button', { name: 'Select image' })
      .first();
    const link = page
      .locator('.ReactGridGallery_masonry')
      .getByRole('link')
      .first();

    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(link).toBeFocused();
  });
});
