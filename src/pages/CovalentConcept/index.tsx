import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useNavigate } from "react-router";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonFooter from "@/components/lesson/LessonFooter";
import ContentTab from "@/components/lesson/ContentTab";
import CourseModal from "@/components/lesson/CourseModal";
import AiFab from "@/components/lesson/AiFab";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import cursorHoverIcon from "@/assets/icons/cursor-hover.png";

const TOTAL_PAGES = 2;

interface CompareRow {
  label: string;
  ionic: string;
  covalent: string;
}

const COMPARE_ROWS: CompareRow[] = [
  { label: "결합 방식", ionic: "전자를 완전히 이동", covalent: "전자쌍을 함께 공유" },
  { label: "구성 원소", ionic: "금속 + 비금속", covalent: "비금속 + 비금속" },
  { label: "결합 입자", ionic: "양이온 ↔ 음이온", covalent: "원자 ↔ 원자 (분자 형성)" },
  { label: "상온 상태", ionic: "고체", covalent: "다양(기체·액체·고체)" },
  { label: "녹는점·끓는점", ionic: "높음", covalent: "대체로 낮음" },
  { label: "전기 전도성", ionic: "수용액·용융 상태에서 전도됨", covalent: "대부분 전도되지 않음" },
  { label: "대표 물질", ionic: "NaCl, MgO, CaCl₂", covalent: "H₂O, CO₂, H₂, CH₄" },
];

function IonicVsCovalentCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">5-1. 비금속끼리 왜 다르게 결합하는가?</h2>
        <div className="flex flex-col gap-3">
          <p className="text-body-md font-semibold m-0" style={{ color: "var(--color-primary-normal)" }}>
            금속과 비금속은 전자를 주고받아 이온 결합을 하지만, 비금속끼리는 다른 방식으로 결합해요.
          </p>

          <ul className="flex flex-col gap-2 m-0 p-0 list-none">
            <li className="flex items-start gap-2">
              <span className="mt-2.5 size-1.5 rounded-full bg-neutral-30 shrink-0" />
              <span className="text-body-md font-medium text-text-normal">
                비금속 원자끼리는 전자를 끌어당기는 힘이 서로 비슷하거나 강해서,{" "}
                <b className="font-semibold" style={{ color: "var(--color-primary-normal)" }}>
                  어느 쪽도 전자를 완전히 내어주지 않아요.
                </b>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2.5 size-1.5 rounded-full bg-neutral-30 shrink-0" />
              <span className="text-body-md font-medium text-text-normal">
                대신 두 원자가 전자쌍을 함께 공유하며 결합하는데, 이를{" "}
                <b className="font-semibold text-text-strong">공유 결합</b>이라고 해요.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-2.5 size-1.5 rounded-full bg-neutral-30 shrink-0" />
              <span className="text-body-md font-medium text-text-normal">
                <span className="font-display text-content-sm px-1.5 py-0.5 bg-neutral-10 rounded">H₂O</span>,{" "}
                <span className="font-display text-content-sm px-1.5 py-0.5 bg-neutral-10 rounded">CO₂</span>처럼
                비금속끼리 전자를 공유하면 하나의 분자가 만들어져요.
              </span>
            </li>
          </ul>

          <p className="text-body-md font-medium text-text-normal m-0">
            이온 결합이 양이온·음이온 사이의 인력으로 결합한다면, 공유 결합은{" "}
            <b className="font-semibold text-text-strong">전자쌍을 매개로</b> 원자와 원자를 연결해요.
            아래 표에서 두 결합 방식의 차이를 비교해 볼게요.
          </p>
        </div>
      </div>

      <div className="w-full rounded-xl overflow-hidden">
        <div className="flex flex-row justify-between items-center px-6 py-3 bg-neutral-10 border border-border-strong rounded-t-xl">
          {["구분", "이온 결합", "공유 결합"].map((h) => (
            <span key={h} className="text-label-md text-text-sub text-center flex-1">{h}</span>
          ))}
        </div>
        <div className="flex flex-col gap-6 py-3 bg-white border border-t-0 border-border-strong rounded-b-xl">
          {COMPARE_ROWS.map((row) => (
            <div key={row.label} className="flex flex-row justify-between items-center w-full px-6">
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.label}</span>
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.ionic}</span>
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.covalent}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    setIsTouch(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isTouch;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}

interface PairKind {
  term: string;
  desc: string;
}

const PAIR_KINDS: PairKind[] = [
  { term: "공유 전자쌍", desc: "두 원자가 함께 사용하는 전자쌍이에요." },
  { term: "비공유 전자쌍", desc: "한 원자에만 속하며 결합에 참여하지 않는 전자쌍이에요." },
];

interface BondRow {
  type: string;
  pairs: string;
  examples: string;
}

const BOND_ROWS: BondRow[] = [
  { type: "단일 결합", pairs: "1쌍", examples: "H₂, HCl, H₂O, NH₃, CH₄" },
  { type: "이중 결합", pairs: "2쌍", examples: "O₂, CO₂" },
  { type: "삼중 결합", pairs: "3쌍", examples: "N₂" },
];

function StepRow({ index, children }: { index: number; children: ReactNode }) {
  return (
    <div className="flex flex-row items-center gap-3 py-2 w-full">
      <div className="flex items-center justify-center size-6 shrink-0 rounded-full bg-neutral-10 text-label-sm text-text-sub">
        {index}
      </div>
      {children}
    </div>
  );
}

function H2FormationDemo() {
  const isTouch = useIsTouchDevice();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [revealed, setRevealed] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // 터치 기기: 활성화된 상태에서 화면의 다른 영역을 터치하면 원래 상태로 복귀
  useEffect(() => {
    if (!isTouch) return;
    const handleOutsidePointer = (e: PointerEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setRevealed(false);
      }
    };
    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, [isTouch]);

  const transitionMs = prefersReducedMotion ? 0 : 400;

  // 터치: 탭할 때마다 토글. 마우스: 클릭은 별도로 처리하지 않고 hover로만 반응(중복 방지)
  const handleClick = () => {
    if (isTouch) setRevealed((r) => !r);
  };

  // 키보드: Enter/Space로 토글. preventDefault로 버튼의 기본 클릭 트리거를 막아 중복 실행 방지
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setRevealed((r) => !r);
    }
  };

  const hoverProps = isTouch
    ? {}
    : {
        onMouseEnter: () => setRevealed(true),
        onMouseLeave: () => setRevealed(false),
      };

  // 원 지름과 기본 중심 간 거리를 기준으로, 목표 중심 거리(지름의 62%)까지만 이동시킬 거리를 역산한다
  const CIRCLE_DIAMETER = 60;
  const INITIAL_CENTER_DISTANCE = 156; // 156px(circle2 left) + 30(반지름) - 30(circle1 반지름) = 원래 두 원 중심 간 거리
  const TARGET_CENTER_DISTANCE = CIRCLE_DIAMETER * 0.62;
  const MOVE_DISTANCE = (INITIAL_CENTER_DISTANCE - TARGET_CENTER_DISTANCE) / 2;

  const circleStyle = (direction: 1 | -1) =>
    ({
      transform: revealed ? `translateX(${direction * MOVE_DISTANCE}px)` : "translateX(0px)",
      transitionDuration: `${transitionMs}ms`,
      transitionProperty: "transform",
      borderColor: "color-mix(in srgb, var(--color-primary-normal) 45%, white)",
    }) as React.CSSProperties;

  // 전자 점은 원의 안쪽 테두리 지점에 고정되고, 같은 direction/MOVE_DISTANCE로만 이동해 자신의 원과 완전히 동기화된다.
  // (원 내부 자식으로 넣으면 반투명 원끼리 겹칠 때 서로 가려지는 문제가 있어 별도 레이어로 원 위에 그린다)
  const dotStyle = (dotLeft: number, direction: 1 | -1) =>
    ({
      left: dotLeft,
      top: 30,
      transform: `translate(-50%, -50%) translateX(${revealed ? direction * MOVE_DISTANCE : 0}px)`,
      transitionDuration: `${transitionMs}ms`,
      transitionProperty: "transform",
      background: "var(--color-primary-normal)",
      boxShadow: "0 0 10px 3px color-mix(in srgb, var(--color-primary-normal) 30%, transparent)",
    }) as React.CSSProperties;

  return (
    <div className="flex flex-row items-center gap-6 w-full">
      <div className="flex flex-col gap-3 flex-1">
        <div className="inline-flex items-center gap-1 self-start px-2.5 py-1 bg-neutral-5 border border-border-normal rounded-full">
          <img src={cursorHoverIcon} alt="" width={16} height={16} className="size-4" />
          <span className="text-label-sm text-text-sub">
            {isTouch ? "클릭해보세요" : "마우스를 올려보세요"}
          </span>
        </div>

        <button
          ref={triggerRef}
          type="button"
          aria-pressed={revealed}
          aria-label="두 수소 원자가 결합하는 과정 보기"
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...hoverProps}
          className="flex flex-col items-center gap-10 w-full px-[72px] py-6 rounded-3xl border ease-out"
          style={{
            background: revealed ? "var(--color-element-drag-fill-blue)" : "var(--color-neutral-5)",
            borderColor: revealed
              ? "color-mix(in srgb, var(--color-primary-normal) 30%, transparent)"
              : "var(--color-border-normal)",
            transitionDuration: `${transitionMs}ms`,
            transitionProperty: "background-color, border-color",
          }}
        >
          <span
            className="ease-out whitespace-nowrap"
            style={{
              color: revealed ? "var(--color-primary-normal)" : "var(--color-text-sub)",
              fontWeight: 600,
              fontSize: 15,
              transitionDuration: `${transitionMs}ms`,
              transitionProperty: "color",
            }}
          >
            {revealed ? "안정한 수소 분자 (H₂) 형성!" : "불안정한 두 수소(H) 원자"}
          </span>

          <div className="flex flex-col items-center gap-6">
            <div className="relative w-[216px] h-[60px]">
              <div
                className="absolute left-0 top-0 size-[60px] flex items-center justify-center rounded-full bg-white/50 border ease-out"
                style={circleStyle(1)}
              >
                <span className="font-display text-content-md text-text-normal">H</span>
              </div>
              <span
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-content-md text-border-strong ease-out"
                style={{ opacity: revealed ? 0 : 1, transitionDuration: `${transitionMs}ms`, transitionProperty: "opacity" }}
              >
                +
              </span>
              <div
                className="absolute left-[156px] top-0 size-[60px] flex items-center justify-center rounded-full bg-white/50 border ease-out"
                style={circleStyle(-1)}
              >
                <span className="font-display text-content-md text-text-normal">H</span>
              </div>

              <span className="absolute size-2 rounded-full ease-out" style={dotStyle(60, 1)} />
              <span className="absolute size-2 rounded-full ease-out" style={dotStyle(156, -1)} />
            </div>

            <span className={`text-body-xxs text-text-sub text-center ${revealed ? "invisible" : ""}`}>
              H 원자 각각 전자 1개 보유
            </span>

            <span
              className="py-1.5 rounded-full text-label-sm text-text-normal bg-white border border-border-light ease-out text-center whitespace-nowrap"
              style={{ width: 210, transitionDuration: `${transitionMs}ms`, transitionProperty: "color, background-color" }}
            >
              {revealed ? "전자 1쌍을 공유하여 단일 결합을 이룸" : "각 전자 +1 필요"}
            </span>
          </div>
        </button>
      </div>

      <div className="flex flex-col justify-end gap-2 flex-1">
        <StepRow index={1}>
          <p className="text-body-xs font-medium text-text-normal m-0">
            H 원자는 전자가 1개뿐이에요. 안정해지려면 전자 1개가 더 필요해요.
          </p>
        </StepRow>
        <StepRow index={2}>
          <p className="text-body-xs font-medium text-text-normal m-0">
            H 원자 2개가 전자를 1개씩 내어 공유 전자쌍 1쌍을 만들어요.
          </p>
        </StepRow>
        <StepRow index={3}>
          <div className="flex flex-col gap-1">
            <p className="text-body-xs font-medium text-text-normal m-0">
              각 H는 공유된 전자 2개를 자기 것처럼 사용해요.
            </p>
            <span className="text-caption-lg text-text-sub">→ 헬륨(He)과 같은 안정한 상태</span>
          </div>
        </StepRow>
        <StepRow index={4}>
          <div className="flex flex-row items-center gap-1">
            <span className="text-body-xs font-medium text-text-normal">H−H 단일 결합 형성</span>
            <span className="text-body-lg text-text-normal">→</span>
            <span className="text-body-xs font-medium text-text-normal">H₂ 완성</span>
          </div>
        </StepRow>
      </div>
    </div>
  );
}

function ElectronPairSharingCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">5-2. 전자쌍 공유 개념</h2>
        <p className="text-body-md text-text-normal m-0">
          공유 결합을 하는 두 원자는 전자를 하나씩 내놓아 전자쌍을 만들고, 이 전자쌍을 함께 사용해요.
          이때 만들어지는 전자쌍은 결합에 쓰이는지에 따라 두 가지로 나뉘어요.
        </p>
      </div>

      <div className="flex flex-row gap-4 w-full">
        {PAIR_KINDS.map((kind) => (
          <div
            key={kind.term}
            className="flex-1 flex flex-col gap-1 px-4 py-3 rounded-xl"
            style={{ background: "var(--color-element-drag-fill-blue)" }}
          >
            <span className="text-body-xs font-semibold text-text-normal">{kind.term}</span>
            <span className="text-body-xs font-medium text-text-normal">{kind.desc}</span>
          </div>
        ))}
      </div>

      <p className="text-body-md text-text-normal m-0">
        공유 전자쌍이 몇 쌍인지에 따라 단일 결합, 이중 결합, 삼중 결합으로 구분해요.
      </p>

      <div className="w-full rounded-xl overflow-hidden">
        <div className="flex flex-row justify-between items-center px-6 py-3 bg-neutral-10 border border-border-strong rounded-t-xl">
          {["결합 종류", "전자쌍 수", "예시 분자"].map((h) => (
            <span key={h} className="text-label-md text-text-sub text-center flex-1">{h}</span>
          ))}
        </div>
        <div className="flex flex-col gap-6 py-3 bg-white border border-t-0 border-border-strong rounded-b-xl">
          {BOND_ROWS.map((row) => (
            <div key={row.type} className="flex flex-row justify-between items-center w-full px-6">
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.type}</span>
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.pairs}</span>
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.examples}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-body-md text-text-normal m-0">
          그럼 가장 간단한 수소 분자(H₂)가 만들어지는 과정을 함께 살펴볼까요?
        </p>
        <p className="text-body-md text-text-normal m-0">
          수소(H) 원자는 전자를 1개만 가지고 있어서 안정해지려면 전자가 1개 더 필요해요.
          아래 카드와 상호작용하면서 두 원자가 전자쌍을 공유하는 과정을 확인해 보세요.
        </p>
      </div>

      <H2FormationDemo />
    </div>
  );
}

export default function CovalentConcept() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"learn" | "practice">("learn");
  const [currentPage, setCurrentPage] = useState(1);
  const [showProgressBadge, setShowProgressBadge] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);

  const progressPercent = completed
    ? 100
    : Math.round(((currentPage - 1) / TOTAL_PAGES) * 100);
  const progressWidth = `${progressPercent}%`;

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const goNext = () => {
    if (currentPage < TOTAL_PAGES) {
      setCurrentPage((p) => p + 1);
    } else {
      setCompleted(true);
      navigate("/quiz");
    }
  };

  useSwipeNavigation(goNext, goPrev);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-5">
      <LessonHeader
        lessonLabel="5."
        lessonTitle="공유 결합"
        progressWidth={progressWidth}
        progressPercent={progressPercent}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        nextLesson={{ label: "단원 퀴즈", path: "/quiz" }}
        prevPath="/ionic-concept"
        onListClick={() => setShowCourseModal(true)}
      />
      {showCourseModal && <CourseModal onClose={() => setShowCourseModal(false)} />}

      <main className="flex-1 flex flex-col items-center pt-[80px] pb-[80px] px-4 sm:px-10 md:px-20 lg:px-[270px]">
        <div className="w-full max-w-[900px] flex flex-col gap-14 pt-10">
          <ContentTab
            active={activeTab}
            onChange={(v) => {
              if (v === "practice") navigate("/covalent-lab");
              else setActiveTab(v);
            }}
          />
          {currentPage === 1 && <IonicVsCovalentCard />}
          {currentPage === 2 && <ElectronPairSharingCard />}
        </div>
      </main>

      <AiFab
        showTooltip={true}
        onClick={() => {}}
        className="fixed bottom-[90px] right-10 z-30"
      />

      <LessonFooter
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPrev={goPrev}
        onNext={goNext}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
