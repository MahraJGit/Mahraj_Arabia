import type { Metadata } from "next";

import {
  LegalBody,
  LegalCta,
  LegalKeyPoints,
} from "@/components/legal/legal-document";
import { LegalHero } from "@/components/legal/legal-hero";
import { termsDocument } from "@/content/legal";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: termsDocument.description,
};

export default function TermsPage() {
  return (
    <>
      <LegalHero doc={termsDocument} />
      <LegalKeyPoints doc={termsDocument} />
      <LegalBody doc={termsDocument} />
      <LegalCta doc={termsDocument}/>
    </>
  );
}
