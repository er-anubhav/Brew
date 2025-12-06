import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { validate } from '../middleware/validateMiddleware';
import { signupSchema, loginSchema } from '../validation/authValidation';
import { sendSuccess, sendError } from '../utils/response';
import { AppError } from '../middleware/errorMiddleware';

const router = express.Router();

// POST /auth/signup
router.post('/signup', validate(signupSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists', 409));
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await User.create({
      email,
      passwordHash,
    });

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    sendSuccess(res, {
      message: 'User created successfully',
      token,
      user: {
        userId: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    }, 201);
  } catch (error) {
    next(error);
  }
});

// POST /auth/login
router.post('/login', validate(loginSchema), async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return next(new AppError('Invalid email or password', 401));
    }

    // Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email },
      jwtSecret,
      { expiresIn: '7d' }
    );

    sendSuccess(res, {
      message: 'Login successful',
      token,
      user: {
        userId: user._id,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
