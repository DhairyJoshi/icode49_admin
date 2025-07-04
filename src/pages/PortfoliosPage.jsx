import PortfolioManager from '../components/PortfolioManager'
import { useState } from 'react'

function PortfoliosPage() {
  const [refresh, setRefresh] = useState(false)

  return (
    <div className="space-y-6">
      <PortfolioManager key={refresh} />
    </div>
  )
}

export default PortfoliosPage