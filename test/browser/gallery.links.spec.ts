import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const openLinkedGallery = async (page: Page, scenario = 'linked') => {
  await page.goto(`/?scenario=${scenario}`);
  await page.locator('body[data-gallery-ready="true"]').waitFor();
};

const getFirstTileLink = (page: Page) =>
  page.locator('.ReactGridGallery').getByRole('link').first();

const expectLinkedDestination = async (newPage: Page) => {
  await newPage.waitForLoadState();
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

  test('preserves native modified-click navigation', async ({
    context,
    page,
  }) => {
    await openLinkedGallery(page);

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      getFirstTileLink(page).click({ modifiers: ['Control'] }),
    ]);

    await expectLinkedDestination(newPage);
    await expect(page.locator('body')).toHaveAttribute(
      'data-gallery-click',
      'modified',
    );
    await newPage.close();
  });

  test('preserves native middle-click navigation', async ({
    context,
    page,
  }) => {
    await openLinkedGallery(page);

    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      getFirstTileLink(page).click({ button: 'middle' }),
    ]);

    await expectLinkedDestination(newPage);
    await expect(newPage).toHaveURL(
      /(?:\?|&)scenario=linked-destination(?:&|$)/,
    );
    await expect(page.locator('body')).not.toHaveAttribute(
      'data-gallery-click',
    );
    await newPage.close();
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
});
