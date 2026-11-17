import { IconSearch, IconBell, IconMenu } from './icons.jsx'

function Topbar({ title, onMenuClick, notificationCount = 0, user }) {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between gap-4 px-4 md:px-6 border-b border-ink/8 bg-surface sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="md:hidden inline-flex items-center justify-center p-1.5 rounded-sm text-ink bg-transparent border-none cursor-pointer"
        >
          <IconMenu />
        </button>
        <h1 className="text-base font-semibold tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <label className="hidden md:flex items-center gap-2 w-[280px] max-w-[280px] px-3 py-2 bg-surface-sunken border border-ink/8 rounded-sm text-ink-tertiary focus-within:border-ink/14">
          <IconSearch className="shrink-0 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects, templates…"
            className="border-none bg-transparent outline-none text-[13px] text-ink placeholder:text-ink-tertiary w-full"
          />
        </label>

        <button
          type="button"
          aria-label="Search"
          className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-secondary bg-transparent border-none cursor-pointer"
        >
          <IconSearch />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative inline-flex items-center justify-center w-9 h-9 rounded-sm text-ink-secondary bg-transparent border-none cursor-pointer hover:bg-surface-sunken transition-colors duration-150"
        >
          <IconBell />
          {notificationCount > 0 && (
            <span className="absolute top-0.5 right-0.5 min-w-[15px] h-[15px] px-1 rounded-full bg-accent text-white text-[10px] font-bold leading-[15px] text-center">
              {notificationCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 md:ml-1 border-l border-ink/8">
          <span className="w-8 h-8 rounded-full bg-ink text-surface flex items-center justify-center text-xs font-semibold shrink-0">
            {user.initials}
          </span>
          <span className="hidden md:inline text-[13px] font-medium text-ink whitespace-nowrap">
            {user.name}
          </span>
        </div>
      </div>
    </header>
  )
}

export default Topbar
