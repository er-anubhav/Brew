"use client";

import useSWR, { mutate } from 'swr';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import TaskModal from './components/TaskModal';
import DeleteModal from './components/DeleteModal';

interface Task {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'inprogress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
}

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) {
        const error: any = new Error('An error occurred while fetching the data.');
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }
    const json = await res.json();
    return json.data.tasks.map((task: any) => ({ ...task, id: task._id }));
};

const ClientDate = ({ date }: { date: string }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!mounted) return <span className="text-transparent">Loading</span>;
    return <>{new Date(date).toLocaleDateString()}</>;
};

export default function TasksPage() {
    const [search, setSearch] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState(search);
    const [status, setStatus] = useState('all');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTask, setCurrentTask] = useState<Task | null>(null);

    // Delete Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);
        return () => clearTimeout(timer);
    }, [search]);

    const { data: tasks, error, isLoading, mutate } = useSWR<Task[]>(
        `/api/tasks?search=${debouncedSearch}${status !== 'all' ? `&status=${status}` : ''}`,
        fetcher,
        {
            onError: (err) => {
                if (err.status === 401) {
                    toast.error('Session expired. Please login again.');
                    window.location.href = '/login';
                } else {
                    toast.error(err.info?.message || 'Failed to load tasks');
                }
            }
        }
    );

    const handleCreate = () => {
        setCurrentTask(null);
        setIsModalOpen(true);
    };

    const handleEdit = (task: Task) => {
        setCurrentTask(task);
        setIsModalOpen(true);
    };

    const handleSave = async (taskData: Partial<Task>) => {
        try {
            if (taskData.id) {
                // Update
                const res = await fetch(`/api/tasks?id=${taskData.id}`, { method: 'PUT', body: JSON.stringify(taskData) });
                if (!res.ok) throw new Error('Failed to update task');
                toast.success('Task updated successfully');
            } else {
                // Create
                const res = await fetch('/api/tasks', { method: 'POST', body: JSON.stringify(taskData) });
                if (!res.ok) throw new Error('Failed to create task');
                toast.success('Task created successfully');
            }
            await mutate();
            setIsModalOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleDeleteClick = (task: Task, e: React.MouseEvent) => {
        e.stopPropagation();
        setTaskToDelete(task);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!taskToDelete) return;
        try {
            const res = await fetch(`/api/tasks?id=${taskToDelete.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete task');

            toast.success('Task deleted');
            await mutate();
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
        } catch (err) {
            toast.error('Failed to delete task');
        }
    };

    return (
        <div className="min-h-screen bg-background p-8 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/40 pb-8">
                    <div className="space-y-4">
                        <h1 className="text-4xl  md:text-5xl tracking-tight">
                            My Tasks
                        </h1>
                        <p className="text-lg text-secondary font-body max-w-md italic">
                            "Order is the sanity of the mind, the health of the body, the peace of the city."
                        </p>
                    </div>
                    <div className="flex gap-4 items-center self-start md:self-end">
                        <button
                            onClick={async () => {
                                try {
                                    await fetch('/api/logout', { method: 'POST' });
                                    toast.success('Logged out successfully');
                                    window.location.href = '/login';
                                } catch (error) {
                                    toast.error('Failed to logout');
                                }
                            }}
                            className="bg-primary text-white px-8 py-3 uppercase tracking-widest text-sm shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all rounded-none flex items-center gap-2"
                        >
                            Logout
                        </button>
                        <button
                            onClick={handleCreate}
                            className="bg-primary text-white px-8 py-3 uppercase tracking-widest text-sm shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all rounded-none flex items-center gap-2"
                        >
                            <span className="text-xl md:hidden">+</span>
                            <span className="hidden md:inline">New Task</span>
                        </button>
                    </div>
                </header>

                {/* Controls Section */}
                <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
                    <div className="relative group w-full md:max-w-md">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="peer w-full border-b-2 border-border py-2 text-primary placeholder-transparent focus:border-primary focus:outline-none transition-colors bg-transparent font-body text-lg"
                            id="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <label
                            htmlFor="search"
                            className="absolute left-0 -top-3.5 text-sm text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:text-secondary peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary font-body"
                        >
                            Search tasks
                        </label>
                        <div className="absolute right-0 top-2 pointer-events-none text-secondary">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                    </div>

                    <div className="flex gap-px bg-border/20 p-px">
                        {['all', 'todo', 'inprogress', 'done'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatus(s)}
                                className={`px-6 py-2 text-sm uppercase tracking-widest transition-all ${status === s
                                    ? 'bg-primary text-white shadow-md'
                                    : 'bg-white text-secondary hover:bg-gray-50'
                                    }`}
                            >
                                {s === 'todo' ? 'To Do' : s === 'inprogress' ? 'In Progress' : s === 'done' ? 'Done' : 'All'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Task Grid */}
                <div className="min-h-[400px]">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-black/5"></div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center p-8 border-l-4 border-red-500 bg-red-50">
                            <p className="text-red-800 font-body text-lg">Unable to load tasks at looking moment.</p>
                        </div>
                    ) : tasks?.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-32 text-center border-2 border-dashed border-border/50 bg-black/[0.02]">
                            <p className="text-secondary text-xl font-heading italic">No tasks found. Begin by creating one.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {tasks?.map((task) => (
                                <div
                                    key={task.id}
                                    onClick={() => handleEdit(task)}
                                    className="group relative bg-white p-8 border border-border/50 hover:border-primary/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer prose prose-headings:font-heading prose-p:font-body"
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>

                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <span
                                                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${task.status === 'done'
                                                    ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                                    : task.status === 'inprogress'
                                                        ? 'border-blue-200 text-blue-700 bg-blue-50'
                                                        : 'border-amber-200 text-amber-700 bg-amber-50'
                                                    }`}
                                            >
                                                {task.status === 'todo' ? 'To Do' : task.status === 'inprogress' ? 'In Progress' : 'Done'}
                                            </span>
                                            <button
                                                onClick={(e) => handleDeleteClick(task, e)}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity text-secondary hover:text-red-500"
                                                title="Delete Task"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                        <h3 className="text-2xl font-heading font-bold text-primary mb-3 line-clamp-2">
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="text-secondary text-sm font-body line-clamp-3 mb-6 leading-relaxed">
                                                {task.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 pt-6 border-t border-border/20 flex justify-between items-end">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] uppercase tracking-widest text-secondary/60 font-bold mb-1">Due Date</span>
                                            <span className="text-sm text-primary font-body font-medium italic">
                                                <ClientDate date={task.dueDate} />
                                            </span>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map((dot) => (
                                                <div key={dot} className={`w-1 h-1 rounded-none transform rotate-45 ${(task.priority === 'high' && dot <= 3) ||
                                                    (task.priority === 'medium' && dot <= 2) ||
                                                    (task.priority === 'low' && dot <= 1)
                                                    ? 'bg-primary' : 'bg-gray-200'
                                                    }`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave as any}
                task={currentTask}
            />

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title={taskToDelete?.title || ''}
            />
        </div>
    );
}
