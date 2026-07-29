import { expect, test } from '@playwright/test';

const imagesCount = 24;

for (const [name, scenario, customThumbnailCount] of [
  ['the default image', 'default', 0],
  ['a custom thumbnail', 'custom-thumbnail', imagesCount],
] as const) {
  test(`renders and hydrates ${name} with React 19`, async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        errors.push(message.text());
      }
    });
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`/?hydrate&scenario=${scenario}`);
    await page.locator('body[data-gallery-ready="true"]').waitFor();

    await expect(page.locator('body')).toHaveAttribute(
      'data-react-version',
      '19',
    );
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(
      imagesCount,
    );

    await expect(page.locator('img.custom-thumbnail')).toHaveCount(
      customThumbnailCount,
    );

    expect(errors).toEqual([]);
  });
}
