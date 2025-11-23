import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';

export interface AccordionItemProps {
    /**
     * Unique identifier for the accordion item
     */
    id?: string;
    /**
     * Header content (title)
     */
    header: React.ReactNode;
    /**
     * Content to display when expanded
     */
    children: React.ReactNode;
    /**
     * Whether the item is initially expanded
     */
    defaultExpanded?: boolean;
    /**
     * Whether the item is disabled
     */
    disabled?: boolean;
    /**
     * Custom expand/collapse icon
     */
    icon?: React.ReactNode;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Custom header className
     */
    headerClassName?: string;
    /**
     * Custom content className
     */
    contentClassName?: string;
}

export interface AccordionProps {
    /**
     * Accordion items
     */
    items: AccordionItemProps[];
    /**
     * Allow multiple items to be expanded at once
     */
    allowMultiple?: boolean;
    /**
     * Controlled expanded items (array of item IDs)
     */
    expandedItems?: string[];
    /**
     * Callback when expansion state changes
     */
    onExpandedChange?: (expandedItems: string[]) => void;
    /**
     * Custom expand/collapse icon for all items
     */
    icon?: React.ReactNode;
    /**
     * Variant style
     */
    variant?: 'default' | 'bordered' | 'filled' | 'minimal';
    /**
     * Size
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Width of the accordion (e.g., '600px', '100%', '50vw')
     */
    width?: string | number;
    /**
     * Custom className
     */
    className?: string;
}

/**
 * Default expand/collapse icon
 */
const DefaultIcon: React.FC<{ expanded: boolean }> = ({ expanded }) => (
    <svg
        className={clsx('w-5 h-5 transition-transform duration-200', expanded && 'rotate-180')}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

/**
 * Accordion Item Component
 */
export const AccordionItem: React.FC<AccordionItemProps & {
    expanded: boolean;
    onToggle: () => void;
    allowMultiple: boolean;
    defaultIcon?: React.ReactNode;
    variant?: 'default' | 'bordered' | 'filled' | 'minimal';
    size?: 'small' | 'medium' | 'large';
    width?: string | number;
}> = ({
    header,
    children,
    expanded,
    onToggle,
    disabled = false,
    icon,
    defaultIcon,
    variant = 'default',
    size = 'medium',
    className,
    headerClassName,
    contentClassName,
    width,
}) => {
        const displayIcon = icon !== undefined ? icon : defaultIcon;

        const variantStyles = {
            default: {
                container: 'border border-gray-200 dark:border-gray-700 rounded-lg',
                header: 'hover:bg-gray-50 dark:hover:bg-gray-800',
                content: 'border-t border-gray-200 dark:border-gray-700',
            },
            bordered: {
                container: 'border-2 border-gray-300 dark:border-gray-600 rounded-lg',
                header: 'hover:bg-gray-100 dark:hover:bg-gray-800',
                content: 'border-t-2 border-gray-300 dark:border-gray-600',
            },
            filled: {
                container: 'bg-gray-50 dark:bg-gray-800 rounded-lg',
                header: 'hover:bg-gray-100 dark:hover:bg-gray-700',
                content: 'bg-white dark:bg-gray-900',
            },
            minimal: {
                container: '',
                header: 'hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg',
                content: '',
            },
        };

        const sizeStyles = {
            small: {
                header: 'px-3 py-2 text-sm',
                content: 'px-3 py-2 text-sm',
            },
            medium: {
                header: 'px-4 py-3 text-base',
                content: 'px-4 py-3 text-base',
            },
            large: {
                header: 'px-5 py-4 text-lg',
                content: 'px-5 py-4 text-lg',
            },
        };

        const styles = variantStyles[variant];
        const sizes = sizeStyles[size];

        const widthStyle = width
            ? { width: typeof width === 'number' ? `${width}px` : width, minWidth: 0, maxWidth: '100%' }
            : { width: '100%', minWidth: 0, maxWidth: '100%' };

        return (
            <div className={clsx('overflow-hidden', styles.container, className)} style={widthStyle}>
                <button
                    type="button"
                    onClick={onToggle}
                    disabled={disabled}
                    className={clsx(
                        'flex items-center justify-between transition-colors',
                        styles.header,
                        sizes.header,
                        disabled && 'opacity-50 cursor-not-allowed',
                        headerClassName
                    )}
                    style={{ width: '100%', minWidth: 0 }}
                    aria-expanded={expanded}
                >
                    <div className="flex-1 text-left font-medium text-gray-900 dark:text-gray-100 min-w-0 overflow-hidden">
                        {header}
                    </div>
                    <div className="ml-4 flex-shrink-0 text-gray-500 dark:text-gray-400">
                        {displayIcon || <DefaultIcon expanded={expanded} />}
                    </div>
                </button>
                {expanded && (
                    <div
                        className={clsx(
                            'overflow-hidden transition-all duration-200',
                            styles.content,
                            contentClassName
                        )}
                        style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}
                    >
                        <div className={clsx(sizes.content, 'text-gray-700 dark:text-gray-300')} style={{ width: '100%', minWidth: 0, maxWidth: '100%', overflow: 'hidden', wordWrap: 'break-word' }}>
                            {children}
                        </div>
                    </div>
                )}
            </div>
        );
    };

/**
 * Accordion Component
 */
export const Accordion: React.FC<AccordionProps> = ({
    items,
    allowMultiple = false,
    expandedItems: controlledExpandedItems,
    onExpandedChange,
    icon,
    variant = 'default',
    size = 'medium',
    width,
    className,
}) => {
    const [internalExpandedItems, setInternalExpandedItems] = useState<string[]>(() => {
        return items.filter((item) => item.defaultExpanded).map((item) => item.id || '');
    });

    const isControlled = controlledExpandedItems !== undefined;
    const expandedItems = isControlled ? controlledExpandedItems : internalExpandedItems;

    const handleToggle = useCallback(
        (itemId: string) => {
            if (isControlled) {
                if (allowMultiple) {
                    const newExpanded = expandedItems.includes(itemId)
                        ? expandedItems.filter((id) => id !== itemId)
                        : [...expandedItems, itemId];
                    onExpandedChange?.(newExpanded);
                } else {
                    const newExpanded = expandedItems.includes(itemId) ? [] : [itemId];
                    onExpandedChange?.(newExpanded);
                }
            } else {
                if (allowMultiple) {
                    const newExpanded = expandedItems.includes(itemId)
                        ? expandedItems.filter((id) => id !== itemId)
                        : [...expandedItems, itemId];
                    setInternalExpandedItems(newExpanded);
                    onExpandedChange?.(newExpanded);
                } else {
                    const newExpanded = expandedItems.includes(itemId) ? [] : [itemId];
                    setInternalExpandedItems(newExpanded);
                    onExpandedChange?.(newExpanded);
                }
            }
        },
        [allowMultiple, expandedItems, isControlled, onExpandedChange]
    );

    const widthStyle = width
        ? { width: typeof width === 'number' ? `${width}px` : width, minWidth: 0, maxWidth: '100%' }
        : { width: '100%', minWidth: 0, maxWidth: '100%' };

    return (
        <div className={clsx('space-y-2', className)} style={widthStyle}>
            {items.map((item, index) => {
                const itemId = item.id || `accordion-item-${index}`;
                const isExpanded = expandedItems.includes(itemId);

                return (
                    <AccordionItem
                        key={itemId}
                        {...item}
                        id={itemId}
                        expanded={isExpanded}
                        onToggle={() => handleToggle(itemId)}
                        allowMultiple={allowMultiple}
                        defaultIcon={icon ? <DefaultIcon expanded={isExpanded} /> : undefined}
                        variant={variant}
                        size={size}
                        width={width}
                    />
                );
            })}
        </div>
    );
};

export default Accordion;

