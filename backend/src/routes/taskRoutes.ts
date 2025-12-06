import express, { Response, NextFunction } from 'express';
import { Task, TaskStatus, TaskPriority } from '../models';
import { authMiddleware, AuthRequest } from '../middleware/authMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createTaskSchema, updateTaskSchema } from '../validation/taskValidation';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../middleware/errorMiddleware';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /tasks - Create a new task
router.post('/', validate(createTaskSchema), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { title, description, priority, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      userId: req.user!.userId,
      priority: priority || TaskPriority.MEDIUM,
      status: status || TaskStatus.TODO,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    sendSuccess(res, {
      message: 'Task created successfully',
      task,
    }, 201);
  } catch (error) {
    next(error);
  }
});

// GET /tasks - List tasks with filtering and search
router.get('/', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, search } = req.query;

    // Build query - only user's tasks
    const query: any = { userId: req.user!.userId };

    // Filter by status
    if (status) {
      if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
        return next(new AppError('Invalid status value', 400));
      }
      query.status = status;
    }

    // Search across title and description
    if (search && typeof search === 'string') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    sendSuccess(res, {
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
});

// GET /tasks/:id - Get task by ID
router.get('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      _id: id,
      userId: req.user!.userId, // Ensure user owns the task
    });

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    sendSuccess(res, { task });
  } catch (error) {
    if ((error as any).name === 'CastError') {
      return next(new AppError('Invalid task ID', 400));
    }
    next(error);
  }
});

// PUT /tasks/:id - Update task
router.put('/:id', validate(updateTaskSchema), async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;

    // Build update object
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const task = await Task.findOneAndUpdate(
      {
        _id: id,
        userId: req.user!.userId, // Ensure user owns the task
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    sendSuccess(res, {
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    if ((error as any).name === 'CastError') {
      return next(new AppError('Invalid task ID', 400));
    }
    next(error);
  }
});

// DELETE /tasks/:id - Delete task
router.delete('/:id', async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({
      _id: id,
      userId: req.user!.userId, // Ensure user owns the task
    });

    if (!task) {
      return next(new AppError('Task not found', 404));
    }

    sendSuccess(res, {
      message: 'Task deleted successfully',
      task,
    });
  } catch (error) {
    if ((error as any).name === 'CastError') {
      return next(new AppError('Invalid task ID', 400));
    }
    next(error);
  }
});

export default router;
