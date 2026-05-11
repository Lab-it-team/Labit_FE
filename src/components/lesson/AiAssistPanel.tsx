import { useState, useRef, useEffect } from "react";
import failSvg from "@/assets/Icon/fail.svg";
import rightSvg from "@/assets/Icon/send.svg";

interface Message {
  role: "user" | "ai";
  text: string;
}

interface AiAssistPanelProps {
  selectedText?: string;
  initialQuestion?: string;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const SUGGEST_CHIPS = [
  "더 쉽게 설명해 줘",
  "예시 하나 더",
  "이거 중요한 거야?",
];

const ICON_FILTER_GRAY = "brightness(0) invert(1) brightness(0.83)";
const ICON_FILTER_PRIMARY =
  "invert(30%) sepia(99%) saturate(2000%) hue-rotate(210deg)";

function Chip({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-neutral-10 border border-neutral-15 flex items-center justify-center px-2 py-1 rounded-[24px] shrink-0 hover:bg-neutral-20 transition-colors"
    >
      <span className="text-[12px] font-medium leading-[16px] tracking-[-0.06px] text-text-sub whitespace-nowrap">
        {text}
      </span>
    </button>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end w-full">
      <div className="bg-blue-500 px-[12px] py-[10px] rounded-tl-[12px] rounded-tr-[2px] rounded-br-[12px] rounded-bl-[12px]">
        <p className="text-[13px] font-medium leading-[18px] tracking-[-0.065px] text-white whitespace-nowrap">
          {text}
        </p>
      </div>
    </div>
  );
}

function AiBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-start w-full max-w-[286px]">
      <div className="bg-neutral-10 px-[12px] py-[10px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px]">
        <p className="text-[13px] font-medium leading-[18px] tracking-[-0.065px] text-text-normal">
          {text}
        </p>
      </div>
    </div>
  );
}

function LoadingBubble() {
  return (
    <div className="flex justify-start w-full">
      <div className="bg-neutral-10 px-[12px] py-[10px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px]">
        <div className="flex gap-[4px] items-center h-[18px]">
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-40 animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-40 animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 rounded-full bg-neutral-40 animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onSend,
  hasAiResponse,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  hasAiResponse: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hasAiResponse) inputRef.current?.focus();
  }, [hasAiResponse]);

  const isActive = value.trim().length > 0;
  const iconFilter =
    hasAiResponse && isActive ? ICON_FILTER_PRIMARY : ICON_FILTER_GRAY;

  return (
    <div
      className={`flex gap-[4px] items-center px-[12px] py-[8px] rounded-[12px] border border-border-strong w-full transition-colors ${
        hasAiResponse ? "bg-neutral-10" : "bg-neutral-5"
      }`}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        placeholder={hasAiResponse ? "질문하세요" : "계속 물어볼 수 있어요"}
        className="flex-1 min-w-px bg-transparent text-[13px] font-medium leading-[18px] tracking-[-0.065px] text-text-normal placeholder-neutral-50 outline-none caret-blue-500"
      />
      <button
        type="button"
        onClick={onSend}
        className="shrink-0 size-[20px]"
        disabled={!isActive}
      >
        <img
          src={rightSvg}
          alt="전송"
          width={20}
          height={20}
          className="size-full transition-[filter]"
          style={{ filter: iconFilter }}
        />
      </button>
    </div>
  );
}

const AI_DUMMY_RESPONSE =
  "음, 어쩌고저쩌고.음, 어쩌고저쩌고.음, 어쩌고저쩌고.음, 어쩌고저쩌고.음, 어쩌고저쩌고.음, 어쩌고저쩌고.음, 어쩌고저쩌고.";

export default function AiAssistPanel({
  selectedText = "비금속 원자는 전자",
  initialQuestion,
  onClose,
  className = "",
  style,
}: AiAssistPanelProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialQuestion ? [{ role: "user", text: initialQuestion }] : []
  );
  const [inputValue, setInputValue] = useState("");
  const [isWaiting, setIsWaiting] = useState(!!initialQuestion);
  const [hasAiResponse, setHasAiResponse] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    isProgrammaticScroll.current = true;
    el.scrollTop = el.scrollHeight;
  }, [messages, isWaiting]);

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, []);

  const handleChatScroll = () => {
    if (isProgrammaticScroll.current) {
      isProgrammaticScroll.current = false;
      return;
    }
    const el = chatContainerRef.current;
    if (!el) return;
    el.classList.add("is-scrolling");
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      el.classList.remove("is-scrolling");
    }, 800);
  };

  useEffect(() => {
    if (!initialQuestion) return;
    const timer = setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: AI_DUMMY_RESPONSE }]);
      setIsWaiting(false);
      setHasAiResponse(true);
    }, 600);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = (text?: string) => {
    const question = (text ?? inputValue).trim();
    if (!question) return;

    setMessages((prev) => [...prev, { role: "user", text: question }]);
    setInputValue("");
    setIsWaiting(true);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "ai", text: AI_DUMMY_RESPONSE }]);
      setIsWaiting(false);
      setHasAiResponse(true);
    }, 600);
  };

  return (
    <div
      className={`bg-white border border-border-strong drop-shadow-[0px_0px_7.5px_rgba(0,0,0,0.08)] flex flex-col gap-[24px] p-[24px] rounded-[24px] w-[334px] h-[371px] overflow-hidden ${className}`}
      style={style}
    >
      <div className="flex items-start justify-between pb-[12px] border-b border-border-strong w-full shrink-0">
        <div className="flex flex-col gap-[2px] flex-1 min-w-px">
          <p className="text-[13px] font-normal leading-[18px] tracking-[-0.065px] text-text-normal">
            AI 도우미
          </p>
          <p className="text-[16px] font-medium leading-[25px] tracking-[-0.08px] text-text-strong truncate">
            "{selectedText}"
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 size-[24px]"
        >
          <img
            src={failSvg}
            alt="닫기"
            width={24}
            height={24}
            className="size-full"
          />
        </button>
      </div>

      <div ref={chatContainerRef} onScroll={handleChatScroll} className="flex flex-col flex-1 min-h-0 overflow-y-auto chat-scroll">
        <div className="flex-1" />
        <div className="flex flex-col gap-[16px] items-start w-full">
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <UserBubble key={i} text={msg.text} />
            ) : (
              <AiBubble key={i} text={msg.text} />
            )
          )}
          {isWaiting && <LoadingBubble />}
        </div>
      </div>

      <div className="flex flex-col gap-[12px] items-start w-full shrink-0">
        <div className="flex gap-1 items-center w-full overflow-x-auto scrollbar-none">
          {SUGGEST_CHIPS.map((chip) => (
            <Chip key={chip} text={chip} onClick={() => handleSend(chip)} />
          ))}
        </div>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={() => handleSend()}
          hasAiResponse={hasAiResponse}
        />
      </div>
    </div>
  );
}
