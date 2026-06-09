import { useNavigate } from "react-router";
import mascot from "@/assets/Icon/mascot.png";
import logoSvg from "@/assets/Icon/logo.svg";
import backIconSvg from "@/assets/Icon/icon-back.svg";
import kakaoIconSvg from "@/assets/Icon/kakao-icon.svg";
import decoWater from "@/assets/Icon/deco-water.svg";
import decoFlask from "@/assets/Icon/deco-flask.svg";
import decoMoleculeRight from "@/assets/Icon/deco-molecule-right.svg";
import decoMoleculeBottom from "@/assets/Icon/deco-molecule-bottom.svg";
import decoLines from "@/assets/Icon/deco-lines.svg";
import decoLines2 from "@/assets/Icon/deco-line-2.svg"
import decoDotBlue from "@/assets/Icon/deco-dot-blue.svg";
import decoDotYellow from "@/assets/Icon/deco-dot-yellow.svg";

interface DecoProps {
  src: string;
  left: string;
  top: string;
  width: string | number;
  height?: string | number;
  rotate?: number;
  opacity?: number;
  animation: string;
  dur: string;
  delay: string;
}

function Deco({ src, left, top, width, height, rotate = 0, opacity = 1, animation, dur, delay }: DecoProps) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        left,
        top,
        width,
        ...(height != null && { height }),
        opacity,
        pointerEvents: "none",
        animation: `${animation} ${dur} ${delay} ease-in-out infinite`,
        transformOrigin: "center center",
      }}
    >
      <img
        src={src}
        alt=""
        style={{
          width: "100%",
          height: height != null ? "100%" : "auto",
          transform: `rotate(${rotate}deg)`,
          display: "block",
        }}
      />
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
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
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: `
          radial-gradient(110.08% 63.09% at 50% 34.75%, #F6F9FC 0%, rgba(255,255,255,0.4) 15.08%, #E9EFFE 100%),
          var(--color-neutral-10)
        `,
      }}
    >
      {/* deco-water — 좌중단 */}
      <Deco
        src={decoWater}
        left="6%" top="26%"
        width="clamp(44px, 5.2vw, 90px)"
        rotate={22}
        animation="deco-float-b" dur="7.2s" delay="0s"
      />

      {/* deco-flask — 우상단 */}
      <Deco
        src={decoFlask}
        left="80%" top="20%"
        width="clamp(40px, 4.9vw, 85px)"
        rotate={10}
        animation="deco-float-a" dur="8.5s" delay="-1.4s"
      />

      {/* deco-lines — 좌상단 */}
      <Deco
        src={decoLines2}
        left="20%" top="15%"
        width="clamp(180px, 23.2vw, 400px)"
        opacity={0.6}
        animation="deco-float-b" dur="9.5s" delay="-7s"
      />

      {/* deco-lines — 우하단 */}
      <Deco
        src={decoLines}
        left="70%" top="60%"
        width="clamp(180px, 23.1vw, 400px)"
        animation="deco-float-a" dur="10s" delay="-5s"
      />

      {/* deco-molecule-right — 우중단 */}
      <Deco
        src={decoMoleculeRight}
        left="61%" top="32%"
        width="clamp(64px, 8.3vw, 140px)"
        height="clamp(165px, 21.5vw, 360px)"
        animation="deco-float-d" dur="11s" delay="-0.7s"
      />

      {/* deco-molecule-bottom — 좌하단 (height 명시로 박스 확정) */}
      <Deco
        src={decoMoleculeBottom}
        left="0%" top="55%"
        width="clamp(180px, 22.9vw, 380px)"
        height="clamp(200px, 25.4vw, 422px)"
        animation="deco-float-c" dur="9.8s" delay="-3.5s"
      />

      {/* deco-dot-blue — 좌상단 */}
      <Deco
        src={decoDotBlue}
        left="15%" top="8%"
        width="clamp(38px, 4.2vw, 72px)"
        animation="deco-float-b" dur="6.8s" delay="-2.3s"
      />
      {/* deco-dot-blue — 우상단 */}
      <Deco
        src={decoDotBlue}
        left="87%" top="25%"
        width="clamp(38px, 4.2vw, 72px)"
        animation="deco-float-c" dur="8s" delay="-4.1s"
      />

      {/* deco-dot-yellow — 좌하단 */}
      <Deco
        src={decoDotYellow}
        left="25%" top="55%"
        width="clamp(38px, 4.2vw, 72px)"
        animation="deco-float-a" dur="9.3s" delay="-6s"
      />
      {/* deco-dot-yellow — 우하단 */}
      <Deco
        src={decoDotYellow}
        left="90%" top="65%"
        width="clamp(38px, 4.2vw, 72px)"
        animation="deco-float-d" dur="7.5s" delay="-1s"
      />

      <header
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          zIndex: 20,
          display: "flex",
          height: 60,
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          backdropFilter: "blur(2px)",
        }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "none", border: "none", cursor: "pointer",
            padding: "8px 10px", borderRadius: 8,
          }}
        >
          <img src={backIconSvg} alt="" width={24} height={24} />
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.005em", color: "var(--color-text-normal)" }}>이전</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/ionic-concept")}
          style={{
            fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em",
            background: "none", border: "none", cursor: "pointer",
            color: "var(--color-text-normal)", padding: "6px 8px", borderRadius: 8,
          }}
        >
          로그인 없이 둘러보기
        </button>
      </header>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 32px",
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "min(365px, calc(100vw - 64px))",
            padding: "60px 24px",
            gap: 24,
            background: "var(--color-bg-opacity-light95)",
            border: "1px solid #CBD7FB",
            boxShadow: "0 0 100px #E9EFFE",
            backdropFilter: "blur(2px)",
            borderRadius: 24,
          }}
        >
          <img
            src={mascot}
            alt="Labit 마스코트"
            width={144}
            height={124}
            style={{ objectFit: "contain" }}
          />

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "100%", gap: 8 }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", gap: 8 }}>
              <img src={logoSvg} alt="Labit" width={68} height={22} />
              <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, lineHeight: "30px", textAlign: "center", color: "var(--color-text-strong)" }}>
                시작하기
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
              <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start" }}>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-primary)" }}>3초 만에 로그인</span>
                <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-normal)" }}>하고,</span>
              </div>
              <p style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "24px", letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-normal)", margin: 0 }}>
                모든 기능을 제한 없이 즐겨보세요!
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", gap: 16 }}>
            <button
              type="button"
              onClick={handleKakaoLogin}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                padding: "12px 20px",
                gap: 4,
                width: "100%",
                height: 46,
                cursor: "pointer",
                borderRadius: 12,
                border: "none",
                background: "#FEE500",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: 15,
                lineHeight: "22px",
                letterSpacing: "-0.005em",
                color: "#181600",
              }}
            >
              <img src={kakaoIconSvg} alt="" width={20} height={20} />
              카카오로 시작하기
            </button>

            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
                fontSize: 11,
                lineHeight: "16px",
                letterSpacing: "-0.005em",
                color: "var(--color-text-sub)",
                textAlign: "center",
                margin: 0,
              }}
            >
              계정 생성 시 서비스 이용을 위한 필수 항목인
              <br />
              서비스 이용약관과 개인정보 처리방침에 동의합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

