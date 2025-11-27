import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { AdvancedSearchFilter, FilterField, FilterRule } from './AdvancedSearchFilter';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/AdvancedSearchFilter',
  component: AdvancedSearchFilter,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An advanced search and filter component with configurable fields, field types, and condition operators. Supports multiple filters with AND/OR logic, dynamic field selection, and various input types.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    showLogicSelector: {
      control: 'boolean',
      description: 'Whether to show AND/OR logic selector',
    },
    collapsible: {
      control: 'boolean',
      description: 'Whether the filter panel is collapsible',
    },
    maxFilters: {
      control: 'number',
      description: 'Maximum number of filters allowed',
    },
  },
  args: {
    onApply: fn(),
    onReset: fn(),
  },
} satisfies Meta<typeof AdvancedSearchFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample field configurations
const basicFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name' },
  { id: 'email', label: 'Email', type: 'text', placeholder: 'Enter email' },
  { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'pending', label: 'Pending' },
    ],
  },
];

const comprehensiveFields: FilterField[] = [
  { id: 'name', label: 'Name', type: 'text', placeholder: 'Enter name' },
  { id: 'email', label: 'Email', type: 'text', placeholder: 'Enter email' },
  { id: 'age', label: 'Age', type: 'number', placeholder: 'Enter age' },
  { id: 'salary', label: 'Salary', type: 'number', placeholder: 'Enter salary' },
  { id: 'birthDate', label: 'Birth Date', type: 'date' },
  { id: 'createdAt', label: 'Created At', type: 'datetime' },
  {
    id: 'department',
    label: 'Department',
    type: 'select',
    options: [
      { value: 'engineering', label: 'Engineering' },
      { value: 'sales', label: 'Sales' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'hr', label: 'HR' },
      { value: 'finance', label: 'Finance' },
    ],
  },
  {
    id: 'skills',
    label: 'Skills',
    type: 'multiselect',
    options: [
      { value: 'javascript', label: 'JavaScript' },
      { value: 'react', label: 'React' },
      { value: 'node', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'java', label: 'Java' },
    ],
  },
  { id: 'isActive', label: 'Active', type: 'boolean' },
  { id: 'score', label: 'Score Range', type: 'range' },
];

const ecommerceFields: FilterField[] = [
  { id: 'productName', label: 'Product Name', type: 'text', placeholder: 'Search products' },
  { id: 'price', label: 'Price', type: 'number', placeholder: 'Enter price' },
  { id: 'stock', label: 'Stock Quantity', type: 'number', placeholder: 'Enter stock' },
  {
    id: 'category',
    label: 'Category',
    type: 'select',
    options: [
      { value: 'electronics', label: 'Electronics' },
      { value: 'clothing', label: 'Clothing' },
      { value: 'books', label: 'Books' },
      { value: 'home', label: 'Home & Garden' },
    ],
  },
  {
    id: 'brand',
    label: 'Brand',
    type: 'multiselect',
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'samsung', label: 'Samsung' },
      { value: 'sony', label: 'Sony' },
      { value: 'nike', label: 'Nike' },
    ],
  },
  { id: 'createdDate', label: 'Created Date', type: 'date' },
  { id: 'inStock', label: 'In Stock', type: 'boolean' },
];

/**
 * Basic usage with simple fields
 */
export const Basic: Story = {
  render: () => {
    const [appliedFilters, setAppliedFilters] = useState<FilterRule[]>([]);

    return (
      <div className="space-y-6">
        <AdvancedSearchFilter
          fields={basicFields}
          onApply={(filters) => {
            setAppliedFilters(filters);
            console.log('Applied filters:', filters);
          }}
          onReset={() => setAppliedFilters([])}
        />
        {appliedFilters.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">Applied Filters:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(appliedFilters, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Comprehensive example with all field types
 */
export const Comprehensive: Story = {
  render: () => {
    const [appliedFilters, setAppliedFilters] = useState<FilterRule[]>([]);

    return (
      <div className="space-y-6">
        <AdvancedSearchFilter
          fields={comprehensiveFields}
          onApply={(filters) => {
            setAppliedFilters(filters);
            console.log('Applied filters:', filters);
          }}
          onReset={() => setAppliedFilters([])}
        />
        {appliedFilters.length > 0 && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">Applied Filters:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(appliedFilters, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  },
};

/**
 * E-commerce product search example
 */
export const EcommerceExample: Story = {
  render: () => {
    const [appliedFilters, setAppliedFilters] = useState<FilterRule[]>([]);
    const [results, setResults] = useState<any[]>([]);

    const mockProducts = [
      { id: 1, productName: 'iPhone 15', price: 999, category: 'electronics', brand: ['apple'], inStock: true },
      { id: 2, productName: 'Samsung Galaxy', price: 899, category: 'electronics', brand: ['samsung'], inStock: true },
      { id: 3, productName: 'Nike Air Max', price: 120, category: 'clothing', brand: ['nike'], inStock: false },
    ];

    const handleApply = (filters: FilterRule[]) => {
      setAppliedFilters(filters);
      // Simulate filtering
      let filtered = mockProducts;
      filters.forEach((filter) => {
        const field = ecommerceFields.find((f) => f.id === filter.field);
        if (!field) return;

        filtered = filtered.filter((product: any) => {
          const value = product[filter.field];
          switch (filter.operator) {
            case 'equals':
              return value === filter.value;
            case 'contains':
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'greaterThan':
              return Number(value) > Number(filter.value);
            case 'lessThan':
              return Number(value) < Number(filter.value);
            default:
              return true;
          }
        });
      });
      setResults(filtered);
    };

    return (
      <div className="space-y-6">
        <AdvancedSearchFilter fields={ecommerceFields} onApply={handleApply} onReset={() => {
          setAppliedFilters([]);
          setResults([]);
        }} />
        {appliedFilters.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {results.length} product(s) found
            </p>
          </div>
        )}
        {results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {results.map((product) => (
              <div key={product.id} className="p-4 border rounded-lg dark:border-gray-700">
                <h4 className="font-semibold">{product.productName}</h4>
                <p className="text-gray-600 dark:text-gray-400">${product.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  },
};

/**
 * With initial filters
 */
export const WithInitialFilters: Story = {
  render: () => {
    const initialFilters: FilterRule[] = [
      {
        id: '1',
        field: 'status',
        operator: 'equals',
        value: 'active',
      },
      {
        id: '2',
        field: 'age',
        operator: 'greaterThan',
        value: '25',
      },
    ];

    return (
      <AdvancedSearchFilter
        fields={basicFields}
        initialFilters={initialFilters}
        onApply={(filters) => console.log('Applied filters:', filters)}
      />
    );
  },
};

/**
 * Without logic selector
 */
export const WithoutLogicSelector: Story = {
  render: () => {
    return (
      <AdvancedSearchFilter
        fields={basicFields}
        showLogicSelector={false}
        onApply={(filters) => console.log('Applied filters:', filters)}
      />
    );
  },
};

/**
 * Collapsible filter panel
 */
export const Collapsible: Story = {
  render: () => {
    return (
      <AdvancedSearchFilter
        fields={comprehensiveFields}
        collapsible
        defaultCollapsed={false}
        onApply={(filters) => console.log('Applied filters:', filters)}
      />
    );
  },
};

/**
 * With maximum filters limit
 */
export const WithMaxFilters: Story = {
  render: () => {
    return (
      <AdvancedSearchFilter
        fields={comprehensiveFields}
        maxFilters={3}
        onApply={(filters) => console.log('Applied filters:', filters)}
      />
    );
  },
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  render: () => {
    return (
      <ThemeWrapper theme="dark">
        <div className="p-6 min-h-screen bg-gray-900">
          <AdvancedSearchFilter
            fields={comprehensiveFields}
            onApply={(filters) => console.log('Applied filters:', filters)}
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
 * User management example
 */
export const UserManagement: Story = {
  render: () => {
    const userFields: FilterField[] = [
      { id: 'username', label: 'Username', type: 'text', placeholder: 'Enter username' },
      { id: 'email', label: 'Email', type: 'text', placeholder: 'Enter email' },
      { id: 'firstName', label: 'First Name', type: 'text', placeholder: 'Enter first name' },
      { id: 'lastName', label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
      {
        id: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { value: 'admin', label: 'Admin' },
          { value: 'user', label: 'User' },
          { value: 'moderator', label: 'Moderator' },
        ],
      },
      {
        id: 'permissions',
        label: 'Permissions',
        type: 'multiselect',
        options: [
          { value: 'read', label: 'Read' },
          { value: 'write', label: 'Write' },
          { value: 'delete', label: 'Delete' },
          { value: 'admin', label: 'Admin' },
        ],
      },
      { id: 'createdAt', label: 'Created At', type: 'date' },
      { id: 'lastLogin', label: 'Last Login', type: 'datetime' },
      { id: 'isActive', label: 'Active', type: 'boolean' },
      { id: 'loginCount', label: 'Login Count', type: 'number', placeholder: 'Enter count' },
    ];

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">User Management</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Use the filters below to search and filter users
          </p>
        </div>
        <AdvancedSearchFilter
          fields={userFields}
          onApply={(filters) => {
            console.log('User filters applied:', filters);
            alert(`Applied ${filters.length} filter(s)`);
          }}
        />
      </div>
    );
  },
};

/**
 * Date range filtering example
 */
export const DateRangeExample: Story = {
  render: () => {
    const dateFields: FilterField[] = [
      { id: 'orderDate', label: 'Order Date', type: 'date' },
      { id: 'shipDate', label: 'Ship Date', type: 'date' },
      { id: 'createdAt', label: 'Created At', type: 'datetime' },
      { id: 'updatedAt', label: 'Updated At', type: 'datetime' },
    ];

    return (
      <div className="space-y-6">
        <AdvancedSearchFilter
          fields={dateFields}
          onApply={(filters) => {
            console.log('Date filters:', filters);
            filters.forEach((filter) => {
              if (filter.operator === 'between') {
                console.log(`${filter.field}: ${filter.value} to ${filter.value2}`);
              }
            });
          }}
        />
      </div>
    );
  },
};

/**
 * Number range and comparison example
 */
export const NumberComparison: Story = {
  render: () => {
    const numberFields: FilterField[] = [
      { id: 'price', label: 'Price', type: 'number', placeholder: 'Enter price' },
      { id: 'quantity', label: 'Quantity', type: 'number', placeholder: 'Enter quantity' },
      { id: 'discount', label: 'Discount %', type: 'number', placeholder: 'Enter discount' },
      { id: 'rating', label: 'Rating', type: 'number', placeholder: 'Enter rating (1-5)' },
    ];

    return (
      <div className="space-y-6">
        <AdvancedSearchFilter
          fields={numberFields}
          onApply={(filters) => {
            console.log('Number filters:', filters);
          }}
        />
      </div>
    );
  },
};

/**
 * Text search with various operators
 */
export const TextSearch: Story = {
  render: () => {
    const textFields: FilterField[] = [
      { id: 'title', label: 'Title', type: 'text', placeholder: 'Enter title' },
      { id: 'description', label: 'Description', type: 'text', placeholder: 'Enter description' },
      { id: 'tags', label: 'Tags', type: 'text', placeholder: 'Enter tags' },
      { id: 'content', label: 'Content', type: 'text', placeholder: 'Enter content' },
    ];

    return (
      <div className="space-y-6">
        <AdvancedSearchFilter
          fields={textFields}
          onApply={(filters) => {
            console.log('Text filters:', filters);
          }}
        />
      </div>
    );
  },
};

/**
 * Complex multi-field filtering with mixed AND/OR logic
 */
export const ComplexFiltering: Story = {
  render: () => {
    const [appliedFilters, setAppliedFilters] = useState<FilterRule[]>([]);

    return (
      <div className="space-y-6">
        <AdvancedSearchFilter
          fields={comprehensiveFields}
          onApply={(filters) => {
            setAppliedFilters(filters);
            console.log('Complex filters applied:', filters);
          }}
        />
        {appliedFilters.length > 0 && (
          <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Filter Summary</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {appliedFilters.length} filter(s) applied with mixed AND/OR logic
              </p>
            </div>
            <div className="space-y-2">
              {appliedFilters.map((filter, index) => {
                const field = comprehensiveFields.find((f) => f.id === filter.field);
                return (
                  <div key={filter.id} className="flex items-center gap-2 text-sm">
                    {index > 0 && filter.logic && (
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-medium">
                        {filter.logic}
                      </span>
                    )}
                    <span className="font-medium">{field?.label}</span>
                    <span className="text-gray-500">{filter.operator}</span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {Array.isArray(filter.value) ? filter.value.join(', ') : String(filter.value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  },
};

