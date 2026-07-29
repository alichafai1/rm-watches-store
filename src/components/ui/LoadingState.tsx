import { Skeleton } from "@/components/ui/Skeleton";

type LoadingStateProps = {
  label?: string;
  rows?: number;
};

export function LoadingState({
  label = "Loading content",
  rows = 3,
}: LoadingStateProps) {
  return (
    <div aria-busy="true" aria-label={label} className="grid gap-3" role="status">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton className="h-4 w-full" key={index} />
      ))}
    </div>
  );
}
