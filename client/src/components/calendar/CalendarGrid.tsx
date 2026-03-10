import { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useCalendar } from '@/hooks/useCalendar';
import { useTasks } from '@/hooks/useTasks';
import { useHolidays } from '@/hooks/useHolidays';
import { CalendarHeader } from './CalendarHeader';
import { CalendarCell } from './CalendarCell';
import { Task } from '@/types/calendar';

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 24px hsla(0, 0%, 0%, 0.12);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const WeekDays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: hsl(220, 14%, 95%);
  border-bottom: 1px solid hsl(220, 13%, 87%);
`;

const WeekDay = styled.div`
  padding: 8px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: hsl(220, 10%, 45%);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid() {
  const { year, monthName, goToPrev, goToNext, getCalendarDays } = useCalendar();
  const { tasks, addTask, updateTask, deleteTask, moveTask, updateTaskLabels } = useTasks();
  const { getHolidaysForDate } = useHolidays(year);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const days = getCalendarDays();
  const today = formatDate(new Date());

  const handleDragStart = useCallback((e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, date: string, order: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, date, order);
    }
    setDraggedTask(null);
  }, [moveTask]);

  return (
    <Wrapper>
      <CalendarHeader
        monthName={monthName}
        year={year}
        onPrev={goToPrev}
        onNext={goToNext}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <WeekDays>
        {WEEKDAYS.map(d => <WeekDay key={d}>{d}</WeekDay>)}
      </WeekDays>
      <Grid>
        {days.map(({ date, isCurrentMonth }) => {
          const dateStr = formatDate(date);
          const dayTasks = tasks.filter(t => t.date === dateStr);
          const holidays = getHolidaysForDate(dateStr);
          return (
            <CalendarCell
              key={dateStr}
              date={date}
              isCurrentMonth={isCurrentMonth}
              isToday={dateStr === today}
              tasks={dayTasks}
              holidays={holidays}
              searchQuery={searchQuery}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
              onUpdateLabels={updateTaskLabels}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          );
        })}
      </Grid>
    </Wrapper>
  );
}
