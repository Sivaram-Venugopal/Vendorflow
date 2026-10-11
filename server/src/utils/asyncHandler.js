/**
 * Wrapper for asynchronous Express route handlers to catch exceptions
 * and pass them to next(error) without needing repetitive try/catch blocks.
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
