import { useState } from "react";
import mascotPng from "@/assets/mascot/labit_thinking.png";
import mascotWinkPng from "@/assets/mascot/labit_wink.png";
import sendSvg from "@/assets/icons/mynaui_send-solid.svg";
import arrowRightSvg from "@/assets/icons/arrow/right.svg";
import mailSvg from "@/assets/icons/mail.svg";
import { submitContact, type ContactCategory } from "@/features/contact/api";

const INQUIRY_TYPES: { id: string; label: string; category: ContactCategory }[] = [
  { id: "general",  label: "💬 일반 문의", category: "GENERAL" },
  { id: "bug",      label: "🐛 버그 신고", category: "BUG" },
  { id: "feature",  label: "💡 기능 제안", category: "FEATURE" },
  { id: "account",  label: "🔑 계정·결제", category: "ACCOUNT_PAYMENT" },
  { id: "etc",      label: "기타",         category: "OTHER" },
];

interface CustomerInquiryModalProps {
  onClose: () => void;
}

type Step = "main" | "email-form";

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="닫기"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M13 1L1 13M1 1L13 13" stroke="var(--color-text-normal)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="뒤로가기"
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, background: "none", border: "none", cursor: "pointer", padding: 0, flexShrink: 0 }}
    >
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M7 1L1 7L7 13" stroke="var(--color-text-normal)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

const POPUP_STYLE: React.CSSProperties = {
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: 24,
  gap: 24,
  width: 362,
  maxWidth: "calc(100vw - 32px)",
  background: "var(--color-bg-normal)",
  border: "1.5px solid var(--color-primary-strong)",
  boxShadow: "0px 0px 6px #A2B8F9",
  borderRadius: 24,
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-sans)",
  fontWeight: 400,
  fontSize: 13,
  lineHeight: "18px",
  letterSpacing: "-0.005em",
  color: "var(--color-text-normal)",
};

const INPUT_STYLE: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  background: "var(--color-bg-normal)",
  border: "1px solid var(--color-border-strong)",
  borderRadius: 12,
  padding: "8px 12px",
  fontFamily: "var(--font-sans)",
  fontWeight: 500,
  fontSize: 13,
  lineHeight: "18px",
  letterSpacing: "-0.005em",
  color: "var(--color-text-strong)",
  outline: "none",
};

// ── Step 1: 메인 ──────────────────────────────────────────────────────────────
function MainStep({ onClose, onEmailClick }: { onClose: () => void; onEmailClick: () => void }) {
  return (
    <div style={POPUP_STYLE} onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ width: 24 }} />
        <CloseButton onClick={onClose} />
      </div>

      {/* Mascot + Text */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <img src={mascotPng} alt="" style={{ width: 120, height: 104, objectFit: "contain" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, lineHeight: "22px", color: "var(--color-text-strong)" }}>
            무엇을 도와드릴까요?
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-sub)" }}>
            궁금한 점이나 불편한 점이 있으신가요?<br />편한 방법으로 문의해 주세요.
          </span>
        </div>
      </div>

      {/* 이메일 문의 카드 */}
      <button
        type="button"
        onClick={onEmailClick}
        style={{
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "14px 16px",
          gap: 12,
          width: "100%",
          background: "var(--color-static-white)",
          border: "1px solid var(--color-border-strong)",
          borderRadius: 16,
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <img src={mailSvg} alt="" width={24} height={20} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, lineHeight: "20px", color: "var(--color-text-normal)" }}>
            이메일로 문의하기
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", letterSpacing: "-0.005em", color: "var(--color-text-sub)" }}>
            보통 1~2일 내에 답변을 보내드려요.
          </span>
        </div>
        <img src={arrowRightSvg} alt="" width={20} height={20} style={{ flexShrink: 0, opacity: 0.4 }} />
      </button>
    </div>
  );
}

// ── Step 2: 이메일 폼 ─────────────────────────────────────────────────────────
function EmailFormStep({ onClose, onBack }: { onClose: () => void; onBack: () => void }) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [email, setEmail]               = useState("");
  const [title, setTitle]               = useState("");
  const [content, setContent]           = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const [isSuccess, setIsSuccess]       = useState(false);
  const [errorMsg, setErrorMsg]         = useState<string | null>(null);

  const isValid = selectedType !== null && email.trim() !== "" && content.trim().length >= 10;

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;
    const type = INQUIRY_TYPES.find((t) => t.id === selectedType);
    if (!type) return;

    setIsLoading(true);
    setErrorMsg(null);
    try {
      await submitContact({
        category: type.category,
        email: email.trim(),
        title: title.trim() || undefined,
        message: content.trim(),
      });
      setIsSuccess(true);
    } catch {
      setErrorMsg("문의 전송에 실패했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={POPUP_STYLE} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
          <CloseButton onClick={onClose} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <img src={mascotWinkPng} alt="" style={{ width: 180, height: 156, objectFit: "contain" }} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16, lineHeight: "22px", color: "var(--color-text-strong)" }}>
              문의가 접수되었어요!
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-sub)" }}>
              보통 1~2일 내에 답변을 보내드려요.
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          style={{
            width: "100%", height: 38, border: "none", borderRadius: 12, cursor: "pointer",
            background: "var(--color-primary-normal)",
            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px",
            color: "var(--color-static-white)",
          }}
        >
          확인
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...POPUP_STYLE, maxHeight: "calc(100vh - 32px)", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", flexShrink: 0 }}>
        <BackButton onClick={onBack} />
        <CloseButton onClick={onClose} />
      </div>

      {/* 아이콘 + 타이틀 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <img src={mailSvg} alt="" width={24} height={20} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 16, lineHeight: "22px", color: "var(--color-text-strong)" }}>
            이메일로 문의하기
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-sub)" }}>
            작성해서 보내면 담당자에게 바로 전달돼요.
          </span>
        </div>
      </div>

      {/* 폼 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>

        {/* 문의 유형 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <span style={LABEL_STYLE}>문의 유형</span>
            <span style={{ ...LABEL_STYLE, color: "var(--color-element-normal-red)" }}>*</span>
          </div>
          <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {INQUIRY_TYPES.map((type) => {
              const isSelected = selectedType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "4px 8px",
                    height: 26,
                    background: isSelected ? "var(--color-primary-light)" : "var(--color-bg-elevate)",
                    border: isSelected ? "1px solid var(--color-primary-normal)" : "1px solid transparent",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    fontSize: 13,
                    lineHeight: "18px",
                    letterSpacing: "-0.005em",
                    color: isSelected ? "var(--color-primary-normal)" : "var(--color-text-normal)",
                    transition: "all 0.15s",
                  }}
                >
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 연락받을 이메일 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <span style={LABEL_STYLE}>연락받을 이메일</span>
            <span style={{ ...LABEL_STYLE, color: "var(--color-element-normal-red)" }}>*</span>
          </div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="answer@example.com"
            style={{ ...INPUT_STYLE, height: 38 }}
          />
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", letterSpacing: "-0.005em", color: "var(--color-text-sub)" }}>
            답변을 받을 이메일 주소를 입력해 주세요.
          </span>
        </div>

        {/* 제목 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={LABEL_STYLE}>제목</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 실습 화면에서 이온이 안 붙어요"
            style={{ ...INPUT_STYLE, height: 38 }}
          />
        </div>

        {/* 문의 내용 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", flexDirection: "row", gap: 2 }}>
            <span style={LABEL_STYLE}>문의 내용</span>
            <span style={{ ...LABEL_STYLE, color: "var(--color-element-normal-red)" }}>*</span>
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="예) 학년·단원과 함께 자세히 적어주시면 더 빠르게 도와드릴 수 있어요."
            rows={3}
            style={{ ...INPUT_STYLE, height: 80, resize: "none" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", letterSpacing: "-0.005em", color: content.trim().length > 0 && content.trim().length < 10 ? "var(--color-red-500)" : "var(--color-text-sub)" }}>
              {content.trim().length > 0 && content.trim().length < 10 ? "최소 10자 이상 입력해 주세요." : ""}
            </span>
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", color: content.trim().length < 10 ? "var(--color-text-sub)" : "var(--color-text-normal)" }}>
              {content.trim().length} / 2000
            </span>
          </div>
        </div>

        {/* 에러 메시지 */}
        {errorMsg && (
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 12, lineHeight: "17px", color: "var(--color-red-500)", textAlign: "center" }}>
            {errorMsg}
          </span>
        )}

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          style={{
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            padding: "8px 10px", gap: 4,
            width: "100%", height: 38,
            background: isValid && !isLoading ? "var(--color-primary-normal)" : "var(--color-text-disabled)",
            borderRadius: 12,
            border: "none",
            cursor: isValid && !isLoading ? "pointer" : "default",
            transition: "background 0.15s",
          }}
        >
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.005em", color: isValid && !isLoading ? "var(--color-static-white)" : "var(--color-neutral-40)" }}>
            {isLoading ? "전송 중..." : "문의 보내기"}
          </span>
          {!isLoading && (
            <img src={sendSvg} alt="" width={20} height={20} style={{ filter: isValid ? "brightness(0) invert(1)" : "brightness(0) invert(0.7)" }} />
          )}
        </button>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function CustomerInquiryModal({ onClose }: CustomerInquiryModalProps) {
  const [step, setStep] = useState<Step>("main");

  return step === "main" ? (
    <MainStep onClose={onClose} onEmailClick={() => setStep("email-form")} />
  ) : (
    <EmailFormStep onClose={onClose} onBack={() => setStep("main")} />
  );
}
