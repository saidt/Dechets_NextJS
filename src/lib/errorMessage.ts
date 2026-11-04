/**
 * Message to show the user for an error thrown in an API route.
 *
 * Prisma wraps database errors in a long technical message, e.g.
 *   Invalid `prisma.$queryRaw()` invocation: Raw query failed. Code: `EREQUEST`.
 *   Message: `La date de la pièce n'est pas dans la période correcte`
 * Return only the database message (here: La date de la pièce n'est pas dans la
 * période correcte). The full error should still be logged with logError.
 */
export function getErrorMessage(err: unknown): string {
  if (!(err instanceof Error)) {
    return String(err);
  }

  const msg = err.message;

  // Raw query / database errors coming from the driver (Prisma P2010, P2039)
  const dbMessage = msg.match(/Message: `([\s\S]*)`\s*$/);
  if (dbMessage && dbMessage[1].trim()) {
    return dbMessage[1].trim();
  }

  // Other Prisma client errors: keep what follows "Invalid `prisma.x()` invocation:"
  const invocation = msg.match(/invocation:\s*([\s\S]*)$/);
  if (invocation && invocation[1].trim()) {
    return invocation[1].trim();
  }

  return msg;
}
