-- Optional Highlights and Case Studies sections on service detail pages.

alter table public.services
  add column if not exists highlights_title text not null default '',
  add column if not exists highlights_description text not null default '',
  add column if not exists highlights jsonb not null default '[]'::jsonb,
  add column if not exists case_studies_title text not null default '',
  add column if not exists case_studies_description text not null default '',
  add column if not exists case_studies jsonb not null default '[]'::jsonb;
