# Mahraj Flooring CMS — QA Content Guide

This guide explains how to create Blog and Services content in the custom CMS.

CMS URL: `/admin`

Old `/manage` bookmarks permanently redirect to `/admin`.

---

## 1. Admin sidebar layout

Under the **Services** group you will see two collections:

| Sidebar item | Purpose |
|---|---|
| **Main Services (Mega Menu)** | Column headings in the header mega menu (organizers only — no public page) |
| **Sub Services** | Real service pages under `/services/[slug]` and links inside those mega-menu columns |

Under **Blog** (or similar content group):

| Sidebar item | Purpose |
|---|---|
| **Categories** | Blog topic chips / Explore topics |
| **Blog** (Posts) | Individual blog articles |
| **Media** | Images for blog + services |

---

## 2. Recommended create order

1. Upload images in **Media**
2. Create **Categories** (for blog)
3. Create **Blog** posts
4. Create **Main Services (Mega Menu)** first
5. Create **Sub Services** and pick a Main Service as **Parent**
6. Publish everything you want live
7. Check the website header mega menu and `/services`

---

## 3. Media

1. Open **Media → Create New**
2. Upload an image
3. Fill **Alt** text (required for accessibility)
4. Save

Use these images later when creating Categories, Blog posts, and Sub Services.

---

## 4. Blog Categories

1. Open **Categories → Create New**
2. Fill:
   - **Title** — e.g. `Installation`
   - **Slug** — auto from title (edit if needed)
   - **Subtitle** — short line under the topic card
   - **Image** — pick from Media
3. Save

Categories power “Explore topics” and blog filters. They are **not** the same as Services.

---

## 5. Blog posts

1. Open **Blog → Create New**
2. Fill required fields:
   - **Title**, **Slug**, **Excerpt**
   - **Cover Image**
   - **Category**
   - **Content** (rich text)
   - **Read time**, **Published at**, **Author** (optional author image)
3. Use **Save Draft** while editing
4. Click **Publish** when ready — you return to the list automatically

Check:
- `/blog` listing
- `/blog/[slug]` detail
- Featured / search / category filters

---

## 6. Main Services (Mega Menu)

Main Services are **organizers only**. They create the column titles in the header mega menu. They do **not** have their own public detail URL.

1. Open **Main Services (Mega Menu) → Create New**
2. Use the **Mega menu preview** at the top — it shows live column order
3. Fill:
   - **Title** — e.g. `Sports Flooring` (this is the column heading)
   - **Slug** — auto
   - **Menu position** — use **Move earlier / Move later**, or numbers like 10, 20, 30
   - **Show in mega menu** — leave checked to show the column
   - **Menu Description** — optional editor note only
4. **Publish**

Create one Main Service per mega-menu column you want. The list is sorted by Menu position (same order as the website).

**Faster:** on the Main Services list page, use **Drag & drop menu order** — drag rows, drop to save.

---

## 7. Sub Services

Sub Services are the real pages customers open.

1. Open **Sub Services → Create New**
2. Use the **Mega menu preview** — your link is highlighted under its parent column
3. Sidebar fields:
   - **Parent** — pick the Main Service column (required)
   - **Menu position** — **Move earlier / Move later**, or 10, 20, 30 under that column
   - **Show in mega menu** — show as a link under the parent column
   - **Detail Ready** — On = full detail page; Off = Coming Soon page

**Faster:** on the Sub Services list page, use **Drag & drop menu order** — links are grouped by Main Service; drag within a group.
3. **Listing** tab:
   - **Excerpt**, **Image** (required)
   - Optional **Related Services**
4. Fill **Hero & Overview**, **Applications Guide**, **Specs Tables**, **SEO** as needed
5. **Publish**

### What appears where

| Setting | Result |
|---|---|
| Parent Main Service published + Show In Mega Menu | Column appears in header |
| Sub Service published + Show In Mega Menu | Link under that column |
| Detail Ready = On | Full `/services/[slug]` page |
| Detail Ready = Off | Coming Soon page at same URL |

---

## 8. Website checks after publishing

1. Hard refresh the site
2. Open the **Services** mega menu in the header — columns = Main Services, links = Sub Services
3. Open `/services` — groups should match Main → Sub hierarchy
4. Open a Sub Service detail URL
5. Confirm images load (S3 / Media)

---

## 9. Draft vs Publish

- **Draft** — only visible in Admin (and preview if used)
- **Publish** — live on the website
- Save Draft / Publish buttons return you to the collection list

---

## 10. Reset commands (developers)

```bash
# Clear blog only (posts + categories)
npm run reset:blog

# Clear services only (sub services + main services)
npm run reset:services

# Clear blog + services
npm run reset:content

# Also clear media
npm run reset:content -- --media

# Load demo content
npm run seed

# Wipe then seed
npm run seed -- --fresh

# One-time: move old kind=main|sub data into the new collections
npm run migrate:services
```

Admin users are never deleted by reset scripts.

---

## 11. Troubleshooting

| Problem | Fix |
|---|---|
| Mega menu empty | Publish at least one Main Service and one Sub Service under it, both with Show In Mega Menu |
| Sub Service won’t save | Parent (Main Service) is required |
| Image broken | Re-upload in Media; confirm S3 env if using AWS |
| Old content after edit | Hard refresh; Publish again; cache revalidates on save |
| Still seeing old “Kind” field | Schema was split — use Main Services + Sub Services only |
