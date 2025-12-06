"use client";

import { useState, useEffect } from 'react';

interface Task {
    id?: string;
    title: string;
    description: string;
    status: 'todo' | 'inprogress' | 'done';
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
}

interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
    task?: Task | null;
}

export default function TaskModal({ isOpen, onClose, onSave, task }: TaskModalProps) {
    const [formData, setFormData] = useState<Task>({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (task) {
            setFormData(task);
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'todo',
                priority: 'medium',
                dueDate: new Date().toISOString().split('T')[0]
            });
        }
    }, [task, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Format date to ISO string for backend validation
        const formattedTask = {
            ...formData,
            dueDate: new Date(formData.dueDate).toISOString()
        };
        onSave(formattedTask);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/80 backdrop-blur-md transition-opacity">
            <div className="bg-white border border-border shadow-2xl w-full max-w-lg p-10 transform transition-all scale-100">
                <div className="flex justify-between items-center mb-8 border-b border-border/40 pb-4">
                    <h2 className="text-3xl font-heading font-bold text-primary">
                        {task ? 'Edit Task' : 'New Task'}
                    </h2>
                    <button onClick={onClose} className="text-secondary hover:text-primary transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="group relative">
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="peer w-full border-b-2 border-border py-2 text-primary placeholder-transparent focus:border-primary focus:outline-none transition-colors bg-transparent font-body text-lg"
                            placeholder="Title"
                            id="title"
                        />
                        <label
                            htmlFor="title"
                            className="absolute left-0 -top-3.5 text-sm text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:text-secondary peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary font-body"
                        >
                            Title
                        </label>
                    </div>

                    <div className="group relative">
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="peer w-full border-b-2 border-border py-2 text-primary placeholder-transparent focus:border-primary focus:outline-none transition-colors bg-transparent font-body text-base resize-none"
                            placeholder="Description"
                            id="description"
                        />
                        <label
                            htmlFor="description"
                            className="absolute left-0 -top-3.5 text-sm text-secondary transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-2 peer-placeholder-shown:text-secondary peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-primary font-body"
                        >
                            Description
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full border-b-2 border-border bg-transparent py-2 text-primary font-body focus:border-primary focus:outline-none appearance-none rounded-none"
                            >
                                <option value="todo">To Do</option>
                                <option value="inprogress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Priority</label>
                            <select
                                value={formData.priority}
                                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                className="w-full border-b-2 border-border bg-transparent py-2 text-primary font-body focus:border-primary focus:outline-none appearance-none rounded-none"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-3">Due Date</label>
                        <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full border-b-2 border-border bg-transparent py-2 text-primary font-body focus:border-primary focus:outline-none rounded-none"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-8 py-3 bg-primary text-white uppercase tracking-widest text-xs shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-8 py-3 bg-primary text-white uppercase tracking-widest text-xs shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
                        >
                            Save Task
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
