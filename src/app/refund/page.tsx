import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to DAWIT SERVICES
        </Link>

        <h1 className="text-3xl font-extrabold text-white">Refund Policy</h1>
        <p className="text-xs text-slate-400">200 ETB Service Deposit &amp; Refund Terms.</p>

        <div className="space-y-4 text-sm text-slate-300 leading-relaxed">
          <p>
            A 200 ETB service deposit is requested only after the initial discussion and agreement to proceed with a
            service.
          </p>
          <p>
            If we do not reach an agreement during the initial negotiation, the 200 ETB deposit will be refunded.
          </p>
          <p>
            If you proceed with the agreed service, the 200 ETB deposit is deducted from the total service fee rather
            than charged as an extra fee. Once work on an agreed service begins or third-party charges are incurred,
            refund terms depend on the agreed scope and work completed.
          </p>
        </div>
      </div>
    </div>
  );
}