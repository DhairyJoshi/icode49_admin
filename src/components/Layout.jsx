import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { 
  HomeIcon, 
  DocumentTextIcon, 
  FolderIcon, 
  ClipboardDocumentListIcon,
  AdjustmentsHorizontalIcon,
  Square3Stack3DIcon
} from '@heroicons/react/24/outline'
import Header from './Header'
import BreadCrumb from './BreadCrumb'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Set sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true)
      } else {
        setSidebarOpen(false)
      }
    }
    
    // Set initial state
    handleResize()
    
    // Add event listener
    window.addEventListener('resize', handleResize)
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Blogs', href: '/blogs', icon: DocumentTextIcon },
    { name: 'Portfolios', href: '/portfolios', icon: FolderIcon },
  ]
  const master = [
    { name: 'Blog Categories', href: '/blog-categories', icon: ClipboardDocumentListIcon },
    { name: 'Portfolio Categories', href: '/portfolio-categories', icon: AdjustmentsHorizontalIcon },
    { name: 'Technology Categories', href: '/technology-categories', icon: Square3Stack3DIcon },
  ]
  return (
    <>
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navigation={navigation}
        master={master}
        headerMarginClass={sidebarOpen ? 'lg:ml-72 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]' : 'transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ml-4'}
      />
      {/* Breadcrumb */}
      <div className={`mt-4 mb-4 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? 'lg:ml-68' : 'lg:ml-0'}`}>
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
    </>
  )
}

export default Layout 