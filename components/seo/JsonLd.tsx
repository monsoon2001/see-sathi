function asScriptJson(data: Record<string, any>): string {
  // Escape `<` so a value containing "</script>" cannot break out of the tag.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: asScriptJson(data) }}
    />
  );
}