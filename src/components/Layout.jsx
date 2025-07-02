import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  FolderIcon, 
} from '@heroicons/react/24/outline'
import Header from './Header'
import BreadCrumb from './BreadCrumb'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Blogs', href: '/blogs', icon: DocumentTextIcon },
    { name: 'Projects', href: '/projects', icon: FolderIcon },
  ]
  const master = [
    { name: 'Blog Categories', href: '/blog-categories' },
    { name: 'Project Categories', href: '/project-categories' },
    { name: 'Technology Categories', href: '/technology-categories' },
  ]
  return (
    <div className="min-h-screen">
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        master={master}
        headerMarginClass={sidebarOpen ? 'lg:ml-72 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ml-4'}
      />
      {/* Breadcrumb */}
      <div className={sidebarOpen ? 'ml-68 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : 'ml-0 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] mt-4 mb-4'}>
        <BreadCrumb bannerOpen={sidebarOpen} />
      </div>
      {/* Main content */}
      <div className={sidebarOpen ? 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:ml-68' : 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] lg:ml-0'}>
        <main>
          <div className="mx-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout 