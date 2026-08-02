import Link from "next/link";
import type { ReactNode } from "react";
import { adminLogoutAction } from "@/lib/admin/actions";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/blogs", label: "Blog & guides" },
];

type AdminShellProps = {
  children: ReactNode;
  title: string;
};

export function AdminShell({ children, title }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Admin
            </p>
            <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          </div>
          <form action={adminLogoutAction}>
            <button
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm font-medium hover:bg-neutral-50"
              type="submit"
            >
              Log out
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[200px_1fr]">
        <nav className="grid h-fit gap-1 rounded-xl border border-neutral-200 bg-white p-3">
          {navItems.map((item) => (
            <Link
              className="rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link
            className="rounded-md px-3 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-50"
            href="/"
          >
            View storefront
          </Link>
        </nav>
        <main>{children}</main>
      </div>
    </div>
  );
}
