import * as crypto from 'crypto';

/** @deprecated legacy unsalted hash, kept to check existing USER_.PSW_HASH values */
export function createSHA256Hash(inputString: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex'); // 'hex' for hexadecimal representation
}

/** Prefix of the salted SHA-256 format, to tell it apart from legacy 64-hex hashes. */
export const SALTED_SHA256_PREFIX = 'sha256s$';

/**
 * Per-user salt derived from USER_.ID.
 * The id is trimmed and upper-cased, so "ali", "ALI " and "Ali" give the same salt.
 */
export function passwordSalt(userId: string): string {
  return createSHA256Hash(userId.trim().toUpperCase());
}

/**
 * Salted and peppered SHA-256 password hash, for storage in USER_.PSW_HASH:
 *   "sha256s$" + HMAC-SHA256(key = NEXTAUTH_SECRET, data = salt + password)
 *
 * Server only: NEXTAUTH_SECRET must never reach the browser.
 * Changing NEXTAUTH_SECRET invalidates every hash produced by this function.
 */
export function createSaltedSHA256Hash(userId: string, password: string): string {
  const pepper = process.env.NEXTAUTH_SECRET;
  if (!pepper) {
    throw new Error('NEXTAUTH_SECRET is not set');
  }

  const hash = crypto
    .createHmac('sha256', pepper)
    .update(passwordSalt(userId) + password)
    .digest('hex');

  return SALTED_SHA256_PREFIX + hash;
}
