export function MenuGuide({ focus }: { focus: "families" | "services" }) {
  return (
    <aside className="mb-4 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm text-body">
      {focus === "families" ? (
        <p>
          Families appear on the left of the website Services menu. Drag them here to set that
          order.
        </p>
      ) : (
        <p>
          Tip: filter by one family to drag and reorder services in that menu group.
        </p>
      )}
    </aside>
  );
}
