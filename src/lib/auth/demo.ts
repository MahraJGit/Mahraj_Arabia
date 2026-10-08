/** Demo CMS mode when MongoDB is unset. Auth uses Supabase when configured. */

export const DEMO_ADMIN = {
  id: "demo-admin-001",
  email: "admin@mahrajarabia.com",
  password: "Admin@123",
  name: "Mahraj Arabia Admin",
  role: "admin" as const,
};

export const DEMO_AUTH_SECRET =
  "mahraj-arabia-demo-auth-secret-change-in-production";

export function isDemoMode() {
  return !process.env.DATABASE_URI?.trim();
}

export function isDemoAdminCredentials(email: string, password: string) {
  return (
    email.trim().toLowerCase() === DEMO_ADMIN.email &&
    password === DEMO_ADMIN.password
  );
}
