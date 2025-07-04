import { useEffect, useState, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { 
  PlusIcon, 
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { Editor } from 'primereact/editor'
import { allBlogCategoryAPI, blogUpdateAPI } from '../api'
import { fetchBlogs, createBlog } from '../slices/blogsSlice'
import BlogTable from "./BlogTable";
import { NotificationContext } from './NotificationProvider'

function BlogManager() {
  const dispatch = useDispatch()
  const { items: blogs, createStatus, createError, createSuccess } = useSelector(state => state.blogs)
  const { showNotification } = useContext(NotificationContext)

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
  const [imagePosterPreview, setImagePosterPreview] = useState(null)
  const [image1Preview, setImage1Preview] = useState(null)
  const [ogImagePreview, setOgImagePreview] = useState(null)
  const [editingBlog, setEditingBlog] = useState(null);

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
    e.preventDefault();
    if (editingBlog) {
      // Update blog
      const res = await blogUpdateAPI({
        id: editingBlog.id || editingBlog._id,
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
      });
      if (res.status === 'true' || res.statuscode === 200) {
        showNotification({ message: 'Blog updated successfully!', type: 'success' })
        setShowDrawer(false);
        setEditingBlog(null);
        dispatch(fetchBlogs());
      } else {
        showNotification({ message: res.message || 'Failed to update blog', type: 'error' })
      }
    } else {
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
          showNotification({ message: 'Blog created successfully!', type: 'success' })
          setShowDrawer(false);
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
          });
          dispatch(fetchBlogs());
        } else if (action.type.endsWith('rejected')) {
          showNotification({ message: action.payload || 'Failed to create blog', type: 'error' })
        }
      });
    }
  };

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

  const openEditDrawer = (blog) => {
    setEditingBlog(blog);
    setFormData({
      image_poster: null,
      image_poster_alt: blog.poster_alt || '',
      image_1_poster: null,
      image_1_alt: blog.image_alt || '',
      title: blog.title || '',
      category: blog.category || blog.category_name || '',
      body: blog.description || '',
      author: blog.author || '',
      publish_date: blog.publish_date || '',
      read_time: blog.read_time || '',
      status: blog.status || '',
      seo_title: blog.seo_title || '',
      seo_description: blog.seo_description || '',
      seo_keywords: blog.seo_keywords || '',
      og_title: blog.og_title || '',
      og_description: blog.og_description || '',
      og_image: null,
      og_type: blog.og_type || '',
      og_image_alt: blog.og_image_alt || '',
    });
    setImagePosterPreview(blog.poster ? IMAGE_BASE_URL + blog.poster : null);
    setImage1Preview(blog.image ? IMAGE_BASE_URL + blog.image : null);
    setOgImagePreview(blog.og_image ? IMAGE_BASE_URL + blog.og_image : null);
    setShowDrawer(true);
  };

  const openCreateDrawer = () => {
    setEditingBlog(null);
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
    });
    setImagePosterPreview(null);
    setImage1Preview(null);
    setOgImagePreview(null);
    setShowDrawer(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Blog Management</h3>
          <p className="text-sm text-gray-500">Manage your blog posts and articles</p>
        </div>
        <button
          onClick={openCreateDrawer}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 cursor-pointer"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Blog
        </button>
      </div>

      {/* Blogs List */}
      <BlogTable blogs={blogs} onEdit={openEditDrawer} onView={() => {}} onDelete={() => {}} />

      {/* Modal */}
      <div>
        {showDrawer && (
          <>
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] transition-opacity" onClick={() => setShowDrawer(false)} />
            <div className="fixed inset-0 z-[10000] flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl mx-auto flex flex-col max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">{editingBlog ? 'Update Blog' : 'Create Blog'}</h2>
                    <p className="text-gray-500 mt-1 text-sm">{editingBlog ? 'Edit the details below to update the blog post' : 'Fill in the details below to add a new blog post'}</p>
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
                      {editingBlog ? 'Update Blog' : 'Create Blog'}
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

export default BlogManager 