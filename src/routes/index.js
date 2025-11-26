const express = require('express');
const authRoutes = require('./auth');
const checkoutRoutes = require('./checkout');
const healthRoutes = require('./health');

const router = express.Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/health', healthRoutes);

// Root endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'E-commerce REST API',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /auth/register',
        login: 'POST /auth/login'
      },
      checkout: {
        checkout: 'POST /checkout (requires authentication)'
      },
      health: {
        health: 'GET /health'
      },
      docs: {
        swagger: 'GET /api-docs'
      }
    }
  });
});

module.exports = router;
