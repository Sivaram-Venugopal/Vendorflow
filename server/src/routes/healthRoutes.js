import express from 'express';
import { getHealthStatus } from '../controllers/healthController.js';
import { seedDatabase } from '../utils/seed.js';

const router = express.Router();

router.get('/health', getHealthStatus);

// One-click remote seed endpoint to populate MongoDB Atlas
router.get('/seed', async (req, res) => {
  try {
    const result = await seedDatabase(false);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message,
    });
  }
});

export default router;

