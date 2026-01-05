'use client'

import { useState } from 'react'

interface PasteActionsProps {
  content: string
  pasteId: string
}

export default function PasteActions({ content, pasteId }: PasteActionsProps) {
  const [copyContentStatus, setCopyContentStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [copyUrlStatus, setCopyUrlStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  const pasteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${pasteId}`

  const copyToClipboard = async (text: string, type: 'content' | 'url') => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === 'content') {
        setCopyContentStatus('copied')
        setTimeout(() => setCopyContentStatus('idle'), 2000)
      } else {
        setCopyUrlStatus('copied')
        setTimeout(() => setCopyUrlStatus('idle'), 2000)
      }
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      if (type === 'content') {
        setCopyContentStatus('error')
        setTimeout(() => setCopyContentStatus('idle'), 2000)
      } else {
        setCopyUrlStatus('error')
        setTimeout(() => setCopyUrlStatus('idle'), 2000)
      }
    }
  }

  return (
    <div className="flex gap-4">
      <button
        onClick={() => copyToClipboard(content, 'content')}
        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        disabled={copyContentStatus === 'copied'}
      >
        {copyContentStatus === 'copied' ? 'Copied!' : copyContentStatus === 'error' ? 'Error' : 'Copy Content'}
      </button>
      
      <button
        onClick={() => copyToClipboard(pasteUrl, 'url')}
        className="px-4 py-2 bg-gray-600 text-white font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
        disabled={copyUrlStatus === 'copied'}
      >
        {copyUrlStatus === 'copied' ? 'Copied!' : copyUrlStatus === 'error' ? 'Error' : 'Copy URL'}
      </button>
    </div>
  )
}