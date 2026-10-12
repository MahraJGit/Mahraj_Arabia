"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_TAGS = 8;

export function TagsInput({
  value,
  onChange,
  recent = [],
}: {
  value: string[];
  onChange: (next: string[]) => void;
  recent?: string[];
}) {
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^,+|,+$/g, "");
    if (!tag || value.includes(tag) || value.length >= MAX_TAGS) return;
    onChange([...value, tag]);
    setDraft("");
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addTag(draft);
    } else if (event.key === "Backspace" && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">Press Enter or comma to add</p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {value.length}/{MAX_TAGS}
        </p>
      </div>
      <Input
        value={draft}
        placeholder="Add a tag"
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={() => addTag(draft)}
        disabled={value.length >= MAX_TAGS}
        className="rounded-xl"
      />
      {value.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {value.map((tag) => (
            <button
              key={tag}
              type="button"
              className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-ink transition-colors hover:border-destructive/40 hover:text-destructive"
              onClick={() => onChange(value.filter((item) => item !== tag))}
            >
              {tag}
              <X className="size-3" />
            </button>
          ))}
        </div>
      ) : null}
      {recent.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Suggestions</p>
          <div className="flex flex-wrap gap-1.5">
            {recent
              .filter((tag) => !value.includes(tag))
              .slice(0, 6)
              .map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-7 rounded-full px-2.5 text-xs"
                  disabled={value.length >= MAX_TAGS}
                  onClick={() => addTag(tag)}
                >
                  {tag}
                </Button>
              ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
