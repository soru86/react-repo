import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Carousel } from './Carousel';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Sample data
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Laptop Pro',
    price: 1299,
    image: '💻',
    description: 'High-performance laptop for professionals',
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    price: 49,
    image: '🖱️',
    description: 'Ergonomic wireless mouse',
  },
  {
    id: 3,
    name: 'Mechanical Keyboard',
    price: 149,
    image: '⌨️',
    description: 'RGB mechanical keyboard',
  },
  {
    id: 4,
    name: '4K Monitor',
    price: 399,
    image: '🖥️',
    description: '27-inch 4K display',
  },
  {
    id: 5,
    name: 'Webcam HD',
    price: 79,
    image: '📹',
    description: '1080p HD webcam',
  },
  {
    id: 6,
    name: 'USB-C Hub',
    price: 59,
    image: '🔌',
    description: 'Multi-port USB-C hub',
  },
  {
    id: 7,
    name: 'Noise Cancelling Headphones',
    price: 299,
    image: '🎧',
    description: 'Premium wireless headphones',
  },
  {
    id: 8,
    name: 'Standing Desk',
    price: 499,
    image: '🪑',
    description: 'Adjustable standing desk',
  },
];

const productTemplate = (product: Product) => (
  <div className="p-4 h-full">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 h-full flex flex-col">
      <div className="text-6xl mb-4 text-center">{product.image}</div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {product.name}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
        {product.description}
      </p>
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        ${product.price}
      </div>
    </div>
  </div>
);

const simpleTemplate = (item: string, index: number) => (
  <div className="p-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white flex items-center justify-center text-4xl font-bold">
    {item}
  </div>
);

const meta = {
  title: 'Components/Carousel',
  component: Carousel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A carousel component for displaying content in a sliding format. Supports horizontal and vertical orientations, autoplay, circular scrolling, responsive breakpoints, and customizable templates.',
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
      description: 'Number of items visible at once',
    },
    numScroll: {
      control: 'number',
      description: 'Number of items to scroll',
    },
    circular: {
      control: 'boolean',
      description: 'Whether carousel is circular (infinite scroll)',
    },
    autoplayInterval: {
      control: 'number',
      description: 'Autoplay interval in milliseconds',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the carousel',
    },
    showNavigators: {
      control: 'boolean',
      description: 'Whether to show navigation buttons',
    },
    showIndicators: {
      control: 'boolean',
      description: 'Whether to show indicator dots',
    },
  },
  args: {
    onPageChange: fn(),
  },
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic carousel with 3 visible items
 */
export const Basic: Story = {
  render: () => {
    const items = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];

    return (
      <div className="w-full max-w-4xl">
        <Carousel
          value={items}
          numVisible={3}
          numScroll={3}
          itemTemplate={simpleTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Carousel with single item visible
 */
export const SingleItem: Story = {
  render: () => {
    const items = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];

    return (
      <div className="w-full max-w-2xl">
        <Carousel
          value={items}
          numVisible={1}
          numScroll={1}
          itemTemplate={simpleTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Circular carousel with infinite scrolling
 */
export const Circular: Story = {
  render: () => {
    const items = ['Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5'];

    return (
      <div className="w-full max-w-4xl">
        <Carousel
          value={items}
          numVisible={3}
          numScroll={1}
          circular
          itemTemplate={simpleTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Autoplay carousel that automatically scrolls
 */
export const Autoplay: Story = {
  render: () => {
    return (
      <div className="w-full max-w-4xl">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={1}
          autoplayInterval={3000}
          itemTemplate={productTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Carousel with custom scroll amount
 */
export const NumScroll: Story = {
  render: () => {
    return (
      <div className="w-full max-w-4xl">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={1}
          itemTemplate={productTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Responsive carousel that adapts to screen size
 */
export const Responsive: Story = {
  render: () => {
    const responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '640px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    return (
      <div className="w-full max-w-6xl">
        <Carousel
          value={products}
          numVisible={4}
          numScroll={4}
          responsiveOptions={responsiveOptions}
          itemTemplate={productTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Vertical carousel
 */
export const Vertical: Story = {
  render: () => {
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

    return (
      <div className="w-full max-w-md">
        <Carousel
          value={items}
          numVisible={1}
          numScroll={1}
          orientation="vertical"
          verticalViewPortHeight="360px"
          itemTemplate={simpleTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Carousel without navigation buttons
 */
export const NoNavigators: Story = {
  render: () => {
    return (
      <div className="w-full max-w-4xl">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={1}
          showNavigators={false}
          itemTemplate={productTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Carousel without indicators
 */
export const NoIndicators: Story = {
  render: () => {
    return (
      <div className="w-full max-w-4xl">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={1}
          showIndicators={false}
          itemTemplate={productTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Carousel with product cards
 */
export const ProductCards: Story = {
  render: () => {
    return (
      <div className="w-full max-w-6xl">
        <Carousel
          value={products}
          numVisible={4}
          numScroll={2}
          itemTemplate={productTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Circular autoplay carousel
 */
export const CircularAutoplay: Story = {
  render: () => {
    return (
      <div className="w-full max-w-4xl">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={1}
          circular
          autoplayInterval={4000}
          itemTemplate={productTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dark theme carousel
 */
export const DarkTheme: Story = {
  render: () => {
    return (
      <ThemeWrapper theme="dark">
        <div className="w-full max-w-4xl p-6">
          <Carousel
            value={products}
            numVisible={3}
            numScroll={1}
            autoplayInterval={3000}
            itemTemplate={productTemplate}
          />
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Carousel with many items
 */
export const ManyItems: Story = {
  render: () => {
    const manyItems = Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`);

    return (
      <div className="w-full max-w-4xl">
        <Carousel
          value={manyItems}
          numVisible={3}
          numScroll={1}
          circular
          itemTemplate={simpleTemplate}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive carousel with page change callback
 */
export const Interactive: Story = {
  render: () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageHistory, setPageHistory] = useState<number[]>([]);

    return (
      <div className="w-full max-w-4xl space-y-4">
        <Carousel
          value={products}
          numVisible={3}
          numScroll={1}
          itemTemplate={productTemplate}
          onPageChange={(page) => {
            setCurrentPage(page);
            setPageHistory((prev) => [...prev, page]);
          }}
        />
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-semibold mb-2">Current Page: {currentPage + 1}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Page History: {pageHistory.length > 0 ? pageHistory.join(' → ') : 'None'}
          </p>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

