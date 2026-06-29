import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import logoFullSvg from "@/assets/brand/logo-full.svg";
import leftSvg from "@/assets/icons/left.svg";
import pencilFilledSvg from "@/assets/icons/pencil-filled.svg";
import kakaoIconSvg from "@/assets/brand/kakao.svg";
import chatBubbleSvg from "@/assets/icons/chat-bubble.svg";
import logoutSvg from "@/assets/icons/logout.svg";
import ProfileButton from "@/components/layout/ProfileButton";
import { useMe } from "@/queries/user";
import { useAuthStore } from "@/stores/authStore";
import { updateProfile, getPresignedUrl, logout } from "@/features/auth/api";
import DeleteAccountModal from "./DeleteAccountModal";

export default function MyPage() {
  const navigate = useNavigate();
  const { data: me, refetch } = useMe();
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [editingNickname, setEditingNickname] = useState(false);
  const [nicknameInput, setNicknameInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveNickname = async () => {
    if (!nicknameInput.trim()) return;
    setSaving(true);
    try {
      await updateProfile({ nickname: nicknameInput.trim() });
      const { data: updated } = await refetch();
      setUser({ nickname: nicknameInput.trim(), profileImageUrl: updated?.profile_image ?? null });
      setEditingNickname(false);
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { upload_url, public_url } = await getPresignedUrl(file.type);
      await fetch(upload_url, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      await updateProfile({ profile_image: public_url });
      const { data: updated } = await refetch();
      setUser({ nickname: updated?.nickname ?? "", profileImageUrl: public_url });
    } catch {
      /* 업로드 실패 시 무시 */
    }
    e.target.value = "";
  };

  const formatDate = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}년 ${month}월 ${day}일`;
  };

  const handleLogout = async () => {
    try { await logout(); } catch { /* 토큰 만료 등 무시 */ }
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen flex-col bg-static-white">
      {/* 메인 헤더 */}
      <header className="fixed left-0 right-0 top-0 z-10 flex h-[60px] items-center justify-between border-b border-border-normal bg-static-white px-10">
        <button type="button" onClick={() => navigate('/home')} className="flex items-center">
          <img src={logoFullSvg} alt="Labit" />
        </button>
        <ProfileButton />
      </header>

      {/* 서브 헤더 */}
      <div className="mt-[60px] flex h-[62px] items-center bg-neutral-5 px-10">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="flex items-center gap-1 rounded-lg px-[10px] py-2 transition-colors hover:bg-neutral-15"
        >
          <img src={leftSvg} alt="" width={24} height={24} />
          <span className="text-label-xl font-semibold text-text-normal whitespace-nowrap">
            홈으로 돌아가기
          </span>
        </button>
      </div>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 bg-neutral-5 px-[270px] py-[60px] flex flex-col gap-[60px]">
        {/* 헤드라인 */}
        <div className="flex flex-col gap-2">
          <h1 className="text-heading-md font-bold text-text-strong">마이페이지</h1>
          <p className="text-body-md font-medium text-text-normal">
            프로필과 계정 정보를 관리할 수 있습니다.
          </p>
        </div>

        {/* 카드 영역 */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col gap-6 w-full rounded-xl border border-border-strong bg-static-white p-6">

            {/* 로그인 정보 */}
            <div className="flex flex-col gap-3 pb-6 border-b border-border-normal">
              <span className="text-body-md font-medium text-text-normal">로그인 정보</span>
              <div className="flex items-center gap-1">
                <img src={kakaoIconSvg} alt="카카오" width={16} height={16} />
                <span className="text-caption-sm font-normal text-text-sub">{me?.email}</span>
              </div>
              <div className="flex w-full flex-col gap-1.5 rounded-xl bg-neutral-5 p-3">
                <span className="text-caption-sm font-normal text-text-sub">가입일</span>
                <span className="text-caption-lg font-normal text-text-normal">
                  {formatDate(me?.created_at)}
                  
                </span>
              </div>

            </div>

            {/* 프로필 정보 */}
            <div className="flex flex-col gap-3 pb-6 border-b border-border-normal">
              <span className="text-body-md font-medium text-text-normal">프로필 정보</span>
              <div className="flex items-center gap-3">
                {/* 프로필 이미지 */}
                <div className="relative w-[74px] h-[74px] shrink-0">
                  {me?.profile_image ? (
                    <img
                      src={me.profile_image}
                      alt="프로필"
                      className="w-full h-full rounded-full object-cover border border-border-normal"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-neutral-25 border border-border-normal" />
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute left-[50px] top-[50px]"
                  >
                    <img src={pencilFilledSvg} alt="" width={24} height={24} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfileImageChange}
                  />
                </div>

                {/* 닉네임 */}
                <div>
                  {!editingNickname ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-body-xl font-medium text-text-strong">
                        {me?.nickname}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setNicknameInput(me?.nickname ?? ""); setEditingNickname(true); }}
                        className="h-[38px] w-[46px] rounded-xl bg-neutral-15 text-label-xl font-semibold text-text-normal transition-colors hover:bg-neutral-20"
                      >
                        변경
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={nicknameInput}
                        onChange={(e) => setNicknameInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSaveNickname();
                          if (e.key === "Escape") setEditingNickname(false);
                        }}
                        autoFocus
                        className="h-[38px] w-[200px] rounded-2xl border border-primary-normal bg-static-white px-3 py-2 text-label-md font-medium text-text-normal outline-none"
                      />
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleSaveNickname}
                          disabled={saving || !nicknameInput.trim()}
                          className="h-[38px] w-[46px] rounded-2xl bg-primary-normal text-label-xl font-semibold text-static-white transition-colors hover:bg-primary-strong disabled:opacity-50"
                        >
                          저장
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingNickname(false)}
                          className="h-[38px] w-[46px] rounded-2xl bg-neutral-15 text-label-xl font-semibold text-text-normal transition-colors hover:bg-neutral-20"
                        >
                          취소
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 액션 행 */}
            <div className="flex flex-col gap-6">
              <button type="button" className="flex items-center gap-2 text-left">
                <img src={chatBubbleSvg} alt="" width={24} height={24} className="shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-body-xs font-medium text-text-strong">1:1 문의</span>
                  <span className="text-caption-sm font-normal text-text-sub">
                    궁금한 점이나 오류를 알려 주세요.
                  </span>
                </div>
              </button>

              <button type="button" onClick={handleLogout} className="flex items-center gap-2 text-left">
                <img src={logoutSvg} alt="" width={24} height={24} className="shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-body-xs font-medium text-text-strong">로그아웃</span>
                  <span className="text-caption-sm font-normal text-text-sub">
                    현재 기기에서 로그아웃됩니다.
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 회원탈퇴 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="text-caption-sm font-normal text-text-sub underline"
            >
              회원탈퇴
            </button>
          </div>
        </div>
      </main>

      {/* 회원탈퇴 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        </div>
      )}
    </div>
  );
}
