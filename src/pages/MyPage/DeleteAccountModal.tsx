import { useState } from 'react'
import { useNavigate } from 'react-router'
import closeSvg from '@/assets/icons/close.svg'
import mascotPng from '@/assets/mascot/labit_peeking.png'
import { deleteAccount } from '@/features/auth/api'
import { useAuthStore } from '@/stores/authStore'

const REASONS = [
  '학습 콘텐츠가 부족해요',
  '사용법이 어려워요',
  '다른 학습 서비스를 사용하고 있어요',
  '오류나 불편한 점이 많아요',
  '자주 사용하지 않아요',
  '기타',
]

const REASON_TYPES = [
  'CONTENT_INSUFFICIENT',
  'DIFFICULT_TO_USE',
  'FOUND_ALTERNATIVE',
  'BUGS_OR_INCONVENIENCE',
  'RARELY_USE',
  'OTHER',
] as const

const DELETE_ITEMS = [
  '프로필 (닉네임, 아바타)',
  '학습 진행률 및 풀이 기록',
  'AI 도우미와 나눈 대화 내역',
  '퀴즈 점수와 오답 노트',
]

interface Props {
  onClose: () => void
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-[441px] flex-col gap-6 rounded-3xl bg-neutral-5 p-6 shadow-[0_0_100px_rgba(78,79,82,0.18)]">
      {children}
    </div>
  )
}

function CloseRow({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex justify-end">
      <button type="button" onClick={onClose} className="flex h-6 w-6 items-center justify-center">
        <img src={closeSvg} alt="닫기" width={24} height={24} />
      </button>
    </div>
  )
}

function PrimaryBtn({ onClick, disabled, children }: { onClick?: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-[42px] flex-1 items-center justify-center rounded-xl bg-primary-normal text-label-xl font-semibold text-static-white transition-colors hover:bg-primary-strong disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function GhostBtn({ onClick, children }: { onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[42px] flex-1 items-center justify-center rounded-xl border border-border-normal bg-neutral-5 text-label-xl font-semibold text-text-normal transition-colors hover:bg-neutral-15"
    >
      {children}
    </button>
  )
}

export default function DeleteAccountModal({ onClose }: Props) {
  const navigate = useNavigate()
  const clearAuth = useAuthStore((s) => s.clearAuth)

  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<number | null>(null)
  const [detail, setDetail] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)

  const toggle = (i: number) =>
    setSelected((prev) => (prev === i ? null : i))

  const handleDelete = async () => {
    if (confirmText !== '회원 탈퇴') return
    setDeleting(true)
    try {
      const reasonType = selected !== null ? REASON_TYPES[selected] : 'OTHER'
      await deleteAccount({ reason_type: reasonType, reason_detail: detail || undefined, confirm_text: confirmText })
      clearAuth()
      setStep(4)
    } catch {
      /* 오류 무시 */
    } finally {
      setDeleting(false)
    }
  }

  if (step === 1) return (
    <Card>
      {/* 닫기 버튼 */}
      <CloseRow onClose={onClose} />

      {/* Frame 487: 이미지 + 체크박스 (gap: 16px) */}
      <div className="flex flex-col gap-4">
        {/* Frame 485: 이미지 + 헤딩 (gap: 8px) */}
        <div className="flex flex-col gap-2">
          <img src={mascotPng} alt="" width={140} height={90} className="object-cover" style={{ objectPosition: 'left bottom', marginTop: -32, marginLeft: -23 }} />
          <div className="flex flex-col gap-2" style={{ marginTop: -25 }}>
            <h2 className="text-heading-md font-bold text-text-strong">정말 떠나시나요?</h2>
            <div className="flex items-center gap-1">
              <span className="text-body-xxs font-normal text-text-normal">떠나시는 이유를 알려주세요.</span>
              <span className="text-caption-sm font-normal text-text-sub">(하나 선택)</span>
            </div>
          </div>
        </div>

        {/* Frame 484: 체크박스 목록 (gap: 4px) */}
        <div className="flex flex-col gap-1">
          {REASONS.map((reason, i) => {
            const checked = selected === i
            return (
              <button
                key={i}
                type="button"
                onClick={() => toggle(i)}
                className="flex items-center gap-2 p-1.5 text-left"
              >
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] border-2 transition-colors ${checked ? 'border-primary-normal bg-primary-normal' : 'border-neutral-40 bg-static-white'}`}>
                  {checked && (
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                      <path d="M1 5L5.5 9L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className={`text-body-xxs font-normal ${checked ? 'text-primary-normal' : 'text-text-normal'}`}>
                  {reason}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Frame 490: 선택 입력 (gap: 12px) */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-1">
          <span className="text-caption-lg font-normal text-text-normal">
            Labit을 떠나는 이유를 자세히 알려주시겠어요?
          </span>
          <span className="text-caption-sm font-normal text-text-sub">(선택)</span>
        </div>
        <input
          type="text"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="내용을 입력해 주세요."
          className="h-[38px] w-full rounded-xl border border-border-strong bg-neutral-5 px-3 text-label-md font-medium text-text-normal outline-none placeholder:text-text-sub"
        />
      </div>

      {/* Frame 456: 버튼 (gap: 4px) */}
      <div className="flex gap-1">
        <PrimaryBtn onClick={onClose}>취소</PrimaryBtn>
        <GhostBtn onClick={() => setStep(2)}>계속하기</GhostBtn>
      </div>
    </Card>
  )

  if (step === 2) return (
    <Card>
      <CloseRow onClose={onClose} />

      <div className="flex flex-col gap-2">
        <h2 className="text-heading-md font-bold text-text-strong">탈퇴 전에 꼭 확인해 주세요</h2>
        <p className="text-caption-lg font-normal text-text-normal">
          탈퇴하시면 아래 정보가 모두 사라지며,<br />되돌릴 수 없습니다.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 rounded-xl border border-primary-normal bg-neutral-10 p-3 shadow-[0_0_6px_#A2B8F9]">
          <span className="text-caption-lg font-normal text-text-sub">삭제되는 정보</span>
          <div className="flex flex-col gap-1.5">
            {DELETE_ITEMS.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 text-primary-normal">
                  <path d="M4 10.5L8.5 15L16 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-body-xxs font-normal text-text-normal">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[11px] leading-4 tracking-[-0.005em] text-text-sub">
          · 동일한 카카오 계정으로 다시 가입할 수는 있지만, 지난 기록은 복구되지 않습니다.
        </p>
      </div>

      <div className="flex gap-1">
        <PrimaryBtn onClick={() => setStep(1)}>뒤로가기</PrimaryBtn>
        <GhostBtn onClick={() => setStep(3)}>계속하기</GhostBtn>
      </div>
    </Card>
  )

  if (step === 3) return (
    <Card>
      <CloseRow onClose={onClose} />
      <div className="flex flex-col gap-2">
        <h2 className="text-heading-md font-bold text-text-strong">마지막 확인이에요</h2>
        <p className="text-caption-lg font-normal text-text-normal">
          탈퇴를 진행하시려면 아래 문구를 직접 입력해주세요.
        </p>
      </div>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder="회원 탈퇴"
        className="h-[38px] w-full rounded-xl border border-border-strong bg-neutral-5 px-3 text-label-md font-medium text-text-normal outline-none placeholder:text-text-sub"
      />
      <div className="flex gap-1">
        <GhostBtn onClick={onClose}>취소</GhostBtn>
        <button
          type="button"
          onClick={handleDelete}
          disabled={confirmText !== '회원 탈퇴' || deleting}
          className="flex h-[42px] flex-1 items-center justify-center rounded-xl bg-status-negative text-label-xl font-semibold text-static-white transition-colors hover:opacity-90 disabled:opacity-40"
        >
          탈퇴하기
        </button>
      </div>
    </Card>
  )

  return (
    <Card>
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-center text-heading-md font-bold text-text-strong">
            회원 탈퇴가 완료되었습니다.
          </h2>
          <p className="text-center text-caption-lg font-normal text-text-normal">
            지금까지 Labit과 함께해 주셔서 감사합니다.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="flex h-[42px] w-full items-center justify-center rounded-xl bg-neutral-15 text-label-xl font-semibold text-text-normal transition-colors hover:bg-neutral-20"
        >
          로그인으로 이동
        </button>
      </div>
    </Card>
  )
}
