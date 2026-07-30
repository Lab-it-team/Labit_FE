import { cardHeight } from "@/components/lab/puzzlePaths";
import PuzzleGhost from "@/components/lab/PuzzleGhost";
import type { Ion } from "@/data/ions";

const END = { x: 606, y: 301 }; // "이온 목록 + 캔버스" row(900x556) 기준, 캔버스 드롭존 중심
const CALLOUT_GAP = 18;

interface DragDemoOverlayProps {
  ion: Ion;
  start: { x: number; y: number };
  cycleMs: number;
}

export default function DragDemoOverlay({ ion, start, cycleMs }: DragDemoOverlayProps) {
  const h = cardHeight(ion);
  const nearEnd = {
    x: start.x + (END.x - start.x) * 0.92,
    y: start.y + (END.y - start.y) * 0.92,
  };

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 45 }}>
      <style>{`
        @keyframes labDragDemoGhost {
          0%, 8%    { left: ${start.x}px;   top: ${start.y}px;   opacity: 0; }
          9%        { left: ${start.x}px;   top: ${start.y}px;   opacity: 1; animation-timing-function: linear; }
          34%       { left: ${nearEnd.x}px; top: ${nearEnd.y}px; opacity: 1; animation-timing-function: cubic-bezier(.34,1.5,.64,1); }
          40%, 80%  { left: ${END.x}px;     top: ${END.y}px;     opacity: 1; }
          92%, 100% { left: ${END.x}px;     top: ${END.y}px;     opacity: 0; }
        }
        @keyframes labDragDemoDropCallout {
          0%, 38%   { opacity: 0; }
          44%, 80%  { opacity: 1; }
          88%, 100% { opacity: 0; }
        }
      `}</style>

      {/* 놓기 안내 말풍선 */}
      <div style={{ position: "absolute", left: END.x, top: END.y - h / 2, width: 0, height: 0 }}>
        <div
          style={{
            position: "absolute",
            bottom: CALLOUT_GAP,
            left: "50%",
            transform: "translateX(-50%)",
            animation: `labDragDemoDropCallout ${cycleMs}ms ease-in-out infinite`,
          }}
        >
          <Callout text="여기에 놓기!" />
        </div>
      </div>

      {/* 드래그되는 이온 조각 고스트 — 실제 드래그 중(PuzzleGhost)과 동일한 모양 */}
      <div
        style={{
          position: "absolute",
          width: 120,
          height: h,
          transform: "translate(-50%, -50%)",
          animation: `labDragDemoGhost ${cycleMs}ms infinite`,
        }}
      >
        <PuzzleGhost ion={ion} />
      </div>
    </div>
  );
}

function Callout({ text }: { text: string }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "8px 16px",
        background: "var(--color-primary-normal)",
        borderRadius: 12,
        whiteSpace: "nowrap",
        textAlign: "center",
      }}
    >
      <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 14, lineHeight: "18px", letterSpacing: "-0.005em", color: "var(--color-static-white)" }}>
        {text}
      </span>
      <div
        style={{
          position: "absolute",
          bottom: -7,
          left: "50%",
          transform: "translateX(-50%)",
          width: 0,
          height: 0,
          borderLeft: "7px solid transparent",
          borderRight: "7px solid transparent",
          borderTop: "8px solid var(--color-primary-normal)",
        }}
      />
    </div>
  );
}
