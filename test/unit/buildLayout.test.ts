import { describe, expect, it } from 'vitest';
import { buildLayout, buildLayoutFlat, buildMasonryLayout } from '../../src';
import { getFirstRow, getItemAt } from './layoutTestHelpers';
import type { BuildLayoutOptions, Image, MasonryLayout } from '../../src';

const image100x100 = {
  src: '',
  width: 100,
  height: 100,
};

describe('buildLayout', () => {
  it('should return empty array when images param not passed', () => {
    const images = undefined as unknown as [];
    const options = { containerWidth: 1000 };

    const rows = buildLayout(images, options);

    expect(rows).toEqual([]);
  });

  it("should return empty array when containerWidth isn't defined", () => {
    const images = [image100x100];
    const options = {} as BuildLayoutOptions;

    const rows = buildLayout(images, options);

    expect(rows).toEqual([]);
  });

  it('should return empty array when containerWidth is 0', () => {
    const images = [image100x100];
    const options = { containerWidth: 0 };

    const rows = buildLayout(images, options);

    expect(rows).toEqual([]);
  });

  it('should return empty array when containerWidth is not finite or positive', () => {
    for (const containerWidth of [-100, Number.NaN, Number.POSITIVE_INFINITY]) {
      const rows = buildLayout([image100x100], { containerWidth });

      expect(rows).toEqual([]);
    }
  });

  it('should not modify passed image objects', () => {
    const images = [
      { ...image100x100, src: 'first' },
      { ...image100x100, src: 'second' },
    ];
    const originalImages = structuredClone(images);
    const options = { containerWidth: 150, rowHeight: 100, margin: 0 };

    const rows = buildLayout(images, options);

    expect(images).toEqual(originalImages);
    const firstRow = getFirstRow(rows);
    expect(getItemAt(firstRow, 0)).not.toBe(images[0]);
    expect(getItemAt(firstRow, 1)).not.toBe(images[1]);
  });

  it('should return custom image attributes', () => {
    interface MyImage extends Image {
      customAttr: string;
    }
    const image: MyImage = {
      customAttr: 'imageId',
      src: '',
      width: 100,
      height: 100,
    };
    const options = { containerWidth: 100 };

    const rows = buildLayout<MyImage>([image], options);

    expect(getItemAt(getFirstRow(rows), 0).customAttr).toBe('imageId');
  });

  it('should limit number of items when maxRows param passed', () => {
    const images = [image100x100, image100x100, image100x100];
    const options = {
      containerWidth: 100,
      rowHeight: 100,
      margin: 0,
      maxRows: 1,
    };

    const rows = buildLayout(images, options);

    expect(rows.length).toEqual(1);
  });

  it("should not compress image when it's narrower than container", () => {
    const images = [image100x100];
    const options = { containerWidth: 200, rowHeight: 100, margin: 0 };

    const rows = buildLayout(images, options);

    expect(rows).toEqual([
      [
        expect.objectContaining({
          viewportWidth: 100,
          marginLeft: 0,
        }),
      ],
    ]);
  });

  it('should rescale an oversized single-image row without cropping', () => {
    const images = [image100x100];
    const options = { containerWidth: 50, rowHeight: 100, margin: 0 };

    const rows = buildLayout(images, options);

    expect(rows).toEqual([
      [
        expect.objectContaining({
          scaledWidth: 50,
          scaledHeight: 50,
          viewportWidth: 50,
          marginLeft: 0,
        }),
      ],
    ]);
  });

  it('should distribute rounding pixels while filling the container exactly', () => {
    const images = [image100x100, image100x100, image100x100];
    const options = { containerWidth: 201, rowHeight: 100, margin: 0 };

    const rows = buildLayout(images, options);

    expect(rows).toEqual([
      [
        expect.objectContaining({
          scaledWidth: 67,
          scaledHeight: 67,
          viewportWidth: 67,
          marginLeft: 0,
        }),
        expect.objectContaining({
          scaledWidth: 67,
          scaledHeight: 67,
          viewportWidth: 67,
          marginLeft: 0,
        }),
        expect.objectContaining({
          scaledWidth: 67,
          scaledHeight: 67,
          viewportWidth: 67,
          marginLeft: 0,
        }),
      ],
    ]);
  });

  it('should not overflow a fractional container width', () => {
    const images = [image100x100, image100x100, image100x100];
    const options = { containerWidth: 201.5, rowHeight: 100, margin: 0 };

    const row = getFirstRow(buildLayout(images, options));
    const occupiedWidth = row.reduce(
      (width, item) => width + item.scaledWidth,
      0,
    );

    expect(occupiedWidth).toBe(201);
    expect(occupiedWidth).toBeLessThanOrEqual(options.containerWidth);
    expect(options.containerWidth - occupiedWidth).toBeLessThan(1);
  });

  it('should not produce negative dimensions when margins exceed the container', () => {
    const [row] = buildLayout([image100x100], {
      containerWidth: 3,
      rowHeight: 100,
      margin: 2,
    });

    expect(row).toEqual([
      expect.objectContaining({
        scaledWidth: 0,
        scaledHeight: 0,
        viewportWidth: 0,
        marginLeft: 0,
      }),
    ]);
  });

  it('should keep dimensions finite when every natural width rounds to zero', () => {
    const row = getFirstRow(
      buildLayout(
        [
          { src: 'first', width: 1, height: 1000 },
          { src: 'second', width: 1, height: 1000 },
        ],
        {
          containerWidth: 3,
          rowHeight: 100,
          margin: 2,
        },
      ),
    );

    expect(row).toHaveLength(1);

    const item = getItemAt(row, 0);
    expect(item).toEqual(
      expect.objectContaining({
        scaledWidth: 0,
        scaledHeight: 0,
        viewportWidth: 0,
        marginLeft: 0,
      }),
    );
    expect(
      [
        item.scaledWidth,
        item.scaledHeight,
        item.viewportWidth,
        item.marginLeft,
      ].every((value) => Number.isFinite(value) && value >= 0),
    ).toBe(true);
  });

  it("should build multiple rows when images don't fit into a single row", () => {
    const images = [image100x100, image100x100, image100x100];
    const options = { containerWidth: 200, rowHeight: 100, margin: 0 };

    const rows = buildLayout(images, options);

    expect(rows.length).toEqual(2);
  });

  it('should preserve row membership, image order, and maxRows behavior', () => {
    const images = ['first', 'second', 'third', 'fourth', 'fifth'].map(
      (src) => ({ ...image100x100, src }),
    );
    const options = {
      containerWidth: 200,
      rowHeight: 100,
      margin: 0,
      maxRows: 2,
    };

    const rows = buildLayout(images, options);

    expect(rows.map((row) => row.map(({ src }) => src))).toEqual([
      ['first', 'second'],
      ['third', 'fourth'],
    ]);
  });

  it('should build multiple rows when images could fit into a single row but also the margin is specified', () => {
    const images = [image100x100, image100x100, image100x100];
    const options = { containerWidth: 200, rowHeight: 100, margin: 5 };

    const rows = buildLayout(images, options);

    expect(rows).toEqual([
      [
        expect.objectContaining({
          scaledWidth: 90,
          scaledHeight: 90,
          viewportWidth: 90,
          marginLeft: 0,
        }),
        expect.objectContaining({
          scaledWidth: 90,
          scaledHeight: 90,
          viewportWidth: 90,
          marginLeft: 0,
        }),
      ],
      [
        expect.objectContaining({
          marginLeft: 0,
          viewportWidth: 100,
        }),
      ],
    ]);
  });

  it('should rescale mixed aspect ratios and account for margins', () => {
    const images = [
      { src: 'landscape', width: 400, height: 300 },
      { src: 'square', width: 300, height: 300 },
      { src: 'portrait', width: 200, height: 300 },
    ];
    const options = { containerWidth: 503, rowHeight: 180, margin: 2 };

    const row = getFirstRow(buildLayout(images, options));
    const occupiedWidth = row.reduce(
      (width, item) => width + item.scaledWidth + options.margin * 2,
      0,
    );

    expect(row).toEqual([
      expect.objectContaining({
        src: 'landscape',
        scaledWidth: 219,
        scaledHeight: 163,
      }),
      expect.objectContaining({
        src: 'square',
        scaledWidth: 163,
        scaledHeight: 163,
      }),
      expect.objectContaining({
        src: 'portrait',
        scaledWidth: 109,
        scaledHeight: 163,
      }),
    ]);
    expect(occupiedWidth).toBe(options.containerWidth);
    expect(row.every((item) => item.viewportWidth === item.scaledWidth)).toBe(
      true,
    );
    expect(row.every((item) => item.marginLeft === 0)).toBe(true);
  });

  it('should preserve an underfilled final row at the target height', () => {
    const images = [
      { ...image100x100, src: 'first' },
      { ...image100x100, src: 'second' },
      { ...image100x100, src: 'last' },
    ];
    const options = { containerWidth: 200, rowHeight: 100, margin: 0 };

    const rows = buildLayout(images, options);

    expect(rows[1]).toEqual([
      expect.objectContaining({
        src: 'last',
        scaledWidth: 100,
        scaledHeight: 100,
        viewportWidth: 100,
        marginLeft: 0,
      }),
    ]);
  });

  it('should fit multiple images into one row and calculate scaled width when rowHeight is specified', () => {
    const options = { containerWidth: 201, rowHeight: 50, margin: 0 };
    const images = [image100x100, image100x100, image100x100, image100x100];

    const rows = buildLayout(images, options);

    expect(rows).toEqual([
      [
        expect.objectContaining({
          scaledWidth: 50,
          viewportWidth: 50,
        }),
        expect.objectContaining({
          scaledWidth: 50,
          viewportWidth: 50,
        }),
        expect.objectContaining({
          scaledWidth: 50,
          viewportWidth: 50,
        }),
        expect.objectContaining({
          scaledWidth: 50,
          viewportWidth: 50,
        }),
      ],
    ]);
  });
});

describe('buildLayoutFlat', () => {
  it('should return all row items as a flat list', () => {
    const images = [image100x100, image100x100, image100x100];
    const options = { containerWidth: 200, rowHeight: 100, margin: 0 };

    const rows = buildLayoutFlat(images, options);

    expect(rows.length).toEqual(3);
  });
});

describe('buildMasonryLayout', () => {
  const flattenMasonryLayout = <T extends Image>(layout: MasonryLayout<T>) =>
    layout.flat();

  it('should return empty array when images param not passed', () => {
    const images = undefined as unknown as [];

    const columns = buildMasonryLayout(images, { containerWidth: 1000 });

    expect(columns).toEqual([]);
  });

  it("should return empty array when containerWidth isn't defined", () => {
    const options = {} as BuildLayoutOptions;

    const columns = buildMasonryLayout([image100x100], options);

    expect(columns).toEqual([]);
  });

  it('should return empty array when containerWidth is 0', () => {
    const columns = buildMasonryLayout([image100x100], {
      containerWidth: 0,
    });

    expect(columns).toEqual([]);
  });

  it('should return empty array when containerWidth is not finite or positive', () => {
    for (const containerWidth of [-100, Number.NaN, Number.POSITIVE_INFINITY]) {
      const columns = buildMasonryLayout([image100x100], { containerWidth });

      expect(columns).toEqual([]);
    }
  });

  it('should return empty array for empty images', () => {
    const columns = buildMasonryLayout([], {
      containerWidth: 400,
      columnWidth: 100,
      margin: 2,
    });

    expect(columns).toEqual([]);
  });

  it('should not modify passed image objects', () => {
    const images = [
      { ...image100x100, src: 'first' },
      { ...image100x100, src: 'second' },
    ];
    const originalImages = structuredClone(images);

    const columns = buildMasonryLayout(images, {
      containerWidth: 400,
      columnWidth: 100,
      margin: 0,
    });

    expect(images).toEqual(originalImages);
    expect(getItemAt(columns[0] ?? [], 0)).not.toBe(images[0]);
  });

  it('should return custom image attributes', () => {
    interface MyImage extends Image {
      customAttr: string;
    }
    const image: MyImage = {
      customAttr: 'imageId',
      src: '',
      width: 100,
      height: 100,
    };

    const columns = buildMasonryLayout<MyImage>([image], {
      containerWidth: 100,
    });

    expect(getItemAt(columns[0] ?? [], 0).customAttr).toBe('imageId');
  });

  it('should create at least one column when container is narrower than target column width', () => {
    const columns = buildMasonryLayout([image100x100], {
      containerWidth: 50,
      columnWidth: 180,
      margin: 2,
    });

    expect(columns).toHaveLength(1);
    expect(getItemAt(columns[0] ?? [], 0)).toEqual(
      expect.objectContaining({
        scaledWidth: 46,
        scaledHeight: 46,
        viewportWidth: 46,
      }),
    );
  });

  it('should not allocate more columns than images', () => {
    const columns = buildMasonryLayout([image100x100], {
      containerWidth: 1000,
      columnWidth: 100,
      margin: 0,
    });

    expect(columns).toHaveLength(1);
    expect(getItemAt(columns[0] ?? [], 0)).toEqual(
      expect.objectContaining({
        scaledWidth: 100,
        scaledHeight: 100,
      }),
    );
  });

  it('should clamp dimensions when margins exceed container width', () => {
    const columns = buildMasonryLayout([image100x100], {
      containerWidth: 3,
      columnWidth: 180,
      margin: 2,
    });

    expect(columns).toHaveLength(1);
    expect(getItemAt(columns[0] ?? [], 0)).toEqual(
      expect.objectContaining({
        scaledWidth: 1,
        scaledHeight: 1,
        viewportWidth: 1,
        marginLeft: 0,
      }),
    );
  });

  it('should preserve the helper width invariant', () => {
    const options = { containerWidth: 474.7, columnWidth: 100, margin: 3 };

    const columns = buildMasonryLayout(
      [image100x100, image100x100, image100x100],
      options,
    );
    const firstItem = getItemAt(columns[0] ?? [], 0);
    const targetColumnCount = Math.floor(
      options.containerWidth / (options.columnWidth + options.margin * 2),
    );
    const occupiedWidth =
      targetColumnCount * (firstItem.scaledWidth + options.margin * 2);

    expect(occupiedWidth).toBeLessThanOrEqual(options.containerWidth);
  });

  it('should preserve all images exactly once and attach original indices', () => {
    const images = ['first', 'second', 'third', 'fourth'].map((src) => ({
      ...image100x100,
      src,
    }));

    const columns = buildMasonryLayout(images, {
      containerWidth: 400,
      columnWidth: 100,
      margin: 0,
    });
    const items = flattenMasonryLayout(columns);

    expect(items.map((item) => item.src).sort()).toEqual([
      'first',
      'fourth',
      'second',
      'third',
    ]);
    expect(
      items.map((item) => item.originalIndex).sort((a, b) => a - b),
    ).toEqual([0, 1, 2, 3]);
  });

  it('should place each next item into the shortest column', () => {
    const images = [
      { src: 'tall', width: 100, height: 300 },
      { src: 'short', width: 100, height: 100 },
      { src: 'next', width: 100, height: 100 },
    ];

    const columns = buildMasonryLayout(images, {
      containerWidth: 200,
      columnWidth: 100,
      margin: 0,
    });

    expect(columns.map((column) => column.map((item) => item.src))).toEqual([
      ['tall'],
      ['short', 'next'],
    ]);
  });

  it('should keep uniform column widths and preserve aspect ratios', () => {
    const columns = buildMasonryLayout(
      [
        { src: 'landscape', width: 400, height: 200 },
        { src: 'portrait', width: 200, height: 400 },
      ],
      { containerWidth: 400, columnWidth: 100, margin: 0 },
    );
    const items = flattenMasonryLayout(columns);

    expect(items.every((item) => item.scaledWidth === 100)).toBe(true);
    expect(items).toEqual([
      expect.objectContaining({
        src: 'landscape',
        scaledHeight: 50,
      }),
      expect.objectContaining({
        src: 'portrait',
        scaledHeight: 200,
      }),
    ]);
  });

  it('should handle zero margin', () => {
    const columns = buildMasonryLayout(
      [image100x100, image100x100, image100x100],
      { containerWidth: 300, columnWidth: 100, margin: 0 },
    );

    expect(columns).toHaveLength(3);
    expect(
      flattenMasonryLayout(columns).every((item) => item.scaledWidth === 100),
    ).toBe(true);
  });

  it('should keep very wide and very tall images finite', () => {
    const columns = buildMasonryLayout(
      [
        { src: 'wide', width: 6000, height: 1 },
        { src: 'tall', width: 1, height: 6000 },
      ],
      { containerWidth: 200, columnWidth: 100, margin: 0 },
    );

    expect(
      flattenMasonryLayout(columns).every((item) =>
        [item.scaledWidth, item.scaledHeight, item.viewportWidth].every(
          (value) => Number.isFinite(value) && value >= 0,
        ),
      ),
    ).toBe(true);
  });

  it('should use a square fallback for invalid or tiny dimensions', () => {
    const columns = buildMasonryLayout(
      [
        { src: 'zero-width', width: 0, height: 100 },
        { src: 'tiny', width: 1000, height: 1 },
      ],
      { containerWidth: 100, columnWidth: 100, margin: 0 },
    );

    expect(flattenMasonryLayout(columns)).toEqual([
      expect.objectContaining({
        src: 'zero-width',
        scaledWidth: 100,
        scaledHeight: 100,
      }),
      expect.objectContaining({
        src: 'tiny',
        scaledWidth: 100,
        scaledHeight: 100,
      }),
    ]);
  });

  it('should normalize invalid columnWidth and margin without invalid output', () => {
    const columns = buildMasonryLayout(
      [image100x100, image100x100, image100x100],
      {
        containerWidth: 960,
        columnWidth: Number.NaN,
        margin: Number.NaN,
      },
    );

    expect(columns).toHaveLength(3);
    expect(
      flattenMasonryLayout(columns).every((item) =>
        [item.scaledWidth, item.scaledHeight, item.viewportWidth].every(
          (value) => Number.isFinite(value) && value >= 0,
        ),
      ),
    ).toBe(true);
  });

  it('should not create unbounded columns for zero columnWidth and zero margin', () => {
    const columns = buildMasonryLayout([image100x100], {
      containerWidth: 960,
      columnWidth: 0,
      margin: 0,
    });

    expect(columns).toHaveLength(1);
    expect(getItemAt(columns[0] ?? [], 0).scaledWidth).toBe(192);
  });

  it('should normalize negative margin without invalid output', () => {
    const columns = buildMasonryLayout([image100x100], {
      containerWidth: 200,
      columnWidth: 100,
      margin: -5,
    });

    const firstItem = getItemAt(columns[0] ?? [], 0);

    expect(columns).toHaveLength(1);
    expect(firstItem.scaledWidth).toBe(196);
  });

  it('should normalize sub-pixel columnWidth before calculating the column count', () => {
    const columns = buildMasonryLayout([image100x100], {
      containerWidth: 1000,
      columnWidth: 0.5,
      margin: 0,
    });

    expect(columns).toHaveLength(1);
    expect(getItemAt(columns[0] ?? [], 0).scaledWidth).toBe(200);
  });
});
