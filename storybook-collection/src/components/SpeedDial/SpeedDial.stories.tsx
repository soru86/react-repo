import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { SpeedDial, SpeedDialItem } from './SpeedDial';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Icons
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
    />
  </svg>
);

const BarsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const meta = {
  title: 'Components/SpeedDial',
  component: SpeedDial,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A floating action button with a popup menu. Supports linear, circle, semi-circle, and quarter-circle layouts with customizable directions, tooltips, and mask overlay.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right'],
      description: 'Direction of items relative to button',
    },
    type: {
      control: 'select',
      options: ['linear', 'circle', 'semi-circle', 'quarter-circle'],
      description: 'Type of layout',
    },
    radius: {
      control: 'number',
      description: 'Radius for circle types',
    },
    mask: {
      control: 'boolean',
      description: 'Whether to show mask (modal layer)',
    },
    transitionDelay: {
      control: 'number',
      description: 'Transition delay in milliseconds',
    },
  },
  args: {
    onVisibleChange: fn(),
  },
} satisfies Meta<typeof SpeedDial>;

export default meta;
type Story = StoryObj<typeof meta>;

// Common items for demos
const commonItems: SpeedDialItem[] = [
  {
    icon: <HomeIcon />,
    label: 'Home',
    tooltip: 'Go to home',
    command: () => console.log('Home clicked'),
  },
  {
    icon: <UserIcon />,
    label: 'Profile',
    tooltip: 'View profile',
    command: () => console.log('Profile clicked'),
  },
  {
    icon: <SettingsIcon />,
    label: 'Settings',
    tooltip: 'Open settings',
    command: () => console.log('Settings clicked'),
  },
];

/**
 * Linear speed dial - up direction
 */
export const LinearUp: Story = {
  render: () => {
    const [message, setMessage] = useState('Click the speed dial button');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        label: 'Home',
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        label: 'Profile',
        command: () => setMessage('Profile clicked'),
      },
      {
        icon: <SettingsIcon />,
        label: 'Settings',
        command: () => setMessage('Settings clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[600px] h-[600px] flex items-center justify-center">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          direction="up"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', bottom: 0 }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Linear speed dial - all directions
 */
export const LinearDirections: Story = {
  render: () => {
    const [message, setMessage] = useState('Click any speed dial');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        command: () => setMessage('Action clicked'),
      },
      {
        icon: <UserIcon />,
        command: () => setMessage('Action clicked'),
      },
      {
        icon: <SettingsIcon />,
        command: () => setMessage('Action clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[800px] h-[600px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          direction="up"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', bottom: 0 }}
        />
        <SpeedDial
          model={items}
          direction="down"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', top: 0 }}
        />
        <SpeedDial
          model={items}
          direction="left"
          style={{ position: 'absolute', top: 'calc(50% - 2rem)', right: 0 }}
        />
        <SpeedDial
          model={items}
          direction="right"
          style={{ position: 'absolute', top: 'calc(50% - 2rem)', left: 0 }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Circle speed dial
 */
export const Circle: Story = {
  render: () => {
    const [message, setMessage] = useState('Click the speed dial button');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        tooltip: 'Home',
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        tooltip: 'Profile',
        command: () => setMessage('Profile clicked'),
      },
      {
        icon: <SettingsIcon />,
        tooltip: 'Settings',
        command: () => setMessage('Settings clicked'),
      },
      {
        icon: <EditIcon />,
        tooltip: 'Edit',
        command: () => setMessage('Edit clicked'),
      },
      {
        icon: <DeleteIcon />,
        tooltip: 'Delete',
        command: () => setMessage('Delete clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[600px] h-[600px] flex items-center justify-center">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          radius={80}
          type="circle"
          buttonClassName="bg-yellow-500 hover:bg-yellow-600"
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Semi-circle speed dial - all directions
 */
export const SemiCircle: Story = {
  render: () => {
    const [message, setMessage] = useState('Click any speed dial');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        command: () => setMessage('Action clicked'),
      },
      {
        icon: <UserIcon />,
        command: () => setMessage('Action clicked'),
      },
      {
        icon: <SettingsIcon />,
        command: () => setMessage('Action clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[800px] h-[600px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          radius={80}
          type="semi-circle"
          direction="up"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', bottom: 0 }}
        />
        <SpeedDial
          model={items}
          radius={80}
          type="semi-circle"
          direction="down"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', top: 0 }}
        />
        <SpeedDial
          model={items}
          radius={80}
          type="semi-circle"
          direction="left"
          style={{ position: 'absolute', top: 'calc(50% - 2rem)', right: 0 }}
        />
        <SpeedDial
          model={items}
          radius={80}
          type="semi-circle"
          direction="right"
          style={{ position: 'absolute', top: 'calc(50% - 2rem)', left: 0 }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Quarter-circle speed dial - all corners
 */
export const QuarterCircle: Story = {
  render: () => {
    const [message, setMessage] = useState('Click any speed dial');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        command: () => setMessage('Action clicked'),
      },
      {
        icon: <UserIcon />,
        command: () => setMessage('Action clicked'),
      },
      {
        icon: <SettingsIcon />,
        command: () => setMessage('Action clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[800px] h-[600px]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          radius={120}
          type="quarter-circle"
          direction="up-left"
          style={{ position: 'absolute', right: 0, bottom: 0 }}
        />
        <SpeedDial
          model={items}
          radius={120}
          type="quarter-circle"
          direction="up-right"
          style={{ position: 'absolute', left: 0, bottom: 0 }}
        />
        <SpeedDial
          model={items}
          radius={120}
          type="quarter-circle"
          direction="down-left"
          style={{ position: 'absolute', right: 0, top: 0 }}
        />
        <SpeedDial
          model={items}
          radius={120}
          type="quarter-circle"
          direction="down-right"
          style={{ position: 'absolute', left: 0, top: 0 }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Speed dial with tooltips
 */
export const WithTooltips: Story = {
  render: () => {
    const [message, setMessage] = useState('Hover over items to see tooltips');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        tooltip: 'Go to home page',
        tooltipOptions: { position: 'left' },
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        tooltip: 'View user profile',
        tooltipOptions: { position: 'left' },
        command: () => setMessage('Profile clicked'),
      },
      {
        icon: <SettingsIcon />,
        tooltip: 'Open settings',
        tooltipOptions: { position: 'left' },
        command: () => setMessage('Settings clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[600px] h-[600px] flex items-center justify-center">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          direction="up"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', bottom: 0 }}
          buttonClassName="bg-red-500 hover:bg-red-600"
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Speed dial with mask
 */
export const WithMask: Story = {
  render: () => {
    const [message, setMessage] = useState('Click the speed dial button');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        label: 'Home',
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        label: 'Profile',
        command: () => setMessage('Profile clicked'),
      },
      {
        icon: <SettingsIcon />,
        label: 'Settings',
        command: () => setMessage('Settings clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[600px] h-[600px] flex items-center justify-center">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          radius={120}
          direction="up"
          mask
          style={{ position: 'absolute', right: 0, bottom: 0 }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Custom speed dial with outlined button and custom icons
 */
export const Custom: Story = {
  render: () => {
    const [message, setMessage] = useState('Click the speed dial button');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        label: 'Home',
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        label: 'Profile',
        command: () => setMessage('Profile clicked'),
      },
      {
        icon: <SettingsIcon />,
        label: 'Settings',
        command: () => setMessage('Settings clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[600px] h-[600px] flex items-center justify-center">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          direction="up"
          transitionDelay={80}
          showIcon={<BarsIcon />}
          hideIcon={<CloseIcon />}
          buttonClassName="bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', bottom: 0 }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Speed dial with many items
 */
export const ManyItems: Story = {
  render: () => {
    const [message, setMessage] = useState('Click the speed dial button');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        tooltip: 'Home',
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        tooltip: 'Profile',
        command: () => setMessage('Profile clicked'),
      },
      {
        icon: <SettingsIcon />,
        tooltip: 'Settings',
        command: () => setMessage('Settings clicked'),
      },
      {
        icon: <EditIcon />,
        tooltip: 'Edit',
        command: () => setMessage('Edit clicked'),
      },
      {
        icon: <DeleteIcon />,
        tooltip: 'Delete',
        command: () => setMessage('Delete clicked'),
      },
      {
        icon: <ShareIcon />,
        tooltip: 'Share',
        command: () => setMessage('Share clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[600px] h-[600px] flex items-center justify-center">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          radius={100}
          type="circle"
          buttonClassName="bg-green-500 hover:bg-green-600"
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Speed dial with disabled items
 */
export const WithDisabledItems: Story = {
  render: () => {
    const [message, setMessage] = useState('Click the speed dial button');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        label: 'Home',
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        label: 'Profile',
        disabled: true,
        command: () => setMessage('This should not fire'),
      },
      {
        icon: <SettingsIcon />,
        label: 'Settings',
        command: () => setMessage('Settings clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[600px] h-[600px] flex items-center justify-center">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
          <p className="text-sm">{message}</p>
        </div>
        <SpeedDial
          model={items}
          direction="up"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', bottom: 0 }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Dark theme speed dial
 */
export const DarkTheme: Story = {
  render: () => {
    const [message, setMessage] = useState('Click the speed dial button');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        tooltip: 'Home',
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        tooltip: 'Profile',
        command: () => setMessage('Profile clicked'),
      },
      {
        icon: <SettingsIcon />,
        tooltip: 'Settings',
        command: () => setMessage('Settings clicked'),
      },
    ];

    return (
      <ThemeWrapper theme="dark">
        <div className="relative w-full min-w-[600px] h-[600px] flex items-center justify-center">
          <div className="absolute top-4 left-1/2 -translate-x-1/2 p-4 bg-gray-800 rounded-lg z-10">
            <p className="text-sm text-gray-100">{message}</p>
          </div>
          <SpeedDial
            model={items}
            radius={80}
            type="circle"
            buttonClassName="bg-purple-600 hover:bg-purple-700"
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
 * Controlled speed dial
 */
export const Controlled: Story = {
  render: () => {
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('Speed dial is closed');

    const items: SpeedDialItem[] = [
      {
        icon: <HomeIcon />,
        label: 'Home',
        command: () => setMessage('Home clicked'),
      },
      {
        icon: <UserIcon />,
        label: 'Profile',
        command: () => setMessage('Profile clicked'),
      },
      {
        icon: <SettingsIcon />,
        label: 'Settings',
        command: () => setMessage('Settings clicked'),
      },
    ];

    return (
      <div className="relative w-full min-w-[600px] h-[600px] flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm mb-2">{message}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Speed dial is {visible ? 'open' : 'closed'}
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Close' : 'Open'} Speed Dial
        </button>
        <SpeedDial
          model={items}
          visible={visible}
          onVisibleChange={setVisible}
          direction="up"
          style={{ position: 'absolute', left: 'calc(50% - 2rem)', bottom: 0 }}
        />
      </div>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

