"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { CoverUpload, type CoverValue } from "@/components/admin/cover-upload";
import { Field } from "@/components/admin/field";
import { FormPanel } from "@/components/admin/form-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type CaseStudyDraft = {
  title: string;
  imageUrl: string;
  imageAlt: string;
  meta: string;
  badge: string;
  price: string;
};

export function CaseStudiesEditor({
  title,
  description,
  value,
  onTitleChange,
  onDescriptionChange,
  onChange,
  errors = {},
}: {
  title: string;
  description: string;
  value: CaseStudyDraft[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onChange: (next: CaseStudyDraft[]) => void;
  errors?: Record<string, string>;
}) {
  const errorKeys = useMemo(
    () =>
      value
        .map((_, index) => index)
        .filter(
          (index) =>
            errors[`caseStudies.${index}.title`] ||
            errors[`caseStudies.${index}.imageUrl`]
        )
        .map((index) => String(index)),
    [errors, value]
  );

  const [open, setOpen] = useState<string[]>(() =>
    value.length > 0 ? [String(value.length - 1)] : []
  );

  useEffect(() => {
    if (errorKeys.length === 0) return;
    setOpen((current) => Array.from(new Set([...current, ...errorKeys])));
  }, [errorKeys]);

  function addCaseStudy() {
    const nextIndex = value.length;
    onChange([
      ...value,
      {
        title: "",
        imageUrl: "",
        imageAlt: "",
        meta: "",
        badge: "Capability",
        price: "Quote on request",
      },
    ]);
    setOpen((current) => [...current, String(nextIndex)]);
  }

  function removeCaseStudy(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
    setOpen((current) =>
      current
        .filter((item) => item !== String(index))
        .map((item) => {
          const n = Number(item);
          return n > index ? String(n - 1) : item;
        })
    );
  }

  return (
    <FormPanel
      title="Case studies"
      description="Optional project or capability cards. Leave empty to hide the section."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Section title" error={errors.caseStudiesTitle}>
          <Input
            value={title}
            placeholder="Case studies"
            className="rounded-xl"
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </Field>
        <Field
          className="md:col-span-2"
          label="Section description"
          error={errors.caseStudiesDescription}
        >
          <Textarea
            value={description}
            placeholder="Short intro for this section."
            className="min-h-20 rounded-xl"
            onChange={(event) => onDescriptionChange(event.target.value)}
          />
        </Field>
      </div>

      {value.length === 0 ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            No case studies yet. Add a few examples that support this service.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 rounded-xl"
            onClick={addCaseStudy}
          >
            <Plus className="size-4" />
            Add case study
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Accordion
            type="multiple"
            value={open}
            onValueChange={setOpen}
            className="gap-3"
          >
            {value.map((item, index) => {
              const preview = item.title.trim() || `Case study ${index + 1}`;
              const cover: CoverValue | null = item.imageUrl
                ? {
                    id: "",
                    url: item.imageUrl,
                    alt: item.imageAlt || "",
                    filename: "",
                    width: null,
                    height: null,
                  }
                : null;

              return (
                <AccordionItem
                  key={index}
                  value={String(index)}
                  className="overflow-hidden rounded-xl border border-border/80 bg-background px-4 not-last:border-b sm:px-5"
                >
                  <div className="relative">
                    <AccordionTrigger className="w-full py-3.5 hover:no-underline">
                      <span className="flex min-w-0 flex-1 flex-col items-start gap-0.5 pe-28 text-start sm:pe-36">
                        <span className="text-xs font-medium text-muted-foreground">
                          Case study {index + 1}
                        </span>
                        <span className="line-clamp-1 w-full text-sm font-semibold text-ink">
                          {preview}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute end-9 top-1/2 h-8 -translate-y-1/2 text-muted-foreground hover:text-destructive"
                      aria-label={`Remove case study ${index + 1}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeCaseStudy(index);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>

                  <AccordionContent className="pb-4">
                    <div className="space-y-4 border-t border-border/60 pt-4">
                      <Field
                        label="Title"
                        error={errors[`caseStudies.${index}.title`]}
                      >
                        <Input
                          value={item.title}
                          placeholder="e.g. Porta Cabins & Site Offices"
                          className="rounded-xl"
                          onChange={(event) => {
                            const next = value.map((entry) => ({ ...entry }));
                            next[index] = { ...item, title: event.target.value };
                            onChange(next);
                          }}
                        />
                      </Field>

                      <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Badge">
                          <Input
                            value={item.badge}
                            placeholder="Capability"
                            className="rounded-xl"
                            onChange={(event) => {
                              const next = value.map((entry) => ({ ...entry }));
                              next[index] = { ...item, badge: event.target.value };
                              onChange(next);
                            }}
                          />
                        </Field>
                        <Field label="Price / note">
                          <Input
                            value={item.price}
                            placeholder="Quote on request"
                            className="rounded-xl"
                            onChange={(event) => {
                              const next = value.map((entry) => ({ ...entry }));
                              next[index] = { ...item, price: event.target.value };
                              onChange(next);
                            }}
                          />
                        </Field>
                        <Field label="Meta">
                          <Input
                            value={item.meta}
                            placeholder="Site ready portable facilities"
                            className="rounded-xl"
                            onChange={(event) => {
                              const next = value.map((entry) => ({ ...entry }));
                              next[index] = { ...item, meta: event.target.value };
                              onChange(next);
                            }}
                          />
                        </Field>
                      </div>

                      <Field
                        label="Image"
                        error={errors[`caseStudies.${index}.imageUrl`]}
                      >
                        <CoverUpload
                          compact
                          value={cover}
                          error={errors[`caseStudies.${index}.imageUrl`]}
                          label="Upload case study image"
                          hint="JPG, PNG or WebP · Max 3MB"
                          onChange={(nextCover) => {
                            const next = value.map((entry) => ({ ...entry }));
                            next[index] = {
                              ...item,
                              imageUrl: nextCover?.url ?? "",
                              imageAlt: nextCover?.alt ?? item.imageAlt,
                            };
                            onChange(next);
                          }}
                        />
                      </Field>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>

          {value.length < 6 ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              onClick={addCaseStudy}
            >
              <Plus className="size-4" />
              Add another case study
            </Button>
          ) : null}
        </div>
      )}
    </FormPanel>
  );
}
