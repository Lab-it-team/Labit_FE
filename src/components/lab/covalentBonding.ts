import { buildRenderModel, type PlacedAtom } from "@/components/lab/covalentRenderModel";
import type { ElementSymbol, Molecule } from "@/data/covalentElements";

export const SNAP_THRESHOLD = 90;

function findAvailableSlot(atoms: PlacedAtom[], molecule: Molecule, centerId: string, element: ElementSymbol): number {
  const filled = new Set(
    atoms.filter((a) => a.bondedToCenterId === centerId && a.slotIndex !== null).map((a) => a.slotIndex),
  );
  return molecule.bonds.findIndex((b, i) => b.element === element && !filled.has(i));
}

function autoAttachNearby(atoms: PlacedAtom[], molecule: Molecule, centerId: string, centerX: number, centerY: number): PlacedAtom[] {
  let next = atoms;
  for (const a of atoms) {
    if (a.id === centerId || a.isCenter || a.bondedToCenterId) continue;
    const dist = Math.hypot(a.x - centerX, a.y - centerY);
    if (dist > SNAP_THRESHOLD) continue;
    const slot = findAvailableSlot(next, molecule, centerId, a.element);
    if (slot === -1) continue;
    next = next.map((p) => (p.id === a.id ? { ...p, bondedToCenterId: centerId, slotIndex: slot } : p));
  }
  return next;
}

/** dropId 원자를 (dropX, dropY)에 내려놓았을 때의 결합 결과를 계산 */
export function trySnap(atoms: PlacedAtom[], molecule: Molecule, dropId: string, dropX: number, dropY: number): PlacedAtom[] {
  const dropped = atoms.find((a) => a.id === dropId);
  if (!dropped) return atoms;

  const existingCenter = atoms.find((a) => a.isCenter && a.id !== dropId);

  if (dropped.element === molecule.centerElement && !existingCenter) {
    let next = atoms.map((a) =>
      a.id === dropId ? { ...a, isCenter: true, x: dropX, y: dropY, bondedToCenterId: null, slotIndex: null } : a,
    );
    next = autoAttachNearby(next, molecule, dropId, dropX, dropY);
    return next;
  }

  const centerAtom = atoms.find((a) => a.isCenter && a.id !== dropId);
  if (centerAtom) {
    const dist = Math.hypot(dropX - centerAtom.x, dropY - centerAtom.y);
    if (dist <= SNAP_THRESHOLD) {
      const slot = findAvailableSlot(atoms, molecule, centerAtom.id, dropped.element);
      if (slot !== -1) {
        return atoms.map((a) =>
          a.id === dropId ? { ...a, isCenter: false, x: dropX, y: dropY, bondedToCenterId: centerAtom.id, slotIndex: slot } : a,
        );
      }
    }
  }

  return atoms.map((a) =>
    a.id === dropId ? { ...a, x: dropX, y: dropY, bondedToCenterId: null, slotIndex: null } : a,
  );
}

/** 캔버스 위 원자를 다시 잡았을 때(드래그 시작) 결합을 풀어준다. 중심 원자는 자식들을 데리고 그대로 이동 */
export function detachAtom(atoms: PlacedAtom[], molecule: Molecule, id: string): PlacedAtom[] {
  const atom = atoms.find((a) => a.id === id);
  if (!atom || atom.isCenter || !atom.bondedToCenterId) return atoms;

  const { renderAtoms } = buildRenderModel(atoms, molecule);
  const current = renderAtoms.find((r) => r.id === id);
  if (!current) return atoms;

  return atoms.map((a) => (a.id === id ? { ...a, x: current.x, y: current.y, bondedToCenterId: null, slotIndex: null } : a));
}

/** 원자를 제거한다. 중심 원자를 지우면 딸려있던 원자들은 마지막 위치에 고정된 채 떨어져 나온다 */
export function removeAtom(atoms: PlacedAtom[], molecule: Molecule, id: string): PlacedAtom[] {
  const target = atoms.find((a) => a.id === id);
  if (!target) return atoms;

  if (target.isCenter) {
    const { renderAtoms } = buildRenderModel(atoms, molecule);
    const positions = new Map(renderAtoms.map((r) => [r.id, { x: r.x, y: r.y }]));
    return atoms
      .filter((a) => a.id !== id)
      .map((a) => {
        if (a.bondedToCenterId !== id) return a;
        const pos = positions.get(a.id);
        return { ...a, x: pos?.x ?? a.x, y: pos?.y ?? a.y, bondedToCenterId: null, slotIndex: null };
      });
  }

  return atoms.filter((a) => a.id !== id);
}

export function isMoleculeComplete(atoms: PlacedAtom[], molecule: Molecule): boolean {
  const center = atoms.find((a) => a.isCenter);
  if (!center || center.element !== molecule.centerElement) return false;
  const filledSlots = new Set(
    atoms.filter((a) => a.bondedToCenterId === center.id && a.slotIndex !== null).map((a) => a.slotIndex),
  );
  if (filledSlots.size !== molecule.bonds.length) return false;
  for (let i = 0; i < molecule.bonds.length; i++) if (!filledSlots.has(i)) return false;
  return atoms.length === 1 + molecule.bonds.length;
}

export function extraAtomCount(atoms: PlacedAtom[], molecule: Molecule): number {
  return Math.max(0, atoms.length - (1 + molecule.bonds.length));
}
