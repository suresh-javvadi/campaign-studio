import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext.jsx'
import Button from './Button.jsx'

const navLinkClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors duration-150 ${
    isActive ? 'text-ink' : 'text-ink-secondary hover:text-ink'
  }`

function PublicHeader() {
  const { user, status } = useAuth()

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur border-b border-ink/8">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-5 md:px-8 h-16">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-8 h-8 rounded-sm bg-accent text-white flex items-center justify-center text-xs font-bold tracking-wide">
            CS
          </span>
          <span className="text-[15px] font-semibold text-ink whitespace-nowrap">
            Campaign Studio
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClasses}>
            Home
          </NavLink>
          <NavLink to="/gallery" className={navLinkClasses}>
            Gallery
          </NavLink>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          {status === 'ready' && user ? (
            <Button as={Link} to="/app" variant="outline">
              My Dashboard
            </Button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-ink-secondary hover:text-ink transition-colors duration-150"
              >
                Log in
              </Link>
              <Button as={Link} to="/register">
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function PublicFooter() {
  return (
    <footer className="border-t border-ink/8 bg-surface">
      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-sm bg-accent text-white flex items-center justify-center text-[10px] font-bold">
            CS
          </span>
          <span className="text-sm font-semibold text-ink">Campaign Studio</span>
        </div>
        <p className="m-0 text-xs text-ink-tertiary text-center">
          © {new Date().getFullYear()} Campaign Studio. Posters personalized here carry a
          Campaign Studio watermark unless noted otherwise.
        </p>
      </div>
    </footer>
  )
}

function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  )
}

export default PublicLayout
