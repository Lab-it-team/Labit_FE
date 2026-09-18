import { useState } from "react";
import { useNavigate } from "react-router";
import homeSvg from "@/assets/icons/home.svg";
import listSvg from "@/assets/icons/list.svg";
import leftSvg from "@/assets/icons/left.svg";
import multiplySvg from "@/assets/icons/multiply.svg";
import rightSvg from "@/assets/icons/right.svg";
import downSvg from "@/assets/icons/arrow/down.svg";
import aiFeedbackSvg from "@/assets/icons/si_ai-edit-alt-2-fill.png";
import CourseModal from "@/components/lesson/CourseModal";
import AiFab from "@/components/lesson/AiFab";
import LoginRequiredModal from "@/components/common/LoginRequiredModal";
import { useAuthStore } from "@/stores/authStore";
import { useQuizzes, useSubmitQuiz } from "@/queries/quiz";
import { getResultDetail } from "@/features/quiz/api";
import type { QuizAnswerDetail } from "@/types";

export default function Quiz() {
  const navigate = useNavigate();
  const isLoggedIn = !!useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  const { data: quizzes, isLoading, isError } = useQuizzes();
  const submitQuiz = useSubmitQuiz();

  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProgressBadge, setShowProgressBadge] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [questionResults, setQuestionResults] = useState<Record<number, QuizAnswerDetail>>({});
  const [isChecking, setIsChecking] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showWrongNotes, setShowWrongNotes] = useState(true);
  const [viewQuestionIndex, setViewQuestionIndex] = useState<number | null>(null);
  const [modalSelected, setModalSelected] = useState<number | undefined>(undefined);
  const [modalResult, setModalResult] = useState<QuizAnswerDetail | undefined>(undefined);
  const [modalChecking, setModalChecking] = useState(false);

  const total = quizzes?.length ?? 0;
  const current = quizzes?.[currentIndex];
  const checkedCount = Object.keys(questionResults).length;
  const progressPercent = total > 0 ? Math.round((checkedCount / total) * 100) : 0;
  const isLast = currentIndex === total - 1;
  const selected = current ? answers[current.id] : undefined;
  const checkedResult = current ? questionResults[current.id] : undefined;
  const canCheck = selected !== undefined && !checkedResult;
  const allChecked = total > 0 && checkedCount === total;
  const correctCount = Object.values(questionResults).filter((r) => r.is_correct).length;
  const wrongCount = total - correctCount;
  const accuracyPercent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const resultMessage = accuracyPercent >= 80 ? "잘 하셨어요!" : accuracyPercent >= 50 ? "조금 더 힘내볼까요?" : "다시 도전해봐요!";
  const wrongResults = quizzes
    ? quizzes.map((q) => questionResults[q.id]).filter((r): r is QuizAnswerDetail => !!r && !r.is_correct)
    : [];

  const handleSelect = (optionIndex: number) => {
    if (!current || checkedResult) return;
    setAnswers((prev) => ({ ...prev, [current.id]: optionIndex }));
  };

  const handleCheckAnswer = async () => {
    if (!current || selected === undefined || checkedResult) return;
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setIsChecking(true);
    try {
      const res = await submitQuiz.mutateAsync([{ quiz_id: current.id, selected_answer: selected }]);
      const detail = await getResultDetail(res.id);
      const answerDetail = detail.answers.find((a) => String(a.quiz_id) === String(current.id));
      if (answerDetail) {
        setQuestionResults((prev) => ({ ...prev, [current.id]: answerDetail }));
      } else {
        console.error(`정답 확인 실패: getResultDetail 응답에서 quiz_id=${current.id}를 찾지 못함`, detail);
      }
    } catch (err) {
      console.error("정답 확인 실패:", err);
    } finally {
      setIsChecking(false);
    }
  };

  const handleAdvance = () => {
    if (!checkedResult) return;
    if (!isLast) {
      setCurrentIndex((i) => i + 1);
      return;
    }
    setShowSummary(true);
  };

  const handlePrevious = () => {
    if (!checkedResult || currentIndex === 0) return;
    setCurrentIndex((i) => i - 1);
  };

  const handleRetry = () => {
    setAnswers({});
    setQuestionResults({});
    setCurrentIndex(0);
    setShowSummary(false);
  };

  const handleViewQuestion = (quizId: number) => {
    if (!quizzes) return;
    const idx = quizzes.findIndex((q) => q.id === quizId);
    if (idx === -1) return;
    setModalSelected(undefined);
    setModalResult(undefined);
    setViewQuestionIndex(idx);
  };

  const closeViewModal = () => {
    setViewQuestionIndex(null);
    setModalSelected(undefined);
    setModalResult(undefined);
  };

  const handleModalCheckAnswer = async () => {
    if (viewQuestionIndex === null || !quizzes) return;
    const q = quizzes[viewQuestionIndex];
    if (!q || modalSelected === undefined || modalResult) return;
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    setModalChecking(true);
    try {
      const res = await submitQuiz.mutateAsync([{ quiz_id: q.id, selected_answer: modalSelected }]);
      const detail = await getResultDetail(res.id);
      const answerDetail = detail.answers.find((a) => String(a.quiz_id) === String(q.id));
      if (answerDetail) {
        setModalResult(answerDetail);
        setQuestionResults((prev) => ({ ...prev, [q.id]: answerDetail }));
      } else {
        console.error(`정답 확인 실패: getResultDetail 응답에서 quiz_id=${q.id}를 찾지 못함`, detail);
      }
    } catch (err) {
      console.error("정답 확인 실패:", err);
    } finally {
      setModalChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-5">
      {showCourseModal && <CourseModal onClose={() => setShowCourseModal(false)} />}
      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}
      {viewQuestionIndex !== null && quizzes?.[viewQuestionIndex] && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "var(--color-bg-overlay)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={closeViewModal}
        >
          <div
            className="flex flex-col items-start gap-6"
            style={{
              width: 426,
              maxHeight: "calc(100vh - 80px)",
              overflowY: "auto",
              padding: 40,
              background: "var(--color-static-white)",
              boxShadow: "0px 0px 117.6px var(--color-shadow-modal)",
              borderRadius: 24,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between">
              <h3 className="text-heading-md font-bold text-text-strong m-0">문제 다시보기</h3>
              <button
                type="button"
                onClick={closeViewModal}
                className="flex items-center justify-center"
                style={{ width: 24, height: 24, background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M13 1L1 13M1 1L13 13" stroke="var(--color-text-normal)" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="w-full flex flex-col items-start gap-3">
              <span className="text-label-lg font-semibold text-text-normal rounded-full border border-border-strong px-3 py-1">
                {viewQuestionIndex + 1} / {total}
              </span>
              <p className="text-body-xl font-medium text-text-strong m-0">
                <span className="text-text-sub mr-1">Q.</span>
                {quizzes[viewQuestionIndex].question}
              </p>
            </div>

            <div className="w-full flex flex-col gap-3">
              {quizzes[viewQuestionIndex].options.map((option, i) => {
                const isModalSelected = modalSelected === i;
                const isModalCorrectOption = modalResult?.answer === i;
                const isModalWrongSelected = !!modalResult && isModalSelected && !isModalCorrectOption;

                let background = "var(--color-bg-elevate)";
                let badgeBg = "var(--color-neutral-20)";
                if (modalResult) {
                  if (isModalCorrectOption) {
                    background = "var(--color-element-hover-fill-mint)";
                    badgeBg = "var(--color-status-positive)";
                  } else if (isModalWrongSelected) {
                    background = "var(--color-element-light-red)";
                    badgeBg = "var(--color-status-negative)";
                  }
                } else if (isModalSelected) {
                  background = "var(--color-primary-normal)";
                  badgeBg = "var(--color-element-drag-fill-blue)";
                }

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => !modalResult && setModalSelected(i)}
                    disabled={!!modalResult}
                    className="w-full flex items-center justify-between gap-1.5 rounded-xl p-3 text-left transition-colors"
                    style={{ background, border: "1px solid transparent" }}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className="flex items-center justify-center w-6 h-6 rounded-full text-caption-sm font-medium text-text-sub shrink-0"
                        style={{
                          background: badgeBg,
                          color: modalResult && (isModalCorrectOption || isModalWrongSelected) ? "var(--color-static-white)" : "var(--color-text-sub)",
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="text-body-sm font-medium"
                        style={{ color: !modalResult && isModalSelected ? "var(--color-static-white)" : "var(--color-text-normal)" }}
                      >
                        {option}
                      </span>
                    </span>
                    {isModalCorrectOption && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                        <path d="M20 6L9 17L4 12" stroke="var(--color-status-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {isModalWrongSelected && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                        <path d="M18 6L6 18" stroke="var(--color-status-negative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M6 6L18 18" stroke="var(--color-status-negative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>

            {modalResult ? (
              modalResult.explanation && (
                <div
                  className="w-full flex flex-col items-start gap-3 p-6 rounded-xl"
                  style={{ background: "var(--color-element-drag-fill-blue)", border: "1px solid var(--color-primary-normal)" }}
                >
                  <span className="inline-flex items-center gap-1 bg-white rounded-full px-2 py-1.5">
                    <img src={aiFeedbackSvg} alt="" width={20} height={20} />
                    <span className="text-label-lg font-semibold text-primary-normal">AI 피드백</span>
                  </span>
                  <p className="text-body-sm font-medium text-text-normal m-0">{modalResult.explanation}</p>
                </div>
              )
            ) : (
              <div className="w-full flex justify-end">
                <button
                  type="button"
                  disabled={modalSelected === undefined || modalChecking}
                  onClick={handleModalCheckAnswer}
                  className="h-[38px] px-4 rounded-lg text-label-md font-medium transition-colors"
                  style={{
                    background: modalSelected !== undefined ? "var(--color-primary-normal)" : "var(--color-bg-elevate)",
                    color: modalSelected !== undefined ? "var(--color-static-white)" : "var(--color-text-disabled)",
                    cursor: modalSelected !== undefined ? "pointer" : "default",
                  }}
                >
                  정답 확인
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-20 bg-white border-b border-border-light">
        <div className="flex items-center justify-between px-10 h-[60px]">
          <div className="flex items-center gap-1 flex-1">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="flex items-center gap-1 px-2.5 py-2 rounded-lg hover:bg-neutral-10 transition-colors"
            >
              <img src={homeSvg} alt="" width={20} height={20} />
              <span className="text-label-xl font-semibold text-text-normal">홈</span>
            </button>
            <button
              type="button"
              onClick={() => setShowCourseModal(true)}
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

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-body-md font-medium text-text-strong">{showSummary ? "퀴즈 결과" : "단원 퀴즈"}</span>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end">
            {user?.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-neutral-20 shrink-0" />
            )}
            <button
              type="button"
              disabled={!allChecked}
              onClick={() => navigate("/home")}
              className="flex items-center h-[38px] px-4 rounded-lg text-label-md font-medium transition-colors"
              style={{
                background: allChecked ? "var(--color-primary-normal)" : "var(--color-bg-elevate)",
                color: allChecked ? "var(--color-static-white)" : "var(--color-text-disabled)",
                cursor: allChecked ? "pointer" : "default",
              }}
            >
              학습 완료
            </button>
          </div>
        </div>

        <div className="relative h-1 bg-neutral-10 w-full">
          <div
            className="absolute left-0 top-0 h-full bg-blue-500 rounded-r transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
          {showProgressBadge && (
            <div
              className="absolute top-2 flex items-center gap-1.5 bg-neutral-10 rounded-full px-2 py-1 transition-all duration-300"
              style={{ left: `min(${progressPercent}%, calc(100% - 110px))` }}
            >
              <div className="flex items-center gap-0.5">
                <span className="text-label-sm font-medium text-text-normal">진행률</span>
                <span className="text-label-lg font-semibold text-blue-500">
                  {String(progressPercent).padStart(2, "0")}
                </span>
                <span className="text-label-sm font-medium text-text-normal">%</span>
              </div>
              <button type="button" onClick={() => setShowProgressBadge(false)}>
                <img src={multiplySvg} alt="닫기" width={16} height={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center pt-[121px] pb-[80px] px-4 sm:px-10 md:px-20 lg:px-[270px]">
        <div className="w-full max-w-[900px] flex flex-col items-center gap-[60px]">
          <div className="flex flex-col items-center gap-1">
            {showSummary ? (
              <>
                <h1 className="text-heading-md font-bold text-text-strong">퀴즈 결과</h1>
                <p className="text-body-md font-medium text-text-sub">학습 결과를 확인하고 방향을 설정해 봅시다.</p>
              </>
            ) : (
              <>
                <h1 className="text-heading-md font-bold text-text-strong">원자와 화학 결합 단원 퀴즈</h1>
                <p className="text-body-md font-medium text-text-sub">
                  총 <span className="text-primary-normal font-semibold">{total}</span> 문항
                </p>
              </>
            )}
          </div>

          {showSummary ? (
            <div className="w-full flex flex-col gap-6">
              <div className="w-full bg-white border border-border-light rounded-xl p-8 flex flex-col items-center gap-6">
                <div className="w-full flex flex-col items-center gap-4">
                  <span className="text-label-lg font-semibold text-text-normal rounded-full border border-border-strong px-3 py-1">
                    종합 성취도
                  </span>
                  <div className="flex flex-col items-center gap-1.5">
                    <p
                      className="text-heading-xl m-0"
                      style={{
                        background: "linear-gradient(90deg, var(--color-primary-normal) 0%, var(--color-primary-heavy) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {resultMessage}
                    </p>
                    <p className="text-body-xs font-medium text-text-sub m-0">
                      전체 {total} 문제 중 {correctCount} 문제를 맞혔어요.
                    </p>
                  </div>
                </div>

                <div className="w-full flex items-stretch">
                  <div className="flex-1 flex flex-col items-center gap-1.5 py-5 border-r border-border-light">
                    <span className="text-caption-lg text-text-sub">정답</span>
                    <span className="flex items-baseline gap-0.5">
                      <span className="text-heading-md text-text-normal">{correctCount}</span>
                      <span className="text-heading-sm font-medium text-text-sub">개</span>
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 py-5 border-r border-border-light">
                    <span className="text-caption-lg text-text-sub">오답</span>
                    <span className="flex items-baseline gap-0.5">
                      <span className="text-heading-md text-text-normal">{wrongCount}</span>
                      <span className="text-heading-sm font-medium text-text-sub">개</span>
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1.5 py-5">
                    <span className="text-caption-lg text-text-sub">정답률</span>
                    <span className="flex items-baseline gap-0.5">
                      <span className="text-heading-md text-text-normal">{accuracyPercent}</span>
                      <span className="text-heading-sm font-medium text-text-sub">%</span>
                    </span>
                  </div>
                </div>

                <div className="w-full flex gap-3">
                  <button
                    type="button"
                    onClick={handleRetry}
                    className="flex-1 h-11 rounded-lg text-label-xl font-semibold"
                    style={{ background: "var(--color-bg-elevate)", color: "var(--color-text-normal)" }}
                  >
                    다시 풀기
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/home")}
                    className="flex-1 h-11 rounded-lg text-label-xl font-semibold text-static-white"
                    style={{ background: "var(--color-primary-normal)" }}
                  >
                    학습 완료
                  </button>
                </div>
              </div>

              {wrongResults.length > 0 && (
                <div className="w-full flex flex-col gap-4">
                  <button
                    type="button"
                    onClick={() => setShowWrongNotes((v) => !v)}
                    className="w-full flex items-center justify-between"
                  >
                    <span className="text-label-xl font-semibold text-text-normal">오답노트({wrongResults.length})</span>
                    <img
                      src={downSvg}
                      alt=""
                      width={20}
                      height={20}
                      style={{ transform: showWrongNotes ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                    />
                  </button>
                  {showWrongNotes && (
                    <div className="flex flex-col gap-4">
                      {wrongResults.map((r) => (
                        <div key={r.quiz_id} className="w-full flex flex-col gap-4 p-8 rounded-xl border border-border-light bg-white">
                          <div className="w-full flex items-center justify-between gap-8">
                            <p className="text-body-lg font-medium text-text-strong m-0">
                              <span className="text-text-sub mr-1">
                                Q{(quizzes?.findIndex((q) => q.id === r.quiz_id) ?? 0) + 1}.
                              </span>
                              {r.question}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleViewQuestion(r.quiz_id)}
                              className="shrink-0 h-[38px] px-4 rounded-lg border border-border-strong text-label-xl font-semibold text-text-normal"
                            >
                              문제 보기
                            </button>
                          </div>

                          <div className="w-full flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              <span className="text-caption-sm text-text-sub">정답</span>
                              <div
                                className="flex items-center gap-1.5 p-3 rounded-xl"
                                style={{ background: "var(--color-element-hover-fill-mint)" }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                  <path d="M20 6L9 17L4 12" stroke="var(--color-status-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-body-sm font-medium text-text-normal">{r.options[r.answer]}</span>
                              </div>
                            </div>
                            <div className="flex flex-col gap-2">
                              <span className="text-caption-sm text-text-sub">내가 선택한 답</span>
                              <div
                                className="flex items-center gap-1.5 p-3 rounded-xl"
                                style={{ background: "var(--color-element-light-red)" }}
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                                  <path d="M18 6L6 18" stroke="var(--color-status-negative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  <path d="M6 6L18 18" stroke="var(--color-status-negative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-body-sm font-medium text-text-normal">{r.options[r.selected_answer]}</span>
                              </div>
                            </div>
                          </div>

                          {r.explanation && (
                            <div
                              className="w-full flex flex-col items-start gap-3 p-6 rounded-xl"
                              style={{
                                background: "var(--color-element-drag-fill-blue)",
                                border: "1px solid var(--color-primary-normal)",
                              }}
                            >
                              <span className="inline-flex items-center gap-1 bg-white rounded-full px-2 py-1.5">
                                <img src={aiFeedbackSvg} alt="" width={20} height={20} />
                                <span className="text-label-lg font-semibold text-primary-normal">AI 피드백</span>
                              </span>
                              <p className="text-body-sm font-medium text-text-normal m-0">{r.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
          <div className="w-full bg-white border border-border-light rounded-xl p-8 flex flex-col items-center justify-center gap-6" style={{ minHeight: 458 }}>
            {isLoading ? (
              <p className="text-body-md text-text-sub">불러오는 중...</p>
            ) : isError || total === 0 ? (
              <p className="text-body-md text-text-sub">퀴즈를 불러올 수 없어요.</p>
            ) : current ? (
              <div className="w-full flex flex-col items-start gap-8">
                <div className="flex flex-col items-start gap-3 w-full">
                  <span className="text-label-lg font-semibold text-text-normal rounded-full border border-border-strong px-3 py-1">
                    {currentIndex + 1} / {total}
                  </span>
                  <p className="text-body-xl font-medium text-text-strong">
                    <span className="text-text-sub mr-1">Q.</span>
                    {current.question}
                  </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                  {current.options.map((option, i) => {
                    const isSelected = selected === i;
                    const isCorrectOption = checkedResult?.answer === i;
                    const isWrongSelected = !!checkedResult && isSelected && !isCorrectOption;

                    let background = "var(--color-bg-elevate)";
                    let badgeBg = "var(--color-neutral-20)";
                    if (checkedResult) {
                      if (isCorrectOption) {
                        background = "var(--color-element-hover-fill-mint)";
                        badgeBg = "var(--color-status-positive)";
                      } else if (isWrongSelected) {
                        background = "var(--color-element-light-red)";
                        badgeBg = "var(--color-status-negative)";
                      }
                    } else if (isSelected) {
                      background = "var(--color-primary-normal)";
                      badgeBg = "var(--color-element-drag-fill-blue)";
                    }

                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSelect(i)}
                        disabled={!!checkedResult}
                        className="w-full flex items-center justify-between gap-1.5 rounded-xl p-3 text-left transition-colors"
                        style={{ background, border: "1px solid transparent" }}
                      >
                        <span className="flex items-center gap-1.5">
                          <span
                            className="flex items-center justify-center w-6 h-6 rounded-full text-caption-sm font-medium text-text-sub shrink-0"
                            style={{
                              background: badgeBg,
                              color: checkedResult && (isCorrectOption || isWrongSelected) ? "var(--color-static-white)" : "var(--color-text-sub)",
                            }}
                          >
                            {i + 1}
                          </span>
                          <span
                            className="text-body-sm font-medium"
                            style={{
                              color:
                                !checkedResult && isSelected
                                  ? "var(--color-static-white)"
                                  : "var(--color-text-normal)",
                            }}
                          >
                            {option}
                          </span>
                        </span>
                        {isCorrectOption && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <path d="M20 6L9 17L4 12" stroke="var(--color-status-positive)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {isWrongSelected && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                            <path d="M18 6L6 18" stroke="var(--color-status-negative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 6L18 18" stroke="var(--color-status-negative)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="w-full flex justify-between">
                  {checkedResult && currentIndex > 0 ? (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="h-[38px] px-4 rounded-lg text-label-md font-medium transition-colors"
                      style={{ background: "var(--color-bg-elevate)", color: "var(--color-text-normal)" }}
                    >
                      이전 문제
                    </button>
                  ) : (
                    <span />
                  )}
                  <button
                    type="button"
                    disabled={checkedResult ? false : !canCheck || isChecking}
                    onClick={checkedResult ? handleAdvance : handleCheckAnswer}
                    className="h-[38px] px-4 rounded-lg text-label-md font-medium transition-colors flex items-center gap-1"
                    style={{
                      background: checkedResult || canCheck ? "var(--color-primary-normal)" : "var(--color-bg-elevate)",
                      color: checkedResult || canCheck ? "var(--color-static-white)" : "var(--color-text-disabled)",
                      cursor: checkedResult || canCheck ? "pointer" : "default",
                    }}
                  >
                    {checkedResult ? (isLast ? "결과 보기" : "다음 문제") : "정답 확인"}
                    {checkedResult && isLast && (
                      <img src={rightSvg} alt="" width={16} height={16} className="brightness-0 invert" />
                    )}
                  </button>
                </div>

                {checkedResult && (
                  <div
                    className="w-full flex flex-col items-start gap-3 p-6 rounded-xl"
                    style={{
                      background: "var(--color-element-drag-fill-blue)",
                      border: "1px solid var(--color-primary-normal)",
                    }}
                  >
                    <span className="inline-flex items-center gap-1 bg-white rounded-full px-2 py-1.5">
                      <img src={aiFeedbackSvg} alt="" width={20} height={20} />
                      <span className="text-label-lg font-semibold text-primary-normal">AI 피드백</span>
                    </span>
                    <p className="text-body-sm font-medium text-text-normal m-0">{checkedResult.explanation}</p>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          )}
        </div>
      </main>

      <AiFab
        showTooltip={true}
        onClick={() => {}}
        className="fixed bottom-[90px] right-10 z-30"
      />
    </div>
  );
}
