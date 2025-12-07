export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

export enum TaskStatus {
    TODO = 'todo',
    INPROGRESS = 'inprogress',
    DONE = 'done',
}

export interface Task {
    _id: string;
    title: string;
    description?: string;
    userId: string;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TasksResponse {
    count: number;
    tasks: Task[];
}
