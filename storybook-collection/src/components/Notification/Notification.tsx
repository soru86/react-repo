import React, { useState, useEffect, useRef, useCallback } from 'react';
import { clsx } from 'clsx';

export type NotificationVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type NotificationPosition =
    | 'top-left'
    | 'top-right'
    | 'top-center'
    | 'bottom-left'
    | 'bottom-right'
    | 'bottom-center';

// Position classes helper (exported for use in NotificationContainer)
export const positionClasses: Record<NotificationPosition, string> = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
};

export interface NotificationAction {
    /**
     * Action label
     */
    label: string;
    /**
     * Action handler
     */
    onClick: () => void;
    /**
     * Action variant
     */
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
    /**
     * Whether action closes notification
     */
    closesNotification?: boolean;
}

export interface NotificationProps {
    /**
     * Unique identifier
     */
    id?: string;
    /**
     * Notification title
     */
    title?: string;
    /**
     * Notification message/content
     */
    message?: string;
    /**
     * Variant/color theme
     */
    variant?: NotificationVariant;
    /**
     * Position on screen
     */
    position?: NotificationPosition;
    /**
     * Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
     */
    duration?: number;
    /**
     * Whether notification is visible
     */
    visible?: boolean;
    /**
     * Show close button
     */
    closable?: boolean;
    /**
     * Custom icon
     */
    icon?: React.ReactNode;
    /**
     * Action buttons
     */
    actions?: NotificationAction[];
    /**
     * Collapsible content
     */
    collapsible?: boolean;
    /**
     * Collapsed by default
     */
    defaultCollapsed?: boolean;
    /**
     * Custom content renderer
     */
    children?: React.ReactNode;
    /**
     * Callback when notification closes
     */
    onClose?: () => void;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Custom style
     */
    style?: React.CSSProperties;
}

/**
 * Notification component
 */
export const Notification: React.FC<NotificationProps> = ({
    title,
    message,
    variant = 'default',
    position = 'top-right',
    duration = 5000,
    visible: controlledVisible,
    closable = true,
    icon,
    actions = [],
    collapsible = false,
    defaultCollapsed = true,
    children,
    onClose,
    className,
    style,
}) => {
    const [internalVisible, setInternalVisible] = useState(true);
    const [collapsed, setCollapsed] = useState(defaultCollapsed);
    const [isExiting, setIsExiting] = useState(false);
    const timeoutRef = useRef<number | null>(null);
    const isControlled = controlledVisible !== undefined;
    const visible = isControlled ? controlledVisible : internalVisible;

    // Variant colors
    const variantColors: Record<NotificationVariant, { bg: string; border: string; text: string; icon: string }> = {
        default: {
            bg: 'bg-white dark:bg-gray-800',
            border: 'border-gray-200 dark:border-gray-700',
            text: 'text-gray-900 dark:text-gray-100',
            icon: 'text-gray-600 dark:text-gray-400',
        },
        success: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            border: 'border-green-200 dark:border-green-800',
            text: 'text-green-900 dark:text-green-100',
            icon: 'text-green-600 dark:text-green-400',
        },
        warning: {
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-200 dark:border-yellow-800',
            text: 'text-yellow-900 dark:text-yellow-100',
            icon: 'text-yellow-600 dark:text-yellow-400',
        },
        error: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-200 dark:border-red-800',
            text: 'text-red-900 dark:text-red-100',
            icon: 'text-red-600 dark:text-red-400',
        },
        info: {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-200 dark:border-blue-800',
            text: 'text-blue-900 dark:text-blue-100',
            icon: 'text-blue-600 dark:text-blue-400',
        },
    };

    const colors = variantColors[variant];

    // Default icons
    const defaultIcons: Record<NotificationVariant, React.ReactNode> = {
        default: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        success: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        warning: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        error: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };


    // Handle close
    const handleClose = useCallback(() => {
        setIsExiting(true);
        window.setTimeout(() => {
            if (!isControlled) {
                setInternalVisible(false);
            }
            onClose?.();
        }, 300); // Animation duration
    }, [isControlled, onClose]);

    // Handle action click
    const handleAction = (action: NotificationAction) => {
        action.onClick();
        if (action.closesNotification !== false) {
            handleClose();
        }
    };

    // Auto-dismiss
    useEffect(() => {
        if (duration > 0 && visible && !isExiting) {
            timeoutRef.current = window.setTimeout(() => {
                handleClose();
            }, duration);

            return () => {
                if (timeoutRef.current !== null) {
                    window.clearTimeout(timeoutRef.current);
                }
            };
        }
    }, [duration, visible, isExiting, handleClose]);

    if (!visible) return null;

    const displayIcon = icon !== undefined ? icon : defaultIcons[variant];

    // If style prop is provided with position, use it (for stacked notifications)
    const hasCustomPosition = style?.position === 'fixed';

    return (
        <div
            className={clsx(
                'max-w-md w-full transition-all duration-300',
                !hasCustomPosition && 'fixed z-50',
                !hasCustomPosition && positionClasses[position],
                isExiting ? 'opacity-0 scale-95' : 'opacity-100 scale-100',
                className
            )}
            style={{ maxWidth: '420px', ...style }}
        >
            <div
                className={clsx(
                    'rounded-lg shadow-lg border p-4',
                    colors.bg,
                    colors.border,
                    'backdrop-blur-sm'
                )}
            >
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    {displayIcon && (
                        <div className={clsx('flex-shrink-0 mt-0.5', colors.icon)}>
                            {displayIcon}
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Title */}
                        {title && (
                            <h4 className={clsx('font-semibold mb-1', colors.text)}>{title}</h4>
                        )}

                        {/* Message */}
                        {message && (
                            <p className={clsx('text-sm', colors.text, title && 'mt-1')}>{message}</p>
                        )}

                        {/* Children */}
                        {children && (
                            <div className={clsx('mt-2', colors.text)}>{children}</div>
                        )}

                        {/* Collapsible content */}
                        {collapsible && (
                            <div className="mt-2">
                                <button
                                    type="button"
                                    onClick={() => setCollapsed(!collapsed)}
                                    className={clsx(
                                        'text-xs font-medium flex items-center gap-1',
                                        colors.text,
                                        'hover:opacity-80 transition-opacity'
                                    )}
                                >
                                    {collapsed ? 'Show more' : 'Show less'}
                                    <svg
                                        className={clsx('w-3 h-3 transition-transform', !collapsed && 'rotate-180')}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {!collapsed && (
                                    <div className={clsx('mt-2 text-sm', colors.text)}>
                                        {children || message}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        {actions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                                {actions.map((action, index) => {
                                    const actionColors = {
                                        default: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100',
                                        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
                                        success: 'bg-green-600 hover:bg-green-700 text-white',
                                        warning: 'bg-yellow-600 hover:bg-yellow-700 text-white',
                                        danger: 'bg-red-600 hover:bg-red-700 text-white',
                                    };

                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleAction(action)}
                                            className={clsx(
                                                'px-3 py-1.5 text-sm font-medium rounded transition-colors',
                                                actionColors[action.variant || 'default']
                                            )}
                                        >
                                            {action.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Close button */}
                    {closable && (
                        <button
                            type="button"
                            onClick={handleClose}
                            className={clsx(
                                'flex-shrink-0 p-1 rounded hover:bg-black/5 dark:hover:bg-white/10 transition-colors',
                                colors.text
                            )}
                            aria-label="Close"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Notification Container for managing multiple notifications
 */
export interface NotificationContainerProps {
    /**
     * Notifications to display
     */
    notifications: Array<NotificationProps & { id: string }>;
    /**
     * Position for all notifications
     */
    position?: NotificationPosition;
    /**
     * Stack notifications
     */
    stacked?: boolean;
    /**
     * Callback when notification closes
     */
    onNotificationClose?: (id: string) => void;
}

export const NotificationContainer: React.FC<NotificationContainerProps> = ({
    notifications,
    position = 'top-right',
    stacked = true,
    onNotificationClose,
}) => {
    if (!stacked) {
        // Show only the most recent notification
        const latestNotification = notifications[notifications.length - 1];
        if (!latestNotification) return null;

        return (
            <Notification
                {...latestNotification}
                position={position}
                onClose={() => onNotificationClose?.(latestNotification.id)}
            />
        );
    }

    // Stack notifications with spacing
    // For stacked notifications, we need to override the individual notification positions
    // and manage stacking ourselves
    return (
        <>
            {notifications.map((notification, index) => {
                // Calculate offset for stacking
                const offset = index * 80; // Approximate height of notification + gap
                const isTop = position.includes('top');
                const isCenter = position.includes('center');
                const isLeft = position.includes('left');
                const isRight = position.includes('right');

                let topStyle: string | undefined;
                let bottomStyle: string | undefined;
                let leftStyle: string | undefined;
                let rightStyle: string | undefined;
                let transformStyle: string | undefined;

                if (isTop) {
                    topStyle = `${16 + offset}px`;
                } else {
                    bottomStyle = `${16 + offset}px`;
                }

                if (isCenter) {
                    leftStyle = '50%';
                    transformStyle = 'translateX(-50%)';
                } else if (isLeft) {
                    leftStyle = '16px';
                } else if (isRight) {
                    rightStyle = '16px';
                }

                return (
                    <Notification
                        key={notification.id}
                        {...notification}
                        position={position}
                        onClose={() => onNotificationClose?.(notification.id)}
                        style={{
                            position: 'fixed',
                            top: topStyle,
                            bottom: bottomStyle,
                            left: leftStyle,
                            right: rightStyle,
                            transform: transformStyle,
                            maxWidth: '420px',
                            width: 'calc(100% - 32px)',
                            zIndex: 50 - index,
                        }}
                    />
                );
            })}
        </>
    );
};

export default Notification;

