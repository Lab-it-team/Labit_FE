import { ION_COLOR, ION_TINT, getIonColorKey } from '@/data/ions';
import type { Ion } from '@/data/ions';
import { getPuzzlePath as getDefaultPuzzlePath } from '@/components/lab/puzzlePaths';

export type PieceSize = 'default' | 'small';
export type PieceInteraction = 'default' | 'hovered' | 'pressed' | 'dragging' | 'placed' | 'vacant' | 'removable';

interface PieceDims {
  w: number; h: number;
  R: number; NR: number; ND: number; NH: number;
}

const DIMS: Record<PieceSize, Omit<PieceDims, 'h'>> = {
  default: { w: 120, R: 4, NR: 4, ND: 20, NH: 19 },
  small:   { w: 90,  R: 3, NR: 3, ND: 15, NH: 14.25 },
};

const HEIGHTS: Record<PieceSize, Record<1 | 2 | 3, number>> = {
  default: { 1: 100, 2: 200, 3: 300 },
  small:   { 1: 75,  2: 97,  3: 120 },
};

function k(r: number) { return r * 0.5523; }

function getPlusPath({ w, h, R, NR, ND, NH }: PieceDims): string {
  const c = h / 2;
  const [n1, n2] = [c - NH, c + NH];
  const [kr, kn] = [k(R), k(NR)];
  return [
    `M ${w - R} 0`,
    `C ${w - R + kr} 0 ${w} ${R - kr} ${w} ${R}`,
    `V ${n1}`,
    `C ${w} ${n1 + kn} ${w - NR + kn} ${n1 + NR} ${w - NR} ${n1 + NR}`,
    `H ${w - ND + NR}`,
    `C ${w - ND + NR - kn} ${n1 + NR} ${w - ND} ${n1 + 2 * NR - kn} ${w - ND} ${n1 + 2 * NR}`,
    `V ${n2 - 2 * NR}`,
    `C ${w - ND} ${n2 - 2 * NR + kn} ${w - ND + NR - kn} ${n2 - NR} ${w - ND + NR} ${n2 - NR}`,
    `H ${w - NR}`,
    `C ${w - NR + kn} ${n2 - NR} ${w} ${n2 - kn} ${w} ${n2}`,
    `V ${h - R}`,
    `C ${w} ${h - R + kr} ${w - R + kr} ${h} ${w - R} ${h}`,
    `H ${R} C ${R - kr} ${h} 0 ${h - R + kr} 0 ${h - R}`,
    `V ${R} C 0 ${R - kr} ${R - kr} 0 ${R} 0`,
    `H ${w - R} Z`,
  ].join(' ');
}

function getMinusPath({ w, h, R, NR, ND, NH }: PieceDims): string {
  const c = h / 2;
  const [n1, n2] = [c - NH, c + NH];
  const [kr, kn] = [k(R), k(NR)];
  return [
    `M ${ND + R} 0`,
    `C ${ND + R - kr} 0 ${ND} ${R - kr} ${ND} ${R}`,
    `V ${n1}`,
    `C ${ND} ${n1 + kn} ${ND - NR + kn} ${n1 + NR} ${ND - NR} ${n1 + NR}`,
    `H ${NR} C ${NR - kn} ${n1 + NR} 0 ${n1 + 2 * NR - kn} 0 ${n1 + 2 * NR}`,
    `V ${n2 - 2 * NR}`,
    `C 0 ${n2 - 2 * NR + kn} ${NR - kn} ${n2 - NR} ${NR} ${n2 - NR}`,
    `H ${ND - NR}`,
    `C ${ND - NR + kn} ${n2 - NR} ${ND} ${n2 - kn} ${ND} ${n2}`,
    `V ${h - R}`,
    `C ${ND} ${h - R + kr} ${ND + R - kr} ${h} ${ND + R} ${h}`,
    `H ${w - R} C ${w - R + kr} ${h} ${w} ${h - R + kr} ${w} ${h - R}`,
    `V ${R} C ${w} ${R - kr} ${w - R + kr} 0 ${w - R} 0`,
    `H ${ND + R} Z`,
  ].join(' ');
}

interface FillStyle {
  fill: string;
  stroke: string;
  strokeDash?: string;
  shadow?: string;
}

function getFillStyle(colorKey: string, interaction: PieceInteraction): FillStyle {
  const color = ION_COLOR[colorKey];
  const tint  = ION_TINT[colorKey];
  switch (interaction) {
    case 'hovered':   return { fill: tint.bg,                      stroke: tint.border };
    case 'pressed':   return { fill: tint.border,                  stroke: tint.dashBorder };
    case 'dragging':  return { fill: color,                        stroke: 'none', shadow: `0 0 20px ${tint.glow}` };
    case 'placed':
    case 'removable': return { fill: color,                        stroke: 'var(--color-static-white)' };
    case 'vacant':    return { fill: tint.bg,                      stroke: tint.dashBorder, strokeDash: '4 3' };
    default:          return { fill: 'var(--color-bg-normal)',      stroke: 'var(--color-border-strong)' };
  }
}

interface PuzzlePieceProps {
  ion: Ion;
  size?: PieceSize;
  interaction?: PieceInteraction;
  onRemove?: () => void;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export default function PuzzlePiece({
  ion,
  size = 'default',
  interaction = 'default',
  onRemove,
  onClick,
  onMouseEnter,
  onMouseLeave,
  style,
  className,
}: PuzzlePieceProps) {
  const { w, R, NR, ND, NH } = DIMS[size];
  const h = HEIGHTS[size][ion.charge];

  const colorKey  = getIonColorKey(ion.type, ion.charge);
  const ionColor  = ION_COLOR[colorKey];
  const fill      = getFillStyle(colorKey, interaction);

  const path = size === 'default'
    ? getDefaultPuzzlePath(ion)
    : (ion.type === 'plus' ? getPlusPath({ w, h, R, NR, ND, NH }) : getMinusPath({ w, h, R, NR, ND, NH }));

  const isActive  = ['dragging', 'placed', 'removable'].includes(interaction);
  const textColor = isActive ? 'var(--color-static-white)' : ionColor;
  const nameColor = isActive ? 'var(--color-static-white)' : interaction === 'pressed' ? 'var(--color-text-normal)' : 'var(--color-text-sub)';

  const symbolSize  = size === 'default' ? 32 : 18;
  const isOnePlus   = ion.type === 'plus' && ion.charge === 1;
  const isAnion     = ion.type === 'minus';
  const contentLeft = isOnePlus ? 'calc(50% - 4.5px)' : isAnion ? '60%' : 'calc(50% - 8px)';
  const contentTop  = isOnePlus ? 'calc(50% + 3px)' : '50%';
  const hasStroke   = fill.stroke !== 'none';

  return (
    <div
      style={{ position: 'relative', width: w, height: h, cursor: 'grab', ...style }}
      className={className}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <svg
        width={w}
        height={h}
        viewBox={size === 'default' ? `0 0 121 ${h + 1}` : `0 0 ${w} ${h}`}
        preserveAspectRatio={size === 'default' ? 'none' : undefined}
        fill="none"
        style={{
          position: 'absolute',
          inset: 0,
          filter: fill.shadow ? `drop-shadow(${fill.shadow})` : undefined,
        }}
      >
        <path
          d={path}
          fill={fill.fill}
          stroke={hasStroke ? fill.stroke : undefined}
          strokeWidth={hasStroke ? 1 : 0}
          strokeDasharray={fill.strokeDash}
        />
      </svg>

      {interaction !== 'vacant' && (
        <div
          style={{
            position: 'absolute',
            left: contentLeft,
            top: contentTop,
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: size === 'default' ? 8 : 6,
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 700, fontSize: symbolSize, lineHeight: '28px', letterSpacing: '-0.01em', color: textColor, whiteSpace: 'nowrap' }}>
            {ion.symbol}
            <sup style={{ fontSize: symbolSize * 0.5, lineHeight: 1 }}>{ion.superscript}</sup>
          </span>
          <span style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 500, fontSize: 12, lineHeight: '16px', letterSpacing: '-0.005em', color: nameColor, whiteSpace: 'nowrap' }}>
            {ion.name}
          </span>
        </div>
      )}

      {interaction === 'removable' && (
        <button
          type="button"
          aria-label={`${ion.name} 제거`}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          className="piece-remove-btn"
          style={{
            position: 'absolute',
            top: -7,
            right: -7,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'var(--color-static-white)',
            border: 'none',
            boxShadow: '0 0 6px rgba(0,0,0,0.09)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
          }}
        >
          <svg width={10} height={10} viewBox="0 0 10 10">
            <line x1={2} y1={2} x2={8} y2={8} stroke="var(--color-fill-grey)" strokeWidth={1.5} strokeLinecap="round" />
            <line x1={8} y1={2} x2={2} y2={8} stroke="var(--color-fill-grey)" strokeWidth={1.5} strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
