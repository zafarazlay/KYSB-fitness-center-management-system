/**
 * Main Express Server
 * Application entry point
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';

import config from './config/config.js';
import { errorHandler, notFoundHandler, asyncHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: config.frontend.url,
    methods: ['GET', 'POST'],
  },
});

// ===========================
// Middleware
// ===========================

// Security Middleware
app.use(helmet());
app.use(cors({ origin: config.frontend.url }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Logging
app.use(morgan('combined'));

// Static Files
app.use('/uploads', express.static('uploads'));

// ===========================
// API Routes
// ===========================

app.use('/api/auth', authRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// ===========================
// Error Handling
// ===========================

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ===========================
// Socket.IO Events
// ===========================

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Export io for use in other modules
export { io };

// ===========================
// Start Server
// ===========================

const PORT = config.app.port || 5000;

server.listen(PORT, () => {
  console.log(`
    ╔════════════════════════════════════════════════╗
    ║                                                ║
    ║    KYSB Fitness Center Management System      ║
    ║    Backend Server Started Successfully        ║
    ║                                                ║
    ║    Server running on: http://localhost:${PORT}   ║
    ║    Environment: ${config.app.env}                    ║
    ║                                                ║
    ╚════════════════════════════════════════════════╝
  `);
});

export default app;
