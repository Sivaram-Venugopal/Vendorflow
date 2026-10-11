import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  console.log('----------------------------------------------------');
  console.log('🚀 Starting VendorFlow Procurement Portal Backend...');
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);

  // Connect to MongoDB
  await connectDB();

  // Start HTTP Listener
  app.listen(PORT, () => {
    console.log(`🌐 Server running and listening on port http://localhost:${PORT}`);
    console.log(`🩺 Health check ready at: http://localhost:${PORT}/api/health`);
    console.log('----------------------------------------------------');
  });
};

startServer();
