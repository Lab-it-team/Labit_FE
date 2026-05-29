import { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import LessonHeader from "@/components/lesson/LessonHeader";
import ContentTab from "@/components/lesson/ContentTab";
import AiFab from "@/components/lesson/AiFab";
import IonTabList from "@/components/lab/IonTabList";
import TargetCompoundPanel from "@/components/lab/TargetCompoundPanel";
import PuzzleGhost from "@/components/lab/PuzzleGhost";
import CanvasDropZone from "@/components/lab/CanvasDropZone";
import ToolBtn from "@/components/lab/ToolBtn";
import type { PlacedPiece } from "@/components/lab/CanvasDropZone";
import { CATIONS, ANIONS } from "@/data/ions";
import type { Ion } from "@/data/ions";
import lockSvg from "@/assets/Icon/lock.svg";

// ── Puzzle geometry (matches puzzlePaths.ts) ──────────────────────────────
const PIECE_W  = 120;   // cation & anion both 120px wide
const NOTCH_D  = 20;    // notch depth / protrusion width
const UNIT_H   = 100;   // height per charge unit
const SNAP_THR = 80;    // snap threshold in px

interface Problem {
  id: number;
  name: string;
  formula: string;
  cation: Ion;
  anion: Ion;
  cationCount: number;
  anionCount: number;
}

const PROBLEMS: Problem[] = [
  {
    id: 1, name: "염화나트륨", formula: "NaCl",
    cation: CATIONS.find((i) => i.id === "Na")!,
    anion:  ANIONS.find((i)  => i.id === "Cl")!,
    cationCount: 1, anionCount: 1,
  },
  {
    id: 2, name: "염화마그네슘", formula: "MgCl₂",
    cation: CATIONS.find((i) => i.id === "Mg")!,
    anion:  ANIONS.find((i)  => i.id === "Cl")!,
    cationCount: 1, anionCount: 2,
  },
  {
    id: 3, name: "염화알루미늄", formula: "AlCl₃",
    cation: CATIONS.find((i) => i.id === "Al")!,
    anion:  ANIONS.find((i)  => i.id === "Cl")!,
    cationCount: 1, anionCount: 3,
  },
];

interface DragState {
  id: string | null;
  ion: Ion | null;
  fromPalette: boolean;
  offsetX: number;
  offsetY: number;
}

export default function IonicLab() {
  const navigate = useNavigate();
  const [activeTab,          setActiveTab]          = useState<"learn" | "practice">("practice");
  const [showProgressBadge,  setShowProgressBadge]  = useState(true);
  const [currentProblem,     setCurrentProblem]     = useState(0);
  const [placedPieces,       setPlacedPieces]       = useState<PlacedPiece[]>([]);
  const [isWrong,            setIsWrong]            = useState(false);
  const [checkKey,           setCheckKey]           = useState(0);
  const [solvedProblems,     setSolvedProblems]      = useState<Set<number>>(new Set());
  const [ghost,              setGhost]              = useState<{ ion: Ion; x: number; y: number } | null>(null);
  const [isDragOver,         setIsDragOver]         = useState(false);
  const [draggingPaletteId,  setDraggingPaletteId]  = useState<string | null>(null);

  const canvasRef  = useRef<HTMLDivElement>(null);
  const dragRef    = useRef<DragState>({ id: null, ion: null, fromPalette: false, offsetX: 0, offsetY: 0 });
  const idCounter  = useRef(0);
  const cleanupRef = useRef<() => void>(() => {});

  const mkId = () => `p${idCounter.current++}`;

  const problem = PROBLEMS[currentProblem];

  const cationSum   = placedPieces.filter((p) => p.ion.type === "plus").reduce((s, p) => s + p.ion.charge, 0);
  const anionSum    = placedPieces.filter((p) => p.ion.type === "minus").reduce((s, p) => s + p.ion.charge, 0);
  const totalCharge = cationSum - anionSum;
  const isCorrect   = totalCharge === 0 && placedPieces.length > 0;

  // ── pointer move: update ghost / dragging piece position ─────────────────
  const onMove = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d.ion) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setIsDragOver(
        e.clientX >= rect.left && e.clientX <= rect.right &&
        e.clientY >= rect.top  && e.clientY <= rect.bottom,
      );
    }

    if (d.fromPalette) {
      setGhost({ ion: d.ion, x: e.clientX - d.offsetX, y: e.clientY - d.offsetY });
    } else if (d.id && rect) {
      setPlacedPieces((prev) =>
        prev.map((p) =>
          p.id === d.id
            ? { ...p, x: e.clientX - rect.left - d.offsetX, y: e.clientY - rect.top - d.offsetY }
            : p,
        ),
      );
    }
  }, []);

  // ── pointer up: place piece + snap ───────────────────────────────────────
  const onUp = useCallback((e: PointerEvent) => {
    const d = dragRef.current;
    if (!d.ion) return;

    setGhost(null);

    const rect = canvasRef.current?.getBoundingClientRect();

    // Dropped outside canvas → discard palette drag or remove canvas piece
    if (
      !rect ||
      e.clientX < rect.left || e.clientX > rect.right ||
      e.clientY < rect.top  || e.clientY > rect.bottom
    ) {
      if (!d.fromPalette && d.id) {
        const rid = d.id;
        setPlacedPieces((prev) =>
          prev
            .filter((p) => p.id !== rid)
            .map((p) => ({
              ...p,
              bondedAnionIds:   p.bondedAnionIds.filter((a) => a !== rid),
              bondedToCationId: p.bondedToCationId === rid ? null : p.bondedToCationId,
            })),
        );
      }
      cleanupRef.current();
      return;
    }

    const dropX = e.clientX - rect.left - d.offsetX;
    const dropY = e.clientY - rect.top  - d.offsetY;

    setPlacedPieces((prev) => {
      let next    = [...prev];
      let dropId  = d.id;

      // Add new piece from palette
      if (d.fromPalette) {
        const newId = mkId();
        next   = [...next, { id: newId, ion: d.ion!, x: dropX, y: dropY, bondedAnionIds: [], bondedToCationId: null }];
        dropId = newId;
      } else {
        next = next.map((p) => (p.id === dropId ? { ...p, x: dropX, y: dropY } : p));
      }

      const dropped = next.find((p) => p.id === dropId)!;

      // ── Snap logic ────────────────────────────────────────────────────────
      // anion.x = cation.x + PIECE_W - NOTCH_D  (= cation.x + 100)
      // anion.y = cation.y + usedCharge * UNIT_H
      // ─────────────────────────────────────────────────────────────────────

      let bestDist = SNAP_THR;
      let bestSnap: { kind: "aniCat"; catId: string; tx: number; ty: number }
                  | { kind: "catAni"; aniId: string; tx: number; ty: number }
                  | null = null;

      if (dropped.ion.type === "minus") {
        // Anion looking for a cation with free slots
        for (const cat of next.filter((p) => p.id !== dropId && p.ion.type === "plus")) {
          const usedCharge = cat.bondedAnionIds.reduce((sum, aid) => {
            const a = next.find((p) => p.id === aid);
            return sum + (a?.ion.charge ?? 0);
          }, 0);
          if (dropped.ion.charge > cat.ion.charge - usedCharge) continue;

          const tx   = cat.x + PIECE_W - NOTCH_D;
          const ty   = cat.y + usedCharge * UNIT_H;
          const dist = Math.hypot(dropX - tx, dropY - ty);
          if (dist < bestDist) { bestDist = dist; bestSnap = { kind: "aniCat", catId: cat.id, tx, ty }; }
        }
      } else {
        // Cation looking for a free anion (slot 0 alignment)
        for (const ani of next.filter((p) => p.id !== dropId && p.ion.type === "minus" && !p.bondedToCationId)) {
          const tx   = ani.x - PIECE_W + NOTCH_D;
          const ty   = ani.y;
          const dist = Math.hypot(dropX - tx, dropY - ty);
          if (dist < bestDist) { bestDist = dist; bestSnap = { kind: "catAni", aniId: ani.id, tx, ty }; }
        }
      }

      if (!bestSnap) return next;

      if (bestSnap.kind === "aniCat") {
        const { catId, tx, ty } = bestSnap;
        next = next.map((p) => {
          if (p.id === dropId)  return { ...p, x: tx, y: ty, bondedToCationId: catId };
          if (p.id === catId)   return { ...p, bondedAnionIds: [...p.bondedAnionIds, dropId!] };
          return p;
        });
      } else {
        const { aniId, tx, ty } = bestSnap;
        next = next.map((p) => {
          if (p.id === dropId) return { ...p, x: tx, y: ty, bondedAnionIds: [aniId] };
          if (p.id === aniId)  return { ...p, bondedToCationId: dropId };
          return p;
        });
      }

      return next;
    });

    cleanupRef.current();
  }, []);

  const cleanup = useCallback(() => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup",   onUp);
    dragRef.current = { id: null, ion: null, fromPalette: false, offsetX: 0, offsetY: 0 };
    setIsDragOver(false);
    setDraggingPaletteId(null);
  }, [onMove, onUp]);

  cleanupRef.current = cleanup;

  // ── Start drag from palette ───────────────────────────────────────────────
  const handlePaletteDragStart = useCallback((ion: Ion, e: React.PointerEvent) => {
    e.preventDefault();
    const h = ion.charge * UNIT_H;
    dragRef.current = { id: null, ion, fromPalette: true, offsetX: 60, offsetY: h / 2 };
    setGhost({ ion, x: e.clientX - 60, y: e.clientY - h / 2 });
    setDraggingPaletteId(ion.id);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
  }, [onMove, onUp]);

  // ── Start drag from canvas ────────────────────────────────────────────────
  const handleCanvasDragStart = useCallback((id: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const piece = placedPieces.find((p) => p.id === id);
    if (!piece) return;

    const rect    = canvasRef.current!.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - piece.x;
    const offsetY = e.clientY - rect.top  - piece.y;

    dragRef.current = { id, ion: piece.ion, fromPalette: false, offsetX, offsetY };

    // Unbond the dragged piece
    setPlacedPieces((prev) =>
      prev.map((p) => {
        if (p.id === id) return { ...p, bondedAnionIds: [], bondedToCationId: null };
        return {
          ...p,
          bondedAnionIds:   p.bondedAnionIds.filter((a) => a !== id),
          bondedToCationId: p.bondedToCationId === id ? null : p.bondedToCationId,
        };
      }),
    );

    setIsWrong(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup",   onUp);
  }, [placedPieces, onMove, onUp]);

  // ── Remove piece ──────────────────────────────────────────────────────────
  function handleRemovePiece(id: string) {
    setPlacedPieces((prev) =>
      prev
        .filter((p) => p.id !== id)
        .map((p) => ({
          ...p,
          bondedAnionIds:   p.bondedAnionIds.filter((a) => a !== id),
          bondedToCationId: p.bondedToCationId === id ? null : p.bondedToCationId,
        })),
    );
    setIsWrong(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-normal)" }}>
      <LessonHeader
        lessonLabel="2-2."
        lessonTitle="이온 결합 실습"
        progressWidth="0%"
        progressPercent={0}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        nextLesson={{ label: "공유 결합 학습", path: "/covalent-concept" }}
        onListClick={() => {}}
      />

      {/* Ghost follows cursor globally */}
      {ghost && (
        <div
          style={{
            position: "fixed",
            left: ghost.x,
            top: ghost.y,
            pointerEvents: "none",
            zIndex: 9999,
            opacity: 0.9,
          }}
        >
          <PuzzleGhost ion={ghost.ion} />
        </div>
      )}

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 60,
          paddingBottom: 24,
          gap: 48,
          marginTop: 60,
        }}
      >
        {/* Tab + Title + Step indicators */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 42, width: 900 }}>
          <ContentTab
            active={activeTab}
            onChange={(v) => {
              if (v === "learn") navigate("/ionic-concept");
              else setActiveTab(v);
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: 900, alignSelf: "stretch" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 900, alignSelf: "stretch" }}>
              <h1 className="text-heading-xl text-text-strong m-0">목표 화합물 만들기</h1>
              <p className="text-body-sm text-text-sub m-0">플러스(+)와 마이너스(-)의 합이 '0'이 되도록 퍼즐을 연결해 보세요!</p>
            </div>

            {/* Problem selector */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8, width: 168 }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                {PROBLEMS.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => { setCurrentProblem(i); setPlacedPieces([]); setIsWrong(false); }}
                    style={{
                      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                      padding: 4, width: 24, height: 24,
                      background: i === currentProblem ? "var(--color-primary-normal)" : "var(--color-primary-light)",
                      borderRadius: 6, border: "none", cursor: "pointer",
                      fontFamily: "Pretendard", fontWeight: 500, fontSize: 12, lineHeight: "16px",
                      letterSpacing: "-0.005em",
                      color: i === currentProblem ? "var(--color-static-white)" : "var(--color-text-sub)",
                    }}
                  >
                    {p.id}
                  </button>
                ))}
                {[4, 5].map((n) => (
                  <div
                    key={n}
                    style={{
                      position: "relative", display: "flex", flexDirection: "column",
                      justifyContent: "center", alignItems: "center", padding: 4, width: 24, height: 24,
                      background: "var(--color-bg-elevate)", borderRadius: 6,
                      fontFamily: "Pretendard", fontWeight: 500, fontSize: 12, lineHeight: "16px",
                      color: "var(--color-text-disabled)",
                    }}
                  >
                    {n}
                    <img src={lockSvg} alt="locked" width={20} height={20} style={{ position: "absolute", top: -10, right: -10 }} />
                  </div>
                ))}
              </div>

              {solvedProblems.has(2) && (
                <button
                  className="more-problems-btn"
                  style={{
                    display: "flex", flexDirection: "row", alignItems: "center",
                    padding: "6px 8px", gap: 4, height: 32, borderRadius: 8,
                    background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontFamily: "Pretendard, sans-serif", fontWeight: 500, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", color: "inherit" }}>
                    더 많은 문제 풀기
                  </span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 12L5 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Target compound + lab area */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 900 }}>
          <TargetCompoundPanel
            formula={problem.formula}
            name={problem.name}
            cationSum={cationSum}
            anionSum={anionSum}
            totalCharge={totalCharge}
            isCorrect={isCorrect}
            hasInput={placedPieces.length > 0}
          />

          {/* Ion list + canvas */}
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 16, width: 900 }}>
            <IonTabList onPaletteDragStart={handlePaletteDragStart} draggingIonId={draggingPaletteId} />

            {/* Canvas panel */}
            <div
              style={{
                boxSizing: "border-box", display: "flex", flexDirection: "column",
                alignItems: "flex-start", padding: 20, gap: 12, width: 588,
                background: "var(--color-static-white)", border: "1px solid var(--color-border-normal)",
                borderRadius: 12, flexGrow: 1,
              }}
            >
              {/* Toolbar */}
              <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 34 }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0, height: 34 }}>
                  <ToolBtn
                    onClick={() => {
                      setPlacedPieces((prev) => {
                        if (prev.length === 0) return prev;
                        const lastId = prev[prev.length - 1].id;
                        return prev.slice(0, -1).map((p) => ({
                          ...p,
                          bondedAnionIds:   p.bondedAnionIds.filter((a) => a !== lastId),
                          bondedToCationId: p.bondedToCationId === lastId ? null : p.bondedToCationId,
                        }));
                      });
                      setIsWrong(false);
                    }}
                    disabled={placedPieces.length === 0}
                  >
                    되돌리기
                  </ToolBtn>
                  <ToolBtn
                    onClick={() => { setPlacedPieces([]); setIsWrong(false); }}
                    disabled={placedPieces.length === 0}
                  >
                    초기화
                  </ToolBtn>
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, height: 34 }}>
                  <ToolBtn onClick={() => {}} bordered>힌트 보기</ToolBtn>
                  <ToolBtn
                    onClick={() => {
                      setCheckKey((k) => k + 1);
                      if (isCorrect) setSolvedProblems((prev) => new Set([...prev, currentProblem]));
                      else setIsWrong(true);
                    }}
                    disabled={placedPieces.length === 0}
                    primary
                  >
                    정답 확인
                  </ToolBtn>
                </div>
              </div>

              <CanvasDropZone
                canvasRef={canvasRef}
                placedPieces={placedPieces}
                onRemove={handleRemovePiece}
                onPieceDragStart={handleCanvasDragStart}
                isDragOver={isDragOver}
                isCorrect={isCorrect}
                isWrong={isWrong}
                checkKey={checkKey}
              />
            </div>
          </div>
        </div>
      </div>

      <AiFab />
    </div>
  );
}
