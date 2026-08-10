import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from '@picr/react-grid-gallery';
import type {
  ImageExtended,
  StyleProp,
  ThumbnailImageProps,
} from '@picr/react-grid-gallery';
import { dogPhotos } from './gallery-data';
import type { DogPhoto } from './gallery-data';
import { galleryArgTypes } from './gallery-arg-types';

const DogGallery = Gallery<DogPhoto>;

const LazyThumbnail = ({
  imageProps,
}: ThumbnailImageProps<ImageExtended<DogPhoto>>) => {
  const { title, style, ...nativeImageProps } = imageProps;

  return (
    <figure className="custom-thumbnail" style={style}>
      <img
        {...nativeImageProps}
        loading="lazy"
        decoding="async"
        title={title ?? undefined}
        style={undefined}
      />
      <span className="custom-thumbnail__label">Native lazy load</span>
    </figure>
  );
};

const brandedTagStyle: CSSProperties = {
  display: 'inline',
  padding: '.3em .7em .38em',
  border: '1px solid #ffffffaa',
  borderRadius: 999,
  background: '#4930c7e6',
  color: 'white',
  fontSize: '75%',
  fontWeight: 750,
  lineHeight: 1,
  textAlign: 'center',
  verticalAlign: 'baseline',
  whiteSpace: 'nowrap',
};

const publishingThumbnailStyle: StyleProp<ImageExtended<DogPhoto>> = ({
  item,
}) => ({
  cursor: 'pointer',
  maxWidth: 'none',
  width: item.scaledWidth,
  height: item.scaledHeight,
  marginTop: 0,
  marginLeft: item.marginLeft,
  filter: item.status === 'processing' ? 'grayscale(1)' : undefined,
  opacity: item.status === 'processing' ? 0.52 : 1,
});

const publishingViewportStyle: StyleProp<ImageExtended<DogPhoto>> = ({
  item,
}) => ({
  width: item.viewportWidth,
  height: item.scaledHeight,
  overflow: 'hidden',
  borderRadius: 10,
  boxShadow: item.isFavorite ? 'inset 0 0 0 4px #ffca5c' : undefined,
});

const meta = {
  title: 'Gallery/Customization',
  component: DogGallery,
  argTypes: galleryArgTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Replace the thumbnail renderer or style tiles with either a plain React style object or a typed function that receives your application record.',
      },
    },
  },
} satisfies Meta<typeof DogGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomThumbnailComponent: Story = {
  args: {
    images: dogPhotos.slice(0, 7),
    enableImageSelection: false,
    thumbnailImageComponent: LazyThumbnail,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A custom thumbnail owns the image element while Gallery keeps the justified geometry. This implementation forwards the contract and adds native lazy loading.',
      },
    },
  },
  render: (args) => <DogGallery {...args} />,
};

export const ObjectStyleProps: Story = {
  args: {
    images: dogPhotos.slice(0, 7).map((image) => ({
      ...image,
      tags: [{ value: 'Good dog', title: 'Branded tag' }],
    })),
    enableImageSelection: false,
    tagStyle: brandedTagStyle,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pass a plain `CSSProperties` object when every tag receives the same branded treatment. Style props replace their internal counterpart, so the object includes the complete tag treatment.',
      },
    },
  },
  render: (args) => <DogGallery {...args} />,
};

export const DataDrivenStyleFunctions: Story = {
  args: {
    images: dogPhotos.slice(0, 9),
    enableImageSelection: false,
    margin: 5,
    thumbnailStyle: publishingThumbnailStyle,
    tileViewportStyle: publishingViewportStyle,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Typed style callbacks turn product state into presentation: favourites receive a gold inset and the processing image is visibly subdued.',
      },
    },
  },
  render: (args) => <DogGallery {...args} />,
};
