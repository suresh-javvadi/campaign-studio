const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function IconDashboard(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="4.5" rx="1.5" />
      <rect x="13" y="10" width="7.5" height="10.5" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
    </svg>
  )
}

export function IconFolder(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3.5 6.5a1.5 1.5 0 0 1 1.5-1.5h4l2 2h8a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z" />
    </svg>
  )
}

export function IconSparkle(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5 13.6 9l5.4 1.6-5.4 1.6L12 17.7l-1.6-5.5L5 10.6 10.4 9z" />
    </svg>
  )
}

export function IconLayout(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.75" />
      <path d="M10 4.5v15" />
    </svg>
  )
}

export function IconSwatch(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="9" r="5.5" />
      <circle cx="15.5" cy="11.5" r="5.5" opacity="0.5" />
      <circle cx="11" cy="16" r="2.25" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconSettings(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.4M12 18.1v2.4M4.9 7.1l2.1 1.2M17 15.7l2.1 1.2M4.9 16.9l2.1-1.2M17 8.3l2.1-1.2M3.5 12h2.4M18.1 12h2.4" />
    </svg>
  )
}

export function IconHelp(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M9.6 9.3a2.4 2.4 0 1 1 3.6 2.1c-.8.5-1.2.9-1.2 1.9" />
      <circle cx="12" cy="16.2" r="0.15" fill="currentColor" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

export function IconSearch(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="M19.5 19.5 15.6 15.6" />
    </svg>
  )
}

export function IconBell(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 10.5a6 6 0 0 1 12 0v4l1.5 2.5h-15L6 14.5z" />
      <path d="M9.8 19.5a2.2 2.2 0 0 0 4.4 0" />
    </svg>
  )
}

export function IconMenu(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}

export function IconFrame(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="1.75" />
      <circle cx="9" cy="10" r="1.75" />
      <path d="M5 17l4.5-5 3 3.2L16 12l3 4.3" />
    </svg>
  )
}

export function IconPhone(props) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="2.5" width="10" height="19" rx="2.25" />
      <path d="M10.5 18.5h3" />
    </svg>
  )
}

export function IconMail(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="1.75" />
      <path d="M4 7l8 6 8-6" />
    </svg>
  )
}

export function IconDocument(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5V8h4" />
    </svg>
  )
}

export function IconPlay(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.3 9l5 3-5 3z" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function IconPlus(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconArrowLeft(props) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5M5 12l6-6M5 12l6 6" />
    </svg>
  )
}

export function IconTrash(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 7h15M9.5 7V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v2M6.5 7l1 13a1.5 1.5 0 0 0 1.5 1.4h6a1.5 1.5 0 0 0 1.5-1.4l1-13" />
    </svg>
  )
}

export function IconAlignLeft(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M4 12h10M4 18h13" />
    </svg>
  )
}

export function IconAlignCenter(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M7 12h10M5.5 18h13" />
    </svg>
  )
}

export function IconAlignRight(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h16M10 12h10M7 18h13" />
    </svg>
  )
}

export function IconRectangle(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.75" />
    </svg>
  )
}

export function IconCircleShape(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
    </svg>
  )
}

export function IconLineShape(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19 19 5" />
    </svg>
  )
}

export function IconTriangleShape(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 4.5 20.5 19.5h-17z" />
    </svg>
  )
}
