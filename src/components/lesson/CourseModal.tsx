import { useState, useEffect } from "react";
import failSvg from "@/assets/Icon/fail.svg";
import checkCircleSvg from "@/assets/Icon/check-c.svg";
import arrowUpSvg from "@/assets/Icon/Arrow/up.svg";
import arrowDownSvg from "@/assets/Icon/Arrow/down.svg";
import dotActiveSvg from "@/assets/Icon/dot-active.svg";
import dotInactiveSvg from "@/assets/Icon/dot-inactive.svg";
import { chapters } from "@/data/chapters";

interface CourseModalProps {
  onClose: () => void;
}

export default function CourseModal({ onClose }: CourseModalProps) {
  const completedCount = chapters.filter((c) => c.status === "done").length;
  const totalCount = chapters.reduce((sum, c) => sum + c.lessonCount, 0);

  const inProgressId = chapters.find((c) => c.status === "in-progress")?.id;
  const [expanded, setExpanded] = useState<number[]>([]);

  useEffect(() => {
    if (inProgressId !== undefined) {
      setExpanded([inProgressId]);
    }
  }, [inProgressId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const toggle = (id: number, lessonCount: number) => {
    if (lessonCount === 0) return;
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <div className="fixed inset-0 z-30" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="학습 목록"
        className="absolute left-6 top-[79px] w-[436px] bg-white rounded-3xl shadow-[0px_0px_7.5px_rgba(0,0,0,0.08)] border border-border-normal overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4">
          <div className="flex flex-col gap-1.5 px-3">
            <h2 className="text-heading-md font-bold text-text-strong">
              원자와 화학 결합
            </h2>
            <div className="flex items-center gap-1 text-caption-lg font-normal text-neutral-50">
              <span>학습 완료</span>
              <span>{completedCount}</span>
              <span>/</span>
              <span>{totalCount}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 size-[24px]"
            aria-label="닫기"
          >
            <img src={failSvg} alt="" width={24} height={24} className="size-full" />
          </button>
        </div>

        {/* 챕터 목록 */}
        <div className="flex flex-col pb-4 max-h-[calc(100vh-160px)] overflow-y-auto px-4">
          {chapters.map((chapter, idx) => {
            const isExpanded = expanded.includes(chapter.id);
            const isDone = chapter.status === "done";
            const isInProgress = chapter.status === "in-progress";
            const hasLessons = chapter.lessonCount > 0;

            return (
              <div key={chapter.id}>
                {idx > 0 && (
                  <div className="border-t border-dashed border-border-light mx-1" />
                )}
                {/* 챕터 행 */}
                <button
                  type="button"
                  onClick={() => toggle(chapter.id, chapter.lessonCount)}
                  className={`flex w-full items-center justify-between px-3 py-3 rounded-xl text-left transition-colors ${
                    isInProgress ? "bg-neutral-10" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`flex size-6 shrink-0 items-center justify-center text-label-lg font-semibold text-white ${
                        isInProgress
                          ? "bg-blue-500 rounded-xl"
                          : "bg-neutral-40 rounded-full"
                      }`}
                    >
                      {chapter.id}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <p className="text-body-lg font-medium text-text-strong">
                        {chapter.title}
                      </p>
                      {isDone && (
                        <div className="flex items-center gap-1">
                          <span className="text-caption-lg font-medium text-neutral-50">
                            완료
                          </span>
                          <img src={checkCircleSvg} alt="" width={16} height={16} />
                        </div>
                      )}
                      {isInProgress && (
                        <span className="text-caption-lg font-medium text-blue-500">
                          진행 중
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 레슨 수 + 화살표 (레슨이 있을 때만) */}
                  {hasLessons && (
                    <div className="flex items-center gap-1 text-caption-lg font-normal text-neutral-50 shrink-0">
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

                {/* 서브 레슨 */}
                {isExpanded && chapter.lessons.length > 0 && (
                  <div className="flex flex-col gap-3 py-3 pr-4" style={{ paddingLeft: 6 }}>
                    {chapter.lessons.map((lesson, i) => (
                      <div key={lesson.id} className="relative flex items-center gap-3">
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
  );
}
