import { describe, it, expect, vi, beforeEach } from 'vitest';

const { generateOTP, createOTP, verifyOTP, otps } = await import('../utils/otpStore.js');

describe('OTP Store', () => {
  beforeEach(() => {
    // Clear OTP store before each test
    for (const key of Object.keys(otps)) {
      delete otps[key];
    }
  });

  describe('generateOTP', () => {
    it('generates a 6-digit string', () => {
      const otp = generateOTP();
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('generates different OTPs on successive calls', () => {
      const results = new Set();
      for (let i = 0; i < 10; i++) {
        results.add(generateOTP());
      }
      // At least 2 unique values out of 10 (extremely unlikely to get same 10 times)
      expect(results.size).toBeGreaterThan(1);
    });
  });

  describe('createOTP', () => {
    it('stores OTP for email and returns the code', () => {
      const otp = createOTP('test@example.com');
      expect(otp).toHaveLength(6);
      expect(otps['test@example.com']).toBeDefined();
      expect(otps['test@example.com'].otp).toBe(otp);
    });

    it('sets expiry time in the future', () => {
      createOTP('test@example.com');
      expect(otps['test@example.com'].expiresAt).toBeGreaterThan(Date.now());
    });

    it('overwrites previous OTP for the same email', () => {
      const otp1 = createOTP('test@example.com');
      const otp2 = createOTP('test@example.com');
      expect(otps['test@example.com'].otp).toBe(otp2);
    });
  });

  describe('verifyOTP', () => {
    it('returns success for correct OTP', () => {
      const otp = createOTP('user@test.com');
      const result = verifyOTP('user@test.com', otp);
      expect(result.success).toBe(true);
    });

    it('deletes OTP after successful verification', () => {
      const otp = createOTP('user@test.com');
      verifyOTP('user@test.com', otp);
      expect(otps['user@test.com']).toBeUndefined();
    });

    it('returns error for wrong OTP', () => {
      createOTP('user@test.com');
      const result = verifyOTP('user@test.com', '000000');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid OTP');
    });

    it('returns error for non-existent email', () => {
      const result = verifyOTP('nonexistent@test.com', '123456');
      expect(result.success).toBe(false);
      expect(result.error).toContain('No OTP found');
    });

    it('returns error for expired OTP', () => {
      createOTP('user@test.com');
      // Manually expire the OTP
      otps['user@test.com'].expiresAt = Date.now() - 1000;
      const result = verifyOTP('user@test.com', otps['user@test.com']?.otp || '123456');
      expect(result.success).toBe(false);
      expect(result.error).toContain('expired');
    });
  });
});
