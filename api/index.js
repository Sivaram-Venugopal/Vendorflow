import app from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Vercel Serverless API Error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to connect to database or execute handler',
      details: error.message,
    });
  }
}
