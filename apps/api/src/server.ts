import { createApp } from './app';
import { connectDB } from './config/db';
import { ENV } from './config/env';

async function startServer() {
  await connectDB();

  const app = createApp();

  const server = app.listen(ENV.PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 CareerPulse AI API Server listening on port ${ENV.PORT}`);
    console.log(`🌐 Base URL: http://localhost:${ENV.PORT}`);
    console.log(`✨ Environment: ${ENV.NODE_ENV}`);
    console.log(`=======================================================`);
  });

  // Graceful shutdown
  const handleExit = () => {
    console.log('\nShutting down server gracefully...');
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', handleExit);
  process.on('SIGINT', handleExit);
}

startServer().catch((err) => {
  console.error('Fatal error during server startup:', err);
  process.exit(1);
});
