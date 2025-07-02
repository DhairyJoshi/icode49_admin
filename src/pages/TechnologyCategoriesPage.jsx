import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTechnologyCategories, createTechnologyCategory } from '../slices/technologyCategoriesSlice'

const IMAGE_BASE_URL = 'http://164.52.202.121:4545'

function TechnologyCategoriesPage() {
  const dispatch = useDispatch()
  const { items: categories, status, error, createStatus, createError, createSuccess } = useSelector(state => state.technologyCategories)
  const [title, setTitle] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)

  React.useEffect(() => {
    dispatch(fetchTechnologyCategories())
  }, [dispatch])

  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    dispatch(createTechnologyCategory({ title: title.trim(), image })).then((action) => {
      if (action.type.endsWith('fulfilled')) {
        setTitle('')
        setImage(null)
        setImagePreview(null)
        dispatch(fetchTechnologyCategories())
      }
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImage(file)
    setImagePreview(file ? URL.createObjectURL(file) : null)
  }

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Technology Categories</h2>
      <form className="flex flex-col gap-2 mb-4" onSubmit={handleAddCategory}>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Category title"
          disabled={createStatus === 'loading'}
        />
        <div className="flex items-center justify-center w-full">
          <label htmlFor="tech-image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-gray-400">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="h-40 object-contain mb-2" />
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
            <input id="tech-image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} disabled={createStatus === 'loading'} />
          </label>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-2"
          disabled={createStatus === 'loading'}
        >
          {createStatus === 'loading' ? 'Adding...' : 'Add'}
        </button>
      </form>
      {error && <div className="mb-2 text-red-500 text-sm">{error}</div>}
      {createError && <div className="mb-2 text-red-500 text-sm">{createError}</div>}
      {createSuccess && <div className="mb-2 text-green-600 text-sm">{createSuccess}</div>}
      {status === 'loading' ? (
        <div className="text-gray-500">Loading categories...</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat, idx) => (
              <tr key={cat.id || cat.title}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{cat.title}</td>
                <td className="px-4 py-2">
                  {cat.image && (
                    <img src={cat.image.startsWith('http') ? cat.image : IMAGE_BASE_URL + cat.image} alt={cat.title} className="h-10 object-contain rounded" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default TechnologyCategoriesPage