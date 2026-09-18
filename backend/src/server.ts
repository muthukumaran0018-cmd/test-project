import http from 'http';
import app from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { initializeSocketIO } from './sockets/index.js';
import { logger } from './config/logger.js';

const startServer = async () => {
  try {
    // 1. Connect to MongoDB Atlas
    await connectDatabase();

    // 2. Create HTTP Server & Attach Socket.IO
    const server = http.createServer(app);
    initializeSocketIO(server);

    // 3. Start Server Listening
    const PORT = parseInt(env.PORT, 10) || 5000;
    server.listen(PORT, () => {
      logger.info(`🚀 TripSecure AI Backend Server running in [${env.NODE_ENV}] mode on http://localhost:${PORT}`);
      logger.info(`📚 Swagger Interactive API Documentation: http://localhost:${PORT}/api-docs`);
      logger.info(`⚡ Socket.IO Real-Time Engine Active`);
    });

    // Graceful Shutdown
    const shutdown = (signal: string) => {
      logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
      server.close(() => {
        logger.info('HTTP server closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
