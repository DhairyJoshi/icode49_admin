import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PlusIcon, XMarkIcon, PencilIcon } from '@heroicons/react/24/outline'
import { allPortfolioCategoryAPI, allTechnologyAPI } from '../api'
import { fetchProjects, createProject, updateProject } from '../slices/projectSlice'

function ProjectManager() {
  const dispatch = useDispatch()
  const { items: projects, status, error, createStatus, createError, createSuccess, updateStatus, updateError, updateSuccess } = useSelector(state => state.project)
  const [showDrawer, setShowDrawer] = useState(false)
  const [formData, setFormData] = useState({
    category: '',
    title: '',
    description: '',
    project_duration: '',
    website_link: '',
    image: null,
    technology: [],
  })
  const [categories, setCategories] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [imagePreview, setImagePreview] = useState(null)
  const [editingProject, setEditingProject] = useState(null)

  useEffect(() => {
    dispatch(fetchProjects())
    fetchCategories()
    fetchTechnologies()
  }, [dispatch])

  const fetchCategories = async () => {
    try {
      const res = await allPortfolioCategoryAPI()
      setCategories(res.data || res.categories || [])
    } catch (err) {
      setCategories([])
    }
  }

  const fetchTechnologies = async () => {
    try {
      const res = await allTechnologyAPI()
      setTechnologies(res.data || res.technologies || [])
    } catch (err) {
      setTechnologies([])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log(formData)
    if (editingProject) {
      dispatch(updateProject({
        id: editingProject.id || editingProject._id,
        ...formData,
        technology: formData.technology,
        image: formData.image,
      })).then((action) => {
        if (action.type.endsWith('fulfilled')) {
          closeDrawer()
          dispatch(fetchProjects())
        }
      })
    } else {
      dispatch(createProject({
        ...formData,
        technology: formData.technology,
        image: formData.image,
      })).then((action) => {
        if (action.type.endsWith('fulfilled')) {
          closeDrawer()
          dispatch(fetchProjects())
        }
      })
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, image: file })
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  const handleTechChange = (e) => {
    const options = Array.from(e.target.selectedOptions)
    setFormData({ ...formData, technology: options.map(opt => parseInt(opt.value, 10)) })
  }

  const openEditDrawer = (project) => {
    setEditingProject(project)
    setFormData({
      category: project.category || project.category_name || '',
      title: project.title || '',
      description: project.description || '',
      project_duration: project.project_duration || '',
      website_link: project.website_link || '',
      image: null,
      technology: (project.technology_ids || project.technology || []),
    })
    setImagePreview(project.image ? project.image : null)
    setShowDrawer(true)
  }

  const openCreateDrawer = () => {
    setEditingProject(null)
    setFormData({
      category: '',
      title: '',
      description: '',
      project_duration: '',
      website_link: '',
      image: null,
      technology: [],
    })
    setImagePreview(null)
    setShowDrawer(true)
  }

  const closeDrawer = () => {
    setShowDrawer(false)
    setEditingProject(null)
    setFormData({
      category: '',
      title: '',
      description: '',
      project_duration: '',
      website_link: '',
      image: null,
      technology: [],
    })
    setImagePreview(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Project Management</h3>
          <p className="text-sm text-gray-500">Manage your projects</p>
        </div>
        <button
          onClick={openCreateDrawer}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="bg-white shadow rounded-lg">
        {status === 'loading' && (
          <div className="text-center py-12 text-gray-500">Loading projects...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">Error: {error}</div>
        )}
        {projects.length > 0 && (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technologies</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project, idx) => (
                  <tr key={project.id || project._id || idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{project.category_name || project.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Array.isArray(project.technology)
                        ? project.technology
                            .map(id => {
                              const tech = technologies.find(t => (t.id || t._id || t.technology) == id);
                              return tech ? (tech.technology || tech.name || tech.title) : id;
                            })
                            .join(', ')
                        : (project.technology_names || project.technology || []).join(', ')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{project.project_duration}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.website_link && (
                        <a href={project.website_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Visit</a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded text-blue-600 hover:text-blue-900"
                        onClick={() => openEditDrawer(project)}
                      >
                        <PencilIcon className="h-4 w-4 mr-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {projects.length === 0 && status !== 'loading' && (
          <div className="text-center py-12 text-gray-500">No projects found.</div>
        )}
      </div>
      {/* Drawer */}
      <div>
        {showDrawer && (
          <div className="fixed inset-0 bg-white/35 backdrop-blur-sm bg-opacity-40 z-40 transition-opacity" onClick={closeDrawer} />
        )}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col h-full transition-transform duration-300 ease-in-out transform ${showDrawer ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto`}
          style={{ willChange: 'transform' }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{editingProject ? 'Edit Project' : 'Add Project'}</h2>
              <p className="text-gray-500 mt-1 text-sm">Fill in the details below to {editingProject ? 'edit this project' : 'add a new project'}</p>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 md:py-8 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                >
                  <option disabled value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id || cat._id || cat.category} value={cat.id || cat._id || cat.category}>
                      {cat.category || cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Project Title"
                />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Describe your project..."
                />
              </div>
              {/* Project Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Duration</label>
                <input
                  type="text"
                  required
                  value={formData.project_duration}
                  onChange={e => setFormData({ ...formData, project_duration: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="e.g. 3 months"
                />
              </div>
              {/* Website Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website Link</label>
                <input
                  type="url"
                  value={formData.website_link}
                  onChange={e => setFormData({ ...formData, website_link: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="https://project-demo.com"
                />
              </div>
              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="mt-2 h-24 rounded" />
                )}
              </div>
              {/* Technology */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                <select
                  multiple
                  required
                  value={formData.technology}
                  onChange={handleTechChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                >
                  {technologies.map(tech => (
                    <option key={tech.id || tech._id || tech.technology} value={tech.id || tech._id || tech.technology}>
                      {tech.technology || tech.name || tech.title}
                    </option>
                  ))}
                </select>
                <div className="text-xs text-gray-500 mt-1">Hold Ctrl (Windows) or Cmd (Mac) to select multiple</div>
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                disabled={editingProject ? updateStatus === 'loading' : createStatus === 'loading'}
              >
                {editingProject
                  ? updateStatus === 'loading' ? 'Updating...' : 'Update Project'
                  : createStatus === 'loading' ? 'Adding...' : 'Add Project'}
              </button>
              <button
                type="button"
                onClick={closeDrawer}
                className="w-full mt-2 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              {editingProject && updateSuccess && <div className="mt-2 text-green-600 text-sm">{updateSuccess}</div>}
              {editingProject && updateError && <div className="mt-2 text-red-500 text-sm">{updateError}</div>}
              {!editingProject && createSuccess && <div className="mt-2 text-green-600 text-sm">{createSuccess}</div>}
              {!editingProject && createError && <div className="mt-2 text-red-500 text-sm">{createError}</div>}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProjectManager 