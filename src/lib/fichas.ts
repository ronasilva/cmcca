// Member lifecycle: pending -> member <-> deactivated. Fichas are the
// association's registry — records persist; only pending spam is deleted.

export type FichaStatus = "pending" | "member" | "deactivated";

export function statusOf(ficha: {
  status?: FichaStatus;
  approved?: boolean;
}): FichaStatus {
  if (ficha.status) return ficha.status;
  return ficha.approved ? "member" : "pending";
}

// Partial date (YYYY, YYYY-MM or YYYY-MM-DD) -> dd/mm/yyyy at the
// precision that was provided.
export function formatSince(s: string): string {
  const [y, m, d] = s.split("-");
  if (d) return `${d}/${m}/${y}`;
  if (m) return `${m}/${y}`;
  return y;
}
