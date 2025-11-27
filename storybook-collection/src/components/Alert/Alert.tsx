import React, { useState } from 'react';
import { clsx } from 'clsx';

export type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type AlertSize = 'small' | 'medium' | 'large';
export type AlertStyle = 'solid' | 'outlined' | 'soft';

export interface AlertAction {
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
}

export interface AlertProps {
  /**
   * Alert title
   */
  title?: string;
  /**
   * Alert description/content
   */
  children?: React.ReactNode;
  /**
   * Variant/color theme
   */
  variant?: AlertVariant;
  /**
   * Size
   */
  size?: AlertSize;
  /**
   * Style variant
   */
  style?: AlertStyle;
  /**
   * Custom icon
   */
  icon?: React.ReactNode;
  /**
   * Show default icon based on variant
   */
  showIcon?: boolean;
  /**
   * Whether alert is dismissible
   */
  dismissible?: boolean;
  /**
   * Callback when alert is dismissed
   */
  onDismiss?: () => void;
  /**
   * Action buttons
   */
  actions?: AlertAction[];
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Whether alert is visible (for controlled dismiss)
   */
  visible?: boolean;
  /**
   * Custom close icon
   */
  closeIcon?: React.ReactNode;
}

const sizeClasses = {
  small: {
    container: 'px-3 py-2 text-sm',
    title: 'text-sm font-semibold',
    content: 'text-xs mt-1',
    icon: 'w-4 h-4',
    close: 'w-4 h-4',
  },
  medium: {
    container: 'px-4 py-3 text-base',
    title: 'text-base font-semibold',
    content: 'text-sm mt-1.5',
    icon: 'w-5 h-5',
    close: 'w-5 h-5',
  },
  large: {
    container: 'px-5 py-4 text-lg',
    title: 'text-lg font-semibold',
    content: 'text-base mt-2',
    icon: 'w-6 h-6',
    close: 'w-6 h-6',
  },
};

const variantClasses: Record<AlertVariant, Record<AlertStyle, string>> = {
  default: {
    solid: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
    outlined: 'bg-transparent text-gray-800 border-2 border-gray-300 dark:text-gray-200 dark:border-gray-600',
    soft: 'bg-gray-50 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800',
  },
  success: {
    solid: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    outlined: 'bg-transparent text-green-800 border-2 border-green-300 dark:text-green-300 dark:border-green-600',
    soft: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800',
  },
  warning: {
    solid: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
    outlined: 'bg-transparent text-yellow-800 border-2 border-yellow-300 dark:text-yellow-300 dark:border-yellow-600',
    soft: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800',
  },
  error: {
    solid: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
    outlined: 'bg-transparent text-red-800 border-2 border-red-300 dark:text-red-300 dark:border-red-600',
    soft: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800',
  },
  info: {
    solid: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
    outlined: 'bg-transparent text-blue-800 border-2 border-blue-300 dark:text-blue-300 dark:border-blue-600',
    soft: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800',
  },
};

const iconColorClasses: Record<AlertVariant, string> = {
  default: 'text-gray-600 dark:text-gray-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  error: 'text-red-600 dark:text-red-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const actionVariantClasses = {
  default: 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600',
  success: 'bg-green-600 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600',
  warning: 'bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600',
  danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
};

// Default icons
const DefaultIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SuccessIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const WarningIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ErrorIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CloseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const getDefaultIcon = (variant: AlertVariant, className: string) => {
  switch (variant) {
    case 'success':
      return <SuccessIcon className={className} />;
    case 'warning':
      return <WarningIcon className={className} />;
    case 'error':
      return <ErrorIcon className={className} />;
    case 'info':
      return <InfoIcon className={className} />;
    default:
      return <DefaultIcon className={className} />;
  }
};

export const Alert: React.FC<AlertProps> = ({
  title,
  children,
  variant = 'default',
  size = 'medium',
  style = 'solid',
  icon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  actions,
  className,
  visible = true,
  closeIcon,
}) => {
  const [isVisible, setIsVisible] = useState(visible);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (visible !== undefined && !visible) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const sizes = sizeClasses[size];
  const variants = variantClasses[variant][style];
  const iconColor = iconColorClasses[variant];

  const displayIcon = icon || (showIcon ? getDefaultIcon(variant, clsx(sizes.icon, iconColor)) : null);

  return (
    <div
      className={clsx(
        'relative flex items-start gap-3 rounded-lg border transition-all',
        variants,
        sizes.container,
        className
      )}
      role="alert"
    >
      {displayIcon && (
        <div className={clsx('flex-shrink-0 mt-0.5', iconColor)}>
          {displayIcon}
        </div>
      )}

      <div className="flex-1 min-w-0">
        {title && (
          <div className={clsx(sizes.title, 'mb-1')}>
            {title}
          </div>
        )}
        {children && (
          <div className={clsx(sizes.content, title && 'mt-0')}>
            {children}
          </div>
        )}
        {actions && actions.length > 0 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  actionVariantClasses[action.variant || 'default']
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {dismissible && (
        <button
          onClick={handleDismiss}
          className={clsx(
            'flex-shrink-0 p-1 rounded-md transition-colors',
            'hover:bg-black/5 dark:hover:bg-white/10',
            'text-current opacity-70 hover:opacity-100',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current'
          )}
          aria-label="Close alert"
        >
          {closeIcon || <CloseIcon className={sizes.close} />}
        </button>
      )}
    </div>
  );
};

