import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * bcrypt cost: 2^12 rounds, about 250 ms per hash on a typical server.
 * Raise it over time as servers get faster; existing hashes keep their own cost
 * (stored in the hash) and still verify.
 */
const BCRYPT_COST = 12;

/**
 * Server secret mixed into every password before bcrypt ("pepper").
 * HMAC-SHA256 output is always 64 hex characters, which also stays under
 * bcrypt's 72-byte input limit whatever the password length.
 * Server only: NEXTAUTH_SECRET must never reach the browser.
 * Changing NEXTAUTH_SECRET invalidates every stored password hash.
 */
function pepper(password: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET is not set');
  }
  return crypto.createHmac('sha256', secret).update(password).digest('hex');
}

/**
 * Password hash for storage in USER_.PSW_HASH:
 *   bcrypt( HMAC-SHA256(NEXTAUTH_SECRET, password), cost 12 )
 * bcrypt generates a random salt and stores it in the result
 * ("$2b$12$<22-char salt><31-char hash>", 60 characters), so the same password
 * gives a different hash every time.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(pepper(password), BCRYPT_COST);
}

/**
 * Check a password against the value stored in USER_.PSW_HASH.
 * bcrypt reads the salt and cost from the stored hash and compares in constant time.
 */
export async function verifyPassword(password: string, storedHash: string | null | undefined): Promise<boolean> {
  const stored = storedHash?.trim();
  if (!stored || !stored.startsWith('$2')) {
    return false; // empty or not a bcrypt hash
  }
  return bcrypt.compare(pepper(password), stored);
}

/**
 * Value stored in Session.sessionToken for a session id: SHA-256 (64 hex characters).
 * The clear session id only exists inside the encrypted NextAuth cookie, so reading the
 * Session table (backup, dump) gives nothing that can be turned into a working cookie.
 * A session id is a random UUID (122 random bits): it can't be guessed or recovered from
 * its hash, so no salt or slow hash is needed, and lookups stay instant.
 */
export function hashSessionToken(sessionId: string): string {
  return crypto.createHash('sha256').update(sessionId).digest('hex');
}
