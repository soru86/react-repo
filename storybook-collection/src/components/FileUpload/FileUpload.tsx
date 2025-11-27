import React, { useState, useRef, useCallback } from 'react';
import { clsx } from 'clsx';

export type FileUploadMode = 'basic' | 'advanced';

export interface FileUploadFile {
    /**
     * File object
     */
    file: File;
    /**
     * Upload progress (0-100)
     */
    progress?: number;
    /**
     * Upload status
     */
    status?: 'pending' | 'uploading' | 'success' | 'error';
    /**
     * Error message if upload failed
     */
    error?: string;
    /**
     * Unique identifier
     */
    id: string;
}

export interface FileUploadProps {
    /**
     * Upload mode: basic or advanced
     */
    mode?: FileUploadMode;
    /**
     * Upload URL (for server upload)
     */
    url?: string;
    /**
     * Field name for file input
     */
    name?: string;
    /**
     * Accepted file types (e.g., "image/*", ".pdf,.doc")
     */
    accept?: string;
    /**
     * Maximum file size in bytes
     */
    maxFileSize?: number;
    /**
     * Maximum number of files
     */
    maxFiles?: number;
    /**
     * Whether multiple files can be selected
     */
    multiple?: boolean;
    /**
     * Whether to auto-upload files after selection
     */
    auto?: boolean;
    /**
     * Whether upload is disabled
     */
    disabled?: boolean;
    /**
     * Custom upload handler (overrides default upload)
     */
    customUpload?: boolean;
    /**
     * Custom upload handler function
     */
    uploadHandler?: (event: { files: File[] }) => void | Promise<void>;
    /**
     * Callback when files are selected
     */
    onSelect?: (event: { files: File[]; originalEvent: React.ChangeEvent<HTMLInputElement> }) => void;
    /**
     * Callback when upload starts
     */
    onUpload?: (event: { files: File[]; xhr?: XMLHttpRequest }) => void;
    /**
     * Callback when upload completes
     */
    onComplete?: (event: { files: File[] }) => void;
    /**
     * Callback when upload fails
     */
    onError?: (event: { files: File[]; error: any }) => void;
    /**
     * Callback when files are cleared
     */
    onClear?: () => void;
    /**
     * Callback when file is removed
     */
    onRemove?: (event: { file: File }) => void;
    /**
     * Custom header template
     */
    headerTemplate?: React.ReactNode;
    /**
     * Custom item template for each file
     */
    itemTemplate?: (file: FileUploadFile, options: { onRemove: (file: FileUploadFile) => void }) => React.ReactNode;
    /**
     * Custom empty template
     */
    emptyTemplate?: React.ReactNode;
    /**
     * Custom choose button options
     */
    chooseOptions?: {
        label?: string;
        icon?: React.ReactNode;
        className?: string;
    };
    /**
     * Custom upload button options
     */
    uploadOptions?: {
        label?: string;
        icon?: React.ReactNode;
        className?: string;
    };
    /**
     * Custom cancel/clear button options
     */
    cancelOptions?: {
        label?: string;
        icon?: React.ReactNode;
        className?: string;
    };
    /**
     * Additional CSS classes
     */
    className?: string;
    /**
     * Additional CSS styles
     */
    style?: React.CSSProperties;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const generateId = () => `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const FileUpload: React.FC<FileUploadProps> = ({
    mode = 'advanced',
    url,
    name = 'files[]',
    accept,
    maxFileSize,
    maxFiles,
    multiple = false,
    auto = false,
    disabled = false,
    customUpload = false,
    uploadHandler,
    onSelect,
    onUpload,
    onComplete,
    onError,
    onClear,
    onRemove,
    headerTemplate,
    itemTemplate,
    emptyTemplate,
    chooseOptions,
    uploadOptions,
    cancelOptions,
    className,
    style,
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileUploadFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState(false);

    const validateFile = useCallback(
        (file: File): string | null => {
            // Check file size
            if (maxFileSize && file.size > maxFileSize) {
                return `File size exceeds maximum allowed size of ${formatFileSize(maxFileSize)}`;
            }

            // Check file type
            if (accept) {
                const acceptedTypes = accept.split(',').map((type) => type.trim());
                const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
                const fileType = file.type;

                const isAccepted = acceptedTypes.some((type) => {
                    if (type.startsWith('.')) {
                        return type === fileExtension;
                    }
                    if (type.endsWith('/*')) {
                        const baseType = type.split('/')[0];
                        return fileType.startsWith(baseType + '/');
                    }
                    return fileType === type;
                });

                if (!isAccepted) {
                    return `File type not accepted. Accepted types: ${accept}`;
                }
            }

            return null;
        },
        [maxFileSize, accept]
    );

    const handleFileSelect = useCallback(
        (selectedFiles: FileList | null) => {
            if (!selectedFiles || selectedFiles.length === 0) return;

            const fileArray = Array.from(selectedFiles);
            const newFiles: FileUploadFile[] = [];

            // Check max files limit
            if (maxFiles && files.length + fileArray.length > maxFiles) {
                const error = `Maximum ${maxFiles} file(s) allowed`;
                onError?.({ files: fileArray, error });
                return;
            }

            fileArray.forEach((file) => {
                const validationError = validateFile(file);
                if (validationError) {
                    onError?.({ files: [file], error: validationError });
                    return;
                }

                newFiles.push({
                    file,
                    id: generateId(),
                    status: 'pending',
                    progress: 0,
                });
            });

            if (newFiles.length > 0) {
                const updatedFiles = [...files, ...newFiles];
                setFiles(updatedFiles);
                onSelect?.({
                    files: newFiles.map((f) => f.file),
                    originalEvent: {} as React.ChangeEvent<HTMLInputElement>,
                });

                // Auto upload if enabled
                if (auto && !customUpload) {
                    handleUpload(newFiles.map((f) => f.file));
                } else if (auto && customUpload && uploadHandler) {
                    uploadHandler({ files: newFiles.map((f) => f.file) });
                }
            }
        },
        [files, maxFiles, validateFile, onSelect, onError, auto, customUpload, uploadHandler]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFileSelect(e.target.files);
            // Reset input to allow selecting the same file again
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        },
        [handleFileSelect]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            if (disabled) return;

            const droppedFiles = e.dataTransfer.files;
            handleFileSelect(droppedFiles);
        },
        [disabled, handleFileSelect]
    );

    const handleUpload = useCallback(
        async (filesToUpload: File[] = files.map((f) => f.file)) => {
            if (filesToUpload.length === 0) return;

            setUploading(true);

            // Update files to uploading status
            setFiles((prevFiles) =>
                prevFiles.map((f) =>
                    filesToUpload.includes(f.file) ? { ...f, status: 'uploading' as const, progress: 0 } : f
                )
            );

            if (customUpload && uploadHandler) {
                try {
                    await uploadHandler({ files: filesToUpload });
                    setFiles((prevFiles) =>
                        prevFiles.map((f) =>
                            filesToUpload.includes(f.file) ? { ...f, status: 'success' as const, progress: 100 } : f
                        )
                    );
                    onComplete?.({ files: filesToUpload });
                } catch (error) {
                    setFiles((prevFiles) =>
                        prevFiles.map((f) =>
                            filesToUpload.includes(f.file)
                                ? { ...f, status: 'error' as const, error: String(error) }
                                : f
                        )
                    );
                    onError?.({ files: filesToUpload, error });
                } finally {
                    setUploading(false);
                }
                return;
            }

            // Default upload using XMLHttpRequest
            if (!url) {
                console.warn('FileUpload: url is required for default upload');
                setUploading(false);
                return;
            }

            const xhr = new XMLHttpRequest();
            const formData = new FormData();

            filesToUpload.forEach((file) => {
                formData.append(name, file);
            });

            onUpload?.({ files: filesToUpload, xhr });

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const progress = Math.round((e.loaded / e.total) * 100);
                    setFiles((prevFiles) =>
                        prevFiles.map((f) =>
                            filesToUpload.includes(f.file) ? { ...f, progress } : f
                        )
                    );
                }
            });

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    setFiles((prevFiles) =>
                        prevFiles.map((f) =>
                            filesToUpload.includes(f.file) ? { ...f, status: 'success' as const, progress: 100 } : f
                        )
                    );
                    onComplete?.({ files: filesToUpload });
                } else {
                    setFiles((prevFiles) =>
                        prevFiles.map((f) =>
                            filesToUpload.includes(f.file)
                                ? { ...f, status: 'error' as const, error: `Upload failed: ${xhr.statusText}` }
                                : f
                        )
                    );
                    onError?.({ files: filesToUpload, error: xhr.statusText });
                }
                setUploading(false);
            });

            xhr.addEventListener('error', () => {
                setFiles((prevFiles) =>
                    prevFiles.map((f) =>
                        filesToUpload.includes(f.file)
                            ? { ...f, status: 'error' as const, error: 'Upload failed' }
                            : f
                    )
                );
                onError?.({ files: filesToUpload, error: 'Network error' });
                setUploading(false);
            });

            xhr.open('POST', url);
            xhr.send(formData);
        },
        [files, url, name, customUpload, uploadHandler, onUpload, onComplete, onError]
    );

    const handleRemove = useCallback(
        (fileToRemove: FileUploadFile) => {
            setFiles((prevFiles) => prevFiles.filter((f) => f.id !== fileToRemove.id));
            onRemove?.({ file: fileToRemove.file });
        },
        [onRemove]
    );

    const handleClear = useCallback(() => {
        setFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClear?.();
    }, [onClear]);

    const handleChooseClick = useCallback(() => {
        if (!disabled && fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [disabled]);

    // Icons
    const UploadIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
    );

    const CloseIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    const FileIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const CheckIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    );

    const ErrorIcon = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    );

    // Basic mode
    if (mode === 'basic') {
        return (
            <div className={clsx('file-upload-basic', className)} style={style}>
                <input
                    ref={fileInputRef}
                    type="file"
                    name={name}
                    accept={accept}
                    multiple={multiple}
                    disabled={disabled}
                    onChange={handleInputChange}
                    className="hidden"
                    aria-label="File input"
                />
                <button
                    type="button"
                    onClick={handleChooseClick}
                    disabled={disabled}
                    className={clsx(
                        'px-4 py-2 rounded-md font-medium transition-colors',
                        'bg-blue-600 text-white hover:bg-blue-700',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                        'flex items-center justify-center gap-2',
                        chooseOptions?.className
                    )}
                >
                    <span className="flex items-center">
                        {chooseOptions?.icon || <UploadIcon />}
                    </span>
                    <span>{chooseOptions?.label || 'Choose'}</span>
                </button>
                {files.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {files.length} file(s) selected
                    </div>
                )}
            </div>
        );
    }

    // Advanced mode
    const defaultItemTemplate = (fileItem: FileUploadFile) => (
        <div
            className={clsx(
                'flex items-center gap-3 p-3 rounded-lg border',
                'bg-white dark:bg-gray-800',
                'border-gray-200 dark:border-gray-700',
                fileItem.status === 'error' && 'border-red-300 dark:border-red-700',
                fileItem.status === 'success' && 'border-green-300 dark:border-green-700'
            )}
        >
            <div className="flex-shrink-0">
                {fileItem.status === 'success' ? (
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                        <CheckIcon />
                    </div>
                ) : fileItem.status === 'error' ? (
                    <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-400">
                        <ErrorIcon />
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-400">
                        <FileIcon />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {fileItem.file.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(fileItem.file.size)}
                </div>
                {fileItem.status === 'uploading' && fileItem.progress !== undefined && (
                    <div className="mt-2">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${fileItem.progress}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {fileItem.progress}%
                        </div>
                    </div>
                )}
                {fileItem.status === 'error' && fileItem.error && (
                    <div className="text-sm text-red-600 dark:text-red-400 mt-1">{fileItem.error}</div>
                )}
            </div>
            <button
                onClick={() => handleRemove(fileItem)}
                className="flex-shrink-0 p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 rounded-md transition-colors"
                aria-label="Remove file"
            >
                <CloseIcon />
            </button>
        </div>
    );

    const defaultEmptyTemplate = (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <UploadIcon />
            <p className="mt-2">Drag and drop files to here to upload.</p>
        </div>
    );

    return (
        <div className={clsx('file-upload-advanced', className)} style={style}>
            <input
                ref={fileInputRef}
                type="file"
                name={name}
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                onChange={handleInputChange}
                className="hidden"
                aria-label="File input"
            />

            {/* Header */}
            {headerTemplate || (
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleChooseClick}
                            disabled={disabled}
                            className={clsx(
                                'px-4 py-2 rounded-md font-medium transition-colors',
                                'bg-blue-600 text-white hover:bg-blue-700',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                                'flex items-center gap-2',
                                chooseOptions?.className
                            )}
                        >
                            {chooseOptions?.icon || <UploadIcon />}
                            <span>{chooseOptions?.label || 'Choose'}</span>
                        </button>
                        {files.length > 0 && !auto && (
                            <button
                                type="button"
                                onClick={() => handleUpload()}
                                disabled={disabled || uploading}
                                className={clsx(
                                    'px-4 py-2 rounded-md font-medium transition-colors',
                                    'bg-green-600 text-white hover:bg-green-700',
                                    'disabled:opacity-50 disabled:cursor-not-allowed',
                                    'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
                                    'flex items-center gap-2',
                                    uploadOptions?.className
                                )}
                            >
                                {uploadOptions?.icon || <UploadIcon />}
                                <span>{uploadOptions?.label || 'Upload'}</span>
                            </button>
                        )}
                    </div>
                    {files.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={disabled || uploading}
                            className={clsx(
                                'px-4 py-2 rounded-md font-medium transition-colors',
                                'bg-red-600 text-white hover:bg-red-700',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                                'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
                                'flex items-center gap-2',
                                cancelOptions?.className
                            )}
                        >
                            {cancelOptions?.icon || <CloseIcon />}
                            <span>{cancelOptions?.label || 'Clear'}</span>
                        </button>
                    )}
                </div>
            )}

            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={clsx(
                    'border-2 border-dashed rounded-b-lg transition-colors',
                    'p-6',
                    isDragging
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800',
                    disabled && 'opacity-50 cursor-not-allowed'
                )}
            >
                {files.length === 0 ? (
                    emptyTemplate || defaultEmptyTemplate
                ) : (
                    <div className="space-y-2">
                        {files.map((fileItem) => {
                            if (itemTemplate) {
                                return (
                                    <div key={fileItem.id}>
                                        {itemTemplate(fileItem, {
                                            onRemove: handleRemove,
                                        })}
                                    </div>
                                );
                            }
                            return <div key={fileItem.id}>{defaultItemTemplate(fileItem)}</div>;
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

