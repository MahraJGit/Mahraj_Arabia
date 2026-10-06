"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Ensures in-app navigations to `/path#section` scroll to the target.
 * Native hash scrolling is unreliable with the App Router + sticky header.
 */
export function HashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    function scrollToHash() {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;

      // Wait a tick so the destination page has painted.
      window.requestAnimationFrame(() => {
        const el = document.getElementById(hash);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [pathname]);

  return null;
}
