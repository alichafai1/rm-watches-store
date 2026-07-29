import Link from "next/link";
import { announcementBar } from "@/constants/navigation";

export function AnnouncementBar() {
  if (!announcementBar.enabled) {
    return null;
  }

  return (
    <div className="border-b border-neutral-200 bg-neutral-950 px-4 py-2 text-center text-xs text-white sm:text-sm">
      <p>
        <span>{announcementBar.message}</span>
        {announcementBar.link ? (
          <>
            {" "}
            <Link
              className="font-medium underline underline-offset-4"
              href={announcementBar.link.href}
            >
              {announcementBar.link.label}
            </Link>
          </>
        ) : null}
      </p>
    </div>
  );
}
