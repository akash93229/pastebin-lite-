import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Paste Not Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The paste you&apos;re looking for doesn&apos;t exist, has expired, or has exceeded its view limit.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Create New Paste
          </Link>
          
          <div className="text-sm text-gray-500">
            <p>Possible reasons:</p>
            <ul className="mt-2 space-y-1">
              <li>• The paste ID is incorrect</li>
              <li>• The paste has expired</li>
              <li>• The paste has reached its maximum view count</li>
              <li>• The paste was never created</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}