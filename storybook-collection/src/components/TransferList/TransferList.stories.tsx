import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { TransferList } from './TransferList';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Sample icons
const UserIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

// Sample data
const generateItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    label: `Item ${i + 1}`,
    description: `Description for item ${i + 1}`,
  }));
};

const itemsWithIcons = [
  { id: 1, label: 'User Management', description: 'Manage users and permissions', icon: <UserIcon /> },
  { id: 2, label: 'File Storage', description: 'Organize files and folders', icon: <FolderIcon /> },
  { id: 3, label: 'Favorites', description: 'Bookmarked items', icon: <StarIcon /> },
  { id: 4, label: 'Settings', description: 'Application settings', icon: <FolderIcon /> },
  { id: 5, label: 'Reports', description: 'View reports and analytics', icon: <UserIcon /> },
  { id: 6, label: 'Dashboard', description: 'Main dashboard view', icon: <StarIcon /> },
];

const meta = {
  title: 'Components/TransferList',
  component: TransferList,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A transfer list component with multi-selection support. Allows users to move items between two lists using action buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    items: {
      description: 'Available items (source list)',
    },
    selectedIds: {
      description: 'Selected item IDs (controlled mode)',
    },
    defaultSelectedIds: {
      description: 'Default selected item IDs (uncontrolled mode)',
    },
    onChange: {
      action: 'changed',
      description: 'Callback when selection changes',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    searchable: {
      control: 'boolean',
      description: 'Whether to show search inputs',
    },
    sourceTitle: {
      control: 'text',
      description: 'Source list title',
    },
    destinationTitle: {
      control: 'text',
      description: 'Destination list title',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof TransferList>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default transfer list
 */
export const Default: Story = {
  args: {
    items: generateItems(10),
    defaultSelectedIds: [2, 4, 6],
  },
};

/**
 * Transfer list with search
 */
export const WithSearch: Story = {
  args: {
    items: generateItems(20),
    defaultSelectedIds: [5, 10, 15],
    searchable: true,
  },
};

/**
 * Transfer list with icons
 */
export const WithIcons: Story = {
  args: {
    items: itemsWithIcons,
    defaultSelectedIds: [2, 4],
    searchable: true,
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Small</h3>
        <TransferList items={generateItems(5)} defaultSelectedIds={[2]} size="small" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Medium</h3>
        <TransferList items={generateItems(5)} defaultSelectedIds={[2]} size="medium" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Large</h3>
        <TransferList items={generateItems(5)} defaultSelectedIds={[2]} size="large" />
      </div>
    </div>
  ),
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    items: generateItems(10),
    defaultSelectedIds: [2, 4, 6],
    disabled: true,
  },
};

/**
 * Custom titles
 */
export const CustomTitles: Story = {
  args: {
    items: generateItems(10),
    defaultSelectedIds: [2, 4],
    sourceTitle: 'Available Permissions',
    destinationTitle: 'Assigned Permissions',
    searchable: true,
  },
};

/**
 * Many items
 */
export const ManyItems: Story = {
  args: {
    items: generateItems(50),
    defaultSelectedIds: [5, 10, 15, 20, 25],
    searchable: true,
  },
};

/**
 * Items with descriptions
 */
export const WithDescriptions: Story = {
  args: {
    items: [
      { id: 1, label: 'Admin', description: 'Full system access with all permissions' },
      { id: 2, label: 'Editor', description: 'Can create and edit content' },
      { id: 3, label: 'Viewer', description: 'Read-only access to content' },
      { id: 4, label: 'Moderator', description: 'Can moderate user content' },
      { id: 5, label: 'Guest', description: 'Limited access to public content' },
    ],
    defaultSelectedIds: [2, 3],
    searchable: true,
  },
};

/**
 * Items with disabled state
 */
export const WithDisabledItems: Story = {
  args: {
    items: [
      { id: 1, label: 'Item 1', description: 'Available' },
      { id: 2, label: 'Item 2', description: 'Available' },
      { id: 3, label: 'Item 3', description: 'Disabled', disabled: true },
      { id: 4, label: 'Item 4', description: 'Available' },
      { id: 5, label: 'Item 5', description: 'Disabled', disabled: true },
    ],
    defaultSelectedIds: [1],
    searchable: true,
  },
};

/**
 * Interactive example
 */
export const Interactive: Story = {
  render: () => {
    const [selectedIds, setSelectedIds] = useState<(string | number)[]>([2, 4]);
    return (
      <div className="space-y-4">
        <TransferList
          items={generateItems(10)}
          selectedIds={selectedIds}
          onChange={setSelectedIds}
          searchable={true}
        />
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700">
            Selected IDs: {selectedIds.join(', ')}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Permission management example
 */
export const PermissionManagement: Story = {
  render: () => {
    const [selectedPermissions, setSelectedPermissions] = useState<(string | number)[]>([2, 4]);
    const permissions = [
      { id: 1, label: 'Read Users', description: 'View user information', icon: <UserIcon /> },
      { id: 2, label: 'Write Users', description: 'Create and edit users', icon: <UserIcon /> },
      { id: 3, label: 'Delete Users', description: 'Remove users from system', icon: <UserIcon /> },
      { id: 4, label: 'Read Files', description: 'View files and folders', icon: <FolderIcon /> },
      { id: 5, label: 'Write Files', description: 'Upload and edit files', icon: <FolderIcon /> },
      { id: 6, label: 'Delete Files', description: 'Remove files and folders', icon: <FolderIcon /> },
      { id: 7, label: 'Manage Settings', description: 'Change system settings', icon: <StarIcon /> },
    ];

    return (
      <div className="space-y-4">
        <TransferList
          items={permissions}
          selectedIds={selectedPermissions}
          onChange={setSelectedPermissions}
          sourceTitle="Available Permissions"
          destinationTitle="Assigned Permissions"
          searchable={true}
        />
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Assigned Permissions: {selectedPermissions.length}
          </p>
          <p className="text-xs text-blue-700">
            Selected permission IDs: {selectedPermissions.join(', ')}
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Empty states
 */
export const EmptyStates: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">No items selected</h3>
        <TransferList items={generateItems(5)} defaultSelectedIds={[]} searchable={true} />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">All items selected</h3>
        <TransferList
          items={generateItems(5)}
          defaultSelectedIds={[1, 2, 3, 4, 5]}
          searchable={true}
        />
      </div>
    </div>
  ),
};

/**
 * Custom search placeholders
 */
export const CustomSearchPlaceholders: Story = {
  args: {
    items: generateItems(10),
    defaultSelectedIds: [2, 4],
    searchable: true,
    sourceSearchPlaceholder: 'Search available permissions...',
    destinationSearchPlaceholder: 'Search assigned permissions...',
  },
};

/**
 * Dark theme - Transfer list
 */
export const DarkTheme: Story = {
  render: () => {
    const items = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      label: `Item ${i + 1}`,
      description: `Description for item ${i + 1}`,
    }));
    return (
      <ThemeWrapper theme="dark">
        <TransferList
          items={items}
          defaultSelectedIds={[2, 4, 6]}
          searchable={true}
          sourceTitle="Available Items"
          destinationTitle="Selected Items"
        />
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

