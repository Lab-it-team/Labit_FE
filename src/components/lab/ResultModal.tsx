import { useEffect, useId, useRef } from 'react';

interface ResultModalProps {
  type: 'correct' | 'wrong' | 'wrongCompound';
  formula: string;
  name: string;
  isLastProblem: boolean;
  onNext: () => void;
  onClose: () => void;
}

export default function ResultModal({ type, formula, name, isLastProblem, onNext, onClose }: ResultModalProps) {
  const isCorrect = type === 'correct';
  const titleId   = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    return () => { prev?.focus(); };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1000,
        background: 'rgba(0, 0, 0, 0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        style={{
          background: 'var(--color-static-white)',
          borderRadius: 20,
          padding: '40px 48px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
          width: 400,
          boxShadow: '0 8px 32px var(--color-shadow-popup)',
          outline: 'none',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon circle */}
        <div
          style={{
            width: 64, height: 64, borderRadius: '50%',
            background: isCorrect ? 'var(--color-primary-light)'
            : type === 'wrongCompound' ? 'var(--color-element-light-orange)'
            : 'var(--color-element-light-red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {isCorrect ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M5 13L9 17L19 7" stroke="var(--color-primary-normal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : type === 'wrongCompound' ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 8V13M12 16.5V17" stroke="var(--color-element-normal-orange)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M12 9V13M12 16.5V17" stroke="var(--color-element-normal-red)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          )}
        </div>

        {/* Text */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
          <span
            id={titleId}
            style={{
              fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 22,
              lineHeight: '30px', color: 'var(--color-text-strong)',
            }}
          >
            {isCorrect ? '정답이에요!'
              : type === 'wrongCompound' ? '전하는 맞지만 목표 화합물이 아니에요!'
              : '아직 완성되지 않았어요!'}
          </span>

          {isCorrect ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <span
                style={{
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 28,
                  color: 'var(--color-primary-normal)',
                }}
              >
                {formula}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)', fontSize: 14,
                  color: 'var(--color-text-sub)',
                }}
              >
                {name}
              </span>
            </div>
          ) : type === 'wrongCompound' ? (
            <span
              style={{
                fontFamily: 'var(--font-sans)', fontSize: 14,
                color: 'var(--color-text-sub)', lineHeight: '20px',
              }}
            >
              목표는 <strong style={{ color: 'var(--color-primary-normal)' }}>{formula}({name})</strong>이에요.<br />
              올바른 이온의 종류와 개수를 다시 확인해보세요!
            </span>
          ) : (
            <span
              style={{
                fontFamily: 'var(--font-sans)', fontSize: 14,
                color: 'var(--color-text-sub)', lineHeight: '20px',
              }}
            >
              양이온과 음이온의 전하 합이 0이 되도록<br />다시 맞춰보세요!
            </span>
          )}
        </div>

        {/* Button */}
        <button
          type="button"
          onClick={isCorrect ? onNext : onClose}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 6, padding: '10px 24px', height: 44,
            borderRadius: 10, border: 'none', cursor: 'pointer',
            background: isCorrect ? 'var(--color-primary-normal)' : 'var(--color-bg-elevate)',
            fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 15,
            color: isCorrect ? 'var(--color-text-light)' : 'var(--color-text-normal)',
          }}
        >
          {isCorrect
            ? isLastProblem ? '완료' : '다음 문제 풀기'
            : '다시 시도하기'}
          {isCorrect && !isLastProblem && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
