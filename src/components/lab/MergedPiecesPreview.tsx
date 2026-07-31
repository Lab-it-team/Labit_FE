import { getPuzzlePath, cardHeight, ionColor } from "@/components/lab/puzzlePaths";
import type { Ion } from "@/data/ions";

// "이온 목록 + 캔버스" row(900x556) 기준 상대 좌표 — 캔버스 안쪽에 맞물린 두 조각 위치
const CATION_POS = { x: 504, y: 220 };
const ANION_POS = { x: 603, y: 220 };

function SolidPiece({ ion, x, y }: { ion: Ion; x: number; y: number }) {
  const h = cardHeight(ion);
  const color = ionColor(ion);
  const path = getPuzzlePath(ion);
  const isOnePlus = ion.type === "plus" && ion.charge === 1;
  const isAnion = ion.type === "minus";
  const contentLeft = isOnePlus ? "calc(50% - 4.5px)" : isAnion ? "60%" : "calc(50% - 8px)";
  const contentTop = isOnePlus ? "calc(50% + 3px)" : "50%";

  return (
    <div style={{ position: "absolute", left: x, top: y, width: 120, height: h }}>
      <svg width="100%" height="100%" viewBox={`0 0 121 ${h + 1}`} preserveAspectRatio="none" fill="none" style={{ position: "absolute", inset: 0 }}>
        <path d={path} fill={color} stroke="var(--color-static-white)" />
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
        }}
      >
        <span style={{ fontFamily: "Bricolage Grotesque, sans-serif", fontWeight: 700, fontSize: 32, lineHeight: "28px", letterSpacing: "-0.01em", color: "var(--color-static-white)", whiteSpace: "nowrap" }}>
          {ion.symbol}
          <sup style={{ fontSize: 16, verticalAlign: "super", lineHeight: 0 }}>{ion.superscript}</sup>
        </span>
        <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 12, color: "var(--color-static-white)", whiteSpace: "nowrap" }}>
          {ion.name}
        </span>
      </div>
    </div>
  );
}

export default function MergedPiecesPreview({ cation, anion }: { cation: Ion; anion: Ion }) {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 41 }}>
      <SolidPiece ion={cation} x={CATION_POS.x} y={CATION_POS.y} />
      <SolidPiece ion={anion} x={ANION_POS.x} y={ANION_POS.y} />
    </div>
  );
}
