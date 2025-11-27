import React from 'react';
import { clsx } from 'clsx';

export interface SwimlaneCard {
  /**
   * Unique identifier for the card
   */
  id: string;
  /**
   * Card content
   */
  content: React.ReactNode;
  /**
   * Card title (optional, displayed above content)
   */
  title?: string;
  /**
   * Card metadata (e.g., assignee, priority, status)
   */
  metadata?: React.ReactNode;
  /**
   * Card color/accent (for visual distinction)
   */
  color?: string;
  /**
   * Whether card is draggable
   */
  draggable?: boolean;
  /**
   * Custom className for card
   */
  className?: string;
  /**
   * Click handler
   */
  onClick?: (card: SwimlaneCard) => void;
  /**
   * Additional data
   */
  data?: any;
}

export interface Swimlane {
  /**
   * Unique identifier for the swimlane
   */
  id: string;
  /**
   * Swimlane title
   */
  title: string;
  /**
   * Cards in this swimlane
   */
  cards: SwimlaneCard[];
  /**
   * Optional icon for swimlane header
   */
  icon?: React.ReactNode;
  /**
   * Optional metadata displayed in header (e.g., count)
   */
  metadata?: React.ReactNode;
  /**
   * Whether swimlane is collapsed
   */
  collapsed?: boolean;
  /**
   * Custom className for swimlane
   */
  className?: string;
  /**
   * Custom header className
   */
  headerClassName?: string;
  /**
   * Custom cards container className
   */
  cardsClassName?: string;
  /**
   * Color/accent for swimlane
   */
  color?: string;
}

export interface SwimlaneProps {
  /**
   * Array of swimlanes
   */
  swimlanes: Swimlane[];
  /**
   * Orientation: 'horizontal' (rows) or 'vertical' (columns)
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Variant style
   */
  variant?: 'default' | 'bordered' | 'filled' | 'minimal';
  /**
   * Whether to show swimlane headers
   */
  showHeaders?: boolean;
  /**
   * Whether headers are collapsible
   */
  collapsible?: boolean;
  /**
   * Card spacing (gap between cards)
   */
  cardSpacing?: number;
  /**
   * Swimlane spacing (gap between swimlanes)
   */
  swimlaneSpacing?: number;
  /**
   * Minimum card width (for horizontal) or height (for vertical)
   */
  minCardSize?: number;
  /**
   * Maximum card width (for horizontal) or height (for vertical)
   */
  maxCardSize?: number;
  /**
   * Fixed width for swimlanes (applies to all swimlanes)
   */
  swimlaneWidth?: number | string;
  /**
   * Whether cards are draggable
   */
  draggable?: boolean;
  /**
   * Callback when a card is clicked
   */
  onCardClick?: (card: SwimlaneCard, swimlaneId: string) => void;
  /**
   * Callback when a swimlane header is clicked
   */
  onSwimlaneHeaderClick?: (swimlane: Swimlane) => void;
  /**
   * Callback when a swimlane is collapsed/expanded
   */
  onSwimlaneToggle?: (swimlaneId: string, collapsed: boolean) => void;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom container className
   */
  containerClassName?: string;
  /**
   * Whether to show empty swimlanes
   */
  showEmptySwimlanes?: boolean;
  /**
   * Custom empty state message
   */
  emptyMessage?: string;
}

/**
 * Swimlane Component - Similar to Jira dashboard swimlanes
 */
export const Swimlane: React.FC<SwimlaneProps> = ({
  swimlanes,
  orientation = 'horizontal',
  size = 'medium',
  variant = 'default',
  showHeaders = true,
  collapsible = false,
  cardSpacing = 12,
  swimlaneSpacing = 16,
  minCardSize,
  maxCardSize,
  swimlaneWidth,
  draggable = false,
  onCardClick,
  onSwimlaneHeaderClick,
  onSwimlaneToggle,
  className,
  containerClassName,
  showEmptySwimlanes = true,
  emptyMessage = 'No cards',
}) => {
  const [collapsedSwimlanes, setCollapsedSwimlanes] = React.useState<Set<string>>(
    new Set(swimlanes.filter((s) => s.collapsed).map((s) => s.id))
  );

  // Size classes
  const sizeClasses = {
    small: {
      header: 'px-2 py-1.5 text-sm',
      card: 'p-2 text-sm',
      title: 'text-sm font-semibold',
    },
    medium: {
      header: 'px-3 py-2 text-base',
      card: 'p-3 text-base',
      title: 'text-base font-semibold',
    },
    large: {
      header: 'px-4 py-3 text-lg',
      card: 'p-4 text-lg',
      title: 'text-lg font-semibold',
    },
  };

  // Variant classes
  const variantClasses = {
    default: {
      container: 'bg-white dark:bg-gray-900',
      swimlane: 'border-b border-gray-200 dark:border-gray-700 last:border-b-0',
      header: 'bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700',
      card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md',
    },
    bordered: {
      container: 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600',
      swimlane: 'border-b-2 border-gray-300 dark:border-gray-600 last:border-b-0',
      header: 'bg-gray-100 dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-600',
      card: 'bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 shadow-md hover:shadow-lg',
    },
    filled: {
      container: 'bg-gray-50 dark:bg-gray-900',
      swimlane: 'bg-gray-50 dark:bg-gray-900',
      header: 'bg-gray-100 dark:bg-gray-800',
      card: 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md',
    },
    minimal: {
      container: 'bg-transparent',
      swimlane: '',
      header: 'bg-transparent border-b border-gray-200 dark:border-gray-700',
      card: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    },
  };

  const sizes = sizeClasses[size];
  const variants = variantClasses[variant];

  const handleSwimlaneToggle = (swimlaneId: string) => {
    const newCollapsed = new Set(collapsedSwimlanes);
    if (newCollapsed.has(swimlaneId)) {
      newCollapsed.delete(swimlaneId);
    } else {
      newCollapsed.add(swimlaneId);
    }
    setCollapsedSwimlanes(newCollapsed);
    onSwimlaneToggle?.(swimlaneId, newCollapsed.has(swimlaneId));
  };

  const isCollapsed = (swimlaneId: string) => collapsedSwimlanes.has(swimlaneId);

  const filteredSwimlanes = showEmptySwimlanes
    ? swimlanes
    : swimlanes.filter((swimlane) => swimlane.cards.length > 0);

  const containerStyle: React.CSSProperties =
    orientation === 'horizontal'
      ? {
          display: 'flex',
          flexDirection: 'column',
          gap: `${swimlaneSpacing}px`,
        }
      : {
          display: 'flex',
          flexDirection: 'row',
          gap: `${swimlaneSpacing}px`,
          alignItems: 'flex-start', // Align collapsed bars at the top
        };

  const getSwimlaneStyle = (collapsed: boolean): React.CSSProperties => {
    if (orientation === 'horizontal') {
      // Horizontal orientation
      if (swimlaneWidth) {
        const widthValue = typeof swimlaneWidth === 'number' ? `${swimlaneWidth}px` : swimlaneWidth;
        return {
          display: 'flex',
          flexDirection: 'column',
          width: widthValue,
          minWidth: widthValue,
          maxWidth: widthValue,
          flexShrink: 0,
        };
      }
      return {
        display: 'flex',
        flexDirection: 'column',
      };
    } else {
      // Vertical orientation
      if (collapsed) {
        // Collapsed vertical swimlane - narrow vertical bar (like Jira)
        return {
          display: 'flex',
          flexDirection: 'column',
          width: '50px',
          minWidth: '50px',
          maxWidth: '50px',
          flexShrink: 0,
        };
      } else {
        // Expanded vertical swimlane
        if (swimlaneWidth) {
          // Fixed width takes precedence
          const widthValue = typeof swimlaneWidth === 'number' ? `${swimlaneWidth}px` : swimlaneWidth;
          return {
            display: 'flex',
            flexDirection: 'column',
            width: widthValue,
            minWidth: widthValue,
            maxWidth: widthValue,
            flexShrink: 0,
          };
        }
        // No fixed width - use minCardSize/maxCardSize or default
        return {
          display: 'flex',
          flexDirection: 'column',
          width: minCardSize && maxCardSize
            ? undefined
            : minCardSize
            ? `${minCardSize}px`
            : '100%',
          minWidth: minCardSize ? `${minCardSize}px` : undefined,
          maxWidth: maxCardSize ? `${maxCardSize}px` : undefined,
        };
      }
    }
  };

  const cardsContainerStyle: React.CSSProperties =
    orientation === 'horizontal'
      ? {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: `${cardSpacing}px`,
          padding: `${cardSpacing}px`,
        }
      : {
          display: 'flex',
          flexDirection: 'column',
          gap: `${cardSpacing}px`,
          padding: `${cardSpacing}px`,
          minHeight: minCardSize ? `${minCardSize}px` : undefined,
        };

  const cardStyle: React.CSSProperties =
    orientation === 'horizontal'
      ? {
          minWidth: minCardSize ? `${minCardSize}px` : undefined,
          maxWidth: maxCardSize ? `${maxCardSize}px` : undefined,
          flex: minCardSize && maxCardSize ? undefined : '1 1 auto',
        }
      : {
          minHeight: minCardSize ? `${minCardSize}px` : undefined,
          maxHeight: maxCardSize ? `${maxCardSize}px` : undefined,
        };

  return (
    <div className={clsx('swimlane-container', variants.container, containerClassName, className)}>
      <div style={containerStyle}>
        {filteredSwimlanes.map((swimlane) => {
          const collapsed = isCollapsed(swimlane.id);
          const hasCards = swimlane.cards.length > 0;
          const isVerticalCollapsed = orientation === 'vertical' && collapsed;

          return (
            <div
              key={swimlane.id}
              className={clsx('swimlane', variants.swimlane, swimlane.className)}
              style={getSwimlaneStyle(collapsed)}
            >
              {/* Header */}
              {showHeaders && (
                <div
                  className={clsx(
                    'swimlane-header',
                    variants.header,
                    sizes.header,
                    collapsible && 'cursor-pointer',
                    isVerticalCollapsed && 'h-full border-r border-gray-200 dark:border-gray-700',
                    swimlane.headerClassName
                  )}
                  onClick={() => {
                    if (collapsible) {
                      handleSwimlaneToggle(swimlane.id);
                    }
                    onSwimlaneHeaderClick?.(swimlane);
                  }}
                  style={{
                    backgroundColor: swimlane.color ? `${swimlane.color}15` : undefined,
                    borderLeftColor: swimlane.color || undefined,
                    borderLeftWidth: swimlane.color ? '4px' : undefined,
                    ...(isVerticalCollapsed
                      ? {
                          width: '100%',
                          height: '100%',
                          minHeight: '300px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '12px 4px',
                        }
                      : {}),
                  }}
                >
                  {isVerticalCollapsed ? (
                    // Collapsed vertical header - vertical bar style (like Jira)
                    <div
                      className="flex flex-col items-center gap-2 h-full justify-center"
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                      }}
                    >
                      {collapsible && (
                        <svg
                          className="w-4 h-4 transition-transform"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ transform: 'rotate(90deg)' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                      {swimlane.icon && (
                        <span className="flex-shrink-0" style={{ transform: 'rotate(90deg)' }}>
                          {swimlane.icon}
                        </span>
                      )}
                      <span
                        className={clsx(
                          'text-xs font-semibold',
                          'text-gray-900 dark:text-gray-100',
                          'whitespace-nowrap'
                        )}
                        style={{ transform: 'rotate(180deg)' }}
                      >
                        {swimlane.title}
                      </span>
                      {hasCards && (
                        <span
                          className="text-gray-500 dark:text-gray-400 text-xs font-medium"
                          style={{ transform: 'rotate(180deg)' }}
                        >
                          {swimlane.cards.length}
                        </span>
                      )}
                    </div>
                  ) : (
                    // Normal header (horizontal or expanded vertical)
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {collapsible && (
                          <svg
                            className={clsx(
                              'w-4 h-4 transition-transform',
                              orientation === 'vertical' && !collapsed && 'rotate-90',
                              orientation === 'horizontal' && !collapsed && 'rotate-90'
                            )}
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
                        {swimlane.icon && (
                          <span className="flex-shrink-0">{swimlane.icon}</span>
                        )}
                        <span className={clsx(sizes.title, 'text-gray-900 dark:text-gray-100')}>
                          {swimlane.title}
                        </span>
                        {swimlane.metadata && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            {swimlane.metadata}
                          </span>
                        )}
                      </div>
                      {hasCards && (
                        <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                          {swimlane.cards.length}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Cards - Hidden when collapsed */}
              {!collapsed && (
                <div
                  className={clsx('swimlane-cards', swimlane.cardsClassName)}
                  style={cardsContainerStyle}
                >
                  {hasCards ? (
                    swimlane.cards.map((card) => (
                      <div
                        key={card.id}
                        className={clsx(
                          'swimlane-card',
                          variants.card,
                          sizes.card,
                          'rounded-lg transition-all duration-200',
                          onCardClick || card.onClick ? 'cursor-pointer' : '',
                          card.className
                        )}
                        style={{
                          ...cardStyle,
                          borderLeftColor: card.color || undefined,
                          borderLeftWidth: card.color ? '4px' : undefined,
                        }}
                        onClick={() => {
                          card.onClick?.(card);
                          onCardClick?.(card, swimlane.id);
                        }}
                        draggable={draggable || card.draggable}
                        onDragStart={(e) => {
                          if (draggable || card.draggable) {
                            e.dataTransfer.setData('application/json', JSON.stringify(card));
                            e.dataTransfer.effectAllowed = 'move';
                          }
                        }}
                      >
                        {card.title && (
                          <div className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                            {card.title}
                          </div>
                        )}
                        <div className="text-gray-700 dark:text-gray-300">{card.content}</div>
                        {card.metadata && (
                          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {card.metadata}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-400 dark:text-gray-500 py-8 px-4">
                      {emptyMessage}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Swimlane;

