import type { CSSProperties } from "react";
import { guideCardBorderStyle } from "@/components/lab/guideCardStyle";

interface GuideTooltipProps {
  stepLabel: string;
  title: string;
  description: string;
  current: number;
  total: number;
  onPrev?: () => void;
  onNext: () => void;
  onClose: () => void;
  nextLabel?: string;
  style?: CSSProperties;
}

export default function GuideTooltip({
  stepLabel,
  title,
  description,
  current,
  total,
  onPrev,
  onNext,
  onClose,
  nextLabel = "다음",
  style,
}: GuideTooltipProps) {
  const progressPercent = (current / total) * 100;

  return (
    <div
      style={{
        boxSizing: "border-box",
        position: "absolute",
        zIndex: 40,
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: 24, gap: 16,
        width: 400,
        borderRadius: 12,
        ...guideCardBorderStyle,
        ...style,
      }}
    >
      {/* Step label + title/description + close */}
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 16, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6, flex: 1, minWidth: 0 }}>
          <div style={{
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            padding: "2px 4px", width: "fit-content",
            background: "var(--color-element-drag-fill-blue)", borderRadius: 6,
          }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 12, lineHeight: "17px", letterSpacing: "-0.005em", color: "var(--color-primary-normal)" }}>
              {stepLabel}
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 20, lineHeight: "32px", letterSpacing: "-0.005em", color: "var(--color-text-strong)" }}>
            {title}
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "22px", letterSpacing: "-0.005em", color: "var(--color-text-normal)", whiteSpace: "pre-line", wordBreak: "keep-all" }}>
            {description}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
            <path d="M13 1L1 13M1 1L13 13" stroke="var(--color-text-normal)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Progress + actions */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12, width: "100%" }}>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", flexGrow: 1, height: 4, background: "var(--color-element-drag-fill-blue)", borderRadius: 999 }}>
            <div style={{ width: `${progressPercent}%`, height: 4, background: "var(--color-primary-normal)", borderRadius: 999 }} />
          </div>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", letterSpacing: "-0.005em", color: "var(--color-text-sub)", whiteSpace: "nowrap" }}>
            {current} / {total}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 8, width: "100%" }}>
          {onPrev && (
            <button
              type="button"
              onClick={onPrev}
              style={{
                display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
                padding: 12, gap: 4, height: 42,
                background: "var(--color-border-normal)", borderRadius: 12, border: "none", cursor: "pointer",
              }}
            >
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", color: "var(--color-text-normal)" }}>
                이전
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            style={{
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              padding: 12, gap: 4, height: 42,
              background: "var(--color-primary-normal)", borderRadius: 12, border: "none", cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", color: "var(--color-static-white)" }}>
              {nextLabel}
            </span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12L5 12" stroke="var(--color-static-white)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5L19 12L12 19" stroke="var(--color-static-white)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
