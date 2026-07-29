import { LinkButton } from "@/components/ui/LinkButton";
import { Typography } from "@/components/ui/Typography";

type HomeSectionHeaderProps = {
  align?: "left" | "center";
  description?: string;
  eyebrow?: string;
  headingId: string;
  linkHref?: string;
  linkLabel?: string;
  title: string;
};

export function HomeSectionHeader({
  align = "left",
  description,
  eyebrow,
  headingId,
  linkHref,
  linkLabel,
  title,
}: HomeSectionHeaderProps) {
  const isCentered = align === "center";

  return (
    <div
      className={
        isCentered
          ? "mx-auto grid max-w-3xl justify-items-center gap-3 text-center"
          : "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      }
    >
      <div className={isCentered ? "grid justify-items-center gap-3" : "grid gap-3"}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#9f7d3f]">
            {eyebrow}
          </p>
        ) : null}
        <Typography
          as="h2"
          className="text-neutral-950"
          id={headingId}
          variant="h2"
        >
          {title}
        </Typography>
        {description ? (
          <Typography className="max-w-2xl" muted variant="small">
            {description}
          </Typography>
        ) : null}
      </div>
      {linkHref && linkLabel ? (
        <LinkButton className="shrink-0" href={linkHref} variant="text">
          {linkLabel}
        </LinkButton>
      ) : null}
    </div>
  );
}
