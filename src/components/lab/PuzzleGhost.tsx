import type { Ion } from '@/data/ions';
import { getPuzzlePath, cardHeight, ionColor } from '@/components/lab/puzzlePaths';

export default function PuzzleGhost({ ion }: { ion: Ion }) {
  const h     = cardHeight(ion);
  const color = ionColor(ion);
  const path  = getPuzzlePath(ion);

  const isOnePlus = ion.type === 'plus' && ion.charge === 1;
  const isAnion   = ion.type === 'minus';
  const contentLeft = isAnion ? '60%' : isOnePlus ? 'calc(50% - 4.5px)' : 'calc(50% - 8px)';
  const contentTop  = isOnePlus ? 'calc(50% + 3px)' : '50%';

  return (
    <div style={{ position: 'relative', width: 120, height: h, cursor: 'grabbing' }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 121 ${h + 1}`}
        preserveAspectRatio="none"
        fill="none"
        style={{
          position: 'absolute',
          inset: 0,
          filter: `drop-shadow(0 0 16px ${color})`,
          overflow: 'visible',
        }}
      >
        <path d={path} fill={color} />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: contentLeft,
          top: contentTop,
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: 32, lineHeight: '28px', letterSpacing: '-0.01em', color: 'var(--color-static-white)', whiteSpace: 'nowrap' }}>
          {ion.symbol}
          <sup style={{ fontSize: 16, verticalAlign: 'super', lineHeight: 0 }}>{ion.superscript}</sup>
        </span>
        <span style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 500, fontSize: 12, color: 'var(--color-static-white)', whiteSpace: 'nowrap' }}>
          {ion.name}
        </span>
      </div>
    </div>
  );
}
