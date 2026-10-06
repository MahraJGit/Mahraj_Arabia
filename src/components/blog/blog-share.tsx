"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

const targets = [
  {
    label: "LinkedIn",
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: "X",
    href: (url: string, title: string) =>
      `https://x.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    label: "WhatsApp",
    href: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  },
];

export function BlogShare({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="rounded-md border border-border bg-background p-5">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
        <Share2 className="size-4" />
        Share
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {targets.map((target) => (
          <li key={target.label}>
            <a
              href={target.href(url, title)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-border px-3 py-1.5 text-xs font-medium text-body transition-colors hover:border-brand hover:text-brand"
            >
              {target.label}
            </a>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={copyLink}
        className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-medium text-body transition-colors hover:border-brand hover:text-brand"
      >
        {copied ? (
          <>
            <Check className="size-4" />
            Link copied
          </>
        ) : (
          <>
            <Copy className="size-4" />
            Copy link
          </>
        )}
      </button>
    </div>
  );
}
