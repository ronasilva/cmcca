// Reviewers of member applications (the mestre and the site admin).
// Configured via MEMBER_ADMIN_EMAILS (comma-separated) in the environment.
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const list = (process.env.MEMBER_ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(email.toLowerCase());
}
