import { Schema } from "mongoose";

import { connectDb } from "./connect";

/**
 * strict: false keeps unknown stored fields intact so a later save cannot
 * strip data we have not modelled yet.
 */
const options = {
  strict: false,
  timestamps: true,
};

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, index: true },
    role: { type: String, enum: ["admin", "editor"] },
    hash: String,
    salt: String,
    loginAttempts: Number,
    lockUntil: Date,
  },
  { ...options, collection: "users" }
);

const MediaSchema = new Schema(
  {
    alt: String,
    caption: String,
    url: String,
    thumbnailURL: String,
    filename: String,
    originalFilename: String,
    displayFilename: String,
    mimeType: String,
    filesize: Number,
    width: Number,
    height: Number,
    focalX: Number,
    focalY: Number,
    checksum: { type: String, index: true },
    sizes: Schema.Types.Mixed,
  },
  { ...options, collection: "media" }
);

const CategorySchema = new Schema(
  {
    title: String,
    slug: { type: String, index: true },
    subtitle: String,
    image: { type: Schema.Types.ObjectId, ref: "Media" },
  },
  { ...options, collection: "categories" }
);

const PostSchema = new Schema(
  {
    title: String,
    slug: { type: String, index: true },
    excerpt: String,
    content: Schema.Types.Mixed,
    coverImage: { type: Schema.Types.ObjectId, ref: "Media" },
    seoTitle: String,
    seoDescription: String,
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    author: String,
    authorImage: { type: Schema.Types.ObjectId, ref: "Media" },
    readTime: String,
    publishedAt: Date,
    featured: Boolean,
    _status: { type: String, enum: ["draft", "published"] },
  },
  { ...options, collection: "posts" }
);

const MainServiceSchema = new Schema(
  {
    title: String,
    slug: { type: String, index: true },
    sortOrder: Number,
    showInMegaMenu: Boolean,
    menuDescription: String,
    _status: { type: String, enum: ["draft", "published"] },
  },
  { ...options, collection: "main-services" }
);

const ServiceSchema = new Schema(
  {
    title: String,
    slug: { type: String, index: true },
    parent: { type: Schema.Types.ObjectId, ref: "MainService" },
    sortOrder: Number,
    showInMegaMenu: Boolean,
    detailReady: Boolean,
    excerpt: String,
    image: { type: Schema.Types.ObjectId, ref: "Media" },
    overviewImage: { type: Schema.Types.ObjectId, ref: "Media" },
    relatedServices: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    detailTitle: String,
    heroTitle: String,
    heroDescription: String,
    overviewTitle: String,
    overviewDescription: String,
    guideTitle: String,
    guideDescription: String,
    applications: [Schema.Types.Mixed],
    showPerformanceMatrix: Boolean,
    performanceTitle: String,
    performanceDescription: String,
    performanceLabels: [String],
    performanceRows: [Schema.Types.Mixed],
    density: String,
    warranty: String,
    brandingTitle: String,
    brandingDescription: String,
    brandColorLabel: String,
    brandColors: [{ hex: String, selected: Boolean }],
    showSpaceRequirements: Boolean,
    spaceTitle: String,
    spaceDescription: String,
    spaceLabels: [String],
    spaceRows: [Schema.Types.Mixed],
    showProcess: Boolean,
    processTitle: String,
    processDescription: String,
    processSteps: [Schema.Types.Mixed],
    faqIntro: String,
    faqs: [Schema.Types.Mixed],
    caseStudiesTitle: String,
    caseStudiesDescription: String,
    projectsTitle: String,
    projectsDescription: String,
    seoTitle: String,
    seoDescription: String,
    _status: { type: String, enum: ["draft", "published"] },
  },
  { ...options, collection: "services" }
);

function modelOn(conn, name, schema) {
  return conn.models[name] ?? conn.model(name, schema);
}

export async function getModels() {
  const conn = await connectDb();

  return {
    conn,
    User: modelOn(conn, "User", UserSchema),
    Media: modelOn(conn, "Media", MediaSchema),
    Category: modelOn(conn, "Category", CategorySchema),
    Post: modelOn(conn, "Post", PostSchema),
    MainService: modelOn(conn, "MainService", MainServiceSchema),
    Service: modelOn(conn, "Service", ServiceSchema),
  };
}
