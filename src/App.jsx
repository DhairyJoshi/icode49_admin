import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import BlogsPage from './pages/BlogsPage'
import PortfoliosPage from './pages/PortfoliosPage'
import BlogCategoriesPage from './pages/BlogCategoriesPage'
import PortfolioCategoriesPage from './pages/PortfolioCategoriesPage'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import { useAuth } from './AuthContext'
import TechnologyCategoriesPage from './pages/TechnologyCategoriesPage'
import HomePage from './pages/HomePage'
import ProfilePage from './pages/ProfilePage'

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
          <Route path="portfolios" element={<PortfoliosPage />} />
          <Route path="blog-categories" element={<BlogCategoriesPage />} />
          <Route path="portfolio-categories" element={<PortfolioCategoriesPage />} />
          <Route path="technology-categories" element={<TechnologyCategoriesPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;