import { useDraggable, useDroppable } from "@dnd-kit/core";
import PuzzlePiece from "@/components/lab/PuzzlePiece";
import type { Ion } from "@/data/ions";
import bellSvg from "@/assets/Icon/bell.svg";
import checkSvg from "@/assets/Icon/check.svg";

export interface PlacedPiece {
  id: string;
  ion: Ion;
  x: number;
  y: number;
  bondedAnionIds: string[];
  bondedToCationId: string | null;
  bondedBelowId: string | null;       // (양이온) 아래 양이온 ID
  bondedAboveCationId: string | null; // (양이온) 위 양이온 ID
}

interface CanvasDropZoneProps {
  onCanvasReady: (node: HTMLDivElement | null) => void;
  placedPieces: PlacedPiece[];
  onRemove: (id: string) => void;
  isDragOver: boolean;
  isCorrect: boolean;
  isWrong?: boolean;
  isWrongCompound?: boolean;
  checkKey?: number;
  draggingPieceId?: string | null;
  height: number;
  hintVisible?: boolean;
  hintText?: string;
}

type CanvasStatus = "empty" | "active" | "positive" | "negative" | "wrongCompound";

function getStyle(status: CanvasStatus, isDragOver: boolean) {
  if (isDragOver)
    return {
      bg: "var(--color-element-drag-fill-blue)",
      border: "1px dashed var(--color-element-drag-stroke-blue)",
    };
  if (status === "positive")
    return {
      bg: "var(--color-element-hover-fill-mint)",
      border: "1px solid var(--color-status-positive)",
    };
  if (status === "negative")
    return {
      bg: "var(--color-element-light-red)",
      border: "1px solid var(--color-status-negative)",
    };
  if (status === "wrongCompound")
    return {
      bg: "var(--color-element-light-red)",
      border: "1px solid var(--color-status-negative)",
    };
  if (status === "active")
    return {
      bg: "var(--color-bg-normal)",
      border: "1px solid var(--color-border-strong)",
    };
  return {
    bg: "var(--color-bg-normal)",
    border: "1px dashed var(--color-border-strong)",
  };
}

function Toast({ status }: { status: CanvasStatus }) {
  const base: React.CSSProperties = {
    position: "absolute",
    top: 24,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "8px 12px",
    gap: 6,
    background: "var(--color-bg-opacity-light95)",
    borderRadius: 12,
    zIndex: 10,
    whiteSpace: "nowrap",
  };

  const label: React.CSSProperties = {
    fontFamily: "Pretendard, sans-serif",
    fontWeight: 400,
    fontSize: 13,
    lineHeight: "18px",
    letterSpacing: "-0.005em",
    color: "var(--color-text-normal)",
  };

  const slideOut: React.CSSProperties = {
    animation: "toast-slide-out 0.4s ease 5s forwards",
  };

  if (status === "positive") {
    return (
      <div style={{ ...base, ...slideOut, border: "1px solid var(--color-status-positive)" }}>
        <img
          src={checkSvg}
          width={24}
          height={24}
          alt=""
          style={{
            filter:
              "brightness(0) saturate(100%) invert(82%) sepia(13%) saturate(1203%) hue-rotate(130deg) brightness(96%)",
          }}
        />
        <span style={label}>정답이에요!</span>
      </div>
    );
  }

  if (status === "negative") {
    return (
      <div
        style={{ ...base, ...slideOut, alignItems: "center", border: "1px solid var(--color-status-negative)" }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path
            d="M17.6569 6.3424C17.4693 6.15486 17.215 6.04951 16.9497 6.04951C16.6845 6.04951 16.4302 6.15486 16.2426 6.3424L12 10.585L7.75736 6.3424C7.56982 6.15486 7.31547 6.04951 7.05025 6.04951C6.78504 6.04951 6.53068 6.15486 6.34315 6.3424C6.15561 6.52994 6.05025 6.78429 6.05025 7.04951C6.05025 7.31472 6.15561 7.56908 6.34315 7.75661L10.5858 11.9993L6.34315 16.2419C6.15561 16.4294 6.05025 16.6838 6.05025 16.949C6.05025 17.2142 6.15561 17.4686 6.34315 17.6561C6.53068 17.8436 6.78504 17.949 7.05025 17.949C7.31547 17.949 7.56982 17.8436 7.75736 17.6561L12 13.4135L16.2426 17.6561C16.4302 17.8436 16.6845 17.949 16.9497 17.949C17.215 17.949 17.4693 17.8436 17.6569 17.6561C17.8444 17.4686 17.9497 17.2142 17.9497 16.949C17.9497 16.6838 17.8444 16.4294 17.6569 16.2419L13.4142 11.9993L17.6569 7.75661C17.8444 7.56908 17.9497 7.31472 17.9497 7.04951C17.9497 6.78429 17.8444 6.52994 17.6569 6.3424Z"
            fill="var(--color-status-negative)"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
          <span style={label}>전하 합을 다시 확인해 보세요.</span>
          <span style={{ ...label, fontSize: 12, lineHeight: "17px", color: "var(--color-text-sub)" }}>
            5초 후 자동으로 리셋됩니다.
          </span>
        </div>
      </div>
    );
  }

  if (status === "wrongCompound") {
    return (
      <div
        style={{ ...base, ...slideOut, alignItems: "center", border: "1px solid var(--color-status-negative)" }}
      >
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
          <path
            d="M17.6569 6.3424C17.4693 6.15486 17.215 6.04951 16.9497 6.04951C16.6845 6.04951 16.4302 6.15486 16.2426 6.3424L12 10.585L7.75736 6.3424C7.56982 6.15486 7.31547 6.04951 7.05025 6.04951C6.78504 6.04951 6.53068 6.15486 6.34315 6.3424C6.15561 6.52994 6.05025 6.78429 6.05025 7.04951C6.05025 7.31472 6.15561 7.56908 6.34315 7.75661L10.5858 11.9993L6.34315 16.2419C6.15561 16.4294 6.05025 16.6838 6.05025 16.949C6.05025 17.2142 6.15561 17.4686 6.34315 17.6561C6.53068 17.8436 6.78504 17.949 7.05025 17.949C7.31547 17.949 7.56982 17.8436 7.75736 17.6561L12 13.4135L16.2426 17.6561C16.4302 17.8436 16.6845 17.949 16.9497 17.949C17.215 17.949 17.4693 17.8436 17.6569 17.6561C17.8444 17.4686 17.9497 17.2142 17.9497 16.949C17.9497 16.6838 17.8444 16.4294 17.6569 16.2419L13.4142 11.9993L17.6569 7.75661C17.8444 7.56908 17.9497 7.31472 17.9497 7.04951C17.9497 6.78429 17.8444 6.52994 17.6569 6.3424Z"
            fill="var(--color-status-negative)"
          />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
          <span style={label}>전하는 맞지만 목표 화합물이 아니에요!</span>
          <span style={{ ...label, fontSize: 12, lineHeight: "17px", color: "var(--color-text-sub)" }}>
            5초 후 자동으로 리셋됩니다.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div style={base}>
      <img src={bellSvg} width={24} height={24} alt="" />
      <span style={label}>이온을 놓고 정답을 확인해 보세요.</span>
    </div>
  );
}

function HintPopup({ text }: { text: string }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        position: "absolute",
        top: 24,
        left: "calc(50% - 180px)",
        width: 360,
        height: 40,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 12px",
        gap: 6,
        background: "var(--color-bg-opacity-light95)",
        border: "1px solid var(--color-element-normal-yellow)",
        borderRadius: 12,
        zIndex: 11,
      }}
    >
      <img src={bellSvg} width={24} height={24} alt="" style={{ flexShrink: 0 }} />
      <span
        style={{
          width: 306,
          fontFamily: "Pretendard, sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: 13,
          lineHeight: "18px",
          textAlign: "center",
          letterSpacing: "-0.005em",
          color: "var(--color-text-normal)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
}

export default function CanvasDropZone({
  onCanvasReady,
  placedPieces,
  onRemove,
  isDragOver,
  isCorrect,
  isWrong = false,
  isWrongCompound = false,
  checkKey = 0,
  draggingPieceId = null,
  height,
  hintVisible = false,
  hintText,
}: CanvasDropZoneProps) {
  const { setNodeRef } = useDroppable({ id: "ionic-canvas" });
  const hasInput = placedPieces.length > 0;
  const hintDismissed = hasInput;

  const status: CanvasStatus = isWrongCompound
    ? "wrongCompound"
    : isWrong
    ? "negative"
    : isCorrect
    ? "positive"
    : hasInput
    ? "active"
    : "empty";

  const { bg, border } = getStyle(status, isDragOver);
  const setCanvasNode = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    onCanvasReady(node);
  };

  return (
    <div
      ref={setCanvasNode}
      style={{
        boxSizing: "border-box",
        position: "relative",
        width: 548,
        height,
        background: bg,
        border,
        borderRadius: 12,
        overflow: "hidden",
        transition: "background 0.2s, border-color 0.2s",
        touchAction: "none",
      }}
    >
      {!isDragOver && <Toast key={checkKey} status={status} />}
      {hintVisible && hintText && <HintPopup text={hintText} />}

      {!hintDismissed && (!hasInput || isDragOver) && (
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            fontSize: 14,
            lineHeight: "24px",
            textAlign: "center",
            letterSpacing: "-0.005em",
            color: isDragOver ? "var(--color-text-primary)" : "var(--color-text-disabled)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          이온을 가까이 놓으면 자동으로 결합됩니다.
        </span>
      )}

      {placedPieces.map((piece) => {
        const isSnapped =
          !!piece.bondedToCationId ||
          piece.bondedAnionIds.length > 0 ||
          !!piece.bondedAboveCationId ||
          !!piece.bondedBelowId;
        return (
          <DraggableCanvasPiece
            key={piece.id}
            piece={piece}
            isSnapped={isSnapped}
            isDragging={draggingPieceId === piece.id}
            onRemove={onRemove}
          />
        );
      })}

    </div>
  );
}

function DraggableCanvasPiece({
  piece,
  isSnapped,
  isDragging,
  onRemove,
}: {
  piece: PlacedPiece;
  isSnapped: boolean;
  isDragging: boolean;
  onRemove: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `canvas:${piece.id}`,
    data: { source: "canvas", pieceId: piece.id, ion: piece.ion },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="canvas-piece"
      style={{
        position: "absolute",
        left: piece.x,
        top: piece.y,
        cursor: "grab",
        zIndex: isSnapped ? 4 : 8,
        opacity: isDragging ? 0.35 : 1,
        transition: (piece.bondedToCationId || piece.bondedAboveCationId)
          ? "left 0.18s cubic-bezier(.34,1.5,.64,1), top 0.18s cubic-bezier(.34,1.5,.64,1)"
          : "none",
        touchAction: "none",
      }}
    >
      <PuzzlePiece
        ion={piece.ion}
        size="default"
        interaction="removable"
        onRemove={() => onRemove(piece.id)}
      />
    </div>
  );
}
