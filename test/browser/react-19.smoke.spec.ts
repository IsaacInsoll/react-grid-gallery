import { expect, test } from '@playwright/test';

const imagesCount = 24;

test('renders and hydrates with React 19', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(message.text());
    }
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.goto('/?hydrate');
  await page.locator('body[data-gallery-ready="true"]').waitFor();

  await expect(page.locator('body')).toHaveAttribute(
    'data-react-version',
    '19',
  );
  await expect(page.getByTestId('grid-gallery-item')).toHaveCount(imagesCount);
  expect(errors).toEqual([]);
});
