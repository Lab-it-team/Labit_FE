import rightSvg from "@/assets/Icon/right.svg";

interface LessonFooterProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPageChange: (page: number) => void;
}

function PageIndicator({
  current,
  total,
  onPageChange,
}: {
  current: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onPageChange(i + 1)}
          className={`w-6 h-6 rounded-md flex items-center justify-center text-label-sm font-medium transition-colors ${
            i + 1 === current
              ? "bg-neutral-90 text-white"
              : "bg-neutral-10 text-neutral-50"
          }`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}

export default function LessonFooter({
  currentPage,
  totalPages,
  onPrev,
  onNext,
  onPageChange,
}: LessonFooterProps) {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-border-normal bg-white/95 backdrop-blur-sm">
      <div className="flex items-center gap-6 px-6 h-[60px]">
        <button
          type="button"
          onClick={onPrev}
          disabled={currentPage === 1}
          className={`flex-1 flex items-center justify-center py-2 rounded-lg text-label-xl font-semibold ${
            currentPage === 1 ? "text-neutral-50" : "text-text-normal"
          }`}
        >
          이전
        </button>

        <PageIndicator
          current={currentPage}
          total={totalPages}
          onPageChange={onPageChange}
        />

        <button
          type="button"
          onClick={onNext}
          className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-label-xl font-semibold text-text-normal"
        >
          다음
          <img src={rightSvg} alt="" width={24} height={24} />
        </button>
      </div>
    </footer>
  );
}
