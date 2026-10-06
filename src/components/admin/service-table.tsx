"use client";

import { useEffect, useState, useTransition, type CSSProperties, type ReactNode } from "react";
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

import { reorderServices } from "@/actions/services";
import { ServiceActions } from "@/components/admin/service-actions";
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

export type ServiceRow = {
  id: string;
  title: string;
  slug: string;
  parentTitle: string;
  detailReady: boolean;
  showInMegaMenu: boolean;
  status: PublishStatus;
  updatedLabel: string;
};

const headClass =
  "h-11 bg-muted/60 px-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground";

const restrictToVerticalAxis: Modifier = ({ transform }) => ({
  ...transform,
  x: 0,
});

export function ServiceTable({
  services,
  total,
  groupId,
  canReorder,
  filtered,
  ordering = false,
  startIndex = 0,
}: {
  services: ServiceRow[];
  total: number;
  groupId?: string;
  canReorder: boolean;
  filtered: boolean;
  ordering?: boolean;
  startIndex?: number;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-1 border-b border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {total === 1 ? "1 service" : `${total} services`}
        </p>
        <p className="text-xs text-muted-foreground">
          {canReorder
            ? "Drag a service to set its order on the right of this family."
            : ordering && total < 2
              ? "Add another service in this family before you can change the order."
              : groupId
                ? "Clear the other filters to change this family’s order."
                : filtered
                  ? "Choose one family, with no other filters, to drag the order."
                  : "Choose one family to drag the order of its services."}
        </p>
      </div>
      {canReorder && groupId ? (
        <SortableServices services={services} groupId={groupId} />
      ) : (
        <ServiceRows services={services} canReorder={false} startIndex={startIndex} />
      )}
    </div>
  );
}

function SortableServices({ services, groupId }: { services: ServiceRow[]; groupId: string }) {
  const router = useRouter();
  const [items, setItems] = useState(services);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const signature = services.map((service) => service.id).join("|");

  useEffect(() => {
    setItems(services);
  }, [signature, services]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id || pending) return;
    const oldIndex = items.findIndex((service) => service.id === active.id);
    const newIndex = items.findIndex((service) => service.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const previous = items;
    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);
    setError(null);
    setNotice(null);

    start(async () => {
      const result = await reorderServices(groupId, next.map((service) => service.id));
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
        <SortableContext items={items.map((service) => service.id)} strategy={verticalListSortingStrategy}>
          <ServiceRows services={items} canReorder disabled={pending} />
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

function ServiceRows({
  services,
  canReorder,
  disabled = false,
  startIndex = 0,
}: {
  services: ServiceRow[];
  canReorder: boolean;
  disabled?: boolean;
  startIndex?: number;
}) {
  return (
    <Table className="min-w-[40rem] table-fixed">
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className={cn(headClass, "w-16")}>Order</TableHead>
          <TableHead className={headClass}>Service</TableHead>
          <TableHead className={cn(headClass, "hidden w-40 md:table-cell")}>Family</TableHead>
          <TableHead className={cn(headClass, "hidden w-28 sm:table-cell")}>Page</TableHead>
          <TableHead className={cn(headClass, "hidden w-28 lg:table-cell")}>Menu</TableHead>
          <TableHead className={cn(headClass, "w-36")}>Status</TableHead>
          <TableHead className={cn(headClass, "hidden w-28 xl:table-cell")}>Updated</TableHead>
          <TableHead className={cn(headClass, "w-36 text-end")}>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service, index) =>
          canReorder ? (
            <SortableRow key={service.id} service={service} index={index} disabled={disabled} />
          ) : (
            <ServiceRowView key={service.id} service={service} index={startIndex + index} />
          )
        )}
      </TableBody>
    </Table>
  );
}

function SortableRow({
  service,
  index,
  disabled,
}: {
  service: ServiceRow;
  index: number;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: service.id,
    disabled,
  });

  return (
    <ServiceRowView
      service={service}
      index={index}
      rowRef={setNodeRef}
      dragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      handle={
        <button
          type="button"
          className="inline-flex size-8 cursor-grab items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-ink active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={`Drag ${service.title} to change the menu order`}
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

function ServiceRowView({
  service,
  index,
  handle,
  rowRef,
  style,
  dragging = false,
}: {
  service: ServiceRow;
  index: number;
  handle?: ReactNode;
  rowRef?: (node: HTMLElement | null) => void;
  style?: CSSProperties;
  dragging?: boolean;
}) {
  const draft = service.status === "draft";

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
          <span className="w-5 text-sm font-medium tabular-nums text-ink">{index + 1}</span>
        </div>
      </TableCell>
      <TableCell className="px-4 py-3 whitespace-normal">
        <div className="min-w-0">
          <Link
            href={`/admin/services/${service.id}`}
            className="line-clamp-2 font-medium text-ink hover:text-brand"
          >
            {service.title}
          </Link>
          <p className="truncate text-xs text-muted-foreground">
            {service.slug ? `/services/${service.slug}` : "No public URL yet"}
          </p>
          <p className="truncate text-xs text-muted-foreground md:hidden">{service.parentTitle}</p>
        </div>
      </TableCell>
      <TableCell className="hidden truncate px-4 py-3 md:table-cell">{service.parentTitle}</TableCell>
      <TableCell className="hidden px-4 py-3 sm:table-cell">
        <Badge variant="muted" className="normal-case tracking-normal">
          {service.detailReady ? "Full page" : "Coming soon"}
        </Badge>
      </TableCell>
      <TableCell className="hidden px-4 py-3 lg:table-cell">
        <Badge
          variant={service.showInMegaMenu ? "published" : "muted"}
          className="normal-case tracking-normal"
        >
          {service.showInMegaMenu ? "In menu" : "Hidden"}
        </Badge>
      </TableCell>
      <TableCell className="px-4 py-3 whitespace-normal">
        <div className="flex flex-col items-start gap-1">
          <StatusBadge status={service.status} />
          <span className="text-xs text-muted-foreground">
            {draft ? "Hidden from the website" : "On the website"}
          </span>
        </div>
      </TableCell>
      <TableCell className="hidden px-4 py-3 xl:table-cell">{service.updatedLabel}</TableCell>
      <TableCell className="px-4 py-3 text-end">
        <ServiceActions
          id={service.id}
          title={service.title}
          slug={service.slug}
          status={service.status}
        />
      </TableCell>
    </TableRow>
  );
}
