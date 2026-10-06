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

export function ServiceGroupFilters({
  q = "",
  status = "all",
  menu = "all",
  filtered,
}: {
  q?: string;
  status?: string;
  menu?: string;
  filtered: boolean;
}) {
  const router = useRouter();
  const [statusValue, setStatusValue] = useState(
    status === "draft" || status === "published" ? status : "all"
  );
  const [menuValue, setMenuValue] = useState(
    menu === "visible" || menu === "hidden" ? menu : "all"
  );

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const query = String(data.get("q") ?? "").trim();
    const nextStatus = String(data.get("status") ?? "");
    const nextMenu = String(data.get("menu") ?? "");
    if (query) params.set("q", query);
    if (nextStatus === "draft" || nextStatus === "published") {
      params.set("status", nextStatus);
    }
    if (nextMenu === "visible" || nextMenu === "hidden") {
      params.set("menu", nextMenu);
    }
    const qs = params.toString();
    router.push(qs ? `/admin/service-groups?${qs}` : "/admin/service-groups");
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
        aria-label="Search service groups"
        className="w-full sm:w-56"
      />
      <input type="hidden" name="status" value={statusValue} />
      <input type="hidden" name="menu" value={menuValue} />
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
      <Select value={menuValue} onValueChange={setMenuValue}>
        <SelectTrigger className="w-full sm:w-48" aria-label="Menu visibility">
          <SelectValue placeholder="All menu visibility" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="all">All menu visibility</SelectItem>
          <SelectItem value="visible">Shown in the menu</SelectItem>
          <SelectItem value="hidden">Hidden from menu</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button type="submit" variant="outline">
          Filter
        </Button>
        {filtered ? (
          <Button asChild variant="ghost">
            <Link href="/admin/service-groups">Clear</Link>
          </Button>
        ) : null}
      </div>
    </form>
  );
}
