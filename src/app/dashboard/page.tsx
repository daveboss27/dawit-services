'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { LangCode, SUPPORTED_LANGUAGES, INTEREST_OPTIONS, TRANSLATIONS } from '../lib/i18n';
import {
  Calculator,
  ClipboardCheck,
  Bookmark,
  Briefcase,
  LogOut,
  Plus,
  Trash2,
  ArrowLeft,
} from 'lucide-react';

interface CourseRow {
  id: string;
  name: string;
  credit: number;
  gradePoint: number;
}

interface ServiceItem {
  id: string;
  service_type: string;
  workflow_stage: string | null;
  deposit_paid: boolean | null;
  customer_update: string | null;
  created_at: string;
}

const GRADE_OPTIONS = [
  { label: 'A / A+ (4.00)', value: 4.0 },
  { label: 'A- (3.75)', value: 3.75 },
  { label: 'B+ (3.50)', value: 3.5 },
  { label: 'B (3.00)', value: 3.0 },
  { label: 'B- (2.75)', value: 2.75 },
  { label: 'C+ (2.50)', value: 2.5 },
  { label: 'C (2.00)', value: 2.0 },
  { label: 'D (1.00)', value: 1.0 },
  { label: 'F (0.00)', value: 0.0 },
];

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<LangCode>('am');
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [myRequests, setMyRequests] = useState<ServiceItem[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);

  // Account-only Student Privileges: GPA Calculator & Document Checklist
  const [courses, setCourses] = useState<CourseRow[]>([
    { id: '1', name: 'Course 1', credit: 3, gradePoint: 4.0 },
    { id: '2', name: 'Course 2', credit: 4, gradePoint: 3.75 },
  ]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const t = TRANSLATIONS[lang];
  const isAm = lang === 'am';

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/auth');
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email || '');

      const [reqsRes, savedRes, intsRes] = await Promise.all([
        supabase
          .from('service_requests')
          .select('id, service_type, workflow_stage, deposit_paid, customer_update, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false }),
        supabase.from('saved_opportunities').select('id').eq('user_id', user.id),
        supabase.from('user_interests').select('interest_slug').eq('user_id', user.id),
      ]);

      if (reqsRes.data) setMyRequests(reqsRes.data as ServiceItem[]);
      if (savedRes.data) setSavedCount(savedRes.data.length);
      if (intsRes.data) {
        setInterests(
          (intsRes.data as { interest_slug: string }[]).map((r) => r.interest_slug)
        );
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const toggleInterest = async (slug: string) => {
    if (!userId) return;
    const exists = interests.includes(slug);
    if (exists) {
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', userId)
        .eq('interest_slug', slug);
      setInterests((prev) => prev.filter((x) => x !== slug));
    } else {
      await supabase.from('user_interests').insert({ user_id: userId, interest_slug: slug });
      setInterests((prev) => [...prev, slug]);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  const totalCredits = courses.reduce((acc, c) => acc + (Number(c.credit) || 0), 0);
  const totalPoints = courses.reduce(
    (acc, c) => acc + (Number(c.credit) || 0) * (Number(c.gradePoint) || 0),
    0
  );
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  const checklist = isAm
    ? [
        'የመታወቂያ ወይም የፓስፖርት ቅጂ',
        'የትምህርት ማስረጃ (Transcript)',
        'CV / Motivation Letter',
        'የማመልከቻ ማብቂያ ቀን ተመዝግቧል',
      ]
    : [
        'ID or passport copy ready',
        'Academic transcript ready',
        'CV / motivation letter ready',
        'Application deadline recorded',
      ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col">
      <header className="bg-slate-950 text-white border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
              <span>{t.navHome}</span>
            </Link>
            <div className="h-4 w-px bg-slate-700" />
            <span className="font-black text-sm sm:text-base uppercase">{t.navDashboard}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {SUPPORTED_LANGUAGES.map((item) => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLang(item.code)}
                  className={`px-2 py-1 text-xs font-bold cursor-pointer ${
                    lang === item.code ? 'bg-red-700 text-white' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.native}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAm ? 'ውጣ' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {loading ? (
          <p className="text-sm text-slate-600">{t.loadingText}</p>
        ) : (
          <>
            <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                  {isAm ? 'የመለያ ዳሽቦርድ' : 'Member Dashboard'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">{userEmail}</p>
              </div>
              <Link
                href="/hub"
                className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white text-xs font-extrabold uppercase"
              >
                {t.ctaExploreHub}
              </Link>
            </div>

            {/* Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-slate-200 p-4 flex items-center gap-3">
                <Bookmark className="w-5 h-5 text-red-700" />
                <div>
                  <p className="text-xs font-bold text-slate-500">
                    {isAm ? 'የተቀመጡ እድሎች' : 'Saved Opportunities'}
                  </p>
                  <p className="text-xl font-black text-slate-950">{savedCount}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-4 flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-red-700" />
                <div>
                  <p className="text-xs font-bold text-slate-500">
                    {isAm ? 'የአገልግሎት ጥያቄዎች' : 'My Service Requests'}
                  </p>
                  <p className="text-xl font-black text-slate-950">{myRequests.length}</p>
                </div>
              </div>
              <div className="bg-white border border-slate-200 p-4 flex items-center gap-3">
                <Calculator className="w-5 h-5 text-red-700" />
                <div>
                  <p className="text-xs font-bold text-slate-500">
                    {isAm ? 'የተሰላ GPA' : 'Calculated GPA'}
                  </p>
                  <p className="text-xl font-black text-slate-950">{gpa} / 4.00</p>
                </div>
              </div>
            </div>

            {/* Account-Only Student Privileges: GPA Calculator & Checklist */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <section className="bg-white border border-slate-200 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-red-700" />
                    <span>{isAm ? 'GPA ማስያ (የመለያ ጥቅም)' : 'GPA Calculator (Account Tool)'}</span>
                  </h2>
                  <span className="px-2.5 py-1 bg-slate-950 text-white text-xs font-black">
                    {gpa}
                  </span>
                </div>

                <div className="space-y-2">
                  {courses.map((c) => (
                    <div key={c.id} className="grid grid-cols-12 gap-2 items-center text-xs">
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((row) =>
                              row.id === c.id ? { ...row, name: e.target.value } : row
                            )
                          )
                        }
                        className="col-span-5 border border-slate-300 px-2.5 py-1.5"
                      />
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={c.credit}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((row) =>
                              row.id === c.id ? { ...row, credit: Number(e.target.value) } : row
                            )
                          )
                        }
                        className="col-span-2 border border-slate-300 px-2 py-1.5"
                      />
                      <select
                        value={c.gradePoint}
                        onChange={(e) =>
                          setCourses((prev) =>
                            prev.map((row) =>
                              row.id === c.id
                                ? { ...row, gradePoint: Number(e.target.value) }
                                : row
                            )
                          )
                        }
                        className="col-span-4 border border-slate-300 px-2 py-1.5"
                      >
                        {GRADE_OPTIONS.map((g) => (
                          <option key={g.label} value={g.value}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() =>
                          setCourses((prev) =>
                            prev.length > 1 ? prev.filter((row) => row.id !== c.id) : prev
                          )
                        }
                        className="col-span-1 text-slate-400 hover:text-red-700 flex justify-center cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCourses((prev) => [
                      ...prev,
                      {
                        id: String(Date.now()),
                        name: `Course ${prev.length + 1}`,
                        credit: 3,
                        gradePoint: 4.0,
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 border border-slate-300 text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAm ? 'ኮርስ ጨምር' : 'Add Course'}</span>
                </button>
              </section>

              <section className="bg-white border border-slate-200 p-6 space-y-4">
                <h2 className="text-base font-black text-slate-950 flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-red-700" />
                  <span>
                    {isAm
                      ? 'የማመልከቻ ዝግጅት ዝርዝር (የመለያ ጥቅም)'
                      : 'Readiness Checklist (Account Tool)'}
                  </span>
                </h2>
                <ul className="space-y-2.5 text-sm text-slate-700">
                  {checklist.map((item) => (
                    <li key={item}>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!checkedDocs[item]}
                          onChange={() =>
                            setCheckedDocs((prev) => ({ ...prev, [item]: !prev[item] }))
                          }
                          className="w-4 h-4 accent-red-700"
                        />
                        <span className={checkedDocs[item] ? 'line-through text-slate-400' : ''}>
                          {item}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Interests Selection */}
            <section className="bg-white border border-slate-200 p-6 space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                {isAm ? 'የፍላጎት ርዕሶች' : 'My Interests'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((slug) => {
                  const active = interests.includes(slug);
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => toggleInterest(slug)}
                      className={`px-3 py-1 text-xs font-bold border cursor-pointer ${
                        active
                          ? 'bg-slate-950 text-white border-slate-950'
                          : 'bg-[#FAF9F6] text-slate-700 border-slate-300'
                      }`}
                    >
                      {slug.replace('_', ' ')}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Service Requests Tracking */}
            <section className="bg-white border border-slate-200 p-6 space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
                {isAm ? 'የእኔ የአገልግሎት ጥያቄዎች' : 'My Service Requests'}
              </h2>
              {myRequests.length === 0 ? (
                <p className="text-sm text-slate-500">{t.emptyText}</p>
              ) : (
                <div className="divide-y divide-slate-200 text-sm">
                  {myRequests.map((r) => (
                    <div key={r.id} className="py-3 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-slate-950">{r.service_type}</p>
                        {r.customer_update && (
                          <p className="text-xs text-slate-600">{r.customer_update}</p>
                        )}
                      </div>
                      <span className="text-xs font-bold uppercase text-red-700">
                        {r.workflow_stage || 'request'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}