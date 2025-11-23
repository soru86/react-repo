import React, { useState, useCallback, useMemo, useRef } from 'react';
import { List as VirtualizedList, AutoSizer, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import { clsx } from 'clsx';
import { Checkbox } from '../Checkbox/Checkbox';
import { Button } from '../Button/Button';

export interface ListItem {
    /**
     * Unique identifier for the item
     */
    id: string;
    /**
     * Primary text content
     */
    label: string;
    /**
     * Secondary text content
     */
    secondaryText?: string;
    /**
     * Icon to display (folder icon, file icon, etc.)
     */
    icon?: React.ReactNode;
    /**
     * Whether this item is a folder (expandable)
     */
    isFolder?: boolean;
    /**
     * Whether folder is expanded
     */
    expanded?: boolean;
    /**
     * Nested items (children)
     */
    children?: ListItem[];
    /**
     * Action buttons for this item
     */
    actions?: Array<{
        label: string;
        icon?: React.ReactNode;
        onClick: (item: ListItem) => void;
        variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
        disabled?: boolean;
    }>;
    /**
     * Whether item is disabled
     */
    disabled?: boolean;
    /**
     * Custom className for item
     */
    className?: string;
    /**
     * Additional data
     */
    data?: any;
}

export interface FlatListItem extends ListItem {
    depth: number;
    flatIndex: number;
    isGroupHeader?: boolean;
    groupTitle?: string;
}

export interface ListGroup {
    /**
     * Group title
     */
    title: string;
    /**
     * Items in this group
     */
    items: ListItem[];
    /**
     * Whether group is sticky
     */
    sticky?: boolean;
}

export interface ListProps {
    /**
     * List items (flat structure)
     */
    items?: ListItem[];
    /**
     * List groups (grouped structure with dividers)
     */
    groups?: ListGroup[];
    /**
     * Height of the list container
     */
    height?: number;
    /**
     * Width of the list container
     */
    width?: number;
    /**
     * Row height in pixels (fixed) or 'auto' for dynamic
     */
    rowHeight?: number | 'auto';
    /**
     * Indentation for nested items (in pixels)
     */
    indentSize?: number;
    /**
     * Whether to show checkboxes for multi-selection
     */
    showCheckboxes?: boolean;
    /**
     * Selected item IDs
     */
    selectedItems?: string[];
    /**
     * Callback when selection changes
     */
    onSelectionChange?: (selectedIds: string[]) => void;
    /**
     * Whether to allow multi-selection with CTRL/CMD
     */
    allowMultiSelect?: boolean;
    /**
     * Callback when item is clicked
     */
    onItemClick?: (item: ListItem, index: number) => void;
    /**
     * Callback when folder is expanded/collapsed
     */
    onFolderToggle?: (item: ListItem, expanded: boolean) => void;
    /**
     * Size variant
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Variant style
     */
    variant?: 'default' | 'bordered' | 'filled';
    /**
     * Whether to show hover effects
     */
    hoverable?: boolean;
    /**
     * Pagination configuration
     */
    pagination?: {
        pageSize: number;
        currentPage: number;
        onPageChange: (page: number) => void;
        showPageInfo?: boolean;
    };
    /**
     * Custom className
     */
    className?: string;
    /**
     * Whether to use auto-sizing
     */
    autoSize?: boolean;
}

/**
 * Flatten nested items into a single array with depth tracking
 */
const flattenItems = (
    items: ListItem[],
    expandedItems: Set<string>,
    depth: number = 0,
    indentSize: number = 20
): FlatListItem[] => {
    const result: FlatListItem[] = [];
    let index = 0;

    items.forEach((item) => {
        const isExpanded = !item.isFolder || expandedItems.has(item.id);

        result.push({
            ...item,
            depth,
            flatIndex: index++,
        });

        if (item.isFolder && isExpanded && item.children) {
            const children = flattenItems(item.children, expandedItems, depth + 1, indentSize);
            result.push(...children);
        }
    });

    return result;
};

/**
 * Flatten groups into items with group headers
 */
const flattenGroups = (
    groups: ListGroup[],
    expandedItems: Set<string>,
    indentSize: number = 20
): FlatListItem[] => {
    const result: FlatListItem[] = [];
    let index = 0;

    groups.forEach((group) => {
        // Add group header
        result.push({
            id: `group-${group.title}`,
            label: group.title,
            depth: 0,
            flatIndex: index++,
            isGroupHeader: true,
            groupTitle: group.title,
            isFolder: false,
        } as FlatListItem);

        // Add group items
        const groupItems = flattenItems(group.items, expandedItems, 0, indentSize);
        groupItems.forEach((item) => {
            result.push({
                ...item,
                flatIndex: index++,
                groupTitle: group.title,
            });
        });
    });

    return result;
};

/**
 * List Component with react-virtualized
 */
export const List: React.FC<ListProps> = ({
    items = [],
    groups,
    height = 400,
    width,
    rowHeight = 48,
    indentSize = 20,
    showCheckboxes = false,
    selectedItems = [],
    onSelectionChange,
    allowMultiSelect = true,
    onItemClick,
    onFolderToggle,
    size = 'medium',
    variant = 'default',
    hoverable = true,
    pagination,
    className,
    autoSize = true,
}) => {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null);
    const listRef = useRef<VirtualizedList>(null);
    const cacheRef = useRef<CellMeasurerCache>(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: typeof rowHeight === 'number' ? rowHeight : 48,
        })
    );

    // Flatten items based on structure
    const flatItems = useMemo(() => {
        if (groups && groups.length > 0) {
            return flattenGroups(groups, expandedItems, indentSize);
        }
        return flattenItems(items, expandedItems, 0, indentSize);
    }, [items, groups, expandedItems, indentSize]);

    // Apply pagination
    const paginatedItems = useMemo(() => {
        if (!pagination) return flatItems;
        const start = (pagination.currentPage - 1) * pagination.pageSize;
        const end = start + pagination.pageSize;
        return flatItems.slice(start, end);
    }, [flatItems, pagination]);

    // Size classes
    const sizeClasses = {
        small: {
            row: 'px-3 py-1.5 text-sm',
            icon: 'w-4 h-4',
            secondary: 'text-xs',
        },
        medium: {
            row: 'px-4 py-2 text-base',
            icon: 'w-5 h-5',
            secondary: 'text-sm',
        },
        large: {
            row: 'px-5 py-3 text-lg',
            icon: 'w-6 h-6',
            secondary: 'text-base',
        },
    };

    // Variant classes
    const variantClasses = {
        default: {
            container: 'border border-gray-200 dark:border-gray-700 rounded-lg',
            row: 'border-b border-gray-100 dark:border-gray-700 last:border-b-0',
            hover: hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : '',
        },
        bordered: {
            container: 'border-2 border-gray-300 dark:border-gray-600 rounded-lg',
            row: 'border-b-2 border-gray-200 dark:border-gray-700 last:border-b-0',
            hover: hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : '',
        },
        filled: {
            container: 'bg-gray-50 dark:bg-gray-800 rounded-lg',
            row: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
            hover: hoverable ? 'hover:bg-gray-100 dark:hover:bg-gray-700' : '',
        },
    };

    const sizes = sizeClasses[size];
    const variants = variantClasses[variant];

    // Handle folder toggle
    const handleFolderToggle = useCallback(
        (item: ListItem) => {
            if (!item.isFolder || item.disabled) return;

            const newExpanded = new Set(expandedItems);
            if (newExpanded.has(item.id)) {
                newExpanded.delete(item.id);
            } else {
                newExpanded.add(item.id);
            }
            setExpandedItems(newExpanded);
            onFolderToggle?.(item, newExpanded.has(item.id));

            // Invalidate cache for dynamic heights
            if (rowHeight === 'auto') {
                cacheRef.current.clearAll();
                listRef.current?.recomputeRowHeights();
            }
        },
        [expandedItems, onFolderToggle, rowHeight]
    );

    // Handle item click
    const handleItemClick = useCallback(
        (item: FlatListItem, index: number, event: React.MouseEvent) => {
            if (item.disabled || item.isGroupHeader) return;

            // Handle folder toggle
            if (item.isFolder) {
                handleFolderToggle(item);
                return;
            }

            // Handle selection
            if (showCheckboxes || allowMultiSelect) {
                const isCtrlOrCmd = event.ctrlKey || event.metaKey;
                const isShift = event.shiftKey;

                if (showCheckboxes) {
                    // Toggle selection
                    const newSelected = selectedItems.includes(item.id)
                        ? selectedItems.filter((id) => id !== item.id)
                        : [...selectedItems, item.id];
                    onSelectionChange?.(newSelected);
                } else if (allowMultiSelect && isCtrlOrCmd) {
                    // Multi-select with CTRL/CMD
                    const newSelected = selectedItems.includes(item.id)
                        ? selectedItems.filter((id) => id !== item.id)
                        : [...selectedItems, item.id];
                    onSelectionChange?.(newSelected);
                    setLastSelectedIndex(index);
                } else if (allowMultiSelect && isShift && lastSelectedIndex !== null) {
                    // Range select with SHIFT
                    const start = Math.min(lastSelectedIndex, index);
                    const end = Math.max(lastSelectedIndex, index);
                    const rangeIds = paginatedItems.slice(start, end + 1).map((i) => i.id);
                    const newSelected = Array.from(new Set([...selectedItems, ...rangeIds]));
                    onSelectionChange?.(newSelected);
                } else {
                    // Single select
                    onSelectionChange?.([item.id]);
                    setLastSelectedIndex(index);
                }
            }

            onItemClick?.(item, index);
        },
        [
            selectedItems,
            onSelectionChange,
            showCheckboxes,
            allowMultiSelect,
            lastSelectedIndex,
            paginatedItems,
            handleFolderToggle,
            onItemClick,
        ]
    );

    // Handle checkbox change
    const handleCheckboxChange = useCallback(
        (item: ListItem, checked: boolean) => {
            if (item.disabled) return;

            const newSelected = checked
                ? [...selectedItems, item.id]
                : selectedItems.filter((id) => id !== item.id);
            onSelectionChange?.(newSelected);
        },
        [selectedItems, onSelectionChange]
    );

    // Render row content
    const renderRowContent = useCallback(
        (item: FlatListItem, index: number) => {
            const isSelected = selectedItems.includes(item.id);
            const isGroupHeader = item.isGroupHeader;
            const isExpanded = item.isFolder && expandedItems.has(item.id);
            const indent = item.depth * indentSize;
            const paddingValue = size === 'small' ? 12 : size === 'large' ? 20 : 16;

            if (isGroupHeader) {
                return (
                    <div
                        className={clsx(
                            'sticky top-0 z-10 bg-gray-100 dark:bg-gray-800 font-semibold text-gray-700 dark:text-gray-200',
                            sizes.row,
                            variants.row
                        )}
                        style={{ paddingLeft: `${indent + paddingValue}px` }}
                    >
                        {item.label}
                    </div>
                );
            }

            return (
                <div
                    className={clsx(
                        'flex items-center gap-3 transition-colors cursor-pointer',
                        sizes.row,
                        variants.row,
                        variants.hover,
                        isSelected && 'bg-blue-50 dark:bg-blue-900/30',
                        item.disabled && 'opacity-50 cursor-not-allowed',
                        item.className
                    )}
                    style={{ paddingLeft: `${indent + paddingValue}px` }}
                    onClick={(e) => handleItemClick(item, index, e)}
                >
                    {/* Checkbox */}
                    {showCheckboxes && (
                        <div className="flex-shrink-0">
                            <Checkbox
                                checked={isSelected}
                                onChange={(e) => handleCheckboxChange(item, e.target.checked)}
                                disabled={item.disabled}
                                size={size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium'}
                            />
                        </div>
                    )}

                    {/* Folder expand/collapse icon */}
                    {item.isFolder && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFolderToggle(item);
                            }}
                            className="flex-shrink-0 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                            disabled={item.disabled}
                        >
                            <svg
                                className={clsx(
                                    sizes.icon,
                                    'transition-transform',
                                    isExpanded && 'rotate-90'
                                )}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Item icon */}
                    {item.icon && (
                        <div className={clsx('flex-shrink-0 text-gray-500 dark:text-gray-400', sizes.icon)}>
                            {item.icon}
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{item.label}</div>
                        {item.secondaryText && (
                            <div className={clsx('text-gray-500 dark:text-gray-400 truncate', sizes.secondary)}>
                                {item.secondaryText}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    {item.actions && item.actions.length > 0 && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                            {item.actions.map((action, idx) => (
                                <Button
                                    key={idx}
                                    size="small"
                                    variant={action.variant || 'secondary'}
                                    iconOnly
                                    icon={action.icon}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(item);
                                    }}
                                    disabled={action.disabled || item.disabled}
                                    title={action.label}
                                />
                            ))}
                        </div>
                    )}
                </div>
            );
        },
        [
            selectedItems,
            showCheckboxes,
            handleCheckboxChange,
            handleFolderToggle,
            handleItemClick,
            sizes,
            variants,
            size,
            indentSize,
            expandedItems,
        ]
    );

    // Row renderer for react-virtualized
    const rowRenderer = useCallback(
        ({ index, key, style, parent }: any) => {
            const item = paginatedItems[index];
            if (!item) return null;

            const content = renderRowContent(item, index);

            if (rowHeight === 'auto') {
                return (
                    <CellMeasurer cache={cacheRef.current} columnIndex={0} key={key} parent={parent} rowIndex={index}>
                        <div key={key} style={style}>
                            {content}
                        </div>
                    </CellMeasurer>
                );
            }

            return (
                <div key={key} style={style}>
                    {content}
                </div>
            );
        },
        [paginatedItems, renderRowContent, rowHeight]
    );

    // Calculate dynamic row height
    const getRowHeight = useCallback(
        ({ index }: { index: number }): number => {
            if (rowHeight === 'auto') {
                return cacheRef.current.getHeight(index, 0) || 48;
            }
            return rowHeight;
        },
        [rowHeight]
    );

    const totalPages = pagination
        ? Math.ceil(flatItems.length / pagination.pageSize)
        : 1;

    const listContent = autoSize && !width ? (
        <div className={clsx(variants.container, className)} style={{ height: '100%', width: '100%', minHeight: height || 400, position: 'relative' }}>
            <div style={{ height: '100%', width: '100%' }}>
                <AutoSizer>
                    {({ height: autoHeight, width: autoWidth }) => {
                        // Use fallback dimensions if AutoSizer returns 0
                        const finalHeight = autoHeight > 0 ? autoHeight : (height || 400);
                        const finalWidth = autoWidth > 0 ? autoWidth : (typeof width === 'number' ? width : 800);

                        return (
                            <VirtualizedList
                                ref={listRef}
                                height={finalHeight}
                                width={finalWidth}
                                rowCount={paginatedItems.length}
                                rowHeight={getRowHeight}
                                rowRenderer={rowRenderer}
                                overscanRowCount={5}
                            />
                        );
                    }}
                </AutoSizer>
            </div>
        </div>
    ) : (
        <div className={clsx('overflow-hidden', variants.container, className)}>
            <VirtualizedList
                ref={listRef}
                height={height}
                width={typeof width === 'number' ? width : width || 800}
                rowCount={paginatedItems.length}
                rowHeight={getRowHeight}
                rowRenderer={rowRenderer}
                overscanRowCount={5}
            />
        </div>
    );

    if (pagination) {
        return (
            <div className="flex flex-col gap-2">
                {listContent}
                <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                        {pagination.showPageInfo &&
                            `Showing ${(pagination.currentPage - 1) * pagination.pageSize + 1} to ${Math.min(
                                pagination.currentPage * pagination.pageSize,
                                flatItems.length
                            )} of ${flatItems.length} items`}
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                        >
                            Previous
                        </Button>
                        <span className="px-2">
                            Page {pagination.currentPage} of {totalPages}
                        </span>
                        <Button
                            size="small"
                            variant="secondary"
                            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                            disabled={pagination.currentPage >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return listContent;
};

export default List;

