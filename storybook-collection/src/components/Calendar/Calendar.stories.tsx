import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { Calendar } from './Calendar';
import { ThemeWrapper } from '../../utils/ThemeWrapper';

const meta = {
    title: 'Components/Calendar',
    component: Calendar,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A versatile calendar component with multiple views (month, week, year), date selection, range selection, and event support.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            description: 'Selected date(s)',
        },
        defaultValue: {
            description: 'Default selected date(s)',
        },
        view: {
            control: 'select',
            options: ['month', 'week', 'year'],
            description: 'Calendar view mode',
        },
        range: {
            control: 'boolean',
            description: 'Allow date range selection',
        },
        size: {
            control: 'select',
            options: ['small', 'medium', 'large'],
            description: 'Size variant',
        },
        variant: {
            control: 'select',
            options: ['default', 'primary', 'success', 'warning', 'danger', 'info'],
            description: 'Color variant',
        },
        showWeekNumbers: {
            control: 'boolean',
            description: 'Show week numbers',
        },
        showTodayButton: {
            control: 'boolean',
            description: 'Show today button',
        },
        showNavigation: {
            control: 'boolean',
            description: 'Show navigation arrows',
        },
        firstDayOfWeek: {
            control: 'select',
            options: [0, 1, 2, 3, 4, 5, 6],
            description: 'First day of week (0=Sunday)',
        },
        onChange: {
            action: 'changed',
            description: 'Callback when date selection changes',
        },
        onMonthChange: {
            action: 'month-changed',
            description: 'Callback when month changes',
        },
    },
    args: {
        onChange: fn(),
        onMonthChange: fn(),
    },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default calendar - month view
 */
export const Default: Story = {
    args: {
        defaultValue: new Date(),
    },
};

/**
 * Calendar with date selection
 */
export const WithSelection: Story = {
    render: () => {
        const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
        return (
            <Calendar
                value={selectedDate}
                onChange={(date) => setSelectedDate(date as Date)}
            />
        );
    },
};

/**
 * Calendar with date range selection
 */
export const DateRange: Story = {
    render: () => {
        const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
        return (
            <div className="space-y-4">
                <Calendar
                    range={true}
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [Date, Date])}
                />
                {dateRange && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Selected Range: {dateRange[0].toLocaleDateString()} - {dateRange[1].toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>
        );
    },
};

/**
 * Different calendar views
 */
export const Views: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Month View</h3>
                <Calendar view="month" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Week View</h3>
                <Calendar view="week" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Year View</h3>
                <Calendar view="year" defaultValue={new Date()} />
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Different sizes
 */
export const Sizes: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Small</h3>
                <Calendar size="small" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Medium</h3>
                <Calendar size="medium" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Large</h3>
                <Calendar size="large" defaultValue={new Date()} />
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Different color variants
 */
export const Variants: Story = {
    render: () => (
        <div className="space-y-8">
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Default</h3>
                <Calendar variant="default" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Primary</h3>
                <Calendar variant="primary" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Success</h3>
                <Calendar variant="success" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Warning</h3>
                <Calendar variant="warning" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Danger</h3>
                <Calendar variant="danger" defaultValue={new Date()} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Info</h3>
                <Calendar variant="info" defaultValue={new Date()} />
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Calendar with events
 */
export const WithEvents: Story = {
    render: () => {
        const today = new Date();
        const events = [
            { id: 1, date: new Date(today.getFullYear(), today.getMonth(), 5), title: 'Meeting', color: 'primary' as const },
            { id: 2, date: new Date(today.getFullYear(), today.getMonth(), 10), title: 'Conference', color: 'success' as const },
            { id: 3, date: new Date(today.getFullYear(), today.getMonth(), 15), title: 'Deadline', color: 'danger' as const },
            { id: 4, date: new Date(today.getFullYear(), today.getMonth(), 20), title: 'Workshop', color: 'warning' as const },
            { id: 5, date: new Date(today.getFullYear(), today.getMonth(), 25), title: 'Review', color: 'info' as const },
        ];

        return (
            <div className="space-y-4">
                <Calendar defaultValue={today} events={events} />
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Event Legend:</p>
                    <div className="flex flex-wrap gap-4 text-xs">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <span className="text-gray-600 dark:text-gray-400">Primary</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-gray-600 dark:text-gray-400">Success</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-gray-600 dark:text-gray-400">Danger</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                            <span className="text-gray-600 dark:text-gray-400">Warning</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-cyan-500" />
                            <span className="text-gray-600 dark:text-gray-400">Info</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
};

/**
 * Calendar with min/max dates
 */
export const WithMinMaxDates: Story = {
    render: () => {
        const today = new Date();
        const minDate = new Date(today.getFullYear(), today.getMonth(), 1);
        const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);

        return (
            <div className="space-y-4">
                <Calendar defaultValue={today} minDate={minDate} maxDate={maxDate} />
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Only dates in the current month are selectable.
                    </p>
                </div>
            </div>
        );
    },
};

/**
 * Calendar with Monday as first day
 */
export const MondayFirst: Story = {
    args: {
        defaultValue: new Date(),
        firstDayOfWeek: 1,
    },
};

/**
 * Calendar without navigation
 */
export const WithoutNavigation: Story = {
    args: {
        defaultValue: new Date(),
        showNavigation: false,
    },
};

/**
 * Calendar without today button
 */
export const WithoutTodayButton: Story = {
    args: {
        defaultValue: new Date(),
        showTodayButton: false,
    },
};

/**
 * Minimal calendar
 */
export const Minimal: Story = {
    args: {
        defaultValue: new Date(),
        showNavigation: false,
        showTodayButton: false,
    },
};

/**
 * Week view with events
 */
export const WeekViewWithEvents: Story = {
    render: () => {
        const today = new Date();
        const events = [
            { id: 1, date: new Date(today), title: 'Today Event', color: 'primary' as const },
            { id: 2, date: new Date(today.getTime() + 86400000), title: 'Tomorrow Event', color: 'success' as const },
            { id: 3, date: new Date(today.getTime() + 172800000), title: 'Day After', color: 'warning' as const },
        ];

        return <Calendar view="week" defaultValue={today} events={events} />;
    },
};

/**
 * Year view for navigation
 */
export const YearView: Story = {
    render: () => {
        const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
        return (
            <div className="space-y-4">
                <Calendar view="year" initialMonth={selectedMonth} onMonthChange={setSelectedMonth} />
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Click a month to navigate to it.
                    </p>
                </div>
            </div>
        );
    },
};

/**
 * Range selection example
 */
export const RangeSelection: Story = {
    render: () => {
        const [range, setRange] = useState<[Date, Date] | null>(null);
        return (
            <div className="space-y-4">
                <Calendar range={true} value={range} onChange={(dates) => setRange(dates as [Date, Date])} />
                {range && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Selected Range: {range[0].toLocaleDateString()} - {range[1].toLocaleDateString()}
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                            Duration: {Math.ceil((range[1].getTime() - range[0].getTime()) / (1000 * 60 * 60 * 24))} days
                        </p>
                    </div>
                )}
            </div>
        );
    },
};

/**
 * All variants showcase
 */
export const AllVariantsShowcase: Story = {
    render: () => (
        <div className="space-y-12">
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Views</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Calendar view="month" defaultValue={new Date()} />
                    <Calendar view="week" defaultValue={new Date()} />
                    <Calendar view="year" defaultValue={new Date()} />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Sizes</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Calendar size="small" defaultValue={new Date()} />
                    <Calendar size="medium" defaultValue={new Date()} />
                    <Calendar size="large" defaultValue={new Date()} />
                </div>
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">Variants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Calendar variant="primary" defaultValue={new Date()} />
                    <Calendar variant="success" defaultValue={new Date()} />
                </div>
            </div>
        </div>
    ),
    parameters: {
        layout: 'padded',
    },
};

/**
 * Calendar with time selection (24h format)
 */
export const WithTime24h: Story = {
    render: () => {
        const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
        return (
            <div className="space-y-4">
                <Calendar
                    showTime={true}
                    timeFormat="24h"
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date as Date)}
                />
                {selectedDate && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Selected: {selectedDate.toLocaleString()}
                        </p>
                    </div>
                )}
            </div>
        );
    },
};

/**
 * Calendar with time selection (12h format)
 */
export const WithTime12h: Story = {
    render: () => {
        const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
        return (
            <div className="space-y-4">
                <Calendar
                    showTime={true}
                    timeFormat="12h"
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date as Date)}
                />
                {selectedDate && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Selected: {selectedDate.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                    </div>
                )}
            </div>
        );
    },
};

/**
 * Calendar with time selection including seconds
 */
export const WithTimeSeconds: Story = {
    render: () => {
        const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
        return (
            <div className="space-y-4">
                <Calendar
                    showTime={true}
                    timeFormat="24h"
                    showSeconds={true}
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date as Date)}
                />
                {selectedDate && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Selected: {selectedDate.toLocaleTimeString()}
                        </p>
                    </div>
                )}
            </div>
        );
    },
};

/**
 * Calendar with time range selection
 */
export const TimeRangeSelection: Story = {
    render: () => {
        const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
        return (
            <div className="space-y-4">
                <Calendar
                    range={true}
                    showTime={true}
                    timeFormat="24h"
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates as [Date, Date])}
                />
                {dateRange && (
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Start: {dateRange[0].toLocaleString()}
                        </p>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            End: {dateRange[1].toLocaleString()}
                        </p>
                    </div>
                )}
            </div>
        );
    },
};

/**
 * Calendar with time constraints
 */
export const WithTimeConstraints: Story = {
    render: () => {
        const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
        return (
            <div className="space-y-4">
                <Calendar
                    showTime={true}
                    timeFormat="24h"
                    minTime="09:00"
                    maxTime="17:00"
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date as Date)}
                />
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Time selection restricted to 9:00 AM - 5:00 PM
                    </p>
                </div>
            </div>
        );
    },
};

/**
 * Date and time picker example
 */
export const DateTimePicker: Story = {
    render: () => {
        const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(new Date());
        return (
            <div className="space-y-4 max-w-md">
                <Calendar
                    showTime={true}
                    timeFormat="12h"
                    showSeconds={false}
                    value={selectedDateTime}
                    onChange={(date) => setSelectedDateTime(date as Date)}
                />
                {selectedDateTime && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            Selected Date & Time:
                        </p>
                        <p className="text-base text-gray-700 dark:text-gray-300">
                            {selectedDateTime.toLocaleString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true,
                            })}
                        </p>
                    </div>
                )}
            </div>
        );
    },
};

/**
 * Dark theme - Calendar variants
 */
export const DarkTheme: Story = {
    render: () => (
        <ThemeWrapper theme="dark">
            <div className="space-y-8">
                <Calendar defaultValue={new Date()} variant="primary" />
                <Calendar defaultValue={new Date()} variant="success" view="week" />
                <Calendar defaultValue={new Date()} variant="info" view="year" />
                <Calendar
                    defaultValue={new Date()}
                    range={true}
                    events={[
                        { id: 1, date: new Date(), title: 'Event', color: 'primary' },
                        { id: 2, date: new Date(Date.now() + 86400000), title: 'Event 2', color: 'success' },
                    ]}
                />
                <Calendar
                    defaultValue={new Date()}
                    showTime={true}
                    timeFormat="24h"
                    variant="primary"
                />
            </div>
        </ThemeWrapper>
    ),
    parameters: {
        layout: 'fullscreen',
    },
};

