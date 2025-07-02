import ProjectManager from '../components/ProjectManager'
import { useState } from 'react'

function ProjectsPage() {
  const [refresh, setRefresh] = useState(false)

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
      </div>
      <ProjectManager key={refresh} />
    </div>
  )
}

export default ProjectsPage 