import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import failSvg from "@/assets/icons/fail.svg";
import checkCircleSvg from "@/assets/icons/check-c.svg";
import arrowUpSvg from "@/assets/icons/arrow/up.svg";
import arrowDownSvg from "@/assets/icons/arrow/down.svg";
import dotActiveSvg from "@/assets/icons/dot-active.svg";
import dotInactiveSvg from "@/assets/icons/dot-inactive.svg";
import { chapters } from "@/data/chapters";

interface CourseModalProps {
  onClose: () => void;
}

const CLOSE_DURATION_MS = 150;

export default function CourseModal({ onClose }: CourseModalProps) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const requestClose = () => {
    setClosing(true);
    setTimeout(onClose, CLOSE_DURATION_MS);
  };

  const goToChapter = (path: string, page?: number) => {
    setClosing(true);
    setTimeout(() => {
      navigate(path, page ? { state: { page } } : undefined);
      onClose();
    }, CLOSE_DURATION_MS);
  };

  const completedCount = chapters.filter((c) => c.status === "done").length;
  const totalCount = chapters.reduce((sum, c) => sum + c.lessonCount, 0);

  const inProgressId = chapters.find((c) => c.status === "in-progress")?.id;
  const [expanded, setExpanded] = useState<number[]>(() => (inProgressId !== undefined ? [inProgressId] : []));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (id: number, lessonCount: number) => {
    if (lessonCount === 0) return;
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const panelVisible = visible && !closing;

  return (
    <div className="fixed inset-0 z-30" onClick={requestClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="학습 목록"
        className={`absolute left-6 top-[79px] w-[436px] bg-white rounded-3xl shadow-[0px_0px_7.5px_rgba(0,0,0,0.08)] border border-border-normal overflow-hidden transition-all duration-150 ease-out ${
          panelVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
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
            onClick={requestClose}
            className="shrink-0 size-[24px]"
            aria-label="닫기"
          >
            <img src={failSvg} alt="" width={24} height={24} className="size-full" />
          </button>
        </div>

        {/* 챕터 목록 */}
        <div className="flex flex-col pb-4 max-h-[calc(100vh-160px)] overflow-y-auto px-4">
          {chapters.map((chapter) => {
            const isExpanded = expanded.includes(chapter.id);
            const isDone = chapter.status === "done";
            const isInProgress = chapter.status === "in-progress";
            const hasLessons = chapter.lessonCount > 0;

            return (
              <div key={chapter.id}>
                {/* 챕터 행: 레슨이 있으면 펼치기/접기, 없으면(단원 퀴즈 등) 바로 이동 */}
                <button
                  type="button"
                  onClick={() => {
                    if (hasLessons) toggle(chapter.id, chapter.lessonCount);
                    else goToChapter(chapter.path);
                  }}
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
                            className="absolute left-[18px] top-1/2 w-px -translate-x-1/2 bg-neutral-20"
                            style={{ height: "calc(100% + 12px)" }}
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => goToChapter(chapter.path, lesson.page)}
                          className="relative z-[1] flex items-center gap-3 text-left"
                        >
                          <img
                            src={lesson.inProgress ? dotActiveSvg : dotInactiveSvg}
                            alt=""
                            width={36}
                            height={36}
                            className="shrink-0"
                          />
                          <span className="text-body-sm font-medium text-text-normal">
                            {lesson.title}
                          </span>
                        </button>
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
