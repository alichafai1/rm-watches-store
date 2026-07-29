import Link from "next/link";
import type { ReactNode } from "react";
import {
  buttonBaseClassName,
  buttonSizeClassName,
  buttonVariantClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";
import { cn } from "@/lib/utils/cn";

type LinkButtonProps = {
  children: ReactNode;
  className?: string;
  href: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

export function LinkButton({
  children,
  className,
  href,
  size = "md",
  variant = "primary",
}: LinkButtonProps) {
  return (
    <Link
      className={cn(
        buttonBaseClassName,
        buttonVariantClassName[variant],
        variant !== "text" && buttonSizeClassName[size],
        className,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
