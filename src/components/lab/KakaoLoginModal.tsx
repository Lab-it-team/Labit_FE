import kakaoIconSvg from "@/assets/Icon/kakao-icon.svg";
import mascotPng from "@/assets/Icon/mascot.png";

interface KakaoLoginModalProps {
  onClose: () => void;
  nextProblemIndex: number;
}

export default function KakaoLoginModal({ onClose, nextProblemIndex }: KakaoLoginModalProps) {
  const handleKakaoLogin = () => {
    sessionStorage.setItem("lab_current_problem", String(nextProblemIndex));
    sessionStorage.setItem("lab_redirect", "/ionic-lab");
    const solvedProblems = localStorage.getItem("lab_solved_problems");
    if (solvedProblems) {
      sessionStorage.setItem("lab_pre_login_solved_problems", solvedProblems);
    }
    const placedPieces = localStorage.getItem("lab_placed_pieces");
    if (placedPieces) {
      sessionStorage.setItem("lab_pre_login_placed_pieces", placedPieces);
    }

    const state = crypto.randomUUID();
    sessionStorage.setItem("kakao_oauth_state", state);
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_KAKAO_REST_API_KEY ?? "",
      redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI ?? "",
      response_type: "code",
      state,
    });
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
  };

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
          padding: 24, gap: 24,
          width: 365,
          background: "var(--color-static-white)",
          boxShadow: "0px 0px 100px var(--color-shadow-modal)",
          borderRadius: 24,
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
        <img src={mascotPng} alt="" style={{ width: 144, height: 124.8, objectFit: "contain" }} />

        {/* Text */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%" }}>
          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24,
            lineHeight: "30px", textAlign: "center", color: "var(--color-text-strong)",
          }}>
            계속 풀려면<br />로그인이 필요해요!
          </span>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", color: "var(--color-text-normal)" }}>
              <span style={{ color: "var(--color-text-primary)" }}>3초 만에 로그인</span>하고,
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", color: "var(--color-text-normal)" }}>
              모든 기능을 제한 없이 즐겨보세요.
            </span>
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, width: "100%" }}>
          <button
            type="button"
            onClick={handleKakaoLogin}
            style={{
              display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
              padding: "12px 20px", gap: 6, width: "100%", height: 46,
              background: "#FEE500", borderRadius: 12, border: "none", cursor: "pointer",
            }}
          >
            <img src={kakaoIconSvg} alt="" width={20} height={20} />
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.005em", color: "#181600" }}>
              카카오로 시작하기
            </span>
          </button>

          <span style={{
            fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 11,
            lineHeight: "16px", textAlign: "center", letterSpacing: "-0.005em",
            color: "var(--color-text-sub)", maxWidth: 222,
          }}>
            계정 생성 시 서비스 이용을 위한 필수 항목인<br />서비스 이용약관과 개인정보 처리방침에 동의합니다.
          </span>
        </div>
      </div>
    </div>
  );
}
