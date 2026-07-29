"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  mainNavigation,
  type NavigationItem,
  utilityNavigation,
} from "@/constants/navigation";
import { HeaderActions } from "@/components/navigation/HeaderActions";
import { Button } from "@/components/ui/Button";

type MobileNavigationProps = {
  collectionItems: NavigationItem[];
  newArrivalCollectionItems: NavigationItem[];
};

export function MobileNavigation({
  collectionItems,
  newArrivalCollectionItems,
}: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="lg:hidden">
      <Button
        aria-controls={panelId}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((current) => !current)}
        variant="outline"
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {isOpen ? "Close" : "Menu"}
        </span>
      </Button>

      {isOpen ? (
        <div
          className="absolute left-0 right-0 top-full z-[var(--z-header)] border-t border-neutral-200 bg-white px-4 py-5 shadow-[var(--shadow-sm)] sm:px-6"
          id={panelId}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              closeMenu();
            }
          }}
        >
          <nav aria-label="Mobile primary navigation">
            <ul className="grid gap-1">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-100"
                    href={item.href}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-5 border-t border-neutral-200 pt-5">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Collections
            </p>
            <nav aria-label="Mobile collection navigation" className="mt-2">
              <ul className="grid max-h-64 gap-1 overflow-y-auto pr-1 sm:grid-cols-2">
                {collectionItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      href={item.href}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-5">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
              New Arrival
            </p>
            <nav aria-label="Mobile new arrival collection navigation" className="mt-2">
              <ul className="grid max-h-64 gap-1 overflow-y-auto pr-1 sm:grid-cols-2">
                {newArrivalCollectionItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      href={item.href}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-5">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Support
            </p>
            <nav aria-label="Mobile utility navigation" className="mt-2">
              <ul className="grid gap-1">
                {utilityNavigation.map((item) => (
                  <li key={item.href}>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      href={item.href}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="mt-5 border-t border-neutral-200 pt-5">
            <p className="px-3 text-xs font-medium uppercase tracking-wide text-neutral-500">
              Store tools
            </p>
            <HeaderActions className="mt-3 px-2" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
