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
  { path: '/app', label: 'Dashboard', icon: IconDashboard },
  { path: '/app/projects', label: 'My Projects', icon: IconFolder },
  { path: '/app/ai-generator', label: 'AI Generator', icon: IconSparkle },
  { path: '/app/templates', label: 'Templates', icon: IconLayout },
  { path: '/app/brand-assets', label: 'Brand Assets', icon: IconSwatch },
]

export const UTILITY_NAV = [
  { path: '/app/settings', label: 'Settings', icon: IconSettings },
  { path: '/app/help', label: 'Help & Support', icon: IconHelp },
]

export const ALL_NAV = [...PRIMARY_NAV, ...UTILITY_NAV]
