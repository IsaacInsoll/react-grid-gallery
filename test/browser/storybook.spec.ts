import fs from 'node:fs';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const packageManifest = JSON.parse(
  fs.readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as { version: string };

const openStory = async (page: Page, id: string) => {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.getByTestId('story-surface').waitFor();
  await page.waitForFunction(() =>
    Array.from(document.images).every((image) => image.complete),
  );
  await page.evaluate(async () => {
    await Promise.all(Array.from(document.images, (image) => image.decode()));
  });
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

const openDocs = async (page: Page, id: string, heading: string) => {
  await page.goto(`/iframe.html?id=${id}&viewMode=docs`);
  await page.getByRole('heading', { name: heading, level: 1 }).waitFor();
};

test.describe('Static Storybook', () => {
  test('renders the curated documentation without remote runtime requests', async ({
    page,
  }) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname !== '127.0.0.1') externalRequests.push(url.href);
    });

    await page.goto('/?path=/docs/start-welcome--documentation');
    const preview = page.frameLocator('#storybook-preview-iframe');
    await expect(
      preview.getByRole('heading', {
        name: 'A gallery that makes the geometry disappear.',
      }),
    ).toBeVisible();
    await expect(
      preview.getByRole('heading', { name: 'Park day' }),
    ).toBeVisible();
    await expect(
      preview.getByRole('heading', { name: 'Where next?' }),
    ).toBeVisible();
    expect(externalRequests).toEqual([]);
  });

  for (const [id, heading] of [
    [
      'start-welcome--documentation',
      'A gallery that makes the geometry disappear.',
    ],
    [
      'start-getting-started--documentation',
      'Get from install to gallery in minutes',
    ],
    ['guides-recipes--documentation', 'Practical recipes'],
    ['guides-troubleshooting--documentation', 'Troubleshooting by symptom'],
    ['guides-api-reference--documentation', 'API Reference'],
    ['guides-migration--documentation', 'Migrating from react-grid-gallery'],
    ['guides-releases--documentation', 'Releases'],
    ['guides-acknowledgements--documentation', 'Acknowledgements'],
    ['contributors-contributing--documentation', 'Contributing'],
    ['contributors-testing-checks--documentation', 'Testing And Checks'],
  ] as const) {
    test(`renders the ${heading} documentation page`, async ({ page }) => {
      await openDocs(page, id, heading);
      await expect(
        page.getByRole('heading', { name: heading, level: 1 }),
      ).toBeVisible();
    });
  }

  test('compares migration environments left to right', async ({ page }) => {
    await openDocs(
      page,
      'guides-migration--documentation',
      'Migrating from react-grid-gallery',
    );

    const table = page.getByRole('table').first();
    await expect(table.getByRole('columnheader')).toHaveText([
      'Area',
      'react-grid-gallery',
      '@picr/react-grid-gallery',
    ]);
    await expect(
      table.getByRole('row', { name: /Module formats/ }),
    ).toContainText('CommonJS, ESM, and UMD');
    await expect(table.getByRole('row', { name: /Node\.js/ })).toContainText(
      'Node.js 22 or newer',
    );
  });

  test('shows navigation for long guides without crowding Welcome', async ({
    page,
  }) => {
    await openDocs(page, 'guides-recipes--documentation', 'Practical recipes');

    const tableOfContents = page.getByRole('navigation', {
      name: 'On this page',
    });
    await expect(tableOfContents).toBeVisible();
    await expect(
      tableOfContents.getByRole('link', {
        name: 'Choose justified rows or masonry columns',
      }),
    ).toBeVisible();

    await openDocs(
      page,
      'start-welcome--documentation',
      'A gallery that makes the geometry disappear.',
    );
    await expect(
      page.getByRole('navigation', { name: 'On this page' }),
    ).toBeHidden();
  });

  test('labels release destinations precisely', async ({ page }) => {
    await openDocs(page, 'guides-releases--documentation', 'Releases');

    const upcoming = page.locator('[data-release-status="upcoming"]');
    for (let index = 0; index < (await upcoming.count()); index += 1) {
      await expect(
        upcoming
          .nth(index)
          .getByRole('link', { name: /GitHub Release|npm package/ }),
      ).toHaveCount(0);
    }

    const current = page.locator('[data-release-status="current"]');
    await expect(
      current.getByRole('heading', { name: `v${packageManifest.version}` }),
    ).toBeVisible();
    await expect(
      current.getByRole('link', { name: /GitHub Release/ }),
    ).toHaveAttribute(
      'href',
      `https://github.com/IsaacInsoll/react-grid-gallery/releases/tag/v${packageManifest.version}`,
    );
    await expect(
      current.getByRole('link', { name: /npm package/ }),
    ).toHaveAttribute(
      'href',
      `https://www.npmjs.com/package/@picr/react-grid-gallery/v/${packageManifest.version}`,
    );
  });

  for (const [id, heading] of [
    ['examples-photo-manager--documentation', 'Photo manager'],
    ['examples-gallery-workshop--documentation', 'Gallery workshop'],
    ['examples-mixed-destinations--documentation', 'Mixed destinations'],
    ['gallery-playground--documentation', 'Playground'],
    ['gallery-selection--documentation', 'Selection'],
    ['gallery-content--documentation', 'Content'],
    ['gallery-customization--documentation', 'Customization'],
    ['gallery-layout-edge-cases--documentation', 'Layout edge cases'],
    ['advanced-headless-layout--documentation', 'Headless layout'],
    ['advanced-viewer-integration--documentation', 'Viewer integration'],
  ] as const) {
    test(`renders the generated ${heading} documentation page`, async ({
      page,
    }) => {
      await openDocs(page, id, heading);
      await expect(
        page.getByRole('heading', { name: heading, level: 1 }),
      ).toBeVisible();
    });
  }

  test('keeps the welcome page visually intentional', async ({ page }) => {
    await openDocs(
      page,
      'start-welcome--documentation',
      'A gallery that makes the geometry disappear.',
    );
    await expect(page).toHaveScreenshot('storybook-welcome.png', {
      fullPage: true,
    });

    await page.setViewportSize({ width: 1600, height: 1000 });
    await expect(page).toHaveScreenshot('storybook-welcome-wide.png', {
      fullPage: true,
    });
  });

  test('keeps responsive galleries stable inside documentation canvases', async ({
    page,
  }) => {
    await openDocs(
      page,
      'examples-gallery-workshop--documentation',
      'Gallery workshop',
    );
    await page.waitForFunction(() =>
      Array.from(document.images).every((image) => image.complete),
    );
    const storySurface = page.getByTestId('story-surface').last();
    await storySurface
      .getByRole('slider', { name: 'Thumbnail size' })
      .fill('300');
    const docsOverflow = await storySurface.evaluate((surface) => {
      const docsStory = surface.closest('.docs-story');
      return docsStory ? getComputedStyle(docsStory).overflow : undefined;
    });
    expect(docsOverflow).toBe('clip');
    await page.setViewportSize({ width: 900, height: 860 });

    const samples = await storySurface.evaluate(async (surface) => {
      const sizes: string[] = [];
      for (let index = 0; index < 30; index += 1) {
        await new Promise<void>((resolve) => {
          requestAnimationFrame(() => {
            resolve();
          });
        });
        const bounds = surface.getBoundingClientRect();
        sizes.push(`${String(bounds.width)}x${String(bounds.height)}`);
      }
      return sizes;
    });

    expect(new Set(samples).size).toBe(1);
  });

  test('presents a believable photo-management screen', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await openStory(page, 'examples-photo-manager--working-library');

    await expect(page.getByTestId('manager-selected-count')).toHaveText(
      '3 selected',
    );
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(10);
    await expect(page).toHaveScreenshot('storybook-photo-manager.png', {
      fullPage: true,
    });
  });

  test('filters, selects a range, and performs reversible bulk work', async ({
    page,
  }) => {
    await openStory(page, 'examples-photo-manager--working-library');

    const firstTile = page.getByTestId('grid-gallery-item').first();
    await firstTile.hover();
    await firstTile.getByTitle('Select').click();
    await expect(page.getByTestId('manager-selected-count')).toHaveText(
      '4 selected',
    );

    const thirdTile = page.getByTestId('grid-gallery-item').nth(2);
    await thirdTile.hover();
    await thirdTile.getByTitle('Select').click({ modifiers: ['Shift'] });
    await expect(page.getByTestId('manager-selected-count')).toHaveText(
      '5 selected',
    );
    await expect(page.getByText('3 photos updated as a range.')).toBeVisible();

    await page
      .getByRole('searchbox', { name: 'Search library' })
      .fill('birthday');
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(1);
    await page.getByRole('searchbox', { name: 'Search library' }).fill('');

    await page.getByRole('button', { name: 'Archive' }).click();
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(5);
    await page.getByRole('button', { name: 'Undo' }).click();
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(10);
  });

  test('opens original-resolution lightbox files from optimized thumbnails', async ({
    page,
  }) => {
    await openStory(page, 'examples-photo-manager--working-library');
    await page.getByTestId('grid-gallery-item_viewport').first().click();

    const viewer = page.getByRole('dialog', { name: 'Lightbox' });
    const currentImage = viewer
      .locator('.yarl__slide_current')
      .getByRole('img');
    await expect(viewer).toBeVisible();
    await expect(currentImage).toHaveAttribute(
      'alt',
      'Black-and-white dog holding an orange and blue ball',
    );
    await expect(currentImage).toHaveAttribute('src', /XH2A2139.*\.jpg$/);
    await viewer.getByRole('button', { name: 'Close' }).click();
  });

  for (const [width, height] of [
    [390, 844],
    [768, 900],
    [1280, 800],
  ] as const) {
    test(`presents the responsive gallery at ${String(width)}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height });
      await openStory(page, 'gallery-playground--default-gallery');

      await expect(page.getByTestId('grid-gallery-item')).toHaveCount(10);
      await expect(page.getByTestId('story-surface')).toHaveAttribute(
        'data-package-mode',
        'built package',
      );
      const storySurface = page.getByTestId('story-surface');
      await expect(storySurface.locator('main')).toHaveCount(0);
      await expect(storySurface.locator('h1')).toHaveCount(0);
      await expect(page).toHaveScreenshot(
        `storybook-responsive-${String(width)}.png`,
        { fullPage: true },
      );
    });
  }

  test('follows the native dark color scheme for Storybook surfaces', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await openStory(page, 'gallery-playground--default-gallery');

    await expect(page.locator('html')).toHaveCSS('color-scheme', 'dark');
    await expect(page.getByTestId('story-surface')).toHaveCSS(
      'background-color',
      'rgb(18, 16, 26)',
    );
    await expect
      .poll(() =>
        page.getByTestId('story-surface').evaluate((surface) => {
          return surface.getBoundingClientRect().bottom >= window.innerHeight;
        }),
      )
      .toBe(true);
  });

  test('keeps the focused controlled-selection example interactive', async ({
    page,
  }) => {
    await openStory(page, 'gallery-selection--controlled-selection');

    await expect(page.getByTestId('selected-count')).toHaveText('2 selected');
    const firstTile = page.getByTestId('grid-gallery-item').first();
    await firstTile.hover();
    await firstTile.getByTitle('Select').click();
    await expect(page.getByTestId('selected-count')).toHaveText('3 selected');

    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(page.getByTestId('selected-count')).toHaveText('0 selected');
    await page.getByRole('button', { name: 'Select all' }).click();
    await expect(page.getByTestId('selected-count')).toHaveText('10 selected');
  });

  test('shows wrapping tags and distinct visible captions', async ({
    page,
  }) => {
    await openStory(page, 'gallery-content--multiple-tags');
    await expect(page.getByTitle(/^Album:/)).toHaveCount(7);
    await expect(page.getByTitle('Favourite photo')).toHaveCount(4);
    await expect(page).toHaveScreenshot('storybook-content.png', {
      fullPage: true,
    });

    await openStory(page, 'gallery-content--visible-captions');
    await expect(page.locator('.thumbnail-caption')).toHaveCount(6);
    await expect(
      page.getByTestId('grid-gallery-item_thumbnail').first(),
    ).toHaveAttribute('title', 'Ball practice on blue');
  });

  test('animates progressive placeholders and preserves lazy thumbnails', async ({
    page,
  }) => {
    await openStory(page, 'gallery-content--progressive-placeholders');
    await page.getByRole('button', { name: 'Reload images' }).click();
    await expect(page.getByText('Painting tiny placeholders…')).toBeVisible();
    await expect(
      page.getByTestId('grid-gallery-item_viewport').first(),
    ).toHaveCSS('background-image', /data:image\/webp;base64/);
    await expect(page.getByText('Full images loaded')).toBeVisible();

    await openStory(page, 'gallery-customization--custom-thumbnail-component');
    const firstThumbnail = page
      .getByTestId('grid-gallery-item_thumbnail')
      .first();
    await expect(firstThumbnail).toHaveAttribute('loading', 'lazy');
    await expect(firstThumbnail).toHaveAttribute('decoding', 'async');
  });

  test('tunes layout, item count, and selection in the gallery workshop', async ({
    page,
  }) => {
    await openStory(page, 'examples-gallery-workshop--explore-the-gallery');

    const gallery = page.getByTestId('gallery-workshop');
    await expect(gallery).toHaveAttribute('data-layout', 'justified');
    await page
      .getByRole('group', { name: 'Layout' })
      .getByRole('button', { name: 'Masonry' })
      .click();
    await expect(gallery).toHaveAttribute('data-layout', 'masonry');

    await page.getByRole('slider', { name: /Number of images/ }).fill('25');
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(25);
    await expect(page.getByText(/25 photographs/)).toBeVisible();

    const selectable = page.getByLabel('Selectable');
    await page.locator('.gallery-workshop__toggle').click();
    await expect(selectable).toBeChecked();
    const firstTile = page.getByTestId('grid-gallery-item').first();
    await firstTile.hover();
    await firstTile.getByTitle('Select').click();
    await expect(page.getByText('1 selected')).toBeVisible();
    await page.getByRole('button', { name: 'Clear' }).click();
    await expect(page.getByText('0 selected')).toBeVisible();
  });

  test('reveals a gallery mounted while its container had zero width', async ({
    page,
  }) => {
    await openStory(page, 'gallery-layout-edge-cases--hidden-then-revealed');

    const panel = page.locator('#hidden-gallery-panel');
    await expect(panel).toBeHidden();
    await page.getByRole('button', { name: 'Reveal panel' }).click();
    await expect(panel).toBeVisible();
    await expect(panel.getByTestId('grid-gallery-item')).toHaveCount(6);
    await expect
      .poll(() =>
        panel
          .getByTestId('grid-gallery-item')
          .first()
          .evaluate((element) => element.getBoundingClientRect().width),
      )
      .toBeGreaterThan(0);
  });

  test('expands a maxRows album preview without changing its collection', async ({
    page,
  }) => {
    await openStory(page, 'gallery-layout-edge-cases--max-rows-preview');

    const tiles = page.getByTestId('grid-gallery-item');
    const previewCount = await tiles.count();
    expect(previewCount).toBeGreaterThan(0);
    expect(previewCount).toBeLessThan(12);
    await page.getByRole('button', { name: 'Show all' }).click();
    await expect(tiles).toHaveCount(12);
    await expect(
      page.getByRole('button', { name: 'Show preview' }),
    ).toBeVisible();
  });

  test('appends images while the application owns loading state', async ({
    page,
  }) => {
    await openStory(page, 'gallery-content--incremental-loading');

    await expect(page.getByText('Showing 4 of 10')).toBeVisible();
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(4);
    await page.getByRole('button', { name: 'Load 3 more' }).click();
    await expect(page.getByText('Showing 7 of 10')).toBeVisible();
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(7);
  });

  test('demonstrates orientation and both headless layout exports', async ({
    page,
  }) => {
    await openStory(page, 'gallery-layout-edge-cases--exif-orientation');
    await expect(
      page.getByTestId('grid-gallery-item_thumbnail').nth(1),
    ).not.toHaveCSS('transform', 'none');
    await expect(page.locator('.orientation-caption')).toHaveCount(4);

    await openStory(page, 'advanced-headless-layout--custom-tiles');
    await expect(page.getByTestId('headless-item-count')).toHaveText('8');
    await expect(page.getByTestId('headless-row-count')).not.toHaveText('0');
    const checkButton = page
      .getByTestId('grid-gallery-item_check-button')
      .first();
    await checkButton.click();
    await expect(checkButton.locator('circle').first()).toHaveCSS(
      'display',
      'block',
    );

    await openStory(page, 'advanced-headless-layout--masonry-columns');
    await expect(page.getByTestId('headless-item-count')).toHaveText('8');
    const masonryColumns = await page.locator('.headless-row--masonry').count();
    expect(masonryColumns).toBeGreaterThan(1);
    await expect(page.getByTestId('headless-row-count')).toHaveText(
      String(masonryColumns),
    );
  });

  test('uses native mixed links without loading the external video', async ({
    page,
  }) => {
    const externalRequests: string[] = [];
    page.on('request', (request) => {
      const url = new URL(request.url());
      if (url.hostname !== '127.0.0.1') externalRequests.push(url.href);
    });

    await openStory(
      page,
      'examples-mixed-destinations--photos-albums-and-video',
    );
    await expect(page.locator('a[href^="#"]')).toHaveCount(2);
    await expect(
      page.locator('a[href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"]'),
    ).toHaveCount(1);
    expect(externalRequests).toEqual([]);

    await page.getByTestId('grid-gallery-item_viewport').nth(2).click();
    await expect(
      page.getByText('Application viewer requested: XH2A8265.jpg'),
    ).toBeVisible();
  });

  test('changes workshop thumbnail density and opens original files', async ({
    page,
  }) => {
    await openStory(page, 'examples-gallery-workshop--explore-the-gallery');
    await expect(page.getByTestId('grid-gallery-item')).toHaveCount(10);

    const firstTile = page.getByTestId('grid-gallery-item').first();
    const comfortableHeight = await firstTile.evaluate(
      (element) => element.getBoundingClientRect().height,
    );
    await page.getByRole('slider', { name: 'Thumbnail size' }).fill('100');
    await expect
      .poll(() =>
        firstTile.evaluate((element) => element.getBoundingClientRect().height),
      )
      .toBeLessThan(comfortableHeight);

    await page.getByTestId('grid-gallery-item_viewport').first().click();
    const viewer = page.getByRole('dialog', { name: 'Lightbox' });
    await expect(viewer).toBeVisible();
    await expect(
      viewer.locator('.yarl__slide_current').getByRole('img'),
    ).toHaveAttribute('src', /XH2A2139.*\.jpg$/);
    await viewer.getByRole('button', { name: 'Close' }).click();
  });

  test('demonstrates the focused YARL integration', async ({ page }) => {
    await openStory(
      page,
      'advanced-viewer-integration--full-resolution-lightbox',
    );

    await page.getByTestId('grid-gallery-item_viewport').first().click();
    const viewer = page.getByRole('dialog', { name: 'Lightbox' });
    const currentImage = viewer
      .locator('.yarl__slide_current')
      .getByRole('img');
    await expect(viewer).toBeVisible();
    await expect(currentImage).toHaveAttribute(
      'alt',
      'Black-and-white dog holding an orange and blue ball',
    );
    await viewer.getByRole('button', { name: 'Next' }).click();
    await expect(currentImage).toHaveAttribute(
      'alt',
      'Black-and-white dog wearing round glasses on purple',
    );
    await viewer.getByRole('button', { name: 'Close' }).click();
    await expect(viewer).toBeHidden();
  });
});
