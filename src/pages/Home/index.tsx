import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import arrowRightSvg from "@/assets/icons/right.svg";
import arrowDownSvg from "@/assets/icons/arrow/down.svg";
import arrowUpSvg from "@/assets/icons/arrow/up.svg";
import checkCircleSvg from "@/assets/icons/check-c.svg";
import dotActiveSvg from "@/assets/icons/dot-active.svg";
import dotInactiveSvg from "@/assets/icons/dot-inactive.svg";
import { useUnits } from "@/queries/learning";
import { useMe } from "@/queries/user";
import { chapters } from "@/data/chapters";

export default function Home() {
  const navigate = useNavigate();
  const { data: homeData } = useUnits();
  const { data: me } = useMe();

  const progressRate = Math.round(homeData?.progress_rate ?? 0);

  const inProgressId = chapters.find((c) => c.status === "in-progress")?.id;
  const [expanded, setExpanded] = useState<number[]>([]);

  useEffect(() => {
    if (inProgressId !== undefined) {
      setExpanded([inProgressId]);
    }
  }, [inProgressId]);

  const completedCount = chapters.filter((c) => c.status === "done").length;
  const totalCount = chapters.reduce((sum, c) => sum + c.lessonCount, 0);

  const toggleChapter = (id: number, lessonCount: number) => {
    if (lessonCount === 0) return;
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="flex min-h-full flex-col gap-20 bg-neutral-5 px-10 py-[60px]">
      {/* 인사말 */}
      <div className="flex flex-col gap-3">
        <h1 className="text-heading-lg font-bold text-text-strong">
          안녕하세요, {me?.nickname ?? ""}님!
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
                  {progressRate}
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
                  <span>
                    {completedCount} / {totalCount}
                  </span>
                </p>
              </div>
            </div>

            {/* 이어하기 버튼 */}
            <button
              type="button"
              onClick={() => navigate("/ionic-concept")}
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
              const hasLessons = chapter.lessonCount > 0;

              return (
                <div key={chapter.id}>
                  {/* 챕터 행 */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleChapter(chapter.id, chapter.lessonCount)
                    }
                    className={`flex w-full items-center justify-between rounded-xl p-3 text-left transition-colors ${
                      isInProgress ? "bg-bg-elevate" : "bg-transparent"
                    }`}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      {/* 번호 배지 */}
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center text-[14px]/[20px] font-semibold text-white ${
                          isInProgress ? "bg-blue-500" : "bg-neutral-40"
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

                    {/* 레슨 수 + 화살표 (레슨이 있을 때만) */}
                    {hasLessons && (
                      <div className="flex shrink-0 items-center gap-1 text-label-md font-normal text-neutral-50">
                        <span>{chapter.lessonCount}</span>
                        <img
                          src={isExpanded ? arrowDownSvg : arrowUpSvg}
                          alt=""
                          width={20}
                          height={20}
                        />
                      </div>
                    )}
                  </button>

                  {/* 서브 레슨 목록 (펼쳐진 경우) */}
                  {isExpanded && chapter.lessons.length > 0 && (
                    <div className="flex flex-col gap-3 py-3 pr-4" style={{ paddingLeft: 6 }}>
                      {chapter.lessons.map((lesson, i) => (
                        <div
                          key={`${chapter.id}-${i}`}
                          className="relative flex items-center gap-3"
                        >
                          {i < chapter.lessons.length - 1 && (
                            <div
                              className="absolute left-[18px] top-1/2 w-px bg-neutral-20"
                              style={{ height: "calc(100% + 12px)" }}
                            />
                          )}
                          <img
                            src={lesson.inProgress ? dotActiveSvg : dotInactiveSvg}
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
