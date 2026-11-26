const maxDays = 2147483647;

export function readLeadTimeDays(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const text = String(value).trim();
  if (!/^\d+$/.test(text)) return null;
  const days = Number(text);
  return Number.isInteger(days) && days <= maxDays ? days : null;
}

export function getQuoteLeadTimeDays(quote) {
  // Quotes created with the earlier timing fields can still be compared.
  const arrival = readLeadTimeDays(quote.arrivalDays);
  if (arrival !== null) return arrival;

  const ready = readLeadTimeDays(quote.readyDays);
  const transit = readLeadTimeDays(quote.transitDays);
  if (ready !== null && transit !== null && ready + transit <= maxDays) {
    return ready + transit;
  }

  return readLeadTimeDays(quote.leadTime);
}

export function formatDays(days) {
  return `${days} ${days === 1 ? "day" : "days"}`;
}
