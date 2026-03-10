import { useState, useCallback } from 'react';

export function useCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const goToPrev = useCallback(() => {
    setCurrentDate(new Date(year, month - 1, 1));
  }, [year, month]);

  const goToNext = useCallback(() => {
    setCurrentDate(new Date(year, month + 1, 1));
  }, [year, month]);

  const getDaysInMonth = useCallback(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const getFirstDayOfWeek = useCallback(() => {
    return new Date(year, month, 1).getDay();
  }, [year, month]);

  const getCalendarDays = useCallback(() => {
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfWeek();
    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days to fill grid
    const remaining = 7 - (days.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        days.push({
          date: new Date(year, month + 1, i),
          isCurrentMonth: false,
        });
      }
    }

    return days;
  }, [year, month, getDaysInMonth, getFirstDayOfWeek]);

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });

  return { year, month, monthName, currentDate, goToPrev, goToNext, getCalendarDays };
}
