import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/stores/authStore'
import { logout } from '@/features/auth/api'

export default function ProfileButton() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clearAuth = useAuthStore((s) => s.clearAuth)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try { await logout() } catch { /* 토큰 만료 등 무시 */ }
    clearAuth()
    const LAB_SESSION_KEYS = [
      'lab_placed_pieces',
      'lab_solved_problems',
      'lab_current_problem',
      'lab_redirect',
      'lab_pre_login_placed_pieces',
      'lab_pre_login_solved_problems',
      'kakao_oauth_state',
    ]
    LAB_SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key))
    navigate('/login')
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '8px 12px',
          gap: 8,
          height: 40,
          background: 'var(--color-static-white)',
          border: '1px solid var(--color-border-strong)',
          borderRadius: 24,
          cursor: 'pointer',
          isolation: 'isolate',
        }}
      >
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            style={{
              width: 24,
              height: 24,
              minWidth: 24,
              borderRadius: '50%',
              border: '1px solid var(--color-border-normal)',
              flexShrink: 0,
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{ width: 24, height: 24, minWidth: 24, borderRadius: '50%', border: '1px solid var(--color-border-normal)', background: 'var(--color-bg-elevate)', flexShrink: 0 }} />
        )}
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 600,
          fontSize: 15,
          lineHeight: '22px',
          letterSpacing: '-0.005em',
          color: 'var(--color-text-sub)',
          whiteSpace: 'nowrap',
        }}>
          {user?.nickname ? `${user.nickname}님` : '프로필'}
        </span>
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          right: 0,
          top: 44,
          width: 104,
          background: 'var(--color-static-white)',
          border: '1px solid var(--color-border-strong)',
          boxShadow: '0px 0px 8px var(--color-shadow-popup)',
          borderRadius: 12,
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          zIndex: 100,
        }}>
          {[
            { label: '마이페이지', action: () => { navigate('/mypage'); setOpen(false) } },
            { label: '로그아웃', action: handleLogout },
          ].map(({ label, action }) => (
            <button
              key={label}
              type="button"
              onClick={action}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '6px 8px',
                width: '100%',
                height: 32,
                borderRadius: 8,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                fontWeight: 500,
                fontSize: 13,
                lineHeight: '18px',
                letterSpacing: '-0.005em',
                color: 'var(--color-text-normal)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-bg-elevate)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
