import React, { useState, useRef, useEffect, useCallback, Children, isValidElement } from 'react';
import { clsx } from 'clsx';

export type SplitterLayout = 'horizontal' | 'vertical';

export interface SplitterPanelProps {
  /**
   * Panel content
   */
  children?: React.ReactNode;
  /**
   * Initial size as percentage (0-100)
   */
  size?: number;
  /**
   * Minimum size as percentage (0-100)
   */
  minSize?: number;
  /**
   * Maximum size as percentage (0-100)
   */
  maxSize?: number;
  /**
   * Whether panel is resizable
   */
  resizable?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Additional CSS styles
   */
  style?: React.CSSProperties;
}

export interface SplitterProps {
  /**
   * Layout orientation
   */
  layout?: SplitterLayout;
  /**
   * Splitter children (SplitterPanel components)
   */
  children: React.ReactNode;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Additional CSS styles
   */
  style?: React.CSSProperties;
  /**
   * Callback when panel sizes change
   */
  onResize?: (sizes: number[]) => void;
  /**
   * Callback when resize starts
   */
  onResizeStart?: () => void;
  /**
   * Callback when resize ends
   */
  onResizeEnd?: () => void;
}

export const SplitterPanel: React.FC<SplitterPanelProps> = ({
  children,
  size,
  minSize = 0,
  maxSize = 100,
  resizable = true,
  className,
  style,
}) => {
  return (
    <div
      className={clsx('splitter-panel overflow-auto', className)}
      style={style}
      data-size={size}
      data-min-size={minSize}
      data-max-size={maxSize}
      data-resizable={resizable}
    >
      {children}
    </div>
  );
};

export const Splitter: React.FC<SplitterProps> = ({
  layout = 'horizontal',
  children,
  className,
  style,
  onResize,
  onResizeStart,
  onResizeEnd,
}) => {
  const splitterRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<number[]>([]);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeIndex, setResizeIndex] = useState<number | null>(null);
  const [startPos, setStartPos] = useState(0);
  const [startSizes, setStartSizes] = useState<number[]>([]);

  const isHorizontal = layout === 'horizontal';
  const isVertical = layout === 'vertical';

  // Extract panel props from children
  const panels = Children.toArray(children).filter(
    (child) => isValidElement(child) && child.type === SplitterPanel
  ) as React.ReactElement<SplitterPanelProps>[];

  // Initialize sizes from panel props
  useEffect(() => {
    const initialSizes = panels.map((panel) => {
      const panelSize = panel.props.size;
      if (panelSize !== undefined) {
        return panelSize;
      }
      // Distribute evenly if no size specified
      return 100 / panels.length;
    });
    setSizes(initialSizes);
  }, []);

  // Normalize sizes to sum to 100
  const normalizeSizes = useCallback((newSizes: number[]): number[] => {
    const total = newSizes.reduce((sum, size) => sum + size, 0);
    if (total === 0) return newSizes;
    return newSizes.map((size) => (size / total) * 100);
  }, []);

  const handleMouseDown = useCallback(
    (index: number, e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      setResizeIndex(index);
      const pos = isHorizontal ? e.clientX : e.clientY;
      setStartPos(pos);
      setStartSizes([...sizes]);
      onResizeStart?.();
    },
    [isHorizontal, sizes, onResizeStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || resizeIndex === null || !splitterRef.current) return;

      const currentPos = isHorizontal ? e.clientX : e.clientY;
      const delta = currentPos - startPos;
      const containerSize = isHorizontal
        ? splitterRef.current.offsetWidth
        : splitterRef.current.offsetHeight;
      const deltaPercent = (delta / containerSize) * 100;

      const newSizes = [...startSizes];
      const leftPanelIndex = resizeIndex;
      const rightPanelIndex = resizeIndex + 1;

      if (leftPanelIndex >= 0 && rightPanelIndex < newSizes.length) {
        const leftPanel = panels[leftPanelIndex];
        const rightPanel = panels[rightPanelIndex];

        const leftMinSize = leftPanel.props.minSize ?? 0;
        const leftMaxSize = leftPanel.props.maxSize ?? 100;
        const rightMinSize = rightPanel.props.minSize ?? 0;
        const rightMaxSize = rightPanel.props.maxSize ?? 100;

        const newLeftSize = Math.max(
          leftMinSize,
          Math.min(leftMaxSize, newSizes[leftPanelIndex] + deltaPercent)
        );
        const newRightSize = Math.max(
          rightMinSize,
          Math.min(rightMaxSize, newSizes[rightPanelIndex] - deltaPercent)
        );

        // Adjust if we hit min/max constraints
        const actualDelta = newLeftSize - newSizes[leftPanelIndex];
        newSizes[leftPanelIndex] = newLeftSize;
        newSizes[rightPanelIndex] = newSizes[rightPanelIndex] - actualDelta;

        // Normalize to ensure sum is 100
        const normalized = normalizeSizes(newSizes);
        setSizes(normalized);
        onResize?.(normalized);
      }
    },
    [isResizing, resizeIndex, startPos, startSizes, isHorizontal, panels, normalizeSizes, onResize]
  );

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      setResizeIndex(null);
      onResizeEnd?.();
    }
  }, [isResizing, onResizeEnd]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isHorizontal ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp, isHorizontal]);

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent) => {
      if (!splitterRef.current) return;

      const containerSize = isHorizontal
        ? splitterRef.current.offsetWidth
        : splitterRef.current.offsetHeight;
      const step = (containerSize * 0.01) / containerSize; // 1% step

      let newSizes = [...sizes];
      const leftPanelIndex = index;
      const rightPanelIndex = index + 1;

      if (leftPanelIndex >= 0 && rightPanelIndex < newSizes.length) {
        const leftPanel = panels[leftPanelIndex];
        const rightPanel = panels[rightPanelIndex];

        const leftMinSize = leftPanel.props.minSize ?? 0;
        const leftMaxSize = leftPanel.props.maxSize ?? 100;
        const rightMinSize = rightPanel.props.minSize ?? 0;
        const rightMaxSize = rightPanel.props.maxSize ?? 100;

        let delta = 0;

        switch (e.key) {
          case 'ArrowDown':
          case 'ArrowRight':
            if (isHorizontal && e.key === 'ArrowRight') {
              delta = step * 100;
            } else if (isVertical && e.key === 'ArrowDown') {
              delta = step * 100;
            } else {
              return;
            }
            break;
          case 'ArrowUp':
          case 'ArrowLeft':
            if (isHorizontal && e.key === 'ArrowLeft') {
              delta = -step * 100;
            } else if (isVertical && e.key === 'ArrowUp') {
              delta = -step * 100;
            } else {
              return;
            }
            break;
          case 'Home':
            e.preventDefault();
            newSizes[leftPanelIndex] = leftMaxSize;
            newSizes[rightPanelIndex] = 100 - leftMaxSize;
            const normalized = normalizeSizes(newSizes);
            setSizes(normalized);
            onResize?.(normalized);
            return;
          case 'End':
            e.preventDefault();
            newSizes[leftPanelIndex] = leftMinSize;
            newSizes[rightPanelIndex] = 100 - leftMinSize;
            const normalized2 = normalizeSizes(newSizes);
            setSizes(normalized2);
            onResize?.(normalized2);
            return;
          case 'Enter':
            e.preventDefault();
            // Toggle between min and max
            const currentSize = newSizes[leftPanelIndex];
            if (currentSize <= leftMinSize + 1) {
              newSizes[leftPanelIndex] = leftMaxSize;
              newSizes[rightPanelIndex] = 100 - leftMaxSize;
            } else {
              newSizes[leftPanelIndex] = leftMinSize;
              newSizes[rightPanelIndex] = 100 - leftMinSize;
            }
            const normalized3 = normalizeSizes(newSizes);
            setSizes(normalized3);
            onResize?.(normalized3);
            return;
          default:
            return;
        }

        if (delta !== 0) {
          e.preventDefault();
          const newLeftSize = Math.max(
            leftMinSize,
            Math.min(leftMaxSize, newSizes[leftPanelIndex] + delta)
          );
          const actualDelta = newLeftSize - newSizes[leftPanelIndex];
          newSizes[leftPanelIndex] = newLeftSize;
          newSizes[rightPanelIndex] = Math.max(
            rightMinSize,
            Math.min(rightMaxSize, newSizes[rightPanelIndex] - actualDelta)
          );

          const normalized = normalizeSizes(newSizes);
          setSizes(normalized);
          onResize?.(normalized);
        }
      }
    },
    [sizes, isHorizontal, isVertical, panels, normalizeSizes, onResize]
  );

  return (
    <div
      ref={splitterRef}
      className={clsx(
        'splitter flex',
        isHorizontal ? 'flex-row' : 'flex-col',
        className
      )}
      style={style}
    >
      {panels.map((panel, index) => {
        const panelSize = sizes[index] ?? panel.props.size ?? 100 / panels.length;
        const isLast = index === panels.length - 1;

        return (
          <React.Fragment key={index}>
            <div
              className={clsx(
                'splitter-panel-wrapper',
                'overflow-auto',
                panel.props.className
              )}
              style={{
                [isHorizontal ? 'width' : 'height']: `${panelSize}%`,
                flexShrink: 0,
                ...panel.props.style,
              }}
            >
              {panel.props.children}
            </div>

            {!isLast && (
              <div
                role="separator"
                aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
                aria-valuenow={panelSize}
                aria-valuemin={panel.props.minSize ?? 0}
                aria-valuemax={panel.props.maxSize ?? 100}
                tabIndex={0}
                onMouseDown={(e) => handleMouseDown(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={clsx(
                  'splitter-gutter',
                  'flex items-center justify-center',
                  'bg-gray-200 dark:bg-gray-700',
                  'hover:bg-gray-300 dark:hover:bg-gray-600',
                  'transition-colors',
                  'cursor-col-resize',
                  isResizing && resizeIndex === index && 'bg-blue-500 dark:bg-blue-600',
                  isHorizontal
                    ? 'w-1 cursor-col-resize'
                    : 'h-1 cursor-row-resize',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                )}
              >
                <div
                  className={clsx(
                    'splitter-gutter-handle',
                    'bg-gray-400 dark:bg-gray-500',
                    'rounded',
                    isHorizontal ? 'w-0.5 h-8' : 'h-0.5 w-8'
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

