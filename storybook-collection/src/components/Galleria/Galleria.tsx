import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface GalleriaResponsiveOption {
  /**
   * Maximum width breakpoint (e.g., '768px', '1024px')
   */
  breakpoint: string;
  /**
   * Number of visible thumbnails at this breakpoint
   */
  numVisible: number;
}

export interface GalleriaProps {
  /**
   * Array of items to display
   */
  value?: any[];
  /**
   * Template function to render the main item
   */
  item?: (item: any, index: number) => React.ReactNode;
  /**
   * Template function to render thumbnails
   */
  thumbnail?: (item: any, index: number) => React.ReactNode;
  /**
   * Template function to render caption
   */
  caption?: (item: any, index: number) => React.ReactNode;
  /**
   * Template function to render footer
   */
  footer?: (item: any, index: number) => React.ReactNode;
  /**
   * Template function to render indicator
   */
  indicator?: (index: number) => React.ReactNode;
  /**
   * Number of visible thumbnails
   */
  numVisible?: number;
  /**
   * Responsive options for different screen sizes
   */
  responsiveOptions?: GalleriaResponsiveOption[];
  /**
   * Whether carousel is circular (infinite scroll)
   */
  circular?: boolean;
  /**
   * Whether to show thumbnails
   */
  showThumbnails?: boolean;
  /**
   * Position of thumbnails
   */
  thumbnailsPosition?: 'bottom' | 'top' | 'left' | 'right';
  /**
   * Whether to show indicators
   */
  showIndicators?: boolean;
  /**
   * Position of indicators
   */
  indicatorsPosition?: 'bottom' | 'top' | 'left' | 'right';
  /**
   * Whether to show indicators on item (inside image)
   */
  showIndicatorsOnItem?: boolean;
  /**
   * Whether to change item on indicator hover
   */
  changeItemOnIndicatorHover?: boolean;
  /**
   * Whether to show item navigators (prev/next buttons)
   */
  showItemNavigators?: boolean;
  /**
   * Whether to show navigators on hover only
   */
  showItemNavigatorsOnHover?: boolean;
  /**
   * Whether to enable fullscreen mode
   */
  fullScreen?: boolean;
  /**
   * Whether to enable autoplay
   */
  autoPlay?: boolean;
  /**
   * Autoplay transition interval in milliseconds
   */
  transitionInterval?: number;
  /**
   * Controlled active index
   */
  activeIndex?: number;
  /**
   * Callback when active index changes
   */
  onItemChange?: (event: { index: number }) => void;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom style
   */
  style?: React.CSSProperties;
}

export interface GalleriaRef {
  /**
   * Show the galleria (for fullscreen mode)
   */
  show: () => void;
  /**
   * Hide the galleria (for fullscreen mode)
   */
  hide: () => void;
}

export const Galleria = forwardRef<GalleriaRef, GalleriaProps>(
  (
    {
      value = [],
      item,
      thumbnail,
      caption,
      footer,
      indicator,
      numVisible = 5,
      responsiveOptions = [],
      circular = false,
      showThumbnails = true,
      thumbnailsPosition = 'bottom',
      showIndicators = false,
      indicatorsPosition = 'bottom',
      showIndicatorsOnItem = false,
      changeItemOnIndicatorHover = false,
      showItemNavigators = false,
      showItemNavigatorsOnHover = false,
      fullScreen = false,
      autoPlay = false,
      transitionInterval = 4000,
      activeIndex: controlledActiveIndex,
      onItemChange,
      className,
      style,
    },
    ref
  ) => {
    const [internalActiveIndex, setInternalActiveIndex] = useState(0);
    const [isFullscreenVisible, setIsFullscreenVisible] = useState(false);
    const [effectiveNumVisible, setEffectiveNumVisible] = useState(numVisible);
    const [isHovering, setIsHovering] = useState(false);
    const autoplayTimerRef = useRef<number | null>(null);
    const galleriaRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledActiveIndex !== undefined;
    const activeIndex = isControlled ? controlledActiveIndex : internalActiveIndex;
    const isAutoplayActive = autoPlay && !isFullscreenVisible;

    // Expose methods for fullscreen mode
    useImperativeHandle(ref, () => ({
      show: () => {
        if (fullScreen) {
          setIsFullscreenVisible(true);
          document.body.style.overflow = 'hidden';
        }
      },
      hide: () => {
        setIsFullscreenVisible(false);
        document.body.style.overflow = '';
      },
    }));

    // Handle responsive options
    useEffect(() => {
      const updateResponsive = () => {
        if (responsiveOptions.length === 0) {
          setEffectiveNumVisible(numVisible);
          return;
        }

        const width = window.innerWidth;
        const matchedOption = responsiveOptions
          .map((opt) => ({
            ...opt,
            breakpointNum: parseInt(opt.breakpoint),
          }))
          .sort((a, b) => b.breakpointNum - a.breakpointNum)
          .find((opt) => width <= opt.breakpointNum);

        if (matchedOption) {
          setEffectiveNumVisible(matchedOption.numVisible);
        } else {
          setEffectiveNumVisible(numVisible);
        }
      };

      updateResponsive();
      window.addEventListener('resize', updateResponsive);
      return () => window.removeEventListener('resize', updateResponsive);
    }, [responsiveOptions, numVisible]);

    // Autoplay functionality
    useEffect(() => {
      if (!isAutoplayActive || value.length === 0) {
        if (autoplayTimerRef.current) {
          window.clearInterval(autoplayTimerRef.current);
          autoplayTimerRef.current = null;
        }
        return;
      }

      autoplayTimerRef.current = window.setInterval(() => {
        goToNext();
      }, transitionInterval);

      return () => {
        if (autoplayTimerRef.current) {
          window.clearInterval(autoplayTimerRef.current);
        }
      };
    }, [isAutoplayActive, transitionInterval, activeIndex, value.length, circular]);

    // Close fullscreen on Escape key
    useEffect(() => {
      if (!isFullscreenVisible) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsFullscreenVisible(false);
          document.body.style.overflow = '';
        }
      };

      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }, [isFullscreenVisible]);

    const setActiveIndex = (index: number) => {
      if (!isControlled) {
        setInternalActiveIndex(index);
      }
      onItemChange?.({ index });
    };

    const goToNext = () => {
      if (value.length === 0) return;
      const nextIndex = circular
        ? (activeIndex + 1) % value.length
        : Math.min(activeIndex + 1, value.length - 1);
      setActiveIndex(nextIndex);
    };

    const goToPrev = () => {
      if (value.length === 0) return;
      const prevIndex = circular
        ? (activeIndex - 1 + value.length) % value.length
        : Math.max(activeIndex - 1, 0);
      setActiveIndex(prevIndex);
    };

    const goToIndex = (index: number) => {
      setActiveIndex(index);
    };

    const handleIndicatorHover = (index: number) => {
      if (changeItemOnIndicatorHover) {
        setActiveIndex(index);
      }
    };

    // Get visible thumbnails
    const getVisibleThumbnails = () => {
      if (value.length === 0) return [];

      const thumbnails: any[] = [];
      const startIndex = Math.max(
        0,
        Math.min(activeIndex - Math.floor(effectiveNumVisible / 2), value.length - effectiveNumVisible)
      );

      for (let i = 0; i < effectiveNumVisible; i++) {
        const index = startIndex + i;
        if (index < value.length) {
          thumbnails.push({ item: value[index], index });
        }
      }

      return thumbnails;
    };

    const visibleThumbnails = getVisibleThumbnails();
    const currentItem = value[activeIndex];

    const renderItem = () => {
      if (!currentItem) return null;
      return item ? item(currentItem, activeIndex) : <div>No item template provided</div>;
    };

    const renderThumbnail = (item: any, index: number) => {
      return thumbnail ? thumbnail(item, index) : <div>No thumbnail template provided</div>;
    };

    const renderCaption = () => {
      if (!currentItem || !caption) return null;
      return caption(currentItem, activeIndex);
    };

    const renderFooter = () => {
      if (!currentItem || !footer) return null;
      return footer(currentItem, activeIndex);
    };

    const renderIndicator = (index: number) => {
      if (indicator) {
        return (
          <button
            type="button"
            className="focus:outline-none"
            onClick={() => goToIndex(index)}
            onMouseEnter={() => handleIndicatorHover(index)}
            aria-label={`Go to item ${index + 1}`}
            aria-current={activeIndex === index ? 'true' : undefined}
          >
            {indicator(index)}
          </button>
        );
      }
      return (
        <button
          type="button"
          className={clsx(
            'w-2 h-2 rounded-full transition-all duration-200',
            'hover:scale-125',
            activeIndex === index
              ? 'bg-blue-600 dark:bg-blue-400 w-8'
              : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
          )}
          onClick={() => goToIndex(index)}
          onMouseEnter={() => handleIndicatorHover(index)}
          aria-label={`Go to item ${index + 1}`}
          aria-current={activeIndex === index ? 'true' : undefined}
        />
      );
    };

    const showNavigators = showItemNavigators && (!showItemNavigatorsOnHover || isHovering);

    const content = (
      <div
        ref={galleriaRef}
        className={clsx('relative', className)}
        style={style}
        role="region"
        aria-label="Galleria"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Indicators on top/left/right */}
        {showIndicators &&
          !showIndicatorsOnItem &&
          (indicatorsPosition === 'top' ||
            indicatorsPosition === 'left' ||
            indicatorsPosition === 'right') && (
            <div
              className={clsx(
                'flex items-center justify-center gap-2 z-10',
                indicatorsPosition === 'top' && 'absolute top-4 left-1/2 -translate-x-1/2',
                indicatorsPosition === 'left' && 'absolute left-4 top-1/2 -translate-y-1/2 flex-col',
                indicatorsPosition === 'right' && 'absolute right-4 top-1/2 -translate-y-1/2 flex-col'
              )}
              role="tablist"
            >
              {value.map((_, index) => (
                <div key={index}>{renderIndicator(index)}</div>
              ))}
            </div>
          )}

        {/* Main item container */}
        <div className="relative">
          {/* Item navigators */}
          {showNavigators && (
            <>
              <button
                type="button"
                className={clsx(
                  'absolute z-20 flex items-center justify-center',
                  'w-10 h-10 rounded-full',
                  'bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700',
                  'shadow-lg hover:shadow-xl',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-50 dark:hover:bg-gray-700',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'top-1/2 -translate-y-1/2 left-4'
                )}
                onClick={goToPrev}
                disabled={!circular && activeIndex === 0}
                aria-label="Previous item"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                className={clsx(
                  'absolute z-20 flex items-center justify-center',
                  'w-10 h-10 rounded-full',
                  'bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700',
                  'shadow-lg hover:shadow-xl',
                  'text-gray-700 dark:text-gray-300',
                  'hover:bg-gray-50 dark:hover:bg-gray-700',
                  'transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'top-1/2 -translate-y-1/2 right-4'
                )}
                onClick={goToNext}
                disabled={!circular && activeIndex >= value.length - 1}
                aria-label="Next item"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Indicators on item (inside) */}
          {showIndicators && showIndicatorsOnItem && (
            <div
              className={clsx(
                'absolute z-10 flex items-center justify-center gap-2',
                indicatorsPosition === 'top' && 'top-4 left-1/2 -translate-x-1/2',
                indicatorsPosition === 'bottom' && 'bottom-4 left-1/2 -translate-x-1/2',
                indicatorsPosition === 'left' && 'left-4 top-1/2 -translate-y-1/2 flex-col',
                indicatorsPosition === 'right' && 'right-4 top-1/2 -translate-y-1/2 flex-col'
              )}
              role="tablist"
            >
              {value.map((_, index) => (
                <div key={index}>{renderIndicator(index)}</div>
              ))}
            </div>
          )}

          {/* Main item */}
          <div
            className="relative"
            aria-live={isAutoplayActive ? 'off' : 'polite'}
            role="group"
            aria-label={`Item ${activeIndex + 1} of ${value.length}`}
          >
            {renderItem()}
          </div>

          {/* Caption */}
          {renderCaption() && (
            <div className="mt-4 text-center">{renderCaption()}</div>
          )}

          {/* Indicators on bottom */}
          {showIndicators &&
            !showIndicatorsOnItem &&
            indicatorsPosition === 'bottom' && (
              <div
                className="flex items-center justify-center gap-2 mt-4"
                role="tablist"
              >
                {value.map((_, index) => (
                  <div key={index}>{renderIndicator(index)}</div>
                ))}
              </div>
            )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && value.length > 0 && (
          <div
            className={clsx(
              'flex items-center justify-center gap-2 overflow-x-auto',
              thumbnailsPosition === 'top' && 'mb-4 order-first',
              thumbnailsPosition === 'bottom' && 'mt-4',
              thumbnailsPosition === 'left' && 'flex-col absolute left-0 top-0 h-full',
              thumbnailsPosition === 'right' && 'flex-col absolute right-0 top-0 h-full'
            )}
            style={
              thumbnailsPosition === 'left' || thumbnailsPosition === 'right'
                ? { maxHeight: '100%' }
                : undefined
            }
          >
            {visibleThumbnails.map(({ item: thumbItem, index }) => (
              <div
                key={index}
                className={clsx(
                  'flex-shrink-0 cursor-pointer transition-all duration-200',
                  'border-2 rounded',
                  activeIndex === index
                    ? 'border-blue-600 dark:border-blue-400 scale-105'
                    : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 opacity-70 hover:opacity-100'
                )}
                onClick={() => goToIndex(index)}
              >
                {renderThumbnail(thumbItem, index)}
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {renderFooter() && <div className="mt-4">{renderFooter()}</div>}
      </div>
    );

    if (fullScreen && isFullscreenVisible) {
      return (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsFullscreenVisible(false);
              document.body.style.overflow = '';
            }
          }}
        >
          <button
            type="button"
            className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
            onClick={() => {
              setIsFullscreenVisible(false);
              document.body.style.overflow = '';
            }}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="max-w-7xl w-full max-h-full overflow-auto">{content}</div>
        </div>
      );
    }

    return content;
  }
);

Galleria.displayName = 'Galleria';

