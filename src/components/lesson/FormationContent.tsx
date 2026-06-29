import { useState } from 'react'
import naSvg from '@/assets/lesson/na.svg'
import clSvg from '@/assets/lesson/cl.svg'
import plusSvg from '@/assets/icons/+.svg'
import leftSvg from '@/assets/icons/left.svg'
import rightSvg from '@/assets/icons/right.svg'
import pinkDotSvg from '@/assets/lesson/pink_dot.svg'
import blueDotSvg from '@/assets/lesson/blue-dot.svg'
import arrowRightSvg from '@/assets/icons/arrow/right.svg'

interface StepData {
  label: string
  na: { electrons: number; shells: string[]; desc: string; hasDot: boolean }
  cl: { electrons: number; shells: string[]; desc: string; hasDot: boolean }
}

const STEPS: StepData[] = [
  {
    label: '원자 상태',
    na: { electrons: 11, shells: ['K=2', 'L=8', 'M=1'], desc: '최외각 1개 → 불안정', hasDot: true },
    cl: { electrons: 17, shells: ['K=2', 'L=8', 'M=7'], desc: '전자 1개 부족 → 불안정', hasDot: true },
  },
  {
    label: '전자 이동',
    na: { electrons: 11, shells: ['K=2', 'L=8', 'M=1'], desc: '최외각 전자 방출 중', hasDot: false },
    cl: { electrons: 17, shells: ['K=2', 'L=8', 'M=7'], desc: '전자 수용 중', hasDot: false },
  },
  {
    label: '이온 형성',
    na: { electrons: 10, shells: ['K=2', 'L=8'], desc: 'Na⁺ → 양이온', hasDot: false },
    cl: { electrons: 18, shells: ['K=2', 'L=8', 'M=8'], desc: 'Cl⁻ → 음이온', hasDot: true },
  },
  {
    label: '전하균형 완성',
    na: { electrons: 10, shells: ['K=2', 'L=8'], desc: 'Na⁺ (안정)', hasDot: false },
    cl: { electrons: 18, shells: ['K=2', 'L=8', 'M=8'], desc: 'Cl⁻ (안정)', hasDot: true },
  },
]

function ElectronDot({ color }: { color: string }) {
  return (
    <div style={{ width: 21.6, height: 21.6, position: 'relative', flexShrink: 0 }}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: color,
          opacity: 0.5,
          filter: 'blur(3.6px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 14.4,
          height: 14.4,
          top: 3.6,
          left: 3.6,
          borderRadius: '50%',
          background: color,
          opacity: 0.8,
          boxShadow: `0 0 14px 4px ${color}`,
        }}
      />
    </div>
  )
}

// Na 3시(0°) → top=43, left=96 / Cl 9시(180°, SVG boundary) → top=43, left=-10
function NaAtom({ hasDot }: { hasDot: boolean }) {
  return (
    <div className="relative w-[108px] h-[108px]" style={{ overflow: 'visible' }}>
      <img src={naSvg} alt="Na" className="w-full h-full object-contain" />
      {hasDot && (
        <div
          className="absolute inset-0"
          style={{ animation: 'dot-orbit 7s linear infinite', transformOrigin: 'center' }}
        >
          <div style={{ position: 'absolute', top: 43, left: 96 }}>
            <ElectronDot color="#ED66C2" />
          </div>
        </div>
      )}
    </div>
  )
}

function ClAtom({ hasDot }: { hasDot: boolean }) {
  return (
    <div className="relative w-[108px] h-[108px]" style={{ overflow: 'visible' }}>
      <img src={clSvg} alt="Cl" className="w-full h-full object-contain" />
      {hasDot && (
        <div
          className="absolute inset-0"
          style={{ animation: 'dot-orbit 7s linear infinite', transformOrigin: 'center' }}
        >
          <div style={{ position: 'absolute', top: 43, left: -10 }}>
            <ElectronDot color="#1AA0FB" />
          </div>
        </div>
      )}
    </div>
  )
}

interface AtomColumnProps {
  atom: 'na' | 'cl'
  electrons: number
  shells: string[]
  desc: string
  hasDot: boolean
}

function AtomColumn({ atom, electrons, shells, desc, hasDot }: AtomColumnProps) {
  const isNa = atom === 'na'
  const chipBg = isNa ? '#FDF0F9' : '#EAF0FF'
  const chipTextClass = isNa ? 'text-pink-500' : 'text-light-blue-500'

  return (
    <div className="flex flex-col items-center flex-1" style={{ gap: 36 }}>
      {isNa ? <NaAtom hasDot={hasDot} /> : <ClAtom hasDot={hasDot} />}
      <div className="flex flex-col items-center gap-[6px] w-full">
        <p className="text-label-lg font-normal text-text-normal" style={{ letterSpacing: '-0.005em' }}>
          전자 {electrons}개
        </p>
        <div
          className="w-full flex justify-center items-center gap-2 px-[6px] py-1 rounded-lg"
          style={{ background: chipBg }}
        >
          {shells.map((s) => (
            <span key={s} className={`text-label-sm ${chipTextClass}`} style={{ letterSpacing: '-0.005em' }}>
              {s}
            </span>
          ))}
        </div>
        <p className="text-label-lg font-normal text-text-normal text-center" style={{ letterSpacing: '-0.005em' }}>
          {desc}
        </p>
      </div>
    </div>
  )
}

export default function FormationContent() {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isFirst = step === 0
  const isLast = step === STEPS.length - 1

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-1">
          <h2 className="text-heading-md text-text-strong">이온 결합 형성 과정</h2>
          <p className="text-[14px] font-normal leading-[20px] tracking-[-0.005em] text-text-sub">NaCl(소금) 예시로 설명해 드릴게요!</p>
        </div>
        <div className="flex flex-col">
          <p className="text-body-md text-text-normal">
            소금은 나트륨(Na)과 염소(Cl)의 이온 결합으로 만들어집니다.
          </p>
          <p className="text-body-md text-text-normal">
            전자 하나가 이동하는 아래 과정을 단계별로 살펴보세요.
          </p>
        </div>
      </div>

      <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col items-center gap-6 w-full h-[340px] relative">
        <div
          className="flex items-center justify-center rounded-[6px] px-[6px] py-1 shrink-0"
          style={{ border: '1px solid #EAEBEE', height: 28 }}
        >
          <span className="text-label-lg font-semibold text-text-normal" style={{ letterSpacing: '-0.005em' }}>
            {current.label}
          </span>
        </div>

        <div className="flex-1 self-stretch w-full">
          {step === 0 && (
            <div className="h-full flex items-start px-6">
              <AtomColumn atom="na" electrons={current.na.electrons} shells={current.na.shells} desc={current.na.desc} hasDot={current.na.hasDot} />
              <div className="shrink-0" style={{ width: 43.2 }} />
              <AtomColumn atom="cl" electrons={current.cl.electrons} shells={current.cl.shells} desc={current.cl.desc} hasDot={current.cl.hasDot} />
            </div>
          )}
          {step === 1 && (
            <div className="h-full flex flex-col items-center justify-center gap-6">
              <div className="flex flex-row items-center justify-center gap-4">
                <img src={naSvg} alt="Na" width={108} height={108} />
                <img src={pinkDotSvg} alt="" width={10} height={10} />
                <img src={arrowRightSvg} alt="" width={24} height={24} style={{ filter: 'brightness(2.3)', opacity: 0.3 }} />
                <img src={arrowRightSvg} alt="" width={24} height={24} style={{ filter: 'brightness(2.3)', opacity: 0.6 }} />
                <img src={arrowRightSvg} alt="" width={24} height={24} style={{ filter: 'brightness(2.3)' }} />
                <img src={blueDotSvg} alt="" width={10} height={10} />
                <img src={clSvg} alt="Cl" width={108} height={108} />
              </div>
              <p className="text-[14px] font-normal leading-[20px] tracking-[-0.005em] text-text-strong text-center">
                전자 1개 이동
              </p>
            </div>
          )}
          {step === 2 && (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="flex flex-row items-start justify-center" style={{ gap: 40 }}>
                <div className="flex flex-col items-center" style={{ width: 108, gap: 24 }}>
                  <NaAtom hasDot={false} />
                  <div className="flex flex-col items-center w-full" style={{ gap: 6 }}>
                    <p className="text-label-lg font-normal text-text-normal" style={{ letterSpacing: '-0.005em' }}>전자 10개</p>
                    <div className="flex justify-center items-center px-[6px] py-1 rounded-lg" style={{ background: '#FDF0F9' }}>
                      <span className="text-label-sm text-pink-500" style={{ letterSpacing: '-0.005em' }}>+1 전하</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 shrink-0" style={{ height: 108 }}>
                  <img src={arrowRightSvg} alt="" width={24} height={24} style={{ transform: 'rotate(180deg)', filter: 'brightness(2.3)' }} />
                  <p className="text-[14px] font-normal leading-[20px] text-text-normal whitespace-nowrap" style={{ letterSpacing: '-0.005em' }}>정전기적 인력</p>
                  <img src={arrowRightSvg} alt="" width={24} height={24} style={{ filter: 'brightness(2.3)' }} />
                </div>
                <div className="flex flex-col items-center" style={{ width: 108, gap: 24 }}>
                  <ClAtom hasDot={false} />
                  <div className="flex flex-col items-center w-full" style={{ gap: 6 }}>
                    <p className="text-label-lg font-normal text-text-normal" style={{ letterSpacing: '-0.005em' }}>전자 18개</p>
                    <div className="flex justify-center items-center px-[6px] py-1 rounded-lg" style={{ background: '#EAF0FF' }}>
                      <span className="text-label-sm text-light-blue-500" style={{ letterSpacing: '-0.005em' }}>-1 전하</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {step >= 3 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-label-lg text-text-sub">{current.label}</p>
            </div>
          )}
        </div>

        {/* + 아이콘 - 카드 기준 정중앙 */}
        {step === 0 && (
          <img
            src={plusSvg}
            alt="+"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ width: 43.2, height: 43.2, filter: 'brightness(2.3)' }}
          />
        )}

        {/* 좌우 nav 버튼 - content 이후 DOM 순서 + z-10으로 클릭 보장 */}
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={isFirst}
          className="absolute left-6 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center z-10"
        >
          <img src={leftSvg} alt="이전" width={24} height={24} style={{ filter: isFirst ? 'brightness(2.87)' : 'none' }} />
        </button>
        <button
          type="button"
          onClick={() => setStep((s) => s + 1)}
          disabled={isLast}
          className="absolute right-6 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center z-10"
        >
          <img src={rightSvg} alt="다음" width={24} height={24} style={{ filter: isLast ? 'brightness(2.87)' : 'none' }} />
        </button>
      </div>
    </div>
  )
}
