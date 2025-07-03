import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  PlusIcon, 
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Editor } from 'primereact/editor'
import { allBlogCategoryAPI } from '../api'
import { fetchBlogs, createBlog } from '../slices/blogsSlice'

function BlogManager() {
  const dispatch = useDispatch()
  const { items: blogs, error, createStatus, createError, createSuccess } = useSelector(state => state.blogs)

  // Drawer state and form state
  const [showDrawer, setShowDrawer] = useState(false)
  const [formData, setFormData] = useState({
    image_poster: null,
    image_poster_alt: '',
    image_1_poster: null,
    image_1_alt: '',
    title: '',
    category: '',
    body: '',
    author: '',
    publish_date: '',
    read_time: '',
    status: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    og_title: '',
    og_description: '',
    og_image: null,
    og_type: '',
    og_image_alt: '',
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [imagePosterPreview, setImagePosterPreview] = useState(null)
  const [image1Preview, setImage1Preview] = useState(null)
  const [ogImagePreview, setOgImagePreview] = useState(null)

  // Add a base URL for images
  const IMAGE_BASE_URL = 'http://164.52.202.121:4545'

  useEffect(() => {
    dispatch(fetchBlogs())
  }, [dispatch])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await allBlogCategoryAPI()
        if (res.status === 'true' || res.statuscode === 200) {
          setCategories(res.data || res.categories || [])
        }
      } catch (err) {
        // handle error
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(createBlog({
      category: formData.category,
      title: formData.title,
      poster: formData.image_poster,
      poster_alt: formData.image_poster_alt,
      image: formData.image_1_poster,
      image_alt: formData.image_1_alt,
      description: formData.body,
      author: formData.author,
      publish_date: formData.publish_date,
      read_time: formData.read_time,
      seo_title: formData.seo_title,
      seo_description: formData.seo_description,
      seo_keywords: formData.seo_keywords,
      og_title: formData.og_title,
      og_description: formData.og_description,
      og_image: formData.og_image,
      og_type: formData.og_type,
      og_image_alt: formData.og_image_alt,
    })).then((action) => {
      if (action.type.endsWith('fulfilled')) {
        setShowDrawer(false)
        setFormData({
          image_poster: null,
          image_poster_alt: '',
          image_1_poster: null,
          image_1_alt: '',
          title: '',
          category: '',
          body: '',
          author: '',
          publish_date: '',
          read_time: '',
          status: '',
          seo_title: '',
          seo_description: '',
          seo_keywords: '',
          og_title: '',
          og_description: '',
          og_image: null,
          og_type: '',
          og_image_alt: '',
        })
        dispatch(fetchBlogs())
      }
    })
  }

  const handlePosterImageChange = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, image_poster: file })
    setImagePosterPreview(file ? URL.createObjectURL(file) : null)
  }

  const handleImage1Change = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, image_1_poster: file })
    setImage1Preview(file ? URL.createObjectURL(file) : null)
  }

  const handleOgImageChange = (e) => {
    const file = e.target.files[0]
    setFormData({ ...formData, og_image: file })
    setOgImagePreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Blog Management</h3>
          <p className="text-sm text-gray-500">Manage your blog posts and articles</p>
        </div>
        <button
          onClick={() => setShowDrawer(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Blog
        </button>
      </div>

      {/* Blogs List */}
      <div className="bg-white shadow rounded-lg">
        {loading && (
          <div className="text-center py-12 text-gray-500">Loading blogs...</div>
        )}
        {error && (
          <div className="text-center py-12 text-red-500">Error: {error}</div>
        )}
        {blogs.length > 0 && (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poster</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Publish Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id || blog._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {blog.poster && (
                        <img src={`${IMAGE_BASE_URL}${blog.poster}`} alt={blog.poster_alt || 'Poster'} className="h-12 w-20 object-cover rounded" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                      <div className="text-xs text-gray-500 line-clamp-2 max-w-xs">{blog.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blog.category_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blog.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.publish_date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{blog.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {blogs.length === 0 && (
          <div className="text-center py-12 text-gray-500">No blogs found.</div>
        )}
      </div>
      {/* Drawer */}
      <div>
        {showDrawer && (
          <div className="fixed inset-0 bg-white/35 backdrop-blur-sm bg-opacity-40 z-40 transition-opacity" onClick={() => setShowDrawer(false)} />
        )}
        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-4xl bg-white shadow-2xl flex flex-col h-full transition-transform duration-300 ease-in-out transform ${showDrawer ? 'translate-x-0' : 'translate-x-full'} pointer-events-auto`}
          style={{ willChange: 'transform' }}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Create Blog</h2>
              <p className="text-gray-500 mt-1 text-sm">Fill in the details below to add a new blog post</p>
            </div>
            <button
              type="button"
              onClick={() => setShowDrawer(false)}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <XMarkIcon className="h-7 w-7" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 md:py-8 space-y-6">
            {createStatus === 'loading' && (
              <div className="mb-2 text-blue-600 text-sm">Creating blog...</div>
            )}
            {createError && (
              <div className="mb-2 text-red-500 text-sm">{createError}</div>
            )}
            {createSuccess && (
              <div className="mb-2 text-green-600 text-sm">{createSuccess}</div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Poster */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster Image</label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="poster-image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {imagePosterPreview ? (
                        <img src={imagePosterPreview} alt="Poster Preview" className="h-40 object-contain mb-2" />
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
                    <input id="poster-image-upload" type="file" className="hidden" accept="image/*" onChange={handlePosterImageChange} />
                  </label>
                </div>
              </div>
              {/* Poster Alt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster Image Alt</label>
                <input
                  type="text"
                  value={formData.image_poster_alt}
                  onChange={e => setFormData({ ...formData, image_poster_alt: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Poster image alt text"
                />
              </div>
              {/* Image 1 Poster */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image 1</label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="image1-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {image1Preview ? (
                        <img src={image1Preview} alt="Image 1 Preview" className="h-40 object-contain mb-2" />
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
                    <input id="image1-upload" type="file" className="hidden" accept="image/*" onChange={handleImage1Change} />
                  </label>
                </div>
              </div>
              {/* Image 1 Alt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image 1 Alt</label>
                <input
                  type="text"
                  value={formData.image_1_alt}
                  onChange={e => setFormData({ ...formData, image_1_alt: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Image 1 alt text"
                />
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
                  placeholder="Blog Title"
                />
              </div>
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={typeof cat === 'string' ? cat : cat.id || cat.category} value={typeof cat === 'string' ? cat : cat.id}>
                      {typeof cat === 'string' ? cat : cat.category || cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {/* Blog Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Blog Description</label>
                <Editor
                  value={formData.body}
                  onTextChange={e => setFormData({ ...formData, body: e.htmlValue })}
                  style={{ height: '200px' }}
                  placeholder="Write your blog content here..."
                />
              </div>
              {/* Author */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={e => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="Author name"
                />
              </div>
              {/* Publish Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date</label>
                <input
                  type="date"
                  value={formData.publish_date}
                  onChange={e => setFormData({ ...formData, publish_date: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                />
              </div>
              {/* Read Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Read Time</label>
                <input
                  type="text"
                  value={formData.read_time}
                  onChange={e => setFormData({ ...formData, read_time: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="e.g. 5 min"
                />
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                >
                  <option value="" disabled>Select status</option>
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              {/* SEO Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={e => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="SEO Title"
                />
              </div>
              {/* SEO Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
                <Editor
                  value={formData.seo_description}
                  onTextChange={e => setFormData({ ...formData, seo_description: e.htmlValue })}
                  style={{ height: '120px' }}
                  placeholder="SEO Description"
                />
              </div>
              {/* SEO Keywords */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={formData.seo_keywords}
                  onChange={e => setFormData({ ...formData, seo_keywords: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              {/* OG Title */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Title</label>
                <input
                  type="text"
                  value={formData.og_title}
                  onChange={e => setFormData({ ...formData, og_title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="OG Title"
                />
              </div>
              {/* OG Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Description</label>
                <Editor
                  value={formData.og_description}
                  onTextChange={e => setFormData({ ...formData, og_description: e.htmlValue })}
                  style={{ height: '120px' }}
                  placeholder="OG Description"
                />
              </div>
              {/* OG Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="og-image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {ogImagePreview ? (
                        <img src={ogImagePreview} alt="OG Image Preview" className="h-40 object-contain mb-2" />
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
                    <input id="og-image-upload" type="file" className="hidden" accept="image/*" onChange={handleOgImageChange} />
                  </label>
                </div>
              </div>
              {/* OG Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Type</label>
                <input
                  type="text"
                  value={formData.og_type}
                  onChange={e => setFormData({ ...formData, og_type: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="OG Type"
                />
              </div>
              {/* OG Image Alt */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">OG Image Alt</label>
                <input
                  type="text"
                  value={formData.og_image_alt}
                  onChange={e => setFormData({ ...formData, og_image_alt: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                  placeholder="OG Image Alt"
                />
              </div>
            </div>
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition duration-150 ease-in-out shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create Blog
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BlogManager 