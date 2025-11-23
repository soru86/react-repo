import React, { useState, useRef, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

export type ColorPickerVariant = 'default' | 'compact' | 'inline' | 'popover';
export type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'hsla';
export type ColorPreset = {
    name?: string;
    colors: string[];
};

export interface ColorPickerProps {
    /**
     * Current color value (hex, rgb, hsl, or hsla)
     */
    value?: string;
    /**
     * Default color value
     */
    defaultValue?: string;
    /**
     * Callback when color changes
     */
    onChange?: (color: string) => void;
    /**
     * Callback when color picker closes (for popover variant)
     */
    onClose?: () => void;
    /**
     * Visual variant
     */
    variant?: ColorPickerVariant;
    /**
     * Color format for output
     */
    format?: ColorFormat;
    /**
     * Show alpha channel (transparency)
     */
    showAlpha?: boolean;
    /**
     * Show color presets/swatches
     */
    showPresets?: boolean;
    /**
     * Custom color presets
     */
    presets?: ColorPreset[];
    /**
     * Disable the color picker
     */
    disabled?: boolean;
    /**
     * Show color input fields
     */
    showInputs?: boolean;
    /**
     * Custom className
     */
    className?: string;
    /**
     * Custom label
     */
    label?: string;
}

// Color conversion utilities
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
    return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
};

const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
};

const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
};

const parseColor = (color: string): { r: number; g: number; b: number; a: number } => {
    // Hex
    if (color.startsWith('#')) {
        const rgb = hexToRgb(color);
        if (rgb) return { ...rgb, a: 1 };
    }

    // RGB/RGBA
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (rgbMatch) {
        return {
            r: parseInt(rgbMatch[1]),
            g: parseInt(rgbMatch[2]),
            b: parseInt(rgbMatch[3]),
            a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
        };
    }

    // HSL/HSLA
    const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%(?:,\s*([\d.]+))?\)/);
    if (hslMatch) {
        const rgb = hslToRgb(parseInt(hslMatch[1]), parseInt(hslMatch[2]), parseInt(hslMatch[3]));
        return {
            ...rgb,
            a: hslMatch[4] ? parseFloat(hslMatch[4]) : 1,
        };
    }

    // Default
    return { r: 0, g: 0, b: 0, a: 1 };
};

const formatColor = (
    r: number,
    g: number,
    b: number,
    a: number,
    format: ColorFormat
): string => {
    switch (format) {
        case 'hex':
            return rgbToHex(r, g, b);
        case 'rgb':
            return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;
        case 'hsl':
            const hsl = rgbToHsl(r, g, b);
            return a < 1
                ? `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${a})`
                : `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
        case 'hsla':
            const hsla = rgbToHsl(r, g, b);
            return `hsla(${Math.round(hsla.h)}, ${Math.round(hsla.s)}%, ${Math.round(hsla.l)}%, ${a})`;
        default:
            return rgbToHex(r, g, b);
    }
};

// Default presets
const defaultPresets: ColorPreset[] = [
    {
        name: 'Common Colors',
        colors: [
            '#000000',
            '#FFFFFF',
            '#FF0000',
            '#00FF00',
            '#0000FF',
            '#FFFF00',
            '#FF00FF',
            '#00FFFF',
        ],
    },
    {
        name: 'Grays',
        colors: [
            '#000000',
            '#333333',
            '#666666',
            '#999999',
            '#CCCCCC',
            '#FFFFFF',
        ],
    },
    {
        name: 'Pastels',
        colors: [
            '#FFB3BA',
            '#FFDFBA',
            '#FFFFBA',
            '#BAFFC9',
            '#BAE1FF',
            '#E0BAFF',
        ],
    },
];

/**
 * ColorPicker Component
 */
export const ColorPicker: React.FC<ColorPickerProps> = ({
    value,
    defaultValue = '#000000',
    onChange,
    onClose,
    variant = 'default',
    format = 'hex',
    showAlpha = false,
    showPresets = true,
    presets = defaultPresets,
    disabled = false,
    showInputs = true,
    className,
    label,
}) => {
    const [internalColor, setInternalColor] = useState(() => {
        const initialColor = value || defaultValue;
        return parseColor(initialColor);
    });

    const [hsl, setHsl] = useState(() => rgbToHsl(internalColor.r, internalColor.g, internalColor.b));
    const [isDragging, setIsDragging] = useState(false);
    const [isDraggingAlpha, setIsDraggingAlpha] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const pickerRef = useRef<HTMLButtonElement>(null);
    const spectrumRef = useRef<HTMLDivElement>(null);
    const alphaRef = useRef<HTMLDivElement>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Update internal color when value prop changes
    useEffect(() => {
        if (value !== undefined) {
            const parsed = parseColor(value);
            setInternalColor(parsed);
            setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
        }
    }, [value]);

    // Handle click outside for popover
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                variant === 'popover' &&
                popoverRef.current &&
                !popoverRef.current.contains(event.target as Node) &&
                pickerRef.current &&
                !pickerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
                onClose?.();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [isOpen, variant, onClose]);

    const updateColor = useCallback(
        (r: number, g: number, b: number, a: number = internalColor.a) => {
            const newColor = { r, g, b, a };
            setInternalColor(newColor);
            setHsl(rgbToHsl(r, g, b));
            const formatted = formatColor(r, g, b, a, format);
            onChange?.(formatted);
        },
        [internalColor.a, format, onChange]
    );

    const handleSpectrumClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        const rect = spectrumRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const s = Math.max(0, Math.min(100, (x / rect.width) * 100));
        const l = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));

        const newHsl = { ...hsl, s, l };
        setHsl(newHsl);
        const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        updateColor(rgb.r, rgb.g, rgb.b);
    };

    const handleHueClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const h = Math.max(0, Math.min(360, ((e.clientX - rect.left) / rect.width) * 360));
        const newHsl = { ...hsl, h };
        setHsl(newHsl);
        const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
        updateColor(rgb.r, rgb.g, rgb.b);
    };

    const handleAlphaClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (disabled || !showAlpha) return;
        const rect = alphaRef.current?.getBoundingClientRect();
        if (!rect) return;
        const a = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        updateColor(internalColor.r, internalColor.g, internalColor.b, a);
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (isDragging && spectrumRef.current) {
                const rect = spectrumRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const s = Math.max(0, Math.min(100, (x / rect.width) * 100));
                const l = Math.max(0, Math.min(100, 100 - (y / rect.height) * 100));
                const newHsl = { ...hsl, s, l };
                setHsl(newHsl);
                const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
                updateColor(rgb.r, rgb.g, rgb.b);
            } else if (isDraggingAlpha && alphaRef.current) {
                const rect = alphaRef.current.getBoundingClientRect();
                const a = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                updateColor(internalColor.r, internalColor.g, internalColor.b, a);
            }
        },
        [isDragging, isDraggingAlpha, hsl, internalColor, updateColor]
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
        setIsDraggingAlpha(false);
    }, []);

    useEffect(() => {
        if (isDragging || isDraggingAlpha) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, isDraggingAlpha, handleMouseMove, handleMouseUp]);

    const handleInputChange = (type: 'r' | 'g' | 'b' | 'a' | 'h' | 's' | 'l', val: string) => {
        if (disabled) return;
        const num = parseInt(val) || 0;
        let newColor = { ...internalColor };
        let newHsl = { ...hsl };

        if (type === 'r' || type === 'g' || type === 'b') {
            newColor[type] = Math.max(0, Math.min(255, num));
            newHsl = rgbToHsl(newColor.r, newColor.g, newColor.b);
            setHsl(newHsl);
            updateColor(newColor.r, newColor.g, newColor.b, newColor.a);
        } else if (type === 'a') {
            const alpha = Math.max(0, Math.min(1, parseFloat(val) || 0));
            updateColor(newColor.r, newColor.g, newColor.b, alpha);
        } else if (type === 'h' || type === 's' || type === 'l') {
            newHsl[type] = Math.max(0, Math.min(type === 'h' ? 360 : 100, num));
            setHsl(newHsl);
            const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
            updateColor(rgb.r, rgb.g, rgb.b, newColor.a);
        }
    };

    const handleHexChange = (hex: string) => {
        if (disabled) return;
        const rgb = hexToRgb(hex);
        if (rgb) {
            updateColor(rgb.r, rgb.g, rgb.b);
        }
    };

    const handlePresetClick = (presetColor: string) => {
        if (disabled) return;
        const parsed = parseColor(presetColor);
        setInternalColor(parsed);
        setHsl(rgbToHsl(parsed.r, parsed.g, parsed.b));
        const formatted = formatColor(parsed.r, parsed.g, parsed.b, parsed.a, format);
        onChange?.(formatted);
    };

    const currentColorHex = rgbToHex(internalColor.r, internalColor.g, internalColor.b);

    // Render color picker content
    const renderPickerContent = () => (
        <div className={clsx('space-y-4', disabled && 'opacity-50 pointer-events-none')}>
            {/* Color Spectrum */}
            <div className="relative">
                <div
                    ref={spectrumRef}
                    className="w-full h-48 rounded-lg cursor-crosshair overflow-hidden relative"
                    style={{
                        background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), linear-gradient(to right, rgba(255,255,255,1), hsl(${hsl.h}, 100%, 50%))`,
                    }}
                    onClick={handleSpectrumClick}
                    onMouseDown={() => !disabled && setIsDragging(true)}
                >
                    <div
                        className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                        style={{
                            left: `${hsl.s}%`,
                            top: `${100 - hsl.l}%`,
                        }}
                    />
                </div>
            </div>

            {/* Hue Slider */}
            <div className="relative">
                <div
                    className="w-full h-6 rounded cursor-pointer overflow-hidden"
                    style={{
                        background: `linear-gradient(to right, 
              hsl(0, 100%, 50%) 0%,
              hsl(60, 100%, 50%) 16.66%,
              hsl(120, 100%, 50%) 33.33%,
              hsl(180, 100%, 50%) 50%,
              hsl(240, 100%, 50%) 66.66%,
              hsl(300, 100%, 50%) 83.33%,
              hsl(360, 100%, 50%) 100%)`,
                    }}
                    onClick={handleHueClick}
                >
                    <div
                        className="absolute top-0 bottom-0 w-1 bg-white border border-gray-300 rounded shadow transform -translate-x-1/2 pointer-events-none"
                        style={{ left: `${(hsl.h / 360) * 100}%` }}
                    />
                </div>
            </div>

            {/* Alpha Slider */}
            {showAlpha && (
                <div className="relative">
                    <div
                        ref={alphaRef}
                        className="w-full h-6 rounded cursor-pointer relative overflow-hidden"
                        onClick={handleAlphaClick}
                        onMouseDown={() => !disabled && setIsDraggingAlpha(true)}
                    >
                        {/* Checkerboard background - using SVG pattern for better rendering */}
                        <div
                            className="absolute inset-0 rounded overflow-hidden"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='4' height='4' fill='%23e0e0e0'/%3E%3Crect x='4' y='4' width='4' height='4' fill='%23e0e0e0'/%3E%3C/svg%3E")`,
                                backgroundSize: '8px 8px',
                            }}
                        />
                        {/* Color gradient overlay */}
                        <div
                            className="absolute inset-0 rounded"
                            style={{
                                background: `linear-gradient(to right, 
                  rgba(${internalColor.r}, ${internalColor.g}, ${internalColor.b}, 0), 
                  rgba(${internalColor.r}, ${internalColor.g}, ${internalColor.b}, 1))`,
                            }}
                        />
                        {/* Slider indicator */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-white border border-gray-300 rounded shadow transform -translate-x-1/2 pointer-events-none z-10"
                            style={{ left: `${internalColor.a * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Input Fields */}
            {showInputs && (
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Hex</label>
                        <input
                            type="text"
                            value={currentColorHex}
                            onChange={(e) => handleHexChange(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            disabled={disabled}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">RGB</label>
                        <div className="grid grid-cols-3 gap-1">
                            <input
                                type="number"
                                min="0"
                                max="255"
                                value={internalColor.r}
                                onChange={(e) => handleInputChange('r', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                disabled={disabled}
                            />
                            <input
                                type="number"
                                min="0"
                                max="255"
                                value={internalColor.g}
                                onChange={(e) => handleInputChange('g', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                disabled={disabled}
                            />
                            <input
                                type="number"
                                min="0"
                                max="255"
                                value={internalColor.b}
                                onChange={(e) => handleInputChange('b', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                disabled={disabled}
                            />
                        </div>
                    </div>
                    {showAlpha && (
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">Alpha</label>
                            <input
                                type="number"
                                min="0"
                                max="1"
                                step="0.01"
                                value={internalColor.a.toFixed(2)}
                                onChange={(e) => handleInputChange('a', e.target.value)}
                                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                disabled={disabled}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Color Presets */}
            {showPresets && presets.length > 0 && (
                <div className="space-y-2">
                    {presets.map((preset, presetIndex) => (
                        <div key={presetIndex}>
                            {preset.name && (
                                <label className="block text-xs font-medium mb-1 text-gray-700 dark:text-gray-300">
                                    {preset.name}
                                </label>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {preset.colors.map((color, colorIndex) => (
                                    <button
                                        key={colorIndex}
                                        type="button"
                                        onClick={() => handlePresetClick(color)}
                                        className={clsx(
                                            'w-8 h-8 rounded border-2 transition-all',
                                            currentColorHex.toLowerCase() === color.toLowerCase()
                                                ? 'border-blue-500 shadow-md scale-110'
                                                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500',
                                            disabled && 'cursor-not-allowed'
                                        )}
                                        style={{ backgroundColor: color }}
                                        disabled={disabled}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // Render based on variant
    if (variant === 'popover') {
        return (
            <div className={clsx('relative', className)}>
                <button
                    ref={pickerRef}
                    type="button"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    className={clsx(
                        'flex items-center gap-2 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
                        disabled && 'opacity-50 cursor-not-allowed',
                        className
                    )}
                    disabled={disabled}
                >
                    <div
                        className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: currentColorHex }}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {label || currentColorHex}
                    </span>
                    <svg
                        className={clsx('w-4 h-4 text-gray-500 transition-transform', isOpen && 'rotate-180')}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                {isOpen && (
                    <div
                        ref={popoverRef}
                        className="absolute top-full left-0 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 min-w-[280px]"
                    >
                        {renderPickerContent()}
                    </div>
                )}
            </div>
        );
    }

    if (variant === 'inline') {
        return (
            <div className={clsx('inline-block', className)}>
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                    {renderPickerContent()}
                </div>
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div className={clsx('p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800', className)}>
                <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                        <div
                            className="w-16 h-16 rounded border-2 border-gray-300 dark:border-gray-600"
                            style={{ backgroundColor: currentColorHex }}
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <div
                            ref={spectrumRef}
                            className="w-full h-6 rounded cursor-crosshair overflow-hidden relative"
                            style={{
                                background: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1)), linear-gradient(to right, rgba(255,255,255,1), hsl(${hsl.h}, 100%, 50%))`,
                            }}
                            onClick={handleSpectrumClick}
                        >
                            <div
                                className="absolute w-3 h-3 border-2 border-white rounded-full shadow transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                style={{
                                    left: `${hsl.s}%`,
                                    top: `${100 - hsl.l}%`,
                                }}
                            />
                        </div>
                        <div
                            className="w-full h-4 rounded cursor-pointer overflow-hidden"
                            style={{
                                background: `linear-gradient(to right, 
                  hsl(0, 100%, 50%) 0%,
                  hsl(60, 100%, 50%) 16.66%,
                  hsl(120, 100%, 50%) 33.33%,
                  hsl(180, 100%, 50%) 50%,
                  hsl(240, 100%, 50%) 66.66%,
                  hsl(300, 100%, 50%) 83.33%,
                  hsl(360, 100%, 50%) 100%)`,
                            }}
                            onClick={handleHueClick}
                        >
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white border border-gray-300 rounded shadow transform -translate-x-1/2 pointer-events-none"
                                style={{ left: `${(hsl.h / 360) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
                {showInputs && (
                    <div className="mt-3">
                        <input
                            type="text"
                            value={currentColorHex}
                            onChange={(e) => handleHexChange(e.target.value)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            disabled={disabled}
                        />
                    </div>
                )}
            </div>
        );
    }

    // Default variant
    return (
        <div className={clsx('p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800', className)}>
            {label && (
                <label className="block text-sm font-medium mb-3 text-gray-900 dark:text-gray-100">{label}</label>
            )}
            {renderPickerContent()}
        </div>
    );
};

export default ColorPicker;

