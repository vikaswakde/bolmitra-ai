import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full border-b border-gray-700 bg-gray-900/50 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">BolMitra AI</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Legal Policies</h1>

          {/* Terms of Service */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-4">
              Terms of Service
            </h2>
            <div className="prose prose-invert">
              <p className="text-gray-300">
                Last updated: {new Date().toLocaleDateString()}
              </p>

              <h3 className="text-xl text-white mt-6">
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-300">
                By accessing and using BolMitra AI, you agree to be bound by
                these Terms and Conditions and all applicable laws and
                regulations.
              </p>

              <h3 className="text-xl text-white mt-6">
                2. Subscription and Payments
              </h3>
              <p className="text-gray-300">
                - Free tier users can access limited features
                <br />
                - Pro subscription is billed monthly or annually
                <br />
                - Payments are processed securely through our payment gateway
                <br />- Subscription can be cancelled at any time
              </p>

              <h3 className="text-xl text-white mt-6">3. Refund Policy</h3>
              <p className="text-gray-300">
                - Refunds are available within 7 days of purchase
                <br />
                - Contact support for refund requests
                <br />
                - Refunds are processed through the original payment method
                <br />- Partial refunds may be offered for unused service time
              </p>

              <h3 className="text-xl text-white mt-6">4. Privacy Policy</h3>
              <p className="text-gray-300">
                We take your privacy seriously. Here&apos;s how we handle your
                data:
              </p>
              <ul className="text-gray-300 list-disc pl-6">
                <li>
                  We collect only necessary information for service operation
                </li>
                <li>
                  Your data is processed securely and not shared with third
                  parties
                </li>
                <li>We use industry-standard encryption for data protection</li>
                <li>You can request data deletion at any time</li>
              </ul>

              <h3 className="text-xl text-white mt-6">
                5. User Responsibilities
              </h3>
              <p className="text-gray-300">Users must:</p>
              <ul className="text-gray-300 list-disc pl-6">
                <li>Have legal rights to upload and process documents</li>
                <li>Maintain account security</li>
                <li>Not misuse or attempt to abuse the service</li>
                <li>Comply with all applicable laws and regulations</li>
              </ul>

              <h3 className="text-xl text-white mt-6">
                6. Service Limitations
              </h3>
              <p className="text-gray-300">
                - We aim for 99.9% uptime but don&apos;t guarantee uninterrupted
                service
                <br />
                - AI responses are automated and may not be 100% accurate
                <br />
                - Document processing times vary by size and complexity
                <br />- Maximum file size and monthly usage limits apply
              </p>

              <h3 className="text-xl text-white mt-6">
                7. Contact Information
              </h3>
              <p className="text-gray-300">
                For support, refunds, or privacy concerns, contact us at:
                <br />
                Email: vikaswakdepc@gmail.com
                <br />
                Response time: Within 24 hours
              </p>
            </div>
            <h3 className="text-xl text-white mt-6">
              8. Shipping and Delivery
            </h3>
            <p className="text-gray-300">
              - Digital products are delivered instantly after payment
              <br />
              - Access to your purchases is available in your account dashboard
              <br />
              - Download links are sent to your registered email
              <br />- Support available 24/7 for download assistance
            </p>

            <h3 className="text-xl text-white mt-6">9. Contact Us</h3>
            <p className="text-gray-300">
              jj For general inquiries and support:
              <br />
              Email: vikaswakdepc@gmail.com
              <br />
              Office Hours: Monday-Friday, 9 AM - 6 PM EST
            </p>
          </section>

          <div className="mt-8 text-center">
            <Link href="/">
              <Button variant="secondary">Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
