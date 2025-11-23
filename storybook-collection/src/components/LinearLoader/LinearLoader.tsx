import React from 'react';
import { clsx } from 'clsx';

export type LinearLoaderType = 'determinate' | 'indeterminate' | 'buffer' | 'query';

export type LinearLoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type LinearLoaderVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info';

export type LinearLoaderAnimation =
  | 'linear'
  | 'pulse'
  | 'wave'
  | 'stripes'
  | 'gradient';

export interface LinearLoaderProps {
  /**
   * Loader type
   */
  type?: LinearLoaderType;
  /**
   * Progress value (0-100) for determinate type
   */
  value?: number;
  /**
   * Buffer value (0-100) for buffer type
   */
  buffer?: number;
  /**
   * Size variant
   */
  size?: LinearLoaderSize;
  /**
   * Color variant
   */
  variant?: LinearLoaderVariant;
  /**
   * Custom color (overrides variant)
   */
  color?: string;
  /**
   * Animation style
   */
  animation?: LinearLoaderAnimation;
  /**
   * Show percentage label
   */
  showLabel?: boolean;
  /**
   * Label position
   */
  labelPosition?: 'inside' | 'outside' | 'top' | 'bottom';
  /**
   * Custom label
   */
  label?: string;
  /**
   * Rounded corners
   */
  rounded?: boolean;
  /**
   * Striped pattern
   */
  striped?: boolean;
  /**
   * Gradient colors (for gradient animation)
   */
  gradientColors?: string[];
  /**
   * Custom className
   */
  className?: string;
}

/**
 * Linear Loader / Progress Bar component
 */
export const LinearLoader: React.FC<LinearLoaderProps> = ({
  type = 'indeterminate',
  value = 0,
  buffer,
  size = 'md',
  variant = 'primary',
  color,
  animation = 'linear',
  showLabel = false,
  labelPosition = 'outside',
  label,
  rounded = false,
  striped = false,
  gradientColors,
  className,
}) => {
  // Size classes
  const sizeClasses: Record<LinearLoaderSize, { height: string; text: string }> = {
    xs: { height: 'h-0.5', text: 'text-xs' },
    sm: { height: 'h-1', text: 'text-sm' },
    md: { height: 'h-2', text: 'text-base' },
    lg: { height: 'h-3', text: 'text-lg' },
    xl: { height: 'h-4', text: 'text-xl' },
  };

  // Variant colors
  const variantColors: Record<LinearLoaderVariant, { bg: string; text: string }> = {
    default: {
      bg: 'bg-gray-600 dark:bg-gray-400',
      text: 'text-gray-600 dark:text-gray-400',
    },
    primary: {
      bg: 'bg-blue-600 dark:bg-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
    },
    success: {
      bg: 'bg-green-600 dark:bg-green-400',
      text: 'text-green-600 dark:text-green-400',
    },
    warning: {
      bg: 'bg-yellow-600 dark:bg-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
    danger: {
      bg: 'bg-red-600 dark:bg-red-400',
      text: 'text-red-600 dark:text-red-400',
    },
    info: {
      bg: 'bg-cyan-600 dark:bg-cyan-400',
      text: 'text-cyan-600 dark:text-cyan-400',
    },
  };

  const sizes = sizeClasses[size];
  const colors = variantColors[variant];

  // Clamp value between 0 and 100
  const clampedValue = Math.min(100, Math.max(0, value));
  const clampedBuffer = buffer !== undefined ? Math.min(100, Math.max(0, buffer)) : undefined;

  // Get background style
  const getBackgroundStyle = (): React.CSSProperties => {
    if (color) {
      return { backgroundColor: color };
    }
    if (gradientColors && gradientColors.length > 0) {
      if (animation === 'gradient') {
        // For gradient animation, extend the gradient to allow smooth scrolling
        const extendedColors = [...gradientColors, ...gradientColors];
        return {
          background: `linear-gradient(90deg, ${extendedColors.join(', ')})`,
          backgroundSize: '200% 100%',
        };
      }
      return {
        background: `linear-gradient(90deg, ${gradientColors.join(', ')})`,
      };
    }
    return {};
  };

  // Get background class (for when not using custom color/gradient)
  const getBackgroundClass = () => {
    if (color || gradientColors) return '';
    return colors.bg;
  };

  // Get animation class
  const getAnimationClass = () => {
    // Apply gradient animation if gradient colors are provided and animation is gradient
    if (animation === 'gradient' && gradientColors && gradientColors.length > 0) {
      return 'animate-gradient';
    }
    
    if (type === 'determinate' || type === 'buffer') {
      return '';
    }
    
    switch (animation) {
      case 'pulse':
        return 'animate-pulse';
      case 'wave':
        return 'animate-wave';
      case 'stripes':
        return 'animate-stripes';
      default:
        return 'animate-linear';
    }
  };

  // Render label
  const renderLabel = () => {
    if (!showLabel && !label) return null;

    const displayLabel = label || `${Math.round(clampedValue)}%`;
    const labelClasses = clsx(
      sizes.text,
      colors.text,
      'font-medium',
      labelPosition === 'inside' && 'absolute inset-0 flex items-center justify-center text-white',
      labelPosition === 'outside' && 'mt-2',
      labelPosition === 'top' && 'mb-2',
      labelPosition === 'bottom' && 'mt-2'
    );

    return <div className={labelClasses}>{displayLabel}</div>;
  };

  // Render determinate progress bar
  const renderDeterminate = () => {
    const progressStyle: React.CSSProperties = {
      width: `${clampedValue}%`,
      ...getBackgroundStyle(),
    };

    return (
      <div className="relative w-full">
        {labelPosition === 'top' && renderLabel()}
        <div
          className={clsx(
            'w-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
            sizes.height,
            rounded && 'rounded-full',
            className
          )}
        >
          <div
            className={clsx(
              'h-full transition-all duration-300 ease-out',
              getBackgroundClass(),
              rounded && 'rounded-full',
              striped && 'bg-stripes',
              getAnimationClass()
            )}
            style={{
              ...progressStyle,
              ...(animation === 'gradient' && gradientColors && { backgroundSize: '200% 100%' }),
            }}
          >
            {labelPosition === 'inside' && renderLabel()}
          </div>
        </div>
        {(labelPosition === 'outside' || labelPosition === 'bottom') && renderLabel()}
      </div>
    );
  };

  // Render indeterminate progress bar
  const renderIndeterminate = () => {
    return (
      <div className="relative w-full">
        {labelPosition === 'top' && renderLabel()}
        <div
          className={clsx(
            'w-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
            sizes.height,
            rounded && 'rounded-full',
            className
          )}
        >
          <div
            className={clsx(
              'h-full',
              getBackgroundClass(),
              rounded && 'rounded-full',
              getAnimationClass()
            )}
            style={{
              width: '30%',
              ...getBackgroundStyle(),
              ...(animation === 'gradient' && gradientColors && { backgroundSize: '200% 100%' }),
            }}
          />
        </div>
        {(labelPosition === 'outside' || labelPosition === 'bottom') && renderLabel()}
      </div>
    );
  };

  // Render buffer progress bar
  const renderBuffer = () => {
    const bufferValue = clampedBuffer || 0;
    const progressStyle: React.CSSProperties = {
      width: `${clampedValue}%`,
      ...getBackgroundStyle(),
    };
    const bufferStyle: React.CSSProperties = {
      width: `${bufferValue}%`,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    };

    return (
      <div className="relative w-full">
        {labelPosition === 'top' && renderLabel()}
        <div
          className={clsx(
            'w-full bg-gray-200 dark:bg-gray-700 overflow-hidden relative',
            sizes.height,
            rounded && 'rounded-full',
            className
          )}
        >
          <div
            className={clsx(
              'absolute inset-0 h-full',
              rounded && 'rounded-full'
            )}
            style={bufferStyle}
          />
          <div
            className={clsx(
              'h-full transition-all duration-300 ease-out relative z-10',
              getBackgroundClass(),
              rounded && 'rounded-full',
              getAnimationClass()
            )}
            style={{
              ...progressStyle,
              ...(animation === 'gradient' && gradientColors && { backgroundSize: '200% 100%' }),
            }}
          >
            {labelPosition === 'inside' && renderLabel()}
          </div>
        </div>
        {(labelPosition === 'outside' || labelPosition === 'bottom') && renderLabel()}
      </div>
    );
  };

  // Render query progress bar
  const renderQuery = () => {
    return (
      <div className="relative w-full">
        {labelPosition === 'top' && renderLabel()}
        <div
          className={clsx(
            'w-full bg-gray-200 dark:bg-gray-700 overflow-hidden',
            sizes.height,
            rounded && 'rounded-full',
            className
          )}
        >
          <div
            className={clsx(
              'h-full',
              getBackgroundClass(),
              rounded && 'rounded-full',
              'animate-query'
            )}
            style={{
              width: '40%',
              ...getBackgroundStyle(),
              ...(animation === 'gradient' && gradientColors && { backgroundSize: '200% 100%' }),
            }}
          />
        </div>
        {(labelPosition === 'outside' || labelPosition === 'bottom') && renderLabel()}
      </div>
    );
  };

  // Add custom animations via style tag
  React.useEffect(() => {
    const styleId = 'linear-loader-animations';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes linear-loader {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(400%); }
      }
      @keyframes wave-loader {
        0%, 100% { transform: translateX(-100%) scaleX(0.5); }
        50% { transform: translateX(400%) scaleX(1); }
      }
      @keyframes stripes-loader {
        0% { background-position: 0 0; }
        100% { background-position: 40px 0; }
      }
      @keyframes gradient-loader {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 0%; }
      }
      @keyframes query-loader {
        0% { transform: translateX(-100%); }
        50% { transform: translateX(0%); }
        100% { transform: translateX(100%); }
      }
      .animate-linear {
        animation: linear-loader 1.5s ease-in-out infinite;
      }
      .animate-wave {
        animation: wave-loader 2s ease-in-out infinite;
      }
      .animate-stripes {
        background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent);
        background-size: 40px 40px;
        animation: stripes-loader 1s linear infinite;
      }
      .animate-gradient {
        background-size: 200% 200%;
        animation: gradient-loader 2s ease infinite;
      }
      .animate-query {
        animation: query-loader 1.5s ease-in-out infinite;
      }
      .bg-stripes {
        background-image: linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent);
        background-size: 1rem 1rem;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Ensure component has width
  return (
    <div className="w-full" style={{ minWidth: '200px' }}>
      {type === 'determinate' && renderDeterminate()}
      {type === 'indeterminate' && renderIndeterminate()}
      {type === 'buffer' && renderBuffer()}
      {type === 'query' && renderQuery()}
      {!type && renderIndeterminate()}
    </div>
  );
};

export default LinearLoader;

