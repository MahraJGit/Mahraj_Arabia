"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";

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

export type FaqDraft = {
  question: string;
  answer: string;
};

export function FaqEditor({
  value,
  onChange,
  errors = {},
}: {
  value: FaqDraft[];
  onChange: (next: FaqDraft[]) => void;
  errors?: Record<string, string>;
}) {
  const errorKeys = useMemo(
    () =>
      value
        .map((_, index) => index)
        .filter(
          (index) =>
            errors[`faqs.${index}.question`] || errors[`faqs.${index}.answer`]
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

  function addFaq() {
    const nextIndex = value.length;
    onChange([...value, { question: "", answer: "" }]);
    setOpen((current) => [...current, String(nextIndex)]);
  }

  function removeFaq(index: number) {
    onChange(value.filter((_, faqIndex) => faqIndex !== index));
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
      title="FAQs"
      description="Optional questions shown on the page and as FAQPage structured data."
    >
      {value.length === 0 ? (
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            No FAQs yet. Add a few common questions to improve SEO.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 rounded-xl"
            onClick={addFaq}
          >
            <Plus className="size-4" />
            Add FAQ
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
            {value.map((faq, index) => {
              const preview = faq.question.trim() || `FAQ ${index + 1}`;
              const hasError = Boolean(
                errors[`faqs.${index}.question`] || errors[`faqs.${index}.answer`]
              );

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
                          FAQ {index + 1}
                          {hasError ? " · Needs attention" : ""}
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
                      aria-label={`Remove FAQ ${index + 1}`}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        removeFaq(index);
                      }}
                    >
                      <Trash2 className="size-3.5" />
                      <span className="hidden sm:inline">Remove</span>
                    </Button>
                  </div>

                  <AccordionContent className="pb-4">
                    <div className="space-y-4 border-t border-border/60 pt-4">
                      <Field label="Question" error={errors[`faqs.${index}.question`]}>
                        <Input
                          value={faq.question}
                          placeholder="e.g. Can this be customized?"
                          className="rounded-xl"
                          onChange={(event) => {
                            const next = value.map((item) => ({ ...item }));
                            next[index] = { ...faq, question: event.target.value };
                            onChange(next);
                          }}
                        />
                      </Field>

                      <Field label="Answer" error={errors[`faqs.${index}.answer`]}>
                        <Textarea
                          value={faq.answer}
                          placeholder="Write a short, clear answer."
                          className="min-h-28 w-full rounded-xl"
                          onChange={(event) => {
                            const next = value.map((item) => ({ ...item }));
                            next[index] = { ...faq, answer: event.target.value };
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

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={addFaq}
          >
            <Plus className="size-4" />
            Add another FAQ
          </Button>
        </div>
      )}
    </FormPanel>
  );
}
