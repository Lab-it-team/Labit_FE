import { useState, useEffect } from "react";
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
  const [expanded, setExpanded] = useState<number[]>([2]);

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
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
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
              <span>2</span>
              <span>/</span>
              <span>6</span>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="닫기">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.6569 6.3424C17.4693 6.15486 17.215 6.04951 16.9497 6.04951C16.6845 6.04951 16.4302 6.15486 16.2426 6.3424L12 10.585L7.75736 6.3424C7.56982 6.15486 7.31547 6.04951 7.05025 6.04951C6.78504 6.04951 6.53068 6.15486 6.34315 6.3424C6.15561 6.52994 6.05025 6.78429 6.05025 7.04951C6.05025 7.31472 6.15561 7.56908 6.34315 7.75661L10.5858 11.9993L6.34315 16.2419C6.15561 16.4294 6.05025 16.6838 6.05025 16.949C6.05025 17.2142 6.15561 17.4686 6.34315 17.6561C6.53068 17.8436 6.78504 17.949 7.05025 17.949C7.31547 17.949 7.56982 17.8436 7.75736 17.6561L12 13.4135L16.2426 17.6561C16.4302 17.8436 16.6845 17.949 16.9497 17.949C17.215 17.949 17.4693 17.8436 17.6569 17.6561C17.8444 17.4686 17.9497 17.2142 17.9497 16.949C17.9497 16.6838 17.8444 16.4294 17.6569 16.2419L13.4142 11.9993L17.6569 7.75661C17.8444 7.56908 17.9497 7.31472 17.9497 7.04951C17.9497 6.78429 17.8444 6.52994 17.6569 6.3424Z" fill="#4E4F52"/>
            </svg>
          </button>
        </div>

        {/* 챕터 목록 */}
        <div className="flex flex-col pb-4 max-h-[calc(100vh-160px)] overflow-y-auto gap-3 px-4">
          {chapters.map((chapter) => {
            const isExpanded = expanded.includes(chapter.id);
            const isDone = chapter.status === "done";
            const isInProgress = chapter.status === "in-progress";

            return (
              <div key={chapter.id}>
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

                  {/* 레슨 수 + 화살표 */}
                  <div className="flex items-center gap-1 text-caption-lg font-normal text-neutral-50 shrink-0">
                    <span>{chapter.lessonCount}</span>
                    <img
                      src={isExpanded ? arrowDownSvg : arrowUpSvg}
                      alt=""
                      width={20}
                      height={20}
                    />
                  </div>
                </button>

                {/* 서브 레슨 */}
                {isExpanded && chapter.lessons.length > 0 && (
                  <div className="relative flex flex-col gap-3 px-4 py-3">
                    <div className="absolute left-[34px] top-0 bottom-[30px] w-px bg-neutral-20" />
                    {chapter.lessons.map((lesson, i) => (
                      <div key={i} className="relative flex items-center gap-3">
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
