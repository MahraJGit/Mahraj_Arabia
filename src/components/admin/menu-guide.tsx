export function MenuGuide({ focus }: { focus: "families" | "services" }) {
  return (
    <aside className="mb-4 rounded-xl border border-border bg-card px-4 py-3 text-sm text-ink">
      {focus === "families" ? (
        <p>
          On the website, <strong>Services</strong> opens with these families on the left.
          Drag them here to set that order. The services inside a family appear on the right.
        </p>
      ) : (
        <p>
          A service appears on the right after its family is selected. Choose one family in
          the filter, leave the other filters on All, then drag to set that list.
        </p>
      )}
    </aside>
  );
}
