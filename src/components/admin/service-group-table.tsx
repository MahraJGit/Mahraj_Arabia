"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type Modifier,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

import { reorderServiceGroups } from "@/actions/service-groups";
import { ServiceGroupActions } from "@/components/admin/service-group-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PublishStatus } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export type ServiceGroupRow = {
  id: string;
  title: string;
  slug: string;
  showInMegaMenu: boolean;
  status: PublishStatus;
  serviceCount: number;
  updatedLabel: string;
};

const headClass =
  "h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground";

const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

export function ServiceGroupTable({
  groups,
  total,
  canReorder,
  filtered,
}: {
  groups: ServiceGroupRow[];
  total: number;
  canReorder: boolean;
  filtered: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-1 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {total === 1 ? "1 group" : `${total} groups`}
        </p>
        <p className="text-xs text-muted-foreground">
          {canReorder
            ? "Drag a family to set the order on the left of the Services menu."
            : filtered
              ? "Clear filters to change the menu order."
              : "This is the order on the left of the Services menu."}
        </p>
      </div>
      {canReorder ? (
        <SortableGroups groups={groups} />
      ) : (
        <GroupTable groups={groups} canReorder={false} showRank={!filtered} />
      )}
    </div>
  );
}

function SortableGroups({ groups }: { groups: ServiceGroupRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(groups);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const signature = groups.map((group) => group.id).join("|");

  useEffect(() => {
    setItems(groups);
  }, [signature, groups]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || pending) return;

    const oldIndex = items.findIndex((group) => group.id === active.id);
    const newIndex = items.findIndex((group) => group.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previous = items;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    setError(null);
    setNotice(null);

    start(async () => {
      const result = await reorderServiceGroups(next.map((group) => group.id));
      if (result.error) {
        setItems(previous);
        setError(result.error);
        return;
      }
      setNotice("Menu order saved. The website will update shortly.");
      router.refresh();
    });
  }

  return (
    <>
      <OrderStatus pending={pending} notice={notice} error={error} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={onDragEnd}
      >
        <SortableContext items={items.map((group) => group.id)} strategy={verticalListSortingStrategy}>
          <GroupTable groups={items} canReorder disabled={pending} />
        </SortableContext>
      </DndContext>
    </>
  );
}

function OrderStatus({
  pending,
  notice,
  error,
}: {
  pending: boolean;
  notice: string | null;
  error: string | null;
}) {
  if (pending) {
    return (
      <p className="border-b border-border px-4 py-2 text-sm text-muted-foreground" aria-live="polite">
        Saving menu order…
      </p>
    );
  }
  if (error) {
    return (
      <p className="border-b border-border bg-destructive/5 px-4 py-2 text-sm text-destructive" role="alert">
        {error}
      </p>
    );
  }
  if (notice) {
    return (
      <p className="border-b border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900" aria-live="polite">
        {notice}
      </p>
    );
  }
  return null;
}

function GroupTable({
  groups,
  canReorder,
  disabled = false,
  showRank = true,
}: {
  groups: ServiceGroupRow[];
  canReorder: boolean;
  disabled?: boolean;
  showRank?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={cn(headClass, "w-16")}>Order</TableHead>
          <TableHead className={headClass}>Family</TableHead>
          <TableHead className={cn(headClass, "hidden sm:table-cell")}>Services</TableHead>
          <TableHead className={cn(headClass, "hidden md:table-cell")}>Menu</TableHead>
          <TableHead className={headClass}>Status</TableHead>
          <TableHead className={cn(headClass, "hidden lg:table-cell")}>Updated</TableHead>
          <TableHead className={cn(headClass, "text-end")}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((group, index) =>
          canReorder ? (
            <SortableRow key={group.id} group={group} index={index} disabled={disabled} />
          ) : (
            <GroupRow key={group.id} group={group} index={index} showRank={showRank} />
          )
        )}
      </TableBody>
    </Table>
  );
}

function SortableRow({
  group,
  index,
  disabled,
}: {
  group: ServiceGroupRow;
  index: number;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: group.id,
    disabled,
  });

  return (
    <GroupRow
      group={group}
      index={index}
      rowRef={setNodeRef}
      dragging={isDragging}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      handle={
        <button
          type="button"
          className="inline-flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-ink active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Drag ${group.title} to change the menu order`}
          disabled={disabled}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      }
    />
  );
}

function GroupRow({
  group,
  index,
  handle,
  rowRef,
  style,
  dragging = false,
  showRank = true,
}: {
  group: ServiceGroupRow;
  index: number;
  handle?: React.ReactNode;
  rowRef?: (node: HTMLElement | null) => void;
  style?: React.CSSProperties;
  dragging?: boolean;
  showRank?: boolean;
}) {
  const draft = group.status === "draft";

  return (
    <TableRow
      ref={rowRef}
      style={style}
      className={cn(
        draft && "bg-amber-50/80 hover:bg-amber-50 dark:bg-amber-950/20 dark:hover:bg-amber-950/30",
        dragging && "relative z-10 bg-card shadow-md"
      )}
    >
      <TableCell className="px-3 py-3">
        <div className="flex items-center gap-1">
          {handle}
          <span className="w-5 text-sm font-medium tabular-nums text-ink">
            {showRank ? index + 1 : "—"}
          </span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 whitespace-normal">
        <div className="min-w-40">
          <Link
            href={`/admin/service-groups/${group.id}`}
            className="line-clamp-2 font-medium text-ink hover:text-brand"
          >
            {group.title}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {group.slug ? `/services#service-group-${group.slug}` : "No public URL yet"}
          </p>
          <p className="text-xs text-muted-foreground sm:hidden">
            {group.serviceCount === 1 ? "1 service" : `${group.serviceCount} services`}
            <span className="md:hidden"> · {group.showInMegaMenu ? "In menu" : "Hidden"}</span>
          </p>
        </div>
      </TableCell>
      <TableCell className="hidden px-4 py-3 sm:table-cell">
        <Badge variant="muted" className="normal-case tracking-normal">
          {group.serviceCount === 1 ? "1 service" : `${group.serviceCount} services`}
        </Badge>
      </TableCell>
      <TableCell className="hidden px-4 py-3 md:table-cell">
        <Badge
          variant={group.showInMegaMenu ? "published" : "muted"}
          className="normal-case tracking-normal"
        >
          {group.showInMegaMenu ? "In menu" : "Hidden"}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3 whitespace-normal">
        <div className="flex flex-col items-start gap-1">
          <StatusBadge status={group.status} />
          <span className="text-xs text-muted-foreground">
            {draft ? "Hidden from the website" : "On the website"}
          </span>
        </div>
      </TableCell>
      <TableCell className="hidden px-4 py-3 lg:table-cell">{group.updatedLabel}</TableCell>
      <TableCell className="px-4 py-3 text-end">
        <ServiceGroupActions
          id={group.id}
          title={group.title}
          slug={group.slug}
          status={group.status}
          serviceCount={group.serviceCount}
        />
      </TableCell>
    </TableRow>
  );
}
