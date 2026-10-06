import Link from "next/link";
import { Mail, MapPin, MessageCircle } from "lucide-react";

import { Container } from "@/components/layout/container";
import { site } from "@/content/site";

const exploreLinks = [
  { label: "Services", href: "/services" },
  { label: "Catalogues", href: "/catalogues" },
  { label: "Projects", href: "/projects" },
  { label: "Industries", href: "/industries" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

function WhatsAppIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M17.47 14.38c-.27-.14-1.62-.8-1.87-.89-.25-.09-.43-.14-.62.14-.18.27-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.14-1.15-.42-2.19-1.35-.81-.72-1.36-1.61-1.52-1.88-.16-.27-.02-.42.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.62-1.49-.85-2.04-.22-.53-.45-.46-.62-.46h-.53c-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.29s.98 2.66 1.12 2.84c.14.18 1.93 2.95 4.68 4.14.65.28 1.16.45 1.56.57.65.2 1.25.18 1.72.11.52-.08 1.62-.66 1.85-1.3.23-.64.23-1.19.16-1.3-.07-.11-.25-.18-.52-.32Z" />
      <path d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89c0 1.96.57 3.78 1.56 5.33L2 22l4.92-1.63a9.86 9.86 0 0 0 5.12 1.41h.01c5.46 0 9.89-4.43 9.89-9.89C21.94 6.43 17.5 2 12.04 2Zm0 18.07h-.01a8.17 8.17 0 0 1-4.16-1.14l-.3-.18-3.1 1.02 1.04-3.02-.2-.31a8.18 8.18 0 0 1-1.26-4.36c0-4.52 3.68-8.2 8.2-8.2 4.52 0 8.2 3.68 8.2 8.2 0 4.52-3.68 8.19-8.21 8.19Z" />
    </svg>
  );
}

const socialIcons: Record<
  string,
  (props: React.ComponentProps<"svg">) => React.ReactElement
> = {
  WhatsApp: WhatsAppIcon,
};

export function SiteFooter() {
  return (
    <footer>
      <div className="bg-brand-dark py-4 text-white">
        <Container className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">
            Connect with sales today
          </p>
          <a
            href={site.phoneHref}
            className="font-heading text-lg font-semibold transition-opacity hover:opacity-80"
          >
            {site.phone}
          </a>
        </Container>
      </div>

      <div className="bg-ink py-14 text-white/70">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
            <div>
              <Link
                href="/"
                className="font-heading text-2xl font-bold text-white transition-opacity hover:opacity-80"
              >
                Mahraj <span className="text-brand">Arabia</span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed">
                Practical modular buildings, portable facilities and custom steel
                fabrication for projects across Saudi Arabia.
              </p>
              <div className="mt-6 flex gap-3">
                {site.social.map((item) => {
                  const Icon = socialIcons[item.label] ?? MessageCircle;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex size-9 items-center justify-center rounded-md border border-white/15 text-white/70 transition-colors hover:border-brand hover:bg-brand hover:text-white"
                    >
                      <Icon className="size-4" />
                      <span className="sr-only">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Explore
              </h3>
              <ul className="mt-5 space-y-3">
                {exploreLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Company
              </h3>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Contact Info
              </h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                  <a
                    href={site.address.mapsHref}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="transition-colors hover:text-brand"
                  >
                    {site.address.line1}, {site.address.line2}
                    <br />
                    {site.address.line3}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                  <a
                    href={`mailto:${site.email}`}
                    className="transition-colors hover:text-brand"
                  >
                    {site.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs">
              &copy; {new Date().getFullYear()} {site.name}. All Rights
              Reserved.
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
