import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin } from "lucide-react";

import { Container } from "@/components/layout/container";
import { site } from "@/content/site";

const exploreLinks = [
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blogs", href: "/blog" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms" },
];

function InstagramIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.6l.4-3H14V9c0-.6.4-1 1-1Z" />
    </svg>
  );
}

function LinkedInIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M6.5 8.5A2 2 0 1 1 6.5 4.5a2 2 0 0 1 0 4ZM4.8 20V10h3.4v10H4.8Zm5.7 0V10h3.2v1.4c.5-.9 1.7-1.7 3.4-1.7 3.5 0 4.1 2.1 4.1 5.2V20h-3.4v-4.7c0-1.5-.1-3.4-2.1-3.4-2.1 0-2.4 1.6-2.4 3.3V20H10.5Z" />
    </svg>
  );
}

const socialIcons: Record<
  string,
  (props: React.ComponentProps<"svg">) => React.ReactElement
> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  LinkedIn: LinkedInIcon,
};

export function SiteFooter() {
  return (
    <footer>
      <div className="bg-brand-dark py-4 text-white">
        <Container className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-xs font-semibold uppercase tracking-[0.18em]">
            Connect with sales today
          </p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
            {site.phones.map((phone) => (
              <a
                key={phone.label}
                href={phone.href}
                className="font-heading text-lg font-semibold transition-opacity hover:opacity-80"
              >
                {phone.label}: {phone.number}
              </a>
            ))}
          </div>
        </Container>
      </div>

      <div className="bg-ink py-14 text-white/70">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
            <div>
              <Link href="/" className="inline-flex" aria-label="Mahraj Arabia">
                <Image
                  src="/brand/mahraj-arabia-footer-logo.png"
                  alt="Mahraj Arabia"
                  width={286}
                  height={64}
                  unoptimized
                  className="h-12 w-auto sm:h-14"
                />
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed">
                Modular, portable, fencing and steel solutions for construction,
                events and industrial sites across Saudi Arabia.
              </p>
              <div className="mt-6 flex gap-3">
                {site.social.map((item) => {
                  const Icon = socialIcons[item.label];
                  if (!Icon) return null;

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
                {site.emails.map((email) => (
                  <li key={email} className="flex gap-3">
                    <Mail className="mt-0.5 size-4 shrink-0 text-brand" />
                    <a
                      href={`mailto:${email}`}
                      className="transition-colors hover:text-brand"
                    >
                      {email}
                    </a>
                  </li>
                ))}
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
