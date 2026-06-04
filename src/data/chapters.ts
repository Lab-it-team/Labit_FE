export type ChapterStatus = "done" | "in-progress" | "upcoming";

export interface Lesson {
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
    title: "원자와 이온의 기초",
    status: "done",
    lessonCount: 1,
    lessons: [{ title: "원자와 이온의 기초", inProgress: false }],
  },
  {
    id: 2,
    title: "이온 결합",
    status: "in-progress",
    lessonCount: 2,
    lessons: [
      { title: "이온 결합 개념 학습", inProgress: true },
      { title: "이온 결합 실습", inProgress: false },
    ],
  },
  {
    id: 3,
    title: "공유 결합",
    status: "upcoming",
    lessonCount: 2,
    lessons: [
      { title: "공유 결합 개념 학습", inProgress: false },
      { title: "공유 결합 실습", inProgress: false },
    ],
  },
  {
    id: 4,
    title: "이온 결합 vs 공유 결합",
    status: "upcoming",
    lessonCount: 1,
    lessons: [
      { title: "이온 결합과 공유 결합 비교하기", inProgress: false },
    ],
  },
  {
    id: 5,
    title: "단원 퀴즈",
    status: "upcoming",
    lessonCount: 1,
    lessons: [
      { title: "원자와 화학 결합 종합 퀴즈", inProgress: false },
    ],
  },
];
