import mongoose from 'mongoose';

/**
 * Controller to check backend API and MongoDB database health status
 * @route   GET /api/health
 * @access  Public
 */
export const getHealthStatus = async (req, res) => {
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const dbReadyState = mongoose.connection.readyState;
  const dbStatus = dbStateMap[dbReadyState] || 'unknown';
  const isHealthy = dbReadyState === 1;

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    service: 'VendorFlow API',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      name: mongoose.connection.name || 'vendorflow',
      host: mongoose.connection.host || 'unknown',
    },
    environment: process.env.NODE_ENV || 'development',
  });
};
