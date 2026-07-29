import Link from "next/link";
import { footerNavigationGroups } from "@/constants/navigation";

export function FooterNavigation() {
  return (
    <nav aria-label="Footer navigation">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {footerNavigationGroups.map((group) => {
          const headingId = `footer-${group.title
            .toLowerCase()
            .replaceAll(" ", "-")}`;

          return (
            <section aria-labelledby={headingId} key={group.title}>
              <h2
                className="text-sm font-semibold text-neutral-950"
                id={headingId}
              >
                {group.title}
              </h2>
              <ul className="mt-3 grid gap-2 text-sm text-neutral-600">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      className="underline-offset-4 hover:text-neutral-950 hover:underline"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </nav>
  );
}
