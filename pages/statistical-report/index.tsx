import { Building2, Lightbulb } from 'lucide-react'
import { useState } from 'react'
import IdeaReport from './idea-report'
import DepartmentReport from './department-report'

export default function StatisticalReport() {
  const [isIdeaTab, setIsIdeaTab] = useState(true)

  return (
    <div>
      <div className='flex items-center mb-4'>
        <button
          className={`flex gap-4 items-center px-4 py-2 rounded text-sm ${isIdeaTab && 'bg-primary text-white'}`}
          onClick={() => setIsIdeaTab(true)}
        >
          <Lightbulb size={18} /> Idea
        </button>
        <button
          className={`flex gap-4 items-center px-4 py-2 rounded text-sm ${!isIdeaTab && 'bg-primary text-white'}`}
          onClick={() => setIsIdeaTab(false)}
        >
          <Building2 size={18} /> Project
        </button>
      </div>
      {isIdeaTab ? <IdeaReport /> : <DepartmentReport />}
    </div>
  )
}
