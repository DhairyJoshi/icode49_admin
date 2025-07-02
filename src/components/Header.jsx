import { Link, useNavigate } from 'react-router-dom'
import { XMarkIcon, BellIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../AuthContext'

function Header({ sidebarOpen, setSidebarOpen, navigation, master, headerMarginClass = '' }) {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top header bar */}
      <div className={`sticky top-2 z-50 flex h-16 items-center justify-between bg-white px-2 shadow-sm mx-4 my-2 rounded-lg ${headerMarginClass}`}>
        {/* Logo left */}
        <div className="flex items-center h-full gap-2">
          {/* Mobile sidebar toggle */}
          <button
            className="inline-flex lg:hidden items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {/* Hamburger icon */}
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {/* Desktop logo is larger, mobile is smaller */}
          <img src="/images/logo.png" alt="Logo" className="h-10 w-auto object-contain sm:h-8" />
        </div>
        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none hidden sm:inline-flex">
            <BellIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none hidden sm:inline-flex">
            <UserCircleIcon className="h-7 w-7 text-gray-600" />
          </button>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 bg-pink-600 text-white rounded-md font-semibold hover:bg-pink-700 transition text-sm sm:text-base"
            >
              Logout
            </button>
          )}
        </div>
      </div>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden pointer-events-none`}>
        {/* Overlay with fade transition */}
        <div
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setSidebarOpen(false)}
        />
        {/* Drawer with slide transition */}
        <div
          className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} pointer-events-auto`}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${window.location.pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </Link>
            ))}
            <div className="mt-4">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Master</div>
              {master.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${window.location.pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? 'translate-x-0 mx-4 my-2' : '-translate-x-full my-2'}`} style={{ zIndex: 39 }}>
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200 rounded-lg">
          <div className="flex h-16 items-center px-4">
            <img src="/images/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${window.location.pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon className="mr-3 h-6 w-6" />
                {item.name}
              </Link>
            ))}
            <div className="mt-4">
              <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">Master</div>
              {master.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${window.location.pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Header 