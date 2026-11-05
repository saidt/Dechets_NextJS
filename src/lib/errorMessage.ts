/**
 * Message to send to the browser for an error thrown in an API route:
 * - the database's own message when there is one (SQL Server errors raised through
 *   Prisma), e.g. "La date de la pièce n'est pas dans la période correcte";
 * - otherwise the error's own message.
 * The full error should still be logged with logError.
 */
export function getErrorMessage(err: unknown): string {
  if (!(err instanceof Error)) {
    return String(err);
  }

  // Database error through the Prisma driver adapter: the original SQL Server message
  const original = (err as { meta?: { driverAdapterError?: { cause?: { originalMessage?: unknown } } } })
    .meta?.driverAdapterError?.cause?.originalMessage;
  if (typeof original === 'string' && original.trim()) {
    return original.trim();
  }

  // Same database message when only the text is available: "... Message: `...`"
  const dbMessage = err.message.match(/Message: `([\s\S]*)`\s*$/);
  if (dbMessage && dbMessage[1].trim()) {
    return dbMessage[1].trim();
  }

  // Otherwise the error itself
  return err.message;
}
