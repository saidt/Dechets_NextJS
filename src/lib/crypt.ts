import * as crypto from 'crypto';

/** @deprecated legacy unsalted hash, kept to check existing USER_.PSW_HASH values */
export function createSHA256Hash(inputString: string): string {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex'); // 'hex' for hexadecimal representation
}

/**
 * Per-user salt derived from USER_.ID.
 * The id is trimmed and upper-cased, so "ali", "ALI " and "Ali" give the same salt.
 */
export function passwordSalt(userId: string): string {
  return createSHA256Hash(userId.trim().toUpperCase());
}

/**
 * Salted and peppered SHA-256 password hash, for storage in USER_.PSW_HASH
 * (64 hex characters):
 *   HMAC-SHA256(key = NEXTAUTH_SECRET, data = salt + password)
 *
 * Server only: NEXTAUTH_SECRET must never reach the browser.
 * Changing NEXTAUTH_SECRET invalidates every hash produced by this function.
 */
export function createSaltedSHA256Hash(userId: string, password: string): string {
  const pepper = process.env.NEXTAUTH_SECRET;
  if (!pepper) {
    throw new Error('NEXTAUTH_SECRET is not set');
  }

  return crypto
    .createHmac('sha256', pepper)
    .update(passwordSalt(userId) + password)
    .digest('hex');
}

/**
 * Check a password against the value stored in USER_.PSW_HASH, using the salted
 * SHA-256 routine. Constant-time comparison, so a wrong password takes the same
 * time to reject whatever its content.
 */
export function verifyPassword(userId: string, password: string, storedHash: string | null | undefined): boolean {
  if (!storedHash) {
    return false;
  }

  const candidate = Buffer.from(createSaltedSHA256Hash(userId, password), 'hex');
  const stored = Buffer.from(storedHash.trim(), 'hex');

  // timingSafeEqual requires equal lengths; a malformed stored value never matches
  if (candidate.length !== stored.length) {
    return false;
  }

  return crypto.timingSafeEqual(candidate, stored);
}
