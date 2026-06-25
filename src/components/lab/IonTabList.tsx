import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CATIONS, ANIONS } from "@/data/ions";
import type { Ion } from "@/data/ions";
import { getPuzzlePath, cardHeight, ionColor } from "@/components/lab/puzzlePaths";
import tipsSvg from "@/assets/Icon/tips.svg";

function shapeFill(): string { return "var(--color-bg-normal)"; }
function shapeStroke(): string { return "var(--color-border-strong)"; }

function ionColorKey(ion: Ion): string {
  const c = Math.abs(ion.charge);
  if (ion.type === "minus") {
    if (c >= 3) return "violet";
    if (c >= 2) return "blue";
    return "mint";
  }
  if (c >= 3) return "orange";
  if (c >= 2) return "yellow";
  return "pink";
}

function hoverFill(ion: Ion):     string { return `var(--color-element-hover-fill-${ionColorKey(ion)})`; }
function hoverStroke(ion: Ion):   string { return `var(--color-element-hover-stroke-${ionColorKey(ion)})`; }
function pressedFill(ion: Ion):   string { return `var(--color-element-pressed-fill-${ionColorKey(ion)})`; }
function pressedStroke(ion: Ion): string { return `var(--color-element-pressed-stroke-${ionColorKey(ion)})`; }

interface PuzzleCardProps {
  ion: Ion;
  isDragging: boolean;
}

function PuzzleCard({ ion, isDragging }: PuzzleCardProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `palette:${ion.id}`,
    data: { source: "palette", ion },
  });
  const h     = cardHeight(ion);
  const color = ionColor(ion);
  const path  = getPuzzlePath(ion);
  const isOnePlus = ion.type === "plus" && ion.charge === 1;
  const isAnion   = ion.type === "minus";

  if (isDragging) {
    return (
      <div style={{ position: "relative", width: 120, height: h, flexShrink: 0 }}>
        <svg width="100%" height="100%" viewBox={`0 0 121 ${h + 1}`} preserveAspectRatio="none" fill="none" style={{ position: "absolute", inset: 0 }}>
          <path d={path} fill={hoverFill(ion)} stroke={pressedStroke(ion)} strokeDasharray="3 3" />
        </svg>
      </div>
    );
  }

  const contentLeft = isOnePlus ? "calc(50% - 4.5px)" : isAnion ? "60%" : "calc(50% - 8px)";
  const contentTop  = isOnePlus ? "calc(50% + 3px)" : "50%";

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="puzzle-card"
      style={{
        position: "relative",
        width: 120,
        height: h,
        flexShrink: 0,
        cursor: "grab",
        touchAction: "none",
        userSelect: "none",
        "--card-hover-fill":     hoverFill(ion),
        "--card-hover-stroke":   hoverStroke(ion),
        "--card-pressed-fill":   pressedFill(ion),
        "--card-pressed-stroke": pressedStroke(ion),
      } as React.CSSProperties}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 121 ${h + 1}`}
        preserveAspectRatio="none"
        fill="none"
        style={{ position: "absolute", inset: 0 }}
      >
        <path d={path} fill={shapeFill()} stroke={shapeStroke()} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: contentLeft,
          top: contentTop,
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          pointerEvents: "none",
        }}
      >
        <span style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 32, lineHeight: "28px", letterSpacing: "-0.01em", color, whiteSpace: "nowrap" }}>
          {ion.symbol}
          <sup style={{ fontSize: 16, verticalAlign: "super", lineHeight: 0 }}>{ion.superscript}</sup>
        </span>
        <span className="font-sans text-label-sm text-text-sub text-center whitespace-nowrap">
          {ion.name}
        </span>
      </div>
    </div>
  );
}

type TabType = "cation" | "anion";

interface IonTabListProps {
  draggingIonId: string | null;
  height?: number;
}

export default function IonTabList({ draggingIonId, height = 556 }: IonTabListProps) {
  const [activeTab, setActiveTab] = useState<TabType>("cation");
  const ions = activeTab === "cation" ? CATIONS : ANIONS;
  const rows: Ion[][] = [];
  for (let i = 0; i < ions.length; i += 2) rows.push(ions.slice(i, i + 2));

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: 20,
        gap: 24,
        width: 296,
        height,
        background: "var(--color-static-white)",
        boxShadow: "inset 0 0 0 1px var(--color-border-strong)",
        borderRadius: 12,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      {/* Tab header */}
      <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", width: "100%", flexShrink: 0 }}>
        {(["cation", "anion"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              "font-sans flex justify-center items-center flex-1 h-9",
              "bg-transparent border-none cursor-pointer",
              "text-label-lg font-semibold transition-colors duration-150",
              activeTab === tab ? "text-text-strong" : "text-text-sub",
            ].join(" ")}
            style={{
              boxSizing: "border-box",
              padding: "6px 8px 10px",
              borderBottom: activeTab === tab ? "1px solid var(--color-neutral-40)" : "none",
            }}
          >
            {tab === "cation" ? "양이온(+)" : "음이온(-)"}
          </button>
        ))}
      </div>

      {/* Scrollable ion list */}
      <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", width: "100%", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 4, flexShrink: 0 }}>
          <img src={tipsSvg} width={24} height={24} alt="" />
          <span className="text-body-xxs text-text-normal whitespace-nowrap">
            {activeTab === "cation" ? "양이온의 오른쪽 홈에 음이온이 끼워져요" : "왼쪽 돌출부가 양이온 홈에 끼워져요"}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
          {rows.map((row, ri) => (
            <div key={ri} style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 16 }}>
              {row.map((ion) => (
                <PuzzleCard key={ion.id} ion={ion} isDragging={draggingIonId === ion.id} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
