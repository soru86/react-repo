import React, { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

export interface SliderProps {
  /**
   * Current value (for controlled component)
   */
  value?: number | [number, number];
  /**
   * Default value (for uncontrolled component)
   */
  defaultValue?: number | [number, number];
  /**
   * Minimum value
   */
  min?: number;
  /**
   * Maximum value
   */
  max?: number;
  /**
   * Step value
   */
  step?: number;
  /**
   * Whether the slider is disabled
   */
  disabled?: boolean;
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /**
   * Custom gradient colors for the filled track (array of color stops)
   * Example: ['#ff0000', '#00ff00', '#0000ff'] for red to green to blue
   */
  gradientColors?: string[];
  /**
   * Custom track color
   */
  trackColor?: string;
  /**
   * Custom filled track color
   */
  filledColor?: string;
  /**
   * Custom thumb color
   */
  thumbColor?: string;
  /**
   * Orientation
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Show tooltip with current value
   */
  showTooltip?: boolean;
  /**
   * Show value labels
   */
  showValue?: boolean;
  /**
   * Show marks/ticks
   */
  marks?: boolean | number[] | { value: number; label?: string }[];
  /**
   * Label text
   */
  label?: string;
  /**
   * Helper text
   */
  helperText?: string;
  /**
   * Error message
   */
  error?: string;
  /**
   * Range slider (dual handles)
   */
  range?: boolean;
  /**
   * Icon to display at the start/left of the slider
   */
  startIcon?: React.ReactNode;
  /**
   * Icon to display at the end/right of the slider
   */
  endIcon?: React.ReactNode;
  /**
   * Callback when value changes
   */
  onChange?: (value: number | [number, number]) => void;
  /**
   * Callback when value change is committed (on mouse up)
   */
  onChangeCommitted?: (value: number | [number, number]) => void;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Slider component with various variants
 */
export const Slider: React.FC<SliderProps> = ({
  value: controlledValue,
  defaultValue = 0,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'medium',
  variant = 'default',
  gradientColors,
  trackColor,
  filledColor,
  thumbColor,
  orientation = 'horizontal',
  showTooltip = false,
  showValue = false,
  marks = false,
  label,
  helperText,
  error,
  range = false,
  startIcon,
  endIcon,
  onChange,
  onChangeCommitted,
  className,
}) => {
  const [internalValue, setInternalValue] = useState<number | [number, number]>(
    defaultValue
  );
  const [isDragging, setIsDragging] = useState(false);
  const [activeThumb, setActiveThumb] = useState<'min' | 'max' | null>(null);
  const [tooltipValue, setTooltipValue] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : internalValue;

  // Normalize value to array for range slider
  const getValueArray = useCallback(
    (val: number | [number, number]): [number, number] => {
      if (range) {
        return Array.isArray(val) ? val : [val, val];
      }
      return [Array.isArray(val) ? val[0] : val, Array.isArray(val) ? val[0] : val];
    },
    [range]
  );

  const [minValue, maxValue] = getValueArray(currentValue);

  // Size classes
  const sizeClasses = {
    small: {
      track: 'h-1.5',
      thumb: 'w-3 h-3',
      tooltip: 'text-xs px-1.5 py-0.5',
    },
    medium: {
      track: 'h-2',
      thumb: 'w-4 h-4',
      tooltip: 'text-sm px-2 py-1',
    },
    large: {
      track: 'h-3',
      thumb: 'w-5 h-5',
      tooltip: 'text-base px-2.5 py-1.5',
    },
  };

  // Color classes
  const colorClasses = {
    default: {
      track: 'bg-gray-300',
      filled: 'bg-gray-600',
      thumb: 'bg-gray-600 border-gray-600 hover:bg-gray-700 hover:border-gray-700',
      thumbActive: 'bg-gray-800 border-gray-800',
      focus: 'focus:ring-gray-500',
    },
    primary: {
      track: 'bg-gray-300',
      filled: 'bg-blue-600',
      thumb: 'bg-blue-600 border-blue-600 hover:bg-blue-700 hover:border-blue-700',
      thumbActive: 'bg-blue-800 border-blue-800',
      focus: 'focus:ring-blue-500',
    },
    success: {
      track: 'bg-gray-300',
      filled: 'bg-green-600',
      thumb: 'bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700',
      thumbActive: 'bg-green-800 border-green-800',
      focus: 'focus:ring-green-500',
    },
    warning: {
      track: 'bg-gray-300',
      filled: 'bg-yellow-500',
      thumb: 'bg-yellow-500 border-yellow-500 hover:bg-yellow-600 hover:border-yellow-600',
      thumbActive: 'bg-yellow-700 border-yellow-700',
      focus: 'focus:ring-yellow-500',
    },
    danger: {
      track: 'bg-gray-300',
      filled: 'bg-red-600',
      thumb: 'bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700',
      thumbActive: 'bg-red-800 border-red-800',
      focus: 'focus:ring-red-500',
    },
  };

  const colors = colorClasses[variant];
  const sizes = sizeClasses[size];

  // Determine track and filled colors
  const finalTrackColor = trackColor || colors.track;
  const finalFilledColor = filledColor || colors.filled;
  const finalThumbColor = thumbColor || colors.thumb.split(' ')[0]; // Get base color without hover classes

  // Generate gradient style if gradientColors provided
  const getGradientStyle = (orientationValue: 'horizontal' | 'vertical'): React.CSSProperties | undefined => {
    if (!gradientColors || gradientColors.length === 0) return undefined;
    
    if (gradientColors.length === 1) {
      return { backgroundColor: gradientColors[0] };
    }

    const gradientStops = gradientColors
      .map((color, index) => {
        const percentage = (index / (gradientColors.length - 1)) * 100;
        return `${color} ${percentage}%`;
      })
      .join(', ');

    const isHorizontalValue = orientationValue === 'horizontal';
    return {
      background: `linear-gradient(${isHorizontalValue ? 'to right' : 'to top'}, ${gradientStops})`,
    };
  };

  const gradientStyle = getGradientStyle(orientation);
  
  // For gradients, we need to render the full gradient track and clip it
  const hasGradient = !!gradientStyle;

  // Calculate percentage
  const getPercentage = useCallback(
    (val: number) => {
      return ((val - min) / (max - min)) * 100;
    },
    [min, max]
  );

  // Clamp value to min/max and step
  const clampValue = useCallback(
    (val: number): number => {
      let clamped = Math.max(min, Math.min(max, val));
      if (step > 0) {
        clamped = Math.round(clamped / step) * step;
      }
      return Math.max(min, Math.min(max, clamped));
    },
    [min, max, step]
  );

  // Get value from mouse position
  const getValueFromPosition = useCallback(
    (clientX: number, clientY: number): number => {
      if (!sliderRef.current) return minValue;
      const rect = sliderRef.current.getBoundingClientRect();
      const isHorizontal = orientation === 'horizontal';
      const position = isHorizontal ? clientX - rect.left : rect.bottom - clientY;
      const size = isHorizontal ? rect.width : rect.height;
      const percentage = Math.max(0, Math.min(1, position / size));
      const value = min + percentage * (max - min);
      return clampValue(value);
    },
    [min, max, clampValue, orientation, minValue]
  );

  // Handle mouse down
  const handleMouseDown = useCallback(
    (e: React.MouseEvent, thumb: 'min' | 'max') => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      setActiveThumb(thumb);
      setTooltipValue(thumb === 'min' ? minValue : maxValue);
    },
    [disabled, minValue, maxValue]
  );

  // Handle mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !activeThumb || disabled) return;

      const newValue = getValueFromPosition(e.clientX, e.clientY);
      setTooltipValue(newValue);

      if (range) {
        let newMin = minValue;
        let newMax = maxValue;

        if (activeThumb === 'min') {
          newMin = Math.min(newValue, maxValue - step);
        } else {
          newMax = Math.max(newValue, minValue + step);
        }

        const newValues: [number, number] = [newMin, newMax];
        if (!isControlled) {
          setInternalValue(newValues);
        }
        onChange?.(newValues);
      } else {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      }
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setActiveThumb(null);
        setTooltipValue(null);
        if (onChangeCommitted) {
          onChangeCommitted(isControlled ? controlledValue! : internalValue);
        }
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [
    isDragging,
    activeThumb,
    disabled,
    getValueFromPosition,
    range,
    minValue,
    maxValue,
    step,
    isControlled,
    controlledValue,
    internalValue,
    onChange,
    onChangeCommitted,
  ]);

  // Handle track click
  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (disabled || isDragging) return;
      const newValue = getValueFromPosition(e.clientX, e.clientY);

      if (range) {
        // Determine which thumb is closer
        const distToMin = Math.abs(newValue - minValue);
        const distToMax = Math.abs(newValue - maxValue);
        const thumb = distToMin < distToMax ? 'min' : 'max';

        let newMin = minValue;
        let newMax = maxValue;

        if (thumb === 'min') {
          newMin = Math.min(newValue, maxValue - step);
        } else {
          newMax = Math.max(newValue, minValue + step);
        }

        const newValues: [number, number] = [newMin, newMax];
        if (!isControlled) {
          setInternalValue(newValues);
        }
        onChange?.(newValues);
        onChangeCommitted?.(newValues);
      } else {
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
        onChangeCommitted?.(newValue);
      }
    },
    [
      disabled,
      isDragging,
      getValueFromPosition,
      range,
      minValue,
      maxValue,
      step,
      isControlled,
      onChange,
      onChangeCommitted,
    ]
  );

  // Generate marks
  const getMarks = (): { value: number; label?: string }[] => {
    if (!marks) return [];
    if (Array.isArray(marks)) {
      return marks.map((mark) =>
        typeof mark === 'number' ? { value: mark } : mark
      );
    }
    // Generate marks based on step
    const markArray: { value: number }[] = [];
    for (let i = min; i <= max; i += step * 5) {
      markArray.push({ value: i });
    }
    return markArray;
  };

  const markArray = getMarks();
  const minPercentage = getPercentage(minValue);
  const maxPercentage = getPercentage(maxValue);
  const isHorizontal = orientation === 'horizontal';
  const hasError = !!error;

  return (
    <div
      className={clsx(
        'flex flex-col',
        isHorizontal ? 'w-full' : 'h-64 items-center',
        className
      )}
    >
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <label className="text-sm font-medium text-gray-700">{label}</label>
          )}
          {showValue && (
            <span className="text-sm font-medium text-gray-600">
              {range ? `${minValue} - ${maxValue}` : minValue}
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'relative flex items-center gap-2',
          isHorizontal ? 'w-full' : 'h-full flex-col justify-center'
        )}
      >
        {/* Start Icon */}
        {startIcon && (
          <div className={clsx(
            'flex-shrink-0 flex items-center justify-center',
            isHorizontal ? '' : 'order-2',
            disabled && 'opacity-50'
          )}>
            {startIcon}
          </div>
        )}
        
        <div
          className={clsx(
            'relative flex-1 flex items-center',
            isHorizontal ? 'w-full' : 'h-full flex-col justify-center'
          )}
        >
          <div
            ref={sliderRef}
            className={clsx(
              'relative cursor-pointer overflow-hidden',
              isHorizontal ? 'w-full' : 'h-full w-1',
              disabled && 'cursor-not-allowed opacity-50',
              sizes.track,
              !trackColor && colors.track,
              'rounded-full'
            )}
            style={trackColor ? { backgroundColor: trackColor } : undefined}
            onClick={handleTrackClick}
          >
            {/* Full gradient track background (if gradient is used) */}
            {hasGradient && (
              <div
                className={clsx(
                  'absolute rounded-full',
                  isHorizontal
                    ? 'top-0 left-0 w-full h-full'
                    : 'left-1/2 -translate-x-1/2 w-full h-full',
                  disabled && 'opacity-50'
                )}
                style={gradientStyle}
              />
            )}
            
            {/* Track overlay to hide unfilled portion (for gradients) */}
            {hasGradient && (
              <div
                className="absolute rounded-full"
                style={{
                  backgroundColor: trackColor || '#d1d5db', // gray-300 default
                  ...(isHorizontal
                    ? {
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: range
                          ? `${100 - maxPercentage}%`
                          : `${100 - minPercentage}%`,
                      }
                    : {
                        left: 0,
                        right: 0,
                        top: 0,
                        height: range
                          ? `${100 - maxPercentage}%`
                          : `${100 - minPercentage}%`,
                      }),
                }}
              />
            )}
            
            {/* Left/top overlay for range sliders with gradient */}
            {hasGradient && range && (
              <div
                className="absolute rounded-full"
                style={{
                  backgroundColor: trackColor || '#d1d5db',
                  ...(isHorizontal
                    ? {
                        top: 0,
                        bottom: 0,
                        left: 0,
                        width: `${minPercentage}%`,
                      }
                    : {
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: `${minPercentage}%`,
                      }),
                }}
              />
            )}
            
            {/* Filled track (for non-gradient sliders) */}
            {!hasGradient && (
              <div
                className={clsx(
                  'absolute rounded-full',
                  !filledColor && colors.filled,
                  isHorizontal
                    ? 'top-0 h-full'
                    : 'left-1/2 -translate-x-1/2 w-full',
                  disabled && 'opacity-50'
                )}
                style={{
                  ...(filledColor ? { backgroundColor: filledColor } : {}),
                  ...(isHorizontal
                    ? range
                      ? {
                          left: `${minPercentage}%`,
                          width: `${maxPercentage - minPercentage}%`,
                        }
                      : { width: `${minPercentage}%` }
                    : range
                    ? {
                        bottom: `${minPercentage}%`,
                        height: `${maxPercentage - minPercentage}%`,
                      }
                    : { height: `${minPercentage}%` }),
                }}
              />
            )}

          {/* Marks */}
          {markArray.length > 0 && (
            <>
              {markArray.map((mark, index) => {
                const markPercentage = getPercentage(mark.value);
                return (
                  <div
                    key={index}
                    className={clsx(
                      'absolute w-1 h-1 bg-gray-400 rounded-full -translate-x-1/2',
                      isHorizontal ? 'top-1/2 -translate-y-1/2' : 'left-1/2'
                    )}
                    style={
                      isHorizontal
                        ? { left: `${markPercentage}%` }
                        : { bottom: `${markPercentage}%` }
                    }
                  >
                    {mark.label && (
                      <span
                        className={clsx(
                          'absolute text-xs text-gray-500 whitespace-nowrap',
                          isHorizontal ? 'top-full mt-1' : 'right-full mr-2'
                        )}
                      >
                        {mark.label}
                      </span>
                    )}
                  </div>
                );
              })}
            </>
          )}

          {/* Min thumb */}
          <div
            className={clsx(
              'absolute rounded-full border-2 transition-all',
              sizes.thumb,
              !thumbColor && colors.thumb,
              colors.focus,
              'focus:outline-none focus:ring-2 focus:ring-offset-2',
              isDragging && activeThumb === 'min' ? colors.thumbActive : '',
              disabled && 'cursor-not-allowed',
              isHorizontal
                ? 'top-1/2 -translate-y-1/2 -translate-x-1/2'
                : 'left-1/2 -translate-x-1/2',
              hasError && 'border-red-500 focus:ring-red-500'
            )}
            style={{
              ...(isHorizontal
                ? { left: `${minPercentage}%` }
                : { bottom: `${minPercentage}%` }),
              ...(thumbColor
                ? {
                    backgroundColor: thumbColor,
                    borderColor: thumbColor,
                  }
                : {}),
            }}
            onMouseDown={(e) => handleMouseDown(e, 'min')}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={minValue}
            aria-disabled={disabled}
          >
            {/* Tooltip */}
            {showTooltip && (isDragging || tooltipValue !== null) && (
              <div
                className={clsx(
                  'absolute whitespace-nowrap bg-gray-900 text-white rounded',
                  sizes.tooltip,
                  'pointer-events-none',
                  isHorizontal
                    ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                    : 'left-full ml-2 top-1/2 -translate-y-1/2'
                )}
              >
                {tooltipValue !== null ? tooltipValue : minValue}
                <div
                  className={clsx(
                    'absolute border-4 border-transparent',
                    isHorizontal
                      ? 'top-full left-1/2 -translate-x-1/2 border-t-gray-900'
                      : 'right-full top-1/2 -translate-y-1/2 border-r-gray-900'
                  )}
                />
              </div>
            )}
          </div>

          {/* Max thumb (for range slider) */}
          {range && (
            <div
              className={clsx(
                'absolute rounded-full border-2 transition-all',
                sizes.thumb,
                !thumbColor && colors.thumb,
                colors.focus,
                'focus:outline-none focus:ring-2 focus:ring-offset-2',
                isDragging && activeThumb === 'max' ? colors.thumbActive : '',
                disabled && 'cursor-not-allowed',
                isHorizontal
                  ? 'top-1/2 -translate-y-1/2 -translate-x-1/2'
                  : 'left-1/2 -translate-x-1/2',
                hasError && 'border-red-500 focus:ring-red-500'
              )}
              style={{
                ...(isHorizontal
                  ? { left: `${maxPercentage}%` }
                  : { bottom: `${maxPercentage}%` }),
                ...(thumbColor
                  ? {
                      backgroundColor: thumbColor,
                      borderColor: thumbColor,
                    }
                  : {}),
              }}
              onMouseDown={(e) => handleMouseDown(e, 'max')}
              tabIndex={disabled ? -1 : 0}
              role="slider"
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={maxValue}
              aria-disabled={disabled}
            >
              {/* Tooltip */}
              {showTooltip && (isDragging || tooltipValue !== null) && (
                <div
                  className={clsx(
                    'absolute whitespace-nowrap bg-gray-900 text-white rounded',
                    sizes.tooltip,
                    'pointer-events-none',
                    isHorizontal
                      ? 'bottom-full mb-2 left-1/2 -translate-x-1/2'
                      : 'left-full ml-2 top-1/2 -translate-y-1/2'
                  )}
                >
                  {tooltipValue !== null ? tooltipValue : maxValue}
                  <div
                    className={clsx(
                      'absolute border-4 border-transparent',
                      isHorizontal
                        ? 'top-full left-1/2 -translate-x-1/2 border-t-gray-900'
                        : 'right-full top-1/2 -translate-y-1/2 border-r-gray-900'
                    )}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* End Icon */}
        {endIcon && (
          <div className={clsx(
            'flex-shrink-0 flex items-center justify-center',
            isHorizontal ? '' : 'order-3',
            disabled && 'opacity-50'
          )}>
            {endIcon}
          </div>
        )}
        </div>
      </div>
      {(helperText || error) && (
        <span
          className={clsx(
            'text-sm mt-1',
            error ? 'text-red-600' : 'text-gray-500'
          )}
        >
          {error || helperText}
        </span>
      )}
    </div>
  );
};

export default Slider;

