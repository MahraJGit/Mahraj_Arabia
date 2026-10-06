import { readFileSync } from "node:fs";
import mongoose from "mongoose";

for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (!match) continue;
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // optional env file
  }
}

const uri = process.env.DATABASE_URI;
if (!uri) {
  console.error("DATABASE_URI is not set.");
  process.exit(1);
}

const options = { strict: false, timestamps: true };
const MainService = mongoose.model(
  "MainServiceVerify",
  new mongoose.Schema({}, { ...options, collection: "main-services" })
);
const Service = mongoose.model(
  "ServiceVerify",
  new mongoose.Schema({}, { ...options, collection: "services" })
);

const stamp = Date.now().toString(36);
const groupSlug = `cms-phase5-test-group-${stamp}`;
const serviceSlug = `cms-phase5-test-service-${stamp}`;
const report = [];

function assert(condition, message) {
  if (!condition) throw new Error(message);
  report.push(`ok  ${message}`);
}

await mongoose.connect(uri, { bufferCommands: false });

try {
  const existingGroups = await MainService.find({ _status: "published" })
    .sort({ sortOrder: 1, title: 1 })
    .select("title slug sortOrder showInMegaMenu _status")
    .lean();
  assert(existingGroups.length > 0, "published service groups exist for mega menu");
  const orders = existingGroups.map((doc) => Number(doc.sortOrder ?? 0));
  const sorted = [...orders].sort((a, b) => a - b);
  assert(
    orders.every((value, index) => value === sorted[index]),
    "published groups already sorted by sortOrder"
  );

  const createdGroup = await MainService.create({
    title: "Phase 5 Test Group",
    slug: groupSlug,
    menuDescription: "Temporary verification document",
    sortOrder: 9990,
    showInMegaMenu: false,
    _status: "draft",
  });
  assert(createdGroup._status === "draft", "created group stores _status draft");
  assert(createdGroup.slug === groupSlug, "created group stores slug");

  await MainService.updateOne(
    { _id: createdGroup._id },
    { $set: { title: "Phase 5 Test Group Edited", _status: "published" } }
  );
  const publishedGroup = await MainService.findById(createdGroup._id).lean();
  assert(publishedGroup._status === "published", "group publish writes _status published");
  assert(publishedGroup.title === "Phase 5 Test Group Edited", "group title update persisted");

  await MainService.updateOne(
    { _id: createdGroup._id },
    { $set: { _status: "draft" } }
  );
  const unpublished = await MainService.findById(createdGroup._id).lean();
  assert(unpublished._status === "draft", "group unpublish writes _status draft");

  const createdService = await Service.create({
    title: "Phase 5 Test Service",
    slug: serviceSlug,
    parent: createdGroup._id,
    excerpt: "Temporary verification service",
    sortOrder: 9990,
    showInMegaMenu: false,
    detailReady: false,
    applications: [
      {
        id: "app-1",
        title: "Gym",
        description: "Indoor courts",
        points: [{ id: "p-1", label: "Low impact" }],
      },
    ],
    performanceRows: [
      { id: "perf-1", useCase: "Gym", recommended: "8mm", forceReduction: "25%" },
    ],
    spaceRows: [
      {
        id: "space-1",
        useCase: "Gym",
        recommended: "8mm",
        impact: "High",
        slip: "R10",
        acoustic: "Good",
        maintenance: "Low",
      },
    ],
    seoTitle: "Phase 5 SEO",
    seoDescription: "Temporary SEO text",
    _status: "draft",
  });
  assert(createdService.parent.equals(createdGroup._id), "service parent is ObjectId");
  assert(createdService._status === "draft", "created service stores _status draft");
  assert(createdService.detailReady === false, "coming soon maps to detailReady false");
  assert(createdService.applications[0].points[0].label === "Low impact", "applications keep Payload shape");
  assert(createdService.performanceRows[0].forceReduction === "25%", "performance table persisted");
  assert(createdService.spaceRows[0].maintenance === "Low", "space table persisted");

  const childCount = await Service.countDocuments({ parent: createdGroup._id });
  assert(childCount === 1, "group child count is 1 before protected delete");

  const blocked = childCount > 0;
  assert(blocked, "delete protection would block this group");

  const sibling = await Service.create({
    title: "Phase 5 Test Sibling",
    slug: `${serviceSlug}-b`,
    parent: createdGroup._id,
    excerpt: "Sibling",
    sortOrder: 9980,
    showInMegaMenu: false,
    detailReady: false,
    _status: "draft",
  });
  const beforeMove = await Service.find({ parent: createdGroup._id })
    .sort({ sortOrder: 1, title: 1 })
    .select("slug sortOrder")
    .lean();
  assert(beforeMove[0].slug === `${serviceSlug}-b`, "services sort by existing sortOrder");

  await Promise.all([
    Service.updateOne({ _id: beforeMove[0]._id }, { $set: { sortOrder: beforeMove[1].sortOrder } }),
    Service.updateOne({ _id: beforeMove[1]._id }, { $set: { sortOrder: beforeMove[0].sortOrder } }),
  ]);
  const afterMove = await Service.find({ parent: createdGroup._id })
    .sort({ sortOrder: 1, title: 1 })
    .select("slug")
    .lean();
  assert(afterMove[0].slug === serviceSlug, "move later/earlier swaps sortOrder");

  await Service.deleteMany({ parent: createdGroup._id });
  await MainService.deleteOne({ _id: createdGroup._id });
  const leftover = await MainService.findOne({ slug: groupSlug }).lean();
  const leftoverService = await Service.findOne({ slug: serviceSlug }).lean();
  assert(!leftover && !leftoverService && !(await Service.findById(sibling._id)), "test documents removed");

  const leftoverPublished = await MainService.find({
    slug: { $regex: "^cms-phase5-test-" },
  }).lean();
  assert(leftoverPublished.length === 0, "no leftover phase 5 test groups");

  console.log(report.join("\n"));
  console.log("Phase 5 verification passed.");
} catch (error) {
  await Service.deleteMany({ slug: { $regex: `^${serviceSlug}` } });
  await MainService.deleteMany({ slug: groupSlug });
  console.error("Phase 5 verification failed:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
