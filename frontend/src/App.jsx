import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/DashboardLayout.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import AiGeneratorPage from './pages/AiGeneratorPage.jsx'
import TemplatesPage from './pages/TemplatesPage.jsx'
import BrandAssetsPage from './pages/BrandAssetsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import HelpPage from './pages/HelpPage.jsx'

// Fabric.js is a large dependency — load the editor route on demand so the
// dashboard's initial bundle stays light.
const EditorPage = lazy(() => import('./pages/EditorPage.jsx'))

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/ai-generator" element={<AiGeneratorPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/brand-assets" element={<BrandAssetsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route
          path="/editor/:projectId"
          element={
            <Suspense fallback={null}>
              <EditorPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
