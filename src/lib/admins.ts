// Admins review fichas and manage member access. Two sources:
// - app_metadata.role === "admin", assigned from the Fichas page
// - MEMBER_ADMIN_EMAILS (comma-separated env) as bootstrap/fallback,
//   so the first admin exists before any role was ever assigned.
type UserLike = {
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
} | null;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.MEMBER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}

export function isAdminUser(user: UserLike): boolean {
  if (!user) return false;
  if (user.app_metadata?.role === "admin") return true;
  return isAdminEmail(user.email);
}
