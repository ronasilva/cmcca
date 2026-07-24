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
