import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/FileUpload',
  component: FileUpload,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An advanced file upload component with drag-and-drop support, multi-file uploads, auto-uploading, progress tracking, and file validations. Works across all platforms and devices.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'select',
      options: ['basic', 'advanced'],
      description: 'Upload mode',
    },
    multiple: {
      control: 'boolean',
      description: 'Allow multiple files',
    },
    auto: {
      control: 'boolean',
      description: 'Auto-upload after selection',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether upload is disabled',
    },
  },
  args: {
    onSelect: fn(),
    onUpload: fn(),
    onComplete: fn(),
    onError: fn(),
    onClear: fn(),
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic mode file upload
 */
export const Basic: Story = {
  render: () => {
    return (
      <FileUpload
        mode="basic"
        name="demo[]"
        accept="image/*"
        maxFileSize={1000000}
        onUpload={(e) => {
          console.log('Upload:', e.files);
          alert(`Uploading ${e.files.length} file(s)`);
        }}
      />
    );
  },
};

/**
 * Basic mode with auto upload
 */
export const BasicAuto: Story = {
  render: () => {
    return (
      <FileUpload
        mode="basic"
        name="demo[]"
        accept="image/*"
        maxFileSize={1000000}
        auto
        chooseOptions={{ label: 'Browse' }}
        onUpload={(e) => {
          console.log('Auto upload:', e.files);
          alert(`Auto-uploading ${e.files.length} file(s)`);
        }}
      />
    );
  },
};

/**
 * Advanced mode with drag and drop
 */
export const Advanced: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl">
        <FileUpload
          name="demo[]"
          multiple
          accept="image/*"
          maxFileSize={1000000}
          emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>}
          onSelect={(e) => {
            console.log('Selected files:', e.files);
          }}
          onUpload={(e) => {
            console.log('Upload:', e.files);
            alert(`Uploading ${e.files.length} file(s)`);
          }}
        />
      </div>
    );
  },
};

/**
 * Advanced mode with custom template
 */
export const CustomTemplate: Story = {
  render: () => {
    const [totalSize, setTotalSize] = useState(0);

    const headerTemplate = (
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => {
              const input = document.querySelector('input[type="file"]') as HTMLInputElement;
              input?.click();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Choose
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {formatFileSize(totalSize)} / 1 MB
          </span>
        </div>
      </div>
    );

    const itemTemplate = (fileItem: any, options: any) => (
      <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
          <span className="text-2xl">🖼️</span>
        </div>
        <div className="flex-1">
          <div className="font-medium">{fileItem.file.name}</div>
          <div className="text-sm text-gray-500">{formatFileSize(fileItem.file.size)}</div>
        </div>
        <button
          onClick={() => options.onRemove(fileItem)}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
        >
          ×
        </button>
      </div>
    );

    const emptyTemplate = (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📸</div>
        <p className="text-lg font-semibold mb-2">Drag and Drop Image Here</p>
        <p className="text-sm text-gray-500">or click to browse</p>
      </div>
    );

    return (
      <div className="w-full max-w-2xl">
        <FileUpload
          name="demo[]"
          multiple
          accept="image/*"
          maxFileSize={1000000}
          headerTemplate={headerTemplate}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          onSelect={(e) => {
            const size = e.files.reduce((sum, file) => sum + file.size, 0);
            setTotalSize(size);
          }}
        />
      </div>
    );
  },
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Custom upload handler
 */
export const CustomUpload: Story = {
  render: () => {
    const customBase64Uploader = async (event: { files: File[] }) => {
      // Simulate custom upload logic
      for (const file of event.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64 = e.target?.result;
          console.log('Base64:', base64);
          alert(`File ${file.name} converted to base64`);
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <FileUpload
        mode="basic"
        name="demo[]"
        accept="image/*"
        customUpload
        uploadHandler={customBase64Uploader}
        chooseOptions={{ label: 'Choose' }}
      />
    );
  },
};

/**
 * File upload with validations
 */
export const WithValidations: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Upload with Validations</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Max file size: 1MB | Accepted: Images only | Max files: 5
          </p>
        </div>
        <FileUpload
          name="demo[]"
          multiple
          accept="image/*"
          maxFileSize={1000000}
          maxFiles={5}
          onError={(e) => {
            alert(`Error: ${e.error}`);
          }}
          onSelect={(e) => {
            console.log('Selected:', e.files.length, 'files');
          }}
        />
      </div>
    );
  },
};

/**
 * Multiple file types
 */
export const MultipleFileTypes: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl">
        <FileUpload
          name="demo[]"
          multiple
          accept=".pdf,.doc,.docx,.txt,image/*"
          maxFileSize={5000000}
          onSelect={(e) => {
            console.log('Selected files:', e.files);
          }}
        />
      </div>
    );
  },
};

/**
 * Single file upload
 */
export const SingleFile: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl">
        <FileUpload
          name="demo"
          accept="image/*"
          maxFileSize={2000000}
          onSelect={(e) => {
            console.log('Selected file:', e.files[0]);
          }}
        />
      </div>
    );
  },
};

/**
 * With progress tracking
 */
export const WithProgress: Story = {
  render: () => {
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

    return (
      <div className="w-full max-w-2xl space-y-4">
        <FileUpload
          name="demo[]"
          multiple
          accept="image/*"
          maxFileSize={1000000}
          url="/api/upload"
          onComplete={(e) => {
            const names = e.files.map((f) => f.name);
            setUploadedFiles([...uploadedFiles, ...names]);
            alert(`Uploaded: ${names.join(', ')}`);
          }}
          onError={(e) => {
            alert(`Upload error: ${e.error}`);
          }}
        />
        {uploadedFiles.length > 0 && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h4 className="font-semibold mb-2">Uploaded Files:</h4>
            <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300">
              {uploadedFiles.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Auto upload mode
 */
export const AutoUpload: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl">
        <FileUpload
          name="demo[]"
          multiple
          accept="image/*"
          maxFileSize={1000000}
          auto
          customUpload
          uploadHandler={async (event) => {
            // Simulate upload
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log('Auto uploaded:', event.files);
            alert(`Auto-uploaded ${event.files.length} file(s)`);
          }}
          onSelect={(e) => {
            console.log('Selected and auto-uploading:', e.files);
          }}
        />
      </div>
    );
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl">
        <FileUpload
          name="demo[]"
          multiple
          accept="image/*"
          disabled
          emptyTemplate={<p className="m-0">File upload is disabled</p>}
        />
      </div>
    );
  },
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  render: () => {
    return (
      <ThemeWrapper theme="dark">
        <div className="p-8 min-h-screen bg-gray-900 space-y-8">
          <h2 className="text-2xl font-bold text-white">File Upload (Dark Theme)</h2>
          <div className="w-full max-w-2xl">
            <FileUpload
              name="demo[]"
              multiple
              accept="image/*"
              maxFileSize={1000000}
              emptyTemplate={<p className="m-0 text-gray-400">Drag and drop files to here to upload.</p>}
            />
          </div>
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Document upload example
 */
export const DocumentUpload: Story = {
  render: () => {
    return (
      <div className="w-full max-w-2xl space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Upload PDF, Word, or text documents. Maximum file size: 5MB
          </p>
        </div>
        <FileUpload
          name="documents[]"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          maxFileSize={5000000}
          onSelect={(e) => {
            console.log('Documents selected:', e.files);
          }}
        />
      </div>
    );
  },
};

/**
 * Image gallery upload
 */
export const ImageGallery: Story = {
  render: () => {
    const [images, setImages] = useState<string[]>([]);

    const customUploadHandler = async (event: { files: File[] }) => {
      const newImages: string[] = [];
      for (const file of event.files) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          newImages.push(dataUrl);
          if (newImages.length === event.files.length) {
            setImages([...images, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    const itemTemplate = (fileItem: any, options: any) => (
      <div className="relative group">
        <img
          src={URL.createObjectURL(fileItem.file)}
          alt={fileItem.file.name}
          className="w-full h-32 object-cover rounded-lg"
        />
        <button
          onClick={() => options.onRemove(fileItem)}
          className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          ×
        </button>
      </div>
    );

    return (
      <div className="w-full max-w-4xl space-y-4">
        <FileUpload
          name="images[]"
          multiple
          accept="image/*"
          maxFileSize={5000000}
          customUpload
          uploadHandler={customUploadHandler}
          itemTemplate={itemTemplate}
          emptyTemplate={
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📷</div>
              <p className="text-lg font-semibold">Upload Images</p>
              <p className="text-sm text-gray-500 mt-2">Drag and drop or click to browse</p>
            </div>
          }
        />
        {images.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4">Uploaded Images ({images.length})</h4>
            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

/**
 * Form integration
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      files: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Form submitted with ${formData.files.length} file(s)`);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Attachments</label>
          <FileUpload
            name="attachments[]"
            multiple
            accept="*/*"
            maxFileSize={10000000}
            onSelect={(e) => {
              setFormData({ ...formData, files: [...formData.files, ...e.files] });
            }}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    );
  },
  parameters: {
    layout: 'padded',
  },
};

