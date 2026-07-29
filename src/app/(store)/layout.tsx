import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

type StoreLayoutProps = {
  children: ReactNode;
};

export default function StoreLayout({ children }: StoreLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
