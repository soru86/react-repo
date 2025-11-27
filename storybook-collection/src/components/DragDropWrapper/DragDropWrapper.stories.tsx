import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { DragDropWrapper } from './DragDropWrapper';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
  title: 'Components/DragDropWrapper',
  component: DragDropWrapper,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'A flexible drag and drop wrapper component that makes any child component draggable and/or droppable. Supports HTML5 drag and drop API with customizable callbacks, visual feedback, and drag type filtering.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    draggable: {
      control: 'boolean',
      description: 'Whether the item is draggable',
    },
    droppable: {
      control: 'boolean',
      description: 'Whether the item can accept drops',
    },
    dragEffect: {
      control: 'select',
      options: ['move', 'copy', 'link', 'none'],
      description: 'Visual feedback when dragging',
    },
    dragOverEffect: {
      control: 'select',
      options: ['move', 'copy', 'link', 'none'],
      description: 'Visual feedback when dragging over',
    },
    showDragFeedback: {
      control: 'boolean',
      description: 'Show visual feedback during drag',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether to disable the wrapper',
    },
  },
  args: {
    onDragStart: fn(),
    onDragEnd: fn(),
    onDragOver: fn(),
    onDragEnter: fn(),
    onDragLeave: fn(),
    onDrop: fn(),
  },
} satisfies Meta<typeof DragDropWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic draggable card
 */
export const DraggableCard: Story = {
  args: {
    draggable: true,
    droppable: false,
    id: 'card-1',
    data: { title: 'Card 1', content: 'This is a draggable card' },
  },
  render: (args) => (
    <div className="space-y-4">
      <DragDropWrapper {...args}>
        <Card title="Draggable Card" className="w-64">
          <p>Drag me around! This card is draggable.</p>
        </Card>
      </DragDropWrapper>
      <p className="text-sm text-gray-500">Try dragging the card above</p>
    </div>
  ),
};

/**
 * Droppable zone with draggable cards
 */
export const DragAndDrop: Story = {
  render: () => {
    const [droppedItems, setDroppedItems] = useState<any[]>([]);
    const [cards, setCards] = useState([
      { id: '1', title: 'Card 1', content: 'Drag me to the drop zone' },
      { id: '2', title: 'Card 2', content: 'Drag me to the drop zone' },
      { id: '3', title: 'Card 3', content: 'Drag me to the drop zone' },
    ]);

    const handleDrop = (e: React.DragEvent, data: any, droppedData: any) => {
      setDroppedItems((prev) => [...prev, droppedData.data]);
      setCards((prev) => prev.filter((card) => card.id !== droppedData.id));
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Draggable Cards</h3>
          <div className="flex gap-4 flex-wrap">
            {cards.map((card) => (
              <DragDropWrapper
                key={card.id}
                id={card.id}
                data={card}
                draggable
                droppable={false}
                dragType="card"
              >
                <Card title={card.title} className="w-48">
                  <p className="text-sm">{card.content}</p>
                </Card>
              </DragDropWrapper>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-4">Drop Zone</h3>
          <DragDropWrapper
            droppable
            draggable={false}
            acceptDragTypes={['card']}
            onDrop={handleDrop}
            className="min-h-64 p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
            dragOverClassName="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          >
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Drop Zone</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Drop cards here
              </p>
              {droppedItems.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold">Dropped Items:</p>
                  <div className="flex gap-4 flex-wrap justify-center">
                    {droppedItems.map((item, idx) => (
                      <Card key={idx} title={item.title} className="w-48">
                        <p className="text-sm">{item.content}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DragDropWrapper>
        </div>
      </div>
    );
  },
};

/**
 * Draggable buttons
 */
export const DraggableButtons: Story = {
  render: () => {
    const [droppedButtons, setDroppedButtons] = useState<any[]>([]);

    const buttons = [
      { id: 'btn-1', label: 'Primary Button', variant: 'primary' as const },
      { id: 'btn-2', label: 'Success Button', variant: 'success' as const },
      { id: 'btn-3', label: 'Danger Button', variant: 'danger' as const },
      { id: 'btn-4', label: 'Warning Button', variant: 'warning' as const },
    ];

    const handleDrop = (e: React.DragEvent, data: any, droppedData: any) => {
      setDroppedButtons((prev) => [...prev, droppedData.data]);
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Draggable Buttons</h3>
          <div className="flex gap-3 flex-wrap">
            {buttons.map((btn) => (
              <DragDropWrapper
                key={btn.id}
                id={btn.id}
                data={btn}
                draggable
                droppable={false}
                dragType="button"
              >
                <Button variant={btn.variant}>{btn.label}</Button>
              </DragDropWrapper>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-4">Button Drop Zone</h3>
          <DragDropWrapper
            droppable
            draggable={false}
            acceptDragTypes={['button']}
            onDrop={handleDrop}
            className="min-h-32 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center"
            dragOverClassName="border-green-500 bg-green-50 dark:bg-green-900/20"
          >
            <div className="text-center">
              <p className="text-sm font-semibold mb-2">Drop buttons here</p>
              {droppedButtons.length > 0 && (
                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                  {droppedButtons.map((btn, idx) => (
                    <Button key={idx} variant={btn.variant}>
                      {btn.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </DragDropWrapper>
        </div>
      </div>
    );
  },
};

/**
 * Multiple drop zones with type filtering
 */
export const MultipleDropZones: Story = {
  render: () => {
    const [zone1Items, setZone1Items] = useState<any[]>([]);
    const [zone2Items, setZone2Items] = useState<any[]>([]);

    const cards = [
      { id: 'card-1', title: 'Card 1', type: 'card' },
      { id: 'card-2', title: 'Card 2', type: 'card' },
      { id: 'button-1', label: 'Button 1', type: 'button', variant: 'primary' as const },
      { id: 'button-2', label: 'Button 2', type: 'button', variant: 'success' as const },
    ];

    const handleDropZone1 = (e: React.DragEvent, data: any, droppedData: any) => {
      setZone1Items((prev) => [...prev, droppedData.data]);
    };

    const handleDropZone2 = (e: React.DragEvent, data: any, droppedData: any) => {
      setZone2Items((prev) => [...prev, droppedData.data]);
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Draggable Items</h3>
          <div className="flex gap-4 flex-wrap">
            {cards.map((item) => (
              <DragDropWrapper
                key={item.id}
                id={item.id}
                data={item}
                draggable
                droppable={false}
                dragType={item.type}
              >
                {item.type === 'card' ? (
                  <Card title={item.title} className="w-48">
                    <p className="text-sm">Type: {item.type}</p>
                  </Card>
                ) : (
                  <Button variant="primary">{item.label}</Button>
                )}
              </DragDropWrapper>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-4">Card Drop Zone (accepts cards only)</h3>
            <DragDropWrapper
              droppable
              draggable={false}
              acceptDragTypes={['card']}
              onDrop={handleDropZone1}
              className="min-h-48 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
              dragOverClassName="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
            >
              <div className="text-center">
                <p className="text-sm font-semibold mb-2">Cards Only</p>
                <div className="mt-4 flex gap-4 flex-wrap justify-center">
                  {zone1Items.map((item, idx) => (
                    <Card key={idx} title={item.title} className="w-48">
                      <p className="text-sm">Type: {item.type}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </DragDropWrapper>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Button Drop Zone (accepts buttons only)</h3>
            <DragDropWrapper
              droppable
              draggable={false}
              acceptDragTypes={['button']}
              onDrop={handleDropZone2}
              className="min-h-48 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
              dragOverClassName="border-green-500 bg-green-50 dark:bg-green-900/20"
            >
              <div className="text-center">
                <p className="text-sm font-semibold mb-2">Buttons Only</p>
                <div className="mt-4 flex gap-2 flex-wrap justify-center">
                  {zone2Items.map((item, idx) => (
                    <Button key={idx} variant={item.variant || 'primary'}>
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </DragDropWrapper>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Custom drag feedback
 */
export const CustomDragFeedback: Story = {
  render: () => {
    return (
      <div className="space-y-4">
        <DragDropWrapper
          draggable
          droppable={false}
          draggingClassName="scale-105 shadow-lg"
          draggingStyle={{ transform: 'rotate(5deg)' }}
        >
          <Card title="Custom Drag Feedback" className="w-64">
            <p>This card has custom drag feedback styling</p>
          </Card>
        </DragDropWrapper>
        <p className="text-sm text-gray-500">Drag the card to see custom feedback</p>
      </div>
    );
  },
};

/**
 * Copy effect instead of move
 */
export const CopyEffect: Story = {
  render: () => {
    const [items, setItems] = useState<any[]>([]);

    const handleDrop = (e: React.DragEvent, data: any, droppedData: any) => {
      setItems((prev) => [...prev, droppedData.data]);
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Draggable (Copy Effect)</h3>
          <DragDropWrapper
            draggable
            droppable={false}
            dragEffect="copy"
            data={{ title: 'Item 1' }}
            id="item-1"
          >
            <Card title="Item 1" className="w-64">
              <p>Drag with copy effect - original stays</p>
            </Card>
          </DragDropWrapper>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-4">Drop Zone</h3>
          <DragDropWrapper
            droppable
            draggable={false}
            dragOverEffect="copy"
            onDrop={handleDrop}
            className="min-h-32 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
            dragOverClassName="border-purple-500 bg-purple-50 dark:bg-purple-900/20"
          >
            <div className="text-center">
              <p className="text-sm font-semibold mb-2">Drop Zone (Copy Mode)</p>
              {items.length > 0 && (
                <div className="mt-4 flex gap-4 flex-wrap justify-center">
                  {items.map((item, idx) => (
                    <Card key={idx} title={item.title} className="w-48">
                      <p className="text-sm">Copied item</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DragDropWrapper>
        </div>
      </div>
    );
  },
};

/**
 * Disabled state
 */
export const Disabled: Story = {
  args: {
    draggable: true,
    droppable: false,
    disabled: true,
  },
  render: (args) => (
    <div className="space-y-4">
      <DragDropWrapper {...args}>
        <Card title="Disabled Drag" className="w-64">
          <p>This item cannot be dragged (disabled)</p>
        </Card>
      </DragDropWrapper>
      <p className="text-sm text-gray-500">This wrapper is disabled</p>
    </div>
  ),
};

/**
 * Without visual feedback
 */
export const NoVisualFeedback: Story = {
  args: {
    draggable: true,
    droppable: false,
    showDragFeedback: false,
  },
  render: (args) => (
    <div className="space-y-4">
      <DragDropWrapper {...args}>
        <Card title="No Visual Feedback" className="w-64">
          <p>Drag feedback is disabled</p>
        </Card>
      </DragDropWrapper>
      <p className="text-sm text-gray-500">No visual feedback during drag</p>
    </div>
  ),
};

/**
 * Complex example with callbacks
 */
export const WithCallbacks: Story = {
  render: () => {
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (message: string) => {
      setLogs((prev) => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Draggable Item</h3>
          <DragDropWrapper
            draggable
            droppable={false}
            id="item-1"
            data={{ title: 'Test Item' }}
            onDragStart={(e, data) => addLog(`Drag started: ${data.data.title}`)}
            onDragEnd={(e, data) => addLog(`Drag ended: ${data.data.title}`)}
          >
            <Card title="Test Item" className="w-64">
              <p>Check the logs below when dragging</p>
            </Card>
          </DragDropWrapper>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-4">Drop Zone</h3>
          <DragDropWrapper
            droppable
            draggable={false}
            onDragEnter={(e, data) => addLog('Drag entered drop zone')}
            onDragOver={(e, data) => addLog('Dragging over drop zone')}
            onDragLeave={(e, data) => addLog('Drag left drop zone')}
            onDrop={(e, data, droppedData) => addLog(`Dropped: ${droppedData.data?.title || droppedData.id}`)}
            className="min-h-32 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
            dragOverClassName="border-blue-500 bg-blue-50 dark:bg-blue-900/20"
          >
            <div className="text-center">
              <p className="text-sm font-semibold mb-2">Drop Zone</p>
            </div>
          </DragDropWrapper>
        </div>

        <div>
          <h3 className="text-sm font-semibold mb-4">Event Logs</h3>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg max-h-48 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500">No events yet. Try dragging the item above.</p>
            ) : (
              <div className="space-y-1">
                {logs.map((log, idx) => (
                  <div key={idx} className="text-xs font-mono text-gray-600 dark:text-gray-400">
                    {log}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Dark theme
 */
export const DarkTheme: Story = {
  render: () => {
    const [droppedItems, setDroppedItems] = useState<any[]>([]);
    const [cards, setCards] = useState([
      { id: '1', title: 'Card 1', content: 'Drag me to the drop zone' },
      { id: '2', title: 'Card 2', content: 'Drag me to the drop zone' },
      { id: '3', title: 'Card 3', content: 'Drag me to the drop zone' },
    ]);

    const handleDrop = (e: React.DragEvent, data: any, droppedData: any) => {
      setDroppedItems((prev) => [...prev, droppedData.data]);
      setCards((prev) => prev.filter((card) => card.id !== droppedData.id));
    };

    return (
      <ThemeWrapper theme="dark">
        <div className="space-y-6 p-6">
          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-100">Draggable Cards</h3>
            <div className="flex gap-4 flex-wrap">
              {cards.map((card) => (
                <DragDropWrapper
                  key={card.id}
                  draggable
                  droppable={false}
                  id={card.id}
                  data={card}
                  dragType="card"
                >
                  <Card title={card.title} className="w-48">
                    <p className="text-sm">{card.content}</p>
                  </Card>
                </DragDropWrapper>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-gray-100">Drop Zone</h3>
            <DragDropWrapper
              droppable
              draggable={false}
              acceptDragTypes={['card']}
              onDrop={handleDrop}
              className="min-h-48 p-6 border-2 border-dashed border-gray-600 rounded-lg bg-gray-800"
              dragOverClassName="border-blue-400 bg-blue-900/20"
            >
              <div className="text-center">
                <p className="text-sm font-semibold mb-2 text-gray-100">Drop Zone</p>
                <p className="text-sm text-gray-400 mb-4">Drop cards here</p>
                {droppedItems.length > 0 && (
                  <div className="mt-4 flex gap-4 flex-wrap justify-center">
                    {droppedItems.map((item, idx) => (
                      <Card key={idx} title={item.title} className="w-48">
                        <p className="text-sm">{item.content}</p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </DragDropWrapper>
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
 * All features combined
 */
export const AllFeatures: Story = {
  render: () => {
    const [droppedItems, setDroppedItems] = useState<any[]>([]);
    const [events, setEvents] = useState<string[]>([]);

    const addEvent = (message: string) => {
      setEvents((prev) => [...prev.slice(-4), message]);
    };

    const handleDrop = (e: React.DragEvent, data: any, droppedData: any) => {
      setDroppedItems((prev) => [...prev, droppedData.data]);
      addEvent(`Dropped: ${droppedData.data?.title || droppedData.id}`);
    };

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold mb-4">Draggable Items</h3>
          <div className="flex gap-4 flex-wrap">
            {[1, 2, 3].map((num) => (
              <DragDropWrapper
                key={num}
                draggable
                droppable={false}
                id={`item-${num}`}
                data={{ title: `Item ${num}` }}
                dragType="item"
                dragEffect="move"
                onDragStart={(e, data) => addEvent(`Started dragging: ${data.data.title}`)}
                onDragEnd={(e, data) => addEvent(`Finished dragging: ${data.data.title}`)}
                draggingClassName="opacity-60 scale-95"
              >
                <Card title={`Item ${num}`} className="w-48">
                  <p className="text-sm">Drag me to the drop zone</p>
                </Card>
              </DragDropWrapper>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold mb-4">Drop Zone</h3>
            <DragDropWrapper
              droppable
              draggable={false}
              acceptDragTypes={['item']}
              dragOverEffect="move"
              onDragEnter={(e, data) => addEvent('Entered drop zone')}
              onDragLeave={(e, data) => addEvent('Left drop zone')}
              onDrop={handleDrop}
              className="min-h-48 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800"
              dragOverClassName="border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-300"
            >
              <div className="text-center">
                <p className="text-sm font-semibold mb-2">Drop Zone</p>
                <div className="mt-4 flex gap-4 flex-wrap justify-center">
                  {droppedItems.map((item, idx) => (
                    <Card key={idx} title={item.title} className="w-48">
                      <p className="text-sm">{item.title}</p>
                    </Card>
                  ))}
                </div>
              </div>
            </DragDropWrapper>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Event Log</h3>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg min-h-48">
              {events.length === 0 ? (
                <p className="text-sm text-gray-500">No events yet</p>
              ) : (
                <div className="space-y-1">
                  {events.map((event, idx) => (
                    <div key={idx} className="text-xs font-mono text-gray-600 dark:text-gray-400">
                      {event}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
};

