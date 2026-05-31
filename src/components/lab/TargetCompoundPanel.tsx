interface TargetCompoundPanelProps {
  formula: string;
  name: string;
  cationSum: number;
  anionSum: number;
  totalCharge: number;
  isCorrect: boolean;
  hasInput: boolean;
}

export default function TargetCompoundPanel({
  formula,
  name,
  cationSum,
  anionSum,
  totalCharge,
  isCorrect,
  hasInput,
}: TargetCompoundPanelProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '16px 0',
        gap: 12,
        width: 900,
        height: 137,
        background: 'var(--color-bg-elevate)',
        borderRadius: 12,
        alignSelf: 'stretch',
        flexShrink: 0,
      }}
    >
      {/* 좌측: 목표 화합물 */}
      <div
        style={{
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '12px 60px',
          gap: 8,
          width: 193,
          height: 105,
          borderRight: '1px solid var(--color-border-strong)',
          flexShrink: 0,
        }}
      >
        <span className="text-body-md font-medium text-text-normal whitespace-nowrap">
          목표 화합물
        </span>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            width: 65,
            height: 48,
          }}
        >
          <span className="font-display text-content-xl text-text-strong whitespace-nowrap">
            {formula}
          </span>
          <span className="text-caption-lg text-text-normal text-center whitespace-nowrap">
            {name}
          </span>
        </div>
      </div>

      {/* 우측: 전하 계산 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 60px',
          gap: 0,
          width: 468,
          height: 105,
          flexShrink: 0,
        }}
      >
        <CalcColumn value={cationSum}   label="양이온 합" active={cationSum !== 0} hasAnyInput={hasInput} highlight={false} activeColor="var(--color-pink-500)" />
        <OpIcon type="plus" />
        <CalcColumn value={-anionSum}   label="음이온 합" active={anionSum !== 0}  hasAnyInput={hasInput} highlight={false} activeColor="var(--color-light-blue-500)" />
        <OpIcon type="equals" />
        <CalcColumn value={totalCharge} label="전하 합"   active={hasInput}        hasAnyInput={hasInput} highlight={isCorrect} activeColor="var(--color-text-strong)" />
      </div>
    </div>
  );
}

function OpIcon({ type }: { type: 'plus' | 'equals' }) {
  return (
    <div style={{ width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {type === 'plus' ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="11" y="4"  width="2" height="16" rx="1" fill="var(--color-fill-grey)" />
          <rect x="4"  y="11" width="16" height="2"  rx="1" fill="var(--color-fill-grey)" />
        </svg>
      ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="9"  width="16" height="2" rx="1" fill="var(--color-fill-grey)" />
          <rect x="4" y="13" width="16" height="2" rx="1" fill="var(--color-fill-grey)" />
        </svg>
      )}
    </div>
  );
}

function CalcColumn({ value, label, active, hasAnyInput, highlight, activeColor = 'var(--color-text-strong)' }: {
  value: number;
  label: string;
  active: boolean;
  hasAnyInput: boolean;
  highlight: boolean;
  activeColor?: string;
}) {
  const numColor = highlight    ? 'var(--color-primary-normal)'
    : active                    ? activeColor
    : hasAnyInput               ? 'var(--color-text-strong)'
    :                             'var(--color-text-disabled)';

  const display = value === 0 ? '0' : value > 0 ? `+${value}` : `${value}`;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        width: 100,
        height: 105,
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: 'Pretendard, sans-serif',
          fontWeight: 700,
          fontSize: 32,
          lineHeight: '40px',
          color: numColor,
          transition: 'color 0.2s',
        }}
      >
        {display}
      </span>
      <span className="text-body-xxs text-text-normal text-center">
        {label}
      </span>
    </div>
  );
}
