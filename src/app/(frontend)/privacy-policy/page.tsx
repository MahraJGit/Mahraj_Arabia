import type { Metadata } from "next";

import {
  LegalBody,
  LegalCta,
  LegalKeyPoints,
} from "@/components/legal/legal-document";
import { LegalHero } from "@/components/legal/legal-hero";
import { privacyDocument } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: privacyDocument.description,
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <LegalHero doc={privacyDocument} />
      <LegalKeyPoints doc={privacyDocument} />
      <LegalBody doc={privacyDocument} />
      <LegalCta doc={privacyDocument}/>
    </>
  );
}
