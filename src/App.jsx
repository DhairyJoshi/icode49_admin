import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import BlogsPage from './pages/BlogsPage'
import ProjectsPage from './pages/ProjectsPage'
import BlogCategoriesPage from './pages/BlogCategoriesPage'
import ProjectCategoriesPage from './pages/ProjectCategoriesPage'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import { useAuth } from './AuthContext'
import TechnologyCategoriesPage from './pages/TechnologyCategoriesPage'
import HomePage from './pages/HomePage'

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function RedirectIfAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
        <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
          <Route index element={<HomePage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="blog-categories" element={<BlogCategoriesPage />} />
          <Route path="project-categories" element={<ProjectCategoriesPage />} />
          <Route path="technology-categories" element={<TechnologyCategoriesPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;