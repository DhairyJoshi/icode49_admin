import BlogManager from '../components/BlogManager'
import { useState } from 'react'

function BlogsPage() {
  const [refresh, setRefresh] = useState(false)

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
      </div>
      <BlogManager key={refresh} />
    </div>
  )
}

export default BlogsPage 