import { useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/calendar';
import { fetchTasks, createTaskApi, updateTaskApi, deleteTaskApi, ApiTask } from '@/services/taskApi';

const LABELS_KEY = 'calendar-task-labels';

function loadLabels(): Record<string, string[]> {
  try {
    const data = localStorage.getItem(LABELS_KEY);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

function saveLabels(labels: Record<string, string[]>) {
  localStorage.setItem(LABELS_KEY, JSON.stringify(labels));
}

function apiToTask(api: ApiTask, labels: Record<string, string[]>): Task {
  return {
    id: api._id,
    text: api.title,
    date: api.date,
    order: api.order,
    labels: labels[api._id] || [],
  };
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [labelsMap, setLabelsMap] = useState<Record<string, string[]>>(loadLabels);

  // Load tasks from API on mount
  useEffect(() => {
    fetchTasks()
      .then(apiTasks => {
        const labels = loadLabels();
        setTasks(apiTasks.map(t => apiToTask(t, labels)));
      })
      .catch(err => console.error('Failed to load tasks:', err));
  }, []);

  // Persist labels to localStorage
  useEffect(() => {
    saveLabels(labelsMap);
  }, [labelsMap]);

  const addTask = useCallback(async (date: string, text: string, labels: string[] = []) => {
    const dateTasks = tasks.filter(t => t.date === date);
    const order = dateTasks.length;
    try {
      const created = await createTaskApi({ title: text, date, order });
      const task: Task = { id: created._id, text: created.title, date: created.date, order: created.order, labels };
      setTasks(prev => [...prev, task]);
      if (labels.length > 0) {
        setLabelsMap(prev => ({ ...prev, [created._id]: labels }));
      }
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  }, [tasks]);

  const updateTask = useCallback(async (id: string, text: string) => {
    try {
      await updateTaskApi(id, { title: text });
      setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t));
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    try {
      await deleteTaskApi(id);
      setTasks(prev => prev.filter(t => t.id !== id));
      setLabelsMap(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  }, []);

  const moveTask = useCallback(async (taskId: string, newDate: string, newOrder: number) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (!task) return prev;

      const oldDate = task.date;
      let updated = prev.map(t => t.id === taskId ? { ...t, date: newDate } : t);

      const targetTasks = updated
        .filter(t => t.date === newDate)
        .sort((a, b) => a.order - b.order);

      const movedTask = targetTasks.find(t => t.id === taskId)!;
      const withoutMoved = targetTasks.filter(t => t.id !== taskId);
      withoutMoved.splice(newOrder, 0, movedTask);

      const orderMap = new Map<string, number>();
      withoutMoved.forEach((t, i) => orderMap.set(t.id, i));

      if (oldDate !== newDate) {
        const oldTasks = updated
          .filter(t => t.date === oldDate)
          .sort((a, b) => a.order - b.order);
        oldTasks.forEach((t, i) => orderMap.set(t.id, i));
      }

      const result = updated.map(t => orderMap.has(t.id) ? { ...t, order: orderMap.get(t.id)! } : t);

      // Sync changed tasks to API
      result.forEach(t => {
        const original = prev.find(o => o.id === t.id);
        if (original && (original.date !== t.date || original.order !== t.order)) {
          updateTaskApi(t.id, { date: t.date, order: t.order }).catch(err =>
            console.error('Failed to sync task move:', err)
          );
        }
      });

      return result;
    });
  }, []);

  const updateTaskLabels = useCallback((id: string, labels: string[]) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, labels } : t));
    setLabelsMap(prev => ({ ...prev, [id]: labels }));
  }, []);

  return { tasks, addTask, updateTask, deleteTask, moveTask, updateTaskLabels };
}
