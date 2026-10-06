# Payload cutover notes

Payload was removed from the application in Phase 10. Production content
stays in MongoDB. Payload internal collections were **not** deleted.

## Historical scripts that were removed

These were one-time Payload Local API utilities. They are no longer in the
repository and are not part of `npm run build`, `start`, `lint`, or `seed`.

- `src/payload/seed/index.ts` — original content seed
- `src/payload/seed/reset.ts` — original content reset
- `src/payload/seed/reupload-media.ts` — Payload media re-upload
- `src/payload/seed/migrate-services.ts` — services → main-services migration
- `generate:types` / `generate:importmap` — Payload Admin artifacts

Active replacements:

- `npm run seed` → `scripts/seed.mjs`
- `npm run reset:*` → `scripts/reset-content.mjs` (destructive; explicit flags)

## Payload internal collections (keep for now)

Do not drop these until a backup exists and a later archival step is approved:

- `payload-kvs`
- `payload-locked-documents`
- `payload-preferences`
- `payload-migrations`
- `_posts_versions`
- `_services_versions`
- `_main-services_versions`
- `globals`

Content collections that must stay: `users`, `media`, `posts`, `categories`,
`services`, `main-services`.
