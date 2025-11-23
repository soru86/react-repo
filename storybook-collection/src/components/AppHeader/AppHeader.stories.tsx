import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AppHeader } from './AppHeader';
import { UserIcon, SettingsIcon, LogOutIcon } from './icons';
import { ThemeWrapper } from '../../utils/ThemeWrapper';
import type { MenuItem, UserMenuOption } from './AppHeader';

// Simple SVG logo component - always works, no external dependencies
const SimpleLogo: React.FC = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" fill="#007bff" rx="4" />
    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="16" fontWeight="bold">SA</text>
  </svg>
);

const meta = {
  title: 'Components/AppHeader',
  component: AppHeader,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive app header component with navigation tabs (supporting n-level submenus), theme toggle, and user menu. Adapts to mobile devices with a hamburger menu.',
      },
      source: {
        type: 'code',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    tabVariant: {
      control: 'select',
      options: ['default', 'underline', 'pills', 'bordered', 'minimal'],
      description: 'Visual style variant for tabs',
    },
    variant: {
      control: 'select',
      options: ['default', 'transparent', 'elevated'],
      description: 'Header background variant',
    },
    sticky: {
      control: 'boolean',
      description: 'Make header sticky at top',
    },
    showThemeToggle: {
      control: 'boolean',
      description: 'Show theme toggle button',
    },
    mobileBreakpoint: {
      control: 'number',
      description: 'Breakpoint in pixels for mobile menu (default: 768)',
    },
    menuItems: {
      control: false,
      description: 'Navigation menu items with support for nested submenus',
    },
    userMenuOptions: {
      control: false,
      description: 'User menu options (profile, settings, logout, etc.)',
    },
    logo: {
      control: false,
      description: 'Logo element or image source',
    },
  },
  args: {
    onLogoClick: fn(),
    onThemeToggle: fn(),
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample menu items with various levels of nesting
const sampleMenuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '#',
    onClick: () => console.log('Home clicked'),
  },
  {
    id: 'products',
    label: 'Products',
    children: [
      {
        id: 'product-1',
        label: 'Product Category 1',
        children: [
          { id: 'product-1-1', label: 'Sub Product 1', href: '#' },
          { id: 'product-1-2', label: 'Sub Product 2', href: '#' },
          { id: 'product-1-3', label: 'Sub Product 3', href: '#' },
        ],
      },
      {
        id: 'product-2',
        label: 'Product Category 2',
        children: [
          { id: 'product-2-1', label: 'Sub Product A', href: '#' },
          { id: 'product-2-2', label: 'Sub Product B', href: '#' },
        ],
      },
      { id: 'product-3', label: 'Product Category 3', href: '#' },
    ],
  },
  {
    id: 'services',
    label: 'Services',
    badge: 'New',
    children: [
      { id: 'service-1', label: 'Service 1', href: '#' },
      { id: 'service-2', label: 'Service 2', href: '#' },
      { id: 'service-3', label: 'Service 3', href: '#' },
    ],
  },
  {
    id: 'about',
    label: 'About',
    href: '#',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#',
  },
];

const simpleMenuItems: MenuItem[] = [
  { id: 'home', label: 'Home', href: '#' },
  { id: 'about', label: 'About', href: '#' },
  { id: 'services', label: 'Services', href: '#' },
  { id: 'contact', label: 'Contact', href: '#' },
];

// Note: Menu items with React elements are created inside render functions
// to avoid Storybook serialization issues

/**
 * Default header with basic navigation
 */
export const Default: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];
    return (
      <div>
        <AppHeader
          {...args}
          logo={<SimpleLogo />}
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={simpleMenuItems}
          user={{
            name: 'John Doe',
            email: 'john.doe@example.com',
          }}
          userMenuOptions={userMenuOptions}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Page Content</h2>
          <p className="text-gray-600 dark:text-gray-400">
            This is the main content area. Scroll down to see sticky header behavior.
          </p>
          <div className="mt-8 space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-400">
                Content section {i + 1} - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Header with nested submenus (3 levels deep)
 */
export const WithNestedSubmenus: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];
    return (
      <div>
        <AppHeader
          {...args}
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={sampleMenuItems}
          activeMenuItemId="products"
          user={{
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            avatar: 'https://i.pravatar.cc/150?img=12',
          }}
          userMenuOptions={userMenuOptions}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Navigation with Nested Menus</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Hover over "Products" to see multi-level submenus.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * All tab variants
 */
export const TabVariants: Story = {
  render: () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const variants: Array<'default' | 'underline' | 'pills' | 'bordered' | 'minimal'> = [
      'default',
      'underline',
      'pills',
      'bordered',
      'minimal',
    ];
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];

    return (
      <div className="space-y-8">
        {variants.map((variant) => (
          <div key={variant}>
            <h3 className="text-lg font-semibold mb-2 px-4 capitalize">{variant} Variant</h3>
            <AppHeader
              logo={<SimpleLogo />}
              tabVariant={variant}
              currentTheme={theme}
              onThemeToggle={setTheme}
              menuItems={simpleMenuItems}
              activeMenuItemId="about"
              user={{ name: 'User' }}
              userMenuOptions={userMenuOptions}
            />
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Header with icons and badges
 */
export const WithIconsAndBadges: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const menuItems: MenuItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <SettingsIcon size={16} />,
        href: '#',
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: <UserIcon size={16} />,
        badge: 5,
        children: [
          { id: 'project-1', label: 'Project 1', href: '#' },
          { id: 'project-2', label: 'Project 2', href: '#' },
        ],
      },
      {
        id: 'team',
        label: 'Team',
        icon: <UserIcon size={16} />,
        href: '#',
      },
    ];
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];
    return (
      <div>
        <AppHeader
          {...args}
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={menuItems}
          user={{
            name: 'Admin User',
            email: 'admin@example.com',
          }}
          userMenuOptions={userMenuOptions}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Header with Icons and Badges</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Notice the icons next to menu items and the badge on "Projects".
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Sticky header
 */
export const StickyHeader: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];
    return (
      <div>
        <AppHeader
          {...args}
          sticky
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={simpleMenuItems}
          user={{ name: 'User' }}
          userMenuOptions={userMenuOptions}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Sticky Header</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Scroll down to see the header stick to the top.
          </p>
          <div className="space-y-4">
            {Array.from({ length: 50 }).map((_, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-400">
                Content section {i + 1} - Scroll to see sticky behavior.
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Header variants (default, transparent, elevated)
 */
export const HeaderVariants: Story = {
  render: () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const variants: Array<'default' | 'transparent' | 'elevated'> = [
      'default',
      'transparent',
      'elevated',
    ];
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];

    return (
      <div className="space-y-8">
        {variants.map((variant) => (
          <div key={variant}>
            <h3 className="text-lg font-semibold mb-2 px-4 capitalize">{variant} Variant</h3>
            <AppHeader
              logo={<SimpleLogo />}
              variant={variant}
              currentTheme={theme}
              onThemeToggle={setTheme}
              menuItems={simpleMenuItems}
              user={{ name: 'User' }}
              userMenuOptions={userMenuOptions}
            />
            <div className="p-4 bg-gray-100 dark:bg-gray-800">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Content below {variant} header variant
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Custom logo
 */
export const WithCustomLogo: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];
    return (
      <div>
        <AppHeader
          {...args}
          logo={
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                A
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">AppName</span>
            </div>
          }
          onLogoClick={() => console.log('Logo clicked')}
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={simpleMenuItems}
          user={{ name: 'User' }}
          userMenuOptions={userMenuOptions}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Custom Logo</h2>
          <p className="text-gray-600 dark:text-gray-400">
            The header uses a custom logo component instead of an image.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Without theme toggle
 */
export const WithoutThemeToggle: Story = {
  render: (args) => {
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];
    return (
      <div>
        <AppHeader
          {...args}
          showThemeToggle={false}
          menuItems={simpleMenuItems}
          user={{ name: 'User' }}
          userMenuOptions={userMenuOptions}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Without Theme Toggle</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Theme toggle button is hidden.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Without user menu
 */
export const WithoutUserMenu: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    return (
      <div>
        <AppHeader
          {...args}
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={simpleMenuItems}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Without User Menu</h2>
          <p className="text-gray-600 dark:text-gray-400">
            User avatar and menu are not displayed.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Minimal configuration
 */
export const Minimal: Story = {
  render: (args) => {
    return (
      <div>
        <AppHeader
          {...args}
          logo={<SimpleLogo />}
          menuItems={[{ id: 'home', label: 'Home', href: '#' }]}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Minimal Header</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Just logo and a single menu item.
          </p>
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
    const [theme, setTheme] = useState<'light' | 'dark'>('dark');
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];
    return (
      <div>
        <AppHeader
          {...args}
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={sampleMenuItems}
          activeMenuItemId="products"
          user={{
            name: 'Dark User',
            email: 'dark@example.com',
            avatar: 'https://i.pravatar.cc/150?img=15',
          }}
          userMenuOptions={userMenuOptions}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4 text-white">Dark Theme Header</h2>
          <p className="text-gray-400">
            Header component in dark theme mode.
          </p>
        </div>
      </div>
    );
  },
};

/**
 * Responsive behavior - resize viewport to see mobile menu
 */
export const Responsive: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const userMenuOptions: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile clicked'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Settings clicked'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout clicked'),
      },
    ];
    return (
      <div>
        <AppHeader
          {...args}
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={sampleMenuItems}
          user={{
            name: 'Mobile User',
            email: 'mobile@example.com',
          }}
          userMenuOptions={userMenuOptions}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Responsive Header</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Resize the browser window or use the viewport controls to see the mobile hamburger menu.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Desktop:</strong> Menu items are displayed horizontally in the header.
            </p>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
              <strong>Mobile:</strong> Hamburger menu icon appears, clicking it opens a vertical menu drawer.
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

/**
 * Complex example with all features
 */
export const ComplexExample: Story = {
  render: (args) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [activeItem, setActiveItem] = useState('dashboard');

    const complexMenuItems: MenuItem[] = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: <SettingsIcon size={16} />,
        onClick: () => setActiveItem('dashboard'),
      },
      {
        id: 'projects',
        label: 'Projects',
        icon: <UserIcon size={16} />,
        badge: 12,
        onClick: () => setActiveItem('projects'),
        children: [
          {
            id: 'active-projects',
            label: 'Active Projects',
            badge: 5,
            children: [
              { id: 'project-alpha', label: 'Project Alpha', href: '#' },
              { id: 'project-beta', label: 'Project Beta', href: '#' },
              { id: 'project-gamma', label: 'Project Gamma', href: '#' },
            ],
          },
          {
            id: 'archived-projects',
            label: 'Archived Projects',
            children: [
              { id: 'project-old-1', label: 'Old Project 1', href: '#' },
              { id: 'project-old-2', label: 'Old Project 2', href: '#' },
            ],
          },
        ],
      },
      {
        id: 'team',
        label: 'Team',
        icon: <UserIcon size={16} />,
        onClick: () => setActiveItem('team'),
        children: [
          { id: 'members', label: 'Members', href: '#' },
          { id: 'roles', label: 'Roles', href: '#' },
          { id: 'permissions', label: 'Permissions', href: '#' },
        ],
      },
      {
        id: 'analytics',
        label: 'Analytics',
        onClick: () => setActiveItem('analytics'),
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => setActiveItem('settings'),
      },
    ];

    const extendedUserMenu: UserMenuOption[] = [
      {
        id: 'profile',
        label: 'My Profile',
        icon: <UserIcon size={16} />,
        onClick: () => console.log('Profile'),
      },
      {
        id: 'account',
        label: 'Account Settings',
        icon: <SettingsIcon size={16} />,
        onClick: () => console.log('Account'),
      },
      {
        id: 'divider-1',
        label: '',
        divider: true,
      },
      {
        id: 'notifications',
        label: 'Notifications',
        onClick: () => console.log('Notifications'),
      },
      {
        id: 'preferences',
        label: 'Preferences',
        onClick: () => console.log('Preferences'),
      },
      {
        id: 'divider-2',
        label: '',
        divider: true,
      },
      {
        id: 'help',
        label: 'Help & Support',
        onClick: () => console.log('Help'),
      },
      {
        id: 'divider-3',
        label: '',
        divider: true,
      },
      {
        id: 'logout',
        label: 'Logout',
        icon: <LogOutIcon size={16} />,
        onClick: () => console.log('Logout'),
      },
    ];

    return (
      <div>
        <AppHeader
          {...args}
          logo={
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                  AppName
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  Enterprise
                </span>
              </div>
            </div>
          }
          tabVariant="underline"
          variant="elevated"
          sticky
          currentTheme={theme}
          onThemeToggle={setTheme}
          menuItems={complexMenuItems}
          activeMenuItemId={activeItem}
          user={{
            name: 'John Doe',
            email: 'john.doe@company.com',
            avatar: 'https://i.pravatar.cc/150?img=12',
          }}
          userMenuOptions={extendedUserMenu}
        />
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">Complex Example</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This example demonstrates all features: custom logo, nested menus (3 levels), badges,
            icons, sticky header, theme toggle, and extended user menu.
          </p>
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Active menu item: <strong>{activeItem}</strong>
            </p>
          </div>
          <div className="mt-8 space-y-4">
            {Array.from({ length: 30 }).map((_, i) => (
              <p key={i} className="text-gray-600 dark:text-gray-400">
                Content section {i + 1} - Scroll to see sticky header behavior.
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

