import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonFooter from "@/components/lesson/LessonFooter";
import ContentTab from "@/components/lesson/ContentTab";
import CourseModal from "@/components/lesson/CourseModal";
import AiFab from "@/components/lesson/AiFab";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

const TOTAL_PAGES = 2;

interface IonFormationRow {
  symbol: string;
  valenceShell: string;
  change: string;
  ion: string;
  nobleGas: string;
}

const ION_FORMATION_ROWS: IonFormationRow[] = [
  { symbol: "Na", valenceShell: "1개 (M껍질)", change: "전자 1개 잃음", ion: "Na⁺ (K:2, L:8)", nobleGas: "Ne" },
  { symbol: "Mg", valenceShell: "2개 (M껍질)", change: "전자 2개 잃음", ion: "Mg²⁺ (K:2, L:8)", nobleGas: "Ne" },
  { symbol: "Al", valenceShell: "3개 (M껍질)", change: "전자 3개 잃음", ion: "Al³⁺ (K:2, L:8)", nobleGas: "Ne" },
  { symbol: "Cl", valenceShell: "7개 (M껍질)", change: "전자 1개 얻음", ion: "Cl⁻ (K:2, L:8, M:8)", nobleGas: "Ar" },
  { symbol: "O",  valenceShell: "6개 (L껍질)", change: "전자 2개 얻음", ion: "O²⁻ (K:2, L:8)", nobleGas: "Ne" },
];

function OctetRuleCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">3-1. 옥텟 규칙 (왜 전자를 잃고 얻으려 하는가?)</h2>
        <div className="flex flex-col gap-1">
          <p className="text-body-md font-medium text-text-normal m-0">
            금속 원자는 최외각 전자를 잃어 (+)전하를 띠는 양이온이 되고, 비금속 원자는 전자를 얻어{" "}
            <span className="font-semibold" style={{ color: "var(--color-primary-normal)" }}>(−)전하를 띠는 음이온</span>
            이 됩니다.
          </p>
          <p className="text-body-md font-medium text-text-normal m-0">
            이때 원자는 가장 가까운 <span className="font-semibold text-text-strong">18족 비활성 기체</span>와 같은 전자 배치를 가지려 하며, 이온을 기호로 나타낼 때는 원소 기호 오른쪽 위에 전하를 표시합니다.
          </p>
        </div>
      </div>

      <div className="w-full rounded-xl overflow-hidden">
        <div className="flex flex-row justify-between items-center px-6 py-3 bg-neutral-10 border border-border-strong rounded-t-xl">
          {["원소", "최외각 전자 수", "전자 변화", "이온 기호 (전자 배치)", "가장 가까운 비활성 기체"].map((h) => (
            <span key={h} className="text-label-md text-text-sub text-center flex-1">{h}</span>
          ))}
        </div>
        <div className="flex flex-col gap-6 py-3 bg-white border border-t-0 border-border-strong rounded-b-xl">
          {ION_FORMATION_ROWS.map((row) => (
            <div key={row.symbol} className="flex flex-row justify-between items-center w-full px-6">
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.symbol}</span>
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.valenceShell}</span>
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.change}</span>
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.ion}</span>
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.nobleGas}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FormulaBox({ children }: { children: ReactNode }) {
  return (
    <p
      className="text-label-xl font-semibold rounded-xl py-3 px-4 m-0"
      style={{ background: "var(--color-element-drag-fill-blue)", color: "var(--color-primary-normal)" }}
    >
      {children}
    </p>
  );
}

function IonFormationExamplesCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">3-2. 양이온 / 음이온 형성 과정</h2>
        <p className="text-body-md font-medium text-text-normal m-0">
          전자를 잃은 이온을 양이온, 전자를 얻은 이온을 음이온이라고 합니다.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-body-sm font-semibold text-text-strong m-0 pb-2 border-b border-border-strong">
          양이온 — 전자를 잃은 경우
        </p>
        <p className="text-body-xs font-medium text-text-normal m-0">
          금속 원자는 최외각 전자를 잃어 양이온이 됩니다.
          전자를 잃으면 양성자 수 &gt; 전자 수가 되므로 전체적으로 (+)전하를 띠게 됩니다.
        </p>
        <FormulaBox>
          Na (전자 11개, K:2 L:8 M:1) → 전자 1개 잃음 → Na⁺ (전자 10개, K:2 L:8) → 양성자(11) &gt; 전자(10) → (+1)전하 →
          Ne과 같은 전자 배치 → 안정 → 전자껍질이 하나 줄어들어 원자 반지름이 작아집니다 (M껍질 소멸)
        </FormulaBox>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-body-sm font-semibold text-text-strong m-0 pb-2 border-b border-border-strong">
          음이온 — 전자를 얻은 경우
        </p>
        <p className="text-body-xs font-medium text-text-normal m-0">
          비금속 원자는 전자를 얻어 음이온이 됩니다.
          전자를 얻으면 전자 수 &gt; 양성자 수가 되므로 전체적으로 (−)전하를 띠게 됩니다.
        </p>
        <FormulaBox>
          Cl (전자 17개, K:2 L:8 M:7) → 전자 1개 얻음 → Cl⁻ (전자 18개, K:2 L:8 M:8) → 전자(18) &gt; 양성자(17) → (−1)전하 →
          Ar과 같은 전자 배치 → 안정 → 전자 사이의 반발력이 커져서 원자 반지름이 커집니다
        </FormulaBox>
      </div>
    </div>
  );
}

interface IonRow {
  symbol: string;
  name: string;
  change: string;
  config: string;
}

const CATION_ROWS: IonRow[] = [
  { symbol: "Na⁺", name: "나트륨 이온", change: "전자 1개 잃음", config: "K:2, L:8" },
  { symbol: "Mg²⁺", name: "마그네슘 이온", change: "전자 2개 잃음", config: "K:2, L:8" },
  { symbol: "Ca²⁺", name: "칼슘 이온", change: "전자 2개 잃음", config: "K:2, L:8, M:8" },
  { symbol: "Al³⁺", name: "알루미늄 이온", change: "전자 3개 잃음", config: "K:2, L:8" },
];

const ANION_ROWS: IonRow[] = [
  { symbol: "Cl⁻", name: "염화 이온", change: "전자 1개 얻음", config: "K:2, L:8, M:8" },
  { symbol: "O²⁻", name: "산화 이온", change: "전자 2개 얻음", config: "K:2, L:8" },
  { symbol: "S²⁻", name: "황화 이온", change: "전자 2개 얻음", config: "K:2, L:8, M:8" },
];

function IonTable({ title, rows }: { title: string; rows: IonRow[] }) {
  return (
    <div className="flex flex-col gap-3 w-full">
      <p className="text-body-md font-medium text-text-normal m-0">{title}</p>
      <div className="w-full rounded-xl overflow-hidden">
        <div className="flex flex-row justify-between items-center px-6 py-3 bg-neutral-10 border border-border-strong rounded-t-xl">
          {["이온 기호", "이온 이름", "전자 변화", "이온화 후 전자 배치"].map((h) => (
            <span key={h} className="text-label-md text-text-sub text-center flex-1">{h}</span>
          ))}
        </div>
        <div className="flex flex-col gap-6 py-3 bg-white border border-t-0 border-border-strong rounded-b-xl">
          {rows.map((row) => (
            <div key={row.symbol} className="flex flex-row justify-between items-center w-full px-6">
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.symbol}</span>
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.name}</span>
              <span className="text-body-xs font-medium text-text-normal text-center flex-1">{row.change}</span>
              <span className="font-display text-content-sm text-text-normal text-center flex-1">{row.config}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IonSymbolCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">3-3. 대표 이온 기호 암기</h2>
        <p className="text-body-md font-medium text-text-normal m-0">
          이온 기호는 원소 기호의 오른쪽 위에 잃거나 얻은 전자 수와 전하의 종류(+/−)를 함께 표시합니다.
          숫자가 없는 경우 1로 읽습니다.
        </p>
      </div>

      <FormulaBox>
        Na⁺: 나트륨이 전자 1개 잃어 (+1)전하 / Mg²⁺: 마그네슘이 전자 2개 잃어 (+2)전하 / O²⁻: 산소가 전자 2개 얻어 (−2)전하
      </FormulaBox>

      <IonTable title="양이온" rows={CATION_ROWS} />
      <IonTable title="음이온" rows={ANION_ROWS} />
    </div>
  );
}

export default function IonFormationConcept() {
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
      navigate("/ionic-concept");
    }
  };

  useSwipeNavigation(goNext, goPrev);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-5">
      <LessonHeader
        lessonLabel="3."
        lessonTitle="이온이 만들어지는 원리"
        progressWidth={progressWidth}
        progressPercent={progressPercent}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        nextLesson={{ label: "이온 결합 학습", path: "/ionic-concept" }}
        prevPath="/atom-concept"
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
          {currentPage === 1 && <OctetRuleCard />}
          {currentPage === 2 && (
            <div className="flex flex-col gap-6 w-full">
              <IonFormationExamplesCard />
              <IonSymbolCard />
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
