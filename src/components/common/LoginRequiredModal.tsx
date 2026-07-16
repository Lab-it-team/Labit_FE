import kakaoIconSvg from "@/assets/brand/kakao-icon.svg";
import mascotPng from "@/assets/mascot/mascot.png";
import { startKakaoLogin, kakaoConfigReady } from "@/features/auth/kakaoLogin";

interface LoginRequiredModalProps {
  onClose: () => void;
}

export default function LoginRequiredModal({ onClose }: LoginRequiredModalProps) {
  const handleKakaoLogin = () => startKakaoLogin(window.location.pathname);

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
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: 24, gap: 24, width: 365,
          background: "var(--color-static-white)",
          boxShadow: "0px 0px 100px var(--color-shadow-modal)",
          borderRadius: 24,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%", height: 24 }}>
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

        <img src={mascotPng} alt="" style={{ width: 144, height: 124.8, objectFit: "contain" }} />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, lineHeight: "30px", textAlign: "center", color: "var(--color-text-strong)" }}>
            로그인이 필요해요!
          </span>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", color: "var(--color-text-normal)" }}>
              <span style={{ color: "var(--color-text-primary)" }}>3초 만에 로그인</span>하고,
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", color: "var(--color-text-normal)" }}>
              모든 기능을 제한 없이 즐겨보세요.
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
          <button
            type="button"
            onClick={handleKakaoLogin}
            disabled={!kakaoConfigReady}
            style={{
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              padding: "12px 20px", gap: 6, width: "100%", height: 46,
              background: "#FEE500", borderRadius: 12, border: "none",
              cursor: kakaoConfigReady ? "pointer" : "not-allowed",
              opacity: kakaoConfigReady ? 1 : 0.4,
            }}
          >
            <img src={kakaoIconSvg} alt="" width={20} height={20} />
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.005em", color: "#181600" }}>
              카카오로 시작하기
            </span>
          </button>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 11, lineHeight: "16px", textAlign: "center", letterSpacing: "-0.005em", color: "var(--color-text-sub)", maxWidth: 222 }}>
            계정 생성 시 서비스 이용을 위한 필수 항목인<br />서비스 이용약관과 개인정보 처리방침에 동의합니다.
          </span>
        </div>
      </div>
    </div>
  );
}
