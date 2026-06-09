import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import LessonHeader from "@/components/lesson/LessonHeader";
import LessonFooter from "@/components/lesson/LessonFooter";
import ContentTab from "@/components/lesson/ContentTab";
import CourseModal from "@/components/lesson/CourseModal";
import AiChat, { removeHighlight } from "@/components/lesson/AiChat";
import AiAssistPanel from "@/components/lesson/AiAssistPanel";
import AiFab from "@/components/lesson/AiFab";
import LoginRequiredModal from "@/components/common/LoginRequiredModal";
import FormationContent from "@/components/lesson/FormationContent";
import { useTextSelection } from "@/hooks/useTextSelection";
import { useAuthStore } from "@/stores/authStore";

const TOTAL_PAGES = 4;

const studyContent = {
  title: "이온 결합이란?",
  body: [
    "양이온과 음이온이 정전기적 인력(쿨롱 힘)에 의해 서로 끌어당겨 결합하는 것입니다.",
    "주로 금속 원소와 비금속 원소 사이에서 형성됩니다.",
    "금속 원자는 전자를 잃어 양이온이 되고, 비금속 원자는 전자를 얻어 음이온이 됩니다.",
    "이 두 이온이 만나면 강한 인력이 발생하며 안정한 화합물을 이룹니다.",
  ],
  tip: {
    label: "핵심 원리",
    text: "반대 전하는 서로를 끌어당깁니다. (+)와 (-)가 가까워질수록 더 강한 인력이 작용하며, 이것이 이온 결합의 본질입니다.",
  },
};

function StudyCard() {
  return (
    <div className="bg-white border border-border-light rounded-3xl p-6 flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        <h2 className="text-heading-md text-text-strong">
          {studyContent.title}
        </h2>
        <div className="flex flex-col gap-0">
          {studyContent.body.map((line, i) => (
            <p
              key={i}
              className="text-body-md text-text-normal"
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      <div className="bg-bg-color rounded-xl px-4 py-3 flex flex-col gap-1.5">
        <p className="text-caption-lg text-text-sub">
          {studyContent.tip.label}
        </p>
        <p className="text-label-xl text-text-primary">
          {studyContent.tip.text}
        </p>
      </div>
    </div>
  );
}

export default function IonicConcept() {
  const navigate = useNavigate();
  const isLoggedIn = !!useAuthStore((s) => s.accessToken);
  const [activeTab, setActiveTab] = useState<"learn" | "practice">("learn");
  const [currentPage, setCurrentPage] = useState(1);
  const [showProgressBadge, setShowProgressBadge] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [assistPanel, setAssistPanel] = useState<{
    key: number;
    question: string;
    selectedText: string;
    x: number;
    y: number;
  } | null>(null);
  const assistPanelKeyRef = useRef(0);
  const { selection, popupRef, clear } = useTextSelection();

  useEffect(() => {
    if (!completed) return;
    const timer = setTimeout(() => navigate("/"), 600);
    return () => clearTimeout(timer);
  }, [completed, navigate]);

  const progressPercent = completed
    ? 100
    : Math.round(((currentPage - 1) / TOTAL_PAGES) * 100);
  const progressWidth = `${progressPercent}%`;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-5">
      <LessonHeader
        lessonLabel="2-1."
        lessonTitle="이온 결합 학습"
        progressWidth={progressWidth}
        progressPercent={progressPercent}
        showProgressBadge={showProgressBadge}
        onCloseProgressBadge={() => setShowProgressBadge(false)}
        nextLesson={{ label: "공유 결합 학습", path: "/covalent-concept" }}
        onListClick={() => setShowCourseModal(true)}
      />
      {showCourseModal && <CourseModal onClose={() => setShowCourseModal(false)} />}
      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}

      {assistPanel && (
        <AiAssistPanel
          key={assistPanel.key}
          selectedText={assistPanel.selectedText}
          initialQuestion={assistPanel.question}
          onClose={() => { setAssistPanel(null); removeHighlight(); }}
          className="fixed z-50"
          style={{
            left: assistPanel.x,
            top: assistPanel.y,
            transform: 'translateX(-50%)',
          }}
        />
      )}

      {selection && (
        <AiChat
          ref={popupRef}
          className="fixed z-40"
          style={{
            left: selection.x,
            top: selection.bottom + 8,
            transform: 'translateX(-50%)',
          }}
          onSend={(q) => {
            if (!isLoggedIn) {
              clear();
              removeHighlight();
              setShowLoginModal(true);
              return;
            }
            const PANEL_H = 371;
            const PANEL_W = 334;
            const spaceBelow = window.innerHeight - (selection.bottom + 8);
            const y = spaceBelow >= PANEL_H
              ? selection.bottom + 8
              : Math.max(selection.top - PANEL_H - 8, 8);
            const x = Math.min(
              Math.max(selection.x, PANEL_W / 2 + 8),
              window.innerWidth - PANEL_W / 2 - 8,
            );
            setAssistPanel({ key: ++assistPanelKeyRef.current, question: q, selectedText: selection.text, x, y });
            clear();
          }}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-[80px] pb-[80px] px-4 sm:px-10 md:px-20 lg:px-[270px]">
        <div className="w-full max-w-[900px] flex flex-col gap-14 pt-10">
          <ContentTab
            active={activeTab}
            onChange={(v) => {
              if (v === "practice") navigate("/ionic-lab");
              else setActiveTab(v);
            }}
          />
          {currentPage === 1 && <StudyCard />}
          {currentPage === 2 && <FormationContent />}
          {currentPage > 2 && (
            <div className="bg-white border border-border-light rounded-3xl p-6 text-text-normal text-body-md">
              준비 중이에요.
            </div>
          )}
        </div>
      </main>

      <AiFab
        showTooltip={true}
        onClick={() => {}}
        className="fixed bottom-[90px] right-10 z-30"
      />

      <LessonFooter
        currentPage={currentPage}
        totalPages={TOTAL_PAGES}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => {
          if (currentPage < TOTAL_PAGES) {
            setCurrentPage((p) => p + 1);
          } else {
            setCompleted(true);
          }
        }}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
