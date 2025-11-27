import React, { useEffect, useRef } from 'react';
import { clsx } from 'clsx';

export type SidebarPosition = 'left' | 'right';
export type SidebarVariant = 'overlay' | 'push';

export interface SidebarProps {
  /**
   * Whether sidebar is open
   */
  isOpen: boolean;
  /**
   * Callback when sidebar should close
   */
  onClose?: () => void;
  /**
   * Whether sidebar is collapsed (shows simplified version)
   */
  collapsed?: boolean;
  /**
   * Callback when collapse state changes
   */
  onCollapseChange?: (collapsed: boolean) => void;
  /**
   * Position of the sidebar
   */
  position?: SidebarPosition;
  /**
   * Width of the sidebar when expanded (in pixels or CSS units)
   */
  width?: string | number;
  /**
   * Width of the sidebar when collapsed (in pixels or CSS units)
   */
  collapsedWidth?: string | number;
  /**
   * Complex UI content to render (render prop)
   */
  children?: React.ReactNode;
  /**
   * Simplified content to show when collapsed (render prop)
   */
  collapsedContent?: React.ReactNode;
  /**
   * Whether to show backdrop/overlay
   */
  showBackdrop?: boolean;
  /**
   * Backdrop click handler
   */
  onBackdropClick?: () => void;
  /**
   * Whether sidebar is closeable
   */
  closeable?: boolean;
  /**
   * Custom close icon
   */
  closeIcon?: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Additional CSS classes for collapsed state
   */
  collapsedClassName?: string;
  /**
   * Animation duration in milliseconds
   */
  animationDuration?: number;
  /**
   * Whether to close on escape key
   */
  closeOnEscape?: boolean;
  /**
   * Variant: overlay or push
   */
  variant?: SidebarVariant;
}

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CollapseIcon = ({ collapsed, position = 'left' }: { collapsed: boolean; position?: 'left' | 'right' }) => {
  // For left sidebar: when expanded, show left arrow (to collapse); when collapsed, show right arrow (to expand)
  // For right sidebar: when expanded, show right arrow (to collapse); when collapsed, show left arrow (to expand)
  const isLeft = position === 'left';
  const shouldPointRight = isLeft ? collapsed : !collapsed;
  
  return (
    <svg
      className="w-5 h-5 transition-transform duration-200"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={shouldPointRight ? 'M9 5l7 7-7 7' : 'M15 19l-7-7 7-7'}
      />
    </svg>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  collapsed = false,
  onCollapseChange,
  position = 'left',
  width = 320,
  collapsedWidth = 64,
  children,
  collapsedContent,
  showBackdrop = true,
  onBackdropClick,
  closeable = true,
  closeIcon,
  className,
  collapsedClassName,
  animationDuration = 300,
  closeOnEscape = true,
  variant = 'overlay',
}) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when sidebar is open (overlay variant only)
  useEffect(() => {
    if (variant === 'overlay' && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, variant]);

  const handleBackdropClick = () => {
    if (onBackdropClick) {
      onBackdropClick();
    } else {
      onClose?.();
    }
  };

  const handleCollapseToggle = () => {
    onCollapseChange?.(!collapsed);
  };

  const widthValue = collapsed ? collapsedWidth : width;
  const widthStyle =
    typeof widthValue === 'number' ? `${widthValue}px` : widthValue;

  const isLeft = position === 'left';

  if (!isOpen && variant === 'overlay') {
    return null;
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && variant === 'overlay' && showBackdrop && (
        <div
          className={clsx(
            'fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity',
            isOpen ? 'opacity-100' : 'opacity-0'
          )}
          style={{ transitionDuration: `${animationDuration}ms` }}
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={clsx(
          'fixed top-0 bottom-0 z-50',
          'bg-white dark:bg-gray-900',
          'border-r dark:border-gray-800',
          'shadow-xl',
          'transition-all ease-in-out',
          'flex flex-col',
          variant === 'overlay' ? 'h-full' : '',
          isLeft
            ? clsx(
                'left-0',
                variant === 'overlay'
                  ? isOpen
                    ? 'translate-x-0'
                    : '-translate-x-full'
                  : ''
              )
            : clsx(
                'right-0 border-r-0 border-l dark:border-gray-800',
                variant === 'overlay'
                  ? isOpen
                    ? 'translate-x-0'
                    : 'translate-x-full'
                  : ''
              ),
          className,
          collapsed && collapsedClassName
        )}
        style={{
          width: widthStyle,
          transitionDuration: `${animationDuration}ms`,
        }}
        role="dialog"
        aria-modal={variant === 'overlay'}
        aria-label="Sidebar"
      >
        {/* Header */}
        <div
          className={clsx(
            'flex items-center justify-between p-4 border-b dark:border-gray-800',
            collapsed && 'justify-center'
          )}
        >
          {!collapsed && (
            <div className="flex-1 min-w-0">
              {/* Space for title or custom header content */}
            </div>
          )}

          <div className="flex items-center gap-2">
            {/* Collapse toggle button */}
            {onCollapseChange && (
              <button
                onClick={handleCollapseToggle}
                className={clsx(
                  'p-2 rounded-md',
                  'text-gray-600 dark:text-gray-400',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  collapsed && 'mx-auto'
                )}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              >
                <CollapseIcon collapsed={collapsed} position={position} />
              </button>
            )}

            {/* Close button */}
            {closeable && !collapsed && (
              <button
                onClick={onClose}
                className={clsx(
                  'p-2 rounded-md',
                  'text-gray-600 dark:text-gray-400',
                  'hover:bg-gray-100 dark:hover:bg-gray-800',
                  'transition-colors',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
                aria-label="Close sidebar"
              >
                {closeIcon || <CloseIcon />}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {collapsed ? (
            <div className="flex flex-col items-center py-4 space-y-4">
              {collapsedContent || (
                <div className="text-gray-400 dark:text-gray-600 text-xs text-center px-2">
                  Collapsed
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">{children}</div>
          )}
        </div>
      </div>
    </>
  );
};

