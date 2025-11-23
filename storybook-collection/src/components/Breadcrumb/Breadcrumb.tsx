import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Chip } from '../Chip/Chip';

export type BreadcrumbVariant = 'default' | 'bordered' | 'filled';
export type BreadcrumbSeparator = '/' | '>' | '→' | '•' | '|' | React.ReactNode;
export type BreadcrumbColor = 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type BreadcrumbCollapseMode = 'none' | 'expandable' | 'menu';

export interface BreadcrumbItem {
    /**
     * Label text for the breadcrumb item
     */
    label: string;
    /**
     * Optional href/link for the breadcrumb item
     */
    href?: string;
    /**
     * Optional click handler
     */
    onClick?: () => void;
    /**
     * Whether this item is disabled
     */
    disabled?: boolean;
    /**
     * Optional icon to display before the label
     */
    icon?: React.ReactNode;
}

export interface BreadcrumbProps {
    /**
     * Array of breadcrumb items
     */
    items: BreadcrumbItem[];
    /**
     * Visual variant
     */
    variant?: BreadcrumbVariant;
    /**
     * Color scheme
     */
    color?: BreadcrumbColor;
    /**
     * Separator between items
     */
    separator?: BreadcrumbSeparator;
    /**
     * Maximum number of items to show (others will be collapsed)
     */
    maxItems?: number;
    /**
     * Collapse mode: 'none' (static ellipsis), 'expandable' (click to expand), 'menu' (dropdown menu)
     */
    collapseMode?: BreadcrumbCollapseMode;
    /**
     * Render items as chips instead of plain text
     */
    renderAsChip?: boolean;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Custom item className
     */
    itemClassName?: string;
    /**
     * Custom separator className
     */
    separatorClassName?: string;
}

/**
 * Breadcrumb Component
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
    items,
    variant = 'default',
    color = 'default',
    separator = '/',
    maxItems,
    collapseMode = 'none',
    renderAsChip = false,
    className,
    itemClassName,
    separatorClassName,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    // Color styles
    const colorStyles: Record<BreadcrumbColor, { text: string; hover: string; active: string }> = {
        default: {
            text: 'text-gray-700 dark:text-gray-300',
            hover: 'hover:text-gray-900 dark:hover:text-gray-100',
            active: 'text-gray-900 dark:text-gray-100',
        },
        primary: {
            text: 'text-blue-600 dark:text-blue-400',
            hover: 'hover:text-blue-700 dark:hover:text-blue-300',
            active: 'text-blue-700 dark:text-blue-300',
        },
        secondary: {
            text: 'text-gray-600 dark:text-gray-400',
            hover: 'hover:text-gray-800 dark:hover:text-gray-200',
            active: 'text-gray-800 dark:text-gray-200',
        },
        success: {
            text: 'text-green-600 dark:text-green-400',
            hover: 'hover:text-green-700 dark:hover:text-green-300',
            active: 'text-green-700 dark:text-green-300',
        },
        warning: {
            text: 'text-yellow-600 dark:text-yellow-400',
            hover: 'hover:text-yellow-700 dark:hover:text-yellow-300',
            active: 'text-yellow-700 dark:text-yellow-300',
        },
        error: {
            text: 'text-red-600 dark:text-red-400',
            hover: 'hover:text-red-700 dark:hover:text-red-300',
            active: 'text-red-700 dark:text-red-300',
        },
        info: {
            text: 'text-cyan-600 dark:text-cyan-400',
            hover: 'hover:text-cyan-700 dark:hover:text-cyan-300',
            active: 'text-cyan-700 dark:text-cyan-300',
        },
    };

    // Variant styles
    const variantStyles: Record<BreadcrumbVariant, { container: string; item: string }> = {
        default: {
            container: '',
            item: '',
        },
        bordered: {
            container: 'border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2',
            item: '',
        },
        filled: {
            container: 'bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2',
            item: '',
        },
    };

    const colors = colorStyles[color];
    const variants = variantStyles[variant];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                ellipsisRef.current &&
                !ellipsisRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [menuOpen]);

    // Handle maxItems - show first, last, and ellipsis
    const shouldCollapse = maxItems && items.length > maxItems;
    const displayItems = React.useMemo(() => {
        if (!shouldCollapse || expanded || collapseMode === 'menu') {
            // Show all items when expanded or in menu mode (menu handles collapse differently)
            return items;
        }

        // For expandable or none mode, show first, ellipsis placeholder, and last
        const first = items[0];
        const last = items[items.length - 1];
        return [first, { label: '...', disabled: collapseMode === 'none' }, last];
    }, [items, maxItems, shouldCollapse, expanded, collapseMode]);

    // Get middle items for menu
    const middleItems = React.useMemo(() => {
        if (!shouldCollapse || !maxItems) return [];
        return items.slice(1, -1);
    }, [items, maxItems, shouldCollapse]);

    // Render separator
    const renderSeparator = (index: number, totalItems: number) => {
        if (index === totalItems - 1) return null;

        const separatorContent =
            typeof separator === 'string' ? (
                <span className={clsx('mx-2 text-gray-400 dark:text-gray-500', separatorClassName)}>
                    {separator}
                </span>
            ) : (
                separator
            );

        return separatorContent;
    };

    // Render ellipsis button for expandable mode
    const renderExpandableEllipsis = () => {
        if (!shouldCollapse || collapseMode !== 'expandable' || expanded) return null;

        return (
            <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className={clsx(
                    'inline-flex items-center gap-1.5 transition-colors cursor-pointer',
                    colors.text,
                    colors.hover,
                    itemClassName
                )}
                aria-label="Expand breadcrumb"
            >
                <span>...</span>
            </button>
        );
    };

    // Render ellipsis button for menu mode
    const renderMenuEllipsis = () => {
        if (!shouldCollapse || collapseMode !== 'menu' || expanded) return null;

        return (
            <div className="relative">
                <button
                    ref={ellipsisRef}
                    type="button"
                    onClick={() => setMenuOpen(!menuOpen)}
                    className={clsx(
                        'inline-flex items-center gap-1.5 transition-colors cursor-pointer',
                        colors.text,
                        colors.hover,
                        itemClassName
                    )}
                    aria-label="Show more breadcrumb items"
                    aria-expanded={menuOpen}
                >
                    <span>...</span>
                    <svg
                        className={clsx('w-4 h-4 transition-transform', menuOpen && 'rotate-180')}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {menuOpen && (
                    <div
                        ref={menuRef}
                        className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 min-w-[200px] max-h-60 overflow-y-auto"
                    >
                        <ul className="py-1">
                            {middleItems.map((item, index) => (
                                <li key={index}>
                                    {item.href ? (
                                        <a
                                            href={item.href}
                                            onClick={() => {
                                                item.onClick?.();
                                                setMenuOpen(false);
                                            }}
                                            className={clsx(
                                                'block px-4 py-2 text-sm transition-colors',
                                                colors.text,
                                                colors.hover,
                                                'hover:bg-gray-100 dark:hover:bg-gray-700',
                                                item.disabled && 'opacity-50 cursor-not-allowed'
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                                                <span>{item.label}</span>
                                            </div>
                                        </a>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                item.onClick?.();
                                                setMenuOpen(false);
                                            }}
                                            disabled={item.disabled}
                                            className={clsx(
                                                'w-full text-left px-4 py-2 text-sm transition-colors',
                                                colors.text,
                                                colors.hover,
                                                'hover:bg-gray-100 dark:hover:bg-gray-700',
                                                item.disabled && 'opacity-50 cursor-not-allowed'
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                                                <span>{item.label}</span>
                                            </div>
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        );
    };

    // Render item
    const renderItem = (item: BreadcrumbItem, index: number, totalItems: number) => {
        const isLast = index === totalItems - 1;
        const isActive = isLast || item.disabled;

        // Render as chip if requested
        if (renderAsChip) {
            const chipVariantMap: Record<BreadcrumbColor, 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'> = {
                default: 'default',
                primary: 'primary',
                secondary: 'default',
                success: 'success',
                warning: 'warning',
                error: 'error',
                info: 'info',
            };

            return (
                <Chip
                    label={item.label}
                    variant={chipVariantMap[color]}
                    icon={item.icon}
                    clickable={!isActive && !item.disabled && (!!item.href || !!item.onClick)}
                    onClick={() => {
                        if (item.onClick) {
                            item.onClick();
                        }
                    }}
                    disabled={item.disabled || isActive}
                    outlined={variant === 'bordered'}
                    className={itemClassName}
                />
            );
        }

        // Render as regular breadcrumb item
        const baseClasses = clsx(
            'inline-flex items-center gap-1.5 transition-colors',
            colors.text,
            !isActive && !item.disabled && colors.hover,
            isActive && colors.active,
            item.disabled && 'opacity-50 cursor-not-allowed',
            !item.disabled && !isActive && 'cursor-pointer',
            itemClassName
        );

        const content = (
            <>
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
            </>
        );

        if (item.href && !item.disabled && !isActive) {
            return (
                <a href={item.href} className={baseClasses} onClick={item.onClick}>
                    {content}
                </a>
            );
        }

        if (item.onClick && !item.disabled && !isActive) {
            return (
                <button type="button" onClick={item.onClick} className={baseClasses}>
                    {content}
                </button>
            );
        }

        return (
            <span className={baseClasses} aria-current={isActive ? 'page' : undefined}>
                {content}
            </span>
        );
    };

    // Render breadcrumb items
    const renderBreadcrumbItems = () => {
        const renderedItems: React.ReactNode[] = [];

        // Handle menu mode separately
        if (shouldCollapse && collapseMode === 'menu' && !expanded) {
            // Render first item
            renderedItems.push(
                <li key="item-0" className="flex items-center">
                    {renderItem(items[0], 0, items.length)}
                    {renderSeparator(0, items.length)}
                </li>
            );

            // Render menu ellipsis
            const menuEllipsis = renderMenuEllipsis();
            if (menuEllipsis) {
                renderedItems.push(
                    <li key="ellipsis-menu" className="flex items-center">
                        {menuEllipsis}
                        {renderSeparator(0, items.length)}
                    </li>
                );
            }

            // Render last item
            renderedItems.push(
                <li key={`item-${items.length - 1}`} className="flex items-center">
                    {renderItem(items[items.length - 1], items.length - 1, items.length)}
                </li>
            );

            return renderedItems;
        }

        // Handle expandable mode
        if (shouldCollapse && collapseMode === 'expandable' && !expanded) {
            // Render first item
            renderedItems.push(
                <li key="item-0" className="flex items-center">
                    {renderItem(items[0], 0, items.length)}
                    {renderSeparator(0, items.length)}
                </li>
            );

            // Render expandable ellipsis
            const ellipsis = renderExpandableEllipsis();
            if (ellipsis) {
                renderedItems.push(
                    <li key="ellipsis-expandable" className="flex items-center">
                        {ellipsis}
                        {renderSeparator(0, items.length)}
                    </li>
                );
            }

            // Render last item
            renderedItems.push(
                <li key={`item-${items.length - 1}`} className="flex items-center">
                    {renderItem(items[items.length - 1], items.length - 1, items.length)}
                </li>
            );

            return renderedItems;
        }

        // Render all items (expanded or no collapse)
        return displayItems.map((item, index) => (
            <li key={`item-${index}`} className="flex items-center">
                {renderItem(item, index, displayItems.length)}
                {renderSeparator(index, displayItems.length)}
            </li>
        ));
    };

    return (
        <nav aria-label="Breadcrumb" className={clsx('flex items-center flex-wrap', variants.container, className)}>
            <ol className="flex items-center flex-wrap gap-1">
                {renderBreadcrumbItems()}
            </ol>
        </nav>
    );
};

export default Breadcrumb;

