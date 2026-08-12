import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/layout/PageHeader";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { siteAuthor } from "@/constants/author";
import { createBreadcrumbs } from "@/lib/seo/breadcrumbs";
import { createPageMetadata } from "@/lib/seo/metadata";

/** Stable URL for blog author links. Not linked from header or footer nav. */
export const AUTHOR_PATH = siteAuthor.path;

const linkClassName =
  "text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900";

export const metadata: Metadata = createPageMetadata({
  title: siteAuthor.name,
  description:
    "Robert-Jan Broer is a watch writer, enthusiast, and the founder of Fratello Watches, covering watch news, reviews, collecting, and industry topics.",
  pathname: AUTHOR_PATH,
});

export default function AuthorPage() {
  return (
    <Container>
      <Section>
        <div className="grid gap-10">
          <PageHeader
            breadcrumbs={createBreadcrumbs([
              { label: "Author", href: AUTHOR_PATH },
            ])}
            description="Watch writer, enthusiast, and founder of Fratello Watches."
            title={siteAuthor.name}
          />

          <div className="grid gap-8 md:grid-cols-[200px_minmax(0,1fr)] md:items-start md:gap-10">
            <div className="justify-self-start md:sticky md:top-28">
              <div className="relative size-40 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 sm:size-48">
                {/* Placeholder — replace with the final author photo when ready. */}
                <Image
                  alt="Robert-Jan Broer photo placeholder"
                  className="object-cover"
                  fill
                  sizes="192px"
                  src="/images/placeholders/customer-avatar.svg"
                  unoptimized
                />
              </div>
            </div>

            <div className="article-content grid max-w-3xl gap-5 text-base leading-7 text-neutral-700">
              <p>
                Robert-Jan Broer is a watch writer, enthusiast, and the founder
                of <strong>Fratello Watches</strong>, an online watch
                publication covering watch news, reviews, collecting, industry
                developments, and buying-related topics.
              </p>
              <p>
                Broer founded Fratello in <strong>2004</strong> as a platform
                where he could share his knowledge and enthusiasm for mechanical
                watches with other collectors. Over the years, Fratello
                developed from a personal watch blog into an established
                international watch publication.
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
                About Robert-Jan Broer
              </h2>
              <p>
                Robert-Jan Broer developed an interest in watches from an early
                age, initially through digital Casio watches and Swatch models
                before becoming increasingly interested in mechanical watches
                during the 1990s.
              </p>
              <p>
                In 1999, he purchased his first mechanical watch, an Omega
                Speedmaster. His interest in watches continued to grow,
                eventually leading him to establish Fratello Watches in 2004.
              </p>
              <p>
                His work focuses on mechanical watches, watch collecting, new
                releases, comparisons, industry developments, and the
                experiences of watch enthusiasts and collectors.
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
                Founder of Fratello Watches
              </h2>
              <p>
                Robert-Jan Broer founded <strong>Fratello Watches</strong> in
                2004.
              </p>
              <p>
                What began as a personal platform for writing about watches
                eventually developed into an online watch magazine with a team of
                writers, photographers, and other contributors.
              </p>
              <p>
                Fratello now publishes content covering luxury watches, watch
                reviews, new releases, collecting, buying watches, and
                developments within the watch industry.
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
                Speedy Tuesday
              </h2>
              <p>
                Robert-Jan Broer is also known as the creator of{" "}
                <strong>Speedy Tuesday</strong>, a watch-community concept
                centered around the Omega Speedmaster.
              </p>
              <p>
                He coined the term in 2012 while sharing his enthusiasm for the
                Speedmaster. Speedy Tuesday subsequently developed into a
                recognizable community within watch collecting and has also been
                associated with official Omega Speedmaster collaborations.
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
                Watch Writing and Expertise
              </h2>
              <p>
                Broer&apos;s writing covers a broad range of watches, from
                accessible mechanical watches to high-end luxury pieces.
              </p>
              <p>
                His articles frequently examine areas such as watch design,
                movements, specifications, ownership experiences, collecting,
                comparisons, new releases, and whether particular watches offer
                an interesting proposition to enthusiasts.
              </p>
              <p>
                His long involvement with Fratello and the wider watch community
                has made him a recognizable figure among watch collectors and
                enthusiasts.
              </p>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
                Follow Robert-Jan Broer
              </h2>
              <p>
                You can find Robert-Jan Broer&apos;s own work and public profiles
                through his official channels.
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <strong>Fratello Author Profile:</strong>{" "}
                  <a
                    className={linkClassName}
                    href="https://www.fratellowatches.com/author/robert-jan/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Robert-Jan Broer on Fratello Watches
                  </a>
                </li>
                <li>
                  <strong>Instagram:</strong>{" "}
                  <a
                    className={linkClassName}
                    href="https://www.instagram.com/rjbroer/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    @rjbroer
                  </a>
                </li>
                <li>
                  <strong>LinkedIn:</strong>{" "}
                  <a
                    className={linkClassName}
                    href="https://www.linkedin.com/in/robert-jan-broer/"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Robert-Jan Broer
                  </a>
                </li>
              </ul>

              <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900">
                Editorial Disclosure
              </h2>
              <p>
                Robert-Jan Broer is the founder of Fratello Watches. This profile
                is provided for informational purposes and does not imply that
                Robert-Jan Broer is employed by, affiliated with, endorses, or
                writes for this website unless such a relationship is explicitly
                stated.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}
