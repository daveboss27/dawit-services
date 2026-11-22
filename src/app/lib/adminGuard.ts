const ADMIN_EMAIL = 'dawittesfay2724@gmail.com';

export function isAllowedAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === ADMIN_EMAIL;
}