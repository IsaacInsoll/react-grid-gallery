import { describe, expect, it } from 'vitest';
import { buildLayout, buildLayoutFlat } from '../../src';
import type { BuildLayoutOptions, Image } from '../../src';

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

  it('should not modify passed image objects', () => {
    const images = [
      { ...image100x100, src: 'first' },
      { ...image100x100, src: 'second' },
    ];
    const originalImages = structuredClone(images);
    const options = { containerWidth: 150, rowHeight: 100, margin: 0 };

    const rows = buildLayout(images, options);

    expect(images).toEqual(originalImages);
    expect(rows[0][0]).not.toBe(images[0]);
    expect(rows[0][1]).not.toBe(images[1]);
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

    expect(rows[0][0].customAttr).toBe('imageId');
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

    const [row] = buildLayout(images, options);
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
    const [row] = buildLayout(
      [
        { src: 'first', width: 1, height: 1000 },
        { src: 'second', width: 1, height: 1000 },
      ],
      {
        containerWidth: 3,
        rowHeight: 100,
        margin: 2,
      },
    );

    expect(row).toHaveLength(1);
    expect(row[0]).toEqual(
      expect.objectContaining({
        scaledWidth: 0,
        scaledHeight: 0,
        viewportWidth: 0,
        marginLeft: 0,
      }),
    );
    expect(
      [
        row[0]?.scaledWidth,
        row[0]?.scaledHeight,
        row[0]?.viewportWidth,
        row[0]?.marginLeft,
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

    const [row] = buildLayout(images, options);
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
