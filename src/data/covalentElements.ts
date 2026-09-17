export type ElementSymbol = "H" | "C" | "N" | "O" | "Cl";

export interface ElementDef {
  symbol: ElementSymbol;
  name: string;
  /** 껍질(shell)별 전자 수. 마지막 값이 원자가(최외각) 전자 수 */
  shellElectrons: number[];
  /** 껍질(shell)별 반지름(px). shellElectrons와 같은 길이 */
  shellRadii: number[];
  color: string;
}

export const ELEMENTS: Record<ElementSymbol, ElementDef> = {
  H:  { symbol: "H",  name: "수소",  shellElectrons: [1],       shellRadii: [26],         color: "var(--color-element-normal-pink)" },
  C:  { symbol: "C",  name: "탄소",  shellElectrons: [2, 4],    shellRadii: [16, 40],     color: "var(--color-element-normal-orange)" },
  N:  { symbol: "N",  name: "질소",  shellElectrons: [2, 5],    shellRadii: [16, 40],     color: "var(--color-element-normal-violet)" },
  O:  { symbol: "O",  name: "산소",  shellElectrons: [2, 6],    shellRadii: [16, 40],     color: "var(--color-element-normal-blue)" },
  Cl: { symbol: "Cl", name: "염소",  shellElectrons: [2, 8, 7], shellRadii: [14, 28, 48], color: "var(--color-element-normal-mint)" },
};

/** 팔레트에 항상 표시할 전체 원소 목록(이온결합 실습과 동일하게, 문제와 무관하게 모두 노출) */
export const ALL_ELEMENTS: ElementSymbol[] = ["H", "C", "N", "O", "Cl"];

export function valenceElectrons(el: ElementSymbol): number {
  return ELEMENTS[el].shellElectrons.at(-1)!;
}

export function outerRadius(el: ElementSymbol): number {
  return ELEMENTS[el].shellRadii.at(-1)!;
}

/** 원자핵 반지름(px). 원자가 껍질 반지름에 비례 — 실제 화학 결합 시뮬레이션 관례처럼
 * 핵을 작게 그려서, 공유 전자쌍이 들어갈 자리(두 원자의 겹침 영역)를 항상 확보한다 */
export function nucleusRadius(el: ElementSymbol): number {
  return Math.round(outerRadius(el) * 0.4);
}

export interface BondSpec {
  element: ElementSymbol;
  /** 중심 원자 기준 방향(도). 0=오른쪽, 90=아래, 180=왼쪽, 270=위 (화면 좌표계) */
  angle: number;
  order: 1 | 2 | 3;
}

export interface Molecule {
  id: number;
  formula: string;
  name: string;
  centerElement: ElementSymbol;
  bonds: BondSpec[];
}

export const MOLECULES: Molecule[] = [
  { id: 1, formula: "H₂",   name: "수소",         centerElement: "H",  bonds: [
    { element: "H", angle: 0, order: 1 },
  ] },
  { id: 2, formula: "HCl",  name: "염화수소",      centerElement: "Cl", bonds: [
    { element: "H", angle: 180, order: 1 },
  ] },
  { id: 3, formula: "Cl₂",  name: "염소",         centerElement: "Cl", bonds: [
    { element: "Cl", angle: 0, order: 1 },
  ] },
  { id: 4, formula: "H₂O",  name: "물",           centerElement: "O",  bonds: [
    { element: "H", angle: 38,  order: 1 },
    { element: "H", angle: 142, order: 1 },
  ] },
  { id: 5, formula: "NH₃",  name: "암모니아",      centerElement: "N",  bonds: [
    { element: "H", angle: 90,  order: 1 },
    { element: "H", angle: 210, order: 1 },
    { element: "H", angle: 330, order: 1 },
  ] },
  { id: 6, formula: "CH₄",  name: "메테인",        centerElement: "C",  bonds: [
    { element: "H", angle: 45,  order: 1 },
    { element: "H", angle: 135, order: 1 },
    { element: "H", angle: 225, order: 1 },
    { element: "H", angle: 315, order: 1 },
  ] },
  { id: 7, formula: "O₂",   name: "산소",         centerElement: "O",  bonds: [
    { element: "O", angle: 0, order: 2 },
  ] },
  { id: 8, formula: "N₂",   name: "질소",         centerElement: "N",  bonds: [
    { element: "N", angle: 0, order: 3 },
  ] },
  { id: 9, formula: "CO₂",  name: "이산화탄소",    centerElement: "C",  bonds: [
    { element: "O", angle: 180, order: 2 },
    { element: "O", angle: 0,   order: 2 },
  ] },
];

/** 분자에 필요한 원소 목록(팔레트 표시용): 중심 원자 + 결합 원자들, 중복 제거 */
export function elementsNeeded(molecule: Molecule): ElementSymbol[] {
  const set = new Set<ElementSymbol>([molecule.centerElement, ...molecule.bonds.map((b) => b.element)]);
  return Array.from(set);
}

export function neededCount(molecule: Molecule, el: ElementSymbol): number {
  let count = molecule.centerElement === el ? 1 : 0;
  count += molecule.bonds.filter((b) => b.element === el).length;
  return count;
}
