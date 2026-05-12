import { useState, useRef } from 'react'
import aiSvg from '@/assets/Icon/mingcute_ai-fill.svg'
import sendSvg from '@/assets/Icon/mynaui_send-solid.svg'
import closeSvg from '@/assets/Icon/close.svg'
import moreSvg from '@/assets/Icon/more.svg'

const EXAMPLE_QUESTIONS = [
  '이온 결합 예시 더 알려 줘',
  '핵심 내용 한 줄로 요약해 줘',
]

const MORE_MENU_ITEMS = ['채팅 기록', '고객문의']

interface AiChatPopupProps {
  onClose?: () => void
  className?: string
}

export default function AiChatPopup({ onClose, className = '' }: AiChatPopupProps) {
  const [input, setInput] = useState('')
  const [moreOpen, setMoreOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    // TODO: 실제 API 연동
    setInput('')
  }

  const handleExample = (q: string) => {
    setInput(q)
    inputRef.current?.focus()
  }

  return (
    <div
      className={`relative flex flex-col items-start p-6 gap-6 w-[362px] bg-white rounded-3xl border-[1.5px] border-[#214dcc] shadow-[0_0_6px_#A2B8F9] ${className}`}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-1">
          <div className="flex items-center justify-center size-6">
            <img src={aiSvg} alt="" width={20} height={20} />
          </div>
          <span className="text-base font-medium leading-[22px] text-text-normal">
            AI 도우미
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className="size-6 flex items-center justify-center"
          >
            <img src={moreSvg} alt="더보기" width={24} height={24} className="size-full" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="size-6 flex items-center justify-center"
          >
            <img src={closeSvg} alt="닫기" width={24} height={24} className="size-full" />
          </button>
        </div>
      </div>

      {/* more 드롭다운 */}
      {moreOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMoreOpen(false)}
          />
          <div
            className="absolute z-20 flex flex-col w-[76px] bg-white border border-border-normal rounded-xl shadow-[0_0_8px_rgba(0,0,0,0.05)] overflow-hidden"
            style={{ right: '47.77px', top: '56px' }}
          >
            {MORE_MENU_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setMoreOpen(false)}
                className="w-full py-2 text-[13px] font-medium text-text-normal transition-colors text-center hover:bg-neutral-10 active:bg-neutral-20"
              >
                {item}
              </button>
            ))}
          </div>
        </>
      )}

      {/* 인사말 */}
      <p className="text-base font-medium leading-[25px] tracking-[-0.005em] text-text-strong w-full">
        안녕하세요! Labit AI 도우미입니다.<br />
        모르는 내용이 있으면 언제든지 찾아주세요!
      </p>

      {/* 예시 질문 박스 */}
      <div className="w-full flex flex-col gap-2 bg-[#F1F7FF] rounded-xl px-4 py-3">
        <span className="text-[13px] font-normal leading-[18px] tracking-[-0.005em] text-text-sub">
          이렇게 질문해 보세요
        </span>
        <div className="flex flex-col gap-0.5">
          {EXAMPLE_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleExample(q)}
              className="flex items-center gap-1 text-left hover:opacity-80 transition-opacity"
            >
              <span className="text-sm text-blue-500">•</span>
              <span className="text-sm font-medium leading-6 tracking-[-0.005em] text-blue-500">
                {q}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 입력창 */}
      <div className="w-full flex items-center gap-1 bg-white border border-border-normal rounded-xl px-3 py-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="모르는 내용을 질문해 보세요."
          className="flex-1 min-w-0 bg-transparent outline-none text-[13px] font-medium leading-[18px] tracking-[-0.005em] text-text-strong placeholder:text-text-sub"
        />
        <button type="button" onClick={handleSend} className="size-5 shrink-0">
          <img
            src={sendSvg}
            alt="전송"
            width={20}
            height={20}
            className={`size-full transition-all ${input.trim() ? 'opacity-100' : 'grayscale opacity-25'}`}
          />
        </button>
      </div>
    </div>
  )
}
