import React, { useState, useCallback, useRef, useEffect } from 'react';
import { clsx } from 'clsx';

export interface DragDropWrapperProps {
  /**
   * Child component(s) to make draggable/droppable
   */
  children: React.ReactNode;
  /**
   * Unique identifier for this draggable item
   */
  id?: string;
  /**
   * Data to transfer when dragging
   */
  data?: any;
  /**
   * Whether the item is draggable
   */
  draggable?: boolean;
  /**
   * Whether the item can accept drops
   */
  droppable?: boolean;
  /**
   * Callback when drag starts
   */
  onDragStart?: (event: React.DragEvent, data: any) => void;
  /**
   * Callback when drag ends
   */
  onDragEnd?: (event: React.DragEvent, data: any) => void;
  /**
   * Callback when item is dragged over a drop zone
   */
  onDragOver?: (event: React.DragEvent, data: any) => void;
  /**
   * Callback when item enters a drop zone
   */
  onDragEnter?: (event: React.DragEvent, data: any) => void;
  /**
   * Callback when item leaves a drop zone
   */
  onDragLeave?: (event: React.DragEvent, data: any) => void;
  /**
   * Callback when item is dropped
   */
  onDrop?: (event: React.DragEvent, data: any, droppedData: any) => void;
  /**
   * Visual feedback when dragging
   */
  dragEffect?: 'move' | 'copy' | 'link' | 'none';
  /**
   * Visual feedback when dragging over
   */
  dragOverEffect?: 'move' | 'copy' | 'link' | 'none';
  /**
   * Custom className
   */
  className?: string;
  /**
   * Custom className when dragging
   */
  draggingClassName?: string;
  /**
   * Custom className when dragging over
   */
  dragOverClassName?: string;
  /**
   * Whether to show visual feedback during drag
   */
  showDragFeedback?: boolean;
  /**
   * Custom style when dragging
   */
  draggingStyle?: React.CSSProperties;
  /**
   * Custom style when dragging over
   */
  dragOverStyle?: React.CSSProperties;
  /**
   * Accept specific drag types (for filtering drops)
   */
  acceptDragTypes?: string[];
  /**
   * Type identifier for this draggable item
   */
  dragType?: string;
  /**
   * Whether to disable the wrapper
   */
  disabled?: boolean;
}

/**
 * DragDropWrapper Component - Makes any child component draggable and/or droppable
 */
export const DragDropWrapper: React.FC<DragDropWrapperProps> = ({
  children,
  id,
  data,
  draggable = true,
  droppable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  dragEffect = 'move',
  dragOverEffect = 'move',
  className,
  draggingClassName,
  dragOverClassName,
  showDragFeedback = true,
  draggingStyle,
  dragOverStyle,
  acceptDragTypes,
  dragType = 'default',
  disabled = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle drag start
  const handleDragStart = useCallback(
    (e: React.DragEvent) => {
      if (disabled || !draggable) {
        e.preventDefault();
        return;
      }

      setIsDragging(true);

      // Set drag data
      const dragData = {
        id,
        data,
        type: dragType,
        timestamp: Date.now(),
      };

      // Store data in dataTransfer
      e.dataTransfer.effectAllowed = dragEffect;
      e.dataTransfer.setData('application/json', JSON.stringify(dragData));
      e.dataTransfer.setData('text/plain', id || '');

      // Set drag image (optional - uses default if not set)
      if (showDragFeedback && wrapperRef.current) {
        const dragImage = wrapperRef.current.cloneNode(true) as HTMLElement;
        dragImage.style.opacity = '0.5';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, e.clientX - e.currentTarget.getBoundingClientRect().left, e.clientY - e.currentTarget.getBoundingClientRect().top);
        setTimeout(() => document.body.removeChild(dragImage), 0);
      }

      onDragStart?.(e, dragData);
    },
    [disabled, draggable, id, data, dragType, dragEffect, showDragFeedback, onDragStart]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      setIsDragging(false);
      setIsDragOver(false);
      setDragCounter(0);

      const dragData = {
        id,
        data,
        type: dragType,
      };

      onDragEnd?.(e, dragData);
    },
    [id, data, dragType, onDragEnd]
  );

  // Handle drag over
  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      if (disabled || !droppable) return;

      // Check if we accept this drag type
      if (acceptDragTypes && acceptDragTypes.length > 0) {
        try {
          const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
          if (!acceptDragTypes.includes(dragData.type)) {
            return;
          }
        } catch {
          // If we can't parse, allow it (for backward compatibility)
        }
      }

      e.preventDefault();
      e.stopPropagation();
      e.dataTransfer.dropEffect = dragOverEffect;

      const dragData = {
        id,
        data,
        type: dragType,
      };

      onDragOver?.(e, dragData);
    },
    [disabled, droppable, acceptDragTypes, dragOverEffect, id, data, dragType, onDragOver]
  );

  // Handle drag enter
  const handleDragEnter = useCallback(
    (e: React.DragEvent) => {
      if (disabled || !droppable) return;

      // Check if we accept this drag type
      if (acceptDragTypes && acceptDragTypes.length > 0) {
        try {
          const dragData = JSON.parse(e.dataTransfer.getData('application/json'));
          if (!acceptDragTypes.includes(dragData.type)) {
            return;
          }
        } catch {
          return;
        }
      }

      e.preventDefault();
      e.stopPropagation();

      setDragCounter((prev) => {
        const newCount = prev + 1;
        if (newCount === 1) {
          setIsDragOver(true);
        }
        return newCount;
      });

      const dragData = {
        id,
        data,
        type: dragType,
      };

      onDragEnter?.(e, dragData);
    },
    [disabled, droppable, acceptDragTypes, id, data, dragType, onDragEnter]
  );

  // Handle drag leave
  const handleDragLeave = useCallback(
    (e: React.DragEvent) => {
      if (disabled || !droppable) return;

      setDragCounter((prev) => {
        const newCount = prev - 1;
        if (newCount === 0) {
          setIsDragOver(false);
        }
        return newCount;
      });

      const dragData = {
        id,
        data,
        type: dragType,
      };

      onDragLeave?.(e, dragData);
    },
    [disabled, droppable, id, data, dragType, onDragLeave]
  );

  // Handle drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      if (disabled || !droppable) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      setIsDragOver(false);
      setDragCounter(0);

      // Get dropped data
      let droppedData;
      try {
        droppedData = JSON.parse(e.dataTransfer.getData('application/json'));
      } catch {
        droppedData = { id: e.dataTransfer.getData('text/plain') };
      }

      // Check if we accept this drag type
      if (acceptDragTypes && acceptDragTypes.length > 0) {
        if (!acceptDragTypes.includes(droppedData.type)) {
          return;
        }
      }

      const dragData = {
        id,
        data,
        type: dragType,
      };

      onDrop?.(e, dragData, droppedData);
    },
    [disabled, droppable, acceptDragTypes, id, data, dragType, onDrop]
  );

  // Reset drag over state when component unmounts or disabled changes
  useEffect(() => {
    if (disabled) {
      setIsDragOver(false);
      setDragCounter(0);
    }
  }, [disabled]);

  const wrapperClasses = clsx(
    'drag-drop-wrapper',
    className,
    isDragging && showDragFeedback && (draggingClassName || 'opacity-50 cursor-grabbing'),
    isDragOver && showDragFeedback && (dragOverClassName || 'ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-50 dark:bg-blue-900/20'),
    draggable && !disabled && 'cursor-grab active:cursor-grabbing',
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const combinedDraggingStyle = isDragging && draggingStyle ? draggingStyle : {};
  const combinedDragOverStyle = isDragOver && dragOverStyle ? dragOverStyle : {};

  return (
    <div
      ref={wrapperRef}
      className={wrapperClasses}
      draggable={draggable && !disabled}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{ ...combinedDraggingStyle, ...combinedDragOverStyle }}
    >
      {children}
    </div>
  );
};

export default DragDropWrapper;

