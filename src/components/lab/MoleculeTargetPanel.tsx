interface MoleculeTargetPanelProps {
  formula: string;
  name: string;
  isComplete: boolean;
  hasInput: boolean;
}

export default function MoleculeTargetPanel({ formula, name, isComplete, hasInput }: MoleculeTargetPanelProps) {
  const statusColor = isComplete ? "var(--color-status-positive)" : hasInput ? "var(--color-status-negative)" : "var(--color-text-disabled)";
  const statusLabel = isComplete ? `안정된 ${name} 분자` : hasInput ? "불안정" : "원자를 놓아보세요";

  return (
    <div
      style={{
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        padding: "16px 0",
        gap: 32,
        width: 900,
        height: 137,
        background: "var(--color-bg-elevate)",
        borderRadius: 12,
        alignSelf: "stretch",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "12px 60px",
          gap: 8,
          borderRight: "1px solid var(--color-border-strong)",
          flexShrink: 0,
        }}
      >
        <span className="text-body-md font-medium text-text-normal whitespace-nowrap">목표 화합물</span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
          <span className="font-display text-content-xl text-text-strong whitespace-nowrap">{formula}</span>
          <span className="text-caption-lg text-text-normal text-center whitespace-nowrap">{name}</span>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <span
          style={{
            fontFamily: "var(--font-sans)",
            fontWeight: 700,
            fontSize: 24,
            lineHeight: "30px",
            color: statusColor,
            transition: "color 0.2s",
            whiteSpace: "nowrap",
          }}
        >
          {statusLabel}
        </span>
        <span className="text-body-xxs text-text-normal text-center whitespace-nowrap">
          원자를 가까이 붙이면 전자쌍을 공유하며 결합해요
        </span>
      </div>
    </div>
  );
}
