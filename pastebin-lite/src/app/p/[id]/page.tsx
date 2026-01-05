import { notFound } from 'next/navigation'
import { pasteService } from '@/services/paste-service'
import PasteActions from '@/components/paste-actions'
import Link from 'next/link'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PastePage({ params }: PageProps) {
  // Await the params in Next.js 16
  const { id } = await params

  // Get paste data without incrementing view count (for web page access)
  const paste = await pasteService.getPasteWithoutViewIncrement(id)
  
  if (!paste) {
    notFound()
  }

  // Format dates for display
  const createdAt = new Date(paste.created_at).toLocaleString()
  const expiresAt = paste.expires_at ? new Date(paste.expires_at).toLocaleString() : null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Paste: {id}
            </h1>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 border border-blue-600 hover:border-blue-500 rounded-md transition-colors"
            >
              Create New Paste
            </Link>
          </div>
          
          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Created: {createdAt}</span>
            {expiresAt && <span>Expires: {expiresAt}</span>}
            <span>Views: {paste.view_count}</span>
            {paste.max_views && (
              <span>Max Views: {paste.max_views}</span>
            )}
            {paste.remaining_views !== undefined && (
              <span>Remaining Views: {paste.remaining_views}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mb-4">
          <PasteActions pasteId={id} content={paste.content} />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Content</h2>
          </div>
          <div className="p-6">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-900 break-words">
              {paste.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}