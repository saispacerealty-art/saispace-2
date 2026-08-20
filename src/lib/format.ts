export function formatINR(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatCompactINR(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(value % 10000000 === 0 ? 0 : 2)} Cr`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(value % 100000 === 0 ? 0 : 2)} L`;
  return formatINR(value);
}

export function formatPrice(value: number, unit: "total" | "month"): string {
  const base = formatCompactINR(value);
  return unit === "month" ? `${base}/mo` : base;
}

export function formatArea(sqft: number): string {
  return `${new Intl.NumberFormat("en-IN").format(sqft)} sq.ft`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
