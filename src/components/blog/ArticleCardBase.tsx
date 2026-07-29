import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type ArticleCardBaseProps = {
  children: ReactNode;
  className?: string;
};

export function ArticleCardBase({ children, className }: ArticleCardBaseProps) {
  return <Card className={cn("grid gap-2", className)}>{children}</Card>;
}
