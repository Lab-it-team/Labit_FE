import { useDraggable } from "@dnd-kit/core";
import BohrAtom from "@/components/lab/BohrAtom";
import { bohrAtomSize } from "@/components/lab/bohrGeometry";
import { ELEMENTS, type ElementSymbol } from "@/data/covalentElements";

interface ElementTileProps {
  element: ElementSymbol;
  placedCount: number;
  neededCount: number;
  isDragging: boolean;
}

function ElementTile({ element, placedCount, neededCount, isDragging }: ElementTileProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette:${element}`,
    data: { source: "palette", element },
  });
  const def = ELEMENTS[element];
  const isNeeded = neededCount > 0;
  const filled = isNeeded && placedCount >= neededCount;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        width: 120,
        padding: "12px 8px",
        borderRadius: 12,
        background: "var(--color-bg-normal)",
        border: "1px solid var(--color-border-strong)",
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        opacity: isDragging ? 0.35 : 1,
      }}
    >
      <div style={{ width: bohrAtomSize(element), height: bohrAtomSize(element) }}>
        <BohrAtom element={element} />
      </div>
      <span className="font-sans text-label-sm text-text-sub text-center whitespace-nowrap">{def.name}</span>
      {isNeeded && (
        <span
          className="font-sans"
          style={{
            fontSize: 12,
            lineHeight: "16px",
            fontWeight: 600,
            color: filled ? "var(--color-status-positive)" : "var(--color-text-sub)",
          }}
        >
          {placedCount}/{neededCount}
        </span>
      )}
    </div>
  );
}

interface ElementPaletteProps {
  elements: ElementSymbol[];
  placedCounts: Record<string, number>;
  neededCounts: Record<string, number>;
  draggingElement: string | null;
}

export default function ElementPalette({ elements, placedCounts, neededCounts, draggingElement }: ElementPaletteProps) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        alignContent: "flex-start",
        padding: 20,
        gap: 16,
        width: 296,
        background: "var(--color-static-white)",
        boxShadow: "inset 0 0 0 1px var(--color-border-strong)",
        borderRadius: 12,
        flexShrink: 0,
        alignSelf: "stretch",
      }}
    >
      {elements.map((el) => (
        <ElementTile
          key={el}
          element={el}
          placedCount={placedCounts[el] ?? 0}
          neededCount={neededCounts[el] ?? 0}
          isDragging={draggingElement === el}
        />
      ))}
    </div>
  );
}
