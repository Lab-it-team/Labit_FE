import { ELEMENTS, nucleusRadius, type ElementSymbol } from "@/data/covalentElements";
import { polar, distributeFreeAngles, ELECTRON_DOT_RADIUS } from "@/components/lab/bohrGeometry";

const ELECTRON_R = ELECTRON_DOT_RADIUS;
const ELECTRON_COLOR = "var(--color-primary-normal)";

interface BohrAtomProps {
  element: ElementSymbol;
  /** 다른 원자와 결합해 공유쌍이 된, 이 원자 기준 방향(도) 목록 */
  occupiedAngles?: number[];
  /** 결합에 쓰이지 않고 남은 원자가 전자 수 (기본값: 전체 원자가 전자 수) */
  remainingValence?: number;
  ghost?: boolean;
  dimmed?: boolean;
}

export default function BohrAtom({ element, occupiedAngles = [], remainingValence, ghost = false, dimmed = false }: BohrAtomProps) {
  const def = ELEMENTS[element];
  const outerR = def.shellRadii.at(-1)!;
  const pad = ELECTRON_R + 5;
  const size = (outerR + pad) * 2;
  const c = size / 2;

  const innerShells = def.shellRadii.slice(0, -1);
  const valenceRemaining = remainingValence ?? def.shellElectrons.at(-1)!;

  // 비공유 전자는 낱개로 흩뿌리지 않고 2개씩 짝지어(전자쌍) 표시한다 (홀수면 마지막 1개만 단독)
  const pairCount = Math.floor(valenceRemaining / 2);
  const hasUnpaired = valenceRemaining % 2 === 1;
  const clusterAngles = distributeFreeAngles(occupiedAngles, pairCount + (hasUnpaired ? 1 : 0));
  const CLUSTER_SPREAD = 9; // 한 쌍 안의 두 전자 사이 각도(도)
  const freeDotAngles = clusterAngles.flatMap((a, i) =>
    i < pairCount ? [a - CLUSTER_SPREAD, a + CLUSTER_SPREAD] : [a],
  );

  const nucleusR = nucleusRadius(element);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", opacity: ghost ? 0.5 : dimmed ? 0.45 : 1 }}
    >
      {/* 전자껍질 — 안쪽 껍질은 얇고 옅은 원으로만 표시(구조 안내용), 전자점은 원자가 껍질에만 표시 */}
      {innerShells.map((r, i) => (
        <circle key={i} cx={c} cy={c} r={r} fill="none" stroke="var(--color-border-normal)" strokeWidth={1} />
      ))}
      <circle cx={c} cy={c} r={outerR} fill="none" stroke="var(--color-border-strong)" strokeWidth={1.5} />

      {/* 원자가(최외각) 전자 — 결합에 쓰이지 않은 만큼만, 2개씩 짝지어 표시 */}
      {freeDotAngles.map((a, i) => {
        const p = polar(outerR, a);
        return (
          <circle
            key={`out-${i}`}
            cx={c + p.x}
            cy={c + p.y}
            r={ELECTRON_R}
            fill={ELECTRON_COLOR}
            stroke="var(--color-static-white)"
            strokeWidth={1.5}
          />
        );
      })}

      {/* 원자핵 */}
      <circle cx={c} cy={c} r={nucleusR} fill={def.color} />
      <text
        x={c}
        y={c}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-sans)"
        fontWeight={700}
        fontSize={nucleusR}
        fill="var(--color-static-white)"
      >
        {def.symbol}
      </text>
    </svg>
  );
}
