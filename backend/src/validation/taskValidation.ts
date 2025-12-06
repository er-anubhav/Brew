import { z } from 'zod';
import { TaskPriority, TaskStatus } from '../models';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional(),
  priority: z
    .nativeEnum(TaskPriority, {
      message: 'Priority must be one of: low, medium, high',
    })
    .optional(),
  status: z
    .nativeEnum(TaskStatus, {
      message: 'Status must be one of: todo, inprogress, done',
    })
    .optional(),
  dueDate: z
    .string()
    .datetime({ message: 'Invalid date format' })
    .or(z.date())
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .max(1000, 'Description must be less than 1000 characters')
    .trim()
    .optional()
    .nullable(),
  priority: z
    .nativeEnum(TaskPriority, {
      message: 'Priority must be one of: low, medium, high',
    })
    .optional(),
  status: z
    .nativeEnum(TaskStatus, {
      message: 'Status must be one of: todo, inprogress, done',
    })
    .optional(),
  dueDate: z
    .string()
    .datetime({ message: 'Invalid date format' })
    .or(z.date())
    .optional()
    .nullable(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
