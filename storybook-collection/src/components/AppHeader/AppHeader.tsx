import React, { useState, useEffect, useRef } from 'react';
import { clsx } from 'clsx';
import { MenuIcon, XIcon, ChevronDownIcon, ChevronRightIcon, SunIcon, MoonIcon, LogOutIcon, UserIcon, SettingsIcon } from './icons';

export interface MenuItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: MenuItem[];
}

export interface UserMenuOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  href?: string;
  divider?: boolean;
  disabled?: boolean;
}

export type TabVariant = 'default' | 'underline' | 'pills' | 'bordered' | 'minimal';

export interface AppHeaderProps {
  /**
   * Logo element or image source
   */
  logo?: React.ReactNode | string;
  /**
   * Logo click handler
   */
  onLogoClick?: () => void;
  /**
   * Navigation menu items with support for nested submenus
   */
  menuItems?: MenuItem[];
  /**
   * Active menu item ID
   */
  activeMenuItemId?: string;
  /**
   * Tab variant style
   */
  tabVariant?: TabVariant;
  /**
   * User information
   */
  user?: {
    name?: string;
    email?: string;
    avatar?: string | React.ReactNode;
  };
  /**
   * User menu options (profile, settings, logout, etc.)
   */
  userMenuOptions?: UserMenuOption[];
  /**
   * Theme toggle handler
   */
  onThemeToggle?: (theme: 'light' | 'dark') => void;
  /**
   * Current theme
   */
  currentTheme?: 'light' | 'dark';
  /**
   * Show theme toggle button
   */
  showThemeToggle?: boolean;
  /**
   * Mobile menu breakpoint (default: 768px)
   */
  mobileBreakpoint?: number;
  /**
   * Additional className for the header
   */
  className?: string;
  /**
   * Header background variant
   */
  variant?: 'default' | 'transparent' | 'elevated';
  /**
   * Sticky header
   */
  sticky?: boolean;
}

/**
 * Responsive App Header component with navigation, theme toggle, and user menu
 */
export const AppHeader: React.FC<AppHeaderProps> = ({
  logo,
  onLogoClick,
  menuItems = [],
  activeMenuItemId,
  tabVariant = 'default',
  user,
  userMenuOptions = [],
  onThemeToggle,
  currentTheme = 'light',
  showThemeToggle = true,
  mobileBreakpoint = 768,
  className = '',
  variant = 'default',
  sticky = false,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const submenuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle responsive breakpoint
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
      if (window.innerWidth >= mobileBreakpoint) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      
      // Close submenus when clicking outside
      Object.values(submenuRefs.current).forEach((ref) => {
        if (ref && !ref.contains(event.target as Node)) {
          // Don't close if clicking on the parent menu item
          const menuItem = (event.target as HTMLElement).closest('[data-menu-item-id]');
          if (!menuItem) {
            setOpenSubmenus((prev) => {
              const newSet = new Set(prev);
              // Find and remove the submenu ID
              Object.keys(submenuRefs.current).forEach((id) => {
                if (submenuRefs.current[id] === ref) {
                  newSet.delete(id);
                }
              });
              return newSet;
            });
          }
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleSubmenu = (itemId: string) => {
    setOpenSubmenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.disabled) return;
    
    if (item.children && item.children.length > 0) {
      if (isMobile) {
        toggleSubmenu(item.id);
      }
    } else {
      if (item.onClick) {
        item.onClick();
      }
      if (isMobile) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  const handleThemeToggle = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    onThemeToggle?.(newTheme);
  };

  const renderLogo = () => {
    if (!logo) return null;

    if (typeof logo === 'string') {
      return (
        <img
          src={logo}
          alt="Logo"
          className="h-8 w-auto cursor-pointer"
          onClick={onLogoClick}
        />
      );
    }

    return (
      <div onClick={onLogoClick} className="cursor-pointer">
        {logo}
      </div>
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0, isMobile: boolean = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSubmenus.has(item.id);
    const isActive = activeMenuItemId === item.id;
    const isHovered = hoveredMenuItem === item.id;

    const baseClasses = clsx(
      'flex items-center justify-between px-4 py-2 text-sm font-medium transition-colors duration-200',
      item.disabled && 'opacity-50 cursor-not-allowed',
      !item.disabled && 'cursor-pointer',
      level > 0 && 'pl-8'
    );

    const variantClasses = {
      default: clsx(
        'rounded-md',
        isActive && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        !isActive && !item.disabled && 'hover:bg-gray-100 dark:hover:bg-gray-800',
        !isActive && 'text-gray-700 dark:text-gray-300'
      ),
      underline: clsx(
        'border-b-2 border-transparent',
        isActive && 'border-blue-500 text-blue-600 dark:text-blue-400',
        !isActive && !item.disabled && 'hover:border-gray-300 hover:text-gray-900 dark:hover:text-gray-100',
        !isActive && 'text-gray-700 dark:text-gray-300'
      ),
      pills: clsx(
        'rounded-full',
        isActive && 'bg-blue-500 text-white',
        !isActive && !item.disabled && 'hover:bg-gray-100 dark:hover:bg-gray-800',
        !isActive && 'text-gray-700 dark:text-gray-300'
      ),
      bordered: clsx(
        'border border-transparent rounded-md',
        isActive && 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
        !isActive && !item.disabled && 'hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800',
        !isActive && 'text-gray-700 dark:text-gray-300'
      ),
      minimal: clsx(
        isActive && 'text-blue-600 dark:text-blue-400 font-semibold',
        !isActive && !item.disabled && 'hover:text-gray-900 dark:hover:text-gray-100',
        !isActive && 'text-gray-600 dark:text-gray-400'
      ),
    };

    const menuItemClasses = clsx(baseClasses, variantClasses[tabVariant]);

    const menuItemContent = (
      <div className="flex items-center gap-2 flex-1">
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span>{item.label}</span>
        {item.badge && (
          <span className="ml-auto bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </div>
    );

    if (isMobile) {
      const MenuItemWrapper = item.href && !hasChildren ? 'a' : 'div';
      return (
        <div key={item.id}>
          <MenuItemWrapper
            href={item.href && !hasChildren ? item.href : undefined}
            className={menuItemClasses}
            onClick={() => handleMenuItemClick(item)}
            data-menu-item-id={item.id}
          >
            {menuItemContent}
            {hasChildren && (
              <span className="ml-2">
                {isOpen ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
              </span>
            )}
          </MenuItemWrapper>
          {hasChildren && isOpen && (
            <div className="ml-4 mt-1">
              {item.children!.map((child) => renderMenuItem(child, level + 1, true))}
            </div>
          )}
        </div>
      );
    }

    // Desktop rendering
    const DesktopMenuItemWrapper = item.href && !hasChildren ? 'a' : 'div';
    const desktopMenuItemContent = (
      <div className="flex items-center gap-2">
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span>{item.label}</span>
        {item.badge && (
          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
        {hasChildren && (
          <ChevronDownIcon size={14} className="ml-1" />
        )}
      </div>
    );

    return (
      <div
        key={item.id}
        className="relative"
        onMouseEnter={() => hasChildren && setHoveredMenuItem(item.id)}
        onMouseLeave={() => setHoveredMenuItem(null)}
      >
        <DesktopMenuItemWrapper
          href={item.href && !hasChildren ? item.href : undefined}
          className={clsx(
            menuItemClasses,
            'px-3 py-2',
            level === 0 && 'px-4'
          )}
          onClick={() => !hasChildren && handleMenuItemClick(item)}
          data-menu-item-id={item.id}
        >
          {desktopMenuItemContent}
        </DesktopMenuItemWrapper>
        {hasChildren && (isHovered || isOpen) && (
          <div
            ref={(el) => (submenuRefs.current[item.id] = el)}
            className={clsx(
              'absolute left-0 mt-1 min-w-[200px] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50',
              level > 0 && 'left-full top-0 ml-1'
            )}
            onMouseEnter={() => setHoveredMenuItem(item.id)}
            onMouseLeave={() => setHoveredMenuItem(null)}
          >
            {item.children!.map((child) => renderMenuItem(child, level + 1, false))}
          </div>
        )}
      </div>
    );
  };

  const renderUserAvatar = () => {
    if (!user) return null;

    if (typeof user.avatar === 'string') {
      return (
        <img
          src={user.avatar}
          alt={user.name || 'User'}
          className="h-8 w-8 rounded-full object-cover cursor-pointer border-2 border-gray-300 dark:border-gray-600"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        />
      );
    }

    if (user.avatar) {
      return (
        <div onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="cursor-pointer">
          {user.avatar}
        </div>
      );
    }

    return (
      <div
        className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold cursor-pointer"
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
      >
        {user.name?.[0]?.toUpperCase() || <UserIcon size={16} />}
      </div>
    );
  };

  const headerClasses = clsx(
    'w-full border-b border-gray-200 dark:border-gray-700 transition-colors duration-200',
    variant === 'default' && 'bg-white dark:bg-gray-900',
    variant === 'transparent' && 'bg-transparent',
    variant === 'elevated' && 'bg-white dark:bg-gray-900 shadow-md',
    sticky && 'sticky top-0 z-50',
    className
  );

  return (
    <header ref={headerRef} className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            {renderLogo()}
          </div>

          {/* Desktop Navigation */}
          {!isMobile && menuItems.length > 0 && (
            <nav className="hidden md:flex items-center space-x-1 flex-1 justify-center">
              {menuItems.map((item) => renderMenuItem(item, 0, false))}
            </nav>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            {showThemeToggle && (
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {currentTheme === 'light' ? (
                  <MoonIcon size={20} />
                ) : (
                  <SunIcon size={20} />
                )}
              </button>
            )}

            {/* User Avatar */}
            {user && (
              <div className="relative" ref={userMenuRef}>
                {renderUserAvatar()}
                {isUserMenuOpen && userMenuOptions.length > 0 && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {user.name && (
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.name}
                        </p>
                        {user.email && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    )}
                    {userMenuOptions.map((option) => (
                      <React.Fragment key={option.id}>
                        {option.divider && (
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
                        )}
                        <a
                          href={option.href}
                          onClick={(e) => {
                            if (option.onClick) {
                              e.preventDefault();
                              option.onClick();
                            }
                            setIsUserMenuOpen(false);
                          }}
                          className={clsx(
                            'flex items-center gap-3 px-4 py-2 text-sm transition-colors',
                            option.disabled
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                          )}
                        >
                          {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                          <span>{option.label}</span>
                        </a>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="px-4 py-4 space-y-1">
            {menuItems.map((item) => renderMenuItem(item, 0, true))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default AppHeader;

