import type { JsonLdObject } from "@/types/seo";

type JsonLdProps = {
  data: JsonLdObject;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  );
}
