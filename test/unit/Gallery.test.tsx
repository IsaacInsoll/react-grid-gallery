import type { ReactElement } from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CheckButton } from '../../src/CheckButton';
import { Gallery } from '../../src/Gallery';
import type {
  EventHandler,
  ImageExtended,
  ThumbnailImageProps,
} from '../../src/types';

const image1 = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ee/Apples.jpg/320px-Apples.jpg',
  width: 320,
  height: 480,
};

const image2 = {
  src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Bananas.jpg/320px-Bananas.jpg',
  width: 320,
  height: 213,
};

const linkedImage = {
  ...image1,
  href: '/?scenario=linked-destination',
};

const getItems = () => screen.getAllByTestId('grid-gallery-item');
const getItem = () => screen.getByTestId('grid-gallery-item');
const getItemThumbnail = () =>
  screen.getByTestId('grid-gallery-item_thumbnail');
const getItemViewport = () => screen.getByTestId('grid-gallery-item_viewport');
const getItemCheckButton = () =>
  screen.getByTestId('grid-gallery-item_check-button');
const getItemCheckButtons = () =>
  screen.getAllByTestId('grid-gallery-item_check-button');
const getMasonryColumns = () =>
  Array.from(document.querySelectorAll('.ReactGridGallery_masonry-column'));
const getElementAt = <T extends Element>(elements: T[], index: number) => {
  const element = elements[index];
  if (!element) {
    throw new Error(`Expected element at index ${String(index)}.`);
  }
  return element;
};

// emulating server-side rendering
// https://github.com/testing-library/react-testing-library/issues/561#issuecomment-1189796200
const renderStatic = (element: ReactElement) =>
  render(<div dangerouslySetInnerHTML={{ __html: renderToString(element) }} />);

describe('Gallery Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // define clientWidth for gallery root element
    Object.defineProperty(Element.prototype, 'clientWidth', { value: 400 });
    // @ts-expect-error - the test only needs a stable width from the DOM API.
    Element.prototype.getBoundingClientRect = vi.fn(() => ({ width: 400 }));
  });

  it('should assign default id value', () => {
    render(<Gallery images={[image1, image2]} />);

    expect(document.querySelector('#ReactGridGallery')).toBeInTheDocument();
  });

  it('should assign provided id value instead of default one', () => {
    const id = 'customId';

    render(<Gallery images={[image1, image2]} id={id} />);

    expect(document.querySelector('#ReactGridGallery')).not.toBeInTheDocument();
    expect(document.getElementById(id)).toBeInTheDocument();
  });

  it('should set item height based on rowHeight prop', () => {
    render(<Gallery images={[image1]} rowHeight={100} />);

    expect(getItemThumbnail()).toHaveStyle({ height: '100px' });
  });

  it('should render all provided images when maxRows is not passed', () => {
    const images = Array.from({ length: 20 }, () => image1);

    render(<Gallery images={images} />);

    expect(getItems().length).toEqual(20);
  });

  it('should render only some of provided images when maxRows is passed', () => {
    const images = Array.from({ length: 20 }, () => image1);

    render(<Gallery images={images} maxRows={1} />);

    expect(getItems().length).toBeLessThan(20);
  });

  it('should render element with custom properties provided via thumbnailImageComponent prop', () => {
    const thumbnailImageComponent = (props: ThumbnailImageProps) => (
      <img
        {...props.imageProps}
        title={props.imageProps.title ?? undefined}
        className="lazyload"
      />
    );

    render(
      <Gallery
        images={[image1]}
        thumbnailImageComponent={thumbnailImageComponent}
      />,
    );

    expect(getItemThumbnail()).toHaveClass('lazyload');
  });

  it('should render a custom thumbnail inside a linked viewport without forwarding href to the image', () => {
    const thumbnailImageComponent = (
      props: ThumbnailImageProps<ImageExtended<typeof linkedImage>>,
    ) => (
      <img
        {...props.imageProps}
        title={props.imageProps.title ?? undefined}
        className="linked-custom-thumbnail"
      />
    );

    render(
      <Gallery
        images={[linkedImage]}
        thumbnailImageComponent={thumbnailImageComponent}
      />,
    );

    const viewport = getItemViewport();
    const thumbnail = getItemThumbnail();
    expect(viewport.tagName).toBe('A');
    expect(viewport).toContainElement(thumbnail);
    expect(thumbnail).toHaveClass('linked-custom-thumbnail');
    expect(thumbnail).not.toHaveAttribute('href');
  });

  it('should set styles provided via thumbnailStyle prop on thumbnail element', () => {
    const thumbnailStyle = { background: 'black', opacity: 0.42 };

    render(<Gallery images={[image1]} thumbnailStyle={() => thumbnailStyle} />);

    expect(getItemThumbnail()).toHaveStyle(thumbnailStyle);
  });

  it('should set styles provided via tileViewportStyle prop on viewport element', () => {
    const tileViewportStyle = { background: 'black', opacity: 0.42 };

    render(
      <Gallery images={[image1]} tileViewportStyle={() => tileViewportStyle} />,
    );

    expect(getItemViewport()).toHaveStyle(tileViewportStyle);
  });

  it('should set styles provided via tagStyle prop on tag element', () => {
    const tagStyle = { background: 'black', opacity: 0.42 };
    const image = {
      ...image1,
      tags: [{ value: 'Vegetable', title: 'Vegetable' }],
    };

    render(<Gallery images={[image]} tagStyle={tagStyle} />);

    expect(screen.getByText('Vegetable')).toHaveStyle(tagStyle);
  });

  it('should render all passed images after rerender', () => {
    const { rerender } = render(<Gallery images={[image1]} />);

    expect(getItems().length).toEqual(1);

    rerender(<Gallery images={[image1, image2]} />);

    expect(getItems().length).toEqual(2);
  });

  it('should render thumbnails on server-side when defaultContainerWidth prop is passed', () => {
    renderStatic(
      <Gallery images={[image1, image2]} defaultContainerWidth={400} />,
    );

    expect(getItems().length).toEqual(2);
  });

  it('should render linked viewports on the server', () => {
    renderStatic(
      <Gallery images={[linkedImage]} defaultContainerWidth={400} />,
    );

    expect(getItemViewport().tagName).toBe('A');
    expect(getItemViewport()).toHaveAttribute('href', linkedImage.href);
  });

  describe('Masonry Layout', () => {
    const masonryImages = [
      { src: 'short-0', width: 100, height: 100 },
      { src: 'tall-1', width: 100, height: 300 },
      { src: 'short-2', width: 100, height: 100 },
      { src: 'short-3', width: 100, height: 100 },
    ];

    it('should render justified layout by default', () => {
      render(<Gallery images={[image1, image2]} />);

      expect(document.querySelector('.ReactGridGallery_masonry')).toBeNull();
      expect(getItems()).toHaveLength(2);
    });

    it('should render explicit justified layout like the default layout', () => {
      render(<Gallery images={[image1]} layout="justified" rowHeight={100} />);

      expect(document.querySelector('.ReactGridGallery_masonry')).toBeNull();
      expect(getItemThumbnail()).toHaveStyle({ height: '100px' });
    });

    it('should render all masonry images', () => {
      render(<Gallery images={masonryImages} layout="masonry" />);

      expect(
        document.querySelector('.ReactGridGallery_masonry'),
      ).not.toBeNull();
      expect(getItems()).toHaveLength(masonryImages.length);
    });

    it('should not render empty masonry columns when images are empty', () => {
      render(<Gallery images={[]} layout="masonry" />);

      expect(getMasonryColumns()).toHaveLength(0);
    });

    it('should make masonry column count respond to columnWidth', () => {
      const { rerender } = render(
        <Gallery images={masonryImages} layout="masonry" columnWidth={180} />,
      );

      expect(getMasonryColumns()).toHaveLength(2);

      rerender(
        <Gallery images={masonryImages} layout="masonry" columnWidth={100} />,
      );

      expect(getMasonryColumns()).toHaveLength(3);
    });

    it('should render masonry thumbnails on server-side when defaultContainerWidth prop is passed', () => {
      renderStatic(
        <Gallery
          images={masonryImages}
          layout="masonry"
          defaultContainerWidth={400}
        />,
      );

      expect(getMasonryColumns()).toHaveLength(2);
      expect(getItems()).toHaveLength(masonryImages.length);
    });

    it('should call onClick with original image index in masonry layout', () => {
      const handleClick = vi.fn<EventHandler<(typeof masonryImages)[number]>>();

      render(
        <Gallery
          images={masonryImages}
          layout="masonry"
          onClick={handleClick}
        />,
      );
      fireEvent.click(
        getElementAt(screen.getAllByTestId('grid-gallery-item_viewport'), 1),
      );

      expect(handleClick).toHaveBeenNthCalledWith(
        1,
        2,
        masonryImages[2],
        expect.objectContaining({}),
      );
    });

    it('should call onSelect with original image index in masonry layout', () => {
      const handleSelect =
        vi.fn<EventHandler<(typeof masonryImages)[number]>>();

      render(
        <Gallery
          images={masonryImages}
          layout="masonry"
          onSelect={handleSelect}
        />,
      );
      fireEvent.click(
        getElementAt(
          screen.getAllByTestId('grid-gallery-item_check-button'),
          1,
        ),
      );

      expect(handleSelect).toHaveBeenNthCalledWith(
        1,
        2,
        masonryImages[2],
        expect.objectContaining({}),
      );
    });

    it('should not warn about fallback React keys in masonry layout', () => {
      const consoleError = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      render(<Gallery images={masonryImages} layout="masonry" />);

      expect(
        consoleError.mock.calls.some((call) =>
          call.some((message) =>
            String(message).includes(
              'Encountered two children with the same key',
            ),
          ),
        ),
      ).toBe(false);
      consoleError.mockRestore();
    });

    it('should render masonry linked tiles as anchors', () => {
      render(<Gallery images={[linkedImage]} layout="masonry" />);

      expect(getItemViewport().tagName).toBe('A');
      expect(getItemViewport()).toHaveAttribute('href', linkedImage.href);
    });

    it('should render custom thumbnails in masonry layout', () => {
      const thumbnailImageComponent = (props: ThumbnailImageProps) => (
        <img
          {...props.imageProps}
          title={props.imageProps.title ?? undefined}
          className="masonry-custom-thumbnail"
        />
      );

      render(
        <Gallery
          images={[image1]}
          layout="masonry"
          thumbnailImageComponent={thumbnailImageComponent}
        />,
      );

      expect(getItemThumbnail()).toHaveClass('masonry-custom-thumbnail');
    });

    it('should call masonry style functions with extended item dimensions', () => {
      const thumbnailStyle = vi.fn(({ item }: { item: ImageExtended }) => ({
        opacity: item.scaledWidth > 0 ? 0.5 : 1,
      }));

      render(
        <Gallery
          images={[image1]}
          layout="masonry"
          thumbnailStyle={thumbnailStyle}
        />,
      );

      const [firstCall] = thumbnailStyle.mock.calls;
      if (!firstCall) {
        throw new Error('Expected thumbnailStyle to be called.');
      }
      const [styleContext] = firstCall;
      expect(styleContext.item.scaledWidth).toEqual(expect.any(Number));
      expect(styleContext.item.scaledHeight).toEqual(expect.any(Number));
      expect(styleContext.item.viewportWidth).toEqual(expect.any(Number));
      expect(styleContext.item.marginLeft).toBe(0);
      expect(getItemThumbnail()).toHaveStyle({ opacity: '0.5' });
    });
  });

  describe('Image Options', () => {
    it('should preserve the div viewport for an image without href', () => {
      render(<Gallery images={[image1]} />);

      expect(getItemViewport().tagName).toBe('DIV');
      expect(getItemViewport()).not.toHaveAttribute('href');
    });

    it('should preserve the div viewport for an empty href', () => {
      render(<Gallery images={[{ ...image1, href: '' }]} />);

      expect(getItemViewport().tagName).toBe('DIV');
      expect(getItemViewport()).not.toHaveAttribute('href');
    });

    it('should render a linked viewport without wrapping sibling controls and content', () => {
      const image = {
        ...linkedImage,
        tags: [{ value: 'Fruit', title: 'Fruit' }],
        customOverlay: <span>Custom Overlay</span>,
        thumbnailCaption: <span>Thumbnail Caption</span>,
      };

      render(<Gallery images={[image]} />);

      const viewport = getItemViewport();
      expect(viewport.tagName).toBe('A');
      expect(viewport).toHaveAttribute('href', linkedImage.href);
      expect(viewport.style.display).toBe('block');
      expect(viewport.style.color).toBe('inherit');
      expect(viewport.style.textDecoration).toBe('none');
      expect(viewport).toContainElement(getItemThumbnail());
      expect(viewport).not.toContainElement(getItemCheckButton());
      expect(viewport).not.toContainElement(screen.getByText('Fruit'));
      expect(viewport).not.toContainElement(screen.getByText('Custom Overlay'));
      expect(viewport).not.toContainElement(
        screen.getByText('Thumbnail Caption'),
      );
    });

    it('should let a linked viewport click handler prevent navigation', () => {
      const handleClick = vi.fn<EventHandler<typeof linkedImage>>(
        (_index, _item, event) => {
          event.preventDefault();
        },
      );

      render(<Gallery images={[linkedImage]} onClick={handleClick} />);

      expect(fireEvent.click(getItemViewport())).toBe(false);
      expect(handleClick).toHaveBeenCalledWith(
        0,
        linkedImage,
        expect.objectContaining({ defaultPrevented: true }),
      );
    });

    it('should set thumbnail image src attribute based on src prop', () => {
      render(<Gallery images={[image1]} />);

      expect(getItemThumbnail()).toHaveAttribute('src', image1.src);
    });

    it('should set thumbnail image alt attribute based on alt prop', () => {
      const alt = 'Image of apples';
      const image = { ...image1, alt };

      render(<Gallery images={[image]} />);

      expect(getItemThumbnail()).toHaveAttribute('alt', alt);
    });

    it('should set thumbnail image title attribute based on caption prop', () => {
      const caption = 'Apples';
      const image = { ...image1, caption };

      render(<Gallery images={[image]} />);

      expect(getItemThumbnail()).toHaveAttribute('title', caption);
    });

    it('should not set thumbnail image title attribute when caption prop value is a react element', () => {
      const caption = <b>Apples</b>;
      const image = { ...image1, caption };

      render(<Gallery images={[image]} />);

      expect(getItemThumbnail()).not.toHaveAttribute('title');
    });

    it('should render tag element', () => {
      const image = { ...image1, tags: [{ value: 'Fruit', title: 'Fruit' }] };

      render(<Gallery images={[image]} />);

      expect(screen.getByText('Fruit')).toBeVisible();
    });

    it('should render tag element when tag value is a react element', () => {
      const tag1 = {
        value: <a href="https://example.com">Fruit</a>,
        title: 'Fruit',
        key: '1',
      };
      const image = {
        ...image1,
        tags: [tag1],
      };

      render(<Gallery images={[image]} />);

      expect(screen.getByText('Fruit')).toBeInTheDocument();
    });

    it('should add background to viewport element based on nano prop', () => {
      const nano =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQYV2NkQAX/GZH4/xkYGBhhAmAOSBJEwDkgAQCCrgQEjpMcPgAAAABJRU5ErkJggg==';
      const image = { ...image1, nano };

      render(<Gallery images={[image]} />);

      // `toHaveStyle` lowercases the declaration it compares, which mangles
      // the case-sensitive base64 payload, so assert the properties directly.
      const { style } = getItemViewport();
      expect(style.background).toContain(`url("${nano}")`);
      expect(style.backgroundSize).toBe('cover');
      expect(style.backgroundPosition).toBe('center center');
    });

    it('should not show overlay when gallery item is not hovered over', () => {
      const customOverlay = <b>Custom Overlay</b>;
      const image = { ...image1, customOverlay };

      render(<Gallery images={[image]} />);

      expect(screen.getByText('Custom Overlay')).not.toBeVisible();
    });

    it('should show overlay when gallery item is hovered over', () => {
      const customOverlay = <b>Custom Overlay</b>;
      const image = { ...image1, customOverlay };

      render(<Gallery images={[image]} />);
      fireEvent.mouseOver(getItem());

      expect(screen.getByText('Custom Overlay')).toBeVisible();
    });

    it('should add thumbnail caption provided via thumbnailCaption prop', () => {
      const thumbnailCaption = <i>Thumbnail Caption</i>;
      const image = { ...image1, thumbnailCaption };

      render(<Gallery images={[image]} />);

      expect(screen.getByText('Thumbnail Caption')).toBeVisible();
    });

    it('should transform image based on orientation prop value', () => {
      const image = { ...image1, orientation: 3 };

      render(<Gallery images={[image]} />);

      expect(getItemThumbnail()).toHaveStyle(`transform: rotate(180deg)`);
    });
  });

  describe('Selection', () => {
    it('should render check-button as a pressed button when item is selected', () => {
      const image = { ...image1, isSelected: true };

      render(<Gallery images={[image]} />);

      const checkButton = getItemCheckButton();
      expect(checkButton.tagName).toBe('BUTTON');
      expect(checkButton).toHaveAttribute('type', 'button');
      expect(checkButton).toHaveAccessibleName('Select image');
      expect(checkButton).toHaveAttribute('title', 'Select image');
      expect(checkButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should render check-button with custom label text', () => {
      render(<CheckButton label="Choose photo" onClick={vi.fn()} />);

      const checkButton = getItemCheckButton();
      expect(checkButton).toHaveAccessibleName('Choose photo');
      expect(checkButton).toHaveAttribute('title', 'Choose photo');
    });

    it('should show check-button when item is selected', () => {
      const image = { ...image1, isSelected: true };

      render(<Gallery images={[image]} />);

      expect(getItemCheckButton()).toBeVisible();
    });

    it('should not show check-button when item is not selected', () => {
      render(<Gallery images={[image1]} />);

      expect(getItemCheckButton()).not.toBeVisible();
      expect(getItemCheckButton()).not.toBeDisabled();
    });

    it('should show check-button when focused for keyboard selection', () => {
      render(<Gallery images={[image1]} />);

      const checkButton = getItemCheckButton();
      checkButton.focus();
      expect(checkButton).toHaveFocus();

      fireEvent.focus(checkButton);

      expect(checkButton).toHaveFocus();
      expect(checkButton).toBeVisible();
    });

    it('should show check-button when item is hovered over and image selection is enabled', () => {
      render(<Gallery images={[image1]} enableImageSelection={true} />);
      fireEvent.mouseOver(getItem());

      expect(getItemCheckButton()).toBeVisible();
    });

    it("should not show check-button when item is hovered over and image selection isn't enabled", () => {
      render(<Gallery images={[image1]} enableImageSelection={false} />);
      fireEvent.mouseOver(getItem());

      expect(getItemCheckButton()).not.toBeVisible();
      expect(getItemCheckButton()).toBeDisabled();
    });

    it('should show selected check-button as disabled when image selection is disabled', () => {
      const handleSelect = vi.fn();
      const image = { ...image1, isSelected: true };

      render(
        <Gallery
          images={[image]}
          enableImageSelection={false}
          onSelect={handleSelect}
        />,
      );

      const checkButton = getItemCheckButton();
      expect(checkButton).toBeVisible();
      expect(checkButton).toBeDisabled();
      fireEvent.click(checkButton);
      expect(handleSelect).not.toHaveBeenCalled();
    });

    it('should emit unique check-button gradient ids', () => {
      render(
        <Gallery
          images={[
            { ...image1, isSelected: true },
            { ...image2, isSelected: true },
          ]}
        />,
      );

      const gradientIds = getItemCheckButtons().map((button) => {
        const gradient = button.querySelector('radialGradient');
        if (!gradient) {
          throw new Error('Expected check button to contain a radialGradient.');
        }
        return gradient.id;
      });

      expect(new Set(gradientIds).size).toBe(gradientIds.length);
      expect(gradientIds).not.toContain('shadow');
    });

    it('should call onSelect with index and image object arguments passed', () => {
      const handleSelect = vi.fn();

      render(
        <Gallery
          images={[image1]}
          enableImageSelection={true}
          onSelect={handleSelect}
        />,
      );
      fireEvent.click(getItemCheckButton());

      expect(handleSelect).toHaveBeenNthCalledWith(
        1,
        0,
        image1,
        expect.objectContaining({}),
      );
    });
  });
});
