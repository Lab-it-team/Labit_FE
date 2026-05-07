import { useState } from 'react'
import { useNavigate } from 'react-router'
import rightSvg from '@/assets/Icon/right.svg'
import LessonHeader from '@/components/lesson/LessonHeader'

const TOTAL_PAGES = 4
const PROGRESS_PERCENT = 0

const studyContent = {
  title: '이온 결합이란?',
  body: [
    '양이온과 음이온이 정전기적 인력(쿨롱 힘)에 의해 서로 끌어당겨 결합하는 것입니다.',
    '주로 금속 원소와 비금속 원소 사이에서 형성됩니다.',
    '금속 원자는 전자를 잃어 양이온이 되고, 비금속 원자는 전자를 얻어 음이온이 됩니다.',
    '이 두 이온이 만나면 강한 인력이 발생하며 안정한 화합물을 이룹니다.',
  ],
  tip: {
    label: '핵심 원리',
    text: '반대 전하는 서로를 끌어당깁니다. (+)와 (-)가 가까워질수록 더 강한 인력이 작용하며, 이것이 이온 결합의 본질입니다.',
  },
}

function ContentTab({
  active,
  onChange,
}: {
  active: 'learn' | 'practice'
  onChange: (v: 'learn' | 'practice') => void
}) {
  return (
    <div className="flex items-center bg-neutral-10 rounded-lg p-1.5 self-center">
      <button
        type="button"
        onClick={() => onChange('learn')}
        className={`px-4 py-1.5 rounded-lg text-label-lg font-semibold transition-all ${
          active === 'learn'
            ? 'bg-white shadow-sm text-text-strong'
            : 'text-neutral-50'
        }`}
      >
        학습하기
      </button>
      <button
        type="button"
        onClick={() => onChange('practice')}
        className={`px-4 py-1.5 rounded-lg text-label-lg font-semibold transition-all ${
          active === 'practice'
            ? 'bg-white shadow-sm text-text-strong'
            : 'text-neutral-50'
        }`}
      >
        실습하기
      </button>
    </div>
  )
}

function StudyCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md font-bold text-text-strong">{studyContent.title}</h2>
        <div className="flex flex-col gap-0">
          {studyContent.body.map((line, i) => (
            <p key={i} className="text-body-md font-medium text-text-normal leading-[25px]">
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="bg-blue-10 rounded-xl px-4 py-3 flex flex-col gap-1.5">
        <p className="text-caption-lg text-neutral-50">{studyContent.tip.label}</p>
        <p className="text-label-xl font-semibold text-blue-500">{studyContent.tip.text}</p>
      </div>
    </div>
  )
}

function PageIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-6 h-6 rounded-md flex items-center justify-center text-caption-sm font-medium ${
            i + 1 === current
              ? 'bg-neutral-80 text-white'
              : 'bg-neutral-10 text-neutral-50'
          }`}
        >
          {i + 1}
        </div>
      ))}
    </div>
  )
}

export default function IonicConcept() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'learn' | 'practice'>('learn')
  const [currentPage, setCurrentPage] = useState(1)
  const [showProgressBadge, setShowProgressBadge] = useState(true)

  const progressWidth = `${((currentPage - 1) / (TOTAL_PAGES - 1)) * 100}%`

  return (
    <div className="min-h-screen flex flex-col bg-neutral-5">

      <LessonHeader
        lessonLabel="2-1."
        lessonTitle="이온 결합 학습"
        progressWidth={progressWidth}
        progressPercent={PROGRESS_PERCENT}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        nextLesson={{ label: '공유 결합 학습', path: '/covalent-concept' }}
      />

      {/* ── Main Content ── */}
      <main className="flex-1 flex flex-col items-center pt-[80px] pb-[80px] px-4 sm:px-10 md:px-20 lg:px-[270px]">
        <div className="w-full max-w-[900px] flex flex-col gap-14 pt-10">
          <ContentTab active={activeTab} onChange={setActiveTab} />
          {activeTab === 'learn' ? (
            <StudyCard />
          ) : (
            <div className="bg-white border border-border-light rounded-3xl p-6 text-text-normal text-body-md">
              실습 화면 준비 중이에요.
            </div>
          )}
        </div>
      </main>

      {/* ── Bottom Navigation ── */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-border-normal bg-white/95 backdrop-blur-sm">
        <div className="flex items-center gap-6 px-6 h-[60px]">
          <button
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex-1 flex items-center justify-center py-2 rounded-lg text-label-xl font-semibold text-neutral-50 disabled:opacity-30 hover:text-text-normal transition-colors"
          >
            이전
          </button>

          <PageIndicator current={currentPage} total={TOTAL_PAGES} />

          <button
            type="button"
            onClick={() => {
              if (currentPage < TOTAL_PAGES) {
                setCurrentPage(p => p + 1)
              } else {
                navigate('/')
              }
            }}
            className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-label-xl font-semibold text-text-normal hover:text-blue-500 transition-colors"
          >
            다음
            <img src={rightSvg} alt="" width={24} height={24} />
          </button>
        </div>
      </footer>
    </div>
  )
}
