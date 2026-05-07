import { useNavigate } from 'react-router'
import homeSvg from '@/assets/Icon/home.svg'
import listSvg from '@/assets/Icon/list.svg'
import leftSvg from '@/assets/Icon/left.svg'
import rightSvg from '@/assets/Icon/right.svg'
import multiplySvg from '@/assets/Icon/multiply.svg'

interface LessonHeaderProps {
  lessonLabel: string
  lessonTitle: string
  progressWidth: string
  progressPercent: number
  showProgressBadge: boolean
  onCloseProgressBadge: () => void
  nextLesson?: { label: string; path: string }
}

export default function LessonHeader({
  lessonLabel,
  lessonTitle,
  progressWidth,
  progressPercent,
  showProgressBadge,
  onCloseProgressBadge,
  nextLesson,
}: LessonHeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-border-light">
      <div className="flex items-center justify-between px-10 h-[60px]">

        {/* 왼쪽 */}
        <div className="flex items-center gap-1 flex-1">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-neutral-10 transition-colors"
          >
            <img src={homeSvg} alt="" width={20} height={20} />
            <span className="text-label-xl font-semibold text-text-normal">홈</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-neutral-10 transition-colors"
          >
            <img src={listSvg} alt="" width={24} height={24} />
            <span className="text-label-xl font-semibold text-text-normal">학습 목록</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-neutral-10 transition-colors"
          >
            <img src={leftSvg} alt="" width={24} height={24} />
            <span className="text-label-xl font-semibold text-text-normal">이전</span>
          </button>
        </div>

        {/* 중앙 제목 */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-label-lg font-medium text-text-normal">{lessonLabel}</span>
          <span className="text-body-md font-medium text-text-strong">{lessonTitle}</span>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <div className="w-8 h-8 rounded-full bg-neutral-20 border border-border-light shrink-0" />
          <button
            type="button"
            className="flex items-center gap-1 h-[38px] px-2 py-1.5 rounded-lg border border-border-normal bg-neutral-5 text-label-md font-medium text-text-normal hover:bg-neutral-10 transition-colors"
          >
            자유 실험실
          </button>
          {nextLesson && (
            <button
              type="button"
              onClick={() => navigate(nextLesson.path)}
              className="flex items-center gap-1 h-[38px] px-2 py-1.5 rounded-lg border border-border-normal bg-neutral-5 text-label-md font-medium text-text-normal hover:bg-neutral-10 transition-colors"
            >
              {nextLesson.label}
              <img src={rightSvg} alt="" width={16} height={16} />
            </button>
          )}
        </div>
      </div>

      {/* 진행률 게이지 */}
      <div className="relative h-1 bg-neutral-10 w-full">
        <div
          className="absolute left-0 top-0 h-full bg-blue-500 rounded-r transition-all duration-300"
          style={{ width: progressWidth }}
        />
        {showProgressBadge && (
          <div
            className="absolute top-2 flex items-center gap-1.5 bg-neutral-10 rounded-full px-2 py-1 transition-all duration-300"
            style={{ left: progressWidth }}
          >
            <div className="flex items-center gap-0.5">
              <span className="text-label-sm font-medium text-text-normal">진행률</span>
              <span className="text-label-lg font-semibold text-blue-500">
                {String(progressPercent).padStart(2, '0')}
              </span>
              <span className="text-label-sm font-medium text-text-normal">%</span>
            </div>
            <button type="button" onClick={onCloseProgressBadge}>
              <img src={multiplySvg} alt="닫기" width={16} height={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
