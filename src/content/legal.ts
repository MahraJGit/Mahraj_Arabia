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
  /** Shown after the bullet list when present. */
  afterBullets?: string[];
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
    "These terms cover website use, quotations, project coordination, delivery, installation, and our responsibilities when supplying modular, portable fencing, and steel solutions through Mahraj Arabia.",
  heroImage: "/images/heroes/terms-hero.jpg",
  lastUpdated: "9 October 2026",
  highlights: [
    { label: "Last Updated", value: "9 October 2026" },
    {
      label: "Covers",
      value: "Website use and modular, portable fencing and steel services",
    },
    { label: "Governed By", value: "Laws of the Kingdom of Saudi Arabia" },
  ],
  keyPointsTitle: "The Key Points",
  keyPointsDescription:
    "These points provide a quick overview. Your signed quotation, purchase order, or project contract takes priority where it sets out different terms.",
  keyPoints: [
    {
      icon: FileSignature,
      title: "Your Contract Comes First",
      description:
        "The written quotation or project agreement confirms the agreed scope, price, responsibilities, and delivery arrangements.",
    },
    {
      icon: HandCoins,
      title: "Online Information Is a Guide",
      description:
        "Website descriptions and images help explain our solutions. Final specifications, pricing, availability, and timelines depend on the written project quotation.",
    },
    {
      icon: Truck,
      title: "Your Site Must Be Ready",
      description:
        "You are responsible for providing suitable site access, working space, and required site preparations unless these are included in our agreed scope.",
    },
    {
      icon: BadgeCheck,
      title: "Follow the Agreed Requirements",
      description:
        "Use and maintain supplied products according to the relevant instructions and project documents to help preserve their condition and any applicable warranty.",
    },
  ],
  intro:
    "These terms apply when you visit our website, request a quotation, discuss a project, or engage Mahraj Arabia to supply or provide agreed services. A signed quotation, purchase order, or project contract will take priority over these general terms wherever it specifies different conditions.",
  related: { label: "Privacy Policy", href: "/privacy-policy" },
  cta: {
    title: "Still Have a Question About Your Project Terms?",
    description:
      "Contact our team to discuss your requirements, clarify the agreed scope, or understand the next steps for your project.",
  },
  sections: [
    {
      id: "acceptance",
      title: "Agreeing to These Terms",
      paragraphs: [
        "By using our website or proceeding with our services, you agree to the terms that apply to your activity or project.",
      ],
      bullets: [
        "If you are acting on behalf of a company, you confirm that you are authorized to make enquiries or enter into relevant agreements for that organization.",
        "We may update these terms when necessary. The version published on our website applies to website use, while any signed project agreement remains subject to its own terms.",
      ],
    },
    {
      id: "definitions",
      title: "A Few Key Terms",
      paragraphs: [
        'In these terms, "we," "us," and "our" refer to Mahraj Arabia. "You" and "client" refer to the person or organization enquiring about or purchasing our services.',
      ],
      bullets: [
        '"Solutions" or "works" means the modular units, portable structures, fencing, steel products, fabrication, delivery, installation, and related services included in the agreed quotation.',
        '"Project documents" means the written quotation, specifications, drawings, purchase order, agreement, and other documents confirmed for your project.',
      ],
    },
    {
      id: "quotes",
      title: "How Orders Are Confirmed",
      paragraphs: [
        "An order becomes binding when we confirm it in writing or accept it through the agreed purchasing process.",
        "The written quotation identifies the agreed scope, specifications, quantities, pricing, and relevant delivery or installation arrangements. Any changes may affect the cost, schedule, materials, or work required.",
        "Website photographs, illustrations, and product descriptions are provided as general guidance. Final dimensions, finishes, configurations, and technical requirements should be confirmed in the project documents before work begins.",
      ],
    },
    {
      id: "payment",
      title: "Pricing and Payment",
      paragraphs: [
        "Our prices and payment terms are set out in the relevant quotation or project agreement. Unless stated otherwise, applicable taxes, duties, transport, installation, or additional work may be charged separately.",
      ],
      bullets: [
        "Deposits and Advance Payments: These apply where specified in the agreed terms.",
        "Payment Before Work Begins: We may require payment before ordering materials, starting fabrication, or scheduling delivery.",
        "Late or Incomplete Payments: These may affect project progress and delivery schedules. Any applicable charges, work pauses, or revised timelines will be handled according to the agreed terms and applicable law.",
      ],
    },
    {
      id: "delivery",
      title: "Delivery and Ownership",
      paragraphs: [
        "Delivery dates are estimates unless expressly confirmed as binding in the project agreement. Scheduling may depend on material availability, fabrication, transport, site access, and other project requirements.",
      ],
      bullets: [
        "We will communicate material changes to delivery arrangements where reasonably possible.",
        "You are responsible for ensuring the delivery location is accessible and prepared to receive the agreed items.",
        "Responsibility for goods and transfer of ownership will follow the terms in your quotation or contract and applicable law.",
        "Where goods are delivered before installation, you must take reasonable care of them after responsibility has transferred to you.",
      ],
    },
    {
      id: "installation",
      title: "Your Responsibilities On-Site",
      paragraphs: [
        "You must provide suitable site access, accurate project information, and a safe working area for the agreed delivery or installation activities.",
        "Unless included in our scope, you are responsible for:",
      ],
      bullets: [
        "Obtaining required site permissions and arranging access.",
        "Preparing the location for the agreed work.",
        "Informing us of relevant site restrictions, underground services, structural concerns, or other conditions that could affect delivery or installation.",
      ],
      afterBullets: [
        "If the site is not ready or safe, work may need to be postponed until the issue is resolved. Any resulting additional costs or schedule changes will be addressed under the agreed project terms.",
      ],
    },
    {
      id: "variations",
      title: "Changes, Delays, and Cancellations",
      paragraphs: [
        "Requests to change the design, dimensions, quantities, materials, finishes, delivery arrangements, or installation scope must be confirmed in writing.",
      ],
      bullets: [
        "Changes to the Project: These may affect pricing and completion dates.",
        "Cancellations After Work Begins: You may be responsible for committed costs, completed work, and other charges permitted under your agreement.",
        "Custom Made Items: Project specific products may not be eligible for cancellation or return once production has begun, subject to the agreed terms and applicable law.",
      ],
    },
    {
      id: "warranties",
      title: "Warranties and Ongoing Care",
      paragraphs: [
        "Any product warranty or workmanship warranty will be governed by the relevant manufacturer documentation and the terms stated in your quotation or project agreement.",
        "Warranty coverage may exclude damage caused by:",
      ],
      bullets: [
        "Misuse or improper handling.",
        "Unauthorized modifications.",
        "Improper maintenance or care.",
        "Accidents or conditions outside the agreed scope.",
      ],
      afterBullets: [
        "Specific exclusions and claim requirements depend on the product and applicable warranty.",
        "Please report suspected defects promptly and provide relevant details or photographs where helpful. We will review the matter against the applicable project documents and warranty terms.",
      ],
    },
    {
      id: "website",
      title: "Using Our Website",
      paragraphs: [
        "You agree to use our website lawfully and responsibly. You must not attempt to disrupt its operation, access restricted systems without permission, misuse its content, or submit misleading information.",
      ],
      bullets: [
        "We aim to keep website information useful and up to date, but we do not guarantee uninterrupted availability or that every page will always be free from errors.",
        "Product details, service descriptions, and downloadable materials may change as our offerings develop.",
        "Confirm project specific requirements with our team before making purchasing decisions.",
      ],
    },
    {
      id: "ip",
      title: "Ownership of Our Content",
      paragraphs: [
        "Unless stated otherwise, our website text, branding, graphics, photographs, drawings, catalogues, and other content belong to Mahraj Arabia or the relevant rights holders.",
        "You may use shared materials for legitimate discussions about a project, where permitted. You must not reproduce, modify, publish, sell, or redistribute our content without the required permission.",
        "Our company names, logos, and other marks must not be used in a way that suggests an unauthorized partnership or endorsement.",
      ],
    },
    {
      id: "confidentiality",
      title: "Keeping Information Confidential",
      paragraphs: [
        "Project quotations, drawings, specifications, tender information, pricing, and other non-public details may be confidential.",
      ],
      bullets: [
        "You agree to use confidential information only for the purpose for which it was shared.",
        "You must not disclose confidential information to unauthorized parties, except where disclosure is required by law or agreed in writing.",
        "Where necessary, you may share project information with authorized colleagues or professional advisers who need it for the relevant work and are subject to appropriate confidentiality obligations.",
      ],
    },
    {
      id: "liability",
      title: "Limits on Our Responsibility",
      paragraphs: [
        "Website information is general guidance and does not replace a project specific assessment, confirmed specification, or professional advice where required.",
        "Our responsibilities for supply, fabrication, delivery, and installation are determined by the agreed project documents. To the extent permitted by applicable law, we are not responsible for indirect losses arising from matters outside our agreed obligations.",
        "Nothing in these terms excludes or limits liability that cannot lawfully be excluded or limited under the laws of the Kingdom of Saudi Arabia.",
      ],
    },
    {
      id: "indemnity",
      title: "Your Responsibility to Us",
      paragraphs: [
        "You are responsible for providing accurate project information, obtaining required permissions within your control, and complying with the agreed terms.",
        "Where your breach of these terms, misuse of our website, or inaccurate information causes any of the following, you may be responsible to the extent permitted by the project agreement and applicable law:",
      ],
      bullets: [
        "Loss or damage.",
        "Additional work or associated costs.",
        "Third party claims arising from the relevant breach or conduct.",
      ],
      afterBullets: [
        "We will assess any such matter in light of the circumstances, the agreed responsibilities, and relevant legal requirements.",
      ],
    },
    {
      id: "force-majeure",
      title: "When Things Are Out of Our Control",
      paragraphs: [
        "Some events may delay or prevent performance despite reasonable planning. These may include:",
      ],
      bullets: [
        "Severe weather.",
        "Transport or port disruption.",
        "Customs delays or material shortages.",
        "Manufacturer delays.",
        "Utility interruptions.",
        "Government restrictions or civil unrest.",
        "Changes in applicable law.",
      ],
      afterBullets: [
        "Where such an event affects a project, we will take reasonable steps to communicate its impact and review the schedule.",
        "Our affected obligations may be suspended or timelines adjusted to the extent permitted by the agreement and applicable law.",
      ],
    },
    {
      id: "third-parties",
      title: "Links and Partner Services",
      paragraphs: [
        "Our website may contain links to third-party websites or services for additional information. We do not control their content, availability, or privacy practices.",
        "Some projects may involve manufacturers, delivery partners, specialist installers, or other service providers. Their responsibilities will depend on the agreed project arrangements.",
        "Where third parties are involved in our work, we will coordinate their role as appropriate to the scope we have accepted. Separate third party terms may also apply.",
      ],
    },
    {
      id: "general",
      title: "If Part of These Terms Doesn't Apply",
      paragraphs: [
        "If any part of these terms is found to be invalid or unenforceable, the remaining provisions will continue to apply to the extent permitted by law.",
        "A delay or failure to enforce a provision does not automatically waive our right to enforce it later.",
        "These terms, together with the applicable quotation, purchase order, and project agreement, set out the relevant understanding between the parties. Where project documents contain specific conditions, those conditions take priority for that project.",
      ],
    },
    {
      id: "law",
      title: "Which Laws Apply",
      paragraphs: [
        "These terms are governed by the laws of the Kingdom of Saudi Arabia.",
        "Any dispute will be handled by the competent courts of Saudi Arabia, subject to applicable law and any dispute resolution provisions expressly stated in the relevant project agreement.",
      ],
    },
    {
      id: "contact-terms",
      title: "Contact Our Commercial Team",
      paragraphs: [
        "For questions about these terms, quotations, or project requirements, contact our team.",
      ],
      bullets: [
        "Email: Waseem@mahraj.com",
        "Additional Email: KSAevents@mahraj.com",
        "Saudi Arabia: +966 56 602 1891",
        "UAE: +971 50 882 2414",
        "Address: Building 5207, Street 392, Al Malqa District, Riyadh 13525, Saudi Arabia",
      ],
    },
  ],
};

export const privacyDocument: LegalDocument = {
  slug: "privacy-policy",
  title: "Privacy Policy",
  breadcrumb: "Privacy Policy",
  description:
    "We explain how Mahraj Arabia collects, uses, stores, and protects your information when you contact us, request a quotation, or work with us on a modular, portable, or steel project.",
  heroImage: "/images/heroes/privacy-hero.jpg",
  lastUpdated: "9 October 2026",
  highlights: [
    { label: "Last Updated", value: "9 October 2026" },
    {
      label: "Information Collected",
      value: "Contact details, enquiries, and project requirements",
    },
    { label: "Privacy Questions", value: "Waseem@mahraj.com" },
  ],
  keyPointsTitle: "How We Use Your Data",
  keyPointsDescription:
    "We use your information to respond to enquiries, prepare quotations, coordinate projects, and improve our services.",
  keyPoints: [
    {
      icon: UserCheck,
      title: "What We Collect",
      description:
        "We may collect your name, company details, contact information, project requirements, and website usage data.",
    },
    {
      icon: ShieldCheck,
      title: "Why We Use It",
      description:
        "We use your data to understand needs, prepare proposals, coordinate delivery and installation, and support projects. We never sell it.",
    },
    {
      icon: Lock,
      title: "Who We Share It With",
      description:
        "Where necessary, we share relevant details with delivery partners, installation teams, manufacturers, and trusted service providers involved in our work.",
    },
    {
      icon: Mail,
      title: "Your Rights & Choices",
      description:
        "You have the option to access your data, request changes or deletion where allowed, and stop non-essential communications.",
    },
  ],
  intro:
    "At Mahraj Arabia, we understand that sharing personal or project information requires trust. This policy explains what we collect when you visit our website, request a quote, contact our team, or work with us, and how we handle that information.",
  related: { label: "Terms of Service", href: "/terms" },
  cta: {
    title: "Have a Question About Your Data?",
    description:
      "Contact our team for help with your information or privacy request. We will review your enquiry and respond as appropriate.",
  },
  sections: [
    {
      id: "who-we-are",
      title: "Who Manages Your Data",
      paragraphs: [
        "Mahraj Arabia manages the personal information collected through our website and business communications. We use this information to respond to enquiries and support projects involving modular spaces, portable units, fencing, and steel solutions across Saudi Arabia.",
        'For privacy related requests, contact Waseem@mahraj.com or KSAevents@mahraj.com with the subject line "Privacy Request."',
      ],
    },
    {
      id: "what-we-collect",
      title: "What Information We Collect",
      paragraphs: [
        "The information we collect depends on how you contact us and the services you request.",
        "Please share only the information needed to discuss your requirements.",
      ],
      bullets: [
        "Contact Details: Your name, company name, email address, and phone number.",
        "Project Information: Required solutions, project location, dimensions, site conditions, timelines, and details shared in your enquiry.",
        "Communication Records: Relevant emails, messages, calls, and discussions about quotations or projects.",
        "Technical Data: Where collected, your browser type, device information, IP address, and pages visited.",
        "Marketing Preferences: Your preferences for receiving updates or other communications, where applicable.",
      ],
    },
    {
      id: "how-we-collect",
      title: "How We Collect Your Information",
      paragraphs: [
        "We collect information through the following channels:",
      ],
      bullets: [
        "You provide details through website forms, emails, phone calls, or messages.",
        "Our website may collect technical information automatically through cookies, server logs, and similar technologies.",
        "A project colleague or contractor may provide relevant information when coordinating a request on your behalf.",
        "We may consult publicly available business information when necessary for legitimate business purposes.",
      ],
    },
    {
      id: "how-we-use",
      title: "Why We Use Your Data",
      paragraphs: [
        "We use personal information for purposes related to our services and business operations:",
      ],
      bullets: [
        "Responding to quotation requests, site surveys, and technical enquiries.",
        "Preparing specifications, proposals, and project documentation.",
        "Coordinating material delivery, installation, and aftercare.",
        "Sending requested catalogs or project updates, where applicable.",
        "Maintaining and improving website functionality and content.",
        "Meeting applicable legal, accounting, warranty, and record keeping requirements.",
      ],
    },
    {
      id: "legal-basis",
      title: "The Legal Basis Behind Our Processing",
      paragraphs: [
        "Where applicable, we process personal information based on:",
      ],
      bullets: [
        "Consent: When you agree to a specific use of your information.",
        "Pre-contractual Steps: When processing is necessary to respond to your request before agreeing.",
        "Contractual Requirements: When information is needed to fulfill an agreement or provide agreed services.",
        "Legitimate Business Interests: When processing supports our operations and does not override your applicable rights.",
        "Legal Obligations: When we must process or retain information to comply with applicable laws.",
      ],
      afterBullets: [
        "The appropriate basis depends on the information involved and the purpose for which we use it.",
        "Where required, you may withdraw your consent, subject to any applicable legal or contractual obligations.",
      ],
    },
    {
      id: "marketing",
      title: "Your Communication Choices",
      paragraphs: [
        "We may contact you to answer an enquiry, provide a quotation, confirm project details, or share important delivery and installation updates.",
        "We send promotional updates only where appropriate and permitted. If we offer marketing emails, you can unsubscribe using the available option or contact us directly.",
        "Unsubscribing from promotional communications does not stop essential messages relating to an active enquiry, quotation, or project.",
      ],
    },
    {
      id: "sharing",
      title: "Who We Share Your Data With",
      paragraphs: [
        "We do not sell your personal information. We share relevant details only where needed to support our business operations or meet legal requirements.",
        "Depending on the project, recipients may include:",
      ],
      bullets: [
        "Delivery and Logistics Partners: To coordinate material transportation and delivery.",
        "Installation Teams: To arrange site access, installation, and project coordination.",
        "Manufacturers: To handle product related enquiries, warranties, or technical matters.",
        "Service Providers: To support our website, communications, and business systems.",
        "Legal or Regulatory Authorities: When disclosure is required by law or necessary to protect our legal rights.",
      ],
      afterBullets: [
        "Where appropriate, we limit shared information to what is necessary for the relevant purpose.",
      ],
    },
    {
      id: "cookies",
      title: "Cookies on Our Website",
      paragraphs: [
        "Our website may use essential cookies or similar technologies to support its basic functions. Analytics or other optional cookies may also be used if those tools are enabled.",
        "You can manage cookies through your browser settings. Disabling certain cookies may affect how parts of the website function.",
        "Where required, we will seek consent before using non-essential cookies.",
      ],
    },
    {
      id: "retention",
      title: "How Long We Keep Your Data",
      paragraphs: [
        "We retain personal information only for as long as reasonably necessary for the purpose for which it was collected.",
        "Retention periods may vary by information type:",
      ],
      bullets: [
        "Enquiry and Project Records: For the duration of the project and any applicable warranty, accounting, or legal period.",
        "Marketing Information: Until you unsubscribe or the information is no longer needed.",
        "Technical Records: According to operational, security, and legal requirements.",
      ],
      afterBullets: [
        "When information is no longer required, we take appropriate steps to delete or securely dispose of it.",
      ],
    },
    {
      id: "security",
      title: "Keeping Your Data Safe",
      paragraphs: [
        "We take reasonable measures to protect personal information against unauthorized access, loss, misuse, or disclosure.",
        "These measures may include access controls, secure systems, and appropriate internal practices. Access is limited to people and service providers who need the information for legitimate business purposes.",
        "No method of online transmission or electronic storage is completely secure. Please avoid sending unnecessary sensitive information through general enquiry channels.",
      ],
    },
    {
      id: "breach",
      title: "If Something Ever Goes Wrong",
      paragraphs: [
        "If we become aware of a personal data incident, we will assess the issue and take appropriate steps to contain it, investigate its cause, and reduce potential harm.",
        "Where notification is required by applicable law, we will notify the relevant individuals or authorities in accordance with those requirements.",
      ],
    },
    {
      id: "rights",
      title: "Your Privacy Rights",
      paragraphs: [
        "Depending on applicable law, you may have the right to request access to your personal information, correct inaccurate details, request deletion, or object to or restrict certain processing.",
        "You can also opt out of promotional communications. We may need to verify your identity before acting on a request.",
        "Some information may need to be retained to meet legal obligations, resolve disputes, or fulfill contractual requirements. If you have a concern about how your information is handled, contact us using the details below.",
      ],
    },
    {
      id: "international",
      title: "International Data Transfers",
      paragraphs: [
        "Some service providers, manufacturers, or business partners may process information outside the location where it was collected. This may occur when we use cloud based systems or coordinate projects across regions.",
        "Where international transfers take place, we will take appropriate steps to protect the information in accordance with applicable legal requirements.",
      ],
    },
    {
      id: "children",
      title: "A Note About Children's Privacy",
      paragraphs: [
        "Mahraj Arabia's website and services are intended for business customers, project teams, contractors, and other professional contacts.",
        "We do not knowingly collect personal information from children through our business services. If you believe a child has provided personal information to us, please contact us so we can review the matter and take appropriate action.",
      ],
    },
    {
      id: "updates",
      title: "Updates to This Policy",
      paragraphs: [
        "We may update this Privacy Policy when our business practices, website features, or legal requirements change.",
        "The latest version will appear on this page with its updated date. We encourage you to review this page occasionally to understand how we handle personal information.",
      ],
    },
    {
      id: "contact-privacy",
      title: "Get in Touch About Privacy",
      paragraphs: [
        "If you have questions about this policy or want to make a privacy-related request, contact our team.",
      ],
      bullets: [
        "Email: Waseem@mahraj.com",
        "Additional Email: KSAevents@mahraj.com",
        "Saudi Arabia: +966 56 602 1891",
        "UAE: +971 50 882 2414",
        "Address: Building 5207, Street 392, Al Malqa District, Riyadh 13525, Saudi Arabia",
      ],
    },
  ],
};
