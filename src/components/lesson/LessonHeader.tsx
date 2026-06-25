import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import LoginRequiredModal from '@/components/common/LoginRequiredModal'
import FreeLabModal from '@/components/lab/FreeLabModal'
import { logout } from '@/features/auth/api'
import homeSvg from '@/assets/Icon/home.svg'
import listSvg from '@/assets/Icon/list.svg'
import leftSvg from '@/assets/Icon/left.svg'
import rightSvg from '@/assets/Icon/right.svg'
import multiplySvg from '@/assets/Icon/multiply.svg'
import lockSvg from '@/assets/Icon/lock2.svg'
import { useAuthStore } from '@/stores/authStore'

const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_REST_API_KEY as string | undefined
const KAKAO_REDIRECT  = import.meta.env.VITE_KAKAO_REDIRECT_URI  as string | undefined

function handleKakaoLogin() {
  if (!KAKAO_CLIENT_ID || !KAKAO_REDIRECT) return
  sessionStorage.setItem('lab_redirect', window.location.pathname)
  const state = crypto.randomUUID()
  sessionStorage.setItem('kakao_oauth_state', state)
  const params = new URLSearchParams({
    client_id: KAKAO_CLIENT_ID,
    redirect_uri: KAKAO_REDIRECT,
    response_type: 'code',
    state,
  })
  window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`
}

interface LessonHeaderProps {
  lessonLabel: string
  lessonTitle: string
  progressWidth: string
  progressPercent: number
  showProgressBadge: boolean
  onCloseProgressBadge: () => void
  nextLesson?: { label: string; path: string }
  onListClick?: () => void
}

export default function LessonHeader({
  lessonLabel,
  lessonTitle,
  progressWidth,
  progressPercent,
  showProgressBadge,
  onCloseProgressBadge,
  nextLesson,
  onListClick,
}: LessonHeaderProps) {
  const navigate = useNavigate()
  const isLoggedIn = !!useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showFreeLabModal, setShowFreeLabModal] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try { await logout() } catch { /* 토큰 만료 등 무시 */ }
    clearAuth()
    navigate('/login')
  }

  return (
    <>
    {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
    {showFreeLabModal && <FreeLabModal onClose={() => setShowFreeLabModal(false)} />}
    <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-border-light">
      <div className="flex items-center justify-between px-10 h-[60px]">

        {/* 왼쪽 */}
        <div className="flex items-center gap-1 flex-1">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-neutral-10 transition-colors"
          >
            <img src={homeSvg} alt="" width={20} height={20} />
            <span className="text-label-xl font-semibold text-text-normal">홈</span>
          </button>
          <button
            type="button"
            onClick={onListClick}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-neutral-10 transition-colors"
          >
            <img src={listSvg} alt="" width={24} height={24} />
            <span className="text-label-xl font-semibold text-text-normal">학습 목록</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-neutral-10 transition-colors"
          >
            <img src={leftSvg} alt="" width={24} height={24} />
            <span className="text-label-xl font-semibold text-text-normal">이전</span>
          </button>
        </div>

        {/* 중앙 제목 */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-label-lg font-medium text-text-normal">{lessonLabel}</span>
          <span className="text-body-md font-medium text-text-strong">{lessonTitle}</span>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          {isLoggedIn ? (
            <div ref={profileRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setProfileOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-full border border-border-normal bg-white hover:bg-neutral-5 transition-colors"
              >
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt="" className="w-6 h-6 rounded-full object-cover border border-border-normal shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neutral-20 border border-border-normal shrink-0" />
                )}
                <span className="text-label-xl font-semibold text-text-sub whitespace-nowrap">
                  {user?.nickname ? `${user.nickname}님` : '프로필'}
                </span>
              </button>
              {profileOpen && (
                <div className="absolute right-0 top-[44px] w-[104px] bg-white border border-border-normal rounded-xl shadow-[0_0_8px_rgba(0,0,0,0.08)] py-2 z-50 flex flex-col">
                  {[
                    { label: '마이페이지', action: () => { navigate('/mypage'); setProfileOpen(false) } },
                    { label: '로그아웃', action: handleLogout },
                  ].map(({ label, action }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={action}
                      className="w-full py-2 text-[13px] font-medium text-text-normal text-center hover:bg-neutral-5 transition-colors"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="flex items-center px-3 py-2 h-[38px] rounded-full shrink-0 bg-[#FEE500] hover:opacity-90 transition-opacity"
            >
              <span className="text-label-xl font-semibold whitespace-nowrap text-[#191919]">
                카카오로 로그인
              </span>
            </button>
          )}
          <button
            type="button"
            onClick={() => { if (isLoggedIn) setShowFreeLabModal(true); else setShowLoginModal(true); }}
            className="flex items-center gap-1.5 h-[38px] px-2.5 py-1.5 rounded-lg border border-border-normal bg-neutral-5 text-label-xl font-semibold text-text-normal hover:bg-neutral-10 transition-colors"
          >
            {!isLoggedIn && <img src={lockSvg} alt="" width={10} height={10} />}
            자유 실험실
          </button>
          {nextLesson && (
            <button
              type="button"
              onClick={() => navigate(nextLesson.path)}
              className="flex items-center gap-1 h-[38px] px-2.5 py-1.5 rounded-lg border border-border-normal bg-neutral-5 text-label-xl font-semibold text-text-normal hover:bg-neutral-10 transition-colors"
            >
              {nextLesson.label}
              <img src={rightSvg} alt="" width={16} height={16} />
            </button>
          )}
        </div>
      </div>

      {/* 진행률 게이지 */}
      <div className="relative h-1 bg-neutral-10 w-full">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500 rounded-r transition-all duration-300"
          style={{ width: progressWidth }}
        />
        {showProgressBadge && (
          <div
            className="absolute top-2 flex items-center gap-1.5 bg-neutral-10 rounded-full px-2 py-1 transition-all duration-300"
            style={{
              left: `min(${progressWidth}, calc(100% - 110px))`,
            }}
          >
            <div className="flex items-center gap-0.5">
              <span className="text-label-sm font-medium text-text-normal">진행률</span>
              <span className="text-label-lg font-semibold text-blue-500">
                {String(progressPercent).padStart(2, '0')}
              </span>
              <span className="text-label-sm font-medium text-text-normal">%</span>
            </div>
            <button type="button" onClick={onCloseProgressBadge}>
              <img src={multiplySvg} alt="닫기" width={16} height={16} />
            </button>
          </div>
        )}
      </div>
    </header>
    </>
  )
}
