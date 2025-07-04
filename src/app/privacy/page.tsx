import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import React from "react";

const PrivacyPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-amber-50">
      <Navbar />
      <main className="container max-w-3xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

        <p className="mb-4">
          This Privacy Policy explains how UNI LIFE (“we,“ “our,“ or “us“) collects, uses, and protects your personal data when you subscribe to our newsletter. We are committed to safeguarding your privacy in accordance with the General Data Protection Regulation (GDPR).
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">1. Data Controller</h2>
        <p className="mb-4">
          The data controller responsible for your personal data is:
          <br />
          <strong>UNI LIFE</strong><br />
          Email: data@unilife.fi
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">2. What Data We Collect</h2>
        <p className="mb-4">
          We collect only your email address when you subscribe to our newsletter.
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">3. Purpose and Legal Basis</h2>
        <p className="mb-4">
          We use your email address to send you our newsletter, which may include updates on upcoming events, special offers, and other promotional content related to UNI LIFE.
          <br />
          The legal basis for processing your data is your <strong>explicit consent</strong> (Article 6(1)(a) GDPR).
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">4. How We Collect Data</h2>
        <p className="mb-4">
          Data is collected via a subscription form on our website. Submission is entirely voluntary and requires active consent.
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">5. How We Store and Secure Your Data</h2>
        <p className="mb-4">
          Your data is securely stored via our form processing and email service providers. We take appropriate technical and organizational measures to prevent unauthorized access or disclosure.
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">6. Who Has Access to Your Data</h2>
        <p className="mb-4">
          Only we have access to your email address.
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">7. Data Retention</h2>
        <p className="mb-4">
          We retain your email address until you unsubscribe from the newsletter or request deletion.
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">8. Your Rights</h2>
        <p className="mb-4">
          Under the GDPR, you have the right to:
        </p>
        <ul className="list-disc list-inside mb-4">
          <li>Access your data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data (“right to be forgotten”)</li>
          <li>Withdraw consent at any time</li>
          <li>Lodge a complaint with a supervisory authority</li>
        </ul>
        <p className="mb-4">
          You can exercise your rights by contacting us at data@unilife.fi.
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">9. Unsubscribing</h2>
        <p className="mb-4">
          Every newsletter email includes an unsubscribe link. Alternatively, you may contact us to be manually removed from our mailing list.
        </p>

        <h2 className="text-xl font-medium mt-6 mb-2">10. Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. The most current version will always be available on this page.
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: May 8th 2025
        </p>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;
