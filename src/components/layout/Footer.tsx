import Link from "next/link";
import { FooterNavigation } from "@/components/layout/FooterNavigation";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";
import { Divider } from "@/components/ui/Divider";
import { contactInfo } from "@/constants/contact";
import { siteConfig } from "@/constants/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <Container>
        <div className="grid gap-8 py-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_2fr]">
            <section aria-labelledby="footer-brand" className="max-w-sm">
              <h2 id="footer-brand">
                <Link className="inline-block" href="/">
                  <Logo className="h-11" sizes="148px" />
                </Link>
              </h2>
              <div className="mt-3 grid gap-1 text-sm leading-6 text-neutral-600">
                <p>
                  Email us:{" "}
                  <a
                    className="text-neutral-800 underline-offset-2 hover:underline"
                    href={contactInfo.emailHref}
                  >
                    {contactInfo.email}
                  </a>
                </p>
                <p>
                  Call us:{" "}
                  <a
                    className="text-neutral-800 underline-offset-2 hover:underline"
                    href={contactInfo.phoneHref}
                  >
                    {contactInfo.phone}
                  </a>
                </p>
              </div>
            </section>
            <FooterNavigation />
          </div>

          <Divider />

          <div className="flex flex-col gap-3 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
            <p>
              &copy; {currentYear} {siteConfig.name}.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
