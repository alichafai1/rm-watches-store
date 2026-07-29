import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

type InfoLayoutProps = {
  children: ReactNode;
};

export default function InfoLayout({ children }: InfoLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
