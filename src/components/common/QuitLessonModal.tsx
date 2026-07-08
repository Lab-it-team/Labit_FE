import { useEffect } from "react";
import kakaoIconSvg from "@/assets/brand/kakao-icon.svg";

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY as string | undefined;
const KAKAO_REDIRECT  = import.meta.env.VITE_KAKAO_REDIRECT_URI  as string | undefined;

interface QuitLessonModalProps {
  onClose: () => void;
  onQuit: () => void;
}

export default function QuitLessonModal({ onClose, onQuit }: QuitLessonModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleKakaoLogin = () => {
    if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT) {
      console.warn("카카오 로그인 환경 변수가 설정되지 않았습니다.");
      return;
    }
    sessionStorage.setItem("lab_redirect", "/home");
    const state = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : String(Date.now());
    sessionStorage.setItem("kakao_oauth_state", state);
    const params = new URLSearchParams({
      client_id: KAKAO_CLIENT_ID,
      redirect_uri: KAKAO_REDIRECT,
      response_type: "code",
      state,
    });
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "var(--color-bg-overlay)", display: "flex", alignItems: "center", justifyContent: "center" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="학습 그만하기"
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: 24, gap: 24, width: 365,
          background: "var(--color-bg-normal)",
          boxShadow: "0px 0px 100px var(--color-shadow-modal)",
          borderRadius: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L1 13M1 1L13 13" stroke="var(--color-text-normal)" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 텍스트 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, lineHeight: "30px", textAlign: "center", color: "var(--color-text-strong)" }}>
            정말 학습을 그만할까요?
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "22px", letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-normal)" }}>
            이대로 그만하면 진도가 저장되지 않아요.<br />로그인하고 학습 내용을 저장하세요.
          </span>
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, width: "100%" }}>
          <button
            type="button"
            onClick={handleKakaoLogin}
            style={{
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              padding: "12px 20px", gap: 4, width: "100%", height: 46,
              background: "#FEE500", borderRadius: 12, border: "none", cursor: "pointer",
            }}
          >
            <img src={kakaoIconSvg} alt="" width={20} height={20} />
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.005em", color: "#181600" }}>
              로그인하고 계속하기
            </span>
          </button>
          <button
            type="button"
            onClick={onQuit}
            style={{
              display: "flex", justifyContent: "center", alignItems: "center",
              padding: 12, width: "100%", height: 42,
              background: "none", border: "none", borderRadius: 12, cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", color: "var(--color-text-normal)" }}>
              그만하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
