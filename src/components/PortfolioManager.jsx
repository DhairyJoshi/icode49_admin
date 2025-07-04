import { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Editor } from 'primereact/editor'
import { allPortfolioCategoryAPI, allTechnologyAPI } from '../api'
import { fetchPortfolios, createPortfolio, updatePortfolio } from '../slices/portfolioSlice'
import PortfoliosTable from "./PortfoliosTable";
import { NotificationContext } from './NotificationProvider'

function PortfolioManager() {
  const dispatch = useDispatch()
  const { items: portfolios, createStatus, updateStatus } = useSelector(state => state.portfolio)
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
  const [editingPortfolio, setEditingPortfolio] = useState(null)
  const [techDropdownOpen, setTechDropdownOpen] = useState(false)
  const { showNotification } = useContext(NotificationContext)
  const IMAGE_BASE_URL = 'http://164.52.202.121:4545';

  useEffect(() => {
    dispatch(fetchPortfolios())
    fetchCategories()
    fetchTechnologies()
  }, [dispatch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.technology-dropdown')) {
        setTechDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    if (editingPortfolio) {
      dispatch(updatePortfolio({
        id: editingPortfolio.id || editingPortfolio._id,
        ...formData,
        technology: formData.technology,
        image: formData.image,
      })).then((action) => {
        if (action.type.endsWith('fulfilled')) {
          showNotification({ message: 'Portfolio updated successfully!', type: 'success' })
          closeDrawer()
          dispatch(fetchPortfolios())
        } else if (action.type.endsWith('rejected')) {
          showNotification({ message: action.payload || 'Failed to update portfolio', type: 'error' })
        }
      })
    } else {
      dispatch(createPortfolio({
        ...formData,
        technology: formData.technology,
        image: formData.image,
      })).then((action) => {
        if (action.type.endsWith('fulfilled')) {
          showNotification({ message: 'Portfolio created successfully!', type: 'success' })
          closeDrawer()
          dispatch(fetchPortfolios())
        } else if (action.type.endsWith('rejected')) {
          showNotification({ message: action.payload || 'Failed to create portfolio', type: 'error' })
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

  const openEditDrawer = (portfolio) => {
    setEditingPortfolio(portfolio)
    setFormData({
      category: portfolio.category || portfolio.category_name || '',
      title: portfolio.title || '',
      description: portfolio.description || '',
      project_duration: portfolio.project_duration || '',
      website_link: portfolio.website_link || '',
      image: null,
      technology: (portfolio.technology_ids || portfolio.technology || []),
    })
    setImagePreview(
      portfolio.image
        ? portfolio.image.startsWith('http')
          ? portfolio.image
          : IMAGE_BASE_URL + portfolio.image
        : null
    )
    setShowDrawer(true)
  }

  const openCreateDrawer = () => {
    setEditingPortfolio(null)
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
    setEditingPortfolio(null)
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
          <h3 className="text-lg font-medium text-gray-900">Portfolio Management</h3>
          <p className="text-sm text-gray-500">Manage your portfolios</p>
        </div>
        <button
          onClick={openCreateDrawer}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Portfolio
        </button>
      </div>

      {/* Projects List */}
      <PortfoliosTable 
        portfolios={portfolios} 
        technologies={technologies}
        categories={categories}
        onEdit={openEditDrawer} 
        onView={() => {}} 
        onDelete={() => {}} 
      />
      {/* Modal */}
      <div>
        {showDrawer && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" onClick={closeDrawer} />
            <div className="fixed inset-0 z-[60] flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-auto flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{editingPortfolio ? 'Edit Portfolio' : 'Add Portfolio'}</h2>
                    <p className="text-gray-500 mt-1 text-sm">Fill in the details below to {editingPortfolio ? 'edit this portfolio' : 'add a new portfolio'}</p>
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <div className="md:col-span-2">
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <Editor
                        value={formData.description}
                        onTextChange={e => setFormData({ ...formData, description: e.htmlValue })}
                        style={{ height: '200px' }}
                        placeholder="Describe your portfolio..."
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
                        placeholder="https://portfolio-demo.com"
                      />
                    </div>
                    {/* Image */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Project Image</label>
                      <div className="flex items-center justify-center w-full">
                        <label htmlFor="portfolio-image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {imagePreview ? (
                              <img src={imagePreview} alt="Project Preview" className="h-40 object-contain mb-2" />
                            ) : (
                              <>
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                              </>
                            )}
                          </div>
                          <input id="portfolio-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                      </div>
                    </div>
                    {/* Technology */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Technologies</label>
                      <div className="relative technology-dropdown">
                        <select
                          multiple
                          required
                          value={formData.technology}
                          onChange={handleTechChange}
                          className="hidden"
                          id="technology-select"
                        >
                          {technologies.map(tech => (
                            <option key={tech.id || tech._id || tech.technology} value={tech.id || tech._id || tech.technology}>
                              {tech.technology || tech.name || tech.title}
                            </option>
                          ))}
                        </select>
                        {/* Custom Dropdown UI */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setTechDropdownOpen(!techDropdownOpen)}
                            className="relative py-3 ps-4 pe-9 flex gap-x-2 text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                          >
                            <span className="text-gray-500">
                              {formData.technology.length > 0 
                                ? `${formData.technology.length} selected` 
                                : "Select technologies..."}
                            </span>
                            <div className="absolute top-1/2 end-3 -translate-y-1/2">
                              <svg className="shrink-0 size-3.5 text-gray-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="m7 15 5 5 5-5"/>
                                <path d="m7 9 5-5 5 5"/>
                              </svg>
                            </div>
                          </button>
                          {techDropdownOpen && (
                            <div className="absolute mt-2 z-50 w-full max-h-52 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto shadow-lg">
                              {technologies.map(tech => {
                                const techId = tech.id || tech._id || tech.technology;
                                const isSelected = formData.technology.includes(techId);
                                return (
                                  <div
                                    key={techId}
                                    onClick={() => {
                                      const newTech = isSelected 
                                        ? formData.technology.filter(t => t !== techId)
                                        : [...formData.technology, techId];
                                      setFormData({ ...formData, technology: newTech });
                                    }}
                                    className="py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100"
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <span>{tech.technology || tech.name || tech.title}</span>
                                      {isSelected && (
                                        <span>
                                          <svg className="shrink-0 size-3.5 text-pink-600" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"/>
                                          </svg>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        {/* Selected Technologies Display */}
                        {formData.technology.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {formData.technology.map(techId => {
                              const tech = technologies.find(t => (t.id || t._id || t.technology) == techId);
                              return tech ? (
                                <span
                                  key={techId}
                                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-600"
                                >
                                  {tech.technology || tech.name || tech.title}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newTech = formData.technology.filter(t => t !== techId);
                                      setFormData({ ...formData, technology: newTech });
                                    }}
                                    className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-pink-400 hover:bg-pink-200 hover:text-pink-500 focus:outline-none"
                                  >
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                  </button>
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                      disabled={editingPortfolio ? updateStatus === 'loading' : createStatus === 'loading'}
                    >
                      {editingPortfolio
                        ? updateStatus === 'loading' ? 'Updating...' : 'Update Portfolio'
                        : createStatus === 'loading' ? 'Adding...' : 'Add Portfolio'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PortfolioManager 