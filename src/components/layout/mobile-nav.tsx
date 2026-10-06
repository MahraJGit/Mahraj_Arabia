"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, Phone } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { mainNav, site } from "@/content/site";
import type { MegaMenuColumn } from "@/lib/public/services";

export function MobileNav({ megaMenu }: { megaMenu: MegaMenuColumn[] }) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon-lg" className="lg:hidden">
          <Menu className="size-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-sm">
        <SheetHeader className="border-b border-border">
          <SheetTitle className="font-heading text-lg font-bold text-ink">
            Mahraj <span className="text-brand">Arabia</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-col px-4 pb-4">
          {mainNav.map((item) =>
            item.hasMegaMenu ? (
              <Accordion key={item.href} type="single" collapsible>
                <AccordionItem value="services" className="border-b-0">
                  <AccordionTrigger className="py-3 text-base font-medium text-ink hover:no-underline!">
                    {item.label}
                  </AccordionTrigger>
                  <AccordionContent className="pb-3 [&_a]:no-underline!">
                    <Accordion type="single" collapsible className="space-y-2">
                      {megaMenu.map((column) => (
                        <AccordionItem
                          key={column.title}
                          value={column.title}
                          className="rounded-md border border-border px-3"
                        >
                          <AccordionTrigger className="py-3 text-sm font-semibold text-ink hover:no-underline">
                            {column.title}
                          </AccordionTrigger>
                          <AccordionContent className="pb-3">
                            <ul className="space-y-2">
                              {column.links.map((link) => (
                                <li key={`${column.title}-${link.href}-${link.label}`}>
                                  <Link
                                    href={link.href}
                                    onClick={close}
                                    className="text-sm text-body no-underline hover:text-brand"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                    <Link
                      href="/services"
                      onClick={close}
                      className="mt-4 inline-block text-sm font-semibold text-brand no-underline"
                    >
                      View All Services
                    </Link>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="border-b border-border py-3 text-base font-medium text-ink transition-colors hover:text-brand"
              >
                {item.label}
              </Link>
            )
          )}

          <div className="mt-6 flex flex-col gap-3">
            <Button asChild variant="brand" size="xl">
              <Link href="/contact#quote-form" onClick={close}>
                Request a Quote
              </Link>
            </Button>
            <a
              href={site.phoneHref}
              className="flex items-center justify-center gap-2 text-sm font-medium text-body"
            >
              <Phone className="size-4 text-brand" />
              {site.phone}
            </a>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
