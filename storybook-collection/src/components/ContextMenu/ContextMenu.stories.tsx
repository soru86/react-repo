import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { ContextMenu, ContextMenuItem } from './ContextMenu';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Icons
const EditIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
        />
    </svg>
);

const DeleteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
    </svg>
);

const CopyIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
    </svg>
);

const CutIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
    </svg>
);

const PasteIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
    </svg>
);

const FolderIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
        />
    </svg>
);

const FileIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
    </svg>
);

const DownloadIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
    </svg>
);

const ShareIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
    </svg>
);

const meta = {
    title: 'Components/ContextMenu',
    component: ContextMenu,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A context menu component that displays menu items on right-click. Supports dynamic menu items based on context, nested submenus, icons, separators, and keyboard navigation.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        model: {
            control: 'object',
            description: 'Menu items to display',
        },
        getItems: {
            control: false,
            description: 'Function to get menu items dynamically based on context',
        },
        visible: {
            control: 'boolean',
            description: 'Whether context menu is visible (controlled mode)',
        },
        appendTo: {
            control: 'select',
            options: ['body', 'self'],
            description: 'Where to append the menu',
        },
        baseZIndex: {
            control: 'number',
            description: 'Base z-index for the menu',
        },
    },
    args: {
        onShow: fn(),
        onHide: fn(),
    },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic context menu with simple items
 */
export const Basic: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click on the box to see the menu');

        const items: ContextMenuItem[] = [
            {
                label: 'Edit',
                icon: <EditIcon />,
                command: () => setMessage('Edit clicked'),
            },
            {
                label: 'Copy',
                icon: <CopyIcon />,
                command: () => setMessage('Copy clicked'),
            },
            {
                label: 'Delete',
                icon: <DeleteIcon />,
                command: () => setMessage('Delete clicked'),
            },
        ];

        return (
            <div className="p-8">
                <ContextMenu model={items}>
                    <div className="w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-600 dark:text-gray-400">{message}</p>
                    </div>
                </ContextMenu>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Context menu with icons and separators
 */
export const WithIconsAndSeparators: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click to see menu with icons and separators');

        const items: ContextMenuItem[] = [
            {
                label: 'Cut',
                icon: <CutIcon />,
                command: () => setMessage('Cut clicked'),
            },
            {
                label: 'Copy',
                icon: <CopyIcon />,
                command: () => setMessage('Copy clicked'),
            },
            {
                label: 'Paste',
                icon: <PasteIcon />,
                command: () => setMessage('Paste clicked'),
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Edit',
                icon: <EditIcon />,
                command: () => setMessage('Edit clicked'),
            },
            {
                label: 'Delete',
                icon: <DeleteIcon />,
                command: () => setMessage('Delete clicked'),
            },
        ];

        return (
            <div className="p-8">
                <ContextMenu model={items}>
                    <div className="w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>
                    </div>
                </ContextMenu>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Context menu with nested submenus
 */
export const WithSubmenus: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click to see menu with submenus');

        const items: ContextMenuItem[] = [
            {
                label: 'New',
                icon: <FileIcon />,
                items: [
                    {
                        label: 'File',
                        icon: <FileIcon />,
                        command: () => setMessage('New File clicked'),
                    },
                    {
                        label: 'Folder',
                        icon: <FolderIcon />,
                        command: () => setMessage('New Folder clicked'),
                    },
                ],
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Edit',
                icon: <EditIcon />,
                command: () => setMessage('Edit clicked'),
            },
            {
                label: 'Share',
                icon: <ShareIcon />,
                items: [
                    {
                        label: 'Email',
                        command: () => setMessage('Share via Email clicked'),
                    },
                    {
                        label: 'Link',
                        command: () => setMessage('Share via Link clicked'),
                    },
                    {
                        label: 'Download',
                        icon: <DownloadIcon />,
                        command: () => setMessage('Download clicked'),
                    },
                ],
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Delete',
                icon: <DeleteIcon />,
                command: () => setMessage('Delete clicked'),
            },
        ];

        return (
            <div className="p-8">
                <ContextMenu model={items}>
                    <div className="w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>
                    </div>
                </ContextMenu>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Dynamic menu items based on context
 */
export const DynamicMenuItems: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click on different areas');
        const [clickedArea, setClickedArea] = useState<string>('');

        const getItems = (event: React.MouseEvent | React.TouchEvent): ContextMenuItem[] => {
            const target = event.currentTarget as HTMLElement;
            const area = target.dataset.area || 'unknown';
            setClickedArea(area);

            if (area === 'header') {
                return [
                    {
                        label: 'Header Actions',
                        icon: <EditIcon />,
                        command: () => setMessage('Header action clicked'),
                    },
                    {
                        label: 'Settings',
                        command: () => setMessage('Header settings clicked'),
                    },
                ];
            } else if (area === 'content') {
                return [
                    {
                        label: 'Edit Content',
                        icon: <EditIcon />,
                        command: () => setMessage('Content edit clicked'),
                    },
                    {
                        label: 'Copy Content',
                        icon: <CopyIcon />,
                        command: () => setMessage('Content copy clicked'),
                    },
                    {
                        separator: true,
                        label: '',
                    },
                    {
                        label: 'Delete Content',
                        icon: <DeleteIcon />,
                        command: () => setMessage('Content delete clicked'),
                    },
                ];
            } else if (area === 'footer') {
                return [
                    {
                        label: 'Footer Options',
                        command: () => setMessage('Footer option clicked'),
                    },
                ];
            }

            return [
                {
                    label: 'Default Action',
                    command: () => setMessage('Default action clicked'),
                },
            ];
        };

        return (
            <div className="p-8 space-y-4">
                <ContextMenu getItems={getItems}>
                    <div className="w-96 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                        <div
                            data-area="header"
                            className="p-4 bg-blue-100 dark:bg-blue-900/30 cursor-context-menu"
                        >
                            <h3 className="font-semibold">Header Area - Right-click here</h3>
                        </div>
                        <div
                            data-area="content"
                            className="p-4 cursor-context-menu min-h-[100px]"
                        >
                            <p>Content Area - Right-click here</p>
                        </div>
                        <div
                            data-area="footer"
                            className="p-4 bg-gray-100 dark:bg-gray-700 cursor-context-menu"
                        >
                            <p>Footer Area - Right-click here</p>
                        </div>
                    </div>
                </ContextMenu>
                <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold">Status:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Clicked area: {clickedArea}
                    </p>
                </div>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Context menu with disabled items
 */
export const WithDisabledItems: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click to see menu with disabled items');

        const items: ContextMenuItem[] = [
            {
                label: 'Enabled Action',
                icon: <EditIcon />,
                command: () => setMessage('Enabled action clicked'),
            },
            {
                label: 'Disabled Action',
                icon: <DeleteIcon />,
                disabled: true,
                command: () => setMessage('This should not fire'),
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Another Enabled',
                command: () => setMessage('Another enabled clicked'),
            },
            {
                label: 'Also Disabled',
                disabled: true,
                command: () => setMessage('This should not fire'),
            },
        ];

        return (
            <div className="p-8">
                <ContextMenu model={items}>
                    <div className="w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>
                    </div>
                </ContextMenu>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Context menu on table rows
 */
export const TableContextMenu: Story = {
    render: () => {
        const [selectedRow, setSelectedRow] = useState<number | null>(null);
        const [message, setMessage] = useState('Right-click on a table row');

        const rows = [
            { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
        ];

        const getRowItems = (rowId: number): ContextMenuItem[] => [
            {
                label: 'Edit User',
                icon: <EditIcon />,
                command: () => setMessage(`Edit user ${rowId}`),
            },
            {
                label: 'Copy Email',
                icon: <CopyIcon />,
                command: () => setMessage(`Copy email for user ${rowId}`),
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Delete User',
                icon: <DeleteIcon />,
                command: () => setMessage(`Delete user ${rowId}`),
            },
        ];

        return (
            <div className="p-8">
                <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold">Status:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
                </div>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => (
                                <ContextMenu
                                    key={row.id}
                                    model={getRowItems(row.id)}
                                    getItems={() => {
                                        setSelectedRow(row.id);
                                        return getRowItems(row.id);
                                    }}
                                >
                                    <tr
                                        className={`border-t border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-context-menu ${selectedRow === row.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                            }`}
                                    >
                                        <td className="px-4 py-2">{row.name}</td>
                                        <td className="px-4 py-2">{row.email}</td>
                                        <td className="px-4 py-2">{row.role}</td>
                                    </tr>
                                </ContextMenu>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Context menu on list items
 */
export const ListContextMenu: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click on any list item');
        const [selectedItem, setSelectedItem] = useState<string | null>(null);

        const items = ['Document 1.pdf', 'Image.jpg', 'Video.mp4', 'Spreadsheet.xlsx'];

        const getFileItems = (fileName: string): ContextMenuItem[] => {
            const isVideo = fileName.endsWith('.mp4');

            return [
                {
                    label: 'Open',
                    icon: <FileIcon />,
                    command: () => setMessage(`Opening ${fileName}`),
                },
                {
                    label: 'Copy',
                    icon: <CopyIcon />,
                    command: () => setMessage(`Copied ${fileName}`),
                },
                {
                    separator: true,
                    label: '',
                },
                {
                    label: 'Edit',
                    icon: <EditIcon />,
                    command: () => setMessage(`Editing ${fileName}`),
                    disabled: isVideo,
                },
                {
                    label: 'Share',
                    icon: <ShareIcon />,
                    command: () => setMessage(`Sharing ${fileName}`),
                },
                {
                    separator: true,
                    label: '',
                },
                {
                    label: 'Delete',
                    icon: <DeleteIcon />,
                    command: () => setMessage(`Deleted ${fileName}`),
                },
            ];
        };

        return (
            <div className="p-8">
                <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold">Status:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
                </div>
                <div className="w-80 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {items.map((item) => (
                            <ContextMenu
                                key={item}
                                model={getFileItems(item)}
                                getItems={() => {
                                    setSelectedItem(item);
                                    return getFileItems(item);
                                }}
                            >
                                <li
                                    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-context-menu ${selectedItem === item ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FileIcon />
                                        <span className="text-gray-900 dark:text-gray-100">{item}</span>
                                    </div>
                                </li>
                            </ContextMenu>
                        ))}
                    </ul>
                </div>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Context menu with custom templates
 */
export const WithCustomTemplates: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click to see custom templates');

        const items: ContextMenuItem[] = [
            {
                label: 'Standard Item',
                icon: <EditIcon />,
                command: () => setMessage('Standard item clicked'),
            },
            {
                label: 'Custom Template',
                template: (
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold">Custom Item</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">With custom template</div>
                        </div>
                    </div>
                ),
                command: () => setMessage('Custom template clicked'),
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Another Standard',
                command: () => setMessage('Another standard clicked'),
            },
        ];

        return (
            <div className="p-8">
                <ContextMenu model={items}>
                    <div className="w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <p className="text-gray-600 dark:text-gray-400 text-center">{message}</p>
                    </div>
                </ContextMenu>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

/**
 * Dark theme context menu
 */
export const DarkTheme: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click in dark theme');

        const items: ContextMenuItem[] = [
            {
                label: 'Edit',
                icon: <EditIcon />,
                command: () => setMessage('Edit clicked'),
            },
            {
                label: 'Copy',
                icon: <CopyIcon />,
                command: () => setMessage('Copy clicked'),
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Share',
                icon: <ShareIcon />,
                items: [
                    {
                        label: 'Email',
                        command: () => setMessage('Share via Email'),
                    },
                    {
                        label: 'Link',
                        command: () => setMessage('Share via Link'),
                    },
                ],
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Delete',
                icon: <DeleteIcon />,
                command: () => setMessage('Delete clicked'),
            },
        ];

        return (
            <ThemeWrapper theme="dark">
                <div className="p-8">
                    <ContextMenu model={items}>
                        <div className="w-64 h-32 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center bg-gray-900">
                            <p className="text-gray-400 text-center">{message}</p>
                        </div>
                    </ContextMenu>
                </div>
            </ThemeWrapper>
        );
    },
    parameters: {
        layout: 'fullscreen',
    },
};

/**
 * Multiple context menus on different elements
 */
export const MultipleMenus: Story = {
    render: () => {
        const [message, setMessage] = useState('Right-click on different colored boxes');

        const getItems = (color: string): ContextMenuItem[] => [
            {
                label: `Action for ${color} box`,
                command: () => setMessage(`Action executed on ${color} box`),
            },
            {
                label: 'Copy',
                icon: <CopyIcon />,
                command: () => setMessage(`Copied from ${color} box`),
            },
            {
                separator: true,
                label: '',
            },
            {
                label: 'Delete',
                icon: <DeleteIcon />,
                command: () => setMessage(`Deleted ${color} box`),
            },
        ];

        return (
            <div className="p-8">
                <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-semibold">Status:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                    {['Red', 'Green', 'Blue'].map((color) => (
                        <ContextMenu key={color} model={getItems(color)}>
                            <div
                                className={`h-32 rounded-lg flex items-center justify-center cursor-context-menu ${color === 'Red'
                                    ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700'
                                    : color === 'Green'
                                        ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700'
                                        : 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-300 dark:border-blue-700'
                                    }`}
                            >
                                <p className="font-semibold">{color} Box</p>
                            </div>
                        </ContextMenu>
                    ))}
                </div>
            </div>
        );
    },
    parameters: {
        layout: 'padded',
    },
};

