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
import CourseModal from "@/components/lesson/CourseModal";
import LessonCompleteModal from "@/components/lesson/LessonCompleteModal";
import ElementPalette from "@/components/lab/ElementPalette";
import MoleculeTargetPanel from "@/components/lab/MoleculeTargetPanel";
import ToolBtn from "@/components/lab/ToolBtn";
import KakaoLoginModal from "@/components/lab/KakaoLoginModal";
import FreeLabModal from "@/components/lab/FreeLabModal";
import BohrAtom from "@/components/lab/BohrAtom";
import { bohrAtomSize } from "@/components/lab/bohrGeometry";
import CovalentCanvasDropZone, { type PlacedAtom } from "@/components/lab/CovalentCanvasDropZone";
import { trySnap, detachAtom, removeAtom, isMoleculeComplete, extraAtomCount } from "@/components/lab/covalentBonding";
import {
  MOLECULES,
  ELEMENTS,
  ALL_ELEMENTS,
  elementsNeeded,
  neededCount,
  type ElementSymbol,
} from "@/data/covalentElements";
import { useAuthStore } from "@/stores/authStore";
import lockSvg from "@/assets/icons/lock.svg";

const CANVAS_W = 546; // 카드 폭(588) - 좌우 padding(20*2) - 좌우 border(1*2) = 캔버스가 카드 안에 딱 맞는 폭
const CANVAS_H = 460;
const FREE_LIMIT = 3;

const STORAGE_PREFIX = "covalent_lab";

type CovalentDragData =
  | { source: "palette"; element: ElementSymbol }
  | { source: "canvas"; pieceId: string; element: ElementSymbol };

function parseStoredNumbers(value: string | null): number[] {
  if (!value) return [];
  try { return JSON.parse(value) as number[]; } catch { return []; }
}

function parseStoredAtoms(value: string | null): Record<number, PlacedAtom[]> {
  if (!value) return {};
  try { return JSON.parse(value) as Record<number, PlacedAtom[]>; } catch { return {}; }
}

function getNextAtomId(atomsByProblem: Record<number, PlacedAtom[]>) {
  return Object.values(atomsByProblem)
    .flat()
    .reduce((max, atom) => {
      const match = /^a(\d+)$/.exec(atom.id);
      return match ? Math.max(max, Number(match[1]) + 1) : max;
    }, 0);
}

function hintFor(moleculeId: number): string {
  const hints: Record<number, string> = {
    1: "수소(H) 원자 2개를 가까이 붙이면 전자 1개씩을 공유해 결합이 생겨요.",
    2: "염소(Cl)를 가운데 두고 수소(H) 1개를 붙여보세요. 전자쌍 1개를 공유해요.",
    3: "염소(Cl) 원자 2개가 만나 전자쌍 1개를 공유해요.",
    4: "산소(O)를 가운데 두고 수소(H) 2개를 양쪽에 붙여보세요.",
    5: "질소(N)를 가운데 두고 수소(H) 3개를 붙여보세요. 결합마다 전자쌍 1개씩 생겨요.",
    6: "탄소(C)를 가운데 두고 수소(H) 4개를 사방에 붙여보세요.",
    7: "산소(O) 원자 2개를 가까이 붙이면 전자쌍 2개(이중 결합)를 공유해요.",
    8: "질소(N) 원자 2개를 가까이 붙이면 전자쌍 3개(삼중 결합)를 공유해요.",
    9: "탄소(C)를 가운데 두고 산소(O) 2개를 양쪽에 이중 결합으로 붙여보세요.",
  };
  return hints[moleculeId] ?? "";
}

function recipeText(elements: ElementSymbol[], molecule: (typeof MOLECULES)[number]): string {
  return elements.map((el) => `${ELEMENTS[el].name}(${el}) ${neededCount(molecule, el)}개`).join(" + ");
}

/** 마지막 글자의 받침 유무에 따라 '을/를' 조사를 붙인다 */
function withEul(word: string): string {
  const last = word.charCodeAt(word.length - 1) - 0xac00;
  const hasBatchim = last >= 0 && last <= 11171 && last % 28 !== 0;
  return `${word}${hasBatchim ? "을" : "를"}`;
}

export default function CovalentLab() {
  const navigate = useNavigate();
  const isLoggedIn = !!useAuthStore((s) => s.accessToken);

  const [activeTab, setActiveTab] = useState<"learn" | "practice">("practice");
  const [showProgressBadge, setShowProgressBadge] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const [currentProblem, setCurrentProblem] = useState(() => {
    const saved = sessionStorage.getItem(`${STORAGE_PREFIX}_current_problem`);
    if (saved !== null) { sessionStorage.removeItem(`${STORAGE_PREFIX}_current_problem`); return parseInt(saved); }
    return 0;
  });
  const [allAtoms, setAllAtoms] = useState<Record<number, PlacedAtom[]>>(() => {
    const saved = parseStoredAtoms(sessionStorage.getItem(`${STORAGE_PREFIX}_placed_atoms`));
    const preLoginSaved = parseStoredAtoms(sessionStorage.getItem(`${STORAGE_PREFIX}_pre_login_placed_pieces`));
    sessionStorage.removeItem(`${STORAGE_PREFIX}_pre_login_placed_pieces`);
    return { ...saved, ...preLoginSaved };
  });
  const [solvedProblems, setSolvedProblems] = useState<Set<number>>(() => {
    const saved = sessionStorage.getItem(`${STORAGE_PREFIX}_solved_problems`);
    const preLoginSaved = sessionStorage.getItem(`${STORAGE_PREFIX}_pre_login_solved_problems`);
    if (preLoginSaved) sessionStorage.removeItem(`${STORAGE_PREFIX}_pre_login_solved_problems`);
    const merged = [...parseStoredNumbers(saved), ...parseStoredNumbers(preLoginSaved)];
    return merged.length > 0 ? new Set(merged) : new Set<number>();
  });

  const [showHint, setShowHint] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showFreeLabModal, setShowFreeLabModal] = useState(false);
  const [activeDragElement, setActiveDragElement] = useState<ElementSymbol | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [draggingPaletteElement, setDraggingPaletteElement] = useState<ElementSymbol | null>(null);
  const [draggingAtomId, setDraggingAtomId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(getNextAtomId(allAtoms));
  const currentProblemRef = useRef(currentProblem);
  const hasShownCompleteModal = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  useEffect(() => { currentProblemRef.current = currentProblem; }, [currentProblem]);

  useEffect(() => {
    const track = (e: PointerEvent) => { pointerRef.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("pointermove", track, { passive: true, capture: true });
    window.addEventListener("pointerup", track, { passive: true, capture: true });
    return () => {
      window.removeEventListener("pointermove", track, { capture: true });
      window.removeEventListener("pointerup", track, { capture: true });
    };
  }, []);

  const handleCanvasReady = useCallback((node: HTMLDivElement | null) => { canvasRef.current = node; }, []);

  const updateAtoms = useCallback((update: PlacedAtom[] | ((prev: PlacedAtom[]) => PlacedAtom[])) => {
    setAllAtoms((prev) => {
      const idx = currentProblemRef.current;
      const cur = prev[idx] ?? [];
      const next = typeof update === "function" ? update(cur) : update;
      return { ...prev, [idx]: next };
    });
  }, []);

  const placedAtoms = allAtoms[currentProblem] ?? [];
  const molecule = MOLECULES[currentProblem];
  const neededElements = elementsNeeded(molecule);

  const placedCounts = placedAtoms.reduce<Record<string, number>>((acc, a) => {
    acc[a.element] = (acc[a.element] ?? 0) + 1;
    return acc;
  }, {});
  const neededCounts = neededElements.reduce<Record<string, number>>((acc, el) => {
    acc[el] = neededCount(molecule, el);
    return acc;
  }, {});

  const isComplete = isMoleculeComplete(placedAtoms, molecule);
  const extras = extraAtomCount(placedAtoms, molecule);

  useEffect(() => {
    sessionStorage.setItem(`${STORAGE_PREFIX}_solved_problems`, JSON.stringify([...solvedProblems]));
  }, [solvedProblems]);
  useEffect(() => {
    sessionStorage.setItem(`${STORAGE_PREFIX}_placed_atoms`, JSON.stringify(allAtoms));
  }, [allAtoms]);

  useEffect(() => {
    if (!isComplete) return;
    setSolvedProblems((prev) => (prev.has(currentProblem) ? prev : new Set([...prev, currentProblem])));
  }, [isComplete, currentProblem]);

  const lastAccessible = isLoggedIn ? MOLECULES.length - 1 : FREE_LIMIT - 1;
  const isLastProblem = currentProblem === lastAccessible;
  const freeProblemsSolved = Array.from({ length: FREE_LIMIT }, (_, i) => solvedProblems.has(i)).every(Boolean);

  const moveToNextProblem = useCallback(() => {
    setCurrentProblem((p) => Math.min(p + 1, lastAccessible));
    setShowHint(false);
  }, [lastAccessible]);

  useEffect(() => {
    if (!isComplete || isLastProblem) return;
    const timer = setTimeout(moveToNextProblem, 2200);
    return () => clearTimeout(timer);
  }, [isComplete, isLastProblem, moveToNextProblem]);

  useEffect(() => {
    if (!isComplete || !isLastProblem || isLoggedIn) return;
    const timer = setTimeout(() => setShowLoginModal(true), 2200);
    return () => clearTimeout(timer);
  }, [isComplete, isLastProblem, isLoggedIn]);

  useEffect(() => {
    if (!isComplete || !isLastProblem || !isLoggedIn || hasShownCompleteModal.current) return;
    hasShownCompleteModal.current = true;
    const timer = setTimeout(() => setShowCompleteModal(true), 1200);
    return () => clearTimeout(timer);
  }, [isComplete, isLastProblem, isLoggedIn]);

  const resetDragState = () => {
    setActiveDragElement(null);
    setDraggingPaletteElement(null);
    setDraggingAtomId(null);
    setIsDragOver(false);
  };

  const mkId = () => `a${idCounter.current++}`;

  const handleDragStart = ({ active }: DragStartEvent) => {
    const data = active.data.current as CovalentDragData | undefined;
    if (!data) return;

    setActiveDragElement(data.element);

    if (data.source === "palette") {
      setDraggingPaletteElement(data.element);
      return;
    }
    setDraggingAtomId(data.pieceId);
    updateAtoms((prev) => detachAtom(prev, molecule, data.pieceId));
  };

  const handleDragOver = ({ over }: DragOverEvent) => {
    setIsDragOver(over?.id === "covalent-canvas");
  };

  const handleDragCancel = () => resetDragState();

  const handleDragEnd = ({ active, over, delta }: DragEndEvent) => {
    const data = active.data.current as CovalentDragData | undefined;
    const rect = canvasRef.current?.getBoundingClientRect();
    const initialRect = active.rect.current.initial;
    const droppedOnCanvas = over?.id === "covalent-canvas";

    if (!data || !rect || !droppedOnCanvas) {
      if (data?.source === "canvas") {
        const removeId = data.pieceId;
        updateAtoms((prev) => removeAtom(prev, molecule, removeId));
      }
      resetDragState();
      return;
    }

    const size = bohrAtomSize(data.element);
    let centerX: number;
    let centerY: number;
    let dropId: string;

    if (data.source === "canvas" && initialRect) {
      centerX = initialRect.left + initialRect.width / 2 + delta.x - rect.left;
      centerY = initialRect.top + initialRect.height / 2 + delta.y - rect.top;
      dropId = data.pieceId;
    } else {
      centerX = pointerRef.current.x - rect.left;
      centerY = pointerRef.current.y - rect.top;
      dropId = mkId();
    }

    centerX = Math.max(size / 2, Math.min(centerX, CANVAS_W - size / 2));
    centerY = Math.max(size / 2, Math.min(centerY, CANVAS_H - size / 2));

    updateAtoms((prev) => {
      const base: PlacedAtom[] = data.source === "palette"
        ? [...prev, { id: dropId, element: data.element, isCenter: false, x: centerX, y: centerY, bondedToCenterId: null, slotIndex: null }]
        : prev;
      return trySnap(base, molecule, dropId, centerX, centerY);
    });
    resetDragState();
  };

  function handleRemoveAtom(id: string) {
    updateAtoms((prev) => removeAtom(prev, molecule, id));
  }

  function handleUndo() {
    updateAtoms((prev) => {
      if (prev.length === 0) return prev;
      const lastId = prev[prev.length - 1].id;
      return removeAtom(prev, molecule, lastId);
    });
  }

  const answerButtonLabel = isComplete
    ? isLastProblem
      ? isLoggedIn ? "완료" : "더 많은 문제 풀기 →"
      : "다음 문제 →"
    : "결합을 완성해 보세요";

  function handleAnswerButtonClick() {
    if (!isComplete) return;
    if (isLastProblem) {
      if (!isLoggedIn) setShowLoginModal(true);
      else setShowCompleteModal(true);
      return;
    }
    moveToNextProblem();
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-normal)" }}>
      <LessonHeader
        lessonLabel="3-2."
        lessonTitle="공유 결합 실습"
        progressWidth="0%"
        progressPercent={0}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        onListClick={() => setShowCourseModal(true)}
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragCancel={handleDragCancel}
        onDragEnd={handleDragEnd}
      >
        <DragOverlay dropAnimation={null}>
          {activeDragElement ? (
            <div style={{ width: bohrAtomSize(activeDragElement), height: bohrAtomSize(activeDragElement) }}>
              <BohrAtom element={activeDragElement} ghost />
            </div>
          ) : null}
        </DragOverlay>

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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 42, width: 900 }}>
            <ContentTab
              active={activeTab}
              onChange={(v) => {
                if (v === "learn") navigate("/covalent-concept");
                else setActiveTab(v);
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, width: 900, alignSelf: "stretch" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, width: 900, alignSelf: "stretch" }}>
                <h1 className="text-heading-md text-text-strong m-0">전자쌍을 공유해 분자 만들기</h1>
                <p className="text-body-md text-text-sub m-0">
                  {recipeText(neededElements, molecule)}로 {withEul(molecule.name)} 만들어보세요!
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 8, width: 240 }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  {MOLECULES.map((m, i) => {
                    const accessible = isLoggedIn || i < FREE_LIMIT;
                    const isActive = i === currentProblem;
                    return (
                      <div key={m.id} style={{ position: "relative" }}>
                        <button
                          onClick={() => {
                            if (accessible) { setCurrentProblem(i); setShowHint(false); }
                            else if (!isLoggedIn) setShowLoginModal(true);
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
                          {m.id}
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
                    onClick={() => setShowLoginModal(true)}
                    style={{ display: "flex", alignItems: "center", padding: "6px 8px", gap: 4, height: 32, borderRadius: 8, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
                  >
                    <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", color: "var(--color-text-primary)" }}>
                      더 많은 문제 풀기
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: 900 }}>
            <MoleculeTargetPanel formula={molecule.formula} name={molecule.name} isComplete={isComplete} hasInput={placedAtoms.length > 0} />

            <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 16, width: 900 }}>
              <ElementPalette
                elements={ALL_ELEMENTS}
                placedCounts={placedCounts}
                neededCounts={neededCounts}
                draggingElement={draggingPaletteElement}
              />

              <div
                style={{
                  boxSizing: "border-box", display: "flex", flexDirection: "column",
                  alignItems: "flex-start", padding: 20, gap: 12, width: 588,
                  background: "var(--color-static-white)", border: "1px solid var(--color-border-normal)",
                  borderRadius: 12, flexShrink: 0,
                }}
              >
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", height: 34 }}>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 0, height: 34 }}>
                    <ToolBtn onClick={handleUndo} disabled={placedAtoms.length === 0}>되돌리기</ToolBtn>
                    <ToolBtn onClick={() => updateAtoms([])} disabled={placedAtoms.length === 0}>초기화</ToolBtn>
                  </div>
                  <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6, height: 34 }}>
                    <ToolBtn onClick={() => setShowHint((v) => !v)} bordered>힌트 보기</ToolBtn>
                    <ToolBtn onClick={handleAnswerButtonClick} disabled={!isComplete} primary>
                      {answerButtonLabel}
                    </ToolBtn>
                  </div>
                </div>

                <CovalentCanvasDropZone
                  onCanvasReady={handleCanvasReady}
                  atoms={placedAtoms}
                  molecule={molecule}
                  onRemove={handleRemoveAtom}
                  isDragOver={isDragOver}
                  isComplete={isComplete}
                  extraCount={extras}
                  draggingAtomId={draggingAtomId}
                  height={CANVAS_H}
                  width={CANVAS_W}
                  hintVisible={showHint}
                  hintText={hintFor(molecule.id)}
                />
              </div>
            </div>
          </div>
        </div>
      </DndContext>

      <AiFab showTooltip={false} className="fixed bottom-[90px] right-10 z-30" />

      {showCourseModal && <CourseModal onClose={() => setShowCourseModal(false)} />}
      {showLoginModal && (
        <KakaoLoginModal
          onClose={() => setShowLoginModal(false)}
          nextProblemIndex={FREE_LIMIT}
          redirectPath="/covalent-lab"
          storageKeyPrefix={STORAGE_PREFIX}
        />
      )}
      {showCompleteModal && (
        <LessonCompleteModal
          onClose={() => setShowCompleteModal(false)}
          completedFormulas={MOLECULES.filter((_, i) => solvedProblems.has(i)).map((m) => m.formula)}
          onOpenFreeLab={() => { setShowCompleteModal(false); setShowFreeLabModal(true); }}
        />
      )}
      {showFreeLabModal && <FreeLabModal onClose={() => setShowFreeLabModal(false)} />}
    </div>
  );
}
