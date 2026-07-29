import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils/cn";

type CollectionCardBaseProps = {
  children: ReactNode;
  className?: string;
  media?: ReactNode;
};

export function CollectionCardBase({
  children,
  className,
  media,
}: CollectionCardBaseProps) {
  return (
    <Card className={cn("grid gap-3", className)}>
      {media ? <div>{media}</div> : null}
      <div className="grid gap-2">{children}</div>
    </Card>
  );
}
