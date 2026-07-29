import { adminLoginAction } from "@/lib/admin/actions";
import { getAdminSession } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;
  const session = await getAdminSession();

  if (session.isAdmin) {
    redirect(params.next?.startsWith("/admin") ? params.next : "/admin");
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
          Admin access
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Only your authorized account can open the dashboard.
        </p>

        {params.error ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Invalid credentials or unauthorized account.
          </p>
        ) : null}

        <form action={adminLoginAction} className="mt-6 grid gap-4">
          <input
            name="next"
            type="hidden"
            value={params.next?.startsWith("/admin") ? params.next : "/admin"}
          />
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Email</span>
            <input
              autoComplete="username"
              className="min-h-11 rounded-md border border-neutral-300 px-3"
              name="email"
              required
              type="email"
            />
          </label>
          <label className="grid gap-1.5 text-sm">
            <span className="font-medium">Password</span>
            <input
              autoComplete="current-password"
              className="min-h-11 rounded-md border border-neutral-300 px-3"
              name="password"
              required
              type="password"
            />
          </label>
          <button
            className="min-h-11 rounded-md bg-neutral-950 text-sm font-medium text-white hover:bg-neutral-800"
            type="submit"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}
