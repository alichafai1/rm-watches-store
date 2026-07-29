import type { ElementType, ReactNode } from "react";
import { designTokens } from "@/constants/design-tokens";
import { cn } from "@/lib/utils/cn";

type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "body"
  | "small"
  | "caption";

type TypographyProps = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  muted?: boolean;
  variant: TypographyVariant;
};

const defaultElement: Record<TypographyVariant, ElementType> = {
  display: "p",
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  body: "p",
  small: "p",
  caption: "p",
};

export function Typography({
  as,
  children,
  className,
  id,
  muted = false,
  variant,
}: TypographyProps) {
  const Component = as ?? defaultElement[variant];

  return (
    <Component
      className={cn(
        designTokens.typography[variant],
        muted && "text-neutral-600",
        className,
      )}
      id={id}
    >
      {children}
    </Component>
  );
}
