import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import { User } from '../models/index.js';

/**
 * Authentication Middleware:
 * Verifies JWT from httpOnly cookie or Authorization Bearer header.
 * Attaches authenticated user document to req.user.
 */
export const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check httpOnly cookie first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // 2. Fall back to Authorization: Bearer <token>
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized: No authentication token provided');
  }

  try {
    const secret = process.env.JWT_SECRET || 'vendorflow_dev_secret_fallback';
    const decoded = jwt.verify(token, secret);

    // Verify user exists and is active
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      res.status(401);
      throw new Error('Not authorized: User no longer exists');
    }

    if (!user.isActive) {
      res.status(403);
      throw new Error('Account deactivated: Contact system administrator');
    }

    req.user = user;
    next();
  } catch (error) {
    if (res.statusCode === 200) {
      res.status(401);
    }
    throw new Error(
      error.name === 'TokenExpiredError'
        ? 'Not authorized: Token has expired'
        : 'Not authorized: Invalid token signature'
    );
  }
});

/**
 * Role-Based Access Control Middleware:
 * Restricts access to specified roles based on authenticated user claims.
 *
 * @param  {...string} roles - Permitted roles ('Admin', 'Buyer', 'Vendor')
 */
export const roleMiddleware = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('Not authorized: User context missing'));
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(
          `Forbidden: Role '${req.user.role}' is not authorized to access this resource`
        )
      );
    }

    next();
  };
};

export const protect = authMiddleware;
export const authorizeRoles = roleMiddleware;
