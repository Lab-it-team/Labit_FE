import { NavLink } from 'react-router'

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.53906 7.84644L10.0012 2.82031L16.4634 7.84644V15.7446C16.4634 16.1255 16.3121 16.4908 16.0428 16.7601C15.7735 17.0294 15.4082 17.1807 15.0273 17.1807H4.9751C4.59424 17.1807 4.22898 17.0294 3.95967 16.7601C3.69036 16.4908 3.53906 16.1255 3.53906 15.7446V7.84644Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.8457 17.1802V10H12.1538V17.1802" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 6H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 12H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 18H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 6H3.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 12H3.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 18H3.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function Sidebar() {
  return (
    <aside className="fixed bottom-0 left-0 top-[60px] flex w-[270px] flex-col gap-0.5 overflow-y-auto border-r border-border-light bg-static-white p-5">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex w-full items-center gap-2 rounded-xl px-5 py-4 text-left text-label-xl font-semibold transition-colors ${
            isActive
              ? 'bg-bg-normal text-text-strong'
              : 'text-neutral-50 hover:bg-neutral-10'
          }`
        }
      >
        <HomeIcon />
        홈
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) =>
          `flex w-full items-center gap-2 rounded-xl px-5 py-4 text-left text-label-xl font-semibold transition-colors ${
            isActive
              ? 'bg-bg-normal text-text-strong'
              : 'text-neutral-50 hover:bg-neutral-10'
          }`
        }
      >
        <ListIcon />
        학습기록
      </NavLink>
    </aside>
  )
}
