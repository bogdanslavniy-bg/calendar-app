import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { Task, LabelColor } from '@/types/calendar';

const LABEL_COLORS: Record<LabelColor, string> = {
  green: 'hsl(145, 63%, 42%)',
  yellow: 'hsl(45, 93%, 58%)',
  blue: 'hsl(210, 79%, 54%)',
  orange: 'hsl(28, 90%, 55%)',
  purple: 'hsl(280, 60%, 55%)',
  cyan: 'hsl(187, 72%, 50%)',
};

const Card = styled.div<{ $isDragging: boolean; $isHidden: boolean }>`
  background: white;
  border-radius: 6px;
  padding: 6px 8px;
  margin-bottom: 4px;
  box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.1);
  cursor: grab;
  opacity: ${p => p.$isDragging ? 0.5 : p.$isHidden ? 0.3 : 1};
  transition: box-shadow 0.15s, opacity 0.15s;
  position: relative;
  &:hover {
    box-shadow: 0 2px 6px hsla(0, 0%, 0%, 0.15);
  }
  &:hover button[data-delete] {
    opacity: 1;
  }
  &:active { cursor: grabbing; }
`;

const Labels = styled.div`
  display: flex;
  gap: 4px;
  margin-bottom: 4px;
  flex-wrap: wrap;
`;

const LabelDot = styled.span<{ $color: string }>`
  width: 32px;
  height: 8px;
  border-radius: 4px;
  background: ${p => p.$color};
  display: inline-block;
  cursor: pointer;
`;

const TaskText = styled.div`
  font-size: 12px;
  line-height: 1.4;
  color: hsl(220, 15%, 20%);
  word-break: break-word;
`;

const EditInput = styled.input`
  font-size: 12px;
  width: 100%;
  border: 1px solid hsl(28, 90%, 55%);
  border-radius: 3px;
  padding: 2px 4px;
  outline: none;
`;

const DeleteBtn = styled.button`
  position: absolute;
  top: 2px;
  right: 2px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0;
  padding: 2px;
  border-radius: 3px;
  transition: opacity 0.15s;
  color: hsl(220, 10%, 50%);
  &:hover { background: hsl(0, 80%, 95%); color: hsl(0, 70%, 50%); }
`;

const LabelPicker = styled.div`
  display: flex;
  gap: 4px;
  padding: 4px 0;
`;

const LabelOption = styled.button<{ $bg: string; $selected: boolean }>`
  width: 24px;
  height: 16px;
  border-radius: 3px;
  background: ${p => p.$bg};
  border: 2px solid ${p => p.$selected ? 'hsl(220, 15%, 20%)' : 'transparent'};
  cursor: pointer;
  transition: border-color 0.1s;
`;

interface Props {
  task: Task;
  isHidden: boolean;
  onUpdate: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onUpdateLabels: (id: string, labels: string[]) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

export function TaskCard({ task, isHidden, onUpdate, onDelete, onUpdateLabels, onDragStart }: Props) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [showLabels, setShowLabels] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus();
  }, [editing]);

  const handleSave = () => {
    if (editText.trim()) onUpdate(task.id, editText.trim());
    setEditing(false);
  };

  const toggleLabel = (color: string) => {
    const labels = task.labels.includes(color)
      ? task.labels.filter(l => l !== color)
      : [...task.labels, color];
    onUpdateLabels(task.id, labels);
  };

  return (
    <Card
      draggable
      $isDragging={false}
      $isHidden={isHidden}
      onDragStart={e => onDragStart(e, task)}
      data-task-id={task.id}
    >
      <DeleteBtn data-delete onClick={() => onDelete(task.id)}><X size={12} /></DeleteBtn>
      {task.labels.length > 0 && (
        <Labels onClick={() => setShowLabels(!showLabels)}>
          {task.labels.map(c => (
            <LabelDot key={c} $color={LABEL_COLORS[c as LabelColor] || c} />
          ))}
        </Labels>
      )}
      {showLabels && (
        <LabelPicker>
          {(Object.keys(LABEL_COLORS) as LabelColor[]).map(c => (
            <LabelOption
              key={c}
              $bg={LABEL_COLORS[c]}
              $selected={task.labels.includes(c)}
              onClick={() => toggleLabel(c)}
            />
          ))}
        </LabelPicker>
      )}
      {editing ? (
        <EditInput
          ref={inputRef}
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false); }}
        />
      ) : (
        <TaskText onDoubleClick={() => { setEditing(true); setEditText(task.text); }}>
          {task.text}
        </TaskText>
      )}
      {!showLabels && task.labels.length === 0 && (
        <div style={{ marginTop: 2 }}>
          <button
            onClick={() => setShowLabels(true)}
            style={{ fontSize: 10, color: 'hsl(220,10%,60%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            + label
          </button>
        </div>
      )}
    </Card>
  );
}
