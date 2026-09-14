import { outerRadius, nucleusRadius, type ElementSymbol } from "@/data/covalentElements";

export const ELECTRON_DOT_RADIUS = 5;

export function bohrAtomSize(element: ElementSymbol): number {
  return (outerRadius(element) + ELECTRON_DOT_RADIUS + 4) * 2;
}

/** 화면 좌표계 각도(0=오른쪽, 90=아래, 180=왼쪽, 270=위)를 라디안으로 변환 */
export function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function polar(radius: number, angleDeg: number): { x: number; y: number } {
  const r = toRad(angleDeg);
  return { x: radius * Math.cos(r), y: radius * Math.sin(r) };
}

/**
 * 공유 전자쌍 하나 안에서 두 전자의 중심 간 거리(결합축 방향).
 * 전자 지름(ELECTRON_DOT_RADIUS*2)보다 반드시 커야 두 전자가 겹치지 않는다.
 * 지름 + 최소 4px 테두리 간격을 확보한다.
 */
export const ELECTRON_PAIR_GAP = ELECTRON_DOT_RADIUS * 2 + 4;
/** 이중/삼중결합에서 전자쌍끼리 떨어뜨리는 간격(결합축에 수직 방향) */
const BOND_LANE_GAP = ELECTRON_PAIR_GAP + 5;

export interface SharedPairsResult {
  /** 결합 차수만큼의 전자쌍 중심 좌표 */
  pairs: { x: number; y: number }[];
  /** 결합축 방향 단위벡터 — 각 전자쌍 안의 두 전자를 이 방향으로 나란히 배치하는 데 쓴다 */
  ux: number;
  uy: number;
}

/**
 * 두 원자 A, B(중심 좌표와 최외각 반지름)와 결합 차수(order)로부터
 * 공유 전자쌍들의 위치를 계산한다.
 *
 * - 결합축 단위벡터 u, 그 수직 단위벡터 n을 A→B 방향으로 정의한다.
 * - 두 원자의 반지름이 같으면 기준점 Q는 두 중심의 중점.
 *   다르면 두 원의 교차축 위치(중심 A로부터의 사영 거리)로 계산한다.
 * - 결합 차수별로 Q를 기준으로 n 방향에 대칭인 위치에 전자쌍을 나눠 배치한다
 *   (단일: 중앙 1개, 이중: 좌우 대칭 2개, 삼중: 중앙 + 좌우 대칭 2개).
 *
 * 오직 두 원자의 최종(스냅된) 중심 좌표와 반지름만으로 계산하므로, 드래그 방향이나
 * 화면 크기, 결합 각도(수평/수직/대각선)와 무관하게 항상 같은 결과를 낸다.
 */
export function computeSharedPairs(
  A: { x: number; y: number },
  B: { x: number; y: number },
  Ra: number,
  Rb: number,
  order: 1 | 2 | 3,
): SharedPairsResult {
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const distance = Math.hypot(dx, dy) || 1;
  const ux = dx / distance;
  const uy = dy / distance;
  const nx = -uy;
  const ny = ux;

  let qx: number;
  let qy: number;
  if (Ra === Rb) {
    qx = (A.x + B.x) / 2;
    qy = (A.y + B.y) / 2;
  } else {
    const qDistance = (distance * distance + Ra * Ra - Rb * Rb) / (2 * distance);
    qx = A.x + ux * qDistance;
    qy = A.y + uy * qDistance;
  }

  const laneOffsets =
    order === 1 ? [0] : order === 2 ? [-BOND_LANE_GAP / 2, BOND_LANE_GAP / 2] : [-BOND_LANE_GAP, 0, BOND_LANE_GAP];
  const pairs = laneOffsets.map((lane) => ({ x: qx + nx * lane, y: qy + ny * lane }));

  return { pairs, ux, uy };
}

/**
 * 중심 원자와 바깥 원자의 핵간 거리(px).
 * 두 원자의 최외각 껍질이 시각적으로 겹치되(적당한 렌즈 영역 확보),
 * 그 겹침 지점(원-원 교차축 기준점 Q에서 전자쌍 절반 간격만큼 더 안쪽인,
 * 실제로 그려지는 전자 중 원자핵에 가장 가까운 지점)이 양쪽 원자핵과
 * 절대 겹치지 않도록 필요한 최소 거리를 만족할 때까지 늘려가며 계산한다.
 */
export function bondLength(centerEl: ElementSymbol, outerEl: ElementSymbol): number {
  const Ra = outerRadius(centerEl);
  const Rb = outerRadius(outerEl);
  const nucA = nucleusRadius(centerEl);
  const nucB = nucleusRadius(outerEl);
  // 결합축 위, 기준점 Q에서 가장 가까운 전자까지의 거리(전자쌍 절반 간격) + 전자 반지름 + 여유
  const nearestElectronPullback = ELECTRON_PAIR_GAP / 2;
  const clearance = nearestElectronPullback + ELECTRON_DOT_RADIUS + 3;

  const initialOverlap = Math.min(20, 0.35 * Math.min(Ra, Rb));
  let d = Math.max(Ra + Rb - initialOverlap, 20);

  for (let i = 0; i < 400; i++) {
    const qA = (d * d + Ra * Ra - Rb * Rb) / (2 * d);
    const qB = d - qA;
    if (qA >= nucA + clearance && qB >= nucB + clearance) break;
    d += 1;
  }
  return d;
}

/**
 * 결합 방향(occupied)을 피해서 남은 전자 `count`개를 껍질 위에 고르게 배치할 각도를 계산.
 * 결합이 여러 개면, 결합 사이 빈 공간의 크기에 비례해 전자를 나눠 배치한다.
 */
export function distributeFreeAngles(occupied: number[], count: number): number[] {
  if (count <= 0) return [];
  if (occupied.length === 0) {
    return Array.from({ length: count }, (_, i) => (360 / count) * i);
  }

  const sorted = [...occupied].map((a) => ((a % 360) + 360) % 360).sort((a, b) => a - b);
  const gaps = sorted.map((start, i) => {
    const end = sorted[(i + 1) % sorted.length];
    const size = ((end - start + 360) % 360) || 360;
    return { start, size };
  });
  const totalGap = gaps.reduce((s, g) => s + g.size, 0);
  const margin = 30;

  const result: number[] = [];
  let remaining = count;
  gaps.forEach((g, gi) => {
    const isLast = gi === gaps.length - 1;
    const share = isLast ? remaining : Math.min(remaining, Math.round((g.size / totalGap) * count));
    const usable = Math.max(g.size - margin * 2, 0);
    for (let i = 0; i < share; i++) {
      const t = share === 1 ? 0.5 : (i + 0.5) / share;
      result.push((g.start + margin + usable * t) % 360);
    }
    remaining -= share;
  });
  return result;
}
