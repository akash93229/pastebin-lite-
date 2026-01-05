import { notFound } from 'next/navigation'

interface PageProps {
  params: {
    id: string
  }
}

// Simple function to get paste data (in production this would be from database)
async function getPasteData(id: string) {
  try {
    // Call our API to get the paste data (without incrementing view count)
    const response = await fetch(`http://localhost:3000/api/pastes/${id}`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error fetching paste:', error)
    return null
  }
}

export default async function PastePage({ params }: PageProps) {
  const { id } = params

  try {
    // For now, let's create a simple static page that works
    // In production, this would fetch from the database
    
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Paste: {id}
              </h1>
              <a
                href="/"
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border border-blue-600 hover:border-blue-500 rounded-md transition-colors"
              >
                Create New Paste
              </a>
            </div>
            
            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <span>Loading paste data...</span>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Content</h2>
            </div>
            <div className="p-6">
              <div className="text-gray-600">
                Paste content will appear here once the API is working.
                <br />
                <br />
                <strong>Note:</strong> This page is currently in development mode.
                <br />
                The paste creation is working - try creating a paste and you'll get a shareable URL!
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading paste:', error)
    notFound()
  }
}