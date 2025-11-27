import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';

export type FieldType = 'text' | 'number' | 'date' | 'datetime' | 'select' | 'multiselect' | 'boolean' | 'range';

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'between'
  | 'in'
  | 'notIn'
  | 'isEmpty'
  | 'isNotEmpty';

export interface FilterField {
  /**
   * Field identifier
   */
  id: string;
  /**
   * Field label
   */
  label: string;
  /**
   * Field type
   */
  type: FieldType;
  /**
   * Available operators for this field
   */
  operators?: ConditionOperator[];
  /**
   * Options for select/multiselect fields
   */
  options?: Array<{ value: string; label: string }>;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Default value
   */
  defaultValue?: any;
}

export interface FilterRule {
  /**
   * Unique identifier for this rule
   */
  id: string;
  /**
   * Selected field
   */
  field: string;
  /**
   * Selected operator
   */
  operator: ConditionOperator;
  /**
   * Filter value(s)
   */
  value: any;
  /**
   * Second value for 'between' operator
   */
  value2?: any;
  /**
   * Logic operator to connect with next filter (AND/OR)
   * Only applies if there's a next filter
   */
  logic?: 'AND' | 'OR';
}

export interface AdvancedSearchFilterProps {
  /**
   * Available fields for filtering
   */
  fields: FilterField[];
  /**
   * Initial filter rules
   */
  initialFilters?: FilterRule[];
  /**
   * Callback when filters are applied
   */
  onApply?: (filters: FilterRule[]) => void;
  /**
   * Callback when filters are reset
   */
  onReset?: () => void;
  /**
   * Whether to show AND/OR logic selector between filters
   */
  showLogicSelector?: boolean;
  /**
   * Default logic (AND/OR) when adding new filters
   */
  defaultLogic?: 'AND' | 'OR';
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Maximum number of filters
   */
  maxFilters?: number;
  /**
   * Whether filters are collapsible
   */
  collapsible?: boolean;
  /**
   * Default collapsed state
   */
  defaultCollapsed?: boolean;
}

const operatorLabels: Record<ConditionOperator, string> = {
  equals: 'Equals',
  notEquals: 'Not equals',
  contains: 'Contains',
  notContains: 'Does not contain',
  startsWith: 'Starts with',
  endsWith: 'Ends with',
  greaterThan: 'Greater than',
  greaterThanOrEqual: 'Greater than or equal',
  lessThan: 'Less than',
  lessThanOrEqual: 'Less than or equal',
  between: 'Between',
  in: 'In',
  notIn: 'Not in',
  isEmpty: 'Is empty',
  isNotEmpty: 'Is not empty',
};

const defaultOperators: Record<FieldType, ConditionOperator[]> = {
  text: ['equals', 'notEquals', 'contains', 'notContains', 'startsWith', 'endsWith', 'isEmpty', 'isNotEmpty'],
  number: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'isEmpty', 'isNotEmpty'],
  date: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'isEmpty', 'isNotEmpty'],
  datetime: ['equals', 'notEquals', 'greaterThan', 'greaterThanOrEqual', 'lessThan', 'lessThanOrEqual', 'between', 'isEmpty', 'isNotEmpty'],
  select: ['equals', 'notEquals', 'in', 'notIn', 'isEmpty', 'isNotEmpty'],
  multiselect: ['in', 'notIn', 'isEmpty', 'isNotEmpty'],
  boolean: ['equals'],
  range: ['between'],
};

const generateId = () => `filter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const AdvancedSearchFilter: React.FC<AdvancedSearchFilterProps> = ({
  fields,
  initialFilters = [],
  onApply,
  onReset,
  showLogicSelector = true,
  defaultLogic = 'AND',
  className,
  maxFilters,
  collapsible = false,
  defaultCollapsed = false,
}) => {
  const [filters, setFilters] = useState<FilterRule[]>(
    initialFilters.map((f, index) => ({
      ...f,
      logic: f.logic || (index < initialFilters.length - 1 ? defaultLogic : undefined),
    }))
  );
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const getFieldById = useCallback((id: string) => fields.find((f) => f.id === id), [fields]);

  const getOperatorsForField = useCallback((fieldId: string): ConditionOperator[] => {
    const field = getFieldById(fieldId);
    if (!field) return [];
    return field.operators || defaultOperators[field.type] || [];
  }, [getFieldById]);

  const handleAddFilter = () => {
    if (maxFilters && filters.length >= maxFilters) return;
    
    const firstField = fields[0];
    if (!firstField) return;

    const operators = getOperatorsForField(firstField.id);
    const newFilter: FilterRule = {
      id: generateId(),
      field: firstField.id,
      operator: operators[0],
      value: '',
      logic: filters.length > 0 ? defaultLogic : undefined, // Add logic if there are existing filters
    };

    // Update the last filter's logic if it exists
    const updatedFilters = filters.length > 0
      ? filters.map((f, index) => 
          index === filters.length - 1 
            ? { ...f, logic: f.logic || defaultLogic }
            : f
        )
      : filters;

    setFilters([...updatedFilters, newFilter]);
  };

  const handleRemoveFilter = (id: string) => {
    const filterIndex = filters.findIndex((f) => f.id === id);
    if (filterIndex === -1) return;

    const newFilters = filters.filter((f) => f.id !== id);
    
    // If we removed a filter that wasn't the last one, update the previous filter's logic
    // If we removed the last filter, remove logic from the new last filter
    if (newFilters.length > 0 && filterIndex < filters.length - 1) {
      // The filter after the removed one now becomes the previous one
      // We need to update the logic of the filter before the removed one
      if (filterIndex > 0) {
        // Keep the logic of the filter before the removed one
        // No change needed
      } else {
        // Removed the first filter, the new first filter shouldn't have logic
        newFilters[0] = { ...newFilters[0], logic: undefined };
      }
    } else if (newFilters.length > 0 && filterIndex === filters.length - 1) {
      // Removed the last filter, remove logic from the new last filter
      const lastIndex = newFilters.length - 1;
      newFilters[lastIndex] = { ...newFilters[lastIndex], logic: undefined };
    }

    setFilters(newFilters);
  };

  const handleFilterChange = (id: string, updates: Partial<FilterRule>) => {
    setFilters(
      filters.map((f) => {
        if (f.id === id) {
          const updated = { ...f, ...updates };
          // Reset value when field or operator changes
          if (updates.field || updates.operator) {
            const field = getFieldById(updated.field);
            const operators = getOperatorsForField(updated.field);
            if (!operators.includes(updated.operator)) {
              updated.operator = operators[0];
            }
            // Reset values for certain operators
            if (['isEmpty', 'isNotEmpty'].includes(updated.operator)) {
              updated.value = '';
              updated.value2 = undefined;
            } else if (updated.operator === 'between') {
              updated.value = updated.value || '';
              updated.value2 = updated.value2 || '';
            } else {
              updated.value = '';
              updated.value2 = undefined;
            }
          }
          return updated;
        }
        return f;
      })
    );
  };

  const handleApply = () => {
    onApply?.(filters);
  };

  const handleReset = () => {
    setFilters([]);
    onReset?.();
  };

  const handleLogicChange = (filterId: string, newLogic: 'AND' | 'OR') => {
    setFilters(
      filters.map((f) => (f.id === filterId ? { ...f, logic: newLogic } : f))
    );
  };

  const renderValueInput = (filter: FilterRule) => {
    const field = getFieldById(filter.field);
    if (!field) return null;

    const operator = filter.operator;

    // No value input for isEmpty/isNotEmpty
    if (['isEmpty', 'isNotEmpty'].includes(operator)) {
      return null;
    }

    // Boolean field
    if (field.type === 'boolean') {
      return (
        <select
          value={filter.value || ''}
          onChange={(e) => handleFilterChange(filter.id, { value: e.target.value === 'true' })}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select...</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      );
    }

    // Between operator - two inputs
    if (operator === 'between') {
      return (
        <div className="flex items-center gap-2">
          <input
            type={field.type === 'date' || field.type === 'datetime' ? field.type : 'text'}
            value={filter.value || ''}
            onChange={(e) => handleFilterChange(filter.id, { value: e.target.value })}
            placeholder="From"
            className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <span className="text-gray-500">and</span>
          <input
            type={field.type === 'date' || field.type === 'datetime' ? field.type : 'text'}
            value={filter.value2 || ''}
            onChange={(e) => handleFilterChange(filter.id, { value2: e.target.value })}
            placeholder="To"
            className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
        </div>
      );
    }

    // Select field
    if (field.type === 'select' && field.options) {
      return (
        <select
          value={filter.value || ''}
          onChange={(e) => handleFilterChange(filter.id, { value: e.target.value })}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select...</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    // Multiselect field
    if (field.type === 'multiselect' && field.options) {
      const selectedValues = Array.isArray(filter.value) ? filter.value : [];
      return (
        <select
          multiple
          value={selectedValues}
          onChange={(e) => {
            const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
            handleFilterChange(filter.id, { value: values });
          }}
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        >
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    // In/Not in operators - comma-separated values
    if (['in', 'notIn'].includes(operator)) {
      return (
        <input
          type="text"
          value={Array.isArray(filter.value) ? filter.value.join(', ') : filter.value || ''}
          onChange={(e) => {
            const values = e.target.value.split(',').map((v) => v.trim()).filter(Boolean);
            handleFilterChange(filter.id, { value: values });
          }}
          placeholder="Comma-separated values"
          className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      );
    }

    // Default input
    return (
      <input
        type={field.type === 'date' || field.type === 'datetime' ? field.type : field.type === 'number' ? 'number' : 'text'}
        value={filter.value || ''}
        onChange={(e) => handleFilterChange(filter.id, { value: e.target.value })}
        placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
        className="px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
      />
    );
  };

  return (
    <div className={clsx('bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold">Advanced Search & Filter</h3>
        {collapsible && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <svg
              className={clsx('w-5 h-5 transition-transform', collapsed && 'rotate-180')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="p-4 space-y-4">
          {filters.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>No filters applied. Click "Add Filter" to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filters.map((filter, index) => {
                const field = getFieldById(filter.field);
                const operators = getOperatorsForField(filter.field);
                const isLast = index === filters.length - 1;

                return (
                  <div key={filter.id} className="space-y-3">
                    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        {/* Field Selector */}
                        <select
                          value={filter.field}
                          onChange={(e) => {
                            const newField = getFieldById(e.target.value);
                            if (newField) {
                              const newOperators = getOperatorsForField(e.target.value);
                              handleFilterChange(filter.id, {
                                field: e.target.value,
                                operator: newOperators[0],
                              });
                            }
                          }}
                          className="px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {fields.map((f) => (
                            <option key={f.id} value={f.id}>
                              {f.label}
                            </option>
                          ))}
                        </select>

                        {/* Operator Selector */}
                        <select
                          value={filter.operator}
                          onChange={(e) => handleFilterChange(filter.id, { operator: e.target.value as ConditionOperator })}
                          className="px-3 py-2 border rounded-md dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {operators.map((op) => (
                            <option key={op} value={op}>
                              {operatorLabels[op]}
                            </option>
                          ))}
                        </select>

                        {/* Value Input */}
                        <div className="md:col-span-2">
                          {renderValueInput(filter)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveFilter(filter.id)}
                        className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                        title="Remove filter"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* AND/OR Logic Selector (after each filter except the last) */}
                    {!isLast && showLogicSelector && (
                      <div className="flex items-center justify-center">
                        <div className="flex border rounded-md dark:border-gray-700 bg-white dark:bg-gray-800">
                          <button
                            onClick={() => handleLogicChange(filter.id, 'AND')}
                            className={clsx(
                              'px-4 py-2 text-sm font-medium transition-colors',
                              filter.logic === 'AND'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            )}
                          >
                            AND
                          </button>
                          <button
                            onClick={() => handleLogicChange(filter.id, 'OR')}
                            className={clsx(
                              'px-4 py-2 text-sm font-medium transition-colors border-l dark:border-gray-700',
                              filter.logic === 'OR'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                            )}
                          >
                            OR
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleAddFilter}
              disabled={maxFilters ? filters.length >= maxFilters : false}
              className={clsx(
                'px-4 py-2 rounded-md font-medium transition-colors',
                'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                'hover:bg-gray-200 dark:hover:bg-gray-700',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            >
              + Add Filter
            </button>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset
              </button>
              <button
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

