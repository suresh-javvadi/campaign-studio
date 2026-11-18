import { Suspense, lazy } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext.jsx'
import ProtectedRoute from './auth/ProtectedRoute.jsx'
import PublicLayout from './components/PublicLayout.jsx'
import DashboardLayout from './components/DashboardLayout.jsx'
import HomePage from './pages/HomePage.jsx'
import GalleryPage from './pages/GalleryPage.jsx'
import PosterDetailPage from './pages/PosterDetailPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import AiGeneratorPage from './pages/AiGeneratorPage.jsx'
import BrandAssetsPage from './pages/BrandAssetsPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import HelpPage from './pages/HelpPage.jsx'

// Fabric.js is a large dependency — load editor routes on demand so the
// public site and dashboard's initial bundle stay light.
const EditorPage = lazy(() => import('./pages/EditorPage.jsx'))
const PersonalizePage = lazy(() => import('./pages/PersonalizePage.jsx'))

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/poster/:templateId" element={<PosterDetailPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/app" element={<DashboardPage />} />
              <Route path="/app/projects" element={<ProjectsPage />} />
              <Route path="/app/ai-generator" element={<AiGeneratorPage />} />
              <Route path="/app/templates" element={<GalleryPage />} />
              <Route path="/app/brand-assets" element={<BrandAssetsPage />} />
              <Route path="/app/settings" element={<SettingsPage />} />
              <Route path="/app/help" element={<HelpPage />} />
            </Route>

            <Route
              path="/editor/:projectId"
              element={
                <Suspense fallback={null}>
                  <EditorPage />
                </Suspense>
              }
            />
            <Route
              path="/personalize/:projectId"
              element={
                <Suspense fallback={null}>
                  <PersonalizePage />
                </Suspense>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
