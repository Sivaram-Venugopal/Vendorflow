import jwt from 'jsonwebtoken';

/**
 * Generate a signed JWT containing { id, role } claims
 * and set it as an httpOnly cookie on the response.
 *
 * @param {Object} res - Express response object
 * @param {Object} user - User document containing _id and role
 * @returns {String} token - The signed JWT string
 */
export const generateTokenAndSetCookie = (res, user) => {
  const secret = process.env.JWT_SECRET || 'vendorflow_dev_secret_fallback';
  const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    secret,
    {
      expiresIn,
    }
  );

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('token', token, {
    httpOnly: true, // Prevents client-side JavaScript access (mitigates XSS)
    secure: isProduction, // HTTPS only in production
    sameSite: isProduction ? 'strict' : 'lax', // CSRF protection
    maxAge: 60 * 60 * 1000, // 1 hour in ms (short-lived access token)
  });

  return token;
};
