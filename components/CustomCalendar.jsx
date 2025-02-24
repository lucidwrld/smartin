import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const CustomCalendar = ({ events = [], onDateSelect, onClearFilter }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const today = new Date();

  // Fix for Monday start
  const adjustDay = (day) => (day === 0 ? 6 : day - 1);

  // Calendar navigation functions with 1-based months
  const nextMonth = () => {
    const nextDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    setCurrentDate(nextDate);
  };

  const prevMonth = () => {
    const prevDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    setCurrentDate(prevDate);
  };

  // Get days in month and start of month
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getStartDayOfMonth = (date) => {
    return adjustDay(new Date(date.getFullYear(), date.getMonth(), 1).getDay());
  };

  // Check if a date is today
  const isToday = (date) => {
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Handle date click
  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Handle clear filter
  const handleClearFilter = () => {
    setSelectedDate(null);
    if (onClearFilter) {
      onClearFilter();
    }
  };

  // Generate calendar data
  const generateCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = getStartDayOfMonth(currentDate);
    const calendar = [];

    // Previous month days
    const prevMonthDays = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      0
    ).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        prevMonthDays - i
      );
      calendar.push({
        day: prevMonthDays - i,
        isCurrentMonth: false,
        date,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        i
      );
      calendar.push({
        day: i,
        isCurrentMonth: true,
        date,
      });
    }

    // Next month days
    const remainingDays = 42 - calendar.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        i
      );
      calendar.push({
        day: i,
        isCurrentMonth: false,
        date,
      });
    }

    return calendar;
  };

  // Check if a date has events (adjusting for 1-based months)
  const hasEvents = (date) => {
    return events.some(
      (event) =>
        event.getFullYear() === date.getFullYear() &&
        event.getMonth() === date.getMonth() &&
        event.getDate() === date.getDate()
    );
  };

  // Format month and year
  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  return (
    <div className="w-full max-w-sm bg-white rounded-lg shadow p-4 text-brandBlack">
      <h2 className="text-lg font-semibold mb-4">Filter by calendar</h2>

      <div className="relative flex items-center justify-center mb-4">
        <button
          onClick={prevMonth}
          className="absolute left-0 p-1 hover:bg-gray-100 rounded-full"
          type="button"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="text-sm font-medium">
          {formatMonthYear(currentDate)}
        </span>

        <button
          onClick={nextMonth}
          className="absolute right-0 p-1 hover:bg-gray-100 rounded-full"
          type="button"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm text-gray-500 py-2">
            {day}
          </div>
        ))}

        {generateCalendar().map((dateObj, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(dateObj.date)}
            type="button"
            className="relative aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded-lg"
          >
            <div
              className={`
              flex items-center justify-center w-8 h-8 rounded-full
              ${isToday(dateObj.date) ? "bg-purple-600 text-white" : ""}
              ${isSelected(dateObj.date) ? "bg-purple-100" : ""}
              ${dateObj.isCurrentMonth ? "text-gray-900" : "text-gray-400"}
              ${hasEvents(dateObj.date) ? "font-bold" : ""}
            `}
            >
              {dateObj.day}
            </div>
            {hasEvents(dateObj.date) && (
              <div className="absolute bottom-1 w-1 h-1 bg-purple-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <button
        onClick={handleClearFilter}
        className="w-full mt-4 text-sm text-purple-600 flex items-center justify-center gap-1 py-2 border-t hover:bg-gray-50"
        type="button"
      >
        Clear filter
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CustomCalendar;
