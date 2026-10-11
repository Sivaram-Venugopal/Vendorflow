import express from 'express';
import { getDevVendors } from '../controllers/devController.js';

const router = express.Router();

// Temporary dev route to verify seeded vendors
router.get('/vendors', getDevVendors);

export default router;
