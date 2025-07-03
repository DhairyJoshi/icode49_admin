import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { XMarkIcon, BellIcon, UserCircleIcon, ArrowRightStartOnRectangleIcon, Cog6ToothIcon, UserIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../AuthContext'

function Header({ sidebarOpen, setSidebarOpen, navigation, master, headerMarginClass = '' }) {
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [masterMenuOpen, setMasterMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Top header bar */}
      <div className={`sticky top-4 z-50 flex h-16 items-center justify-between bg-white px-2 shadow-sm mx-4 my-2 rounded-lg ${headerMarginClass}`}>
        {/* Logo left */}
        <div className="flex items-center h-full gap-2">
          {/* Mobile sidebar toggle */}
          <button
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
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
        <div className="flex items-start justify-start gap-3 mr-2">
          <button className="relative rounded-full focus:outline-none hidden sm:inline-flex">
            <BellIcon className="h-8 w-8 text-gray-600" />
          </button>
          {isAuthenticated && (
            <div className="relative" ref={userMenuRef}>
              <button 
                className="relative rounded-full focus:outline-none hidden sm:inline-flex cursor-pointer"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <UserCircleIcon className="h-8 w-8 text-gray-600" />
              </button>
              
              {/* User Menu Dropdown */}
              {userMenuOpen && (
                <div className="absolute -right-2 mt-4 w-48 bg-white rounded-md shadow-2xl z-50 box-border">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                      <div className="font-medium">{user?.firstname} {user?.lastname}</div>
                      <div className="text-pink-600">{user?.email}</div>
                      <div className="text-xs text-gray-500">{user?.position}</div>
                    </div>
                    <div className="w-full h-[1px] bg-gray-200"></div>
                    <div className="flex flex-col">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          navigate('/profile')
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <UserIcon className="mr-3 h-5 w-5" />
                        Profile
                      </button>
                      <button
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Cog6ToothIcon className="mr-3 h-5 w-5" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <ArrowRightStartOnRectangleIcon className="mr-3 h-5 w-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden pointer-events-none`}>
        {/* Overlay with fade transition */}
        <div
          className={`fixed inset-0 bg-white/35 transition-opacity duration-300 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
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
            {/* Master collapsible menu - mobile */}
            <div className="mt-1 relative">
              <button
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${masterMenuOpen ? 'bg-gray-100 text-gray-900' : ''}`}
                onClick={() => setMasterMenuOpen((open) => !open)}
                type="button"
              >
                <Cog6ToothIcon className="mr-3 h-6 w-6" />
                <span className="flex-1">Master</span>
                <ChevronDownIcon className={`h-5 w-5 ml-2 transition-transform ${masterMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {masterMenuOpen && (
                <div className="absolute top-0 left-full ml-2 w-56 shadow-lg rounded-md py-2 z-50 flex flex-row border border-gray-100">
                  <div className="w-1 bg-green-600 rounded-l-md mr-2"></div>
                  <div className="flex flex-col gap-1 w-full">
                    {master.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setSidebarOpen(false)}
                        className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-left ${window.location.pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${sidebarOpen ? 'translate-x-0 mx-4 my-4' : '-translate-x-full my-4'}`} style={{ zIndex: 39 }}>
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
            {/* Master collapsible menu - desktop */}
            <div className="mt-1">
              <button
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors ${masterMenuOpen ? 'bg-gray-100 text-gray-900' : ''}`}
                onClick={() => setMasterMenuOpen((open) => !open)}
                type="button"
              >
                <Cog6ToothIcon className="mr-3 h-6 w-6" />
                <span className="flex-1">Master</span>
                <ChevronDownIcon className={`h-5 w-5 ml-2 transition-transform ${masterMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {masterMenuOpen && (
                <div className="ml-8 mt-1 flex flex-row gap-1">
                  <div className="w-[1.5px] bg-gray-300 rounded-lg -ml-3 mr-2"></div>
                  <div className="flex flex-col gap-1 w-full">
                    {master.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${window.location.pathname === item.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="flex-1">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}

export default Header