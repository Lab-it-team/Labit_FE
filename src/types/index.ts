export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type LessonType = 'concept' | 'practice' | 'comparison' | 'quiz'
export type ChatRole = 'user' | 'assistant'

export interface LessonWithProgress {
  id: number
  unit_id: number
  type: LessonType
  title: string
  order: number
  status: ProgressStatus
}

export interface UnitWithLessons {
  id: number
  title: string
  order: number
  lessons: LessonWithProgress[]
}

export interface HomeResponse {
  units: UnitWithLessons[]
  progress_rate: number
}

export interface ChatSessionResponse {
  id: number
  title: string
  created_at: string
  updated_at: string
}

export interface ChatMessageResponse {
  id: number
  role: ChatRole
  content: string
  context: string | null
  created_at: string
}

export interface ChatResponse {
  user_message: ChatMessageResponse
  ai_message: ChatMessageResponse
}

export interface QuizResponse {
  id: number
  question: string
  options: string[]
}

export interface QuizAnswerRequest {
  quiz_id: number
  selected_answer: number
}

export interface QuizResultResponse {
  id: number
  score: number
  total: number
  created_at: string
}

export interface QuizAnswerDetail {
  quiz_id: number
  question: string
  selected_answer: number
  correct_answer: number
  explanation: string
  is_correct: boolean
}

export interface QuizResultDetailResponse {
  id: number
  score: number
  total: number
  created_at: string
  answers: QuizAnswerDetail[]
}
