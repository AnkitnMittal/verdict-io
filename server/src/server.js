import 'dotenv/config';
import connectDB from './config/db.js';
import { app } from './app.js';

const PORT = process.env.PORT || 80;

/* Connect to MongoDB and start the server */
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed!', err);
  });
