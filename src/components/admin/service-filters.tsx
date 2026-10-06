"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ServiceFilters({
  q = "",
  status = "all",
  group = "all",
  ready = "all",
  groups,
  filtered,
}: {
  q?: string;
  status?: string;
  group?: string;
  ready?: string;
  groups: { id: string; title: string }[];
  filtered: boolean;
}) {
  const router = useRouter();
  const [statusValue, setStatusValue] = useState(
    status === "draft" || status === "published" ? status : "all"
  );
  const [groupValue, setGroupValue] = useState(group || "all");
  const [readyValue, setReadyValue] = useState(
    ready === "ready" || ready === "soon" ? ready : "all"
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const query = String(data.get("q") ?? "").trim();
    const nextStatus = String(data.get("status") ?? "");
    const nextGroup = String(data.get("group") ?? "");
    const nextReady = String(data.get("ready") ?? "");
    if (query) params.set("q", query);
    if (nextStatus === "draft" || nextStatus === "published") params.set("status", nextStatus);
    if (nextGroup && nextGroup !== "all") params.set("group", nextGroup);
    if (nextReady === "ready" || nextReady === "soon") params.set("ready", nextReady);
    const qs = params.toString();
    router.push(qs ? `/admin/services?${qs}` : "/admin/services");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 sm:flex-row sm:flex-wrap sm:items-center"
    >
      <Input
        name="q"
        defaultValue={q}
        placeholder="Search name or slug"
        aria-label="Search services"
        className="w-full sm:w-56"
      />
      <input type="hidden" name="group" value={groupValue} />
      <input type="hidden" name="status" value={statusValue} />
      <input type="hidden" name="ready" value={readyValue} />
      <Select value={groupValue} onValueChange={setGroupValue}>
        <SelectTrigger className="w-full sm:w-48" aria-label="Family">
          <SelectValue placeholder="All families" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All families</SelectItem>
          {groups.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={statusValue} onValueChange={setStatusValue}>
        <SelectTrigger className="w-full sm:w-40" aria-label="Status">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
        </SelectContent>
      </Select>
      <Select value={readyValue} onValueChange={setReadyValue}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Page type">
          <SelectValue placeholder="All page types" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All page types</SelectItem>
          <SelectItem value="ready">Full page</SelectItem>
          <SelectItem value="soon">Coming soon</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button type="submit" variant="outline">
          Filter
        </Button>
        {filtered ? (
          <Button asChild variant="ghost">
            <Link href="/admin/services">Clear</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
