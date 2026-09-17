export type ElementCategory = "metal" | "nonmetal";

export interface MiniElement {
  number: number;
  symbol: string;
  category: ElementCategory;
}

export const CATEGORY_STYLE: Record<ElementCategory, { bg: string; color: string }> = {
  metal: { bg: "var(--color-element-hover-fill-pink)", color: "var(--color-element-normal-pink)" },
  nonmetal: { bg: "var(--color-element-hover-fill-mint)", color: "var(--color-element-normal-mint)" },
};

export const CATEGORY_LABEL: Record<ElementCategory, string> = { metal: "금속", nonmetal: "비금속" };

export const GROUPS = [1, 2, 13, 14, 15, 16, 17, 18];
export const PERIODS = [1, 2, 3, 4];

/** 1~20번(H~Ca) 원소를 족(group)/주기(period)로 배치한 미니 주기율표 */
export const TABLE: Record<number, Partial<Record<number, MiniElement>>> = {
  1: {
    1: { number: 1, symbol: "H", category: "nonmetal" },
    18: { number: 2, symbol: "He", category: "nonmetal" },
  },
  2: {
    1: { number: 3, symbol: "Li", category: "metal" },
    2: { number: 4, symbol: "Be", category: "metal" },
    13: { number: 5, symbol: "B", category: "metal" },
    14: { number: 6, symbol: "C", category: "nonmetal" },
    15: { number: 7, symbol: "N", category: "nonmetal" },
    16: { number: 8, symbol: "O", category: "nonmetal" },
    17: { number: 9, symbol: "F", category: "nonmetal" },
    18: { number: 10, symbol: "Ne", category: "nonmetal" },
  },
  3: {
    1: { number: 11, symbol: "Na", category: "metal" },
    2: { number: 12, symbol: "Mg", category: "metal" },
    13: { number: 13, symbol: "Al", category: "metal" },
    14: { number: 14, symbol: "Si", category: "nonmetal" },
    15: { number: 15, symbol: "P", category: "nonmetal" },
    16: { number: 16, symbol: "S", category: "nonmetal" },
    17: { number: 17, symbol: "Cl", category: "nonmetal" },
    18: { number: 18, symbol: "Ar", category: "nonmetal" },
  },
  4: {
    1: { number: 19, symbol: "K", category: "metal" },
    2: { number: 20, symbol: "Ca", category: "metal" },
  },
};

export const ELEMENT_NAMES: Record<string, { ko: string; en: string }> = {
  H: { ko: "수소", en: "Hydrogen" },
  He: { ko: "헬륨", en: "Helium" },
  Li: { ko: "리튬", en: "Lithium" },
  Be: { ko: "베릴륨", en: "Beryllium" },
  B: { ko: "붕소", en: "Boron" },
  C: { ko: "탄소", en: "Carbon" },
  N: { ko: "질소", en: "Nitrogen" },
  O: { ko: "산소", en: "Oxygen" },
  F: { ko: "플루오린", en: "Fluorine" },
  Ne: { ko: "네온", en: "Neon" },
  Na: { ko: "나트륨", en: "Sodium" },
  Mg: { ko: "마그네슘", en: "Magnesium" },
  Al: { ko: "알루미늄", en: "Aluminium" },
  Si: { ko: "규소", en: "Silicon" },
  P: { ko: "인", en: "Phosphorus" },
  S: { ko: "황", en: "Sulfur" },
  Cl: { ko: "염소", en: "Chlorine" },
  Ar: { ko: "아르곤", en: "Argon" },
  K: { ko: "칼륨", en: "Potassium" },
  Ca: { ko: "칼슘", en: "Calcium" },
};
