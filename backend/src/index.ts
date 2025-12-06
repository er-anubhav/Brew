import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorMiddleware';

// Load environment variables first
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: ${envVar} environment variable is required`);
    process.exit(1);
  }
}

const app = express();

// Get configuration from environment variables
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const CORS_ORIGIN_WEB = process.env.CORS_ORIGIN_WEB;
const CORS_ORIGIN_MOBILE = process.env.CORS_ORIGIN_MOBILE;

// Security middleware - Helmet for security headers
app.use(helmet());

// CORS configuration with allowed origins
const allowedOrigins = [CORS_ORIGIN_WEB, CORS_ORIGIN_MOBILE].filter(Boolean);

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, Postman, curl, etc.)
      if (!origin) return callback(null, true);
      
      // Allow if origin is in the allowed list
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // In development, allow all origins
        if (NODE_ENV === 'development') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ 
    success: true, 
    data: { 
      message: 'Backend API is running',
      environment: NODE_ENV,
      version: '1.0.0'
    } 
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handler - must be last
app.use(errorHandler);

// Connect to database and start server
const startServer = async (): Promise<void> => {
  try {
    // Connect to MongoDB first
    console.log('Connecting to database...');
    await connectDB();
    console.log('Database connected successfully');
    
    // Start server only after successful database connection
    app.listen(PORT, () => {
      console.log(`✓ Server is running on port ${PORT}`);
      console.log(`✓ Environment: ${NODE_ENV}`);
      console.log(`✓ CORS enabled for: ${allowedOrigins.join(', ') || 'all origins (dev mode)'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Promise Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
