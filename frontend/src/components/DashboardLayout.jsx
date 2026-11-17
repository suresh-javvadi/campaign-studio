import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'
import { ALL_NAV } from '../navigation.js'

const user = { name: 'Jordan Lee', initials: 'JL' }

function DashboardLayout() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const { pathname } = useLocation()

  const currentPage = ALL_NAV.find((item) => item.path === pathname)
  const title = currentPage ? currentPage.label : 'Campaign Studio'

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          title={title}
          onMenuClick={() => setIsMobileNavOpen(true)}
          notificationCount={3}
          user={user}
        />

        <main className="flex-1 flex flex-col gap-10 px-5 md:px-10 pt-6 md:pt-8 pb-10 md:pb-14">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
