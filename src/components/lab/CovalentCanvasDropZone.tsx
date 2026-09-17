import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import BohrAtom from "@/components/lab/BohrAtom";
import { bohrAtomSize, ELECTRON_PAIR_GAP } from "@/components/lab/bohrGeometry";
import { buildRenderModel, type PlacedAtom, type RenderAtom, type BondVisual } from "@/components/lab/covalentRenderModel";
import type { Molecule } from "@/data/covalentElements";
import bellSvg from "@/assets/icons/bell.svg";
import checkSvg from "@/assets/icons/check.svg";

export type { PlacedAtom };

/** 공유 전자쌍: 각 쌍의 두 전자를 결합축(u) 방향으로 나란히 배치한다 */
function BondPairDots({ pairs, ux, uy }: BondVisual) {
  const halfGapX = (ux * ELECTRON_PAIR_GAP) / 2;
  const halfGapY = (uy * ELECTRON_PAIR_GAP) / 2;
  return (
    <>
      {pairs.map((p, i) => (
        <g key={i}>
          <circle cx={p.x - halfGapX} cy={p.y - halfGapY} r={5} fill="var(--color-primary-normal)" stroke="var(--color-static-white)" strokeWidth={1.5} />
          <circle cx={p.x + halfGapX} cy={p.y + halfGapY} r={5} fill="var(--color-primary-normal)" stroke="var(--color-static-white)" strokeWidth={1.5} />
        </g>
      ))}
    </>
  );
}

type CanvasStatus = "empty" | "active" | "positive";

function getStyle(status: CanvasStatus, isDragOver: boolean) {
  if (isDragOver) {
    return { bg: "var(--color-element-drag-fill-blue)", border: "1px dashed var(--color-element-drag-stroke-blue)" };
  }
  if (status === "positive") {
    return { bg: "var(--color-element-hover-fill-mint)", border: "1px solid var(--color-status-positive)" };
  }
  if (status === "active") {
    return { bg: "var(--color-bg-normal)", border: "1px solid var(--color-border-strong)" };
  }
  return { bg: "var(--color-bg-normal)", border: "1px dashed var(--color-border-strong)" };
}

function Toast({ status, extraCount }: { status: CanvasStatus; extraCount: number }) {
  const base: React.CSSProperties = {
    position: "absolute",
    top: 24,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px 12px",
    gap: 6,
    background: "var(--color-bg-opacity-light95)",
    borderRadius: 12,
    zIndex: 10,
    whiteSpace: "nowrap",
  };
  const label: React.CSSProperties = {
    fontFamily: "Pretendard, sans-serif",
    fontWeight: 400,
    fontSize: 13,
    lineHeight: "18px",
    letterSpacing: "-0.005em",
    color: "var(--color-text-normal)",
  };

  if (status === "positive") {
    return (
      <div style={{ ...base, border: "1px solid var(--color-status-positive)" }}>
        <img src={checkSvg} width={24} height={24} alt="" />
        <span style={label}>안정된 분자가 됐어요!</span>
      </div>
    );
  }

  if (extraCount > 0) {
    return (
      <div style={{ ...base, border: "1px solid var(--color-status-negative)" }}>
        <span style={{ ...label, color: "var(--color-status-negative)" }}>
          원자가 더 많아요. 필요 없는 원자를 지워보세요.
        </span>
      </div>
    );
  }

  return (
    <div style={base}>
      <img src={bellSvg} width={24} height={24} alt="" />
      <span style={label}>원자를 가까이 놓으면 전자쌍이 자동으로 정렬돼요.</span>
    </div>
  );
}

interface CovalentCanvasDropZoneProps {
  onCanvasReady: (node: HTMLDivElement | null) => void;
  atoms: PlacedAtom[];
  molecule: Molecule;
  onRemove: (id: string) => void;
  isDragOver: boolean;
  isComplete: boolean;
  extraCount: number;
  draggingAtomId?: string | null;
  height: number;
  width?: number;
  hintVisible?: boolean;
  hintText?: string;
}

export default function CovalentCanvasDropZone({
  onCanvasReady,
  atoms,
  molecule,
  onRemove,
  isDragOver,
  isComplete,
  extraCount,
  draggingAtomId = null,
  height,
  width = 546,
  hintVisible = false,
  hintText,
}: CovalentCanvasDropZoneProps) {
  const { setNodeRef } = useDroppable({ id: "covalent-canvas" });
  const hasInput = atoms.length > 0;
  const status: CanvasStatus = isComplete ? "positive" : hasInput ? "active" : "empty";
  const { bg, border } = getStyle(status, isDragOver);
  const { renderAtoms, bondVisuals } = buildRenderModel(atoms, molecule);

  const setCanvasNode = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    onCanvasReady(node);
  };

  return (
    <div
      ref={setCanvasNode}
      style={{
        boxSizing: "border-box",
        position: "relative",
        width,
        height,
        background: bg,
        border,
        borderRadius: 12,
        overflow: "hidden",
        transition: "background 0.2s, border-color 0.2s",
        touchAction: "none",
      }}
    >
      {!isDragOver && <Toast status={status} extraCount={extraCount} />}
      {hintVisible && hintText && (
        <div
          style={{
            boxSizing: "border-box",
            position: "absolute",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            maxWidth: 480,
            width: "max-content",
            display: "flex",
            alignItems: "center",
            padding: "8px 12px",
            gap: 6,
            background: "var(--color-bg-opacity-light95)",
            border: "1px solid var(--color-element-normal-yellow)",
            borderRadius: 12,
            zIndex: 11,
          }}
        >
          <img src={bellSvg} width={24} height={24} alt="" style={{ flexShrink: 0 }} />
          <span style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 400, fontSize: 13, lineHeight: "18px", color: "var(--color-text-normal)" }}>
            {hintText}
          </span>
        </div>
      )}

      <svg width={width} height={height} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {bondVisuals.map((b, i) => (
          <BondPairDots key={i} {...b} />
        ))}
      </svg>

      {renderAtoms.map((ra) => (
        <DraggableCanvasAtom
          key={ra.id}
          renderAtom={ra}
          isDragging={draggingAtomId === ra.id}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}

function DraggableCanvasAtom({
  renderAtom,
  isDragging,
  onRemove,
}: {
  renderAtom: RenderAtom;
  isDragging: boolean;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `canvas:${renderAtom.id}`,
    data: { source: "canvas", pieceId: renderAtom.id, element: renderAtom.element },
  });
  const size = bohrAtomSize(renderAtom.element);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const showRemove = hovered || focused || isDragging;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "absolute",
        left: renderAtom.x - size / 2,
        top: renderAtom.y - size / 2,
        width: size,
        height: size,
        cursor: "grab",
        // 결합된 원자끼리는 서로 겹쳐 렌더링되므로, 마우스가 올라간 원자를 항상 맨 위로 올려서
        // 그 원자의 삭제 버튼이 이웃 원자의 전자에 가리지 않게 한다
        zIndex: showRemove ? 20 : renderAtom.bonded ? 4 : 8,
        opacity: isDragging ? 0.35 : 1,
        transition: "left 0.18s cubic-bezier(.34,1.5,.64,1), top 0.18s cubic-bezier(.34,1.5,.64,1)",
        touchAction: "none",
      }}
    >
      <BohrAtom
        element={renderAtom.element}
        occupiedAngles={renderAtom.occupiedAngles}
        remainingValence={renderAtom.remainingValence}
      />
      <button
        type="button"
        aria-label="원자 제거"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => { e.stopPropagation(); onRemove(renderAtom.id); }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          position: "absolute",
          top: -4,
          right: -4,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "var(--color-static-white)",
          border: "none",
          boxShadow: "0 0 6px rgba(0,0,0,0.09)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          opacity: showRemove ? 1 : 0,
          pointerEvents: showRemove ? "auto" : "none",
          transition: "opacity 0.12s",
        }}
      >
        <svg width={10} height={10} viewBox="0 0 10 10">
          <line x1={2} y1={2} x2={8} y2={8} stroke="var(--color-fill-grey)" strokeWidth={1.5} strokeLinecap="round" />
          <line x1={8} y1={2} x2={2} y2={8} stroke="var(--color-fill-grey)" strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
