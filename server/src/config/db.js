import mongoose from 'mongoose';
import { seedAdmin } from '../seeds/seedAdmin.js';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in .env file.');
    }

    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`\n MongoDB connected! Host: ${connectionInstance.connection.host}`);

    await seedAdmin();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
