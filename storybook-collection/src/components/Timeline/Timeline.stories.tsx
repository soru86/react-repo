import type { Meta, StoryObj } from '@storybook/react';
import { Timeline } from './Timeline';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A timeline component that visualizes a series of chained events. Supports vertical and horizontal layouts, different alignments, custom markers, and opposite content.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    layout: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Layout orientation',
    },
    align: {
      control: 'select',
      options: ['left', 'right', 'alternate', 'top', 'bottom'],
      description: 'Content alignment',
    },
  },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample event data
interface Event {
  status: string;
  date?: string;
  description?: string;
  icon?: React.ReactNode;
}

const basicEvents: Event[] = [
  { status: 'Ordered' },
  { status: 'Processing' },
  { status: 'Shipped' },
  { status: 'Delivered' },
];

const eventsWithDates: Event[] = [
  { status: 'Ordered', date: '15/10/2020 10:30' },
  { status: 'Processing', date: '15/10/2020 14:00' },
  { status: 'Shipped', date: '15/10/2020 16:15' },
  { status: 'Delivered', date: '16/10/2020 10:00' },
];

const detailedEvents: Event[] = [
  {
    status: 'Ordered',
    date: '15/10/2020 10:30',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
  },
  {
    status: 'Processing',
    date: '15/10/2020 14:00',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
  },
  {
    status: 'Shipped',
    date: '15/10/2020 16:15',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
  },
  {
    status: 'Delivered',
    date: '16/10/2020 10:00',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque quas!',
  },
];

// Icons
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const PackageIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const TruckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

/**
 * Basic timeline with simple content
 */
export const Basic: Story = {
  render: () => {
    return (
      <div className="w-full md:w-80">
        <Timeline
          value={basicEvents}
          content={(item) => <div className="font-semibold">{item.status}</div>}
        />
      </div>
    );
  },
};

/**
 * Timeline with left alignment
 */
export const LeftAlign: Story = {
  render: () => {
    return (
      <div className="w-full md:w-80">
        <Timeline
          value={basicEvents}
          align="left"
          content={(item) => <div className="font-semibold">{item.status}</div>}
        />
      </div>
    );
  },
};

/**
 * Timeline with right alignment
 */
export const RightAlign: Story = {
  render: () => {
    return (
      <div className="w-full md:w-80">
        <Timeline
          value={basicEvents}
          align="right"
          content={(item) => <div className="font-semibold">{item.status}</div>}
        />
      </div>
    );
  },
};

/**
 * Timeline with alternate alignment
 */
export const AlternateAlign: Story = {
  render: () => {
    return (
      <div className="w-full md:w-80">
        <Timeline
          value={basicEvents}
          align="alternate"
          content={(item) => <div className="font-semibold">{item.status}</div>}
        />
      </div>
    );
  },
};

/**
 * Timeline with opposite content (dates on the other side)
 */
export const WithOpposite: Story = {
  render: () => {
    return (
      <div className="w-full md:w-80">
        <Timeline
          value={eventsWithDates}
          align="alternate"
          opposite={(item) => <div className="font-semibold">{item.status}</div>}
          content={(item) => (
            <small className="text-gray-600 dark:text-gray-400">{item.date}</small>
          )}
        />
      </div>
    );
  },
};

/**
 * Timeline with custom template and styled markers
 */
export const CustomTemplate: Story = {
  render: () => {
    const customizedMarker = (item: Event, index: number) => {
      const icons = [<CheckIcon />, <PackageIcon />, <TruckIcon />, <HomeIcon />];
      return (
        <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center shadow-lg">
          {icons[index % icons.length]}
        </div>
      );
    };

    const customizedContent = (item: Event) => (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-lg mb-2">{item.status}</h3>
        {item.date && (
          <small className="text-gray-600 dark:text-gray-400 block mb-3">{item.date}</small>
        )}
        {item.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{item.description}</p>
        )}
        <a
          href="#"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
        >
          Read more
        </a>
      </div>
    );

    return (
      <div className="w-full max-w-4xl">
        <Timeline
          value={detailedEvents}
          align="alternate"
          marker={customizedMarker}
          content={customizedContent}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Horizontal timeline with top alignment
 */
export const HorizontalTop: Story = {
  render: () => {
    const years = ['2020', '2021', '2022', '2023'];

    return (
      <div className="w-full max-w-4xl">
        <Timeline
          value={years}
          layout="horizontal"
          align="top"
          content={(item) => <div className="font-semibold">{item}</div>}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Horizontal timeline with bottom alignment
 */
export const HorizontalBottom: Story = {
  render: () => {
    const years = ['2020', '2021', '2022', '2023'];

    return (
      <div className="w-full max-w-4xl">
        <Timeline
          value={years}
          layout="horizontal"
          align="bottom"
          content={(item) => <div className="font-semibold">{item}</div>}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Horizontal timeline with alternate alignment
 */
export const HorizontalAlternate: Story = {
  render: () => {
    const years = ['2020', '2021', '2022', '2023'];

    return (
      <div className="w-full max-w-4xl">
        <Timeline
          value={years}
          layout="horizontal"
          align="alternate"
          content={(item) => <div className="font-semibold">{item}</div>}
          opposite={<span>&nbsp;</span>}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Project timeline example
 */
export const ProjectTimeline: Story = {
  render: () => {
    const projectEvents = [
      {
        phase: 'Planning',
        date: 'Jan 2024',
        description: 'Project planning and requirements gathering',
        status: 'completed',
      },
      {
        phase: 'Design',
        date: 'Feb 2024',
        description: 'UI/UX design and architecture planning',
        status: 'completed',
      },
      {
        phase: 'Development',
        date: 'Mar 2024',
        description: 'Core development and feature implementation',
        status: 'in-progress',
      },
      {
        phase: 'Testing',
        date: 'Apr 2024',
        description: 'Quality assurance and bug fixes',
        status: 'pending',
      },
      {
        phase: 'Launch',
        date: 'May 2024',
        description: 'Production deployment and go-live',
        status: 'pending',
      },
    ];

    const statusColors = {
      completed: 'bg-green-500',
      'in-progress': 'bg-blue-500',
      pending: 'bg-gray-400',
    };

    return (
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">Project Timeline</h2>
        <Timeline
          value={projectEvents}
          align="alternate"
          marker={(item) => (
            <div
              className={`w-4 h-4 rounded-full ${statusColors[item.status as keyof typeof statusColors]}`}
            />
          )}
          content={(item) => (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-1">{item.phase}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.date}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
            </div>
          )}
          opposite={(item) => (
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'completed'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : item.status === 'in-progress'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                {item.status}
              </span>
            </div>
          )}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Order tracking example
 */
export const OrderTracking: Story = {
  render: () => {
    const orderEvents = [
      { status: 'Order Placed', date: 'Oct 15, 2024 10:30 AM', icon: <CheckIcon /> },
      { status: 'Payment Confirmed', date: 'Oct 15, 2024 10:35 AM', icon: <CheckIcon /> },
      { status: 'Processing', date: 'Oct 15, 2024 11:00 AM', icon: <PackageIcon /> },
      { status: 'Shipped', date: 'Oct 16, 2024 2:00 PM', icon: <TruckIcon /> },
      { status: 'Out for Delivery', date: 'Oct 17, 2024 8:00 AM', icon: <TruckIcon /> },
      { status: 'Delivered', date: 'Oct 17, 2024 3:30 PM', icon: <HomeIcon /> },
    ];

    return (
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Order #12345 Tracking</h2>
        <Timeline
          value={orderEvents}
          align="left"
          marker={(item) => (
            <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center">
              {item.icon}
            </div>
          )}
          content={(item) => (
            <div className="p-3">
              <div className="font-semibold mb-1">{item.status}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{item.date}</div>
            </div>
          )}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Career timeline example
 */
export const CareerTimeline: Story = {
  render: () => {
    const careerEvents = [
      {
        year: '2018',
        role: 'Junior Developer',
        company: 'Tech Corp',
        description: 'Started my career as a junior developer',
      },
      {
        year: '2020',
        role: 'Software Engineer',
        company: 'Tech Corp',
        description: 'Promoted to software engineer',
      },
      {
        year: '2022',
        role: 'Senior Developer',
        company: 'Innovation Labs',
        description: 'Joined Innovation Labs as senior developer',
      },
      {
        year: '2024',
        role: 'Tech Lead',
        company: 'Innovation Labs',
        description: 'Promoted to tech lead position',
      },
    ];

    return (
      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">Career Journey</h2>
        <Timeline
          value={careerEvents}
          align="alternate"
          marker={(item, index) => (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-lg">
              {index + 1}
            </div>
          )}
          content={(item) => (
            <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-lg mb-1">{item.role}</h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{item.company}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
            </div>
          )}
          opposite={(item) => (
            <div className="text-right md:text-left">
              <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                {item.year}
              </div>
            </div>
          )}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dark theme timeline
 */
export const DarkTheme: Story = {
  render: () => {
    return (
      <ThemeWrapper theme="dark">
        <div className="p-8 min-h-screen bg-gray-900 space-y-8">
          <h2 className="text-2xl font-bold text-white">Timeline (Dark Theme)</h2>
          <div className="w-full md:w-80">
            <Timeline
              value={basicEvents}
              align="alternate"
              content={(item) => (
                <div className="font-semibold text-white">{item.status}</div>
              )}
            />
          </div>
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Horizontal product roadmap
 */
export const ProductRoadmap: Story = {
  render: () => {
    const roadmapEvents = [
      { quarter: 'Q1 2024', milestone: 'MVP Launch' },
      { quarter: 'Q2 2024', milestone: 'Feature Expansion' },
      { quarter: 'Q3 2024', milestone: 'Enterprise Features' },
      { quarter: 'Q4 2024', milestone: 'Global Launch' },
    ];

    return (
      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold mb-6">Product Roadmap 2024</h2>
        <Timeline
          value={roadmapEvents}
          layout="horizontal"
          align="alternate"
          marker={(item, index) => (
            <div className="w-10 h-10 rounded-full bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center font-bold shadow-lg">
              {index + 1}
            </div>
          )}
          content={(item) => (
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
              <div className="font-semibold mb-1">{item.milestone}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{item.quarter}</div>
            </div>
          )}
          opposite={<span>&nbsp;</span>}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

