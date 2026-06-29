import mascotPng from "@/assets/mascot/labit_wink.png";
import confetti from "canvas-confetti";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";

interface LessonCompleteModalProps {
  onClose: () => void;
  completedFormulas: string[];
  onOpenFreeLab: () => void;
}

export default function LessonCompleteModal({ onClose, completedFormulas, onOpenFreeLab }: LessonCompleteModalProps) {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: false });
    const colors = ["#F6FCFF", "#0085FF", "#B8DCFF", "#5DFFF2"];

    myConfetti({
      particleCount: 90,
      spread: 160,
      origin: { x: 0.5, y: 0.3 },
      colors,
      shapes: ["star", "circle", "square"],
      scalar: 1.1,
      startVelocity: 22,
      gravity: 0.45,
      ticks: 380,
      decay: 0.93,
    });

    return () => { myConfetti.reset(); };
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}
      onClick={onClose}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none",
          zIndex: 1001,
        }}
      />
      <div
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: 24, gap: 24, width: 400,
          background: "var(--color-static-white)",
          boxShadow: "0px 0px 100px rgba(78, 79, 82, 0.18)",
          borderRadius: 24,
          boxSizing: "border-box",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Frame 399: Close row */}
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItems: "center", width: "100%", height: 24 }}>
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
        <img src={mascotPng} alt="" width={158} height={131} style={{ objectFit: "contain", marginTop: 16 }} />

        {/* Frame 395: text-area (title + body only) */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, width: "100%" }}>
          {/* Frame 433: title row */}
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: 8, width: "100%" }}>
            <span style={{
              fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, lineHeight: "30px",
              textAlign: "center", color: "var(--color-text-strong)",
            }}>
              목표 화합물을<br />모두 완성했어요! 🎉
            </span>
          </div>
          {/* Body */}
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 13, lineHeight: "20px",
            letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-normal)",
            width: "100%",
          }}>
            전하 합 맞추기, 이제 익숙해졌죠?<br />자유 실험실에서 더 많이 연습할 수 있어요.
          </span>
        </div>

        {/* Frame 439: 내가 만든 화합물 chips */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
          padding: 12, gap: 8, width: "100%",
          background: "#F1F7FF", borderRadius: 12,
          boxSizing: "border-box",
        }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px",
            letterSpacing: "-0.005em", color: "var(--color-text-normal)",
          }}>
            내가 만든 화합물
          </span>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
            {completedFormulas.map((formula) => (
              <div
                key={formula}
                style={{
                  display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
                  padding: "4px 8px", height: 24,
                  background: "var(--color-static-white)", borderRadius: 24,
                  boxSizing: "border-box",
                }}
              >
                <span style={{
                  fontFamily: "'Bricolage Grotesque', var(--font-sans)", fontWeight: 400, fontSize: 13, lineHeight: "16px",
                  color: "var(--color-text-normal)", whiteSpace: "nowrap",
                }}>
                  {formula}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Frame 456: Buttons */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", gap: 6, width: "100%" }}>
          {/* Primary: 공유 결합 학습하기 */}
          <button
            type="button"
            onClick={() => navigate("/covalent-concept")}
            style={{
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              padding: 12, gap: 4, width: "100%", height: 48,
              background: "var(--color-primary-normal)", borderRadius: 12, border: "none", cursor: "pointer",
            }}
          >
            <span style={{
              fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px",
              letterSpacing: "-0.005em", color: "var(--color-text-light)",
            }}>
              공유 결합 학습하기
            </span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5L19 12L12 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Secondary: 실습 다시 보기 */}
          <button
            type="button"
            onClick={onClose}
            style={{
              boxSizing: "border-box",
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              padding: 12, width: "100%", height: 42,
              background: "var(--color-bg-normal)", border: "1px solid var(--color-neutral-15)", borderRadius: 12, cursor: "pointer",
            }}
          >
            <span style={{
              fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, lineHeight: "18px",
              letterSpacing: "-0.005em", color: "var(--color-text-normal)",
            }}>
              실습 다시 보기
            </span>
          </button>

          {/* Secondary: 자유 실험실 */}
          <button
            type="button"
            onClick={onOpenFreeLab}
            style={{
              boxSizing: "border-box",
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              padding: 12, width: "100%", height: 42,
              background: "var(--color-bg-normal)", border: "1px solid var(--color-neutral-15)", borderRadius: 12, cursor: "pointer",
            }}
          >
            <span style={{
              fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, lineHeight: "18px",
              letterSpacing: "-0.005em", color: "var(--color-text-normal)",
            }}>
              자유 실험실
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
