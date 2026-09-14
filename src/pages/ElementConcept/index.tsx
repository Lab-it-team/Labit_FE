import { Fragment, useState, useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonFooter from "@/components/lesson/LessonFooter";
import ContentTab from "@/components/lesson/ContentTab";
import CourseModal from "@/components/lesson/CourseModal";
import AiFab from "@/components/lesson/AiFab";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-fill-grey">
      <path d="M12 4C11.7348 4 11.4804 4.10536 11.2929 4.29289C11.1054 4.48043 11 4.73478 11 5V11H5C4.73478 11 4.48043 11.1054 4.29289 11.2929C4.10536 11.4804 4 11.7348 4 12C4 12.2652 4.10536 12.5196 4.29289 12.7071C4.48043 12.8946 4.73478 13 5 13H11V19C11 19.2652 11.1054 19.5196 11.2929 19.7071C11.4804 19.8946 11.7348 20 12 20C12.2652 20 12.5196 19.8946 12.7071 19.7071C12.8946 19.5196 13 19.2652 13 19V13H19C19.2652 13 19.5196 12.8946 19.7071 12.7071C19.8946 12.5196 20 12.2652 20 12C20 11.7348 19.8946 11.4804 19.7071 11.2929C19.5196 11.1054 19.2652 11 19 11H13V5C13 4.73478 12.8946 4.48043 12.7071 4.29289C12.5196 4.10536 12.2652 4 12 4Z" fill="currentColor" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-fill-grey">
      <path d="M9 18.4609L15.7305 11.7305" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.7305 11.7305L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TOTAL_PAGES = 2;

type Category = "metal" | "nonmetal";

interface MiniElement {
  number: number;
  symbol: string;
  category: Category;
}

const CATEGORY_STYLE: Record<Category, { bg: string; color: string }> = {
  metal:    { bg: "var(--color-element-hover-fill-pink)", color: "var(--color-element-normal-pink)" },
  nonmetal: { bg: "var(--color-element-hover-fill-mint)", color: "var(--color-element-normal-mint)" },
};

const GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
const PERIODS = [1, 2, 3, 4];

const TABLE: Record<number, Partial<Record<number, MiniElement>>> = {
  1: {
    1: { number: 1, symbol: "H", category: "nonmetal" },
    18: { number: 2, symbol: "He", category: "nonmetal" },
  },
  2: {
    1: { number: 3, symbol: "Li", category: "metal" },
    2: { number: 4, symbol: "Be", category: "metal" },
    13: { number: 5, symbol: "B", category: "metal" },
    14: { number: 6, symbol: "C", category: "nonmetal" },
    15: { number: 7, symbol: "N", category: "nonmetal" },
    16: { number: 8, symbol: "O", category: "nonmetal" },
    17: { number: 9, symbol: "F", category: "nonmetal" },
    18: { number: 10, symbol: "Ne", category: "nonmetal" },
  },
  3: {
    1: { number: 11, symbol: "Na", category: "metal" },
    2: { number: 12, symbol: "Mg", category: "metal" },
    13: { number: 13, symbol: "Al", category: "metal" },
    14: { number: 14, symbol: "Si", category: "nonmetal" },
    15: { number: 15, symbol: "P", category: "nonmetal" },
    16: { number: 16, symbol: "S", category: "nonmetal" },
    17: { number: 17, symbol: "Cl", category: "nonmetal" },
    18: { number: 18, symbol: "Ar", category: "nonmetal" },
  },
  4: {
    1: { number: 19, symbol: "K", category: "metal" },
    2: { number: 20, symbol: "Ca", category: "metal" },
  },
};

const CATEGORY_LABEL: Record<Category, string> = { metal: "금속", nonmetal: "비금속" };

const ELEMENT_NAMES: Record<string, { ko: string; en: string }> = {
  H:  { ko: "수소",     en: "Hydrogen" },
  He: { ko: "헬륨",     en: "Helium" },
  Li: { ko: "리튬",     en: "Lithium" },
  Be: { ko: "베릴륨",   en: "Beryllium" },
  B:  { ko: "붕소",     en: "Boron" },
  C:  { ko: "탄소",     en: "Carbon" },
  N:  { ko: "질소",     en: "Nitrogen" },
  O:  { ko: "산소",     en: "Oxygen" },
  F:  { ko: "플루오린", en: "Fluorine" },
  Ne: { ko: "네온",     en: "Neon" },
  Na: { ko: "나트륨",   en: "Sodium" },
  Mg: { ko: "마그네슘", en: "Magnesium" },
  Al: { ko: "알루미늄", en: "Aluminium" },
  Si: { ko: "규소",     en: "Silicon" },
  P:  { ko: "인",       en: "Phosphorus" },
  S:  { ko: "황",       en: "Sulfur" },
  Cl: { ko: "염소",     en: "Chlorine" },
  Ar: { ko: "아르곤",   en: "Argon" },
  K:  { ko: "칼륨",     en: "Potassium" },
  Ca: { ko: "칼슘",     en: "Calcium" },
};

const SUMMARY_ROWS = [
  { category: "금속", position: "주기율표 왼쪽·가운데", trait: "전자를 잃어 양이온이 되기 쉬움", examples: "Na, Mg, Al, Ca, Fe" },
  { category: "비금속", position: "주기율표 오른쪽", trait: "전자를 얻어 음이온이 되기 쉬움", examples: "H, C, N, O, F, Cl" },
];

const KEY_ELEMENTS = [
  { name: "수소", symbol: "H", number: 1, category: "비금속" },
  { name: "탄소", symbol: "C", number: 6, category: "비금속" },
  { name: "질소", symbol: "N", number: 7, category: "비금속" },
  { name: "산소", symbol: "O", number: 8, category: "비금속" },
  { name: "나트륨", symbol: "Na", number: 11, category: "금속" },
  { name: "마그네슘", symbol: "Mg", number: 12, category: "금속" },
  { name: "염소", symbol: "Cl", number: 17, category: "비금속" },
  { name: "칼슘", symbol: "Ca", number: 20, category: "금속" },
];

function CategoryChip({ category, label }: { category: Category; label: string }) {
  const style = CATEGORY_STYLE[category];
  return (
    <span
      className="text-body-xxs rounded-3xl py-1 px-2"
      style={{ background: style.bg, color: style.color }}
    >
      {label}
    </span>
  );
}

function ElementCard({
  element,
  state = "normal",
  onClick,
}: {
  element?: MiniElement;
  state?: "normal" | "highlighted" | "dimmed";
  onClick?: () => void;
}) {
  if (!element) return <div />;
  const style = CATEGORY_STYLE[element.category];
  return (
    <button
      type="button"
      disabled={state === "dimmed"}
      onClick={onClick}
      className={`element-card rounded-md ${state === "dimmed" ? "cursor-default" : "cursor-pointer"}`}
      style={{
        display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
        width: "100%", aspectRatio: "1", boxSizing: "border-box",
        background: style.bg,
        borderColor: state === "highlighted" ? style.color : undefined,
        opacity: state === "dimmed" ? 0.3 : 1,
        position: "relative",
        "--el-color": style.color,
      } as React.CSSProperties}
    >
      <span
        style={{ position: "absolute", left: 8, top: 7, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, lineHeight: "12px", letterSpacing: "-0.01em", color: style.color }}
      >
        {element.number}
      </span>
      <span className="font-display text-content-xl" style={{ color: style.color }}>
        {element.symbol}
      </span>
    </button>
  );
}

function ElementPopover({
  element,
  group,
  period,
  hAlign,
  vAlign,
  closing = false,
}: {
  element: MiniElement;
  group: number;
  period: number;
  hAlign: "left" | "right";
  vAlign: "above" | "below";
  closing?: boolean;
}) {
  const style = CATEGORY_STYLE[element.category];
  const names = ELEMENT_NAMES[element.symbol];
  return (
    <div
      data-ion-popover
      className={`rounded-xl flex flex-col p-4 gap-2 transition-all duration-150 ease-out ${closing ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
      style={{
        position: "absolute",
        [hAlign]: 0,
        [vAlign === "above" ? "bottom" : "top"]: "calc(100% + 8px)",
        width: "max-content",
        minWidth: 136,
        background: style.color,
        boxShadow: `0 0 20px color-mix(in srgb, ${style.color} 50%, transparent)`,
        zIndex: 50,
      }}
    >
      <div className="flex flex-row items-center justify-between">
        <span className="font-display text-content-md text-static-white">{element.number}</span>
        <span className="font-display text-content-xl text-static-white">{element.symbol}</span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-row items-baseline gap-1" style={{ whiteSpace: "nowrap" }}>
          <span
            className="text-static-white"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 20, lineHeight: "22px", letterSpacing: "-0.01em" }}
          >
            {names?.ko}
          </span>
          <span className="text-caption-sm text-static-white">{names?.en}</span>
        </div>
        <div className="flex flex-row items-center gap-1" style={{ whiteSpace: "nowrap" }}>
          <span className="text-caption-sm font-medium rounded-full bg-static-white py-0.5 px-1.5" style={{ color: style.color }}>
            {CATEGORY_LABEL[element.category]}
          </span>
          <span className="text-caption-sm font-medium rounded-full bg-static-white py-0.5 px-1.5" style={{ color: style.color }}>
            {group}족 {period}주기
          </span>
        </div>
      </div>
    </div>
  );
}

function PeriodicTableFrame({ renderCard }: { renderCard: (period: number, group: number) => ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="border border-border-light rounded-lg w-full p-2.5" style={{ minWidth: 680 }}>
        <div style={{ display: "grid", gridTemplateColumns: "76px repeat(8, 1fr)", rowGap: 14, columnGap: 14 }}>
          <div style={{ position: "relative", width: 76, aspectRatio: "1" }}>
            <svg width="100%" height="100%" viewBox="0 0 76 76" preserveAspectRatio="none" style={{ position: "absolute", inset: 0 }}>
              <line x1="0" y1="0" x2="76" y2="76" stroke="var(--color-border-light)" strokeWidth="1" />
            </svg>
            <span
              className="text-line-strong"
              style={{ position: "absolute", top: 4, right: 6, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, lineHeight: "17px", letterSpacing: "-0.005em" }}
            >
              족
            </span>
            <span
              className="text-line-strong"
              style={{ position: "absolute", bottom: 4, left: 6, fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 14, lineHeight: "17px", letterSpacing: "-0.005em" }}
            >
              주기
            </span>
          </div>
          {GROUPS.map((g) => (
            <div key={g} className="font-display text-content-md text-line-strong" style={{ textAlign: "center", alignSelf: "end" }}>
              {g}
            </div>
          ))}
          {PERIODS.map((p) => (
            <Fragment key={`period-${p}`}>
              <div className="font-display text-content-md text-line-strong" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                {p}
              </div>
              {GROUPS.map((g) => (
                <Fragment key={`${p}-${g}`}>{renderCard(p, g)}</Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

const POPOVER_CLOSE_MS = 150;

function MetalNonmetalCard() {
  const [filter, setFilter] = useState<"all" | "metal" | "nonmetal">("all");
  const [selected, setSelected] = useState<{ p: number; g: number } | null>(null);
  const [popoverClosing, setPopoverClosing] = useState(false);

  const isDimmed = (category: Category) => category !== filter;

  const closePopover = () => {
    if (!selected) return;
    setPopoverClosing(true);
    setTimeout(() => {
      setSelected(null);
      setPopoverClosing(false);
    }, POPOVER_CLOSE_MS);
  };

  useEffect(() => {
    if (!selected) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".element-card") || target.closest("[data-ion-popover]")) return;
      closePopover();
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">1-1. 금속 vs 비금속 구분</h2>
        <p className="text-body-md text-text-normal m-0">
          주기율표는 원소를 성질에 따라 나열한 표입니다. 현재까지 발견된 118개의 원소가 원자번호 순서로 배열되어 있으며, 비슷한 성질을 가진 원소들이 같은 세로줄에 오도록 배치되어 있습니다.
        </p>
        <p className="text-body-md text-text-normal m-0">
          주기율표에서 원소는 크게 금속과 비금속으로 구분됩니다. 이 구분이 화학 결합의 종류를 결정하는 핵심 기준입니다.
        </p>
      </div>

      {/* 필터 칩 + 힌트 */}
      <div className="flex flex-row items-center justify-between w-full">
        <div className="flex flex-row items-center gap-2">
          {([
            { key: "all", label: "전체" },
            { key: "metal", label: "금속" },
            { key: "nonmetal", label: "비금속" },
          ] as const).map(({ key, label }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className="text-label-md font-medium rounded-md py-1.5 px-2 cursor-pointer"
                style={{
                  background: active ? "var(--color-text-normal)" : "var(--color-bg-normal)",
                  border: active ? "none" : "1px solid var(--color-neutral-25)",
                  color: active ? "var(--color-static-white)" : "var(--color-text-normal)",
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
        <span className="text-label-md text-text-sub">원소를 클릭하면 상세하게 볼 수 있어요.</span>
      </div>

      {/* 미니 주기율표 */}
      <PeriodicTableFrame
        renderCard={(p, g) => {
          const element = TABLE[p]?.[g];
          const state = !element || filter === "all" ? "normal" : isDimmed(element.category) ? "dimmed" : "highlighted";
          const isSelected = selected?.p === p && selected?.g === g;
          return (
            <div style={{ position: "relative" }}>
              <ElementCard
                element={element}
                state={state}
                onClick={() => {
                  if (isSelected) closePopover();
                  else { setPopoverClosing(false); setSelected({ p, g }); }
                }}
              />
              {isSelected && element && (
                <ElementPopover
                  element={element}
                  group={g}
                  period={p}
                  hAlign={g >= 16 ? "right" : "left"}
                  vAlign={p === 1 ? "below" : "above"}
                  closing={popoverClosing}
                />
              )}
            </div>
          );
        }}
      />

      {/* 요약 테이블 */}
      <div className="w-full border border-border-light rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 bg-neutral-10 border-b border-border-light py-3">
          {["구분", "원소", "화학적 특징", "대표 원소"].map((h) => (
            <span key={h} className="text-label-md text-text-sub text-center">{h}</span>
          ))}
        </div>
        {SUMMARY_ROWS.map((row) => (
          <div key={row.category} className="grid grid-cols-4 py-3 items-center">
            <span className="text-body-xxs text-text-normal text-center">{row.category}</span>
            <span className="text-body-xxs text-text-normal text-center">{row.position}</span>
            <span className="text-body-xxs text-text-normal text-center">{row.trait}</span>
            <span className="font-display text-body-xxs text-text-normal text-center">{row.examples}</span>
          </div>
        ))}
      </div>

      <p className="text-body-md text-text-normal m-0">
        금속과 비금속의 구분은 화학 결합의 종류를 바로 알 수 있는 기준이 됩니다.
      </p>

      {/* 결합 종류 칩 플로우 */}
      <div className="flex flex-row items-center gap-4 w-full">
        <div className="flex-1 flex items-center justify-center gap-2 border border-border-light rounded-xl p-2">
          <CategoryChip category="metal" label="금속" />
          <PlusIcon />
          <CategoryChip category="nonmetal" label="비금속" />
          <ChevronRightIcon />
          <span className="text-label-xl font-semibold text-text-normal">이온 결합</span>
          <span className="text-label-md text-text-sub">(예: NaCl, MgO)</span>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 border border-border-light rounded-xl p-2">
          <CategoryChip category="nonmetal" label="비금속" />
          <PlusIcon />
          <CategoryChip category="nonmetal" label="비금속" />
          <ChevronRightIcon />
          <span className="text-label-xl font-semibold text-text-normal">공유 결합</span>
          <span className="text-label-md text-text-sub">(예: H2O, CO2)</span>
        </div>
      </div>

      {/* 18족 callout */}
      <div className="w-full rounded-xl bg-neutral-10 px-4 py-3 flex flex-col gap-1.5">
        <p className="text-body-xxs font-medium text-text-normal m-0">18족 (비활성 기체)</p>
        <p className="text-body-xxs text-text-normal m-0">
          He·Ne·Ar·Kr·Xe·Rn이 여기에 속합니다. 최외각 전자가 이미 8개(He는 2개)로 꽉 차 있어 가장 안정한 상태입니다. 다른 원소들이 이온화하거나 공유 결합을 형성하는 이유가 바로 이 비활성 기체와 같은 전자 배치를 갖추어 안정해지려는 경향 때문입니다.
        </p>
      </div>

      <p className="text-body-md text-text-normal m-0">
        Labit 학습에서 반복적으로 등장하는 주요 원소는 다음과 같습니다.
        <br />
        원소 기호는 첫 글자를 대문자로, 두 번째 글자가 있는 경우 소문자로 표기합니다.
      </p>

      {/* 주요 원소 테이블 */}
      <div className="w-full border border-border-light rounded-xl overflow-hidden">
        <div className="grid grid-cols-4 bg-neutral-10 border-b border-border-light py-3">
          {["원소 이름", "기호", "원자번호", "분류"].map((h) => (
            <span key={h} className="text-label-md text-text-sub text-center">{h}</span>
          ))}
        </div>
        {KEY_ELEMENTS.map((el) => (
          <div key={el.symbol} className="grid grid-cols-4 py-3 items-center border-t border-border-light first:border-t-0">
            <span className="text-body-xxs text-text-normal text-center">{el.name}</span>
            <span className="font-display text-body-xxs text-text-normal text-center">{el.symbol}</span>
            <span className="font-display text-body-xxs text-text-normal text-center">{el.number}</span>
            <span className="text-body-xxs text-text-normal text-center">{el.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type GroupPeriodMode = "group" | "period";

const GROUP_PERIOD_EXAMPLE: Record<GroupPeriodMode, { chip: string; formula: string; desc: string }> = {
  group:  { chip: "1족",  formula: "Li · Na · K", desc: "모두 최외각 전자 1개, 성질이 비슷해요." },
  period: { chip: "3주기", formula: "Na ~ Ar",     desc: "모두 전자껍질이 K·L·M 3개로 같아요." },
};

function GroupPeriodCard() {
  const [mode, setMode] = useState<GroupPeriodMode>("group");
  const example = GROUP_PERIOD_EXAMPLE[mode];

  const cellState = (p: number, g: number): "highlighted" | "dimmed" => {
    const matches = mode === "group" ? g === 1 && p !== 1 : p === 3;
    return matches ? "highlighted" : "dimmed";
  };

  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">1-2. 족·주기 개념</h2>
        <p className="text-body-md text-text-normal m-0">
          주기율표에서 가로줄을 주기(period), 세로줄을 족(group)이라고 합니다. 주기율표는 총 7개의 주기와 18개의 족으로 구성됩니다.
        </p>
      </div>

      {/* 족/주기 정의 2단 */}
      <div className="flex flex-row items-stretch gap-4 w-full">
        <div className="flex-1 flex flex-col gap-2 bg-neutral-10 rounded-xl p-4">
          <span
            className="text-label-md font-semibold text-text-normal inline-flex items-center justify-center rounded-md py-0.5 px-1.5 w-fit"
            style={{ background: "var(--color-text-light)" }}
          >
            족(세로줄)
          </span>
          <p className="text-body-sm font-medium text-text-normal m-0">
            같은 족에 속한 원소들은 최외각 전자 수가 같습니다. 최외각 전자 수가 같으면 화학적 성질이 비슷합니다.
            예를 들어 1족의 Li·Na·K는 모두 최외각 전자가 1개이므로, 전자 1개를 잃어 +1 이온이 되기 쉽습니다.
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-2 bg-neutral-10 rounded-xl p-4">
          <span
            className="text-label-md font-semibold text-text-normal inline-flex items-center justify-center rounded-md py-0.5 px-1.5 w-fit"
            style={{ background: "var(--color-text-light)" }}
          >
            주기(가로줄)
          </span>
          <p className="text-body-sm font-medium text-text-normal m-0">
            같은 주기에 속한 원소들은 전자껍질 수가 같습니다. Na(나트륨)이 3주기에 있다는 것은 전자껍질이 K·L·M, 3개라는 뜻입니다.
          </p>
        </div>
      </div>

      {/* 족/주기 예시 토글 */}
      <div className="flex flex-row items-center gap-2 w-full">
        {(Object.keys(GROUP_PERIOD_EXAMPLE) as GroupPeriodMode[]).map((key) => {
          const active = mode === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setMode(key)}
              className="text-label-md font-medium rounded-md py-1.5 px-2 cursor-pointer"
              style={{
                background: active ? "var(--color-primary-normal)" : "var(--color-bg-normal)",
                border: active ? "none" : "1px solid var(--color-neutral-25)",
                color: active ? "var(--color-static-white)" : "var(--color-text-normal)",
              }}
            >
              {GROUP_PERIOD_EXAMPLE[key].chip}
            </button>
          );
        })}
      </div>

      {/* 선택된 예시 요약 */}
      <div className="w-full bg-neutral-10 rounded-xl flex flex-col gap-1.5 py-3 px-4">
        <p className="font-display text-content-lg m-0" style={{ color: "var(--color-primary-normal)" }}>
          {example.formula}
        </p>
        <p className="text-body-xs font-medium text-text-normal m-0">{example.desc}</p>
      </div>

      {/* 미니 주기율표 */}
      <PeriodicTableFrame
        renderCard={(p, g) => <ElementCard element={TABLE[p]?.[g]} state={TABLE[p]?.[g] ? cellState(p, g) : "normal"} />}
      />

      {/* 한눈에 요약 */}
      <div className="w-full rounded-xl flex flex-col gap-1.5 py-3 px-4" style={{ background: "var(--color-element-drag-fill-blue)" }}>
        <p className="text-caption-lg text-text-sub m-0">한눈에</p>
        <p className="text-label-xl font-semibold m-0" style={{ color: "var(--color-primary-normal)" }}>
          같은 족 원소들은 성질이 비슷하기 때문에, 주기율표에서 위치만 알면 그 원소가 어떻게 행동할지 예측할 수 있습니다.
        </p>
      </div>
    </div>
  );
}

export default function ElementConcept() {
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
      navigate("/atom-concept");
    }
  };

  useSwipeNavigation(goNext, goPrev);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-5">
      <LessonHeader
        lessonLabel="1."
        lessonTitle="원소 주기율표 읽기"
        progressWidth={progressWidth}
        progressPercent={progressPercent}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        nextLesson={{ label: "원자란 무엇인가? 학습", path: "/atom-concept" }}
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
          {currentPage === 1 && <MetalNonmetalCard />}
          {currentPage === 2 && <GroupPeriodCard />}
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
