export function SkipLink() {
  return (
    <a
      className="sr-only z-[var(--z-overlay)] rounded-md bg-neutral-950 px-4 py-3 text-sm font-medium text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      href="#main-content"
    >
      Skip to main content
    </a>
  );
}
