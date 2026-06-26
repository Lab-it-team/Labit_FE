import { useState } from "react";
import mascotPng from "@/assets/Icon/mascot.png";
import sendSvg from "@/assets/Icon/mynaui_send-solid.svg";
import arrowRightSvg from "@/assets/Icon/Arrow/right.svg";
import mailSvg from "@/assets/Icon/mail.svg";

const INQUIRY_TYPES = [
  { id: "general",  label: "💬 일반 문의" },
  { id: "bug",      label: "🐛 버그 신고" },
  { id: "feature",  label: "💡 기능 제안" },
  { id: "account",  label: "🔑 계정·결제" },
  { id: "etc",      label: "기타" },
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
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 20, lineHeight: "28px", color: "var(--color-text-strong)" }}>
            무엇을 도와드릴까요?
          </span>
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 400, fontSize: 13, lineHeight: "18px", letterSpacing: "-0.005em", textAlign: "center", color: "var(--color-text-sub)" }}>
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
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 16, lineHeight: "22px", color: "var(--color-text-strong)" }}>
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

  const isValid = selectedType !== null && email.trim() !== "" && content.trim() !== "";

  const handleSubmit = () => {
    if (!isValid) return;
    // TODO: API 연동
    console.log({ type: selectedType, email, title, content });
    onClose();
  };

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
        </div>

        {/* 제출 버튼 */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid}
          style={{
            display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center",
            padding: "8px 10px", gap: 4,
            width: "100%", height: 38,
            background: isValid ? "var(--color-primary-normal)" : "var(--color-text-disabled)",
            borderRadius: 12,
            border: "none",
            cursor: isValid ? "pointer" : "default",
            transition: "background 0.15s",
          }}
        >
          <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15, lineHeight: "22px", letterSpacing: "-0.005em", color: isValid ? "var(--color-static-white)" : "var(--color-neutral-40)" }}>
            문의 보내기
          </span>
          <img src={sendSvg} alt="" width={20} height={20} style={{ filter: isValid ? "brightness(0) invert(1)" : "brightness(0) invert(0.7)" }} />
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
