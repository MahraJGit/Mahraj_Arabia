import {
  blocksToLexical,
  newBlockId,
  type EditorBlock,
} from "@/lib/cms/lexical";
import type { BlogCard, PublicPost } from "@/lib/public/blog";
import type { BlogCategory } from "@/lib/public/categories";

function p(text: string): EditorBlock {
  return { id: newBlockId(), type: "paragraph", spans: [{ text }] };
}

function h2(text: string): EditorBlock {
  return { id: newBlockId(), type: "heading", level: 2, spans: [{ text }] };
}

function h3(text: string): EditorBlock {
  return { id: newBlockId(), type: "heading", level: 3, spans: [{ text }] };
}

function ul(...items: string[]): EditorBlock {
  return {
    id: newBlockId(),
    type: "list",
    ordered: false,
    items: items.map((text) => [{ text }]),
  };
}

function quote(text: string): EditorBlock {
  return { id: newBlockId(), type: "quote", spans: [{ text }] };
}

function article(...blocks: EditorBlock[]) {
  return blocksToLexical(blocks);
}

export type ArabiaCategory = {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  image: string;
};

export const arabiaCategories: ArabiaCategory[] = [
  {
    id: "arabia-cat-planning",
    title: "Project Planning",
    slug: "project-planning",
    subtitle: "Briefs, logistics and installation",
    image: "/images/profile/steel-fabrication-workshop.jpg",
  },
  {
    id: "arabia-cat-quotations",
    title: "Quotations",
    slug: "quotations",
    subtitle: "What to prepare for a clear proposal",
    image: "/images/profile/porta-cabin-site-office.png",
  },
  {
    id: "arabia-cat-modular",
    title: "Modular Solutions",
    slug: "modular-solutions",
    subtitle: "Portable buildings and workplaces",
    image: "/images/profile/modular-meeting-room.png",
  },
  {
    id: "arabia-cat-steel",
    title: "Steel Fabrication",
    slug: "steel-fabrication",
    subtitle: "Structures, shades and custom steelwork",
    image: "/images/profile/steel-structure-frame.jpg",
  },
  {
    id: "arabia-cat-fencing",
    title: "Fencing & Barriers",
    slug: "fencing-barriers",
    subtitle: "Police barriers, Heras and corrugated fencing",
    image: "/images/profile/site-compound-fencing.jpg",
  },
];

type ArabiaPostInput = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  categoryId: string;
  author: string;
  readTime: string;
  publishedAt: string;
  featured: boolean;
  content: ReturnType<typeof article>;
};

const arabiaPostInputs: ArabiaPostInput[] = [
  {
    id: "arabia-post-1",
    slug: "how-to-plan-a-portable-site-office",
    title: "How to Plan a Portable Site Office",
    excerpt:
      "Define users, layout, access and utilities before requesting a Mahraj Arabia quotation.",
    image: "/images/profile/porta-cabin-site-office.png",
    categoryId: "arabia-cat-planning",
    author: "By Mahraj Arabia Team",
    readTime: "6 min read",
    publishedAt: "2026-05-14T08:00:00.000Z",
    featured: true,
    content: article(
      p(
        "A portable site office works best when it is planned around how people will actually use it—not only the footprint on the drawing. At Mahraj Arabia, clearer inputs at the start create faster fabrication and smoother handover on Saudi project sites."
      ),
      h2("Start with people and programme"),
      p(
        "List who will occupy the cabin each day, which roles need private rooms, and how long the unit must remain on site. Peak occupancy and shift patterns often change the room count more than overall headcount alone."
      ),
      ul(
        "Project managers, HSE and site engineers",
        "Meeting space for contractors and visitors",
        "Document storage and print areas",
        "Security or gatehouse needs at the entrance"
      ),
      h2("Access, power and placement"),
      p(
        "Confirm crane or truck access, level ground, and the nearest power and data points. Cabins placed too far from the works face create daily friction; cabins blocked by later phases create costly moves."
      ),
      h2("What to send for a quotation"),
      ul(
        "Preferred size or room count",
        "Location and target delivery window",
        "Electrical, HVAC and furniture expectations",
        "Any branding or exterior finish preferences"
      ),
      quote(
        "Share a short brief on WhatsApp with sketches or photos of the plot—our Riyadh team can refine the layout before fabrication begins."
      )
    ),
  },
  {
    id: "arabia-post-2",
    slug: "modular-building-quotation-checklist",
    title: "Modular Building Quotation Checklist",
    excerpt:
      "The information that helps Mahraj Arabia prepare a clearer and faster modular proposal.",
    image: "/images/profile/steel-fabrication-workshop.jpg",
    categoryId: "arabia-cat-quotations",
    author: "By Mahraj Arabia Team",
    readTime: "5 min read",
    publishedAt: "2026-06-02T08:00:00.000Z",
    featured: true,
    content: article(
      p(
        "Modular quotations move quickly when the brief answers the right questions up front. Use this checklist when you contact Mahraj Arabia for offices, meeting rooms, ablution units or custom modular complexes."
      ),
      h2("Project basics"),
      ul(
        "City and exact site location",
        "Intended use of each unit",
        "Quantity and approximate dimensions",
        "Required handover date or programme milestone"
      ),
      h2("Technical preferences"),
      ul(
        "Single or multi-room layouts",
        "Insulation, glazing and finish level",
        "Electrical, HVAC, plumbing and data preparation",
        "Furniture, partitions and storage needs"
      ),
      h2("Logistics"),
      p(
        "Note site access constraints, working hours, crane availability and whether installation should be included. Coordinated delivery is part of how we keep Saudi project programmes moving."
      ),
      quote(
        "A one-page brief with dimensions and photos is often enough for a practical first quotation."
      )
    ),
  },
  {
    id: "arabia-post-3",
    slug: "choosing-a-parking-shade-system",
    title: "Choosing a Parking Shade System",
    excerpt:
      "Key site, structural and visual considerations for parking shades across Saudi compounds.",
    image: "/images/profile/car-parking-shades.jpg",
    categoryId: "arabia-cat-steel",
    author: "By Mahraj Arabia Team",
    readTime: "7 min read",
    publishedAt: "2026-06-19T08:00:00.000Z",
    featured: true,
    content: article(
      p(
        "Parking shades protect vehicles and improve compound comfort, but the right system depends on span, wind exposure, vehicle mix and how the structure should look beside the building."
      ),
      h2("Match span to the parking layout"),
      p(
        "Count bays, aisle widths and turning clearances before choosing a frame. Oversized structures waste steel; undersized spans create awkward columns in drive lanes."
      ),
      h2("Climate and finish"),
      ul(
        "UV-stable fabric or solid cladding",
        "Galvanized or coated steel for long service life",
        "Drainage and runoff away from walkways",
        "Lighting and camera mounting if required"
      ),
      h2("How Mahraj Arabia helps"),
      p(
        "We review site photos, bay counts and preferred finishes, then fabricate and coordinate installation so the shade arrives ready for daily use."
      )
    ),
  },
  {
    id: "arabia-post-4",
    slug: "police-barriers-for-events-and-road-control",
    title: "Police Barriers for Events and Road Control",
    excerpt:
      "When heavy-duty steel police barriers are the right choice for perimeter control in Saudi Arabia.",
    image: "/images/profile/site-compound-fencing.jpg",
    categoryId: "arabia-cat-fencing",
    author: "By Mahraj Arabia Team",
    readTime: "6 min read",
    publishedAt: "2026-07-08T08:00:00.000Z",
    featured: true,
    content: article(
      p(
        "Police barriers are built for crowd direction, road closures and temporary perimeter control. Mahraj Arabia supplies heavy-duty steel sections that interlock quickly for government events, civic functions and active project sites."
      ),
      h2("Where police barriers work best"),
      ul(
        "Road closures and traffic diversion",
        "Government and public events",
        "Queue and crowd management",
        "Short-term site or compound boundaries"
      ),
      h2("What to specify"),
      p(
        "Share the linear metres required, gate openings, deployment date and whether barriers will move between phases. Interlocking steel sections should arrive with a clear install sequence so crews can set lines without delay."
      ),
      h3("Police barrier vs mesh fencing"),
      p(
        "Choose police barriers when you need visible, relocatable crowd control. Choose Heras or corrugated fencing when you need taller perimeter security or privacy screening."
      ),
      quote(
        "Tell us the route length and event dates—we can recommend quantities and delivery timing for Riyadh and wider KSA deployments."
      )
    ),
  },
  {
    id: "arabia-post-5",
    slug: "heras-fence-vs-corrugated-fence",
    title: "Heras Fence vs Corrugated Fence: Which Fits Your Site?",
    excerpt:
      "A practical comparison of temporary mesh panels and corrugated steel hoarding for Saudi projects.",
    image: "/images/profile/site-compound-fencing.jpg",
    categoryId: "arabia-cat-fencing",
    author: "By Mahraj Arabia Team",
    readTime: "7 min read",
    publishedAt: "2026-07-22T08:00:00.000Z",
    featured: false,
    content: article(
      p(
        "Temporary fencing is not one product. Heras mesh panels and corrugated sheet fencing solve different site problems. Choosing correctly protects people, materials and neighbour relations."
      ),
      h2("Heras fence"),
      p(
        "Heras-style mesh panels are fast to install, easy to relocate and ideal when visibility and ventilation matter—construction phases, event perimeters and temporary compounds."
      ),
      ul(
        "Galvanized mesh panels with stable bases",
        "Pedestrian and vehicle gate options",
        "Quick redeployment between project phases",
        "Clear sightlines for security teams"
      ),
      h2("Corrugated fence"),
      p(
        "Corrugated steel fencing creates a solid boundary for privacy, dust control and branded hoarding. It suits longer-running construction fronts and sites next to roads or occupied buildings."
      ),
      ul(
        "Solid sheet privacy screening",
        "Durable frames for site conditions",
        "Optional branding surfaces",
        "Stronger visual separation from the public"
      ),
      h2("How to decide"),
      p(
        "If the fence must move often and stay open to view, start with Heras. If the priority is privacy, presentation or hoarding, start with corrugated. Many Mahraj Arabia clients use both on the same programme—mesh for active work zones and corrugated along public edges."
      )
    ),
  },
  {
    id: "arabia-post-6",
    slug: "steel-structures-for-saudi-project-sites",
    title: "Steel Structures for Saudi Project Sites",
    excerpt:
      "How fabricated frames, sheds and platforms support industrial and infrastructure programmes.",
    image: "/images/profile/steel-structure-frame.jpg",
    categoryId: "arabia-cat-steel",
    author: "By Mahraj Arabia Team",
    readTime: "6 min read",
    publishedAt: "2026-08-05T08:00:00.000Z",
    featured: false,
    content: article(
      p(
        "Steel structures give Saudi projects durable covered space, platforms and supporting frames when modular cabins alone are not enough. Mahraj Arabia fabricates to the approved brief, then coordinates delivery around site access."
      ),
      h2("Common applications"),
      ul(
        "Workshops and storage sheds",
        "Mezzanines and access platforms",
        "Canopies and covered walkways",
        "Custom frames for equipment or process lines"
      ),
      h2("Briefing tips"),
      p(
        "Share loads, clear heights, opening sizes and any interface with existing buildings. Early clarity on foundations and crane access reduces redesign during fabrication."
      ),
      quote(
        "Custom steel fabrication is most efficient when drawings, photos and programme dates arrive together."
      )
    ),
  },
  {
    id: "arabia-post-7",
    slug: "from-brief-to-installation-mahraj-arabia",
    title: "From Brief to Installation: How Mahraj Arabia Delivers",
    excerpt:
      "Our working route from first requirement through fabrication, delivery and site handover.",
    image: "/images/profile/modular-crane-install.png",
    categoryId: "arabia-cat-planning",
    author: "By Mahraj Arabia Team",
    readTime: "5 min read",
    publishedAt: "2026-08-18T08:00:00.000Z",
    featured: false,
    content: article(
      p(
        "Mahraj Arabia is built around one clear route: understand the requirement, plan the solution, fabricate with control, then deliver and install around your programme."
      ),
      h2("1. Consult"),
      p(
        "We define use, size, location and schedule—whether you need porta cabins, modular offices, fencing, parking shades or steelwork."
      ),
      h2("2. Plan"),
      p(
        "Layouts, materials and services are coordinated before fabrication so the approved scope matches site reality."
      ),
      h2("3. Fabricate"),
      p(
        "Units and steel components are built with controlled workmanship, ready for transport to Riyadh and wider Saudi sites."
      ),
      h2("4. Deliver & install"),
      p(
        "Logistics, site work and handover are planned together so temporary or permanent solutions arrive ready for daily operation."
      ),
      quote(
        "Call +966 55 434 6336 or message us on WhatsApp with your project brief to start the same route."
      )
    ),
  },
  {
    id: "arabia-post-8",
    slug: "temporary-site-facilities-for-construction",
    title: "Temporary Site Facilities for Construction Programmes",
    excerpt:
      "Combining porta cabins, ablution units and fencing so construction sites stay productive and secure.",
    image: "/images/profile/portable-cabins-skyline.jpg",
    categoryId: "arabia-cat-modular",
    author: "By Mahraj Arabia Team",
    readTime: "6 min read",
    publishedAt: "2026-09-02T08:00:00.000Z",
    featured: false,
    content: article(
      p(
        "Construction programmes need more than one product. Offices, welfare units and perimeter fencing work best when planned as a connected package around access and programme phases."
      ),
      h2("A practical site package"),
      ul(
        "Porta cabins and site offices for management teams",
        "Ablution and sanitary units for workforce welfare",
        "Heras or corrugated fencing for secure boundaries",
        "Police barriers for temporary road or crowd control"
      ),
      h2("Plan for relocation"),
      p(
        "Active sites change. Specify which facilities must move with each phase and which can stay fixed. Relocatable fencing and modular units reduce downtime when the works face advances."
      ),
      h2("One supplier, clearer coordination"),
      p(
        "Mahraj Arabia fabricates and supplies modular, fencing and steel solutions from one brief—so quantities, delivery windows and installation teams stay aligned."
      )
    ),
  },
];

function categoryById(id: string) {
  return arabiaCategories.find((category) => category.id === id) ?? null;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toPublicPost(input: ArabiaPostInput): PublicPost {
  const category = categoryById(input.categoryId);
  return {
    id: input.id,
    title: input.title,
    slug: input.slug,
    excerpt: input.excerpt,
    content: input.content,
    coverImage: {
      id: `${input.id}-cover`,
      url: input.image,
      alt: input.title,
      caption: "",
      filename: "",
      mimeType: "image/jpeg",
      width: null,
      height: null,
      focalX: null,
      focalY: null,
      sizes: {},
    },
    seoTitle: `${input.title} | Mahraj Arabia`,
    seoDescription: input.excerpt,
    category: category
      ? { id: category.id, title: category.title, slug: category.slug }
      : null,
    author: input.author,
    authorImage: null,
    readTime: input.readTime,
    publishedAt: input.publishedAt,
    featured: input.featured,
    inlineMedia: {},
  };
}

export const arabiaPosts: PublicPost[] = arabiaPostInputs.map(toPublicPost);

export function getArabiaBlogCards(limit = 100): BlogCard[] {
  return arabiaPosts.slice(0, limit).map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    image: post.coverImage?.url || "/images/profile/steel-fabrication-workshop.jpg",
    imageAlt: post.coverImage?.alt || post.title,
    readTime: post.readTime,
    date: formatDate(post.publishedAt ?? ""),
    author: post.author,
    authorImage: "",
    authorImageAlt: "",
    category: post.category?.title ?? "Blogs",
    categorySlug: post.category?.slug ?? "",
    href: `/blog/${post.slug}`,
  }));
}

export function getArabiaFeaturedPosts(limit = 3): BlogCard[] {
  return getArabiaBlogCards()
    .filter((post) =>
      arabiaPosts.some((item) => item.id === post.id && item.featured)
    )
    .slice(0, limit);
}

export function getArabiaPostBySlug(slug: string): PublicPost | null {
  return arabiaPosts.find((post) => post.slug === slug) ?? null;
}

export function getArabiaPostSlugs() {
  return arabiaPosts.map((post) => post.slug);
}

export function getArabiaRelatedPosts(
  categorySlug: string,
  excludeId: string,
  limit = 3
): BlogCard[] {
  return getArabiaBlogCards()
    .filter(
      (post) =>
        post.id !== excludeId &&
        (!categorySlug || post.categorySlug === categorySlug)
    )
    .slice(0, limit);
}

export function getArabiaCategories(): BlogCategory[] {
  const counts = new Map<string, number>();
  for (const post of arabiaPosts) {
    const slug = post.category?.slug;
    if (!slug) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  return arabiaCategories.map((category) => ({
    id: category.id,
    title: category.title,
    slug: category.slug,
    subtitle: category.subtitle,
    image: category.image,
    postCount: counts.get(category.slug) ?? 0,
  }));
}

export function getArabiaPostsList({
  page = 1,
  limit = 6,
  categorySlug,
  search,
}: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  search?: string;
} = {}) {
  let docs = getArabiaBlogCards();

  if (categorySlug) {
    docs = docs.filter((post) => post.categorySlug === categorySlug);
  }

  if (search) {
    const q = search.trim().toLowerCase();
    docs = docs.filter(
      (post) =>
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q)
    );
  }

  const totalDocs = docs.length;
  const totalPages = totalDocs === 0 ? 0 : Math.ceil(totalDocs / limit);
  const start = Math.max(0, (page - 1) * limit);

  return {
    docs: docs.slice(start, start + limit),
    page,
    totalPages,
    totalDocs,
  };
}
