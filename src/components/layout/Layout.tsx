import { Outlet } from 'react-router'
import Sidebar from './Sidebar'
import ProfileButton from './ProfileButton'
import logoFullSvg from '@/assets/Icon/logo-full.svg'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed left-0 right-0 top-0 z-10 flex h-[60px] items-center justify-between border-b border-border-light bg-static-white px-10">
        <img src={logoFullSvg} alt="Labit" />
        <ProfileButton />
      </header>

      <div className="flex flex-1 pt-[60px]">
        <Sidebar />
        <main className="ml-[270px] min-h-[calc(100vh-60px)] flex-1 bg-neutral-5">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
