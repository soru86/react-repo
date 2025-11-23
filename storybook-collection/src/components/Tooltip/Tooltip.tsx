import React, { useState, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';

export type TooltipPosition =
  | 'top'
  | 'top-left'
  | 'top-right'
  | 'bottom'
  | 'bottom-left'
  | 'bottom-right'
  | 'left'
  | 'left-top'
  | 'left-bottom'
  | 'right'
  | 'right-top'
  | 'right-bottom';

export type TooltipVariant = 'default' | 'light' | 'dark' | 'info' | 'success' | 'warning' | 'error';
export type TooltipType = 'tooltip' | 'popover' | 'info';

export interface TooltipProps {
  /**
   * Content that triggers the tooltip
   */
  children: React.ReactNode;
  /**
   * Tooltip content
   */
  content: React.ReactNode;
  /**
   * Position of the tooltip
   */
  position?: TooltipPosition;
  /**
   * Variant/color theme
   */
  variant?: TooltipVariant;
  /**
   * Type of tooltip
   */
  type?: TooltipType;
  /**
   * Show close button
   */
  closable?: boolean;
  /**
   * Auto-hide timeout in milliseconds (0 = no auto-hide)
   */
  timeout?: number;
  /**
   * Whether tooltip is visible (controlled)
   */
  visible?: boolean;
  /**
   * Default visibility (uncontrolled)
   */
  defaultVisible?: boolean;
  /**
   * Trigger on hover
   */
  triggerOnHover?: boolean;
  /**
   * Trigger on click
   */
  triggerOnClick?: boolean;
  /**
   * Trigger on focus
   */
  triggerOnFocus?: boolean;
  /**
   * Show interactive button when focused
   */
  showInteractiveButton?: boolean;
  /**
   * Interactive button label
   */
  interactiveButtonLabel?: string;
  /**
   * Interactive button onClick handler
   */
  onInteractiveButtonClick?: () => void;
  /**
   * Callback when tooltip closes
   */
  onClose?: () => void;
  /**
   * Callback when tooltip opens
   */
  onOpen?: () => void;
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom content className
   */
  contentClassName?: string;
  /**
   * Arrow offset
   */
  arrowOffset?: number;
  /**
   * Offset from trigger element
   */
  offset?: number;
}

/**
 * Tooltip Component
 */
export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  position = 'top',
  variant = 'default',
  type = 'tooltip',
  closable = false,
  timeout = 0,
  visible: controlledVisible,
  defaultVisible = false,
  triggerOnHover = true,
  triggerOnClick = false,
  triggerOnFocus = false,
  showInteractiveButton = false,
  interactiveButtonLabel = 'Learn More',
  onInteractiveButtonClick,
  onClose,
  onOpen,
  className,
  contentClassName,
  arrowOffset = 0,
  offset = 8,
}) => {
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const [isExiting, setIsExiting] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top?: number; bottom?: number; left?: number; right?: number }>({});

  const isControlled = controlledVisible !== undefined;
  const visible = isControlled ? controlledVisible : internalVisible;

  // Variant colors
  const variantColors: Record<TooltipVariant, { bg: string; text: string; border: string }> = {
    default: {
      bg: 'bg-gray-900 dark:bg-gray-800',
      text: 'text-white dark:text-gray-100',
      border: 'border-gray-700 dark:border-gray-600',
    },
    light: {
      bg: 'bg-white dark:bg-gray-100',
      text: 'text-gray-900 dark:text-gray-900',
      border: 'border-gray-200 dark:border-gray-300',
    },
    dark: {
      bg: 'bg-gray-900 dark:bg-gray-950',
      text: 'text-white dark:text-gray-100',
      border: 'border-gray-800 dark:border-gray-900',
    },
    info: {
      bg: 'bg-blue-600 dark:bg-blue-700',
      text: 'text-white',
      border: 'border-blue-700 dark:border-blue-800',
    },
    success: {
      bg: 'bg-green-600 dark:bg-green-700',
      text: 'text-white',
      border: 'border-green-700 dark:border-green-800',
    },
    warning: {
      bg: 'bg-yellow-600 dark:bg-yellow-700',
      text: 'text-white',
      border: 'border-yellow-700 dark:border-yellow-800',
    },
    error: {
      bg: 'bg-red-600 dark:bg-red-700',
      text: 'text-white',
      border: 'border-red-700 dark:border-red-800',
    },
  };

  // Type styles
  const typeStyles: Record<TooltipType, { padding: string; maxWidth: string }> = {
    tooltip: {
      padding: 'px-3 py-1.5',
      maxWidth: 'max-w-xs',
    },
    popover: {
      padding: 'p-4',
      maxWidth: 'max-w-sm',
    },
    info: {
      padding: 'p-3',
      maxWidth: 'max-w-md',
    },
  };

  const colors = variantColors[variant];
  const typeStyle = typeStyles[type];

  // Position calculations
  const calculatePosition = useCallback(() => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let top: number | undefined;
    let bottom: number | undefined;
    let left: number | undefined;
    let right: number | undefined;

    const positions = position.split('-');
    const mainPos = positions[0] as 'top' | 'bottom' | 'left' | 'right';
    const subPos = positions[1] as 'left' | 'right' | 'top' | 'bottom' | undefined;

    switch (mainPos) {
      case 'top':
        bottom = viewportHeight - triggerRect.top + offset;
        if (subPos === 'left') {
          left = triggerRect.left + arrowOffset;
        } else if (subPos === 'right') {
          right = viewportWidth - triggerRect.right - arrowOffset;
        } else {
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + arrowOffset;
        }
        break;
      case 'bottom':
        top = triggerRect.bottom + offset;
        if (subPos === 'left') {
          left = triggerRect.left + arrowOffset;
        } else if (subPos === 'right') {
          right = viewportWidth - triggerRect.right - arrowOffset;
        } else {
          left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2 + arrowOffset;
        }
        break;
      case 'left':
        right = viewportWidth - triggerRect.left + offset;
        if (subPos === 'top') {
          top = triggerRect.top + arrowOffset;
        } else if (subPos === 'bottom') {
          bottom = viewportHeight - triggerRect.bottom - arrowOffset;
        } else {
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + arrowOffset;
        }
        break;
      case 'right':
        left = triggerRect.right + offset;
        if (subPos === 'top') {
          top = triggerRect.top + arrowOffset;
        } else if (subPos === 'bottom') {
          bottom = viewportHeight - triggerRect.bottom - arrowOffset;
        } else {
          top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2 + arrowOffset;
        }
        break;
    }

    // Keep tooltip within viewport
    if (top !== undefined && top < 0) {
      top = offset;
    }
    if (bottom !== undefined && bottom < 0) {
      bottom = offset;
    }
    if (left !== undefined && left < 0) {
      left = offset;
    }
    if (right !== undefined && right < 0) {
      right = offset;
    }

    setTooltipPosition({ top, bottom, left, right });
  }, [position, offset, arrowOffset]);

  // Handle open
  const handleOpen = useCallback(() => {
    // Clear any pending close timeout
    if (hoverTimeoutRef.current !== null) {
      window.clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    
    if (!isControlled) {
      setInternalVisible(true);
      setIsExiting(false);
    }
    onOpen?.();
  }, [isControlled, onOpen]);

  // Handle close with delay to allow moving mouse to tooltip
  const handleClose = useCallback(() => {
    // Add a small delay to allow mouse to move to tooltip
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        if (!isControlled) {
          setInternalVisible(false);
        }
        onClose?.();
      }, 200);
    }, 100);
  }, [isControlled, onClose]);

  // Handle close button
  const handleCloseButton = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    handleClose();
  }, [handleClose]);

  // Auto-hide timeout
  useEffect(() => {
    if (timeout > 0 && visible && !isExiting) {
      timeoutRef.current = window.setTimeout(() => {
        handleClose();
      }, timeout);

      return () => {
        if (timeoutRef.current !== null) {
          window.clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [timeout, visible, isExiting, handleClose]);

  // Calculate position when visible
  useEffect(() => {
    if (visible) {
      // Small delay to ensure tooltip is rendered
      setTimeout(() => {
        calculatePosition();
      }, 10);
    }
  }, [visible, calculatePosition]);

  // Recalculate on window resize
  useEffect(() => {
    if (visible) {
      const handleResize = () => calculatePosition();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [visible, calculatePosition]);

  // Arrow direction
  const getArrowClass = () => {
    const mainPos = position.split('-')[0];
    const arrowClasses: Record<string, string> = {
      top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-0 border-l-transparent border-r-transparent border-b-8',
      bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-0 border-l-transparent border-r-transparent border-t-8',
      left: 'right-0 top-1/2 -translate-y-1/2 translate-x-full border-l-0 border-t-transparent border-b-transparent border-r-8',
      right: 'left-0 top-1/2 -translate-y-1/2 -translate-x-full border-r-0 border-t-transparent border-b-transparent border-l-8',
    };
    return arrowClasses[mainPos] || arrowClasses.top;
  };

  const arrowColor = variant === 'light' 
    ? 'border-gray-200 dark:border-gray-300'
    : variant === 'default'
    ? 'border-gray-900 dark:border-gray-800'
    : variant === 'dark'
    ? 'border-gray-900 dark:border-gray-950'
    : variant === 'info'
    ? 'border-blue-600 dark:border-blue-700'
    : variant === 'success'
    ? 'border-green-600 dark:border-green-700'
    : variant === 'warning'
    ? 'border-yellow-600 dark:border-yellow-700'
    : 'border-red-600 dark:border-red-700';

  // Always render trigger, conditionally render tooltip

  return (
    <>
      <div
        ref={triggerRef}
        className={clsx('inline-block', className)}
        onMouseEnter={triggerOnHover ? handleOpen : undefined}
        onMouseLeave={triggerOnHover ? handleClose : undefined}
        onClick={triggerOnClick ? () => {
          if (visible) {
            handleClose();
          } else {
            handleOpen();
          }
        } : undefined}
        onFocus={triggerOnFocus ? handleOpen : undefined}
        onBlur={triggerOnFocus ? handleClose : undefined}
      >
        {children}
      </div>
      {(visible || isExiting) && (
        <div
          ref={tooltipRef}
          className={clsx(
            'fixed z-50 transition-opacity duration-200',
            isExiting ? 'opacity-0' : 'opacity-100',
            typeStyle.maxWidth
          )}
          style={{
            ...tooltipPosition,
            pointerEvents: 'auto',
          }}
          onMouseEnter={triggerOnHover ? () => {
            // Clear any pending close timeout when mouse enters tooltip
            if (hoverTimeoutRef.current !== null) {
              window.clearTimeout(hoverTimeoutRef.current);
              hoverTimeoutRef.current = null;
            }
            handleOpen();
          } : undefined}
          onMouseLeave={triggerOnHover ? handleClose : undefined}
        >
          <div
            className={clsx(
              'relative rounded-lg shadow-lg border',
              colors.bg,
              colors.text,
              colors.border,
              typeStyle.padding,
              closable && 'pr-8',
              contentClassName
            )}
          >
            {/* Arrow */}
            <div className={clsx('absolute w-0 h-0', getArrowClass(), arrowColor)} />

            {/* Close button */}
            {closable && (
              <button
                type="button"
                onClick={handleCloseButton}
                className={clsx(
                  'absolute top-2 right-2 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center',
                  colors.text,
                  'z-10'
                )}
                style={{ marginTop: '0', marginRight: '0' }}
                aria-label="Close"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Content */}
            <div>
              {content}
            </div>

            {/* Interactive button */}
            {showInteractiveButton && (
              <div className="mt-3 pt-3 border-t border-current/20">
                <button
                  type="button"
                  onClick={onInteractiveButtonClick}
                  className={clsx(
                    'px-3 py-1.5 rounded text-sm font-medium transition-colors',
                    variant === 'light'
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  )}
                >
                  {interactiveButtonLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Tooltip;

