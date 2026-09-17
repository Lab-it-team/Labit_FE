import { Fragment, useEffect, useState, type ReactNode } from "react";
import {
  TABLE,
  ELEMENT_NAMES,
  CATEGORY_STYLE,
  CATEGORY_LABEL,
  GROUPS,
  PERIODS,
  type ElementCategory,
  type MiniElement,
} from "@/data/periodicTable";

const POPOVER_CLOSE_MS = 150;

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
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        aspectRatio: "1",
        boxSizing: "border-box",
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
      data-reference-popover
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
    <div className="w-full overflow-x-auto flex justify-center">
      <div className="border border-border-light rounded-lg p-2.5" style={{ width: 920, flexShrink: 0 }}>
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
            <div key={g} className="font-display text-content-md text-line-strong" style={{ textAlign: "center", alignSelf: "end", marginBottom: 20 }}>
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

type Filter = "all" | ElementCategory;

export default function MiniPeriodicTable() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<{ p: number; g: number } | null>(null);
  const [popoverClosing, setPopoverClosing] = useState(false);

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
      if (target.closest(".element-card") || target.closest("[data-reference-popover]")) return;
      closePopover();
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return (
    <div className="bg-white rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-row items-center justify-between mx-auto" style={{ width: 920 }}>
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

      <PeriodicTableFrame
        renderCard={(p, g) => {
          const element = TABLE[p]?.[g];
          const isSelected = selected?.p === p && selected?.g === g;
          const state = isSelected
            ? "highlighted"
            : !element || filter === "all"
            ? "normal"
            : element.category !== filter
            ? "dimmed"
            : "highlighted";
          return (
            <div style={{ position: "relative" }}>
              <ElementCard
                element={element}
                state={state}
                onClick={() => {
                  if (isSelected) closePopover();
                  else {
                    setPopoverClosing(false);
                    setSelected({ p, g });
                  }
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
    </div>
  );
}
