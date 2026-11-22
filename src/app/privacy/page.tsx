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
  CONTACT_INFO,
  LANGUAGES,
  UI_COPY,
  LangKey,
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
  Globe,
  Copy,
  Check,
  ArrowUp,
  AlertTriangle,
} from 'lucide-react';

export default function HomePage() {
  // Default language is Amharic ('am') on first load
  const [lang, setLang] = useState<LangKey>('am');
  const [modalOpen, setModalOpen] = useState(false);
  const [activeService, setActiveService] = useState<ServiceKey>('application');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const t = UI_COPY[lang];

  const openRequestWithService = (service: ServiceKey) => {
    setActiveService(service);
    setModalOpen(true);
  };

  const handleCopy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(label);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      setCopiedField(null);
    }
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
      {/* NAVIGATION BAR WITH 4-LANGUAGE SELECTOR (AMHARIC FIRST) */}
      <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-slate-950/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <Link href="#home" className="font-extrabold tracking-tight text-white text-base sm:text-lg shrink-0">
            DAWIT SERVICES
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-slate-300">
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

          <div className="flex items-center gap-2.5">
            <div className="flex items-center rounded-xl border border-slate-700 bg-slate-900 p-1">
              {LANGUAGES.map((item) => {
                const active = lang === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setLang(item.key)}
                    title={item.label}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.native}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => openRequestWithService('application')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer shrink-0"
            >
              {t.requestBtn}
            </button>
          </div>
        </div>
      </header>

      {/* EYE-CATCHING 4-LANGUAGE NOTICE BANNER */}
      <div className="border-b border-blue-500/30 bg-gradient-to-r from-blue-950/70 via-slate-900 to-blue-950/70 px-4 sm:px-6 py-3">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2.5 text-xs sm:text-sm text-blue-100">
            <Globe className="w-4 h-4 text-blue-400 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-extrabold text-blue-300 mr-2">{t.langBannerBadge}:</span>
              <span>{t.langBannerText}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {LANGUAGES.map((item) => {
              const active = lang === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setLang(item.key)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition cursor-pointer ${
                    active
                      ? 'bg-blue-600 border-blue-400 text-white shadow-sm'
                      : 'bg-slate-950/80 border-slate-700 text-slate-200 hover:border-blue-400/60'
                  }`}
                >
                  {item.native} ({item.label})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <main>
        {/* 1. HOMEPAGE HERO SECTION */}
        <section className="border-b border-slate-800/80 py-14 sm:py-20 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-300">
              <span>DAWIT SERVICES</span>
              <span>•</span>
              <span>Digital &amp; Administrative Assistance</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t.heroHeadline}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
              {t.heroSubtext}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => openRequestWithService('application')}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition cursor-pointer"
              >
                {t.requestBtn}
              </button>
              <a
                href="#services"
                className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-100 text-sm font-bold transition"
              >
                {t.exploreBtn}
              </a>
            </div>
          </div>
        </section>

        {/* 2. ONLY THREE SERVICE CATEGORIES */}
        <section id="services" className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.servicesHeading}</h2>
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

        {/* 3. HOW THE SERVICE WORKS */}
        <section id="how-it-works" className="py-16 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-950">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="max-w-2xl space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.howItWorksHeading}</h2>
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

        {/* 4. 200 ETB SERVICE DEPOSIT POLICY */}
        <section className="py-16 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-4xl mx-auto rounded-2xl border border-blue-500/40 bg-slate-900 p-6 sm:p-8 space-y-4">
            <div className="inline-block text-xs font-bold uppercase tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-full">
              Deposit Policy
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.depositHeading}</h2>
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

        {/* 6. TRANSPARENT PRICING */}
        <section className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.pricingHeading}</h2>
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

        {/* 5. REUSABLE SERVICE REQUEST FORM SECTION */}
        <section id="request-form" className="py-16 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/30">
          <div className="max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.formHeading}</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Share your details and select the assistance you need. We will review your request and reach out for an
                initial discussion.
              </p>
            </div>
            <ServiceRequestForm initialService={activeService} />
          </div>
        </section>

        {/* 7. ABOUT DAWIT WITH PROFILE PHOTO (/dawit-profile.jpg) */}
        <section id="about" className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <img
                src="/dawit-profile.jpg"
                alt="Dawit Tesfay"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border border-slate-700 shrink-0 bg-slate-950"
              />

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400">{t.aboutHeading}</div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Dawit Tesfay</h2>
                  <p className="text-sm font-semibold text-blue-300 mt-1">{t.aboutRole}</p>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">{t.aboutBio}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. TRUST SECTION */}
        <section className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.trustHeading}</h2>
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

        {/* 9. IMPORTANT DISCLAIMER */}
        <section className="py-14 px-4 sm:px-6 border-b border-slate-800/80 bg-slate-900/40">
          <div className="max-w-4xl mx-auto rounded-2xl border border-amber-500/30 bg-slate-900 p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <span>{t.disclaimerHeading}</span>
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

        {/* 13. FAQ */}
        <section id="faq" className="py-16 px-4 sm:px-6 border-b border-slate-800/80">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.faqHeading}</h2>
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

        {/* 11. CONTACT SECTION WITH EXACT CONTACTS + EMERGENCY / VIP EMAIL RULES */}
        <section id="contact" className="py-16 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{t.contactHeading}</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  Reach out directly for standard inquiries or submit a service request online.
                </p>
              </div>
              <button
                type="button"
                onClick={() => openRequestWithService('application')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition w-fit cursor-pointer"
              >
                {t.requestBtn}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Phone className="w-4 h-4 text-blue-400" />
                    <span>Phone</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('phone', CONTACT_INFO.phone)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Copy phone number"
                  >
                    {copiedField === 'phone' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <a href={`tel:${CONTACT_INFO.phone}`} className="block text-slate-100 font-semibold hover:text-blue-300">
                  {CONTACT_INFO.phone}
                </a>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Send className="w-4 h-4 text-blue-400" />
                    <span>Telegram</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('telegram', CONTACT_INFO.telegram)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Copy Telegram username"
                  >
                    {copiedField === 'telegram' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <a
                  href={`https://t.me/${CONTACT_INFO.telegram.replace(/^@/, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-slate-100 font-semibold hover:text-blue-300"
                >
                  {CONTACT_INFO.telegram}
                </a>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <Mail className="w-4 h-4 text-blue-400" />
                    <span>Standard Email</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy('email', CONTACT_INFO.standardEmail)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                    title="Copy standard email"
                  >
                    {copiedField === 'email' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <a
                  href={`mailto:${CONTACT_INFO.standardEmail}`}
                  className="block text-slate-100 font-semibold hover:text-blue-300 break-all"
                >
                  {CONTACT_INFO.standardEmail}
                </a>
              </div>
            </div>

            {/* EMERGENCY / VIP PRIORITY EMAIL BOX */}
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-extrabold text-amber-300">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Emergency or VIP / Premium Service Email: {CONTACT_INFO.vipEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('vip', CONTACT_INFO.vipEmail)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-amber-500/40 text-xs font-semibold text-amber-200 hover:bg-slate-900 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedField === 'vip' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy VIP Email</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs sm:text-sm text-amber-100/95 leading-relaxed">
                If you have an emergency or need VIP / premium service, you can email{' '}
                <a href={`mailto:${CONTACT_INFO.vipEmail}`} className="underline font-bold text-white">
                  {CONTACT_INFO.vipEmail}
                </a>
                .
              </p>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                <strong>N.B.</strong> This email is strictly for <strong>Emergency</strong> and <strong>VIP</strong>{' '}
                requests. Standard service requests will <strong>not</strong> receive a reply at this address, and anyone
                emailing for Emergency or VIP support must include <strong>&ldquo;Emergency&rdquo;</strong> or{' '}
                <strong>&ldquo;VIP&rdquo;</strong> in the email subject.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 10. PRIVACY, TERMS AND REFUND FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p>DAWIT SERVICES — Digital &amp; Administrative Assistance</p>
            <a
              href="#home"
              className="inline-flex items-center gap-1 text-slate-300 hover:text-white font-semibold transition"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Top</span>
            </a>
          </div>
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

      {/* MODAL FOR "REQUEST A SERVICE" BUTTONS */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-7 space-y-4 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-extrabold text-white">{t.formHeading}</h3>
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