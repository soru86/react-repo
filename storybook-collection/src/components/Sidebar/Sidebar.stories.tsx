import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

// Icons
const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A flexible overlay sidebar component with configurable position, width, collapse functionality, and support for complex UI through render props. Perfect for navigation menus, settings panels, and side panels.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether sidebar is open',
    },
    collapsed: {
      control: 'boolean',
      description: 'Whether sidebar is collapsed',
    },
    position: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Position of the sidebar',
    },
    width: {
      control: 'text',
      description: 'Width when expanded (px or CSS units)',
    },
    collapsedWidth: {
      control: 'text',
      description: 'Width when collapsed (px or CSS units)',
    },
    showBackdrop: {
      control: 'boolean',
      description: 'Whether to show backdrop',
    },
    closeable: {
      control: 'boolean',
      description: 'Whether sidebar can be closed',
    },
    closeOnEscape: {
      control: 'boolean',
      description: 'Whether to close on escape key',
    },
    variant: {
      control: 'select',
      options: ['overlay', 'push'],
      description: 'Sidebar variant',
    },
  },
  args: {
    onClose: fn(),
    onCollapseChange: fn(),
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic sidebar with simple content
 */
export const Basic: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Sidebar
        </button>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Sidebar Content</h2>
            <p>This is a basic sidebar with simple content.</p>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Complex UI sidebar with navigation menu
 */
export const ComplexNavigation: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeItem, setActiveItem] = useState('home');

    const menuItems = [
      { id: 'home', label: 'Home', icon: <HomeIcon /> },
      { id: 'profile', label: 'Profile', icon: <UserIcon /> },
      { id: 'documents', label: 'Documents', icon: <DocumentIcon /> },
      { id: 'analytics', label: 'Analytics', icon: <ChartIcon /> },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Navigation Sidebar
        </button>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} width={280}>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Dashboard</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Welcome back, User
              </p>
            </div>

            <nav className="space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      activeItem === item.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">Quick Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tasks</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Messages</span>
                    <span className="font-semibold">5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Collapsible sidebar with simplified collapsed view
 */
export const Collapsible: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
      { id: 'home', label: 'Home', icon: <HomeIcon /> },
      { id: 'profile', label: 'Profile', icon: <UserIcon /> },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        >
          Open Sidebar
        </button>
        <Sidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
          width={280}
          collapsedWidth={80}
          collapsedContent={
            <div className="w-full space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          }
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Right-positioned sidebar
 */
export const RightPosition: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Right Sidebar
        </button>
        <Sidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          position="right"
          width={350}
        >
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Theme</label>
                <select className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700">
                  <option>Light</option>
                  <option>Dark</option>
                  <option>System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700">
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
            </div>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Custom width sidebar
 */
export const CustomWidth: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8 space-y-4">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Wide Sidebar (500px)
        </button>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} width={500}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Wide Sidebar</h2>
            <p>This sidebar has a custom width of 500px.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">Card 1</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Content here
                </p>
              </div>
              <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="font-semibold mb-2">Card 2</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Content here
                </p>
              </div>
            </div>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Sidebar with form
 */
export const WithForm: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      message: '',
    });

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Form Sidebar
        </button>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} width={400}>
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Contact Form</h2>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert('Form submitted!');
              }}
            >
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
            </form>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Sidebar without backdrop
 */
export const WithoutBackdrop: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Sidebar (No Backdrop)
        </button>
        <Sidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          showBackdrop={false}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold">No Backdrop</h2>
            <p>This sidebar doesn't have a backdrop overlay.</p>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Non-closeable sidebar
 */
export const NonCloseable: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        >
          Toggle Sidebar
        </button>
        <Sidebar isOpen={isOpen} closeable={false} width={250}>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Non-Closeable</h2>
            <p>This sidebar cannot be closed using the close button.</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Use the toggle button outside to control it.
            </p>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Dark theme sidebar
 */
export const DarkTheme: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <ThemeWrapper theme="dark">
        <div className="p-8 min-h-screen bg-gray-900">
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Open Sidebar (Dark Theme)
          </button>
          <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} width={300}>
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Dark Theme</h2>
              <nav className="space-y-2">
                {[
                  { label: 'Home', icon: <HomeIcon /> },
                  { label: 'Profile', icon: <UserIcon /> },
                  { label: 'Settings', icon: <SettingsIcon /> },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </Sidebar>
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Complex UI with tabs and content
 */
export const ComplexUI: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Open Complex UI Sidebar
        </button>
        <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} width={400}>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Project Dashboard</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your project settings
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
              {['overview', 'tasks', 'team', 'settings'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    px-4 py-2 text-sm font-medium border-b-2 transition-colors
                    ${
                      activeTab === tab
                        ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-4">
              {activeTab === 'overview' && (
                <div>
                  <h3 className="font-semibold mb-3">Overview</h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
                      <div className="text-2xl font-bold">24</div>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
                      <div className="text-2xl font-bold">18</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'tasks' && (
                <div>
                  <h3 className="font-semibold mb-3">Tasks</h3>
                  <div className="space-y-2">
                    {['Task 1', 'Task 2', 'Task 3'].map((task) => (
                      <div
                        key={task}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-between"
                      >
                        <span>{task}</span>
                        <input type="checkbox" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div>
                  <h3 className="font-semibold mb-3">Team Members</h3>
                  <div className="space-y-2">
                    {['John Doe', 'Jane Smith', 'Bob Johnson'].map((member) => (
                      <div
                        key={member}
                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center gap-3"
                      >
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                          {member.charAt(0)}
                        </div>
                        <span>{member}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h3 className="font-semibold mb-3">Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Notifications</label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Enable notifications</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Theme</label>
                      <select className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700">
                        <option>Light</option>
                        <option>Dark</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Collapsed sidebar with icon-only navigation
 */
export const CollapsedWithIcons: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);
    const [collapsed, setCollapsed] = useState(true);

    const menuItems = [
      { id: 'home', label: 'Home', icon: <HomeIcon /> },
      { id: 'profile', label: 'Profile', icon: <UserIcon /> },
      { id: 'documents', label: 'Documents', icon: <DocumentIcon /> },
      { id: 'analytics', label: 'Analytics', icon: <ChartIcon /> },
      { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
    ];

    return (
      <div className="p-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
        >
          Toggle Sidebar
        </button>
        <Sidebar
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          collapsed={collapsed}
          onCollapseChange={setCollapsed}
          width={280}
          collapsedWidth={70}
          closeable={false}
          showBackdrop={false}
          collapsedContent={
            <nav className="w-full space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  className="w-full p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </nav>
          }
        >
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                title={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </Sidebar>
      </div>
    );
  },
};

/**
 * Multiple sidebars
 */
export const MultipleSidebars: Story = {
  render: () => {
    const [leftOpen, setLeftOpen] = useState(false);
    const [rightOpen, setRightOpen] = useState(false);

    return (
      <div className="p-8">
        <div className="space-x-4">
          <button
            onClick={() => setLeftOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Open Left Sidebar
          </button>
          <button
            onClick={() => setRightOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Open Right Sidebar
          </button>
        </div>
        <Sidebar
          isOpen={leftOpen}
          onClose={() => setLeftOpen(false)}
          position="left"
          width={250}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Left Sidebar</h2>
            <p>This is the left sidebar content.</p>
          </div>
        </Sidebar>
        <Sidebar
          isOpen={rightOpen}
          onClose={() => setRightOpen(false)}
          position="right"
          width={300}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Right Sidebar</h2>
            <p>This is the right sidebar content.</p>
          </div>
        </Sidebar>
      </div>
    );
  },
};

