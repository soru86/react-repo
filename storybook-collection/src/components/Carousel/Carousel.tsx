import React, { useState, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';

export interface CarouselResponsiveOption {
    /**
     * Maximum width breakpoint (e.g., '768px', '1024px')
     */
    breakpoint: string;
    /**
     * Number of visible items at this breakpoint
     */
    numVisible: number;
    /**
     * Number of items to scroll at this breakpoint
     */
    numScroll: number;
}

export interface CarouselProps {
    /**
     * Array of items to display
     */
    value: any[];
    /**
     * Template function to render each item
     */
    itemTemplate?: (item: any, index: number) => React.ReactNode;
    /**
     * Number of items visible at once
     */
    numVisible?: number;
    /**
     * Number of items to scroll
     */
    numScroll?: number;
    /**
     * Responsive options for different screen sizes
     */
    responsiveOptions?: CarouselResponsiveOption[];
    /**
     * Whether carousel is circular (infinite scroll)
     */
    circular?: boolean;
    /**
     * Autoplay interval in milliseconds
     */
    autoplayInterval?: number;
    /**
     * Orientation of the carousel
     */
    orientation?: 'horizontal' | 'vertical';
    /**
     * Viewport height for vertical carousel
     */
    verticalViewPortHeight?: string;
    /**
     * Whether to show navigation buttons
     */
    showNavigators?: boolean;
    /**
     * Whether to show indicators/dots
     */
    showIndicators?: boolean;
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom style
     */
    style?: React.CSSProperties;
    /**
     * Callback when page changes
     */
    onPageChange?: (page: number) => void;
}

export const Carousel: React.FC<CarouselProps> = ({
    value = [],
    itemTemplate,
    numVisible = 1,
    numScroll = 1,
    responsiveOptions = [],
    circular = false,
    autoplayInterval,
    orientation = 'horizontal',
    verticalViewPortHeight = '360px',
    showNavigators = true,
    showIndicators = true,
    className,
    style,
    onPageChange,
}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [effectiveNumVisible, setEffectiveNumVisible] = useState(numVisible);
    const [effectiveNumScroll, setEffectiveNumScroll] = useState(numScroll);
    const carouselRef = useRef<HTMLDivElement>(null);
    const autoplayTimerRef = useRef<number | null>(null);
    const isAutoplayActive = autoplayInterval !== undefined && autoplayInterval > 0;

    // Calculate total pages
    const totalPages = Math.ceil(value.length / effectiveNumScroll);
    const isCircular = circular || isAutoplayActive;

    // Handle responsive options
    useEffect(() => {
        const updateResponsive = () => {
            if (responsiveOptions.length === 0) {
                setEffectiveNumVisible(numVisible);
                setEffectiveNumScroll(numScroll);
                return;
            }

            const width = window.innerWidth;
            let matchedOption = responsiveOptions
                .map((opt) => ({
                    ...opt,
                    breakpointNum: parseInt(opt.breakpoint),
                }))
                .sort((a, b) => b.breakpointNum - a.breakpointNum)
                .find((opt) => width <= opt.breakpointNum);

            if (matchedOption) {
                setEffectiveNumVisible(matchedOption.numVisible);
                setEffectiveNumScroll(matchedOption.numScroll);
            } else {
                setEffectiveNumVisible(numVisible);
                setEffectiveNumScroll(numScroll);
            }
        };

        updateResponsive();
        window.addEventListener('resize', updateResponsive);
        return () => window.removeEventListener('resize', updateResponsive);
    }, [responsiveOptions, numVisible, numScroll]);

    // Autoplay functionality
    useEffect(() => {
        if (!isAutoplayActive) {
            if (autoplayTimerRef.current) {
                clearInterval(autoplayTimerRef.current);
                autoplayTimerRef.current = null;
            }
            return;
        }

        autoplayTimerRef.current = window.setInterval(() => {
            goToNext();
        }, autoplayInterval);

        return () => {
            if (autoplayTimerRef.current) {
                window.clearInterval(autoplayTimerRef.current);
            }
        };
    }, [isAutoplayActive, autoplayInterval, effectiveNumScroll, value.length]);

    const goToPage = useCallback(
        (page: number) => {
            if (isCircular) {
                setCurrentPage(page);
                onPageChange?.(page);
            } else {
                const maxPage = totalPages - 1;
                const newPage = Math.max(0, Math.min(page, maxPage));
                setCurrentPage(newPage);
                onPageChange?.(newPage);
            }
        },
        [isCircular, totalPages, onPageChange]
    );

    const goToNext = useCallback(() => {
        if (isCircular) {
            const nextPage = (currentPage + 1) % totalPages;
            goToPage(nextPage);
        } else {
            const nextPage = Math.min(currentPage + 1, totalPages - 1);
            goToPage(nextPage);
        }
    }, [currentPage, totalPages, isCircular, goToPage]);

    const goToPrev = useCallback(() => {
        if (isCircular) {
            const prevPage = currentPage === 0 ? totalPages - 1 : currentPage - 1;
            goToPage(prevPage);
        } else {
            const prevPage = Math.max(0, currentPage - 1);
            goToPage(prevPage);
        }
    }, [currentPage, totalPages, isCircular, goToPage]);

    const goToIndicator = useCallback(
        (index: number) => {
            goToPage(index);
        },
        [goToPage]
    );

    // Render all items, transform to show the right section
    const allItems = value;
    const isVertical = orientation === 'vertical';

    return (
        <div
            ref={carouselRef}
            className={clsx(
                'relative w-full',
                className
            )}
            style={style}
            role="region"
            aria-label="Carousel"
        >
            <div
                className={clsx(
                    'relative w-full overflow-hidden',
                    isVertical && 'flex flex-col',
                    isAutoplayActive && 'carousel-autoplay'
                )}
                style={
                    isVertical
                        ? {
                            height: verticalViewPortHeight,
                        }
                        : undefined
                }
            >
                {showNavigators && (
                    <>
                        <button
                            type="button"
                            className={clsx(
                                'absolute z-10 flex items-center justify-center',
                                'w-10 h-10 rounded-full',
                                'bg-white dark:bg-gray-800',
                                'border border-gray-200 dark:border-gray-700',
                                'shadow-lg hover:shadow-xl',
                                'text-gray-700 dark:text-gray-300',
                                'hover:bg-gray-50 dark:hover:bg-gray-700',
                                'transition-all duration-200',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                isVertical
                                    ? 'top-2 left-1/2 -translate-x-1/2'
                                    : 'top-1/2 -translate-y-1/2 left-4'
                            )}
                            onClick={goToPrev}
                            aria-label="Previous page"
                            disabled={!isCircular && currentPage === 0}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isVertical ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 15l7-7 7 7"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                )}
                            </svg>
                        </button>
                        <button
                            type="button"
                            className={clsx(
                                'absolute z-10 flex items-center justify-center',
                                'w-10 h-10 rounded-full',
                                'bg-white dark:bg-gray-800',
                                'border border-gray-200 dark:border-gray-700',
                                'shadow-lg hover:shadow-xl',
                                'text-gray-700 dark:text-gray-300',
                                'hover:bg-gray-50 dark:hover:bg-gray-700',
                                'transition-all duration-200',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                isVertical
                                    ? 'bottom-2 left-1/2 -translate-x-1/2'
                                    : 'top-1/2 -translate-y-1/2 right-4'
                            )}
                            onClick={goToNext}
                            aria-label="Next page"
                            disabled={!isCircular && currentPage >= totalPages - 1}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isVertical ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                )}
                            </svg>
                        </button>
                    </>
                )}

                <div
                    className={clsx(
                        'relative w-full',
                        isVertical ? 'h-full overflow-hidden' : 'overflow-hidden'
                    )}
                    aria-live={isAutoplayActive ? 'off' : 'polite'}
                >
                    <div
                        className={clsx(
                            'flex',
                            isVertical ? 'flex-col h-full' : 'flex-row'
                        )}
                        style={{
                            transform: isVertical
                                ? `translateY(-${currentPage * effectiveNumScroll * (100 / effectiveNumVisible)}%)`
                                : `translateX(-${currentPage * effectiveNumScroll * (100 / effectiveNumVisible)}%)`,
                            transition: 'transform 0.5s ease-in-out',
                        }}
                    >
                        {allItems.map((item, index) => (
                            <div
                                key={index}
                                className={clsx(
                                    'flex-shrink-0',
                                    isVertical ? 'w-full' : ''
                                )}
                                role="group"
                                aria-label={`Slide ${index + 1}`}
                                aria-hidden={
                                    index < currentPage * effectiveNumScroll ||
                                        index >= currentPage * effectiveNumScroll + effectiveNumVisible
                                        ? 'true'
                                        : undefined
                                }
                                style={{
                                    width: isVertical ? '100%' : `${100 / effectiveNumVisible}%`,
                                    height: isVertical ? `${100 / effectiveNumVisible}%` : 'auto',
                                }}
                            >
                                {itemTemplate ? (
                                    itemTemplate(item, index)
                                ) : (
                                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                        {JSON.stringify(item)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {showIndicators && totalPages > 1 && (
                    <div
                        className={clsx(
                            'flex items-center justify-center gap-2',
                            'absolute z-10',
                            isVertical
                                ? 'right-4 top-1/2 -translate-y-1/2 flex-col'
                                : 'bottom-4 left-1/2 -translate-x-1/2'
                        )}
                        role="tablist"
                    >
                        {Array.from({ length: totalPages }).map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                className={clsx(
                                    'w-2 h-2 rounded-full transition-all duration-200',
                                    'hover:scale-125',
                                    currentPage === index
                                        ? 'bg-blue-600 dark:bg-blue-400 w-8'
                                        : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                                )}
                                onClick={() => goToIndicator(index)}
                                aria-label={`Go to page ${index + 1}`}
                                aria-current={currentPage === index ? 'true' : undefined}
                                role="tab"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

