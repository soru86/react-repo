import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { DataGrid } from './DataGrid';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Sample data type
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  age: number;
  department: string;
  salary: number;
}

// Sample data
const generateUsers = (count: number): User[] => {
  const roles = ['Admin', 'User', 'Manager', 'Developer'];
  const statuses: ('active' | 'inactive')[] = ['active', 'inactive'];
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];

  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: roles[i % roles.length],
    status: statuses[i % 2],
    age: 20 + (i % 30),
    department: departments[i % departments.length],
    salary: 50000 + (i % 50000),
  }));
};

const users = generateUsers(50);

// Icons
const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const ViewIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const meta = {
  title: 'Components/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A comprehensive data grid component with sorting, filtering, pagination, row selection, expandable rows, sub-rows, actions, and resizable columns.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'Data rows',
    },
    columns: {
      description: 'Column definitions',
    },
    selectable: {
      control: 'boolean',
      description: 'Enable row selection with checkboxes',
    },
    pagination: {
      control: 'boolean',
      description: 'Enable pagination',
    },
    striped: {
      control: 'boolean',
      description: 'Enable alternate row highlighting',
    },
    resizable: {
      control: 'boolean',
      description: 'Enable column resizing',
    },
    expandable: {
      control: 'boolean',
      description: 'Enable expandable rows',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'striped'],
      description: 'Variant/theme',
    },
  },
} satisfies Meta<typeof DataGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

// Column definitions
const basicColumns = [
  { id: 'id', header: 'ID', accessor: 'id' as const, sortable: true },
  { id: 'name', header: 'Name', accessor: 'name' as const, sortable: true, filterable: true },
  { id: 'email', header: 'Email', accessor: 'email' as const, filterable: true },
  { id: 'role', header: 'Role', accessor: 'role' as const, sortable: true, filterable: true },
  { id: 'status', header: 'Status', accessor: 'status' as const, sortable: true },
];

/**
 * Basic data grid
 */
export const Default: Story = {
  args: {
    data: users.slice(0, 10),
    columns: basicColumns,
  },
};

/**
 * Data grid with pagination
 */
export const WithPagination: Story = {
  args: {
    data: users,
    columns: basicColumns,
    pagination: true,
    pageSize: 10,
  },
};

/**
 * Data grid with sorting
 */
export const WithSorting: Story = {
  args: {
    data: users.slice(0, 20),
    columns: basicColumns.map((col) => ({ ...col, sortable: true })),
  },
};

/**
 * Data grid with filtering
 */
export const WithFiltering: Story = {
  args: {
    data: users,
    columns: basicColumns.map((col) => ({ ...col, filterable: true })),
    pagination: true,
    pageSize: 10,
  },
};

/**
 * Data grid with row selection
 */
export const WithRowSelection: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    return (
      <div className="space-y-4">
        <DataGrid
          data={users.slice(0, 15)}
          columns={basicColumns}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
        {selectedRows.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Selected {selectedRows.length} row(s)
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Data grid with expandable rows
 */
export const ExpandableRows: Story = {
  render: () => {
    return (
      <DataGrid
        data={users.slice(0, 10)}
        columns={basicColumns}
        expandable={true}
        expandedContent={(row) => (
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Email:</span> {row.email}
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Role:</span> {row.role}
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span> {row.status}
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Department:</span> {row.department}
              </div>
            </div>
          </div>
        )}
      />
    );
  },
};

/**
 * Data grid with sub-rows
 */
export const WithSubRows: Story = {
  render: () => {
    const columnsWithSubRows = [
      { id: 'id', header: 'ID', accessor: 'id' as const },
      { id: 'name', header: 'Name', accessor: 'name' as const },
      { id: 'email', header: 'Email', accessor: 'email' as const },
      { id: 'role', header: 'Role', accessor: 'role' as const },
    ];

    return (
      <DataGrid
        data={users.slice(0, 5)}
        columns={columnsWithSubRows}
        expandable={true}
        subRows={(row) => {
          // Generate sub-rows for demonstration
          return [
            { ...row, id: `${row.id}-1`, name: `${row.name} - Sub 1`, email: `sub1-${row.email}` },
            { ...row, id: `${row.id}-2`, name: `${row.name} - Sub 2`, email: `sub2-${row.email}` },
          ];
        }}
      />
    );
  },
};

/**
 * Data grid with action column
 */
export const WithActions: Story = {
  render: () => {
    const actions = [
      {
        label: 'View',
        icon: <ViewIcon />,
        onClick: (row: User) => alert(`Viewing ${row.name}`),
        variant: 'primary' as const,
      },
      {
        label: 'Edit',
        icon: <EditIcon />,
        onClick: (row: User) => alert(`Editing ${row.name}`),
        variant: 'success' as const,
      },
      {
        label: 'Delete',
        icon: <DeleteIcon />,
        onClick: (row: User) => alert(`Deleting ${row.name}`),
        variant: 'danger' as const,
        disabled: (row: User) => row.role === 'Admin',
      },
    ];

    return (
      <DataGrid
        data={users.slice(0, 10)}
        columns={basicColumns}
        actions={actions}
      />
    );
  },
};

/**
 * Data grid with all features
 */
export const AllFeatures: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const actions = [
      {
        label: 'Edit',
        icon: <EditIcon />,
        onClick: (row: User) => console.log('Edit', row),
        variant: 'primary' as const,
      },
      {
        label: 'Delete',
        icon: <DeleteIcon />,
        onClick: (row: User) => console.log('Delete', row),
        variant: 'danger' as const,
      },
    ];

    const columns = [
      {
        id: 'id',
        header: 'ID',
        accessor: 'id' as const,
        sortable: true,
        width: 80,
      },
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        sortable: true,
        filterable: true,
        headerIcon: <UserIcon />,
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email' as const,
        filterable: true,
        headerIcon: <EmailIcon />,
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role' as const,
        sortable: true,
        filterable: true,
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status' as const,
        sortable: true,
        cell: (value: string) => (
          <span
            className={clsx(
              'px-2 py-1 rounded-full text-xs font-medium',
              value === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            )}
          >
            {value}
          </span>
        ),
      },
      {
        id: 'salary',
        header: 'Salary',
        accessor: 'salary' as const,
        sortable: true,
        align: 'right' as const,
        cell: (value: number) => `$${value.toLocaleString()}`,
      },
    ];

    return (
      <div className="space-y-4">
        <DataGrid
          data={users}
          columns={columns}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          expandable={true}
          expandedContent={(row) => (
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Additional details for {row.name}
              </p>
            </div>
          )}
          actions={actions}
          pagination={true}
          pageSize={10}
          striped={true}
          resizable={true}
        />
        {selectedRows.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Selected {selectedRows.length} row(s)
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Striped rows
 */
export const StripedRows: Story = {
  args: {
    data: users.slice(0, 15),
    columns: basicColumns,
    striped: true,
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Small</h3>
        <DataGrid data={users.slice(0, 5)} columns={basicColumns} size="small" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Medium</h3>
        <DataGrid data={users.slice(0, 5)} columns={basicColumns} size="medium" />
      </div>
      <div>
        <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Large</h3>
        <DataGrid data={users.slice(0, 5)} columns={basicColumns} size="large" />
      </div>
    </div>
  ),
};

/**
 * Custom row colors
 */
export const CustomRowColors: Story = {
  render: () => {
    return (
      <DataGrid
        data={users.slice(0, 10)}
        columns={basicColumns}
        getRowClassName={(row: User) => {
          if (row.status === 'active') return 'bg-green-50 dark:bg-green-900/10';
          return 'bg-red-50 dark:bg-red-900/10';
        }}
        getRowStyle={(row: User) => {
          if (row.role === 'Admin') {
            return { borderLeft: '4px solid #3b82f6' };
          }
          return {};
        }}
      />
    );
  },
};

/**
 * Custom row height
 */
export const CustomRowHeight: Story = {
  args: {
    data: users.slice(0, 10),
    columns: basicColumns,
    rowHeight: '60px',
  },
};

/**
 * Columns with icons
 */
export const ColumnsWithIcons: Story = {
  render: () => {
    const columnsWithIcons = [
      {
        id: 'id',
        header: 'ID',
        accessor: 'id' as const,
        sortable: true,
      },
      {
        id: 'name',
        header: 'Name',
        accessor: 'name' as const,
        headerIcon: <UserIcon />,
        sortable: true,
        filterable: true,
      },
      {
        id: 'email',
        header: 'Email',
        accessor: 'email' as const,
        headerIcon: <EmailIcon />,
        filterable: true,
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role' as const,
        sortable: true,
      },
    ];

    return <DataGrid data={users.slice(0, 10)} columns={columnsWithIcons} />;
  },
};

/**
 * Resizable columns
 */
export const ResizableColumns: Story = {
  args: {
    data: users.slice(0, 10),
    columns: basicColumns.map((col) => ({ ...col, resizable: true })),
    resizable: true,
  },
};

/**
 * Custom header styles
 */
export const CustomHeaderStyles: Story = {
  render: () => {
    return (
      <DataGrid
        data={users.slice(0, 10)}
        columns={basicColumns}
        headerStyle={{
          backgroundColor: '#1f2937',
          color: '#ffffff',
        }}
        headerClassName="font-bold"
      />
    );
  },
};

/**
 * Bordered variant
 */
export const BorderedVariant: Story = {
  args: {
    data: users.slice(0, 10),
    columns: basicColumns,
    variant: 'bordered',
  },
};

/**
 * Loading state
 */
export const Loading: Story = {
  args: {
    data: [],
    columns: basicColumns,
    loading: true,
  },
};

/**
 * Empty state
 */
export const Empty: Story = {
  args: {
    data: [],
    columns: basicColumns,
    emptyMessage: 'No users found',
  },
};

/**
 * Complex example with all features
 */
export const ComplexExample: Story = {
  render: () => {
    const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const actions = [
      {
        label: 'View',
        icon: <ViewIcon />,
        onClick: (row: User) => console.log('View', row),
        variant: 'primary' as const,
      },
      {
        label: 'Edit',
        icon: <EditIcon />,
        onClick: (row: User) => console.log('Edit', row),
        variant: 'success' as const,
      },
      {
        label: 'Delete',
        icon: <DeleteIcon />,
        onClick: (row: User) => console.log('Delete', row),
        variant: 'danger' as const,
      },
    ];

    const columns = [
      {
        id: 'id',
        header: 'ID',
        accessor: 'id' as const,
        sortable: true,
        width: 80,
        resizable: true,
      },
      {
        id: 'name',
        header: 'Full Name',
        accessor: 'name' as const,
        sortable: true,
        filterable: true,
        headerIcon: <UserIcon />,
        resizable: true,
      },
      {
        id: 'email',
        header: 'Email Address',
        accessor: 'email' as const,
        filterable: true,
        headerIcon: <EmailIcon />,
        resizable: true,
      },
      {
        id: 'role',
        header: 'Role',
        accessor: 'role' as const,
        sortable: true,
        filterable: true,
        resizable: true,
      },
      {
        id: 'status',
        header: 'Status',
        accessor: 'status' as const,
        sortable: true,
        cell: (value: string) => (
          <span
            className={clsx(
              'px-2 py-1 rounded-full text-xs font-medium',
              value === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            )}
          >
            {value}
          </span>
        ),
        resizable: true,
      },
      {
        id: 'age',
        header: 'Age',
        accessor: 'age' as const,
        sortable: true,
        align: 'right' as const,
        resizable: true,
      },
      {
        id: 'salary',
        header: 'Salary',
        accessor: 'salary' as const,
        sortable: true,
        align: 'right' as const,
        cell: (value: number) => `$${value.toLocaleString()}`,
        resizable: true,
      },
    ];

    return (
      <div className="space-y-4">
        <DataGrid
          data={users}
          columns={columns}
          selectable={true}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          expandable={true}
          expandedContent={(row) => (
            <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow">
              <h4 className="font-semibold mb-3 text-gray-900 dark:text-gray-100">User Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Email:</span>
                  <div className="text-gray-900 dark:text-gray-100">{row.email}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Role:</span>
                  <div className="text-gray-900 dark:text-gray-100">{row.role}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Status:</span>
                  <div className="text-gray-900 dark:text-gray-100">{row.status}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Department:</span>
                  <div className="text-gray-900 dark:text-gray-100">{row.department}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Age:</span>
                  <div className="text-gray-900 dark:text-gray-100">{row.age}</div>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Salary:</span>
                  <div className="text-gray-900 dark:text-gray-100">${row.salary.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
          subRows={(row) => {
            // Generate sub-rows for managers
            if (row.role === 'Manager') {
              return users
                .filter((u) => u.department === row.department && u.role !== 'Manager')
                .slice(0, 3)
                .map((u) => ({ ...u, id: `${row.id}-${u.id}` }));
            }
            return undefined;
          }}
          actions={actions}
          pagination={true}
          page={currentPage}
          onPageChange={setCurrentPage}
          pageSize={10}
          striped={true}
          resizable={true}
        />
        {selectedRows.length > 0 && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Selected {selectedRows.length} row(s): {selectedRows.join(', ')}
            </p>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Dark theme - Data grid variants
 */
export const DarkTheme: Story = {
  render: () => (
    <ThemeWrapper theme="dark">
      <div className="space-y-8">
        <DataGrid
          data={users.slice(0, 10)}
          columns={basicColumns}
          striped={true}
        />
        <DataGrid
          data={users.slice(0, 10)}
          columns={basicColumns}
          selectable={true}
          expandable={true}
          expandedContent={(row) => (
            <div className="p-4">
              <p className="text-sm text-gray-300">Details for {row.name}</p>
            </div>
          )}
        />
      </div>
    </ThemeWrapper>
  ),
  parameters: {
    layout: 'fullscreen',
  },
};

