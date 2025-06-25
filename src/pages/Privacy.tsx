
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-200">
            Your privacy is important to us
          </p>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <div className="text-gray-600 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <p>
                  When you contact us through our consultation form, we collect the following information:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your name and contact information (email and phone number)</li>
                  <li>Your preferred product category and business goals</li>
                  <li>Any additional information you choose to share about your brand vision</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <p>
                  We use the information you provide to:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact you regarding your consultation request</li>
                  <li>Provide personalized recommendations for your brand launch</li>
                  <li>Send you relevant information about our services</li>
                  <li>Improve our services and customer experience</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties. 
                  Your information is kept confidential and is only used for the purposes stated above.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. Your information is stored 
                  securely and access is limited to authorized personnel only.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
                <p>
                  If you have any questions about this Privacy Policy or how we handle your information, 
                  please contact us at:
                </p>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p><strong>Email:</strong> askelevate51@gmail.com</p>
                  <p><strong>Phone:</strong> 03148860546</p>
                  <p><strong>Address:</strong> A316, Block 2 Gulshan Iqbal Karachi</p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page 
                  with an updated effective date.
                </p>
                <p className="text-sm text-gray-500 mt-4">
                  <strong>Last updated:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;
