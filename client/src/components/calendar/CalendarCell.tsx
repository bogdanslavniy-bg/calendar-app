import { useState, useRef } from 'react';
import styled from 'styled-components';
import { Task, Holiday } from '@/types/calendar';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';

const Cell = styled.div<{ $isCurrentMonth: boolean; $isToday: boolean; $isDragOver: boolean }>`
  border: 1px solid hsl(220, 13%, 87%);
  min-height: 120px;
  padding: 4px;
  background: ${p =>
    p.$isDragOver ? 'hsl(28, 90%, 96%)' :
    p.$isToday ? 'hsl(28, 90%, 96%)' :
    p.$isCurrentMonth ? 'white' : 'hsl(220, 14%, 96%)'};
  opacity: ${p => p.$isCurrentMonth ? 1 : 0.5};
  transition: background 0.15s;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DayHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const DayNumber = styled.span<{ $isToday: boolean }>`
  font-size: 13px;
  font-weight: ${p => p.$isToday ? 700 : 500};
  color: ${p => p.$isToday ? 'hsl(28, 90%, 45%)' : 'hsl(220, 15%, 30%)'};
`;

const TaskCount = styled.span`
  font-size: 10px;
  color: hsl(220, 10%, 55%);
`;

const HolidayBadge = styled.div`
  font-size: 10px;
  color: hsl(145, 50%, 35%);
  background: hsl(145, 50%, 92%);
  padding: 2px 6px;
  border-radius: 3px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 0;
`;

const TasksArea = styled.div`
  flex: 1;
  overflow-y: auto;
  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-thumb { background: hsl(220, 10%, 80%); border-radius: 3px; }
`;

const AddBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: hsl(220, 10%, 60%);
  font-size: 11px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: 3px;
  opacity: 0.4;
  transition: opacity 0.15s;
  &:hover { color: hsl(28, 90%, 55%); }
`;

const InlineInput = styled.input`
  font-size: 12px;
  width: 100%;
  border: 1px solid hsl(28, 90%, 55%);
  border-radius: 4px;
  padding: 4px 6px;
  outline: none;
  margin-bottom: 4px;
`;

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface Props {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  tasks: Task[];
  holidays: Holiday[];
  searchQuery: string;
  onAddTask: (date: string, text: string) => void;
  onUpdateTask: (id: string, text: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateLabels: (id: string, labels: string[]) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDrop: (e: React.DragEvent, date: string, order: number) => void;
}

export function CalendarCell({
  date, isCurrentMonth, isToday, tasks, holidays, searchQuery,
  onAddTask, onUpdateTask, onDeleteTask, onUpdateLabels, onDragStart, onDrop
}: Props) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dateStr = formatDate(date);

  const sortedTasks = [...tasks].sort((a, b) => a.order - b.order);
  const matchingIds = searchQuery
    ? new Set(sortedTasks.filter(t => t.text.toLowerCase().includes(searchQuery.toLowerCase())).map(t => t.id))
    : null;

  const handleAdd = () => {
    if (newText.trim()) {
      onAddTask(dateStr, newText.trim());
      setNewText('');
    }
    setAdding(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const target = e.target as HTMLElement;
    const taskEl = target.closest('[data-task-id]');
    let order = sortedTasks.length;
    if (taskEl) {
      const taskId = taskEl.getAttribute('data-task-id');
      const idx = sortedTasks.findIndex(t => t.id === taskId);
      if (idx >= 0) order = idx;
    }
    onDrop(e, dateStr, order);
  };

  const displayDay = date.getDate();
  const monthLabel = date.getDate() === 1
    ? date.toLocaleString('en-US', { month: 'short' }) + ' '
    : '';

  return (
    <Cell
      $isCurrentMonth={isCurrentMonth}
      $isToday={isToday}
      $isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <DayHeader>
        <DayNumber $isToday={isToday}>
          {monthLabel}{displayDay}
        </DayNumber>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {tasks.length > 0 && <TaskCount>{tasks.length} card{tasks.length > 1 ? 's' : ''}</TaskCount>}
          <AddBtn onClick={() => { setAdding(true); setTimeout(() => inputRef.current?.focus(), 0); }}>
            <Plus size={12} />
          </AddBtn>
        </div>
      </DayHeader>

      {holidays.map(h => (
        <HolidayBadge key={h.name} title={h.name}>🎉 {h.localName}</HolidayBadge>
      ))}

      {adding && (
        <InlineInput
          ref={inputRef}
          value={newText}
          placeholder="Task name..."
          onChange={e => setNewText(e.target.value)}
          onBlur={handleAdd}
          onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false); }}
        />
      )}

      <TasksArea>
        {sortedTasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            isHidden={matchingIds !== null && !matchingIds.has(task.id)}
            onUpdate={onUpdateTask}
            onDelete={onDeleteTask}
            onUpdateLabels={onUpdateLabels}
            onDragStart={onDragStart}
          />
        ))}
      </TasksArea>
    </Cell>
  );
}
