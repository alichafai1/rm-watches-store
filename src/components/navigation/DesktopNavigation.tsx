import Link from "next/link";
import { mainNavigation, type NavigationItem } from "@/constants/navigation";

type DesktopNavigationProps = {
  collectionItems: NavigationItem[];
  newArrivalCollectionItems: NavigationItem[];
};

type NavigationDropdownProps = {
  href: string;
  items: NavigationItem[];
  label: string;
};

function NavigationDropdown({ href, items, label }: NavigationDropdownProps) {
  return (
    <div className="group py-4">
      <Link
        className="relative inline-flex items-center text-neutral-700 underline-offset-4 hover:text-neutral-950 hover:underline"
        href={href}
      >
        <span>{label}</span>
        <svg
          aria-hidden="true"
          className="absolute -right-4 top-1/2 size-3.5 -translate-y-1/2 transition group-hover:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Link>
      <div className="invisible absolute left-0 top-full z-[var(--z-header)] w-44 rounded-xl border border-neutral-200 bg-white p-2.5 opacity-0 shadow-[var(--shadow-md)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
        <div className="mb-2 flex justify-end border-b border-neutral-200 pb-2">
          <Link
            className="text-[11px] font-semibold text-neutral-950 underline-offset-4 hover:underline"
            href={href}
          >
            View all
          </Link>
        </div>
        <ul className="grid max-h-80 gap-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
          {items.map((collectionItem) => (
            <li key={collectionItem.href}>
              <Link
                className="block rounded-md px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-neutral-950"
                href={collectionItem.href}
              >
                {collectionItem.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function DesktopNavigation({
  collectionItems,
  newArrivalCollectionItems,
}: DesktopNavigationProps) {
  const dropdownItemsByHref: Record<string, NavigationItem[]> = {
    "/collections": collectionItems,
    "/new-arrival-collections": newArrivalCollectionItems,
  };

  return (
    <nav aria-label="Primary navigation" className="hidden lg:block">
      <ul className="flex items-center gap-6 text-sm font-medium">
        {mainNavigation.map((item) => (
          <li className="relative" key={item.href}>
            {dropdownItemsByHref[item.href] ? (
              <NavigationDropdown
                href={item.href}
                items={dropdownItemsByHref[item.href]}
                label={item.label}
              />
            ) : (
              <Link
                className="text-neutral-700 underline-offset-4 hover:text-neutral-950 hover:underline"
                href={item.href}
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
