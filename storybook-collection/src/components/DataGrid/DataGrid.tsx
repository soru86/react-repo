import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';

export interface DataGridColumn<T = any> {
  /**
   * Unique identifier for the column
   */
  id: string;
  /**
   * Column header label
   */
  header: string;
  /**
   * Accessor function or key to get cell value
   */
  accessor: keyof T | ((row: T) => any);
  /**
   * Column width (px or %)
   */
  width?: string | number;
  /**
   * Minimum column width
   */
  minWidth?: number;
  /**
   * Maximum column width
   */
  maxWidth?: number;
  /**
   * Whether column is resizable
   */
  resizable?: boolean;
  /**
   * Whether column is sortable
   */
  sortable?: boolean;
  /**
   * Whether column is filterable/searchable
   */
  filterable?: boolean;
  /**
   * Custom cell renderer
   */
  cell?: (value: any, row: T, index: number) => React.ReactNode;
  /**
   * Custom header renderer
   */
  headerCell?: () => React.ReactNode;
  /**
   * Header icon
   */
  headerIcon?: React.ReactNode;
  /**
   * Column alignment
   */
  align?: 'left' | 'center' | 'right';
  /**
   * Whether column is sticky
   */
  sticky?: boolean;
  /**
   * Additional className for column
   */
  className?: string;
}

export interface DataGridAction<T = any> {
  /**
   * Action label
   */
  label: string;
  /**
   * Action icon
   */
  icon?: React.ReactNode;
  /**
   * Action handler
   */
  onClick: (row: T, index: number) => void;
  /**
   * Whether action is disabled for this row
   */
  disabled?: (row: T) => boolean;
  /**
   * Action variant/color
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

export interface DataGridSubRow<T = any> {
  /**
   * Parent row data
   */
  parentRow: T;
  /**
   * Sub-row data
   */
  data: T[];
  /**
   * Custom renderer for sub-rows
   */
  render?: (subRows: T[], parentRow: T) => React.ReactNode;
}

export interface DataGridProps<T = any> {
  /**
   * Data rows
   */
  data: T[];
  /**
   * Column definitions
   */
  columns: DataGridColumn<T>[];
  /**
   * Action column configuration
   */
  actions?: DataGridAction<T>[];
  /**
   * Sub-rows data
   */
  subRows?: (row: T) => T[] | undefined;
  /**
   * Whether rows are expandable/collapsible
   */
  expandable?: boolean;
  /**
   * Custom expandable content renderer
   */
  expandedContent?: (row: T, index: number) => React.ReactNode;
  /**
   * Enable row selection with checkboxes
   */
  selectable?: boolean;
  /**
   * Selected row IDs
   */
  selectedRows?: (string | number)[];
  /**
   * Callback when selection changes
   */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  /**
   * Row ID getter function
   */
  getRowId?: (row: T, index: number) => string | number;
  /**
   * Enable pagination
   */
  pagination?: boolean;
  /**
   * Items per page
   */
  pageSize?: number;
  /**
   * Current page (controlled)
   */
  page?: number;
  /**
   * Default page (uncontrolled)
   */
  defaultPage?: number;
  /**
   * Callback when page changes
   */
  onPageChange?: (page: number) => void;
  /**
   * Enable alternate row highlighting
   */
  striped?: boolean;
  /**
   * Custom row height
   */
  rowHeight?: number | string;
  /**
   * Custom row className getter
   */
  getRowClassName?: (row: T, index: number) => string;
  /**
   * Custom row style getter
   */
  getRowStyle?: (row: T, index: number) => React.CSSProperties;
  /**
   * Header style
   */
  headerStyle?: React.CSSProperties;
  /**
   * Header className
   */
  headerClassName?: string;
  /**
   * Enable column resizing
   */
  resizable?: boolean;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Variant/theme
   */
  variant?: 'default' | 'bordered' | 'striped';
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Empty state message
   */
  emptyMessage?: string;
  /**
   * Additional className
   */
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

/**
 * DataGrid component with extensive functionality
 */
export function DataGrid<T extends Record<string, any> = any>({
  data,
  columns,
  actions,
  subRows,
  expandable = false,
  expandedContent,
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  getRowId = (row, index) => index,
  pagination = false,
  pageSize = 10,
  page: controlledPage,
  defaultPage = 1,
  onPageChange,
  striped = false,
  rowHeight,
  getRowClassName,
  getRowStyle,
  headerStyle,
  headerClassName,
  resizable = false,
  size = 'medium',
  variant = 'default',
  loading = false,
  emptyMessage = 'No data available',
  className,
}: DataGridProps<T>) {
  const [internalSelectedRows, setInternalSelectedRows] = useState<(string | number)[]>([]);
  const [internalPage, setInternalPage] = useState(defaultPage);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(new Set());
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [isResizing, setIsResizing] = useState<string | null>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartWidth = useRef<number>(0);

  const isControlledSelection = controlledSelectedRows !== undefined;
  const isControlledPage = controlledPage !== undefined;
  const selectedRows = isControlledSelection ? controlledSelectedRows : internalSelectedRows;
  const currentPage = isControlledPage ? controlledPage : internalPage;

  // Size classes
  const sizeClasses = {
    small: {
      cell: 'px-2 py-1 text-xs',
      header: 'px-2 py-1.5 text-xs',
      row: 'h-8',
    },
    medium: {
      cell: 'px-4 py-2 text-sm',
      header: 'px-4 py-3 text-sm',
      row: 'h-12',
    },
    large: {
      cell: 'px-6 py-3 text-base',
      header: 'px-6 py-4 text-base',
      row: 'h-16',
    },
  };

  const sizes = sizeClasses[size];

  // Get cell value
  const getCellValue = useCallback((row: T, accessor: keyof T | ((row: T) => any)): any => {
    if (typeof accessor === 'function') {
      return accessor(row);
    }
    return row[accessor];
  }, []);

  // Filter data
  const filteredData = useMemo(() => {
    if (Object.keys(filters).length === 0) return data;

    return data.filter((row) => {
      return columns.every((column) => {
        if (!column.filterable || !filters[column.id]) return true;
        const value = getCellValue(row, column.accessor);
        const filterValue = filters[column.id].toLowerCase();
        return String(value).toLowerCase().includes(filterValue);
      });
    });
  }, [data, filters, columns, getCellValue]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) return filteredData;

    const column = columns.find((col) => col.id === sortColumn);
    if (!column || !column.sortable) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = getCellValue(a, column.accessor);
      const bValue = getCellValue(b, column.accessor);

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();

      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      }
      return bStr.localeCompare(aStr);
    });
  }, [filteredData, sortColumn, sortDirection, columns, getCellValue]);

  // Paginate data
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return sortedData.slice(start, end);
  }, [sortedData, pagination, currentPage, pageSize]);

  const totalPages = pagination ? Math.ceil(sortedData.length / pageSize) : 1;

  // Handle sort
  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column || !column.sortable) return;

    if (sortColumn === columnId) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Handle filter
  const handleFilter = (columnId: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value,
    }));
    if (pagination) {
      setInternalPage(1);
      onPageChange?.(1);
    }
  };

  // Handle row selection
  const handleRowSelect = (rowId: string | number) => {
    const newSelection = selectedRows.includes(rowId)
      ? selectedRows.filter((id) => id !== rowId)
      : [...selectedRows, rowId];

    if (!isControlledSelection) {
      setInternalSelectedRows(newSelection);
    }
    onSelectionChange?.(newSelection);
  };

  // Handle select all
  const handleSelectAll = () => {
    const allIds = paginatedData.map((row, index) => getRowId(row, index));
    const allSelected = allIds.every((id) => selectedRows.includes(id));
    const newSelection = allSelected ? [] : allIds;

    if (!isControlledSelection) {
      setInternalSelectedRows(newSelection);
    }
    onSelectionChange?.(newSelection);
  };

  // Handle row expand
  const handleRowExpand = (rowId: string | number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  // Handle column resize start
  const handleResizeStart = (columnId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(columnId);
    resizeStartX.current = e.clientX;
    const column = columns.find((col) => col.id === columnId);
    resizeStartWidth.current = columnWidths[columnId] || (typeof column?.width === 'number' ? column.width : 150);
  };

  // Handle column resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const diff = e.clientX - resizeStartX.current;
      const newWidth = Math.max(50, resizeStartWidth.current + diff);
      setColumnWidths((prev) => ({
        ...prev,
        [isResizing!]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      setIsResizing(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Get column width
  const getColumnWidth = (column: DataGridColumn<T>) => {
    if (columnWidths[column.id]) {
      return `${columnWidths[column.id]}px`;
    }
    if (typeof column.width === 'number') {
      return `${column.width}px`;
    }
    return column.width || 'auto';
  };

  // Sort icon
  const SortIcon = ({ direction }: { direction: SortDirection }) => {
    if (!direction) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    if (direction === 'asc') {
      return (
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // Expand icon
  const ExpandIcon = ({ expanded }: { expanded: boolean }) => {
    if (expanded) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    );
  };

  return (
    <div className={clsx('w-full overflow-auto', className)}>
      <table
        className={clsx(
          'w-full border-collapse',
          variant === 'bordered' && 'border border-gray-300 dark:border-gray-600',
          variant === 'striped' && striped && 'divide-y divide-gray-200 dark:divide-gray-700'
        )}
        style={{ minWidth: '100%' }}
      >
        {/* Header */}
        <thead>
          <tr className={clsx('bg-gray-50 dark:bg-gray-800', headerClassName)} style={headerStyle}>
            {selectable && (
              <th
                className={clsx(
                  'sticky left-0 z-10 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
                  sizes.header,
                  'font-semibold text-gray-700 dark:text-gray-300'
                )}
                style={{ width: '50px', minWidth: '50px' }}
              >
                <input
                  type="checkbox"
                  checked={paginatedData.length > 0 && paginatedData.every((row, index) => selectedRows.includes(getRowId(row, index)))}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>
            )}
            {expandable && (
              <th
                className={clsx(
                  'sticky left-0 z-10 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700',
                  sizes.header,
                  'font-semibold text-gray-700 dark:text-gray-300',
                  selectable && 'left-[50px]'
                )}
                style={{ width: '50px', minWidth: '50px' }}
              />
            )}
            {columns.map((column) => {
              const isSorted = sortColumn === column.id;
              const currentSortDirection = isSorted ? sortDirection : null;
              const filterValue = filters[column.id] || '';

              return (
                <th
                  key={column.id}
                  className={clsx(
                    'relative border-b border-gray-200 dark:border-gray-700',
                    sizes.header,
                    'font-semibold text-gray-700 dark:text-gray-300',
                    column.sticky && 'sticky bg-gray-50 dark:bg-gray-800 z-10',
                    column.align === 'center' && 'text-center',
                    column.align === 'right' && 'text-right',
                    column.className
                  )}
                  style={{
                    width: getColumnWidth(column),
                    minWidth: column.minWidth || 100,
                    maxWidth: column.maxWidth,
                    ...(column.sticky && { left: '0' }),
                  }}
                >
                  <div className="flex items-center gap-2">
                    {column.headerIcon && <span>{column.headerIcon}</span>}
                    {column.headerCell ? (
                      column.headerCell()
                    ) : (
                      <span>{column.header}</span>
                    )}
                    {column.sortable && (
                      <button
                        type="button"
                        onClick={() => handleSort(column.id)}
                        className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        <SortIcon direction={currentSortDirection} />
                      </button>
                    )}
                  </div>
                  {column.filterable && (
                    <div className="mt-1">
                      <input
                        type="text"
                        value={filterValue}
                        onChange={(e) => handleFilter(column.id, e.target.value)}
                        placeholder="Filter..."
                        className={clsx(
                          'w-full px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded',
                          'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                          'focus:outline-none focus:ring-2 focus:ring-blue-500'
                        )}
                      />
                    </div>
                  )}
                  {(resizable || column.resizable) && (
                    <div
                      className="absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-blue-500 bg-transparent"
                      onMouseDown={(e) => handleResizeStart(column.id, e)}
                    />
                  )}
                </th>
              );
            })}
            {actions && actions.length > 0 && (
              <th
                className={clsx(
                  'sticky right-0 z-10 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700',
                  sizes.header,
                  'font-semibold text-gray-700 dark:text-gray-300 text-center'
                )}
                style={{ width: `${actions.length * 40 + 20}px`, minWidth: `${actions.length * 40 + 20}px` }}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-8">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">Loading...</span>
                </div>
              </td>
            </tr>
          ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (actions ? 1 : 0)} className="text-center py-8 text-gray-500 dark:text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const rowId = getRowId(row, rowIndex);
              const isSelected = selectedRows.includes(rowId);
              const isExpanded = expandedRows.has(rowId);
              const rowSubRows = subRows ? subRows(row) : undefined;
              const hasSubRows = rowSubRows && rowSubRows.length > 0;
              const isStriped = striped && rowIndex % 2 === 1;

              return (
                <React.Fragment key={rowId}>
                  <tr
                    className={clsx(
                      'border-b border-gray-200 dark:border-gray-700 transition-colors',
                      isStriped && 'bg-gray-50 dark:bg-gray-800/50',
                      isSelected && 'bg-blue-50 dark:bg-blue-900/20',
                      !isStriped && !isSelected && 'hover:bg-gray-50 dark:hover:bg-gray-800',
                      getRowClassName?.(row, rowIndex)
                    )}
                    style={{
                      height: rowHeight,
                      ...getRowStyle?.(row, rowIndex),
                    }}
                  >
                    {selectable && (
                      <td
                        className={clsx(
                          'sticky left-0 z-10 bg-inherit border-r border-gray-200 dark:border-gray-700',
                          sizes.cell,
                          isSelected && 'bg-blue-50 dark:bg-blue-900/20'
                        )}
                        style={{ width: '50px', minWidth: '50px' }}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRowSelect(rowId)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                    )}
                    {expandable && (
                      <td
                        className={clsx(
                          'sticky left-0 z-10 bg-inherit border-r border-gray-200 dark:border-gray-700',
                          sizes.cell,
                          isSelected && 'bg-blue-50 dark:bg-blue-900/20',
                          selectable && 'left-[50px]'
                        )}
                        style={{ width: '50px', minWidth: '50px' }}
                      >
                        {(hasSubRows || expandedContent) && (
                          <button
                            type="button"
                            onClick={() => handleRowExpand(rowId)}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
                          >
                            <ExpandIcon expanded={isExpanded} />
                          </button>
                        )}
                      </td>
                    )}
                    {columns.map((column) => {
                      const value = getCellValue(row, column.accessor);
                      return (
                        <td
                          key={column.id}
                          className={clsx(
                            sizes.cell,
                            'text-gray-900 dark:text-gray-100',
                            column.align === 'center' && 'text-center',
                            column.align === 'right' && 'text-right',
                            column.sticky && 'sticky bg-inherit z-10',
                            column.className
                          )}
                          style={{
                            width: getColumnWidth(column),
                            minWidth: column.minWidth || 100,
                            maxWidth: column.maxWidth,
                            ...(column.sticky && { left: '0' }),
                          }}
                        >
                          {column.cell ? column.cell(value, row, rowIndex) : String(value ?? '')}
                        </td>
                      );
                    })}
                    {actions && actions.length > 0 && (
                      <td
                        className={clsx(
                          'sticky right-0 z-10 bg-inherit border-l border-gray-200 dark:border-gray-700',
                          sizes.cell,
                          isSelected && 'bg-blue-50 dark:bg-blue-900/20',
                          'text-center'
                        )}
                        style={{ width: `${actions.length * 40 + 20}px`, minWidth: `${actions.length * 40 + 20}px` }}
                      >
                        <div className="flex items-center justify-center gap-1">
                          {actions.map((action, actionIndex) => {
                            const isDisabled = action.disabled?.(row);
                            const actionColors = {
                              default: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100',
                              primary: 'text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300',
                              success: 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300',
                              warning: 'text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300',
                              danger: 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300',
                            };

                            return (
                              <button
                                key={actionIndex}
                                type="button"
                                onClick={() => !isDisabled && action.onClick(row, rowIndex)}
                                disabled={isDisabled}
                                className={clsx(
                                  'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors',
                                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                                  isDisabled && 'opacity-50 cursor-not-allowed',
                                  actionColors[action.variant || 'default']
                                )}
                                title={action.label}
                              >
                                {action.icon || action.label}
                              </button>
                            );
                          })}
                        </div>
                      </td>
                    )}
                  </tr>
                  {/* Expanded content */}
                  {isExpanded && expandedContent && (
                    <tr>
                      <td
                        colSpan={columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0) + (actions ? 1 : 0)}
                        className="bg-gray-50 dark:bg-gray-800 p-4"
                      >
                        {expandedContent(row, rowIndex)}
                      </td>
                    </tr>
                  )}
                  {/* Sub-rows */}
                  {isExpanded && hasSubRows && rowSubRows && (
                    <>
                      {rowSubRows.map((subRow, subIndex) => (
                        <tr
                          key={`${rowId}-sub-${subIndex}`}
                          className={clsx(
                            'border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30',
                            getRowClassName?.(subRow, rowIndex)
                          )}
                        >
                          {selectable && (
                            <td className={clsx('border-r border-gray-200 dark:border-gray-700', sizes.cell)} />
                          )}
                          {expandable && (
                            <td className={clsx('border-r border-gray-200 dark:border-gray-700', sizes.cell)} />
                          )}
                          {columns.map((column) => {
                            const value = getCellValue(subRow, column.accessor);
                            return (
                              <td
                                key={column.id}
                                className={clsx(
                                  sizes.cell,
                                  'text-gray-700 dark:text-gray-300',
                                  column.align === 'center' && 'text-center',
                                  column.align === 'right' && 'text-right',
                                  column.className
                                )}
                              >
                                {column.cell ? column.cell(value, subRow, subIndex) : String(value ?? '')}
                              </td>
                            );
                          })}
                          {actions && (
                            <td className={clsx('border-l border-gray-200 dark:border-gray-700', sizes.cell)} />
                          )}
                        </tr>
                      ))}
                    </>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const newPage = currentPage - 1;
                if (!isControlledPage) setInternalPage(newPage);
                onPageChange?.(newPage);
              }}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => {
                      if (!isControlledPage) setInternalPage(pageNum);
                      onPageChange?.(pageNum);
                    }}
                    className={clsx(
                      'px-3 py-1 text-sm border rounded',
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => {
                const newPage = currentPage + 1;
                if (!isControlledPage) setInternalPage(newPage);
                onPageChange?.(newPage);
              }}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DataGrid;

