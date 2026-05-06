import { useNavigate } from "react-router";
import mascot from "@/assets/figma-export/mascot.png";
import logoSvg from "@/assets/figma-export/logo.svg";
import backIconSvg from "@/assets/figma-export/icon-back.svg";
import kakaoIconSvg from "@/assets/figma-export/kakao-icon.svg";

const kakaoAuthParams = new URLSearchParams({
  client_id: import.meta.env.VITE_KAKAO_REST_API_KEY ?? '',
  redirect_uri: import.meta.env.VITE_KAKAO_REDIRECT_URI ?? '',
  response_type: 'code',
})

const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?${kakaoAuthParams}`

export default function Login() {
  const navigate = useNavigate();

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  return (
    <div className="min-h-screen bg-bg-normal">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background: `
            radial-gradient(ellipse 48% 55% at 15% 35%, rgba(107,161,229,0.175) 0%, transparent 100%),
            radial-gradient(ellipse 48% 55% at 85% 65%, rgba(107,161,229,0.175) 0%, transparent 100%)
          `,
        }}
      />

      <header className="absolute left-0 right-0 top-0 z-20 flex h-15 items-center justify-between px-8">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-text-normal"
        >
          <img src={backIconSvg} alt="" width={24} height={24} />
          <span className="text-label-md font-medium">이전</span>
        </button>

        <button
          type="button"
          onClick={() => navigate("/")}
          className="text-label-md font-medium text-text-normal"
        >
          로그인 없이 둘러보기
        </button>
      </header>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-8">
        <div
          className="flex w-full max-w-[365px] flex-col items-center rounded-2xl bg-neutral-5 px-6 py-10"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
        >
          <img
            src={mascot}
            alt="Labit 마스코트"
            width={144}
            height={124}
            className="mb-8 object-contain"
          />

          <div className="mb-8 flex w-full flex-col items-center">
            <div className="mb-2 flex items-center gap-2">
              <img src={logoSvg} alt="Labit" width={68} height={22} />
              <span className="text-heading-md font-bold text-text-strong">
                시작하기
              </span>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-body-xs font-medium">
                <span className="text-blue-500">3초 만에 로그인</span>
                <span className="text-text-normal">하고,</span>
              </p>
              <p className="text-body-xs font-medium text-text-normal">
                모든 기능을 제한 없이 즐겨보세요!
              </p>
            </div>
          </div>

          <div className="flex w-full flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="flex h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border-0 bg-[#FEE500] text-label-xl font-semibold text-[#181600]"
            >
              <img src={kakaoIconSvg} alt="" width={20} height={20} />
              카카오로 시작하기
            </button>

            <p
              className="text-center text-neutral-50"
              style={{ fontSize: 11, fontWeight: 400, lineHeight: "18px" }}
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
