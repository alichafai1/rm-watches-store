import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type ProductCardBaseProps = {
  children: ReactNode;
  className?: string;
  media?: ReactNode;
};

export function ProductCardBase({
  children,
  className,
  media,
}: ProductCardBaseProps) {
  return (
    <Card className={cn("grid gap-3", className)}>
      {media ? <div>{media}</div> : null}
      <div className="grid gap-2">{children}</div>
    </Card>
  );
}
