"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Logo } from "@/components/layout/logo";
import { MegaMenuPanel } from "@/components/layout/mega-menu";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { mainNav, site } from "@/content/site";
import type { MegaMenuColumn } from "@/lib/public/services";
import { cn } from "@/lib/utils";

function TopBar() {
  return (
    <div className="hidden border-b border-border bg-surface-alt md:block">
      <Container className="flex h-9 items-center justify-between gap-6">
        <p className="text-xs text-body">{site.tagline}</p>
        <a
          href={site.phoneHref}
          className="flex items-center gap-1.5 text-xs text-body transition-colors hover:text-brand"
        >
          <Phone className="size-3.5" />
          {site.phone}
        </a>
      </Container>
    </div>
  );
}

export function SiteHeader({
  megaMenu,
}: {
  megaMenu: MegaMenuColumn[];
}) {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [menuTop, setMenuTop] = useState(0);

  useLayoutEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const sync = () => setMenuTop(header.getBoundingClientRect().bottom);
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(header);
    window.addEventListener("resize", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-40 bg-background">
      <TopBar />
      <div className="relative border-b border-border">
        <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.5rem]">
          <Logo />

          <NavigationMenu
            viewport={false}
            className="static hidden lg:flex"
            delayDuration={100}
          >
            <NavigationMenuList className="gap-0.5">
              {mainNav.map((item) =>
                item.hasMegaMenu ? (
                  <NavigationMenuItem key={item.href} className="static">
                    <NavigationMenuTrigger
                      className={cn(
                        "text-[0.9375rem] font-medium text-ink",
                        isActive(item.href) && "text-brand"
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent
                      style={{ top: menuTop }}
                      className="fixed inset-x-0 z-50 mx-auto mt-0 w-[min(80rem,calc(100%-4rem))] max-w-none overflow-visible rounded-b-xl border border-border bg-popover p-0 shadow-[0_28px_50px_-28px_rgba(16,16,16,0.45)] ring-0 md:fixed md:inset-x-0 md:mx-auto md:w-[min(80rem,calc(100%-4rem))] group-data-[viewport=false]/navigation-menu:mt-0 group-data-[viewport=false]/navigation-menu:w-[min(80rem,calc(100%-4rem))] group-data-[viewport=false]/navigation-menu:overflow-visible group-data-[viewport=false]/navigation-menu:rounded-b-xl group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:shadow-[0_28px_50px_-28px_rgba(16,16,16,0.45)] group-data-[viewport=false]/navigation-menu:ring-0"
                    >
                      <MegaMenuPanel columns={megaMenu} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink
                      asChild
                      active={isActive(item.href)}
                      className={cn(
                        "h-9 px-2.5 text-[0.9375rem] font-medium text-ink data-active:bg-transparent",
                        isActive(item.href) && "text-brand"
                      )}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              )}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-1">
            <Button asChild variant="brand" className="hidden h-10 px-4 sm:inline-flex">
              <Link href="/contact#quote-form">Request a Quote</Link>
            </Button>
            <MobileNav megaMenu={megaMenu} />
          </div>
        </Container>
      </div>
    </header>
  );
}
