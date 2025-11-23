import React, { useState, useMemo, useEffect } from 'react';
import { clsx } from 'clsx';

export interface CalendarEvent {
  /**
   * Unique identifier for the event
   */
  id: string | number;
  /**
   * Event date
   */
  date: Date;
  /**
   * Event title
   */
  title: string;
  /**
   * Event color/variant
   */
  color?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface CalendarProps {
  /**
   * Selected date(s)
   */
  value?: Date | [Date, Date] | null;
  /**
   * Default selected date(s)
   */
  defaultValue?: Date | [Date, Date] | null;
  /**
   * Calendar view mode
   */
  view?: 'month' | 'week' | 'year';
  /**
   * Initial month to display
   */
  initialMonth?: Date;
  /**
   * Whether to allow date range selection
   */
  range?: boolean;
  /**
   * Minimum selectable date
   */
  minDate?: Date;
  /**
   * Maximum selectable date
   */
  maxDate?: Date;
  /**
   * Events to display on the calendar
   */
  events?: CalendarEvent[];
  /**
   * Size variant
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Color variant
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  /**
   * Show week numbers
   */
  showWeekNumbers?: boolean;
  /**
   * Show today button
   */
  showTodayButton?: boolean;
  /**
   * Show navigation arrows
   */
  showNavigation?: boolean;
  /**
   * First day of week (0 = Sunday, 1 = Monday, etc.)
   */
  firstDayOfWeek?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Show time selection
   */
  showTime?: boolean;
  /**
   * Time format (12h or 24h)
   */
  timeFormat?: '12h' | '24h';
  /**
   * Show seconds in time picker
   */
  showSeconds?: boolean;
  /**
   * Minimum selectable time
   */
  minTime?: string; // Format: "HH:mm" or "HH:mm:ss"
  /**
   * Maximum selectable time
   */
  maxTime?: string; // Format: "HH:mm" or "HH:mm:ss"
  /**
   * Callback when date selection changes
   */
  onChange?: (date: Date | [Date, Date] | null) => void;
  /**
   * Callback when month changes
   */
  onMonthChange?: (date: Date) => void;
  /**
   * Additional className
   */
  className?: string;
}

/**
 * Calendar component with various views and layouts
 */
export const Calendar: React.FC<CalendarProps> = ({
  value: controlledValue,
  defaultValue = null,
  view = 'month',
  initialMonth = new Date(),
  range = false,
  minDate,
  maxDate,
  events = [],
  size = 'medium',
  variant = 'default',
  showWeekNumbers = false,
  showTodayButton = true,
  showNavigation = true,
  firstDayOfWeek = 0,
  showTime = false,
  timeFormat = '24h',
  showSeconds = false,
  minTime,
  maxTime,
  onChange,
  onMonthChange,
  className,
}) => {
  const [internalValue, setInternalValue] = useState<Date | [Date, Date] | null>(defaultValue);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [rangeStart, setRangeStart] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<{ hours: number; minutes: number; seconds: number }>(() => {
    const now = new Date();
    return {
      hours: now.getHours(),
      minutes: now.getMinutes(),
      seconds: now.getSeconds(),
    };
  });

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;

  // Update selected time when value changes
  useEffect(() => {
    if (selectedValue && !Array.isArray(selectedValue)) {
      setSelectedTime({
        hours: selectedValue.getHours(),
        minutes: selectedValue.getMinutes(),
        seconds: selectedValue.getSeconds(),
      });
    } else if (selectedValue && Array.isArray(selectedValue) && selectedValue[0]) {
      setSelectedTime({
        hours: selectedValue[0].getHours(),
        minutes: selectedValue[0].getMinutes(),
        seconds: selectedValue[0].getSeconds(),
      });
    }
  }, [selectedValue]);

  // Size classes
  const sizeClasses = {
    small: {
      cell: 'w-8 h-8 text-xs',
      header: 'text-xs',
      nav: 'text-sm',
    },
    medium: {
      cell: 'w-10 h-10 text-sm',
      header: 'text-sm',
      nav: 'text-base',
    },
    large: {
      cell: 'w-12 h-12 text-base',
      header: 'text-base',
      nav: 'text-lg',
    },
  };

  // Variant colors
  const variantColors = {
    default: {
      selected: 'bg-gray-900 text-white',
      today: 'bg-gray-100 text-gray-900 font-semibold',
      hover: 'hover:bg-gray-100',
      active: 'bg-gray-200',
    },
    primary: {
      selected: 'bg-blue-600 text-white',
      today: 'bg-blue-100 text-blue-900 font-semibold',
      hover: 'hover:bg-blue-50',
      active: 'bg-blue-200',
    },
    success: {
      selected: 'bg-green-600 text-white',
      today: 'bg-green-100 text-green-900 font-semibold',
      hover: 'hover:bg-green-50',
      active: 'bg-green-200',
    },
    warning: {
      selected: 'bg-yellow-500 text-white',
      today: 'bg-yellow-100 text-yellow-900 font-semibold',
      hover: 'hover:bg-yellow-50',
      active: 'bg-yellow-200',
    },
    danger: {
      selected: 'bg-red-600 text-white',
      today: 'bg-red-100 text-red-900 font-semibold',
      hover: 'hover:bg-red-50',
      active: 'bg-red-200',
    },
    info: {
      selected: 'bg-cyan-600 text-white',
      today: 'bg-cyan-100 text-cyan-900 font-semibold',
      hover: 'hover:bg-cyan-50',
      active: 'bg-cyan-200',
    },
  };

  const colors = variantColors[variant];
  const sizes = sizeClasses[size];

  // Get month start date
  const getMonthStart = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Get month end date
  const getMonthEnd = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Compare dates (ignoring time)
  const compareDates = (date1: Date, date2: Date): number => {
    const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
    const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return d1.getTime() - d2.getTime();
  };

  // Check if date is selected
  const isSelected = (date: Date) => {
    if (!selectedValue) return false;
    if (range && Array.isArray(selectedValue)) {
      const [start, end] = selectedValue;
      const dateTime = compareDates(date, start);
      const endTime = compareDates(date, end);
      return (dateTime >= 0 && endTime <= 0) || (dateTime <= 0 && endTime >= 0);
    }
    if (selectedValue instanceof Date) {
      return compareDates(date, selectedValue) === 0;
    }
    return false;
  };

  // Check if date is in range selection
  const isInRange = (date: Date) => {
    if (!range || !selectedValue || !Array.isArray(selectedValue)) return false;
    const [start, end] = selectedValue;
    const dateTime = compareDates(date, start);
    const endTime = compareDates(date, end);
    // Check if date is between start and end (exclusive)
    return (dateTime > 0 && endTime < 0) || (dateTime < 0 && endTime > 0);
  };

  // Check if date is disabled
  const isDisabled = (date: Date) => {
    if (minDate && compareDates(date, minDate) < 0) return true;
    if (maxDate && compareDates(date, maxDate) > 0) return true;
    return false;
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  // Navigate to previous period
  const goToPreviousPeriod = () => {
    let newDate: Date;
    if (view === 'year') {
      newDate = new Date(currentMonth.getFullYear() - 1, 0, 1);
    } else if (view === 'week') {
      newDate = new Date(currentMonth);
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    }
    setCurrentMonth(newDate);
    onMonthChange?.(newDate);
  };

  // Navigate to next period
  const goToNextPeriod = () => {
    let newDate: Date;
    if (view === 'year') {
      newDate = new Date(currentMonth.getFullYear() + 1, 0, 1);
    } else if (view === 'week') {
      newDate = new Date(currentMonth);
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    }
    setCurrentMonth(newDate);
    onMonthChange?.(newDate);
  };

  // Go to today
  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onMonthChange?.(today);
  };

  // Apply time to date
  const applyTimeToDate = (date: Date): Date => {
    if (!showTime) return date;
    const newDate = new Date(date);
    newDate.setHours(selectedTime.hours, selectedTime.minutes, selectedTime.seconds, 0);
    return newDate;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;

    const dateWithTime = applyTimeToDate(date);

    if (range) {
      if (!rangeStart) {
        setRangeStart(dateWithTime);
        const newValue: [Date, Date] = [dateWithTime, dateWithTime];
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      } else {
        const newValue: [Date, Date] = dateWithTime < rangeStart ? [dateWithTime, rangeStart] : [rangeStart, dateWithTime];
        setRangeStart(null);
        if (!isControlled) {
          setInternalValue(newValue);
        }
        onChange?.(newValue);
      }
    } else {
      if (!isControlled) {
        setInternalValue(dateWithTime);
      }
      onChange?.(dateWithTime);
    }
  };

  // Handle time change
  const handleTimeChange = (field: 'hours' | 'minutes' | 'seconds', value: number) => {
    const newTime = { ...selectedTime, [field]: value };
    setSelectedTime(newTime);

    // Update selected date with new time
    if (selectedValue && !Array.isArray(selectedValue)) {
      const updatedDate = new Date(selectedValue);
      updatedDate.setHours(newTime.hours, newTime.minutes, newTime.seconds, 0);
      if (!isControlled) {
        setInternalValue(updatedDate);
      }
      onChange?.(updatedDate);
    } else if (selectedValue && Array.isArray(selectedValue)) {
      const [start, end] = selectedValue;
      const updatedStart = new Date(start);
      updatedStart.setHours(newTime.hours, newTime.minutes, newTime.seconds, 0);
      const updatedEnd = new Date(end);
      updatedEnd.setHours(newTime.hours, newTime.minutes, newTime.seconds, 0);
      const newValue: [Date, Date] = [updatedStart, updatedEnd];
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChange?.(newValue);
    }
  };

  // Format time for display
  const formatTime = (hours: number, minutes: number, seconds: number): string => {
    if (timeFormat === '12h') {
      const period = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      if (showSeconds) {
        return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
      }
      return `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
    if (showSeconds) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Parse time string
  const parseTime = (timeStr: string): { hours: number; minutes: number; seconds: number } => {
    const parts = timeStr.split(':');
    return {
      hours: parseInt(parts[0]) || 0,
      minutes: parseInt(parts[1]) || 0,
      seconds: parseInt(parts[2]) || 0,
    };
  };

  // Check if time is valid
  const isTimeValid = (hours: number, minutes: number, seconds: number): boolean => {
    if (hours < 0 || hours >= 24) return false;
    if (minutes < 0 || minutes >= 60) return false;
    if (seconds < 0 || seconds >= 60) return false;
    
    if (minTime) {
      const min = parseTime(minTime);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      const minTotalSeconds = min.hours * 3600 + min.minutes * 60 + min.seconds;
      if (totalSeconds < minTotalSeconds) return false;
    }
    
    if (maxTime) {
      const max = parseTime(maxTime);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      const maxTotalSeconds = max.hours * 3600 + max.minutes * 60 + max.seconds;
      if (totalSeconds > maxTotalSeconds) return false;
    }
    
    return true;
  };

  // Generate calendar days for month view
  const generateMonthDays = () => {
    const monthStart = getMonthStart(currentMonth);
    const monthEnd = getMonthEnd(currentMonth);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - startDate.getDay() + firstDayOfWeek);
    if (startDate.getDay() > firstDayOfWeek) {
      startDate.setDate(startDate.getDate() - 7);
    }

    const days: Date[] = [];
    const currentDate = new Date(startDate);
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  // Generate week days
  const generateWeekDays = () => {
    const weekStart = new Date(currentMonth);
    const dayOfWeek = weekStart.getDay();
    const diff = weekStart.getDate() - dayOfWeek + firstDayOfWeek;
    weekStart.setDate(diff);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Get day names
  const dayNames = useMemo(() => {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return [...names.slice(firstDayOfWeek), ...names.slice(0, firstDayOfWeek)];
  }, [firstDayOfWeek]);

  // Get month name
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get week header text
  const getWeekHeaderText = () => {
    const days = generateWeekDays();
    if (days.length > 0) {
      return `Week of ${days[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return monthName;
  };

  // Render month view
  const renderMonthView = () => {
    const days = generateMonthDays();
    const monthStart = getMonthStart(currentMonth);
    const monthEnd = getMonthEnd(currentMonth);

    return (
      <div className="w-full">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className={clsx(
                'text-center font-semibold text-gray-600 dark:text-gray-400 py-2',
                sizes.header
              )}
            >
              {day}
            </div>
          ))}
        </div>
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const isCurrentMonth = date >= monthStart && date <= monthEnd;
            const isSelectedDate = isSelected(date);
            const isTodayDate = isToday(date);
            const isDisabledDate = isDisabled(date);
            const isInRangeDate = isInRange(date);
            const dateEvents = getEventsForDate(date);

            return (
              <button
                key={index}
                type="button"
                disabled={isDisabledDate}
                className={clsx(
                  'relative flex flex-col items-center justify-center rounded transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-offset-1',
                  sizes.cell,
                  'min-w-0', // Prevent overflow
                  !isCurrentMonth && 'text-gray-400 dark:text-gray-600',
                  isDisabledDate && 'opacity-50 cursor-not-allowed',
                  isSelectedDate && colors.selected + ' focus:ring-opacity-50',
                  !isSelectedDate && isTodayDate && colors.today + ' ring-2 ring-gray-300 dark:ring-gray-600',
                  !isSelectedDate && !isTodayDate && !isDisabledDate && colors.hover + ' focus:ring-gray-300 dark:focus:ring-gray-600',
                  isInRangeDate && !isSelectedDate && 'bg-gray-100 dark:bg-gray-700',
                  isCurrentMonth && !isDisabledDate && !isSelectedDate && 'text-gray-900 dark:text-gray-100'
                )}
                onClick={() => handleDateClick(date)}
              >
                <span className="relative z-10">{date.getDate()}</span>
                {dateEvents.length > 0 && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5 z-10">
                    {dateEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={clsx(
                          'w-1 h-1 rounded-full',
                          event.color === 'primary' && 'bg-blue-500',
                          event.color === 'success' && 'bg-green-500',
                          event.color === 'warning' && 'bg-yellow-500',
                          event.color === 'danger' && 'bg-red-500',
                          event.color === 'info' && 'bg-cyan-500',
                          (!event.color || event.color === 'default') && 'bg-gray-500'
                        )}
                        title={event.title}
                      />
                    ))}
                    {dateEvents.length > 3 && (
                      <div className="w-1 h-1 rounded-full bg-gray-400" title={`+${dateEvents.length - 3} more`} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Render week view
  const renderWeekView = () => {
    const days = generateWeekDays();

    return (
      <div className="w-full">
        <div className="grid grid-cols-7 gap-2">
          {dayNames.map((day, index) => {
            const dayDate = days[index];
            const isSelectedDate = isSelected(dayDate);
            const isTodayDate = isToday(dayDate);
            const isDisabledDate = isDisabled(dayDate);
            const dayEvents = getEventsForDate(dayDate);

            return (
              <div key={day} className="flex flex-col">
                <div className={clsx(
                  'text-center font-semibold text-gray-600 dark:text-gray-400 mb-2',
                  sizes.header
                )}>
                  <div>{day}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <button
                  type="button"
                  disabled={isDisabledDate}
                  className={clsx(
                    'flex flex-col items-center justify-center rounded transition-all',
                    'focus:outline-none focus:ring-2 focus:ring-offset-1',
                    sizes.cell,
                    'w-full',
                    isSelectedDate && colors.selected + ' focus:ring-opacity-50',
                    !isSelectedDate && isTodayDate && colors.today + ' ring-2 ring-gray-300 dark:ring-gray-600',
                    !isSelectedDate && !isTodayDate && !isDisabledDate && colors.hover + ' focus:ring-gray-300 dark:focus:ring-gray-600',
                    isDisabledDate && 'opacity-50 cursor-not-allowed',
                    'text-gray-900 dark:text-gray-100'
                  )}
                  onClick={() => handleDateClick(dayDate)}
                >
                  <span className="relative z-10">{dayDate.getDate()}</span>
                  {dayEvents.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-0.5 justify-center">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={clsx(
                            'w-1.5 h-1.5 rounded-full',
                            event.color === 'primary' && 'bg-blue-500',
                            event.color === 'success' && 'bg-green-500',
                            event.color === 'warning' && 'bg-yellow-500',
                            event.color === 'danger' && 'bg-red-500',
                            event.color === 'info' && 'bg-cyan-500',
                            (!event.color || event.color === 'default') && 'bg-gray-500'
                          )}
                          title={event.title}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500">+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render year view
  const renderYearView = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const monthDate = new Date(currentMonth.getFullYear(), i, 1);
      return {
        name: monthDate.toLocaleDateString('en-US', { month: 'short' }),
        date: monthDate,
      };
    });

    return (
      <div className="w-full">
        <div className="grid grid-cols-4 gap-2">
          {months.map(({ name, date: monthDate }) => {
            const isCurrentMonth = monthDate.getMonth() === new Date().getMonth() &&
              monthDate.getFullYear() === new Date().getFullYear();
            const isSelectedMonth = selectedValue instanceof Date &&
              monthDate.getMonth() === selectedValue.getMonth() &&
              monthDate.getFullYear() === selectedValue.getFullYear();

            return (
              <button
                key={name}
                type="button"
                className={clsx(
                  'p-3 text-center rounded transition-all',
                  'focus:outline-none focus:ring-2 focus:ring-offset-1',
                  isSelectedMonth && colors.selected + ' focus:ring-opacity-50',
                  !isSelectedMonth && isCurrentMonth && colors.today + ' ring-2 ring-gray-300 dark:ring-gray-600',
                  !isSelectedMonth && !isCurrentMonth && colors.hover + ' focus:ring-gray-300 dark:focus:ring-gray-600',
                  sizes.header,
                  'font-medium'
                )}
                onClick={() => {
                  setCurrentMonth(monthDate);
                  onMonthChange?.(monthDate);
                }}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={clsx(
      'bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4',
      'border border-gray-200 dark:border-gray-700',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {showNavigation && (
            <>
              <button
                type="button"
                onClick={goToPreviousPeriod}
                className={clsx(
                  'p-1.5 rounded-md transition-colors',
                  'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700',
                  'focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-offset-1',
                  'text-gray-600 dark:text-gray-400',
                  'flex items-center justify-center',
                  'w-8 h-8'
                )}
                aria-label={view === 'year' ? 'Previous year' : view === 'week' ? 'Previous week' : 'Previous month'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h2 className={clsx(
                'font-semibold text-gray-900 dark:text-gray-100 min-w-[180px] text-center',
                sizes.nav
              )}>
                {view === 'year' 
                  ? currentMonth.getFullYear() 
                  : view === 'week'
                  ? getWeekHeaderText()
                  : monthName}
              </h2>
              <button
                type="button"
                onClick={goToNextPeriod}
                className={clsx(
                  'p-1.5 rounded-md transition-colors',
                  'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700',
                  'focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-offset-1',
                  'text-gray-600 dark:text-gray-400',
                  'flex items-center justify-center',
                  'w-8 h-8'
                )}
                aria-label={view === 'year' ? 'Next year' : view === 'week' ? 'Next week' : 'Next month'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
          {!showNavigation && (
            <h2 className={clsx('font-semibold text-gray-900 dark:text-gray-100', sizes.nav)}>
              {view === 'year' ? currentMonth.getFullYear() : monthName}
            </h2>
          )}
        </div>
        {showTodayButton && (
          <button
            type="button"
            onClick={goToToday}
            className={clsx(
              'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
              'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
              'hover:bg-gray-200 dark:hover:bg-gray-600',
              'focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-600'
            )}
          >
            Today
          </button>
        )}
      </div>

      {/* Calendar Body */}
      <div className="w-full">
        {view === 'month' && renderMonthView()}
        {view === 'week' && renderWeekView()}
        {view === 'year' && renderYearView()}
      </div>

      {/* Time Selection */}
      {showTime && view !== 'year' && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time:</label>
            <div className="flex items-center gap-2">
              {/* Hours */}
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min={timeFormat === '12h' ? 1 : 0}
                  max={timeFormat === '12h' ? 12 : 23}
                  value={timeFormat === '12h' ? (selectedTime.hours % 12 || 12) : selectedTime.hours}
                  onChange={(e) => {
                    let newHours = parseInt(e.target.value) || 0;
                    if (timeFormat === '12h') {
                      const period = selectedTime.hours >= 12 ? 12 : 0;
                      newHours = (newHours % 12) + period;
                    }
                    if (isTimeValid(newHours, selectedTime.minutes, selectedTime.seconds)) {
                      handleTimeChange('hours', newHours);
                    }
                  }}
                  className={clsx(
                    'w-12 text-center border border-gray-300 dark:border-gray-600 rounded',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    sizes.cell,
                    'h-auto py-1'
                  )}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">HH</span>
              </div>
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">:</span>
              {/* Minutes */}
              <div className="flex flex-col items-center">
                <input
                  type="number"
                  min={0}
                  max={59}
                  value={selectedTime.minutes}
                  onChange={(e) => {
                    const newMinutes = parseInt(e.target.value) || 0;
                    if (isTimeValid(selectedTime.hours, newMinutes, selectedTime.seconds)) {
                      handleTimeChange('minutes', Math.min(59, Math.max(0, newMinutes)));
                    }
                  }}
                  className={clsx(
                    'w-12 text-center border border-gray-300 dark:border-gray-600 rounded',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500',
                    sizes.cell,
                    'h-auto py-1'
                  )}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">MM</span>
              </div>
              {showSeconds && (
                <>
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">:</span>
                  {/* Seconds */}
                  <div className="flex flex-col items-center">
                    <input
                      type="number"
                      min={0}
                      max={59}
                      value={selectedTime.seconds}
                      onChange={(e) => {
                        const newSeconds = parseInt(e.target.value) || 0;
                        if (isTimeValid(selectedTime.hours, selectedTime.minutes, newSeconds)) {
                          handleTimeChange('seconds', Math.min(59, Math.max(0, newSeconds)));
                        }
                      }}
                      className={clsx(
                        'w-12 text-center border border-gray-300 dark:border-gray-600 rounded',
                        'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500',
                        sizes.cell,
                        'h-auto py-1'
                      )}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">SS</span>
                  </div>
                </>
              )}
              {timeFormat === '12h' && (
                <div className="flex flex-col gap-1 ml-2">
                  <button
                    type="button"
                    onClick={() => {
                      const newHours = selectedTime.hours < 12 ? selectedTime.hours : selectedTime.hours - 12;
                      handleTimeChange('hours', newHours);
                    }}
                    className={clsx(
                      'px-2 py-1 text-xs rounded',
                      selectedTime.hours < 12
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    AM
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const newHours = selectedTime.hours >= 12 ? selectedTime.hours : selectedTime.hours + 12;
                      handleTimeChange('hours', newHours);
                    }}
                    className={clsx(
                      'px-2 py-1 text-xs rounded',
                      selectedTime.hours >= 12
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    )}
                  >
                    PM
                  </button>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {formatTime(selectedTime.hours, selectedTime.minutes, selectedTime.seconds)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

