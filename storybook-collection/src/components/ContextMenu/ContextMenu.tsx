import React, { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

export interface ContextMenuItem {
    /**
     * Menu item label
     */
    label: string;
    /**
     * Menu item icon
     */
    icon?: React.ReactNode;
    /**
     * Menu item action/command
     */
    command?: () => void;
    /**
     * Submenu items
     */
    items?: ContextMenuItem[];
    /**
     * Whether item is disabled
     */
    disabled?: boolean;
    /**
     * Whether item is visible
     */
    visible?: boolean;
    /**
     * Separator before this item
     */
    separator?: boolean;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Custom content renderer
     */
    template?: React.ReactNode;
}

export interface ContextMenuProps {
    /**
     * Target element(s) to attach context menu to
     */
    children?: React.ReactNode;
    /**
     * Menu items to display
     */
    model?: ContextMenuItem[];
    /**
     * Function to get menu items dynamically based on context
     */
    getItems?: (event: React.MouseEvent | React.TouchEvent, context?: any) => ContextMenuItem[];
    /**
     * Additional context data passed to getItems
     */
    context?: any;
    /**
     * Whether context menu is visible
     */
    visible?: boolean;
    /**
     * Callback when menu is shown
     */
    onShow?: () => void;
    /**
     * Callback when menu is hidden
     */
    onHide?: () => void;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Whether to append menu to body
     */
    appendTo?: 'body' | 'self';
    /**
     * Base z-index for the menu
     */
    baseZIndex?: number;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
    children,
    model = [],
    getItems,
    context,
    visible: controlledVisible,
    onShow,
    onHide,
    className,
    appendTo = 'body',
    baseZIndex = 1000,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [menuItems, setMenuItems] = useState<ContextMenuItem[]>([]);
    const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const submenuRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const clickedInsideRef = useRef(false);

    const isControlled = controlledVisible !== undefined;
    const visible = isControlled ? controlledVisible : isVisible;

    // Filter visible items
    const filteredItems = menuItems.filter((item) => item.visible !== false);

    const handleContextMenu = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const items = getItems ? getItems(e, context) : model;
            setMenuItems(items);

            const x = e.clientX;
            const y = e.clientY;

            setPosition({ x, y });
            if (!isControlled) {
                setIsVisible(true);
            }
            onShow?.();
        },
        [getItems, context, model, isControlled, onShow]
    );

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            const touch = e.touches[0];
            const target = e.currentTarget as HTMLElement;

            const touchTimer = setTimeout(() => {
                e.preventDefault();
                const items = getItems ? getItems(e, context) : model;
                setMenuItems(items);

                const x = touch.clientX;
                const y = touch.clientY;

                setPosition({ x, y });
                if (!isControlled) {
                    setIsVisible(true);
                }
                onShow?.();
            }, 500); // Long press duration

            const handleTouchEnd = () => {
                clearTimeout(touchTimer);
                target.removeEventListener('touchend', handleTouchEnd);
                target.removeEventListener('touchmove', handleTouchMove);
            };

            const handleTouchMove = () => {
                clearTimeout(touchTimer);
                target.removeEventListener('touchend', handleTouchEnd);
                target.removeEventListener('touchmove', handleTouchMove);
            };

            target.addEventListener('touchend', handleTouchEnd);
            target.addEventListener('touchmove', handleTouchMove);
        },
        [getItems, context, model, isControlled, onShow]
    );

    const hideMenu = useCallback(() => {
        if (!isControlled) {
            setIsVisible(false);
        }
        setActiveSubmenu(null);
        onHide?.();
    }, [isControlled, onHide]);

  const handleItemMouseDown = useCallback((e: React.MouseEvent) => {
    // Mark that we're clicking inside the menu - this happens before click
    clickedInsideRef.current = true;
  }, []);

  const handleItemClick = useCallback(
    (item: ContextMenuItem, e: React.MouseEvent) => {
      // Stop all propagation to prevent outside click handler from firing
      e.preventDefault();
      e.stopPropagation();
      
      // Also stop on native event to prevent document-level handlers
      const nativeEvent = e.nativeEvent;
      if (nativeEvent.stopImmediatePropagation) {
        nativeEvent.stopImmediatePropagation();
      }

      if (item.disabled) {
        clickedInsideRef.current = false;
        return;
      }

      if (item.items && item.items.length > 0) {
        // Toggle submenu - don't close menu
        const itemId = item.label;
        setActiveSubmenu(activeSubmenu === itemId ? null : itemId);
        // Keep flag true since we're still in the menu
      } else {
        // Execute command BEFORE hiding menu - this is critical
        if (item.command) {
          // Execute synchronously to ensure it runs before menu closes
          item.command();
        }
        // Hide menu after command executes
        hideMenu();
        // Reset flag
        clickedInsideRef.current = false;
      }
    },
    [activeSubmenu, hideMenu]
  );

  // Close menu on outside click
  useEffect(() => {
    if (!visible) return;

    // Track mousedown to set flag early
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && menuRef.current.contains(e.target as Node)) {
        clickedInsideRef.current = true;
      } else {
        clickedInsideRef.current = false;
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      
      // First check the flag - if set, menu item was clicked
      if (clickedInsideRef.current) {
        // Reset flag and don't close - menu item handler will handle it
        clickedInsideRef.current = false;
        return;
      }
      
      // Then check if click is actually outside the menu element
      if (menuRef.current && !menuRef.current.contains(target)) {
        // Click is outside - close the menu
        hideMenu();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        hideMenu();
      }
    };

    // Use mousedown in capture phase to set flag early
    // Use click in bubble phase (not capture) so React handlers fire first
    document.addEventListener('mousedown', handleMouseDown, true);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [visible, hideMenu]);

    // Adjust menu position if it goes off-screen
    useEffect(() => {
        if (!visible || !menuRef.current) return;

        const menu = menuRef.current;
        const rect = menu.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let adjustedX = position.x;
        let adjustedY = position.y;

        // Adjust horizontal position
        if (rect.right > viewportWidth) {
            adjustedX = viewportWidth - rect.width - 10;
        }
        if (adjustedX < 10) {
            adjustedX = 10;
        }

        // Adjust vertical position
        if (rect.bottom > viewportHeight) {
            adjustedY = viewportHeight - rect.height - 10;
        }
        if (adjustedY < 10) {
            adjustedY = 10;
        }

        if (adjustedX !== position.x || adjustedY !== position.y) {
            setPosition({ x: adjustedX, y: adjustedY });
        }
    }, [visible, position]);

    const renderMenuItem = (item: ContextMenuItem, index: number) => {
        if (item.separator) {
            return (
                <div
                    key={`separator-${index}`}
                    className="my-1 border-t border-gray-200 dark:border-gray-700"
                />
            );
        }

        const hasSubmenu = item.items && item.items.length > 0;
        const isSubmenuActive = activeSubmenu === item.label;

        return (
            <div key={`${item.label}-${index}`}>
                <div
                    onClick={(e) => handleItemClick(item, e)}
                    onMouseDown={handleItemMouseDown}
                    onMouseEnter={() => {
                        if (hasSubmenu) {
                            setActiveSubmenu(item.label);
                        }
                    }}
                    className={clsx(
                        'px-4 py-2 flex items-center gap-3',
                        'text-sm text-gray-700 dark:text-gray-300',
                        'hover:bg-gray-100 dark:hover:bg-gray-700',
                        'cursor-pointer transition-colors',
                        'select-none',
                        item.disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
                        item.className
                    )}
                    role="menuitem"
                    tabIndex={item.disabled ? -1 : 0}
                >
                    {item.template ? (
                        item.template
                    ) : (
                        <>
                            {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                            <span className="flex-1">{item.label}</span>
                            {hasSubmenu && (
                                <svg
                                    className="w-4 h-4 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            )}
                        </>
                    )}
                </div>

                {/* Submenu */}
                {hasSubmenu && isSubmenuActive && (
                    <div
                        ref={(el) => {
                            if (el) {
                                submenuRefs.current.set(item.label, el);
                            }
                        }}
                        className={clsx(
                            'absolute left-full top-0 ml-1',
                            'bg-white dark:bg-gray-800',
                            'border border-gray-200 dark:border-gray-700',
                            'rounded-md shadow-lg',
                            'min-w-[200px]',
                            'z-50',
                            'py-1'
                        )}
                        style={{ zIndex: baseZIndex + 1 }}
                    >
                        {item.items?.map((subItem, subIndex) => renderMenuItem(subItem, subIndex))}
                    </div>
                )}
            </div>
        );
    };

    const menuContent = (
        <div
            ref={menuRef}
            className={clsx(
                'context-menu',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'rounded-md shadow-lg',
                'min-w-[200px]',
                'py-1',
                'max-h-[400px] overflow-y-auto',
                !visible && 'hidden',
                className
            )}
            style={{
                position: 'fixed',
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: baseZIndex,
            }}
            role="menu"
        >
            {filteredItems.length === 0 ? (
                <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No items available
                </div>
            ) : (
                filteredItems.map((item, index) => renderMenuItem(item, index))
            )}
        </div>
    );

    return (
        <>
            <div
                onContextMenu={handleContextMenu}
                onTouchStart={handleTouchStart}
                className="context-menu-target"
            >
                {children}
            </div>
            {appendTo === 'body' ? (
                visible && (
                    <div
                        style={{
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            width: '100vw',
                            height: '100vh',
                            zIndex: baseZIndex - 1,
                            pointerEvents: 'none',
                        }}
                    >
                        {menuContent}
                    </div>
                )
            ) : (
                menuContent
            )}
        </>
    );
};

