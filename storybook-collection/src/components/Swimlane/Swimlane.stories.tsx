import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Swimlane, Swimlane as SwimlaneType } from './Swimlane';
import { ThemeWrapper } from '../../utils/ThemeWrapper';
import { Button } from '../Button/Button';

// Icons
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BugIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const TaskIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const StoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const EpicIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

// Sample data generators
const generateJiraSwimlanes = (): SwimlaneType[] => {
  return [
    {
      id: 'todo',
      title: 'To Do',
      icon: <TaskIcon />,
      cards: [
        {
          id: 'card-1',
          title: 'Implement user authentication',
          content: 'Add login and registration functionality',
          metadata: <span className="flex items-center gap-1"><UserIcon /> John Doe</span>,
          color: '#3b82f6',
        },
        {
          id: 'card-2',
          title: 'Design dashboard UI',
          content: 'Create mockups for the main dashboard',
          metadata: <span className="flex items-center gap-1"><UserIcon /> Jane Smith</span>,
          color: '#10b981',
        },
        {
          id: 'card-3',
          title: 'Setup CI/CD pipeline',
          content: 'Configure GitHub Actions for automated testing',
          metadata: <span className="flex items-center gap-1"><UserIcon /> Bob Johnson</span>,
          color: '#f59e0b',
        },
      ],
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      icon: <BugIcon />,
      cards: [
        {
          id: 'card-4',
          title: 'Fix navigation bug',
          content: 'Navigation menu not working on mobile devices',
          metadata: <span className="flex items-center gap-1"><UserIcon /> Alice Brown</span>,
          color: '#ef4444',
        },
        {
          id: 'card-5',
          title: 'Optimize database queries',
          content: 'Improve performance of user search functionality',
          metadata: <span className="flex items-center gap-1"><UserIcon /> Charlie Wilson</span>,
          color: '#8b5cf6',
        },
      ],
    },
    {
      id: 'review',
      title: 'In Review',
      icon: <StoryIcon />,
      cards: [
        {
          id: 'card-6',
          title: 'Add unit tests',
          content: 'Write tests for authentication module',
          metadata: <span className="flex items-center gap-1"><UserIcon /> David Lee</span>,
          color: '#06b6d4',
        },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      icon: <EpicIcon />,
      cards: [
        {
          id: 'card-7',
          title: 'Deploy to staging',
          content: 'Successfully deployed latest changes',
          metadata: <span className="flex items-center gap-1"><UserIcon /> Emma Davis</span>,
          color: '#10b981',
        },
        {
          id: 'card-8',
          title: 'Update documentation',
          content: 'Documented API endpoints and usage',
          metadata: <span className="flex items-center gap-1"><UserIcon /> Frank Miller</span>,
          color: '#10b981',
        },
      ],
    },
  ];
};

const generateSimpleSwimlanes = (): SwimlaneType[] => {
  return [
    {
      id: 'lane-1',
      title: 'Backlog',
      cards: [
        { id: 'c1', content: 'Task 1', title: 'Feature A' },
        { id: 'c2', content: 'Task 2', title: 'Feature B' },
        { id: 'c3', content: 'Task 3', title: 'Feature C' },
      ],
    },
    {
      id: 'lane-2',
      title: 'Sprint',
      cards: [
        { id: 'c4', content: 'Task 4', title: 'Feature D' },
        { id: 'c5', content: 'Task 5', title: 'Feature E' },
      ],
    },
    {
      id: 'lane-3',
      title: 'Done',
      cards: [{ id: 'c6', content: 'Task 6', title: 'Feature F' }],
    },
  ];
};

const meta = {
  title: 'Components/Swimlane',
  component: Swimlane,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A swimlane component similar to Atlassian Jira dashboard swimlanes. Supports both horizontal (rows) and vertical (columns) orientations, collapsible headers, drag-and-drop, and dark/light themes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of swimlanes',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'filled', 'minimal'],
      description: 'Visual variant',
    },
    showHeaders: {
      control: 'boolean',
      description: 'Show swimlane headers',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow collapsing swimlanes',
    },
    cardSpacing: {
      control: 'number',
      description: 'Spacing between cards',
    },
    swimlaneSpacing: {
      control: 'number',
      description: 'Spacing between swimlanes',
    },
    swimlaneWidth: {
      control: 'number',
      description: 'Fixed width for all swimlanes (in pixels or CSS value)',
    },
    draggable: {
      control: 'boolean',
      description: 'Enable drag and drop',
    },
  },
  args: {
    onCardClick: fn(),
    onSwimlaneHeaderClick: fn(),
    onSwimlaneToggle: fn(),
  },
} satisfies Meta<typeof Swimlane>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default horizontal swimlanes (Jira-style)
 */
export const Default: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'horizontal',
  },
};

/**
 * Vertical swimlanes (columns)
 */
export const Vertical: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'vertical',
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Vertical collapsible swimlanes with fixed width
 * Click headers to collapse - collapsed swimlanes appear as vertical bars
 * All swimlanes have a fixed width of 300px
 */
export const VerticalCollapsible: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'vertical',
    collapsible: true,
    swimlaneWidth: 300,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Vertical swimlanes with different fixed widths
 */
export const VerticalFixedWidths: Story = {
  args: {
    swimlanes: [],
    orientation: 'vertical',
  },
  render: () => {
    const swimlanes = [
      {
        id: 'narrow',
        title: 'Narrow (200px)',
        cards: [
          { id: 'n1', content: 'Card 1', title: 'Task 1' },
          { id: 'n2', content: 'Card 2', title: 'Task 2' },
        ],
      },
      {
        id: 'medium',
        title: 'Medium (300px)',
        cards: [
          { id: 'm1', content: 'Card 1', title: 'Task 1' },
          { id: 'm2', content: 'Card 2', title: 'Task 2' },
          { id: 'm3', content: 'Card 3', title: 'Task 3' },
        ],
      },
      {
        id: 'wide',
        title: 'Wide (400px)',
        cards: [
          { id: 'w1', content: 'Card 1', title: 'Task 1' },
          { id: 'w2', content: 'Card 2', title: 'Task 2' },
        ],
      },
    ];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">All swimlanes: 250px fixed width</h3>
          <Swimlane swimlanes={swimlanes} orientation="vertical" swimlaneWidth={250} />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">All swimlanes: 350px fixed width</h3>
          <Swimlane swimlanes={swimlanes} orientation="vertical" swimlaneWidth={350} />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Horizontal orientation with simple cards
 */
export const Horizontal: Story = {
  args: {
    swimlanes: generateSimpleSwimlanes(),
    orientation: 'horizontal',
  },
};

/**
 * Collapsible swimlanes
 */
export const Collapsible: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'horizontal',
    collapsible: true,
  },
};

/**
 * Without headers
 */
export const WithoutHeaders: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'horizontal',
    showHeaders: false,
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  args: {
    swimlanes: [],
  },
  render: () => {
    const swimlanes = generateSimpleSwimlanes();
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Small</h3>
          <Swimlane swimlanes={swimlanes} size="small" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Medium</h3>
          <Swimlane swimlanes={swimlanes} size="medium" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Large</h3>
          <Swimlane swimlanes={swimlanes} size="large" />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different variants
 */
export const Variants: Story = {
  args: {
    swimlanes: [],
  },
  render: () => {
    const swimlanes = generateSimpleSwimlanes();
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Default</h3>
          <Swimlane swimlanes={swimlanes} variant="default" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Bordered</h3>
          <Swimlane swimlanes={swimlanes} variant="bordered" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Filled</h3>
          <Swimlane swimlanes={swimlanes} variant="filled" />
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Minimal</h3>
          <Swimlane swimlanes={swimlanes} variant="minimal" />
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom spacing
 */
export const CustomSpacing: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'horizontal',
    cardSpacing: 20,
    swimlaneSpacing: 24,
  },
};

/**
 * Card size constraints
 */
export const CardSizeConstraints: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'horizontal',
    minCardSize: 200,
    maxCardSize: 300,
  },
};

/**
 * Colored swimlanes and cards
 */
export const Colored: Story = {
  args: {
    swimlanes: [
      {
        id: 'red',
        title: 'High Priority',
        color: '#ef4444',
        cards: [
          { id: 'r1', content: 'Urgent bug fix', color: '#ef4444' },
          { id: 'r2', content: 'Critical security patch', color: '#ef4444' },
        ],
      },
      {
        id: 'blue',
        title: 'Medium Priority',
        color: '#3b82f6',
        cards: [
          { id: 'b1', content: 'Feature enhancement', color: '#3b82f6' },
          { id: 'b2', content: 'UI improvements', color: '#3b82f6' },
        ],
      },
      {
        id: 'green',
        title: 'Low Priority',
        color: '#10b981',
        cards: [
          { id: 'g1', content: 'Documentation update', color: '#10b981' },
          { id: 'g2', content: 'Code cleanup', color: '#10b981' },
        ],
      },
    ],
    orientation: 'horizontal',
  },
};

/**
 * Interactive cards with click handlers
 */
export const Interactive: Story = {
  args: {
    swimlanes: [],
  },
  render: () => {
    const [selectedCard, setSelectedCard] = useState<string | null>(null);
    const swimlanes = generateJiraSwimlanes();

    return (
      <div>
        <Swimlane
          swimlanes={swimlanes}
          orientation="horizontal"
          onCardClick={(card) => {
            setSelectedCard(card.id);
            alert(`Clicked card: ${card.title || card.id}`);
          }}
        />
        {selectedCard && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded">
            <p className="font-semibold">Selected Card ID: {selectedCard}</p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Draggable cards
 */
export const Draggable: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'horizontal',
    draggable: true,
  },
};

/**
 * Empty swimlanes
 */
export const WithEmptySwimlanes: Story = {
  args: {
    swimlanes: [
      {
        id: 'has-cards',
        title: 'Has Cards',
        cards: [
          { id: 'c1', content: 'Card 1' },
          { id: 'c2', content: 'Card 2' },
        ],
      },
      {
        id: 'empty',
        title: 'Empty Swimlane',
        cards: [],
      },
      {
        id: 'also-empty',
        title: 'Also Empty',
        cards: [],
      },
    ],
    orientation: 'horizontal',
    showEmptySwimlanes: true,
    emptyMessage: 'No items in this swimlane',
  },
};

/**
 * Hide empty swimlanes
 */
export const HideEmptySwimlanes: Story = {
  args: {
    swimlanes: [
      {
        id: 'has-cards',
        title: 'Has Cards',
        cards: [
          { id: 'c1', content: 'Card 1' },
          { id: 'c2', content: 'Card 2' },
        ],
      },
      {
        id: 'empty',
        title: 'Empty Swimlane',
        cards: [],
      },
    ],
    orientation: 'horizontal',
    showEmptySwimlanes: false,
  },
};

/**
 * Complex example with metadata
 */
export const ComplexExample: Story = {
  args: {
    swimlanes: [
      {
        id: 'sprint-1',
        title: 'Sprint 1',
        icon: <TaskIcon />,
        metadata: '5 tasks',
        cards: [
          {
            id: 'task-1',
            title: 'User Authentication',
            content: 'Implement OAuth2 login flow',
            metadata: (
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                  High
                </span>
                <span className="text-xs">Due: Dec 15</span>
              </div>
            ),
            color: '#3b82f6',
          },
          {
            id: 'task-2',
            title: 'Database Migration',
            content: 'Migrate to PostgreSQL 14',
            metadata: (
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded text-xs">
                  Medium
                </span>
                <span className="text-xs">Due: Dec 20</span>
              </div>
            ),
            color: '#10b981',
          },
        ],
      },
      {
        id: 'sprint-2',
        title: 'Sprint 2',
        icon: <StoryIcon />,
        metadata: '3 tasks',
        cards: [
          {
            id: 'task-3',
            title: 'API Documentation',
            content: 'Generate OpenAPI specs',
            metadata: (
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded text-xs">
                  Low
                </span>
              </div>
            ),
            color: '#f59e0b',
          },
        ],
      },
    ],
    orientation: 'horizontal',
    collapsible: true,
  },
};

/**
 * Vertical with many cards
 */
export const VerticalManyCards: Story = {
  args: {
    swimlanes: [
      {
        id: 'col-1',
        title: 'Column 1',
        cards: Array.from({ length: 10 }, (_, i) => ({
          id: `card-${i}`,
          content: `Card ${i + 1}`,
          title: `Task ${i + 1}`,
        })),
      },
      {
        id: 'col-2',
        title: 'Column 2',
        cards: Array.from({ length: 8 }, (_, i) => ({
          id: `card-${i + 10}`,
          content: `Card ${i + 11}`,
          title: `Task ${i + 11}`,
        })),
      },
      {
        id: 'col-3',
        title: 'Column 3',
        cards: Array.from({ length: 12 }, (_, i) => ({
          id: `card-${i + 18}`,
          content: `Card ${i + 19}`,
          title: `Task ${i + 19}`,
        })),
      },
    ],
    orientation: 'vertical',
    minCardSize: 250,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Vertical collapsible with fixed width and many cards
 */
export const VerticalCollapsibleFixedWidth: Story = {
  args: {
    swimlanes: [
      {
        id: 'backlog',
        title: 'Backlog',
        icon: <TaskIcon />,
        cards: Array.from({ length: 5 }, (_, i) => ({
          id: `backlog-${i}`,
          content: `Backlog item ${i + 1}`,
          title: `Task ${i + 1}`,
        })),
      },
      {
        id: 'todo',
        title: 'To Do',
        icon: <TaskIcon />,
        cards: Array.from({ length: 3 }, (_, i) => ({
          id: `todo-${i}`,
          content: `To do item ${i + 1}`,
          title: `Task ${i + 4}`,
        })),
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        icon: <BugIcon />,
        cards: Array.from({ length: 4 }, (_, i) => ({
          id: `progress-${i}`,
          content: `In progress item ${i + 1}`,
          title: `Task ${i + 7}`,
        })),
      },
      {
        id: 'review',
        title: 'In Review',
        icon: <StoryIcon />,
        cards: Array.from({ length: 2 }, (_, i) => ({
          id: `review-${i}`,
          content: `Review item ${i + 1}`,
          title: `Task ${i + 11}`,
        })),
      },
      {
        id: 'done',
        title: 'Done',
        icon: <EpicIcon />,
        cards: Array.from({ length: 6 }, (_, i) => ({
          id: `done-${i}`,
          content: `Done item ${i + 1}`,
          title: `Task ${i + 13}`,
        })),
      },
    ],
    orientation: 'vertical',
    collapsible: true,
    swimlaneWidth: 280,
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Horizontal with fixed width swimlanes
 */
export const HorizontalFixedWidth: Story = {
  args: {
    swimlanes: generateJiraSwimlanes(),
    orientation: 'horizontal',
    swimlaneWidth: 600,
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom card rendering
 */
export const CustomCards: Story = {
  args: {
    swimlanes: [
      {
        id: 'custom',
        title: 'Custom Cards',
        cards: [
          {
            id: 'custom-1',
            content: (
              <div>
                <div className="font-bold text-lg mb-2">Custom Card 1</div>
                <p className="text-gray-600 dark:text-gray-400">
                  This card has custom React content with buttons and more.
                </p>
                <div className="mt-3 flex gap-2">
                  <Button size="small" variant="primary">
                    Action 1
                  </Button>
                  <Button size="small" variant="secondary">
                    Action 2
                  </Button>
                </div>
              </div>
            ),
          },
          {
            id: 'custom-2',
            content: (
              <div>
                <div className="font-bold text-lg mb-2">Custom Card 2</div>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                  <li>Feature A</li>
                  <li>Feature B</li>
                  <li>Feature C</li>
                </ul>
              </div>
            ),
          },
        ],
      },
    ],
    orientation: 'horizontal',
  },
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  args: {
    swimlanes: [],
  },
  render: () => {
    return (
      <ThemeWrapper theme="dark">
        <Swimlane swimlanes={generateJiraSwimlanes()} orientation="horizontal" collapsible />
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Light theme
 */
export const LightTheme: Story = {
  args: {
    swimlanes: [],
  },
  render: () => {
    return (
      <ThemeWrapper theme="light">
        <Swimlane swimlanes={generateJiraSwimlanes()} orientation="horizontal" collapsible />
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * All features combined
 */
export const AllFeatures: Story = {
  args: {
    swimlanes: [],
  },
  render: () => {
    const [collapsedLanes, setCollapsedLanes] = useState<Set<string>>(new Set());

    return (
      <div>
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h3 className="font-semibold mb-2">Swimlane Component with All Features</h3>
          <ul className="text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
            <li>Horizontal orientation</li>
            <li>Collapsible headers</li>
            <li>Colored swimlanes and cards</li>
            <li>Card metadata</li>
            <li>Icons in headers</li>
            <li>Click handlers</li>
          </ul>
        </div>
        <Swimlane
          swimlanes={generateJiraSwimlanes()}
          orientation="horizontal"
          collapsible
          onSwimlaneToggle={(id, collapsed) => {
            const newCollapsed = new Set(collapsedLanes);
            if (collapsed) {
              newCollapsed.add(id);
            } else {
              newCollapsed.delete(id);
            }
            setCollapsedLanes(newCollapsed);
          }}
          onCardClick={(card) => {
            console.log('Card clicked:', card);
          }}
        />
      </div>
    );
  },
};

