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
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
