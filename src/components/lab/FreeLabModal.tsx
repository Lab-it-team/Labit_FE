import { useState, useRef, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import IonTabList from "@/components/lab/IonTabList";
import CanvasDropZone from "@/components/lab/CanvasDropZone";
import PuzzleGhost from "@/components/lab/PuzzleGhost";
import ToolBtn from "@/components/lab/ToolBtn";
import type { PlacedPiece } from "@/components/lab/CanvasDropZone";
import type { Ion } from "@/data/ions";
import { getIonicCompound } from "@/features/ionic-lab/api";

// ── Constants ────────────────────────────────────────────────────────────────
const PIECE_W  = 120;
const NOTCH_D  = 20;
const UNIT_H   = 100;
const SNAP_THR = 80;
const CANVAS_W = 651;
const CANVAS_H = 446;

// ── Subscript helper ─────────────────────────────────────────────────────────
const SUB = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];
function toSub(n: number) {
  return n === 1 ? "" : String(n).split("").map((d) => SUB[+d]).join("");
}

function computeFormula(pieces: PlacedPiece[]): string {
  const cMap = new Map<string, { ion: Ion; count: number }>();
  const aMap = new Map<string, { ion: Ion; count: number }>();
  for (const p of pieces) {
    const map = p.ion.type === "plus" ? cMap : aMap;
    const e = map.get(p.ion.id) ?? { ion: p.ion, count: 0 };
    map.set(p.ion.id, { ...e, count: e.count + 1 });
  }
  return [...cMap.values(), ...aMap.values()]
    .map(({ ion, count }) => `${ion.symbol}${toSub(count)}`)
    .join("");
}

// ── Drag helpers ─────────────────────────────────────────────────────────────
type LabDragData =
  | { source: "palette"; ion: Ion }
  | { source: "canvas"; pieceId: string; ion: Ion };

function removePieceLinks(pieces: PlacedPiece[], id: string): PlacedPiece[] {
  return pieces.map((p) => {
    if (p.id === id)
      return { ...p, bondedAnionIds: [], bondedToCationId: null, bondedBelowId: null, bondedAboveCationId: null };
    return {
      ...p,
      bondedAnionIds:      p.bondedAnionIds.filter((a) => a !== id),
      bondedToCationId:    p.bondedToCationId === id ? null : p.bondedToCationId,
      bondedBelowId:       p.bondedBelowId === id ? null : p.bondedBelowId,
      bondedAboveCationId: p.bondedAboveCationId === id ? null : p.bondedAboveCationId,
    };
  });
}

function snapDroppedPiece(
  pieces: PlacedPiece[],
  dropId: string,
  dropX: number,
  dropY: number,
): PlacedPiece[] {
  const dropped = pieces.find((p) => p.id === dropId);
  if (!dropped) return pieces;

  let bestDist = SNAP_THR;
  let bestSnap:
    | { kind: "aniCat"; catId: string; tx: number; ty: number }
    | { kind: "catAni"; aniId: string; tx: number; ty: number }
    | { kind: "catCat"; topId: string; tx: number; ty: number }
    | null = null;

  if (dropped.ion.type === "minus") {
    for (const cat of pieces.filter((p) => p.id !== dropId && p.ion.type === "plus")) {
      const usedCharge = cat.bondedAnionIds.reduce((sum, aid) => {
        const a = pieces.find((p) => p.id === aid);
        return sum + (a?.ion.charge ?? 0);
      }, 0);
      if (usedCharge >= cat.ion.charge) continue;
      const tx = cat.x + PIECE_W - NOTCH_D;
      const ty = cat.y + usedCharge * UNIT_H;
      const dist = Math.hypot(dropX - tx, dropY - ty);
      if (dist < bestDist) { bestDist = dist; bestSnap = { kind: "aniCat", catId: cat.id, tx, ty }; }
    }
  } else {
    for (const ani of pieces.filter((p) => p.id !== dropId && p.ion.type === "minus" && !p.bondedToCationId)) {
      const tx = ani.x - PIECE_W + NOTCH_D;
      const ty = ani.y;
      const dist = Math.hypot(dropX - tx, dropY - ty);
      if (dist < bestDist) { bestDist = dist; bestSnap = { kind: "catAni", aniId: ani.id, tx, ty }; }
    }
    for (const topCat of pieces.filter((p) =>
      p.id !== dropId && p.ion.type === "plus" && p.ion.id === dropped.ion.id && !p.bondedBelowId,
    )) {
      const tx = topCat.x;
      const ty = topCat.y + topCat.ion.charge * UNIT_H;
      const dist = Math.hypot(dropX - tx, dropY - ty);
      if (dist < bestDist) { bestDist = dist; bestSnap = { kind: "catCat", topId: topCat.id, tx, ty }; }
    }
  }

  if (!bestSnap) return pieces;

  if (bestSnap.kind === "aniCat") {
    const { catId, tx, ty } = bestSnap;
    return pieces.map((p) => {
      if (p.id === dropId) return { ...p, x: tx, y: ty, bondedToCationId: catId };
      if (p.id === catId) return { ...p, bondedAnionIds: [...p.bondedAnionIds, dropId] };
      return p;
    });
  }
  if (bestSnap.kind === "catAni") {
    const { aniId, tx, ty } = bestSnap;
    return pieces.map((p) => {
      if (p.id === dropId) return { ...p, x: tx, y: ty, bondedAnionIds: [aniId] };
      if (p.id === aniId) return { ...p, bondedToCationId: dropId };
      return p;
    });
  }
  const { topId, tx, ty } = bestSnap;
  return pieces.map((p) => {
    if (p.id === dropId) return { ...p, x: tx, y: ty, bondedAboveCationId: topId };
    if (p.id === topId) return { ...p, bondedBelowId: dropId };
    return p;
  });
}

// ── Component ────────────────────────────────────────────────────────────────
interface FreeLabModalProps {
  onClose: () => void;
}

type CompletedCompound = { formula: string; name_ko: string | null };

export default function FreeLabModal({ onClose }: FreeLabModalProps) {
  const [placedPieces,      setPlacedPieces]      = useState<PlacedPiece[]>([]);
  const [completed,         setCompleted]          = useState<CompletedCompound[]>([]);
  const [activeDragIon,     setActiveDragIon]      = useState<Ion | null>(null);
  const [isDragOver,        setIsDragOver]         = useState(false);
  const [draggingPaletteId, setDraggingPaletteId]  = useState<string | null>(null);
  const [draggingPieceId,   setDraggingPieceId]    = useState<string | null>(null);

  const canvasRef      = useRef<HTMLDivElement>(null);
  const idCounter      = useRef(0);
  const pendingSnapRef = useRef<{ dropId: string; dropX: number; dropY: number } | null>(null);
  const pointerRef     = useRef({ x: 0, y: 0 });

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const track = (e: PointerEvent) => { pointerRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("pointermove", track, { passive: true, capture: true });
    window.addEventListener("pointerup",   track, { passive: true, capture: true });
    return () => {
      window.removeEventListener("pointermove", track, { capture: true });
      window.removeEventListener("pointerup",   track, { capture: true });
    };
  }, []);

  useEffect(() => {
    const snap = pendingSnapRef.current;
    if (!snap) return;
    pendingSnapRef.current = null;
    const id = requestAnimationFrame(() => {
      setPlacedPieces((prev) => snapDroppedPiece(prev, snap.dropId, snap.dropX, snap.dropY));
    });
    return () => cancelAnimationFrame(id);
  });

  const handleCanvasReady = useCallback((node: HTMLDivElement | null) => {
    canvasRef.current = node;
  }, []);

  const mkId = () => `fp${idCounter.current++}`;

  // ── Derived state ──────────────────────────────────────────────────────────
  const cations    = placedPieces.filter((p) => p.ion.type === "plus");
  const anions     = placedPieces.filter((p) => p.ion.type === "minus");
  const cationSum  = cations.reduce((s, p) => s + p.ion.charge, 0);
  const anionSum   = anions.reduce((s, p) => s + p.ion.charge, 0);
  const hasInput   = placedPieces.length > 0;
  const isBalanced = hasInput && cationSum > 0 && anionSum > 0 && cationSum === anionSum;

  const uniqueCationIds = [...new Set(cations.map((p) => p.ion.id))];
  const uniqueAnionIds  = [...new Set(anions.map((p) => p.ion.id))];
  const isSinglePair    = uniqueCationIds.length === 1 && uniqueAnionIds.length === 1;

  const lookupCationId = isBalanced && isSinglePair ? uniqueCationIds[0] : null;
  const lookupAnionId  = isBalanced && isSinglePair ? uniqueAnionIds[0]  : null;

  const currentFormula = isBalanced ? computeFormula(placedPieces) : null;

  // ── API lookup ─────────────────────────────────────────────────────────────
  const {
    data: compoundInfo,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["ionic-compound", lookupCationId, lookupAnionId],
    queryFn:  () => getIonicCompound(lookupCationId!, lookupAnionId!),
    enabled:  lookupCationId !== null && lookupAnionId !== null,
    staleTime: Infinity,
  });

  const canSave = isBalanced && isSinglePair && compoundInfo?.exists === true && !isFetching;

  // ── Drag handlers ──────────────────────────────────────────────────────────
  const resetDragState = () => {
    setActiveDragIon(null);
    setDraggingPaletteId(null);
    setDraggingPieceId(null);
    setIsDragOver(false);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current as LabDragData | undefined;
    if (!data) return;
    setActiveDragIon(data.ion);
    if (data.source === "palette") { setDraggingPaletteId(data.ion.id); return; }
    setDraggingPieceId(data.pieceId);
    setPlacedPieces((prev) => removePieceLinks(prev, data.pieceId));
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setIsDragOver(over?.id === "ionic-canvas");
  };

  const handleDragCancel = () => resetDragState();

  const handleDragEnd = ({ active, over, delta }: DragEndEvent) => {
    const data = active.data.current as LabDragData | undefined;
    const rect = canvasRef.current?.getBoundingClientRect();
    const initialRect = active.rect.current.initial;
    const droppedOnCanvas = over?.id === "ionic-canvas";

    if (!data || !rect || !droppedOnCanvas) {
      if (data?.source === "canvas") {
        const removeId = data.pieceId;
        setPlacedPieces((prev) => removePieceLinks(prev.filter((p) => p.id !== removeId), removeId));
      }
      resetDragState();
      return;
    }

    const ionH = data.ion.charge * UNIT_H;
    let rawX: number, rawY: number;
    if (data.source === "canvas" && initialRect) {
      rawX = initialRect.left + delta.x - rect.left;
      rawY = initialRect.top  + delta.y - rect.top;
    } else {
      rawX = pointerRef.current.x - rect.left - PIECE_W / 2;
      rawY = pointerRef.current.y - rect.top  - ionH / 2;
    }
    const dropX = Math.max(0, Math.min(rawX, CANVAS_W - PIECE_W));
    const dropY = Math.max(0, Math.min(rawY, CANVAS_H - ionH));
    const dropId = data.source === "palette" ? mkId() : data.pieceId;

    setPlacedPieces((prev) => {
      if (data.source === "palette") {
        return [...prev, { id: dropId, ion: data.ion, x: dropX, y: dropY, bondedAnionIds: [], bondedToCationId: null, bondedBelowId: null, bondedAboveCationId: null }];
      }
      return prev.map((p) => (p.id === dropId ? { ...p, x: dropX, y: dropY } : p));
    });

    pendingSnapRef.current = { dropId, dropX, dropY };
    resetDragState();
  };

  const handleRemovePiece = (id: string) => {
    setPlacedPieces((prev) => removePieceLinks(prev.filter((p) => p.id !== id), id));
  };

  const handleSave = () => {
    if (!canSave || !currentFormula) return;
    setCompleted((prev) => [
      ...prev,
      { formula: currentFormula, name_ko: compoundInfo?.name_ko ?? null },
    ]);
    setPlacedPieces([]);
  };

  // ── Compound card helper ───────────────────────────────────────────────────
  function renderCompoundBody() {
    if (!isBalanced) {
      return (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, lineHeight: "46px", color: "var(--color-text-disabled)" }}>
            —
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", color: "var(--color-text-disabled)", textAlign: "center" }}>
            화합물을 만들어 주세요!
          </span>
        </>
      );
    }

    if (!isSinglePair) {
      return (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, lineHeight: "46px", color: "var(--color-text-disabled)" }}>
            —
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "18px", letterSpacing: "-0.005em", color: "var(--color-text-sub)", textAlign: "center" }}>
            이온 종류를 각각 하나씩만 사용해 주세요
          </span>
        </>
      );
    }

    if (isFetching) {
      return (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, lineHeight: "46px", color: "var(--color-text-disabled)" }}>
            {currentFormula}
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 13, lineHeight: "18px", color: "var(--color-text-disabled)" }}>
            확인 중...
          </span>
        </>
      );
    }

    if (isError) {
      return (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, lineHeight: "46px", color: "var(--color-text-disabled)" }}>
            {currentFormula}
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "18px", color: "var(--color-text-sub)", textAlign: "center" }}>
            정보를 불러올 수 없어요
          </span>
        </>
      );
    }

    if (compoundInfo?.exists) {
      const infoRows = [
        compoundInfo.common_name && { label: "별칭", value: compoundInfo.common_name },
        compoundInfo.color       && { label: "색",   value: compoundInfo.color },
        compoundInfo.solubility  && { label: "용해도", value: compoundInfo.solubility },
      ].filter(Boolean) as { label: string; value: string }[];

      return (
        <>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, lineHeight: "46px", color: "var(--color-primary-normal)" }}>
            {currentFormula}
          </span>
          {compoundInfo.name_ko && (
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "20px", color: "var(--color-text-normal)" }}>
              {compoundInfo.name_ko}
            </span>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="7" fill="#17B26A" />
              <path d="M4 7l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 12, lineHeight: "18px", color: "#17B26A" }}>
              이온 화합물이에요
            </span>
          </div>
          {(infoRows.length > 0 || compoundInfo.notes) && (
            <div style={{
              width: "100%",
              borderTop: "1px solid var(--color-border-light)",
              marginTop: 6,
              paddingTop: 8,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              alignItems: "flex-start",
            }}>
              {infoRows.map(({ label, value }) => (
                <div key={label} style={{ display: "flex", gap: 6, width: "100%" }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 11, lineHeight: "18px", color: "var(--color-text-sub)", flexShrink: 0, minWidth: 36 }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 11, lineHeight: "18px", color: "var(--color-text-normal)" }}>
                    {value}
                  </span>
                </div>
              ))}
              {compoundInfo.notes && (
                <p style={{
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  fontSize: 11,
                  lineHeight: "17px",
                  color: "var(--color-text-sub)",
                  fontStyle: "italic",
                  marginTop: infoRows.length > 0 ? 2 : 0,
                }}>
                  {compoundInfo.notes}
                </p>
              )}
            </div>
          )}
        </>
      );
    }

    // exists === false
    return (
      <>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 36, lineHeight: "46px", color: "#F07B2F" }}>
          {currentFormula}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="7" fill="#F07B2F" />
            <path d="M7 4v3.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
            <circle cx="7" cy="10" r="0.8" fill="white" />
          </svg>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 12, lineHeight: "18px", color: "#F07B2F" }}>
            이온 화합물이 아니에요
          </span>
        </div>
        {compoundInfo?.reason_if_not && (
          <div style={{
            width: "100%",
            background: "#FFF6ED",
            border: "1px solid #FAD6BF",
            borderRadius: 8,
            padding: "10px 12px",
            marginTop: 4,
          }}>
            <p style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontWeight: 400,
              fontSize: 12,
              lineHeight: "18px",
              color: "#B05100",
            }}>
              {compoundInfo.reason_if_not}
            </p>
          </div>
        )}
      </>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay dropAnimation={null}>
          {activeDragIon ? <PuzzleGhost ion={activeDragIon} /> : null}
        </DragOverlay>

        <div
          style={{
            width: 1359, maxWidth: "calc(100vw - 32px)",
            height: 702, maxHeight: "calc(100vh - 32px)",
            background: "rgba(253,253,253,0.95)",
            borderRadius: 24,
            display: "flex", flexDirection: "column",
            padding: 40, gap: 24,
            boxShadow: "0px 0px 117.6px rgba(0,0,0,0.1)",
            backdropFilter: "blur(2px)",
            overflow: "hidden",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Header ── */}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", flexShrink: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <h3 style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, lineHeight: "30px", color: "var(--color-text-strong)" }}>
                자유 실험실
              </h3>
              <p style={{ margin: 0, fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 15, lineHeight: "24px", letterSpacing: "-0.005em", color: "var(--color-text-sub)" }}>
                이온 퍼즐을 조합해서 다양한 화합물을 만들어 보세요!
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              style={{ width: 24, height: 24, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, flexShrink: 0 }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 1L1 13M1 1L13 13" stroke="var(--color-text-normal)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* ── Content (3 columns) ── */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 16, flex: 1, minHeight: 0 }}>

            {/* Left: Ion palette */}
            <IonTabList draggingIonId={draggingPaletteId} height={532} />

            {/* Middle: Canvas panel */}
            <div
              style={{
                boxSizing: "border-box",
                display: "flex", flexDirection: "column",
                alignItems: "flex-start",
                padding: 20, gap: 12,
                flex: 1, alignSelf: "stretch",
                background: "var(--color-static-white)",
                border: "1px solid var(--color-border-normal)",
                borderRadius: 12,
                minWidth: 0,
              }}
            >
              {/* Toolbar */}
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 34, flexShrink: 0, width: "100%" }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0 }}>
                  <ToolBtn
                    onClick={() => {
                      if (!hasInput) return;
                      const lastId = placedPieces[placedPieces.length - 1].id;
                      setPlacedPieces((prev) =>
                        removePieceLinks(prev.slice(0, -1), lastId),
                      );
                    }}
                    disabled={!hasInput}
                  >
                    되돌리기
                  </ToolBtn>
                  <ToolBtn onClick={() => setPlacedPieces([])} disabled={!hasInput}>
                    초기화
                  </ToolBtn>
                </div>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  style={{
                    width: 64, height: 34,
                    background: canSave ? "var(--color-primary-normal)" : "#F4F5F8",
                    color: canSave ? "var(--color-static-white)" : "#E0E1E4",
                    border: "none", borderRadius: 8, cursor: canSave ? "pointer" : "default",
                    fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 13, lineHeight: "18px",
                    flexShrink: 0, transition: "background 0.2s, color 0.2s",
                  }}
                >
                  저장하기
                </button>
              </div>

              {/* Canvas */}
              <CanvasDropZone
                onCanvasReady={handleCanvasReady}
                placedPieces={placedPieces}
                onRemove={handleRemovePiece}
                isDragOver={isDragOver}
                isCorrect={canSave}
                isWrong={isBalanced && compoundInfo?.exists === false}
                draggingPieceId={draggingPieceId}
                height={CANVAS_H}
                width={CANVAS_W}
                hideEmptyToast
              />
            </div>

            {/* Right: Compound info */}
            <div
              style={{
                width: 260, flexShrink: 0,
                display: "flex", flexDirection: "column", gap: 12,
                alignSelf: "stretch",
              }}
            >
              {/* Current compound card */}
              <div
                style={{
                  boxSizing: "border-box",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  padding: "12px 16px", gap: 6,
                  background: "var(--color-static-white)",
                  border: "1px solid var(--color-border-normal)",
                  borderRadius: 12,
                  flexShrink: 0,
                }}
              >
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", color: "var(--color-text-normal)", alignSelf: "flex-start" }}>
                  현재 화합물
                </span>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: "100%" }}>
                  {renderCompoundBody()}
                </div>
              </div>

              {/* Completed compounds */}
              <div
                style={{
                  boxSizing: "border-box",
                  display: "flex", flexDirection: "column", gap: 12,
                  padding: "12px 20px",
                  background: "var(--color-static-white)",
                  border: "1px solid var(--color-border-normal)",
                  borderRadius: 12,
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 14, lineHeight: "20px", letterSpacing: "-0.005em", color: "var(--color-text-sub)" }}>
                    지금까지 완성한 화합물
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="6.5" stroke="var(--color-text-disabled)" />
                    <path d="M8 7v4" stroke="var(--color-text-disabled)" strokeWidth="1.2" strokeLinecap="round" />
                    <circle cx="8" cy="5.5" r="0.7" fill="var(--color-text-disabled)" />
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, overflowY: "auto", flex: 1 }}>
                  {completed.length === 0 ? (
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 13, lineHeight: "18px", color: "var(--color-text-disabled)", textAlign: "center" }}>
                      —
                    </span>
                  ) : (
                    completed.map((c, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex", flexDirection: "row", alignItems: "center",
                          padding: "6px 10px",
                          background: "var(--color-bg-elevate)",
                          borderRadius: 8,
                          gap: 6,
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "20px", color: "var(--color-text-strong)" }}>
                            {c.formula}
                          </span>
                          {c.name_ko && (
                            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "16px", color: "var(--color-text-sub)" }}>
                              {c.name_ko}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}
