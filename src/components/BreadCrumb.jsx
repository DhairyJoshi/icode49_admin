import { useLocation } from 'react-router-dom';

function BreadCrumb({ bannerOpen }) {
  const location = useLocation();
  // Map pathnames to page names
  const pathNameMap = {
    '/': 'Home',
    '/blogs': 'Blogs',
    '/projects': 'Projects',
    '/blog-categories': 'Blog Categories',
    '/project-categories': 'Project Categories',
    '/technology-categories': 'Technology Categories',
    '/login': 'Login',
    '/profile': 'Profile',
  };
  const currentPage = pathNameMap[location.pathname] || 'Page';

  return (
    <div
      className={`mx-4 mb-2 px-2 text-md text-gray-500 flex items-center gap-2 z-40 relative  ml-2`}
    >
      <span className="font-medium text-gray-700">Dashboard</span>
      <span className="mx-1">/</span>
      <span className="capitalize">{currentPage}</span>
    </div>
  );
}

export default BreadCrumb; 