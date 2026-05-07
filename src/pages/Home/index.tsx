import { useState } from "react";
import arrowRightSvg from "@/assets/Icon/right.svg";
import arrowDownSvg from "@/assets/Icon/Arrow/down.svg";
import arrowUpSvg from "@/assets/Icon/Arrow/up.svg";
import checkCircleSvg from "@/assets/Icon/check-c.svg";
import dotActiveSvg from "@/assets/Icon/dot-active.svg";
import dotInactiveSvg from "@/assets/Icon/dot-inactive.svg";  

type ChapterStatus = "done" | "in-progress" | "upcoming";

interface Lesson {
  title: string;
  inProgress: boolean;
}

interface Chapter {
  id: number;
  title: string;
  status: ChapterStatus;
  lessonCount: number;
  lessons: Lesson[];
}

const chapters: Chapter[] = [
  {
    id: 1,
    title: "원자와 이온의 기초",
    status: "done",
    lessonCount: 0,
    lessons: [],
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
    lessons: [],
  },
  {
    id: 4,
    title: "이온 결합 vs 공유 결합",
    status: "upcoming",
    lessonCount: 2,
    lessons: [],
  },
  {
    id: 5,
    title: "단원 퀴즈",
    status: "upcoming",
    lessonCount: 1,
    lessons: [],
  },
];

export default function Home() {
  const [expanded, setExpanded] = useState<number[]>([2]);

  const toggleChapter = (id: number, lessonCount: number) => {
    if (lessonCount === 0) return;
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-full flex-col gap-20 bg-neutral-5 px-10 py-[60px]">
      {/* 인사말 */}
      <div className="flex flex-col gap-3">
        <h1 className="text-heading-lg font-bold text-text-strong">
          안녕하세요, 김과학 님!
        </h1>
        <p className="text-body-xl font-medium text-text-normal">
          오늘도 쉽게 과학을 배워볼까요?
        </p>
      </div>

      {/* 진행 중 학습 섹션 */}
      <div className="flex flex-col gap-4">
        <p className="text-heading-sm font-medium text-neutral-50">
          진행 중 학습
        </p>

        <div className="flex flex-col gap-6 rounded-xl border border-border-light bg-white p-6">
          {/* 상단: 코스 정보 + 이어하기 버튼 */}
          <div className="flex items-center justify-between">
            <div className="flex flex-1 flex-col gap-3">
              {/* 진행률 배지 */}
              <div className="inline-flex items-center gap-1 self-start rounded-full bg-bg-normal px-2 py-1">
                <span className="text-label-sm font-medium text-text-normal">
                  진행률
                </span>
                <span className="text-[14px]/[20px] font-semibold text-blue-500">
                  30
                </span>
                <span className="text-label-sm font-medium text-text-normal">
                  %
                </span>
              </div>

              {/* 코스 제목 & 완료 현황 */}
              <div className="flex flex-col gap-1.5">
                <h2 className="text-heading-md font-bold text-text-normal">
                  원자와 화학 결합
                </h2>
                <p className="flex items-center gap-1 text-label-md font-normal text-neutral-50">
                  <span>학습 완료</span>
                  <span>2 / 6</span>
                </p>
              </div>
            </div>

            {/* 이어하기 버튼 */}
            <button
              type="button"
              className="flex h-[38px] shrink-0 items-center gap-1 rounded-lg bg-blue-500 px-2.5 py-2 text-label-xl font-semibold text-white transition-colors hover:bg-blue-600"
            >
              이어하기
              <img
                src={arrowRightSvg}
                alt=""
                width={16}
                height={16}
                className="brightness-0 invert"
              />
            </button>
          </div>

          {/* 챕터 목록 */}
          <div className="flex flex-col gap-3">
            {chapters.map((chapter) => {
              const isExpanded = expanded.includes(chapter.id);
              const isInProgress = chapter.status === "in-progress";
              const isDone = chapter.status === "done";

              return (
                <div key={chapter.id}>
                  {/* 챕터 행 */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleChapter(chapter.id, chapter.lessonCount)
                    }
                    className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors ${
                      isInProgress ? "bg-bg-normal" : "bg-transparent"
                    }`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {/* 번호 배지 */}
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center text-[14px]/[20px] font-semibold text-white ${
                          isDone ? "bg-neutral-40" : ""
                        } ${isInProgress ? "bg-blue-500" : ""} ${
                          !isDone && !isInProgress ? "bg-neutral-40" : ""
                        } rounded-full`}
                      >
                        {chapter.id}
                      </div>

                      {/* 제목 + 상태 */}
                      <div className="flex flex-col gap-0.5">
                        <p className="whitespace-nowrap text-body-lg font-medium text-text-strong">
                          {chapter.title}
                        </p>
                        {isDone && (
                          <div className="flex items-center gap-1">
                            <span className="text-label-md font-normal text-neutral-50">
                              완료
                            </span>
                            <img
                              src={checkCircleSvg}
                              alt=""
                              width={16}
                              height={16}
                            />
                          </div>
                        )}
                        {isInProgress && (
                          <span className="text-label-md font-medium text-blue-500">
                            진행 중
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 레슨 수 + 화살표 */}
                    <div className="flex shrink-0 items-center gap-1 text-label-md font-normal text-neutral-50">
                      <span>{chapter.lessonCount}</span>
                      <img
                        src={isExpanded ? arrowUpSvg : arrowDownSvg}
                        alt=""
                        width={16}
                        height={16}
                      />
                    </div>
                  </button>

                  {/* 서브 레슨 목록 (펼쳐진 경우) */}
                  {isExpanded && chapter.lessons.length > 0 && (
                    <div className="relative flex flex-col gap-6 px-4 py-3">
                      <div className="absolute bottom-[30px] left-[34px] top-0 w-px bg-neutral-20" />
                      {chapter.lessons.map((lesson, i) => (
                        <div
                          key={i}
                          className="relative flex items-center gap-3"
                        >
                          <img
                            src={i === 0 ? dotActiveSvg : dotInactiveSvg}
                            alt=""
                            width={36}
                            height={36}
                            className="z-[1] shrink-0"
                          />
                          <span className="text-body-sm font-medium text-text-normal">
                            {i + 1}. {lesson.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
