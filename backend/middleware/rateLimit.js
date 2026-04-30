/**
 * @module middleware/rateLimit
 * @description In-memory rate limiting middleware to prevent abuse on sensitive endpoints.
 * Tracks request timestamps per IP address and enforces a configurable
 * maximum number of requests within a sliding time window.
 */

/** @constant {number} RATE_LIMIT_WINDOW_MS - Sliding window duration in milliseconds (1 minute) */
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

/** @constant {number} RATE_LIMIT_MAX_REQUESTS - Maximum requests allowed per IP per window */
const RATE_LIMIT_MAX_REQUESTS = 5;

/** @constant {number} CLEANUP_INTERVAL_MS - Interval for cleaning expired entries (5 minutes) */
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

/**
 * In-memory store mapping IP addresses to arrays of request timestamps.
 * @type {Map<string, number[]>}
 */
const rateLimitMap = new Map();

/**
 * Express middleware that enforces per-IP rate limiting.
 * Returns HTTP 429 if the client exceeds the allowed number of requests
 * within the configured time window.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next middleware function
 * @returns {void}
 */
function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }

  // Remove timestamps outside the current window
  const timestamps = rateLimitMap.get(ip).filter(t => t > windowStart);
  rateLimitMap.set(ip, timestamps);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a minute.' });
  }

  timestamps.push(now);
  next();
}

/**
 * Periodically purges expired entries from the rate limit map
 * to prevent unbounded memory growth in long-running processes.
 */
function startCleanupTimer() {
  setInterval(() => {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;
    for (const [ip, timestamps] of rateLimitMap.entries()) {
      const valid = timestamps.filter(t => t > windowStart);
      if (valid.length === 0) {
        rateLimitMap.delete(ip);
      } else {
        rateLimitMap.set(ip, valid);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}

module.exports = { rateLimit, startCleanupTimer, rateLimitMap };
