import { FooterNavigation } from "@/components/layout/FooterNavigation";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { siteConfig } from "@/constants/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="grid gap-8 py-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_2fr]">
            <section aria-labelledby="footer-brand" className="max-w-sm">
              <h2
                className="text-base font-semibold tracking-tight text-neutral-950"
                id="footer-brand"
              >
                {siteConfig.name}
              </h2>
              <p className="mt-3 text-sm leading-6 text-neutral-600">
                A clean ecommerce foundation for watch catalog, collection,
                guide, and customer-service experiences.
              </p>
            </section>
            <FooterNavigation />
          </div>

          <Divider />

          <div className="flex flex-col gap-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {currentYear} {siteConfig.name}. Placeholder copyright.
            </p>
            <p aria-label="Payment method placeholder">
              Payment method area reserved for a later commerce phase.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
