import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState, useRef } from 'react';
import { clsx } from 'clsx';
import { Galleria, GalleriaRef } from './Galleria';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Sample image data
interface ImageItem {
    itemImageSrc: string;
    thumbnailImageSrc: string;
    alt: string;
    title: string;
    description?: string;
}

const images: ImageItem[] = [
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
        alt: 'Mountain Landscape',
        title: 'Mountain Landscape',
        description: 'Beautiful mountain landscape with snow peaks',
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200',
        alt: 'Ocean Waves',
        title: 'Ocean Waves',
        description: 'Calm ocean waves on a sunny day',
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200',
        alt: 'Forest Path',
        title: 'Forest Path',
        description: 'Mysterious forest path through tall trees',
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200',
        alt: 'Desert Dunes',
        title: 'Desert Dunes',
        description: 'Golden sand dunes in the desert',
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200',
        alt: 'Sunset Sky',
        title: 'Sunset Sky',
        description: 'Vibrant sunset colors in the sky',
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=200',
        alt: 'City Skyline',
        title: 'City Skyline',
        description: 'Modern city skyline at night',
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=200',
        alt: 'Lakeside View',
        title: 'Lakeside View',
        description: 'Peaceful lakeside with mountains in background',
    },
    {
        itemImageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        thumbnailImageSrc: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
        alt: 'Mountain Peak',
        title: 'Mountain Peak',
        description: 'Snow-covered mountain peak',
    },
];

const itemTemplate = (item: ImageItem) => (
    <img
        src={item.itemImageSrc}
        alt={item.alt}
        className="w-full h-auto rounded-lg shadow-lg"
        style={{ maxHeight: '600px', objectFit: 'contain' }}
    />
);

const thumbnailTemplate = (item: ImageItem) => (
    <img
        src={item.thumbnailImageSrc}
        alt={item.alt}
        className="w-20 h-20 object-cover rounded"
    />
);

const captionTemplate = (item: ImageItem) => (
    <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {item.title}
        </h3>
        {item.description && (
            <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
        )}
    </div>
);

const meta = {
    title: 'Components/Galleria',
    component: Galleria,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A gallery component for displaying images and content with thumbnails, indicators, navigators, and fullscreen support. Perfect for image galleries, product showcases, and media displays.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'object',
            description: 'Array of items to display',
        },
        numVisible: {
            control: 'number',
            description: 'Number of visible thumbnails',
        },
        circular: {
            control: 'boolean',
            description: 'Whether gallery is circular (infinite scroll)',
        },
        showThumbnails: {
            control: 'boolean',
            description: 'Whether to show thumbnails',
        },
        thumbnailsPosition: {
            control: 'select',
            options: ['bottom', 'top', 'left', 'right'],
            description: 'Position of thumbnails',
        },
        showIndicators: {
            control: 'boolean',
            description: 'Whether to show indicators',
        },
        showItemNavigators: {
            control: 'boolean',
            description: 'Whether to show item navigators',
        },
        autoPlay: {
            control: 'boolean',
            description: 'Whether to enable autoplay',
        },
    },
    args: {
        onItemChange: fn(),
    },
} satisfies Meta<typeof Galleria>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic galleria with thumbnails
 */
export const Basic: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    numVisible={5}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Controlled galleria with external controls
 */
export const Controlled: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);

        return (
            <div className="w-full max-w-4xl space-y-4">
                <div className="flex gap-2">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                    >
                        Previous
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => setActiveIndex(Math.min(images.length - 1, activeIndex + 1))}
                    >
                        Next
                    </button>
                    <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded">
                        {activeIndex + 1} / {images.length}
                    </span>
                </div>
                <Galleria
                    value={images}
                    numVisible={5}
                    activeIndex={activeIndex}
                    onItemChange={(e) => setActiveIndex(e.index)}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Galleria with indicators (click event)
 */
export const Indicators: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    showThumbnails={false}
                    showIndicators
                    item={itemTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Indicators with hover event
 */
export const IndicatorsHover: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    showThumbnails={false}
                    showIndicators
                    changeItemOnIndicatorHover
                    item={itemTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Indicators at different positions
 */
export const IndicatorsPositions: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Top</h3>
                    <Galleria
                        value={images.slice(0, 5)}
                        showThumbnails={false}
                        showIndicators
                        indicatorsPosition="top"
                        item={itemTemplate}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Left</h3>
                    <Galleria
                        value={images.slice(0, 5)}
                        showThumbnails={false}
                        showIndicators
                        indicatorsPosition="left"
                        item={itemTemplate}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Right</h3>
                    <Galleria
                        value={images.slice(0, 5)}
                        showThumbnails={false}
                        showIndicators
                        indicatorsPosition="right"
                        item={itemTemplate}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Inside (on item)</h3>
                    <Galleria
                        value={images.slice(0, 5)}
                        showThumbnails={false}
                        showIndicators
                        showIndicatorsOnItem
                        indicatorsPosition="bottom"
                        item={itemTemplate}
                    />
                </div>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Custom indicator template
 */
export const CustomIndicators: Story = {
    render: () => {
        const [activeIndex, setActiveIndex] = useState(0);

        const indicatorTemplate = (index: number) => (
            <div
                className={clsx(
                    'px-3 py-1 rounded-full transition-all duration-200',
                    'border-2',
                    activeIndex === index
                        ? 'bg-blue-600 dark:bg-blue-500 border-blue-700 dark:border-blue-400 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500'
                )}
            >
                <span className="text-xs font-semibold">{index + 1}</span>
            </div>
        );

        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    activeIndex={activeIndex}
                    onItemChange={(e) => setActiveIndex(e.index)}
                    showThumbnails={false}
                    showIndicators
                    showIndicatorsOnItem
                    indicatorsPosition="bottom"
                    indicator={indicatorTemplate}
                    item={itemTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Thumbnails at different positions
 */
export const ThumbnailsPositions: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl space-y-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Bottom (default)</h3>
                    <Galleria
                        value={images.slice(0, 5)}
                        numVisible={5}
                        thumbnailsPosition="bottom"
                        item={itemTemplate}
                        thumbnail={thumbnailTemplate}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Top</h3>
                    <Galleria
                        value={images.slice(0, 5)}
                        numVisible={5}
                        thumbnailsPosition="top"
                        item={itemTemplate}
                        thumbnail={thumbnailTemplate}
                    />
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Left</h3>
                    <div className="flex">
                        <Galleria
                            value={images.slice(0, 5)}
                            numVisible={3}
                            thumbnailsPosition="left"
                            item={itemTemplate}
                            thumbnail={thumbnailTemplate}
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Right</h3>
                    <div className="flex">
                        <Galleria
                            value={images.slice(0, 5)}
                            numVisible={3}
                            thumbnailsPosition="right"
                            item={itemTemplate}
                            thumbnail={thumbnailTemplate}
                        />
                    </div>
                </div>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Responsive galleria
 */
export const Responsive: Story = {
    render: () => {
        const responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 5,
            },
            {
                breakpoint: '768px',
                numVisible: 3,
            },
            {
                breakpoint: '640px',
                numVisible: 2,
            },
        ];

        return (
            <div className="w-full max-w-6xl">
                <Galleria
                    value={images}
                    numVisible={7}
                    circular
                    responsiveOptions={responsiveOptions}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Fullscreen galleria with thumbnails
 */
export const Fullscreen: Story = {
    render: () => {
        const galleriaRef = useRef<GalleriaRef>(null);

        return (
            <div className="w-full max-w-4xl space-y-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => galleriaRef.current?.show()}
                >
                    Show Fullscreen
                </button>
                <Galleria
                    ref={galleriaRef}
                    value={images}
                    numVisible={9}
                    circular
                    fullScreen
                    showItemNavigators
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Fullscreen without thumbnails
 */
export const FullscreenNoThumbnails: Story = {
    render: () => {
        const galleriaRef = useRef<GalleriaRef>(null);

        return (
            <div className="w-full max-w-4xl space-y-4">
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    onClick={() => galleriaRef.current?.show()}
                >
                    Show Fullscreen
                </button>
                <Galleria
                    ref={galleriaRef}
                    value={images}
                    numVisible={9}
                    circular
                    fullScreen
                    showItemNavigators
                    showThumbnails={false}
                    item={itemTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Fullscreen with custom content (click thumbnail to open)
 */
export const FullscreenCustomContent: Story = {
    render: () => {
        const galleriaRef = useRef<GalleriaRef>(null);
        const [activeIndex, setActiveIndex] = useState(0);

        return (
            <div className="w-full max-w-4xl space-y-4">
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.thumbnailImageSrc}
                            alt={image.alt}
                            className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => {
                                setActiveIndex(index);
                                galleriaRef.current?.show();
                            }}
                        />
                    ))}
                </div>
                <Galleria
                    ref={galleriaRef}
                    value={images}
                    numVisible={7}
                    activeIndex={activeIndex}
                    onItemChange={(e) => setActiveIndex(e.index)}
                    circular
                    fullScreen
                    showItemNavigators
                    showThumbnails={false}
                    item={itemTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Galleria with navigators
 */
export const WithNavigators: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    numVisible={5}
                    circular
                    showItemNavigators
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Navigators without thumbnails
 */
export const NavigatorsNoThumbnails: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    circular
                    showItemNavigators
                    showThumbnails={false}
                    item={itemTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Navigators on hover
 */
export const NavigatorsOnHover: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    numVisible={5}
                    circular
                    showItemNavigators
                    showItemNavigatorsOnHover
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Navigators with indicators
 */
export const NavigatorsWithIndicators: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    circular
                    showItemNavigators
                    showItemNavigatorsOnHover
                    showIndicators
                    showThumbnails={false}
                    item={itemTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Autoplay galleria
 */
export const Autoplay: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    numVisible={5}
                    circular
                    autoPlay
                    transitionInterval={2000}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Galleria with caption
 */
export const WithCaption: Story = {
    render: () => {
        return (
            <div className="w-full max-w-4xl">
                <Galleria
                    value={images}
                    numVisible={5}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                    caption={captionTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Advanced galleria with custom UI
 */
export const Advanced: Story = {
    render: () => {
        const galleriaRef = useRef<GalleriaRef>(null);
        const [activeIndex, setActiveIndex] = useState(0);
        const [showThumbnails, setShowThumbnails] = useState(true);

        const footerTemplate = () => (
            <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activeIndex + 1} of {images.length}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => setShowThumbnails(!showThumbnails)}
                    >
                        {showThumbnails ? 'Hide' : 'Show'} Thumbnails
                    </button>
                    <button
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={() => galleriaRef.current?.show()}
                    >
                        Fullscreen
                    </button>
                </div>
            </div>
        );

        return (
            <div className="w-full max-w-4xl space-y-4">
                <Galleria
                    ref={galleriaRef}
                    value={images}
                    activeIndex={activeIndex}
                    onItemChange={(e) => setActiveIndex(e.index)}
                    showThumbnails={showThumbnails}
                    showItemNavigators
                    showItemNavigatorsOnHover
                    numVisible={5}
                    circular
                    autoPlay
                    transitionInterval={3000}
                    item={itemTemplate}
                    thumbnail={thumbnailTemplate}
                    footer={footerTemplate}
                />
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Dark theme galleria
 */
export const DarkTheme: Story = {
    render: () => {
        return (
            <ThemeWrapper theme="dark">
                <div className="w-full max-w-4xl p-6">
                    <Galleria
                        value={images}
                        numVisible={5}
                        circular
                        showItemNavigators
                        showItemNavigatorsOnHover
                        item={itemTemplate}
                        thumbnail={thumbnailTemplate}
                        caption={captionTemplate}
                    />
                </div>
            </ThemeWrapper>
        );
    },
    parameters: {
        layout: 'fullscreen',
    },
};

