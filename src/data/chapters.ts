export type ChapterStatus = "done" | "in-progress" | "upcoming";

export interface Lesson {
  id?: number;
  title: string;
  inProgress: boolean;
}

export interface Chapter {
  id: number;
  title: string;
  status: ChapterStatus;
  lessonCount: number;
  lessons: Lesson[];
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "원소 주기율표 읽기",
    status: "in-progress",
    lessonCount: 2,
    lessons: [
      { title: "금속 vs 비금속 구분", inProgress: true },
      { title: "족·주기 개념", inProgress: false },
    ],
  },
  {
    id: 2,
    title: "원자란 무엇인가?",
    status: "upcoming",
    lessonCount: 3,
    lessons: [
      { title: "원소 vs 원자 vs 분자 구분", inProgress: false },
      { title: "원자 모형 (전자껍질)", inProgress: false },
      { title: "원자번호, 양성자·중성자·전자", inProgress: false },
    ],
  },
  {
    id: 3,
    title: "이온이 만들어지는 원리",
    status: "upcoming",
    lessonCount: 3,
    lessons: [
      { title: "옥텟 규칙 (왜 전자를 잃고 얻으려 하는가?)", inProgress: false },
      { title: "양이온 / 음이온 형성 과정", inProgress: false },
      { title: "대표 이온 기호 암기", inProgress: false },
    ],
  },
  {
    id: 4,
    title: "이온 결합",
    status: "upcoming",
    lessonCount: 3,
    lessons: [
      { title: "이온 결합이란? (소금 NaCl 생성 과정)", inProgress: false },
      { title: "이온 결합 물질의 성질 (전기 도도, 고체 결정)", inProgress: false },
      { title: "화학식 작성법", inProgress: false },
    ],
  },
  {
    id: 5,
    title: "공유 결합",
    status: "upcoming",
    lessonCount: 3,
    lessons: [
      { title: "비금속끼리 왜 다르게 결합하는가?", inProgress: false },
      { title: "전자쌍 공유 개념", inProgress: false },
      { title: "물(H₂O), 이산화탄소(CO₂) 예시", inProgress: false },
    ],
  },
  {
    id: 6,
    title: "화학 반응식",
    status: "upcoming",
    lessonCount: 3,
    lessons: [
      { title: "반응물 → 생성물", inProgress: false },
      { title: "계수 맞추기", inProgress: false },
      { title: "질량 보존 법칙 연결", inProgress: false },
    ],
  },
  {
    id: 7,
    title: "단원 퀴즈",
    status: "upcoming",
    lessonCount: 0,
    lessons: [],
  },
];
