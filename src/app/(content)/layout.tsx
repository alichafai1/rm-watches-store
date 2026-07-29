import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

type ContentLayoutProps = {
  children: ReactNode;
};

export default function ContentLayout({ children }: ContentLayoutProps) {
  return <SiteShell>{children}</SiteShell>;
}
