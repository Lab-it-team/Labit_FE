import { polar, computeSharedPairs, bondLength } from "@/components/lab/bohrGeometry";
import { outerRadius, valenceElectrons, type ElementSymbol, type Molecule } from "@/data/covalentElements";

export interface PlacedAtom {
  id: string;
  element: ElementSymbol;
  isCenter: boolean;
  x: number;
  y: number;
  bondedToCenterId: string | null;
  slotIndex: number | null;
}

export interface RenderAtom {
  id: string;
  element: ElementSymbol;
  x: number;
  y: number;
  occupiedAngles: number[];
  remainingValence: number;
  bonded: boolean;
}

export interface BondVisual {
  /** 이 결합에서 공유되는 전자쌍들의 중심 좌표 (결합 차수만큼) */
  pairs: { x: number; y: number }[];
  /** 결합축 방향 단위벡터 — 각 전자쌍 안의 두 전자를 이 방향으로 나란히 배치 */
  ux: number;
  uy: number;
}

export function buildRenderModel(atoms: PlacedAtom[], molecule: Molecule) {
  const center = atoms.find((a) => a.isCenter);
  const renderAtoms: RenderAtom[] = [];
  const bondVisuals: BondVisual[] = [];
  const centerOccupied: number[] = [];
  let centerUsed = 0;

  const children = center ? atoms.filter((a) => a.bondedToCenterId === center.id) : [];
  for (const child of children) {
    const spec = child.slotIndex !== null ? molecule.bonds[child.slotIndex] : undefined;
    if (!center || !spec) continue;
    const pos = polar(bondLength(center.element, spec.element), spec.angle);
    const x = center.x + pos.x;
    const y = center.y + pos.y;
    centerOccupied.push(spec.angle);
    centerUsed += spec.order;
    renderAtoms.push({
      id: child.id,
      element: child.element,
      x,
      y,
      occupiedAngles: [(spec.angle + 180) % 360],
      remainingValence: valenceElectrons(child.element) - spec.order,
      bonded: true,
    });
    const shared = computeSharedPairs(
      { x: center.x, y: center.y },
      { x, y },
      outerRadius(center.element),
      outerRadius(spec.element),
      spec.order,
    );
    bondVisuals.push({ pairs: shared.pairs, ux: shared.ux, uy: shared.uy });
  }

  if (center) {
    renderAtoms.push({
      id: center.id,
      element: center.element,
      x: center.x,
      y: center.y,
      occupiedAngles: centerOccupied,
      remainingValence: valenceElectrons(center.element) - centerUsed,
      bonded: children.length > 0,
    });
  }

  for (const a of atoms) {
    if (a.isCenter) continue;
    if (center && a.bondedToCenterId === center.id) continue;
    renderAtoms.push({
      id: a.id,
      element: a.element,
      x: a.x,
      y: a.y,
      occupiedAngles: [],
      remainingValence: valenceElectrons(a.element),
      bonded: false,
    });
  }

  return { renderAtoms, bondVisuals };
}
