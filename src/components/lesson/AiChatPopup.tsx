import { useState, useRef, useEffect } from 'react'
import aiSvg from '@/assets/Icon/mingcute_ai-fill.svg'
import sendSvg from '@/assets/Icon/mynaui_send-solid.svg'
import closeSvg from '@/assets/Icon/close.svg'
import moreSvg from '@/assets/Icon/more.svg'
import leftSvg from '@/assets/Icon/left.svg'

const EXAMPLE_QUESTIONS = [
  '이온 결합 예시 더 알려 줘',
  '핵심 내용 한 줄로 요약해 줘',
]

const MORE_MENU_ITEMS = ['채팅 기록', '고객문의'] as const
type MoreMenuItem = (typeof MORE_MENU_ITEMS)[number]

interface HistoryItem {
  id: number
  text: string
  timestamp: string
}

const MOCK_HISTORY: HistoryItem[] = [
  { id: 1, text: '전자 1개를 Cl에게 넘겨줬어. 이 전자', timestamp: '4. 28. 오후 09:28' },
  { id: 2, text: '전자 1개를 Cl에게 넘겨줬어. 이 전자', timestamp: '4. 28. 오후 09:28' },
]

interface Message {
  role: 'user' | 'ai'
  text: string
}


const AI_DUMMY_RESPONSE = '음, 어쩌고저쩌고. 음, 어쩌고저쩌고. 음, 어쩌고저쩌고.'

const ICON_FILTER_GRAY = 'brightness(0) invert(1) brightness(0.83)'

interface AiChatPopupProps {
  onClose?: () => void
  className?: string
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end w-full">
      <div className="bg-blue-500 px-[12px] py-[10px] rounded-tl-[12px] rounded-tr-[2px] rounded-br-[12px] rounded-bl-[12px]">
        <p className="text-[13px] font-medium leading-[18px] tracking-[-0.065px] text-white">
          {text}
        </p>
      </div>
    </div>
  )
}

function AiBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-start w-full">
      <div className="bg-neutral-10 px-[12px] py-[10px] rounded-tl-[12px] rounded-tr-[12px] rounded-br-[12px] rounded-bl-[2px]">
        <p className="text-[13px] font-medium leading-[18px] tracking-[-0.065px] text-text-normal">
          {text}
        </p>
      </div>
    </div>
  )
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
  )
}

export default function AiChatPopup({ onClose, className = '' }: AiChatPopupProps) {
  const [input, setInput] = useState('')
  const [moreOpen, setMoreOpen] = useState(false)
  const [view, setView] = useState<'main' | 'history' | 'chat'>('main')
  const inputRef = useRef<HTMLInputElement>(null)

  // chat view state
  const [messages, setMessages] = useState<Message[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isWaiting, setIsWaiting] = useState(false)
  const [hasAiResponse, setHasAiResponse] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const chatInputRef = useRef<HTMLInputElement>(null)
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isProgrammaticScroll = useRef(false)

  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [])

  useEffect(() => {
    const el = chatContainerRef.current
    if (!el) return
    isProgrammaticScroll.current = true
    el.scrollTop = el.scrollHeight
  }, [messages, isWaiting])

  useEffect(() => {
    if (hasAiResponse) chatInputRef.current?.focus()
  }, [hasAiResponse])

  const handleChatScroll = () => {
    if (isProgrammaticScroll.current) {
      isProgrammaticScroll.current = false
      return
    }
    const el = chatContainerRef.current
    if (!el) return
    el.classList.add('is-scrolling')
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => {
      el.classList.remove('is-scrolling')
    }, 800)
  }

  const handleMainSend = () => {
    if (!input.trim()) return
    const question = input.trim()
    setInput('')
    setMessages([{ role: 'user', text: question }])
    setIsWaiting(true)
    setView('chat')
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: AI_DUMMY_RESPONSE }])
      setIsWaiting(false)
      setHasAiResponse(true)
    }, 600)
  }

  const handleChatSend = (text?: string) => {
    const question = (text ?? chatInput).trim()
    if (!question) return
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setChatInput('')
    setIsWaiting(true)
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: AI_DUMMY_RESPONSE }])
      setIsWaiting(false)
      setHasAiResponse(true)
    }, 600)
  }

  const handleExample = (q: string) => {
    setInput(q)
    inputRef.current?.focus()
  }

  if (view === 'chat') {
    const isChatActive = chatInput.trim().length > 0
    return (
      <div
        className={`flex flex-col p-6 gap-6 w-[362px] h-[302px] bg-white rounded-3xl border-[1.5px] border-[#214dcc] shadow-[0_0_6px_#A2B8F9] ${className}`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between w-full shrink-0">
          <button
            type="button"
            onClick={() => setView('main')}
            className="size-6 flex items-center justify-center"
          >
            <img src={leftSvg} alt="뒤로" width={24} height={24} className="size-full" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="size-6 flex items-center justify-center"
          >
            <img src={closeSvg} alt="닫기" width={24} height={24} className="size-full" />
          </button>
        </div>

        {/* 채팅 영역 */}
        <div
          ref={chatContainerRef}
          onScroll={handleChatScroll}
          className="flex flex-col flex-1 min-h-0 overflow-y-auto chat-scroll"
        >
          <div className="flex-1" />
          <div className="flex flex-col gap-[16px] items-start w-full">
            {messages.map((msg, i) =>
              msg.role === 'user' ? (
                <UserBubble key={i} text={msg.text} />
              ) : (
                <AiBubble key={i} text={msg.text} />
              )
            )}
            {isWaiting && <LoadingBubble />}
          </div>
        </div>

        {/* 입력창 */}
        <div
          className={`flex gap-[4px] items-center px-[12px] py-[8px] rounded-[12px] border border-border-strong w-full shrink-0 transition-colors ${
            hasAiResponse ? 'bg-neutral-10' : 'bg-neutral-5'
          }`}
        >
          <input
            ref={chatInputRef}
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleChatSend()}
            placeholder="질문하세요"
            className="flex-1 min-w-px bg-transparent text-[13px] font-medium leading-[18px] tracking-[-0.065px] text-text-normal placeholder-neutral-50 outline-none caret-blue-500"
          />
          <button
            type="button"
            onClick={() => handleChatSend()}
            className="shrink-0 size-[20px]"
            disabled={!isChatActive}
          >
            <img
              src={sendSvg}
              alt="전송"
              width={20}
              height={20}
              className="size-full transition-[filter]"
              style={{ filter: isChatActive ? 'none' : ICON_FILTER_GRAY }}
            />
          </button>
        </div>
      </div>
    )
  }

  if (view === 'history') {
    return (
      <div
        className={`flex flex-col p-6 gap-4 w-[362px] bg-white rounded-3xl border-[1.5px] border-[#214dcc] shadow-[0_0_6px_#A2B8F9] ${className}`}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between w-full">
          <button
            type="button"
            onClick={() => setView('main')}
            className="size-6 flex items-center justify-center"
          >
            <img src={leftSvg} alt="뒤로" width={24} height={24} className="size-full" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="size-6 flex items-center justify-center"
          >
            <img src={closeSvg} alt="닫기" width={24} height={24} className="size-full" />
          </button>
        </div>

        {/* 질문 기록 카운트 + 모두 지우기 */}
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] font-medium leading-[15px] tracking-[-0.055px] text-text-sub">
            질문 기록 ({MOCK_HISTORY.length})
          </span>
          <button
            type="button"
            className="text-[11px] font-medium leading-[15px] tracking-[-0.055px] text-text-sub border border-border-normal rounded-lg px-2 py-1 hover:bg-neutral-10 transition-colors"
          >
            모두 지우기
          </button>
        </div>

        {/* 기록 목록 */}
        <div className="flex flex-col gap-2 w-full">
          {MOCK_HISTORY.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-1 bg-white border border-border-normal rounded-xl px-4 py-3 cursor-pointer hover:bg-neutral-10 transition-colors"
            >
              <p className="text-[13px] font-medium leading-[18px] tracking-[-0.065px] text-text-normal truncate">
                {item.text}
              </p>
              <p className="text-[11px] font-normal leading-[15px] tracking-[-0.055px] text-text-sub">
                {item.timestamp}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
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
            {MORE_MENU_ITEMS.map((item: MoreMenuItem) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setMoreOpen(false)
                  if (item === '채팅 기록') setView('history')
                }}
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
          onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleMainSend()}
          placeholder="모르는 내용을 질문해 보세요."
          className="flex-1 min-w-0 bg-transparent outline-none text-[13px] font-medium leading-[18px] tracking-[-0.005em] text-text-strong placeholder:text-text-sub"
        />
        <button type="button" onClick={handleMainSend} className="size-5 shrink-0">
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
