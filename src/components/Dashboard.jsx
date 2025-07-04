import { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  FolderIcon,
  CalendarIcon,
  EyeIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalProjects: 0,
    totalViews: 0,
    recentActivity: []
  })

  useEffect(() => {
    // Simulate loading stats from localStorage or API
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]')
    const projects = JSON.parse(localStorage.getItem('projects') || '[]')

    setStats({
      totalBlogs: blogs.length,
      totalProjects: projects.length,
      totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0) +
        projects.reduce((sum, project) => sum + (project.views || 0), 0),
      recentActivity: [
        ...blogs.map(blog => ({ ...blog, type: 'blog', date: new Date(blog.createdAt || Date.now()) })),
        ...projects.map(project => ({ ...project, type: 'project', date: new Date(project.createdAt || Date.now()) }))
      ].sort((a, b) => b.date - a.date).slice(0, 5)
    })
  }, [])

  const statCards = [
    {
      name: 'Total Blogs',
      value: stats.totalBlogs,
      icon: DocumentTextIcon,
      color: 'bg-blue-100',
      iconColor: 'text-blue-500',
      textColor: 'text-blue-600'
    },
    {
      name: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderIcon,
      color: 'bg-green-100',
      iconColor: 'text-green-500',
      textColor: 'text-green-600'
    },
    {
      name: 'Total Views',
      value: stats.totalViews.toLocaleString(),
      icon: EyeIcon,
      color: 'bg-purple-100',
      iconColor: 'text-purple-500',
      textColor: 'text-purple-600'
    },
    {
      name: 'Growth Rate',
      value: '+12%',
      icon: ArrowTrendingUpIcon,
      color: 'bg-orange-100',
      iconColor: 'text-orange-500',
      textColor: 'text-orange-600'
    }
  ]

  return (
    <div className="space-y-4">
      {/* Stats Overview */}
      <div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="bg-white shadow rounded-lg"
            >
              <div className="p-5 flex items-center">
                <div className={`flex-shrink-0 rounded-lg ${stat.color} flex items-center justify-center h-16 w-16`}>
                  <stat.icon className={`h-10 w-10 ${stat.iconColor}`} />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Recent Activity</h3>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {stats.recentActivity.length > 0 ? (
              <div className="flow-root">
                <ul className="-mb-8">
                  {stats.recentActivity.map((activity, activityIdx) => (
                    <li key={activityIdx}>
                      <div className="relative pb-8">
                        {activityIdx !== stats.recentActivity.length - 1 ? (
                          <span
                            className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                            aria-hidden="true"
                          />
                        ) : null}
                        <div className="relative flex space-x-3">
                          <div>
                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${activity.type === 'blog' ? 'bg-blue-500' : 'bg-green-500'
                              }`}>
                              {activity.type === 'blog' ? (
                                <DocumentTextIcon className="h-5 w-5 text-white" />
                              ) : (
                                <FolderIcon className="h-5 w-5 text-white" />
                              )}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                            <div>
                              <p className="text-sm text-gray-500">
                                {activity.type === 'blog' ? 'Blog' : 'Project'} created:{' '}
                                <span className="font-medium text-gray-900">
                                  {activity.title}
                                </span>
                              </p>
                            </div>
                            <div className="text-right text-sm whitespace-nowrap text-gray-500">
                              <time dateTime={activity.date.toISOString()}>
                                {activity.date.toLocaleDateString()}
                              </time>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No activity</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first blog or project.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-base font-medium text-gray-900 mb-2">Create New Blog</h4>
            <p className="text-sm text-gray-500 mb-4">
              Add a new blog post to your portfolio
            </p>
            <button onClick={() => navigate('/blogs')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              New Blog
            </button>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h4 className="text-base font-medium text-gray-900 mb-2">Create New Project</h4>
            <p className="text-sm text-gray-500 mb-4">
              Add a new project to showcase your work
            </p>
            <button onClick={() => navigate('/projects')} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
              <FolderIcon className="h-4 w-4 mr-2" />
              New Project
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 