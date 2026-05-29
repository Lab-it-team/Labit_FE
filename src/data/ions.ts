export type IonType = 'plus' | 'minus';

export interface Ion {
  id: string;
  symbol: string;
  superscript: string;
  name: string;
  charge: 1 | 2 | 3;
  type: IonType;
}

export const CATIONS: Ion[] = [
  { id: 'H', symbol: 'H', superscript: '+', name: '수소', charge: 1, type: 'plus' },
  { id: 'Na', symbol: 'Na', superscript: '+', name: '나트륨', charge: 1, type: 'plus' },
  { id: 'K', symbol: 'K', superscript: '+', name: '칼륨', charge: 1, type: 'plus' },
  { id: 'Li', symbol: 'Li', superscript: '+', name: '리튬', charge: 1, type: 'plus' },
  { id: 'Ag', symbol: 'Ag', superscript: '+', name: '은', charge: 1, type: 'plus' },
  { id: 'NH4', symbol: 'NH₄', superscript: '+', name: '암모늄', charge: 1, type: 'plus' },
  { id: 'Mg', symbol: 'Mg', superscript: '2+', name: '마그네슘', charge: 2, type: 'plus' },
  { id: 'Ca', symbol: 'Ca', superscript: '2+', name: '칼슘', charge: 2, type: 'plus' },
  { id: 'Ba', symbol: 'Ba', superscript: '2+', name: '바륨', charge: 2, type: 'plus' },
  { id: 'Zn', symbol: 'Zn', superscript: '2+', name: '아연', charge: 2, type: 'plus' },
  { id: 'Cu', symbol: 'Cu', superscript: '2+', name: '구리', charge: 2, type: 'plus' },
  { id: 'Fe2', symbol: 'Fe', superscript: '2+', name: '철(II)', charge: 2, type: 'plus' },
  { id: 'Al', symbol: 'Al', superscript: '3+', name: '알루미늄', charge: 3, type: 'plus' },
  { id: 'Fe3', symbol: 'Fe', superscript: '3+', name: '철(III)', charge: 3, type: 'plus' },
];

export const ANIONS: Ion[] = [
  { id: 'Cl', symbol: 'Cl', superscript: '−', name: '염화', charge: 1, type: 'minus' },
  { id: 'F', symbol: 'F', superscript: '−', name: '플루오린화', charge: 1, type: 'minus' },
  { id: 'Br', symbol: 'Br', superscript: '−', name: '브롬화', charge: 1, type: 'minus' },
  { id: 'OH', symbol: 'OH', superscript: '−', name: '수산화', charge: 1, type: 'minus' },
  { id: 'NO3', symbol: 'NO₃', superscript: '−', name: '질산', charge: 1, type: 'minus' },
  { id: 'O', symbol: 'O', superscript: '2−', name: '산화', charge: 2, type: 'minus' },
  { id: 'S', symbol: 'S', superscript: '2−', name: '황화', charge: 2, type: 'minus' },
  { id: 'SO4', symbol: 'SO₄', superscript: '2−', name: '황산', charge: 2, type: 'minus' },
  { id: 'CO3', symbol: 'CO₃', superscript: '2−', name: '탄산', charge: 2, type: 'minus' },
  { id: 'PO4', symbol: 'PO₄', superscript: '3−', name: '인산', charge: 3, type: 'minus' },
];

export const ION_COLOR: Record<string, string> = {
  'plus-1': '#ED66C2',
  'plus-2': '#F5C025',
  'plus-3': '#F07B2F',
  'minus-1': '#65D2C0',
  'minus-2': '#1AA0FB',
  'minus-3': '#7C4FE0',
};

export const ION_TINT: Record<string, { bg: string; border: string; dashBorder: string; glow: string }> = {
  'plus-1':  { bg: '#FDF0F9', border: '#FBDAF0', dashBorder: '#F7BDE5', glow: '#F7BDE5' },
  'plus-2':  { bg: '#FEF9E9', border: '#FCEBBB', dashBorder: '#FAE29B', glow: '#FAE29B' },
  'plus-3':  { bg: '#FEF2EA', border: '#FAD6BF', dashBorder: '#F8C29F', glow: '#F8C29F' },
  'minus-1': { bg: '#F0FBF9', border: '#BDECE4', dashBorder: '#BDECE4', glow: '#BDECE4' },
  'minus-2': { bg: '#E8F6FF', border: '#C8E8FE', dashBorder: '#F1F7FF', glow: '#A2B8F9' },
  'minus-3': { bg: '#F2EDFC', border: '#D6C8F5', dashBorder: '#C3AEF1', glow: '#C3AEF1' },
};

export function getIonColorKey(type: IonType, charge: number): string {
  return `${type}-${charge}`;
}
