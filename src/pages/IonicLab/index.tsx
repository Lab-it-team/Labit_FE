import { useState, useRef, useCallback, useEffect } from "react";
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
import { useNavigate } from "react-router";
import LessonHeader from "@/components/lesson/LessonHeader";
import ContentTab from "@/components/lesson/ContentTab";
import AiFab from "@/components/lesson/AiFab";
import IonTabList from "@/components/lab/IonTabList";
import TargetCompoundPanel from "@/components/lab/TargetCompoundPanel";
import PuzzleGhost from "@/components/lab/PuzzleGhost";
import CanvasDropZone from "@/components/lab/CanvasDropZone";
import ToolBtn from "@/components/lab/ToolBtn";
import KakaoLoginModal from "@/components/lab/KakaoLoginModal";
import FreeLabModal from "@/components/lab/FreeLabModal";
import OnboardingStartModal from "@/components/lab/OnboardingStartModal";
import GuideTooltip from "@/components/lab/GuideTooltip";
import DragDemoOverlay from "@/components/lab/DragDemoOverlay";
import MergedPiecesPreview from "@/components/lab/MergedPiecesPreview";
import LessonCompleteModal from "@/components/lesson/LessonCompleteModal";
import type { PlacedPiece } from "@/components/lab/CanvasDropZone";
import { CATIONS, ANIONS } from "@/data/ions";
import type { Ion } from "@/data/ions";
import { cardHeight } from "@/components/lab/puzzlePaths";
import { useAuthStore } from "@/stores/authStore";
import lockSvg from "@/assets/icons/lock.svg";

// ── Puzzle geometry (matches puzzlePaths.ts) ──────────────────────────────
const PIECE_W   = 120;   // cation & anion both 120px wide
const NOTCH_D   = 20;    // notch depth / protrusion width
const UNIT_H    = 100;   // height per charge unit
const SNAP_THR  = 80;    // snap threshold in px
const CANVAS_W  = 548;   // inner canvas width

interface Problem {
  id: number;
  name: string;
  formula: string;
  cation: Ion;
  anion: Ion;
  cationCount: number;
  anionCount: number;
}

const FREE_LIMIT = 3; // 비로그인 사용자에게 제공되는 문제 수
const ONBOARDING_STORAGE_KEY = "lab_onboarding_seen";
const ONBOARDING_TOOLTIP_STEPS = 4;
const ONBOARDING_DEMO_CYCLE_MS = 4400;

// IonTabList 팔레트 그리드(2열, gap16)에서 index번째 칸의 중심 좌표
// ("이온 목록 + 캔버스" row 기준 상대 좌표) — 전하가 큰 이온은 카드가 더 높아지므로
// 실제 각 행의 카드 높이(cardHeight)를 누적해서 y축을 계산한다.
function paletteSlotCenter(ions: Ion[], index: number) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const rowHeight = (r: number) => {
    const a = ions[r * 2];
    const b = ions[r * 2 + 1];
    return Math.max(cardHeight(a), b ? cardHeight(b) : 0);
  };
  let yOffset = 0;
  for (let r = 0; r < row; r++) yOffset += rowHeight(r) + 16;
  return { x: col === 0 ? 80 : 216, y: 120 + yOffset + rowHeight(row) / 2 };
}

const PROBLEMS: Problem[] = [
  {
    id: 1, name: "염화나트륨", formula: "NaCl",
    cation: CATIONS.find((i) => i.id === "Na")!,
    anion:  ANIONS.find((i)  => i.id === "Cl")!,
    cationCount: 1, anionCount: 1,
  },
  {
    id: 2, name: "산화마그네슘", formula: "MgO",
    cation: CATIONS.find((i) => i.id === "Mg")!,
    anion:  ANIONS.find((i)  => i.id === "O")!,
    cationCount: 1, anionCount: 1,
  },
  {
    id: 3, name: "브롬화칼륨", formula: "KBr",
    cation: CATIONS.find((i) => i.id === "K")!,
    anion:  ANIONS.find((i)  => i.id === "Br")!,
    cationCount: 1, anionCount: 1,
  },
  {
    id: 4, name: "황산칼슘", formula: "CaSO₄",
    cation: CATIONS.find((i) => i.id === "Ca")!,
    anion:  ANIONS.find((i)  => i.id === "SO4")!,
    cationCount: 1, anionCount: 1,
  },
  {
    id: 5, name: "산화알루미늄", formula: "Al₂O₃",
    cation: CATIONS.find((i) => i.id === "Al")!,
    anion:  ANIONS.find((i)  => i.id === "O")!,
    cationCount: 2, anionCount: 3,
  },
];

type LabDragData =
  | { source: "palette"; ion: Ion }
  | { source: "canvas"; pieceId: string; ion: Ion };

function parseStoredNumbers(value: string | null): number[] {
  if (!value) return [];
  try { return JSON.parse(value) as number[]; } catch { return []; }
}

function parseStoredPieces(value: string | null): Record<number, PlacedPiece[]> {
  if (!value) return {};
  try {
    const data = JSON.parse(value) as Record<number, PlacedPiece[]>;
    return Object.fromEntries(
      Object.entries(data).map(([k, pieces]) => [
        k,
        pieces.map((p) => ({
          ...p,
          bondedBelowId: p.bondedBelowId ?? null,
          bondedAboveCationId: p.bondedAboveCationId ?? null,
        })),
      ]),
    );
  } catch {
    return {};
  }
}

function getNextPieceId(piecesByProblem: Record<number, PlacedPiece[]>) {
  return Object.values(piecesByProblem)
    .flat()
    .reduce((max, piece) => {
      const match = /^p(\d+)$/.exec(piece.id);
      return match ? Math.max(max, Number(match[1]) + 1) : max;
    }, 0);
}

function removePieceLinks(pieces: PlacedPiece[], id: string) {
  return pieces.map((p) => {
    if (p.id === id) return { ...p, bondedAnionIds: [], bondedToCationId: null, bondedBelowId: null, bondedAboveCationId: null };
    return {
      ...p,
      bondedAnionIds:      p.bondedAnionIds.filter((a) => a !== id),
      bondedToCationId:    p.bondedToCationId === id ? null : p.bondedToCationId,
      bondedBelowId:       p.bondedBelowId === id ? null : p.bondedBelowId,
      bondedAboveCationId: p.bondedAboveCationId === id ? null : p.bondedAboveCationId,
    };
  });
}

function snapDroppedPiece(pieces: PlacedPiece[], dropId: string, dropX: number, dropY: number) {
  const dropped = pieces.find((p) => p.id === dropId);
  if (!dropped) return pieces;

  let bestDist = SNAP_THR;
  let bestSnap:
    | { kind: "aniCat"; catId: string; tx: number; ty: number }
    | { kind: "catAni"; aniId: string; tx: number; ty: number }
    | { kind: "catCat"; topId: string; tx: number; ty: number }
    | null = null;

  if (dropped.ion.type === "minus") {
    // 음이온 → 양이온 오른쪽에 스냅
    for (const cat of pieces.filter((p) => p.id !== dropId && p.ion.type === "plus")) {
      const usedCharge = cat.bondedAnionIds.reduce((sum, aid) => {
        const a = pieces.find((p) => p.id === aid);
        return sum + (a?.ion.charge ?? 0);
      }, 0);
      if (usedCharge >= cat.ion.charge) continue;

      const tx   = cat.x + PIECE_W - NOTCH_D;
      const ty   = cat.y + usedCharge * UNIT_H;
      const dist = Math.hypot(dropX - tx, dropY - ty);
      if (dist < bestDist) { bestDist = dist; bestSnap = { kind: "aniCat", catId: cat.id, tx, ty }; }
    }
  } else {
    // 양이온 → 자유 음이온 왼쪽에 스냅
    for (const ani of pieces.filter((p) => p.id !== dropId && p.ion.type === "minus" && !p.bondedToCationId)) {
      const tx   = ani.x - PIECE_W + NOTCH_D;
      const ty   = ani.y;
      const dist = Math.hypot(dropX - tx, dropY - ty);
      if (dist < bestDist) { bestDist = dist; bestSnap = { kind: "catAni", aniId: ani.id, tx, ty }; }
    }

    // 양이온 → 같은 종류 양이온 바로 아래에 수직 스냅
    for (const topCat of pieces.filter((p) =>
      p.id !== dropId &&
      p.ion.type === "plus" &&
      p.ion.id === dropped.ion.id &&
      !p.bondedBelowId
    )) {
      const tx   = topCat.x;
      const ty   = topCat.y + topCat.ion.charge * UNIT_H;
      const dist = Math.hypot(dropX - tx, dropY - ty);
      if (dist < bestDist) { bestDist = dist; bestSnap = { kind: "catCat", topId: topCat.id, tx, ty }; }
    }
  }

  if (!bestSnap) return pieces;

  if (bestSnap.kind === "aniCat") {
    const { catId, tx, ty } = bestSnap;
    return pieces.map((p) => {
      if (p.id === dropId) return { ...p, x: tx, y: ty, bondedToCationId: catId };
      if (p.id === catId)  return { ...p, bondedAnionIds: [...p.bondedAnionIds, dropId] };
      return p;
    });
  }

  if (bestSnap.kind === "catAni") {
    const { aniId, tx, ty } = bestSnap;
    return pieces.map((p) => {
      if (p.id === dropId) return { ...p, x: tx, y: ty, bondedAnionIds: [aniId] };
      if (p.id === aniId)  return { ...p, bondedToCationId: dropId };
      return p;
    });
  }

  // catCat: 드롭된 양이온을 topCat 바로 아래에 수직 결합
  const { topId, tx, ty } = bestSnap;
  return pieces.map((p) => {
    if (p.id === dropId) return { ...p, x: tx, y: ty, bondedAboveCationId: topId };
    if (p.id === topId)  return { ...p, bondedBelowId: dropId };
    return p;
  });
}

export default function IonicLab() {
  const navigate    = useNavigate();
  const isLoggedIn  = !!useAuthStore((s) => s.accessToken);
  const [activeTab,          setActiveTab]          = useState<"learn" | "practice">("practice");
  const [showProgressBadge,  setShowProgressBadge]  = useState(true);
  const [currentProblem,     setCurrentProblem]     = useState(() => {
    const saved = sessionStorage.getItem("lab_current_problem");
    if (saved !== null) { sessionStorage.removeItem("lab_current_problem"); return parseInt(saved); }
    return 0;
  });
  const [allPieces,          setAllPieces]          = useState<Record<number, PlacedPiece[]>>(() => {
    const saved = parseStoredPieces(sessionStorage.getItem("lab_placed_pieces"));
    const preLoginSaved = parseStoredPieces(sessionStorage.getItem("lab_pre_login_placed_pieces"));
    sessionStorage.removeItem("lab_pre_login_placed_pieces");
    return { ...saved, ...preLoginSaved };
  });
  const [isWrong,            setIsWrong]            = useState(false);
  const [checkKey,           setCheckKey]           = useState(0);
  const [solvedProblems,     setSolvedProblems]      = useState<Set<number>>(() => {
    const saved = sessionStorage.getItem("lab_solved_problems");
    const preLoginSaved = sessionStorage.getItem("lab_pre_login_solved_problems");
    if (preLoginSaved) sessionStorage.removeItem("lab_pre_login_solved_problems");
    const merged = [
      ...parseStoredNumbers(saved),
      ...parseStoredNumbers(preLoginSaved),
    ];
    if (merged.length > 0) return new Set<number>(merged);
    return new Set<number>();
  });
  const [isWrongCompound,    setIsWrongCompound]    = useState(false);
  const [showHint,           setShowHint]           = useState(false);
  const [showLoginModal,     setShowLoginModal]     = useState(false);
  const [showCompleteModal,  setShowCompleteModal]  = useState(false);
  const [showFreeLabModal,   setShowFreeLabModal]   = useState(false);
  const [justSolved,         setJustSolved]         = useState(false);
  const [activeDragIon,      setActiveDragIon]      = useState<Ion | null>(null);
  const [isDragOver,         setIsDragOver]         = useState(false);
  const [draggingPaletteId,  setDraggingPaletteId]  = useState<string | null>(null);
  const [draggingPieceId,    setDraggingPieceId]    = useState<string | null>(null);
  const [onboardingStep,     setOnboardingStep]     = useState<0 | 1 | 2 | 3 | 4 | null>(() => {
    if (isLoggedIn || localStorage.getItem(ONBOARDING_STORAGE_KEY)) return null;
    return 0;
  });
  const [demoPhase,          setDemoPhase]          = useState<"cation" | "anion">("cation");
  const [demoSubPhase,       setDemoSubPhase]       = useState<"grab" | "dragging" | "idle">("grab");

  const dismissOnboarding = useCallback(() => {
    localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
    setOnboardingStep(null);
  }, []);

  // STEP3 "끌어다 놓기" 데모: 잡기 힌트 → 드래그 중 → 대기, 매 사이클마다 양이온/음이온 번갈아 반복
  useEffect(() => {
    if (onboardingStep !== 3) return;
    let hideTimer: ReturnType<typeof setTimeout>;
    let idleTimer: ReturnType<typeof setTimeout>;
    const runCycle = () => {
      setDemoSubPhase("grab");
      hideTimer = setTimeout(() => setDemoSubPhase("dragging"), ONBOARDING_DEMO_CYCLE_MS * 0.08);
      idleTimer = setTimeout(() => setDemoSubPhase("idle"), ONBOARDING_DEMO_CYCLE_MS * 0.92);
    };
    runCycle();
    const interval = setInterval(() => {
      setDemoPhase((p) => (p === "cation" ? "anion" : "cation"));
      runCycle();
    }, ONBOARDING_DEMO_CYCLE_MS);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(idleTimer);
      clearInterval(interval);
    };
  }, [onboardingStep]);

  const canvasRef          = useRef<HTMLDivElement>(null);
  const idCounter          = useRef(getNextPieceId(allPieces));
  const currentProblemRef  = useRef(currentProblem);
  const pendingSnapRef     = useRef<{ dropId: string; dropX: number; dropY: number } | null>(null);
  const hasShownCompleteModal = useRef(false);
  const pointerRef         = useRef({ x: 0, y: 0 });
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 4 },
    }),
  );

  useEffect(() => {
    currentProblemRef.current = currentProblem;
  }, [currentProblem]);

  useEffect(() => {
    // capture phase로 dnd-kit보다 먼저 실행되어 handleDragEnd 시점에 최신 좌표 보장
    const track = (e: PointerEvent) => { pointerRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("pointermove", track, { passive: true, capture: true });
    window.addEventListener("pointerup",   track, { passive: true, capture: true });
    return () => {
      window.removeEventListener("pointermove", track, { capture: true });
      window.removeEventListener("pointerup",   track, { capture: true });
    };
  }, []);

  const handleCanvasReady = useCallback((node: HTMLDivElement | null) => {
    canvasRef.current = node;
  }, []);

  // Stable setter that always writes to the currently active problem
  const setPlacedPieces = useCallback(
    (update: PlacedPiece[] | ((prev: PlacedPiece[]) => PlacedPiece[])) => {
      setAllPieces((prev) => {
        const idx = currentProblemRef.current;
        const cur = prev[idx] ?? [];
        const next = typeof update === "function" ? update(cur) : update;
        return { ...prev, [idx]: next };
      });
    },
    [],
  );

  useEffect(() => {
    const snap = pendingSnapRef.current;
    if (!snap) return;
    pendingSnapRef.current = null;
    const id = requestAnimationFrame(() => {
      setPlacedPieces((prev) => snapDroppedPiece(prev, snap.dropId, snap.dropX, snap.dropY));
    });
    return () => cancelAnimationFrame(id);
  });

  const placedPieces = allPieces[currentProblem] ?? [];

  const mkId = () => `p${idCounter.current++}`;

  const problem = PROBLEMS[currentProblem];

  const demoIon = demoPhase === "cation" ? problem.cation : problem.anion;
  const demoStart = demoPhase === "cation"
    ? paletteSlotCenter(CATIONS, CATIONS.findIndex((i) => i.id === demoIon.id))
    : paletteSlotCenter(ANIONS, ANIONS.findIndex((i) => i.id === demoIon.id));

  const canvasHeight = Math.max(
    470,
    Math.max(
      problem.cationCount * problem.cation.charge,
      problem.anionCount  * problem.anion.charge,
    ) * UNIT_H + 80,
  );

  const hintText = (() => {
    const ratio = `${problem.cationCount}:${problem.anionCount}`;
    const lastDigit = parseInt(ratio.at(-1) ?? "1");
    const particle = [3, 6].includes(lastDigit) ? "으로" : "로";
    return `${problem.cation.symbol}는 +${problem.cation.charge}, ${problem.anion.symbol}은 -${problem.anion.charge}입니다. ${ratio}${particle} 만나면 전하 합이 0이 됩니다.`;
  })();

  const placedCations  = placedPieces.filter((p) => p.ion.type === "plus");
  const placedAnions   = placedPieces.filter((p) => p.ion.type === "minus");
  const cationSum      = placedCations.reduce((s, p) => s + p.ion.charge, 0);
  const anionSum       = placedAnions.reduce((s, p) => s + p.ion.charge, 0);
  const totalCharge    = cationSum - anionSum;
  const isChargeZero   = totalCharge === 0 && placedPieces.length > 0;
  const isRightCompound =
    placedCations.length === problem.cationCount &&
    placedAnions.length  === problem.anionCount  &&
    placedCations.every((p) => p.ion.id === problem.cation.id) &&
    placedAnions.every((p)  => p.ion.id === problem.anion.id);
  const isCorrect = isChargeZero && isRightCompound;

  const resetDragState = () => {
    setActiveDragIon(null);
    setDraggingPaletteId(null);
    setDraggingPieceId(null);
    setIsDragOver(false);
  };

  const resetFeedbackState = () => {
    setIsWrong(false);
    setIsWrongCompound(false);
    setJustSolved(false);
  };

  const handleDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current as LabDragData | undefined;
    if (!data) return;

    setActiveDragIon(data.ion);
    resetFeedbackState();

    if (data.source === "palette") {
      setDraggingPaletteId(data.ion.id);
      return;
    }

    setDraggingPieceId(data.pieceId);
    setPlacedPieces((prev) => removePieceLinks(prev, data.pieceId));
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setIsDragOver(over?.id === "ionic-canvas");
  };

  const handleDragCancel = () => {
    resetDragState();
  };

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
    let rawX: number;
    let rawY: number;

    if (data.source === "canvas" && initialRect) {
      // 캔버스 피스: 그랩 오프셋 유지 (드래그 전 위치 + delta)
      rawX = initialRect.left + delta.x - rect.left;
      rawY = initialRect.top  + delta.y - rect.top;
    } else {
      // 팔레트 피스: 실제 포인터 위치에 피스 중앙을 배치
      // (DragOverlay 크기 ≠ 팔레트 카드 크기이므로 initialRect 기반 계산은 오차 발생)
      rawX = pointerRef.current.x - rect.left - PIECE_W / 2;
      rawY = pointerRef.current.y - rect.top  - ionH / 2;
    }
    const dropX = Math.max(0, Math.min(rawX, CANVAS_W - PIECE_W));
    const dropY = Math.max(0, Math.min(rawY, canvasHeight - ionH));
    const dropId = data.source === "palette" ? mkId() : data.pieceId;

    // Step 1: 드롭 위치로만 이동 (transition 없음)
    setPlacedPieces((prev) => {
      if (data.source === "palette") {
        return [
          ...prev,
          { id: dropId, ion: data.ion, x: dropX, y: dropY, bondedAnionIds: [], bondedToCationId: null, bondedBelowId: null, bondedAboveCationId: null },
        ];
      }
      return prev.map((p) => (p.id === dropId ? { ...p, x: dropX, y: dropY } : p));
    });

    // Step 2: 다음 프레임에 스냅 적용 (드롭 위치 → 스냅 위치로 spring 애니메이션)
    pendingSnapRef.current = { dropId, dropX, dropY };
    resetDragState();
  };

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
    setIsWrongCompound(false);
    setJustSolved(false);
  }

  const lastAccessible  = isLoggedIn ? PROBLEMS.length - 1 : FREE_LIMIT - 1;
  const isLastProblem   = currentProblem === lastAccessible;
  const freeProblemsSolved = Array.from({ length: FREE_LIMIT }, (_, i) => solvedProblems.has(i)).every(Boolean);

  useEffect(() => {
    sessionStorage.setItem("lab_solved_problems", JSON.stringify([...solvedProblems]));
  }, [solvedProblems]);

  useEffect(() => {
    sessionStorage.setItem("lab_placed_pieces", JSON.stringify(allPieces));
  }, [allPieces]);

  // 오답 / 화합물 불일치 시 5초 후 캔버스 리셋
  useEffect(() => {
    if (!isWrong && !isWrongCompound) return;
    const timer = setTimeout(() => {
      setPlacedPieces([]);
      setIsWrong(false);
      setIsWrongCompound(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [isWrong, isWrongCompound, checkKey, setPlacedPieces]);

  const moveToNextProblem = useCallback(() => {
    setCurrentProblem((p) => Math.min(p + 1, lastAccessible));
    setJustSolved(false);
    setIsWrong(false);
    setIsWrongCompound(false);
    setShowHint(false);
  }, [lastAccessible]);

  useEffect(() => {
    if (!justSolved || isLastProblem) return;
    const timer = setTimeout(moveToNextProblem, 3000);
    return () => clearTimeout(timer);
  }, [justSolved, isLastProblem, moveToNextProblem]);

  useEffect(() => {
    if (!justSolved || !isLastProblem || isLoggedIn) return;
    const timer = setTimeout(() => setShowLoginModal(true), 3000);
    return () => clearTimeout(timer);
  }, [justSolved, isLastProblem, isLoggedIn]);

  useEffect(() => {
    if (!justSolved || !isLastProblem || !isLoggedIn || hasShownCompleteModal.current) return;
    hasShownCompleteModal.current = true;
    const timer = setTimeout(() => setShowCompleteModal(true), 1500);
    return () => clearTimeout(timer);
  }, [justSolved, isLastProblem, isLoggedIn]);

  const handleAnswerButtonClick = () => {
    if (justSolved) {
      if (isLastProblem) {
        if (!isLoggedIn) setShowLoginModal(true);
        else setShowCompleteModal(true);
        return;
      }
      moveToNextProblem();
      return;
    }

    setCheckKey((k) => k + 1);
    if (isCorrect) {
      setSolvedProblems((prev) => new Set([...prev, currentProblem]));
      setJustSolved(true);
      setIsWrong(false);
      setIsWrongCompound(false);
    } else if (isChargeZero && !isRightCompound) {
      setIsWrongCompound(true);
      setIsWrong(false);
    } else {
      setIsWrong(true);
      setIsWrongCompound(false);
    }
  };

  const answerButtonLabel = justSolved
    ? isLastProblem
      ? isLoggedIn ? "완료" : "더 많은 문제 풀기 →"
      : "다음 문제 →"
    : "정답 확인";

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

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay dropAnimation={null}>{activeDragIon ? <PuzzleGhost ion={activeDragIon} /> : null}</DragOverlay>

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
              <h1 className="text-heading-md text-text-strong m-0">목표 화합물 만들기</h1>
              <p className="text-body-md text-text-sub m-0">플러스(+)와 마이너스(-)의 합이 '0'이 되도록 퍼즐을 연결해 보세요!</p>
            </div>

            {/* Problem selector */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8, width: 168 }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                {PROBLEMS.map((p, i) => {
                  const accessible = isLoggedIn || i < FREE_LIMIT;
                  const isActive   = i === currentProblem;
                  return (
                    <div key={p.id} style={{ position: "relative" }}>
                      <button
                        onClick={() => {
                          if (accessible) { setCurrentProblem(i); setIsWrong(false); setIsWrongCompound(false); setJustSolved(false); setShowHint(false); }
                          else if (!isLoggedIn) { setShowLoginModal(true); }
                        }}
                        style={{
                          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
                          padding: 4, width: 24, height: 24,
                          background: isActive ? "var(--color-primary-normal)"
                            : accessible ? "var(--color-primary-light)"
                            : "var(--color-bg-elevate)",
                          borderRadius: 6, border: "none",
                          cursor: accessible ? "pointer" : "default",
                          fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 12, lineHeight: "16px",
                          letterSpacing: "-0.005em",
                          color: isActive ? "var(--color-static-white)"
                            : accessible ? "var(--color-text-sub)"
                            : "var(--color-text-disabled)",
                        }}
                      >
                        {p.id}
                      </button>
                      {!accessible && (
                        <img src={lockSvg} alt="locked" width={20} height={20} style={{ position: "absolute", top: -10, right: -10, pointerEvents: "none" }} />
                      )}
                    </div>
                  );
                })}
              </div>

              {!isLoggedIn && currentProblem >= FREE_LIMIT - 1 && freeProblemsSolved && (
                <button
                  className="more-problems-btn"
                  onClick={() => setShowLoginModal(true)}
                  style={{
                    display: "flex", flexDirection: "row", alignItems: "center",
                    padding: "6px 8px", gap: 4, height: 32, borderRadius: 8,
                    background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", color: "inherit" }}>
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
        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 900 }}>
          {onboardingStep === 2 && (
            <GuideTooltip
              stepLabel="STEP 2"
              title="이온 조각 고르기"
              description={"왼쪽에는 양이온(+)과 음이온(-) 조각이 있어요.\n탭을 눌러 바꿔 볼 수 있어요."}
              current={2}
              total={ONBOARDING_TOOLTIP_STEPS}
              onPrev={() => setOnboardingStep(1)}
              onNext={() => setOnboardingStep(3)}
              onClose={dismissOnboarding}
              style={{ top: 52, left: 336 }}
            />
          )}
          {onboardingStep === 3 && (
            <GuideTooltip
              stepLabel="STEP 3"
              title="끌어다 놓기"
              description={"이온 조각을 잡아서 오른쪽 캔버스로 드래그하세요.\n마우스를 따라 이렇게 옮겨 주면 돼요."}
              current={3}
              total={ONBOARDING_TOOLTIP_STEPS}
              onPrev={() => setOnboardingStep(2)}
              onNext={() => setOnboardingStep(4)}
              onClose={dismissOnboarding}
              style={{ top: -135, left: 687, zIndex: 41 }}
            />
          )}
          {onboardingStep === 4 && (
            <GuideTooltip
              stepLabel="STEP 4"
              title="정답을 확인하고 다음 문제로!"
              description={"정답을 확인하고 다음 문제로 넘어갈 수 있어요.\n헷갈리는 건 힌트로 확인해요."}
              current={4}
              total={ONBOARDING_TOOLTIP_STEPS}
              onPrev={() => setOnboardingStep(3)}
              onNext={dismissOnboarding}
              onClose={dismissOnboarding}
              nextLabel="실습 시작하기"
              style={{ top: -102, left: 586, zIndex: 41 }}
            />
          )}
          <TargetCompoundPanel
            formula={problem.formula}
            name={problem.name}
            cationSum={onboardingStep === 4 ? problem.cation.charge : cationSum}
            anionSum={onboardingStep === 4 ? problem.anion.charge : anionSum}
            totalCharge={onboardingStep === 4 ? problem.cation.charge - problem.anion.charge : totalCharge}
            isCorrect={onboardingStep === 4 ? true : isCorrect}
            hasInput={onboardingStep === 4 ? true : placedPieces.length > 0}
            highlighted={onboardingStep === 1}
          />

          {/* Ion list + canvas */}
          <div style={{ position: "relative", display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 16, width: 900 }}>
            {onboardingStep === 1 && (
              <GuideTooltip
                stepLabel="STEP 1"
                title="전하 합을 0으로 만들어요"
                description={"목표 화합물을 보고 이온 수를 맞춰,\n전하 합을 0으로 만들면 정답이에요."}
                current={1}
                total={ONBOARDING_TOOLTIP_STEPS}
                onPrev={() => setOnboardingStep(0)}
                onNext={() => setOnboardingStep(2)}
                onClose={dismissOnboarding}
                style={{ top: 0, left: 626 }}
              />
            )}
            {onboardingStep === 3 && (
              <DragDemoOverlay ion={demoIon} start={demoStart} cycleMs={ONBOARDING_DEMO_CYCLE_MS} />
            )}
            {onboardingStep === 4 && (
              <MergedPiecesPreview cation={problem.cation} anion={problem.anion} />
            )}
            <IonTabList
              draggingIonId={onboardingStep === 3 && demoSubPhase === "dragging" ? demoIon.id : draggingPaletteId}
              highlighted={onboardingStep === 2 || onboardingStep === 4}
              highlightIonId={onboardingStep === 3 && demoSubPhase === "grab" ? demoIon.id : null}
              forceActiveTab={onboardingStep === 3 ? demoPhase : null}
            />

            {/* Canvas panel */}
            <div
              style={{
                boxSizing: "border-box", display: "flex", flexDirection: "column",
                alignItems: "flex-start", padding: 20, gap: 12, width: 588,
                background: "var(--color-static-white)", border: "1px solid var(--color-border-normal)",
                borderRadius: 12, flexGrow: 1,
                position: (onboardingStep === 3 && demoSubPhase !== "grab") || onboardingStep === 4 ? "relative" : undefined,
                zIndex: (onboardingStep === 3 && demoSubPhase !== "grab") || onboardingStep === 4 ? 40 : undefined,
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
                      setIsWrongCompound(false);
                      setJustSolved(false);
                    }}
                    disabled={placedPieces.length === 0}
                  >
                    되돌리기
                  </ToolBtn>
                  <ToolBtn
                    onClick={() => {
                      setPlacedPieces([]);
                      setIsWrong(false);
                      setIsWrongCompound(false);
                      setJustSolved(false);
                    }}
                    disabled={placedPieces.length === 0}
                  >
                    초기화
                  </ToolBtn>
                </div>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, height: 34 }}>
                  <ToolBtn onClick={() => setShowHint((v) => !v)} bordered>힌트 보기</ToolBtn>
                  <ToolBtn
                    onClick={handleAnswerButtonClick}
                    disabled={onboardingStep !== 4 && placedPieces.length === 0}
                    primary
                  >
                    {answerButtonLabel}
                  </ToolBtn>
                </div>
              </div>

              <CanvasDropZone
                onCanvasReady={handleCanvasReady}
                placedPieces={placedPieces}
                onRemove={handleRemovePiece}
                isDragOver={isDragOver || (onboardingStep === 3 && demoSubPhase !== "grab")}
                isCorrect={justSolved && isCorrect}
                isWrong={isWrong}
                isWrongCompound={isWrongCompound}
                checkKey={checkKey}
                draggingPieceId={draggingPieceId}
                height={canvasHeight}
                hintVisible={showHint}
                hintText={hintText}
                hideAutoBondHint={onboardingStep !== null}
              />
            </div>
          </div>
        </div>
        </div>
      </DndContext>

      {onboardingStep !== null && onboardingStep > 0 && (
        <div style={{ position: "fixed", inset: 0, zIndex: 35, background: "var(--color-bg-overlay)" }} />
      )}

      <AiFab showTooltip={false} className="fixed bottom-[90px] right-10 z-30" />

      {showLoginModal && (
        <KakaoLoginModal
          onClose={() => setShowLoginModal(false)}
          nextProblemIndex={FREE_LIMIT}
        />
      )}
      {showCompleteModal && (
        <LessonCompleteModal
          onClose={() => setShowCompleteModal(false)}
          completedFormulas={PROBLEMS.filter((_, i) => solvedProblems.has(i)).map((p) => p.formula)}
          onOpenFreeLab={() => { setShowCompleteModal(false); setShowFreeLabModal(true); }}
        />
      )}
      {showFreeLabModal && (
        <FreeLabModal onClose={() => setShowFreeLabModal(false)} />
      )}
      {onboardingStep === 0 && (
        <OnboardingStartModal
          onClose={dismissOnboarding}
          onNext={() => setOnboardingStep(1)}
        />
      )}
    </div>
  );
}
