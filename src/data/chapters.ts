export type ChapterStatus = "done" | "in-progress" | "upcoming";

export interface Lesson {
  id?: number;
  title: string;
  inProgress: boolean;
  page: number;
}

export interface Chapter {
  id: number;
  title: string;
  status: ChapterStatus;
  lessonCount: number;
  lessons: Lesson[];
  path: string;
}

export const chapters: Chapter[] = [
  {
    id: 1,
    title: "원소 주기율표 읽기",
    status: "in-progress",
    lessonCount: 2,
    path: "/element-concept",
    lessons: [
      { title: "금속 vs 비금속 구분", inProgress: true, page: 1 },
      { title: "족·주기 개념", inProgress: false, page: 2 },
    ],
  },
  {
    id: 2,
    title: "원자란 무엇인가?",
    status: "upcoming",
    lessonCount: 3,
    path: "/atom-concept",
    lessons: [
      { title: "원소 vs 원자 vs 분자 구분", inProgress: false, page: 1 },
      { title: "원자 모형 (전자껍질)", inProgress: false, page: 2 },
      { title: "원자번호, 양성자·중성자·전자", inProgress: false, page: 3 },
    ],
  },
  {
    id: 3,
    title: "이온이 만들어지는 원리",
    status: "upcoming",
    lessonCount: 2,
    path: "/ion-formation-concept",
    lessons: [
      { title: "옥텟 규칙 (왜 전자를 잃고 얻으려 하는가?)", inProgress: false, page: 1 },
      { title: "양이온 / 음이온 형성 과정 | 대표 이온 기호 암기", inProgress: false, page: 2 },
    ],
  },
  {
    id: 4,
    title: "이온 결합",
    status: "upcoming",
    lessonCount: 2,
    path: "/ionic-concept",
    lessons: [
      { title: "이온 결합이란? (소금 NaCl 생성 과정)", inProgress: false, page: 1 },
      { title: "이온 결합 물질의 성질 | 화학식 작성법", inProgress: false, page: 2 },
    ],
  },
  {
    id: 5,
    title: "공유 결합",
    status: "upcoming",
    lessonCount: 2,
    path: "/covalent-concept",
    lessons: [
      { title: "비금속끼리 왜 다르게 결합하는가?", inProgress: false, page: 1 },
      { title: "전자쌍 공유 개념", inProgress: false, page: 2 },
    ],
  },
  {
    id: 7,
    title: "단원 퀴즈",
    status: "upcoming",
    lessonCount: 0,
    path: "/quiz",
    lessons: [],
  },
];
