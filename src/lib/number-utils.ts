export function isNumber(value: string) {
  const cleaned = value.replace(/\s/g, "").replace(",", ".");
  return Number(cleaned);
}

export const formatConfig = {
  dateLocale: "fr-FR",
  dateOptions: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  } as Intl.DateTimeFormatOptions,
};

export const formatNumber = (
  value: number,
  decimals = 0
): string => {
  const parts = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).formatToParts(value);

  return parts
    .map((part) => {
      if (part.type === "decimal") return ".";
      if (part.type === "group") return " ";
      return part.value;
    })
    .join("");
};

export const formatValue = (
  value: unknown,
  decimals?: number,
  type?: string
): { formatted: React.ReactNode; align: "left" | "right" } => {
  const isDate =
    type === "date" ||
    value instanceof Date ||
    (typeof value === "string" && /^\d{4}-\d{2}-\d{2}(T.*)?$/.test(value));

  if (isDate) {
    const date = new Date(value as string | Date);
    return {
      formatted: isNaN(date.getTime())
        ? (value as React.ReactNode)
        : date.toLocaleDateString(formatConfig.dateLocale, formatConfig.dateOptions),
      align: "left",
    };
  }

  // By the variable's type, not its content: a string made of digits (a code such as
  // "00123") stays a string. SQL decimals arrive as numbers (see src/lib/prisma.ts).
  const isNumber = type === "number" || typeof value === "number" || typeof value === "bigint";

  if (isNumber) {
    return {
      formatted: formatNumber(Number(value), decimals ?? 0),
      align: "right",
    };
  }

  return {
    formatted: value as React.ReactNode,
    align: "left",
  };
};