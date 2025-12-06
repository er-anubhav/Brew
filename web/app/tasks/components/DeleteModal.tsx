"use client";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
}

export default function DeleteModal({ isOpen, onClose, onConfirm, title }: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-white/80 backdrop-blur-md transition-opacity">
            <div className="bg-white border border-border shadow-2xl w-full max-w-sm p-8 transform transition-all scale-100 text-center">
                <div className="mb-6 flex justify-center">
                    <div className="w-16 h-16 border border-red-200 bg-red-50 flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-heading font-bold text-primary mb-3">
                    Delete Task?
                </h2>

                <p className="text-secondary text-sm font-body mb-8 px-4 leading-relaxed">
                    Are you sure you want to delete <span className="font-bold text-primary">"{title}"</span>? This action cannot be undone.
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onClose}
                        className="flex-1 px-6 py-3 border border-border text-secondary uppercase tracking-widest text-xs hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-6 py-3 bg-red-600 text-white uppercase tracking-widest text-xs shadow-lg hover:bg-red-700 hover:shadow-xl transition-all"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
