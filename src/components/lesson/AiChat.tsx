import { useState, useRef, useEffect, forwardRef } from "react";
import aiSvg from "@/assets/Icon/mingcute_ai-fill.svg";
import sendSvg from "@/assets/Icon/mynaui_send-solid.svg";

type AiChatState = "default" | "hover" | "press" | "typing";

function DefaultHoverState({
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`w-full h-full border border-blue-500 rounded-full px-3 flex items-center gap-1.5 transition-colors ${
        isHovered ? "bg-primary-light" : "bg-white/95"
      }`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <img src={aiSvg} alt="" width={20} height={20} />
      <span className="text-label-lg font-semibold text-blue-500 whitespace-nowrap">
        AI한테 물어보기
      </span>
    </button>
  );
}

function GradientPill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`p-px rounded-full w-full h-full ${className}`}
      style={{
        background:
          "radial-gradient(ellipse at center, #a2b8f9 0%, #7797f6 39%, #4e78f3 66%, #275af0 100%)",
      }}
    >
      <div
        className="flex items-center gap-1.5 px-3 rounded-full w-full h-full justify-between"
        style={{ background: "#e9effe" }}
      >
        {children}
      </div>
    </div>
  );
}

function createMirrorEl(className: string): HTMLSpanElement {
  const el = document.createElement("span");
  el.setAttribute("aria-hidden", "true");
  el.style.cssText =
    "position:fixed;top:-9999px;left:-9999px;visibility:hidden;white-space:pre;pointer-events:none;";
  el.className = className;
  document.body.appendChild(el);
  return el;
}

function AutoSizeInput({
  value,
  onChange,
  onKeyDown,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mirrorElRef = useRef<HTMLSpanElement | null>(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    mirrorElRef.current = createMirrorEl("text-label-lg font-medium");
    return () => {
      if (mirrorElRef.current) {
        document.body.removeChild(mirrorElRef.current);
        mirrorElRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const syncWidth = (text?: string) => {
    if (!inputRef.current || !mirrorElRef.current) return;
    mirrorElRef.current.textContent = text ?? inputRef.current.value;
    const w = mirrorElRef.current.offsetWidth;
    inputRef.current.style.width = `${w + 4}px`;
  };

  useEffect(() => {
    if (!isComposingRef.current) {
      syncWidth(value);
    }
  }, [value]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onCompositionStart={() => {
        isComposingRef.current = true;
      }}
      onCompositionEnd={(e) => {
        isComposingRef.current = false;
        syncWidth((e.target as HTMLInputElement).value);
      }}
      className="flex-1 min-w-0 bg-transparent text-label-lg font-medium text-text-normal outline-none caret-blue-500"
      style={{ width: "2px" }}
    />
  );
}

function InputState({
  value,
  onChange,
  onSend,
  showSendButton,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  showSendButton: boolean;
}) {
  return (
    <GradientPill className="shadow-[0px_0px_3px_#a2b8f9]">
      <AutoSizeInput
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        autoFocus
      />
      <button
        type="button"
        onClick={onSend}
        className={`shrink-0 transition-opacity ${
          showSendButton ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <img src={sendSvg} alt="전송" width={20} height={20} />
      </button>
    </GradientPill>
  );
}

interface AiChatProps {
  onSend?: (question: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

const AiChat = forwardRef<HTMLDivElement, AiChatProps>(function AiChat(
  { onSend, className, style },
  ref
) {
  const [state, setState] = useState<AiChatState>("default");
  const [inputValue, setInputValue] = useState("");
  const [fixedWidth, setFixedWidth] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fixedWidth === null && containerRef.current) {
      setFixedWidth(containerRef.current.offsetWidth);
    }
  }, [fixedWidth]);

  const handleChange = (v: string) => {
    setInputValue(v);
    setState(v.length > 0 ? "typing" : "press");
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    onSend?.(inputValue.trim());
    setInputValue("");
    setState("default");
  };

  const mergedRef = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div
      ref={mergedRef}
      className={`w-fit h-8 ${className}`}
      style={{
        ...(fixedWidth !== null ? { minWidth: fixedWidth } : {}),
        ...style,
      }}
    >
      {(state === "default" || state === "hover") && (
        <DefaultHoverState
          isHovered={state === "hover"}
          onMouseEnter={() => setState("hover")}
          onMouseLeave={() => setState("default")}
          onClick={() => setState("press")}
        />
      )}
      {(state === "press" || state === "typing") && (
        <InputState
          value={inputValue}
          onChange={handleChange}
          onSend={handleSend}
          showSendButton={state === "typing"}
        />
      )}
    </div>
  );
});

export default AiChat;
