export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "text";
export type ButtonSize = "sm" | "md" | "lg";

export const buttonBaseClassName =
  "inline-flex items-center justify-center rounded-md border font-medium transition duration-200";

export const buttonVariantClassName: Record<ButtonVariant, string> = {
  primary:
    "button-primary border-neutral-950 bg-neutral-950 hover:bg-neutral-800",
  secondary:
    "border-neutral-200 bg-neutral-100 text-neutral-950 hover:bg-neutral-200",
  outline:
    "border-neutral-300 bg-white text-neutral-950 hover:border-neutral-950",
  ghost: "border-transparent bg-transparent text-neutral-950 hover:bg-neutral-100",
  text: "border-transparent bg-transparent p-0 text-neutral-950 underline-offset-4 hover:underline",
};

export const buttonSizeClassName: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3 text-sm",
  md: "min-h-10 px-4 text-sm",
  lg: "min-h-12 px-5 text-base",
};
