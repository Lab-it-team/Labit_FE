import { useState } from "react";
import tipsSvg from "@/assets/icons/mingcute_ai-fill.svg";
import bgSvg from "@/assets/icons/bg.svg";
import AiChatPopup from "./AiChatPopup";
import LoginRequiredModal from "@/components/common/LoginRequiredModal";
import CustomerInquiryModal from "@/components/common/CustomerInquiryModal";
import { useAuthStore } from "@/stores/authStore";

function AiFabTooltip({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="relative w-[226px] h-[153px]">
      <img src={bgSvg} alt="" className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 flex flex-col gap-3 pt-[15px] px-5 pb-10">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-medium leading-6 tracking-[-0.07px] text-text-strong">
            모르는 게 있다면?
          </p>
          <p className="text-xs font-normal leading-[17px] tracking-[-0.06px] text-text-sub">
            학습 내용 중 궁금한 단어를 드래그하면,
            <br />
            바로 AI에게 물어볼 수 있어요.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className="self-start text-[13px] font-medium leading-[18px] tracking-[-0.065px] text-text-normal bg-white border border-border-normal rounded-lg px-2 py-1.5 hover:bg-neutral-10 transition-colors"
        >
          알겠어요
        </button>
      </div>
    </div>
  );
}

type FabInteraction = "default" | "hovered" | "pressed";

interface AiFabProps {
  showTooltip?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function AiFab({
  showTooltip = true,
  onClick,
  className = "",
}: AiFabProps) {
  const isLoggedIn = !!useAuthStore((s) => s.accessToken);
  const [interaction, setInteraction] = useState<FabInteraction>("default");
  const [tooltipVisible, setTooltipVisible] = useState(showTooltip);
  const [chatVisible, setChatVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [inquiryModalVisible, setInquiryModalVisible] = useState(false);

  const fabBgClass =
    interaction === "pressed"
      ? "bg-blue-700"
      : interaction === "hovered"
      ? "bg-blue-600"
      : "bg-blue-500";

  const handleClick = () => {
    setTooltipVisible(false);
    if (!isLoggedIn) { setLoginModalVisible(true); return; }
    setChatVisible((v) => !v);
    onClick?.();
  };

  return (
    <div className={`inline-flex flex-col items-end ${className}`}>
      {loginModalVisible && <LoginRequiredModal onClose={() => setLoginModalVisible(false)} />}
      {(chatVisible || inquiryModalVisible) && (
        <div
          className="fixed inset-0 z-20"
          onClick={() => { setChatVisible(false); setInquiryModalVisible(false); }}
        />
      )}
      {chatVisible && (
        <div className="relative z-30 mb-6">
          <AiChatPopup
            onClose={() => setChatVisible(false)}
            onInquiryClick={() => { setChatVisible(false); setInquiryModalVisible(true); }}
          />
        </div>
      )}
      {inquiryModalVisible && (
        <div className="relative z-30 mb-6">
          <CustomerInquiryModal onClose={() => setInquiryModalVisible(false)} />
        </div>
      )}
      {tooltipVisible && !chatVisible && (
        <div className="mb-2">
          <AiFabTooltip onDismiss={() => setTooltipVisible(false)} />
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setInteraction("hovered")}
        onMouseLeave={() => setInteraction("default")}
        onMouseDown={() => setInteraction("pressed")}
        onMouseUp={() => setInteraction("hovered")}
        className={`flex items-center gap-1 px-3 py-2.5 rounded-full w-[109px] h-11 overflow-hidden transition-colors shrink-0 shadow-[0_0_15px_rgba(0,0,0,0.08)] ${fabBgClass}`}
      >
        <div className="size-[24px] flex items-center justify-center shrink-0">
          <img
            src={tipsSvg}
            alt=""
            width={24}
            height={24}
            className="size-full brightness-0 invert"
          />
        </div>
        <span className="text-[15px] font-semibold leading-[22px] tracking-[-0.075px] text-white whitespace-nowrap">
          AI 도우미
        </span>
      </button>
    </div>
  );
}
