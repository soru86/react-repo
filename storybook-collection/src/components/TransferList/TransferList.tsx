import React, { useState, useMemo } from 'react';
import { clsx } from 'clsx';

export interface TransferListItem {
  /**
   * Unique identifier for the item
   */
  id: string | number;
  /**
   * Display label
   */
  label: string;
  /**
   * Optional description
   */
  description?: string;
  /**
   * Whether the item is disabled
   */
  disabled?: boolean;
  /**
   * Optional icon or custom content
   */
  icon?: React.ReactNode;
}

export interface TransferListProps {
  /**
   * Available items (source list)
   */
  items: TransferListItem[];
  /**
   * Selected item IDs (destination list)
   */
  selectedIds?: (string | number)[];
  /**
   * Default selected item IDs (for uncontrolled mode)
   */
  defaultSelectedIds?: (string | number)[];
  /**
   * Callback when selection changes
   */
  onChange?: (selectedIds: (string | number)[]) => void;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Whether to show search/filter inputs
   */
  searchable?: boolean;
  /**
   * Placeholder text for source search
   */
  sourceSearchPlaceholder?: string;
  /**
   * Placeholder text for destination search
   */
  destinationSearchPlaceholder?: string;
  /**
   * Source list title
   */
  sourceTitle?: string;
  /**
   * Destination list title
   */
  destinationTitle?: string;
  /**
   * Whether the component is disabled
   */
  disabled?: boolean;
  /**
   * Custom filter function
   */
  filterFunction?: (item: TransferListItem, searchTerm: string) => boolean;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Transfer List component with multi-selection support
 */
export const TransferList: React.FC<TransferListProps> = ({
  items,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onChange,
  size = 'medium',
  searchable = false,
  sourceSearchPlaceholder = 'Search available items...',
  destinationSearchPlaceholder = 'Search selected items...',
  sourceTitle = 'Available',
  destinationTitle = 'Selected',
  disabled = false,
  filterFunction,
  className,
}) => {
  const [internalSelectedIds, setInternalSelectedIds] = useState<(string | number)[]>(
    defaultSelectedIds
  );
  const [sourceSearch, setSourceSearch] = useState('');
  const [destinationSearch, setDestinationSearch] = useState('');
  const [sourceSelected, setSourceSelected] = useState<(string | number)[]>([]);
  const [destinationSelected, setDestinationSelected] = useState<(string | number)[]>([]);

  const isControlled = controlledSelectedIds !== undefined;
  const selectedIds = isControlled ? controlledSelectedIds : internalSelectedIds;

  // Size classes
  const sizeClasses = {
    small: {
      list: 'text-sm',
      item: 'px-2 py-1.5',
      button: 'p-1.5',
      input: 'text-sm px-2 py-1',
    },
    medium: {
      list: 'text-base',
      item: 'px-3 py-2',
      button: 'p-2',
      input: 'text-base px-3 py-2',
    },
    large: {
      list: 'text-lg',
      item: 'px-4 py-3',
      button: 'p-3',
      input: 'text-lg px-4 py-3',
    },
  };

  // Default filter function
  const defaultFilter = (item: TransferListItem, searchTerm: string): boolean => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.label.toLowerCase().includes(term) ||
      (item.description && item.description.toLowerCase().includes(term))
    );
  };

  const filter = filterFunction || defaultFilter;

  // Filter items
  const availableItems = useMemo(() => {
    return items.filter((item) => !selectedIds.includes(item.id));
  }, [items, selectedIds]);

  const selectedItems = useMemo(() => {
    return items.filter((item) => selectedIds.includes(item.id));
  }, [items, selectedIds]);

  const filteredAvailableItems = useMemo(() => {
    return availableItems.filter((item) => filter(item, sourceSearch));
  }, [availableItems, sourceSearch, filter]);

  const filteredSelectedItems = useMemo(() => {
    return selectedItems.filter((item) => filter(item, destinationSearch));
  }, [selectedItems, destinationSearch, filter]);

  // Handle selection change
  const handleSelectionChange = (newSelectedIds: (string | number)[]) => {
    if (!isControlled) {
      setInternalSelectedIds(newSelectedIds);
    }
    onChange?.(newSelectedIds);
  };

  // Add selected items
  const handleAdd = () => {
    if (sourceSelected.length === 0 || disabled) return;
    const newSelectedIds = [...selectedIds, ...sourceSelected];
    handleSelectionChange(newSelectedIds);
    setSourceSelected([]);
  };

  // Remove selected items
  const handleRemove = () => {
    if (destinationSelected.length === 0 || disabled) return;
    const newSelectedIds = selectedIds.filter((id) => !destinationSelected.includes(id));
    handleSelectionChange(newSelectedIds);
    setDestinationSelected([]);
  };

  // Add all items
  const handleAddAll = () => {
    if (filteredAvailableItems.length === 0 || disabled) return;
    const idsToAdd = filteredAvailableItems
      .filter((item) => !item.disabled)
      .map((item) => item.id);
    const newSelectedIds = [...selectedIds, ...idsToAdd];
    handleSelectionChange(newSelectedIds);
    setSourceSelected([]);
  };

  // Remove all items
  const handleRemoveAll = () => {
    if (filteredSelectedItems.length === 0 || disabled) return;
    const idsToRemove = filteredSelectedItems.map((item) => item.id);
    const newSelectedIds = selectedIds.filter((id) => !idsToRemove.includes(id));
    handleSelectionChange(newSelectedIds);
    setDestinationSelected([]);
  };

  // Toggle item selection in source
  const toggleSourceSelection = (id: string | number) => {
    if (disabled) return;
    setSourceSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle item selection in destination
  const toggleDestinationSelection = (id: string | number) => {
    if (disabled) return;
    setDestinationSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle all in source
  const toggleAllSource = () => {
    if (disabled) return;
    const enabledItems = filteredAvailableItems.filter((item) => !item.disabled);
    const allSelected = enabledItems.every((item) => sourceSelected.includes(item.id));
    if (allSelected) {
      setSourceSelected([]);
    } else {
      setSourceSelected(enabledItems.map((item) => item.id));
    }
  };

  // Toggle all in destination
  const toggleAllDestination = () => {
    if (disabled) return;
    const allSelected = filteredSelectedItems.every((item) =>
      destinationSelected.includes(item.id)
    );
    if (allSelected) {
      setDestinationSelected([]);
    } else {
      setDestinationSelected(filteredSelectedItems.map((item) => item.id));
    }
  };

  const sizes = sizeClasses[size];
  const canAdd = sourceSelected.length > 0 && !disabled;
  const canRemove = destinationSelected.length > 0 && !disabled;
  const canAddAll = filteredAvailableItems.filter((item) => !item.disabled).length > 0 && !disabled;
  const canRemoveAll = filteredSelectedItems.length > 0 && !disabled;

  // Icon components
  const ArrowRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const DoubleArrowRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  );

  const DoubleArrowLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  );

  const renderList = (
    listItems: TransferListItem[],
    selected: (string | number)[],
    onToggle: (id: string | number) => void,
    onToggleAll: () => void,
    searchValue: string,
    onSearchChange: (value: string) => void,
    title: string,
    searchPlaceholder: string
  ) => {
    const allSelected = listItems.length > 0 && listItems.every((item) => selected.includes(item.id));
    const someSelected = listItems.some((item) => selected.includes(item.id));

    return (
      <div className="flex flex-col h-full border border-gray-300 rounded-lg overflow-hidden bg-white">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-700">{title}</h3>
            {listItems.length > 0 && (
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected && !allSelected;
                  }}
                  onChange={onToggleAll}
                  disabled={disabled}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-600">Select All</span>
              </label>
            )}
          </div>
          {searchable && (
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              disabled={disabled}
              className={clsx(
                'w-full border border-gray-300 rounded px-3 py-1.5 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                disabled && 'bg-gray-100 cursor-not-allowed',
                sizes.input
              )}
            />
          )}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {listItems.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">No items</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {listItems.map((item) => {
                const isSelected = selected.includes(item.id);
                const isItemDisabled = item.disabled || disabled;

                return (
                  <li
                    key={item.id}
                    className={clsx(
                      'flex items-start gap-3 cursor-pointer transition-colors',
                      sizes.item,
                      isSelected && 'bg-blue-50',
                      !isItemDisabled && 'hover:bg-gray-50',
                      isItemDisabled && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => !isItemDisabled && onToggle(item.id)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      disabled={isItemDisabled}
                      className="mt-0.5 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                        <span className={clsx('font-medium', sizes.list)}>{item.label}</span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={clsx('flex gap-4', className)} style={{ minHeight: '400px' }}>
      {/* Source List */}
      <div className="flex-1 flex flex-col">
        {renderList(
          filteredAvailableItems,
          sourceSelected,
          toggleSourceSelection,
          toggleAllSource,
          sourceSearch,
          setSourceSearch,
          sourceTitle,
          sourceSearchPlaceholder
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col justify-center gap-2">
        <button
          onClick={handleAdd}
          disabled={!canAdd}
          className={clsx(
            'flex items-center justify-center rounded border transition-colors',
            sizes.button,
            canAdd
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
          )}
          title="Add selected"
        >
          <ArrowRightIcon />
        </button>
        <button
          onClick={handleRemove}
          disabled={!canRemove}
          className={clsx(
            'flex items-center justify-center rounded border transition-colors',
            sizes.button,
            canRemove
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
          )}
          title="Remove selected"
        >
          <ArrowLeftIcon />
        </button>
        <button
          onClick={handleAddAll}
          disabled={!canAddAll}
          className={clsx(
            'flex items-center justify-center rounded border transition-colors',
            sizes.button,
            canAddAll
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
          )}
          title="Add all"
        >
          <DoubleArrowRightIcon />
        </button>
        <button
          onClick={handleRemoveAll}
          disabled={!canRemoveAll}
          className={clsx(
            'flex items-center justify-center rounded border transition-colors',
            sizes.button,
            canRemoveAll
              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
          )}
          title="Remove all"
        >
          <DoubleArrowLeftIcon />
        </button>
      </div>

      {/* Destination List */}
      <div className="flex-1 flex flex-col">
        {renderList(
          filteredSelectedItems,
          destinationSelected,
          toggleDestinationSelection,
          toggleAllDestination,
          destinationSearch,
          setDestinationSearch,
          destinationTitle,
          destinationSearchPlaceholder
        )}
      </div>
    </div>
  );
};

export default TransferList;

