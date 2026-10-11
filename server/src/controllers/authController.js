import asyncHandler from '../utils/asyncHandler.js';
import { User, AuditLog } from '../models/index.js';
import { generateTokenAndSetCookie } from '../utils/jwt.js';

/**
 * @desc    Register a new user (Admin, Buyer, or Vendor)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, department } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please provide name, email, and password');
  }

  // Check if email already registered
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(409);
    throw new Error('A user with this email address already exists');
  }

  // Validate allowed roles
  const allowedRoles = ['Admin', 'Buyer', 'Vendor'];
  const userRole = role && allowedRoles.includes(role) ? role : 'Buyer';

  // Create user (password hashed automatically in pre-save hook)
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: userRole,
    phone: phone || '',
    department: department || (userRole === 'Vendor' ? 'Vendor Relations' : 'Procurement'),
  });

  // Generate JWT & set httpOnly cookie
  const token = generateTokenAndSetCookie(res, user);

  // Record audit log
  await AuditLog.create({
    user: user._id,
    action: 'USER_LOGIN',
    entityType: 'User',
    entityId: user._id,
    details: { event: 'USER_REGISTERED', role: user.role, email: user.email },
    ipAddress: req.ip || '',
    userAgent: req.headers['user-agent'] || '',
  });

  res.status(201).json({
    status: 'success',
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token, // Also return in body for Authorization header interceptors
    },
  });
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Check user and explicitly include password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Account deactivated: Please contact administrator');
  }

  // Generate JWT & set httpOnly cookie
  const token = generateTokenAndSetCookie(res, user);

  // Record audit log
  await AuditLog.create({
    user: user._id,
    action: 'USER_LOGIN',
    entityType: 'User',
    entityId: user._id,
    details: { event: 'USER_LOGGED_IN', role: user.role },
    ipAddress: req.ip || '',
    userAgent: req.headers['user-agent'] || '',
  });

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
      },
      token,
    },
  });
});

/**
 * @desc    Log out user & clear httpOnly cookie
 * @route   POST /api/auth/logout
 * @access  Public
 */
export const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0), // Expire immediately
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
});

/**
 * @desc    Get currently authenticated user profile
 * @route   GET /api/auth/me
 * @access  Private (authMiddleware)
 */
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        phone: req.user.phone,
        department: req.user.department,
        createdAt: req.user.createdAt,
      },
    },
  });
});
