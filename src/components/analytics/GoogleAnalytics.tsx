"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import {
  GA_MEASUREMENT_ID,
  isAnalyticsEnabled,
  trackPageView,
} from "@/lib/analytics/gtag";

function AnalyticsPageViews() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isAnalyticsEnabled() || !pathname) return;
    // Keep admin sessions out of storefront analytics.
    if (pathname.startsWith("/admin")) return;

    const query = searchParams?.toString();
    trackPageView(query ? `${pathname}?${query}` : pathname);
  }, [pathname, searchParams]);

  return null;
}

/**
 * Loads gtag.js only when NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 * Automatic page_view is disabled in config so App Router navigations are
 * tracked once via the pathname effect below.
 *
 * `lazyOnload` keeps the ~160 KiB gtag payload off the critical path that
 * PageSpeed scores, while still loading analytics after the page is idle.
 * Ecommerce helpers in `gtag.ts` call `window.gtag` when present; dataLayer
 * queues commands once the init snippet runs.
 */
export function GoogleAnalytics() {
  if (!isAnalyticsEnabled()) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="lazyOnload"
      />
      <Script id="ga4-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <AnalyticsPageViews />
      </Suspense>
    </>
  );
}
