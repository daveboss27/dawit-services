import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to DAWIT SERVICES
        </Link>

        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400">Draft policy notice for Dawit Services.</p>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            When you submit a service request or communicate with Dawit Services, you may share contact details (such
            as your name, phone number, Telegram contact, or email) as well as information related to applications,
            passport appointments, identification, travel preferences, or academic records.
          </p>
          <p>
            Information and documents you share are used strictly to review your request, discuss service scope, and
            provide the agreed assistance. Customers remain responsible for ensuring all submitted details and documents
            are accurate and authentic.
          </p>
          <p>
            We do not sell customer information to third parties. Because third-party platforms, embassies,
            universities, airlines, or government portals operate independently, please review the privacy policies of
            any external services you use or authorize.
          </p>
        </div>
      </div>
    </div>
  );
}