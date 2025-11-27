import React, { useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

// Quill types (if Quill is not installed, these will help with type checking)
declare global {
  interface Window {
    Quill?: any;
  }
}

export interface EditorProps {
  /**
   * Editor content (HTML string)
   */
  value?: string;
  /**
   * Default value (for uncontrolled)
   */
  defaultValue?: string;
  /**
   * Callback when content changes
   */
  onTextChange?: (e: { htmlValue: string | null; textValue: string; delta: any; source: string }) => void;
  /**
   * Custom toolbar template
   */
  headerTemplate?: React.ReactNode;
  /**
   * Whether editor is read-only
   */
  readOnly?: boolean;
  /**
   * Editor height (CSS value)
   */
  height?: string | number;
  /**
   * Editor style
   */
  style?: React.CSSProperties;
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Placeholder text
   */
  placeholder?: string;
  /**
   * Quill modules configuration
   */
  modules?: any;
  /**
   * Quill formats configuration
   */
  formats?: string[];
  /**
   * Theme (snow or bubble)
   */
  theme?: 'snow' | 'bubble';
}

export const Editor: React.FC<EditorProps> = ({
  value,
  defaultValue = '',
  onTextChange,
  headerTemplate,
  readOnly = false,
  height = '320px',
  style,
  className,
  placeholder = 'Enter text...',
  modules,
  formats,
  theme = 'snow',
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const [isQuillLoaded, setIsQuillLoaded] = useState(false);
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // Load Quill dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Quill) {
      setIsQuillLoaded(true);
      return;
    }

    // Try to load Quill from CDN if not available
    const existingScript = document.querySelector('script[src*="quill.js"]');
    if (existingScript) {
      if (window.Quill) {
        setIsQuillLoaded(true);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.quilljs.com/1.3.6/quill.js';
    script.async = true;
    script.onload = () => {
      if (window.Quill) {
        // Load Quill CSS (snow theme by default, will be overridden if bubble is used)
        const existingLink = document.querySelector('link[href*="quill"]');
        if (!existingLink) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
          link.id = 'quill-theme-snow';
          document.head.appendChild(link);
        }
        setIsQuillLoaded(true);
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize Quill (only once)
  useEffect(() => {
    if (!isQuillLoaded || !editorRef.current || quillRef.current || isInitializedRef.current) return;

    // Load theme CSS if needed
    const themeCSS = theme === 'bubble' ? 'quill.bubble.css' : 'quill.snow.css';
    const linkId = `quill-theme-${theme}`;
    const existingLink = document.getElementById(linkId);

    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://cdn.quilljs.com/1.3.6/${themeCSS}`;
      link.id = linkId;
      document.head.appendChild(link);
    }

    const Quill = window.Quill;
    if (!Quill) return;

    const defaultModules = modules || {
      toolbar: headerTemplate
        ? false
        : [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ direction: 'rtl' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['clean'],
            ['link', 'image', 'video'],
          ],
    };

    const defaultFormats =
      formats ||
      [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'bullet',
        'script',
        'indent',
        'direction',
        'size',
        'color',
        'background',
        'font',
        'align',
        'link',
        'image',
        'video',
        'blockquote',
        'code-block',
      ];

    const quill = new Quill(editorRef.current, {
      theme,
      modules: defaultModules,
      formats: defaultFormats,
      placeholder,
      readOnly,
    });

    quillRef.current = quill;
    isInitializedRef.current = true;

    // Set initial value
    const initialValue = isControlled ? value : defaultValue;
    if (initialValue) {
      quill.root.innerHTML = initialValue;
    }

    // Handle text change
    quill.on('text-change', (delta: any, oldDelta: any, source: string) => {
      const htmlValue = quill.root.innerHTML;
      const textValue = quill.getText();

      if (!isControlled) {
        setInternalValue(htmlValue);
      }

      onTextChange?.({
        htmlValue,
        textValue,
        delta,
        source,
      });
    });

    // Handle custom toolbar
    if (headerTemplate && quill.getModule('toolbar')) {
      const toolbar = quill.getModule('toolbar');
      const toolbarElement = editorRef.current?.querySelector('.ql-toolbar');
      if (toolbarElement) {
        toolbarElement.innerHTML = '';
        // Note: Custom toolbar integration would need React rendering
        // For now, we'll use the default toolbar or hide it
      }
    }

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
        isInitializedRef.current = false;
      }
    };
    // Only initialize once when Quill is loaded
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isQuillLoaded]);

  // Update value when prop changes (only for controlled mode)
  useEffect(() => {
    if (!quillRef.current || !isControlled || !isInitializedRef.current) return;

    const quill = quillRef.current;
    const currentContent = quill.root.innerHTML;
    const newValue = value || '';

    // Only update if the value actually changed (avoid infinite loops)
    if (currentContent !== newValue) {
      // Use updateContents to prevent text-change event from firing
      const delta = quill.clipboard.convert({ html: newValue });
      quill.setContents(delta, 'silent');
    }
  }, [value, isControlled]);

  // Update readOnly state
  useEffect(() => {
    if (!quillRef.current) return;
    quillRef.current.enable(!readOnly);
  }, [readOnly]);

  const editorHeight = typeof height === 'number' ? `${height}px` : height;

  if (!isQuillLoaded) {
    return (
      <div
        className={clsx(
          'flex items-center justify-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800',
          className
        )}
        style={{ height: editorHeight, ...style }}
      >
        <p className="text-gray-500 dark:text-gray-400">Loading editor...</p>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'editor-wrapper border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900',
        className
      )}
      style={style}
    >
      {headerTemplate && (
        <div className="editor-toolbar border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
          {headerTemplate}
        </div>
      )}
      <div
        ref={editorRef}
        className={clsx(
          'editor-content',
          theme === 'snow' ? 'quill-snow' : 'quill-bubble',
          readOnly && 'opacity-75'
        )}
        style={{ height: editorHeight }}
      />
    </div>
  );
};

