'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  ArrowLeft,
  Calendar,
  MapPin,
  Building2,
  ShieldCheck,
} from 'lucide-react';

type LangCode = 'am' | 'en' | 'ti' | 'om';

interface HubCategory {
  id: string;
  slug: string;
  name_en: string;
  name_am?: string | null;
  name_ti?: string | null;
  name_om?: string | null;
}

interface HubPostTranslation {
  lang_code: string;
  title: string;
  summary: string | null;
  body: string;
  is_verified_translation?: boolean | null;
}

interface HubPostItem {
  id: string;
  category_id: string | null;
  post_type: string | null;
  status: string | null;
  verification_label: string | null;
  is_breaking: boolean | null;
  source_name: string | null;
  source_url: string | null;
  media_url?: string | null;
  media_type?: string | null;
  publish_at: string | null;
  created_at: string;
  hub_post_translations?: HubPostTranslation[];
}

function getHubPostMedia(post: HubPostItem): { url: string | null; isVideo: boolean } {
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

interface OpportunityTranslation {
  lang_code: string;
  title: string;
  description: string;
}

interface OpportunityItem {
  id: string;
  opportunity_type: string;
  organization: string | null;
  country: string | null;
  location: string | null;
  application_url: string | null;
  deadline_at: string | null;
  is_active: boolean | null;
  created_at: string;
  opportunity_translations?: OpportunityTranslation[];
}

const LANG_LABELS: Record<LangCode, string> = {
  am: 'አማርኛ',
  en: 'English',
  ti: 'ትግርኛ',
  om: 'Afaan Oromo',
};

const UI_COPY: Record<
  LangCode,
  {
    editionLabel: string;
    hubTitle: string;
    hubLead: string;
    home: string;
    account: string;
    dashboard: string;
    admin: string;
    searchPlaceholder: string;
    allTab: string;
    newsTab: string;
    oppsTab: string;
    allCategories: string;
    leadHeadline: string;
    latestDispatches: string;
    openOpportunities: string;
    priorityTag: string;
    readMore: string;
    collapse: string;
    saveOpp: string;
    savedOpp: string;
    apply: string;
    deadline: string;
    emptyState: string;
    loginPrompt: string;
  }
> = {
  am: {
    editionLabel: 'ዳዊት ሃብ • የተረጋገጠ መረጃ እና እድል ማዕከል',
    hubTitle: 'ዳዊት ሃብ',
    hubLead:
      'ለተማሪዎች፣ ለስራ ፈላጊዎች እና ለማህበረሰቡ የተዘጋጁ የተረጋገጡ ዜናዎች፣ የትምህርት እና የስራ እድሎች፣ እንዲሁም ተግባራዊ መረጃዎች።',
    home: 'መነሻ',
    account: 'መለያ ይፍጠሩ / ይግቡ',
    dashboard: 'ዳሽቦርድ',
    admin: 'አስተዳዳሪ',
    searchPlaceholder: 'በርዕስ፣ በድርጅት፣ በከተማ ወይም በፍላጎት ይፈልጉ...',
    allTab: 'ሁሉንም ይመልከቱ',
    newsTab: 'ዜና እና ልጥፎች',
    oppsTab: 'የስራ እና ትምህርት እድሎች',
    allCategories: 'ሁሉም ምድቦች',
    leadHeadline: 'ዋና መረጃ',
    latestDispatches: 'የቅርብ ጊዜ ዜናዎች እና ልጥፎች',
    openOpportunities: 'ክፍት እድሎች',
    priorityTag: 'ቅድሚያ',
    readMore: 'ሙሉ ጽሁፍ ያንብቡ',
    collapse: 'ያሳንሱ',
    saveOpp: 'ያስቀምጡ',
    savedOpp: 'ተቀምጧል',
    apply: 'ያመልክቱ',
    deadline: 'የማብቂያ ቀን',
    emptyState: 'በአሁኑ ፍለጋ ወይም ምድብ ምንም መረጃ አልተገኘም።',
    loginPrompt: 'እድሎችን ወደ ዳሽቦርድዎ ለማስቀመጥ በመለያዎ ይግቡ።',
  },
  en: {
    editionLabel: 'DAWIT HUB • VERIFIED BRIEFINGS & OPPORTUNITIES',
    hubTitle: 'DAWIT HUB',
    hubLead:
      'Structured dispatches, academic and career opportunities, and verified guidance presented with editorial clarity.',
    home: 'Home',
    account: 'Account',
    dashboard: 'Dashboard',
    admin: 'Admin',
    searchPlaceholder: 'Search headlines, organizations, cities, or programs...',
    allTab: 'All Coverage',
    newsTab: 'News & Posts',
    oppsTab: 'Opportunities',
    allCategories: 'All Sections',
    leadHeadline: 'Lead Dispatch',
    latestDispatches: 'Latest Stories & Updates',
    openOpportunities: 'Active Opportunities',
    priorityTag: 'Priority',
    readMore: 'Read full story',
    collapse: 'Show less',
    saveOpp: 'Save',
    savedOpp: 'Saved',
    apply: 'Apply',
    deadline: 'Deadline',
    emptyState: 'No matching stories or opportunities found.',
    loginPrompt: 'Sign in to save opportunities to your personal dashboard.',
  },
  ti: {
    editionLabel: 'ዳዊት ሃብ • ዝተረጋገጸ ሓበሬታን ዕድላትን',
    hubTitle: 'ዳዊት ሃብ',
    hubLead:
      'ንተምሃሮ፣ ንደለይቲ ስራሕን ንማሕበረሰብን ዝቀረቡ ዝተረጋገጹ ዜናታት፣ ዕድላት ትምህርትን ስራሕን።',
    home: 'መበገሲ',
    account: 'ሕሳብ',
    dashboard: 'ዳሽቦርድ',
    admin: 'ኣመሓዳሪ',
    searchPlaceholder: 'ብርእሲ፣ ትካል ወይም ከተማ ድለይ...',
    allTab: 'ኩሉ',
    newsTab: 'ዜናን ልጥፍታትን',
    oppsTab: 'ዕድላት',
    allCategories: 'ኩሉ ምድባት',
    leadHeadline: 'ቀንዲ ሓበሬታ',
    latestDispatches: 'ሓደሽቲ ዜናታትን ልጥፍታትን',
    openOpportunities: 'ክፉት ዕድላት',
    priorityTag: 'ቀዳምነት',
    readMore: 'ምሉእ ኣንብብ',
    collapse: 'ውሕድ ኣርኢ',
    saveOpp: 'ዓቅብ',
    savedOpp: 'ተዓቂቡ',
    apply: 'ኣመልክት',
    deadline: 'ናይ መወዳእታ ዕለት',
    emptyState: 'ዝኾነ ዝሰማማዕ ሓበሬታ ኣይተረኽበን።',
    loginPrompt: 'ዕድላት ንምዕቃብ ብሕሳብካ ይእተው።',
  },
  om: {
    editionLabel: 'DAWIT HUB • ODEEFFANNOO MIRKANAA’E FI CARRAAWWAN',
    hubTitle: 'DAWIT HUB',
    hubLead:
      'Oduu mirkanaa’e, carraa barnootaa fi hojii, akkasumas odeeffannoo qulqullina qabuun dhiyaate.',
    home: 'Fuula Jalqabaa',
    account: 'Herrega',
    dashboard: 'Daashboordii',
    admin: 'Bulchaa',
    searchPlaceholder: 'Mata duree, dhaabbata ykn magaalaa barbaadi...',
    allTab: 'Hunda',
    newsTab: 'Oduu fi Maxxansa',
    oppsTab: 'Carraawwan',
    allCategories: 'Gosa Hunda',
    leadHeadline: 'Odeeffannoo Ijoo',
    latestDispatches: 'Oduu fi Maxxansa Haaraa',
    openOpportunities: 'Carraawwan Banaa',
    priorityTag: 'Dursa',
    readMore: 'Guutummaa dubbisi',
    collapse: 'Gabaabsi',
    saveOpp: 'Olkaa’i',
    savedOpp: 'Olkaa’ameera',
    apply: 'Iyyadhu',
    deadline: 'Guyyaa xumuraa',
    emptyState: 'Wanti walsimu hin argamne.',
    loginPrompt: 'Carraawwan olkaa’achuuf herrega keetiin seeni.',
  },
};

function pickTranslation<T extends { lang_code: string }>(
  items: T[] | undefined,
  lang: LangCode
): T | undefined {
  if (!items || items.length === 0) return undefined;
  return (
    items.find((t) => t.lang_code === lang) ||
    items.find((t) => t.lang_code === 'am') ||
    items.find((t) => t.lang_code === 'en') ||
    items[0]
  );
}

export default function HubPage() {
  const [lang, setLang] = useState<LangCode>('am');
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'opps'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedPosts, setExpandedPosts] = useState<Record<string, boolean>>({});

  const [userId, setUserId] = useState<string | null>(null);
  const [savedOppIds, setSavedOppIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<HubCategory[]>([]);
  const [posts, setPosts] = useState<HubPostItem[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [notice, setNotice] = useState<string | null>(null);

  const t = UI_COPY[lang];

  const loadHubData = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const [catsRes, postsRes, oppsRes, savedRes] = await Promise.all([
        supabase
          .from('hub_categories')
          .select('id, slug, name_en, name_am, name_ti, name_om')
          .order('sort_order'),
        supabase
          .from('hub_posts')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false }),
        supabase
          .from('opportunities')
          .select(
            'id, opportunity_type, organization, country, location, application_url, deadline_at, is_active, created_at, opportunity_translations(lang_code, title, description)'
          )
          .eq('is_active', true)
          .order('created_at', { ascending: false }),
        user
          ? supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', user.id)
          : Promise.resolve({ data: [], error: null }),
      ]);

      if (!catsRes.error && catsRes.data) {
        setCategories(catsRes.data as HubCategory[]);
      }
      if (!postsRes.error && postsRes.data) {
        const { data: trData } = await supabase
          .from('hub_post_translations')
          .select('post_id, lang_code, title, summary, body, is_verified_translation');
        const grouped: Record<string, HubPostTranslation[]> = {};
        for (const row of trData || []) {
          const r = row as HubPostTranslation & { post_id: string };
          if (!grouped[r.post_id]) grouped[r.post_id] = [];
          grouped[r.post_id].push({
            lang_code: r.lang_code,
            title: r.title,
            summary: r.summary,
            body: r.body,
            is_verified_translation: r.is_verified_translation,
          });
        }
        setPosts(
          (postsRes.data as HubPostItem[]).map((p) => ({
            ...p,
            hub_post_translations: grouped[p.id] || [],
          }))
        );
      }
      if (!oppsRes.error && oppsRes.data) {
        setOpportunities(oppsRes.data as OpportunityItem[]);
      }
      if (user && !savedRes.error && savedRes.data) {
        setSavedOppIds((savedRes.data as { opportunity_id: string }[]).map((r) => r.opportunity_id));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHubData();
  }, [loadHubData]);

  const toggleSaveOpportunity = async (oppId: string) => {
    setNotice(null);
    if (!userId) {
      setNotice(t.loginPrompt);
      return;
    }

    const exists = savedOppIds.includes(oppId);
    if (exists) {
      const { error } = await supabase
        .from('saved_opportunities')
        .delete()
        .eq('user_id', userId)
        .eq('opportunity_id', oppId);
      if (!error) {
        setSavedOppIds((prev) => prev.filter((id) => id !== oppId));
      }
    } else {
      const { error } = await supabase.from('saved_opportunities').insert({
        user_id: userId,
        opportunity_id: oppId,
      });
      if (!error) {
        setSavedOppIds((prev) => [...prev, oppId]);
      }
    }
  };

  const getCategoryName = (cat: HubCategory) => {
    if (lang === 'am' && cat.name_am) return cat.name_am;
    if (lang === 'ti' && cat.name_ti) return cat.name_ti;
    if (lang === 'om' && cat.name_om) return cat.name_om;
    return cat.name_en;
  };

  const q = searchQuery.trim().toLowerCase();

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory !== 'all' && post.category_id !== selectedCategory) return false;
    if (!q) return true;
    const tr = pickTranslation(post.hub_post_translations, lang);
    const text = [tr?.title, tr?.summary, tr?.body, post.source_name, post.verification_label]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return text.includes(q);
  });

  const filteredOpps = opportunities.filter((opp) => {
    if (!q) return true;
    const tr = pickTranslation(opp.opportunity_translations, lang);
    const text = [
      tr?.title,
      tr?.description,
      opp.organization,
      opp.country,
      opp.location,
      opp.opportunity_type,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return text.includes(q);
  });

  const showNews = activeTab === 'all' || activeTab === 'news';
  const showOpps = activeTab === 'all' || activeTab === 'opps';
  const leadPost = filteredPosts[0];
  const secondaryPosts = filteredPosts.slice(1);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900">
      {/* Top Broadcast Strip */}
      <div className="bg-slate-950 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-9 flex items-center justify-between gap-4">
          <span className="font-semibold tracking-wide text-slate-200 truncate">
            {t.editionLabel}
          </span>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-amber-300 font-semibold">
              {posts.length} • {opportunities.length}
            </span>
          </div>
        </div>
      </div>

      {/* Institutional Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.home}</span>
            </Link>
            <div className="h-5 w-px bg-slate-300" />
            <div className="flex items-center gap-2.5">
              <span className="inline-block w-2 h-6 bg-red-700" />
              <span className="text-lg sm:text-xl font-black tracking-tight text-slate-950">
                {t.hubTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center border border-slate-300 bg-[#FAF9F6] p-0.5">
              {(Object.keys(LANG_LABELS) as LangCode[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                    lang === code
                      ? 'bg-slate-950 text-white'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {LANG_LABELS[code]}
                </button>
              ))}
            </div>

            <Link
              href={userId ? '/dashboard' : '/auth'}
              className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition"
            >
              {userId ? t.dashboard : t.account}
            </Link>

            <Link
              href="/admin"
              className="hidden md:inline-flex px-3 py-1.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold transition"
            >
              {t.admin}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Masthead & Search Controls */}
        <section className="border-b-2 border-slate-950 pb-6 space-y-5">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-[1.12]">
              {t.hubTitle}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{t.hubLead}</p>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="inline-flex border border-slate-300 bg-white p-1 w-fit">
              {[
                { id: 'all', label: t.allTab },
                { id: 'news', label: t.newsTab },
                { id: 'opps', label: t.oppsTab },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as 'all' | 'news' | 'opps')}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-slate-950 text-white'
                      : 'text-slate-700 hover:text-slate-950'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full lg:w-96">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full border border-slate-300 bg-white pl-10 pr-4 py-2 text-sm text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-slate-950"
              />
            </div>
          </div>

          {categories.length > 0 && showNews && (
            <div className="flex items-center gap-2 overflow-x-auto pt-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 text-xs font-bold uppercase tracking-wide border transition cursor-pointer whitespace-nowrap ${
                  selectedCategory === 'all'
                    ? 'border-red-700 bg-red-700 text-white'
                    : 'border-slate-300 bg-white text-slate-700 hover:border-slate-950'
                }`}
              >
                {t.allCategories}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-xs font-bold border transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'border-red-700 bg-red-700 text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:border-slate-950'
                  }`}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>
          )}
        </section>

        {notice && (
          <div className="border-l-4 border-amber-600 bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-950 flex items-center justify-between gap-4">
            <span>{notice}</span>
            {!userId && (
              <Link href="/auth" className="font-bold underline text-red-800 shrink-0">
                {t.account}
              </Link>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 h-64 bg-white border border-slate-200 animate-pulse" />
            <div className="lg:col-span-5 h-64 bg-white border border-slate-200 animate-pulse" />
          </div>
        ) : (showNews && filteredPosts.length === 0) &&
          (showOpps && filteredOpps.length === 0) ? (
          <div className="bg-white border border-slate-200 p-12 text-center text-sm text-slate-600">
            {t.emptyState}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Editorial Stories Column */}
            {showNews && (
              <div
                className={`${
                  showOpps ? 'lg:col-span-7' : 'lg:col-span-12'
                } space-y-6`}
              >
                {leadPost && (() => {
                  const tr = pickTranslation(leadPost.hub_post_translations, lang);
                  const media = getHubPostMedia(leadPost);
                  const expanded = !!expandedPosts[leadPost.id];
                  const body = tr?.body || '';
                  const shortBody = body.length > 340 ? `${body.slice(0, 340).trim()}...` : body;

                  return (
                    <article className="bg-white border border-slate-200 border-t-4 border-t-red-700 p-6 sm:p-8 space-y-4 shadow-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <span className="text-red-700">{t.leadHeadline}</span>
                          {leadPost.is_breaking && (
                            <span className="bg-red-700 text-white px-2 py-0.5">
                              {t.priorityTag}
                            </span>
                          )}
                          {leadPost.verification_label && (
                            <span className="inline-flex items-center gap-1 text-emerald-800 normal-case font-semibold">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              {leadPost.verification_label}
                            </span>
                          )}
                        </div>
                        <span className="text-slate-500 font-medium normal-case">
                          {new Date(leadPost.publish_at || leadPost.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <h2 className="text-2xl sm:text-3xl font-black text-slate-950 leading-tight">
                        {tr?.title || 'Untitled Dispatch'}
                      </h2>

                      {tr?.summary && (
                        <p className="text-base font-semibold text-slate-800 leading-relaxed">
                          {tr.summary}
                        </p>
                      )}

                      {media.url && (
                        <div className="border border-slate-200 bg-slate-950 p-2">
                          {media.isVideo ? (
                            <video
                              src={media.url}
                              controls
                              playsInline
                              preload="metadata"
                              className="w-full max-h-96 object-contain"
                            />
                          ) : (
                            <img
                              src={media.url}
                              alt={tr?.title || 'Post media'}
                              className="w-full max-h-96 object-contain"
                            />
                          )}
                        </div>
                      )}

                      {body && (
                        <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                          {expanded ? body : shortBody}
                        </p>
                      )}

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                        {body.length > 340 ? (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedPosts((prev) => ({
                                ...prev,
                                [leadPost.id]: !prev[leadPost.id],
                              }))
                            }
                            className="text-red-700 hover:text-red-900 cursor-pointer"
                          >
                            {expanded ? t.collapse : t.readMore}
                          </button>
                        ) : (
                          <span className="text-slate-500">{leadPost.source_name || ''}</span>
                        )}

                        {leadPost.source_url && (
                          <a
                            href={leadPost.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-800 hover:text-red-700"
                          >
                            <span>{leadPost.source_name || 'Source'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </article>
                  );
                })()}

                {secondaryPosts.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-200 pb-2">
                      {t.latestDispatches}
                    </h3>

                    <div className="divide-y divide-slate-200 bg-white border border-slate-200">
                      {secondaryPosts.map((post) => {
                        const tr = pickTranslation(post.hub_post_translations, lang);
                        const media = getHubPostMedia(post);
                        const expanded = !!expandedPosts[post.id];
                        const body = tr?.body || '';
                        const shortBody =
                          body.length > 220 ? `${body.slice(0, 220).trim()}...` : body;

                        return (
                          <article key={post.id} className="p-5 sm:p-6 space-y-2.5">
                            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                              <span className="font-bold uppercase tracking-wider text-slate-800">
                                {post.post_type || 'Dispatch'}
                              </span>
                              <span>
                                {new Date(
                                  post.publish_at || post.created_at
                                ).toLocaleDateString()}
                              </span>
                            </div>

                            <h4 className="text-lg sm:text-xl font-extrabold text-slate-950 leading-snug">
                              {tr?.title || 'Untitled Post'}
                            </h4>

                            {tr?.summary && (
                              <p className="text-sm font-medium text-slate-700">{tr.summary}</p>
                            )}

                            {media.url && (
                              <div className="border border-slate-200 bg-slate-950 p-2">
                                {media.isVideo ? (
                                  <video
                                    src={media.url}
                                    controls
                                    playsInline
                                    preload="metadata"
                                    className="w-full max-h-80 object-contain"
                                  />
                                ) : (
                                  <img
                                    src={media.url}
                                    alt={tr?.title || 'Post media'}
                                    className="w-full max-h-80 object-contain"
                                  />
                                )}
                              </div>
                            )}

                            {body && (
                              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                {expanded ? body : shortBody}
                              </p>
                            )}

                            <div className="pt-1 flex items-center justify-between text-xs font-bold">
                              {body.length > 220 ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedPosts((prev) => ({
                                      ...prev,
                                      [post.id]: !prev[post.id],
                                    }))
                                  }
                                  className="text-red-700 hover:text-red-900 cursor-pointer"
                                >
                                  {expanded ? t.collapse : t.readMore}
                                </button>
                              ) : (
                                <span />
                              )}

                              {post.source_url && (
                                <a
                                  href={post.source_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-slate-700 hover:text-red-700"
                                >
                                  <span>{post.source_name || 'Source'}</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Opportunities Index Column */}
            {showOpps && (
              <aside
                className={`${
                  showNews ? 'lg:col-span-5' : 'lg:col-span-12'
                } space-y-4`}
              >
                <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-950">
                    {t.openOpportunities}
                  </h3>
                  <span className="text-xs font-bold text-slate-600">
                    {filteredOpps.length}
                  </span>
                </div>

                {filteredOpps.length === 0 ? (
                  <div className="bg-white border border-slate-200 p-6 text-sm text-slate-500">
                    {t.emptyState}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredOpps.map((opp) => {
                      const tr = pickTranslation(opp.opportunity_translations, lang);
                      const isSaved = savedOppIds.includes(opp.id);
                      const place = [opp.location, opp.country].filter(Boolean).join(', ');

                      return (
                        <div
                          key={opp.id}
                          className="bg-white border border-slate-200 p-5 space-y-3 shadow-2xs"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <span className="bg-slate-950 text-white px-2.5 py-0.5 font-bold uppercase tracking-wide">
                              {opp.opportunity_type}
                            </span>
                            {opp.deadline_at && (
                              <span className="inline-flex items-center gap-1 text-red-700 font-semibold">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>
                                  {t.deadline}:{' '}
                                  {new Date(opp.deadline_at).toLocaleDateString()}
                                </span>
                              </span>
                            )}
                          </div>

                          <h4 className="text-base sm:text-lg font-extrabold text-slate-950 leading-snug">
                            {tr?.title || opp.opportunity_type}
                          </h4>

                          {(opp.organization || place) && (
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                              {opp.organization && (
                                <span className="inline-flex items-center gap-1">
                                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{opp.organization}</span>
                                </span>
                              )}
                              {place && (
                                <span className="inline-flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                  <span>{place}</span>
                                </span>
                              )}
                            </div>
                          )}

                          {tr?.description && (
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                              {tr.description}
                            </p>
                          )}

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <button
                              type="button"
                              onClick={() => toggleSaveOpportunity(opp.id)}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold border transition cursor-pointer ${
                                isSaved
                                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                                  : 'border-slate-300 bg-white text-slate-800 hover:border-slate-950'
                              }`}
                            >
                              {isSaved ? (
                                <>
                                  <BookmarkCheck className="w-3.5 h-3.5" />
                                  <span>{t.savedOpp}</span>
                                </>
                              ) : (
                                <>
                                  <Bookmark className="w-3.5 h-3.5" />
                                  <span>{t.saveOpp}</span>
                                </>
                              )}
                            </button>

                            {opp.application_url && (
                              <a
                                href={opp.application_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold transition"
                              >
                                <span>{t.apply}</span>
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </aside>
            )}
          </div>
        )}
      </main>
    </div>
  );
}