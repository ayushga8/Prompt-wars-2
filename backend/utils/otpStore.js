/**
 * @module utils/otpStore
 * @description In-memory OTP storage with automatic expiry cleanup.
 * Provides methods to create, verify, and manage one-time passwords
 * for email-based authentication.
 */

const { OTP_EXPIRY_MS } = require('./validation');

/** @constant {number} OTP_CLEANUP_INTERVAL_MS - Interval for purging expired OTPs (10 minutes) */
const OTP_CLEANUP_INTERVAL_MS = 10 * 60 * 1000;

/**
 * In-memory store mapping email addresses to OTP records.
 * @type {Object<string, {otp: string, expiresAt: number}>}
 */
const otps = {};

/**
 * Generates a cryptographically simple 6-digit OTP string.
 * Uses Math.random() which is sufficient for email verification
 * (not for security-critical tokens).
 *
 * @returns {string} A 6-digit numeric string (e.g., "482301")
 *
 * @example
 * const otp = generateOTP(); // "748293"
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Stores a new OTP for the given email address with an expiry timestamp.
 * Overwrites any existing OTP for the same email.
 *
 * @param {string} email - The email address to associate the OTP with
 * @returns {string} The generated OTP code
 */
function createOTP(email) {
  const otp = generateOTP();
  otps[email] = { otp, expiresAt: Date.now() + OTP_EXPIRY_MS };
  return otp;
}

/**
 * Verifies an OTP for the given email address.
 * Deletes the OTP record on successful verification or expiry.
 *
 * @param {string} email - The email address to verify against
 * @param {string} otp - The OTP code provided by the user
 * @returns {{success: boolean, error?: string}} Verification result
 *
 * @example
 * const result = verifyOTP('user@example.com', '123456');
 * if (result.success) { // grant access }
 */
function verifyOTP(email, otp) {
  const record = otps[email];
  if (!record) {
    return { success: false, error: 'No OTP found for this email' };
  }
  if (Date.now() > record.expiresAt) {
    delete otps[email];
    return { success: false, error: 'OTP has expired' };
  }
  if (record.otp === otp) {
    delete otps[email];
    return { success: true };
  }
  return { success: false, error: 'Invalid OTP' };
}

/**
 * Starts a periodic cleanup timer that removes expired OTP entries
 * to prevent memory leaks in long-running server processes.
 */
function startOtpCleanup() {
  setInterval(() => {
    const now = Date.now();
    for (const email of Object.keys(otps)) {
      if (now > otps[email].expiresAt) {
        delete otps[email];
      }
    }
  }, OTP_CLEANUP_INTERVAL_MS);
}

module.exports = { generateOTP, createOTP, verifyOTP, startOtpCleanup, otps };
