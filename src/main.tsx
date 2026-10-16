import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './styles/index.css'

// 재배포 후 이전 번들이 삭제된 청크를 요청하면 새로고침으로 최신 번들을 받음 (무한 새로고침 방지 가드 포함)
const RELOAD_KEY = 'chunk-reload-at'
window.addEventListener('vite:preloadError', (event) => {
  const lastReload = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0)
  if (Date.now() - lastReload < 10_000) return
  event.preventDefault()
  sessionStorage.setItem(RELOAD_KEY, String(Date.now()))
  window.location.reload()
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
