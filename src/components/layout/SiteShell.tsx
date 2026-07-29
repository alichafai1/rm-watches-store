import type { ReactNode } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { SkipLink } from "@/components/layout/SkipLink";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <SkipLink />
      <AnnouncementBar />
      <Header />
      <main className="min-h-[60vh]" id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
