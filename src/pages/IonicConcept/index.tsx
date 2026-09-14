import { useState, useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonFooter from "@/components/lesson/LessonFooter";
import ContentTab from "@/components/lesson/ContentTab";
import CourseModal from "@/components/lesson/CourseModal";
import AiChat, { removeHighlight } from "@/components/lesson/AiChat";
import AiAssistPanel from "@/components/lesson/AiAssistPanel";
import AiFab from "@/components/lesson/AiFab";
import LoginRequiredModal from "@/components/common/LoginRequiredModal";
import { useTextSelection } from "@/hooks/useTextSelection";
import { useAuthStore } from "@/stores/authStore";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import naclSaltImg from "@/assets/lesson/ionic-compounds/nacl-salt.png";
import nahco3BakingSodaImg from "@/assets/lesson/ionic-compounds/nahco3-baking-soda.png";
import caco3LimestoneImg from "@/assets/lesson/ionic-compounds/caco3-limestone.png";
import cacl2DeicerImg from "@/assets/lesson/ionic-compounds/cacl2-deicer.png";
import mgoAntacidImg from "@/assets/lesson/ionic-compounds/mgo-antacid.png";

const TOTAL_PAGES = 2;

function PlusIconLarge() {
  return (
    <svg width="43" height="43" viewBox="0 0 24 24" fill="none" className="text-fill-grey shrink-0">
      <path d="M12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4Z" fill="currentColor" />
    </svg>
  );
}

function StepArrow({ direction, active, onClick }: { direction: "left" | "right"; active: boolean; onClick?: () => void }) {
  const points = direction === "left" ? "M15 18L9 12L15 6" : "M9 18L15 12L9 6";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!active}
      aria-label={direction === "left" ? "이전 단계" : "다음 단계"}
      className={active ? "cursor-pointer" : "cursor-default"}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d={points} stroke={active ? "var(--color-text-normal)" : "var(--color-line-disabled)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function bohrDotPosition(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = radius * Math.sin(rad);
  const y = -radius * Math.cos(rad);
  return { left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` };
}

function evenAngles(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (360 / count) * i);
}

const BOHR_SIZE = 148;
const BOHR_M_RADIUS = 74;
const BOHR_L_RADIUS = 54;
const BOHR_K_RADIUS = 37;
const BOHR_NUCLEUS_SIZE = 56;
const BOHR_ORBIT_DURATION = 16;

function ShellRing({ diameter }: { diameter: number }) {
  return (
    <div
      className="rounded-full"
      style={{ position: "absolute", left: "50%", top: "50%", width: diameter, height: diameter, transform: "translate(-50%, -50%)", border: "1px solid var(--color-border-light)" }}
    />
  );
}

function ShellElectron({ radius, angle, color }: { radius: number; angle: number; color: string }) {
  return (
    <span
      className="rounded-full"
      style={{
        position: "absolute", width: 8, height: 8, transform: "translate(-50%, -50%)",
        background: color,
        ...bohrDotPosition(radius, angle),
      }}
    />
  );
}

function OrbitingValenceElectron({ radius, angle, color }: { radius: number; angle: number; color: string }) {
  return (
    <div style={{ position: "absolute", inset: 0, transform: `rotate(${angle}deg)` }}>
      <div style={{ position: "absolute", inset: 0, animation: `dot-orbit ${BOHR_ORBIT_DURATION}s linear infinite` }}>
        <span
          className="rounded-full"
          style={{
            position: "absolute", top: BOHR_SIZE / 2 - radius - 4, left: "50%", transform: "translateX(-50%)",
            width: 8, height: 8,
            background: color,
            boxShadow: `0 0 12px 3px color-mix(in srgb, ${color} 60%, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

function AtomStateBadge({
  symbol,
  borderColor,
  valenceCount,
  electronCount,
  secondary,
}: {
  symbol: string;
  borderColor: string;
  valenceCount: number;
  electronCount: number;
  secondary: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-6">
      <div style={{ position: "relative", width: BOHR_SIZE, height: BOHR_SIZE }}>
        <ShellRing diameter={BOHR_SIZE} />
        <ShellRing diameter={BOHR_L_RADIUS * 2} />
        <ShellRing diameter={BOHR_K_RADIUS * 2} />
        <div
          className="rounded-full flex items-center justify-center font-display text-text-strong"
          style={{
            position: "absolute", left: "50%", top: "50%", width: BOHR_NUCLEUS_SIZE, height: BOHR_NUCLEUS_SIZE, transform: "translate(-50%, -50%)",
            background: "var(--color-static-white)", border: `1.8px solid ${borderColor}`,
            fontSize: 20, lineHeight: "24px", fontWeight: 700,
          }}
        >
          {symbol}
        </div>
        {evenAngles(2).map((a) => (
          <ShellElectron key={`k-${a}`} radius={BOHR_K_RADIUS} angle={a} color="var(--color-yellow-500)" />
        ))}
        {evenAngles(8).map((a) => (
          <ShellElectron key={`l-${a}`} radius={BOHR_L_RADIUS} angle={a} color="var(--color-element-normal-mint)" />
        ))}
        {evenAngles(valenceCount).map((a) => (
          <OrbitingValenceElectron key={`m-${a}`} radius={BOHR_M_RADIUS} angle={a} color={borderColor} />
        ))}
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-caption-lg text-text-normal">전자 {electronCount}개</span>
        {secondary}
      </div>
    </div>
  );
}

function StatusCaption({ text }: { text: string }) {
  return <span className="text-caption-lg text-text-normal">{text}</span>;
}

function ChargeBadge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span className="text-caption-lg font-semibold rounded-3xl py-0.5 px-2" style={{ background: bg, color }}>
      {label}
    </span>
  );
}

function ChevronMini({ opacity }: { opacity: number }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ opacity }}>
      <path d="M9 18.4609L15.7305 11.7305" stroke="var(--color-text-normal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.7305 11.7305L9 5" stroke="var(--color-text-normal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TransitElectron() {
  return (
    <div className="flex flex-row items-center gap-2 shrink-0">
      <span
        className="rounded-full"
        style={{
          width: 16, height: 16,
          background: "var(--color-element-normal-pink)",
          boxShadow: "0 0 20px 6px color-mix(in srgb, var(--color-element-normal-pink) 60%, transparent)",
        }}
      />
      <div className="flex flex-row items-center">
        <ChevronMini opacity={0.3} />
        <ChevronMini opacity={0.6} />
        <ChevronMini opacity={1} />
      </div>
    </div>
  );
}

const PINK = "var(--color-element-normal-pink)";
const BLUE = "var(--color-light-blue-500)";
const PINK_BG = "var(--color-element-hover-fill-pink)";
const BLUE_BG = "var(--color-element-hover-fill-blue)";

const STEP_CHIPS = ["원자 상태", "전자 이동", "이온 형성", "전하 균형 완성"];

function Hi({ color, children }: { color: string; children: ReactNode }) {
  return <span style={{ color }}>{children}</span>;
}

const STEP_TIPS: ReactNode[] = [
  <>
    <Hi color={PINK}>Na</Hi>는 전자가 11개, <Hi color={BLUE}>Cl</Hi>은 전자가 17개입니다. 각자 최외각 전자 수가 안정한 상태가 아니어서 불안정한 상태입니다.
  </>,
  <>
    <Hi color={PINK}>Na</Hi>가 최외각 전자 1개를 <Hi color={BLUE}>Cl</Hi>에게 넘겨줍니다. 이 전자 이동이 이온 결합의 출발점입니다.
  </>,
  <>
    전자를 잃은 Na는 <Hi color={PINK}>Na⁺(양이온)</Hi>이 되고, 전자를 얻은 Cl은 <Hi color={BLUE}>Cl⁻(음이온)</Hi>이 됩니다. 이제 서로 반대 전하라서 정전기적으로 끌어당깁니다.
  </>,
  <>
    <Hi color={PINK}>(+1)</Hi>과 <Hi color={BLUE}>(−1)</Hi>이 만나 총 전하가 0이 되면서 염화나트륨 NaCl이 완성됩니다. 이것이 바로 우리가 매일 먹는 소금입니다.
  </>,
];

function IonBondIntroCard() {
  const [step, setStep] = useState(1);

  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">4-1. 이온 결합이란?</h2>
        <div className="flex flex-col gap-1">
          <p className="text-body-md font-medium text-text-normal m-0">
            이온 결합은 양이온과 음이온이 서로 반대 전하를 띠기 때문에 생기는 끌어당기는 힘으로 결합하는 것입니다.
            이 힘을 정전기적 인력이라고 합니다. 이온 결합은 주로 금속 원소와 비금속 원소 사이에서 형성됩니다.
          </p>
          <p className="text-body-md font-medium text-text-normal m-0">
            소금(NaCl)이 만들어지는 과정을 4단계로 살펴보겠습니다.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1 w-full">
        <span className="text-label-lg font-semibold text-text-normal rounded-md py-1 px-1.5 border border-border-strong">
          {STEP_CHIPS[step - 1]}
        </span>

        <div className="flex flex-row items-center gap-2 w-full">
          <StepArrow direction="left" active={step > 1} onClick={() => setStep((s) => Math.max(1, s - 1))} />

          {step === 1 && (
            <div className="flex flex-row items-center justify-center gap-[60px] flex-1 py-4">
              <AtomStateBadge symbol="Na" borderColor={PINK} valenceCount={1} electronCount={11} secondary={<StatusCaption text="최외각 1개 → 불안정" />} />
              <PlusIconLarge />
              <AtomStateBadge symbol="Cl" borderColor={BLUE} valenceCount={7} electronCount={17} secondary={<StatusCaption text="전자 1개 부족 → 불안정" />} />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-row items-center justify-center gap-[60px] flex-1 py-4">
              <AtomStateBadge symbol="Na" borderColor={PINK} valenceCount={0} electronCount={11} secondary={<StatusCaption text="전자 1개를 넘김 →" />} />
              <TransitElectron />
              <AtomStateBadge symbol="Cl" borderColor={BLUE} valenceCount={7} electronCount={17} secondary={<StatusCaption text="← 전자 1개를 받음" />} />
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-row items-center justify-center gap-[60px] flex-1 py-4">
              <AtomStateBadge symbol="Na" borderColor={PINK} valenceCount={0} electronCount={10} secondary={<ChargeBadge label="+1 양이온" color={PINK} bg={PINK_BG} />} />
              <span className="text-label-md text-text-sub shrink-0">⇌ 정전기적 인력 ⇌</span>
              <AtomStateBadge symbol="Cl" borderColor={BLUE} valenceCount={8} electronCount={18} secondary={<ChargeBadge label="−1 음이온" color={BLUE} bg={BLUE_BG} />} />
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-row items-center justify-center gap-3 flex-1 py-16">
              <span className="font-display text-content-xl font-bold" style={{ color: PINK }}>Na⁺</span>
              <PlusIconLarge />
              <span className="font-display text-content-xl font-bold" style={{ color: BLUE }}>Cl⁻</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0">
                <path d="M9 18L15 12L9 6" stroke="var(--color-text-normal)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex flex-col items-start gap-0.5">
                <span className="font-display text-content-xl text-text-strong">NaCl</span>
                <span className="text-body-sm text-text-sub">염화나트륨</span>
              </div>
            </div>
          )}

          <StepArrow direction="right" active={step < 4} onClick={() => setStep((s) => Math.min(4, s + 1))} />
        </div>
      </div>

      <p className="text-label-xl font-semibold text-text-normal rounded-xl py-3 px-4 m-0 bg-neutral-10 text-center">
        {STEP_TIPS[step - 1]}
      </p>
    </div>
  );
}

interface PropertyItem {
  label: string;
  desc: string;
}

const PROPERTIES: PropertyItem[] = [
  { label: "고체 결정 구조", desc: "실온에서 고체(결정) 상태로 존재합니다. 이온들이 규칙적으로 배열된 격자 구조를 형성합니다." },
  { label: "조건부 전기 전도성", desc: "고체 상태: 이온 고정 → 전기 불통. 물에 녹거나 용융 시: 이온 자유 이동 → 전기 통함" },
  { label: "높은 녹는점·끓는점", desc: "이온 간 인력이 강해 분리되기 어렵습니다. NaCl의 녹는점은 801°C에 달합니다." },
  { label: "단단하지만 잘 부서짐", desc: "겉보기엔 단단하지만, 강한 힘을 가하면 쪼개집니다. 이온층이 어긋나면 같은 전하끼리 마주쳐 반발하기 때문입니다." },
];

interface CompoundInfo {
  formula: string;
  name: string;
  emoji: string;
  icon?: string;
  desc: string;
}

const COMPOUNDS: CompoundInfo[] = [
  { formula: "NaCl", name: "소금", emoji: "🧂", icon: naclSaltImg, desc: "바닷물에 녹아 있다가 증발시키면 결정으로 남습니다. 음식에 꼭 들어가는 대표 이온 결합 화합물입니다." },
  { formula: "NaHCO₃", name: "베이킹소다", emoji: "🍞", icon: nahco3BakingSodaImg, desc: "빵을 부풀게 하는 재료입니다. 가열하면 이산화탄소가 발생하여 빵을 부풀려 줍니다." },
  { formula: "CaCO₃", name: "석회석·분필", emoji: "🪨", icon: caco3LimestoneImg, desc: "대리석, 분필의 주성분입니다. 산과 만나면 거품이 활발히 발생합니다." },
  { formula: "CaCl₂", name: "제설제", emoji: "❄️", icon: cacl2DeicerImg, desc: "겨울에 도로에 뿌리는 화합물입니다. 얼음의 어는점을 낮춰서 녹여 줍니다." },
  { formula: "MgO", name: "산화 마그네슘", emoji: "💊", icon: mgoAntacidImg, desc: "소화제에도 쓰이고, 위산을 중화하는 데 도움을 줍니다." },
];

function IonCompoundPropertiesCard() {
  const [selected, setSelected] = useState(0);
  const compound = COMPOUNDS[selected];

  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-md text-text-strong">4-2. 이온 결합 화합물의 성질</h2>
        <p className="text-body-md font-medium text-text-normal m-0">
          이온 결합으로 만들어진 물질은 이온 간 강한 인력 때문에 독특한 물리·화학적 성질을 갖습니다.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full">
        {PROPERTIES.map((prop) => (
          <div key={prop.label} className="flex flex-col gap-3 bg-white border border-border-light rounded-3xl p-6">
            <span className="text-body-sm font-medium" style={{ color: "var(--color-primary-normal)" }}>{prop.label}</span>
            <p className="text-body-md font-medium text-text-strong m-0">{prop.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row items-center gap-2">
          <h3 className="text-heading-sm text-text-strong m-0">화합물 속 이온 결합 화합물</h3>
          <span className="text-label-sm font-medium text-text-normal rounded-3xl py-1 px-2 bg-neutral-10">
            각 화합물을 눌러서 확인해보세요
          </span>
        </div>

        <div className="flex flex-row items-center gap-2">
          {COMPOUNDS.map((c, i) => {
            const active = i === selected;
            return (
              <button
                key={c.formula}
                type="button"
                onClick={() => setSelected(i)}
                className="font-display text-content-sm rounded-lg py-1.5 px-2 cursor-pointer"
                style={{
                  background: active ? "var(--color-text-normal)" : "var(--color-bg-normal)",
                  border: active ? "none" : "1px solid var(--color-neutral-25)",
                  color: active ? "var(--color-static-white)" : "var(--color-text-normal)",
                }}
              >
                {c.formula}
              </button>
            );
          })}
        </div>

        <div className="flex flex-row items-center gap-3 rounded-xl py-3 px-4 bg-neutral-10 w-full">
          {compound.icon ? (
            <img src={compound.icon} alt="" width={36} height={40} className="shrink-0 object-contain" />
          ) : (
            <span className="shrink-0" style={{ fontSize: 28, lineHeight: "36px" }}>{compound.emoji}</span>
          )}
          <p className="text-body-xs font-medium text-text-strong m-0">
            <span className="font-display">{compound.formula}</span> {compound.name}
            <br />
            <span className="text-text-normal">{compound.desc}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

interface FormulaExample {
  label: string;
  text: ReactNode;
}

const FORMULA_EXAMPLES: FormulaExample[] = [
  {
    label: "예시1",
    text: <>NaCl: Na⁺은 +1 이다. Cl⁻은 −1 이다. +1 + (−1) = 0 이므로 성립함 → NaCl</>,
  },
  {
    label: "예시2",
    text: <>MgCl₂: Mg²⁺는 +2, Cl⁻는 −1 이다. Cl⁻가 2개 있어야 +2 + (−1)×2 = 0 → MgCl₂</>,
  },
  {
    label: "예시3",
    text: <>Al₂O₃: Al³⁺는 +3, O²⁻는 −2 이다. Al이 2개, O가 3개일 때 (+3)×2 + (−2)×3 = 0 → Al₂O₃</>,
  },
];

function FormulaWritingCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-heading-md text-text-strong">4-3. 화학식 작성법</h2>
        <p className="text-body-md font-medium text-text-normal m-0">
          이온 결합 화합물의 화학식을 결정하는 원칙은 전체 전하의 합이 0이어야 한다는 것입니다.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {FORMULA_EXAMPLES.map((ex) => (
          <div key={ex.label} className="flex flex-col gap-3 bg-neutral-10 rounded-xl py-3 px-4">
            <span className="text-caption-sm text-text-normal pb-1.5 border-b border-border-strong">{ex.label}</span>
            <p className="text-body-xs font-medium text-text-strong m-0">{ex.text}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <span className="text-caption-lg" style={{ color: "var(--color-primary-normal)" }}>빠르게 구하는 방법</span>
        <p className="text-body-md font-medium text-text-normal m-0">
          각 이온의 전하 절댓값을 반대편 이온의 개수로 교차 대입합니다.
        </p>
        <p className="text-caption-lg text-text-normal rounded-3xl py-2 px-3 m-0 text-center" style={{ background: "var(--color-element-drag-fill-blue)" }}>
          예) Al³⁺(전하 3) O²⁻(전하 2) → Al 2개, O 3개 → Al₂O₃
        </p>
      </div>

      <div className="flex flex-col gap-1.5 w-full">
        <p className="text-body-md font-medium text-text-normal m-0">
          이온 결합 화합물의 이름은 음이온 이름을 먼저, 양이온 이름을 나중에 읽습니다. 금속 원소는 원소 이름 뒤에 &apos;화&apos;를 붙입니다.
        </p>
        <p className="text-caption-lg text-text-normal rounded-3xl py-2 px-3 m-0 text-center" style={{ background: "var(--color-element-drag-fill-blue)" }}>
          예) NaCl = 염화 나트륨 / MgO = 산화 마그네슘
        </p>
      </div>
    </div>
  );
}

export default function IonicConcept() {
  const navigate = useNavigate();
  const isLoggedIn = !!useAuthStore((s) => s.accessToken);
  const [activeTab, setActiveTab] = useState<"learn" | "practice">("learn");
  const [currentPage, setCurrentPage] = useState(1);
  const [showProgressBadge, setShowProgressBadge] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [assistPanel, setAssistPanel] = useState<{
    key: number;
    question: string;
    selectedText: string;
    x: number;
    y: number;
  } | null>(null);
  const assistPanelKeyRef = useRef(0);
  const { selection, popupRef, clear } = useTextSelection();

  useEffect(() => {
    if (!completed) return;
    const timer = setTimeout(() => navigate("/"), 600);
    return () => clearTimeout(timer);
  }, [completed, navigate]);

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
    }
  };

  useSwipeNavigation(goNext, goPrev);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-5">
      <LessonHeader
        lessonLabel="4."
        lessonTitle="이온 결합"
        progressWidth={progressWidth}
        progressPercent={progressPercent}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        nextLesson={{ label: "공유 결합 학습", path: "/covalent-concept" }}
        prevPath="/ion-formation-concept"
        onListClick={() => setShowCourseModal(true)}
      />
      {showCourseModal && <CourseModal onClose={() => setShowCourseModal(false)} />}
      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}

      {assistPanel && (
        <AiAssistPanel
          key={assistPanel.key}
          selectedText={assistPanel.selectedText}
          initialQuestion={assistPanel.question}
          onClose={() => { setAssistPanel(null); removeHighlight(); }}
          className="fixed z-50"
          style={{
            left: assistPanel.x,
            top: assistPanel.y,
            transform: 'translateX(-50%)',
          }}
        />
      )}

      {selection && (
        <AiChat
          ref={popupRef}
          className="fixed z-40"
          style={{
            left: selection.x,
            top: selection.bottom + 8,
            transform: 'translateX(-50%)',
          }}
          onSend={(q) => {
            if (!isLoggedIn) {
              clear();
              removeHighlight();
              setShowLoginModal(true);
              return;
            }
            const PANEL_H = 371;
            const PANEL_W = 334;
            const spaceBelow = window.innerHeight - (selection.bottom + 8);
            const y = spaceBelow >= PANEL_H
              ? selection.bottom + 8
              : Math.max(selection.top - PANEL_H - 8, 8);
            const x = Math.min(
              Math.max(selection.x, PANEL_W / 2 + 8),
              window.innerWidth - PANEL_W / 2 - 8,
            );
            setAssistPanel({ key: ++assistPanelKeyRef.current, question: q, selectedText: selection.text, x, y });
            clear();
          }}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-[80px] pb-[80px] px-4 sm:px-10 md:px-20 lg:px-[270px]">
        <div className="w-full max-w-[900px] flex flex-col gap-14 pt-10">
          <ContentTab
            active={activeTab}
            onChange={(v) => {
              if (v === "practice") navigate("/ionic-lab");
              else setActiveTab(v);
            }}
          />
          {currentPage === 1 && <IonBondIntroCard />}
          {currentPage === 2 && (
            <div className="flex flex-col gap-6 w-full">
              <IonCompoundPropertiesCard />
              <FormulaWritingCard />
            </div>
          )}
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
