import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface SpeedDialItem {
    /**
     * Item label
     */
    label?: string;
    /**
     * Item icon
     */
    icon?: React.ReactNode;
    /**
     * Item command/action
     */
    command?: () => void;
    /**
     * Whether item is disabled
     */
    disabled?: boolean;
    /**
     * Whether item is visible
     */
    visible?: boolean;
    /**
     * Custom template
     */
    template?: React.ReactNode;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Tooltip text
     */
    tooltip?: string;
    /**
     * Tooltip position
     */
    tooltipOptions?: {
        position?: 'top' | 'bottom' | 'left' | 'right';
    };
}

export interface SpeedDialProps {
    /**
     * Array of menu items
     */
    model?: SpeedDialItem[];
    /**
     * Direction of items relative to button
     */
    direction?: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right';
    /**
     * Type of layout
     */
    type?: 'linear' | 'circle' | 'semi-circle' | 'quarter-circle';
    /**
     * Radius for circle types
     */
    radius?: number;
    /**
     * Whether to show mask (modal layer)
     */
    mask?: boolean;
    /**
     * Custom button class name
     */
    buttonClassName?: string;
    /**
     * Show icon (when closed)
     */
    showIcon?: React.ReactNode;
    /**
     * Hide icon (when open)
     */
    hideIcon?: React.ReactNode;
    /**
     * Transition delay in milliseconds
     */
    transitionDelay?: number;
    /**
     * Custom class name
     */
    className?: string;
    /**
     * Custom style
     */
    style?: React.CSSProperties;
    /**
     * Whether speed dial is visible
     */
    visible?: boolean;
    /**
     * Callback when visibility changes
     */
    onVisibleChange?: (visible: boolean) => void;
    /**
     * Button label (for accessibility)
     */
    'aria-label'?: string;
}

export const SpeedDial: React.FC<SpeedDialProps> = ({
    model = [],
    direction = 'up',
    type = 'linear',
    radius = 80,
    mask = false,
    buttonClassName,
    showIcon,
    hideIcon,
    transitionDelay = 30,
    className,
    style,
    visible: controlledVisible,
    onVisibleChange,
    'aria-label': ariaLabel = 'Speed dial',
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredItem, setHoveredItem] = useState<number | null>(null);
    const speedDialRef = useRef<HTMLDivElement>(null);
    const maskRef = useRef<HTMLDivElement>(null);

    const isControlled = controlledVisible !== undefined;
    const visible = isControlled ? controlledVisible : isVisible;

    const filteredItems = model.filter((item) => item.visible !== false);

    const toggle = () => {
        const newVisible = !visible;
        if (!isControlled) {
            setIsVisible(newVisible);
        }
        onVisibleChange?.(newVisible);
    };

    const handleItemClick = (item: SpeedDialItem) => {
        if (item.disabled) return;
        item.command?.();
        // Close after item click
        if (!isControlled) {
            setIsVisible(false);
        }
        onVisibleChange?.(false);
    };

    // Close on outside click
    useEffect(() => {
        if (!visible) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (
                speedDialRef.current &&
                !speedDialRef.current.contains(e.target as Node) &&
                (!maskRef.current || !maskRef.current.contains(e.target as Node))
            ) {
                if (!isControlled) {
                    setIsVisible(false);
                }
                onVisibleChange?.(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [visible, isControlled, onVisibleChange]);

    // Close on Escape key
    useEffect(() => {
        if (!visible) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (!isControlled) {
                    setIsVisible(false);
                }
                onVisibleChange?.(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [visible, isControlled, onVisibleChange]);

    // Reset hovered item when speed dial closes
    useEffect(() => {
        if (!visible) {
            setHoveredItem(null);
        }
    }, [visible]);

    // Calculate item positions
    const getItemPosition = (index: number, total: number) => {
        if (type === 'linear') {
            return getLinearPosition(index);
        } else if (type === 'circle') {
            return getCirclePosition(index, total);
        } else if (type === 'semi-circle') {
            return getSemiCirclePosition(index, total);
        } else if (type === 'quarter-circle') {
            return getQuarterCirclePosition(index, total);
        }
        return { x: 0, y: 0 };
    };

    const getLinearPosition = (index: number) => {
        const spacing = 70; // Increased spacing between items

        switch (direction) {
            case 'up':
                return { x: 0, y: -(index + 1) * spacing };
            case 'down':
                return { x: 0, y: (index + 1) * spacing };
            case 'left':
                return { x: -(index + 1) * spacing, y: 0 };
            case 'right':
                return { x: (index + 1) * spacing, y: 0 };
            default:
                return { x: 0, y: 0 };
        }
    };

    const getCirclePosition = (index: number, total: number) => {
        const angle = (index * 360) / total - 90; // Start from top
        const rad = (angle * Math.PI) / 180;
        return {
            x: Math.cos(rad) * radius,
            y: Math.sin(rad) * radius,
        };
    };

    const getSemiCirclePosition = (index: number, total: number) => {
        const { startAngle, endAngle } = getSemiCircleAngleRange();
        // Handle both forward and backward angle sweeps
        let angleDiff = endAngle - startAngle;
        if (angleDiff < 0) {
            angleDiff += 360; // Normalize negative difference
        }
        const angleStep = angleDiff / (total + 1);
        let angle = startAngle + angleStep * (index + 1);
        // Normalize angle to 0-360 range
        if (angle < 0) angle += 360;
        if (angle >= 360) angle -= 360;

        const rad = (angle * Math.PI) / 180;
        return {
            x: Math.cos(rad) * radius,
            y: Math.sin(rad) * radius,
        };
    };

    const getSemiCircleAngleRange = () => {
        // For semi-circle, items should appear on the OPPOSITE side of the button
        // The direction indicates where the button is positioned
        switch (direction) {
            case 'up':
                // Button is at bottom, items should appear above in a semi-circle
                // Semi-circle spans from left to right across the top: 180° to 360° (or -180° to 0°)
                return { startAngle: 180, endAngle: 360 }; // Going from left to right across top
            case 'down':
                // Button is at top, items should appear below in a semi-circle
                // Semi-circle spans from left to right across the bottom: 0° to 180°
                return { startAngle: 0, endAngle: 180 }; // Going from right to left across bottom
            case 'left':
                // Button is at right, items should appear to the left in a semi-circle
                // Semi-circle spans from top to bottom on the left: 90° to 270°
                return { startAngle: 90, endAngle: 270 }; // Going from top to bottom on left
            case 'right':
                // Button is at left, items should appear to the right in a semi-circle
                // Semi-circle spans from top to bottom on the right: 270° to 90° (wrapping)
                return { startAngle: 270, endAngle: 450 }; // Going from bottom to top on right (450 = 90 + 360)
            default:
                return { startAngle: 180, endAngle: 360 };
        }
    };

    const getQuarterCirclePosition = (index: number, total: number) => {
        const startAngle = getQuarterCircleStartAngle();
        const angleStep = 90 / (total + 1);
        const angle = startAngle + angleStep * (index + 1);
        const rad = (angle * Math.PI) / 180;
        return {
            x: Math.cos(rad) * radius,
            y: Math.sin(rad) * radius,
        };
    };

    const getQuarterCircleStartAngle = () => {
        switch (direction) {
            case 'up-left':
                return 180;
            case 'up-right':
                return 270;
            case 'down-left':
                return 90;
            case 'down-right':
                return 0;
            default:
                return 270;
        }
    };

    const defaultShowIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
            />
        </svg>
    );

    const defaultHideIcon = (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );

    return (
        <>
            {mask && visible && (
                <div
                    ref={maskRef}
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => {
                        if (!isControlled) {
                            setIsVisible(false);
                        }
                        onVisibleChange?.(false);
                    }}
                />
            )}
            <div
                ref={speedDialRef}
                className={clsx('relative inline-block', className)}
                style={style}
            >
                <button
                    type="button"
                    onClick={toggle}
                    className={clsx(
                        'w-14 h-14 rounded-full',
                        'flex items-center justify-center',
                        'bg-blue-600 hover:bg-blue-700',
                        'text-white',
                        'shadow-lg hover:shadow-xl',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        'z-50 relative',
                        buttonClassName
                    )}
                    aria-label={ariaLabel}
                    aria-haspopup="true"
                    aria-expanded={visible}
                    aria-controls="speeddial-menu"
                >
                    {visible ? (hideIcon || defaultHideIcon) : (showIcon || defaultShowIcon)}
                </button>

                {visible && filteredItems.length > 0 && (
                    <div
                        id="speeddial-menu"
                        className="absolute z-50 pointer-events-none"
                        role="menu"
                        aria-label="Speed dial menu"
                        style={{
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: type === 'linear' && (direction === 'left' || direction === 'right')
                                ? `${filteredItems.length * 70 + 56}px`
                                : type === 'circle' || type === 'semi-circle' || type === 'quarter-circle'
                                    ? `${radius * 2 + 56}px`
                                    : '56px',
                            height: type === 'linear' && (direction === 'up' || direction === 'down')
                                ? `${filteredItems.length * 70 + 56}px`
                                : type === 'circle' || type === 'semi-circle' || type === 'quarter-circle'
                                    ? `${radius * 2 + 56}px`
                                    : '56px',
                        }}
                    >
                        {filteredItems.map((item, index) => {
                            const position = getItemPosition(index, filteredItems.length);
                            const delay = index * transitionDelay;

                            return (
                                <div
                                    key={index}
                                    className="absolute pointer-events-auto"
                                    style={{
                                        left: `calc(50% + ${position.x}px)`,
                                        top: `calc(50% + ${position.y}px)`,
                                        transform: 'translate(-50%, -50%)',
                                        transition: `all 0.3s ease ${delay}ms`,
                                        opacity: visible ? 1 : 0,
                                        pointerEvents: visible ? 'auto' : 'none',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleItemClick(item)}
                                        onMouseEnter={() => setHoveredItem(index)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        disabled={item.disabled}
                                        className={clsx(
                                            'w-12 h-12 rounded-full',
                                            'flex items-center justify-center',
                                            'bg-white dark:bg-gray-800',
                                            'text-gray-700 dark:text-gray-300',
                                            'shadow-lg hover:shadow-xl',
                                            'border border-gray-200 dark:border-gray-700',
                                            'hover:bg-gray-50 dark:hover:bg-gray-700',
                                            'transition-all duration-200',
                                            'focus:outline-none focus:ring-2 focus:ring-blue-500',
                                            'disabled:opacity-50 disabled:cursor-not-allowed',
                                            item.className
                                        )}
                                        role="menuitem"
                                        aria-label={item.label || item.tooltip || `Action ${index + 1}`}
                                    >
                                        {item.template || item.icon}
                                    </button>
                                    {item.tooltip && hoveredItem === index && visible && (
                                        <div
                                            className={clsx(
                                                'absolute whitespace-nowrap',
                                                'px-2 py-1 rounded',
                                                'bg-gray-900 dark:bg-gray-700 text-white text-sm',
                                                'shadow-lg z-50',
                                                'pointer-events-none',
                                                'animate-in fade-in duration-200',
                                                item.tooltipOptions?.position === 'left' && 'right-full mr-2 top-1/2 -translate-y-1/2',
                                                item.tooltipOptions?.position === 'right' && 'left-full ml-2 top-1/2 -translate-y-1/2',
                                                item.tooltipOptions?.position === 'top' && 'bottom-full mb-2 left-1/2 -translate-x-1/2',
                                                (!item.tooltipOptions?.position || item.tooltipOptions?.position === 'bottom') && 'top-full mt-2 left-1/2 -translate-x-1/2'
                                            )}
                                        >
                                            {item.tooltip}
                                            <div
                                                className={clsx(
                                                    'absolute w-0 h-0 border-4 border-transparent',
                                                    item.tooltipOptions?.position === 'left' && 'left-full top-1/2 -translate-y-1/2 border-l-gray-900 dark:border-l-gray-700',
                                                    item.tooltipOptions?.position === 'right' && 'right-full top-1/2 -translate-y-1/2 border-r-gray-900 dark:border-r-gray-700',
                                                    item.tooltipOptions?.position === 'top' && 'top-full left-1/2 -translate-x-1/2 border-t-gray-900 dark:border-t-gray-700',
                                                    (!item.tooltipOptions?.position || item.tooltipOptions?.position === 'bottom') && 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900 dark:border-b-gray-700'
                                                )}
                                            />
                                        </div>
                                    )}
                                    {item.label && item.tooltip && (
                                        <div
                                            className={clsx(
                                                'absolute whitespace-nowrap',
                                                'px-2 py-1 rounded text-xs',
                                                'bg-gray-900 dark:bg-gray-700 text-white',
                                                'shadow-lg z-50',
                                                'pointer-events-none',
                                                direction === 'up' && 'bottom-full mb-2 left-1/2 -translate-x-1/2',
                                                direction === 'down' && 'top-full mt-2 left-1/2 -translate-x-1/2',
                                                direction === 'left' && 'right-full mr-2 top-1/2 -translate-y-1/2',
                                                direction === 'right' && 'left-full ml-2 top-1/2 -translate-y-1/2'
                                            )}
                                        >
                                            {item.label}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
};

