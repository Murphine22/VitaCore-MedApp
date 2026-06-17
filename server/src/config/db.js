import mongoose from 'mongoose';
import { env } from './env.js';

mongoose.set('strictQuery', true);

export async function connectDB(uri = env.mongoUri) {
  const conn = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
  });
  return conn;
}

export async function disconnectDB() {
  await mongoose.connection.close();
}
