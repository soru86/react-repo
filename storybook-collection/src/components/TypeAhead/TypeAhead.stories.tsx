import React, { useState, useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { TypeAhead } from './TypeAhead';
import { SearchIcon } from './icons';
import { ThemeWrapper } from '../../utils/ThemeWrapper';
import type { TypeAheadOption } from './TypeAhead';

const meta = {
  title: 'Components/TypeAhead',
  component: TypeAhead,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A powerful autocomplete/typeahead component with debouncing, keyboard navigation, and multiple selection support. Requires minimum 3 characters before showing results.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'outlined', 'filled', 'minimal'],
      description: 'Visual style variant',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size of the input',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple selections',
    },
    minChars: {
      control: 'number',
      description: 'Minimum characters before showing results',
    },
    debounceMs: {
      control: 'number',
      description: 'Debounce delay in milliseconds',
    },
    highlightMatch: {
      control: 'boolean',
      description: 'Highlight matching text in results',
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
  },
  args: {
    onChange: fn(),
    onInputChange: fn(),
  },
} satisfies Meta<typeof TypeAhead>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data
const countries: TypeAheadOption[] = [
  { id: 'us', label: 'United States', description: 'North America' },
  { id: 'uk', label: 'United Kingdom', description: 'Europe' },
  { id: 'ca', label: 'Canada', description: 'North America' },
  { id: 'au', label: 'Australia', description: 'Oceania' },
  { id: 'de', label: 'Germany', description: 'Europe' },
  { id: 'fr', label: 'France', description: 'Europe' },
  { id: 'it', label: 'Italy', description: 'Europe' },
  { id: 'es', label: 'Spain', description: 'Europe' },
  { id: 'jp', label: 'Japan', description: 'Asia' },
  { id: 'cn', label: 'China', description: 'Asia' },
  { id: 'in', label: 'India', description: 'Asia' },
  { id: 'br', label: 'Brazil', description: 'South America' },
  { id: 'mx', label: 'Mexico', description: 'North America' },
  { id: 'ru', label: 'Russia', description: 'Europe/Asia' },
  { id: 'kr', label: 'South Korea', description: 'Asia' },
];

const programmingLanguages: TypeAheadOption[] = [
  { id: 'js', label: 'JavaScript', description: 'Web development', group: 'Web' },
  { id: 'ts', label: 'TypeScript', description: 'Web development', group: 'Web' },
  { id: 'py', label: 'Python', description: 'Data science, AI', group: 'General' },
  { id: 'java', label: 'Java', description: 'Enterprise applications', group: 'General' },
  { id: 'cpp', label: 'C++', description: 'System programming', group: 'Systems' },
  { id: 'c', label: 'C', description: 'System programming', group: 'Systems' },
  { id: 'rust', label: 'Rust', description: 'System programming', group: 'Systems' },
  { id: 'go', label: 'Go', description: 'Backend services', group: 'General' },
  { id: 'swift', label: 'Swift', description: 'iOS development', group: 'Mobile' },
  { id: 'kotlin', label: 'Kotlin', description: 'Android development', group: 'Mobile' },
  { id: 'php', label: 'PHP', description: 'Web development', group: 'Web' },
  { id: 'ruby', label: 'Ruby', description: 'Web development', group: 'Web' },
  { id: 'scala', label: 'Scala', description: 'Big data', group: 'General' },
  { id: 'r', label: 'R', description: 'Data analysis', group: 'Data' },
  { id: 'matlab', label: 'MATLAB', description: 'Scientific computing', group: 'Data' },
];

const fruits: TypeAheadOption[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'orange', label: 'Orange' },
  { id: 'grape', label: 'Grape' },
  { id: 'strawberry', label: 'Strawberry' },
  { id: 'blueberry', label: 'Blueberry' },
  { id: 'mango', label: 'Mango' },
  { id: 'pineapple', label: 'Pineapple' },
  { id: 'watermelon', label: 'Watermelon' },
  { id: 'kiwi', label: 'Kiwi' },
];

// Generate 1000 items for performance testing
const generateLargeDataset = (): TypeAheadOption[] => {
  const items: TypeAheadOption[] = [];
  const prefixes = ['Item', 'Product', 'Service', 'Feature', 'Component', 'Module', 'Element', 'Asset', 'Resource', 'Entity'];
  const suffixes = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
  const categories = ['Category A', 'Category B', 'Category C', 'Category D', 'Category E'];
  
  for (let i = 1; i <= 1000; i++) {
    const prefix = prefixes[i % prefixes.length];
    const suffix = suffixes[Math.floor(i / suffixes.length) % suffixes.length];
    const category = categories[i % categories.length];
    
    items.push({
      id: `item-${i}`,
      label: `${prefix} ${i} ${suffix}`,
      description: `Description for ${prefix} ${i} ${suffix}`,
      group: category,
    });
  }
  
  return items;
};

const largeDataset = generateLargeDataset();

/**
 * Default typeahead with basic functionality
 */
export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={(val) => {
            setValue(val as string | number | null);
            args.onChange?.(val);
          }}
          placeholder="Search from 1000 items..."
          label="Select an Item"
          helperText={`Searching through ${largeDataset.length} items`}
        />
        {value && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Selected: <strong>{value}</strong>
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Multiple selection mode
 */
export const MultipleSelection: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[] | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={(val) => {
            setValue(val as (string | number)[] | null);
            args.onChange?.(val);
          }}
          multiple
          placeholder="Select multiple items..."
          label="Select Items"
          helperText={`Select from ${largeDataset.length} items`}
        />
        {value && value.length > 0 && (
          <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              Selected {value.length} items:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 max-h-32 overflow-y-auto">
              {value.map((id) => {
                const option = largeDataset.find((c) => c.id === id);
                return <li key={id}>{option?.label}</li>;
              })}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

/**
 * All size variants
 */
export const Sizes: Story = {
  render: () => {
    const [value1, setValue1] = useState<string | number | null>(null);
    const [value2, setValue2] = useState<string | number | null>(null);
    const [value3, setValue3] = useState<string | number | null>(null);
    return (
      <div className="space-y-6 w-96">
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Small</h3>
          <TypeAhead
            options={largeDataset}
            value={value1}
            onChange={setValue1}
            size="small"
            placeholder="Small size..."
            label="Small"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Medium</h3>
          <TypeAhead
            options={largeDataset}
            value={value2}
            onChange={setValue2}
            size="medium"
            placeholder="Medium size..."
            label="Medium"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Large</h3>
          <TypeAhead
            options={largeDataset}
            value={value3}
            onChange={setValue3}
            size="large"
            placeholder="Large size..."
            label="Large"
          />
        </div>
      </div>
    );
  },
};

/**
 * All style variants
 */
export const Variants: Story = {
  render: () => {
    const [value1, setValue1] = useState<string | number | null>(null);
    const [value2, setValue2] = useState<string | number | null>(null);
    const [value3, setValue3] = useState<string | number | null>(null);
    const [value4, setValue4] = useState<string | number | null>(null);
    return (
      <div className="space-y-6 w-96">
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Default</h3>
          <TypeAhead
            options={largeDataset}
            value={value1}
            onChange={setValue1}
            variant="default"
            placeholder="Default variant..."
            label="Default"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Outlined</h3>
          <TypeAhead
            options={largeDataset}
            value={value2}
            onChange={setValue2}
            variant="outlined"
            placeholder="Outlined variant..."
            label="Outlined"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Filled</h3>
          <TypeAhead
            options={largeDataset}
            value={value3}
            onChange={setValue3}
            variant="filled"
            placeholder="Filled variant..."
            label="Filled"
          />
        </div>
        <div>
          <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Minimal</h3>
          <TypeAhead
            options={largeDataset}
            value={value4}
            onChange={setValue4}
            variant="minimal"
            placeholder="Minimal variant..."
            label="Minimal"
          />
        </div>
      </div>
    );
  },
};

/**
 * With left icon
 */
export const WithIcon: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          leftIcon={<SearchIcon size={20} />}
          placeholder="Search from 1000 items..."
          label="Search Items"
        />
      </div>
    );
  },
};

/**
 * With loading state
 */
export const LoadingState: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          isLoading={isLoading}
          loadingText="Searching items..."
          placeholder="Search from 1000 items..."
          label="Search Items"
          onInputChange={() => {
            setIsLoading(true);
            setTimeout(() => setIsLoading(false), 1000);
          }}
        />
      </div>
    );
  },
};

/**
 * With error state
 */
export const ErrorState: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          error="Please select a valid item"
          placeholder="Search from 1000 items..."
          label="Select Item"
          required
        />
      </div>
    );
  },
};

/**
 * With success state
 */
export const SuccessState: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          success="Item selected successfully"
          placeholder="Search from 1000 items..."
          label="Select Item"
        />
      </div>
    );
  },
};

/**
 * With warning state
 */
export const WarningState: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          warning="This item may require additional verification"
          placeholder="Search from 1000 items..."
          label="Select Item"
        />
      </div>
    );
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: (args) => {
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value="item-1"
          disabled
          placeholder="Search from 1000 items..."
          label="Select Item"
          helperText="This field is disabled"
        />
      </div>
    );
  },
};

/**
 * Custom minimum characters (2 instead of 3)
 */
export const CustomMinChars: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          minChars={2}
          placeholder="Type at least 2 characters..."
          label="Search Items"
          helperText="Results appear after 2 characters"
        />
      </div>
    );
  },
};

/**
 * Custom debounce delay
 */
export const CustomDebounce: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          debounceMs={500}
          placeholder="Type to search (500ms debounce)..."
          label="Search Items"
          helperText="Debounce delay: 500ms"
        />
      </div>
    );
  },
};

/**
 * Maximum results limit
 */
export const MaxResults: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          maxResults={5}
          placeholder="Search from 1000 items..."
          label="Search Items"
          helperText="Showing maximum 5 results"
        />
      </div>
    );
  },
};

/**
 * Grouped options
 */
export const GroupedOptions: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          groupBy="group"
          placeholder="Search from 1000 items..."
          label="Select Item"
          helperText={`Items grouped by category (${largeDataset.length} items)`}
        />
      </div>
    );
  },
};

/**
 * Without highlight matching
 */
export const NoHighlight: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          highlightMatch={false}
          placeholder="Search from 1000 items..."
          label="Search Items"
          helperText="Text highlighting disabled"
        />
      </div>
    );
  },
};

/**
 * Clear on select
 */
export const ClearOnSelect: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          clearOnSelect
          placeholder="Search from 1000 items..."
          label="Search Items"
          helperText="Input clears after selection"
        />
      </div>
    );
  },
};

/**
 * Custom filter function
 */
export const CustomFilter: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    
    // Custom filter that only matches the beginning of the label
    const customFilter = (options: TypeAheadOption[], searchTerm: string) => {
      const term = searchTerm.toLowerCase();
      return options.filter((option) => {
        const label = String(option.label || '').toLowerCase();
        return label.startsWith(term);
      });
    };

    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          filterFunction={customFilter}
          placeholder="Search from 1000 items (starts with)..."
          label="Search Items"
          helperText={`Custom filter: only matches beginning of label (${largeDataset.length} items)`}
        />
      </div>
    );
  },
};

/**
 * Custom render option
 */
export const CustomRenderOption: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    
    const renderOption = (option: TypeAheadOption, searchTerm: string) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
          {option.label.charAt(0)}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {option.label}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {option.description}
          </div>
        </div>
      </div>
    );

    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          renderOption={renderOption}
          placeholder="Search from 1000 items..."
          label="Search Items"
          helperText={`Custom option rendering with avatar (${largeDataset.length} items)`}
        />
      </div>
    );
  },
};

/**
 * Full width
 */
export const FullWidth: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-full max-w-2xl">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          fullWidth
          placeholder="Search from 1000 items..."
          label="Search Items"
        />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Keyboard navigation demonstration
 */
export const KeyboardNavigation: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          placeholder="Use arrow keys to navigate..."
          label="Search Items"
          helperText="Use ↑↓ to navigate, Enter to select, Esc to close"
        />
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
          <p className="font-semibold mb-1">Keyboard Shortcuts:</p>
          <ul className="list-disc list-inside space-y-1">
            <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">↑</kbd> / <kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">↓</kbd> - Navigate options</li>
            <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">Enter</kbd> - Select highlighted option</li>
            <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">Esc</kbd> - Close dropdown</li>
            <li><kbd className="px-1 py-0.5 bg-white dark:bg-gray-800 rounded">Backspace</kbd> - Remove last selection (multiple mode)</li>
          </ul>
        </div>
      </div>
    );
  },
};

/**
 * Dark theme example
 */
export const DarkTheme: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <ThemeWrapper theme="dark">
        <Story />
      </ThemeWrapper>
    ),
  ],
  parameters: {
    backgrounds: {
      disable: true,
    },
  },
  render: (args) => {
    const [value, setValue] = useState<string | number | null>(null);
    return (
      <div className="w-96">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={setValue}
          placeholder="Search from 1000 items..."
          label="Select Item"
          helperText="TypeAhead in dark theme"
        />
      </div>
    );
  },
};

/**
 * Complex example with all features
 */
export const ComplexExample: Story = {
  render: (args) => {
    const [value, setValue] = useState<(string | number)[] | null>(null);
    const [searchCount, setSearchCount] = useState(0);
    
    const handleInputChange = (val: string) => {
      setSearchCount((prev) => prev + 1);
      args.onInputChange?.(val);
    };

    return (
      <div className="w-96 space-y-4">
        <TypeAhead
          {...args}
          options={largeDataset}
          value={value}
          onChange={(val) => {
            setValue(val as (string | number)[] | null);
            args.onChange?.(val);
          }}
          onInputChange={handleInputChange}
          multiple
          groupBy="group"
          leftIcon={<SearchIcon size={20} />}
          placeholder="Search from 1000 items..."
          label="Select Items"
          helperText={`Select multiple items from ${largeDataset.length} options`}
          variant="outlined"
          size="medium"
          highlightMatch
          maxResults={10}
        />
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Selected:</strong>{' '}
            {value && value.length > 0
              ? value
                  .map((id) => largeDataset.find((l) => l.id === id)?.label)
                  .join(', ')
              : 'None'}
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Search count: {searchCount}
          </p>
        </div>
      </div>
    );
  },
};

