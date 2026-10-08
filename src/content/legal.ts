import {
  BadgeCheck,
  FileSignature,
  HandCoins,
  Lock,
  Mail,
  ShieldCheck,
  Truck,
  UserCheck,
  type LucideIcon,
} from "lucide-react";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalKeyPoint = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export type LegalDocument = {
  slug: "terms" | "privacy-policy";
  title: string;
  breadcrumb: string;
  description: string;
  heroImage: string;
  lastUpdated: string;
  highlights: { label: string; value: string }[];
  keyPointsTitle: string;
  keyPointsDescription: string;
  keyPoints: LegalKeyPoint[];
  intro: string;
  sections: LegalSection[];
  related: { label: string; href: string };
  cta: {
    title: string;
    description: string;
  };
};

export const termsDocument: LegalDocument = {
  slug: "terms",
  title: "Terms of Service",
  breadcrumb: "Terms of Service",
  description:
    "By using our website or working with us on a project, you agree to these terms. They explain your rights, our responsibilities, and what to expect at every step, from your first quote to final installation.",
  heroImage: "/images/legal/terms-hero.png",
  lastUpdated: "23 September 2026",
  highlights: [
    { label: "Last Updated", value: "23 September 2026" },
    { label: "Covers", value: "Website use & modular and steel services" },
    { label: "Governed By", value: "Kingdom of Saudi Arabia Law" },
  ],
  keyPointsTitle: "The Key Points",
  keyPointsDescription:
    "A quick summary of what matters most once your project is underway. The full terms below add the details behind each point.",
  keyPoints: [
    {
      icon: FileSignature,
      title: "Your Contract Comes First",
      description:
        "If anything here conflicts with your signed quotation or contract, your signed project document takes priority.",
    },
    {
      icon: HandCoins,
      title: "Online Prices Are Estimates",
      description:
        "Prices, timelines, and stock shown online are estimates only. A written quotation stays legally binding for you.",
    },
    {
      icon: Truck,
      title: "Your Site Must Be Ready",
      description:
        "Subfloor moisture, levelling, and site access must meet requirements before installation work can proceed smoothly.",
    },
    {
      icon: BadgeCheck,
      title: "Follow Care Guidelines",
      description:
        "Product and workmanship warranties always remain valid only when the solution is used and cared for correctly.",
    },
  ],
  intro:
    "These terms of service apply whenever you visit m-arabia.vercel.app, download our catalogues, request a quotation, or work with Mahraj Arabia on supply, specification, or installation. If anything here conflicts with a signed quotation, purchase order, or contract, that project document always takes priority.",
  related: { label: "Privacy Policy", href: "/privacy-policy" },
  cta: {
    title: "Still Have a Question About Your Project Terms?",
    description:
      "Whether it's pricing, delivery, or warranty coverage, our team is ready to clarify anything before you sign.",
  },
  sections: [
    {
      id: "acceptance",
      title: "Agreeing to These Terms",
      paragraphs: [
        "By using this website or submitting a project enquiry, you confirm you've read and accepted these terms. If you're acting on behalf of a company, consultant, or contractor, you're confirming you have the authority to agree on their behalf.",
        'We may revise these terms occasionally, and the "Last updated" date will reflect any changes. Continuing to use our website after an update means you accept the revised version.',
      ],
    },
    {
      id: "definitions",
      title: "A Few Key Terms",
      paragraphs: [
        "To keep things clear, here's what some words mean throughout this page:",
      ],
      bullets: [
        '"We," "us," and "our" refer to Mahraj Arabia and our authorized regional offices',
        '"You" and "client" refer to anyone browsing our site, requesting a quote, or hiring us for a project',
        '"Works" means supply, subfloor prep, installation, and any related services outlined in a quotation or contract',
        '"Project documents" means the quotation, specification, drawings, purchase order, or signed contract tied to your job',
      ],
    },
    {
      id: "quotes",
      title: "How Orders Are Confirmed",
      paragraphs: [
        "Your order becomes binding once we issue written confirmation or once you accept a quotation in writing. Any changes to quantity, product, or timeline after confirmation may affect pricing and delivery.",
        "Color samples, photos, and digital renders are meant as a guide only. Batch variation, lighting, and subfloor condition can all affect the final look, so we recommend approving physical samples for important spaces.",
      ],
    },
    {
      id: "payment",
      title: "Pricing and Payment",
      paragraphs: [
        "Unless stated otherwise on your quotation, prices exclude VAT and other applicable duties, added at the current rate. Payment terms, deposits, and milestone stages are detailed in your project documents.",
        "If a deposit is required, materials are only ordered once payment is received. Late payments may delay delivery or installation, and where the contract allows it, may result in interest charges or a pause in work until payment is resolved.",
      ],
    },
    {
      id: "delivery",
      title: "Delivery and Ownership",
      paragraphs: [
        "Delivery dates are estimates, based on manufacturer lead times, shipping, and customs clearance. We'll keep you updated on any major changes, but we're not responsible for indirect losses caused by delays outside our control.",
        "Once materials are delivered to your site or a nominated storage location, the risk transfers to you. Ownership of the materials only passes once we've received payment in full. You're responsible for keeping delivered materials stored securely, dry, and level.",
      ],
    },
    {
      id: "installation",
      title: "Your Responsibilities On-Site",
      paragraphs: [
        "If we're handling installation, you're responsible for providing safe access, power, proper storage, and enough time for materials to cure and acclimatize. Please disclose any existing site services, moisture issues, or structural concerns before work begins.",
        "If site conditions don't meet manufacturer requirements, we may need to pause installation and issue a variation until the subfloor is properly prepared.",
      ],
    },
    {
      id: "variations",
      title: "Changes, Delays, and Cancellations",
      paragraphs: [
        "Any change in scope, product, area, or sequencing is documented as a written variation, showing its impact on cost and timeline. If instructions are given verbally on-site, we'll confirm them in writing before acting on them.",
        "If a project is postponed or cancelled after materials are ordered, you remain responsible for non-returnable items, manufacturer restocking fees, and any work already completed. Custom or cut-to-size products generally can't be returned.",
      ],
    },
    {
      id: "warranties",
      title: "Warranties and Ongoing Care",
      paragraphs: [
        "Manufacturer warranties apply based on the specific solution used in your project. If installation workmanship warranties are included, their coverage and duration are detailed in your project documents.",
        "Warranties don't cover damage caused by misuse, wrong cleaning products, unauthorized repairs, building movement, water damage from other trades, or skipping the maintenance guide provided at handover.",
        "If you notice a possible defect, please report it in writing as soon as possible so we can assess it before further wear affects our evaluation.",
      ],
    },
    {
      id: "website",
      title: "Using Our Website",
      paragraphs: [
        "You're welcome to browse our site, download catalogues for project use, and reach out with enquiries. Please don't misuse the website, attempt to access restricted areas, scrape content in bulk, or present our materials as your own specification library.",
        "We work hard to keep our website accurate and available, but we can't guarantee it will always be uninterrupted. Product details and downloads may change as our offerings are updated.",
      ],
    },
    {
      id: "ip",
      title: "Ownership of Our Content",
      paragraphs: [
        "All trademarks, photos, drawings, catalogues, and written content on this site belong to Mahraj Arabia or our licensors. You're free to share pages or documents for genuine project communication, but you may not reproduce, resell, or remove attribution from them without our written permission.",
      ],
    },
    {
      id: "confidentiality",
      title: "Keeping Information Confidential",
      paragraphs: [
        "Drawings, tender details, and pricing shared during a project are treated as confidential and only shared internally with people who need them to complete the work. We expect the same discretion from clients regarding our rates and technical proposals.",
      ],
    },
    {
      id: "liability",
      title: "Limits on Our Responsibility",
      paragraphs: [
        "Information on our website is shared in good faith to guide you, but it doesn't replace a site-specific specification, moisture survey, or structural assessment. We're not responsible for decisions made based solely on website content.",
        "To the extent allowed by law, our liability for any claim related to website use is limited to what you've paid us (if anything) for that specific service. Liability tied to an actual project is governed by your signed project documents.",
        "Nothing here limits liability that can't legally be excluded under Saudi law, including liability for fraud or personal injury caused by negligence.",
      ],
    },
    {
      id: "indemnity",
      title: "Your Responsibility to Us",
      paragraphs: [
        "You agree to cover any claims that arise from misusing our website, breaching these terms, or providing inaccurate information that leads to loss, rework, or third-party claims.",
      ],
    },
    {
      id: "force-majeure",
      title: "When Things Are Out of Our Control",
      paragraphs: [
        "Neither of us is responsible for delays caused by events beyond reasonable control, such as extreme weather, port or customs disruptions, manufacturer shutdowns, utility failures, civil unrest, or new laws. Affected obligations are paused during the event, and timelines are adjusted accordingly.",
      ],
    },
    {
      id: "third-parties",
      title: "Links and Partner Services",
      paragraphs: [
        "Our website may link to maps, social platforms, or manufacturer resources. These sites operate under their own terms, and we're not responsible for their content or availability.",
        "We may also work with authorized partners, logistics providers, or specialist installers to complete your project. They're required to follow the same confidentiality and quality standards we uphold.",
      ],
    },
    {
      id: "general",
      title: "If Part of These Terms Doesn't Apply",
      paragraphs: [
        "If any part of these terms is found to be unenforceable, the rest will still remain valid. If we don't immediately enforce a right, that doesn't mean we've given it up.",
        "Together with your project documents, these terms make up our complete agreement regarding website use, replacing any earlier discussions on the same topic.",
      ],
    },
    {
      id: "law",
      title: "Which Laws Apply",
      paragraphs: [
        "These terms are governed by the laws of the Kingdom of Saudi Arabia. Any disputes related to website use fall under the exclusive jurisdiction of Riyadh courts, unless your signed project contract states otherwise.",
      ],
    },
    {
      id: "contact-terms",
      title: "Contact Our Commercial Team",
      paragraphs: [],
      bullets: [
        "Email: Waseem@mahraj.com, KSAevents@mahraj.com",
        "Phone: KSA +966 56 602 1891, UAE +971 50 882 2414",
      ],
    },
  ],
};

export const privacyDocument: LegalDocument = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  breadcrumb: "Privacy Policy",
  description:
    "We explain clearly how Mahraj Arabia collects, stores, and safeguards your personal details whenever you reach out, request a quote, or work with us on a project.",
  heroImage: "/images/legal/privacy-hero.png",
  lastUpdated: "23 September 2026",
  highlights: [
    { label: "Last Updated", value: "23 September 2026" },
    { label: "Information Collected", value: "Enquiries & project details" },
    { label: "Privacy Questions", value: "Waseem@mahraj.com" },
  ],
  keyPointsTitle: "How We Use Your Data",
  keyPointsDescription:
    "A quick overview of how we collect, use, and protect your information. You can find the full details further down this page.",
  keyPoints: [
    {
      icon: UserCheck,
      title: "What We Collect",
      description:
        "Your name, company details, contact information, and anything you share through our enquiry or quotation forms.",
    },
    {
      icon: ShieldCheck,
      title: "Why We Use It",
      description:
        "To prepare quotes, arrange site surveys, manage installation, and follow up with aftercare. We never sell your data to anyone.",
    },
    {
      icon: Lock,
      title: "Who We Share It With",
      description:
        "Only with installation teams, delivery partners, manufacturers handling warranties, and trusted providers that support our systems.",
    },
    {
      icon: Mail,
      title: "Your Rights & Choices",
      description:
        "You can request access, corrections, or deletion of your data, or unsubscribe from emails anytime using the link provided.",
    },
  ],
  intro:
    "At Mahraj Arabia, we understand that sharing your personal or project details takes trust. This policy explains, in simple terms, what information we collect when you visit our website, request a quote, sign up for updates, or work with us on a project, and exactly how we handle it.",
  related: { label: "Terms of Service", href: "/terms" },
  cta: {
    title: "Have a Question About Your Data?",
    description:
      "Whether you want to access, correct, or delete your information, our team is here to help, just reach out anytime.",
  },
  sections: [
    {
      id: "who-we-are",
      title: "Who Manages Your Data",
      paragraphs: [
        "Mahraj Arabia is responsible for the personal data collected through our website and enquiry channels. We're based at Building 5207, Street 392, Al Malqa District, Riyadh 13525, Saudi Arabia.",
        'Got a privacy question or request? Email Waseem@mahraj.com or KSAevents@mahraj.com with the subject "Privacy Request," and we\'ll get back to you promptly.',
      ],
    },
    {
      id: "what-we-collect",
      title: "What Information We Collect",
      paragraphs: [
        "We only collect what's needed to serve you well, nothing more:",
      ],
      bullets: [
        "Contact details: Your name, company, email, and phone number",
        "Project information: The solution you're interested in, location, area size, and any message you send us",
        "Newsletter details: If you subscribe to our project insights",
        "Technical data: Browser type, device, IP address, and pages you visit on our site",
        "Conversation records: From email, WhatsApp, or phone calls with our team",
      ],
    },
    {
      id: "how-we-collect",
      title: "How We Collect Your Information",
      paragraphs: [
        "There are only a few simple ways your data gets to us:",
      ],
      bullets: [
        "You submit it directly through a form, email, call, or message.",
        "Our website collects some technical data automatically through cookies and server logs.",
        "A colleague or contractor on your project team shares it with us on your behalf.",
        "We occasionally verify publicly available business details.",
      ],
    },
    {
      id: "how-we-use",
      title: "Why We Use Your Data",
      paragraphs: [
        "We only use your information for genuine business reasons connected to your project:",
      ],
      bullets: [
        "Responding to quote requests, site surveys, and technical questions",
        "Preparing specifications, proposals, and documentation",
        "Managing material delivery, installation, and aftercare",
        "Sending catalogs or insight emails you've asked for",
        "Improving our website's performance and content",
        "Meeting legal, accounting, and warranty obligations",
      ],
    },
    {
      id: "legal-basis",
      title: "The Legal Basis Behind Our Processing",
      paragraphs: [
        "Depending on the situation, we process your data based on the following grounds (and if we're relying on your consent, you're free to withdraw it anytime without affecting anything we've already processed):",
      ],
      bullets: [
        "Your consent, such as subscribing to our newsletter",
        "Contractual necessity, like preparing quotes or managing installations",
        "Legitimate business interest, such as running and securing our operations",
        "Legal obligation, like tax and record-keeping requirements",
      ],
    },
    {
      id: "marketing",
      title: "Your Communication Choices",
      paragraphs: [
        "We only send project insights and updates to people who've asked for them or clients working with us on relevant projects.",
        "Every marketing email includes a simple unsubscribe link. Note that opting out of marketing won't stop essential updates, like delivery notices or installation scheduling. Those are part of your active project.",
      ],
    },
    {
      id: "sharing",
      title: "Who We Share Your Data With",
      paragraphs: [
        "We never sell your personal information. We only share it with trusted parties who help deliver the service you've requested:",
      ],
      bullets: [
        "Installation crews, logistics partners, and our regional offices",
        "Manufacturers, when a warranty claim or technical query needs it",
        "IT, hosting, email, and analytics providers working on our instructions",
        "Legal advisors or authorities, only where required by law",
      ],
    },
    {
      id: "cookies",
      title: "Cookies on Our Website",
      paragraphs: [
        "We use essential cookies to keep our website running smoothly and optional analytics cookies to understand which pages help our visitors most.",
        "You can manage or change your cookie preferences at any time through your browser settings. Just know that blocking some cookies may affect how forms or search features work on our site.",
      ],
    },
    {
      id: "retention",
      title: "How Long We Keep Your Data",
      paragraphs: [
        "We keep enquiry data until your project is complete, plus extra time for warranty and accounting needs. Newsletter data stays until you unsubscribe, and technical logs are kept only as long as needed for security and troubleshooting purposes.",
      ],
    },
    {
      id: "security",
      title: "Keeping Your Data Safe",
      paragraphs: [
        "We take real steps to protect your information, including access controls, secure hosting, and strict staff data handling practices.",
        "That said, no online transmission is ever 100% secure. Please avoid sending sensitive payment details through email, and reach out to us directly if anyone contacts you asking for unexpected payment information.",
      ],
    },
    {
      id: "breach",
      title: "If Something Ever Goes Wrong",
      paragraphs: [
        "In the rare event of a security incident affecting your data, we'll act quickly by investigating the issue, containing it, and notifying you (and relevant authorities, where legally required) without unnecessary delay.",
      ],
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      paragraphs: [
        "You have the right to access the personal data we hold, ask us to correct or delete it, restrict or object to certain processing, and opt out of marketing. We may verify your identity before completing requests and retain limited records for legal reasons. If unhappy with our response, contact your local data protection authority.",
      ],
    },
    {
      id: "international",
      title: "International Data Transfers",
      paragraphs: [
        "Since we operate across the GCC and work with cloud services and manufacturer partners, your data may sometimes be processed in a different country than where you submitted it. Wherever it goes, we make sure it's handled with the same level of protection outlined in this policy.",
      ],
    },
    {
      id: "children",
      title: "A Note About Children's Privacy",
      paragraphs: [
        "Our website is built for businesses, consultants, and contractors, not children. We don't knowingly collect data from minors. If you believe a child has shared information with us, please let us know, and we'll remove it right away.",
      ],
    },
    {
      id: "updates",
      title: "Updates to This Policy",
      paragraphs: [
        "As our services and tools evolve, we may update this policy to reflect those changes. You'll always find the most current version right here, along with the date it was last updated.",
      ],
    },
    {
      id: "contact-privacy",
      title: "Get in Touch About Privacy",
      paragraphs: [
        "Have a question or request about your personal data? We're happy to help.",
      ],
      bullets: [
        "Email: Waseem@mahraj.com, KSAevents@mahraj.com",
        "Phone: KSA +966 56 602 1891, UAE +971 50 882 2414",
        "Address: Building 5207, Street 392, Al Malqa District, Riyadh 13525, Saudi Arabia",
      ],
    },
  ],
};