import React from 'react';
import { clsx } from 'clsx';

export type SkeletonVariant = 'text' | 'circular' | 'rectangular' | 'rounded';
export type SkeletonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type SkeletonAnimation = 'pulse' | 'wave' | 'none';

export interface SkeletonProps {
  /**
   * Variant shape
   */
  variant?: SkeletonVariant;
  /**
   * Size variant
   */
  size?: SkeletonSize;
  /**
   * Animation type
   */
  animation?: SkeletonAnimation;
  /**
   * Width (CSS value)
   */
  width?: string | number;
  /**
   * Height (CSS value)
   */
  height?: string | number;
  /**
   * Number of lines (for text variant)
   */
  lines?: number;
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
 * Skeleton component for loading states
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  size = 'md',
  animation = 'pulse',
  width,
  height,
  lines = 1,
  className,
  style,
}) => {
  // Size classes for text variant
  const textSizeClasses: Record<SkeletonSize, string> = {
    xs: 'h-2',
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-5',
    xl: 'h-6',
  };

  // Size pixel values for height
  const sizePixelValues: Record<SkeletonSize, string> = {
    xs: '8px',
    sm: '12px',
    md: '16px',
    lg: '20px',
    xl: '24px',
  };

  // Size classes for circular variant
  const circularSizeClasses: Record<SkeletonSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  // Animation classes
  const animationClasses: Record<SkeletonAnimation, string> = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };

  const baseClasses = clsx(
    'bg-gray-200 dark:bg-gray-700',
    animationClasses[animation],
    className
  );

  // Custom styles
  const customStyle: React.CSSProperties = {
    ...style,
    ...(width && { width: typeof width === 'number' ? `${width}px` : width }),
    ...(height && { height: typeof height === 'number' ? `${height}px` : height }),
  };

  // Render text variant
  if (variant === 'text') {
    if (lines > 1) {
      return (
        <div className="space-y-2 w-full" style={customStyle}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={clsx(
                baseClasses,
                textSizeClasses[size],
                'rounded',
                index === lines - 1 ? 'w-3/4' : 'w-full' // Last line shorter
              )}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        className={clsx(baseClasses, textSizeClasses[size], 'rounded')}
        style={{
          width: width || '100%',
          minWidth: width ? undefined : '200px',
          ...customStyle,
        }}
      />
    );
  }

  // Render circular variant
  if (variant === 'circular') {
    return (
      <div
        className={clsx(baseClasses, circularSizeClasses[size], 'rounded-full flex-shrink-0')}
        style={customStyle}
      />
    );
  }

  // Render rectangular variant
  if (variant === 'rectangular') {
    const heightValue = height || sizePixelValues[size];
    return (
      <div
        className={clsx(baseClasses, 'rounded')}
        style={{
          width: width || '100%',
          height: typeof heightValue === 'number' ? `${heightValue}px` : heightValue,
          minWidth: width ? undefined : '200px',
          ...customStyle,
        }}
      />
    );
  }

  // Render rounded variant
  if (variant === 'rounded') {
    const heightValue = height || sizePixelValues[size];
    return (
      <div
        className={clsx(baseClasses, 'rounded-lg')}
        style={{
          width: width || '100%',
          height: typeof heightValue === 'number' ? `${heightValue}px` : heightValue,
          minWidth: width ? undefined : '200px',
          ...customStyle,
        }}
      />
    );
  }

  return null;
};

/**
 * Skeleton group component for complex layouts
 */
export interface SkeletonGroupProps {
  /**
   * Children skeleton elements
   */
  children: React.ReactNode;
  /**
   * Spacing between items
   */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Direction
   */
  direction?: 'row' | 'column';
  /**
   * Custom className
   */
  className?: string;
}

export const SkeletonGroup: React.FC<SkeletonGroupProps> = ({
  children,
  spacing = 'md',
  direction = 'column',
  className,
}) => {
  const spacingClasses = {
    none: '',
    xs: direction === 'column' ? 'space-y-1' : 'space-x-1',
    sm: direction === 'column' ? 'space-y-2' : 'space-x-2',
    md: direction === 'column' ? 'space-y-3' : 'space-x-3',
    lg: direction === 'column' ? 'space-y-4' : 'space-x-4',
    xl: direction === 'column' ? 'space-y-6' : 'space-x-6',
  };

  return (
    <div
      className={clsx(
        direction === 'row' ? 'flex items-center' : 'flex flex-col',
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  );
};

// Add wave animation styles globally (called once)
if (typeof document !== 'undefined') {
  const styleId = 'skeleton-wave-animation';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes skeleton-wave {
        0% {
          background-position: -200px 0;
        }
        100% {
          background-position: calc(200px + 100%) 0;
        }
      }
      .animate-wave {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.2) 20%,
          rgba(255, 255, 255, 0.5) 60%,
          rgba(255, 255, 255, 0)
        );
        background-size: 200px 100%;
        animation: skeleton-wave 1.5s ease-in-out infinite;
      }
      .dark .animate-wave {
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0,
          rgba(255, 255, 255, 0.05) 20%,
          rgba(255, 255, 255, 0.1) 60%,
          rgba(255, 255, 255, 0)
        );
        background-size: 200px 100%;
      }
    `;
    document.head.appendChild(style);
  }
}

export default Skeleton;

