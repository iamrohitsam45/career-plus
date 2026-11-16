import mongoose from 'mongoose';
import { ENV } from './env';

// Disable operation buffering so queries fail immediately or fallback without 10s hang when DB is disconnected
mongoose.set('bufferCommands', false);

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;

  try {
    const conn = await mongoose.connect(ENV.MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log(`[Database] MongoDB connected successfully to ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(
      `[Database Warning] Could not connect to MongoDB at ${ENV.MONGODB_URI}: ${error.message}`
    );
    console.warn(`[Database Notice] Operating with fallback cache store for rapid local dev.`);
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}

export async function disconnectDB(): Promise<void> {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
  console.log('[Database] MongoDB disconnected');
}
