'use client'

import { useState } from 'react'
import { CreatePasteRequest, CreatePasteResponse } from '@/types/paste'

interface PasteFormProps {
  onSuccess?: (result: CreatePasteResponse) => void
  onError?: (error: string) => void
}

export default function PasteForm({ onSuccess, onError }: PasteFormProps) {
  const [content, setContent] = useState('')
  const [ttl, setTtl] = useState<string>('')
  const [maxViews, setMaxViews] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<CreatePasteResponse | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      const requestBody: CreatePasteRequest = {
        content: content.trim(),
      }

      // Add TTL if provided
      if (ttl.trim()) {
        const ttlSeconds = parseInt(ttl.trim(), 10)
        if (!isNaN(ttlSeconds) && ttlSeconds > 0) {
          requestBody.ttl = ttlSeconds
        }
      }

      // Add max_views if provided
      if (maxViews.trim()) {
        const maxViewsNum = parseInt(maxViews.trim(), 10)
        if (!isNaN(maxViewsNum) && maxViewsNum > 0) {
          requestBody.max_views = maxViewsNum
        }
      }

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create paste')
      }

      setSuccess(data)
      setContent('')
      setTtl('')
      setMaxViews('')
      onSuccess?.(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = content.trim().length > 0

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Content textarea */}
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Paste Content *
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your text here..."
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            style={{ color: '#000000', backgroundColor: '#ffffff', colorScheme: 'light' }}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            {content.length} characters
          </p>
        </div>

        {/* Optional settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="ttl" className="block text-sm font-medium text-gray-700 mb-2">
              Expiration (seconds)
            </label>
            <input
              type="number"
              id="ttl"
              value={ttl}
              onChange={(e) => setTtl(e.target.value)}
              placeholder="e.g., 3600 (1 hour)"
              min="60"
              max="31536000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ color: '#000000', backgroundColor: '#ffffff', colorScheme: 'light' }}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for no expiration
            </p>
          </div>

          <div>
            <label htmlFor="maxViews" className="block text-sm font-medium text-gray-700 mb-2">
              Max Views
            </label>
            <input
              type="number"
              id="maxViews"
              value={maxViews}
              onChange={(e) => setMaxViews(e.target.value)}
              placeholder="e.g., 10"
              min="1"
              max="1000000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              style={{ color: '#000000', backgroundColor: '#ffffff', colorScheme: 'light' }}
            />
            <p className="mt-1 text-xs text-gray-500">
              Leave empty for unlimited views
            </p>
          </div>
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={!isFormValid || isSubmitting}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Paste...' : 'Create Paste'}
          </button>
        </div>
      </form>

      {/* Error message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Paste Created Successfully!</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>Paste ID: <code className="bg-green-100 px-1 rounded">{success.id}</code></p>
                <p className="mt-1">
                  Share URL: 
                  <a 
                    href={success.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-1 text-green-600 hover:text-green-500 underline break-all"
                  >
                    {success.url}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}