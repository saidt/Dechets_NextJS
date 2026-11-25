/**
 * Column filter operators, shared by server lists (prismaUtils) and in-memory lists
 * (localData): "=X", "<>X", ">=X", "<=X", ">X", "<X"; no operator keeps the default
 * match (contains, equals or that day). In text, % is a wildcard (like).
 */

/** Comparison operators a column filter value can start with. */
export type FilterOperator = '>=' | '<=' | '<>' | '>' | '<' | '=';

export type ParsedFilter = { op: FilterOperator | null; value: string };

/**
 * Splits a column filter value into its operator and value:
 * ">=01/10/2026" → { op: '>=', value: '01/10/2026' }; "ABC" → { op: null, value: 'ABC' }.
 * Two-character operators are checked first, so ">=" is not read as ">".
 */
export function parseFilterOperator(text: string): ParsedFilter {
  const trimmed = text.trim();
  for (const op of ['>=', '<=', '<>', '>', '<', '='] as FilterOperator[]) {
    if (trimmed.startsWith(op)) {
      return { op, value: trimmed.slice(op.length).trim() };
    }
  }
  return { op: null, value: trimmed };
}

/** A "like" pattern (% = any text) as a case-insensitive, whole-text RegExp. */
export function likeToRegExp(pattern: string): RegExp {
  const escaped = pattern.split('%').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`^${escaped.join('.*')}$`, 'i');
}
