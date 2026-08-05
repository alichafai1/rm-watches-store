import { CartLink } from "@/components/cart/CartLink";
import type { CommerceUtilityAction } from "@/constants/navigation";
import { commerceUtilityActions } from "@/constants/navigation";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils/cn";

type HeaderActionsProps = {
  className?: string;
  compact?: boolean;
};

function ActionIcon({ id }: Pick<CommerceUtilityAction, "id">) {
  const commonProps = {
    "aria-hidden": true,
    className: "size-4",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: 1.75,
    viewBox: "0 0 24 24",
  } as const;

  if (id === "search") {
    return (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m16.5 16.5 4 4" />
      </svg>
    );
  }

  if (id === "account") {
    return (
      <svg {...commonProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    );
  }

  if (id === "wishlist") {
    return (
      <svg {...commonProps}>
        <path d="M20.8 5.6a5.2 5.2 0 0 0-7.4 0L12 7l-1.4-1.4a5.2 5.2 0 0 0-7.4 7.4L12 21l8.8-8a5.2 5.2 0 0 0 0-7.4Z" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M6 7h12l-1 14H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function HeaderActions({ className, compact = false }: HeaderActionsProps) {
  // The cart is the only action wired up so far, so it stays visible on phones
  // while the remaining placeholders are hidden to save room.
  const actions = compact
    ? commerceUtilityActions.filter(
        (action) => action.id === "search" || action.id === "cart",
      )
    : commerceUtilityActions;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {actions.map((action) =>
        action.id === "cart" ? (
          <CartLink key={action.id} />
        ) : (
          <IconButton key={action.id} label={action.label}>
            <ActionIcon id={action.id} />
          </IconButton>
        ),
      )}
    </div>
  );
}
