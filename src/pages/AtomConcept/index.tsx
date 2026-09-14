import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonFooter from "@/components/lesson/LessonFooter";
import ContentTab from "@/components/lesson/ContentTab";
import CourseModal from "@/components/lesson/CourseModal";
import AiFab from "@/components/lesson/AiFab";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

const TOTAL_PAGES = 3;

function ChevronIcon({ opacity = 1 }: { opacity?: number }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path d="M9 18.4609L15.7305 11.7305" stroke="var(--color-text-normal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.7305 11.7305L9 5" stroke="var(--color-text-normal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronTrail() {
  return (
    <div className="flex flex-row items-center">
      <ChevronIcon opacity={0.3} />
      <ChevronIcon opacity={0.6} />
      <ChevronIcon opacity={1} />
    </div>
  );
}

type Concept = "원소" | "원자" | "분자";

const CONCEPT_STYLE: Record<Concept, { bg: string; color: string }> = {
  원소: { bg: "var(--color-element-hover-fill-violet)", color: "var(--color-element-normal-violet)" },
  원자: { bg: "var(--color-element-hover-fill-blue)",   color: "var(--color-element-normal-blue)" },
  분자: { bg: "var(--color-element-hover-fill-orange)", color: "var(--color-element-normal-orange)" },
};

const DEFINITIONS: { term: Concept; desc: string }[] = [
  {
    term: "원소",
    desc: "물질을 이루는 기본 성분으로, 더 이상 다른 물질로 분해되지 않는 것입니다. 원소는 종류를 나타내는 개념으로, 수소·산소·탄소 등이 이에 해당합니다.",
  },
  {
    term: "원자",
    desc: "원소의 성질을 갖는 가장 작은 입자입니다. 화학적인 방법으로는 더 이상 쪼갤 수 없는 물질의 기본 단위이며, 원소 기호(H, O, C 등)로 나타냅니다.",
  },
  {
    term: "분자",
    desc: "원자가 결합하여 이루어진 물질의 기본 단위입니다. 수소 원자 2개가 결합하면 수소 분자(H2), 수소 원자 2개와 산소 원자 1개가 결합하면 물 분자(H2O)가 됩니다.",
  },
];

const COMPARISON_ROWS: { concept: Concept; definition: string; example: string }[] = [
  { concept: "원소", definition: "물질의 종류", example: "수소, 산소, 탄소" },
  { concept: "원자", definition: "원소의 가장 작은 알갱이", example: "H, O, C" },
  { concept: "분자", definition: "원자가 결합한 입자", example: "H2, O2, H2O, CO2" },
];

const FLOW_STEPS: { label: Concept; value: string }[] = [
  { label: "원소", value: "산소" },
  { label: "원자", value: "O" },
  { label: "분자", value: "O2" },
];

function ElementAtomMoleculeCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <h2 className="text-heading-md text-text-strong">2-1. 원소 vs 원자 vs 분자 구분</h2>

      {/* 정의 3단 */}
      <div className="flex flex-col gap-4 w-full">
        {DEFINITIONS.map((d) => (
          <div key={d.term} className="flex flex-col gap-3 bg-neutral-5 border border-border-light rounded-xl p-4 w-full">
            <p className="text-body-sm font-semibold text-text-strong m-0 pb-2 border-b border-border-strong">{d.term}</p>
            <p className="text-body-xs font-medium text-text-normal m-0">{d.desc}</p>
          </div>
        ))}
      </div>

      {/* 비교 테이블 */}
      <div className="w-full rounded-xl overflow-hidden">
        <div className="flex flex-row justify-between items-center px-3 py-3 bg-neutral-10 border border-border-strong rounded-t-xl">
          {["개념", "정의", "예시"].map((h) => (
            <span key={h} className="text-label-md text-text-sub text-center flex-1">{h}</span>
          ))}
        </div>
        <div className="flex flex-col gap-6 p-3 bg-white border border-t-0 border-border-strong rounded-b-xl">
          {COMPARISON_ROWS.map((row) => (
            <div key={row.concept} className="flex flex-row justify-between items-center w-full">
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.concept}</span>
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.definition}</span>
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.example}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 원소 → 원자 → 분자 흐름 */}
      <div className="flex flex-row justify-center items-center gap-6 w-full">
        {FLOW_STEPS.map((step, i) => (
          <div key={step.label} className="flex flex-row items-center gap-6">
            {i > 0 && <ChevronTrail />}
            <div className="flex flex-col justify-center items-center gap-1.5">
              <span
                className="text-body-xs font-medium rounded-3xl py-1 px-2"
                style={{ background: CONCEPT_STYLE[step.label].bg, color: CONCEPT_STYLE[step.label].color }}
              >
                {step.label}
              </span>
              <span className="text-body-md font-medium text-text-normal">{step.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 개념 층위 요약 */}
      <div className="w-full rounded-xl flex flex-col items-center gap-1.5 py-3 px-4" style={{ background: "var(--color-element-drag-fill-blue)" }}>
        <p className="text-caption-lg text-text-sub m-0">원소 → 원자 → 분자: 개념의 층위</p>
        <p className="text-label-xl font-semibold m-0" style={{ color: "var(--color-primary-normal)" }}>
          예를 들어 산소는 원소 이름, O는 산소 원자, O2는 산소 분자입니다.
        </p>
      </div>
    </div>
  );
}

const SHELL_INFO = [
  { shell: "K껍질 (1번째)", energy: "가장 낮음", max: "2개" },
  { shell: "L껍질 (2번째)", energy: "중간", max: "8개" },
  { shell: "M껍질 (3번째)", energy: "높음", max: "8개" },
];

interface ElementShell {
  name: string;
  symbol: string;
  number: number;
  k: number | null;
  l: number | null;
  m: number | null;
  valence: number;
  stable: boolean;
}

const ELEMENT_SHELLS: ElementShell[] = [
  { name: "수소",     symbol: "H",  number: 1,  k: 1, l: null, m: null, valence: 1, stable: false },
  { name: "헬륨",     symbol: "He", number: 2,  k: 2, l: null, m: null, valence: 2, stable: true },
  { name: "리튬",     symbol: "Li", number: 3,  k: 2, l: 1,    m: null, valence: 1, stable: false },
  { name: "탄소",     symbol: "C",  number: 6,  k: 2, l: 4,    m: null, valence: 4, stable: false },
  { name: "질소",     symbol: "N",  number: 7,  k: 2, l: 5,    m: null, valence: 5, stable: false },
  { name: "산소",     symbol: "O",  number: 8,  k: 2, l: 6,    m: null, valence: 6, stable: false },
  { name: "플루오린", symbol: "F",  number: 9,  k: 2, l: 7,    m: null, valence: 7, stable: false },
  { name: "네온",     symbol: "Ne", number: 10, k: 2, l: 8,    m: null, valence: 8, stable: true },
  { name: "나트륨",   symbol: "Na", number: 11, k: 2, l: 8,    m: 1,    valence: 1, stable: false },
  { name: "마그네슘", symbol: "Mg", number: 12, k: 2, l: 8,    m: 2,    valence: 2, stable: false },
  { name: "염소",     symbol: "Cl", number: 17, k: 2, l: 8,    m: 7,    valence: 7, stable: false },
  { name: "아르곤",   symbol: "Ar", number: 18, k: 2, l: 8,    m: 8,    valence: 8, stable: true },
];

function shellDot(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = radius * Math.sin(rad);
  const y = -radius * Math.cos(rad);
  return { left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` };
}

function CheckBadge() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="10" fill="var(--color-primary-normal)" />
      <path d="M8 12.5L10.5 15L16 9.5" stroke="var(--color-static-white)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BohrDiagram() {
  const kAngles = [0, 180];
  const lAngles = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <div style={{ position: "relative", width: 188, height: 188 }}>
      <div className="rounded-full" style={{ position: "absolute", inset: 0, border: "1px solid var(--color-border-light)" }} />
      <div className="rounded-full" style={{ position: "absolute", left: "50%", top: "50%", width: 144, height: 144, transform: "translate(-50%, -50%)", border: "1px solid var(--color-border-light)" }} />
      <div className="rounded-full" style={{ position: "absolute", left: "50%", top: "50%", width: 100, height: 100, transform: "translate(-50%, -50%)", border: "1px solid var(--color-border-light)" }} />

      <div
        className="rounded-full flex items-center justify-center font-display text-content-md"
        style={{
          position: "absolute", left: "50%", top: "50%", width: 64, height: 64, transform: "translate(-50%, -50%)",
          background: "var(--color-static-white)", border: "1px solid var(--color-element-normal-pink)", color: "var(--color-element-normal-pink)",
        }}
      >
        Na
      </div>

      {kAngles.map((a) => (
        <span
          key={`k-${a}`}
          className="rounded-full"
          style={{ position: "absolute", width: 8, height: 8, transform: "translate(-50%, -50%)", background: "var(--color-yellow-500)", ...shellDot(50, a) }}
        />
      ))}
      {lAngles.map((a) => (
        <span
          key={`l-${a}`}
          className="rounded-full"
          style={{ position: "absolute", width: 8, height: 8, transform: "translate(-50%, -50%)", background: "var(--color-element-normal-mint)", ...shellDot(72, a) }}
        />
      ))}
      <span
        className="rounded-full"
        style={{
          position: "absolute", width: 8, height: 8, transform: "translate(-50%, -50%)",
          background: "var(--color-element-normal-pink)",
          boxShadow: "0 0 16px 3px color-mix(in srgb, var(--color-element-normal-pink) 60%, transparent)",
          ...shellDot(94, 0),
        }}
      />
    </div>
  );
}

function AtomShellCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">2-2. 원자 모형 (전자껍질)</h2>
        <p className="text-body-md font-medium text-text-normal m-0">
          원자는 중심의 원자핵과 그 주위를 도는 전자로 구성됩니다. 전자는 원자핵 주위의 전자껍질이라는 특정 에너지 준위의 층에 배치됩니다.
          전자껍질은 안쪽부터 K껍질, L껍질, M껍질 순서로 나뉘며, 각 껍질에 들어갈 수 있는 최대 전자 수는 정해져 있습니다.
        </p>
      </div>

      {/* 전자껍질 표 */}
      <div className="w-full rounded-xl overflow-hidden">
        <div className="flex flex-row justify-between items-center px-3 py-3 bg-neutral-10 border border-border-strong rounded-t-xl">
          {["전자껍질", "에너지 크기", "중학교 과정 전자 수"].map((h) => (
            <span key={h} className="text-label-md text-text-sub text-center flex-1">{h}</span>
          ))}
        </div>
        <div className="flex flex-col gap-6 p-3 bg-white border border-t-0 border-border-strong rounded-b-xl">
          {SHELL_INFO.map((row) => (
            <div key={row.shell} className="flex flex-row justify-between items-center w-full">
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.shell}</span>
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.energy}</span>
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.max}</span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-caption-lg text-text-sub text-center m-0 bg-neutral-10 rounded-xl py-3 px-4 w-full">
        M껍질의 실제 최대 전자 수는 18개이지만, 중학교 과학에서는 8개까지만 다룹니다.
      </p>

      <div className="flex flex-col gap-4">
        <p className="text-body-md font-medium text-text-normal m-0">
          전자는 에너지가 낮은 안쪽 껍질부터 순서대로 채워집니다.
          K껍질이 다 채워진 후 L껍질이 채워지고, L껍질이 다 채워진 후 M껍질이 채워집니다.
        </p>
        <p className="text-body-md font-medium text-text-normal m-0">
          가장 바깥쪽 껍질의 전자를 최외각 전자라고 하며, 이 전자가 화학 반응과 결합에 직접 참여합니다.
          He·Ne·Ar처럼 최외각 전자가 꽉 찬 원소(18족 비활성 기체)가 가장 안정합니다.
        </p>
      </div>

      {/* 보어 모형 다이어그램 */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex justify-center items-center border border-border-light rounded-xl py-6 w-full">
          <BohrDiagram />
        </div>
        <p className="text-label-md text-text-sub text-center m-0">
          예) Na(K:2 L:8 M:1): 최외각 전자 1개, M껍질에 1개만 있어 불안정
        </p>
      </div>

      {/* 주요 원소 전자 배치 */}
      <div className="flex flex-col gap-3 w-full">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-body-xl font-medium text-text-strong m-0">주요 원소 전자 배치</h3>
          <div className="flex flex-row items-center gap-0.5">
            <CheckBadge />
            <span className="text-caption-lg" style={{ color: "var(--color-primary-normal)" }}>안정 (18족)</span>
          </div>
        </div>

        <div className="w-full rounded-xl overflow-hidden">
          <div className="flex flex-row justify-between items-center px-6 py-3 bg-neutral-10 border border-border-strong rounded-t-xl">
            {["원소 이름", "원자번호", "K", "L", "M", "최외각 전자"].map((h) => (
              <span key={h} className="text-label-md text-text-sub text-center flex-1">{h}</span>
            ))}
          </div>
          <div className="flex flex-col gap-6 py-3 bg-white border border-t-0 border-border-strong rounded-b-xl">
            {ELEMENT_SHELLS.map((el) => (
              <div key={el.symbol} className="flex flex-row justify-between items-center w-full px-6">
                <span className="text-body-xs font-medium text-text-normal text-center flex-1">{el.name}({el.symbol})</span>
                <span className="font-display text-content-sm text-text-normal text-center flex-1">{el.number}</span>
                <span className="font-display text-content-sm text-text-normal text-center flex-1">{el.k ?? "-"}</span>
                <span className="font-display text-content-sm text-text-normal text-center flex-1">{el.l ?? "-"}</span>
                <span className="font-display text-content-sm text-text-normal text-center flex-1">{el.m ?? "-"}</span>
                <span className="font-display text-content-sm text-text-normal flex-1 flex items-center justify-center gap-1">
                  {el.valence}
                  {el.stable && <CheckBadge />}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const PARTICLE_DEFINITIONS = [
  {
    term: "양성자",
    desc: "(+)전하를 가지며, 양성자의 수 = 원자번호입니다. 양성자 수가 달라지면 원소의 종류도 바뀝니다.",
  },
  {
    term: "중성자",
    desc: "전하를 띠지 않으며, 원자핵 안에서 양성자와 함께 존재합니다.",
  },
  {
    term: "전자",
    desc: "(−)전하를 가지며, 원자핵 바깥쪽에 존재합니다. 전기적으로 중성인 원자에서는 전자의 수가 양성자의 수와 같습니다.",
  },
];

type Op = "=" | "+" | "-";

function OpMark({ op }: { op: Op }) {
  return <span className="text-content-md font-display text-fill-grey">{op}</span>;
}

const FORMULAS: { terms: { text: string; blue?: boolean }[]; ops: Op[] }[] = [
  { terms: [{ text: "원자번호", blue: true }, { text: "양성자 수" }], ops: ["="] },
  { terms: [{ text: "질량수", blue: true }, { text: "양성자 수" }, { text: "중성자 수" }], ops: ["=", "+"] },
  { terms: [{ text: "중성자 수", blue: true }, { text: "질량수" }, { text: "원자번호" }], ops: ["=", "-"] },
];

interface StatItem {
  value: string;
  label: string;
  blue?: boolean;
}

const STAT_GROUPS: { items: StatItem[]; ops: Op[] }[] = [
  {
    items: [{ value: "11", label: "원자번호", blue: true }, { value: "11", label: "양성자 수" }],
    ops: ["="],
  },
  {
    items: [
      { value: "23", label: "질량수", blue: true },
      { value: "11", label: "양성자 수" },
      { value: "12", label: "중성자 수" },
    ],
    ops: ["=", "+"],
  },
  {
    items: [
      { value: "12", label: "중성자 수", blue: true },
      { value: "23", label: "질량수" },
      { value: "11", label: "원자번호" },
    ],
    ops: ["=", "-"],
  },
];

function StatValue({ item }: { item: StatItem }) {
  const color = item.blue ? "var(--color-primary-normal)" : "var(--color-text-normal)";
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-display text-content-xl" style={{ color }}>{item.value}</span>
      <span className="text-caption-lg" style={{ color }}>{item.label}</span>
    </div>
  );
}

function AtomNumberCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">2-3. 원자번호, 양성자·중성자·전자</h2>
        <p className="text-body-md font-medium text-text-normal m-0">원자핵은 양성자와 중성자로 이루어져 있습니다.</p>
      </div>

      {/* 양성자/중성자/전자 3단 */}
      <div className="flex flex-row gap-3 w-full items-stretch">
        {PARTICLE_DEFINITIONS.map((d) => (
          <div key={d.term} className="flex-1 flex flex-col gap-3 bg-neutral-5 border border-border-light rounded-xl p-4">
            <p className="text-body-sm font-semibold text-text-strong m-0 pb-2 border-b border-border-strong">{d.term}</p>
            <p className="text-body-xs font-medium text-text-normal m-0">{d.desc}</p>
          </div>
        ))}
      </div>

      {/* 공식 3종 */}
      <div className="flex flex-row gap-4 w-full">
        {FORMULAS.map((f) => (
          <div key={f.terms[0].text} className="flex-1 flex flex-row items-center justify-center gap-2 border border-border-strong rounded-xl p-3">
            {f.terms.map((term, i) => (
              <div key={term.text} className="flex flex-row items-center gap-2">
                {i > 0 && <OpMark op={f.ops[i - 1]} />}
                <span
                  className="text-label-xl font-semibold"
                  style={{ color: term.blue ? "var(--color-primary-normal)" : "var(--color-text-normal)" }}
                >
                  {term.text}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <p className="text-body-md font-medium text-text-normal m-0">
        나트륨(Na)의 경우, 원자번호가 11이므로 양성자가 11개이고, 중성 원자이므로 전자도 11개입니다.
        질량수가 23이면 중성자는 23 − 11 = 12개입니다.
      </p>

      {/* 계산 예시 */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="flex flex-row justify-center items-center gap-6 border border-border-strong rounded-xl py-8 w-full">
          {STAT_GROUPS.map((group, gi) => (
            <div key={gi} className="flex flex-row items-center gap-6">
              {gi > 0 && <span className="w-px self-stretch bg-border-normal" />}
              <div className="flex flex-row items-center gap-2">
                {group.items.map((item, i) => (
                  <div key={item.label} className="flex flex-row items-center gap-2">
                    {i > 0 && <OpMark op={group.ops[i - 1]} />}
                    <StatValue item={item} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-label-md text-text-sub text-center m-0">예) 나트륨(Na) 원자</p>
      </div>
    </div>
  );
}

export default function AtomConcept() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"learn" | "practice">("learn");
  const [currentPage, setCurrentPage] = useState(() => {
    const page = (location.state as { page?: number } | null)?.page;
    return page && page >= 1 && page <= TOTAL_PAGES ? page : 1;
  });
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
      navigate("/ion-formation-concept");
    }
  };

  useSwipeNavigation(goNext, goPrev);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-5">
      <LessonHeader
        lessonLabel="2."
        lessonTitle="원자란 무엇인가?"
        progressWidth={progressWidth}
        progressPercent={progressPercent}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        nextLesson={{ label: "이온이 만들어지는 원리 학습", path: "/ion-formation-concept" }}
        prevPath="/element-concept"
        onListClick={() => setShowCourseModal(true)}
      />
      {showCourseModal && <CourseModal onClose={() => setShowCourseModal(false)} />}

      <main className="flex-1 flex flex-col items-center pt-[80px] pb-[80px] px-4 sm:px-10 md:px-20 lg:px-[270px]">
        <div className="w-full max-w-[900px] flex flex-col gap-14 pt-10">
          <ContentTab
            active={activeTab}
            onChange={(v) => {
              if (v === "practice") return;
              setActiveTab(v);
            }}
          />
          {currentPage === 1 && <ElementAtomMoleculeCard />}
          {currentPage === 2 && <AtomShellCard />}
          {currentPage === 3 && <AtomNumberCard />}
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
