import Link from "next/link";
import { DesktopNavigation } from "@/components/navigation/DesktopNavigation";
import { HeaderActions } from "@/components/navigation/HeaderActions";
import { MobileNavigation } from "@/components/navigation/MobileNavigation";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/constants/site";
import { getCollectionNavigationItems } from "@/lib/data/collections";
import { getNewArrivalCollectionNavigationItems } from "@/lib/data/new-arrival-collections";

export function Header() {
  const collectionItems = getCollectionNavigationItems();
  const newArrivalCollectionItems = getNewArrivalCollectionNavigationItems();

  return (
    <header className="relative border-b border-neutral-200 bg-white">
      <Container>
        <div className="flex min-h-16 items-center justify-between gap-4 py-3">
          <Link
            className="shrink-0 text-base font-semibold tracking-tight underline-offset-4 hover:underline"
            href="/"
          >
            {siteConfig.name}
          </Link>
          <DesktopNavigation
            collectionItems={collectionItems}
            newArrivalCollectionItems={newArrivalCollectionItems}
          />
          <div className="flex shrink-0 items-center gap-1">
            <HeaderActions className="hidden md:flex" />
            <HeaderActions className="md:hidden" compact />
            <MobileNavigation
              collectionItems={collectionItems}
              newArrivalCollectionItems={newArrivalCollectionItems}
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
