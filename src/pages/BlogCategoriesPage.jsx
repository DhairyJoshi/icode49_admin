import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchBlogCategories, createBlogCategory } from '../slices/blogCategoriesSlice'

function BlogCategoriesPage() {
  const dispatch = useDispatch()
  const { items: categories, status, error, createStatus, createError, createSuccess } = useSelector(state => state.blogCategories)
  const [newCategory, setNewCategory] = useState('')

  React.useEffect(() => {
    dispatch(fetchBlogCategories())
  }, [dispatch])

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return
    dispatch(createBlogCategory(newCategory.trim())).then((action) => {
      if (action.type.endsWith('fulfilled')) {
        setNewCategory('')
        dispatch(fetchBlogCategories())
      }
    })
  }

  return (
    <div className="mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Blog Categories</h2>
      <div className="flex mb-4">
        <input
          type="text"
          value={newCategory}
          onChange={e => setNewCategory(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-l"
          placeholder="Add new category"
          disabled={createStatus === 'loading'}
        />
        <button
          onClick={handleAddCategory}
          className="px-4 py-2 bg-blue-600 text-white rounded-r hover:bg-blue-700"
          disabled={createStatus === 'loading'}
        >
          {createStatus === 'loading' ? 'Adding...' : 'Add'}
        </button>
      </div>
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
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((cat, idx) => (
              <tr key={typeof cat === 'string' ? cat : cat.id || cat.category}>
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{typeof cat === 'string' ? cat : cat.category || cat.name}</td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${cat.status === 'inactive' ? 'bg-gray-200 text-gray-600' : 'bg-green-100 text-green-700'}`}>
                    {cat.status === 'inactive' ? 'Inactive' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default BlogCategoriesPage 