import React, { useState, useCallback } from 'react';
import { clsx } from 'clsx';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardShadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface CardProps {
  /**
   * Card title
   */
  title?: string;
  /**
   * Card content
   */
  children: React.ReactNode;
  /**
   * Variant style
   */
  variant?: CardVariant;
  /**
   * Shadow level
   */
  shadow?: CardShadow;
  /**
   * Whether card is collapsible
   */
  collapsible?: boolean;
  /**
   * Default collapsed state
   */
  defaultCollapsed?: boolean;
  /**
   * Custom width
   */
  width?: string | number;
  /**
   * Custom height
   */
  height?: string | number;
  /**
   * Flex span (for card groups)
   */
  flexSpan?: number;
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
  /**
   * Custom footer content
   */
  footer?: React.ReactNode;
  /**
   * Custom header actions (icons, buttons, etc.)
   */
  headerActions?: React.ReactNode;
}

/**
 * Card Component
 */
export const Card: React.FC<CardProps> = ({
  title,
  children,
  variant = 'default',
  shadow = 'md',
  collapsible = false,
  defaultCollapsed = false,
  width,
  height,
  flexSpan,
  className,
  headerClassName,
  contentClassName,
  footer,
  headerActions,
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  // Variant styles
  const variantStyles: Record<CardVariant, { bg: string; border: string }> = {
    default: {
      bg: 'bg-white dark:bg-gray-800',
      border: 'border border-gray-200 dark:border-gray-700',
    },
    elevated: {
      bg: 'bg-white dark:bg-gray-800',
      border: '',
    },
    outlined: {
      bg: 'bg-transparent',
      border: 'border-2 border-gray-300 dark:border-gray-600',
    },
    filled: {
      bg: 'bg-gray-50 dark:bg-gray-900',
      border: 'border border-gray-200 dark:border-gray-700',
    },
  };

  // Shadow styles
  const shadowStyles: Record<CardShadow, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  };

  const styles = variantStyles[variant];
  const shadowStyle = shadowStyles[shadow];

  const handleToggle = useCallback(() => {
    if (collapsible) {
      setCollapsed((prev) => !prev);
    }
  }, [collapsible]);

  const widthStyle = width
    ? { width: typeof width === 'number' ? `${width}px` : width }
    : {};
  const heightStyle = height
    ? { height: typeof height === 'number' ? `${height}px` : height }
    : {};
  const flexSpanStyle = flexSpan ? { flex: `${flexSpan} 1 0%`, minWidth: 0 } : {};

  return (
    <div
      className={clsx(
        'rounded-lg overflow-hidden transition-all duration-200',
        styles.bg,
        styles.border,
        shadowStyle,
        className
      )}
      style={{ ...widthStyle, ...heightStyle, ...flexSpanStyle, minWidth: 0, maxWidth: '100%' }}
    >
      {/* Header */}
      {(title || headerActions || collapsible) && (
        <div
          className={clsx(
            'px-4 py-3 border-b border-gray-200 dark:border-gray-700',
            collapsible && 'cursor-pointer',
            headerClassName
          )}
          onClick={collapsible ? handleToggle : undefined}
        >
          <div className="flex items-center justify-between">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
            )}
            <div className="flex items-center gap-2">
              {headerActions}
              {collapsible && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggle();
                  }}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label={collapsed ? 'Expand' : 'Collapse'}
                >
                  <svg
                    className={clsx('w-5 h-5 text-gray-600 dark:text-gray-400 transition-transform', collapsed && 'rotate-180')}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!collapsed && (
        <div className={clsx('px-4 py-3 overflow-auto', contentClassName)} style={{ minHeight: 0 }}>{children}</div>
      )}

      {/* Footer */}
      {footer && !collapsed && (
        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">{footer}</div>
      )}
    </div>
  );
};

export interface CardGroupProps {
  /**
   * Cards to display
   */
  cards: CardProps[];
  /**
   * Direction of card group
   */
  direction?: 'horizontal' | 'vertical';
  /**
   * Number of columns (for horizontal direction)
   */
  columns?: number;
  /**
   * Gap between cards
   */
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Custom className
   */
  className?: string;
}

/**
 * Card Group Component
 */
export const CardGroup: React.FC<CardGroupProps> = ({
  cards,
  direction = 'horizontal',
  columns,
  gap = 'md',
  className,
}) => {
  const gapStyles: Record<NonNullable<CardGroupProps['gap']>, string> = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const gapStyle = gapStyles[gap];

  if (direction === 'vertical') {
    return (
      <div className={clsx('flex flex-col', gapStyle, className)}>
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    );
  }

  // Horizontal with columns
  if (columns) {
    const gridCols = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      5: 'grid-cols-5',
      6: 'grid-cols-6',
    };

    return (
      <div className={clsx('grid', gridCols[columns as keyof typeof gridCols] || 'grid-cols-3', gapStyle, className)}>
        {cards.map((card, index) => (
          <Card key={index} {...card} />
        ))}
      </div>
    );
  }

  // Horizontal flex (default)
  return (
    <div className={clsx('flex flex-wrap w-full', gapStyle, className)}>
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
};

export default Card;

