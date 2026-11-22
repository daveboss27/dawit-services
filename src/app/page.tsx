'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from './lib/supabase';
import { LangCode, SUPPORTED_LANGUAGES, TRANSLATIONS } from './lib/i18n';
import {
  BookOpen,
  FileCheck2,
  Plane,
  ArrowRight,
  Globe,
  Megaphone,
  Newspaper,
  Sparkles,
  Lock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const SEVEN_PHOTOS = [
  { src: '/hero-1.jpg', alt: 'Dawit Services photo 1' },
  { src: '/hero-2.jpg', alt: 'Dawit Services photo 2' },
  { src: '/hero-3.jpg', alt: 'Dawit Services photo 3' },
  { src: '/hero-4.jpg', alt: 'Dawit Services photo 4' },
  { src: '/hero-5.jpg', alt: 'Dawit Services photo 5' },
  { src: '/hero-6.jpg', alt: 'Dawit Services photo 6' },
  { src: '/hero-7.jpg', alt: 'Dawit Services photo 7' },
];

const PHOTO_GROUPS = [
  [SEVEN_PHOTOS[0], SEVEN_PHOTOS[1], SEVEN_PHOTOS[2]],
  [SEVEN_PHOTOS[3], SEVEN_PHOTOS[4], SEVEN_PHOTOS[5]],
  [SEVEN_PHOTOS[6], SEVEN_PHOTOS[0], SEVEN_PHOTOS[1]],
];

interface HubPostPreview {
  id: string;
  post_type: string | null;
  is_breaking: boolean | null;
  source_name?: string | null;
  media_url?: string | null;
  media_type?: string | null;
  created_at: string;
  hub_post_translations?: { lang_code: string; title: string; summary?: string | null }[];
}

function getHomePostMedia(post: HubPostPreview): { url: string | null; isVideo: boolean } {
  let url = post.media_url?.trim() || null;
  if (!url && post.source_name && post.source_name.includes(' | Media: ')) {
    url = post.source_name.split(' | Media: ')[1]?.trim() || null;
  }
  if (!url) return { url: null, isVideo: false };

  const lower = url.toLowerCase();
  const isVideo =
    post.media_type === 'video' ||
    lower.endsWith('.mp4') ||
    lower.endsWith('.webm') ||
    lower.endsWith('.mov') ||
    lower.endsWith('.ogg');

  return { url, isVideo };
}

interface CustomFormField {
  id: string;
  label_am: string;
  label_en: string;
  type: 'text' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
}

interface CustomFormItem {
  id: string;
  title_am: string;
  title_en: string;
  description_am: string | null;
  description_en: string | null;
  audience_tag: string | null;
  fields: CustomFormField[];
  is_published: boolean;
  deadline_at: string | null;
}

export default function HomePage() {
  const [lang, setLang] = useState<LangCode>('am');
  const [groupIndex, setGroupIndex] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);

  const [posts, setPosts] = useState<HubPostPreview[]>([]);
  const [liveForms, setLiveForms] = useState<CustomFormItem[]>([]);

  // Service request state (no account required, no upfront payment)
  const [serviceChoice, setServiceChoice] = useState<
    'passport_appointment' | 'application_digital' | 'flight_ticket'
  >('passport_appointment');
  const [requesterName, setRequesterName] = useState('');
  const [requesterContact, setRequesterContact] = useState('');
  const [notes, setNotes] = useState('');

  // Passport-specific fields
  const [passportType, setPassportType] = useState<'new' | 'renewal' | 'lost_damaged'>('new');
  const [passportOffice, setPassportOffice] = useState('');
  const [passportTimeframe, setPassportTimeframe] = useState('');

  // Flight / ticket-specific fields
  const [flightOrigin, setFlightOrigin] = useState('');
  const [flightDestination, setFlightDestination] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [flightTripType, setFlightTripType] = useState<'one_way' | 'round_trip'>('round_trip');

  // Application & digital assistance fields
  const [applicationCategory, setApplicationCategory] = useState<
    'university' | 'scholarship' | 'visa_work' | 'digital_system'
  >('university');
  const [applicationTarget, setApplicationTarget] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Admin-published program forms state
  const [formAnswers, setFormAnswers] = useState<Record<string, Record<string, string>>>({});
  const [formContact, setFormContact] = useState<Record<string, { name: string; contact: string }>>(
    {}
  );
  const [formSentId, setFormSentId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];
  const isAm = lang === 'am';

  useEffect(() => {
    const timer = setInterval(() => {
      setGroupIndex((prev) => (prev + 1) % PHOTO_GROUPS.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const loadPublicData = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);

    const [postsRes, formsRes] = await Promise.all([
      supabase
        .from('hub_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(6),
      supabase
        .from('custom_forms')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false }),
    ]);

    if (postsRes.data) {
      const { data: trData } = await supabase
        .from('hub_post_translations')
        .select('post_id, lang_code, title, summary');
      const grouped: Record<string, { lang_code: string; title: string; summary?: string | null }[]> =
        {};
      for (const row of trData || []) {
        const r = row as { post_id: string; lang_code: string; title: string; summary?: string | null };
        if (!grouped[r.post_id]) grouped[r.post_id] = [];
        grouped[r.post_id].push({ lang_code: r.lang_code, title: r.title, summary: r.summary });
      }
      setPosts(
        (postsRes.data as HubPostPreview[]).map((p) => ({
          ...p,
          hub_post_translations: grouped[p.id] || [],
        }))
      );
    }
    if (formsRes.data) setLiveForms(formsRes.data as CustomFormItem[]);
  }, []);

  useEffect(() => {
    loadPublicData();
  }, [loadPublicData]);

  const buildStructuredDetails = () => {
    const parts: string[] = [];
    if (serviceChoice === 'passport_appointment') {
      parts.push(`Passport Type: ${passportType}`);
      if (passportOffice.trim()) parts.push(`Preferred Office/City: ${passportOffice.trim()}`);
      if (passportTimeframe.trim()) parts.push(`Preferred Timeframe: ${passportTimeframe.trim()}`);
    } else if (serviceChoice === 'flight_ticket') {
      parts.push(`Trip Type: ${flightTripType}`);
      if (flightOrigin.trim()) parts.push(`Departure (From): ${flightOrigin.trim()}`);
      if (flightDestination.trim()) parts.push(`Destination (To): ${flightDestination.trim()}`);
      if (flightDate.trim()) parts.push(`Travel Date: ${flightDate.trim()}`);
    } else if (serviceChoice === 'application_digital') {
      parts.push(`Category: ${applicationCategory}`);
      if (applicationTarget.trim()) parts.push(`Target Institution/Program: ${applicationTarget.trim()}`);
    }
    if (notes.trim()) {
      parts.push(`Notes: ${notes.trim()}`);
    }
    return parts.join(' | ');
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmittedNotice(null);
    setErrorNotice(null);

    const combinedDetails = buildStructuredDetails();

    try {
      const { error } = await supabase.from('service_requests').insert({
        user_id: userId,
        service_slug: serviceChoice,
        service_type: serviceChoice,
        full_name: requesterName.trim(),
        contact: requesterContact.trim(),
        details: combinedDetails,
        status: 'pending',
        workflow_stage: 'request',
        deposit_required_etb: 200,
        deposit_paid: false,
      });

      if (error) {
        setErrorNotice(t.errorText);
        return;
      }

      setRequesterName('');
      setRequesterContact('');
      setNotes('');
      setPassportOffice('');
      setPassportTimeframe('');
      setFlightOrigin('');
      setFlightDestination('');
      setFlightDate('');
      setApplicationTarget('');
      setSubmittedNotice(t.authSubmitSuccess);
    } catch {
      setErrorNotice(t.errorText);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCustomFormSubmit = async (e: React.FormEvent, form: CustomFormItem) => {
    e.preventDefault();
    const meta = formContact[form.id] || { name: '', contact: '' };
    const answers = formAnswers[form.id] || {};

    const { error } = await supabase.from('custom_form_submissions').insert({
      form_id: form.id,
      user_id: userId,
      submitter_name: meta.name.trim(),
      submitter_contact: meta.contact.trim(),
      answers,
      status: 'submitted',
    });

    if (!error) {
      setFormSentId(form.id);
      setFormAnswers((prev) => ({ ...prev, [form.id]: {} }));
      setFormContact((prev) => ({ ...prev, [form.id]: { name: '', contact: '' } }));
    }
  };

  const pickPostText = (post: HubPostPreview) => {
    const trs = post.hub_post_translations || [];
    const match =
      trs.find((x) => x.lang_code === lang) ||
      trs.find((x) => x.lang_code === 'am') ||
      trs.find((x) => x.lang_code === 'en');
    return {
      title: match?.title || (isAm ? 'አዲስ መረጃ' : 'Latest Update'),
      summary: match?.summary || '',
    };
  };

  const announcements = posts.filter((p) => p.is_breaking || p.post_type === 'announcement');
  const generalNews = posts.filter((p) => !p.is_breaking && p.post_type !== 'announcement');
  const visiblePhotos = PHOTO_GROUPS[groupIndex];

  const accountPrivileges = isAm
    ? [
        'GPA ማስያ እና የግል የትምህርት መሳሪያዎች በዳሽቦርድ ውስጥ',
        'የተቀመጡ እድሎች እና የማብቂያ ቀን ማሳወቂያዎች',
        'የአገልግሎት ጥያቄዎችዎን ደረጃ በደረጃ መከታተል',
        'በፍላጎትዎ የተመረጡ ምክሮች እና የማህበረሰብ መልዕክቶች',
      ]
    : [
        'GPA calculator and personal student tools inside your dashboard',
        'Saved opportunities and deadline reminder alerts',
        'Step-by-step tracking of your submitted service requests',
        'Interest-based recommendations and community messaging',
      ];

  const publicBenefits = isAm
    ? [
        'ያለ መለያ በቀላሉ የፓስፖርት፣ የማመልከቻ እና የበረራ ድጋፍ ጥያቄ ማቅረብ',
        'ይፋዊ ማስታወቂያዎችን እና ዜናዎችን በነጻ ማንበብ',
        'በአስተዳዳሪ የተከፈቱ የፕሮግራም ምዝገባ ቅጾችን መሙላት',
      ]
    : [
        'Request passport, application, or flight assistance without creating an account',
        'Read public announcements and news openly',
        'Fill out program forms published by the admin when open',
      ];

  return (
    <div className="relative min-h-screen text-white">
      {/* LAYER 1: 3 Photos Displayed Together Without Zoom/Crop, Staying Behind as You Scroll */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 pointer-events-none bg-slate-950 flex flex-col justify-center"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 w-full h-full">
          {visiblePhotos.map((photo, idx) => (
            <div
              key={`${groupIndex}-${photo.src}-${idx}`}
              className="relative w-full h-full border-r border-white/10 last:border-r-0 flex items-center justify-center bg-slate-950"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading={idx === 0 ? 'eager' : 'lazy'}
                className="w-full h-full object-contain opacity-65 transition-opacity duration-700"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-slate-950/55" />
      </div>

      {/* LAYER 2: Text & Transparent Content Directly Over Photos */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <div className="bg-slate-950/60 border-b border-white/15 text-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-10 flex items-center justify-between gap-3">
            <span className="font-semibold text-slate-200 truncate">
              {t.brandName} • {t.navHub}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <Globe className="w-3.5 h-3.5 text-amber-300 mr-1 hidden sm:block" />
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-2.5 py-0.5 text-xs font-bold transition cursor-pointer ${
                    lang === item.code
                      ? 'bg-red-600 text-white'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.native}
                </button>
              ))}
            </div>
          </div>
        </div>

        <header className="sticky top-0 z-30 bg-slate-950/65 backdrop-blur-xs border-b border-white/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <span className="inline-block w-2 h-6 bg-red-600" />
              <span className="text-base sm:text-lg font-black tracking-tight uppercase text-white">
                {t.brandName}
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold text-slate-100">
              <a href="#services" className="hover:text-amber-300 transition">
                {t.navServices}
              </a>
              <a href="#announcements" className="hover:text-amber-300 transition">
                {isAm ? 'ማስታወቂያ እና ዜና' : 'Announcements & News'}
              </a>
              <a href="#account-benefits" className="hover:text-amber-300 transition">
                {isAm ? 'የመለያ ጥቅሞች' : 'Account Features'}
              </a>
              <Link href="/hub" className="hover:text-amber-300 transition">
                {t.navHub}
              </Link>
            </nav>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={userId ? '/dashboard' : '/auth'}
                className="px-3 py-1.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition"
              >
                {userId ? t.navDashboard : t.navAccount}
              </Link>
              <Link
                href="/admin"
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition"
              >
                {t.navAdmin}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-12 space-y-16">
          {/* HERO TEXT WRITTEN DIRECTLY OVER PHOTOS */}
          <section className="pt-4 pb-6 space-y-5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/90 text-white text-xs font-extrabold uppercase tracking-wider">
              <span>{t.brandName}</span>
              <span>•</span>
              <span>{t.navHub}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] text-white drop-shadow">
              {t.brandName}
            </h1>

            <p className="text-base sm:text-lg text-slate-100 leading-relaxed drop-shadow">
              {t.tagline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#request-service"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition"
              >
                <span>{t.ctaRequestService}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <Link
                href="/hub"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-950/60 hover:bg-slate-950/80 border border-white/30 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition"
              >
                <span>{t.ctaExploreHub}</span>
              </Link>

              <div className="inline-flex items-center gap-2 ml-auto sm:ml-2">
                <button
                  type="button"
                  aria-label="Previous photos"
                  onClick={() =>
                    setGroupIndex((prev) => (prev - 1 + PHOTO_GROUPS.length) % PHOTO_GROUPS.length)
                  }
                  className="p-2 bg-slate-950/60 border border-white/25 hover:border-white text-white cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next photos"
                  onClick={() => setGroupIndex((prev) => (prev + 1) % PHOTO_GROUPS.length)}
                  className="p-2 bg-slate-950/60 border border-white/25 hover:border-white text-white cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>

          {/* OPEN SERVICES FOR EVERYONE */}
          <section id="services" className="border-t border-white/20 pt-10 space-y-6">
            <div className="space-y-1">
              <p className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                {isAm ? 'ለሁሉም ክፍት የሆኑ አገልግሎቶች' : 'Open Services for Everyone'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t.navServices}</h2>
              <p className="text-sm text-slate-200 max-w-2xl">
                {isAm
                  ? 'መለያ ሳይኖርዎት በቀላሉ ጥያቄ ማቅረብ ይችላሉ። የ200 ብር ዲፖዚት የሚከፈለው ከስምምነት በኋላ ብቻ ሲሆን ከመጨረሻው ክፍያ ይቀነሳል።'
                  : 'Anyone can submit a request without an account. The 200 ETB deposit applies only after agreement and is deducted from the final fee.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border-t-2 border-amber-300 pt-4 space-y-2">
                <BookOpen className="w-6 h-6 text-amber-300" />
                <h3 className="text-lg font-extrabold text-white">{t.svcPassportTitle}</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{t.svcPassportDesc}</p>
              </div>

              <div className="border-t-2 border-amber-300 pt-4 space-y-2">
                <FileCheck2 className="w-6 h-6 text-amber-300" />
                <h3 className="text-lg font-extrabold text-white">{t.svcApplicationTitle}</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{t.svcApplicationDesc}</p>
              </div>

              <div className="border-t-2 border-amber-300 pt-4 space-y-2">
                <Plane className="w-6 h-6 text-amber-300" />
                <h3 className="text-lg font-extrabold text-white">{t.svcFlightTitle}</h3>
                <p className="text-sm text-slate-200 leading-relaxed">{t.svcFlightDesc}</p>
              </div>
            </div>
          </section>

          {/* ANNOUNCEMENTS, NEWS & ACCOUNT PRIVILEGES */}
          <section id="announcements" className="border-t border-white/20 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 text-xs sm:text-sm font-black uppercase tracking-wider">
                  <Megaphone className="w-4 h-4" />
                  <span>{isAm ? 'ማስታወቂያዎች እና ዜናዎች' : 'Announcements & News'}</span>
                </div>
                <Link href="/hub" className="text-xs font-black underline text-amber-300 hover:text-white">
                  {t.ctaExploreHub}
                </Link>
              </div>

              {announcements.length > 0 && (
                <div className="border-l-4 border-red-600 bg-slate-950/60 p-4 space-y-3">
                  <span className="inline-block bg-red-600 text-white px-2.5 py-0.5 text-xs font-black uppercase tracking-wider">
                    {isAm ? 'ዋና ማስታወቂያ / የዜና ማንቂያ' : 'News Alert / Announcement'}
                  </span>
                  {announcements.slice(0, 2).map((a) => {
                    const text = pickPostText(a);
                    const media = getHomePostMedia(a);
                    return (
                      <div key={a.id} className="space-y-2">
                        <Link
                          href={`/hub?post=${encodeURIComponent(a.id)}`}
                          className="block text-xl sm:text-2xl font-black text-white hover:text-amber-300 underline-offset-4 hover:underline transition"
                        >
                          {text.title}
                        </Link>
                        {text.summary && (
                          <p className="text-sm font-semibold text-slate-100">{text.summary}</p>
                        )}
                        {media.url && (
                          <div className="max-w-md border border-white/20 bg-slate-950/70 p-2">
                            {media.isVideo ? (
                              <video
                                src={media.url}
                                controls
                                playsInline
                                preload="metadata"
                                className="w-full max-h-64 object-contain"
                              />
                            ) : (
                              <img
                                src={media.url}
                                alt={text.title}
                                className="w-full max-h-64 object-contain"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-black uppercase tracking-wider">
                  <Newspaper className="w-4 h-4 text-amber-300" />
                  <span>{isAm ? 'የቅርብ ጊዜ ዜናዎች' : 'Latest News'}</span>
                </div>
                {generalNews.length === 0 ? (
                  <p className="text-sm text-slate-200">
                    {isAm
                      ? 'የቅርብ ጊዜ ዜናዎች እና ማስታወቂያዎች እዚህ እና በዳዊት ሃብ ይታያሉ።'
                      : 'Recent news and announcements appear here and in Dawit Hub.'}
                  </p>
                ) : (
                  <ul className="space-y-3 text-sm text-slate-100">
                    {generalNews.slice(0, 4).map((n) => {
                      const text = pickPostText(n);
                      const media = getHomePostMedia(n);
                      return (
                        <li key={n.id} className="border-b border-white/10 pb-3 space-y-2">
                          <Link
                            href={`/hub?post=${encodeURIComponent(n.id)}`}
                            className="hover:text-amber-300 font-black text-base text-white underline-offset-4 hover:underline block"
                          >
                            {text.title}
                          </Link>
                          {media.url && (
                            <div className="max-w-sm border border-white/20 bg-slate-950/70 p-1.5">
                              {media.isVideo ? (
                                <video
                                  src={media.url}
                                  controls
                                  playsInline
                                  preload="metadata"
                                  className="w-full max-h-52 object-contain"
                                />
                              ) : (
                                <img
                                  src={media.url}
                                  alt={text.title}
                                  className="w-full max-h-52 object-contain"
                                />
                              )}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div
              id="account-benefits"
              className="lg:col-span-5 space-y-6 border-t lg:border-t-0 lg:border-l border-white/20 pt-6 lg:pt-0 lg:pl-8"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  <span>{isAm ? 'ህዝባዊ ጥቅሞች (ያለ መለያ)' : 'Public Benefits'}</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-100">
                  {publicBenefits.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/15">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold uppercase tracking-wider">
                  <Lock className="w-4 h-4" />
                  <span>
                    {isAm
                      ? 'መለያ ሲፈጥሩ የሚያገኟቸው ልዩ መብቶች (GPA እና ሌሎች)'
                      : 'Privileges Inside Your Account (GPA & More)'}
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {isAm
                    ? 'የGPA ማስያ እና የተጨማሪ የተማሪ/አባል መሳሪያዎች በመለያዎ ውስጥ (በዳሽቦርድ) ብቻ ይገኛሉ።'
                    : 'GPA calculation and extra student/member tools are available inside your account dashboard.'}
                </p>
                <ul className="space-y-2 text-sm text-slate-100">
                  {accountPrivileges.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-300 mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-2">
                  <Link
                    href={userId ? '/dashboard' : '/auth'}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase tracking-wider transition"
                  >
                    <span>{userId ? t.navDashboard : t.authRegister}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ADMIN-HOSTED DYNAMIC PROGRAM FORMS WHEN PUBLISHED */}
          {liveForms.length > 0 && (
            <section className="border-t border-white/20 pt-10 space-y-6">
              <h2 className="text-2xl font-black text-white">
                {isAm ? 'ክፍት የፕሮግራም ቅጾች' : 'Open Program Forms'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {liveForms.map((form) => {
                  const title = isAm ? form.title_am : form.title_en || form.title_am;
                  const desc = isAm
                    ? form.description_am || form.description_en
                    : form.description_en || form.description_am;
                  const contactState = formContact[form.id] || { name: '', contact: '' };
                  const answersState = formAnswers[form.id] || {};

                  return (
                    <form
                      key={form.id}
                      onSubmit={(e) => handleCustomFormSubmit(e, form)}
                      className="border-t-2 border-amber-300 pt-4 space-y-3"
                    >
                      <h3 className="text-lg font-extrabold text-white">{title}</h3>
                      {desc && <p className="text-sm text-slate-200">{desc}</p>}

                      {formSentId === form.id && (
                        <p className="text-xs font-bold text-emerald-300">{t.authSubmitSuccess}</p>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder={isAm ? 'ሙሉ ስም *' : 'Full Name *'}
                          value={contactState.name}
                          onChange={(e) =>
                            setFormContact((prev) => ({
                              ...prev,
                              [form.id]: { ...contactState, name: e.target.value },
                            }))
                          }
                          className="bg-slate-950/60 border border-white/25 px-3 py-2 text-sm text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder={isAm ? 'ስልክ ወይም ኢሜይል *' : 'Phone or Email *'}
                          value={contactState.contact}
                          onChange={(e) =>
                            setFormContact((prev) => ({
                              ...prev,
                              [form.id]: { ...contactState, contact: e.target.value },
                            }))
                          }
                          className="bg-slate-950/60 border border-white/25 px-3 py-2 text-sm text-white"
                        />
                      </div>

                      {(form.fields || []).map((field) => {
                        const label = isAm
                          ? field.label_am || field.label_en
                          : field.label_en || field.label_am;
                        return (
                          <div key={field.id} className="space-y-1">
                            <label className="block text-xs font-semibold text-slate-200">
                              {label} {field.required ? '*' : ''}
                            </label>
                            <input
                              type="text"
                              required={field.required}
                              value={answersState[field.id] || ''}
                              onChange={(e) =>
                                setFormAnswers((prev) => ({
                                  ...prev,
                                  [form.id]: { ...answersState, [field.id]: e.target.value },
                                }))
                              }
                              className="w-full bg-slate-950/60 border border-white/25 px-3 py-2 text-sm text-white"
                            />
                          </div>
                        );
                      })}

                      <button
                        type="submit"
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase cursor-pointer"
                      >
                        {isAm ? 'ላክ' : 'Submit'}
                      </button>
                    </form>
                  );
                })}
              </div>
            </section>
          )}

          {/* FULL SERVICE REQUEST SECTION WITH PASSPORT, TICKET DESTINATION & APPLICATION DETAILS */}
          <section
            id="request-service"
            className="border-t border-white/20 pt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
          >
            <div className="lg:col-span-5 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-black text-white">{t.ctaRequestService}</h2>
              <p className="text-sm text-slate-200 leading-relaxed">{t.guestRequestNotice}</p>
              <p className="text-xs text-slate-300 leading-relaxed">{t.depositPolicyNote}</p>
            </div>

            <form onSubmit={handleServiceSubmit} className="lg:col-span-7 space-y-4">
              {submittedNotice && (
                <div className="text-sm text-emerald-300 font-bold space-y-1">
                  <p className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{submittedNotice}</span>
                  </p>
                  {!userId && (
                    <p className="text-xs text-amber-300">
                      <Link href="/auth" className="underline font-bold">
                        {t.authRegister}
                      </Link>
                    </p>
                  )}
                </div>
              )}

              {errorNotice && <p className="text-sm text-red-400 font-bold">{errorNotice}</p>}

              <select
                value={serviceChoice}
                onChange={(e) =>
                  setServiceChoice(
                    e.target.value as
                      | 'passport_appointment'
                      | 'application_digital'
                      | 'flight_ticket'
                  )
                }
                className="w-full bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
              >
                <option value="passport_appointment">{t.svcPassportTitle}</option>
                <option value="flight_ticket">{t.svcFlightTitle}</option>
                <option value="application_digital">{t.svcApplicationTitle}</option>
              </select>

              {/* Passport Appointment Specific Fields */}
              {serviceChoice === 'passport_appointment' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={passportType}
                    onChange={(e) =>
                      setPassportType(e.target.value as 'new' | 'renewal' | 'lost_damaged')
                    }
                    className="bg-slate-950/65 border border-white/25 px-3 py-2.5 text-sm text-white"
                  >
                    <option value="new">
                      {isAm ? 'አዲስ ፓስፖርት' : 'New Passport'}
                    </option>
                    <option value="renewal">
                      {isAm ? 'እድሳት (Renewal)' : 'Renewal'}
                    </option>
                    <option value="lost_damaged">
                      {isAm ? 'የጠፋ / የተበላሸ' : 'Lost / Damaged'}
                    </option>
                  </select>
                  <input
                    type="text"
                    value={passportOffice}
                    onChange={(e) => setPassportOffice(e.target.value)}
                    placeholder={isAm ? 'የሚመረጥ ቅርንጫፍ / ከተማ' : 'Preferred Branch / City'}
                    className="bg-slate-950/65 border border-white/25 px-3 py-2.5 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={passportTimeframe}
                    onChange={(e) => setPassportTimeframe(e.target.value)}
                    placeholder={isAm ? 'የሚፈለግ ጊዜ' : 'Preferred Timeframe'}
                    className="bg-slate-950/65 border border-white/25 px-3 py-2.5 text-sm text-white"
                  />
                </div>
              )}

              {/* Flight / Ticket Specific Fields (Origin, Destination, Date, Trip Type) */}
              {serviceChoice === 'flight_ticket' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={flightOrigin}
                    onChange={(e) => setFlightOrigin(e.target.value)}
                    placeholder={isAm ? 'መነሻ ቦታ (ከየት) *' : 'Departure / Origin *'}
                    className="bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
                  />
                  <input
                    type="text"
                    required
                    value={flightDestination}
                    onChange={(e) => setFlightDestination(e.target.value)}
                    placeholder={isAm ? 'መድረሻ ቦታ (ወዴት) *' : 'Destination *'}
                    className="bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
                  />
                  <input
                    type="date"
                    value={flightDate}
                    onChange={(e) => setFlightDate(e.target.value)}
                    className="bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
                  />
                  <select
                    value={flightTripType}
                    onChange={(e) =>
                      setFlightTripType(e.target.value as 'one_way' | 'round_trip')
                    }
                    className="bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
                  >
                    <option value="round_trip">
                      {isAm ? 'ደርሶ መልስ (Round Trip)' : 'Round Trip'}
                    </option>
                    <option value="one_way">
                      {isAm ? 'አንድ አቅጣጫ (One Way)' : 'One Way'}
                    </option>
                  </select>
                </div>
              )}

              {/* Application & Digital Assistance Specific Fields */}
              {serviceChoice === 'application_digital' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    value={applicationCategory}
                    onChange={(e) =>
                      setApplicationCategory(
                        e.target.value as
                          | 'university'
                          | 'scholarship'
                          | 'visa_work'
                          | 'digital_system'
                      )
                    }
                    className="bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
                  >
                    <option value="university">
                      {isAm ? 'የዩኒቨርሲቲ ማመልከቻ' : 'University Application'}
                    </option>
                    <option value="scholarship">
                      {isAm ? 'ስኮላርሺፕ ማመልከቻ' : 'Scholarship Application'}
                    </option>
                    <option value="visa_work">
                      {isAm ? 'ቪዛ / የስራ ማመልከቻ' : 'Visa / Job Application'}
                    </option>
                    <option value="digital_system">
                      {isAm ? 'ዲጂታል ሲስተም / አካውንት' : 'Digital System / Account'}
                    </option>
                  </select>
                  <input
                    type="text"
                    value={applicationTarget}
                    onChange={(e) => setApplicationTarget(e.target.value)}
                    placeholder={
                      isAm ? 'ዩኒቨርሲቲ / ፕሮግራም / ሀገር' : 'Target University / Program / Country'
                    }
                    className="bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder={isAm ? 'ሙሉ ስምዎ *' : 'Full Name *'}
                  className="bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
                />
                <input
                  type="text"
                  required
                  value={requesterContact}
                  onChange={(e) => setRequesterContact(e.target.value)}
                  placeholder={isAm ? 'ስልክ ወይም ኢሜይል *' : 'Phone or Email *'}
                  className="bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  isAm
                    ? 'ተጨማሪ ማብራሪያ ወይም ጥያቄ ካለዎት ይጻፉ...'
                    : 'Additional notes or details...'
                }
                className="w-full bg-slate-950/65 border border-white/25 px-3.5 py-2.5 text-sm text-white"
              />

              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider transition cursor-pointer"
              >
                {submitting ? t.loadingText : t.ctaRequestService}
              </button>
            </form>
          </section>
        </main>

        <footer className="bg-slate-950/70 border-t border-white/15 py-6 text-xs text-slate-300">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <span className="font-bold text-white">{t.brandName}</span>
            <div className="flex flex-wrap items-center gap-5">
              <Link href="/hub" className="hover:text-white">
                {t.navHub}
              </Link>
              <Link href="/privacy" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/refund" className="hover:text-white">
                Refund Policy
              </Link>
              <Link href="/admin" className="hover:text-white">
                {t.navAdmin}
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}