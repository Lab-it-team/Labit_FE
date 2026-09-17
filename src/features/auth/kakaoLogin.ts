const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY as string | undefined;
const KAKAO_REDIRECT = import.meta.env.VITE_KAKAO_REDIRECT_URI as string | undefined;

export const kakaoConfigReady = Boolean(KAKAO_CLIENT_ID && KAKAO_REDIRECT);

export function startKakaoLogin(redirectTo?: string, storagePrefix?: string): void {
  if (!kakaoConfigReady) {
    console.warn("카카오 로그인 환경 변수가 설정되지 않았습니다.");
    return;
  }
  if (redirectTo !== undefined) {
    sessionStorage.setItem("lab_redirect", redirectTo);
  } else {
    sessionStorage.removeItem("lab_redirect");
  }
  // 실습 화면에서 시작한 로그인이 아니면, 이전에 중단된 실습 로그인의 접두사가 남아 있지 않도록 정리한다
  if (storagePrefix !== undefined) {
    sessionStorage.setItem("kakao_login_storage_prefix", storagePrefix);
  } else {
    sessionStorage.removeItem("kakao_login_storage_prefix");
  }
  const state =
    typeof crypto.randomUUID === "function" ? crypto.randomUUID() : String(Date.now());
  sessionStorage.setItem("kakao_oauth_state", state);
  const params = new URLSearchParams({
    client_id: KAKAO_CLIENT_ID!,
    redirect_uri: KAKAO_REDIRECT!,
    response_type: "code",
    state,
  });
  window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
}
