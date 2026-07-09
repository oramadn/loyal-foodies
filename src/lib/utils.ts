import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type OrderItem = { name: string; qty: number };

export function parseOrderItems(raw: string): OrderItem[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (
      Array.isArray(parsed) &&
      parsed.length > 0 &&
      parsed.every(
        (i): i is OrderItem =>
          typeof i?.name === "string" && typeof i?.qty === "number"
      )
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function itemsSortKey(raw: string): string {
  const items = parseOrderItems(raw);
  if (!items || items.length === 0) return raw.toLowerCase();
  return items[0].name.toLowerCase();
}

export type AggregatedItem = { name: string; qty: number; orderedBy: string[] };

export function aggregateOrderItems(
  entries: { name: string; items: string }[]
): AggregatedItem[] {
  const map = new Map<string, AggregatedItem>();

  for (const entry of entries) {
    const parsed = parseOrderItems(entry.items);
    if (parsed) {
      for (const item of parsed) {
        const key = item.name.toLowerCase();
        const existing = map.get(key);
        if (existing) {
          existing.qty += item.qty;
          existing.orderedBy.push(entry.name);
        } else {
          map.set(key, { name: item.name, qty: item.qty, orderedBy: [entry.name] });
        }
      }
    } else {
      const key = entry.items.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.qty += 1;
        existing.orderedBy.push(entry.name);
      } else {
        map.set(key, { name: entry.items, qty: 1, orderedBy: [entry.name] });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
}

export function formatCurrency(amount: string | number | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "—";
  return (
    num.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " JOD"
  );
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
