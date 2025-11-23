import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Checkbox } from './Checkbox';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile checkbox component with various sizes, shapes, colors, and states. Supports labels, helper text, error states, and indeterminate state.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Label text',
    },
    helperText: {
      control: 'text',
      description: 'Helper text displayed below checkbox',
    },
    error: {
      control: 'text',
      description: 'Error message',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the checkbox',
    },
    shape: {
      control: 'select',
      options: ['square', 'rounded', 'circle'],
      description: 'Shape variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'primary', 'success', 'warning', 'danger'],
      description: 'Color variant',
    },
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state (partially checked)',
    },
    labelPosition: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Label position',
    },
  },
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default checkbox - basic usage
 */
export const Default: Story = {
  args: {
    label: 'Accept terms and conditions',
  },
};

/**
 * Checked checkbox
 */
export const Checked: Story = {
  args: {
    label: 'I agree to the terms',
    checked: true,
  },
};

/**
 * Unchecked checkbox
 */
export const Unchecked: Story = {
  args: {
    label: 'Subscribe to newsletter',
    checked: false,
  },
};

/**
 * Disabled states
 */
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="Disabled unchecked" disabled />
      <Checkbox label="Disabled checked" checked disabled />
      <Checkbox label="Disabled indeterminate" indeterminate disabled />
    </div>
  ),
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
      <Checkbox label="Small checkbox" size="small" checked />
      <Checkbox label="Medium checkbox" size="medium" checked />
      <Checkbox label="Large checkbox" size="large" checked />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different shapes
 */
export const Shapes: Story = {
  render: () => (
    <div className="space-y-6">
      <Checkbox label="Square checkbox" shape="square" checked />
      <Checkbox label="Rounded checkbox" shape="rounded" checked />
      <Checkbox label="Circle checkbox" shape="circle" checked />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * All shape and size combinations
 */
export const ShapeAndSizeCombinations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Square</h3>
        <div className="space-y-4">
          <Checkbox label="Small square" shape="square" size="small" checked />
          <Checkbox label="Medium square" shape="square" size="medium" checked />
          <Checkbox label="Large square" shape="square" size="large" checked />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Rounded</h3>
        <div className="space-y-4">
          <Checkbox label="Small rounded" shape="rounded" size="small" checked />
          <Checkbox label="Medium rounded" shape="rounded" size="medium" checked />
          <Checkbox label="Large rounded" shape="rounded" size="large" checked />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Circle</h3>
        <div className="space-y-4">
          <Checkbox label="Small circle" shape="circle" size="small" checked />
          <Checkbox label="Medium circle" shape="circle" size="medium" checked />
          <Checkbox label="Large circle" shape="circle" size="large" checked />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Different color variants
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-6">
      <Checkbox label="Default variant" variant="default" checked />
      <Checkbox label="Primary variant" variant="primary" checked />
      <Checkbox label="Success variant" variant="success" checked />
      <Checkbox label="Warning variant" variant="warning" checked />
      <Checkbox label="Danger variant" variant="danger" checked />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Indeterminate state (partially checked)
 */
export const Indeterminate: Story = {
  render: () => (
    <div className="space-y-6">
      <Checkbox label="Indeterminate checkbox" indeterminate />
      <Checkbox label="Indeterminate primary" variant="primary" indeterminate />
      <Checkbox label="Indeterminate success" variant="success" indeterminate />
      <Checkbox label="Indeterminate warning" variant="warning" indeterminate />
      <Checkbox label="Indeterminate danger" variant="danger" indeterminate />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * With helper text
 */
export const WithHelperText: Story = {
  args: {
    label: 'Enable notifications',
    helperText: 'You will receive email notifications for important updates',
    checked: true,
  },
};

/**
 * With error state
 */
export const WithError: Story = {
  args: {
    label: 'Accept terms and conditions',
    error: 'You must accept the terms to continue',
    checked: false,
  },
};

/**
 * Label positions
 */
export const LabelPositions: Story = {
  render: () => (
    <div className="space-y-6">
      <Checkbox label="Label on the right" labelPosition="right" checked />
      <Checkbox label="Label on the left" labelPosition="left" checked />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Without label
 */
export const WithoutLabel: Story = {
  args: {
    checked: true,
  },
};

/**
 * Interactive checkbox
 */
export const Interactive: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        label="Click me to toggle"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    );
  },
};

/**
 * Checkbox group example
 */
export const CheckboxGroup: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>(['option1']);

    const handleChange = (value: string) => {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    };

    return (
      <div className="space-y-3">
        <Checkbox
          label="Option 1"
          checked={selected.includes('option1')}
          onChange={() => handleChange('option1')}
        />
        <Checkbox
          label="Option 2"
          checked={selected.includes('option2')}
          onChange={() => handleChange('option2')}
        />
        <Checkbox
          label="Option 3"
          checked={selected.includes('option3')}
          onChange={() => handleChange('option3')}
        />
        <Checkbox
          label="Option 4"
          checked={selected.includes('option4')}
          onChange={() => handleChange('option4')}
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Select all checkbox pattern
 */
export const SelectAllPattern: Story = {
  render: () => {
    const [selectAll, setSelectAll] = useState(false);
    const [items, setItems] = useState([
      { id: '1', label: 'Item 1', checked: false },
      { id: '2', label: 'Item 2', checked: false },
      { id: '3', label: 'Item 3', checked: false },
    ]);

    const handleSelectAll = (checked: boolean) => {
      setSelectAll(checked);
      setItems(items.map((item) => ({ ...item, checked })));
    };

    const handleItemChange = (id: string, checked: boolean) => {
      setItems(items.map((item) => (item.id === id ? { ...item, checked } : item)));
      const allChecked = items.every((item) => item.id === id || item.checked);
      const noneChecked = !checked && items.every((item) => item.id === id || !item.checked);
      setSelectAll(allChecked && checked);
    };

    const checkedCount = items.filter((item) => item.checked).length;
    const isIndeterminate = checkedCount > 0 && checkedCount < items.length;

    return (
      <div className="space-y-4">
        <Checkbox
          label="Select All"
          checked={selectAll}
          indeterminate={isIndeterminate}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
        <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-4">
          {items.map((item) => (
            <Checkbox
              key={item.id}
              label={item.label}
              checked={item.checked}
              onChange={(e) => handleItemChange(item.id, e.target.checked)}
            />
          ))}
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Form example
 */
export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      terms: false,
      newsletter: false,
      marketing: false,
    });

    return (
      <form className="space-y-6 w-96" onSubmit={(e) => e.preventDefault()}>
        <Checkbox
          label="I agree to the terms and conditions"
          checked={formData.terms}
          onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
          helperText="Please read our terms and conditions"
        />
        <Checkbox
          label="Subscribe to newsletter"
          checked={formData.newsletter}
          onChange={(e) => setFormData({ ...formData, newsletter: e.target.checked })}
          helperText="Receive weekly updates"
        />
        <Checkbox
          label="Allow marketing emails"
          checked={formData.marketing}
          onChange={(e) => setFormData({ ...formData, marketing: e.target.checked })}
          helperText="We'll send you promotional content"
        />
      </form>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * All variants showcase
 */
export const AllVariantsShowcase: Story = {
  render: () => (
    <div className="space-y-8 w-96">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Sizes</h3>
        <div className="space-y-3">
          <Checkbox label="Small" size="small" checked />
          <Checkbox label="Medium" size="medium" checked />
          <Checkbox label="Large" size="large" checked />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Shapes</h3>
        <div className="space-y-3">
          <Checkbox label="Square" shape="square" checked />
          <Checkbox label="Rounded" shape="rounded" checked />
          <Checkbox label="Circle" shape="circle" checked />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">Variants</h3>
        <div className="space-y-3">
          <Checkbox label="Default" variant="default" checked />
          <Checkbox label="Primary" variant="primary" checked />
          <Checkbox label="Success" variant="success" checked />
          <Checkbox label="Warning" variant="warning" checked />
          <Checkbox label="Danger" variant="danger" checked />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700">States</h3>
        <div className="space-y-3">
          <Checkbox label="Unchecked" checked={false} />
          <Checkbox label="Checked" checked />
          <Checkbox label="Indeterminate" indeterminate />
          <Checkbox label="Disabled unchecked" disabled />
          <Checkbox label="Disabled checked" checked disabled />
        </div>
      </div>
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom styling example
 */
export const CustomStyling: Story = {
  render: () => (
    <div className="space-y-6">
      <Checkbox
        label="Custom styled checkbox"
        checked
        variant="primary"
        shape="rounded"
        size="large"
        containerClassName="p-4 border rounded-lg bg-blue-50"
      />
      <Checkbox
        label="Another custom style"
        checked
        variant="success"
        shape="circle"
        containerClassName="p-4 border rounded-lg bg-green-50"
      />
    </div>
  ),
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dark theme - Checkbox variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="space-y-6 max-w-md">
        <Checkbox label="Default checkbox" checked />
        <Checkbox label="Primary checkbox" variant="primary" checked />
        <Checkbox label="Success checkbox" variant="success" checked />
        <Checkbox label="Warning checkbox" variant="warning" checked />
        <Checkbox label="Danger checkbox" variant="danger" checked />
        <Checkbox label="Square checkbox" shape="square" checked />
        <Checkbox label="Rounded checkbox" shape="rounded" checked />
        <Checkbox label="Circle checkbox" shape="circle" checked />
        <Checkbox label="Indeterminate checkbox" indeterminate />
        <Checkbox label="Disabled checkbox" disabled checked />
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

