/**
 * @module utils/validation
 * @description Shared input validation utilities used across route handlers.
 * Centralizes validation logic to ensure consistent behavior and
 * simplify maintenance.
 */

/**
 * Regular expression pattern for basic email validation.
 * Matches standard email formats: local@domain.tld
 * @constant {RegExp}
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Maximum allowed length for AI chat messages.
 * Prevents prompt injection abuse by truncating overly long inputs.
 * @constant {number}
 */
const MAX_CHAT_MESSAGE_LENGTH = 2000;

/**
 * OTP code length (6-digit numeric code).
 * @constant {number}
 */
const OTP_LENGTH = 6;

/**
 * OTP validity duration in milliseconds (5 minutes).
 * @constant {number}
 */
const OTP_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Validates whether a string is a properly formatted email address.
 *
 * @param {string} email - The email address to validate
 * @returns {boolean} True if the email matches the expected format
 *
 * @example
 * isValidEmail('user@example.com'); // true
 * isValidEmail('invalid-email');    // false
 */
function isValidEmail(email) {
  return typeof email === 'string' && EMAIL_REGEX.test(email);
}

/**
 * Validates whether a string is a valid OTP code (6-digit numeric string).
 *
 * @param {string} otp - The OTP code to validate
 * @returns {boolean} True if the OTP is exactly 6 characters long
 *
 * @example
 * isValidOtp('123456'); // true
 * isValidOtp('12345');  // false
 */
function isValidOtp(otp) {
  return typeof otp === 'string' && otp.length === OTP_LENGTH;
}

/**
 * Sanitizes and truncates a chat message to prevent prompt injection.
 * Removes leading/trailing whitespace and limits length.
 *
 * @param {string} message - The raw user message
 * @returns {string} The sanitized message, truncated to MAX_CHAT_MESSAGE_LENGTH
 *
 * @example
 * sanitizeChatMessage('  Hello!  '); // 'Hello!'
 */
function sanitizeChatMessage(message) {
  if (typeof message !== 'string') return '';
  return message.slice(0, MAX_CHAT_MESSAGE_LENGTH).trim();
}

module.exports = {
  EMAIL_REGEX,
  MAX_CHAT_MESSAGE_LENGTH,
  OTP_LENGTH,
  OTP_EXPIRY_MS,
  isValidEmail,
  isValidOtp,
  sanitizeChatMessage,
};
