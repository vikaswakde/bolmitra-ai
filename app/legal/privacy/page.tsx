export default function PrivacyPage() {
  return (
    <>
      {/* Similar navigation as terms page */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-invert">
            <p className="text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl text-white mt-6">Data Collection</h2>
            <p className="text-gray-300">
              We collect and process the following information:
            </p>
            <ul className="text-gray-300 list-disc pl-6">
              <li>Account information (email, name)</li>
              <li>
                Payment information (processed securely through Payment Gateway)
              </li>
              <li>Chat history and interactions</li>
              <li>Voice recordings (when using voice features)</li>
            </ul>

            <h2 className="text-2xl text-white mt-6">
              Voice Recording Storage and Processing
            </h2>
            <p className="text-gray-300">
              When you use our voice features, your voice recordings are
              temporarily stored for processing purposes. We use Google Gemini
              AI services for voice processing. These recordings are:
            </p>
            <ul className="text-gray-300 list-disc pl-6">
              <li>
                Used only for processing your requests and improving our
                services
              </li>
              <li>Processed through Google Gemini AI services</li>
              <li>
                Automatically deleted from Google's servers within 48 hours
              </li>
              <li>
                Stored securely and handled in accordance with data protection
                regulations
              </li>
            </ul>

            <h2 className="text-2xl text-white mt-6">Data Retention</h2>
            <p className="text-gray-300">
              We implement automatic deletion processes to ensure your data
              privacy:
            </p>
            <ul className="text-gray-300 list-disc pl-6">
              <li>
                Voice recordings are automatically deleted from our storage
                within 48 hours
              </li>
              <li>
                Voice data processed by Google Gemini is automatically deleted
                from their servers within 48 hours
              </li>
              <li>We use secure cloud storage with strict access controls</li>
              <li>Regular maintenance is performed to remove outdated data</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
