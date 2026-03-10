const API_BASE = import.meta.env.VITE_API_URL;

export interface ApiTask {
  _id: string;
  title: string;
  date: string;
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function fetchTasks(): Promise<ApiTask[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTaskApi(data: { title: string; date: string; order: number }): Promise<ApiTask> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function updateTaskApi(id: string, data: Partial<{ title: string; date: string; order: number }>): Promise<ApiTask> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function deleteTaskApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete task');
}
