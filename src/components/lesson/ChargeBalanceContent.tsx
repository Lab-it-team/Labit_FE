import { useState } from "react";
import quizBoxSvg from "@/assets/lesson/quizBox.svg";

const BG = "Bricolage Grotesque, sans-serif";
const KR = "Pretendard, sans-serif";

// ── Cross rule diagram ────────────────────────────────────────────────────────
function CrossRuleDiagram() {
  return (
    <div
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "16px 32px",
        background: "#F8F9FF",
        border: "1px solid #E9EFFE",
        borderRadius: 16,
      }}
    >
      {/* 두 이온 + 교차 */}
      <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
        {/* 양이온 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 64 }}>
          <span style={{ fontFamily: BG, fontSize: 20, fontWeight: 700, color: "#ED66C2" }}>Mg²⁺</span>
          <span style={{ fontFamily: BG, fontSize: 13, color: "#8A8B8E" }}>(+2)</span>
        </div>

        {/* SVG 교차 화살표 */}
        <svg width="72" height="48" viewBox="0 0 72 48" fill="none" style={{ flexShrink: 0 }}>
          <defs>
            <marker id="arL" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#ADBCF7" />
            </marker>
            <marker id="arR" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#ADBCF7" />
            </marker>
          </defs>
          {/* 왼쪽 위 → 오른쪽 아래 */}
          <line x1="8" y1="10" x2="62" y2="38" stroke="#ADBCF7" strokeWidth="1.8" markerEnd="url(#arL)" />
          {/* 오른쪽 위 → 왼쪽 아래 */}
          <line x1="64" y1="10" x2="10" y2="38" stroke="#ADBCF7" strokeWidth="1.8" markerEnd="url(#arR)" />
        </svg>

        {/* 음이온 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 64 }}>
          <span style={{ fontFamily: BG, fontSize: 20, fontWeight: 700, color: "#275AF0" }}>Cl⁻</span>
          <span style={{ fontFamily: BG, fontSize: 13, color: "#8A8B8E" }}>(-1)</span>
        </div>
      </div>

      {/* 결과 */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: KR, fontSize: 13, color: "#8A8B8E" }}>→</span>
        <span style={{ fontFamily: BG, fontSize: 16, fontWeight: 700, color: "#275AF0" }}>MgCl₂</span>
      </div>
      <span style={{ fontFamily: KR, fontSize: 12, color: "#B4B5B8", marginTop: -4 }}>
        전하 크기가 반대편 이온의 개수가 됩니다
      </span>
    </div>
  );
}

// ── Table data ────────────────────────────────────────────────────────────────
const TABLE_ROWS = [
  { cation: "Na⁺",  anion: "Cl⁻",  formula: "NaCl",   balance: "+1+(−1)=0",       ratio: "1:1" },
  { cation: "Mg²⁺", anion: "Cl⁻",  formula: "MgCl₂",  balance: "(+2)+2×(−1)=0",   ratio: "1:2" },
  { cation: "Na⁺",  anion: "O²⁻",  formula: "Na₂O",   balance: "2×(+1)+(−2)=0",   ratio: "2:1" },
  { cation: "Ca²⁺", anion: "O²⁻",  formula: "CaO",    balance: "(+2)+(−2)=0",      ratio: "1:1" },
  { cation: "Al³⁺", anion: "O²⁻",  formula: "Al₂O₃",  balance: "2×(+3)+3×(−2)=0", ratio: "2:3" },
];

const COL_HEADERS = ["양이온", "음이온", "화학식", "전하 균형 확인", "결합 비율"];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChargeBalanceContent() {
  const [revealed, setRevealed] = useState<Record<number, boolean>>(
    Object.fromEntries(TABLE_ROWS.map((_, i) => [i, false]))
  );
  const toggle = (i: number) => setRevealed((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* ── study-box 1: 황금 규칙 ── */}
      <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 className="text-heading-md text-text-strong">전하 균형의 황금 규칙</h2>
          <p style={{ fontSize: 16, fontWeight: 500, lineHeight: "25px", letterSpacing: "-0.005em", color: "#4E4F52" }}>
            이온 화합물에서 전체 전하의 합은 반드시 0이 되어야 합니다.
          </p>
          {/* 수식 강조 */}
          <div
            style={{
              padding: "12px 16px",
              background: "#F1F7FF",
              borderRadius: 12,
              display: "flex",
              flexDirection: "column",
              gap: 4,
            }}
          >
            <span style={{ fontFamily: KR, fontSize: 13, color: "#8A8B8E" }}>핵심 공식</span>
            <span style={{ fontFamily: BG, fontSize: 15, fontWeight: 600, color: "#275AF0", letterSpacing: "-0.005em" }}>
              (양이온 전하 × 양이온 수) + (음이온 전하 × 음이온 수) = 0
            </span>
          </div>
        </div>
      </div>

      {/* ── study-box 2: 수식으로 이해 → 교차 규칙 ── */}
      <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h2 style={{ fontSize: 16, fontWeight: 500, lineHeight: "22px", letterSpacing: "-0.005em", color: "#4E4F52" }}>
            몇 개가 필요할까요?
          </h2>

          {/* 단계별 추론 */}
          <div className="flex flex-col gap-2">
            {/* 단계 1 */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: KR, fontSize: 13, lineHeight: "18px", color: "#8A8B8E" }}>질문</span>
              <span style={{ fontFamily: BG, fontSize: 16, fontWeight: 500, color: "#ED66C2", letterSpacing: "-0.005em" }}>
                Mg²⁺(+2)와 Cl⁻(-1)를 결합하면 몇 개가 필요할까?
              </span>
            </div>
            {/* 단계 2 */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: KR, fontSize: 13, lineHeight: "18px", color: "#8A8B8E" }}>풀이</span>
              <span style={{ fontFamily: BG, fontSize: 15, fontWeight: 500, color: "#4E4F52" }}>
                (+2) + (−1) × ? = 0 → ? = 2
              </span>
            </div>
            {/* 단계 3 */}
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 6 }}>
              <span style={{ fontFamily: KR, fontSize: 13, lineHeight: "18px", color: "#8A8B8E" }}>결론</span>
              <span style={{ fontFamily: BG, fontSize: 15, fontWeight: 600, color: "#275AF0" }}>
                Cl⁻ 2개 필요 → MgCl₂
              </span>
            </div>
          </div>
        </div>

        {/* 교차 규칙 */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p style={{ fontSize: 14, fontWeight: 500, lineHeight: "20px", letterSpacing: "-0.005em", color: "#4E4F52" }}>
              이걸 빠르게 찾는 방법이 <strong>교차 규칙</strong>입니다
            </p>
            <p style={{ fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", color: "#8A8B8E" }}>
              한쪽 이온의 전하 크기가 반대편 이온의 개수(아래 첨자)가 됩니다.
            </p>
          </div>
          <CrossRuleDiagram />
        </div>
      </div>

      {/* ── sc-box: 전하 균형 표 ── */}
      <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-3">

        {/* 범례 */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "2px 8px 8px", gap: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <img src={quizBoxSvg} width={72} height={31} alt="" style={{ flexShrink: 0 }} />
            <span style={{ fontFamily: KR, fontSize: 14, fontWeight: 500, lineHeight: "24px", letterSpacing: "-0.005em", color: "#4E4F52" }}>
              아이콘이 있는 빈칸에 들어갈 화학식을 맞춰 보세요
            </span>
          </div>
        </div>

        {/* 표 */}
        <div style={{ width: "100%", borderRadius: 12, overflow: "hidden" }}>
          {/* 헤더 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              background: "#F4F5F8",
              border: "1px solid #EAEBEE",
              borderRadius: "12px 12px 0 0",
              padding: "12px 0",
            }}
          >
            {COL_HEADERS.map((h) => (
              <div
                key={h}
                style={{
                  textAlign: "center",
                  fontFamily: KR,
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: "18px",
                  letterSpacing: "-0.005em",
                  color: "#8A8B8E",
                }}
              >
                {h}
              </div>
            ))}
          </div>

          {/* 바디 */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 24,
              padding: "12px 0",
              background: "#FFFFFF",
              border: "1px solid #EAEBEE",
              borderTop: "none",
              borderRadius: "0 0 12px 12px",
            }}
          >
            {TABLE_ROWS.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    alignItems: "center",
                    minHeight: 40,
                  }}
                >
                  {/* 양이온 */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span style={{ fontFamily: BG, fontSize: 18, fontWeight: 500, lineHeight: "22px", color: "#8A8B8E" }}>
                      {row.cation}
                    </span>
                  </div>

                  {/* 음이온 */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span style={{ fontFamily: BG, fontSize: 18, fontWeight: 500, lineHeight: "22px", color: "#8A8B8E" }}>
                      {row.anion}
                    </span>
                  </div>

                  {/* 화학식 / 퀴즈 박스 (토글) */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {revealed[i] ? (
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center",
                          width: 120, height: 40,
                          background: "#FFFFFF",
                          border: "1px solid #F0F1F4",
                          borderRadius: 8,
                          cursor: "pointer",
                        }}
                      >
                        <span style={{ fontFamily: BG, fontSize: 18, fontWeight: 600, lineHeight: "22px", color: "#8A8B8E" }}>
                          {row.formula}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggle(i)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                      >
                        <img src={quizBoxSvg} width={120} height={51} alt="정답 보기" />
                      </button>
                    )}
                  </div>

                  {/* 전하 균형 확인 */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: BG, fontSize: 16, fontWeight: 500, lineHeight: "22px",
                        color: "#8A8B8E", whiteSpace: "nowrap",
                      }}
                    >
                      {row.balance}
                    </span>
                  </div>

                  {/* 결합 비율 */}
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <span style={{ fontFamily: BG, fontSize: 18, fontWeight: 500, lineHeight: "22px", color: "#8A8B8E" }}>
                      {row.ratio}
                    </span>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
