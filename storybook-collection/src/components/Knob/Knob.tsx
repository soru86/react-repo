import React, { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

export interface KnobProps {
    /**
     * Current value
     */
    value?: number;
    /**
     * Default value (for uncontrolled)
     */
    defaultValue?: number;
    /**
     * Minimum value
     */
    min?: number;
    /**
     * Maximum value
     */
    max?: number;
    /**
     * Step size
     */
    step?: number;
    /**
     * Size of the knob in pixels
     */
    size?: number;
    /**
     * Stroke width in pixels
     */
    strokeWidth?: number;
    /**
     * Color of the value arc
     */
    valueColor?: string;
    /**
     * Color of the range arc
     */
    rangeColor?: string;
    /**
     * Color of the text
     */
    textColor?: string;
    /**
     * Custom value template (use {value} as placeholder)
     */
    valueTemplate?: string;
    /**
     * Whether knob is disabled
     */
    disabled?: boolean;
    /**
     * Whether knob is read-only
     */
    readOnly?: boolean;
    /**
     * Callback when value changes
     */
    onChange?: (e: { value: number }) => void;
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * ARIA label
     */
    'aria-label'?: string;
    /**
     * ARIA labelled by
     */
    'aria-labelledby'?: string;
}

export const Knob: React.FC<KnobProps> = ({
    value: controlledValue,
    defaultValue = 0,
    min = 0,
    max = 100,
    step = 1,
    size = 100,
    strokeWidth = 14,
    valueColor,
    rangeColor,
    textColor,
    valueTemplate = '{value}',
    disabled = false,
    readOnly = false,
    onChange,
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}) => {
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [isDragging, setIsDragging] = useState(false);
    const knobRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const isControlled = controlledValue !== undefined;
    const currentValue = isControlled ? controlledValue : internalValue;

    // Clamp value to min/max
    const clampedValue = Math.max(min, Math.min(max, currentValue));

    // Calculate percentage
    const percentage = ((clampedValue - min) / (max - min)) * 100;

    // Calculate angle (0 to 360 degrees, starting from top)
    const angle = (percentage / 100) * 360;

    // Default colors
    const defaultValueColor = valueColor || '#3b82f6';
    const defaultRangeColor = rangeColor || '#e5e7eb';
    const defaultTextColor = textColor || '#1f2937';

    // SVG circle calculations
    const center = size / 2;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const handleValueChange = useCallback(
        (newValue: number) => {
            const clamped = Math.max(min, Math.min(max, newValue));
            if (!isControlled) {
                setInternalValue(clamped);
            }
            onChange?.({ value: clamped });
        },
        [min, max, isControlled, onChange]
    );

    const getValueFromPosition = useCallback(
        (clientX: number, clientY: number) => {
            if (!knobRef.current) return clampedValue;

            const rect = knobRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = clientX - centerX;
            const deltaY = clientY - centerY;

            // Calculate angle from center (0 to 360, starting from top, clockwise)
            let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            angle = (angle + 90 + 360) % 360; // Normalize to start from top

            // Convert angle to value
            const percentage = angle / 360;
            const rawValue = min + percentage * (max - min);

            // Snap to step
            const steppedValue = Math.round(rawValue / step) * step;

            return Math.max(min, Math.min(max, steppedValue));
        },
        [min, max, step, clampedValue]
    );

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if (disabled || readOnly) return;

            e.preventDefault();
            setIsDragging(true);

            const newValue = getValueFromPosition(e.clientX, e.clientY);
            handleValueChange(newValue);
        },
        [disabled, readOnly, getValueFromPosition, handleValueChange]
    );

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || disabled || readOnly) return;

            const newValue = getValueFromPosition(e.clientX, e.clientY);
            handleValueChange(newValue);
        },
        [isDragging, disabled, readOnly, getValueFromPosition, handleValueChange]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    const handleTouchStart = useCallback(
        (e: React.TouchEvent) => {
            if (disabled || readOnly) return;

            e.preventDefault();
            setIsDragging(true);

            const touch = e.touches[0];
            const newValue = getValueFromPosition(touch.clientX, touch.clientY);
            handleValueChange(newValue);
        },
        [disabled, readOnly, getValueFromPosition, handleValueChange]
    );

    const handleTouchMove = useCallback(
        (e: TouchEvent) => {
            if (!isDragging || disabled || readOnly) return;

            e.preventDefault();
            const touch = e.touches[0];
            const newValue = getValueFromPosition(touch.clientX, touch.clientY);
            handleValueChange(newValue);
        },
        [isDragging, disabled, readOnly, getValueFromPosition, handleValueChange]
    );

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleMouseUp);
            return () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleMouseUp);
            };
        }
    }, [isDragging, handleTouchMove, handleMouseUp]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (disabled || readOnly) return;

            let newValue = clampedValue;

            switch (e.key) {
                case 'ArrowUp':
                case 'ArrowRight':
                    e.preventDefault();
                    newValue = Math.min(max, clampedValue + step);
                    break;
                case 'ArrowDown':
                case 'ArrowLeft':
                    e.preventDefault();
                    newValue = Math.max(min, clampedValue - step);
                    break;
                case 'Home':
                    e.preventDefault();
                    newValue = min;
                    break;
                case 'End':
                    e.preventDefault();
                    newValue = max;
                    break;
                case 'PageUp':
                    e.preventDefault();
                    newValue = Math.min(max, clampedValue + step * 10);
                    break;
                case 'PageDown':
                    e.preventDefault();
                    newValue = Math.max(min, clampedValue - step * 10);
                    break;
                default:
                    return;
            }

            handleValueChange(newValue);
        },
        [disabled, readOnly, clampedValue, min, max, step, handleValueChange]
    );

    const formatValue = (val: number) => {
        return valueTemplate.replace('{value}', val.toString());
    };

    const isInteractive = !disabled && !readOnly;

    return (
        <div
            ref={knobRef}
            className={clsx('relative inline-flex items-center justify-center', className)}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={clampedValue}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
            aria-disabled={disabled}
            aria-readonly={readOnly}
            tabIndex={isInteractive ? 0 : -1}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onKeyDown={handleKeyDown}
            style={{
                width: size,
                height: size,
                cursor: isInteractive ? (isDragging ? 'grabbing' : 'grab') : 'default',
                userSelect: 'none',
                WebkitUserSelect: 'none',
            }}
        >
            <svg
                ref={svgRef}
                width={size}
                height={size}
                className="transform -rotate-90"
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                {/* Background circle (range) */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={defaultRangeColor}
                    strokeWidth={strokeWidth}
                    className="dark:opacity-30"
                />
                {/* Value circle */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    stroke={defaultValueColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-150"
                    style={{
                        opacity: disabled ? 0.5 : 1,
                    }}
                />
            </svg>

            {/* Value text */}
            <div
                className="relative z-10 text-center font-semibold select-none"
                style={{
                    color: defaultTextColor,
                    fontSize: size * 0.2,
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                {formatValue(clampedValue)}
            </div>

            {/* Drag indicator dot */}
            {isInteractive && (
                <div
                    className="absolute z-20 rounded-full bg-white dark:bg-gray-800 border-2 shadow-lg pointer-events-none"
                    style={{
                        width: strokeWidth * 0.8,
                        height: strokeWidth * 0.8,
                        borderColor: defaultValueColor,
                        left: '50%',
                        top: '50%',
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)`,
                        transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                    }}
                />
            )}
        </div>
    );
};

