"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { Field } from "@/components/admin/field";
import { FormPanel, FormSelect } from "@/components/admin/form-shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  HIGHLIGHT_ICON_NAMES,
  HIGHLIGHT_ICONS,
} from "@/lib/services/highlight-icons";

export type HighlightDraft = {
  title: string;
  description: string;
  icon: string;
  points: string[];
};

function pointsToText(points: string[]) {
  return points.join("\n");
}

function textToPoints(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 6);
}

export function HighlightsEditor({
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
  value: HighlightDraft[];
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onChange: (next: HighlightDraft[]) => void;
  errors?: Record<string, string>;
}) {
  const errorKeys = useMemo(
    () =>
      value
        .map((_, index) => index)
        .filter(
          (index) =>
            errors[`highlights.${index}.title`] ||
            errors[`highlights.${index}.description`] ||
            errors[`highlights.${index}.icon`] ||
            errors[`highlights.${index}.points`]
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

  function addHighlight() {
    const nextIndex = value.length;
    onChange([
      ...value,
      {
        title: "",
        description: "",
        icon: HIGHLIGHT_ICON_NAMES[nextIndex % HIGHLIGHT_ICON_NAMES.length],
        points: [],
      },
    ]);
    setOpen((current) => [...current, String(nextIndex)]);
  }

  function removeHighlight(index: number) {
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
      title="Highlights"
      description="Optional feature cards shown on the service page. Leave empty to hide the section."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Section title" error={errors.highlightsTitle}>
          <Input
            value={title}
            placeholder="Key highlights"
            className="rounded-xl"
            onChange={(event) => onTitleChange(event.target.value)}
          />
        </Field>
        <Field
          className="md:col-span-2"
          label="Section description"
          error={errors.highlightsDescription}
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
            No highlights yet. Add cards for capabilities, uses, or benefits.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 rounded-xl"
            onClick={addHighlight}
          >
            <Plus className="size-4" />
            Add highlight
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
              const preview = item.title.trim() || `Highlight ${index + 1}`;

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
                          Highlight {index + 1}
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
                      aria-label={`Remove highlight ${index + 1}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeHighlight(index);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>

                  <AccordionContent className="pb-4">
                    <div className="space-y-4 border-t border-border/60 pt-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field
                          label="Title"
                          error={errors[`highlights.${index}.title`]}
                        >
                          <Input
                            value={item.title}
                            placeholder="e.g. Fast installation"
                            className="rounded-xl"
                            onChange={(event) => {
                              const next = value.map((entry) => ({ ...entry }));
                              next[index] = { ...item, title: event.target.value };
                              onChange(next);
                            }}
                          />
                        </Field>
                        <Field
                          label="Icon"
                          error={errors[`highlights.${index}.icon`]}
                        >
                          <FormSelect
                            value={item.icon}
                            onChange={(icon) => {
                              const next = value.map((entry) => ({ ...entry }));
                              next[index] = { ...item, icon };
                              onChange(next);
                            }}
                          >
                            {HIGHLIGHT_ICON_NAMES.map((name) => (
                              <option key={name} value={name}>
                                {HIGHLIGHT_ICONS[name].label}
                              </option>
                            ))}
                          </FormSelect>
                        </Field>
                      </div>

                      <Field
                        label="Description"
                        error={errors[`highlights.${index}.description`]}
                      >
                        <Textarea
                          value={item.description}
                          placeholder="One or two sentences about this highlight."
                          className="min-h-24 rounded-xl"
                          onChange={(event) => {
                            const next = value.map((entry) => ({ ...entry }));
                            next[index] = {
                              ...item,
                              description: event.target.value,
                            };
                            onChange(next);
                          }}
                        />
                      </Field>

                      <Field
                        label="Points"
                        hint="One point per line, up to 6."
                        error={errors[`highlights.${index}.points`]}
                      >
                        <Textarea
                          value={pointsToText(item.points)}
                          placeholder={"Quick setup\nSite ready\nReusable"}
                          className="min-h-28 rounded-xl"
                          onChange={(event) => {
                            const next = value.map((entry) => ({ ...entry }));
                            next[index] = {
                              ...item,
                              points: textToPoints(event.target.value),
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
              onClick={addHighlight}
            >
              <Plus className="size-4" />
              Add another highlight
            </Button>
          ) : null}
        </div>
      )}
    </FormPanel>
  );
}
