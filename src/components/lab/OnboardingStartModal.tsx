import microscopePng from "@/assets/mascot/labit_microscope.png";
import { guideCardBorderStyle } from "@/components/lab/guideCardStyle";

interface OnboardingStartModalProps {
  onClose: () => void;
  onNext: () => void;
}

export default function OnboardingStartModal({ onClose, onNext }: OnboardingStartModalProps) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "var(--color-bg-overlay)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          boxSizing: "border-box",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: 24, gap: 24,
          width: 400,
          borderRadius: 12,
          ...guideCardBorderStyle,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", width: "100%", height: 24 }}>
          <button
            type="button"
            onClick={onClose}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1L13 13" stroke="var(--color-text-normal)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Mascot */}
        <img src={microscopePng} alt="" style={{ width: 140, height: 140, objectFit: "contain" }} />

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 20,
            lineHeight: "26px", textAlign: "center", color: "var(--color-text-strong)",
          }}>
            실습을 시작해 볼까요?
          </span>

          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14,
            lineHeight: "24px", textAlign: "center", letterSpacing: "-0.005em",
            color: "var(--color-text-normal)",
          }}>
            배운 내용을 직접 체험해 보는 시간이에요.<br />
            <span style={{ color: "var(--color-text-primary)" }}>30초</span>면 사용법을 익힐 수 있어요.
          </span>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onNext}
          style={{
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            padding: "12px 20px", gap: 6, width: "100%", height: 46,
            background: "var(--color-primary-normal)", borderRadius: 12, border: "none",
            cursor: "pointer",
          }}
        >
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.005em", color: "var(--color-static-white)" }}>
            다음
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12L5 12" stroke="var(--color-static-white)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5L19 12L12 19" stroke="var(--color-static-white)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
