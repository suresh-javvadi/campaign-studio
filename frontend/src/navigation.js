import {
  IconDashboard,
  IconFolder,
  IconSparkle,
  IconLayout,
  IconSwatch,
  IconSettings,
  IconHelp,
} from './components/icons.jsx'

export const PRIMARY_NAV = [
  { path: '/', label: 'Dashboard', icon: IconDashboard },
  { path: '/projects', label: 'My Projects', icon: IconFolder },
  { path: '/ai-generator', label: 'AI Generator', icon: IconSparkle },
  { path: '/templates', label: 'Templates', icon: IconLayout },
  { path: '/brand-assets', label: 'Brand Assets', icon: IconSwatch },
]

export const UTILITY_NAV = [
  { path: '/settings', label: 'Settings', icon: IconSettings },
  { path: '/help', label: 'Help & Support', icon: IconHelp },
]

export const ALL_NAV = [...PRIMARY_NAV, ...UTILITY_NAV]
