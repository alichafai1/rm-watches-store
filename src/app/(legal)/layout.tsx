import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

type LegalLayoutProps = {
  children: ReactNode;
};

export default function LegalLayout({ children }: LegalLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
