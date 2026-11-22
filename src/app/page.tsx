'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ServiceRequestForm from './components/ServiceRequestForm';
import {
  SERVICES,
  HOW_IT_WORKS_STEPS,
  TRUST_PILLARS,
  FAQ_ITEMS,
  DEPOSIT_AMOUNT_ETB,
  ServiceKey,
} from './lib/servicesData';
import {
  FileText,
  Compass,
  Plane,
  ShieldCheck,
  MessageSquare,
  Wallet,
  UserCheck,
  Wrench,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  Send,
  Mail,
} from 'lucide-react';

export default function HomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceKey>('application');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const openRequestWithService = (service: ServiceKey) => {
    setActiveService(service);
    setModalOpen(true);
  };

  const renderServiceIcon = (key: ServiceKey) => {
    if (key === 'application') return <FileText className="w-5 h-5 text-blue-400" />;
    if (key === 'passport') return <Compass className="w-5 h-5 text-blue-400" />;
    return <Plane className="w-5 h-5 text-blue-400" />;
  };

  const renderTrustIcon = (index: number) => {
    if (index === 0) return <MessageSquare className="w-5 h-5 text-blue-400" />;
    if (index === 1) return <Wallet className="w-5 h-5 text-blue-400" />;
    if (index === 2) return <UserCheck className="w-5 h-5 text-blue-400" />;
    return <Wrench className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div id="home" className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-slate-950/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="#home" className="font-extrabold tracking-tight text-white text-base sm:text-lg">
            DAWIT SERVICES
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
            <a href="#home" className="hover:text-white transition">
              Home
            </a>
            <a href="#services" className="hover:text-white transition">
              Services
            </a>
            <a href="#how-it-works" className="hover:text-white transition">
              How It Works
            </a>
            <a href="#about" className="hover:text-white transition">
              About
            </a>
            <a href="#faq" className="hover:text-white transition">
              FAQ
            </a>
            <a href="#contact" className="hover:text-white transition">
              Contact
            </a>
          </nav>

          <button
            type="button"
            onClick={() => openRequestWithService('application')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
          >
            Request a Service
          </button>
        </div>
      </header>

      <main>
        <section className="border-b border-slate-800/80 py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
              <span>DAWIT SERVICES</span>
              <span>•</span>
              <span>Digital &amp; Administrative Assistance</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Need help navigating a passport process, online application, or flight booking?
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              We provide practical assistance to individuals who need help using digital platforms, completing
              applications, navigating passport processes, or arranging flights.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => openRequestWithService('application')}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition cursor-pointer"
              >
                Request a Service
              </button>
              <a
                href="#services"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold transition"
              >
                Explore Services
              </a>
            </div>
          </div>
        </section>

        <section id="services" className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Core Services</h2>
              <p className="text-sm text-slate-400">
                Focused practical support across three clear areas: digital applications, passport appointments, and
                flight options.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {SERVICES.map((service) => (
                <article
                  key={service.key}
                  className={`rounded-2xl border p-6 flex flex-col justify-between space-y-5 ${
                    service.prominent
                      ? 'lg:col-span-6 bg-slate-900 border-blue-500/40'
                      : 'lg:col-span-3 bg-slate-900/75 border-slate-800'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        {renderServiceIcon(service.key)}
                      </div>
                      {service.startingPriceEtb !== null && (
                        <span className="text-xs font-bold text-blue-300 bg-blue-500/10 border border-blue-500/30 px-2.5 py-1 rounded-lg">
                          Starting from {service.startingPriceEtb} ETB
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-white">{service.title}</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">{service.description}</p>

                    <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                      {service.highlights.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span className="text-blue-400 font-bold">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-800">
                    <p className="text-xs text-slate-400 leading-relaxed">{service.disclaimer}</p>
                    <p className="text-xs text-slate-400 leading-relaxed">{service.feeNote}</p>
                    <button
                      type="button"
                      onClick={() => openRequestWithService(service.key)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                    >
                      {service.requestButtonLabel}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-16 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How It Works</h2>
              <p className="text-sm text-slate-400">
                Every request follows a clear step-by-step process from initial inquiry to agreed assistance.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {HOW_IT_WORKS_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5 space-y-2.5"
                >
                  <div className="text-xs font-extrabold tracking-wider text-blue-400">{item.step}</div>
                  <h3 className="text-base font-bold text-white">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-4xl mx-auto rounded-2xl border border-blue-500/40 bg-slate-900 p-6 sm:p-8 space-y-4">
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
              Deposit Policy
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">200 ETB Service Deposit</h2>
            <div className="space-y-3 text-sm text-slate-200 leading-relaxed">
              <p>
                Before we begin providing a service, a {DEPOSIT_AMOUNT_ETB} ETB service deposit is required after the
                initial discussion and agreement to proceed.
              </p>
              <p>
                If you proceed with the agreed service, the {DEPOSIT_AMOUNT_ETB} ETB deposit will be deducted from the
                total service fee.
              </p>
              <p>
                If we do not reach an agreement during the initial negotiation, the {DEPOSIT_AMOUNT_ETB} ETB deposit will
                be refunded.
              </p>
              <p className="font-semibold text-blue-200">
                The deposit is therefore not an additional charge. It forms part of the agreed service fee when the
                customer proceeds.
              </p>
            </div>
            <p className="text-xs text-slate-400 pt-1">
              Flow: Request → Initial discussion → Agreement on service/price → {DEPOSIT_AMOUNT_ETB} ETB deposit →
              Service begins
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Transparent Pricing</h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Service fees depend on the type and complexity of the request. We discuss and agree on the service scope
                and price before work begins.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">{DEPOSIT_AMOUNT_ETB} ETB Service Deposit</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Deducted from the final service fee when the customer proceeds.
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-1.5 text-xs text-slate-400">
                  {SERVICES.map((s) => (
                    <div key={s.key} className="flex items-center justify-between gap-2">
                      <span>{s.title}</span>
                      <span className="text-slate-300 font-medium">
                        {s.startingPriceEtb !== null ? `Starting from ${s.startingPriceEtb} ETB` : 'Agreed after review'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-3">
                <h3 className="text-lg font-bold text-white">Service Fee vs. Third-Party Costs</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">Dawit Services fee</span> covers our guidance, review, and
                  assistance time as agreed before work begins.
                </p>
                <p className="text-sm text-slate-300 leading-relaxed">
                  <span className="font-semibold text-white">Government / university / airline / third-party fees</span>{' '}
                  are separate unless explicitly stated and are paid or handled according to the relevant institution or
                  provider.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="request-form" className="py-16 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/30">
          <div className="max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Request a Service</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Share your details and select the assistance you need. We will review your request and reach out for an
                initial discussion.
              </p>
            </div>
            <ServiceRequestForm initialService={activeService} />
          </div>
        </section>

        <section id="about" className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
            <div className="text-xs font-bold uppercase tracking-wider text-blue-400">Meet Dawit</div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Dawit Tesfay Mengstu</h2>
              <p className="text-sm font-semibold text-blue-300 mt-1">
                Computer Science &amp; Management Student | Digital &amp; Administrative Support
              </p>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              I am an undergraduate Computer Science student with Management studies and practical experience teaching
              English and helping students and individuals work through online forms, digital platforms, and
              administrative steps. My background combines technical familiarity with structured communication so clients
              get clear, patient guidance on everyday digital and booking tasks.
            </p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why Dawit Services?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {TRUST_PILLARS.map((pillar, idx) => (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3"
                >
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 w-fit">
                    {renderTrustIcon(idx)}
                  </div>
                  <h3 className="text-base font-bold text-white">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-4xl mx-auto rounded-2xl border border-amber-500/30 bg-slate-900 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>Important Disclaimer</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Dawit Services provides digital, administrative and informational assistance. We do not control decisions
              made by government authorities, universities, embassies, airlines, immigration authorities, or other third
              parties.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We do not guarantee passport issuance, university admission, scholarship awards, visa approval, flight
              availability, or other third-party decisions.
            </p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Customers are responsible for providing accurate information and authentic documents.
            </p>
          </div>
        </section>

        <section id="faq" className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={item.question}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:bg-slate-800/40 transition cursor-pointer"
                    >
                      <span>{item.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/70 pt-3">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="contact" className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Contact Dawit Services</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Reach out through your existing contact channels or submit a service request online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openRequestWithService('application')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition w-fit cursor-pointer"
              >
                Request a Service
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span>Phone</span>
                </div>
                <p className="text-slate-200 font-medium">Available via your existing site contact details</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Send className="w-4 h-4 text-blue-400" />
                  <span>Telegram</span>
                </div>
                <p className="text-slate-200 font-medium">Available via your existing Telegram contact</p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Email</span>
                </div>
                <p className="text-slate-200 font-medium">Available via your existing email contact</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>DAWIT SERVICES — Digital &amp; Administrative Assistance</p>
          <div className="flex flex-wrap items-center gap-6 font-semibold text-slate-300">
            <Link href="/privacy" className="hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/refund" className="hover:text-white transition">
              Refund Policy
            </Link>
            <Link href="/admin" className="hover:text-white transition">
              Admin
            </Link>
          </div>
        </div>
      </footer>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-7 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-white">Request a Service</h3>
                <p className="text-xs text-slate-400">
                  Initial discussion comes before any {DEPOSIT_AMOUNT_ETB} ETB service deposit.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <ServiceRequestForm initialService={activeService} />
          </div>
        </div>
      )}
    </div>
  );
}