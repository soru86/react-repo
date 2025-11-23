import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { List, ListItem, ListGroup } from './List';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Icons
const FolderIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const FileIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
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

const DownloadIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

// Sample data generators
const generateFlatItems = (count: number): ListItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i + 1}`,
    label: `Item ${i + 1}`,
    secondaryText: `Secondary text for item ${i + 1}`,
    icon: <FileIcon />,
  }));
};

const generateNestedItems = (): ListItem[] => {
  return [
    {
      id: 'folder-1',
      label: 'Documents',
      icon: <FolderIcon />,
      isFolder: true,
      children: [
        { id: 'file-1', label: 'Report.pdf', icon: <FileIcon /> },
        { id: 'file-2', label: 'Presentation.pptx', icon: <FileIcon /> },
        { id: 'file-3', label: 'Spreadsheet.xlsx', icon: <FileIcon /> },
      ],
    },
    {
      id: 'folder-2',
      label: 'Images',
      icon: <FolderIcon />,
      isFolder: true,
      children: [
        { id: 'img-1', label: 'Photo1.jpg', icon: <FileIcon /> },
        { id: 'img-2', label: 'Photo2.jpg', icon: <FileIcon /> },
        {
          id: 'subfolder-1',
          label: 'Vacation',
          icon: <FolderIcon />,
          isFolder: true,
          children: [
            { id: 'vac-1', label: 'Beach.jpg', icon: <FileIcon /> },
            { id: 'vac-2', label: 'Mountain.jpg', icon: <FileIcon /> },
          ],
        },
      ],
    },
    {
      id: 'folder-3',
      label: 'Videos',
      icon: <FolderIcon />,
      isFolder: true,
      children: [
        { id: 'vid-1', label: 'Movie.mp4', icon: <FileIcon /> },
        { id: 'vid-2', label: 'Tutorial.mp4', icon: <FileIcon /> },
      ],
    },
  ];
};

const generateItemsWithActions = (): ListItem[] => {
  return Array.from({ length: 10 }, (_, i) => ({
    id: `action-item-${i + 1}`,
    label: `File ${i + 1}.pdf`,
    secondaryText: `Modified ${i + 1} days ago`,
    icon: <FileIcon />,
    actions: [
      {
        label: 'Edit',
        icon: <EditIcon />,
        onClick: fn(),
        variant: 'primary' as const,
      },
      {
        label: 'Download',
        icon: <DownloadIcon />,
        onClick: fn(),
        variant: 'success' as const,
      },
      {
        label: 'Delete',
        icon: <DeleteIcon />,
        onClick: fn(),
        variant: 'danger' as const,
      },
    ],
  }));
};

const generateGroupedItems = (): ListGroup[] => {
  return [
    {
      title: 'Recent Files',
      sticky: true,
      items: [
        { id: 'recent-1', label: 'Project Plan.docx', icon: <FileIcon /> },
        { id: 'recent-2', label: 'Budget.xlsx', icon: <FileIcon /> },
        { id: 'recent-3', label: 'Meeting Notes.pdf', icon: <FileIcon /> },
      ],
    },
    {
      title: 'Documents',
      sticky: true,
      items: [
        { id: 'doc-1', label: 'Report.pdf', icon: <FileIcon /> },
        { id: 'doc-2', label: 'Analysis.docx', icon: <FileIcon /> },
        { id: 'doc-3', label: 'Proposal.pdf', icon: <FileIcon /> },
      ],
    },
    {
      title: 'Media',
      sticky: true,
      items: [
        { id: 'media-1', label: 'Photo.jpg', icon: <FileIcon /> },
        { id: 'media-2', label: 'Video.mp4', icon: <FileIcon /> },
        { id: 'media-3', label: 'Audio.mp3', icon: <FileIcon /> },
      ],
    },
  ];
};

const meta = {
  title: 'Components/List',
  component: List,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A high-performance virtualized list component built with react-virtualized. Supports nested lists, folder structures, action buttons, grouping with dividers, multi-selection, sticky headers, and pagination.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    height: {
      control: 'number',
      description: 'Height of the list container',
    },
    width: {
      control: 'number',
      description: 'Width of the list container',
    },
    rowHeight: {
      control: 'select',
      options: [32, 48, 64, 'auto'],
      description: 'Row height in pixels or "auto" for dynamic height',
    },
    showCheckboxes: {
      control: 'boolean',
      description: 'Show checkboxes for multi-selection',
    },
    allowMultiSelect: {
      control: 'boolean',
      description: 'Allow multi-selection with CTRL/CMD',
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Size variant',
    },
    variant: {
      control: 'select',
      options: ['default', 'bordered', 'filled'],
      description: 'Visual variant',
    },
    hoverable: {
      control: 'boolean',
      description: 'Show hover effects',
    },
  },
  args: {
    onItemClick: fn(),
    onSelectionChange: fn(),
    onFolderToggle: fn(),
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic list with simple items
 */
export const Default: Story = {
  args: {
    items: generateFlatItems(20),
    height: 400,
    autoSize: false,
  },
};

/**
 * List with nested folders and files
 */
export const NestedList: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div style={{ height: 500, width: 600 }}>
        <List
          items={generateNestedItems()}
          selectedItems={selected}
          onSelectionChange={setSelected}
          height={500}
          autoSize={false}
        />
      </div>
    );
  },
};

/**
 * Folder list with icons
 */
export const FolderList: Story = {
  render: () => {
    const items: ListItem[] = [
      {
        id: 'root',
        label: 'My Computer',
        icon: <FolderIcon />,
        isFolder: true,
        children: [
          {
            id: 'c-drive',
            label: 'Local Disk (C:)',
            icon: <FolderIcon />,
            isFolder: true,
            children: [
              { id: 'programs', label: 'Program Files', icon: <FolderIcon />, isFolder: true },
              { id: 'users', label: 'Users', icon: <FolderIcon />, isFolder: true },
              { id: 'windows', label: 'Windows', icon: <FolderIcon />, isFolder: true },
            ],
          },
          {
            id: 'd-drive',
            label: 'Local Disk (D:)',
            icon: <FolderIcon />,
            isFolder: true,
            children: [
              { id: 'projects', label: 'Projects', icon: <FolderIcon />, isFolder: true },
              { id: 'downloads', label: 'Downloads', icon: <FolderIcon />, isFolder: true },
            ],
          },
        ],
      },
    ];

    return (
      <div style={{ height: 500, width: 600 }}>
        <List items={items} height={500} autoSize={false} />
      </div>
    );
  },
};

/**
 * List items with action buttons
 */
export const WithActions: Story = {
  render: () => {
    return (
      <div style={{ height: 500, width: 800 }}>
        <List items={generateItemsWithActions()} height={500} autoSize={false} />
      </div>
    );
  },
};

/**
 * List with dividers and group titles
 */
export const WithDividers: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div style={{ height: 500, width: 600 }}>
        <List
          groups={generateGroupedItems()}
          selectedItems={selected}
          onSelectionChange={setSelected}
          height={500}
          autoSize={false}
        />
      </div>
    );
  },
};

/**
 * Multi-selection with checkboxes
 */
export const MultiSelectWithCheckboxes: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div style={{ height: 500, width: 600 }}>
        <List
          items={generateFlatItems(50)}
          showCheckboxes
          selectedItems={selected}
          onSelectionChange={setSelected}
          height={500}
          autoSize={false}
        />
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-semibold">Selected Items: {selected.length}</p>
          <p className="text-sm text-gray-600">{selected.join(', ')}</p>
        </div>
      </div>
    );
  },
};

/**
 * Multi-selection with CTRL/CMD key
 */
export const MultiSelectWithCtrl: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <div style={{ height: 500, width: 600 }}>
        <List
          items={generateFlatItems(30)}
          allowMultiSelect
          selectedItems={selected}
          onSelectionChange={setSelected}
          height={500}
          autoSize={false}
        />
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-semibold">Selected Items: {selected.length}</p>
          <p className="text-sm text-gray-600">Hold CTRL/CMD and click to select multiple items</p>
          <p className="text-sm text-gray-600">Hold SHIFT and click to select a range</p>
        </div>
      </div>
    );
  },
};

/**
 * List with sticky subheaders
 */
export const StickySubheaders: Story = {
  render: () => {
    const groups: ListGroup[] = [
      {
        title: 'Section A',
        sticky: true,
        items: Array.from({ length: 15 }, (_, i) => ({
          id: `a-${i}`,
          label: `Item A-${i + 1}`,
          icon: <FileIcon />,
        })),
      },
      {
        title: 'Section B',
        sticky: true,
        items: Array.from({ length: 15 }, (_, i) => ({
          id: `b-${i}`,
          label: `Item B-${i + 1}`,
          icon: <FileIcon />,
        })),
      },
      {
        title: 'Section C',
        sticky: true,
        items: Array.from({ length: 15 }, (_, i) => ({
          id: `c-${i}`,
          label: `Item C-${i + 1}`,
          icon: <FileIcon />,
        })),
      },
    ];

    return (
      <div style={{ height: 500, width: 600 }}>
        <List groups={groups} height={500} autoSize={false} />
      </div>
    );
  },
};

/**
 * List with pagination
 */
export const WithPagination: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    const allItems = generateFlatItems(47);

    return (
      <div style={{ width: 600 }}>
        <List
          items={allItems}
          selectedItems={selected}
          onSelectionChange={setSelected}
          showCheckboxes
          pagination={{
            pageSize,
            currentPage,
            onPageChange: setCurrentPage,
            showPageInfo: true,
          }}
          height={400}
          autoSize={false}
        />
      </div>
    );
  },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
  render: () => {
    const items = generateFlatItems(10);
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Small</h3>
          <div style={{ height: 300, width: 500 }}>
            <List items={items} size="small" height={300} autoSize={false} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Medium</h3>
          <div style={{ height: 300, width: 500 }}>
            <List items={items} size="medium" height={300} autoSize={false} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Large</h3>
          <div style={{ height: 300, width: 500 }}>
            <List items={items} size="large" height={300} autoSize={false} />
          </div>
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
  render: () => {
    const items = generateFlatItems(10);
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-2">Default</h3>
          <div style={{ height: 300, width: 500 }}>
            <List items={items} variant="default" height={300} autoSize={false} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Bordered</h3>
          <div style={{ height: 300, width: 500 }}>
            <List items={items} variant="bordered" height={300} autoSize={false} />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-2">Filled</h3>
          <div style={{ height: 300, width: 500 }}>
            <List items={items} variant="filled" height={300} autoSize={false} />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Auto-sized list
 */
export const AutoSized: Story = {
  render: () => {
    return (
      <div style={{ height: '500px', width: '100%', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
        <List items={generateFlatItems(100)} autoSize height={500} />
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Dynamic row height
 */
export const DynamicRowHeight: Story = {
  render: () => {
    const items: ListItem[] = Array.from({ length: 20 }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
      secondaryText: i % 3 === 0
        ? 'This is a longer secondary text that will make the row taller'
        : 'Short text',
      icon: <FileIcon />,
    }));

    return (
      <div style={{ height: 500, width: 600 }}>
        <List items={items} rowHeight="auto" height={500} autoSize={false} />
      </div>
    );
  },
};

/**
 * Complex example with all features
 */
export const ComplexExample: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    const complexItems: ListItem[] = [
      {
        id: 'folder-1',
        label: 'Projects',
        icon: <FolderIcon />,
        isFolder: true,
        children: [
          {
            id: 'proj-1',
            label: 'Website Redesign',
            secondaryText: 'Last modified: 2 days ago',
            icon: <FolderIcon />,
            isFolder: true,
            children: [
              {
                id: 'web-1',
                label: 'index.html',
                icon: <FileIcon />,
                actions: [
                  { label: 'Edit', icon: <EditIcon />, onClick: fn(), variant: 'primary' },
                  { label: 'Delete', icon: <DeleteIcon />, onClick: fn(), variant: 'danger' },
                ],
              },
              {
                id: 'web-2',
                label: 'styles.css',
                icon: <FileIcon />,
                actions: [
                  { label: 'Edit', icon: <EditIcon />, onClick: fn(), variant: 'primary' },
                ],
              },
            ],
          },
          {
            id: 'proj-2',
            label: 'Mobile App',
            secondaryText: 'Last modified: 1 week ago',
            icon: <FolderIcon />,
            isFolder: true,
            children: [
              { id: 'app-1', label: 'App.tsx', icon: <FileIcon /> },
              { id: 'app-2', label: 'App.css', icon: <FileIcon /> },
            ],
          },
        ],
      },
      {
        id: 'folder-2',
        label: 'Documents',
        icon: <FolderIcon />,
        isFolder: true,
        children: [
          { id: 'doc-1', label: 'Report.pdf', icon: <FileIcon /> },
          { id: 'doc-2', label: 'Presentation.pptx', icon: <FileIcon /> },
        ],
      },
    ];

    return (
      <div style={{ width: 800 }}>
        <List
          items={complexItems}
          showCheckboxes
          selectedItems={selected}
          onSelectionChange={setSelected}
          allowMultiSelect
          pagination={{
            pageSize: 15,
            currentPage,
            onPageChange: setCurrentPage,
            showPageInfo: true,
          }}
          height={500}
          autoSize={false}
        />
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="font-semibold">Selected: {selected.length} items</p>
        </div>
      </div>
    );
  },
};

/**
 * Disabled items
 */
export const DisabledItems: Story = {
  render: () => {
    const items: ListItem[] = [
      { id: '1', label: 'Enabled Item 1', icon: <FileIcon /> },
      { id: '2', label: 'Disabled Item', icon: <FileIcon />, disabled: true },
      { id: '3', label: 'Enabled Item 2', icon: <FileIcon /> },
      {
        id: '4',
        label: 'Disabled Folder',
        icon: <FolderIcon />,
        isFolder: true,
        disabled: true,
        children: [{ id: '4-1', label: 'Child', icon: <FileIcon /> }],
      },
    ];

    return (
      <div style={{ height: 300, width: 500 }}>
        <List items={items} height={300} autoSize={false} />
      </div>
    );
  },
};

/**
 * Large dataset performance test
 */
export const LargeDataset: Story = {
  render: () => {
    const largeItems = generateFlatItems(10000);
    return (
      <div style={{ height: 600, width: 800 }}>
        <List items={largeItems} height={600} autoSize={false} rowHeight={48} />
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm">Rendering 10,000 items with virtualization for optimal performance</p>
        </div>
      </div>
    );
  },
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  render: () => {
    const [selected, setSelected] = useState<string[]>([]);
    return (
      <ThemeWrapper theme="dark">
        <div style={{ height: 500, width: 600 }}>
          <List
            items={generateNestedItems()}
            selectedItems={selected}
            onSelectionChange={setSelected}
            showCheckboxes
            height={500}
            autoSize={false}
          />
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

