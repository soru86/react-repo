import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ButtonGroup, SplitButton } from './ButtonGroup';
import { ThemeWrapper } from '../../utils/ThemeWrapper';
import {
  PlusIcon,
  DownloadIcon,
  HeartIcon,
  ShoppingCartIcon,
  SettingsIcon,
  UserIcon,
  MailIcon,
  LockIcon,
} from '../Button/icons';
import { XCircleIcon } from '../TextInput/icons';

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button group component for grouping related buttons. Supports horizontal and vertical layouts, icon-only buttons, and split button functionality.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Orientation of the button group',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of buttons',
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info'],
      description: 'Variant of buttons',
    },
    outlined: {
      control: 'boolean',
      description: 'Whether buttons are outlined',
    },
    multiple: {
      control: 'boolean',
      description: 'Whether to allow multiple selections',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether buttons should take full width',
    },
    iconOnly: {
      control: 'boolean',
      description: 'Whether to show icons only',
    },
    showIcons: {
      control: 'boolean',
      description: 'Whether to show icons with labels',
    },
    onSelect: {
      action: 'selected',
      description: 'Callback when button is selected',
    },
  },
  args: {
    onSelect: fn(),
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const basicButtons = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const iconButtons = [
  { label: 'Add', value: 'add', icon: <PlusIcon /> },
  { label: 'Download', value: 'download', icon: <DownloadIcon /> },
  { label: 'Like', value: 'like', icon: <HeartIcon /> },
];

const actionButtons = [
  { label: 'Save', value: 'save' },
  { label: 'Edit', value: 'edit' },
  { label: 'Delete', value: 'delete' },
];

/**
 * Horizontal button group - default orientation
 */
export const HorizontalGroup: Story = {
  args: {
    buttons: basicButtons,
    orientation: 'horizontal',
    variant: 'primary',
  },
};

/**
 * Horizontal group with different variants
 */
export const HorizontalVariants: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Primary</h3>
        <ButtonGroup buttons={basicButtons} variant="primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Secondary</h3>
        <ButtonGroup buttons={basicButtons} variant="secondary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Success</h3>
        <ButtonGroup buttons={basicButtons} variant="success" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Danger</h3>
        <ButtonGroup buttons={basicButtons} variant="danger" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Vertical button group
 */
export const VerticalGroup: Story = {
  args: {
    buttons: basicButtons,
    orientation: 'vertical',
    variant: 'primary',
  },
};

/**
 * Vertical group examples
 */
export const VerticalGroups: Story = {
  render: () => (
    <div className="flex gap-8">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Primary</h3>
        <ButtonGroup buttons={basicButtons} orientation="vertical" variant="primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Outlined</h3>
        <ButtonGroup buttons={basicButtons} orientation="vertical" variant="primary" outlined />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Secondary</h3>
        <ButtonGroup buttons={basicButtons} orientation="vertical" variant="secondary" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Split button - button with dropdown
 */
export const SplitButtonExample: Story = {
  render: () => (
    <SplitButton
      label="Actions"
      icon={<SettingsIcon />}
      options={[
        { label: 'Edit', value: 'edit', icon: <SettingsIcon /> },
        { label: 'Duplicate', value: 'duplicate', icon: <PlusIcon /> },
        { label: 'Delete', value: 'delete', icon: <XCircleIcon /> },
      ]}
      onClick={() => console.log('Main button clicked')}
      onSelect={(value) => console.log('Selected:', value)}
    />
  ),
};

/**
 * Multiple split buttons
 */
export const SplitButtons: Story = {
  render: () => (
    <div className="space-y-4">
      <SplitButton
        label="Save"
        icon={<DownloadIcon />}
        options={[
          { label: 'Save as Draft', value: 'draft' },
          { label: 'Save and Publish', value: 'publish' },
          { label: 'Save Template', value: 'template' },
        ]}
        variant="primary"
      />
      <SplitButton
        label="Export"
        icon={<DownloadIcon />}
        options={[
          { label: 'Export as PDF', value: 'pdf' },
          { label: 'Export as CSV', value: 'csv' },
          { label: 'Export as Excel', value: 'excel' },
        ]}
        variant="secondary"
      />
      <SplitButton
        label="More"
        options={[
          { label: 'Settings', value: 'settings', icon: <SettingsIcon /> },
          { label: 'Help', value: 'help' },
          { label: 'About', value: 'about' },
        ]}
        variant="info"
        outlined
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Split button with different sizes
 */
export const SplitButtonSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <SplitButton label="Small" options={actionButtons} size="small" />
      <SplitButton label="Medium" options={actionButtons} size="medium" />
      <SplitButton label="Large" options={actionButtons} size="large" />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Icon only button group
 */
export const IconOnlyGroup: Story = {
  args: {
    buttons: iconButtons,
    iconOnly: true,
    variant: 'primary',
  },
};

/**
 * Icon only groups with different variants
 */
export const IconOnlyGroups: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Primary</h3>
        <ButtonGroup buttons={iconButtons} iconOnly variant="primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Outlined</h3>
        <ButtonGroup buttons={iconButtons} iconOnly variant="primary" outlined />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Secondary</h3>
        <ButtonGroup buttons={iconButtons} iconOnly variant="secondary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Vertical</h3>
        <ButtonGroup buttons={iconButtons} iconOnly variant="primary" orientation="vertical" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Icon + label button group
 */
export const IconLabelGroup: Story = {
  args: {
    buttons: iconButtons,
    showIcons: true,
    variant: 'primary',
  },
};

/**
 * Icon + label groups
 */
export const IconLabelGroups: Story = {
  render: () => (
    <div className="space-y-6 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Horizontal</h3>
        <ButtonGroup
          buttons={[
            { label: 'Add Item', value: 'add', icon: <PlusIcon /> },
            { label: 'Download', value: 'download', icon: <DownloadIcon /> },
            { label: 'Settings', value: 'settings', icon: <SettingsIcon /> },
          ]}
          showIcons
          variant="primary"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Vertical</h3>
        <ButtonGroup
          buttons={[
            { label: 'Add Item', value: 'add', icon: <PlusIcon /> },
            { label: 'Download', value: 'download', icon: <DownloadIcon /> },
            { label: 'Settings', value: 'settings', icon: <SettingsIcon /> },
          ]}
          showIcons
          variant="primary"
          orientation="vertical"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Outlined</h3>
        <ButtonGroup
          buttons={[
            { label: 'Add Item', value: 'add', icon: <PlusIcon /> },
            { label: 'Download', value: 'download', icon: <DownloadIcon /> },
            { label: 'Settings', value: 'settings', icon: <SettingsIcon /> },
          ]}
          showIcons
          variant="primary"
          outlined
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Button group with selection
 */
export const WithSelection: Story = {
  args: {
    buttons: basicButtons,
    selected: 'center',
    variant: 'primary',
  },
};

/**
 * Multiple selection button group
 */
export const MultipleSelection: Story = {
  args: {
    buttons: [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
      { label: 'Option 4', value: 'opt4' },
    ],
    multiple: true,
    selected: ['opt1', 'opt3'],
    variant: 'primary',
  },
};

/**
 * Full width button group
 */
export const FullWidth: Story = {
  args: {
    buttons: basicButtons,
    fullWidth: true,
    variant: 'primary',
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Small</h3>
        <ButtonGroup buttons={basicButtons} size="small" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Medium</h3>
        <ButtonGroup buttons={basicButtons} size="medium" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Large</h3>
        <ButtonGroup buttons={basicButtons} size="large" />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Outlined button groups
 */
export const OutlinedGroups: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Horizontal</h3>
        <ButtonGroup buttons={basicButtons} outlined variant="primary" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Vertical</h3>
        <ButtonGroup buttons={basicButtons} outlined variant="primary" orientation="vertical" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-2 text-gray-700">With Icons</h3>
        <ButtonGroup buttons={iconButtons} outlined variant="primary" showIcons />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Complex example with all variants
 */
export const ComplexExample: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Horizontal Group</h3>
        <ButtonGroup
          buttons={[
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ]}
          variant="primary"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Vertical Group</h3>
        <ButtonGroup
          buttons={[
            { label: 'Top', value: 'top' },
            { label: 'Middle', value: 'middle' },
            { label: 'Bottom', value: 'bottom' },
          ]}
          orientation="vertical"
          variant="secondary"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Split Button</h3>
        <SplitButton
          label="Actions"
          icon={<SettingsIcon />}
          options={[
            { label: 'Edit', value: 'edit' },
            { label: 'Delete', value: 'delete' },
            { label: 'Share', value: 'share' },
          ]}
          variant="success"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Icon Only</h3>
        <ButtonGroup
          buttons={[
            { label: 'Add', value: 'add', icon: <PlusIcon /> },
            { label: 'Download', value: 'download', icon: <DownloadIcon /> },
            { label: 'Like', value: 'like', icon: <HeartIcon /> },
          ]}
          iconOnly
          variant="info"
        />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Icon + Label</h3>
        <ButtonGroup
          buttons={[
            { label: 'Add Item', value: 'add', icon: <PlusIcon /> },
            { label: 'Download', value: 'download', icon: <DownloadIcon /> },
            { label: 'Settings', value: 'settings', icon: <SettingsIcon /> },
          ]}
          showIcons
          variant="warning"
        />
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Interactive example with controls
 */
export const Interactive: Story = {
  args: {
    buttons: basicButtons,
    variant: 'primary',
    orientation: 'horizontal',
  },
};

/**
 * Dark theme - Button group variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="space-y-6 w-96">
        <ButtonGroup buttons={basicButtons} variant="primary" />
        <ButtonGroup buttons={basicButtons} variant="success" orientation="vertical" />
        <SplitButton
          label="Actions"
          variant="primary"
          options={[
            { label: 'Edit', onClick: () => {} },
            { label: 'Delete', onClick: () => {} },
          ]}
        />
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

