import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { clsx } from 'clsx';
import { Editor } from './Editor';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/Editor',
  component: Editor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A rich text editor component based on Quill. Provides a full-featured WYSIWYG editor with toolbar, formatting options, and content management. Requires Quill library to be installed or loaded from CDN.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: 'text',
      description: 'Editor content (HTML string)',
    },
    readOnly: {
      control: 'boolean',
      description: 'Whether editor is read-only',
    },
    height: {
      control: 'text',
      description: 'Editor height (CSS value)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    theme: {
      control: 'select',
      options: ['snow', 'bubble'],
      description: 'Quill theme',
    },
  },
  args: {
    onTextChange: fn(),
  },
} satisfies Meta<typeof Editor>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic editor with default toolbar
 */
export const Basic: Story = {
  render: () => {
    const [text, setText] = useState('');

    return (
      <div className="space-y-4">
        <Editor
          value={text}
          onTextChange={(e) => setText(e.htmlValue || '')}
          height={320}
        />
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">HTML Output:</h4>
          <pre className="text-sm overflow-auto max-h-40">
            {text || '(empty)'}
          </pre>
        </div>
      </div>
    );
  },
};

/**
 * Editor with initial content
 */
export const WithInitialContent: Story = {
  render: () => {
    const [text, setText] = useState(
      '<h1>Heading</h1><p>This is a <strong>rich text</strong> editor with <em>formatting</em> options.</p><ul><li>List item 1</li><li>List item 2</li></ul>'
    );

    return (
      <div className="space-y-4">
        <Editor
          value={text}
          onTextChange={(e) => setText(e.htmlValue || '')}
          height={320}
        />
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">Current Content:</h4>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>
    );
  },
};

/**
 * Read-only editor
 */
export const ReadOnly: Story = {
  render: () => {
    return (
      <Editor
        value="<h1>Always bet on Prime!</h1><p>This content is <strong>read-only</strong> and cannot be edited.</p>"
        readOnly
        height={320}
      />
    );
  },
};

/**
 * Editor with custom height
 */
export const CustomHeight: Story = {
  render: () => {
    const [text, setText] = useState('');

    return (
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-2">Small Editor (200px)</h3>
          <Editor
            value={text}
            onTextChange={(e) => setText(e.htmlValue || '')}
            height={200}
          />
        </div>
        <div>
          <h3 className="font-semibold mb-2">Large Editor (500px)</h3>
          <Editor
            value={text}
            onTextChange={(e) => setText(e.htmlValue || '')}
            height={500}
          />
        </div>
      </div>
    );
  },
};

/**
 * Editor with custom placeholder
 */
export const CustomPlaceholder: Story = {
  render: () => {
    const [text, setText] = useState('');

    return (
      <Editor
        value={text}
        onTextChange={(e) => setText(e.htmlValue || '')}
        placeholder="Start typing your content here..."
        height={320}
      />
    );
  },
};

/**
 * Editor with bubble theme
 */
export const BubbleTheme: Story = {
  render: () => {
    const [text, setText] = useState('');

    return (
      <div className="space-y-4">
        <Editor
          value={text}
          onTextChange={(e) => setText(e.htmlValue || '')}
          theme="bubble"
          height={320}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Bubble theme shows toolbar on selection
        </p>
      </div>
    );
  },
};

/**
 * Editor for blog post
 */
export const BlogPostEditor: Story = {
  render: () => {
    const [content, setContent] = useState('');

    return (
      <div className="space-y-4 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold mb-2">Blog Post Editor</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Write your blog post with rich text formatting
          </p>
        </div>
        <Editor
          value={content}
          onTextChange={(e) => setContent(e.htmlValue || '')}
          placeholder="Write your blog post here..."
          height={400}
        />
        {content && (
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">Preview:</h4>
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    );
  },
};

/**
 * Editor for email composition
 */
export const EmailEditor: Story = {
  render: () => {
    const [emailContent, setEmailContent] = useState('');

    return (
      <div className="space-y-4 max-w-3xl">
        <div>
          <h2 className="text-xl font-bold mb-2">Compose Email</h2>
        </div>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="To:"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
          <input
            type="text"
            placeholder="Subject:"
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <Editor
          value={emailContent}
          onTextChange={(e) => setEmailContent(e.htmlValue || '')}
          placeholder="Write your email message..."
          height={300}
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Send
          </button>
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
            Save Draft
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Editor with character count
 */
export const WithCharacterCount: Story = {
  render: () => {
    const [text, setText] = useState('');
    const [textValue, setTextValue] = useState('');

    return (
      <div className="space-y-4">
        <Editor
          value={text}
          onTextChange={(e) => {
            setText(e.htmlValue || '');
            setTextValue(e.textValue || '');
          }}
          height={320}
        />
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>Characters: {textValue.length}</span>
          <span>Words: {textValue.trim() ? textValue.trim().split(/\s+/).length : 0}</span>
        </div>
      </div>
    );
  },
};

/**
 * Dark theme editor
 */
export const DarkTheme: Story = {
  render: () => {
    const [text, setText] = useState('');

    return (
      <ThemeWrapper theme="dark">
        <div className="p-6 min-h-screen bg-gray-900 space-y-4">
          <h2 className="text-2xl font-bold text-white">Rich Text Editor (Dark Theme)</h2>
          <Editor
            value={text}
            onTextChange={(e) => setText(e.htmlValue || '')}
            height={400}
          />
          {text && (
            <div className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold mb-2 text-white">Preview:</h4>
              <div
                className="prose prose-invert max-w-none text-gray-300"
                dangerouslySetInnerHTML={{ __html: text }}
              />
            </div>
          )}
        </div>
      </ThemeWrapper>
    );
  },
  parameters: {
    layout: 'fullscreen',
  },
};

/**
 * Editor with minimal toolbar
 */
export const MinimalToolbar: Story = {
  render: () => {
    const [text, setText] = useState('');

    const minimalModules = {
      toolbar: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link'],
      ],
    };

    return (
      <div className="space-y-4">
        <Editor
          value={text}
          onTextChange={(e) => setText(e.htmlValue || '')}
          modules={minimalModules}
          height={320}
        />
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Editor with minimal toolbar options
        </p>
      </div>
    );
  },
};

/**
 * Editor for comments/notes
 */
export const CommentEditor: Story = {
  render: () => {
    const [comment, setComment] = useState('');

    const commentModules = {
      toolbar: [
        ['bold', 'italic'],
        ['link'],
        [{ list: 'bullet' }],
      ],
    };

    return (
      <div className="space-y-4 max-w-2xl">
        <Editor
          value={comment}
          onTextChange={(e) => setComment(e.htmlValue || '')}
          modules={commentModules}
          placeholder="Add a comment..."
          height={200}
        />
        <div className="flex justify-end">
          <button
            disabled={!comment.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Post Comment
          </button>
        </div>
      </div>
    );
  },
};

/**
 * Editor with form integration
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      title: '',
      content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Title: ${formData.title}\nContent: ${formData.content}`);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <Editor
            value={formData.content}
            onTextChange={(e) => setFormData({ ...formData, content: e.htmlValue || '' })}
            height={300}
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
};

/**
 * Editor with content preview
 */
export const WithPreview: Story = {
  render: () => {
    const [content, setContent] = useState('');
    const [showPreview, setShowPreview] = useState(false);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(false)}
            className={clsx(
              'px-4 py-2 rounded-md',
              !showPreview
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            )}
          >
            Edit
          </button>
          <button
            onClick={() => setShowPreview(true)}
            className={clsx(
              'px-4 py-2 rounded-md',
              showPreview
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            )}
          >
            Preview
          </button>
        </div>
        {showPreview ? (
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 min-h-[400px]">
            <div
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">No content to preview</p>' }}
            />
          </div>
        ) : (
          <Editor
            value={content}
            onTextChange={(e) => setContent(e.htmlValue || '')}
            height={400}
          />
        )}
      </div>
    );
  },
};

