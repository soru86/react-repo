import React from 'react';
import { clsx } from 'clsx';

export type TimelineLayout = 'vertical' | 'horizontal';
export type TimelineAlign = 'left' | 'right' | 'alternate' | 'top' | 'bottom';

export interface TimelineProps<T = any> {
  /**
   * Array of events/items to display
   */
  value: T[];
  /**
   * Function to render content for each event
   */
  content?: (item: T, index: number) => React.ReactNode;
  /**
   * Function to render opposite content (other side of the line) or ReactNode
   */
  opposite?: ((item: T, index: number) => React.ReactNode) | React.ReactNode;
  /**
   * Function to render custom marker for each event
   */
  marker?: (item: T, index: number) => React.ReactNode;
  /**
   * Layout orientation
   */
  layout?: TimelineLayout;
  /**
   * Content alignment relative to the line
   */
  align?: TimelineAlign;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Additional CSS classes for the list container
   */
  listClassName?: string;
  /**
   * Additional CSS classes for each timeline item
   */
  itemClassName?: string;
}

const defaultMarker = (index: number) => (
  <div className="w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-500 border-2 border-white dark:border-gray-900 shadow-sm" />
);

export const Timeline = <T extends any = any>({
  value,
  content,
  opposite,
  marker,
  layout = 'vertical',
  align = 'left',
  className,
  listClassName,
  itemClassName,
}: TimelineProps<T>) => {
  const isVertical = layout === 'vertical';
  const isHorizontal = layout === 'horizontal';

  // Determine alignment for vertical timeline
  const verticalAlign = isVertical
    ? align === 'left' || align === 'right'
      ? align
      : align === 'alternate'
      ? 'alternate'
      : 'left'
    : 'left';

  // Determine alignment for horizontal timeline
  const horizontalAlign = isHorizontal
    ? align === 'top' || align === 'bottom'
      ? align
      : align === 'alternate'
      ? 'alternate'
      : 'top'
    : 'top';

  const renderMarker = (item: T, index: number) => {
    if (marker) {
      return marker(item, index);
    }
    return defaultMarker(index);
  };

  const renderContent = (item: T, index: number) => {
    if (content) {
      return content(item, index);
    }
    return <span>{String(item)}</span>;
  };

  const renderOpposite = (item: T, index: number) => {
    if (opposite) {
      if (typeof opposite === 'function') {
        return opposite(item, index);
      }
      return opposite;
    }
    return null;
  };

  if (isVertical) {
    return (
      <ol
        className={clsx(
          'timeline-vertical relative',
          'border-l-2 border-gray-200 dark:border-gray-700',
          className,
          listClassName
        )}
      >
        {value.map((item, index) => {
          const isAlternate = verticalAlign === 'alternate';
          const isRight = verticalAlign === 'right' || (isAlternate && index % 2 === 1);
          const isLeft = verticalAlign === 'left' || (isAlternate && index % 2 === 0);

          return (
            <li
              key={index}
              className={clsx(
                'relative mb-8 last:mb-0',
                'flex',
                isRight ? 'flex-row-reverse' : 'flex-row',
                itemClassName
              )}
            >
              {/* Timeline line connector */}
              {index < value.length - 1 && (
                <div
                  className={clsx(
                    'absolute',
                    'w-0.5 bg-gray-200 dark:bg-gray-700',
                    'z-0'
                  )}
                  style={{
                    [isRight ? 'right' : 'left']: '11px',
                    top: '24px',
                    height: 'calc(100% + 1rem)',
                  }}
                />
              )}

              {/* Marker */}
              <div
                className={clsx(
                  'relative z-10 flex-shrink-0',
                  'flex items-center justify-center',
                  'w-6 h-6',
                  'bg-white dark:bg-gray-900',
                  isRight ? 'mr-4' : 'ml-4'
                )}
                style={{
                  [isRight ? 'right' : 'left']: '-13px',
                }}
              >
                {renderMarker(item, index)}
              </div>

              {/* Content */}
              <div
                className={clsx(
                  'flex-1',
                  isRight ? 'text-right mr-8' : 'text-left ml-8',
                  isAlternate && 'w-full md:w-1/2'
                )}
              >
                {renderContent(item, index)}
              </div>

              {/* Opposite content */}
              {opposite && (
                <div
                  className={clsx(
                    'flex-1',
                    isRight ? 'text-left ml-8' : 'text-right mr-8',
                    isAlternate && 'w-full md:w-1/2'
                  )}
                >
                  {renderOpposite(item, index)}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  // Horizontal layout
  return (
    <ol
      className={clsx(
        'timeline-horizontal relative',
        'border-t-2 border-gray-200 dark:border-gray-700',
        'flex flex-row',
        className,
        listClassName
      )}
    >
      {value.map((item, index) => {
        const isAlternate = horizontalAlign === 'alternate';
        const isBottom = horizontalAlign === 'bottom' || (isAlternate && index % 2 === 1);
        const isTop = horizontalAlign === 'top' || (isAlternate && index % 2 === 0);

        return (
          <li
            key={index}
            className={clsx(
              'relative flex-1',
              'flex flex-col',
              isBottom ? 'flex-col-reverse' : 'flex-col',
              itemClassName
            )}
          >
            {/* Timeline line connector */}
            {index < value.length - 1 && (
              <div
                className={clsx(
                  'absolute',
                  'h-0.5 bg-gray-200 dark:bg-gray-700',
                  'z-0'
                )}
                style={{
                  left: '50%',
                  width: '50%',
                  top: isTop ? '12px' : 'auto',
                  bottom: isBottom ? '12px' : 'auto',
                }}
              />
            )}

            {/* Marker */}
            <div
              className={clsx(
                'relative z-10 flex-shrink-0',
                'flex items-center justify-center',
                'w-6 h-6 mx-auto',
                'bg-white dark:bg-gray-900',
                isTop ? 'mb-4' : 'mt-4'
              )}
            >
              {renderMarker(item, index)}
            </div>

            {/* Content */}
            <div
              className={clsx(
                'flex-1 text-center',
                isTop ? 'mb-4' : 'mt-4',
                'px-2'
              )}
            >
              {renderContent(item, index)}
            </div>

            {/* Opposite content */}
            {opposite && (
              <div
                className={clsx(
                  'flex-1 text-center',
                  isTop ? 'mt-4' : 'mb-4',
                  'px-2'
                )}
              >
                {renderOpposite(item, index)}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
};

