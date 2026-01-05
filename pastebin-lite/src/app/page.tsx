import PasteForm from '@/components/paste-form'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Pastebin Lite
          </h1>
          <p className="text-lg text-gray-600">
            Share text snippets quickly and securely
          </p>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Create a New Paste
          </h2>
          
          <PasteForm />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Pastes can be set to expire after a certain time or number of views.
          </p>
        </div>
      </div>
    </div>
  )
}