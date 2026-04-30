import { describe, it, expect, beforeEach } from 'vitest';

const { rateLimit, rateLimitMap } = await import('../middleware/rateLimit.js');

/**
 * Creates mock Express req/res/next objects for testing middleware.
 */
function createMocks(ip = '127.0.0.1') {
  const req = { ip, connection: { remoteAddress: ip } };
  const res = {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
  const next = vi.fn();
  return { req, res, next };
}

describe('Rate Limit Middleware', () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it('allows requests under the limit', () => {
    const { req, res, next } = createMocks();
    rateLimit(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('allows up to 5 requests per IP', () => {
    for (let i = 0; i < 5; i++) {
      const { req, res, next } = createMocks('10.0.0.1');
      rateLimit(req, res, next);
      expect(next).toHaveBeenCalled();
    }
  });

  it('blocks the 6th request from the same IP', () => {
    // Make 5 allowed requests
    for (let i = 0; i < 5; i++) {
      const { req, res, next } = createMocks('10.0.0.2');
      rateLimit(req, res, next);
    }
    // 6th should be blocked
    const { req, res, next } = createMocks('10.0.0.2');
    rateLimit(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(429);
    expect(res.body.error).toContain('Too many requests');
  });

  it('allows requests from different IPs independently', () => {
    // Fill rate limit for IP1
    for (let i = 0; i < 5; i++) {
      const { req, res, next } = createMocks('10.0.0.3');
      rateLimit(req, res, next);
    }
    // IP2 should still be allowed
    const { req, res, next } = createMocks('10.0.0.4');
    rateLimit(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
