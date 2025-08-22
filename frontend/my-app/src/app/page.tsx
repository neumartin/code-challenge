'use client';

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Task = {
  id: number;
  taskName: string;
  done: boolean;
};

export default function Home() {
  const apiBase = useMemo(() => {
    // Allow overriding via env var, fallback to backend default port 5001
    if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL!.replace(/\/$/, '');
    }
    return 'http://localhost:5001';
  }, []);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);

  const fetchTasks = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`${apiBase}/task`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data: Task[] = await res.json();
      setTasks(data);
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase]);

  const onAddTask = async () => {
    const name = window.prompt('Task name:')?.trim();
    if (!name) return;
    try {
      setCreating(true);
      setError(null);
      const res = await fetch(`${apiBase}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: name, done: false }),
      });
      if (!res.ok) throw new Error(`Create failed: ${res.status}`);
      await fetchTasks();
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    } finally {
      setCreating(false);
    }
  };

  const onToggleDone = async (task: Task) => {
    try {
      setError(null);
      const res = await fetch(`${apiBase}/task/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: !task.done }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      await fetchTasks();
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    }
  };

  const onEditName = async (task: Task) => {
    const name = window.prompt('Edit task name:', task.taskName)?.trim();
    if (!name || name === task.taskName) return;
    try {
      setError(null);
      const res = await fetch(`${apiBase}/task/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskName: name }),
      });
      if (!res.ok) throw new Error(`Update failed: ${res.status}`);
      await fetchTasks();
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    }
  };

  const onDelete = async (task: Task) => {
    const confirm = window.confirm(`Delete task "${task.taskName}"?`);
    if (!confirm) return;
    try {
      setError(null);
      const res = await fetch(`${apiBase}/task/${task.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      await fetchTasks();
    } catch (e: any) {
      setError(e?.message ?? 'Unknown error');
    }
  };

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="w-full max-w-xl">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Tasks</h1>
          <div className="mt-4 flex items-center gap-3">
            <input
              type={'button'}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md ${creating ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={onAddTask}
              disabled={creating}
              defaultValue={creating ? 'Adding…' : 'Add Task'}
            />
            <input
              type={'button'}
              className={'bg-gray-200 text-gray-900 px-3 py-2 rounded-md'}
              onClick={fetchTasks}
              defaultValue={'Refresh'}
            />
          </div>

          <div className="mt-3 text-sm text-red-600 min-h-5">{error ?? ''}</div>

          <div className="mt-2 text-muted-foreground text-sm sm:text-base w-full">
            {loading ? (
              <div>Loading…</div>
            ) : tasks.length === 0 ? (
              <div>No tasks yet. Click "Add Task" to create one.</div>
            ) : (
              <ul className="divide-y divide-gray-200 border rounded-md">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center justify-between gap-3 p-3">
                    <label className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => onToggleDone(t)}
                      />
                      <span
                        className={`flex-1 ${t.done ? 'line-through text-gray-500' : ''}`}
                        title="Click to rename"
                        onClick={() => onEditName(t)}
                        role="button"
                      >
                        {t.taskName || <em className="text-gray-400">(no name)</em>}
                      </span>
                    </label>
                    <button
                      className="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-md"
                      onClick={() => onDelete(t)}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
