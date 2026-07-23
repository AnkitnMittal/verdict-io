import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in .env file.');
    }

    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/verdictio`);
    console.log(`\n MongoDB connected! Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
