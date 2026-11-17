import { NavLink } from 'react-router-dom'
import { PRIMARY_NAV, UTILITY_NAV } from '../navigation.js'
import { IconClose } from './icons.jsx'

const linkClasses = ({ isActive }) =>
  `w-full flex items-center justify-start md:justify-center lg:justify-start gap-2.5 px-3 md:px-2.5 lg:px-3 py-2.5 rounded-sm text-sm text-left relative transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${
    isActive
      ? 'bg-accent/8 text-ink font-semibold'
      : 'text-ink-secondary font-medium hover:bg-ink/5'
  }`

function NavList({ items, onNavigate }) {
  return (
    <ul className="list-none m-0 p-0 flex flex-col gap-0.5">
      {items.map(({ path, label, icon: Icon }) => (
        <li key={path}>
          <NavLink to={path} end={path === '/'} onClick={onNavigate} className={linkClasses}>
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-[-12px] md:left-0 lg:left-[-12px] top-2 bottom-2 w-[3px] rounded-r-[3px] bg-accent" />
                )}
                <Icon
                  className={`shrink-0 ${isActive ? 'text-accent' : 'text-ink-tertiary'}`}
                />
                <span className="md:hidden lg:inline">{label}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-ink/35 z-30"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 md:z-auto flex flex-col shrink-0 bg-surface border-r border-ink/8 px-3 pt-5 pb-6 w-[248px] md:w-[76px] lg:w-[232px] transition-transform duration-[220ms] ease-[cubic-bezier(0.23,1,0.32,1)] md:transition-none md:translate-x-0 ${
          isOpen
            ? 'translate-x-0 shadow-[0_0_0_1px_rgba(21,23,30,0.08)] md:shadow-none'
            : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between md:justify-center lg:justify-between px-2 md:px-0 lg:px-2 pb-5">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-sm bg-accent text-white flex items-center justify-center text-xs font-bold tracking-wide shrink-0">
              CS
            </span>
            <span className="md:hidden lg:inline text-[15px] font-semibold text-ink whitespace-nowrap overflow-hidden text-ellipsis">
              Campaign Studio
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="md:hidden inline-flex items-center justify-center p-1 rounded-sm text-ink-tertiary bg-transparent border-none cursor-pointer"
          >
            <IconClose />
          </button>
        </div>

        <NavList items={PRIMARY_NAV} onNavigate={onClose} />

        <div className="flex-1" />

        <NavList items={UTILITY_NAV} onNavigate={onClose} />
      </aside>
    </>
  )
}

export default Sidebar
