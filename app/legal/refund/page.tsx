export default function RefundPage() {
  return (
    <>
      {/* Similar navigation as terms page */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Refund Policy</h1>
          <div className="prose prose-invert">
            <p className="text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl text-white mt-6">Refund Eligibility</h2>
            <p className="text-gray-300">
              We offer a 7-day money-back guarantee on all new subscriptions.
            </p>

            <h2 className="text-2xl text-white mt-6">
              How to Request a Refund
            </h2>
            <p className="text-gray-300">To request a refund:</p>
            <ol className="text-gray-300 list-decimal pl-6">
              <li>Contact our support team at vikaswakdepc@gmail.com</li>
              <li>Include your account email and reason for refund</li>
              <li>Refunds are processed within 5-7 business days</li>
            </ol>
          </div>
        </div>
      </div>
    </>
  );
}
