import { describe, it, expect } from 'vitest';

// Use dynamic import for CJS modules
const { isValidEmail, isValidOtp, sanitizeChatMessage, OTP_EXPIRY_MS } = await import('../utils/validation.js');

describe('Validation Utils', () => {
  describe('isValidEmail', () => {
    it('accepts valid emails', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@domain.co.in')).toBe(true);
      expect(isValidEmail('a@b.c')).toBe(true);
    });

    it('rejects invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('not-an-email')).toBe(false);
      expect(isValidEmail('missing@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('has spaces@domain.com')).toBe(false);
    });

    it('rejects non-string values', () => {
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
      expect(isValidEmail(123)).toBe(false);
    });
  });

  describe('isValidOtp', () => {
    it('accepts valid 6-digit OTP', () => {
      expect(isValidOtp('123456')).toBe(true);
      expect(isValidOtp('000000')).toBe(true);
    });

    it('rejects invalid OTPs', () => {
      expect(isValidOtp('12345')).toBe(false);
      expect(isValidOtp('1234567')).toBe(false);
      expect(isValidOtp('')).toBe(false);
    });

    it('rejects non-string values', () => {
      expect(isValidOtp(123456)).toBe(false);
      expect(isValidOtp(null)).toBe(false);
    });
  });

  describe('sanitizeChatMessage', () => {
    it('trims whitespace', () => {
      expect(sanitizeChatMessage('  hello  ')).toBe('hello');
    });

    it('truncates to max length', () => {
      const longMsg = 'a'.repeat(3000);
      expect(sanitizeChatMessage(longMsg).length).toBe(2000);
    });

    it('handles non-string input', () => {
      expect(sanitizeChatMessage(null)).toBe('');
      expect(sanitizeChatMessage(undefined)).toBe('');
      expect(sanitizeChatMessage(123)).toBe('');
    });
  });

  describe('Constants', () => {
    it('OTP_EXPIRY_MS is 5 minutes', () => {
      expect(OTP_EXPIRY_MS).toBe(5 * 60 * 1000);
    });
  });
});
